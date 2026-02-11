const ADMIN_USERNAME = 'admin'
const ADMIN_PASSWORD = 'wp2026@Kx9mP4'
const SESSION_PASSWORD = 'worldnpress-admin-session-secret-2026!'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { username, password } = body

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const session = await useSession(event, { password: SESSION_PASSWORD })
    await session.update({ authenticated: true, username })
    return { success: true }
  }

  throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
})
