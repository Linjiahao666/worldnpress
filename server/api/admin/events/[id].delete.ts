export default defineEventHandler(async (event) => {
  await requireAdminSession(event)

  const id = Number(getRouterParam(event, 'id'))
  if (!id || isNaN(id)) {
    throw createError({ statusCode: 400, statusMessage: '无效的活动 ID' })
  }

  const deleted = deleteEvent(id)
  if (!deleted) {
    throw createError({ statusCode: 404, statusMessage: '活动不存在' })
  }

  return { success: true }
})
