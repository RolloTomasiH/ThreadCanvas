/**
 * Exporter utilities for ThreadCanvas:
 * 1. Obsidian Canvas (.canvas)
 * 2. Markdown Structured Research Report (.md)
 * 3. Native Project JSON (.canvasproj)
 */

import { resolveCardPalette } from './cardTheme';

/**
 * Convert canvas state to official Obsidian Canvas JSON format
 * Each ThreadCanvas card becomes a complete Q&A card in Obsidian Canvas
 */
export function exportToObsidianCanvas(nodes, edges, appearanceSettings) {
  const obsidianNodes = nodes.map(node => {
    const q = (node.question || node.content || '').trim();
    const a = (node.answer !== undefined ? node.answer : (node.type === 'answer' ? node.content : '')).trim();

    let text = '';
    if (node.branchQuote) {
      text += `> [!QUOTE] 引述前序观点\n> ${node.branchQuote}\n\n`;
    }

    if (q) {
      text += `### ${node.branchQuote ? '分支追问' : '研思课题'}\n${q}\n\n`;
    }

    if (node.reasoning) {
      text += `> [!NOTE] 深度思考过程\n> ${node.reasoning.split('\n').join('\n> ')}\n\n`;
    }

    if (a) {
      text += `### 研思结论\n${a}`;
    }

    const palette = resolveCardPalette(node, appearanceSettings);
    const color = palette.obsidianColor || (node.branchQuote ? '2' : (node.depth === 0 ? '4' : '5'));

    return {
      id: node.id,
      type: 'text',
      text: text,
      x: Math.round(node.x),
      y: Math.round(node.y),
      width: Math.round(node.width || 480),
      height: Math.round(node.height || 360),
      color: color
    };
  });

  const obsidianEdges = edges.map(edge => ({
    id: edge.id,
    fromNode: edge.fromId,
    fromSide: 'right',
    toNode: edge.toId,
    toSide: 'left',
    label: edge.label || (edge.quote ? `引述: ${edge.quote.slice(0, 18)}...` : undefined)
  }));

  return JSON.stringify({
    nodes: obsidianNodes,
    edges: obsidianEdges
  }, null, 2);
}

/**
 * Generate a hierarchical Markdown research report
 */
export function exportToMarkdownOutline(nodes, edges, projectTitle = '研思草稿') {
  const nodeMap = new Map(nodes.map(n => [n.id, n]));
  const childEdges = new Map(); // fromId -> [edge, ...]

  edges.forEach(edge => {
    if (!childEdges.has(edge.fromId)) {
      childEdges.set(edge.fromId, []);
    }
    childEdges.get(edge.fromId).push(edge);
  });

  // Find root nodes (nodes with no incoming edges)
  const incomingNodeIds = new Set(edges.map(e => e.toId));
  const rootNodes = nodes.filter(n => !incomingNodeIds.has(n.id));

  let markdown = `# ${projectTitle}\n\n`;
  markdown += `> 生成时间: ${new Date().toLocaleString('zh-CN')} | 研思卡片数: ${nodes.length} | 关联脉络数: ${edges.length}\n\n---\n\n`;

  const visited = new Set();

  function traverse(nodeId, depth = 1) {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);

    const node = nodeMap.get(nodeId);
    if (!node) return;

    const headingPrefix = '#'.repeat(Math.min(depth + 1, 6));
    const q = (node.question || node.content || '').trim();
    const a = (node.answer !== undefined ? node.answer : (node.type === 'answer' ? node.content : '')).trim();

    markdown += `${headingPrefix} ${node.branchQuote ? '分支追问' : '研思课题'}: ${q}\n\n`;
    if (node.branchQuote) {
      markdown += `> **引述要点**: "${node.branchQuote}"\n\n`;
    }

    if (node.reasoning) {
      markdown += `> **[深度思考过程]**:\n> ${node.reasoning.split('\n').join('\n> ')}\n\n`;
    }

    if (a) {
      markdown += `${a}\n\n`;
    }

    // Traverse children
    const outgoing = childEdges.get(nodeId) || [];
    for (const edge of outgoing) {
      traverse(edge.toId, depth + 1);
    }
  }

  // Traverse roots first
  rootNodes.forEach(r => traverse(r.id, 1));

  // Any unreached nodes
  nodes.forEach(n => {
    if (!visited.has(n.id)) {
      traverse(n.id, 1);
    }
  });

  return markdown;
}

/**
 * Trigger browser file download
 */
export function downloadFile(content, fileName, mimeType = 'text/plain;charset=utf-8') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
