<template>
  <div v-html="html"></div>
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

          if (r.data.success) {
            self.html = r.data.helpFile.html;
          } else {
            self.html = "";
          }
        })
      setTimeout(() => {
        this.snackbar = true
      }, 5000)
    },
    data() {
      return {
        component: "NoticeBoard",
        timeout: 0,
        html: "",
        snackbar: false
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
  .scrollable {
    height: calc(100vh - 300px);
    overflow: auto;
  }
</style>