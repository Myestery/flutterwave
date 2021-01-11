<template>
  <div>
    <v-card
      class="mx-auto"
      max-width="700"
      outlined
      v-for="(blog, index) in blogs"
      :key="blog._id"
    >
      <v-list-item three-line :to="`/blogs/${blog._id}`">
        <v-list-item-avatar
          ><img
            :src="`/img/thumbs/${blog.User.image}`"
            alt="profile pic"
            srcset=""
        /></v-list-item-avatar>
        <v-list-item-content>
          <div class="overline">{{ blog.User.name.firstname }}</div>
          <v-list-item-title class="headline mb-1">
            <v-card-title>{{ blog.title }}</v-card-title>
          </v-list-item-title>
          <v-card>
            <v-card-text>
              {{ blog.body }}
            </v-card-text>
          </v-card>
          <v-img class="white--text align-end" src="/img/jp.jpg"> </v-img>
        </v-list-item-content>
      </v-list-item>

      <v-card-actions>
        <v-btn icon :color="isLiked(index)" @click="Like(blog._id, index)">
          <v-icon>mdi-heart</v-icon> </v-btn
        >{{ blog.likes.length }}
        <v-btn icon @click="commentListener(index, blog._id)">
          <v-icon>mdi-comment-plus</v-icon> </v-btn
        >{{ blog.comments.length }}
        <v-btn
          icon
          :color="'blue'"
          v-show="blog.User._id == auth.user._id"
          :to="`/blogs/${blog._id}/edit`"
        >
          <v-icon>edit</v-icon>
        </v-btn>
        <v-btn
          icon
          :color="'red'"
          v-show="blog.User._id == auth.user._id"
          @click="Delete(blog._id)"
        >
          <v-icon>delete</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
    <CommentBox
      @comment="commentHandler"
      :active="commenting"
      @close="commenting = false"
    />
  </div>
</template>

<script>
import Vuex from "vuex";
export default {
  async asyncData({ $axios }) {
    let blogs = await $axios.$get("/api/blogs");
    return {
      blogs,
    };
  },
  data() {
    return {
      commenting: false,
      current_blog_index: 0,
      current_blog_id: 0,
    };
  },
  computed: {
    ...Vuex.mapState(["auth"]),
  },
  methods: {
    async commentHandler(comment) {
      this.blogs[this.current_blog_index] = await this.$axios.$post(
        `/api/blogs/${this.current_blog_id}/comment`,
        {
          comment,
          id: this.current_blog_id,
        }
      );
      // this.$forceUpdate()
      this.blogs = [...this.blogs];
    },
    commentListener(index, id) {
      this.current_blog_index = index;
      this.current_blog_id = id;
      this.commenting = true;
    },
    async Like(id, index) {
      let updatedblog = await this.$axios.$post(`/api/blogs/${id}/like`);
      this.blogs[index] = updatedblog;
      this.blogs = [...this.blogs];
    },
    isLiked(index) {
      return this.blogs[index].likes.filter((x) => x.User == this.auth.user._id)
        .length > 0
        ? "red"
        : null;
    },
    async Delete(id){
      if(confirm("are you sure you want to delete?")){
       let response = await this.$axios.$delete(`/api/blogs/${id}`)
       if(response){
         this.blogs = [...this.blogs.filter(x=>x._id!= id)]
       }
      }
    }
  },
};
</script>