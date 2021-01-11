<template>
  <div>this is the about page{{key}}
  </div>
</template>

<script>
export default {
  layout: "empty",
  data(){
    return{
      key:'process.env.PRIVATE_KEY'
    }
  },
  head() {
    return {
      title: "About Page",
    };
  },
};
</script>

<style>
</style>