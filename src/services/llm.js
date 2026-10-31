/**
 * ThreadCanvas LLM Service
 * Native support for Anthropic Claude (/v1/messages) & OpenAI-compatible endpoints.
 * Pre-configured presets for Claude 3.7 Sonnet, Claude 3.5 Sonnet, 智谱 Coding Plan (GLM-5.3), DeepSeek, etc.
 * Integrated with Research Harnesses, Anti-Slop, and Extended Thinking (Reasoning).
 */
import { buildCompositeSystemPrompt, getStoredHarnessSettings } from './harness';

export const PROVIDER_CATEGORIES = [
  { id: 'anthropic', name: 'Anthropic', label: 'Claude' },
  { id: 'zhipu', name: '智谱 AI', label: 'GLM (Coding Plan)' },
  { id: 'deepseek', name: 'DeepSeek', label: 'DeepSeek' },
  { id: 'openai', name: 'OpenAI', label: 'OpenAI / OpenRouter' },
  { id: 'local', name: '本地 / 自定义', label: 'Local / Custom' }
];

export const MODEL_PRESETS = [
  // --- Anthropic Claude 官方原生端点 ---
  {
    id: 'claude-3-7-sonnet',
    name: 'Claude 3.7 Sonnet',
    provider: 'Anthropic Claude',
    category: 'anthropic',
    protocol: 'anthropic',
    baseUrl: 'https://api.anthropic.com',
    model: 'claude-3-7-sonnet-20250219',
    maxTokens: 8192,
    supportsReasoning: true,
    defaultThinking: true,
    placeholderKey: '填入 Anthropic API Key (sk-ant-api03-...)'
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic Claude',
    category: 'anthropic',
    protocol: 'anthropic',
    baseUrl: 'https://api.anthropic.com',
    model: 'claude-3-5-sonnet-20241022',
    maxTokens: 8192,
    supportsReasoning: false,
    placeholderKey: '填入 Anthropic API Key (sk-ant-api03-...)'
  },
  {
    id: 'claude-3-5-haiku',
    name: 'Claude 3.5 Haiku',
    provider: 'Anthropic Claude',
    category: 'anthropic',
    protocol: 'anthropic',
    baseUrl: 'https://api.anthropic.com',
    model: 'claude-3-5-haiku-20241022',
    maxTokens: 8192,
    supportsReasoning: false,
    placeholderKey: '填入 Anthropic API Key (sk-ant-api03-...)'
  },
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    provider: 'Anthropic Claude',
    category: 'anthropic',
    protocol: 'anthropic',
    baseUrl: 'https://api.anthropic.com',
    model: 'claude-3-opus-20240229',
    maxTokens: 4096,
    supportsReasoning: false,
    placeholderKey: '填入 Anthropic API Key (sk-ant-api03-...)'
  },
  {
    id: 'claude-custom-proxy',
    name: 'Claude 自定义端点 / 镜像代理',
    provider: 'Anthropic Claude',
    category: 'anthropic',
    protocol: 'anthropic',
    baseUrl: 'https://api.anthropic.com',
    model: 'claude-3-7-sonnet-20250219',
    maxTokens: 8192,
    supportsReasoning: true,
    defaultThinking: true,
    placeholderKey: '填入中转商 / 镜像站提供的 Claude Key'
  },

  // --- 智谱 AI (GLM) ---
  {
    id: 'zhipu-coding-plan-53',
    name: 'GLM-5.3 (Coding Plan)',
    provider: '智谱 AI (Coding套餐专区)',
    category: 'zhipu',
    protocol: 'openai',
    baseUrl: 'https://open.bigmodel.cn/api/coding/paas/v4',
    model: 'glm-5.3',
    maxTokens: 8192,
    supportsReasoning: true,
    placeholderKey: '填入智谱 Coding Plan 专属 API Key (形如 xxxx.xxxx)'
  },
  {
    id: 'zhipu-coding-plan-47',
    name: 'GLM-4.7 (Coding Plan)',
    provider: '智谱 AI (Coding套餐专区)',
    category: 'zhipu',
    protocol: 'openai',
    baseUrl: 'https://open.bigmodel.cn/api/coding/paas/v4',
    model: 'glm-4.7',
    maxTokens: 8192,
    supportsReasoning: true,
    placeholderKey: '填入智谱 Coding Plan 专属 API Key'
  },
  {
    id: 'zhipu-standard-paas',
    name: 'GLM-4-Plus (开放平台按量)',
    provider: '智谱开放平台 (非Coding套餐)',
    category: 'zhipu',
    protocol: 'openai',
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
    model: 'glm-4-plus',
    maxTokens: 4096,
    supportsReasoning: false,
    placeholderKey: '需充值余额的普通平台 Key'
  },

  // --- DeepSeek ---
  {
    id: 'deepseek-v3',
    name: 'DeepSeek-V3',
    provider: 'DeepSeek',
    category: 'deepseek',
    protocol: 'openai',
    baseUrl: 'https://api.deepseek.com',
    model: 'deepseek-chat',
    maxTokens: 4096,
    supportsReasoning: false,
    placeholderKey: 'sk-...'
  },
  {
    id: 'deepseek-r1',
    name: 'DeepSeek-R1',
    provider: 'DeepSeek',
    category: 'deepseek',
    protocol: 'openai',
    baseUrl: 'https://api.deepseek.com',
    model: 'deepseek-reasoner',
    maxTokens: 8192,
    supportsReasoning: true,
    placeholderKey: 'sk-...'
  },

  // --- OpenAI / OpenRouter ---
  {
    id: 'openrouter-claude-37',
    name: 'OpenRouter · Claude 3.7 Sonnet',
    provider: 'OpenRouter',
    category: 'openai',
    protocol: 'openai',
    baseUrl: 'https://openrouter.ai/api/v1',
    model: 'anthropic/claude-3.7-sonnet',
    maxTokens: 8192,
    supportsReasoning: true,
    placeholderKey: 'sk-or-v1-...'
  },
  {
    id: 'openai-gpt4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    category: 'openai',
    protocol: 'openai',
    baseUrl: 'https://api.openai.com/v1',
    model: 'gpt-4o',
    maxTokens: 4096,
    supportsReasoning: false,
    placeholderKey: 'sk-proj-...'
  },
  {
    id: 'openai-gpt4o-mini',
    name: 'GPT-4o-mini',
    provider: 'OpenAI',
    category: 'openai',
    protocol: 'openai',
    baseUrl: 'https://api.openai.com/v1',
    model: 'gpt-4o-mini',
    maxTokens: 4096,
    supportsReasoning: false,
    placeholderKey: 'sk-proj-...'
  },

  // --- 本地与自定义网关 ---
  {
    id: 'ollama-local',
    name: 'Ollama (11434)',
    provider: 'Ollama',
    category: 'local',
    protocol: 'openai',
    baseUrl: 'http://127.0.0.1:11434/v1',
    model: 'deepseek-r1:8b',
    maxTokens: 4096,
    supportsReasoning: true,
    placeholderKey: '本地无需填Key'
  },
  {
    id: 'lm-studio',
    name: 'LM Studio (1234)',
    provider: 'LM Studio',
    category: 'local',
    protocol: 'openai',
    baseUrl: 'http://127.0.0.1:1234/v1',
    model: 'local-model',
    maxTokens: 4096,
    supportsReasoning: false,
    placeholderKey: '本地无需填Key'
  },
  {
    id: 'custom',
    name: '自定义端点',
    provider: 'Custom',
    category: 'local',
    protocol: 'openai',
    baseUrl: 'https://api.example.com/v1',
    model: 'custom-model',
    maxTokens: 4096,
    supportsReasoning: false,
    placeholderKey: 'sk-...'
  }
];

