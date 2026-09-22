import { useEffect, useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { AiCloud01Icon, ArrowRight01Icon, ArrowUpRight01Icon, ChartLineData01Icon, CheckmarkCircle02Icon, CodeIcon, Copy01Icon, Exchange01Icon, Layers01Icon, Menu01Icon } from '@hugeicons/core-free-icons'

const BASE = import.meta.env.BASE_URL
const API_BASE = 'https://api.tokenk8s.com/v1'
const DOCS_URL = 'https://docs.tokenk8s.com'
const normalizeLanguage = (value) => String(value || '').toLowerCase().startsWith('zh') ? 'zh' : 'en'

const copy = {
  en: {
    nav: ['Home', 'Models & pricing', 'Docs', 'About'], signIn: 'Sign in', console: 'Open console',
    heroLine1: 'Every token,', heroLine2: 'limitless potential.',
    heroIntro: 'Guanqi Intelligence brings leading AI models together behind one API. Connect to GLM, Gemini and Kimi with a familiar interface, then focus on building what comes next.',
    start: 'Start building', explore: 'Explore models', heroNote: ['More open AI', 'More room to create'],
    points: [['One API', 'Many models, one integration'], ['Usage-based', 'Flexible, transparent pricing'], ['Full visibility', 'Track every request']],
    modelKicker: 'Leading models, one integration', modelTitle1: 'Choose the right model', modelTitle2: 'for your next idea.',
    modelIntro: 'Move between GLM, Gemini and Kimi without rebuilding your application. Compare capabilities and pricing, and keep one familiar way of calling the API.',
    allModels: 'Explore all models', quickStart: 'QUICK START', codeBottom: 'One endpoint · OpenAI-compatible', viewDocs: 'Read the docs',
    valueTitle: 'Less integration work. More building.', valueIntro: 'From model access to usage tracking, every part of the workflow stays clear and practical.',
    values: [
      ['01 / ACCESS', 'Connect once, switch freely', 'Use familiar OpenAI SDKs to call different models. Move between providers without rewriting your application.', 'Read the integration guide'],
      ['02 / CONTROL', 'Know every request', 'See models, token usage, balances and request logs in one console. Keep performance and spend easy to understand.', 'Open the console'],
      ['03 / CHOICE', 'Match the model to the work', 'Choose among general chat, reasoning, coding and multimodal models. Check current prices before you commit.', 'Compare models & pricing'],
    ],
    connectTitle: 'From an idea to your first API call.', connectIntro: 'Create an account, generate a key and replace the Base URL. Keep the development flow you already know.',
    endpoint: 'UNIFIED API ENDPOINT', endpointNote: 'Existing OpenAI SDK projects usually need only a new Base URL and API key.',
    copy: 'Copy', copied: 'Copied', copyFailed: 'Copy failed', faqTitle: 'Frequently asked questions', faqIntro: 'More details are available in the developer documentation.',
    faqs: [
      ['Is the API compatible with OpenAI SDKs?', 'Yes. Set your SDK Base URL to our API endpoint and use a key created in the console.'],
      ['How do I switch models?', 'Keep the request format and change the model field. See the model marketplace for currently available models.'],
      ['How is usage billed?', 'Billing follows the selected model and actual usage. Current prices are listed in the model marketplace.'],
      ['Where can I see request history?', 'The console shows model, token usage, request status and billing logs.'],
    ],
    closingLine1: 'The next big idea', closingLine2: 'starts here.', footerIntro: 'Powerful AI, made simple to access and clear to operate.',
    footerProduct: 'Product', footerResources: 'Resources', footerCompany: 'Company & legal', terms: 'Terms of service', privacy: 'Privacy policy', contact: 'Contact',
    company: 'Beijing Guanqi Intelligence Technology Co., Ltd.', address: 'Room 114, Songli Art, Technology and Cultural Innovation Park, Tongzhou, Beijing',
  },
  zh: {
    nav: ['首頁', '模型與價格', '開發文檔', '關於我們'], signIn: '登入', console: '進入控制台',
    heroLine1: '每一個 Token，', heroLine2: '連接無限可能。',
    heroIntro: '冠淇智能將主流 AI 模型匯聚於同一個 API。透過熟悉的介面接入 GLM、Gemini、Kimi，讓你專注創造下一個作品。',
    start: '開始構建', explore: '探索模型', heroNote: ['更開放的 AI', '創造更大的可能'],
    points: [['統一 API', '一個接口接入多種模型'], ['按量計費', '靈活使用，價格透明'], ['用量可查', '每次調用清晰可見']],
    modelKicker: '主流模型，一站接入', modelTitle1: '選擇合適的模型', modelTitle2: '釋放更大的創造力。',
    modelIntro: '在 GLM、Gemini 與 Kimi 之間靈活切換，無須重寫應用。模型能力與價格清晰可查，調用方式始終一致。',
    allModels: '探索全部模型', quickStart: '快速開始', codeBottom: '統一接口 · 相容 OpenAI SDK', viewDocs: '查看文檔',
    valueTitle: '複雜留給我們，創造留給你。', valueIntro: '從模型接入到用量管理，每一步都簡單、清晰、可靠。',
    values: [
      ['01 / ACCESS', '一次接入，自由切換', '沿用熟悉的 OpenAI SDK，以相同調用方式接入不同模型，減少重複開發。', '閱讀接入指南'],
      ['02 / CONTROL', '看得清每一次調用', '在一個控制台查看模型、Token 用量、餘額與請求日誌。', '進入控制台'],
      ['03 / CHOICE', '按場景選擇模型', '在通用對話、推理、代碼與多模態任務間靈活選型，價格隨時可查。', '查看模型與價格'],
    ],
    connectTitle: '從想法，到第一次調用。', connectIntro: '建立帳號、產生密鑰、替換 Base URL，沿用你熟悉的開發方式。',
    endpoint: '統一 API 地址', endpointNote: '現有 OpenAI SDK 專案通常只需替換 Base URL 與 API 密鑰。',
    copy: '複製', copied: '已複製', copyFailed: '複製失敗', faqTitle: '常見問題', faqIntro: '更多細節可前往開發文檔了解。',
    faqs: [
      ['是否相容 OpenAI SDK？', '相容。將 SDK 的 Base URL 改為我們的 API 地址，並使用控制台建立的密鑰即可。'],
      ['如何切換模型？', '請求格式不變，只需修改 model 欄位。可在模型廣場查看目前可用的模型。'],
      ['費用如何計算？', '按所選模型與實際用量計費。模型廣場展示當前價格。'],
      ['在哪裡查看調用記錄？', '控制台提供模型、Token 用量、請求狀態與扣費日誌。'],
    ],
    closingLine1: '讓下一個想法，', closingLine2: '從這裡開始。', footerIntro: '讓先進的 AI 能力，以簡單可靠的方式觸手可及。',
    footerProduct: '產品', footerResources: '資源', footerCompany: '聯繫與條款', terms: '用戶協議', privacy: '隱私政策', contact: '聯繫我們',
    company: '北京冠淇智能科技有限公司', address: '北京市通州區宋莊鎮宋里藝術科技文創園 114 室',
  },
}

const modelFamilies = [
  { name: 'GLM', icon: 'zhipu-color.svg', models: ['glm-5.3', 'glm-5.2'], en: 'Reasoning and multilingual work', zh: '推理與多語言任務' },
  { name: 'Gemini', icon: null, models: ['gemini-3.7-flash', 'gemini-3.1-pro-preview'], en: 'Multimodal and long context', zh: '多模態與長上下文' },
  { name: 'Kimi', icon: 'kimi-color.svg', models: ['kimi-k3'], en: 'Analysis and agent workflows', zh: '分析與智能體工作流' },
]
const navLinks = ['/', '/pricing', DOCS_URL, '/about']
const valueLinks = [DOCS_URL, '/dashboard', '/pricing']
const valueIcons = [Exchange01Icon, ChartLineData01Icon, Layers01Icon]
const pointIcons = [Exchange01Icon, Layers01Icon, ChartLineData01Icon]

function Icon({ icon, size = 18 }) {
  return <HugeiconsIcon icon={icon} size={size} strokeWidth={1.7} aria-hidden='true' />
}

function codeSample(model, language) {
  if (language === 'curl') {
    const slash = String.fromCharCode(92)
    return [
      `curl ${API_BASE}/chat/completions ${slash}`,
      `  -H "Authorization: Bearer YOUR_API_KEY" ${slash}`,
      `  -H "Content-Type: application/json" ${slash}`,
      `  -d '{"model":"${model}","messages":[{"role":"user","content":"Hello!"}]}'`,
    ].join('\n')
  }
  if (language === 'node') return `import OpenAI from 'openai'

const client = new OpenAI({
  baseURL: '${API_BASE}',
  apiKey: 'YOUR_API_KEY'
})

const response = await client.chat.completions.create({
  model: '${model}',
  messages: [{ role: 'user', content: 'Hello!' }]
})

console.log(response.choices[0].message.content)`
  return `from openai import OpenAI

client = OpenAI(
    base_url="${API_BASE}",
    api_key="YOUR_API_KEY"
)

response = client.chat.completions.create(
    model="${model}",
    messages=[{"role": "user", "content": "Hello!"}]
)

print(response.choices[0].message.content)`
}

function Brand({ top }) {
  return <a className='brand' href='/' target={top} aria-label='Guanqi Intelligence home'>
    <img src={`${BASE}assets/guanqi-mark-dark.png`} alt='' width='40' height='40' />
    <span className='brand-type'><strong>guanqi</strong><small>INTELLIGENCE</small></span>
  </a>
}

export function App() {
  const embedded = window.self !== window.top
  const [language, setLanguage] = useState(() => { try { return normalizeLanguage(localStorage.getItem('guanqi-locale') || 'en') } catch { return 'en' } })
  const [menuOpen, setMenuOpen] = useState(false)
  const [selectedModel, setSelectedModel] = useState('glm-5.3')
  const [codeLanguage, setCodeLanguage] = useState('python')
  const [copyState, setCopyState] = useState('')
  const t = copy[language]
  const sample = codeSample(selectedModel, codeLanguage)
  const top = embedded ? '_top' : undefined

  useEffect(() => {
    document.documentElement.lang = language === 'zh' ? 'zh-Hant' : 'en'
    document.title = language === 'zh' ? '冠淇智能 | AI 模型 API' : 'Guanqi Intelligence | AI Model API'
    try { localStorage.setItem('guanqi-locale', language) } catch { /* sandboxed iframe */ }
  }, [language])
  useEffect(() => {
    if (!embedded) return undefined
    if (typeof window.__GUANQI_PARENT_LANGUAGE__ === 'string') setLanguage(normalizeLanguage(window.__GUANQI_PARENT_LANGUAGE__))
    const onMessage = (event) => { if (event.source === window.parent && typeof event.data?.lang === 'string') setLanguage(normalizeLanguage(event.data.lang)) }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [embedded])
  useEffect(() => {
    const elements = document.querySelectorAll('[data-reveal]')
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      elements.forEach((element) => element.classList.add('is-visible'))
      return undefined
    }
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return
      entry.target.classList.add('is-visible')
      observer.unobserve(entry.target)
    }), { threshold: 0.12 })
    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  const copyText = async (value, key) => {
    try { await navigator.clipboard.writeText(value); setCopyState(key) } catch { setCopyState('failed') }
    window.setTimeout(() => setCopyState(''), 1800)
  }

  return <div className={`site-shell ${embedded ? 'is-embedded' : ''}`}>
    <a className='skip-link' href='#main'>{language === 'zh' ? '跳至主要內容' : 'Skip to content'}</a>
    <header className='site-header'><div className='container header-inner'>
      <Brand top={top} />
      <nav className='desktop-nav' aria-label={language === 'zh' ? '主導航' : 'Main navigation'}>{t.nav.map((name, index) => <a key={name} className={index === 0 ? 'is-current' : ''} href={navLinks[index]} target={top}>{name}</a>)}</nav>
      <div className='header-actions'>
        <button className='language-button' type='button' onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')} aria-label={language === 'en' ? 'Switch to Chinese' : 'Switch to English'}>{language === 'en' ? '中文' : 'EN'}</button>
        <a className='login-link' href='/sign-in' target={top}>{t.signIn}</a>
        <a className='button button-primary header-cta' href='/dashboard' target={top}>{t.console}<Icon icon={ArrowUpRight01Icon} size={18} /></a>
        <button className='menu-button' type='button' aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls='mobile-nav' onClick={() => setMenuOpen(!menuOpen)}><Icon icon={Menu01Icon} size={19} /></button>
      </div>
    </div>{menuOpen && <nav className='mobile-nav' id='mobile-nav' aria-label='Mobile navigation'>
      {t.nav.map((name, index) => <a key={name} href={navLinks[index]} target={top} onClick={() => setMenuOpen(false)}>{name}</a>)}
      <a href='/sign-in' target={top}>{t.signIn}</a><a className='mobile-cta' href='/dashboard' target={top}>{t.console}</a>
    </nav>}</header>

    <main id='main'>
      <section className='hero' aria-labelledby='hero-title'>
        <img className='hero-art' src={`${BASE}assets/hero-dataflow.png`} alt='' fetchPriority='high' />
        <div className='container hero-content'><div className='hero-copy'>
          <p className='overline'>GUANQI · AI INFRASTRUCTURE</p>
          <h1 id='hero-title'>{t.heroLine1}<br /><span>{t.heroLine2}</span></h1>
          <p className='hero-intro'>{t.heroIntro}</p>
          <div className='hero-actions'><a className='button button-primary button-large' href='/dashboard' target={top}>{t.start}<Icon icon={ArrowRight01Icon} size={20} /></a><a className='button button-outline button-large' href='#models'>{t.explore}<Icon icon={ArrowRight01Icon} size={20} /></a></div>
          <div className='hero-points' aria-label={language === 'zh' ? '平台優勢' : 'Platform benefits'}>{t.points.map(([title, detail], index) => <div key={title}><span className='point-icon'><Icon icon={pointIcons[index]} size={23} /></span><strong>{title}</strong><small>{detail}</small></div>)}</div>
        </div><div className='hero-annotation hero-annotation-top' aria-hidden='true'>{t.heroNote[0]}<br />{t.heroNote[1]}<span /></div><div className='hero-annotation hero-annotation-bottom' aria-hidden='true'>FROM TOKEN<br />TO TOMORROW<span /></div>
          <div className='stream-label stream-glm' aria-hidden='true'>GLM <span /></div><div className='stream-label stream-deepseek' aria-hidden='true'>Gemini <span /></div><div className='stream-label stream-kimi' aria-hidden='true'>Kimi <span /></div>
        </div>
      </section>

      <section className='models-section section' id='models' aria-labelledby='models-title'><div className='container models-layout'>
        <div className='models-copy' data-reveal><p className='section-kicker'>{t.modelKicker}</p><h2 id='models-title'>{t.modelTitle1}<br /><span>{t.modelTitle2}</span></h2><p className='section-intro'>{t.modelIntro}</p><a className='text-link' href='/pricing' target={top}>{t.allModels}<Icon icon={ArrowRight01Icon} /></a></div>
        <div className='model-grid model-grid-overseas' role='tablist' aria-label='Select a model for the code example'>{modelFamilies.map((family) => <div className={`model-card ${family.models.includes(selectedModel) ? 'is-active' : ''}`} key={family.name}>
          <span className='model-name'>{family.icon ? <img className='model-logo' src={`${BASE}assets/model-icons/${family.icon}`} alt='' /> : <span className='gemini-logo'><Icon icon={AiCloud01Icon} size={25} /></span>}{family.name}</span><small>{family[language]}</small>
          <div className='model-options'>{family.models.map((model) => <button className={`model-option ${selectedModel === model ? 'is-active' : ''}`} type='button' role='tab' aria-selected={selectedModel === model} aria-controls='code-panel' onClick={() => setSelectedModel(model)} key={model}>{model}</button>)}</div>
          <a className='model-more' href='/pricing' target={top} aria-label={`More ${family.name} models`}><Icon icon={ArrowUpRight01Icon} size={16} /></a>
        </div>)}</div>
        <div className='code-card' data-reveal><div className='code-heading'><span className='code-title'><Icon icon={CodeIcon} size={18} /><strong>{t.quickStart}</strong></span>
          <div className='code-controls' role='tablist' aria-label='Code language'>{[['python', 'Python'], ['curl', 'curl'], ['node', 'Node.js']].map(([value, label]) => <button key={value} className={codeLanguage === value ? 'is-active' : ''} type='button' role='tab' aria-selected={codeLanguage === value} onClick={() => setCodeLanguage(value)}>{label}</button>)}</div>
          <button className='copy-code' type='button' aria-label={t.copy} title={copyState === 'code' ? t.copied : t.copy} onClick={() => copyText(sample, 'code')}><Icon icon={copyState === 'code' ? CheckmarkCircle02Icon : Copy01Icon} size={16} /></button>
        </div><div className='code-panel' id='code-panel' aria-label='API example'><pre><code>{sample.split('\n').map((line, index) => <span className='code-line' data-line={index + 1} key={`${index}-${line}`}>{line || '\u00a0'}</span>)}</code></pre></div><div className='code-bottom'><span>{t.codeBottom}</span><a href={DOCS_URL} target={top}>{t.viewDocs} <Icon icon={ArrowUpRight01Icon} size={13} /></a></div></div>
      </div></section>

      <section className='value-section section' aria-labelledby='value-title'><div className='container'><div className='section-header' data-reveal><p className='section-kicker'>BUILT FOR BUILDERS</p><h2 id='value-title'>{t.valueTitle}</h2><p>{t.valueIntro}</p></div>
        <div className='value-grid'>{t.values.map(([index, title, description, link], number) => <article className='value-card' data-reveal key={index}><span className='value-index'>{index}</span><span className='value-icon'><Icon icon={valueIcons[number]} size={23} /></span><h3>{title}</h3><p>{description}</p><a href={valueLinks[number]} target={top}>{link} <Icon icon={ArrowUpRight01Icon} size={14} /></a></article>)}</div>
      </div></section>

      <section className='connect-section section' aria-labelledby='connect-title'><div className='container connect-layout'><div data-reveal><p className='section-kicker'>START IN MINUTES</p><h2 id='connect-title'>{t.connectTitle}</h2><p>{t.connectIntro}</p><a className='button button-primary' href='/dashboard' target={top}>{t.console}<Icon icon={ArrowRight01Icon} size={18} /></a></div>
        <div className='endpoint-panel' data-reveal><span className='endpoint-label'>{t.endpoint}</span><div><code>{API_BASE}</code><button className='copy-endpoint' type='button' onClick={() => copyText(API_BASE, 'endpoint')}>{copyState === 'endpoint' ? t.copied : copyState === 'failed' ? t.copyFailed : t.copy}</button></div><p>{t.endpointNote}</p></div>
      </div></section>

      <section className='faq-section section' aria-labelledby='faq-title'><div className='container faq-layout'><div data-reveal><p className='section-kicker'>FAQ</p><h2 id='faq-title'>{t.faqTitle}</h2><p>{t.faqIntro}</p><a className='text-link' href={DOCS_URL} target={top}>{t.viewDocs}<Icon icon={ArrowRight01Icon} size={16} /></a></div><div className='faq-list' data-reveal>{t.faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></div></section>
      <section className='closing-section' aria-labelledby='closing-title'><div className='container closing-content' data-reveal><p className='section-kicker'>FROM TOKEN TO TOMORROW</p><h2 id='closing-title'>{t.closingLine1}<br />{t.closingLine2}</h2><a className='button button-primary button-large' href='/dashboard' target={top}>{t.start}<Icon icon={ArrowRight01Icon} size={20} /></a></div></section>
    </main>

    <footer className='site-footer'><div className='container footer-top'><div className='footer-brand'><Brand top={top} /><p>{t.footerIntro}</p></div><div className='footer-links'><div><strong>{t.footerProduct}</strong><a href='/pricing' target={top}>{t.nav[1]}</a><a href='/dashboard' target={top}>{t.console}</a></div><div><strong>{t.footerResources}</strong><a href={DOCS_URL} target={top}>{t.nav[2]}</a><a href='/about' target={top}>{t.nav[3]}</a></div><div><strong>{t.footerCompany}</strong><a href='mailto:admin@tokenk8s.com'>{t.contact}</a><a href='/terms' target={top}>{t.terms}</a><a href='/privacy' target={top}>{t.privacy}</a></div></div></div><div className='container footer-bottom'><span>© 2026 {t.company}</span><span>{t.address}</span></div></footer>
  </div>
}
