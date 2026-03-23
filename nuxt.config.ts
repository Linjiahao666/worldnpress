// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  runtimeConfig: {
    adminUsername: process.env.ADMIN_USERNAME,
    adminPassword: process.env.ADMIN_PASSWORD,
    sessionPassword: process.env.SESSION_PASSWORD,
  },

  modules: [
    '@nuxt/ui',
    '@nuxtjs/i18n',
    '@nuxt/image',
  ],

  colorMode: {
    preference: 'light',
    fallback: 'light',
  },

  ui: {
    fonts: false,
  },

  i18n: {
    locales: [
      { code: 'zh-TW', name: '繁體中文', file: 'zh-TW.json' },
      { code: 'zh-CN', name: '简体中文', file: 'zh-CN.json' },
      { code: 'en', name: 'English', file: 'en.json' },
    ],
    defaultLocale: 'zh-TW',
    lazy: true,
    langDir: '../i18n/locales',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
      alwaysRedirect: false,
      fallbackLocale: 'zh-TW',
    },
    customRoutes: 'config',
    pages: {
      'admin/index': false,
      'admin/login': false,
      'admin/sections': false,
      'admin/articles/index': false,
      'admin/articles/create': false,
      'admin/articles/[id]': false,
      'admin/backup': false,
    },
  },

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: '国际经济时报',
      meta: [
        { name: 'description', content: '国际视野·财经权威·大湾区特色·ESG与绿色金融标杆·AI数据智库' },
        { name: 'theme-color', content: '#1d4ed8' },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: '国际经济时报' },
        { property: 'og:description', content: '国际视野·财经权威·大湾区特色·ESG与绿色金融标杆·AI数据智库' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },

  vite: {
    build: {
      sourcemap: false,
      reportCompressedSize: false,
      rollupOptions: {
        maxParallelFileOps: 2,
      },
    },
  },

  nitro: {
    sourceMap: false,
    timing: false,
    compressPublicAssets: false,
  },

  css: ['~/assets/css/main.css'],
})