export const DEFAULT_CODING_PLAN_KEY = '';

export const DEFAULT_SETTINGS = {
  selectedPresetId: 'zhipu-coding-plan-53',
  providerCategory: 'zhipu',
  apiKey: '',
  providerKeys: {
    zhipu: '',
    anthropic: '',
    deepseek: '',
    openai: '',
    local: ''
  },
  protocol: 'openai', // 'openai' | 'anthropic'
  baseUrl: 'https://open.bigmodel.cn/api/coding/paas/v4',
  model: 'glm-5.3',
  maxTokens: 8192,
  enableThinking: true,
  reasoningBudget: 4096,
  systemPrompt: `你是一位顶级买方投研与商业架构学者。遵循事实直陈与因果推导，杜绝任何浮夸套话。
回答原则：
1. 先给出核心结论，再以结构化要点（数据、逻辑链、机理、边界条件）展开；
2. 如遇定量问题，给出数值区间或场景测算；
3. 如果当前提问是基于前置研究中引述的某一特定要点展开的分支追问，请高度聚焦于该要点展开深入剖析与因果论证，切勿脱离上下文泛泛而谈。`,
  temperature: 0.3,
};

const STORAGE_KEY = 'thread_canvas_llm_settings_v3';
const LEGACY_STORAGE_KEYS = ['thread_canvas_llm_settings', 'canvas_researcher_llm_settings'];

