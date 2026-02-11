export default defineEventHandler(async (event) => {
  // 驗證管理員身份
  const session = await useSession(event, {
    password: 'worldnpress-admin-session-secret-2026!',
  })
  if (!session.data?.authenticated) {
    throw createError({ statusCode: 401, statusMessage: '未授權，請先登錄' })
  }

  const body = await readBody(event)

  const article = createArticle({
    title: body.title,
    summary: body.summary,
    content: body.content,
    section: body.section,
    category: body.category,
    coverImage: body.coverImage,
    tags: body.tags,
    author: body.author,
  })

  return { success: true, data: article }
})