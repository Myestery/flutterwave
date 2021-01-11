<template>
  <div>
    <v-dialog v-model="active" max-width="500px">
      <v-card>
        <v-card-title>
          <span>Write a Comment</span>
          <v-spacer></v-spacer>
        </v-card-title>
        <v-card>
          <v-card-text>
            <v-textarea
              name="input-7-1"
              label="Commenting"
              placeholder="Write a comment"
              v-model="comment"
              hint="Be Nice"
            ></v-textarea>
          </v-card-text>
        </v-card>
        <v-card-actions>
          <v-btn color="success" text @click="sendComment"> SEND </v-btn>
          <v-btn color="danger" text @click="dialog = false"> CANCEL </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props:['active'],
  data() {
    return {
      dialog: true,
      comment: "",
    };
  },
  methods: {
    sendComment(text) {
      this.$emit('close')
      this.$emit("comment", this.comment);
      this.comment=""
    },
  },
};
</script>

<style>
</style>