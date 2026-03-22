import { getSectionCategories, useDB } from '~~/server/utils/db'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const section = typeof query.section === 'string' ? query.section.trim() : ''

  if (section) {
    return getSectionCategories(section).map(category => ({
      slug: category.slug,
      section: category.section,
      labelKey: category.label_key,
      icon: category.icon,
    }))
  }

  const db = useDB()
  const rows = db.prepare('SELECT slug, section, label_key, icon FROM categories ORDER BY section ASC, slug ASC').all() as Array<{
    slug: string
    section: string
    label_key: string
    icon: string
  }>

  return rows.map(category => ({
    slug: category.slug,
    section: category.section,
    labelKey: category.label_key,
    icon: category.icon,
  }))
})