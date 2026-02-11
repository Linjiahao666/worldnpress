import { mkdirSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { newsCategories, esgCategories } from '../../app/utils/navigation'

export default defineNitroPlugin(() => {
  // 确保 data 目录存在
  const dataDir = resolve(process.cwd(), 'data')
  if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true })
  }

  const db = useDB()

  // 初始化分类数据
  const categoryCount = db.prepare('SELECT COUNT(*) as count FROM categories').get() as { count: number }
  if (categoryCount.count === 0) {
    console.log('[DB] Seeding categories...')
    const insertCategory = db.prepare(
      'INSERT OR IGNORE INTO categories (slug, section, label_key, icon) VALUES (?, ?, ?, ?)',
    )
    for (const cat of [...newsCategories, ...esgCategories]) {
      insertCategory.run(cat.slug, cat.section, cat.labelKey, cat.icon || '')
    }
    console.log('[DB] Categories seeded.')
  }

  const articleCount = db.prepare('SELECT COUNT(*) as count FROM articles').get() as { count: number }
  console.log(`[DB] Database ready. ${articleCount.count} articles in database.`)
})
