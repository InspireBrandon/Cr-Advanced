<template>
  <div>
    <v-dialog v-model="dialog" fullscreen persistent scrollable>
      <v-card  height="400px" style="overflow: auto;">
        <v-card-title style="text-align: center; display: block;" class="headline pa-0">
          <v-toolbar dark color="primary">
            <v-toolbar-title >Select A Category</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-text-field color="white" v-model="searchText" append-icon="search"></v-text-field>
            <v-btn icon @click.native="dialog = false"><v-icon>close</v-icon></v-btn>
          </v-toolbar>
        </v-card-title>

        <v-card-text>
          <v-list  dense hover v-for="(category, idx) in filteredList" :key="idx">
             <v-divider></v-divider>
            <v-list-tile  :class="{ 'highlighted': selectedCategory == category  }"
              avatar @click="selectedCategory = category">
              
              <v-list-tile-content>
                <v-list-tile-title v-text="category.displayName"></v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="returnCategory">Continue</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import Axios from 'axios';

  export default {
    name: 'RangeSelectorModal',
    data() {
      return {
        dialog: false,
        categories: [],
        afterComplete: null,
        selectedCategory: null,
        searchText: ''
      }
    },
    computed: {
      filteredList() {
        return this.categories.filter(item => {
          if (!this.searchText) return this.categories;
          return (item.displayName.toLowerCase().includes(this.searchText.toLowerCase()))
        });
      }
    },
    
    methods: {
      getRange(callback) {
        let self = this;

        self.categories = [];

        Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

        Axios.get(process.env.VUE_APP_API + "Retailer/Category_Link_Distinct")
          .then(r => {
            self.categories = r.data;
            delete Axios.defaults.headers.common["TenantID"];
            callback();
          })
          .catch(e => {
              delete Axios.defaults.headers.common["TenantID"];
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
      returnCategory() {
        let self = this;
        if (this.selectedCategory == null) {
          alert("Please Select A File");
        } else {
          self.dialog = false;

          self.afterComplete(self.selectedCategory);
        }
      }
    }
  }

</script>
<style>
  .highlighted {
    background-color: #1976d2;
    -webkit-text-fill-color: aliceblue
  }

</style>
