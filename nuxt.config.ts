// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/ui',
    '@nuxtjs/i18n',
    '@nuxt/image',
  ],

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
    },
    customRoutes: 'config',
    pages: {
      'admin/index': false,
      'admin/login': false,
      'admin/articles/index': false,
      'admin/articles/create': false,
      'admin/articles/[id]': false,
    },
  },

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: '國際社會責任通訊社有限公司',
      meta: [
        { name: 'description', content: '世界財經新聞門戶 - 提供全球財經、ESG可持續發展、綠色金融等專業資訊' },
        { name: 'theme-color', content: '#4ADE80' },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: '國際社會責任通訊社有限公司' },
        { property: 'og:description', content: '世界財經新聞門戶 - 提供全球財經、ESG可持續發展、綠色金融等專業資訊' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },

  css: ['~/assets/css/main.css'],
})
