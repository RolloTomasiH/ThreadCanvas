import React from 'react';

/**
 * Calculates the 4 cardinal anchor points for a rectangular node
 */
function getNodeAnchors(node) {
  const x = node.x;
  const y = node.y;
  const w = node.width || 420;
  const h = node.collapsed ? 42 : (node.height || 240);

  return [
    { side: 'top',    x: x + w / 2, y: y,         nx: 0,  ny: -1 },
    { side: 'bottom', x: x + w / 2, y: y + h,     nx: 0,  ny: 1 },
    { side: 'left',   x: x,         y: y + h / 2, nx: -1, ny: 0 },
    { side: 'right',  x: x + w,     y: y + h / 2, nx: 1,  ny: 0 },
  ];
}

/**
 * Dynamically computes the optimal pair of connection anchors
 * that minimizes line length while preserving outward/inward normal tangents.
 */
function computeOptimalEdge(fromNode, toNode) {
  const fromAnchors = getNodeAnchors(fromNode);
  const toAnchors = getNodeAnchors(toNode);

  let bestScore = Infinity;
  let bestPair = [fromAnchors[3], toAnchors[2]]; // default right -> left

  for (const a of fromAnchors) {
    for (const b of toAnchors) {
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 1e-4) continue;

      // Project direction vector onto normal vectors
      const dotA = (dx * a.nx + dy * a.ny) / dist;
      const dotB = (-dx * b.nx - dy * b.ny) / dist;

      let score = dist;
      // Penalize lines that exit or enter backward into the card body
      if (dotA < 0) {
        score += 15000 + Math.abs(dotA) * 5000;
      }
      if (dotB < 0) {
        score += 15000 + Math.abs(dotB) * 5000;
      }
      // Reward smooth alignment
      if (dotA > 0 && dotB > 0) {
        score -= (dotA + dotB) * 35;
      }

      if (score < bestScore) {
        bestScore = score;
        bestPair = [a, b];
      }
    }
  }

  const [a, b] = bestPair;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dist = Math.hypot(dx, dy);

  // Dynamic tension for bezier handles
  const k = Math.max(Math.min(dist * 0.4, 160), 30);
  const cx1 = a.x + a.nx * k;
  const cy1 = a.y + a.ny * k;
  const cx2 = b.x + b.nx * k;
  const cy2 = b.y + b.ny * k;

  // Exact parametric midpoint on cubic Bezier at t=0.5
  const midX = 0.125 * a.x + 0.375 * cx1 + 0.375 * cx2 + 0.125 * b.x;
  const midY = 0.125 * a.y + 0.375 * cy1 + 0.375 * cy2 + 0.125 * b.y;

  return {
    pathData: `M ${a.x} ${a.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${b.x} ${b.y}`,
    midX,
    midY,
    fromAnchor: a,
    toAnchor: b
  };
}

/**
 * Computes optimal dynamic start anchor on fromNode when actively dragging a line
 */
function computeActiveConnection(fromNode, targetX, targetY) {
  const anchors = getNodeAnchors(fromNode);
  let bestScore = Infinity;
  let bestAnchor = anchors[3]; // default right

  for (const a of anchors) {
    const dx = targetX - a.x;
    const dy = targetY - a.y;
    const dist = Math.hypot(dx, dy);
    if (dist < 1e-4) continue;

    const dot = (dx * a.nx + dy * a.ny) / dist;
    let score = dist;
    if (dot < 0) {
      score += 10000 + Math.abs(dot) * 3000;
    } else {
      score -= dot * 25;
    }

    if (score < bestScore) {
      bestScore = score;
      bestAnchor = a;
    }
  }

  const dx = targetX - bestAnchor.x;
  const dy = targetY - bestAnchor.y;
  const dist = Math.hypot(dx, dy);
  const k = Math.max(Math.min(dist * 0.4, 140), 25);
  const cx1 = bestAnchor.x + bestAnchor.nx * k;
  const cy1 = bestAnchor.y + bestAnchor.ny * k;
  const cx2 = targetX - bestAnchor.nx * (k * 0.4);
  const cy2 = targetY - bestAnchor.ny * (k * 0.4);

  return `M ${bestAnchor.x} ${bestAnchor.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${targetX} ${targetY}`;
}

