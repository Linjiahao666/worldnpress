export default defineNuxtRouteMiddleware(async (to) => {
  // 只保护 /admin 路径（排除登录页）
  if (!to.path.startsWith('/admin') || to.path === '/admin/login') {
    return
  }

  try {
    const { authenticated } = await $fetch('/api/auth/session')
    if (!authenticated) {
      return navigateTo('/admin/login')
    }
  }
  catch {
    return navigateTo('/admin/login')
  }
})
