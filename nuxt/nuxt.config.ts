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
  }
})