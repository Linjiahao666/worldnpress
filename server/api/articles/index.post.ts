export default defineEventHandler(async (event) => {
  await requireAdminSession(event)

  const body = await readBody(event)

  const article = createArticle({
    title: body.title,
    summary: body.summary,
    content: body.content,
    contentJson: body.contentJson,
    section: body.section,
    category: body.category,
    coverImage: body.coverImage,
    tags: body.tags,
    author: body.author,
  })

  return { success: true, data: article }
})