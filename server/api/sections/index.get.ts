export default defineEventHandler((event) => {
  const query = getQuery(event)
  const activeOnly = query.active === 'true' || query.active === '1'
  const homeOnly = query.home === 'true' || query.home === '1'

  const sections = getSections({ activeOnly, homeOnly })

  // 为每个 section 附带其分类数据
  return sections.map((s) => {
    const categories = getSectionCategories(s.id)
    return {
      id: s.id,
      labelKey: s.label_key,
      icon: s.icon,
      color: s.color,
      sortOrder: s.sort_order,
      showOnHome: !!s.show_on_home,
      isActive: !!s.is_active,
      createdAt: s.created_at,
      updatedAt: s.updated_at,
      categories: categories.map(c => ({
        slug: c.slug,
        section: c.section,
        labelKey: c.label_key,
        icon: c.icon,
      })),
    }
  })
})
