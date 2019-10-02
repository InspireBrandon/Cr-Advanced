<template>
  <v-dialog fullscreen persistent v-model="dialog" width="90vw">

    <v-card>
      <v-toolbar color="primary" dark>
        <v-toolbar-title> Note</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn color="error" @click="dialog = false">Cancel</v-btn>
      </v-toolbar>
      <v-card-text>


        <v-card light class="elevation-0" style="height: calc(100vh - 170px); overflow-x: auto;">
          <v-card-text>
            <wysiwyg v-model="html" />
          </v-card-text>
        </v-card>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="html = ''">Clear</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="save">Save</v-btn>

      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import axios from 'axios';

  export default {
    created() {},
    data() {
      return {
        html: "",
        dialog: false,
        component: "",
        afterReturn: null
      }
    },
    methods: {
      show(component, afterReturn) {
        let self = this;
        self.afterReturn = afterReturn;

        self.component = component;

        axios.get(process.env.VUE_APP_API + "HelpFile?systemComponent=" + component)
          .then(r => {
            if (r.data.success) {
              self.html = r.data.helpFile.html;
            } else {
              self.html = "";
            }

            self.dialog = true;
          })
      },
      save() {
        let self = this;

        axios.post(process.env.VUE_APP_API + "HelpFile", {
            systemComponent: self.component,
            html: self.html
          })
          .then(r => {
            self.dialog = false;
            if (self.afterReturn != undefined && self.afterReturn != null) {
              self.afterReturn(self.html);
            }
          })
      }
    }
  }
</script>
<style scoped>

</style>