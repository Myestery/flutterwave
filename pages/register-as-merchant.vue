<template>
  <v-app style="margin-top: 5%">
    <v-stepper v-model="e1" vertical>
      <v-stepper-header>
        <v-stepper-step :complete="e1 > 1" step="1">
          Fill your Details
        </v-stepper-step>

        <v-stepper-step :complete="e1 > 2" step="2">
          Pay Charges
        </v-stepper-step>
      </v-stepper-header>
      <v-stepper-items>
        <v-stepper-content step="1">
          <v-card class="mx-auto">
            <v-list-item three-line>
              <v-list-item-content>
                <div class="overline mb-4">REGISTER</div>
                <v-form v-model="valid">
                  <v-container>
                    <v-row xs6 md2 justify="space-between">
                      <v-col class="col-12 col-md-5 col-sm-12">
                        <v-text-field
                          v-model="surname"
                          :rules="nameRules"
                          label="Surname"
                          placeholder="Surname"
                          required
                          clearable
                        ></v-text-field>
                      </v-col>
                      <v-col class="col-12 col-md-5 col-sm-12">
                        <v-text-field
                          v-model="firstname"
                          :rules="nameRules"
                          placeholder="Firstname"
                          label="Firstname"
                          required
                          clearable
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row xs6 md2 justify="space-between">
                      <v-col class="col-12 col-md-5 col-sm-12">
                        <v-text-field
                          v-model="email"
                          :rules="emailRules"
                          label="E-mail"
                          required
                          clearable
                        ></v-text-field>
                      </v-col>
                      <v-col class="col-12 col-md-5 col-sm-12">
                        <v-text-field
                          v-model="phone_number"
                          :rules="nameRules"
                          label="Phone Number"
                          type="tel"
                          placeholder="08012345678"
                          required
                          clearable
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row xs6 md2 justify="space-between">
                      <v-col class="col-12 col-md-5 col-sm-12">
                        <v-text-field
                          v-model="shop_name"
                          :rules="nameRules"
                          label="Desired Shop name"
                          required
                          clearable
                        ></v-text-field>
                      </v-col>
                      <v-col class="col-12 col-md-5 col-sm-12">
                        <v-select
                          :items="countries"
                          item-text="name"
                          item-value="val"
                          label="Select Country"
                          @change="fetchBanks"
                          v-model="country"
                          required
                        ></v-select>
                      </v-col>
                    </v-row>
                    <v-row xs6 md2 justify="space-between">
                      <v-col class="col-12 col-md-5 col-sm-12">
                        <v-text-field
                          :append-icon="
                            showPassword ? 'mdi-eye' : 'mdi-eye-off'
                          "
                          :rules="passwordRules"
                          id="password"
                          autocomplete="new-password"
                          :type="showPassword ? 'text' : 'password'"
                          name="input-10-2"
                          label="Password"
                          hint="At least 8 characters"
                          v-model="password"
                          class="input-group--focused"
                          @click:append="showPassword = !showPassword"
                        ></v-text-field>
                      </v-col>
                      <v-col class="col-12 col-md-5 col-sm-12">
                        <v-text-field
                          :append-icon="
                            showPassword ? 'mdi-eye' : 'mdi-eye-off'
                          "
                          :rules="confirmPasswordRules"
                          :type="showPassword ? 'text' : 'password'"
                          name="input-10-2"
                          label="Confirm Password"
                          hint="Must be equal to password"
                          autocomplete="confirm-password"
                          v-model="confirmPassword"
                          class="input-group--focused"
                          @click:append="showPassword = !showPassword"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row xs6 md2 justify="space-between">
                      <v-col class="col-12 col-md-5 col-sm-12">
                        <v-select
                          :items="banks"
                          label="Select Bank"
                          item-text="name"
                          v-model="bank"
                          item-value="code"
                          required
                        ></v-select>
                      </v-col>
                      <v-col class="col-12 col-md-5 col-sm-12">
                        <v-text-field
                          name="account_number"
                          label="Your account number"
                          v-model="account_number"
                          :rules="nameRules"
                          type="number"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-form>
              </v-list-item-content>
            </v-list-item>
            <v-alert
              dense
              border="left"
              type="warning"
              dismissible
              v-if="show_error"
            >
              {{ error_text }}
            </v-alert>
            <v-card-actions>
              <v-btn
                style="margin-left: 30px"
                depressed
                color="success"
                :disabled="!valid"
                @click="Step"
                >PROCEED</v-btn
              >
            </v-card-actions>
            <v-overlay :absolute="true" :value="loading"> </v-overlay>
            <small>
              Already Registered, Click here to
              <nuxt-link to="/login">Log IN</nuxt-link>
              <nuxt-link to="/register">Register</nuxt-link>
            </small>
          </v-card>
        </v-stepper-content>
        <v-stepper-content step="2">
          <v-card>
            To enable us serve you better and sign up your shop on jumga, You
            are to pay a one time fee of $20 to proceed with shop creation.
            <div class="caption">
              Note: Your shop will be assigned a free dispatch rider after this
              process
            </div>
            <flutterwave-pay-button
              style="margin-top: 10%"
              :tx_ref="generateReference()"
              :amount="20"
              currency="USD"
              payment_options="card, mobilemoneyghana, mpesa, ussd"
              :customer="{
                name: `${firstname} ${surname}`,
                email,
                phone_number,
              }"
              :customizations="{
                title: 'Pay Shop Opening Fee',
                description:
                  'This one - time fee is required to validate your shop',
                logo: image_link,
              }"
              :callback="register"
              :onclose="closedPaymentModal"
            >
              <v-btn color="primary" block>Click To Pay</v-btn>
            </flutterwave-pay-button>
          </v-card>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </v-app>
