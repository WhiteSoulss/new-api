import { useEffect, useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  AiCloud01Icon, ApiIcon, ArrowDown01Icon, ArrowRight01Icon, ArrowUp01Icon,
  BookOpen01Icon, Cancel01Icon, ChartLineData01Icon, CheckmarkCircle02Icon,
  CloudIcon, CodeIcon, Copy01Icon, DashboardSquare01Icon, Exchange01Icon,
  Globe02Icon, Key01Icon, Layers01Icon, Menu01Icon, Rocket01Icon,
  ShieldKeyIcon, UserCircle02Icon,
} from '@hugeicons/core-free-icons'

const API_BASE = 'https://api.tokenk8s.com/v1'
const ASSET_BASE = import.meta.env.BASE_URL
const normalizeLanguage = (value) => String(value || '').toLowerCase().startsWith('zh') ? 'zh' : 'en'

const copy = {
  zh: {
    nav: ['首页', '控制台', '模型广场', '文档', '关于'], login: '登录', signup: '创建 API 密钥',
    eyebrow: 'ONE API · MORE POSSIBILITIES', titleStart: '一个 API，', titleAccent: '接入主流 AI 模型',
    intro: '用统一、兼容 OpenAI 的接口接入 GLM、Gemini、Kimi 等模型。一个密钥即可管理调用、计费与用量。',
    docs: '查看接入文档', pricing: '查看模型价格', endpoint: '统一 API 地址', copied: '已复制', request: '请求示例', response: '响应',
    providersEyebrow: 'UNIFIED ACCESS', providersTitle: '一个接口，连接多种模型', providersIntro: '通过兼容 OpenAI 的标准接口，统一接入 GLM、Gemini、Kimi；切换模型无需修改业务代码。',
    providers: [['GLM-5.2', '智谱 GLM', '中文理解与复杂任务'], ['GLM-5.3', '智谱 GLM', '高质量生成与推理'], ['Gemini', 'Google Gemini', '多模态与长上下文'], ['Kimi', 'Moonshot AI', '长文本分析与智能体']],
    benefitTitle: ['统一协议', '实时用量', '安全转发'],
    benefitText: ['兼容 OpenAI SDK，迁移只需修改 Base URL。', '在控制台查看请求、Token 消耗与余额。', '密钥隔离、HTTPS 传输，统一管理上游凭证。'],
    stepsEyebrow: '三步完成接入', stepsTitle: '从注册到第一次请求，只需几分钟',
    steps: [['01', '注册账号', '登录冠淇智能控制台，完成账户创建。'], ['02', '生成密钥', '创建专属 API Key，并按需设置权限。'], ['03', '替换 Base URL', '保留熟悉的 SDK，仅替换接口地址和密钥。']],
    resourcesEyebrow: '开发者资源', resourcesTitle: '接入、选型与管理都在这里',
    resources: [['文档中心', '查看接口说明、请求示例与常见问题。', '打开文档'], ['模型与价格', '比较模型能力、接口类型与实时价格。', '查看价格'], ['控制台', '创建密钥，查看额度、用量与调用日志。', '进入控制台']],
    faqEyebrow: '常见问题', faqTitle: '开始调用前，你可能想了解',
    faqs: [
      ['是否兼容 OpenAI SDK？', '兼容。把 Base URL 修改为冠淇智能 API 地址，并使用在控制台创建的密钥即可。'],
      ['如何切换不同模型？', '请求格式保持不变，只需修改请求体中的 model 字段。可用模型以控制台和模型广场为准。'],
      ['如何计算费用？', '根据所选模型的输入、输出及其他计费项目按实际用量扣费，模型广场会展示当前价格。'],
      ['API 密钥应该如何保管？', '请仅在服务端保存密钥，不要写入公开代码仓库或暴露在浏览器前端。发现泄露后应立即删除并重新生成。'],
      ['可以查看调用记录吗？', '可以。控制台会提供用量、请求状态和调用日志，方便排查问题与核对消耗。'],
      ['接口地址是什么？', `统一接口地址为 ${API_BASE}，聊天补全接口路径为 /chat/completions。`],
    ],
    ctaTitle: '准备好开始构建了吗？', ctaText: '创建 API 密钥，用一个标准接口调用多家主流模型。', ctaButton: '立即开始',
    footerText: '统一、稳定、清晰的 AI 模型 API 服务。', terms: '用户协议', privacy: '隐私政策', company: '北京冠淇智能科技有限公司', address: '北京市通州区宋庄镇宋里艺术科技文创园114室',
  },
  en: {
    nav: ['Home', 'Console', 'Models', 'Docs', 'About'], login: 'Sign in', signup: 'Create API key',
    eyebrow: 'ONE API · MORE POSSIBILITIES', titleStart: 'One API for', titleAccent: 'leading AI models',
    intro: 'Connect to GLM, Gemini, Kimi and more through one OpenAI-compatible interface. Manage access, billing and usage with a single key.',
    docs: 'Read the docs', pricing: 'View model pricing', endpoint: 'Unified API endpoint', copied: 'Copied', request: 'Request', response: 'Response',
    providersEyebrow: 'UNIFIED ACCESS', providersTitle: 'One interface, many models', providersIntro: 'Connect to GLM, Gemini and Kimi through one OpenAI-compatible endpoint. Switch models without changing application code.',
    providers: [['GLM-5.2', 'Zhipu GLM', 'Chinese reasoning and complex tasks'], ['GLM-5.3', 'Zhipu GLM', 'High-quality generation and reasoning'], ['Gemini', 'Google Gemini', 'Multimodal and long context'], ['Kimi', 'Moonshot AI', 'Long-form analysis and agents']],
    benefitTitle: ['Unified protocol', 'Live usage', 'Secure relay'],
    benefitText: ['OpenAI-compatible SDK access with a Base URL change.', 'Track requests, token usage and balance in one console.', 'Key isolation, HTTPS transport and centralized credentials.'],
    stepsEyebrow: 'Integrate in three steps', stepsTitle: 'From sign-up to your first request in minutes',
    steps: [['01', 'Create an account', 'Sign in to the Guanqi Intelligence console.'], ['02', 'Generate a key', 'Create an API key and configure its permissions.'], ['03', 'Replace the Base URL', 'Keep your SDK and update only the endpoint and key.']],
    resourcesEyebrow: 'Developer resources', resourcesTitle: 'Everything you need to build and operate',
    resources: [['Documentation', 'Explore API references, examples and common questions.', 'Open docs'], ['Models & pricing', 'Compare model capabilities, endpoints and live pricing.', 'View pricing'], ['Console', 'Create keys and inspect balance, usage and request logs.', 'Open console']],
    faqEyebrow: 'FAQ', faqTitle: 'What you may want to know before calling the API',
    faqs: [
      ['Is the API compatible with OpenAI SDKs?', 'Yes. Change the Base URL to Guanqi Intelligence and use a key created in the console.'],
      ['How do I switch models?', 'Keep the request format and change the model field. Available models are listed in the console and model marketplace.'],
      ['How is usage billed?', 'Charges follow the selected model’s input, output and other usage categories. Current prices are shown in the model marketplace.'],
      ['How should I protect my API key?', 'Store keys only on your server. Never commit them to a public repository or expose them in browser code.'],
      ['Can I inspect request history?', 'Yes. The console provides usage, status and request logs for troubleshooting and reconciliation.'],
      ['What is the API endpoint?', `The unified endpoint is ${API_BASE}; chat completions use /chat/completions.`],
    ],
    ctaTitle: 'Ready to start building?', ctaText: 'Create an API key and access leading models through one standard interface.', ctaButton: 'Get started',
    footerText: 'Unified, stable and transparent AI model APIs.', terms: 'Terms', privacy: 'Privacy', company: 'Beijing Guanqi Intelligence Technology Co., Ltd.', address: 'Room 114, Songli Art, Technology and Cultural Innovation Park, Tongzhou, Beijing',
  },
}

