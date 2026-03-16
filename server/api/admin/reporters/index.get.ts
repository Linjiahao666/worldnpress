export default defineEventHandler(async (event) => {
  await requireAdminSession(event)

  const reporters = getReporters()
  return reporters.map((r) => ({
    id: r.id,
    name: r.name,
    department: r.department,
    position: r.position,
    contact: r.contact,
    sortOrder: r.sort_order,
    isActive: !!r.is_active,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }))
})
