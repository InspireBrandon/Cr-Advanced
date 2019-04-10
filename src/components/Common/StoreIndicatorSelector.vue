<template>
  <div>
    <v-layout row justify-center>
      <v-dialog v-model="dialog" persistent max-width="600">
        <v-card >
          <v-card-title style="text-align: center; display: block;" class="headline">{{ title }}</v-card-title>
          <v-card-text style="text-align: center;">
            <v-btn color="primary" @click="setSelection(true)">Select All</v-btn>
            <v-btn color="primary" @click="setSelection(false)">Deselect All</v-btn>
            <v-form @submit.prevent="returnText">
              <v-card height="300" style="overflow: auto;">
                <v-layout row>
                  <v-flex overflow-y-hidden>
                    <v-list hover dense v-for="(store, idx) in sortedItems" :key="idx">
                      <v-divider></v-divider>
                      <v-list-tile>
                        <v-list-tile-content>
                          <v-list-tile-title>{{ store.storeName }}
                          </v-list-tile-title>
                        </v-list-tile-content>
                        <v-list-tile-action>
                          <v-checkbox color="primary" v-model="store.selected"></v-checkbox>
                        </v-list-tile-action>
                      </v-list-tile>
                    </v-list>
                  </v-flex>
                </v-layout>
              </v-card>
            </v-form>
          </v-card-text>
          <v-card-actions style="text-align: right; display: block;">
            <v-spacer></v-spacer>
            <v-btn color="error" @click.native="dialog = false">Cancel</v-btn>
            <v-btn color="primary" @click.native="returnSelected">Continue</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </div>
</template>

<script>
  import Axios from 'axios';
  export default {
    data() {
      return {
        clusterType: null,
        clusterID: null,
        stores: [],
        dialog: false,
        afterRuturn: null,
        title: 'Selected Stores',
      }
    },
    computed: {
      sortedItems() {
        return this.stores.sort(function (a, b) {
          if (a.storeName < b.storeName) {
            return -1;
          }
          if (a.storeName > b.storeName) {
            return 1;
          }
          return 0;
        })
      }
    },
    methods: {
      addSelected(store) {
        var self = this
        self.selectedStores.push(store);
      },
      show(stores, clusterType, clusterID, afterRuturn) {
        let self = this;
        self.stores = stores;
        self.clusterType = clusterType;
        self.clusterID = clusterID || null;
        self.afterRuturn = afterRuturn;
        self.dialog = true;
      },
      returnSelected() {
        let self = this;
        self.afterRuturn(self.stores);
        self.dialog = false;
      },
      setSelection(value) {
        let self = this;

        self.stores.forEach(el => {
          el.selected = value;
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
