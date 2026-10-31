/**
 * Card Appearance & Color Palette System
 * Apple HIG & iOS 27 Liquid Glass (Tendedero / 晾衣绳版 Meta-material)
 */

export const COLOR_PALETTES = {
  azure: {
    id: 'azure',
    name: '冰川蓝',
    hex: '#0284C7',
    accent: '#0284C7',
    dotColor: '#0EA5E9',
    glassBg: 'linear-gradient(150deg, rgba(240, 249, 255, 0.82) 0%, rgba(224, 242, 254, 0.58) 100%)',
    glassBorder: 'rgba(14, 165, 233, 0.38)',
    border: 'border-sky-300/60',
    hoverBorder: 'hover:border-sky-400',
    activeBorder: 'border-sky-600 ring-2 ring-sky-500/20 shadow-sky-500/15',
    cardBg: 'bg-[#F0F9FF]',
    headerBg: 'bg-sky-50/70',
    questionBg: 'bg-sky-100/40',
    badgeBg: 'bg-sky-500/10 text-sky-800 border-sky-300/40',
    accentBar: 'bg-sky-500',
    obsidianColor: '5'
  },
  emerald: {
    id: 'emerald',
    name: '翡翠绿',
    hex: '#059669',
    accent: '#059669',
    dotColor: '#10B981',
    glassBg: 'linear-gradient(150deg, rgba(240, 253, 244, 0.82) 0%, rgba(220, 252, 231, 0.58) 100%)',
    glassBorder: 'rgba(16, 185, 129, 0.36)',
    border: 'border-emerald-300/60',
    hoverBorder: 'hover:border-emerald-400',
    activeBorder: 'border-emerald-600 ring-2 ring-emerald-500/20 shadow-emerald-500/15',
    cardBg: 'bg-[#F0FDF4]',
    headerBg: 'bg-emerald-50/70',
    questionBg: 'bg-emerald-100/40',
    badgeBg: 'bg-emerald-500/10 text-emerald-800 border-emerald-300/40',
    accentBar: 'bg-emerald-500',
    obsidianColor: '4'
  },
  amber: {
    id: 'amber',
    name: '晨曦金',
    hex: '#D97706',
    accent: '#D97706',
    dotColor: '#F59E0B',
    glassBg: 'linear-gradient(150deg, rgba(255, 251, 235, 0.82) 0%, rgba(254, 243, 199, 0.58) 100%)',
    glassBorder: 'rgba(245, 158, 11, 0.40)',
    border: 'border-amber-300/60',
    hoverBorder: 'hover:border-amber-400',
    activeBorder: 'border-amber-600 ring-2 ring-amber-500/20 shadow-amber-500/15',
    cardBg: 'bg-[#FFFBEB]',
    headerBg: 'bg-amber-50/70',
    questionBg: 'bg-amber-100/40',
    badgeBg: 'bg-amber-500/10 text-amber-800 border-amber-300/40',
    accentBar: 'bg-amber-500',
    obsidianColor: '3'
  },
  purple: {
    id: 'purple',
    name: '罗兰紫',
    hex: '#7C3AED',
    accent: '#7C3AED',
    dotColor: '#8B5CF6',
    glassBg: 'linear-gradient(150deg, rgba(245, 243, 255, 0.82) 0%, rgba(237, 233, 254, 0.58) 100%)',
    glassBorder: 'rgba(139, 92, 246, 0.38)',
    border: 'border-purple-300/60',
    hoverBorder: 'hover:border-purple-400',
    activeBorder: 'border-purple-600 ring-2 ring-purple-500/20 shadow-purple-500/15',
    cardBg: 'bg-[#FAF5FF]',
    headerBg: 'bg-purple-50/70',
    questionBg: 'bg-purple-100/40',
    badgeBg: 'bg-purple-500/10 text-purple-800 border-purple-300/40',
    accentBar: 'bg-purple-500',
    obsidianColor: '6'
  },
  rose: {
    id: 'rose',
    name: '珊瑚粉',
    hex: '#E11D48',
    accent: '#E11D48',
    dotColor: '#F43F5E',
    glassBg: 'linear-gradient(150deg, rgba(255, 241, 242, 0.82) 0%, rgba(255, 228, 230, 0.58) 100%)',
    glassBorder: 'rgba(244, 63, 94, 0.36)',
    border: 'border-rose-300/60',
    hoverBorder: 'hover:border-rose-400',
    activeBorder: 'border-rose-600 ring-2 ring-rose-500/20 shadow-rose-500/15',
    cardBg: 'bg-[#FFF1F2]',
    headerBg: 'bg-rose-50/70',
    questionBg: 'bg-rose-100/40',
    badgeBg: 'bg-rose-500/10 text-rose-800 border-rose-300/40',
    accentBar: 'bg-rose-500',
    obsidianColor: '1'
  },
  slate: {
    id: 'slate',
    name: '石墨灰',
    hex: '#64748B',
    accent: '#64748B',
    dotColor: '#94A3B8',
    glassBg: 'linear-gradient(150deg, rgba(248, 250, 252, 0.85) 0%, rgba(241, 245, 249, 0.65) 100%)',
    glassBorder: 'rgba(148, 163, 184, 0.34)',
    border: 'border-slate-300/60',
    hoverBorder: 'hover:border-slate-400',
    activeBorder: 'border-slate-700 ring-2 ring-slate-500/20 shadow-slate-500/15',
    cardBg: 'bg-[#F8FAFC]',
    headerBg: 'bg-slate-100/80',
    questionBg: 'bg-slate-200/50',
    badgeBg: 'bg-slate-500/10 text-slate-800 border-slate-300/40',
    accentBar: 'bg-slate-600',
    obsidianColor: '2'
  },
  white: {
    id: 'white',
    name: '珍珠白',
    hex: '#FFFFFF',
    accent: '#71717A',
    dotColor: '#71717A',
    glassBg: 'linear-gradient(150deg, rgba(255, 255, 255, 0.90) 0%, rgba(248, 250, 252, 0.72) 100%)',
    glassBorder: 'rgba(255, 255, 255, 0.85)',
    border: 'border-black/[0.08]',
    hoverBorder: 'hover:border-black/[0.16]',
    activeBorder: 'border-neutral-900 ring-2 ring-neutral-900/15 shadow-neutral-900/10',
    cardBg: 'bg-white',
    headerBg: 'bg-white',
    questionBg: 'bg-neutral-50/80',
    badgeBg: 'bg-neutral-100 text-neutral-700 border-neutral-200/80',
    accentBar: 'bg-neutral-700',
    obsidianColor: '0'
  }
};

