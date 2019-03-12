<template>
  <v-dialog v-model="dialog" persistent width="300">
    <v-card :color="dialogColor" dark>
      <v-card-text>
        {{ text }}
        <v-progress-linear v-model="value" color="white" class="mb-0"></v-progress-linear>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
  import Axios from 'axios';

  export default {
    name: 'ProgressDialog',
    data() {
      return {
        dialog: false,
        text: 'Loading, please wait...',
        dialogColor: 'primary',
        value: 0
      }
    },
    methods: {
      show() {
        this.dialog = true;
      },
      setCurrentValue(value) {
        this.value = value;
      },
      setText(text) {
        this.text = text;
      },
      hide() {
        this.dialog = false;
      },
    }
  }

</script>
