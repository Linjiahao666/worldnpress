const SESSION_PASSWORD = 'worldnpress-admin-session-secret-2026!'

export default defineEventHandler(async (event) => {
  const session = await useSession(event, { password: SESSION_PASSWORD })
  await session.clear()
  return { success: true }
})
