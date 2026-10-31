import React from 'react';
import { GitBranch } from 'lucide-react';

export default function FloatingSelectionToolbar({ position, selectedText, onBranch, onClose }) {
  if (!position || !selectedText) return null;

  return (
    <div
      className="fixed z-50 transform -translate-x-1/2 -translate-y-full mb-2 pointer-events-auto transition-all animate-in fade-in duration-100"
      style={{ left: position.x, top: position.y }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="flex items-center gap-2 bg-[#18181B] text-white px-2.5 py-1 rounded-lg shadow-xl border border-white/10 text-xs font-normal">
        <span className="text-neutral-400 max-w-[140px] truncate">
          "{selectedText.trim()}"
        </span>
        <button
          onClick={() => {
            onBranch(selectedText);
            if (onClose) onClose();
          }}
          className="flex items-center gap-1 bg-white hover:bg-neutral-100 active:bg-neutral-200 text-neutral-900 px-2 py-0.5 rounded font-medium transition-colors text-xs"
        >
          <GitBranch className="w-3 h-3 text-neutral-800" />
          基于此追问
        </button>
      </div>
    </div>
  );
}
