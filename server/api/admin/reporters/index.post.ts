export default defineEventHandler(async (event) => {
  await requireAdminSession(event)

  const body = await readBody(event)
  const { name, department, position, contact, sortOrder, isActive } = body

  if (!name || !department || !position || !contact) {
    throw createError({ statusCode: 400, statusMessage: '姓名、部门、职位、联系方式为必填' })
  }

  const reporter = createReporter({ name, department, position, contact, sortOrder, isActive })
  return {
    id: reporter.id,
    name: reporter.name,
    department: reporter.department,
    position: reporter.position,
    contact: reporter.contact,
    sortOrder: reporter.sort_order,
    isActive: !!reporter.is_active,
    createdAt: reporter.created_at,
    updatedAt: reporter.updated_at,
  }
})
