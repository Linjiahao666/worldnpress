import { mkdirSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { allCategories } from '../../app/utils/navigation'

// 按官网建设文档定义的10个频道
const defaultSections = [
  { id: 'news', labelKey: 'nav.news', icon: 'i-lucide-newspaper', color: 'text-blue-700', sortOrder: 1, showOnHome: true },
  { id: 'gba-hk', labelKey: 'nav.gbaHk', icon: 'i-lucide-map-pin', color: 'text-red-600', sortOrder: 2, showOnHome: true },
  { id: 'esg', labelKey: 'nav.esg', icon: 'i-lucide-leaf', color: 'text-emerald-600', sortOrder: 3, showOnHome: true },
  { id: 'green-finance', labelKey: 'nav.greenFinance', icon: 'i-lucide-landmark', color: 'text-teal-600', sortOrder: 4, showOnHome: true },
  { id: 'ai-data', labelKey: 'nav.aiData', icon: 'i-lucide-brain', color: 'text-cyan-600', sortOrder: 5, showOnHome: true },
  { id: 'think-tank', labelKey: 'nav.thinkTank', icon: 'i-lucide-lightbulb', color: 'text-purple-600', sortOrder: 6, showOnHome: true },
  { id: 'events', labelKey: 'nav.events', icon: 'i-lucide-calendar', color: 'text-orange-600', sortOrder: 7, showOnHome: false },
  { id: 'supervision', labelKey: 'nav.supervision', icon: 'i-lucide-shield-check', color: 'text-amber-600', sortOrder: 8, showOnHome: false },
  { id: 'brand', labelKey: 'nav.brand', icon: 'i-lucide-star', color: 'text-pink-600', sortOrder: 9, showOnHome: false },
]

const defaultReporters = [
  { name: '张明', department: '新闻采编部', position: '首席记者', contact: 'zhangming@worldnpress.com', sortOrder: 1 },
  { name: '李华', department: '新闻采编部', position: '记者', contact: 'lihua@worldnpress.com', sortOrder: 2 },
  { name: '王芳', department: 'ESG报道部', position: '高级记者', contact: 'wangfang@worldnpress.com', sortOrder: 3 },
  { name: '陈伟', department: '财经报道部', position: '记者', contact: 'chenwei@worldnpress.com', sortOrder: 4 },
  { name: '刘洋', department: '国际报道部', position: '驻外记者', contact: 'liuyang@worldnpress.com', sortOrder: 5 },
]

const defaultEvents = [
  {
    titleKey: 'events.page.upcoming.items.esgSummit.title',
    date: '2026-04-15',
    locationKey: 'events.page.upcoming.items.esgSummit.location',
    typeKey: 'events.page.upcoming.items.esgSummit.type',
    statusKey: 'events.page.status.open',
    descKey: 'events.page.upcoming.items.esgSummit.desc',
    icon: 'i-lucide-mountain',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    category: 'upcoming',
    sortOrder: 1,
  },
  {
    titleKey: 'events.page.upcoming.items.gbaForum.title',
    date: '2026-05-20',
    locationKey: 'events.page.upcoming.items.gbaForum.location',
    typeKey: 'events.page.upcoming.items.gbaForum.type',
    statusKey: 'events.page.status.soon',
    descKey: 'events.page.upcoming.items.gbaForum.desc',
    icon: 'i-lucide-globe',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    category: 'upcoming',
    sortOrder: 2,
  },
  {
    titleKey: 'events.page.upcoming.items.greenRoadshow.title',
    date: '2026-06-10',
    locationKey: 'events.page.upcoming.items.greenRoadshow.location',
    typeKey: 'events.page.upcoming.items.greenRoadshow.type',
    statusKey: 'events.page.status.preparing',
    descKey: 'events.page.upcoming.items.greenRoadshow.desc',
    icon: 'i-lucide-presentation',
    color: 'bg-teal-50 text-teal-700 border-teal-200',
    category: 'upcoming',
    sortOrder: 3,
  },
  {
    titleKey: 'events.page.upcoming.items.aiSeminar.title',
    date: '2026-07-08',
    locationKey: 'events.page.upcoming.items.aiSeminar.location',
    typeKey: 'events.page.upcoming.items.aiSeminar.type',
    statusKey: 'events.page.status.preparing',
    descKey: 'events.page.upcoming.items.aiSeminar.desc',
    icon: 'i-lucide-cloud',
    color: 'bg-purple-50 text-purple-700 border-purple-200',
    category: 'upcoming',
    sortOrder: 4,
  },
  {
    titleKey: 'events.page.past.items.esgRating.title',
    date: '2025-12-15',
    locationKey: 'events.page.past.items.esgRating.location',
    typeKey: '',
    statusKey: '',
    descKey: '',
    icon: '',
    color: '',
    category: 'past',
    sortOrder: 101,
  },
  {
    titleKey: 'events.page.past.items.carbonExpo.title',
    date: '2025-11-08',
    locationKey: 'events.page.past.items.carbonExpo.location',
    typeKey: '',
    statusKey: '',
    descKey: '',
    icon: '',
    color: '',
    category: 'past',
    sortOrder: 102,
  },
  {
    titleKey: 'events.page.past.items.economyTalk.title',
    date: '2025-10-20',
    locationKey: 'events.page.past.items.economyTalk.location',
    typeKey: '',
    statusKey: '',
    descKey: '',
    icon: '',
    color: '',
    category: 'past',
    sortOrder: 103,
  },
]

export default defineNitroPlugin(() => {
  // 确保 data 目录存在
  const dataDir = resolve(process.cwd(), 'data')
  if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true })
  }

  const db = useDB()

  // 初始化分类数据
  const categoryCount = db.prepare('SELECT COUNT(*) as count FROM categories').get() as { count: number }
  if (categoryCount.count < allCategories.length) {
    console.log('[DB] Seeding categories...')
    const insertCategory = db.prepare(
      'INSERT OR IGNORE INTO categories (slug, section, label_key, icon) VALUES (?, ?, ?, ?)',
    )
    for (const cat of allCategories) {
      insertCategory.run(cat.slug, cat.section, cat.labelKey, cat.icon || '')
    }
    console.log('[DB] Categories seeded.')
  }

  // 初始化模块（sections）数据 - 重新初始化以匹配新架构
  const sectionCount = db.prepare('SELECT COUNT(*) as count FROM sections').get() as { count: number }
  if (sectionCount.count === 0) {
    console.log('[DB] Seeding sections...')
    const insertSection = db.prepare(
      'INSERT OR IGNORE INTO sections (id, label_key, icon, color, sort_order, show_on_home, is_active, created_at) VALUES (?, ?, ?, ?, ?, ?, 1, ?)',
    )
    const now = new Date().toISOString()
    for (const sec of defaultSections) {
      insertSection.run(sec.id, sec.labelKey, sec.icon, sec.color, sec.sortOrder, sec.showOnHome ? 1 : 0, now)
    }
    console.log('[DB] Sections seeded.')
  }
  else {
    // 确保新 sections 存在（增量添加）
    const insertSection = db.prepare(
      'INSERT OR IGNORE INTO sections (id, label_key, icon, color, sort_order, show_on_home, is_active, created_at) VALUES (?, ?, ?, ?, ?, ?, 1, ?)',
    )
    const now = new Date().toISOString()
    for (const sec of defaultSections) {
      insertSection.run(sec.id, sec.labelKey, sec.icon, sec.color, sec.sortOrder, sec.showOnHome ? 1 : 0, now)
    }
  }

  const articleCount = db.prepare('SELECT COUNT(*) as count FROM articles').get() as { count: number }

  const reporterCount = db.prepare('SELECT COUNT(*) as count FROM reporters').get() as { count: number }
  if (reporterCount.count === 0) {
    console.log('[DB] Seeding reporters...')
    const insertReporter = db.prepare(`
      INSERT INTO reporters (name, department, position, contact, sort_order, is_active, created_at)
      VALUES (?, ?, ?, ?, ?, 1, ?)
    `)
    const now = new Date().toISOString()
    for (const item of defaultReporters) {
      insertReporter.run(item.name, item.department, item.position, item.contact, item.sortOrder, now)
    }
    console.log('[DB] Reporters seeded.')
  }

  const eventCount = db.prepare('SELECT COUNT(*) as count FROM events').get() as { count: number }
  if (eventCount.count === 0) {
    console.log('[DB] Seeding events...')
    const insertEvent = db.prepare(`
      INSERT INTO events (title_key, date, location_key, type_key, status_key, desc_key, icon, color, category, sort_order, is_active, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
    `)
    const now = new Date().toISOString()
    for (const item of defaultEvents) {
      insertEvent.run(
        item.titleKey,
        item.date,
        item.locationKey,
        item.typeKey,
        item.statusKey,
        item.descKey,
        item.icon,
        item.color,
        item.category,
        item.sortOrder,
        now,
      )
    }
    console.log('[DB] Events seeded.')
  }

  console.log(`[DB] Database ready. ${articleCount.count} articles in database.`)
})
