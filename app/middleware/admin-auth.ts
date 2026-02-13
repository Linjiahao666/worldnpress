export default defineNuxtRouteMiddleware(async (to) => {
  // 只保护 /admin 路径（排除登录页）
  if (!to.path.startsWith('/admin') || to.path === '/admin/login') {
    return
  }

  try {
    const headers = process.server ? useRequestHeaders(['cookie']) : undefined
    const { authenticated } = await $fetch('/api/auth/session', {
      headers,
      credentials: 'include',
    })
    if (!authenticated) {
      return navigateTo('/admin/login')
    }
  }
  catch {
    return navigateTo('/admin/login')
  }
})
