<template>
  <v-app style="margin-top: 10%">
    <v-stepper v-model="e1" vertical>
      <v-stepper-header>
        <v-stepper-step :complete="e1 > 1" step="1">
          Select a name
        </v-stepper-step>

        <v-stepper-step :complete="e1 > 2" step="2">
          Pay Charges
        </v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content step="1">
          <v-card class="mb-12" color="lighten-1">
            <v-form v-model="valid">
              <div class="headline">Shop Details</div>
              <v-row justify="space-between" xs6 md3>
                <v-col class="col-12 col-md-4 col-sm-12">
                  <v-text-field label="Shop Name" :rules="nameRules">
                  </v-text-field>
                </v-col>
                <v-col class="col-12 col-md-4 col-sm-12">
                  <v-text-field label="Description" :rules="nameRules">
                  </v-text-field>
                </v-col>
              </v-row>
              <div class="headline">Account Details</div>
              <v-row justify="space-between" xs6 md3>
                <v-col class="col-12 col-md-4 col-sm-12">
                  <v-select
                    :items="banks"
                    label="Select Bank"
                    item-text="name"
                    v-model="bank"
                    item-value="code"
                  ></v-select>
                </v-col>
                <v-col class="col-12 col-md-4 col-sm-12">
                  <v-text-field
                    name="account_number"
                    label="Your account number"
                    v-model="account_number"
                    type="number"
                    :rules="nameRules"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-card>

          <v-btn color="primary" :disabled="!valid" @click="CheckDetails">
            Continue
          </v-btn>

          <v-btn text> Cancel </v-btn>
        </v-stepper-content>

        
      </v-stepper-items>
    </v-stepper>
  </v-app>
</template>
<script>
export default {
  data() {
    return {
      e1: 2,
      bank: "",
      banks: [],
      account_number: "",
      nameRules: [(v) => !!v || "This Field is required"],
      valid: false,
      user: this.$auth.user,
      paymentData: {
        tx_ref: this.generateReference(),
        amount: 10,
        currency: "NGN",
        payment_options: "card,ussd",
        redirect_url: "",
        meta: {
          counsumer_id: "7898",
          consumer_mac: "kjs9s8ss7dd",
        },
        customer: {
          name: "Demo Customer  Name",
          email: "customer@mail.com",
          phone_number: "081845***044",
        },
        customizations: {
          title: "Customization Title",
          description: "Customization Description",
          logo: "https://flutterwave.com/images/logo-colored.svg",
        },
        onclose: this.closedPaymentModal,
      },
    };
  },
  async mounted() {
    let banks = await this.$axios.get(`/api/users/getBanks`,{
      params: {
        country: this.country
      }}).data.banks
  },
  methods: {
    CheckDetails() {
      this.$axios
        .post("/api/users/verify-bank-details", {
          account_number: this.account_number,
          account_bank: this.bank,
        })
        .then((res) => {
          this.e1 = 2;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    asyncPay() {
      this.$asyncPayWithFlutterwave(this.paymentData).then((response) => {
        // console.log(response);
      });
    },

    closedPaymentModal() {
      console.log("payment is closed");
    },
    generateReference() {
      let date = new Date();
      return date.getTime().toString();
    },
  },
};
</script>