<template>
  <div>
    <v-layout row justify-center>
      <v-dialog v-model="dialog" persistent max-width="400">
        <v-card >
          <v-toolbar flat dark dense color="primary">
            <v-toolbar-title>{{ title }}</v-toolbar-title>
          </v-toolbar>
          <v-card-text style="text-align: center;">
            <v-form @submit.prevent="returnText">
              <v-text-field autofocus ref="textField" v-model="text" :label="label" required></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions style="text-align: center; display: block;">
            <v-spacer></v-spacer>
            <v-btn color="error darken-1" @click.native="dialog = false">Cancel</v-btn>
            <v-btn color="primary darken-1" @click.native="returnText">Continue</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        text: '',
        dialog: false,
        afterRuturn: null,
        title: '',
        label: ''
      }
    },
    methods: {
      show(text, title, label, afterRuturn) {
        let self = this;
        self.text = text;
        self.title = title;
        self.label = label;
        self.afterRuturn = afterRuturn;
        self.dialog = true;
        setTimeout(() => {
          self.$nextTick(self.$refs.textField.focus());
        }, 60);
      },
      returnText() {
        let self = this;
        self.afterRuturn(self.text);
        self.dialog = false;
      }
    }
  }

</script>
