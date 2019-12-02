<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" persistent fullscreen max-width="800">
      <v-card height="500px">
        <v-toolbar dark dense flat color="primary">
          <v-toolbar-title>Add observation notes</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click.native="dialog = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <div style="width: 250px">
            <v-select :items="options" v-model="selectedOption" label="Type"></v-select>
          </div>
          <div style="display: inline-flex;" v-if="selectedOption == 0">
            <v-select style="width: 350px;" item-text="name" item-value="id" class="ml-2" v-model="selectedTopLineTopic"
              :items="topLineTopics" label="Observation Topic">
            </v-select>
            <v-btn @click="addTopLineTopic" fab small color="primary">
              <v-icon>add</v-icon>
            </v-btn>
            <v-btn v-if="selectedTopLineTopic != null" @click="editTopLineTopic" fab small color="info">
              <v-icon>edit</v-icon>
            </v-btn>
            <v-btn v-if="selectedTopLineTopic != null" @click="deleteTopLineTopic" fab small color="error">
              <v-icon>delete</v-icon>
            </v-btn>
          </div>
          <div style="width: 350px" v-if="selectedOption != 0">
            <v-select item-text="name" item-value="id" :items="projects" v-model="selectedProject" label="Category">
            </v-select>
          </div>
          <div style="height: calc(100vh - 280px); overflow-y: scroll;">
            <!-- <vue-html-editor name="html-editor" :model.sync="text"></vue-html-editor> -->
            <!-- <VueHTMLEditor v-model="html" height="330px"></VueHTMLEditor> -->
            <!-- <wysiwyg v-if="showWYS" height="330px" v-model="html" /> -->
            <vue-editor class="anyimg" v-model="html"></vue-editor>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click.native="save">Send</v-btn>
        </v-card-actions>
        <Prompt ref="Prompt" />
        <YesNoModal ref="YesNoModal" />
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
  import Axios from 'axios';
  import jwt from "jsonwebtoken";
  import Prompt from "@/components/Common/Prompt";
  import YesNoModal from '@/components/Common/YesNoModal';

  import {
    VueEditor
  } from "vue2-editor";

  export default {
    components: {
      Prompt,
      VueEditor,
      YesNoModal
    },
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
        selectedProject: null,
        topLineTopics: [],
        selectedTopLineTopic: null,
        dateTime: null,
        showWYS: false
      }
    },
    methods: {
      show(afterReturn) {
        let self = this;
        self.showWYS = false;
        self.showWYS = true;
        self.selectedOption = 0;
        self.selectedPlanogram = null;
        self.html = ""
        self.getObservationTopics();
        self.getProjects(() => {
          self.afterReturn = afterReturn;
          self.dialog = true;
        })
      },
      showEdit(data, afterReturn) {
        let self = this;
        self.showWYS = false;
        self.showWYS = true;
        self.id = data.id;
        self.selectedOption = data.type;
        self.selectedTopLineTopic = data.topLineTypeID;
        self.selectedPlanogram = data.planogramID;
        self.dateTime = data.dateTime;
        self.html = data.html
        self.getObservationTopics();
        self.getProjects(() => {
          self.afterReturn = afterReturn;
          self.dialog = true;
        })
      },
      save() {
        let self = this;

        let canPass = true;

        if (self.selectedOption == 0) {
          if (self.selectedTopLineTopic == null)
            canPass = false;
        }

        if (self.selectedOption == 1) {
          if (self.selectedPlanogram == null)
            canPass = false;
        }

        if (canPass) {
          self.dialog = false;

          let encoded_details = jwt.decode(sessionStorage.accessToken);
          let systemUserID = encoded_details.USER_ID;

          let returnObj = {
            id: self.id,
            planogramID: self.selectedOption == 0 ? null : self.selectedProject,
            userID: systemUserID,
            noteType: 0,
            type: self.selectedOption,
            topLineTypeID: self.selectedOption == 0 ? self.selectedTopLineTopic : null,
            dateTime: self.dateTime,
            html: self.html
          }

          self.afterReturn(returnObj);
        } else {
          let alertMessage = "Please specify a topic"

          if (self.selectedOption == 1)
            alertMessage = "Please specify a category"

          alert(alertMessage)
        }
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
      getObservationTopics() {
        let self = this

        Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

        Axios.get(process.env.VUE_APP_API + "TopLineType")
          .then(r => {
            delete Axios.defaults.headers.common["TenantID"];
            self.topLineTopics = r.data;
          })
      },
      addTopLineTopic() {
        let self = this;

        self.$refs.Prompt.show('', "Topic name", "Topic name", name => {
          self.createTopLineTopic(name);
        })
      },
      createTopLineTopic(name) {
        let self = this;

        let request = {
          name: name
        }

        Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

        Axios.post(process.env.VUE_APP_API + "TopLineType", request)
          .then(r => {
            delete Axios.defaults.headers.common["TenantID"];
            self.topLineTopics.push(r.data);
            self.selectedTopLineTopic = r.data;
          })
      },
      editTopLineTopic() {
        let self = this;
        let currentTopic = self.topLineTopics.find(x => {
          return x.id == self.selectedTopLineTopic
        });

        self.$refs.Prompt.show(currentTopic.name, "Topic name", "Topic name", name => {
          Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

          Axios.put(process.env.VUE_APP_API + "TopLineType", {
              id: currentTopic.id,
              name: name
            })
            .then(r => {
              delete Axios.defaults.headers.common["TenantID"];
              currentTopic.name = name;
            })
        })
      },
      deleteTopLineTopic() {
        let self = this;

        let currentTopic = self.topLineTopics.find(x => {
          return x.id == self.selectedTopLineTopic
        });

        self.$refs.YesNoModal.show("Delete topic?", val => {
          if (val) {
            Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

            Axios.delete(process.env.VUE_APP_API + `TopLineType?topLineTypeID=${currentTopic.id}`)
              .then(r => {
                delete Axios.defaults.headers.common["TenantID"];
                self.topLineTopics.splice(self.topLineTopics.indexOf(currentTopic), 1)
                self.selectedTopLineTopic = null;
              })
          }
        })
      }
    }
  }
</script>

<style>
  .anyimg img {
    max-width: 60%;
  }
</style>