/**
 * Canvas Data Normalizer:
 * Enforces the Single Q&A Card Architecture (1 Card = 1 Question + 1 Answer).
 * Automatically migrates legacy separate Question/Answer node pairs into unified cards.
 */

export function normalizeCanvasProject(project) {
  if (!project) return project;
  const { nodes, edges } = normalizeCanvasData(project.nodes || [], project.edges || []);
  return {
    ...project,
    nodes,
    edges
  };
}

export function normalizeCanvasData(nodes = [], edges = []) {
  if (!Array.isArray(nodes) || nodes.length === 0) {
    return { nodes: [], edges: edges || [] };
  }

  // Check if legacy question/answer nodes exist
  const hasLegacyNodes = nodes.some(n => n.type === 'question' || n.type === 'answer');
  if (!hasLegacyNodes) {
    // Already unified format, ensure required properties
    const cleanedNodes = nodes.map(n => ({
      ...n,
      type: 'card',
      question: (n.question || n.content || '').trim(),
      answer: (n.answer !== undefined ? n.answer : (n.content || '')),
      reasoning: n.reasoning || '',
      status: n.status || (n.answer ? 'done' : 'idle'),
      width: n.width || 480,
      depth: n.depth || 0,
      roleId: n.roleId || 'devil-advocate'
    }));
    return { nodes: cleanedNodes, edges: edges || [] };
  }

  const nodeMap = new Map(nodes.map(n => [n.id, { ...n }]));
  const questionToAnswerMap = new Map(); // questionId -> answerNode
  const answerToQuestionMap = new Map(); // answerId -> questionNode

  // 1. Identify direct question -> answer edges
  const internalQAEdgeIds = new Set();
  (edges || []).forEach(e => {
    const fromNode = nodeMap.get(e.fromId);
    const toNode = nodeMap.get(e.toId);
    if (fromNode && toNode && fromNode.type === 'question' && toNode.type === 'answer') {
      questionToAnswerMap.set(fromNode.id, toNode);
      answerToQuestionMap.set(toNode.id, fromNode);
      internalQAEdgeIds.add(e.id);
    }
  });

  const mergedNodes = [];
  const handledAnswerIds = new Set();
  const idRemap = new Map(); // old answerId -> mergedCardId

  // 2. Process all Question nodes
  nodes.forEach(n => {
    if (n.type === 'question') {
      const pairedAnswer = questionToAnswerMap.get(n.id);
      if (pairedAnswer) {
        handledAnswerIds.add(pairedAnswer.id);
        idRemap.set(pairedAnswer.id, n.id);
      }

      const mergedCard = {
        ...n,
        type: 'card',
        question: (n.question || n.content || '').trim(),
        branchQuote: n.branchQuote || '',
        answer: pairedAnswer ? (pairedAnswer.answer || pairedAnswer.content || '') : (n.answer || ''),
        reasoning: pairedAnswer ? (pairedAnswer.reasoning || '') : (n.reasoning || ''),
        status: pairedAnswer ? (pairedAnswer.status || 'done') : (n.status || 'idle'),
        roleId: n.roleId || 'devil-advocate',
        depth: n.depth || 0,
        x: n.x,
        y: n.y,
        width: 480,
        collapsed: !!n.collapsed
      };
      mergedNodes.push(mergedCard);
    }
  });

  // 3. Process orphan Answer nodes (if any exists without incoming question edge)
  nodes.forEach(n => {
    if (n.type === 'answer' && !handledAnswerIds.has(n.id)) {
      const orphanCard = {
        ...n,
        type: 'card',
        question: '研思课题结论',
        branchQuote: '',
        answer: n.answer || n.content || '',
        reasoning: n.reasoning || '',
        status: n.status || 'done',
        roleId: n.roleId || 'devil-advocate',
        depth: n.depth || 0,
        width: 480,
        collapsed: !!n.collapsed
      };
      mergedNodes.push(orphanCard);
    }
  });

  // 4. Also keep any existing unified 'card' nodes
  nodes.forEach(n => {
    if (n.type !== 'question' && n.type !== 'answer') {
      mergedNodes.push({
        ...n,
        type: 'card',
        question: (n.question || n.content || '').trim(),
        answer: n.answer !== undefined ? n.answer : (n.content || ''),
        reasoning: n.reasoning || '',
        status: n.status || (n.answer ? 'done' : 'idle'),
        width: n.width || 480
      });
    }
  });

  // 5. Remap and clean edges
  const activeNodeIds = new Set(mergedNodes.map(n => n.id));
  const newEdges = [];
  const edgeKeySet = new Set();

  (edges || []).forEach(e => {
    // Skip internal question -> answer edges that are now inside the same card
    if (internalQAEdgeIds.has(e.id)) return;

    let fromId = idRemap.get(e.fromId) || e.fromId;
    let toId = idRemap.get(e.toId) || e.toId;

    // Discard invalid / self-referential / orphan edges
    if (fromId === toId) return;
    if (!activeNodeIds.has(fromId) || !activeNodeIds.has(toId)) return;

    const dedupeKey = `${fromId}->${toId}`;
    if (edgeKeySet.has(dedupeKey)) return;
    edgeKeySet.add(dedupeKey);

    newEdges.push({
      ...e,
      fromId,
      toId
    });
  });

  // 6. Compact layout coordinates if old answer gaps left huge empty spaces
  // Reposition branch cards cleanly relative to their parent
  const parentMap = new Map();
  newEdges.forEach(e => {
    if (!parentMap.has(e.toId)) {
      parentMap.set(e.toId, e.fromId);
    }
  });

  const nodeById = new Map(mergedNodes.map(n => [n.id, n]));
  const childCountMap = new Map();

  mergedNodes.forEach(node => {
    const parentId = parentMap.get(node.id);
    if (parentId && nodeById.has(parentId)) {
      const parent = nodeById.get(parentId);
      const childIndex = childCountMap.get(parentId) || 0;
      childCountMap.set(parentId, childIndex + 1);

      // Desired relative position: to the right of parent card
      const targetX = parent.x + (parent.width || 480) + 120;
      const targetY = parent.y + (childIndex * 360);

      // If the node's current coordinate was based on the old 2-step layout (x > targetX + 300), snap it closer
      if (node.x > targetX + 200 || Math.abs(node.x - parent.x) > 1000) {
        node.x = targetX;
        node.y = targetY;
      }
    }
  });

  return { nodes: mergedNodes, edges: newEdges };
}
