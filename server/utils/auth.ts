export interface AdminAuthConfig {
  adminUsername: string
  adminPassword: string
  sessionPassword: string
}

export function getAdminAuthConfig(): AdminAuthConfig {
  const config = useRuntimeConfig()

  return {
    adminUsername: config.adminUsername || 'admin',
    adminPassword: config.adminPassword || 'changeme',
    sessionPassword: config.sessionPassword || 'change-this-session-password',
  }
}

export async function getAdminSession(event: Parameters<typeof useSession>[0]) {
  const { sessionPassword } = getAdminAuthConfig()
  return useSession(event, { password: sessionPassword })
}

export async function requireAdminSession(event: Parameters<typeof useSession>[0]) {
  const session = await getAdminSession(event)

  if (!session.data?.authenticated) {
    throw createError({ statusCode: 401, statusMessage: '未授權，請先登錄' })
  }

  return session
}

export function isValidAdminCredentials(username: string, password: string): boolean {
  const { adminUsername, adminPassword } = getAdminAuthConfig()
  return username === adminUsername && password === adminPassword
}
