export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Article ID is required' })
  }

  const viewCount = incrementViewCount(id)
  if (viewCount === 0) {
    throw createError({ statusCode: 404, statusMessage: 'Article not found' })
  }

  return { viewCount }
})
