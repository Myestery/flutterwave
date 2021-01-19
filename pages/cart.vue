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
                      @input="updateQuantity($event,product)"
                      :value="product.qty"
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
                    ${{ shipping_total }}
                  </td>
                </tr>
                <tr>
                  <td>Total</td>
                  <td class="text-right" style="width: 50px">
                    <b>${{ amount_to_pay }}</b>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
          <div class="text-center">
            <v-dialog v-model="show_success" max-width="600px">
              <v-card>
                <v-card-title>
                  <span class="headline">Congratulations</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    Your Order has been placed, go to home page to see all
                    orders
                  </v-container>
                </v-card-text>
              </v-card>
            </v-dialog>
              <v-btn
                class="primary white--text mt- 5"
                outlined
                v-if="cart.goods.length"
                @click="makePayment"
                >PROCEED TO PAY</v-btn
              >
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import { mapState,mapGetters } from "vuex";
export default {
  computed: {
    ...mapState(["cart"]),
     ...mapState('cart', ['total', 'amount_to_pay','shipping_total']),
    shipping_cost() {
      return this.cart.goods.length
        ? this.cart.goods.map((x) => x.shipping_cost).reduce((x, y) => x + y)
        : 0;
    },
    subaccounts() {
      let invoices = this.cart.goods.map((x) => ({
        price: x.price,
        shipping_cost: x.shipping_cost,
        subaccount_id: x.Shop.subaccount_id,
        rider_account: x.Shop.rider._id.account.subaccount_id,
      }));
      let subaccounts = {};
      let answer = [];
      invoices.forEach((invoice) => {
        subaccounts[invoice.subaccount_id] = subaccounts.hasOwnProperty(
          invoice.subaccount_id
        )
          ? subaccounts[invoice.subaccount_id] + invoice.price
          : invoice.price;
        subaccounts[invoice.rider_account] = subaccounts.hasOwnProperty(
          invoice.rider_account
        )
          ? subaccounts[invoice.rider_account] + invoice.price
          : invoice.shipping_cost;
      });

      for (const key in subaccounts) {
        answer.push({
          id: key,
          transaction_split_ratio:
            (subaccounts[key] / (this.$store.state.cart.total + this.$store.state.cart.shipping_total)) * 10,
        });
      }
      return answer;
    },
    // amount_to_pay() {
    //   return this.store.cart.amount_to_pay
    // },
    goods_manifest(){
     return JSON.stringify(this.$store.state.cart.goods.map(x=>({...x,qty:x.qty})))
    },
    goods_qty(){
     return JSON.stringify(this.$store.state.cart.goods.map(x=>x.qty))
    }
  },
  mounted() {
    this.image_link = `${window.location.origin}/img/logo1.svg`;
    this.goods_ids = this.cart.goods.length
      ? this.cart.goods.map((good) => good._id).reduce((x, y) => `${x},${y}`)
      : "";
  },
  data() {
    return {
      image_link: "",
      goods_ids: "",
      show_success: false,
      show_error: false,
    };
  },
  methods: {
    Remove(prod) {
      this.$store.dispatch("cart/ADD_OR_REMOVE", prod);
    },
    async Pay(receipt) {
      try {
        let response = await this.$axios.$post("/api/goods/buy", {
          goods: this.cart.goods,
          receipt,
        });
        this.$router.push('/user/home')
      } catch (error) {
        console.log(error);
        return;
      }
      console.log(response)
      this.$store.dispatch("cart/EMPTY");
      this.show_success = true;
      setTimeout(()=>{
        this.$router.push('/user/home')
      })
    },
    closedPaymentModal() {
      console.log("payment is closed");
    },
    generateReference() {
      let date = new Date();
      return date.getTime().toString();
    },
    makePayment() {
      window.FlutterwaveCheckout({
        public_key: "FLWPUBK_TEST-101e016c28e3690da06760dc8055e412-X",
        tx_ref: this.generateReference(),
        amount: this.amount_to_pay,
        currency: "USD",
        payment_options: "card,ussd,qr,barter",
        customer: {
          name: `${this.$store.state.auth.user.name.firstname} ${this.$store.state.auth.user.name.surname}`,
          email: this.$store.state.auth.user.email,
          phone_number: this.$store.state.auth.user.phone_number,
        },
        meta:{metaname:"manifest",metavalue:this.goods_manifest},
        customizations: {
          title: "Checkout goods for order",
          description: "Pay for the goods you requested for",
          logo: this.image_link,
        },
        subaccounts: this.subaccounts,
        callback: this.Pay,
      });
    },
    updateQuantity(e,product){
      console.log(e)
      this.$store.commit('cart/updateQuantity', {value:e,product})
    }
  },
};
</script>
