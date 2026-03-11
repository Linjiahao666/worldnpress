export default defineEventHandler((event) => {
  const query = getQuery(event)
  const activeOnly = query.active === 'true' || query.active === '1'

  const reporters = getReporters({ activeOnly })

  return reporters.map((reporter) => ({
    id: reporter.id,
    name: reporter.name,
    department: reporter.department,
    position: reporter.position,
    contact: reporter.contact,
    sortOrder: reporter.sort_order,
    isActive: !!reporter.is_active,
    createdAt: reporter.created_at,
    updatedAt: reporter.updated_at,
  }))
})