export function getStoredLLMSettings() {
  try {
    let raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      for (const k of LEGACY_STORAGE_KEYS) {
        raw = localStorage.getItem(k);
        if (raw) break;
      }
    }
    let parsed = null;
    if (raw) {
      parsed = JSON.parse(raw);
    }

    const merged = { ...DEFAULT_SETTINGS, ...parsed };

    // Ensure providerKeys map is populated
    if (!merged.providerKeys) {
      merged.providerKeys = {
        zhipu: merged.apiKey || '',
        anthropic: '',
        deepseek: '',
        openai: '',
        local: ''
      };
    }

    // Auto-detect protocol if missing
    if (!merged.protocol) {
      const preset = MODEL_PRESETS.find(p => p.id === merged.selectedPresetId);
      merged.protocol = preset?.protocol || (merged.baseUrl.includes('anthropic.com') ? 'anthropic' : 'openai');
    }

    return merged;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveStoredLLMSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save LLM settings:', e);
  }
}

/**
 * Detects whether the current configuration requires the Anthropic Native protocol
 */
export function isAnthropicProtocol(cfg) {
  if (cfg.protocol === 'anthropic') return true;
  if (cfg.protocol === 'openai') return false;
  if (cfg.baseUrl?.includes('anthropic.com')) return true;
  const modelName = (cfg.model || '').toLowerCase();
  if (modelName.startsWith('claude-') && !cfg.baseUrl?.includes('openrouter') && !cfg.baseUrl?.includes('deepseek')) {
    return true;
  }
  return false;
}

/**
 * Core Streaming Inference Engine
 * Seamlessly routes to Claude Native (/v1/messages) or OpenAI-compatible endpoints
 */
