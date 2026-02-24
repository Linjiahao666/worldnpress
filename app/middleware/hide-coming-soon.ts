export default defineNuxtRouteMiddleware((to) => {
  const hiddenPrefixes = [
    '/data-center',
    '/gba-hk',
    '/green-finance',
    '/ai-data',
    '/events',
    '/supervision',
    '/brand',
  ]

  const normalizedPath = to.path.replace(/^\/(zh-TW|zh-CN|en)(?=\/)/, '')

  if (hiddenPrefixes.some(prefix => normalizedPath.startsWith(prefix))) {
    const localePath = useLocalePath()
    return navigateTo(localePath('/'))
  }
})