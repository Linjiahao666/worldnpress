export default defineEventHandler(async (event) => {
  await requireAdminSession(event)

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Article ID is required' })
  }

  const body = await readBody(event)
  const payload = normalizeArticlePayload(body, { partial: true })
  const updated = updateArticle(id, {
    title: payload.title || undefined,
    summary: payload.summary || undefined,
    content: payload.content || undefined,
    contentJson: payload.contentJson,
    section: payload.section || undefined,
    category: payload.category || undefined,
    coverImage: payload.coverImage || undefined,
    tags: payload.tags,
    status: payload.status,
    isHot: payload.isHot,
    isFeatured: payload.isFeatured,
    authorName: payload.author.name || undefined,
    authorAvatar: payload.author.avatar || undefined,
  })

  if (!updated) {
    throw createError({ statusCode: 404, statusMessage: 'Article not found' })
  }

  return { success: true, data: updated }
})
