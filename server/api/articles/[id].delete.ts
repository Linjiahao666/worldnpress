export default defineEventHandler(async (event) => {
  await requireAdminSession(event)

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Article ID is required' })
  }

  const deleted = deleteArticle(id)
  if (!deleted) {
    throw createError({ statusCode: 404, statusMessage: 'Article not found' })
  }

  return { success: true, id }
})
