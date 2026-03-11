export default defineEventHandler((event) => {
  const query = getQuery(event)
  const category = query.category === 'past' ? 'past' : (query.category === 'upcoming' ? 'upcoming' : undefined)
  const activeOnly = query.active === 'true' || query.active === '1'

  const events = getEvents({ category, activeOnly })

  return events.map((item) => ({
    id: item.id,
    titleKey: item.title_key,
    date: item.date,
    locationKey: item.location_key,
    typeKey: item.type_key,
    statusKey: item.status_key,
    descKey: item.desc_key,
    icon: item.icon,
    color: item.color,
    category: item.category,
    sortOrder: item.sort_order,
    isActive: !!item.is_active,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  }))
})
