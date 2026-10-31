import React, { useState } from 'react';
import { 
  Plus, 
  Hand, 
  MousePointer, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Settings, 
  FolderKanban, 
  Download, 
  ChevronDown,
  BrainCircuit,
  FileSpreadsheet,
  FileText,
  FileCode,
  Key,
  Palette
} from 'lucide-react';

export default function Toolbar({
  activeTool,
  setActiveTool,
  zoom,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onFitView,
  onAddRootQuestion,
  onOpenSettings,
  onOpenAppearance,
  onOpenHarness,
  onOpenDrafts,
  currentProjectTitle,
  currentModelName,
  hasApiKey,
  activeRoleName,
  antiSlopEnabled,
  onExportObsidian,
  onExportMarkdown,
  onExportJson
}) {
  const [showExportMenu, setShowExportMenu] = useState(false);

  return (
    <div className="absolute top-4 inset-x-0 z-40 flex items-center justify-between px-6 pointer-events-none select-none">
      {/* Left: Brand + Project & New Question */}
      <div className="flex items-center gap-2 pointer-events-auto">
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/80 backdrop-blur-xl border border-black/[0.07] rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.03)] text-xs font-semibold text-neutral-900 tracking-tight">
          <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20"></span>
          <span>ThreadCanvas</span>
        </div>

        <button
          onClick={onOpenDrafts}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/80 backdrop-blur-xl border border-black/[0.07] rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:bg-white transition-all text-xs font-medium text-neutral-800"
        >
          <FolderKanban className="w-3.5 h-3.5 text-neutral-500" />
          <span className="max-w-[150px] truncate">{currentProjectTitle || '未命名研思'}</span>
          <ChevronDown className="w-3 h-3 text-neutral-400" />
        </button>

        <button
          onClick={onAddRootQuestion}
          className="flex items-center gap-1 px-3 py-1.5 bg-[#18181B] hover:bg-[#27272A] active:bg-black text-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all text-xs font-medium"
        >
          <Plus className="w-3.5 h-3.5" />
          提问
        </button>
      </div>

      {/* Middle: Canvas Nav Controls (Apple Segmented Style) */}
      <div className="flex items-center gap-0.5 bg-white/80 backdrop-blur-xl border border-black/[0.07] p-1 rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.03)] pointer-events-auto">
        <button
          onClick={() => setActiveTool('select')}
          title="选择 (V)"
          className={`p-1.5 rounded-md transition-colors ${
            activeTool === 'select' ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          <MousePointer className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => setActiveTool('pan')}
          title="平移 (H / 空格拖动)"
          className={`p-1.5 rounded-md transition-colors ${
            activeTool === 'pan' ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          <Hand className="w-3.5 h-3.5" />
        </button>

        <div className="w-[1px] h-3.5 bg-neutral-200 mx-1"></div>

        <button
          onClick={onZoomOut}
          title="缩小"
          className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onResetZoom}
          title="重置缩放"
          className="px-1.5 py-0.5 text-[11px] font-mono text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded transition-colors"
        >
          {Math.round(zoom * 100)}%
        </button>

        <button
          onClick={onZoomIn}
          title="放大"
          className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>

        <div className="w-[1px] h-3.5 bg-neutral-200 mx-1"></div>

        <button
          onClick={onFitView}
          title="适应视图"
          className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Right: Lens / Model & Key / Export / Settings */}
      <div className="flex items-center gap-1.5 pointer-events-auto">
        {/* Harness Lens Button */}
        <button
          onClick={onOpenHarness}
          title="投研视角与记忆公理"
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/80 backdrop-blur-xl border border-black/[0.07] rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:bg-white text-xs font-medium text-neutral-700 transition-all"
        >
          <BrainCircuit className="w-3.5 h-3.5 text-neutral-500" />
          <span>{activeRoleName || '反共识'}</span>
          {antiSlopEnabled && (
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-700" title="反套话铁律生效中"></span>
          )}
        </button>

        {/* Model Indicator & Key Entry */}
        {!hasApiKey ? (
          <button
            onClick={onOpenSettings}
            title="点击设置 API Key 即可启动推演 (支持 Claude / GLM / DeepSeek / OpenAI)"
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-900 rounded-lg shadow-[0_2px_8px_rgba(245,158,11,0.06)] transition-all text-xs font-medium"
          >
            <Key className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            <span className="text-[11px]">填入 API Key</span>
          </button>
        ) : (
          <button
            onClick={onOpenSettings}
            title="点击切换模型或 API Key (支持 Claude / GLM / DeepSeek / OpenAI)"
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/80 backdrop-blur-xl border border-black/[0.07] rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:bg-white text-xs font-mono text-neutral-700 hover:text-neutral-900 transition-all max-w-[160px] truncate"
          >
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${String(currentModelName).toLowerCase().includes('claude') ? 'bg-purple-600 ring-2 ring-purple-600/20' : 'bg-emerald-500 ring-2 ring-emerald-500/20'}`}></span>
            <span className="truncate">{currentModelName || 'glm-5.3'}</span>
          </button>
        )}

        {/* Export Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-white/80 backdrop-blur-xl border border-black/[0.07] rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:bg-white text-xs font-medium text-neutral-700 transition-all"
          >
            <Download className="w-3.5 h-3.5 text-neutral-500" />
            <span>导出</span>
            <ChevronDown className="w-2.5 h-2.5 opacity-60" />
          </button>

          {showExportMenu && (
            <div 
              onMouseLeave={() => setShowExportMenu(false)}
              className="absolute right-0 mt-1.5 w-44 bg-white rounded-lg shadow-lg border border-black/[0.08] p-1 z-50 text-xs font-normal space-y-0.5 animate-in fade-in duration-100"
            >
              <button
                onClick={() => {
                  onExportObsidian();
                  setShowExportMenu(false);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-neutral-100 text-neutral-700 transition-colors text-left"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-neutral-500" />
                <span>Obsidian (.canvas)</span>
              </button>

              <button
                onClick={() => {
                  onExportMarkdown();
                  setShowExportMenu(false);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-neutral-100 text-neutral-700 transition-colors text-left"
              >
                <FileText className="w-3.5 h-3.5 text-neutral-500" />
                <span>Markdown 研报 (.md)</span>
              </button>

              <button
                onClick={() => {
                  onExportJson();
                  setShowExportMenu(false);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-neutral-100 text-neutral-700 transition-colors text-left"
              >
                <FileCode className="w-3.5 h-3.5 text-neutral-500" />
                <span>工程备份 (.canvasproj)</span>
              </button>
            </div>
          )}
        </div>

        {/* Appearance Settings */}
        <button
          onClick={onOpenAppearance}
          title="卡片色彩与外观设置"
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/80 backdrop-blur-xl border border-black/[0.07] rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:bg-white text-xs font-medium text-neutral-700 hover:text-neutral-900 transition-all"
        >
          <Palette className="w-3.5 h-3.5 text-neutral-500" />
          <span>外观</span>
        </button>

        {/* Settings */}
        <button
          onClick={onOpenSettings}
          title="系统设定"
          className="p-1.5 bg-white/80 backdrop-blur-xl border border-black/[0.07] rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:bg-white text-neutral-500 hover:text-neutral-900 transition-all"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
