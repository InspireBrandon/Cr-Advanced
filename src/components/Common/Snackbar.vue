<template>
  <v-snackbar v-model="snackbar" :multi-line="mode === 'multi-line'"
    :right="true" :timeout="timeout" :top="true" :vertical="mode === 'vertical'">
    {{ text }}
    <v-btn color="white" flat @click="snackbar = false">
      Close
    </v-btn>
  </v-snackbar>
</template>

<script>
  export default {
    data () {
      return {
        snackbar: false,
        y: null,
        x: 'right',
        mode: '',
        timeout: 6000,
        text: 'Important Notification!!!'
      }
    },
    methods: {
      show(text) {
        this.text = text;
        this.snackbar = true;
      }
    }
  }
</script>