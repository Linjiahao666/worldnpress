export default defineEventHandler(async (event) => {
  const session = await useSession(event, {
    password: 'worldnpress-admin-session-secret-2026!',
  })
  if (!session.data?.authenticated) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  return getAdminStats()
})
