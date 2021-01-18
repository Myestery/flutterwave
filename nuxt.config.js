import colors from "vuetify/es5/util/colors";

export default {
  generate: {
    fallback: true
  },
  /*
   ** Nuxt rendering mode
   ** See https://nuxtjs.org/api/configuration-mode
   */
  // mode: "universal",
  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: "server",
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    titleTemplate: "%s - " + process.env.npm_package_name,
    title: process.env.npm_package_name || "",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || ""
      }
    ],
    link: [
      { rel: "icon", type: "image/svg", href: "/img/logo1.svg" },
      { rel: "stylesheet", href: "/css/material.css", type: "text/css" },
      { rel: "stylesheet", href: "/css/material-icon.css", type: "text/css" }
    ]
  },
  router: {
    middleware: ['auth']
  },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: [
    '~/plugins/flutterwave.js'
  ],
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: true,
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: ["@nuxtjs/vuetify"],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    "@nuxtjs/axios",
    // Doc: https://github.com/nuxt/content
    "@nuxt/content",
    "@nuxtjs/auth", // enables Nuxt Auth module
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    baseURL: process.env.APP_URL
  },
  /*
   ** Content module configuration
   ** See https://content.nuxtjs.org/configuration
   */
  content: {},
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ["~/assets/variables.scss"],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },
  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
  build: {
    transpile:[ 
        "flutterwave-vue-v3"
      ]
  },
  serverMiddleware: ["~/api/index.js"],
  auth: {
    strategies: {
      local: {
        endpoints: {
          // these are the API endpoints we created in Express
          login: {
            url: "/api/users/login",
            method: "post",
            propertyName: "token"
          },
          logout: {
            url: "/api/users/logout",
            method: "post"
          },
          user: {
            url: "/api/users/user",
            method: "get",
            propertyName: "user"
          }
        },
        tokenRequired: true,
        tokenType: "Bearer",
      }
    },
    redirect: {
      login: "/login", // User will be redirected to this path if login is required
      logout: "/", // User will be redirected to this path if after logout, current route is protected
      home: "/user/home" // User will be redirect to this path after login if accessed login page directly
    },
    rewriteRedirects: true
  }
};
