<template>
  <div>
    <v-dialog v-model="dialog" max-width="1000px" persistent scrollable>
      <v-card height="400px" style="overflow: auto;">

        <v-card-title style=" display: block;" class="headline pa-0">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Select A Planogram</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-text-field v-model="searchText" append-icon="search"></v-text-field>
            <v-btn icon @click.native="dialog = false">
              <v-icon>close</v-icon>
            </v-btn>

          </v-toolbar>
        </v-card-title>

        <v-card-text style="display: block;">
          <v-list dense hover v-for="(sp, idx) in filteredSpacePlans" :key="idx">
            <v-divider></v-divider>
            <v-list-tile :class="{ 'highlighted': selectedSpacePlan == sp  }" avatar @click="selectedSpacePlan = sp">


              <v-list-tile-content>
                <v-list-tile-title v-text="sp.fileName"> </v-list-tile-title>

              </v-list-tile-content>
              <v-spacer></v-spacer>
              <v-list-tile-action v-if="bestFit==sp.count">BEST FIT</v-list-tile-action>
              <!-- <v-list-tile-action> - h:{{sp.count}} w:{{sp.width}} modules:{{sp.modules}}</v-list-tile-action> -->
            </v-list-tile>
          </v-list>
        </v-card-text>
        <v-spacer></v-spacer>
        <v-card-actions>

          <v-btn :disabled="selectedSpacePlan == null" color="error" @click="deleteSpacePlanFile">Delete</v-btn>

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
    props: ["PlanoName"],
    name: 'RangeSelectorModal',
    components: {
      Dialog
    },
    data() {
      return {
        bestFit: 0,
        doCheck: false,
        filterProject: null,
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
          return (item.fileName.toLowerCase().includes(this.searchText.toLowerCase()))
        });
      }
    },
    methods: {
      checkAdd(item, listitem, callback) {
        let self = this
        let canAdd = {
          count: 0,
          add: false
        }

        if (listitem.planogramName == null) {
          listitem.planogramName = ""
        }

        console.log(self.PlanoName, listitem.planogramName)

        if (self.PlanoName.toUpperCase() == listitem.planogramName.toUpperCase()) {
          canAdd.add = true
        }

        if (item.modules >= listitem.modules) {
          canAdd.count++
        }

        if (item.height >= listitem.height) {
          canAdd.count++
        }

        if (listitem.storeCluster == item.cluster) {
          canAdd.count++
        }

        callback(canAdd)
      },
      getSpacePlans(data, callback) {
        let self = this;
        self.bestFit = 0
        self.spaceData = [];
        Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

        Axios.get(process.env.VUE_APP_API + "/Planogram_Details")
          .then(r => {

            console.log(r)

            self.spaceData = []
            if (self.doCheck == true) {
              r.data.planogram_DetailsList.forEach(element => {
                self.checkAdd(data, element, retval => {
                  if (retval.add == true) {
                    element.count = retval.count
                    self.spaceData.push(element)
                  }
                })
              });
              self.spaceData.sort((a, b) => (a.count < b.count) ? 1 : -1)
              self.bestFit = self.spaceData[0].count
            } else {
              self.spaceData = r.data.planogram_DetailsList
            }
            delete Axios.defaults.headers.common["TenantID"];
            callback();
          })
      },
      show(data, doCheck, afterComplete) {
        let self = this;
        self.doCheck = doCheck
        self.getSpacePlans(data, callback => {
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

          self.afterComplete(self.selectedSpacePlan);
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