</template>
<script>
export default {
  auth: "guest",
  head() {
    return {
      title: "Register on jumga now",
    };
  },
  computed: {},
  data: () => ({
    image_link: "",
    valid: false,
    e1: 1,
    passwordRules: [(v) => !!v || "Password is required"],
    confirmPasswordRules: [
      (v) => !!v || "Password is required",
      (v) =>
        v ==
          (document.getElementById("password")
            ? document.getElementById("password").value
            : undefined) || "Passwords do not match",
    ],
    nameRules: [(v) => !!v || "This Field is required"],
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+/.test(v) || "E-mail must be valid",
    ],
    showPassword: false,
    email: "mail@meee.com",
    password: "password",
    firstname: "firstname",
    surname: "surname",
    country: "",
    currency: "NGN",
    confirmPassword: "password",
    account_number: "1023937732",
    banks: [],
    bank: "",
    pay_status: null,
    countries: [
      { name: "Nigeria", val: "NG", currency: "NGN" },
      { name: "Ghana", val: "GH", currency: "GHS" },
      { name: "Kenya", val: "KE", currency: "KES" },
      { name: "UK", val: "UK", currency: "GBP" },
    ],
    phone_number: "",
    shop_name: "my cool shop",
    show_error: false,
    error_text: "",
    loading: false,
  }),
  methods: {
    register(data) {
      this.$axios
        .$post("/api/users/register-as-merchant", {
          data,
          surname: this.surname,
          firstname: this.firstname,
          email: this.email,
          password: this.password,
          country: this.country,
          bank: this.bank,
          phone_number: this.phone_number,
          account_number: this.account_number,
          shop_name: this.shop_name,
          shop_description: "A new shop",
        })
        .then((res) => {
          this.$auth.loginWith("local", {
            data: {
              email: this.email,
              password: this.password,
            },
          });
          setTimeout(() => {
            window.location.href = ("/shop?new=true"), 3000;
          });
          console.log(res);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    async fetchBanks(country) {
      this.currency = this.countries.filter(
        (x) => x.val == country
      )[0].currency;
      let banks = await this.$axios.get("/api/users/getBanks", {
        params: {
          country: this.country,
        },
      });
      this.banks = banks.data.banks;
    },
    closedPaymentModal() {
      console.log("payment modal is closed");
    },
    generateReference() {
      let date = new Date();
      return date.getTime().toString();
    },
    async Step() {
      this.loading = true;
      try {
        let response = await this.$axios.$post("/api/users/check-email", {
          email: this.email,
          account_bank:this.bank,
          account_number:this.account_number
        });
        this.loading = false;
        if (response.status == true) {
          this.e1 = 2;
        } 
      } catch (error) {
        console.log(error)
        this.loading = false;
        this.show_error = true;
        this.error_text = error.response.data.error
      }
    },
  },
  mounted() {
    this.image_link = `${window.location.origin}/img/logo1.svg`;
    // Enable pusher logging - don't include this in production
    // let Pusher = window.Pusher;
    // Pusher.logToConsole = true;

    // var pusher = new Pusher("b7ad8790c400535f2743", {
    //   cluster: "eu",
    // });
    // var channel = pusher.subscribe("3d-secure");
    // channel
    //   .bind("success", (data) => {
    //     this.pay_status = "Charge Complete";
    //     this.verifyTransaction({ otp: true }, "3d-secure");
    //   })
    //   .bind("error", (data) => {
    //     this.pay_status = null;
    //     this.card_has_error = true;
    //     this.card_error = data.message;
    //   });
  },
};
</script>