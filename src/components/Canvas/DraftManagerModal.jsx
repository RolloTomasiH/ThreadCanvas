import React, { useState } from 'react';
import { 
  X, 
  FolderKanban, 
  Plus, 
  FileText, 
  Trash2, 
  FileSpreadsheet, 
  FileCode,
  Upload,
  RotateCcw
} from 'lucide-react';
import { exportToObsidianCanvas, exportToMarkdownOutline, downloadFile } from '../../services/canvasExporter';

export default function DraftManagerModal({
  isOpen,
  onClose,
  projects,
  currentProjectId,
  onSelectProject,
  onCreateProject,
  onDeleteProject,
  onRestoreDefaultCanvases,
  onImportProject,
  currentCanvasData
}) {
  const [newTitle, setNewTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  if (!isOpen) return null;

  const currentProject = projects.find(p => p.id === currentProjectId);

  const categories = ['all', ...Array.from(new Set(projects.map(p => p.category || '自建研究')))];
  const filteredProjects = selectedCategory === 'all' 
    ? projects 
    : projects.filter(p => (p.category || '自建研究') === selectedCategory);

  const handleCreate = () => {
    if (!newTitle.trim()) return;
    onCreateProject(newTitle.trim());
    setNewTitle('');
    setIsCreating(false);
  };

  const handleExportObsidian = () => {
    if (!currentCanvasData) return;
    const canvasJson = exportToObsidianCanvas(currentCanvasData.nodes, currentCanvasData.edges);
    const fileName = `${currentProject?.title || '研思画布'}.canvas`;
    downloadFile(canvasJson, fileName, 'application/json');
  };

  const handleExportMarkdown = () => {
    if (!currentCanvasData) return;
    const md = exportToMarkdownOutline(currentCanvasData.nodes, currentCanvasData.edges, currentProject?.title);
    const fileName = `${currentProject?.title || '研思研报'}.md`;
    downloadFile(md, fileName, 'text/markdown;charset=utf-8');
  };

  const handleExportProjectJson = () => {
    if (!currentCanvasData) return;
    const payload = JSON.stringify({
      version: '1.0',
      title: currentProject?.title || '研思画布',
      nodes: currentCanvasData.nodes,
      edges: currentCanvasData.edges,
      viewport: currentCanvasData.viewport,
      exportedAt: new Date().toISOString()
    }, null, 2);
    downloadFile(payload, `${currentProject?.title || '研思项目'}.canvasproj`, 'application/json');
  };

  const handleFileImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        onImportProject(parsed);
      } catch (err) {
        alert('导入失败：不是合法的画布工程 JSON 文件');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-black/[0.08] overflow-hidden flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-black/[0.06] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <FolderKanban className="w-4 h-4 text-neutral-700" />
            <h2 className="text-xs font-semibold text-neutral-900">投研画布研究库 ({projects.length})</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-700 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Quick Export Panel */}
          <div className="p-3.5 rounded-lg border border-black/[0.06] bg-neutral-50/70">
            <div className="text-[11px] font-semibold text-neutral-700 mb-2 flex items-center justify-between">
              <span>导出当前草稿 ({currentProject?.title})</span>
              <span className="text-[10px] text-neutral-400 font-mono font-normal">
                {currentCanvasData?.nodes?.length || 0} 节点 · {currentCanvasData?.edges?.length || 0} 关联
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={handleExportObsidian}
                className="flex items-center gap-2 p-2 bg-white hover:bg-neutral-100 border border-black/[0.06] rounded-lg text-left transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4 text-neutral-600" />
                <div>
                  <div className="text-xs font-medium text-neutral-800">Obsidian</div>
                  <div className="text-[10px] text-neutral-400">.canvas 文件</div>
                </div>
              </button>

              <button
                onClick={handleExportMarkdown}
                className="flex items-center gap-2 p-2 bg-white hover:bg-neutral-100 border border-black/[0.06] rounded-lg text-left transition-colors"
              >
                <FileText className="w-4 h-4 text-neutral-600" />
                <div>
                  <div className="text-xs font-medium text-neutral-800">Markdown</div>
                  <div className="text-[10px] text-neutral-400">研报大纲 .md</div>
                </div>
              </button>

              <button
                onClick={handleExportProjectJson}
                className="flex items-center gap-2 p-2 bg-white hover:bg-neutral-100 border border-black/[0.06] rounded-lg text-left transition-colors"
              >
                <FileCode className="w-4 h-4 text-neutral-600" />
                <div>
                  <div className="text-xs font-medium text-neutral-800">工程备份</div>
                  <div className="text-[10px] text-neutral-400">.canvasproj</div>
                </div>
              </button>
            </div>
          </div>

          {/* Project List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-neutral-700">研究课题</span>
                {/* Category Pills */}
                <div className="flex items-center gap-1 overflow-x-auto">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-2 py-0.5 rounded text-[10px] transition-colors ${
                        selectedCategory === cat 
                          ? 'bg-neutral-900 text-white font-medium' 
                          : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100'
                      }`}
                    >
                      {cat === 'all' ? '全部' : cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={onRestoreDefaultCanvases}
                  title="恢复所有精选投研画布"
                  className="text-[11px] text-neutral-500 hover:text-neutral-800 px-2 py-1 rounded border border-neutral-200 hover:bg-neutral-50 transition-colors flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  重载精选
                </button>

                <label className="cursor-pointer text-[11px] text-neutral-600 hover:text-neutral-900 px-2 py-1 rounded border border-neutral-200 hover:bg-neutral-50 transition-colors flex items-center gap-1">
                  <Upload className="w-3 h-3" />
                  导入
                  <input type="file" accept=".json,.canvasproj" onChange={handleFileImport} className="hidden" />
                </label>

                <button
                  onClick={() => setIsCreating(true)}
                  className="text-[11px] bg-[#18181B] hover:bg-[#27272A] text-white px-2.5 py-1 rounded font-medium transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  新建
                </button>
              </div>
            </div>

            {/* Create Input Box */}
            {isCreating && (
              <div className="p-2 mb-2 bg-neutral-50 rounded-lg border border-black/[0.08] flex items-center gap-1.5">
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                  placeholder="输入课题名称..."
                  autoFocus
                  className="flex-1 text-xs px-2.5 py-1.5 border border-neutral-200 rounded focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-white"
                />
                <button
                  onClick={handleCreate}
                  className="px-2.5 py-1.5 bg-[#18181B] text-white rounded text-xs font-medium"
                >
                  创建
                </button>
                <button
                  onClick={() => setIsCreating(false)}
                  className="px-2 py-1.5 text-neutral-500 hover:bg-neutral-200 rounded text-xs"
                >
                  取消
                </button>
              </div>
            )}

            {/* Project Cards */}
            <div className="space-y-1.5 max-h-60 overflow-y-auto">
              {filteredProjects.map(proj => {
                const isActive = proj.id === currentProjectId;
                return (
                  <div
                    key={proj.id}
                    onClick={() => {
                      onSelectProject(proj.id);
                      onClose();
                    }}
                    className={`p-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                      isActive
                        ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                        : 'border-black/[0.06] hover:border-black/[0.12] bg-white text-neutral-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileText className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-neutral-400'}`} />
                      <div className="min-w-0">
                        <div className="text-xs font-medium flex items-center gap-2">
                          <span className="truncate">{proj.title}</span>
                          {proj.category && (
                            <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono flex-shrink-0 ${
                              isActive ? 'bg-neutral-800 text-neutral-300' : 'bg-neutral-100 text-neutral-600'
                            }`}>
                              {proj.category}
                            </span>
                          )}
                        </div>
                        <div className={`text-[10px] mt-0.5 ${isActive ? 'text-neutral-400' : 'text-neutral-400'}`}>
                          {proj.nodes?.length || proj.nodeCount || 0} 节点 · {proj.updatedAt ? new Date(proj.updatedAt).toLocaleDateString() : '刚刚'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                      {isActive && (
                        <span className="text-[10px] font-mono text-neutral-300 px-1.5 py-0.5 bg-neutral-800 rounded">
                          当前活跃
                        </span>
                      )}
                      {projects.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`确定删除草稿 "${proj.title}" 吗？`)) {
                              onDeleteProject(proj.id);
                            }
                          }}
                          className={`p-1 rounded transition-colors ${
                            isActive ? 'text-neutral-400 hover:text-white' : 'text-neutral-400 hover:text-rose-600'
                          }`}
                          title="删除"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-2.5 border-t border-black/[0.06] flex items-center justify-end bg-neutral-50">
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 rounded-md text-xs font-medium transition-colors"
          >
            完成
          </button>
        </div>
      </div>
    </div>
  );
}
