<template>
  <div>
    <v-layout row justify-center>
      <v-dialog v-model="dialog" persistent max-width="600">
        <v-card>
          <v-toolbar dark flat color="primary">
            <v-toolbar-title>
              {{ title }}
            </v-toolbar-title>
          </v-toolbar>
          <!-- <v-card-title style="text-align: center; display: block;" class="headline"></v-card-title> -->
          <v-card-actions style="text-align: center; display: block;">
            <v-btn color="primary darken-1" @click.native="returnValue(true)">Yes</v-btn>
            <v-btn color="error darken-1" @click.native="returnValue(false)">No</v-btn>
            <v-btn color="error darken-1" @click.native="self.dialog = false">cancel</v-btn>
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