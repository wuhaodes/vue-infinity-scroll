import nuxt from 'coa-nuxt/nuxt-config'
import config from './config'

const devBaseURL = ''

export default nuxt({

  mode: 'spa',

  router: {
    base: config.base
  },

  head: {
    title: '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, viewport-fit=cover, initial-scale=1, user-scalable=no, minimum-scale=1, maximum-scale=1' },
      { hid: 'description', name: 'description', content: 'vue无限滚动' },
      { httpEquiv: 'Cache-Control', content: 'no-cache' },
      { httpEquiv: 'Expires', content: '0' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', type: 'text/css', href: '//at.alicdn.com/t/font_2007637_sq3x6n0yokc.css' }
    ]
  },

  loading: {
    color: '#1890FF'
  },

  loadingIndicator: {
    color: '#1890FF',
    background: 'white'
  },

  css: [
    'normalize.css'
  ],

  plugins: [
    '@/app/plugins/core',
    '@/app/plugins/directive',
    '@/app/plugins/vant'
  ],

  buildModules: [
    '@nuxt/typescript-build'
  ],

  modules: [
    '@nuxtjs/axios'
  ],

  build: {
    hardSource: false
  },

  axios: {
    baseURL: devBaseURL,
    browserBaseURL: '/',
    proxy: process.env.NODE_ENV !== 'production'
  },

  proxy: [devBaseURL + 'cgi']

})

