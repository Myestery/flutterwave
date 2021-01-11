<template>
  <v-app>
    <v-card class="mx-auto" max-width="700" outlined style="margin-top:70px; width:500px">
      <v-list-item three-line>
        <v-list-item-content>
          <div class="overline mb-4">LOGIN</div>
          <v-form v-model="valid">
            <v-container>
              <v-text-field v-model="email" :rules="emailRules" label="E-mail" required clearable></v-text-field>
              <v-text-field
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="passwordRules"
                :type="showPassword ? 'text' : 'password'"
                name="input-10-2"
                label="Password"
                hint="At least 8 characters"
                v-model="password"
                class="input-group--focused"
                @click:append="showPassword = !showPassword"
              ></v-text-field>
            </v-container>
          </v-form>
        </v-list-item-content>
      </v-list-item>

      <v-card-actions>
        <v-btn
          style="margin-left:30px"
          depressed
          color="primary"
          :disabled="!valid"
          @click="login"
        >LOGIN</v-btn>
      </v-card-actions>
      <small>
        Not Registered, Click here to
        <nuxt-link to="register">Sign UP</nuxt-link>
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
    showPassword: false,
    email: "",
    password: "",
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+/.test(v) || "E-mail must be valid",
    ],
  }),
  methods: {
    login() {
      this.$auth
        .loginWith("local", {
          data: {
            email: this.email,
            password: this.password,
          },
        })
        .then(() => console.info("Logged In!"));
    },
  },
};
</script>

<style>
</style>