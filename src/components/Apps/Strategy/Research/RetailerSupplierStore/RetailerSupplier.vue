<template>
  <div class="text-xs-center">
    <v-container fluid class="pa-0 ma-0" grid-list-md>
      <v-layout justify-center>
        <v-dialog v-model="dialog" width="1500">
          <v-card>
            <v-toolbar flat dark color="blue darken-2" scroll-off-screen>
              <v-toolbar-title>Configuration</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon @click="dialog = false">
                <v-icon>close</v-icon>
              </v-btn>
            </v-toolbar>
            <v-layout row wrap>
              <v-flex md12>
                <v-toolbar dark flat>
                  <v-spacer></v-spacer>
                  <v-text-field
                    append-icon="search"
                    type="text"
                    id="filter-text-box"
                    placeholder="Filter..."
                    @input="onFilterTextBoxChanged"
                    v-model="filterText"
                  ></v-text-field>
                  <v-spacer></v-spacer>
                </v-toolbar>
                <div>
                  <Grid ref="grid" :rowData="rowData" />
                </div>
              </v-flex>
            </v-layout>
          </v-card>
        </v-dialog>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import Axios from "axios";

import Grid from "./RetailerGrid";

export default {
  name: "config",
  components: {
    Grid
  },
  data() {
    return {
      dialog: false,
      rowData: [],
      retailerList: [],
      retailerStoreList: [],
      filterText: ""
    };
  },
  computed: {},
  methods: {
    show(afterReturn) {
      let self = this;

      self.getItems();
      self.afterReturn = afterReturn;
      self.dialog = true;
    },
    onFilterTextBoxChanged() {
      let self = this;
      self.$refs.grid.gridApi.setQuickFilter(self.filterText);
    },
    getItems() {
      let self = this;

      Axios.defaults.headers.common["TenantID"] =
        sessionStorage.currentDatabase;

      Axios.get(process.env.VUE_APP_API + `Supplier_Retailer_Store`).then(r => {
        self.rowData = r.data;
        delete Axios.defaults.headers.common["TenantID"];
      });
    }
  }
};
</script>

<style>
.section-selected {
  background: lightgray;
}
</style>