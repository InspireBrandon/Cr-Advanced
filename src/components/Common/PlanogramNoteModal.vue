<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" persistent max-width="800">
      <v-card height="500px">
        <v-toolbar dark dense flat color="primary">
            <v-toolbar-title>Planogram notes</v-toolbar-title>
        </v-toolbar>
        <v-card-text style="height: 400px; overflow-y: scroll;">
            <wysiwyg height="330px" v-model="html" />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click.native="save">Send</v-btn>
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
        afterReturn: null,
        html: ''
      }
    },
    methods: {
        show(afterReturn) {
            let self = this;
            self.html = ""
            self.afterReturn = afterReturn;
            self.dialog = true;
        },
        save() {
            let self = this;
            self.dialog = false;
            self.afterReturn(self.html);
        }
    }
  }
</script>