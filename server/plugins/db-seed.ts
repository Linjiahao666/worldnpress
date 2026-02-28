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
  console.log(`[DB] Database ready. ${articleCount.count} articles in database.`)
})
