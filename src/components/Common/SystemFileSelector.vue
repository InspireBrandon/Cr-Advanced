<template>
  <div>
    <v-dialog v-model="dialog" fullscreen persistent scrollable>
      <v-card  height="400px" style="overflow: auto;">
        <v-card-title style="text-align: center; display: block;" class="headline pa-0">
          <v-toolbar dark color="primary">
            <v-toolbar-title >Select A file</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-text-field color="white" v-model="searchText" append-icon="search"></v-text-field>
            <v-btn icon @click.native="dialog = false"><v-icon>close</v-icon></v-btn>
          </v-toolbar>
        </v-card-title>

        <v-card-text>
          <v-list  dense hover v-for="(File, idx) in filteredList" :key="idx">
             <v-divider></v-divider>
            <v-list-tile  :class="{ 'highlighted': selectedFile == File  }"
              avatar @click="selectedFile = File">
              
              <v-list-tile-content>
                <v-list-tile-title v-text="File.name"></v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-card-text>

        <v-card-actions>


          <v-spacer></v-spacer>

          <v-btn color="primary" @click="returnFileFile">Continue</v-btn>
          <!-- <v-btn flat @click="dialog = false">Cancel</v-btn> -->

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
    name: 'FileSelectorModal',
    components: {
      Dialog
    },
    data() {
      return {
        dialog: false,
        FileData: [],
        afterComplete: null,
        selectedFile: null,
        searchText: '',
        folder:null,
      }
    },
    computed: {
      filteredList() {
        return this.FileData.filter(item => {
          if (!this.searchText) return this.FileData;
          return (item.name.toLowerCase().includes(this.searchText.toLowerCase()))
        });
      }
    },
    
    methods: {
      getFile(callback) {
        let self = this;

        self.FileData = [];

        Axios.get(process.env.VUE_APP_API + "SystemFile/JSON?db=CR-Devinspire&folder="+self.folder)
          .then(r => {
            self.FileData = r.data;
            
            callback();
          })
          .catch(e => {
            alert("Failed to get data...");
          })
      },
      show(folder,afterComplete) {
        let self = this;
        self.folder=folder
        self.getFile(() => {
          self.dialog = true;
          self.afterComplete = afterComplete;
        })
      },
      returnFileFile() {
        let self = this;
        if (this.selectedFile == null) {
          alert("Please Select A File");
        } else {
          self.dialog = false;

          self.afterComplete(self.selectedFile.id);
        }
      },
    }
  }

</script>
<style>
  .highlighted {
    background-color: #1976d2;
    -webkit-text-fill-color: aliceblue
  }

</style>
