export default defineEventHandler(async (event) => {
  // 支持两种认证方式：管理员会话 或 API 密钥
  const hasAdminSession = await getAdminSession(event).then(s => s.data?.authenticated).catch(() => false)

  if (!hasAdminSession && !validateApiKey(event)) {
    throw createError({
      statusCode: 401,
      statusMessage: '未授權，請先登錄或提供有效的 API 密鑰',
    })
  }

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