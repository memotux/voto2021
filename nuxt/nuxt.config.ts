// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxt/ui"],
  css: ['assets/styles/global.css'],
  app: {
    head: {
      link: [{
        rel: 'icon',
        href: '/images/logo.png',
        type: 'image/png'
      }]
    }
  },
  nitro: {
    storage: {
      'data:efinal': {
        driver: 'github',
        repo: 'memotux/voto2021',
        branch: 'master',
        dir: '/data',
        token: process.env.GITHUB_TOKEN,
        ttl: 86400
      }
    }
  }
})