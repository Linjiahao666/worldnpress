export default defineEventHandler(async (event) => {
  const session = await getAdminSession(event)
  return {
    authenticated: !!session.data?.authenticated,
    username: session.data?.username || null,
  }
})
