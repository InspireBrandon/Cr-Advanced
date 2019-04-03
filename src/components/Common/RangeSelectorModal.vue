<template>
  <div>
    <v-dialog v-model="dialog" fullscreen persistent scrollable>
      <v-card  height="400px" style="overflow: auto;">
        <v-card-title style="text-align: center; display: block;" class="headline pa-0">
          <v-toolbar dark color="primary">
            <v-toolbar-title >Select A Range</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-text-field v-model="searchText" append-icon="search"></v-text-field>
          </v-toolbar>
        </v-card-title>

        <v-card-text>
          <v-list dense hover v-for="(range, idx) in filteredList" :key="idx">
             <v-divider></v-divider>
            <v-list-tile  :class="{ 'highlighted': selectedRange == range  }"
              avatar @click="selectedRange = range">
              
              <v-list-tile-content>
                <v-list-tile-title v-text="range.name"></v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-card-text>

        <v-card-actions>

          <v-btn :disabled="selectedRange == null" color="error" @click="deleteRangeFile">Delete</v-btn>

          <v-spacer></v-spacer>

          <v-btn color="primary" @click="returnRangeFile">Continue</v-btn>
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
        dialog: false,
        rangeData: [],
        afterComplete: null,
        selectedRange: null,
        searchText: ''
      }
    },
    computed: {
      filteredList() {
        return this.rangeData.filter(item => {
          if (!this.searchText) return this.rangeData;
          return (item.name.toLowerCase().includes(this.searchText.toLowerCase()))
        });
      }
    },
    
    methods: {
      getRange(callback) {
        let self = this;

        self.rangeData = [];

        Axios.get(process.env.VUE_APP_API + "SystemFile/JSON?db=CR-Devinspire&folder=Ranging")
          .then(r => {
            self.rangeData = r.data;
            callback();
          })
          .catch(e => {
            alert("Failed to get data...");
          })
      },
      show(afterComplete) {
        let self = this;
        self.getRange(() => {
          self.dialog = true;
          self.afterComplete = afterComplete;
        })
      },
      returnRangeFile() {
        let self = this;
        if (this.selectedRange == null) {
          alert("Please Select A File");
        } else {
          self.dialog = false;

          self.afterComplete(self.selectedRange.id);
        }
      },
      deleteRangeFile() {
        let self = this;

        self.$refs.dialog.openDialog({
          headline: "Delete file?",
          text: "Are you sure you want to delete this file?",
          callback: function () {

            Axios.delete(process.env.VUE_APP_API +
                `SystemFile/JSON/Delete?db=CR-Devinspire&id=${self.selectedRange.id}`)
              .then(r => {
                if (r.data) {
                  self.rangeData.splice(self.rangeData.indexOf(self.selectedRange), 1);
                  self.selectedRange = null;
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
