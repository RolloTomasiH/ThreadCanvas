import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Check, 
  Eye, 
  EyeOff, 
  RotateCcw, 
  Clipboard, 
  Key, 
  CheckCircle2, 
  AlertTriangle, 
  Activity, 
  Brain, 
  Sliders, 
  ExternalLink,
  ChevronDown,
  Server
} from 'lucide-react';
import { 
  PROVIDER_CATEGORIES, 
  MODEL_PRESETS, 
  getStoredLLMSettings, 
  saveStoredLLMSettings, 
  testLLMConnection,
  isAnthropicProtocol
} from '../../services/llm';

export default function ModelSettingsModal({ 
  isOpen, 
  onClose, 
  onSettingsUpdated,
  initialNotice = ''
}) {
  const [settings, setSettings] = useState(getStoredLLMSettings());
  const [activeCategory, setActiveCategory] = useState('anthropic');
  const [showKey, setShowKey] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [testState, setTestState] = useState(null); // null | { testing: true } | { success: true, duration, reply } | { error: string }
  const keyInputRef = useRef(null);

  // Sync state on modal open
  useEffect(() => {
    if (isOpen) {
      const current = getStoredLLMSettings();
      setSettings(current);
      setSavedSuccess(false);
      setTestState(null);

      // Determine initial active category from preset or model name
      const preset = MODEL_PRESETS.find(p => p.id === current.selectedPresetId);
      if (preset?.category) {
        setActiveCategory(preset.category);
      } else if (isAnthropicProtocol(current)) {
        setActiveCategory('anthropic');
      } else if (current.baseUrl?.includes('bigmodel')) {
        setActiveCategory('zhipu');
      } else if (current.baseUrl?.includes('deepseek')) {
        setActiveCategory('deepseek');
      } else {
        setActiveCategory('openai');
      }

      setTimeout(() => {
        keyInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle switching category tab (e.g. Anthropic Claude, 智谱, DeepSeek)
  const handleSelectCategory = (catId) => {
    setActiveCategory(catId);
    setTestState(null);

    // Find default preset in this category
    const catPresets = MODEL_PRESETS.filter(p => p.category === catId);
    const targetPreset = catPresets[0] || MODEL_PRESETS[0];

    // Restore provider-specific key if available
    const rememberedKey = settings.providerKeys?.[catId] || '';

    const updated = {
      ...settings,
      providerCategory: catId,
      selectedPresetId: targetPreset.id,
      protocol: targetPreset.protocol || (catId === 'anthropic' ? 'anthropic' : 'openai'),
      baseUrl: targetPreset.baseUrl,
      model: targetPreset.model,
      maxTokens: targetPreset.maxTokens || 8192,
      apiKey: rememberedKey || (catId === 'zhipu' ? (settings.providerKeys?.zhipu || settings.apiKey) : rememberedKey),
      enableThinking: targetPreset.defaultThinking !== undefined ? targetPreset.defaultThinking : settings.enableThinking
    };

    setSettings(updated);
    saveStoredLLMSettings(updated);
    if (onSettingsUpdated) onSettingsUpdated(updated);
  };

  // Handle selecting a specific model preset
  const handleSelectPreset = (presetId) => {
    const preset = MODEL_PRESETS.find(p => p.id === presetId);
    if (!preset) return;

    setTestState(null);
    const catId = preset.category || activeCategory;
    const rememberedKey = settings.providerKeys?.[catId] || settings.apiKey || '';

    const updated = {
      ...settings,
      providerCategory: catId,
      selectedPresetId: preset.id,
      protocol: preset.protocol || (catId === 'anthropic' ? 'anthropic' : 'openai'),
      baseUrl: preset.baseUrl,
      model: preset.model,
      maxTokens: preset.maxTokens || 8192,
      apiKey: rememberedKey,
      enableThinking: preset.defaultThinking !== undefined ? preset.defaultThinking : settings.enableThinking
    };

    setSettings(updated);
    saveStoredLLMSettings(updated);
    if (onSettingsUpdated) onSettingsUpdated(updated);
  };

  // Update current API key and keep providerKeys memory in sync
  const handleKeyChange = (val) => {
    const trimmed = val.trim();
    const updatedKeys = {
      ...(settings.providerKeys || {}),
      [activeCategory]: trimmed
    };

    const updated = {
      ...settings,
      apiKey: trimmed,
      providerKeys: updatedKeys
    };

    setSettings(updated);
    saveStoredLLMSettings(updated);
    if (onSettingsUpdated) onSettingsUpdated(updated);
  };

  const handlePasteKey = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && text.trim()) {
        handleKeyChange(text.trim());
      }
    } catch (e) {
      console.warn('Clipboard read error:', e);
    }
  };

  // Test connection heartbeat
  const handleTestConnection = async () => {
    setTestState({ testing: true });
    try {
      const res = await testLLMConnection(settings);
      if (res.success) {
        setTestState({
          success: true,
          duration: res.duration,
          reply: res.reply
        });
      } else {
        setTestState({
          error: res.error || '连接失败，请检查端点与密钥。'
        });
      }
    } catch (e) {
      setTestState({
        error: e.message || '网络连接超时或代理异常'
      });
    }
  };

  const handleSave = () => {
    saveStoredLLMSettings(settings);
    if (onSettingsUpdated) onSettingsUpdated(settings);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 300);
  };

  const handleResetPrompt = () => {
    setSettings(prev => ({
      ...prev,
      systemPrompt: `你是一位顶级买方投研与商业架构学者。遵循事实直陈与因果推导，杜绝任何浮夸套话。
回答原则：
1. 先给出核心结论，再以结构化要点（数据、逻辑链、机理、边界条件）展开；
2. 如遇定量问题，给出数值区间或场景测算；
3. 如果当前提问是基于前置研究中引述的某一特定要点展开的分支追问，请高度聚焦于该要点展开深入剖析与因果论证，切勿脱离上下文泛泛而谈。`
    }));
  };

  const currentPreset = MODEL_PRESETS.find(p => p.id === settings.selectedPresetId) || MODEL_PRESETS[0];
  const isClaudeActive = activeCategory === 'anthropic' || isAnthropicProtocol(settings);
  const isClaude37 = (settings.model || '').includes('3-7');
  const presetsInActiveCategory = MODEL_PRESETS.filter(p => p.category === activeCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-black/[0.08] overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-black/[0.06] flex items-center justify-between bg-white/95 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-neutral-800" />
            <h2 className="text-xs font-semibold text-neutral-900">ThreadCanvas · LLM 模型中枢与 API 设置</h2>
            <span className="text-[10px] text-neutral-400 font-mono">
              (原生支持 Claude · GLM · DeepSeek · OpenAI)
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-700 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Top Provider Categories (Obsidian Copilot Style Tabs) */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-neutral-700 flex items-center justify-between">
              <span>选择推演服务商 (Provider)</span>
              <span className="text-[10px] text-neutral-400">已自动隔离各商户独立的 API 密钥</span>
            </label>
            <div className="grid grid-cols-5 gap-1 bg-neutral-100 p-1 rounded-lg border border-black/[0.04]">
              {PROVIDER_CATEGORIES.map(cat => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleSelectCategory(cat.id)}
                    className={`py-2 px-1 rounded-md transition-all text-center flex flex-col items-center justify-center ${
                      isActive 
                        ? 'bg-white text-neutral-900 font-semibold shadow-xs border border-black/[0.06]' 
                        : 'text-neutral-500 hover:text-neutral-900 hover:bg-white/40'
                    }`}
                  >
                    <span className="text-[11px] leading-tight font-medium">{cat.name}</span>
                    <span className={`text-[9px] font-mono mt-0.5 ${isActive ? 'text-neutral-500' : 'text-neutral-400'}`}>
                      {cat.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Model Family Selection in this Category */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-neutral-700 block">
              模型版本预设
            </label>
            <div className="grid grid-cols-2 gap-2">
              {presetsInActiveCategory.map(preset => {
                const isSelected = settings.selectedPresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all relative ${
                      isSelected
                        ? 'border-neutral-900 bg-neutral-900 text-white font-medium shadow-xs'
                        : 'border-neutral-200/80 hover:border-neutral-300 text-neutral-700 bg-neutral-50/50 hover:bg-neutral-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[11px] font-semibold truncate pr-2">{preset.name}</span>
                      {preset.supportsReasoning && (
                        <span className={`text-[9px] px-1.5 py-0.2 rounded font-medium ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}>
                          思考
                        </span>
                      )}
                    </div>
                    <div className={`text-[10px] font-mono truncate ${isSelected ? 'text-neutral-300' : 'text-neutral-400'}`}>
                      {preset.model}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* API Key Input Section */}
          <div className="p-3.5 rounded-xl border border-black/[0.06] bg-neutral-50/60 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold text-neutral-800 flex items-center gap-1.5">
                <span>{activeCategory === 'anthropic' ? 'Claude API Key (Anthropic)' : `${currentPreset.provider} API Key`}</span>
                {isClaudeActive && (
                  <span className="text-[9px] font-mono text-neutral-600 bg-neutral-200/60 px-1.5 py-0.5 rounded border border-neutral-300/60">
                    Anthropic Protocol
                  </span>
                )}
              </label>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePasteKey}
                  className="flex items-center gap-1 text-[10px] text-neutral-600 hover:text-neutral-900 hover:underline"
                >
                  <Clipboard className="w-3 h-3" />
                  从剪贴板粘贴
                </button>
                {activeCategory === 'anthropic' && (
                  <a
                    href="https://console.anthropic.com/settings/keys"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-0.5 text-[10px] text-blue-600 hover:underline"
                  >
                    获取 Key <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </div>
            </div>

            <div className="relative flex items-center">
              <input
                ref={keyInputRef}
                type={showKey ? 'text' : 'password'}
                value={settings.apiKey || ''}
                onChange={(e) => handleKeyChange(e.target.value)}
                placeholder={currentPreset.placeholderKey || 'sk-...'}
                className="w-full text-xs font-mono pl-3 pr-20 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-white text-neutral-800 shadow-2xs"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2.5 text-neutral-400 hover:text-neutral-700 p-1"
                title={showKey ? '隐藏' : '显示'}
              >
                {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Test Connection Bar */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={testState?.testing}
                  onClick={handleTestConnection}
                  className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-neutral-100 active:bg-neutral-200 border border-neutral-300 rounded-lg text-[11px] font-medium text-neutral-700 transition-colors shadow-2xs disabled:opacity-50"
                >
                  <Activity className={`w-3 h-3 ${testState?.testing ? 'animate-spin text-neutral-800' : 'text-neutral-500'}`} />
                  <span>{testState?.testing ? '测试中...' : '测试连接'}</span>
                </button>

                {testState?.success && (
                  <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    连接成功 ({testState.duration}ms)
                  </span>
                )}
              </div>

              {isClaudeActive && (
                <span className="text-[10px] text-neutral-400 font-mono">
                  api.anthropic.com
                </span>
              )}
            </div>

            {testState?.error && (
              <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-[11px] space-y-1">
                <div className="flex items-center gap-1 font-semibold">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  <span>连接测试失败</span>
                </div>
                <div className="text-[10px] leading-relaxed whitespace-pre-wrap font-mono text-rose-700">
                  {testState.error}
                </div>
              </div>
            )}
          </div>

          {/* Claude 3.7 Extended Thinking Option */}
          {isClaudeActive && isClaude37 && (
            <div className="p-3 rounded-xl border border-neutral-200 bg-neutral-50/80 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-900">
                  <Brain className="w-3.5 h-3.5 text-neutral-700" />
                  <span>Claude 3.7 混合深度推理 (Extended Thinking)</span>
                </div>
                <p className="text-[10px] text-neutral-500 leading-relaxed">
                  开启后模型将在后台先行缜密思考推演，思考过程默认折叠以保持卡片整洁
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableThinking !== false}
                  onChange={(e) => {
                    const updated = { ...settings, enableThinking: e.target.checked };
                    setSettings(updated);
                    saveStoredLLMSettings(updated);
                    if (onSettingsUpdated) onSettingsUpdated(updated);
                  }}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-neutral-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-neutral-900"></div>
              </label>
            </div>
          )}

          {/* Advanced Endpoint & Model Details */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                API 端点 (Base URL)
              </label>
              <input
                type="text"
                value={settings.baseUrl || ''}
                onChange={(e) => {
                  const updated = { ...settings, baseUrl: e.target.value.trim() };
                  setSettings(updated);
                  saveStoredLLMSettings(updated);
                  if (onSettingsUpdated) onSettingsUpdated(updated);
                }}
                placeholder={isClaudeActive ? "https://api.anthropic.com" : "https://api.openai.com/v1"}
                className="w-full text-[11px] font-mono px-2.5 py-1.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-neutral-50 focus:bg-white text-neutral-800"
              />
              <span className="text-[9px] text-neutral-400 mt-0.5 block">
                {isClaudeActive ? '官方默认: https://api.anthropic.com' : '支持自定义反代或中转端点'}
              </span>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                模型标识 (Model Identifier)
              </label>
              <input
                type="text"
                value={settings.model || ''}
                onChange={(e) => {
                  const updated = { ...settings, model: e.target.value.trim() };
                  setSettings(updated);
                  saveStoredLLMSettings(updated);
                  if (onSettingsUpdated) onSettingsUpdated(updated);
                }}
                placeholder="claude-3-7-sonnet-20250219"
                className="w-full text-[11px] font-mono px-2.5 py-1.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-neutral-50 focus:bg-white text-neutral-800"
              />
              <span className="text-[9px] text-neutral-400 mt-0.5 block">
                当前调用识别名
              </span>
            </div>
          </div>

          {/* System Prompt Customizer */}
          <div className="pt-2 border-t border-neutral-100">
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-semibold text-neutral-700">
                基础 System Prompt (公理基准)
              </label>
              <button
                type="button"
                onClick={handleResetPrompt}
                className="text-[10px] text-neutral-500 hover:text-neutral-900 flex items-center gap-0.5"
              >
                <RotateCcw className="w-3 h-3" />
                重置为买方公理
              </button>
            </div>
            <textarea
              rows={2}
              value={settings.systemPrompt}
              onChange={(e) => setSettings({ ...settings, systemPrompt: e.target.value })}
              className="w-full text-[11px] leading-relaxed p-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-neutral-50/50 focus:bg-white resize-none text-neutral-700"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-black/[0.06] flex items-center justify-between bg-neutral-50">
          <span className="text-[10px] text-neutral-400">
            修改即时保存，支持随时在画布顶栏切换服务商
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 rounded-md transition-colors"
            >
              关闭
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1 px-4 py-1.5 bg-[#18181B] hover:bg-[#27272A] text-white text-xs font-medium rounded-lg transition-colors shadow-sm"
            >
              {savedSuccess ? <Check className="w-3.5 h-3.5 text-white" /> : null}
              {savedSuccess ? '已生效' : '保存并应用'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
