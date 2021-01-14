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
          <v-card
            class="mx-auto"
            max-width="700"
            outlined
            style="margin-top: 70px; width: 500px"
          >
            <v-list-item three-line>
              <v-list-item-content>
                <div class="overline mb-4">REGISTER</div>
                <v-form v-model="valid">
                  <v-container>
                    <v-text-field
                      v-model="surname"
                      :rules="nameRules"
                      label="Surname"
                      placeholder="Surname"
                      required
                      clearable
                    ></v-text-field>
                    <v-text-field
                      v-model="firstname"
                      :rules="nameRules"
                      placeholder="Firstname"
                      label="Firstname"
                      required
                      clearable
                    ></v-text-field>
                    <v-text-field
                      v-model="email"
                      :rules="emailRules"
                      label="E-mail"
                      required
                      clearable
                    ></v-text-field>
                    <v-text-field
                      v-model="shop_name"
                      :rules="nameRules"
                      label="Desired Shop name"
                      required
                      clearable
                    ></v-text-field>
                    <v-text-field
                      :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
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
                    <v-text-field
                      :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
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
                    <v-select
                      :items="countries"
                      label="Select Country"
                      @change="fetchBanks"
                      v-model="country"
                    ></v-select>
                    <v-select
                      :items="banks"
                      label="Select Bank"
                      item-text="name"
                      v-model="bank"
                      item-value="code"
                      :rules="nameRules"
                    ></v-select>
                    <v-text-field
                      name="account_number"
                      label="Your account number"
                      v-model="account_number"
                      :rules="nameRules"
                      type="number"
                    ></v-text-field>
                  </v-container>
                </v-form>
              </v-list-item-content>
            </v-list-item>

            <v-card-actions>
              <v-btn
                style="margin-left: 30px"
                depressed
                color="success"
                :disabled="!valid"
                @click="e1 = 2"
                >PROCEED</v-btn
              >
            </v-card-actions>
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
            <payment-template
              amount_to_pay="20"
              currency="$"
              @pass="promptPayment"
              @finish="verifyTransaction"
              :status="pay_status"
              :card_error="card_error"
              :card_has_error="card_has_error"
              :url="otp_url"
              :otp_message="otp_message"
            />
          </v-card>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </v-app>
</template>
<script>
export default {
  auth: "guest",
  data: () => ({
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
    email: "",
    password: "",
    firstname: "",
    surname: "",
    country: "",
    confirmPassword: "",
    account_number: "",
    banks: [],
    bank: "",
    pay_status: null,
    countries: ["Nigeria", "Ghana", "Kenya", "UK"],
    card_has_error: false,
    card_error: "",
    otp_url: "",
    otp_message: "",
    transaction_reference: "",
    shop_name: "",
  }),
  methods: {
    register(data) {
      this.$axios
        .$post("/api/users/register-as-merchant", {
          surname: this.surname,
          firstname: this.firstname,
          email: this.email,
          password: this.password,
          country: this.country.toLowerCase(),
          bank: this.bank,
          account_number: this.account_number,
          shop_name: this.shop_name,
          shop_description: "A new shop",
        })
        .then((res) => {
          this.pay_status = res.status;
          console.log(res);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    promptPayment(data) {
      let object = {
        email: this.email,
        country: this.country,
        firstname: this.firstname,
        lastname: this.surname,
        ...data,
      };
      this.pay_status = "paying";
      //   return
      this.$axios
        .$post(`/api/users/promptPayment?type=${data.type}`, object)
        .then((res) => {
          console.log(res);
          this.pay_status = res.status;
          this.otp_message = res.message;
          this.transaction_reference = res.hasOwnProperty(
            "transaction_reference"
          )
            ? res.transaction_reference
            : "";
        })
        .catch((e) => {
          this.pay_status = null;
        });
    },
    verifyTransaction(data) {
      this.$axios
        .$post("/api/users/verify-transaction", {
          transaction_reference: this.transaction_reference,
          otp: data.otp,
          type: "card",
        })
        .then((res) => {
          //   this.pay_status = res.status;
          console.log(res);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    async fetchBanks(country) {
      let banks = await this.$axios.get("/api/users/getBanks", {
        params: {
          country: this.country,
        },
      });
      this.banks = banks.data.banks;
    },
  },
  mounted() {},
};
</script>