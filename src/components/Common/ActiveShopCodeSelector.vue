<template>
  <div>
    <v-layout row justify-center>
      <v-dialog v-model="dialog" persistent max-width="400">
        <v-card dark>
          <v-card-title style="text-align: center; display: block;" class="headline">{{ title }}</v-card-title>
          <v-card-text style="text-align: center;">
            <v-form @submit.prevent="returnText">
              <v-select dark dense hide-details v-model="active_shope_code" :items="items" :label="label"></v-select>
            </v-form>
          </v-card-text>
          <v-card-actions style="text-align: center; display: block;">
            <v-spacer></v-spacer>
            <v-btn color="error darken-1" flat @click.native="dialog = false">Cancel</v-btn>
            <v-btn color="primary darken-1" flat @click.native="returnASC">Continue</v-btn>
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
        active_shope_code: null,
        items: [{
          text: 'NEW ITEMS',
          value: 1
        }, {
          text: 'DE-LISTED ITEMS',
          value: 2
        }, {
          text: 'ACTIVE ITEMS',
          value: 3
        }],
        dialog: false,
        afterRuturn: null,
        title: '',
        label: ''
      }
    },
    methods: {
      show(title, label, afterRuturn) {
        let self = this;
        self.active_shope_code = null;
        self.title = title;
        self.label = label;
        self.afterRuturn = afterRuturn;
        self.dialog = true;
      },
      returnASC() {
        let self = this;
        if (self.active_shope_code == null) {
          alert("Please select an active shop code");
        } else {
          self.afterRuturn(self.active_shope_code);
          self.dialog = false;
        }
      }
    }
  }

</script>
