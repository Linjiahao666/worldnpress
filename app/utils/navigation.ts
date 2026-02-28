import type { NavigationItem, Category } from '~/types'

// --- 主导航（按官网建设文档：11个栏目） ---
export const mainNavigation: NavigationItem[] = [
  {
    labelKey: 'nav.home',
    to: '/',
  },
  {
    labelKey: 'nav.news',
    to: '/news',
    children: [
      { labelKey: 'news.categories.macro-economy', to: '/news/macro-economy' },
      { labelKey: 'news.categories.global-finance', to: '/news/global-finance' },
      { labelKey: 'news.categories.financial-market', to: '/news/financial-market' },
      { labelKey: 'news.categories.industrial-economy', to: '/news/industrial-economy' },
      { labelKey: 'news.categories.international-trade', to: '/news/international-trade' },
      { labelKey: 'news.categories.corporate-finance', to: '/news/corporate-finance' },
      { labelKey: 'news.categories.financial-law', to: '/news/financial-law' },
    ],
  },
  {
    labelKey: 'nav.gbaHk',
    to: '/gba-hk',
    children: [
      { labelKey: 'gbaHk.categories.bay-area-news', to: '/gba-hk/bay-area-news' },
      { labelKey: 'gbaHk.categories.shenzhen-hk', to: '/gba-hk/shenzhen-hk' },
      { labelKey: 'gbaHk.categories.cross-border-investment', to: '/gba-hk/cross-border-investment' },
      { labelKey: 'gbaHk.categories.offshore-finance', to: '/gba-hk/offshore-finance' },
      { labelKey: 'gbaHk.categories.hk-market', to: '/gba-hk/hk-market' },
    ],
  },
  {
    labelKey: 'nav.esg',
    to: '/esg',
    children: [
      { labelKey: 'esg.categories.esg-news', to: '/esg/esg-news' },
      { labelKey: 'esg.categories.governance', to: '/esg/governance' },
      { labelKey: 'esg.categories.carbon-management', to: '/esg/carbon-management' },
      { labelKey: 'esg.categories.circular-economy', to: '/esg/circular-economy' },
      { labelKey: 'esg.categories.disclosure', to: '/esg/disclosure' },
      { labelKey: 'esg.categories.report-service', to: '/esg/report-service' },
      { labelKey: 'esg.categories.rating', to: '/esg/rating' },
      { labelKey: 'esg.categories.education', to: '/esg/education' },
    ],
  },
  {
    labelKey: 'nav.greenFinance',
    to: '/green-finance',
    children: [
      { labelKey: 'greenFinance.categories.green-credit', to: '/green-finance/green-credit' },
      { labelKey: 'greenFinance.categories.green-securities', to: '/green-finance/green-securities' },
      { labelKey: 'greenFinance.categories.green-insurance', to: '/green-finance/green-insurance' },
      { labelKey: 'greenFinance.categories.green-fund', to: '/green-finance/green-fund' },
      { labelKey: 'greenFinance.categories.carbon-finance', to: '/green-finance/carbon-finance' },
      { labelKey: 'greenFinance.categories.sustainable-investment', to: '/green-finance/sustainable-investment' },
    ],
  },
  {
    labelKey: 'nav.aiData',
    to: '/ai-data',
    children: [
      { labelKey: 'aiData.categories.real-time-monitoring', to: '/ai-data/real-time-monitoring' },
      { labelKey: 'aiData.categories.sentiment-warning', to: '/ai-data/sentiment-warning' },
      { labelKey: 'aiData.categories.data-verification', to: '/ai-data/data-verification' },
      { labelKey: 'aiData.categories.risk-profiling', to: '/ai-data/risk-profiling' },
      { labelKey: 'aiData.categories.enterprise-subscription', to: '/ai-data/enterprise-subscription' },
    ],
  },
  {
    labelKey: 'nav.thinkTank',
    to: '/think-tank',
    children: [
      { labelKey: 'thinkTank.categories.policy-interpretation', to: '/think-tank/policy-interpretation' },
      { labelKey: 'thinkTank.categories.white-paper', to: '/think-tank/white-paper' },
      { labelKey: 'thinkTank.categories.special-research', to: '/think-tank/special-research' },
      { labelKey: 'thinkTank.categories.custom-report', to: '/think-tank/custom-report' },
      { labelKey: 'thinkTank.categories.expert-pool', to: '/think-tank/expert-pool' },
      { labelKey: 'thinkTank.categories.internal-reference', to: '/think-tank/internal-reference' },
    ],
  },
  {
    labelKey: 'nav.events',
    to: '/events',
    children: [
      { labelKey: 'events.categories.global-forum', to: '/events/global-forum' },
      { labelKey: 'events.categories.esg-summit', to: '/events/esg-summit' },
      { labelKey: 'events.categories.cloud-summit', to: '/events/cloud-summit' },
      { labelKey: 'events.categories.roadshow', to: '/events/roadshow' },
      { labelKey: 'events.categories.exhibition', to: '/events/exhibition' },
      { labelKey: 'events.categories.investment-cooperation', to: '/events/investment-cooperation' },
    ],
  },
  {
    labelKey: 'nav.supervision',
    to: '/supervision',
    children: [
      { labelKey: 'supervision.categories.anti-greenwashing', to: '/supervision/anti-greenwashing' },
      { labelKey: 'supervision.categories.dishonesty-exposure', to: '/supervision/dishonesty-exposure' },
      { labelKey: 'supervision.categories.integrity-enterprise', to: '/supervision/integrity-enterprise' },
      { labelKey: 'supervision.categories.compliance-tips', to: '/supervision/compliance-tips' },
      { labelKey: 'supervision.categories.social-responsibility', to: '/supervision/social-responsibility' },
    ],
  },
  {
    labelKey: 'nav.brand',
    to: '/brand',
    children: [
      { labelKey: 'brand.categories.interview', to: '/brand/interview' },
      { labelKey: 'brand.categories.press-release', to: '/brand/press-release' },
      { labelKey: 'brand.categories.brand-showcase', to: '/brand/brand-showcase' },
      { labelKey: 'brand.categories.advertising', to: '/brand/advertising' },
      { labelKey: 'brand.categories.gov-enterprise-cooperation', to: '/brand/gov-enterprise-cooperation' },
    ],
  },
  {
    labelKey: 'nav.about',
    to: '/about',
    children: [
      { labelKey: 'about.categories.introduction', to: '/about' },
      { labelKey: 'about.categories.policy', to: '/about' },
      { labelKey: 'about.categories.qualification', to: '/about' },
      { labelKey: 'about.categories.contact', to: '/about' },
      { labelKey: 'about.categories.legal-notice', to: '/about' },
      { labelKey: 'about.categories.reporter-query', to: '/reporters' },
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

export const gbaHkCategories: Category[] = [
  { slug: 'bay-area-news', section: 'gba-hk', labelKey: 'gbaHk.categories.bay-area-news', icon: 'i-lucide-newspaper' },
  { slug: 'shenzhen-hk', section: 'gba-hk', labelKey: 'gbaHk.categories.shenzhen-hk', icon: 'i-lucide-handshake' },
  { slug: 'cross-border-investment', section: 'gba-hk', labelKey: 'gbaHk.categories.cross-border-investment', icon: 'i-lucide-arrow-left-right' },
  { slug: 'offshore-finance', section: 'gba-hk', labelKey: 'gbaHk.categories.offshore-finance', icon: 'i-lucide-landmark' },
  { slug: 'hk-market', section: 'gba-hk', labelKey: 'gbaHk.categories.hk-market', icon: 'i-lucide-bar-chart-3' },
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

export const greenFinanceCategories: Category[] = [
  { slug: 'green-credit', section: 'green-finance', labelKey: 'greenFinance.categories.green-credit', icon: 'i-lucide-credit-card' },
  { slug: 'green-securities', section: 'green-finance', labelKey: 'greenFinance.categories.green-securities', icon: 'i-lucide-file-bar-chart' },
  { slug: 'green-insurance', section: 'green-finance', labelKey: 'greenFinance.categories.green-insurance', icon: 'i-lucide-shield' },
  { slug: 'green-fund', section: 'green-finance', labelKey: 'greenFinance.categories.green-fund', icon: 'i-lucide-piggy-bank' },
  { slug: 'carbon-finance', section: 'green-finance', labelKey: 'greenFinance.categories.carbon-finance', icon: 'i-lucide-leaf' },
  { slug: 'sustainable-investment', section: 'green-finance', labelKey: 'greenFinance.categories.sustainable-investment', icon: 'i-lucide-trending-up' },
]

export const aiDataCategories: Category[] = [
  { slug: 'real-time-monitoring', section: 'ai-data', labelKey: 'aiData.categories.real-time-monitoring', icon: 'i-lucide-activity' },
  { slug: 'sentiment-warning', section: 'ai-data', labelKey: 'aiData.categories.sentiment-warning', icon: 'i-lucide-bell' },
  { slug: 'data-verification', section: 'ai-data', labelKey: 'aiData.categories.data-verification', icon: 'i-lucide-check-circle' },
  { slug: 'risk-profiling', section: 'ai-data', labelKey: 'aiData.categories.risk-profiling', icon: 'i-lucide-user-search' },
  { slug: 'enterprise-subscription', section: 'ai-data', labelKey: 'aiData.categories.enterprise-subscription', icon: 'i-lucide-briefcase' },
]

export const thinkTankCategories: Category[] = [
  { slug: 'policy-interpretation', section: 'think-tank', labelKey: 'thinkTank.categories.policy-interpretation', icon: 'i-lucide-file-search' },
  { slug: 'white-paper', section: 'think-tank', labelKey: 'thinkTank.categories.white-paper', icon: 'i-lucide-file-text' },
  { slug: 'special-research', section: 'think-tank', labelKey: 'thinkTank.categories.special-research', icon: 'i-lucide-search' },
  { slug: 'custom-report', section: 'think-tank', labelKey: 'thinkTank.categories.custom-report', icon: 'i-lucide-clipboard-list' },
  { slug: 'expert-pool', section: 'think-tank', labelKey: 'thinkTank.categories.expert-pool', icon: 'i-lucide-users' },
  { slug: 'internal-reference', section: 'think-tank', labelKey: 'thinkTank.categories.internal-reference', icon: 'i-lucide-lock' },
]

export const eventsCategories: Category[] = [
  { slug: 'global-forum', section: 'events', labelKey: 'events.categories.global-forum', icon: 'i-lucide-globe' },
  { slug: 'esg-summit', section: 'events', labelKey: 'events.categories.esg-summit', icon: 'i-lucide-mountain' },
  { slug: 'cloud-summit', section: 'events', labelKey: 'events.categories.cloud-summit', icon: 'i-lucide-cloud' },
  { slug: 'roadshow', section: 'events', labelKey: 'events.categories.roadshow', icon: 'i-lucide-presentation' },
  { slug: 'exhibition', section: 'events', labelKey: 'events.categories.exhibition', icon: 'i-lucide-layout-grid' },
  { slug: 'investment-cooperation', section: 'events', labelKey: 'events.categories.investment-cooperation', icon: 'i-lucide-handshake' },
]

export const supervisionCategories: Category[] = [
  { slug: 'anti-greenwashing', section: 'supervision', labelKey: 'supervision.categories.anti-greenwashing', icon: 'i-lucide-eye-off' },
  { slug: 'dishonesty-exposure', section: 'supervision', labelKey: 'supervision.categories.dishonesty-exposure', icon: 'i-lucide-alert-triangle' },
  { slug: 'integrity-enterprise', section: 'supervision', labelKey: 'supervision.categories.integrity-enterprise', icon: 'i-lucide-check-circle' },
  { slug: 'compliance-tips', section: 'supervision', labelKey: 'supervision.categories.compliance-tips', icon: 'i-lucide-info' },
  { slug: 'social-responsibility', section: 'supervision', labelKey: 'supervision.categories.social-responsibility', icon: 'i-lucide-heart' },
]

export const brandCategories: Category[] = [
  { slug: 'interview', section: 'brand', labelKey: 'brand.categories.interview', icon: 'i-lucide-mic' },
  { slug: 'press-release', section: 'brand', labelKey: 'brand.categories.press-release', icon: 'i-lucide-megaphone' },
  { slug: 'brand-showcase', section: 'brand', labelKey: 'brand.categories.brand-showcase', icon: 'i-lucide-star' },
  { slug: 'advertising', section: 'brand', labelKey: 'brand.categories.advertising', icon: 'i-lucide-monitor' },
  { slug: 'gov-enterprise-cooperation', section: 'brand', labelKey: 'brand.categories.gov-enterprise-cooperation', icon: 'i-lucide-building' },
]

export const industryCategories: Category[] = [
  { slug: 'energy', section: 'industry', labelKey: 'industry.categories.energy', icon: 'i-lucide-zap' },
  { slug: 'technology', section: 'industry', labelKey: 'industry.categories.technology', icon: 'i-lucide-cpu' },
  { slug: 'manufacturing', section: 'industry', labelKey: 'industry.categories.manufacturing', icon: 'i-lucide-factory' },
  { slug: 'consumption', section: 'industry', labelKey: 'industry.categories.consumption', icon: 'i-lucide-shopping-bag' },
  { slug: 'pharma', section: 'industry', labelKey: 'industry.categories.pharma', icon: 'i-lucide-pill' },
  { slug: 'real-estate', section: 'industry', labelKey: 'industry.categories.real-estate', icon: 'i-lucide-building-2' },
  { slug: 'automotive', section: 'industry', labelKey: 'industry.categories.automotive', icon: 'i-lucide-car' },
  { slug: 'agriculture', section: 'industry', labelKey: 'industry.categories.agriculture', icon: 'i-lucide-wheat' },
  { slug: 'transportation', section: 'industry', labelKey: 'industry.categories.transportation', icon: 'i-lucide-train-front' },
]

export const politicsCategories: Category[] = [
  { slug: 'political-news', section: 'politics', labelKey: 'politics.categories.political-news', icon: 'i-lucide-newspaper' },
  { slug: 'diplomacy', section: 'politics', labelKey: 'politics.categories.diplomacy', icon: 'i-lucide-handshake' },
  { slug: 'international-relations', section: 'politics', labelKey: 'politics.categories.international-relations', icon: 'i-lucide-globe' },
  { slug: 'policy-analysis', section: 'politics', labelKey: 'politics.categories.policy-analysis', icon: 'i-lucide-file-search' },
  { slug: 'geopolitics', section: 'politics', labelKey: 'politics.categories.geopolitics', icon: 'i-lucide-map' },
  { slug: 'international-orgs', section: 'politics', labelKey: 'politics.categories.international-orgs', icon: 'i-lucide-landmark' },
]

export const dataCenterCategories: Category[] = [
  { slug: 'macro-data', section: 'data-center', labelKey: 'dataCenter.categories.macro-data', icon: 'i-lucide-bar-chart-3' },
  { slug: 'industry-data', section: 'data-center', labelKey: 'dataCenter.categories.industry-data', icon: 'i-lucide-pie-chart' },
  { slug: 'market-index', section: 'data-center', labelKey: 'dataCenter.categories.market-index', icon: 'i-lucide-chart-line' },
  { slug: 'economic-calendar', section: 'data-center', labelKey: 'dataCenter.categories.economic-calendar', icon: 'i-lucide-calendar-days' },
  { slug: 'chart-tools', section: 'data-center', labelKey: 'dataCenter.categories.chart-tools', icon: 'i-lucide-chart-candlestick' },
]

export const globalEconomyCategories: Category[] = [
  { slug: 'macro-policy', section: 'global-economy', labelKey: 'globalEconomy.categories.macro-policy', icon: 'i-lucide-file-text' },
  { slug: 'intl-trade', section: 'global-economy', labelKey: 'globalEconomy.categories.intl-trade', icon: 'i-lucide-ship' },
  { slug: 'regional-economy', section: 'global-economy', labelKey: 'globalEconomy.categories.regional-economy', icon: 'i-lucide-map-pinned' },
  { slug: 'central-bank', section: 'global-economy', labelKey: 'globalEconomy.categories.central-bank', icon: 'i-lucide-banknote' },
  { slug: 'trade-friction', section: 'global-economy', labelKey: 'globalEconomy.categories.trade-friction', icon: 'i-lucide-scale' },
]

export const mainlandEconomyCategories: Category[] = [
  { slug: 'policy-interpretation', section: 'mainland-economy', labelKey: 'mainlandEconomy.categories.policy-interpretation', icon: 'i-lucide-file-search' },
  { slug: 'ministry-news', section: 'mainland-economy', labelKey: 'mainlandEconomy.categories.ministry-news', icon: 'i-lucide-building' },
  { slug: 'conference-report', section: 'mainland-economy', labelKey: 'mainlandEconomy.categories.conference-report', icon: 'i-lucide-mic' },
  { slug: 'political-commentary', section: 'mainland-economy', labelKey: 'mainlandEconomy.categories.political-commentary', icon: 'i-lucide-message-square-text' },
  { slug: 'high-quality-dev', section: 'mainland-economy', labelKey: 'mainlandEconomy.categories.high-quality-dev', icon: 'i-lucide-trending-up' },
  { slug: 'a-share', section: 'mainland-economy', labelKey: 'mainlandEconomy.categories.a-share', icon: 'i-lucide-chart-candlestick' },
  { slug: 'esg-report', section: 'mainland-economy', labelKey: 'mainlandEconomy.categories.esg-report', icon: 'i-lucide-file-text' },
  { slug: 'esg-disclosure', section: 'mainland-economy', labelKey: 'mainlandEconomy.categories.esg-disclosure', icon: 'i-lucide-file-check' },
  { slug: 'esg-rating', section: 'mainland-economy', labelKey: 'mainlandEconomy.categories.esg-rating', icon: 'i-lucide-award' },
  { slug: 'esg-consulting', section: 'mainland-economy', labelKey: 'mainlandEconomy.categories.esg-consulting', icon: 'i-lucide-briefcase-business' },
  { slug: 'esg-education', section: 'mainland-economy', labelKey: 'mainlandEconomy.categories.esg-education', icon: 'i-lucide-graduation-cap' },
  { slug: 'lca', section: 'mainland-economy', labelKey: 'mainlandEconomy.categories.lca', icon: 'i-lucide-workflow' },
  { slug: 'cbam', section: 'mainland-economy', labelKey: 'mainlandEconomy.categories.cbam', icon: 'i-lucide-shield' },
  { slug: 'zero-carbon-park', section: 'mainland-economy', labelKey: 'mainlandEconomy.categories.zero-carbon-park', icon: 'i-lucide-leaf' },
]

// 所有分类集合（用于 DB seed 和通用查找）
export const allCategories: Category[] = [
  ...newsCategories,
  ...gbaHkCategories,
  ...esgCategories,
  ...greenFinanceCategories,
  ...aiDataCategories,
  ...thinkTankCategories,
  ...eventsCategories,
  ...supervisionCategories,
  ...brandCategories,
  ...industryCategories,
  ...politicsCategories,
  ...dataCenterCategories,
  ...globalEconomyCategories,
  ...mainlandEconomyCategories,
]

// 按 section 获取分类的映射
export const categoriesBySection: Record<string, Category[]> = {
  'news': newsCategories,
  'gba-hk': gbaHkCategories,
  'esg': esgCategories,
  'green-finance': greenFinanceCategories,
  'ai-data': aiDataCategories,
  'think-tank': thinkTankCategories,
  'events': eventsCategories,
  'supervision': supervisionCategories,
  'brand': brandCategories,
  'industry': industryCategories,
  'politics': politicsCategories,
  'data-center': dataCenterCategories,
  'global-economy': globalEconomyCategories,
  'mainland-economy': mainlandEconomyCategories,
}

// section 的标题 i18n key 映射
export const sectionTitleKeys: Record<string, string> = {
  'news': 'news.title',
  'gba-hk': 'gbaHk.title',
  'esg': 'esg.title',
  'green-finance': 'greenFinance.title',
  'ai-data': 'aiData.title',
  'think-tank': 'thinkTank.title',
  'events': 'events.title',
  'supervision': 'supervision.title',
  'brand': 'brand.title',
  'industry': 'industry.title',
  'politics': 'politics.title',
  'data-center': 'dataCenter.title',
  'global-economy': 'globalEconomy.title',
  'mainland-economy': 'mainlandEconomy.title',
}

// 首页板块展示配置
export const homeSectionBlocks = [
  { section: 'news', labelKey: 'nav.news', icon: 'i-lucide-newspaper', color: 'text-blue-700' },
  { section: 'gba-hk', labelKey: 'nav.gbaHk', icon: 'i-lucide-map-pin', color: 'text-red-600' },
  { section: 'esg', labelKey: 'nav.esg', icon: 'i-lucide-leaf', color: 'text-emerald-600' },
  { section: 'green-finance', labelKey: 'nav.greenFinance', icon: 'i-lucide-landmark', color: 'text-teal-600' },
  { section: 'think-tank', labelKey: 'nav.thinkTank', icon: 'i-lucide-lightbulb', color: 'text-purple-600' },
  { section: 'supervision', labelKey: 'nav.supervision', icon: 'i-lucide-shield-check', color: 'text-amber-600' },
]