const navHrefs = ['#top', '/dashboard', '/pricing', 'https://docs.tokenk8s.com', '/about']
const providerIcons = [AiCloud01Icon, Layers01Icon, CloudIcon, Rocket01Icon]
const benefitIcons = [Exchange01Icon, ChartLineData01Icon, ShieldKeyIcon]
const stepIcons = [UserCircle02Icon, Key01Icon, CodeIcon]
const resourceIcons = [BookOpen01Icon, ApiIcon, DashboardSquare01Icon]
const resourceHrefs = ['https://docs.tokenk8s.com', '/pricing', '/dashboard']

const samples = {
  OpenAI: `curl ${API_BASE}/chat/completions \\
  -H "Authorization: Bearer $GUANQI_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "glm-5.3",
    "messages": [
      {"role": "user", "content": "你好"}
    ]
  }'`,
  Claude: `export ANTHROPIC_BASE_URL="https://api.tokenk8s.com"
export ANTHROPIC_AUTH_TOKEN="$GUANQI_API_KEY"

claude`,
  Gemini: `curl ${API_BASE}/chat/completions \\
  -H "Authorization: Bearer $GUANQI_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gemini-3.1-pro-preview",
    "messages": [{"role": "user", "content": "你好"}]
  }'`,
}

const responseSample = `{
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "冠淇智能（TokenK8s）是面向开发者的 AI 模型接入平台，通过统一、兼容 OpenAI 的 API，帮助你轻松调用 GLM、Gemini、Kimi 等主流模型。"
      }
    }
  ]
}`

