export default defineNuxtRouteMiddleware((to) => {
  const hiddenPrefixes = [
    '/gba-hk',
    '/green-finance',
    '/ai-data',
    '/think-tank',
    '/events',
    '/supervision',
    '/brand',
    '/about',
  ]

  const normalizedPath = to.path.replace(/^\/(zh-TW|zh-CN|en)(?=\/)/, '')

  if (hiddenPrefixes.some(prefix => normalizedPath.startsWith(prefix))) {
    const localePath = useLocalePath()
    return navigateTo(localePath('/'))
  }
})