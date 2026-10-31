import React, { useState, useEffect } from 'react';
import { 
  X, 
  Palette, 
  Check, 
  RotateCcw
} from 'lucide-react';
import { 
  DEFAULT_APPEARANCE_SETTINGS, 
  COLOR_PALETTES, 
  COLOR_PALETTE_LIST, 
  CANVAS_BACKGROUNDS,
  resolveCardPalette 
} from '../../services/cardTheme';

export default function AppearanceModal({
  isOpen,
  onClose,
  appearanceSettings,
  onAppearanceUpdated
}) {
  const [settings, setSettings] = useState(appearanceSettings || DEFAULT_APPEARANCE_SETTINGS);

  useEffect(() => {
    if (isOpen) {
      setSettings(appearanceSettings || DEFAULT_APPEARANCE_SETTINGS);
    }
  }, [isOpen, appearanceSettings]);

  if (!isOpen) return null;

  const handleUpdate = (partial) => {
    const updated = { ...settings, ...partial };
    setSettings(updated);
    if (onAppearanceUpdated) onAppearanceUpdated(updated);
  };

  const handleReset = () => {
    setSettings(DEFAULT_APPEARANCE_SETTINGS);
    if (onAppearanceUpdated) onAppearanceUpdated(DEFAULT_APPEARANCE_SETTINGS);
  };

  const themeModes = [
    {
      id: 'depth-spectrum',
      name: '分支彩谱',
      colors: ['#0284C7', '#059669', '#7C3AED', '#D97706']
    },
    {
      id: 'role-semantic',
      name: '视角语义',
      colors: ['#E11D48', '#D97706', '#7C3AED', '#0284C7']
    },
    {
      id: 'pastel-rainbow',
      name: '自然多彩',
      colors: ['#D97706', '#059669', '#0284C7', '#E11D48']
    },
    {
      id: 'classic-white',
      name: '极简白',
      colors: ['#E4E4E7', '#D4D4D8', '#A1A1AA', '#71717A']
    }
  ];

  const cardStyles = [
    { id: 'liquid-glass', name: '流光玻璃' },
    { id: 'tinted-surface', name: '柔和淡彩' },
    { id: 'top-ribbon', name: '顶部彩带' },
    { id: 'minimal-border', name: '边框微彩' }
  ];

  // Preview palettes for mock cards
  const mockCard0 = { id: 'mock-0', depth: 0, roleId: 'first-principles' };
  const mockCard1 = { id: 'mock-1', depth: 1, roleId: 'devil-advocate' };
  const palette0 = resolveCardPalette(mockCard0, settings);
  const palette1 = resolveCardPalette(mockCard1, settings);

  const isLiquid = settings.cardStyle === 'liquid-glass';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-black/[0.08] overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-black/[0.06] flex items-center justify-between bg-white/90 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-neutral-800" />
            <h2 className="text-xs font-semibold text-neutral-900">外观设置</h2>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleReset}
              className="flex items-center gap-1 px-2 py-1 text-[11px] text-neutral-500 hover:text-neutral-900 rounded hover:bg-neutral-100 transition-colors"
              title="重置为默认"
            >
              <RotateCcw className="w-3 h-3" />
              <span>重置</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-neutral-400 hover:text-neutral-700 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Live Preview Box */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-neutral-700 block">
              效果预览
            </label>
            <div 
              className="p-4 rounded-xl border border-black/[0.06] flex items-center justify-center gap-3 relative overflow-hidden"
              style={{
                backgroundColor: settings.canvasBg === 'dark-studio' ? '#121214' : '#F5F5F7',
                backgroundImage: 'radial-gradient(rgba(0, 0, 0, 0.12) 1.2px, transparent 1.2px)',
                backgroundSize: '24px 24px'
              }}
            >
              {/* Mock Card 1 */}
              <div 
                className={`w-44 p-3.5 transition-all relative ${
                  isLiquid 
                    ? 'rounded-[18px]' 
                    : `rounded-xl border ${settings.cardStyle === 'tinted-surface' ? palette0.cardBg : 'bg-white'} ${palette0.border}`
                }`}
                style={isLiquid ? {
                  background: palette0.glassBg,
                  borderColor: palette0.glassBorder,
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  boxShadow: '0 14px 32px -8px rgba(0, 0, 0, 0.14), inset 0 1px 1.5px 0 rgba(255, 255, 255, 0.85)',
                  backdropFilter: 'blur(36px) saturate(200%) brightness(1.04)',
                  WebkitBackdropFilter: 'blur(36px) saturate(200%) brightness(1.04)'
                } : undefined}
              >
                {settings.cardStyle === 'top-ribbon' && (
                  <div className={`h-1 -mx-3.5 -mt-3.5 mb-2 rounded-t-xl ${palette0.accentBar}`} />
                )}
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium border ${palette0.badgeBg}`}>
                    L0 核心课题
                  </span>
                  <span 
                    className="w-2.5 h-2.5 rounded-full" 
                    style={{ 
                      backgroundColor: palette0.dotColor,
                      boxShadow: `0 0 8px ${palette0.dotColor}`
                    }} 
                  />
                </div>
                <div className="text-[11px] font-semibold text-neutral-900 mb-1 leading-snug">
                  半导体设备薄膜沉积...
                </div>
                <div className="text-[10px] text-neutral-600 line-clamp-2 leading-relaxed">
                  物理极限与ALD先进制程渗透测算已生成。
                </div>
              </div>

              {/* Mock Arrow */}
              <div className="text-neutral-400 text-xs font-mono">→</div>

              {/* Mock Card 2 */}
              <div 
                className={`w-44 p-3.5 transition-all relative ${
                  isLiquid 
                    ? 'rounded-[18px]' 
                    : `rounded-xl border ${settings.cardStyle === 'tinted-surface' ? palette1.cardBg : 'bg-white'} ${palette1.border}`
                }`}
                style={isLiquid ? {
                  background: palette1.glassBg,
                  borderColor: palette1.glassBorder,
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  boxShadow: '0 14px 32px -8px rgba(0, 0, 0, 0.14), inset 0 1px 1.5px 0 rgba(255, 255, 255, 0.85)',
                  backdropFilter: 'blur(36px) saturate(200%) brightness(1.04)',
                  WebkitBackdropFilter: 'blur(36px) saturate(200%) brightness(1.04)'
                } : undefined}
              >
                {settings.cardStyle === 'top-ribbon' && (
                  <div className={`h-1 -mx-3.5 -mt-3.5 mb-2 rounded-t-xl ${palette1.accentBar}`} />
                )}
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium border ${palette1.badgeBg}`}>
                    L1 分支追问
                  </span>
                  <span 
                    className="w-2.5 h-2.5 rounded-full" 
                    style={{ 
                      backgroundColor: palette1.dotColor,
                      boxShadow: `0 0 8px ${palette1.dotColor}`
                    }} 
                  />
                </div>
                <div className="text-[11px] font-semibold text-neutral-900 mb-1 leading-snug">
                  混合键合设备壁垒...
                </div>
                <div className="text-[10px] text-neutral-600 line-clamp-2 leading-relaxed">
                  对标 BESI 混合键合机台出货与关键验证。
                </div>
              </div>
            </div>
          </div>

          {/* Theme Mode Selector */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-neutral-800 block">
              色彩方案
            </label>
            <div className="grid grid-cols-2 gap-2">
              {themeModes.map(tm => (
                <button
                  key={tm.id}
                  type="button"
                  onClick={() => handleUpdate({ themeMode: tm.id })}
                  className={`p-2.5 rounded-lg border flex items-center justify-between transition-all ${
                    settings.themeMode === tm.id
                      ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                      : 'border-neutral-200/80 hover:border-neutral-300 text-neutral-700 bg-neutral-50/50 hover:bg-neutral-50'
                  }`}
                >
                  <span className="text-[11px] font-medium">{tm.name}</span>
                  <div className="flex items-center gap-1">
                    {tm.colors.map((c, i) => (
                      <span 
                        key={i} 
                        className="w-2.5 h-2.5 rounded-full ring-1 ring-black/10" 
                        style={{ backgroundColor: c }} 
                      />
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Card Style Mode */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-neutral-800 block">
              卡片材质
            </label>
            <div className="grid grid-cols-2 gap-2">
              {cardStyles.map(cs => (
                <button
                  key={cs.id}
                  type="button"
                  onClick={() => handleUpdate({ cardStyle: cs.id })}
                  className={`p-2.5 rounded-lg border flex items-center justify-between transition-all ${
                    settings.cardStyle === cs.id
                      ? 'border-neutral-900 bg-neutral-900 text-white font-medium shadow-xs'
                      : 'border-neutral-200/80 hover:border-neutral-300 text-neutral-700 bg-neutral-50/50 hover:bg-neutral-50'
                  }`}
                >
                  <span className="text-[11px] font-medium">{cs.name}</span>
                  {settings.cardStyle === cs.id && (
                    <Check className="w-3.5 h-3.5 text-white" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Canvas Background Style */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-neutral-800 block">
              画布底色
            </label>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(CANVAS_BACKGROUNDS).map(bg => (
                <button
                  key={bg.id}
                  type="button"
                  onClick={() => handleUpdate({ canvasBg: bg.id })}
                  className={`p-2.5 rounded-lg border flex items-center justify-between transition-all ${
                    settings.canvasBg === bg.id
                      ? 'border-neutral-900 bg-neutral-900 text-white font-medium shadow-xs'
                      : 'border-neutral-200/80 hover:border-neutral-300 text-neutral-700 bg-neutral-50/50 hover:bg-neutral-50'
                  }`}
                >
                  <span className="text-[11px] font-medium">{bg.name}</span>
                  <span 
                    className="w-3.5 h-3.5 rounded border border-black/15 shadow-2xs" 
                    style={{ backgroundColor: bg.id === 'dark-studio' ? '#121214' : (bg.id === 'warm-paper' ? '#FAF8F5' : '#F5F5F7') }} 
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-black/[0.06] bg-neutral-50/70 flex items-center justify-between">
          <span className="text-[10px] text-neutral-400">
            设置将即时生效并自动持久化保存
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#18181B] hover:bg-[#27272A] text-white rounded-lg text-xs font-medium transition-colors"
          >
            完成
          </button>
        </div>
      </div>
    </div>
  );
}
