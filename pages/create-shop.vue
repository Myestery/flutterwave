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

        <v-stepper-content step="2">
          <v-card>
            To enable us serve you better and sign up your shop on jumga, You
            are to pay a one time fee of $20 to proceed with shop creation.
            <div class="caption">
              Note: Your shop will be assigned a free dispatch rider after this
              process
            </div>
            <v-card color="basil">
              <v-card-title class="text-center justify-center py-6">
                <h1 class="font-weight-bold display-2 basil--text">
                  Payment Options
                </h1>
              </v-card-title>

              <v-tabs v-model="tab" grow>
                <v-tab
                  v-for="card in ['card', 'mpesa', 'ke', 'uk']"
                  :key="card"
                >
                  {{ card }}
                </v-tab>
              </v-tabs>

              <v-tabs-items v-model="tab">
                <v-tab-item
                  v-for="card in ['card', 'mpesa', 'ke', 'uk']"
                  :key="card"
                >
                  <v-card color="basil" flat>
                    <v-form v-model="s_valid">
                      <v-card>
                        <v-card-title> Pay with Card </v-card-title>
                        <v-row justify="center" xs6 md3>
                          <v-col class="col-12 col-md-4 col-sm-12">
                            <v-text-field
                              solo
                              label="Card number"
                              :rules="cardRules"
                              v-model="paymentData.card"
                              type="number"
                            >
                            </v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="3">
                            <v-text-field
                              name="cvv"
                              label="CVV"
                              length="3"
                              max="999"
                              solo
                              v-model="account_number"
                              type="number"
                              :rules="cvvRules"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                        <v-row justify="center" xs6 md3>
                          <v-col cols="12" sm="6" md="3">
                            <v-select
                              name="account_number"
                              solo
                              :items="months"
                              item-text="month"
                              item-value="val"
                              label="Expiration Month"
                              v-model="paymentData.month"
                              type="number"
                              :rules="nameRules"
                            ></v-select>
                          </v-col>
                          <v-col cols="12" sm="6" md="3">
                            <v-select
                              name="account_number"
                              solo
                              :items="years"
                              item-text="year"
                              item-value="val"
                              label="Expiration Year"
                              v-model="paymentData.year"
                              type="number"
                              :rules="nameRules"
                            ></v-select>
                          </v-col>
                        </v-row>
                        <v-card-actions>
                          <v-btn color="info">Pay Now</v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-form>
                  </v-card>
                </v-tab-item>
              </v-tabs-items>
            </v-card>
          </v-card>
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
      s_valid: false,
      nameRules: [(v) => !!v || "This Field is required"],
      cardRules: [
        (v) =>
          v.toString().length >= 16 || "The 16 digit pin in front of your card",
      ],
      cvvRules: [
        (v) => v.toString().length == 3 || "The 3 digit pin behind your card",
      ],
      tab: "",
      valid: false,
      user: this.$auth.user,
      paymentData: {
        month: "",
        year: "",
        card: "",
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
      months: new Array(12).fill(0).map((x, index) => ({
        month: index < 9 ? `0${index + 1}` : index + 1,
        val: index + 1,
      })),
      years: new Array(11).fill(0).map((x, index) => ({
        year: 2020 + index,
        val: 20 + index,
      })),
    };
  },
  async mounted() {
    const alphabet = [
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z",
    ];
    let banks = await this.$axios.get("/api/users/getBanks");
    this.banks = banks.data.banks.sort(
      (a, b) =>
        alphabet.indexOf(b.name.charAt(0)) - alphabet.indexOf(a.name.charAt(0))
    );
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