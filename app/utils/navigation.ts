import type { NavigationItem, Category } from '~/types'

// --- 主导航 ---
export const mainNavigation: NavigationItem[] = [
  {
    labelKey: 'nav.home',
    to: '/',
  },
  {
    labelKey: 'nav.globalEconomy',
    to: '/global-economy',
    children: [
      { labelKey: 'globalEconomy.categories.macro-policy', to: '/global-economy/macro-policy' },
      { labelKey: 'globalEconomy.categories.intl-trade', to: '/global-economy/intl-trade' },
      { labelKey: 'globalEconomy.categories.regional-economy', to: '/global-economy/regional-economy' },
      { labelKey: 'globalEconomy.categories.central-bank', to: '/global-economy/central-bank' },
      { labelKey: 'globalEconomy.categories.trade-friction', to: '/global-economy/trade-friction' },
    ],
  },
  {
    labelKey: 'nav.mainlandEconomy',
    to: '/mainland-economy',
    children: [
      { labelKey: 'mainlandEconomy.categories.policy-interpretation', to: '/mainland-economy/policy-interpretation' },
      { labelKey: 'mainlandEconomy.categories.ministry-news', to: '/mainland-economy/ministry-news' },
      { labelKey: 'mainlandEconomy.categories.conference-report', to: '/mainland-economy/conference-report' },
      { labelKey: 'mainlandEconomy.categories.political-commentary', to: '/mainland-economy/political-commentary' },
      { labelKey: 'mainlandEconomy.categories.high-quality-dev', to: '/mainland-economy/high-quality-dev' },
      { labelKey: 'mainlandEconomy.categories.a-share', to: '/mainland-economy/a-share' },
      { labelKey: 'mainlandEconomy.categories.esg-report', to: '/mainland-economy/esg-report' },
      { labelKey: 'mainlandEconomy.categories.esg-disclosure', to: '/mainland-economy/esg-disclosure' },
      { labelKey: 'mainlandEconomy.categories.esg-rating', to: '/mainland-economy/esg-rating' },
      { labelKey: 'mainlandEconomy.categories.esg-consulting', to: '/mainland-economy/esg-consulting' },
      { labelKey: 'mainlandEconomy.categories.esg-education', to: '/mainland-economy/esg-education' },
      { labelKey: 'mainlandEconomy.categories.lca', to: '/mainland-economy/lca' },
      { labelKey: 'mainlandEconomy.categories.cbam', to: '/mainland-economy/cbam' },
      { labelKey: 'mainlandEconomy.categories.zero-carbon-park', to: '/mainland-economy/zero-carbon-park' },
    ],
  },
  {
    labelKey: 'nav.industry',
    to: '/industry',
    children: [
      { labelKey: 'industry.categories.energy', to: '/industry/energy' },
      { labelKey: 'industry.categories.technology', to: '/industry/technology' },
      { labelKey: 'industry.categories.manufacturing', to: '/industry/manufacturing' },
      { labelKey: 'industry.categories.consumption', to: '/industry/consumption' },
      { labelKey: 'industry.categories.pharma', to: '/industry/pharma' },
      { labelKey: 'industry.categories.real-estate', to: '/industry/real-estate' },
      { labelKey: 'industry.categories.automotive', to: '/industry/automotive' },
      { labelKey: 'industry.categories.agriculture', to: '/industry/agriculture' },
      { labelKey: 'industry.categories.transportation', to: '/industry/transportation' },
    ],
  },
  {
    labelKey: 'nav.dataCenter',
    to: '/data-center',
    comingSoon: true,
    children: [
      { labelKey: 'dataCenter.categories.macro-data', to: '/data-center/macro-data' },
      { labelKey: 'dataCenter.categories.industry-data', to: '/data-center/industry-data' },
      { labelKey: 'dataCenter.categories.market-index', to: '/data-center/market-index' },
      { labelKey: 'dataCenter.categories.economic-calendar', to: '/data-center/economic-calendar' },
      { labelKey: 'dataCenter.categories.chart-tools', to: '/data-center/chart-tools' },
    ],
  },
  {
    labelKey: 'nav.thinkTank',
    to: '/think-tank',
    children: [
      { labelKey: 'thinkTank.categories.deep-analysis', to: '/think-tank/deep-analysis' },
      { labelKey: 'thinkTank.categories.column', to: '/think-tank/column' },
      { labelKey: 'thinkTank.categories.research-report', to: '/think-tank/research-report' },
      { labelKey: 'thinkTank.categories.special-topic', to: '/think-tank/special-topic' },
      { labelKey: 'thinkTank.categories.events', to: '/think-tank/events' },
    ],
  },
  {
    labelKey: 'nav.about',
    to: '/about',
    children: [
      { labelKey: 'about.categories.introduction', to: '/about' },
      { labelKey: 'about.categories.contact', to: '/about' },
      { labelKey: 'about.categories.reporter-query', to: '/reporters' },
      { labelKey: 'about.categories.submission', to: '/about' },
      { labelKey: 'about.categories.disclaimer', to: '/about' },
      { labelKey: 'about.categories.privacy', to: '/about' },
    ],
  },
]

