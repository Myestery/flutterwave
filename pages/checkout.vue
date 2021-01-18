<template>
  <div style="margin-top: 5%">
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
                      <v-list-item-title>{{ product.name }}</v-list-item-title>
                      <v-list-item-subtitle>{{
                        product.description
                      }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </td>
                <td>${{ product.price }}</td>
                <td>{{product.qty}}
                </td>
                <td>{{ product.price * product.qty }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
      <v-col>
    <PaymentTemplate
    :amount_to_pay="total + shipping_cost"
    currency="$"
    :status ="status" 
    :url="url"
    :card_error="card_error"
    :card_has_error="card_has_error"
    :otp_message="otp_message"
    />
      </v-col>
    </v-row>
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
  data() {
    return {
      url:"",
      card_error:"",
      card_has_error:false,
      otp_message:"",
      status:null
    }
  },
};
</script>