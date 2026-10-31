import React, { useState, useRef, useEffect } from 'react';
import { 
  GitBranch, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronRight, 
  Trash2, 
  StopCircle,
  FileText,
  Edit3,
  BrainCircuit
} from 'lucide-react';
import { renderMarkdownWithMath } from '../../services/markdownRenderer';
import { BUILTIN_ROLE_HARNESSES } from '../../services/harness';
import { resolveCardPalette, COLOR_PALETTE_LIST } from '../../services/cardTheme';

export default function NodeCard({
  node,
  appearanceSettings,
  isSelected,
  onSelect,
  onUpdateContent,
  onStartStreaming,
  onStopStreaming,
  onDelete,
  onBranchFromCard,
  onShowQuickBranch,
  onStartDragConnector,
  onNodePointerDown,
}) {
  const [copied, setCopied] = useState(false);
  const [showReasoning, setShowReasoning] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);
  const cardBodyRef = useRef(null);
  const textareaRef = useRef(null);

  const questionText = node.question || node.content || '';
  const answerText = node.answer || (node.type === 'answer' ? node.content : '');
  const hasAnswer = !!answerText?.trim();
  const isStreaming = node.status === 'streaming';
  const isBranch = !!node.branchQuote;

  // Resolve dynamic theme colors for this card
  const palette = resolveCardPalette(node, appearanceSettings);
  const cardStyle = appearanceSettings?.cardStyle || 'liquid-glass';
  const isLiquid = cardStyle === 'liquid-glass';
  const isTinted = cardStyle === 'tinted-surface';
  const isRibbon = cardStyle === 'top-ribbon';

  // Auto-focus question input when newly created or editing
  useEffect(() => {
    if ((!hasAnswer && !isStreaming) || isEditingQuestion) {
      const timer = setTimeout(() => {
        textareaRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [hasAnswer, isStreaming, isEditingQuestion]);

  // Handle MouseUp to detect text selection inside the answer
  const handleMouseUp = (e) => {
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed) {
      const selectedText = selection.toString().trim();
      if (selectedText.length >= 2) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        if (onShowQuickBranch) {
          onShowQuickBranch({
            type: 'selection',
            nodeId: node.id,
            text: selectedText,
            position: {
              x: rect.left + rect.width / 2,
              y: rect.top - 8
            }
          });
        }
      }
    }
  };

  // Handle click on card body (not on buttons/inputs)
  const handleCardBodyClick = (e) => {
    if (
      e.target.tagName === 'BUTTON' || 
      e.target.tagName === 'INPUT' || 
      e.target.tagName === 'TEXTAREA' ||
      e.target.tagName === 'A' ||
      e.target.closest('button')
    ) {
      return;
    }

    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      if (hasAnswer && onShowQuickBranch) {
        onShowQuickBranch({
          type: 'card',
          nodeId: node.id,
          position: {
            x: e.clientX,
            y: e.clientY - 10
          }
        });
      }
    }
  };

  const handleCopy = (e) => {
    e.stopPropagation();
    const copyText = `**研思课题**：${questionText}\n\n**研思结论**：\n${answerText}`;
    navigator.clipboard.writeText(copyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleTriggerStreaming = () => {
    setIsEditingQuestion(false);
    onStartStreaming(node.id);
  };

  const currentRole = BUILTIN_ROLE_HARNESSES.find(r => r.id === node.roleId) || BUILTIN_ROLE_HARNESSES[0];

  // Isolated Card Scrolling: Prevent wheel events on cards from panning the entire canvas
  const handleCardWheel = (e) => {
    if (e.ctrlKey || e.metaKey) return; // Allow pinch-zoom to pass to canvas

    e.stopPropagation();
    const scrollTarget = e.target.closest('.overflow-y-auto, .overflow-auto, textarea') ||
                         cardBodyRef.current?.querySelector('[data-card-scroll="true"], .overflow-y-auto');

    if (scrollTarget) {
      scrollTarget.scrollTop += e.deltaY;
    }
  };

  // Dynamic Card Styles (Liquid Glass vs Legacy Tinted/Ribbon)
  const cardOuterStyle = isLiquid ? {
    transform: `translate3d(${node.x}px, ${node.y}px, 0)`,
    width: node.width || 480,
    zIndex: isSelected ? 30 : 10,
    borderRadius: '20px',
    background: palette.glassBg,
    borderColor: isSelected ? palette.accent : palette.glassBorder,
    borderWidth: '1px',
    borderStyle: 'solid',
    overscrollBehavior: 'contain',
    boxShadow: isSelected
      ? `0 0 0 2px ${palette.accent}, 0 24px 50px -10px rgba(0, 0, 0, 0.18), 0 4px 12px 0 rgba(0, 0, 0, 0.06), inset 0 1px 2px 0 rgba(255, 255, 255, 0.95)`
      : '0 18px 42px -12px rgba(0, 0, 0, 0.13), 0 2px 6px 0 rgba(0, 0, 0, 0.04), inset 0 1px 1.5px 0 rgba(255, 255, 255, 0.85), inset 0 -1px 1px 0 rgba(0, 0, 0, 0.04)',
  } : {
    transform: `translate3d(${node.x}px, ${node.y}px, 0)`,
    width: node.width || 480,
    zIndex: isSelected ? 30 : 10,
    overscrollBehavior: 'contain',
  };

  const cardOuterClass = isLiquid
    ? `group absolute select-text liquid-glass-card ${node.collapsed ? 'h-auto' : ''}`
    : `group absolute select-text rounded-xl transition-all duration-150 border shadow-[0_2px_12px_rgba(0,0,0,0.03)] ${
        isTinted ? palette.cardBg : 'bg-white'
      } ${
        isSelected ? palette.activeBorder : `${palette.border} ${palette.hoverBorder}`
      } ${node.collapsed ? 'h-auto' : ''}`;

  return (
    <div
      id={`node-${node.id}`}
      style={cardOuterStyle}
      onWheel={handleCardWheel}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(node.id);
      }}
      className={cardOuterClass}
    >
      {/* Top Accent Ribbon (When Ribbon Style Enabled) */}
      {isRibbon && !isLiquid && (
        <div className={`h-1 w-full rounded-t-xl ${palette.accentBar}`} />
      )}

      {/* Node Header */}
      <div
        onPointerDown={(e) => {
          if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            onNodePointerDown(e, node.id);
          }
        }}
        className={isLiquid
          ? "px-4 py-3 flex items-center justify-between cursor-grab active:cursor-grabbing select-none transition-colors liquid-glass-header"
          : `px-3.5 py-2.5 border-b border-black/[0.05] flex items-center justify-between cursor-grab active:cursor-grabbing rounded-t-xl select-none transition-colors ${
              isTinted ? palette.headerBg : 'bg-white'
            }`
        }
      >
        <div className="flex items-center gap-2.5">
          {/* Quick Color Picker & Glowing Tint Badge (晾衣绳质感) */}
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowColorPicker(!showColorPicker);
              }}
              className={isLiquid ? "liquid-tint-badge" : "w-3.5 h-3.5 rounded-full ring-1 ring-black/15 shadow-2xs hover:scale-125 transition-transform shrink-0"}
              style={{ 
                backgroundColor: palette.dotColor,
                boxShadow: isLiquid ? `0 0 8px ${palette.dotColor}` : undefined
              }}
              title="自定义卡片色彩"
            />

            {showColorPicker && (
              <div
                onMouseLeave={() => setShowColorPicker(false)}
                className="absolute left-0 top-full mt-2 p-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-black/[0.08] flex items-center gap-2 z-50 animate-in fade-in zoom-in-95 duration-100"
              >
                {COLOR_PALETTE_LIST.map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateContent(node.id, { color: p.id === 'white' ? undefined : p.id });
                      setShowColorPicker(false);
                    }}
                    className={`w-4 h-4 rounded-full hover:scale-125 transition-transform flex items-center justify-center ${
                      node.color === p.id || (!node.color && p.id === palette.id) ? 'ring-2 ring-neutral-900 ring-offset-1' : ''
                    }`}
                    style={{ 
                      backgroundColor: p.dotColor,
                      boxShadow: `0 0 6px ${p.dotColor}88`
                    }}
                    title={p.name}
                  />
                ))}
              </div>
            )}
          </div>

          <span className="text-[12px] font-semibold text-neutral-800 tracking-tight">
            {isBranch ? '分支追问' : '核心课题'}
          </span>

          {node.depth > 0 && (
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full font-medium border ${palette.badgeBg}`}>
              L{node.depth}
            </span>
          )}

          {/* Role selector dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowRoleMenu(!showRoleMenu);
              }}
              className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md text-neutral-700 hover:text-neutral-900 hover:bg-black/5 transition-colors font-medium"
              title="切换推演视角"
            >
              <span>{currentRole.badge}</span>
              <ChevronDown className="w-2.5 h-2.5 opacity-60" />
            </button>

            {showRoleMenu && (
              <div
                onMouseLeave={() => setShowRoleMenu(false)}
                className="absolute left-0 top-full mt-1.5 w-44 bg-white/95 backdrop-blur-xl rounded-xl shadow-xl border border-black/[0.08] p-1.5 z-50 text-xs font-normal space-y-0.5 animate-in fade-in zoom-in-95 duration-100"
              >
                {BUILTIN_ROLE_HARNESSES.map(r => (
                  <button
                    key={r.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateContent(node.id, { roleId: r.id });
                      setShowRoleMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                      node.roleId === r.id ? 'bg-neutral-900 text-white' : 'text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    <span>{r.name}</span>
                    {node.roleId === r.id && <Check className="w-3 h-3 text-white" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {isStreaming && (
            <span className="flex items-center gap-1.5 text-[11px] text-blue-600 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
              推演中...
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          {node.reasoning && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowReasoning(!showReasoning);
              }}
              title={showReasoning ? "隐藏思考过程" : "查看思考过程 (默认隐藏)"}
              className={`p-1.5 rounded-full transition-colors ${
                showReasoning ? 'text-neutral-900 bg-white/60 shadow-2xs' : 'text-neutral-400 hover:text-neutral-800 hover:bg-white/40'
              }`}
            >
              <BrainCircuit className="w-3.5 h-3.5" />
            </button>
          )}

          {hasAnswer && (
            <button
              onClick={handleCopy}
              title="复制完整问答 Markdown"
              className="p-1.5 text-neutral-400 hover:text-neutral-800 hover:bg-white/40 rounded-full transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-neutral-900" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onUpdateContent(node.id, { collapsed: !node.collapsed });
            }}
            title={node.collapsed ? '展开卡片' : '折叠卡片'}
            className="p-1.5 text-neutral-400 hover:text-neutral-800 hover:bg-white/40 rounded-full transition-colors"
          >
            {node.collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(node.id);
            }}
            title="删除卡片"
            className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50/60 rounded-full transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Node Body */}
      {!node.collapsed && (
        <div 
          ref={cardBodyRef}
          onMouseUp={handleMouseUp}
          onClick={handleCardBodyClick}
          className="p-4 space-y-3.5"
        >
          {/* Branch Quote Preview Callout */}
          {node.branchQuote && (
            <div 
              className={isLiquid
                ? "p-3 text-xs text-neutral-700 liquid-glass-quote"
                : `p-2.5 rounded-lg border-l-2 text-xs text-neutral-700 ${isTinted ? palette.questionBg : 'bg-neutral-50/90'} ${palette.border}`}
              style={isLiquid ? { borderLeft: `3px solid ${palette.accent}` } : undefined}
            >
              <div className="text-[10px] text-neutral-400 font-medium tracking-wider mb-0.5">引述前序要点</div>
              <div className="line-clamp-2 italic font-sans leading-relaxed">
                "{node.branchQuote}"
              </div>
            </div>
          )}

          {/* QUESTION SECTION (Capsule style for Liquid Glass) */}
          {(!hasAnswer && !isStreaming) || isEditingQuestion ? (
            <div className="space-y-2.5">
              <textarea
                ref={textareaRef}
                value={questionText}
                onChange={(e) => onUpdateContent(node.id, { question: e.target.value, content: e.target.value })}
                onKeyDown={(e) => {
                  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                    e.preventDefault();
                    handleTriggerStreaming();
                  }
                }}
                placeholder={isBranch ? "输入您基于该要点想深入追问的具体问题..." : "输入核心研究课题或论点..."}
                rows={3}
                className={isLiquid
                  ? "w-full text-xs text-neutral-800 p-3 focus:outline-none focus:ring-1 focus:ring-neutral-900 transition-all resize-none leading-relaxed liquid-glass-input"
                  : `w-full text-xs text-neutral-800 bg-white/80 focus:bg-white border rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-neutral-900 transition-all resize-none leading-relaxed ${palette.border}`}
              />

              <div className="flex items-center justify-between pt-0.5">
                <button
                  type="button"
                  onClick={() => {
                    const template = node.branchQuote
                      ? '深入剖析该引述要点的核心机理、竞争壁垒与潜在边际风险。'
                      : '基于本课题的行业逻辑，全面拆解其商业壁垒、业绩弹性与下阶段观察指标。';
                    onUpdateContent(node.id, { question: template, content: template });
                    onStartStreaming(node.id, template);
                    setIsEditingQuestion(false);
                  }}
                  className="flex items-center gap-1.5 text-[11px] text-neutral-600 hover:text-neutral-900 px-2.5 py-1 rounded-lg hover:bg-white/40 transition-colors font-medium"
                  title="使用买方分析模板推演"
                >
                  <FileText className="w-3.5 h-3.5 text-neutral-500" />
                  <span>模板推演</span>
                </button>

                <div className="flex items-center gap-2">
                  {isEditingQuestion && (
                    <button
                      type="button"
                      onClick={() => setIsEditingQuestion(false)}
                      className="px-2.5 py-1 text-xs text-neutral-500 hover:text-neutral-800 rounded-lg transition-colors"
                    >
                      取消
                    </button>
                  )}
                  <span className="text-[10px] text-neutral-400 font-mono">⌘ ↵</span>
                  <button
                    onClick={handleTriggerStreaming}
                    disabled={!questionText.trim() && !node.branchQuote}
                    className="flex items-center gap-1 px-3.5 py-1.5 bg-[#18181B] hover:bg-[#27272A] active:bg-black disabled:opacity-35 text-white rounded-xl text-xs font-medium transition-all shadow-xs"
                  >
                    <span>{hasAnswer ? '重新推演' : '开始推演'}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Displayed Question Header (Capsule) */
            <div className={isLiquid
              ? "group/q flex items-start justify-between gap-2 p-3 transition-colors liquid-glass-capsule"
              : `group/q flex items-start justify-between gap-2 p-2.5 rounded-lg border transition-colors ${
                  isTinted ? palette.questionBg : 'bg-neutral-50/80'
                } ${palette.border}`}
            >
              <div className="text-xs font-semibold text-neutral-900 leading-snug">
                <span className="text-neutral-400 font-mono mr-1.5 font-normal">Q:</span>
                {questionText}
              </div>
              {!isStreaming && (
                <button
                  onClick={() => setIsEditingQuestion(true)}
                  className="opacity-0 group-hover/q:opacity-100 p-1 text-neutral-400 hover:text-neutral-800 rounded-md transition-opacity shrink-0 hover:bg-white/60"
                  title="修改问题并重新推演"
                >
                  <Edit3 className="w-3 h-3" />
                </button>
              )}
            </div>
          )}

          {/* ANSWER SECTION (Shown when streaming or answer exists) */}
          {(hasAnswer || isStreaming) && (
            <div className="space-y-3 pt-1">
              {/* Optional Reasoning View (Hidden by default; toggled via header brain icon) */}
              {showReasoning && node.reasoning && (
                <div 
                  data-card-scroll="true"
                  style={{ overscrollBehavior: 'contain' }}
                  className="p-3 rounded-xl border border-white/60 bg-white/40 text-neutral-600 font-mono text-[11px] max-h-40 overflow-y-auto whitespace-pre-wrap leading-relaxed select-text shadow-inner custom-scrollbar"
                >
                  <div className="text-[10px] text-neutral-400 font-sans font-medium mb-1">思考过程</div>
                  {node.reasoning}
                </div>
              )}

              {/* Rendered Answer Markdown */}
              <div 
                data-card-scroll="true"
                style={{ overscrollBehavior: 'contain' }}
                className="min-h-[60px] max-h-[480px] overflow-y-auto pr-1.5 custom-scrollbar"
              >
                {answerText ? (
                  <div
                    className="markdown-body select-text"
                    dangerouslySetInnerHTML={{ __html: renderMarkdownWithMath(answerText) }}
                  />
                ) : (
                  <div className="text-xs text-neutral-400 italic py-4 text-center flex items-center justify-center gap-2">
                    {isStreaming ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-neutral-400 animate-ping"></span>
                        <span>推演中...</span>
                      </>
                    ) : '等待开始推演...'}
                  </div>
                )}
                {isStreaming && <span className="typing-cursor"></span>}
              </div>

              {/* Bottom Action Footer */}
              <div className="pt-2.5 border-t border-black/[0.05] flex items-center justify-between text-xs">
                {isStreaming ? (
                  <button
                    onClick={() => onStopStreaming(node.id)}
                    className="flex items-center gap-1.5 text-neutral-600 hover:text-neutral-900 font-medium text-xs px-2.5 py-1 rounded-lg hover:bg-white/40 transition-colors"
                  >
                    <StopCircle className="w-3.5 h-3.5" />
                    停止
                  </button>
                ) : (
                  <div className="text-[10px] text-neutral-500 font-normal">
                    划选答案文字即可追问分支
                  </div>
                )}

                {!isStreaming && (
                  <button
                    onClick={() => onBranchFromCard(node.id)}
                    className={isLiquid
                      ? "flex items-center gap-1.5 px-3 py-1.5 text-neutral-700 hover:text-neutral-900 rounded-xl font-medium transition-all text-xs border border-white/70 shadow-2xs bg-white/60 hover:bg-white/85 backdrop-blur-sm"
                      : "flex items-center gap-1 px-2.5 py-1 text-neutral-700 hover:text-neutral-900 hover:bg-black/5 rounded-md font-medium transition-colors text-xs border border-neutral-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)] bg-white/70 backdrop-blur-xs"}
                    title="基于本卡片整体结论发起分支追问"
                  >
                    <GitBranch className="w-3 h-3 text-neutral-500" />
                    <span>新建分支追问</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4 Cardinal Adaptive Connector Ports */}
      {/* Right Port */}
      <div 
        onPointerDown={(e) => {
          e.stopPropagation();
          onStartDragConnector(e, node.id, 'right');
        }}
        className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-neutral-800 hover:bg-black border-2 border-white shadow-xs hover:scale-125 transition-all cursor-crosshair opacity-0 group-hover:opacity-100 z-20"
        title="向右衍生分支追问"
      />

      {/* Bottom Port */}
      <div 
        onPointerDown={(e) => {
          e.stopPropagation();
          onStartDragConnector(e, node.id, 'bottom');
        }}
        className="absolute left-1/2 -bottom-1.5 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-neutral-800 hover:bg-black border-2 border-white shadow-xs hover:scale-125 transition-all cursor-crosshair opacity-0 group-hover:opacity-100 z-20"
        title="向下衍生分支追问"
      />

      {/* Left Port */}
      <div 
        onPointerDown={(e) => {
          e.stopPropagation();
          onStartDragConnector(e, node.id, 'left');
        }}
        className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-neutral-800 hover:bg-black border-2 border-white shadow-xs hover:scale-125 transition-all cursor-crosshair opacity-0 group-hover:opacity-100 z-20"
        title="向左衍生分支追问"
      />

      {/* Top Port */}
      <div 
        onPointerDown={(e) => {
          e.stopPropagation();
          onStartDragConnector(e, node.id, 'top');
        }}
        className="absolute left-1/2 -top-1.5 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-neutral-800 hover:bg-black border-2 border-white shadow-xs hover:scale-125 transition-all cursor-crosshair opacity-0 group-hover:opacity-100 z-20"
        title="向上衍生分支追问"
      />
    </div>
  );
}