// --- 各版块分类数据 ---

export const newsCategories: Category[] = [
  { slug: 'macro-economy', section: 'news', labelKey: 'news.categories.macro-economy', icon: 'i-lucide-trending-up' },
  { slug: 'global-finance', section: 'news', labelKey: 'news.categories.global-finance', icon: 'i-lucide-globe' },
  { slug: 'financial-market', section: 'news', labelKey: 'news.categories.financial-market', icon: 'i-lucide-bar-chart-3' },
  { slug: 'industrial-economy', section: 'news', labelKey: 'news.categories.industrial-economy', icon: 'i-lucide-factory' },
  { slug: 'international-trade', section: 'news', labelKey: 'news.categories.international-trade', icon: 'i-lucide-ship' },
  { slug: 'corporate-finance', section: 'news', labelKey: 'news.categories.corporate-finance', icon: 'i-lucide-building-2' },
  { slug: 'financial-law', section: 'news', labelKey: 'news.categories.financial-law', icon: 'i-lucide-scale' },
]

export const politicsCategories: Category[] = [
  { slug: 'political-news', section: 'politics', labelKey: 'politics.categories.political-news', icon: 'i-lucide-landmark' },
  { slug: 'diplomacy', section: 'politics', labelKey: 'politics.categories.diplomacy', icon: 'i-lucide-handshake' },
  { slug: 'international-relations', section: 'politics', labelKey: 'politics.categories.international-relations', icon: 'i-lucide-globe' },
  { slug: 'policy-analysis', section: 'politics', labelKey: 'politics.categories.policy-analysis', icon: 'i-lucide-file-search' },
  { slug: 'geopolitics', section: 'politics', labelKey: 'politics.categories.geopolitics', icon: 'i-lucide-map' },
  { slug: 'international-orgs', section: 'politics', labelKey: 'politics.categories.international-orgs', icon: 'i-lucide-building' },
]

export const esgCategories: Category[] = [
  { slug: 'esg-news', section: 'esg', labelKey: 'esg.categories.esg-news', icon: 'i-lucide-newspaper' },
  { slug: 'governance', section: 'esg', labelKey: 'esg.categories.governance', icon: 'i-lucide-shield-check' },
  { slug: 'carbon-management', section: 'esg', labelKey: 'esg.categories.carbon-management', icon: 'i-lucide-leaf' },
  { slug: 'circular-economy', section: 'esg', labelKey: 'esg.categories.circular-economy', icon: 'i-lucide-recycle' },
  { slug: 'disclosure', section: 'esg', labelKey: 'esg.categories.disclosure', icon: 'i-lucide-file-text' },
  { slug: 'report-service', section: 'esg', labelKey: 'esg.categories.report-service', icon: 'i-lucide-clipboard-list' },
  { slug: 'rating', section: 'esg', labelKey: 'esg.categories.rating', icon: 'i-lucide-award' },
  { slug: 'education', section: 'esg', labelKey: 'esg.categories.education', icon: 'i-lucide-graduation-cap' },
]