export async function streamChatCompletion({
  messages = [],
  settings = null,
  roleId = null,
  projectMemory = '',
  antiSlopEnabled = true,
  onContent = () => {},
  onReasoning = () => {},
  signal = null
}) {
  const cfg = settings || getStoredLLMSettings();
  const harnessCfg = getStoredHarnessSettings();
  const isClaude = isAnthropicProtocol(cfg);

  // Construct composite system prompt with Anti-Slop, Active Role, and Memory Axioms
  const compositeSystemPrompt = buildCompositeSystemPrompt({
    baseSystemPrompt: cfg.systemPrompt,
    roleId: roleId || harnessCfg.defaultRoleId || 'devil-advocate',
    projectMemory: projectMemory,
    antiSlopEnabled: antiSlopEnabled !== undefined ? antiSlopEnabled : harnessCfg.antiSlopEnabled
  });

  let targetUrl = '';
  let headers = {};
  let payload = {};

  if (isClaude) {
    // -------------------------------------------------------------------------
    // Anthropic Claude Native Protocol (/v1/messages)
    // -------------------------------------------------------------------------
    let rawBase = (cfg.baseUrl || 'https://api.anthropic.com').trim().replace(/\/+$/, '');
    if (rawBase.endsWith('/messages')) {
      targetUrl = rawBase;
    } else if (rawBase.endsWith('/v1')) {
      targetUrl = `${rawBase}/messages`;
    } else {
      targetUrl = `${rawBase}/v1/messages`;
    }

    headers = {
      'Content-Type': 'application/json',
      'x-api-key': (cfg.apiKey || '').trim(),
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    };

    // Sanitize messages for Anthropic: alternating user/assistant, starting with user
    const anthropicMessages = [];
    for (const m of messages) {
      if (m.role === 'system') continue;
      const role = m.role === 'assistant' ? 'assistant' : 'user';
      const content = m.content || '';
      if (!content.trim()) continue;

      if (anthropicMessages.length > 0 && anthropicMessages[anthropicMessages.length - 1].role === role) {
        anthropicMessages[anthropicMessages.length - 1].content += `\n\n${content}`;
      } else {
        anthropicMessages.push({ role, content });
      }
    }

    if (anthropicMessages.length === 0) {
      anthropicMessages.push({ role: 'user', content: '请开始推演。' });
    } else if (anthropicMessages[0].role !== 'user') {
      anthropicMessages.unshift({ role: 'user', content: '请根据前置脉络继续推演：' });
    }

    payload = {
      model: cfg.model || 'claude-3-7-sonnet-20250219',
      system: compositeSystemPrompt,
      messages: anthropicMessages,
      stream: true
    };

    // Claude 3.7 Extended Thinking (Reasoning)
    const isClaude37 = (cfg.model || '').includes('3-7');
    const enableThinking = isClaude37 && cfg.enableThinking !== false;

    if (enableThinking) {
      const budget = Math.min(Number(cfg.reasoningBudget) || 4096, 16000);
      payload.thinking = {
        type: 'enabled',
        budget_tokens: budget
      };
      payload.max_tokens = Math.max(Number(cfg.maxTokens) || 8192, budget + 2048);
      // Note: Anthropic disallows specifying temperature when thinking is enabled
    } else {
      payload.max_tokens = Number(cfg.maxTokens) || 8192;
      payload.temperature = Number(cfg.temperature) || 0.3;
    }
  } else {
    // -------------------------------------------------------------------------
    // OpenAI-Compatible Protocol (/chat/completions)
    // -------------------------------------------------------------------------
    let rawBase = (cfg.baseUrl || 'https://open.bigmodel.cn/api/coding/paas/v4').trim().replace(/\/+$/, '');
    if (!rawBase.endsWith('/chat/completions')) {
      targetUrl = `${rawBase}/chat/completions`;
    } else {
      targetUrl = rawBase;
    }

    headers = {
      'Content-Type': 'application/json'
    };
    if (cfg.apiKey && cfg.apiKey.trim()) {
      headers['Authorization'] = `Bearer ${cfg.apiKey.trim()}`;
    }

    // Coding Plan Key Guard: If calling bigmodel, ensure we always use the coding endpoint
    if (targetUrl.includes('open.bigmodel.cn') || targetUrl.includes('bigmodel')) {
      if (!targetUrl.includes('/api/coding/')) {
        targetUrl = targetUrl.replace('/api/paas/v4', '/api/coding/paas/v4');
      }
    }

    let requestModel = cfg.model || 'glm-5.3';
    if (targetUrl.includes('open.bigmodel.cn') && requestModel === 'glm-4-plus') {
      requestModel = 'glm-5.3';
    }

    payload = {
      model: requestModel,
      messages: [
        { role: 'system', content: compositeSystemPrompt },
        ...messages
      ],
      temperature: Number(cfg.temperature) || 0.3,
      max_tokens: Number(cfg.maxTokens) || 8192,
      stream: true
    };
  }

  // Determine whether to route via local proxy
  let requestUrl = targetUrl;
  const isAppPort = typeof window !== 'undefined' && window.location.port === '28791';
  const proxyUrl = isAppPort ? '/api/proxy' : 'http://127.0.0.1:28791/api/proxy';

  // For external domains without guaranteed browser CORS (Zhipu BigModel / Anthropic),
  // route through embedded proxy
  if (typeof window !== 'undefined' && (targetUrl.includes('open.bigmodel.cn') || targetUrl.includes('anthropic.com'))) {
    requestUrl = proxyUrl;
    headers['X-Target-Url'] = targetUrl;
  }

  let response;
  try {
    response = await fetch(requestUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      signal
    });
  } catch (netErr) {
    // If browser threw CORS/network error ("Load failed"), fallback to embedded local proxy
    const isProxyAlready = requestUrl.includes('/api/proxy');
    if (!isProxyAlready && typeof window !== 'undefined' && netErr.name !== 'AbortError') {
      try {
        headers['X-Target-Url'] = targetUrl;
        response = await fetch(proxyUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
          signal
        });
      } catch (proxyErr) {
        throw new Error(`网络请求失败 (${netErr.message})，且本地代理中继异常: ${proxyErr.message}`);
      }
    } else {
      throw netErr;
    }
  }

  if (!response.ok) {
    let errorDetail = '';
    let errorCode = response.status;
    try {
      const errJson = await response.json();
      errorCode = errJson.error?.code || errJson.error?.type || errJson.code || response.status;
      errorDetail = errJson.error?.message || errJson.message || JSON.stringify(errJson);
    } catch {
      errorDetail = await response.text();
    }

    let hint = '';
    const detailLower = String(errorDetail).toLowerCase();

    // Anthropic Claude Error Guidance
    if (detailLower.includes('invalid x-api-key') || detailLower.includes('authentication_error') || (errorCode === 401 && String(cfg.apiKey).startsWith('sk-ant-'))) {
      hint = 'Claude API Key 认证失败：输入的 Key 无效或未开通余额。请在设置中检查填入的 Anthropic Key（通常为 sk-ant-api03-...），或检查自定义代理/中转配置。';
    } else if (detailLower.includes('overloaded') || errorCode === 529) {
      hint = 'Anthropic 官方服务器当前处于高负载状态 (529)，请稍候重新点击推演即可。';
    } else if (errorCode === 429 || detailLower.includes('rate_limit')) {
      hint = '触发 API 速率或并发限制 (429)，请降低请求频次或检查额度。';
    }
    // Zhipu Coding Plan Error Guidance
    else if (errorCode === 1113 || String(errorCode) === '1113' || detailLower.includes('1113') || detailLower.includes('余额不足')) {
      hint = '配额通道错误 (1113)：当前使用的智谱 API Key 为「Coding Plan 个人编程套餐」，不包含普通开放平台的按量计费余额。系统已自动纠正端点为 https://open.bigmodel.cn/api/coding/paas/v4，模型已切换为 glm-5.3。请重新点击推演即可。';
    } else if (errorCode === 401 || detailLower.includes('invalid') || detailLower.includes('key')) {
      hint = '鉴权失败 (401)：智谱 Coding Plan 与开放平台普通 API 的 Key 严格隔离。请确认当前填入的是「个人编程套餐」专属 Key。';
    } else if (errorCode === 1220 || detailLower.includes('1220')) {
      hint = '套餐不匹配 (1220)：当前 API Key 无权访问该模型或端点。';
    }

    throw new Error(`LLM 接口调用失败 [${errorCode}]: ${errorDetail}${hint ? `\n\n排查建议: ${hint}` : ''}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let accumulatedContent = '';
  let accumulatedReasoning = '';
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || ''; // Keep partial line in buffer

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith(':')) continue;
      if (trimmed === 'data: [DONE]') break;

      if (trimmed.startsWith('data: ')) {
        const jsonStr = trimmed.slice(6);
        try {
          const parsed = JSON.parse(jsonStr);

          // 1. Anthropic Claude SSE Format
          if (parsed.type === 'content_block_delta') {
            const delta = parsed.delta;
            if (delta?.type === 'text_delta' && delta.text) {
              accumulatedContent += delta.text;
              if (onContent) onContent(delta.text);
            } else if (delta?.type === 'thinking_delta' && delta.thinking) {
              accumulatedReasoning += delta.thinking;
              if (onReasoning) onReasoning(delta.thinking);
            }
          } else if (parsed.type === 'error') {
            throw new Error(`Anthropic 接口报错: ${parsed.error?.message || JSON.stringify(parsed.error)}`);
          }

          // 2. OpenAI / Zhipu / DeepSeek Format
          if (parsed.choices?.[0]?.delta) {
            const delta = parsed.choices[0].delta;
            if (delta.reasoning_content) {
              accumulatedReasoning += delta.reasoning_content;
              if (onReasoning) onReasoning(delta.reasoning_content);
            } else if (delta.reasoning) {
              accumulatedReasoning += delta.reasoning;
              if (onReasoning) onReasoning(delta.reasoning);
            }

            if (delta.content) {
              accumulatedContent += delta.content;
              if (onContent) onContent(delta.content);
            }
          }
        } catch {
          // Ignore parse errors on fragmented stream chunks
        }
      }
    }
  }

  return {
    content: accumulatedContent,
    reasoning: accumulatedReasoning
  };
}

/**
 * Test LLM Connection (Ping heartbeat test)
 */
export async function testLLMConnection(overrideSettings = null) {
  const startTime = Date.now();
  let receivedAny = false;
  try {
    const cfg = {
      ...(overrideSettings || getStoredLLMSettings()),
      maxTokens: 16
    };
    const res = await streamChatCompletion({
      messages: [{ role: 'user', content: '请只回复一个单词：OK' }],
      settings: cfg,
      onContent: () => { receivedAny = true; }
    });
    const duration = Date.now() - startTime;
    return {
      success: true,
      duration,
      reply: res.content || 'OK'
    };
  } catch (err) {
    return {
      success: false,
      error: err.message
    };
  }
}
