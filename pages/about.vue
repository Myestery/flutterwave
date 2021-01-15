<template>
  <div>this is the about page{{key}}
  </div>
</template>

<script>
    

export default {
  // layout: "empty",
  auth:"guest",
  data(){
    return{
      key:'process.env.PRIVATE_KEY'
    }
  },
  head() {
    return {
      title: "About Page",
      script: [
        {
          src: "https://cdn.jsdelivr.net/npm/vue/dist/vue.js",
          async: true,
          defer: true,
        },
      ],
    };
  },
};
</script>

<style>
</style>