export default defineEventHandler(async (event) => {
  await requireAdminSession(event)

  const body = await readBody(event)
  const payload = normalizeArticlePayload(body)

  const article = createArticle({
    title: payload.title,
    summary: payload.summary,
    content: payload.content,
    contentJson: payload.contentJson || undefined,
    section: payload.section,
    category: payload.category,
    coverImage: payload.coverImage,
    tags: payload.tags,
    author: payload.author,
  })

  return { success: true, data: article }
})