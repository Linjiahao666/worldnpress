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

/**
 * 获取 API 密钥配置
 * 用于外部调用认证
 */
export function getApiKeyConfig() {
  const config = useRuntimeConfig()
  return {
    apiKey: config.apiKey || 'worldnpress-default-api-key-2026',
  }
}

/**
 * 验证 API 密钥是否有效
 * 支持两种传递方式：
 * 1. Authorization: Bearer {API_KEY}
 * 2. X-API-Key: {API_KEY}
 */
export function validateApiKey(event: H3Event, headerName?: 'authorization' | 'x-api-key'): boolean {
  const { apiKey } = getApiKeyConfig()

  // 优先检查 Authorization 头 (Bearer 方式)
  const authHeader = getHeader(event, 'authorization')
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7)
    if (token === apiKey) return true
  }

  // 其次检查 X-API-Key 头
  const apiKeyHeader = getHeader(event, 'x-api-key')
  if (apiKeyHeader === apiKey) return true

  return false
}

/**
 * 要求有效的 API 密钥
 * @throws 401 错误如果密钥无效
 */
export function requireApiKey(event: H3Event) {
  if (!validateApiKey(event)) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: Invalid API Key',
    })
  }
}
