import React, { useRef } from 'react';

export default function Minimap({ nodes, viewport, canvasSize, onPanTo }) {
  const mapRef = useRef(null);

  if (!nodes || nodes.length === 0) return null;

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  nodes.forEach(node => {
    const width = node.width || 420;
    const height = node.height || 260;
    minX = Math.min(minX, node.x);
    minY = Math.min(minY, node.y);
    maxX = Math.max(maxX, node.x + width);
    maxY = Math.max(maxY, node.y + height);
  });

  const padding = 280;
  minX -= padding;
  minY -= padding;
  maxX += padding;
  maxY += padding;

  const totalWidth = Math.max(maxX - minX, 1000);
  const totalHeight = Math.max(maxY - minY, 800);

  const mapWidth = 160;
  const mapHeight = 110;
  const scaleX = mapWidth / totalWidth;
  const scaleY = mapHeight / totalHeight;
  const scale = Math.min(scaleX, scaleY);

  const vpWidth = (canvasSize.width || window.innerWidth) / viewport.zoom;
  const vpHeight = (canvasSize.height || window.innerHeight) / viewport.zoom;
  const vpX = -viewport.x / viewport.zoom;
  const vpY = -viewport.y / viewport.zoom;

  const handleClick = (e) => {
    if (!mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const targetWorldX = minX + clickX / scale;
    const targetWorldY = minY + clickY / scale;

    const newVpX = -targetWorldX * viewport.zoom + (canvasSize.width || window.innerWidth) / 2;
    const newVpY = -targetWorldY * viewport.zoom + (canvasSize.height || window.innerHeight) / 2;

    onPanTo(newVpX, newVpY);
  };

  return (
    <div
      ref={mapRef}
      onClick={handleClick}
      style={{ width: mapWidth, height: mapHeight }}
      className="absolute bottom-4 right-4 z-40 bg-white/80 backdrop-blur-md rounded-lg border border-black/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden cursor-pointer select-none transition-all hover:bg-white"
      title="小地图"
    >
      <svg width={mapWidth} height={mapHeight} className="w-full h-full">
        {nodes.map(node => {
          const nx = (node.x - minX) * scale;
          const ny = (node.y - minY) * scale;
          const nw = Math.max((node.width || 420) * scale, 3);
          const nh = Math.max((node.height || 260) * scale, 2);
          const color = node.type === 'question' ? '#71717A' : '#18181B';

          return (
            <rect
              key={node.id}
              x={nx}
              y={ny}
              width={nw}
              height={nh}
              rx={1}
              fill={color}
              opacity={0.65}
            />
          );
        })}

        <rect
          x={(vpX - minX) * scale}
          y={(vpY - minY) * scale}
          width={Math.max(vpWidth * scale, 5)}
          height={Math.max(vpHeight * scale, 5)}
          fill="rgba(0, 0, 0, 0.04)"
          stroke="#18181B"
          strokeWidth="1"
          rx={1}
        />
      </svg>
    </div>
  );
}