export const globalEconomyCategories: Category[] = [
  { slug: 'macro-policy', section: 'global-economy', labelKey: 'globalEconomy.categories.macro-policy', icon: 'i-lucide-trending-up' },
  { slug: 'intl-trade', section: 'global-economy', labelKey: 'globalEconomy.categories.intl-trade', icon: 'i-lucide-ship' },
  { slug: 'regional-economy', section: 'global-economy', labelKey: 'globalEconomy.categories.regional-economy', icon: 'i-lucide-globe' },
  { slug: 'central-bank', section: 'global-economy', labelKey: 'globalEconomy.categories.central-bank', icon: 'i-lucide-landmark' },
  { slug: 'trade-friction', section: 'global-economy', labelKey: 'globalEconomy.categories.trade-friction', icon: 'i-lucide-swords' },
]

export const mainlandEconomyCategories: Category[] = [
  { slug: 'policy-interpretation', section: 'mainland-economy', labelKey: 'mainlandEconomy.categories.policy-interpretation', icon: 'i-lucide-file-search' },
  { slug: 'ministry-news', section: 'mainland-economy', labelKey: 'mainlandEconomy.categories.ministry-news', icon: 'i-lucide-building' },
  { slug: 'conference-report', section: 'mainland-economy', labelKey: 'mainlandEconomy.categories.conference-report', icon: 'i-lucide-mic' },
  { slug: 'political-commentary', section: 'mainland-economy', labelKey: 'mainlandEconomy.categories.political-commentary', icon: 'i-lucide-message-square' },
  { slug: 'high-quality-dev', section: 'mainland-economy', labelKey: 'mainlandEconomy.categories.high-quality-dev', icon: 'i-lucide-rocket' },
  { slug: 'a-share', section: 'mainland-economy', labelKey: 'mainlandEconomy.categories.a-share', icon: 'i-lucide-bar-chart-3' },
  { slug: 'esg-report', section: 'mainland-economy', labelKey: 'mainlandEconomy.categories.esg-report', icon: 'i-lucide-clipboard-list' },
  { slug: 'esg-disclosure', section: 'mainland-economy', labelKey: 'mainlandEconomy.categories.esg-disclosure', icon: 'i-lucide-file-text' },
  { slug: 'esg-rating', section: 'mainland-economy', labelKey: 'mainlandEconomy.categories.esg-rating', icon: 'i-lucide-award' },
  { slug: 'esg-consulting', section: 'mainland-economy', labelKey: 'mainlandEconomy.categories.esg-consulting', icon: 'i-lucide-briefcase' },
  { slug: 'esg-education', section: 'mainland-economy', labelKey: 'mainlandEconomy.categories.esg-education', icon: 'i-lucide-graduation-cap' },
  { slug: 'lca', section: 'mainland-economy', labelKey: 'mainlandEconomy.categories.lca', icon: 'i-lucide-recycle' },
  { slug: 'cbam', section: 'mainland-economy', labelKey: 'mainlandEconomy.categories.cbam', icon: 'i-lucide-shield' },
  { slug: 'zero-carbon-park', section: 'mainland-economy', labelKey: 'mainlandEconomy.categories.zero-carbon-park', icon: 'i-lucide-leaf' },
]

