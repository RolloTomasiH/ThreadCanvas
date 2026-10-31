import React, { useState, useEffect, useRef } from 'react';
import { GitBranch, CornerDownRight, X, FileText, Send, MessageSquarePlus } from 'lucide-react';

export default function FloatingQuickBranchPopover({ 
  popoverData, 
  onBranchFromQuote, 
  onBranchFromCard, 
  onClose 
}) {
  const [customQuery, setCustomQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (popoverData) {
      setCustomQuery('');
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [popoverData]);

  if (!popoverData || !popoverData.position) return null;

  const { type, nodeId, text, position } = popoverData;

  const handleSubmitQuery = () => {
    const trimmed = customQuery.trim();
    if (type === 'selection') {
      // If user typed custom query, auto-execute with their question;
      // if empty, create blank question node for on-canvas typing
      onBranchFromQuote(text, nodeId, trimmed, Boolean(trimmed));
    } else {
      onBranchFromCard(nodeId, trimmed, Boolean(trimmed));
    }
    if (onClose) onClose();
  };

  const handleAutoDeduce = () => {
    // Secondary action: automatic system template deduction
    if (type === 'selection') {
      onBranchFromQuote(text, nodeId, '', true);
    } else {
      onBranchFromCard(nodeId, '', true);
    }
    if (onClose) onClose();
  };

  // Keep within viewport horizontally
  const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const clampedX = Math.max(190, Math.min(position.x, screenWidth - 190));
  const clampedY = Math.max(70, position.y);

  return (
    <div
      className="fixed z-50 transform -translate-x-1/2 -translate-y-full mb-3 pointer-events-auto transition-all animate-in fade-in zoom-in-95 duration-150"
      style={{ left: clampedX, top: clampedY }}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="bg-[#18181B]/95 backdrop-blur-xl text-white p-3.5 rounded-xl shadow-2xl border border-white/15 text-xs w-[360px]">
        {/* Header */}
        <div className="flex items-center justify-between text-neutral-300 mb-2">
          <span className="font-semibold text-white text-[12px] flex items-center gap-1.5">
            <GitBranch className="w-3.5 h-3.5 text-neutral-300" />
            {type === 'selection' ? '基于选中文字追问' : '基于此卡片追问'}
          </span>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-0.5 rounded transition-colors"
            title="关闭 (Esc)"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Quote Preview (if text selected) */}
        {type === 'selection' && text && (
          <div className="text-[11px] text-neutral-300 italic line-clamp-2 bg-white/5 rounded-lg px-2.5 py-1.5 border border-white/10 mb-2 leading-relaxed">
            "{text.trim()}"
          </div>
        )}

        {/* User Question Input Box (Primary focus) */}
        <div className="space-y-1 mb-2.5">
          <textarea
            ref={inputRef}
            value={customQuery}
            onChange={(e) => setCustomQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                onClose();
              } else if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmitQuery();
              }
            }}
            placeholder={
              type === 'selection'
                ? "输入您想针对此观点深入追问的具体问题..."
                : "输入您基于此卡片想进一步推演的核心课题..."
            }
            rows={2}
            className="w-full text-xs text-white bg-white/10 placeholder-neutral-400 border border-white/15 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-white/40 focus:border-white/40 transition-all resize-none leading-relaxed"
          />
        </div>

        {/* Action Buttons: Left is Secondary (Auto-deduce), Right is Primary (User Query) */}
        <div className="flex items-center justify-between pt-1 border-t border-white/10">
          <button
            type="button"
            onClick={handleAutoDeduce}
            className="flex items-center gap-1.5 text-[11px] text-neutral-400 hover:text-white px-2 py-1 rounded transition-colors bg-white/5 hover:bg-white/10 border border-white/10"
            title="使用预设买方模板推演"
          >
            <FileText className="w-3 h-3 text-neutral-400" />
            <span>模板推演</span>
          </button>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onClose}
              className="px-2 py-1 text-neutral-400 hover:text-white text-[11px] rounded transition-colors"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleSubmitQuery}
              className="flex items-center gap-1 bg-white hover:bg-neutral-100 active:bg-neutral-200 text-neutral-900 px-3 py-1.5 rounded-lg font-medium text-xs transition-colors shadow-sm"
            >
              <Send className="w-3 h-3 text-neutral-900" />
              <span>{customQuery.trim() ? '发送追问' : '创建追问卡片'}</span>
              <span className="text-[9px] text-neutral-500 font-mono ml-0.5">↵</span>
            </button>
          </div>
        </div>
      </div>

      {/* Downward Pointer Triangle */}
      <div className="w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-[#18181B] mx-auto -mt-[1px]"></div>
    </div>
  );
}
