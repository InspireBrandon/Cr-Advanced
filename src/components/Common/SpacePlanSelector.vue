<template>
  <div>
    <v-dialog v-model="dialog" fullscreen persistent scrollable>
      <v-card dark height="400px" style="overflow: auto;">

        <v-card-title style="text-align: center; display: block;" class="headline pa-0">
          <v-toolbar>
            <v-toolbar-title>Select A Planogram</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-text-field v-model="searchText" append-icon="search"></v-text-field>
          </v-toolbar>
        </v-card-title>

        <v-card-text style=" display: block;">
          <v-list dense hover v-for="(sp, idx) in filteredSpacePlans" :key="idx">
            <v-divider></v-divider>
            <v-list-tile :class="{ 'highlighted': selectedSpacePlan == sp  }" avatar @click="selectedSpacePlan = sp">
              <v-list-tile-content>
                <v-list-tile-title v-text="sp.name"></v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-card-text>
        <v-spacer></v-spacer>
        <v-card-actions>

          <v-btn :disabled="selectedSpacePlan == null" color="error" @click="deleteSpacePlanFile">Delete</v-btn>

          <v-spacer></v-spacer>

          <v-btn color="primary" @click="returnSpacePlanFile">Continue</v-btn>
          <v-btn flat @click="dialog = false">Cancel</v-btn>

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
        selectedSpacePlan: null
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

        Axios.get(process.env.VUE_APP_API + "SystemFile/JSON?db=CR-Devinspire&folder=Space Planning")
          .then(r => {
            self.spaceData = r.data;
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

          self.afterComplete(self.selectedSpacePlan.id);
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
      }
    }
  }
</script>

<style>
  .highlighted {
    background-color: #1976d2;
  }
</style>