export const industryCategories: Category[] = [
  { slug: 'energy', section: 'industry', labelKey: 'industry.categories.energy', icon: 'i-lucide-zap' },
  { slug: 'technology', section: 'industry', labelKey: 'industry.categories.technology', icon: 'i-lucide-cpu' },
  { slug: 'manufacturing', section: 'industry', labelKey: 'industry.categories.manufacturing', icon: 'i-lucide-factory' },
  { slug: 'consumption', section: 'industry', labelKey: 'industry.categories.consumption', icon: 'i-lucide-shopping-cart' },
  { slug: 'pharma', section: 'industry', labelKey: 'industry.categories.pharma', icon: 'i-lucide-pill' },
  { slug: 'real-estate', section: 'industry', labelKey: 'industry.categories.real-estate', icon: 'i-lucide-home' },
  { slug: 'automotive', section: 'industry', labelKey: 'industry.categories.automotive', icon: 'i-lucide-car' },
  { slug: 'agriculture', section: 'industry', labelKey: 'industry.categories.agriculture', icon: 'i-lucide-sprout' },
  { slug: 'transportation', section: 'industry', labelKey: 'industry.categories.transportation', icon: 'i-lucide-truck' },
]

export const dataCenterCategories: Category[] = [
  { slug: 'macro-data', section: 'data-center', labelKey: 'dataCenter.categories.macro-data', icon: 'i-lucide-database' },
  { slug: 'industry-data', section: 'data-center', labelKey: 'dataCenter.categories.industry-data', icon: 'i-lucide-bar-chart' },
  { slug: 'market-index', section: 'data-center', labelKey: 'dataCenter.categories.market-index', icon: 'i-lucide-line-chart' },
  { slug: 'economic-calendar', section: 'data-center', labelKey: 'dataCenter.categories.economic-calendar', icon: 'i-lucide-calendar' },
  { slug: 'chart-tools', section: 'data-center', labelKey: 'dataCenter.categories.chart-tools', icon: 'i-lucide-pie-chart' },
]

export const thinkTankCategories: Category[] = [
  { slug: 'deep-analysis', section: 'think-tank', labelKey: 'thinkTank.categories.deep-analysis', icon: 'i-lucide-search' },
  { slug: 'column', section: 'think-tank', labelKey: 'thinkTank.categories.column', icon: 'i-lucide-pen-tool' },
  { slug: 'research-report', section: 'think-tank', labelKey: 'thinkTank.categories.research-report', icon: 'i-lucide-file-text' },
  { slug: 'special-topic', section: 'think-tank', labelKey: 'thinkTank.categories.special-topic', icon: 'i-lucide-bookmark' },
  { slug: 'events', section: 'think-tank', labelKey: 'thinkTank.categories.events', icon: 'i-lucide-calendar' },
]

// 所有分类集合（用于 DB seed 和通用查找）
export const allCategories: Category[] = [
  ...newsCategories,
  ...politicsCategories,
  ...esgCategories,
  ...globalEconomyCategories,
  ...mainlandEconomyCategories,
  ...industryCategories,
  ...dataCenterCategories,
  ...thinkTankCategories,
]

// 按 section 获取分类的映射
export const categoriesBySection: Record<string, Category[]> = {
  'news': newsCategories,
  'politics': politicsCategories,
  'esg': esgCategories,
  'global-economy': globalEconomyCategories,
  'mainland-economy': mainlandEconomyCategories,
  'industry': industryCategories,
  'data-center': dataCenterCategories,
  'think-tank': thinkTankCategories,
}

// section 的标题 i18n key 映射
export const sectionTitleKeys: Record<string, string> = {
  'news': 'news.title',
  'politics': 'politics.title',
  'esg': 'esg.title',
  'global-economy': 'globalEconomy.title',
  'mainland-economy': 'mainlandEconomy.title',
  'industry': 'industry.title',
  'data-center': 'dataCenter.title',
  'think-tank': 'thinkTank.title',
}

// 首页 2x2 展示模块配置
export const homeSectionBlocks = [
  { section: 'global-economy', labelKey: 'nav.globalEconomy', icon: 'i-lucide-globe', color: 'text-blue-600' },
  { section: 'mainland-economy', labelKey: 'nav.mainlandEconomy', icon: 'i-lucide-landmark', color: 'text-red-600' },
  { section: 'industry', labelKey: 'nav.industry', icon: 'i-lucide-factory', color: 'text-amber-600' },
  { section: 'think-tank', labelKey: 'nav.thinkTank', icon: 'i-lucide-lightbulb', color: 'text-purple-600' },
]