export default function SvgEdges({ nodes, edges, activeConnection, selectedEdgeId, onSelectEdge }) {
  const nodeMap = new Map(nodes.map(n => [n.id, n]));

  return (
    <svg 
      className="absolute inset-0 pointer-events-none overflow-visible w-full h-full"
      style={{ zIndex: 1 }}
    >
      <defs>
        {/* Standard Arrow Marker */}
        <marker
          id="canvas-arrow"
          viewBox="0 0 10 10"
          refX="7"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto-start-reverse"
        >
          <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#A1A1AA" />
        </marker>

        {/* Highlighted Arrow Marker */}
        <marker
          id="canvas-arrow-active"
          viewBox="0 0 10 10"
          refX="7"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto-start-reverse"
        >
          <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#18181B" />
        </marker>

        {/* Quote Marker */}
        <marker
          id="canvas-arrow-quote"
          viewBox="0 0 10 10"
          refX="7"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto-start-reverse"
        >
          <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#71717A" />
        </marker>
      </defs>

      {/* Render Existing Edges with Dynamic Shortest-Path & Natural Tangents */}
      {edges.map(edge => {
        const fromNode = nodeMap.get(edge.fromId);
        const toNode = nodeMap.get(edge.toId);
        if (!fromNode || !toNode) return null;

        const { pathData, midX, midY } = computeOptimalEdge(fromNode, toNode);

        const isSelected = selectedEdgeId === edge.id;
        const isQuote = !!edge.quote;
        const strokeColor = isSelected ? '#18181B' : (isQuote ? '#71717A' : '#D4D4D8');
        const marker = isSelected ? 'url(#canvas-arrow-active)' : (isQuote ? 'url(#canvas-arrow-quote)' : 'url(#canvas-arrow)');

        return (
          <g key={edge.id} className="pointer-events-auto group cursor-pointer">
            {/* Fat transparent hit-test line for easy clicking */}
            <path
              d={pathData}
              stroke="transparent"
              strokeWidth="14"
              fill="none"
              onClick={(e) => {
                e.stopPropagation();
                if (onSelectEdge) onSelectEdge(edge.id);
              }}
            />
            {/* Real aesthetic hairline Bezier curve */}
            <path
              d={pathData}
              stroke={strokeColor}
              strokeWidth={isSelected ? "2" : (isQuote ? "1.5" : "1.5")}
              strokeDasharray={isQuote ? "3,3" : "none"}
              fill="none"
              markerEnd={marker}
              className="transition-colors duration-150 group-hover:stroke-neutral-800"
            />

            {/* Discreet Quote Pill positioned at parametric midpoint */}
            {edge.quote && (
              <g 
                transform={`translate(${midX}, ${midY})`}
                className="pointer-events-none select-none"
              >
                <rect
                  x="-42"
                  y="-9"
                  width="84"
                  height="18"
                  rx="4"
                  fill="#F4F4F5"
                  stroke="#E4E4E7"
                  strokeWidth="1"
                />
                <text
                  x="0"
                  y="3.5"
                  textAnchor="middle"
                  fill="#71717A"
                  fontSize="9.5"
                  fontWeight="500"
                  fontFamily="-apple-system, BlinkMacSystemFont, sans-serif"
                >
                  要点追问
                </text>
              </g>
            )}
          </g>
        );
      })}

      {/* Render Active Connection Line with Dynamic Nearest Anchor */}
      {activeConnection && (
        (() => {
          const fromNode = nodeMap.get(activeConnection.fromId);
          const activePath = fromNode 
            ? computeActiveConnection(fromNode, activeConnection.x2, activeConnection.y2)
            : `M ${activeConnection.x1} ${activeConnection.y1} L ${activeConnection.x2} ${activeConnection.y2}`;

          return (
            <path
              d={activePath}
              stroke="#18181B"
              strokeWidth="1.5"
              strokeDasharray="4,3"
              fill="none"
              markerEnd="url(#canvas-arrow-active)"
            />
          );
        })()
      )}
    </svg>
  );
}
