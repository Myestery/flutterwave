<template>
  <div>
    <v-carousel hide-delimiters>
      <v-carousel-item :src="'/img/home/slider4.jpg'">
        <v-row class="fill-height" align="center" justify="center">
          <div class="display-2 white--text pl-5 pr-5 hidden-sm-only">
            <strong>Get the best deals in the market</strong>
          </div>
          <br />
        </v-row>
      </v-carousel-item>
      <v-carousel-item :src="'/img/home/slider2.jpg'">
        <v-row class="fill-height" align="center" justify="center">
          <div class="display-2 white--text pl-5 pr-5 hidden-sm-only">
            <strong>Upto 60% + Extra 10%</strong>
          </div>
          <br />
        </v-row>
      </v-carousel-item>
      <v-carousel-item :src="'/img/home/slider3.jpg'">
        <v-row class="fill-height" align="center" justify="center">
          <div class="display-2 white--text pl-5 pr-5 hidden-sm-only">
            <strong>Upto 60% + Extra 10%</strong>
          </div>
          <br />
        </v-row>
      </v-carousel-item>
      <v-carousel-item :src="'/img/home/slider1.jpg'">
        <v-row class="fill-height" align="center" justify="center">
          <div class="display-2 white--text pl-5 pr-5 hidden-sm-only">
            <strong>Upto 60% + Extra 10%</strong>
          </div>
          <br />
        </v-row>
      </v-carousel-item>
    </v-carousel>
    <v-container>
      <v-lazy
        v-model="has_seen_lazy"
        transition-group="fade-transition"
        :options="{
          threshold: 0.8,
        }"
      >
        <div class="headline display-4 text-center d-block mb-2" centered>
          Getting Started
        </div>
      </v-lazy>
    </v-container>
    <v-container>
      <v-lazy
        v-model="has_seen_lazy"
        min-height="200"
        transition-group="fade-transition"
        :options="{
          threshold: 0.8,
        }"
      >
        <v-row justify="space-between" xs6 md3>
          <v-col class="col-12 col-md-4 col-sm-12">
            <v-card class="mx-auto" elevation="20">
              <v-icon
                xLarge
                style="margin-left: 45%; margin-top: 10%"
                color="blue"
              >
                mdi-cart
              </v-icon>
              <v-card-text>
                <p class="headline text--primary">Shop Seamlessly</p>
                <div class="text--primary">
                  Easy and fast shopping made possible wit the best suppliers
                  and retailers in the market
                </div>
              </v-card-text>
              <v-card-actions>
                <v-btn text color="deep-purple accent-4" to="/shops">
                  Learn More
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
          <!-- <v-spacer></v-spacer> -->
          <v-col class="col-12 col-md-4 col-sm-12">
            <v-card class="mx-auto" elevation="20">
              <v-icon
                xLarge
                style="margin-left: 45%; margin-top: 10%"
                color="blue"
              >
                mdi-bike
              </v-icon>
              <v-card-text>
                <p class="headline text--primary">Goods at your doorstep</p>
                <div class="text--primary">
                  Your goods get delivered at your doorstep within minutes to
                  hours of your order
                </div>
              </v-card-text>
              <v-card-actions>
                <v-btn text color="deep-purple accent-4" to="/products">
                  Learn More
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col class="col-12 col-md-4 col-sm-12">
            <v-card class="mx-auto" elevation="20">
              <v-icon
                xLarge
                style="margin-left: 45%; margin-top: 10%"
                color="blue"
              >
                mdi-shopping
              </v-icon>
              <v-card-text>
                <p class="headline text--primary">Start up your own shop</p>
                <div class="text--primary">
                  Join over 5000 sellers in Nigeria and start selling your goods
                  on Nigeria's top E-commerce site
                </div>
              </v-card-text>
              <v-card-actions>
                <v-btn text color="deep-purple accent-4" to="/register-as-merchant">
                  Learn More
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-lazy>
    </v-container>
    <v-container>
      <v-lazy
        v-model="has_seen_lazy_two"
        min-height="200"
        transition-group="fade-transition"
        :options="{
          threshold: 0.8,
        }"
      >
        <v-row class="sm-1" no-gutters justify="center">
          <v-col md="4" class="col-12 col-md-4 col-sm-12">
            <v-card class="mx-auto" flat min-width="40%">
              <v-avatar size="avatarSize" color="red" :rounded="true">
                <img
                  :src="'/img/exciting_img-01.jpg'"
                  alt="alt"
                />
              </v-avatar>
              <v-card-text>
                <p class="headline text--primary">
                  Explore exciting and exotic products tailored to you.
                </p>
                <div class="text--primary">
                  Your goods get delivered at your doorstep within minutes to
                  hours of your order
                </div>
              </v-card-text>
              <v-card-actions>
                <v-btn text color="deep-purple accent-4" to="/products">
                  Learn More
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col md="4" class="col-12 col-md-4 col-sm-12">
            <v-card class="mx-auto" flat min-width="40%">
              <v-avatar size="avatarSize" color="red" :rounded="true">
                <img
                  :src="'/img/exciting_img-02.jpg'"
                  alt="alt"
                />
              </v-avatar>
              <v-card-text>
                <p class="headline text--primary">
                  List your products on Jumga and grow connections.
                </p>
                <div class="text--primary">
                  Join over 5000 sellers in Nigeria and start selling your goods
                  on Nigeria's top E-commerce site
                </div>
              </v-card-text>
              <v-card-actions>
                <v-btn text color="deep-purple accent-4" to="/signup">
                  Learn More
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-lazy>
      <v-lazy
        v-model="has_seen_lazy_three"
        min-height="200"
        transition-group="fade-transition"
        :options="{
          threshold: 0.8,
        }"
      >
        <v-card flat style="margin-top: 20px">
          <v-row class="sm-1" no-gutters justify="center">
            <v-col md="4" class="col-12 col-md-4 col-sm-12">
              <v-card class="mx-auto" flat min-width="45%">
                <div class="overline mb-4">SHOP OWNER</div>
                <v-card-text>
                  <p class="headline text--primary">
                    Grow your store With a new sales channel
                  </p>
                  <div class="text--primary">
                    Never worry about sales or income ftom outbound channels.
                    with chamb your store is directly connected to thousands of
                    interested in your products.
                  </div>
                </v-card-text>
                <v-card-actions>
                  <v-btn
                    color="deep-purple accent-4"
                    dark
                    block
                    to="/register-as-merchant"
                  >
                    Create a Retail account
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
            <v-col md="4" class="col-12 col-md-4 col-sm-12">
              <v-card class="mx-auto" flat min-width="45%">
                <v-img
                  :src="'/img/supplier-pc-img.png'"
                  sm6
                  alt="PC"
                />
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-lazy>
    </v-container>
    <v-container>
      <v-row no-gutters>
        <v-col :cols="12">
          <v-card-text class="" tile outlined>
            <v-card-title class="subheading">What we Sell</v-card-title>
            <v-divider></v-divider>
            <div class="row">
              <div class="col-12 col-md-3 col-sm-6 col-xs-6 text-center">
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
                      <v-btn to="/products?category=women" class="ma-2" outlined color="info">
                        Explore
                      </v-btn>
                    </div>
                  </v-card>
                </v-hover>
              </div>
              <div class="col-12 col-md-3 col-sm-6 col-xs-6 text-center">
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
                      <v-btn to="/products?category=men" class="ma-2" outlined color="info">
                        Explore
                      </v-btn>
                    </div>
                  </v-card>
                </v-hover>
              </div>
              <div class="col-12 col-md-3 col-sm-6 col-xs-6 text-center">
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
                      <v-btn to="/products?category=children" class="ma-2" outlined color="info">
                        Explore
                      </v-btn>
                    </div>
                  </v-card>
                </v-hover>
              </div>
              <div class="col-12 col-md-3 col-sm-6 col-xs-6 text-center">
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
                      <v-btn to="/products?category=unisex" class="ma-2" outlined color="info">
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
  </div>
</template>

<script>
import Vuex from "vuex";
export default {
   auth: false,
  // async asyncData({
  //   isDev,
  //   route,
  //   store,
  //   env,
  //   params,
  //   query,
  //   req,
  //   res,
  //   $axios,
  // }) {
  //   let blogs = await $axios.$get("/api/blogs");
  //   return {
  //     blogs,
  //   };
  // },
  data() {
    return {
      has_seen_lazy: false,
      has_seen_lazy_two: false,
      has_seen_lazy_three: false,
    };
  },
  head() {
    return {
      meta: [{}],
      title: "Home Page",
    };
  },
  computed: {
    ...Vuex.mapState(["auth"]),
  },
};
</script>
