<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" persistent max-width="800">
      <v-card height="500px">
        <v-toolbar dark dense flat color="primary">
          <v-toolbar-title>Add observation notes</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click.native="dialog = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text style="height: 400px; overflow-y: scroll;">
          <div style="width: 250px">
            <v-select :items="options" v-model="selectedOption" label="Type"></v-select>
          </div>
          <div style="width: 350px">
            <v-select v-if="selectedOption != 0" item-text="name" item-value="id" return-object :items="projects"
              v-model="selectedProject" label="Category">
            </v-select>
          </div>
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
  import Axios from 'axios';
  import jwt from "jsonwebtoken";

  export default {
    data() {
      return {
        dialog: false,
        headline: '',
        text: '',
        afterReturn: null,
        html: '',
        options: [{
            text: "Top Line",
            value: 0,
          },
          {
            text: "Category",
            value: 1,
          }
        ],
        selectedOption: 0,
        projects: [],
        selectedProject: null
      }
    },
    methods: {
      show(afterReturn) {
        let self = this;
        self.selectedOption = 0;
        self.selectedPlanogram = null;
        self.html = ""
        self.getProjects(() => {
          self.afterReturn = afterReturn;
          self.dialog = true;
        })
      },
      save() {
        let self = this;
        self.dialog = false;

        let encoded_details = jwt.decode(sessionStorage.accessToken);
        let systemUserID = encoded_details.USER_ID;

        let returnObj = {
          planogramID: self.selectedOption == 0 ? null : self.selectedProject.planogram_ID,
          userID: systemUserID,
          noteType: 0,
          type: self.selectedOption,
          html: self.html,
        }

        self.afterReturn(returnObj);
      },
      getProjects(callback) {
        let self = this;

        Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

        Axios.get(process.env.VUE_APP_API + "Project")
          .then(r => {
            delete Axios.defaults.headers.common["TenantID"];
            self.projects = r.data.projectList;
            callback()
          })
      },
    }
  }
</script>