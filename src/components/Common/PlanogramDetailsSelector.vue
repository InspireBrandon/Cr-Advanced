<template>
  <div>
    <v-dialog v-model="dialog" max-width="1000px"  persistent scrollable>
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
              <v-list-tile-action>h:{{sp.height}} w:{{sp.width}} modules:{{sp.modules}}</v-list-tile-action>
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
        let canAdd = false
        // console.log("-----------------------------");

        // console.log(self.PlanoName == listitem.planogramName);
        // console.log(listitem.planogramName);
        //   console.log(self.PlanoName);

        if (listitem.planogramName == null) {
          listitem.planogramName = ""
        }

        if (self.PlanoName.toUpperCase() == listitem.planogramName.toUpperCase()) {
          console.log("same");
          canAdd = true
        } else {
          canAdd = false
          return
        }
        if (item.modules >= listitem.modules) {
          canAdd = true
        } else {
          canAdd = false
          return
        }
        if (item.bins >= listitem.bins) {
          canAdd = true
        } else {
          canAdd = false
          return
        }
        if (item.height >= listitem.height) {
          canAdd = true
        } else {
          canAdd = false
          return
        }
        if (item.width >= listitem.width) {
          canAdd = true
        } else {
          canAdd = false
          return
        }
        callback(canAdd)
      },
      getSpacePlans(data, callback) {
        let self = this;
        console.log("data");
        console.log(data);
        console.log(self.PlanoName);


        self.spaceData = [];
        Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

        Axios.get(process.env.VUE_APP_API + "/Planogram_Details")
          .then(r => {
            console.log("r.data.planogram_DetailsList");
            console.log(r.data.planogram_DetailsList);
            self.spaceData = []
            r.data.planogram_DetailsList.forEach(element => {
              self.checkAdd(data, element, retval => {
                if (retval == true) {
                  self.spaceData.push(element)
                }
              })

            });


            delete Axios.defaults.headers.common["TenantID"];

            callback();
          })
        // .catch(e => {
        //   alert("Failed to get data..."+e);
        // })
      },
      show(data, afterComplete) {
        let self = this;
        // self.filterProject = ProjectID
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
      }
    }
  }
</script>

<style>
  .highlighted {
    background-color: #1976d2;
  }
</style>