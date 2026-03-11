export default defineEventHandler(async (event) => {
  await requireAdminSession(event)

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Article ID is required' })
  }

  const body = await readBody(event)
  const updated = updateArticle(id, {
    title: body.title,
    summary: body.summary,
    content: body.content,
    section: body.section,
    category: body.category,
    coverImage: body.coverImage,
    tags: body.tags,
    status: body.status,
    isHot: body.isHot,
    isFeatured: body.isFeatured,
    authorName: body.author?.name,
    authorAvatar: body.author?.avatar,
  })

  if (!updated) {
    throw createError({ statusCode: 404, statusMessage: 'Article not found' })
  }

  return { success: true, data: updated }
})
