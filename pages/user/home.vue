<template>
  <div>
    <v-container style="margin-top: 5%">
      <div class="row">
        <div class="col-md-3 col-sm-3 col-xs-12">
          <v-spacer></v-spacer>
        </div>
        <div class="col-md-9 col-sm-9 col-xs-12">
          <v-row dense>
            <v-col cols="12" sm="8" class="pl-6 pt-6">
              <p>My Orders</p>
            </v-col>
          </v-row>

          <v-divider></v-divider>

          <div class="row text-center">
            <div
              class="col-md-3 col-sm-6 col-xs-12"
              :key="pro._id"
              v-for="pro in purchases"
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
                      ></div>
                    </v-expand-transition>
                  </v-img>
                  <v-card-text class="text--primary">
                    <div>
                      <router-link
                        :to="`/product/${pro.id}`"
                        style="text-decoration: none"
                        >{{ pro.name }}</router-link
                      >
                    </div>
                    <div>${{ pro.price }}</div>
                    <!-- <div>{{}}  ${{ pro.price }}</div>fcard-a -->
                  </v-card-text>
                </v-card>
              </v-hover>
            </div>
          </div>
        </div>
      </div>
    </v-container>
  </div>
</template>
<script>
export default {
  async asyncData({ $axios }) {
    let purchases = await $axios.get("/api/user/purchased-goods");
    // console.log(purchases)
    return {
      purchases:[...purchases.data].map(x=>({...x.Good,qty:x.amount})),
      // purchases
    };
  },
};
</script>