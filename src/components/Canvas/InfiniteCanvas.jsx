import React, { useState, useRef, useEffect } from 'react';
import NodeCard from './NodeCard';
import SvgEdges from './SvgEdges';
import Minimap from './Minimap';
import FloatingQuickBranchPopover from './FloatingQuickBranchPopover';
import Toolbar from './Toolbar';
import ModelSettingsModal from './ModelSettingsModal';
import DraftManagerModal from './DraftManagerModal';
import HarnessModal from './HarnessModal';
import AppearanceModal from './AppearanceModal';
import { streamChatCompletion, getStoredLLMSettings } from '../../services/llm';
import { getStoredHarnessSettings, BUILTIN_ROLE_HARNESSES } from '../../services/harness';
import { exportToObsidianCanvas, exportToMarkdownOutline, downloadFile } from '../../services/canvasExporter';
import { normalizeCanvasProject, normalizeCanvasData } from '../../services/canvasNormalizer';
import { getStoredAppearanceSettings, saveStoredAppearanceSettings, CANVAS_BACKGROUNDS } from '../../services/cardTheme';
import { INITIAL_RESEARCH_CANVASES } from '../../data/researchCanvases';

const STORAGE_PROJECTS_KEY = 'thread_canvas_projects_v1';
const LEGACY_STORAGE_PROJECTS_KEY = 'canvas_researcher_projects_v2';
const STORAGE_CURRENT_PROJECT_KEY = 'thread_canvas_current_project_id_v1';
const LEGACY_STORAGE_CURRENT_PROJECT_KEY = 'canvas_researcher_current_project_id_v2';

