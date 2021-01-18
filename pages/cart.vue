<template>
  <div>
    <v-container style="margin-top: 5%">
      <p class="display-3 font-weight-light text-center pa-4">SHOPPING CART</p>
      <v-row>
        <v-col :cols="12" md="9" sm="12">
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-center">ITEM</th>
                  <th class="text-center">PRICE</th>
                  <th class="text-center">QUANTITY</th>
                  <th class="text-center">TOTAL</th>
                  <th class="text-center"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(product, index) in cart.goods" :key="index">
                  <td>
                    <v-list-item :key="index">
                      <v-list-item-avatar>
                        <v-img :src="`/img/home/${product.image}`"></v-img>
                      </v-list-item-avatar>

                      <v-list-item-content>
                        <v-list-item-title>{{
                          product.name
                        }}</v-list-item-title>
                        <v-list-item-subtitle>{{
                          product.description
                        }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </td>
                  <td>${{ product.price }}</td>
                  <td>
                    <v-text-field
                      class="pt-10"
                      label="Outlined"
                      style="width: 80px"
                      single-line
                      outlined
                      type="number"
                      min="1"
                      v-model="product.qty"
                    ></v-text-field>
                  </td>
                  <td>{{ product.price * product.qty }}</td>
                  <td>
                    <v-btn icon @click="Remove(product)">
                      <v-icon> mdi-close </v-icon>
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-col>
        <v-col :cols="12" md="3" sm="12" style="background-color: lightgray">
          <p class="headline">Order Summary</p>
          <p class="overline">
            Shipping and additional costs are calculated based on values you
            have entered.
          </p>
          <v-simple-table>
            <template v-slot:default>
              <tbody>
                <tr>
                  <td>Order Subtotal</td>
                  <td class="text-right" style="width: 50px">${{ total }}</td>
                </tr>
                <tr>
                  <td>Shipping Charges</td>
                  <td class="text-right" style="width: 50px">
                    ${{ shipping_cost }}
                  </td>
                </tr>
                <tr>
                  <td>Total</td>
                  <td class="text-right" style="width: 50px">
                    <b>${{ total + shipping_cost }}</b>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
          <div class="text-center">
            <v-btn to="/checkout" class="primary white--text mt-5" outlined
              >PROCEED TO PAY</v-btn
            >
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  auth: false,
  computed: {
    ...mapState(["cart"]),
    total() {
      return this.cart.goods.length
        ? this.cart.goods.map(x => x.price * x.qty).reduce((x, y) => x + y)
        : 0;
    },
    shipping_cost() {
      return this.cart.goods.length
        ? this.cart.goods.map(x => x.shipping_cost).reduce((x, y) => x + y)
        : 0;
    }
  },
  mounted() {
    this.cart.goods = this.cart.goods.map(good => ({
      ...good,
      qty: 1,
      total: good.price
    }));
  },
  methods: {
    Remove(prod) {
      this.$store.dispatch("cart/ADD_OR_REMOVE", prod);
    }
  }
};
</script>
