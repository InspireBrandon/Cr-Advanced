<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" persistent max-width="290">
      <v-card dark>
        <v-card-title style="text-align: center; display: block;" class="headline">{{ headline }}</v-card-title>
        <v-card-text style="text-align: center;">{{ text }}</v-card-text>
        <v-card-actions style="text-align: center; display: block;">
          <v-spacer></v-spacer>
          <v-btn v-if="callback == null" color="primary" @click.native="dialog = false">Ok</v-btn>
          <v-btn v-if="callback != null" color="error" @click.native="dialog = false">Disagree</v-btn>
          <v-btn v-if="callback != null" color="primary" @click.native="closeDialog">Agree</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
  export default {
    data () {
      return {
        dialog: false,
        headline: '',
        text: '',
        callback: null
      }
    },
    methods: {
        openDialog(data) {
            let self = this;
            self.headline = data.headline;
            self.text = data.text;
            self.callback = null;
            self.callback = data.callback;
            self.dialog = true;
        },
        closeDialog() {
            let self = this;
            self.callback();
            self.dialog = false;
        }
    }
  }
</script>