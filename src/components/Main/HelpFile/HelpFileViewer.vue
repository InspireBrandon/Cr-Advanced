<template>
  <v-dialog fullscreen persistent v-model="dialog" width="90vw">

    <v-icon slot="activator">help_outline</v-icon>

    <v-card dark>
        <v-card-title dark class="headline" primary-title>
          Help File - {{ component }}
        </v-card-title>
        <v-card-text>
          <v-card light class="elevation-5" style="height: calc(100vh - 170px); overflow-x: auto;">
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

  export default {
    name: "HelpFileViewer",
    props: ['component'],
    created() {
      let self = this;

      axios.get(process.env.VUE_APP_API + "HelpFile?systemComponent=" + self.component)
        .then(r => {
          if (r.data.success) {
            self.html = r.data.helpFile.html;
          } else {
            self.html = "";
          }
        })
    },
    data() {
      return {
        html: "",
        dialog: false
      }
    }
  }

</script>
<style scoped>

</style>
