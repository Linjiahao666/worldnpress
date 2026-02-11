import type { NavigationItem, Category } from '~/types'

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
  { labelKey: 'nav.gbaHk', to: '/gba-hk', comingSoon: true },
  { labelKey: 'nav.greenFinance', to: '/green-finance', comingSoon: true },
  { labelKey: 'nav.aiData', to: '/ai-data', comingSoon: true },
  { labelKey: 'nav.thinkTank', to: '/think-tank', comingSoon: true },
  { labelKey: 'nav.events', to: '/events', comingSoon: true },
  { labelKey: 'nav.supervision', to: '/supervision', comingSoon: true },
  { labelKey: 'nav.brand', to: '/brand', comingSoon: true },
  { labelKey: 'nav.about', to: '/about', comingSoon: true },
]

export const newsCategories: Category[] = [
  { slug: 'macro-economy', section: 'news', labelKey: 'news.categories.macro-economy', icon: 'i-lucide-trending-up' },
  { slug: 'global-finance', section: 'news', labelKey: 'news.categories.global-finance', icon: 'i-lucide-globe' },
  { slug: 'financial-market', section: 'news', labelKey: 'news.categories.financial-market', icon: 'i-lucide-bar-chart-3' },
  { slug: 'industrial-economy', section: 'news', labelKey: 'news.categories.industrial-economy', icon: 'i-lucide-factory' },
  { slug: 'international-trade', section: 'news', labelKey: 'news.categories.international-trade', icon: 'i-lucide-ship' },
  { slug: 'corporate-finance', section: 'news', labelKey: 'news.categories.corporate-finance', icon: 'i-lucide-building-2' },
  { slug: 'financial-law', section: 'news', labelKey: 'news.categories.financial-law', icon: 'i-lucide-scale' },
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

export const sectionCards = [
  { labelKey: 'nav.news', to: '/news', icon: 'i-lucide-newspaper', color: 'text-green-600', comingSoon: false },
  { labelKey: 'nav.esg', to: '/esg', icon: 'i-lucide-leaf', color: 'text-green-600', comingSoon: false },
  { labelKey: 'nav.gbaHk', to: '/gba-hk', icon: 'i-lucide-landmark', color: 'text-slate-400', comingSoon: true },
  { labelKey: 'nav.greenFinance', to: '/green-finance', icon: 'i-lucide-banknote', color: 'text-slate-400', comingSoon: true },
  { labelKey: 'nav.aiData', to: '/ai-data', icon: 'i-lucide-brain', color: 'text-slate-400', comingSoon: true },
  { labelKey: 'nav.thinkTank', to: '/think-tank', icon: 'i-lucide-lightbulb', color: 'text-slate-400', comingSoon: true },
  { labelKey: 'nav.events', to: '/events', icon: 'i-lucide-calendar', color: 'text-slate-400', comingSoon: true },
  { labelKey: 'nav.supervision', to: '/supervision', icon: 'i-lucide-eye', color: 'text-slate-400', comingSoon: true },
  { labelKey: 'nav.brand', to: '/brand', icon: 'i-lucide-megaphone', color: 'text-slate-400', comingSoon: true },
  { labelKey: 'nav.about', to: '/about', icon: 'i-lucide-info', color: 'text-slate-400', comingSoon: true },
]