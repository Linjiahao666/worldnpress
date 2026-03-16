export default defineEventHandler(async (event) => {
  await requireAdminSession(event)

  const id = Number(getRouterParam(event, 'id'))
  if (!id || isNaN(id)) {
    throw createError({ statusCode: 400, statusMessage: '无效的记者 ID' })
  }

  const body = await readBody(event)
  const reporter = updateReporter(id, body)

  if (!reporter) {
    throw createError({ statusCode: 404, statusMessage: '记者不存在' })
  }

  return {
    id: reporter.id,
    name: reporter.name,
    department: reporter.department,
    position: reporter.position,
    contact: reporter.contact,
    sortOrder: reporter.sort_order,
    isActive: !!reporter.is_active,
    createdAt: reporter.created_at,
    updatedAt: reporter.updated_at,
  }
})
