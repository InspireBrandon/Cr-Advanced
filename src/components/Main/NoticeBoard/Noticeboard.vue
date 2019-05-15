<template>
  <v-dialog persistent v-model="dialog" width="90vw">

    <v-icon slot="activator" @click="Open">error_outline</v-icon>

    <v-card dark>
      <v-card-title dark class="headline" primary-title>
        Notice Board
      </v-card-title>
      <v-card-text>
        <v-card light class="elevation-5" style="height: calc(90vh - 170px); overflow-x: auto;">
          <v-card-text>
            <div v-html="html"></div>
          </v-card-text>
        </v-card>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="dialog = false">Got it!</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import axios from 'axios';
  import {
    setTimeout
  } from 'timers';

  export default {
    name: "HelpFileViewer",

    created() {
      let self = this
      self.component = "Notice Board"
      axios.get(process.env.VUE_APP_API + "HelpFile?systemComponent=" + self.component)
        .then(r => {
          console.log(r.data.success);

          if (r.data.success) {
            self.html = r.data.helpFile.html;
          } else {
            self.html = "";
          }
        })
      setTimeout(() => {
        this.dialog = true
      }, 5000)
    },
    data() {
      return {
        component: "NoticeBoard",
        html: "",
        dialog: false
      }
    },
    methods: {
      Open() {
        let self = this;
        self.component = "Notice Board"
        axios.get(process.env.VUE_APP_API + "HelpFile?systemComponent=" + self.component)
          .then(r => {
            console.log(r.data.success);

            if (r.data.success) {
              self.html = r.data.helpFile.html;
            } else {
              self.html = "";
            }
          })
      }
    }
  }
</script>
<style scoped>

</style>