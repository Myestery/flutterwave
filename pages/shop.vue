<template>
  <div>
    <v-container style="margin-top: 5%">
      <div class="row">
        <div class="col-md-3 col-sm-3 col-xs-12">
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" persistent max-width="600px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark v-bind="attrs" v-on="on" style="margin-top:20%">
                Add Goods
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">Product Details</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-form v-model="valid">
                    <v-row>
                      <v-col cols="12">
                        <v-text-field
                          label="Name*"
                          required
                          :rules="nameRules"
                          v-model="new_product.name"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-select
                          :items="[
                            { name: 'Men', value: 'men' },
                            { name: 'Women', value: 'women' },
                            { name: 'Children', value: 'children' },
                            { name: 'Unisex', value: 'unisex' },
                          ]"
                          item-text="name"
                          item-value="value"
                          label="Category*"
                          :rules="nameRules"
                          v-model="new_product.category"
                          required
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field
                          label="Price in Dollars*"
                          required
                          type="number"
                          :rules="nameRules"
                          v-model="new_product.price"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          label="Description*"
                          required
                          :rules="nameRules"
                          v-model="new_product.description"
                        ></v-text-field>
                      </v-col>
                    </v-row> </v-form
                ></v-container>
                <small>*indicates required field</small>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click="Add" :disabled="!valid">
                  SAVE
                </v-btn>
                <v-btn color="danger" text @click="dialog = false">
                  cancel
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
        <div class="col-md-9 col-sm-9 col-xs-12">
          <v-row dense>
            <v-col cols="12" sm="8" class="pl-6 pt-6">
              <p>My Goods</p>
            </v-col>
          </v-row>

          <v-divider></v-divider>

          <div class="row text-center">
            <div
              class="col-md-3 col-sm-6 col-xs-12"
              :key="pro._id"
              v-for="(pro, index) in products"
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
                        <v-btn v-if="hover" href="/product" class="" outlined
                          >VIEW</v-btn
                        >
                      </div>
                    </v-expand-transition>
                  </v-img>
                  <v-card-text class="text--primary">
                    <div>
                      <router-link
                        :to="`/product/${pro.id}`"
                        style="text-decoration: none"
                        >{{ auth.user.shop.name }}</router-link
                      >
                    </div>
                    <div>${{ pro.price }}</div>
                  </v-card-text>
                  <v-card-actions>
                    <v-btn
                      @click="
                        edit_dialog = !edit_dialog;
                        active_pro = { ...pro };
                        selected_index = index;
                      "
                      >Edit</v-btn
                    >
                    <v-btn color="warning" @click="Delete(index)">delete</v-btn>
                  </v-card-actions>
                </v-card>
              </v-hover>
            </div>
            <v-skeleton-loader
              v-bind="attrs"
              v-if="loading"
              class="col-md-3 col-sm-6 col-xs-12"
              :loading="true"
              type="card-avatar, actions"
            ></v-skeleton-loader>
          </div>
        </div>
      </div>
    </v-container>
    <v-dialog v-model="edit_dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Product Details</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form v-model="valid_edit">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    label="Name*"
                    required
                    v-model="active_pro.name"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-select
                    :items="[
                      { name: 'Men', value: 'men' },
                      { name: 'Women', value: 'women' },
                      { name: 'Children', value: 'children' },
                      { name: 'Unisex', value: 'unisex' },
                    ]"
                    item-text="name"
                    item-value="value"
                    label="Category*"
                    :rules="nameRules"
                    v-model="active_pro.category"
                    required
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    label="Price in Dollars*"
                    required
                    type="number"
                    v-model="active_pro.price"
                    :rules="nameRules"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Description*"
                    :rules="nameRules"
                    v-model="active_pro.description"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="Edit" :disabled="!valid_edit">
            SAVE
          </v-btn>
          <v-btn color="danger" text @click="edit_dialog = false">
            cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
       <v-dialog v-model="new_shop" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Welcome Home</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            Here you can addgoods and sell them at your will
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
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
import Vuex from 'vuex'
export default {
  middleware:["auth","shop-owner"],
  data: () => ({
    attrs: {
      class: "mb-6",
      boilerplate: true,
      elevation: 2,
    },
    range: [0, 10000],
    dialog: false,
    edit_dialog: false,
    active_pro: {},
    page: 1,
    min: 0,
    max: 10000,
    new_product: {},
    valid: false,
    loading: false,
    nameRules: [(v) => !!v || "This Field is required"],
    selected_index: 0,
    valid_edit: "",
    new_shop:false
  }),
  methods: {
    Add() {
      this.dialog = false;
      this.loading = true;
      this.$axios
        .$post("/api/goods", {
          ...this.new_product,
          shop_id: this.$auth.user.shop._id,
        })
        .then((data) => {
          this.loading = false;
          this.products = [
            ...this.products,
            {
              ...this.new_product,
              image: data.image,
            },
          ];
          this.new_product = {};
        })
        .catch((err) => console.error(err));
    },
    Edit() {
      this.edit_dialog = false;
      this.$axios
        .$put(`/api/goods/${this.active_pro._id}`, this.active_pro)
        .then((data) => {
          this.products = this.products.map((x, index) =>
            index == this.selected_index ? { ...this.active_pro } : x
          );
        })
        .catch((err) => console.error(err));
    },
    Delete(index) {
      this.$axios
        .$delete(`/api/goods/${this.products[index]._id}`)
        .then((c) => {
          this.products = this.products.filter((x, i) => index !== i);
        })
        .catch((err) => console.error(err));
    },
  },
  async asyncData({isDev, route, store,$axios}) {
    let products = await $axios.$get("/api/shop/goods")
    return{
      products
    }
  },
  computed: {
    ...Vuex.mapState(['auth'])
  },
  mounted() {
    if(this.$route.query && this.$route.query.hasOwnProperty('new')){
      this.new_shop = true
    }
  },
};
</script>
