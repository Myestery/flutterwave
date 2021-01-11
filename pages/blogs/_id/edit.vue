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
          <div class="overline mb-4">EDIT BLOG</div>
          <v-form v-model="valid">
            <v-container>
              <v-text-field
                v-model="blog.title"
                :rules="nameRules"
                label="Blog Title"
                required
                clearable
              ></v-text-field>
              <v-text-field
                v-model="blog.body"
                :rules="nameRules"
                label="Write your blog here"
                required
                clearable
              ></v-text-field>
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
    <v-alert dense text type="success" v-show="alert" dismissible>
      Post updated Succesfully
    </v-alert>
  </v-app>
</template>

<script>
import Logo from "~/components/Logo.vue";
import VuetifyLogo from "~/components/VuetifyLogo.vue";

export default {
  middleware: "auth",
  async asyncData({ $axios, route }) {
    let blog = await $axios.$get(`/api/blogs/${route.params.id}`);
    return {
      blog,
    };
  },
  data: () => ({
    valid: false,
    alert: false,
    nameRules: [(v) => !!v || "This Field is required"],
  }),
  methods: {
    async post() {
      let res = await this.$axios.$put(`/api/blogs/${this.$route.params.id}`, {
        title: this.blog.title,
        body: this.blog.body,
      });
      this.alert = true;
      setTimeout(this.$router.push(`/blogs/${this.$route.params.id}`),3000)
      console.log(res);
    },
  },
};
</script>
