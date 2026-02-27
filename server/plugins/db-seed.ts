import { mkdirSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { allCategories } from '../../app/utils/navigation'

// 默认模块（section）数据
const defaultSections = [
  { id: 'global-economy', labelKey: 'nav.globalEconomy', icon: 'i-lucide-globe', color: 'text-blue-600', sortOrder: 1, showOnHome: true },
  { id: 'mainland-economy', labelKey: 'nav.mainlandEconomy', icon: 'i-lucide-landmark', color: 'text-red-600', sortOrder: 2, showOnHome: true },
  { id: 'industry', labelKey: 'nav.industry', icon: 'i-lucide-factory', color: 'text-amber-600', sortOrder: 3, showOnHome: true },
  { id: 'esg', labelKey: 'nav.esg', icon: 'i-lucide-leaf', color: 'text-green-600', sortOrder: 4, showOnHome: true },
  { id: 'news', labelKey: 'nav.news', icon: 'i-lucide-newspaper', color: 'text-slate-600', sortOrder: 5, showOnHome: false },
  { id: 'politics', labelKey: 'nav.politics', icon: 'i-lucide-landmark', color: 'text-indigo-600', sortOrder: 6, showOnHome: false },
  { id: 'data-center', labelKey: 'nav.dataCenter', icon: 'i-lucide-database', color: 'text-cyan-600', sortOrder: 7, showOnHome: false },
  { id: 'think-tank', labelKey: 'nav.thinkTank', icon: 'i-lucide-lightbulb', color: 'text-purple-600', sortOrder: 8, showOnHome: true },
]

export default defineNitroPlugin(() => {
  // 确保 data 目录存在
  const dataDir = resolve(process.cwd(), 'data')
  if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true })
  }

  const db = useDB()

  // 初始化分类数据（使用 INSERT OR IGNORE 确保新分类被添加）
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

  // 初始化模块（sections）数据
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

  const articleCount = db.prepare('SELECT COUNT(*) as count FROM articles').get() as { count: number }
  console.log(`[DB] Database ready. ${articleCount.count} articles in database.`)
})
