<template>
  <!-- <test/> -->
  <div>
    <v-card
      class="mx-auto"
      max-width="700"
      outlined
      style="margin-top: 70px; width: 500px"
    >
      <v-alert dense text type="success" v-show="alert" dismissible>
        Account Details Updated
      </v-alert>
            <v-alert dense text type="error" v-show="error" dismissible>
       {{error_message}}
      </v-alert>
      <v-list-item three-line>
        <v-list-item-content>
          <div class="overline mb-4">EDIT ACCOUNT</div>
          <v-form v-model="valid">
            <v-container>
              <v-text-field
                v-model="firstname"
                :rules="nameRules"
                label="Firstname"
                required
                clearable
              ></v-text-field>
              <v-text-field
                v-model="surname"
                :rules="nameRules"
                label="Surname"
                required
                clearable
              ></v-text-field>
              <v-file-input
                label="Upload a profile picture"
                show-size
                truncate-length="15"
                id="file"
              ></v-file-input>
            </v-container>
          </v-form>
        </v-list-item-content>
      </v-list-item>

      <v-card-actions>
        <v-btn
          style="margin-left: 30px"
          depressed
          color="primary"
          :disabled="!valid"
          @click="post"
          >SAVE</v-btn
        >
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import Vuex from "vuex";
export default {
  // async asyncData({ $axios }) {
  //   let user = await $axios.$get("/api/users/user");
  //   return {
  //     user:user.user,
  //   };
  // },
  head() {
    return {
      title: "Account Page",
    };
  },
  data: () => ({
    user: {},
    valid: false,
    alert: false,
    firstname: "",
    surname: "",
    error:false,
    error_message:"",
    nameRules: [(v) => !!v || "This Field is required"],
  }),
  methods: {
    async post() {
      var formData = new FormData();
      var imagefile = document.querySelector("#file");
      formData.append("avatar", imagefile.files[0]);
      formData.append("surname", this.surname);
      formData.append("firstname", this.firstname);
      try {
        let user = await this.$axios.$put("/api/users/edit", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      this.alert = true;
      this.$auth.setUser(user.user);
      } catch (error) {
        this.error = true
        this.error_message = error.response.data.errors.firstname.msg
      }
      
    },
  },
  mounted() {
    this.firstname = this.auth.user.name.firstname;
    this.surname = this.auth.user.name.surname;
  },
  computed: {
    ...Vuex.mapState(["auth"]),
  },
};
</script>

<style>
</style>