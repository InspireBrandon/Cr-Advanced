<template>
  <div>
    <v-dialog v-model="dialog" fullscreen persistent scrollable>
      <v-card height="400px" style="overflow: auto;">

        <v-card-title style=" display: block;" class="headline pa-0">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Select A Fixture</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-text-field v-model="searchText" append-icon="search"></v-text-field>
            <v-btn icon @click.native="dialog = false">
              <v-icon>close</v-icon>
            </v-btn>

          </v-toolbar>
        </v-card-title>

        <v-card-text style="display: block;">
          <v-list class="pa-0" dense hover v-for="(sp, idx) in filteredSpacePlans" :key="idx">
            <v-divider v-if="!sp.archived"></v-divider>
            <v-list-tile :class="{ 'highlighted': selectedSpacePlan == sp  }" avatar @click="selectedSpacePlan = sp" v-if="!sp.archived">
              <v-list-tile-content>
                <v-list-tile-title v-text="sp.name"></v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-checkbox la label="Can Distribute" @change="setCanDistribute(sp)" v-model="sp.canDistribute"
                  hide-details color="primary"></v-checkbox>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
        </v-card-text>
        <v-spacer></v-spacer>
        <v-card-actions>

          <v-btn :disabled="selectedSpacePlan == null" color="error" @click="deleteSpacePlanFile">Delete</v-btn>
          <v-btn :disabled="selectedSpacePlan == null" color="warning" @click="archiveFile">Archive</v-btn>

          <v-spacer></v-spacer>

          <v-btn color="primary" @click="returnSpacePlanFile">Continue</v-btn>

        </v-card-actions>
      </v-card>
    </v-dialog>
    <Dialog ref="dialog"></Dialog>
  </div>
</template>

<script>
  import Axios from 'axios';
  import Dialog from '@/components/Common/Dialog';

  export default {
    name: 'RangeSelectorModal',
    components: {
      Dialog
    },
    data() {
      return {
        searchText: null,
        dialog: false,
        spaceData: [],
        afterComplete: null,
        selectedSpacePlan: null,

        status: [{
          type: 0,
          friendy: "New",
          color: "blue"
        }, {
          type: 1,
          color: "blue",
          friendy: "In Progress"
        }, {
          type: 2,
          color: "blue",
          friendy: "Requsting Approval"
        }, {
          type: 3,
          color: "red",
          friendy: "Variation Requested"
        }, {
          type: 4,
          color: "green",
          friendy: "Approved"
        }, {
          type: 5,
          color: "green",
          friendy: "Implemented"
        }, {
          type: 6,
          color: "black",
          friendy: "Retracted"
        }],
      }
    },
    computed: {
      filteredSpacePlans() {
        return this.spaceData.filter(item => {
          if (!this.searchText) return this.spaceData;
          return (item.name.toLowerCase().includes(this.searchText.toLowerCase()))
        });
      }
    },
    methods: {
      getSpacePlans(callback) {
        let self = this;

        self.spaceData = [];

        Axios.get(process.env.VUE_APP_API + "SystemFile/JSON?db=CR-Devinspire&folder=FIXTURES")
          .then(r => {
            self.spaceData = r.data;
            console.log(self.spaceData);

            callback();
          })
          .catch(e => {
            alert("Failed to get data...");
          })
      },
      show(afterComplete) {
        let self = this;
        self.getSpacePlans(() => {
          self.dialog = true;
          self.afterComplete = afterComplete;
        })
      },
      returnSpacePlanFile() {
        let self = this;
        if (this.selectedSpacePlan == null) {
          alert("Please Select A File");
        } else {
          self.dialog = false;

          self.afterComplete(self.selectedSpacePlan.id, self.selectedSpacePlan);
        }
      },
      deleteSpacePlanFile() {
        let self = this;

        self.$refs.dialog.openDialog({
          headline: "Delete file?",
          text: "Are you sure you want to delete this file?",
          callback: function () {

            Axios.delete(process.env.VUE_APP_API +
                `SystemFile/JSON/Delete?db=CR-Devinspire&id=${self.selectedSpacePlan.id}`)
              .then(r => {
                if (r.data) {
                  self.spaceData.splice(self.spaceData.indexOf(self.selectedSpacePlan), 1);
                  self.selectedSpacePlan = null;
                }
              })
          }
        })
      },
      archiveFile() {
        let self = this;

        self.$refs.dialog.openDialog({
          headline: "Archive file?",
          text: "Are you sure you want to archive this file?",
          callback: function () {

            Axios.post(process.env.VUE_APP_API +
                `SystemFile/Archive?db=CR-Devinspire&fileID=${self.selectedSpacePlan.id}`)
              .then(r => {
                if (r.data) {
                  self.spaceData.splice(self.spaceData.indexOf(self.selectedSpacePlan), 1);
                  self.selectedSpacePlan = null;
                }
              })
          }
        })
      },
      setCanDistribute(sp) {
        let self = this;

        self.$nextTick(() => {
          Axios.post(process.env.VUE_APP_API +
              `SystemFile/SetDistribute?db=CR-DEVINSPIRE&systemFileID=${sp.id}&canDistribute=${sp.canDistribute}`)
            .then(r => {
              console.log(r.data);
            })
        })
      }
    }
  }
</script>

<style>
  .highlighted {
    background-color: #1976d2;
  }
</style>