function Icon({ icon, size = 20, stroke = 1.8 }) {
  return <HugeiconsIcon icon={icon} size={size} strokeWidth={stroke} aria-hidden='true' />
}

function Brand() {
  return (
    <a className='brand' href='#top' aria-label='冠淇智能首页'>
      <img src={`${ASSET_BASE}assets/guanqi-mark.png`} alt='' />
      <span><strong>冠淇智能</strong><small>Guanqi Intelligence</small></span>
    </a>
  )
}

function CodeLines({ value, active = false }) {
  return String(value).split('\n').map((line, index) => (
    <span className={`code-line ${active && index === 6 ? 'is-active' : ''}`} key={`${index}-${line}`}>
      <i>{index + 1}</i><b>{line || ' '}</b>
    </span>
  ))
}

export function App() {
  const isEmbedded = window.self !== window.top
  const [language, setLanguage] = useState(() => {
    try {
      return localStorage.getItem('guanqi-locale') || 'zh'
    } catch {
      return 'zh'
    }
  })
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('OpenAI')
  const [copied, setCopied] = useState('')
  const [openFaq, setOpenFaq] = useState(0)
  const t = copy[language]

  useEffect(() => {
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en'
    try {
      localStorage.setItem('guanqi-locale', language)
    } catch {
      // Sandboxed New API homepage iframes intentionally block storage.
    }
    if (isEmbedded) {
      document.querySelectorAll('a[href]').forEach((link) => {
        link.target = '_top'
      })
    }
  }, [isEmbedded, language])

  useEffect(() => {
    if (!isEmbedded) return undefined

    if (typeof window.__GUANQI_PARENT_LANGUAGE__ === 'string') {
      setLanguage(normalizeLanguage(window.__GUANQI_PARENT_LANGUAGE__))
    }

    const syncParentLanguage = (event) => {
      if (event.source !== window.parent || typeof event.data?.lang !== 'string') return
      setLanguage(normalizeLanguage(event.data.lang))
    }

    window.addEventListener('message', syncParentLanguage)
    return () => window.removeEventListener('message', syncParentLanguage)
  }, [isEmbedded])

  const copyText = async (value, key) => {
    await navigator.clipboard.writeText(value)
    setCopied(key)
    window.setTimeout(() => setCopied(''), 1600)
  }

  return (
    <div className={`site-shell ${isEmbedded ? 'embedded' : ''}`} id='top'>
      <a className='skip-link' href='#main'>Skip to content</a>
      <header className='site-header'>
        <div className='container header-inner'>
          <Brand />
          <nav className='desktop-nav' aria-label='主导航'>
            {t.nav.map((item, index) => <a key={item} href={navHrefs[index]}>{item}</a>)}
          </nav>
          <div className='header-actions'>
            <button className='language-button' onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')} aria-label={language === 'zh' ? 'Switch to English' : '切换到中文'}>
              <Icon icon={Globe02Icon} size={17} /><span>{language === 'zh' ? 'EN' : '中文'}</span>
            </button>
            <a className='login-link' href='/sign-in'>{t.login}</a>
            <button className='menu-button' onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label='打开菜单'><Icon icon={menuOpen ? Cancel01Icon : Menu01Icon} size={24} /></button>
          </div>
        </div>
        {menuOpen && <nav className='mobile-nav' aria-label='移动端导航'>
          {t.nav.map((item, index) => <a key={item} href={navHrefs[index]} onClick={() => setMenuOpen(false)}>{item}</a>)}
          <a className='mobile-login' href='/sign-in'>{t.login}</a>
        </nav>}
      </header>

      <main id='main'>
        <section className='hero'>
          <img className='hero-atmosphere' src={`${ASSET_BASE}assets/hero-atmosphere.png`} alt='' />
          <div className='container hero-grid'>
            <div className='hero-copy'>
              <div className='eyebrow'>{t.eyebrow}</div>
              <h1>{t.titleStart}<br /><em>{t.titleAccent}</em></h1>
              <p className='hero-intro'>{t.intro}</p>
              <div className='hero-actions'>
                <a className='button button-primary' href='/sign-up'>{t.signup}<Icon icon={ArrowRight01Icon} size={18} /></a>
                <a className='button button-secondary' href='https://docs.tokenk8s.com'><Icon icon={BookOpen01Icon} size={18} />{t.docs}</a>
              </div>
              <a className='pricing-link' href='/pricing'>{t.pricing}<Icon icon={ArrowRight01Icon} size={15} /></a>
              <div className='endpoint-box'>
                <div><span>{t.endpoint}</span><code>{API_BASE}</code></div>
                <button onClick={() => copyText(API_BASE, 'endpoint')} aria-label='复制 API 地址'>
                  <Icon icon={copied === 'endpoint' ? CheckmarkCircle02Icon : Copy01Icon} size={19} /><span>{copied === 'endpoint' ? t.copied : 'Copy'}</span>
                </button>
              </div>
              <p className='endpoint-note'>{language === 'zh' ? '兼容 OpenAI API 格式，轻松迁移现有应用。' : 'OpenAI API compatible, so existing apps migrate easily.'}</p>
            </div>

            <div className='terminal-card' aria-label='API 调用示例'>
              <span className='terminal-scan' aria-hidden='true' />
              <div className='terminal-topbar'>
                <div className='code-tabs' role='tablist'>
                  {Object.keys(samples).map((tab) => <button key={tab} className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)} role='tab' aria-selected={activeTab === tab}>{tab}</button>)}
                </div>
                <span className='compatibility-label'>OpenAI {language === 'zh' ? '兼容接口' : 'compatible'}</span>
              </div>
              <div className='code-block request-block'>
                <div className='code-label'>{t.request}</div>
                <button className='copy-code' onClick={() => copyText(samples[activeTab], 'code')} aria-label='复制代码'><Icon icon={copied === 'code' ? CheckmarkCircle02Icon : Copy01Icon} size={17} /></button>
                <code className='code-lines'><CodeLines value={samples[activeTab]} active /></code>
              </div>
              <div className='code-divider' />
              <div className='code-block response-block'>
                <div className='code-label success'><span />200 OK · {t.response}</div>
                <code className='code-lines'><CodeLines value={responseSample} /></code>
              </div>
            </div>
          </div>
        </section>

        <section className='section providers-section'><div className='container'>
          <SectionHeading eyebrow={t.providersEyebrow} title={t.providersTitle} text={t.providersIntro} />
          <div className='model-route' aria-hidden='true'><span /><i /><i /><i /><i /></div>
          <div className='provider-grid'>{t.providers.map((provider, index) => <article className='provider-card' style={{ '--reveal-index': index }} key={provider[0]}>
            <div className={`provider-icon provider-${index + 1}`}><Icon icon={providerIcons[index]} size={27} /></div>
            <div><h3>{provider[0]}</h3><p>{provider[1]}</p><span>{provider[2]}</span></div>
          </article>)}</div>
        </div></section>

        <section className='benefit-band'><div className='container benefit-grid'>
          {t.benefitTitle.map((title, index) => <div className='benefit' key={title}>
            <div className='benefit-icon'><Icon icon={benefitIcons[index]} size={23} /></div><div><h3>{title}</h3><p>{t.benefitText[index]}</p></div>
          </div>)}
        </div></section>

        <section className='section steps-section'><div className='container'>
          <SectionHeading eyebrow={t.stepsEyebrow} title={t.stepsTitle} />
          <div className='steps-grid'>{t.steps.map((step, index) => <article className='step-card' key={step[0]}>
            <span className='step-number'>{step[0]}</span><div className='step-icon'><Icon icon={stepIcons[index]} size={25} /></div><h3>{step[1]}</h3><p>{step[2]}</p>
            {index < t.steps.length - 1 && <span className='step-connector'><Icon icon={ArrowRight01Icon} size={20} /></span>}
          </article>)}</div>
        </div></section>

        <section className='section resources-section'><div className='container'>
          <SectionHeading eyebrow={t.resourcesEyebrow} title={t.resourcesTitle} />
          <div className='resource-grid'>{t.resources.map((resource, index) => <a className='resource-card' href={resourceHrefs[index]} key={resource[0]}>
            <div className='resource-icon'><Icon icon={resourceIcons[index]} size={25} /></div><h3>{resource[0]}</h3><p>{resource[1]}</p><span>{resource[2]}<Icon icon={ArrowRight01Icon} size={16} /></span>
          </a>)}</div>
        </div></section>

        <section className='section faq-section'><div className='container'>
          <SectionHeading eyebrow={t.faqEyebrow} title={t.faqTitle} />
          <div className='faq-grid'>{t.faqs.map((faq, index) => <article className={`faq-item ${openFaq === index ? 'open' : ''}`} key={faq[0]}>
            <button onClick={() => setOpenFaq(openFaq === index ? -1 : index)} aria-expanded={openFaq === index}><span>{faq[0]}</span><Icon icon={openFaq === index ? ArrowUp01Icon : ArrowDown01Icon} size={19} /></button>
            {openFaq === index && <p>{faq[1]}</p>}
          </article>)}</div>
        </div></section>

        <section className='final-cta'>
          <img src={`${ASSET_BASE}assets/hero-atmosphere.png`} alt='' />
          <div className='container cta-inner'><div><h2>{t.ctaTitle}</h2><p>{t.ctaText}</p></div><a className='button button-light' href='/sign-up'>{t.ctaButton}<Icon icon={Rocket01Icon} size={18} /></a></div>
        </section>
      </main>

      <footer className='site-footer'>
        <div className='container footer-grid'><div className='footer-brand'><Brand /><p>{t.footerText}</p></div><div className='footer-links'>
          <a href='https://docs.tokenk8s.com'>{t.docs}</a><a href='/pricing'>{t.pricing}</a><a href='/terms'>{t.terms}</a><a href='/privacy'>{t.privacy}</a>
        </div></div>
        <div className='container footer-bottom'><span>© 2026 {t.company}</span><span>{t.address}</span></div>
      </footer>
    </div>
  )
}

function SectionHeading({ eyebrow, title, text }) {
  return <div className='section-heading'><span>{eyebrow}</span><h2>{title}</h2>{text && <p>{text}</p>}</div>
}
