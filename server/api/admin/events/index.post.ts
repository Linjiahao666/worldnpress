export default defineEventHandler(async (event) => {
  await requireAdminSession(event)

  const body = await readBody(event)
  const { titleKey, date, locationKey, category } = body

  if (!titleKey || !date || !locationKey || !category) {
    throw createError({ statusCode: 400, statusMessage: '标题、日期、地点、分类为必填' })
  }

  if (!['upcoming', 'past'].includes(category)) {
    throw createError({ statusCode: 400, statusMessage: '分类必须是 upcoming 或 past' })
  }

  const created = createEvent(body)
  return {
    id: created.id,
    titleKey: created.title_key,
    date: created.date,
    locationKey: created.location_key,
    typeKey: created.type_key,
    statusKey: created.status_key,
    descKey: created.desc_key,
    icon: created.icon,
    color: created.color,
    category: created.category,
    sortOrder: created.sort_order,
    isActive: !!created.is_active,
    createdAt: created.created_at,
    updatedAt: created.updated_at,
  }
})
