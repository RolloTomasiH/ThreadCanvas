import React, { useState, useEffect } from 'react';
import { 
  X, 
  BrainCircuit, 
  Check, 
  Sliders
} from 'lucide-react';
import { 
  BUILTIN_ROLE_HARNESSES, 
  getStoredHarnessSettings, 
  saveStoredHarnessSettings 
} from '../../services/harness';

export default function HarnessModal({
  isOpen,
  onClose,
  currentProjectId,
  onHarnessUpdated
}) {
  const [activeTab, setActiveTab] = useState('roles');
  const [harnessCfg, setHarnessCfg] = useState(getStoredHarnessSettings());
  const [selectedRoleId, setSelectedRoleId] = useState(harnessCfg.defaultRoleId || 'devil-advocate');
  const [projectMemory, setProjectMemory] = useState(harnessCfg.projectMemories?.[currentProjectId] || '');
  const [antiSlopEnabled, setAntiSlopEnabled] = useState(harnessCfg.antiSlopEnabled !== false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const stored = getStoredHarnessSettings();
      setHarnessCfg(stored);
      setSelectedRoleId(stored.defaultRoleId || 'devil-advocate');
      setProjectMemory(stored.projectMemories?.[currentProjectId] || '');
      setAntiSlopEnabled(stored.antiSlopEnabled !== false);
      setSavedSuccess(false);
    }
  }, [isOpen, currentProjectId]);

  if (!isOpen) return null;

  const allRoles = [...BUILTIN_ROLE_HARNESSES, ...(harnessCfg.customRoles || [])];
  const activeRole = allRoles.find(r => r.id === selectedRoleId) || allRoles[0];

  const handleSave = () => {
    const updated = {
      ...harnessCfg,
      defaultRoleId: selectedRoleId,
      antiSlopEnabled: antiSlopEnabled,
      projectMemories: {
        ...(harnessCfg.projectMemories || {}),
        [currentProjectId]: projectMemory
      }
    };
    setHarnessCfg(updated);
    saveStoredHarnessSettings(updated);
    if (onHarnessUpdated) onHarnessUpdated(updated);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 500);
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
            <BrainCircuit className="w-4 h-4 text-neutral-700" />
            <h2 className="text-xs font-semibold text-neutral-900">投研思考脚手架 (Harness) 与记忆中枢</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-700 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-5 pt-2.5 border-b border-black/[0.06] flex items-center gap-4 bg-white text-xs font-medium">
          <button
            onClick={() => setActiveTab('roles')}
            className={`pb-2 flex items-center gap-1.5 border-b-2 transition-colors ${
              activeTab === 'roles' ? 'border-neutral-900 text-neutral-900' : 'border-transparent text-neutral-400 hover:text-neutral-700'
            }`}
          >
            视角矩阵 ({allRoles.length})
          </button>
          <button
            onClick={() => setActiveTab('memory')}
            className={`pb-2 flex items-center gap-1.5 border-b-2 transition-colors ${
              activeTab === 'memory' ? 'border-neutral-900 text-neutral-900' : 'border-transparent text-neutral-400 hover:text-neutral-700'
            }`}
          >
            课题公理与背景记忆
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs flex-1">
          {activeTab === 'roles' ? (
            <div className="grid grid-cols-12 gap-4">
              {/* Role List */}
              <div className="col-span-5 space-y-1 pr-2 border-r border-black/[0.06] max-h-[380px] overflow-y-auto">
                {allRoles.map(role => {
                  const isSelected = selectedRoleId === role.id;
                  return (
                    <div
                      key={role.id}
                      onClick={() => setSelectedRoleId(role.id)}
                      className={`p-2 rounded-lg cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-neutral-900 text-white'
                          : 'hover:bg-neutral-100 text-neutral-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{role.name}</span>
                        <span className={`text-[10px] font-mono px-1 rounded ${
                          isSelected ? 'text-neutral-400' : 'text-neutral-400'
                        }`}>
                          {role.badge}
                        </span>
                      </div>
                      <div className={`text-[10px] mt-0.5 line-clamp-1 ${
                        isSelected ? 'text-neutral-300' : 'text-neutral-400'
                      }`}>
                        {role.description}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Role Detail */}
              <div className="col-span-7 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-semibold text-neutral-900 mb-1">
                    {activeRole.name}
                  </div>
                  <p className="text-[11px] text-neutral-500 mb-2.5 leading-relaxed">{activeRole.description}</p>
                  
                  <div className="p-3 bg-neutral-50 rounded-lg border border-black/[0.06] text-[11px] font-mono text-neutral-600 leading-relaxed whitespace-pre-wrap max-h-[260px] overflow-y-auto select-text">
                    {activeRole.prompt}
                  </div>
                </div>

                <div className="text-[10px] text-neutral-400 mt-2">
                  提示：可在卡片提问框上方单独为单个节点指定不同视角。
                </div>
              </div>
            </div>
          ) : (
            /* Memory & Rules */
            <div className="space-y-4">
              {/* Anti-Slop Toggle */}
              <div className="p-3.5 rounded-lg border border-black/[0.06] bg-neutral-50 flex items-start justify-between">
                <div>
                  <div className="text-xs font-semibold text-neutral-900">
                    反 AI 套话去脂铁律 (Anti-AI-Slop)
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-0.5 leading-relaxed">
                    全面严禁“亮眼、严苛、不可忽视、颠覆性、里程碑、赋能、值得注意的是、不仅是更是”等套话修饰。强制事实直陈与数据因果链。
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer ml-4 mt-0.5">
                  <input
                    type="checkbox"
                    checked={antiSlopEnabled}
                    onChange={(e) => setAntiSlopEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-neutral-900"></div>
                </label>
              </div>

              {/* Working Memory */}
              <div>
                <label className="block text-xs font-semibold text-neutral-800 mb-1">
                  当前课题常驻公理与背景记忆 (Working Axioms)
                </label>
                <textarea
                  rows={6}
                  value={projectMemory}
                  onChange={(e) => setProjectMemory(e.target.value)}
                  placeholder="输入当前课题的常驻工作公理与基准假设（例如：跟踪标的拓荆科技；假设2027年国内先进制程资本开支持平；严格按基准/保守/乐观三场景分析）..."
                  className="w-full text-xs leading-relaxed p-2.5 border border-black/[0.08] rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-white resize-none font-sans"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-black/[0.06] flex items-center justify-between bg-neutral-50">
          <div className="text-[11px] text-neutral-500">
            活跃视角：<span className="font-semibold text-neutral-800">{activeRole.name}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 rounded-md transition-colors"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1 px-4 py-1.5 bg-[#18181B] hover:bg-[#27272A] text-white text-xs font-medium rounded-lg transition-colors"
            >
              {savedSuccess ? <Check className="w-3.5 h-3.5 text-white" /> : null}
              {savedSuccess ? '已生效' : '应用'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
