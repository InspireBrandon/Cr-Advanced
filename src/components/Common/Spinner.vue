<template>
  <div class="spinner">
    <v-dialog v-model="dialog" persistent width="300">
      <v-card>
        <v-card-text style="text-align: center;">
          <span style="margin-left: 80px">Please wait...</span>
          <v-progress-circular style="margin-left: 50px;" indeterminate color="primary"></v-progress-circular>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    name: "spinner",
    data() {
      return {
        dialog: false,
      }
    },
    methods: {
      show() {
        this.dialog = true;
      },
      hide() {
        this.dialog = false;
      }
    }
  }

</script>
