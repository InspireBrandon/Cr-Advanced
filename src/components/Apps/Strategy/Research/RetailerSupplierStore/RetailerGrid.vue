<template>
  <div>
    <ag-grid-vue
      id="ag-Grid"
      :gridOptions="gridOptions"
      style="width: 100%;  height: calc(100vh - 300px);"
      :defaultColDef="defaultColDef"
      class="ag-theme-balham"
      :columnDefs="columnDefs"
      :rowData="rowData"
      :sortable="true"
      :filter="true"
      :suppressRowClickSelection="true"
      :enableRangeSelection="true"
      rowSelection="multiple"
      :rowDeselection="true"
      :resizable="true"
      :floatingFilter="true"
      :groupMultiAutoColumn="true"
      :onGridReady="onGridReady"
    ></ag-grid-vue>
  </div>
</template>

<script>
import Axios from "axios";
import { AgGridVue } from "ag-grid-vue";
import Button from "./button.vue";

export default {
  props: ["rowData"],
  components: {
    AgGridVue,
    Button
  },
  data() {
    return {
      gridOptions: {
        rowHeight: 35,
        context: {
          componentParent: this
        },
        afterFilterChanged: () =>
          console.log("gridOptions.api.inMemoryRowController.rowsAfterFilter")
      },
      defaultColDef: {}
    };
  },
  beforeMount() {
    let self = this;
    self.columnDefs = require("./Headers.json");
  },
  methods: {
    onGridReady(params) {
      let self = this;
      self.gridApi = params.api;
      self.columnApi = params.columnApi;
    }
  }
};
</script>