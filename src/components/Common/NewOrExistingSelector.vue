<template>
  <div>
    <v-layout row justify-center>
      <v-dialog v-model="dialog" persistent max-width="300">
        <v-card dark>
          <v-card-title style="text-align: center; display: block;" class="headline">{{ title }}</v-card-title>
          <v-card-text style="text-align: center;">
            <v-btn color="success" flat outline @click.native="returnResult('new')">new</v-btn>
            <v-btn color="primary" flat outline @click.native="returnResult('existing')">Existing</v-btn>
            <v-btn color="error" flat @click.native="dialog = false">Cancel</v-btn>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-layout>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        dialog: false,
        afterRuturn: null,
        title: ''
      }
    },
    methods: {
      show(title, afterRuturn) {
        let self = this;
        self.title = title;
        self.afterRuturn = afterRuturn;
        self.dialog = true;
      },
      returnResult(value) {
        let self = this;
        self.afterRuturn(value);
        self.dialog = false;
      }
    }
  }

</script>
