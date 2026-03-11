export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { username, password } = body

  if (isValidAdminCredentials(username, password)) {
    const session = await getAdminSession(event)
    await session.update({ authenticated: true, username })
    return { success: true }
  }

  throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
})
