<template>
  <div>
    <v-layout row justify-center>
      <v-dialog v-model="dialog" persistent max-width="400">
        <v-card dark>
          <v-card-title style="text-align: center; display: block;" class="headline">{{ title }}</v-card-title>
          <v-card-actions style="text-align: center; display: block;">
            <v-spacer></v-spacer>
            <v-btn color="primary darken-1" @click.native="returnValue(true)">Yes</v-btn>
            <v-btn color="error darken-1" @click.native="returnValue(false)">No</v-btn>
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
      returnValue(value) {
        let self = this;
        self.afterRuturn(value);
        self.dialog = false;
      }
    }
  }

</script>
