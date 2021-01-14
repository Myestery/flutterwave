<template>
  <v-app>
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
                <v-select :items="countries" label="Select Country" 
                @change="fetchBanks"
                v-model="country"></v-select>
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
          @click="register"
          >REGISTER</v-btn
        >
      </v-card-actions>
      <small>
        Already Registered, Click here to
        <nuxt-link to="/login">Log IN</nuxt-link>
        <nuxt-link to="/register-as-merchant">Register as merchant</nuxt-link>
      </small>
    </v-card>
  </v-app>
</template>
<script>
export default {
  auth: "guest",
  data: () => ({
    valid: false,
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
    showPassword: false,
    email: "",
    password: "",
    firstname: "",
    surname: "",
    country:"",
    confirmPassword: "",
    account_number:"",
    banks:[],
    bank:"",
    countries:[
      "Nigeria",
      "Ghana",
      "Kenya",
      "UK"
    ],
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+/.test(v) || "E-mail must be valid",
    ],
  }),
  methods: {
    register() {
      this.$axios
        .$post("/api/users/register", {
          surname: this.surname,
          firstname: this.firstname,
          email: this.email,
          password: this.password,
          country:this.country.toLowerCase()
        })
        .then((res) => {
          this.$auth.loginWith("local", {
            data: {
              email: this.email,
              password: this.password,
            },
          });
        })
        .catch((e) => {
          console.log(e);
        });
    },
    async fetchBanks(country){
      let banks = await this.$axios.get("/api/users/getBanks",{
      params: {
        country: this.country
      }})
      this.banks = banks.data.banks
    }
  },
  mounted() {},
};
</script>