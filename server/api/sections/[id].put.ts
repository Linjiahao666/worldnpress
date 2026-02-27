export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: '缺少模块ID' })
  }

  const body = await readBody(event)

  const updated = updateSection(id, {
    labelKey: body.labelKey,
    icon: body.icon,
    color: body.color,
    sortOrder: body.sortOrder,
    showOnHome: body.showOnHome,
    isActive: body.isActive,
  })

  if (!updated) {
    throw createError({ statusCode: 404, statusMessage: '模块不存在' })
  }

  return {
    id: updated.id,
    labelKey: updated.label_key,
    icon: updated.icon,
    color: updated.color,
    sortOrder: updated.sort_order,
    showOnHome: !!updated.show_on_home,
    isActive: !!updated.is_active,
    createdAt: updated.created_at,
    updatedAt: updated.updated_at,
  }
})