export const COLOR_PALETTE_LIST = Object.values(COLOR_PALETTES);

export const DEFAULT_APPEARANCE_SETTINGS = {
  themeMode: 'depth-spectrum', // 'depth-spectrum' | 'role-semantic' | 'pastel-rainbow' | 'classic-white'
  cardStyle: 'liquid-glass',   // 'liquid-glass' (晾衣绳版流光玻璃) | 'tinted-surface' | 'top-ribbon' | 'minimal-border'
  canvasBg: 'cool-grey',        // 'cool-grey' | 'warm-paper' | 'dark-studio' | 'grid-blueprint'
  fontSize: 'standard'          // 'compact' | 'standard' | 'spacious'
};

const STORAGE_APPEARANCE_KEY = 'thread_canvas_appearance_settings_v2';

export function getStoredAppearanceSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_APPEARANCE_KEY);
    if (raw) {
      return { ...DEFAULT_APPEARANCE_SETTINGS, ...JSON.parse(raw) };
    }
  } catch {}
  return DEFAULT_APPEARANCE_SETTINGS;
}

export function saveStoredAppearanceSettings(settings) {
  try {
    localStorage.setItem(STORAGE_APPEARANCE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save appearance settings:', e);
  }
}

/**
 * Resolves the final color palette for a specific card
 */
export function resolveCardPalette(node, appearance = DEFAULT_APPEARANCE_SETTINGS) {
  // 1. Explicit per-card color override
  if (node?.color && COLOR_PALETTES[node.color]) {
    return COLOR_PALETTES[node.color];
  }

  const { themeMode } = appearance;

  // 2. Depth Spectrum (Hierarchy Rainbow: L0 -> Blue, L1 -> Green, L2 -> Purple, L3 -> Amber, L4 -> Rose, L5 -> Slate)
  if (themeMode === 'depth-spectrum') {
    const depth = node?.depth || 0;
    const depthMap = ['azure', 'emerald', 'purple', 'amber', 'rose', 'slate'];
    const colorKey = depthMap[depth % depthMap.length];
    return COLOR_PALETTES[colorKey] || COLOR_PALETTES.azure;
  }

  // 3. Role-Semantic Color
  if (themeMode === 'role-semantic') {
    const roleId = node?.roleId || 'devil-advocate';
    const roleColorMap = {
      'devil-advocate': 'rose',
      'falsification': 'amber',
      'inversion': 'purple',
      'first-principles': 'azure',
      'supply-demand': 'emerald',
      'forensic-audit': 'slate'
    };
    const colorKey = roleColorMap[roleId] || 'white';
    return COLOR_PALETTES[colorKey] || COLOR_PALETTES.white;
  }

  // 4. Pastel Rainbow (Rotate based on node id hash)
  if (themeMode === 'pastel-rainbow') {
    const id = String(node?.id || '');
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = (hash << 5) - hash + id.charCodeAt(i);
      hash |= 0;
    }
    const rainbowKeys = ['amber', 'emerald', 'azure', 'purple', 'rose'];
    const idx = Math.abs(hash) % rainbowKeys.length;
    return COLOR_PALETTES[rainbowKeys[idx]] || COLOR_PALETTES.white;
  }

  // 5. Classic White
  return COLOR_PALETTES.white;
}

/**
 * Canvas background configuration
 */
export const CANVAS_BACKGROUNDS = {
  'cool-grey': {
    id: 'cool-grey',
    name: '浅灰点阵 (Cupertino)',
    bgClass: 'bg-[#F5F5F7]',
    gridDotColor: 'rgba(0, 0, 0, 0.12)'
  },
  'warm-paper': {
    id: 'warm-paper',
    name: '暖调纸质 (Warm Studio)',
    bgClass: 'bg-[#FAF8F5]',
    gridDotColor: 'rgba(120, 100, 80, 0.14)'
  },
  'dark-studio': {
    id: 'dark-studio',
    name: '暗夜工坊 (Dark Slate)',
    bgClass: 'bg-[#121214]',
    gridDotColor: 'rgba(255, 255, 255, 0.12)'
  },
  'grid-blueprint': {
    id: 'grid-blueprint',
    name: '方格图纸 (Engineering)',
    bgClass: 'bg-[#F0F4F8]',
    gridDotColor: 'rgba(15, 23, 42, 0.12)'
  }
};
