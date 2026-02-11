const SESSION_PASSWORD = 'worldnpress-admin-session-secret-2026!'

export default defineEventHandler(async (event) => {
  const session = await useSession(event, { password: SESSION_PASSWORD })
  return {
    authenticated: !!session.data?.authenticated,
    username: session.data?.username || null,
  }
})