export default function InfiniteCanvas() {
  const [projects, setProjects] = useState(() => {
    try {
      let raw = localStorage.getItem(STORAGE_PROJECTS_KEY);
      if (!raw) {
        raw = localStorage.getItem(LEGACY_STORAGE_PROJECTS_KEY);
      }
      if (raw) {
        const stored = JSON.parse(raw);
        const normalizedStored = stored.map(normalizeCanvasProject);
        const existingIds = new Set(normalizedStored.map(p => p.id));
        const merged = [...normalizedStored];
        INITIAL_RESEARCH_CANVASES.forEach(c => {
          if (!existingIds.has(c.id)) {
            merged.push(normalizeCanvasProject(c));
          }
        });
        return merged;
      }
    } catch {}
    return INITIAL_RESEARCH_CANVASES.map(normalizeCanvasProject);
  });

  const [currentProjectId, setCurrentProjectId] = useState(() => {
    const saved = localStorage.getItem(STORAGE_CURRENT_PROJECT_KEY) || localStorage.getItem(LEGACY_STORAGE_CURRENT_PROJECT_KEY);
    return saved || INITIAL_RESEARCH_CANVASES[0].id;
  });

  const rawProject = projects.find(p => p.id === currentProjectId) || projects[0] || INITIAL_RESEARCH_CANVASES[0];
  const currentProject = normalizeCanvasProject(rawProject);

  // Canvas State (Single Q&A Card Architecture)
  const [nodes, setNodes] = useState(currentProject.nodes || []);
  const [edges, setEdges] = useState(currentProject.edges || []);
  const [viewport, setViewport] = useState(currentProject.viewport || { x: 60, y: 60, zoom: 0.85 });
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState(null);
  const [activeTool, setActiveTool] = useState('select');

  // Modals & Settings
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsNotice, setSettingsNotice] = useState('');
  const [isDraftsOpen, setIsDraftsOpen] = useState(false);
  const [isHarnessOpen, setIsHarnessOpen] = useState(false);
  const [isAppearanceOpen, setIsAppearanceOpen] = useState(false);
  const [llmSettings, setLlmSettings] = useState(getStoredLLMSettings());
  const [harnessSettings, setHarnessSettings] = useState(getStoredHarnessSettings());
  const [appearanceSettings, setAppearanceSettings] = useState(getStoredAppearanceSettings());

  // Interaction States
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [draggingNode, setDraggingNode] = useState(null);
  const [activeConnection, setActiveConnection] = useState(null);
  const [quickBranchPopoverData, setQuickBranchPopoverData] = useState(null);

  const canvasRef = useRef(null);
  const abortControllersRef = useRef(new Map());
  const pendingStreamingNodeIdRef = useRef(null);

  // Sync state to current project & persist
  useEffect(() => {
    setProjects(prevProjects => {
      const updated = prevProjects.map(p => {
        if (p.id === currentProjectId) {
          return {
            ...p,
            nodes,
            edges,
            viewport,
            updatedAt: new Date().toISOString(),
            nodeCount: nodes.length
          };
        }
        return p;
      });
      try {
        localStorage.setItem(STORAGE_PROJECTS_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save projects:', e);
      }
      return updated;
    });
  }, [nodes, edges, viewport, currentProjectId]);

  const handleSelectProject = (projId) => {
    const target = projects.find(p => p.id === projId);
    if (!target) return;
    const normalized = normalizeCanvasProject(target);
    setCurrentProjectId(projId);
    setNodes(normalized.nodes || []);
    setEdges(normalized.edges || []);
    setViewport(normalized.viewport || { x: 80, y: 80, zoom: 0.85 });
    setSelectedNodeId(null);
    setQuickBranchPopoverData(null);
    localStorage.setItem(STORAGE_CURRENT_PROJECT_KEY, projId);
  };

  const handleCreateProject = (title) => {
    const newCardId = `card-${Date.now()}`;
    const newProj = {
      id: `proj-${Date.now()}`,
      title,
      category: '自建研究',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      viewport: { x: 100, y: 100, zoom: 0.85 },
      nodes: [
        {
          id: newCardId,
          type: 'card',
          roleId: harnessSettings.defaultRoleId || 'devil-advocate',
          question: '',
          answer: '',
          reasoning: '',
          x: 160,
          y: 180,
          width: 480,
          depth: 0,
          status: 'idle'
        }
      ],
      edges: []
    };
    const updated = [newProj, ...projects];
    setProjects(updated);
    handleSelectProject(newProj.id);
  };

  const handleDeleteProject = (projId) => {
    const filtered = projects.filter(p => p.id !== projId);
    setProjects(filtered);
    if (currentProjectId === projId && filtered.length > 0) {
      handleSelectProject(filtered[0].id);
    }
  };

  const handleRestoreDefaultCanvases = () => {
    const normalized = INITIAL_RESEARCH_CANVASES.map(normalizeCanvasProject);
    setProjects(normalized);
    handleSelectProject(normalized[0].id);
  };

  const handleImportProject = (importedData) => {
    const rawProj = {
      id: `proj-${Date.now()}`,
      title: importedData.title || '导入的研思画布',
      category: '导入项目',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      viewport: importedData.viewport || { x: 80, y: 80, zoom: 0.85 },
      nodes: importedData.nodes || [],
      edges: importedData.edges || []
    };
    const newProj = normalizeCanvasProject(rawProj);
    setProjects([newProj, ...projects]);
    handleSelectProject(newProj.id);
  };

  // ================= VIEWPORT PAN / ZOOM =================
  const handleWheel = (e) => {
    // 1. If inside any modal / fixed overlay, do not touch canvas viewport
    if (e.target.closest('.fixed, [role="dialog"]')) {
      return;
    }

    // 2. Pinch-to-zoom or Cmd/Ctrl + Wheel -> Zoom canvas
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      if (!canvasRef.current) return;

      const zoomFactor = -e.deltaY * 0.005;
      const newZoom = Math.min(Math.max(viewport.zoom * (1 + zoomFactor), 0.15), 2.5);

      const rect = canvasRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const newX = mouseX - (mouseX - viewport.x) * (newZoom / viewport.zoom);
      const newY = mouseY - (mouseY - viewport.y) * (newZoom / viewport.zoom);

      setViewport({ x: newX, y: newY, zoom: newZoom });
      return;
    }

    // 3. Card-isolated scrolling: If cursor is anywhere inside a card
    const cardEl = e.target.closest('[id^="node-"]');
    if (cardEl) {
      // Find the inner scrollable container (e.g. answer text or reasoning)
      const scrollable = e.target.closest('.overflow-y-auto, .overflow-auto, textarea') ||
                         cardEl.querySelector('[data-card-scroll="true"], .overflow-y-auto');

      if (scrollable) {
        // Scroll the card container smoothly
        scrollable.scrollTop += e.deltaY;
      }

      // CRITICAL: Prevent default and stop propagation so the infinite canvas NEVER pans!
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    // 4. Background canvas panning (only when scrolling over empty canvas)
    e.preventDefault();
    if (!canvasRef.current) return;
    setViewport(prev => ({
      ...prev,
      x: prev.x - e.deltaX,
      y: prev.y - e.deltaY
    }));
  };

  const handleZoomIn = () => setViewport(v => ({ ...v, zoom: Math.min(v.zoom * 1.2, 2.5) }));
  const handleZoomOut = () => setViewport(v => ({ ...v, zoom: Math.max(v.zoom / 1.2, 0.15) }));
  const handleResetZoom = () => setViewport(v => ({ ...v, zoom: 1 }));
  const handleFitView = () => {
    if (nodes.length === 0) return;
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    nodes.forEach(n => {
      minX = Math.min(minX, n.x);
      minY = Math.min(minY, n.y);
      maxX = Math.max(maxX, n.x + (n.width || 480));
      maxY = Math.max(maxY, n.y + (n.height || 360));
    });

    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight;
    const padding = 100;
    const width = maxX - minX + padding * 2;
    const height = maxY - minY + padding * 2;

    const fitZoom = Math.min(Math.max(Math.min(canvasWidth / width, canvasHeight / height), 0.2), 1.2);
    const fitX = (canvasWidth - (maxX - minX) * fitZoom) / 2 - minX * fitZoom;
    const fitY = (canvasHeight - (maxY - minY) * fitZoom) / 2 - minY * fitZoom;

    setViewport({ x: fitX, y: fitY, zoom: fitZoom });
  };

  const handleCanvasPointerDown = (e) => {
    if (e.target === canvasRef.current || e.target.tagName === 'svg' || e.target.classList.contains('canvas-grid-bg')) {
      setSelectedNodeId(null);
      setSelectedEdgeId(null);
      setQuickBranchPopoverData(null);

      // Pan with space or Hand tool or middle mouse
      if (activeTool === 'pan' || e.button === 1 || e.spaceKey) {
        setIsPanning(true);
        setPanStart({ x: e.clientX - viewport.x, y: e.clientY - viewport.y });
      }
    }
  };

  const handlePointerMove = (e) => {
    if (isPanning) {
      setViewport(prev => ({
        ...prev,
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      }));
      return;
    }

    if (draggingNode) {
      const dx = (e.clientX - draggingNode.startX) / viewport.zoom;
      const dy = (e.clientY - draggingNode.startY) / viewport.zoom;

      setNodes(prev => prev.map(n => {
        if (n.id === draggingNode.id) {
          return {
            ...n,
            x: Math.round(draggingNode.nodeStartX + dx),
            y: Math.round(draggingNode.nodeStartY + dy)
          };
        }
        return n;
      }));
      return;
    }

    if (activeConnection) {
      const rect = canvasRef.current.getBoundingClientRect();
      const currentCanvasX = (e.clientX - rect.left - viewport.x) / viewport.zoom;
      const currentCanvasY = (e.clientY - rect.top - viewport.y) / viewport.zoom;

      setActiveConnection(prev => ({
        ...prev,
        x2: currentCanvasX,
        y2: currentCanvasY
      }));
    }
  };

  const handlePointerUp = (e) => {
    setIsPanning(false);
    setDraggingNode(null);

    if (activeConnection) {
      const rect = canvasRef.current.getBoundingClientRect();
      const dropX = (e.clientX - rect.left - viewport.x) / viewport.zoom;
      const dropY = (e.clientY - rect.top - viewport.y) / viewport.zoom;

      const sourceNode = nodes.find(n => n.id === activeConnection.fromId);
      const newCardId = `card-${Date.now()}`;
      const newDepth = (sourceNode?.depth || 0) + 1;

      const newCard = {
        id: newCardId,
        type: 'card',
        roleId: sourceNode?.roleId || harnessSettings.defaultRoleId || 'devil-advocate',
        question: '',
        answer: '',
        reasoning: '',
        x: Math.round(dropX - 40),
        y: Math.round(dropY - 40),
        width: 480,
        depth: newDepth,
        status: 'idle'
      };

      const newEdge = {
        id: `e-${Date.now()}`,
        fromId: activeConnection.fromId,
        toId: newCardId
      };

      setNodes(prev => [...prev, newCard]);
      setEdges(prev => [...prev, newEdge]);
      setSelectedNodeId(newCardId);
      setActiveConnection(null);
    }
  };

  const handleCanvasDoubleClick = (e) => {
    if (e.target !== canvasRef.current && !e.target.classList.contains('canvas-grid-bg')) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const clickX = (e.clientX - rect.left - viewport.x) / viewport.zoom;
    const clickY = (e.clientY - rect.top - viewport.y) / viewport.zoom;

    const newId = `card-${Date.now()}`;
    const newCard = {
      id: newId,
      type: 'card',
      roleId: harnessSettings.defaultRoleId || 'devil-advocate',
      question: '',
      answer: '',
      reasoning: '',
      x: Math.round(clickX - 240),
      y: Math.round(clickY - 100),
      width: 480,
      depth: 0,
      status: 'idle'
    };

    setNodes(prev => [...prev, newCard]);
    setSelectedNodeId(newId);
    setQuickBranchPopoverData(null);
  };

  const handleAddRootQuestionFromToolbar = () => {
    const canvasCenterX = (-viewport.x + window.innerWidth / 2) / viewport.zoom;
    const canvasCenterY = (-viewport.y + window.innerHeight / 2) / viewport.zoom;

    const newId = `card-${Date.now()}`;
    const newCard = {
      id: newId,
      type: 'card',
      roleId: harnessSettings.defaultRoleId || 'devil-advocate',
      question: '',
      answer: '',
      reasoning: '',
      x: Math.round(canvasCenterX - 240),
      y: Math.round(canvasCenterY - 120),
      width: 480,
      depth: 0,
      status: 'idle'
    };

    setNodes(prev => [...prev, newCard]);
    setSelectedNodeId(newId);
    setQuickBranchPopoverData(null);
  };

  const handleNodePointerDown = (e, nodeId) => {
    e.stopPropagation();
    setSelectedNodeId(nodeId);
    setQuickBranchPopoverData(null);

    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    setDraggingNode({
      id: nodeId,
      startX: e.clientX,
      startY: e.clientY,
      nodeStartX: node.x,
      nodeStartY: node.y
    });
  };

  const handleStartDragConnector = (e, nodeId, side = 'right') => {
    e.stopPropagation();
    const sourceNode = nodes.find(n => n.id === nodeId);
    if (!sourceNode) return;

    const w = sourceNode.width || 480;
    const h = sourceNode.height || 340;

    let startX = sourceNode.x + w;
    let startY = sourceNode.y + h / 2;

    if (side === 'bottom') {
      startX = sourceNode.x + w / 2;
      startY = sourceNode.y + h;
    } else if (side === 'left') {
      startX = sourceNode.x;
      startY = sourceNode.y + h / 2;
    } else if (side === 'top') {
      startX = sourceNode.x + w / 2;
      startY = sourceNode.y;
    }

    setActiveConnection({
      fromId: nodeId,
      side,
      x1: startX,
      y1: startY,
      x2: startX + 40,
      y2: startY
    });
  };

  const handleUpdateNode = (nodeId, partialData) => {
    setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, ...partialData } : n));
  };

  const handleDeleteNode = (nodeId) => {
    setNodes(prev => prev.filter(n => n.id !== nodeId));
    setEdges(prev => prev.filter(e => e.fromId !== nodeId && e.toId !== nodeId));
    if (selectedNodeId === nodeId) setSelectedNodeId(null);
  };

  const handleDeleteEdge = (edgeId) => {
    setEdges(prev => prev.filter(e => e.id !== edgeId));
    if (selectedEdgeId === edgeId) setSelectedEdgeId(null);
  };

  // Global Keyboard Shortcuts (Delete, Esc, Zoom)
  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeEl = document.activeElement;
      const isInput = activeEl && (
        activeEl.tagName === 'INPUT' || 
        activeEl.tagName === 'TEXTAREA' || 
        activeEl.isContentEditable
      );

      if (isInput) return;

      // Delete or Backspace to remove selected card or connection
      if (e.key === 'Backspace' || e.key === 'Delete') {
        if (selectedNodeId) {
          e.preventDefault();
          handleDeleteNode(selectedNodeId);
        } else if (selectedEdgeId) {
          e.preventDefault();
          handleDeleteEdge(selectedEdgeId);
        }
      }
      // Escape to cancel selection and dismiss popovers
      else if (e.key === 'Escape') {
        setSelectedNodeId(null);
        setSelectedEdgeId(null);
        setQuickBranchPopoverData(null);
      }
      // Zoom Shortcuts: Cmd/Ctrl + (+/-) or Cmd/Ctrl + 0
      else if ((e.metaKey || e.ctrlKey) && (e.key === '=' || e.key === '+')) {
        e.preventDefault();
        handleZoomIn();
      } else if ((e.metaKey || e.ctrlKey) && (e.key === '-' || e.key === '_')) {
        e.preventDefault();
        handleZoomOut();
      } else if ((e.metaKey || e.ctrlKey) && e.key === '0') {
        e.preventDefault();
        handleResetZoom();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNodeId, selectedEdgeId]);

  // ================= ANCESTRY CONVERSATION TRACE =================
  const getAncestryMessages = (targetCardId, currentCardNode = null) => {
    const parentMap = new Map();
    edges.forEach(e => parentMap.set(e.toId, { fromId: e.fromId, quote: e.quote }));

    const nodeMap = new Map(nodes.map(n => [n.id, n]));
    if (currentCardNode) {
      nodeMap.set(currentCardNode.id, currentCardNode);
    }

    const chain = [];
    let currId = targetCardId;

    while (currId) {
      const node = nodeMap.get(currId);
      if (node) chain.unshift(node);
      const parentLink = parentMap.get(currId);
      currId = parentLink ? parentLink.fromId : null;
    }

    const messages = [];
    for (let i = 0; i < chain.length; i++) {
      const n = chain[i];
      const isTarget = (n.id === targetCardId);
      const qText = (n.question || n.content || '').trim();
      const aText = (n.answer !== undefined ? n.answer : (n.type === 'answer' ? n.content : '')).trim();

      let userMsg = qText;
      if (n.branchQuote) {
        const detail = qText || '请针对上述引述要点进行深入推演与因果机理剖析，指出其核心壁垒与潜在边际风险。';
        userMsg = `【针对前序研思观点追问】\n引述要点：\n"${n.branchQuote}"\n\n深入推演提问：\n${detail}`;
      }

      if (userMsg) {
        messages.push({ role: 'user', content: userMsg });
      }

      // Append answer to conversation chain for all ancestors
      if (!isTarget && aText) {
        messages.push({ role: 'assistant', content: aText });
      }
    }

    // Clean and merge consecutive same-role messages
    const cleaned = [];
    for (const m of messages) {
      if (!m.content || !m.content.trim()) continue;
      if (cleaned.length > 0 && cleaned[cleaned.length - 1].role === m.role) {
        cleaned[cleaned.length - 1].content += `\n\n${m.content.trim()}`;
      } else {
        cleaned.push({ ...m, content: m.content.trim() });
      }
    }

    if (cleaned.length === 0) {
      cleaned.push({ role: 'user', content: '请进行深入分析与逻辑推演。' });
    }

    return cleaned;
  };

  // ================= LLM STREAMING INFERENCE (Single Q&A Card) =================
  const handleStartStreaming = async (cardId, explicitCard = null, explicitSettings = null) => {
    let card = explicitCard || nodes.find(n => n.id === cardId);
    if (!card) return;

    let q = (card.question || card.content || '').trim();
    if (!q) {
      if (card.branchQuote) {
        q = '深入剖析该引述要点的核心机理、竞争壁垒与潜在边际风险。';
        card = { ...card, question: q, content: q };
        setNodes(prev => prev.map(n => n.id === cardId ? { ...n, question: q, content: q } : n));
      } else {
        return;
      }
    }

    const activeSettings = explicitSettings || getStoredLLMSettings();
    // Guarantee Coding Plan preset integrity
    if (activeSettings.baseUrl?.includes('bigmodel') || activeSettings.selectedPresetId?.includes('zhipu')) {
      activeSettings.baseUrl = 'https://open.bigmodel.cn/api/coding/paas/v4';
      if (activeSettings.model !== 'glm-5.3' && activeSettings.model !== 'glm-4.7') {
        activeSettings.model = 'glm-5.3';
      }
    }
    const isLocalModel = activeSettings.selectedPresetId?.includes('ollama') || activeSettings.selectedPresetId?.includes('lm-studio');

    // Guard: check if API Key is configured
    if (!activeSettings.apiKey && !isLocalModel) {
      pendingStreamingNodeIdRef.current = cardId;
      setSettingsNotice('推演前请填入智谱 Coding Plan API Key，保存后将自动开始推演');
      setIsSettingsOpen(true);
      return;
    }

    // Set card status to streaming and clear answer/reasoning for fresh generation
    setNodes(prev => prev.map(n => n.id === cardId ? {
      ...n,
      answer: '',
      reasoning: '',
      status: 'streaming'
    } : n));

    const controller = new AbortController();
    abortControllersRef.current.set(cardId, controller);

    try {
      const messages = getAncestryMessages(cardId, card);
      const projectMemory = harnessSettings.projectMemories?.[currentProjectId] || '';

      await streamChatCompletion({
        messages,
        settings: activeSettings,
        roleId: card.roleId || harnessSettings.defaultRoleId || 'devil-advocate',
        projectMemory: projectMemory,
        antiSlopEnabled: harnessSettings.antiSlopEnabled !== false,
        signal: controller.signal,
        onContent: (chunk) => {
          setNodes(prev => prev.map(n => {
            if (n.id === cardId) {
              return { ...n, answer: (n.answer || '') + chunk };
            }
            return n;
          }));
        },
        onReasoning: (chunk) => {
          setNodes(prev => prev.map(n => {
            if (n.id === cardId) {
              return { ...n, reasoning: (n.reasoning || '') + chunk };
            }
            return n;
          }));
        }
      });

      setNodes(prev => prev.map(n => n.id === cardId ? { ...n, status: 'done' } : n));
    } catch (err) {
      if (err.name === 'AbortError') {
        setNodes(prev => prev.map(n => n.id === cardId ? { ...n, status: 'done' } : n));
      } else {
        console.error('LLM error:', err);
        setNodes(prev => prev.map(n => n.id === cardId ? {
          ...n,
          answer: (n.answer || '') + `\n\n> **调用异常**: ${err.message}`,
          status: 'error'
        } : n));
      }
    } finally {
      abortControllersRef.current.delete(cardId);
    }
  };

  const handleStopStreaming = (cardId) => {
    const controller = abortControllersRef.current.get(cardId);
    if (controller) {
      controller.abort();
      abortControllersRef.current.delete(cardId);
    }
    setNodes(prev => prev.map(n => n.id === cardId ? { ...n, status: 'done' } : n));
  };

  // ================= BRANCHING MECHANICS (Spawn New Q&A Cards) =================
  const handleBranchFromQuote = (selectedQuote, sourceCardId, customQuestion = '', autoExecute = false) => {
    const sourceCard = nodes.find(n => n.id === sourceCardId);
    if (!sourceCard) return;

    const newCardId = `card-${Date.now()}`;
    const newDepth = (sourceCard.depth || 0) + 1;
    const existingChildEdges = edges.filter(e => e.fromId === sourceCardId);
    const offsetY = existingChildEdges.length * 360;

    const defaultPrompt = '深入剖析该引述要点的核心机理、竞争壁垒与潜在边际风险。';
    const finalQuestion = customQuestion?.trim() 
      ? customQuestion.trim() 
      : (autoExecute ? defaultPrompt : '');

    const newCard = {
      id: newCardId,
      type: 'card',
      roleId: sourceCard.roleId || harnessSettings.defaultRoleId || 'devil-advocate',
      question: finalQuestion,
      content: finalQuestion,
      branchQuote: selectedQuote,
      answer: '',
      reasoning: '',
      x: sourceCard.x + (sourceCard.width || 480) + 120,
      y: sourceCard.y + offsetY,
      width: 480,
      depth: newDepth,
      status: (finalQuestion && autoExecute) ? 'streaming' : 'idle'
    };

    const newEdge = {
      id: `e-${Date.now()}`,
      fromId: sourceCardId,
      toId: newCardId,
      quote: selectedQuote
    };

    setNodes(prev => [...prev, newCard]);
    setEdges(prev => [...prev, newEdge]);
    setSelectedNodeId(newCardId);
    setQuickBranchPopoverData(null);

    // Pan smoothly if offscreen
    const targetScreenX = newCard.x * viewport.zoom + viewport.x;
    const targetScreenY = newCard.y * viewport.zoom + viewport.y;
    const reqWidth = 520 * viewport.zoom;
    const reqHeight = 380 * viewport.zoom;
    let nextVx = viewport.x;
    let nextVy = viewport.y;
    if (targetScreenX + reqWidth > window.innerWidth - 40) {
      nextVx = window.innerWidth - 40 - (newCard.x + 480) * viewport.zoom;
    }
    if (targetScreenY + reqHeight > window.innerHeight - 40) {
      nextVy = window.innerHeight - 40 - (newCard.y + 360) * viewport.zoom;
    }
    if (nextVx !== viewport.x || nextVy !== viewport.y) {
      setViewport(v => ({ ...v, x: nextVx, y: nextVy }));
    }

    if (autoExecute && finalQuestion) {
      handleStartStreaming(newCardId, newCard);
    }
  };

  const handleBranchFromCard = (sourceCardId, customQuestion = '', autoExecute = false) => {
    const sourceCard = nodes.find(n => n.id === sourceCardId);
    if (!sourceCard) return;

    const newCardId = `card-${Date.now()}`;
    const newDepth = (sourceCard.depth || 0) + 1;
    const existingChildEdges = edges.filter(e => e.fromId === sourceCardId);
    const offsetY = existingChildEdges.length * 360;

    const defaultPrompt = '基于本卡片的投研结论，进一步推演其行业传导链与下阶段关键观察指标。';
    const finalQuestion = customQuestion?.trim() 
      ? customQuestion.trim() 
      : (autoExecute ? defaultPrompt : '');

    const newCard = {
      id: newCardId,
      type: 'card',
      roleId: sourceCard.roleId || harnessSettings.defaultRoleId || 'devil-advocate',
      question: finalQuestion,
      content: finalQuestion,
      branchQuote: '',
      answer: '',
      reasoning: '',
      x: sourceCard.x + (sourceCard.width || 480) + 120,
      y: sourceCard.y + offsetY,
      width: 480,
      depth: newDepth,
      status: (finalQuestion && autoExecute) ? 'streaming' : 'idle'
    };

    const newEdge = {
      id: `e-${Date.now()}`,
      fromId: sourceCardId,
      toId: newCardId
    };

    setNodes(prev => [...prev, newCard]);
    setEdges(prev => [...prev, newEdge]);
    setSelectedNodeId(newCardId);
    setQuickBranchPopoverData(null);

    // Pan smoothly if offscreen
    const targetScreenX = newCard.x * viewport.zoom + viewport.x;
    const targetScreenY = newCard.y * viewport.zoom + viewport.y;
    const reqWidth = 520 * viewport.zoom;
    const reqHeight = 380 * viewport.zoom;
    let nextVx = viewport.x;
    let nextVy = viewport.y;
    if (targetScreenX + reqWidth > window.innerWidth - 40) {
      nextVx = window.innerWidth - 40 - (newCard.x + 480) * viewport.zoom;
    }
    if (targetScreenY + reqHeight > window.innerHeight - 40) {
      nextVy = window.innerHeight - 40 - (newCard.y + 360) * viewport.zoom;
    }
    if (nextVx !== viewport.x || nextVy !== viewport.y) {
      setViewport(v => ({ ...v, x: nextVx, y: nextVy }));
    }

    if (autoExecute && finalQuestion) {
      handleStartStreaming(newCardId, newCard);
    }
  };

  const activeRoleObj = BUILTIN_ROLE_HARNESSES.find(r => r.id === (harnessSettings.defaultRoleId || 'devil-advocate')) || BUILTIN_ROLE_HARNESSES[0];
  const activeCanvasBg = CANVAS_BACKGROUNDS[appearanceSettings?.canvasBg] || CANVAS_BACKGROUNDS['cool-grey'];

  return (
    <div 
      className={`relative w-screen h-screen overflow-hidden select-none transition-colors duration-200 ${activeCanvasBg.bgClass}`}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Top Floating Apple Toolbar */}
      <Toolbar
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        zoom={viewport.zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetZoom={handleResetZoom}
        onFitView={handleFitView}
        onAddRootQuestion={handleAddRootQuestionFromToolbar}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAppearance={() => setIsAppearanceOpen(true)}
        onOpenHarness={() => setIsHarnessOpen(true)}
        onOpenDrafts={() => setIsDraftsOpen(true)}
        currentProjectTitle={currentProject?.title}
        currentModelName={llmSettings.model || 'glm-5.3'}
        hasApiKey={!!llmSettings.apiKey}
        activeRoleName={activeRoleObj.name}
        antiSlopEnabled={harnessSettings.antiSlopEnabled !== false}
        onExportObsidian={() => {
          const canvasJson = exportToObsidianCanvas(nodes, edges, appearanceSettings);
          downloadFile(canvasJson, `${currentProject.title}.canvas`, 'application/json');
        }}
        onExportMarkdown={() => {
          const md = exportToMarkdownOutline(nodes, edges, currentProject.title);
          downloadFile(md, `${currentProject.title}.md`, 'text/markdown;charset=utf-8');
        }}
        onExportJson={() => {
          const payload = JSON.stringify({
            title: currentProject.title,
            category: currentProject.category,
            version: '2.0.0',
            exportedAt: new Date().toISOString(),
            viewport,
            nodes,
            edges
          }, null, 2);
          downloadFile(payload, `${currentProject.title}.canvasproj`, 'application/json');
        }}
      />

      {/* Infinite Canvas */}
      <div
        ref={canvasRef}
        className={`absolute inset-0 overflow-hidden cursor-default ${
          activeTool === 'pan' || isPanning ? 'canvas-panning' : ''
        }`}
        onWheel={handleWheel}
        onPointerDown={handleCanvasPointerDown}
        onDoubleClick={handleCanvasDoubleClick}
      >
        <div
          className="absolute inset-0 pointer-events-none canvas-grid-bg"
          style={{
            backgroundImage: `radial-gradient(${activeCanvasBg.gridDotColor || 'rgba(0, 0, 0, 0.12)'} 1.2px, transparent 1.2px)`,
            backgroundPosition: `${viewport.x}px ${viewport.y}px`,
            backgroundSize: `${32 * viewport.zoom}px ${32 * viewport.zoom}px`,
          }}
        />

        {/* Scalable & Pannable World Space */}
        <div
          style={{
            transform: `translate3d(${viewport.x}px, ${viewport.y}px, 0) scale(${viewport.zoom})`,
            transformOrigin: '0 0',
          }}
          className="absolute inset-0 pointer-events-none will-change-transform"
        >
          {/* SVG Connection Layer */}
          <SvgEdges
            edges={edges}
            nodes={nodes}
            selectedEdgeId={selectedEdgeId}
            onSelectEdge={(id) => {
              setSelectedEdgeId(id);
              setSelectedNodeId(null);
            }}
            onDeleteEdge={handleDeleteEdge}
            activeConnection={activeConnection}
          />

          {/* Cards Layer */}
          <div className="pointer-events-auto">
            {nodes.map(node => (
              <NodeCard
                key={node.id}
                node={node}
                appearanceSettings={appearanceSettings}
                isSelected={selectedNodeId === node.id}
                onSelect={(id) => {
                  setSelectedNodeId(id);
                  setSelectedEdgeId(null);
                }}
                onUpdateContent={handleUpdateNode}
                onStartStreaming={handleStartStreaming}
                onStopStreaming={handleStopStreaming}
                onDelete={handleDeleteNode}
                onBranchFromCard={handleBranchFromCard}
                onShowQuickBranch={(popoverData) => setQuickBranchPopoverData(popoverData)}
                onStartDragConnector={handleStartDragConnector}
                onNodePointerDown={handleNodePointerDown}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Floating Quick Branch Popover (Supports Selection & Card Blank Space Click) */}
      {quickBranchPopoverData && (
        <FloatingQuickBranchPopover
          popoverData={quickBranchPopoverData}
          onBranchFromQuote={(quote, srcId, query, auto) => handleBranchFromQuote(quote, srcId, query, auto)}
          onBranchFromCard={(srcId, query, auto) => handleBranchFromCard(srcId, query, auto)}
          onClose={() => setQuickBranchPopoverData(null)}
        />
      )}

      {/* Minimap */}
      <Minimap
        nodes={nodes}
        viewport={viewport}
        canvasSize={{ width: window.innerWidth, height: window.innerHeight }}
        onPanTo={(targetX, targetY) => setViewport(v => ({ ...v, x: targetX, y: targetY }))}
      />

      {/* Research Harness Modal */}
      <HarnessModal
        isOpen={isHarnessOpen}
        onClose={() => setIsHarnessOpen(false)}
        currentProjectId={currentProjectId}
        onHarnessUpdated={(newHarness) => setHarnessSettings(newHarness)}
      />

      {/* Appearance & Color Settings Modal */}
      <AppearanceModal
        isOpen={isAppearanceOpen}
        onClose={() => setIsAppearanceOpen(false)}
        appearanceSettings={appearanceSettings}
        onAppearanceUpdated={(newSettings) => {
          setAppearanceSettings(newSettings);
          saveStoredAppearanceSettings(newSettings);
        }}
      />

      {/* LLM Model Settings Modal */}
      <ModelSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => {
          setIsSettingsOpen(false);
          setSettingsNotice('');
        }}
        initialNotice={settingsNotice}
        onSettingsUpdated={(newSettings) => {
          setLlmSettings(newSettings);
          if (newSettings.apiKey && pendingStreamingNodeIdRef.current) {
            const pendingId = pendingStreamingNodeIdRef.current;
            pendingStreamingNodeIdRef.current = null;
            setTimeout(() => {
              handleStartStreaming(pendingId, null, newSettings);
            }, 100);
          }
        }}
      />

      {/* Drafts Manager Modal */}
      <DraftManagerModal
        isOpen={isDraftsOpen}
        onClose={() => setIsDraftsOpen(false)}
        projects={projects}
        currentProjectId={currentProjectId}
        onSelectProject={handleSelectProject}
        onCreateProject={handleCreateProject}
        onDeleteProject={handleDeleteProject}
        onRestoreDefaultCanvases={handleRestoreDefaultCanvases}
        onImportProject={handleImportProject}
        currentCanvasData={{ nodes, edges, viewport }}
      />
    </div>
  );
}
