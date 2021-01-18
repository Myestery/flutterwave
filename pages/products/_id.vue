<template>
  <div>
    <v-container style="margin-top: 5%">
      <div class="row">
        <div class="col-md-5 col-sm-5 col-xs-12">
          <v-carousel>
            <v-carousel-item :src="'/img/home/slider4.jpg'"> </v-carousel-item>
            <v-carousel-item :src="'/img/home/slider2.jpg'"> </v-carousel-item>
            <v-carousel-item :src="'/img/home/slider3.jpg'"> </v-carousel-item>
            <v-carousel-item :src="'/img/home/slider1.jpg'"> </v-carousel-item>
          </v-carousel>
        </div>
        <div class="col-md-7 col-sm-7 col-xs-12">
          <v-breadcrumbs class="pb-0" :items="breadcrums"></v-breadcrumbs>
          <div class="pl-6">
            <p class="display-1 mb-0">{{ product.name }}</p>
            <v-card-actions class="pa-0">
              <p class="headline font-weight-light pt-3">
                ${{ product.price }}
              </p>
            </v-card-actions>
            <p class="subtitle-1 font-weight-thin">
              Sold By : {{ product.Shop.name }}
            </p>
            <v-btn
              class="primary white--text"
              outlined
              tile
              dense
              @click="Buy(product)"
              ><v-icon>mdi-cart</v-icon
              >{{
                $store.state.cart.staging[product._id] !== true
                  ? "Add To Cart"
                  : "Remove from Cart"
              }}</v-btn
            >
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-12 col-xs-12 col-md-12">
          <v-tabs>
            <v-tab>Description</v-tab>
            <v-tab-item>
              <p class="pt-10 subtitle-1 font-weight-thin">
                {{ product.description }}
              </p>
            </v-tab-item>
          </v-tabs>
          <v-card-text class="pa-0 pt-4" tile outlined>
            <p class="subtitle-1 font-weight-light pt-3 text-center">
              YOU MIGHT ALSO LIKE
            </p>
            <v-divider></v-divider>
            <v-container>
              <v-row no-gutters>
                <v-col :cols="12">
                  <v-card-text class="" tile outlined>
                    <div class="row">
                      <div
                        class="col-12 col-md-3 col-sm-6 col-xs-6 text-center"
                      >
                        <v-hover v-slot:default="{ hover }" open-delay="200">
                          <v-card :elevation="hover ? 16 : 2">
                            <v-img
                              class="white--text align-end"
                              height="200px"
                              :src="'/img/home/deal1.jpg'"
                            >
                              <v-card-title>Women Clothing </v-card-title>
                            </v-img>

                            <v-card-text class="text--primary text-center">
                              <div>Upto 60% + Extra 10%</div>
                              <div>Baggit, Zara, Fossil</div>
                            </v-card-text>

                            <div class="text-center">
                              <v-btn
                                to="/products?category=women"
                                class="ma-2"
                                outlined
                                color="info"
                              >
                                Explore
                              </v-btn>
                            </div>
                          </v-card>
                        </v-hover>
                      </div>
                      <div
                        class="col-12 col-md-3 col-sm-6 col-xs-6 text-center"
                      >
                        <v-hover v-slot:default="{ hover }" open-delay="200">
                          <v-card :elevation="hover ? 16 : 2">
                            <v-img
                              class="white--text align-end"
                              height="200px"
                              :src="'/img/home/deal2.jpg'"
                            >
                              <v-card-title>Men Clothing </v-card-title>
                            </v-img>

                            <v-card-text class="text--primary text-center">
                              <div>Upto 50%</div>
                              <div>Zara, Selected, Celio</div>
                            </v-card-text>

                            <div class="text-center">
                              <v-btn
                                to="/products?category=men"
                                class="ma-2"
                                outlined
                                color="info"
                              >
                                Explore
                              </v-btn>
                            </div>
                          </v-card>
                        </v-hover>
                      </div>
                      <div
                        class="col-12 col-md-3 col-sm-6 col-xs-6 text-center"
                      >
                        <v-hover v-slot:default="{ hover }" open-delay="200">
                          <v-card :elevation="hover ? 16 : 2">
                            <v-img
                              class="white--text align-end"
                              height="200px"
                              :src="'/img/home/deal3.jpg'"
                            >
                              <v-card-title>Children Clothing </v-card-title>
                            </v-img>

                            <v-card-text class="text--primary text-center">
                              <div>Upto 60% + Extra 10%</div>
                              <div>Jack & Jones, Levis</div>
                            </v-card-text>

                            <div class="text-center">
                              <v-btn
                                to="/products?category=children"
                                class="ma-2"
                                outlined
                                color="info"
                              >
                                Explore
                              </v-btn>
                            </div>
                          </v-card>
                        </v-hover>
                      </div>
                      <div
                        class="col-12 col-md-3 col-sm-6 col-xs-6 text-center"
                      >
                        <v-hover v-slot:default="{ hover }" open-delay="200">
                          <v-card :elevation="hover ? 16 : 2">
                            <v-img
                              class="white--text align-end"
                              height="200px"
                              :src="'/img/home/deal4.jpg'"
                            >
                              <v-card-title>Unisex </v-card-title>
                            </v-img>

                            <v-card-text class="text--primary text-center">
                              <div>Upto 60% + Extra 10%</div>
                              <div>Nike, Adidas, Puma</div>
                            </v-card-text>

                            <div class="text-center">
                              <v-btn
                                to="/products?category=unisex"
                                class="ma-2"
                                outlined
                                color="info"
                              >
                                Explore
                              </v-btn>
                            </div>
                          </v-card>
                        </v-hover>
                      </div>
                    </div>
                  </v-card-text>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </div>
      </div>
    </v-container>
  </div>
</template>
<script>
export default {
  auth: false,
  async asyncData({ params, $axios }) {
    let product = await $axios.$get(`/api/goods/${params.id}`);
    return {
      product
    };
  },
  data: () => ({
    rating: 4.5,
    breadcrums: [
      {
        text: "Home",
        disabled: false,
        to: "/"
      },
      {
        text: "MarketPlace",
        disabled: false,
        to: "/products"
      },
      {
        text: "T-Shirts",
        disabled: true,
        to: "/products/:id"
      }
    ]
  }),
  methods: {
    Buy(product) {
      this.$store.dispatch("cart/ADD_OR_REMOVE", product);
      this.$forceUpdate()
    }
  }
};
</script>
