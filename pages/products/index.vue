<template>
  <div>
    <v-container style="margin-top: 5%">
      <div class="row">
        <div class="col-md-3 col-sm-3 col-xs-12">
          <v-card outlined>
            <v-card-title>Filters</v-card-title>
            <v-divider></v-divider>
            <template>
              <v-select
                v-model="category"
                :items="items"
                item-text="text"
                item-value="value"
                outlined
                dense
                label="Categories"
              ></v-select>
            </template>
            <v-divider></v-divider>

            <v-divider></v-divider>
          </v-card>
        </div>
        <div class="col-md-9 col-sm-9 col-xs-12">
          <v-breadcrumbs class="pb-0" :items="breadcrums"></v-breadcrumbs>

          <v-row dense>
            <v-col cols="12" sm="8" class="pl-6 pt-6">
              <small>Showing {{ category_text }}</small>
            </v-col>
          </v-row>

          <v-divider></v-divider>

          <div class="row text-center">
            <div
              class="col-md-3 col-sm-6 col-xs-12"
              :key="pro._id"
              v-for="pro in products_categorized"
            >
              <v-hover v-slot:default="{ hover }">
                <v-card class="mx-auto" color="grey lighten-4" max-width="600">
                  <v-img
                    class="white--text align-end"
                    :aspect-ratio="16 / 9"
                    height="200px"
                    :src="`/img/home/${pro.image}`"
                  >
                    <v-card-title>{{ pro.name }} </v-card-title>
                    <v-expand-transition>
                      <div
                        v-if="hover"
                        class="d-flex transition-fast-in-fast-out white darken-2 v-card--reveal display-3 white--text"
                        style="height: 100%"
                      >
                        <v-btn
                          v-if="hover"
                          :to="`/products/${pro._id}`"
                          class=""
                          outlined
                          >VIEW</v-btn
                        >
                      </div>
                    </v-expand-transition>
                  </v-img>
                  <v-card-text class="text--primary">
                    <div>
                      <nuxt-link
                        :to="`/products/${pro._id}`"
                        style="text-decoration: none"
                        >{{ pro.Shop.name }}</nuxt-link
                      >
                    </div>
                    <div>${{ pro.price }}</div>
                  </v-card-text>
                    <v-card-actions>
                    <v-btn color="primary" block @click="Buy(pro)">{{
                      $store.state.cart.staging[pro._id] !== true
                        ? "Add To Cart"
                        : "Remove from Cart"
                    }}</v-btn>
                  </v-card-actions>
                </v-card>
              </v-hover>
            </div>
          </div>
        </div>
      </div>
    </v-container>
  </div>
</template>
<style>
.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  opacity: 0.8;
  position: absolute;
  width: 100%;
}
</style>
<script>
import { mapState } from "vuex";
export default {
  auth: false,
  async asyncData({ $axios }) {
    let products = await $axios.$get("/api/goods");
    return {
      products,
    };
  },
  data: () => ({
    page: 1,
    breadcrums: [
      {
        text: "Home",
        disabled: false,
        to: "/",
      },
      {
        text: "Products",
        disabled: false,
        to: "/products",
      },
    ],
    items: [
      { text: "All", value: null },
      { id: 5, value: "Men", text: "Men" },
      { id: 6, value: "Women", text: "Women" },
      { id: 7, value: "Children", text: "Children" },
      { id: 8, value: "Unisex", text: "Unisex" },
    ],
    category: null,
  }),
  computed: {
    products_categorized() {
      let category = this.category;
      if (category == null) return this.products ? [...this.products] : [];
      return this.products
        ? this.products.filter((x) => x.category == category.toLowerCase())
        : [];
    },
    category_text() {
      let category = this.category;
      if (category == null) return "All Products";
      return `${this.category} products only`;
    },
  },
  methods: {
    Buy(product) {
      this.$store.dispatch("cart/ADD_OR_REMOVE", product);
      this.$forceUpdate();
    },
  },
  mounted() {
    if (
      this.$route.query.hasOwnProperty("category") &&
      this.$route.query.category
    ) {
      this.category = this.$route.query.category;
    }
  },
};
</script>
