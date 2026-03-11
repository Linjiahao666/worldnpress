export default defineEventHandler(async (event) => {
  await requireAdminSession(event)

  const body = await readBody(event)

  if (!body.id || !body.labelKey) {
    throw createError({ statusCode: 400, statusMessage: '缺少必须字段: id, labelKey' })
  }

  // 检测 id 是否已存在
  const existing = getSectionById(body.id)
  if (existing) {
    throw createError({ statusCode: 409, statusMessage: '该模块ID已存在' })
  }

  const section = createSection({
    id: body.id,
    labelKey: body.labelKey,
    icon: body.icon || '',
    color: body.color || '',
    sortOrder: body.sortOrder ?? 0,
    showOnHome: !!body.showOnHome,
  })

  return section
})
