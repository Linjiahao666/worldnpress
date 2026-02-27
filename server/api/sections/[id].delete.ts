export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: '缺少模块ID' })
  }

  const deleted = deleteSection(id)
  if (!deleted) {
    throw createError({ statusCode: 404, statusMessage: '模块不存在' })
  }

  return { success: true, id }
})
