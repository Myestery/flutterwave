<template>
  <div>
    <v-app id="inspire">
      <v-app-bar app color="primary" dark>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" />

        <v-toolbar-title style="width: 350px">
          <nuxt-link to="/" class="white--text" style="text-decoration: none"
            >Jumga</nuxt-link
          >
        </v-toolbar-title>
        <v-text-field
          flat
          solo-inverted
          hide-details
          prepend-inner-icon="mdi-magnify"
          label="Search for products"
          class="hidden-sm-and-down pl-10 ml-4"
        />
        <v-spacer />
        <v-btn icon to="/shop"> 
          <v-icon>mdi-shopping</v-icon>
        </v-btn>
        <v-btn icon to="/cart">
          <v-icon>mdi-cart</v-icon>
        </v-btn>
      </v-app-bar>
      <v-navigation-drawer
        v-model="drawer"
        dark
        temporary
        fixed
        color="primary"
        background-color="primary"
      >
        <v-app-bar color="primary">
          <v-btn rounded icon fab @click="drawer = false">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title style="width: 350px">Jumga</v-toolbar-title>
        </v-app-bar>
        <v-list nav dense color="primary" height="100px" two-line outlined>
          <v-list-item-group active-class="purple">
            <v-list-item to="/">
              <v-list-item-title
                ><v-list-item-icon> <v-icon>mdi-home</v-icon> </v-list-item-icon
                >Home</v-list-item-title
              >
            </v-list-item>
            <v-list-item to="/products">
              <v-list-item-title
                ><v-list-item-icon>
                  <v-icon>mdi-shopping</v-icon> </v-list-item-icon
                >Products</v-list-item-title
              >
            </v-list-item>
            <v-list-item to="/shop" v-if="auth.loggedIn">
              <v-list-item-title
                ><v-list-item-icon>
                  <v-icon>mdi-account-details</v-icon> </v-list-item-icon
                >Shop</v-list-item-title
              >
            </v-list-item>

            <v-list-item to="/account" v-if="auth.loggedIn">
              <v-list-item-title
                ><v-list-item-icon>
                  <v-icon>mdi-account</v-icon> </v-list-item-icon
                >Account</v-list-item-title
              >
            </v-list-item>
            <v-list-item to="/login" v-if="!auth.loggedIn">
              <v-list-item-icon>
                <v-icon>mdi-account</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Login</v-list-item-title>
            </v-list-item>
            <v-list-item v-if="auth.loggedIn" @click="Logout">
              <v-btn icon>
                <v-icon>mdi-logout</v-icon>
              </v-btn>
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>
      <router-view />
      <v-footer :padless="true">
        <v-card
          flat
          tile
          width="100%"
          class="primary white--text text-center"
        >
          <v-card-text>
            <v-btn class="mx-4 white--text" icon>
              <v-icon size="24px">mdi-home</v-icon>
            </v-btn>
            <v-btn class="mx-4 white--text" icon>
              <v-icon size="24px">mdi-email</v-icon>
            </v-btn>
            <v-btn class="mx-4 white--text" icon>
              <v-icon size="24px">mdi-calendar</v-icon>
            </v-btn>
            <v-btn class="mx-4 white--text" icon>
              <v-icon size="24px">mdi-delete</v-icon>
            </v-btn>
          </v-card-text>

          <v-card-text class="white--text pt-0">
            We at Jumga combine the services of your favourite e commerce
            platforms We provide smooth, fast transactions with the help of
            flutterwave having a range of products you can choose from. Enjoy
            your shoping
          </v-card-text>

          <v-divider></v-divider>

          <v-card-text class="white--text">
            {{ new Date().getFullYear() }} — <strong>Jumga</strong>
          </v-card-text>
        </v-card>
      </v-footer>
    </v-app>
  </div>
</template>

<script>
import Vuex from "vuex";
export default {
  data: () => ({
    drawer: false,
    items: [
      { title: "T-Shirts" },
      { title: "Jackets" },
      { title: "Shirts" },
      { title: "Jeans" },
      { title: "Shoes" },
    ],
    activeBtn: 1,
    on: false,
  }),
  head: {
    link: [{ rel: "stylesheet", href: "/css/material.css", type: "text/css" }],
  },
  computed: {
    ...Vuex.mapState(["auth"]),
  },
  methods: {
    Logout() {
      this.$auth.logout();
    },
  },
};
</script>
<style scoped>
</style>