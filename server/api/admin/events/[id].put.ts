export default defineEventHandler(async (event) => {
  await requireAdminSession(event)

  const id = Number(getRouterParam(event, 'id'))
  if (!id || isNaN(id)) {
    throw createError({ statusCode: 400, statusMessage: '无效的活动 ID' })
  }

  const body = await readBody(event)

  if (body.category && !['upcoming', 'past'].includes(body.category)) {
    throw createError({ statusCode: 400, statusMessage: '分类必须是 upcoming 或 past' })
  }

  const updated = updateEvent(id, body)
  if (!updated) {
    throw createError({ statusCode: 404, statusMessage: '活动不存在' })
  }

  return {
    id: updated.id,
    titleKey: updated.title_key,
    date: updated.date,
    locationKey: updated.location_key,
    typeKey: updated.type_key,
    statusKey: updated.status_key,
    descKey: updated.desc_key,
    icon: updated.icon,
    color: updated.color,
    category: updated.category,
    sortOrder: updated.sort_order,
    isActive: !!updated.is_active,
    createdAt: updated.created_at,
    updatedAt: updated.updated_at,
  }
})
