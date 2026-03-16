export default defineEventHandler(async (event) => {
  await requireAdminSession(event)

  const id = Number(getRouterParam(event, 'id'))
  if (!id || isNaN(id)) {
    throw createError({ statusCode: 400, statusMessage: '无效的记者 ID' })
  }

  const deleted = deleteReporter(id)
  if (!deleted) {
    throw createError({ statusCode: 404, statusMessage: '记者不存在' })
  }

  return { success: true }
})
