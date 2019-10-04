<template>
    <div>
        <ag-grid-vue :gridOptions="gridOptions" style="width: 100%;  height: 552px;" :defaultColDef="defaultColDef"
            class="ag-theme-balham" :columnDefs="columnDefs" :rowData="rowData" :sideBar='false' :enableSorting="true"
            :enableFilter="true" :suppressRowClickSelection="true" :enableRangeSelection="true" rowSelection="multiple"
            :rowDeselection="true" :enableColResize="true" :floatingFilter="true" :groupMultiAutoColumn="true"
            :onGridReady="onGridReady">
        </ag-grid-vue>
        <v-toolbar dark flat dense>
            Rows: {{rowData.length}}
        </v-toolbar>
    </div>
</template>

<script>
    import {
        AgGridVue
    } from "ag-grid-vue";

    import Actions from './GridComponents/Actions'

    export default {
        props: ["rowData", "updateRetailerStore", "deleteRetailerStore"],
        components: {
            AgGridVue,
            Actions
        },
        data() {
            return {
                columnDefs: [{
                    "headerName": "Store Name",
                    "field": "name",
                    "editable": true
                }, {
                    "headerName": "X Coordinate",
                    "field": "xCoordinate",
                    "editable": true
                }, {
                    "headerName": "Y Coordinate",
                    "field": "yCoordinate",
                    "editable": true
                }, {
                    "headerName": "Actions",
                    "cellRendererFramework": "Actions"
                }],
                gridOptions: {
                    rowHeight: 35,
                    pinnedTopRowData: [],
                    pinnedBottomRowData: [],
                    context: {
                        componentParent: this
                    },
                    afterFilterChanged: () => console.log("gridOptions.api.inMemoryRowController.rowsAfterFilter"),
                },
                defaultColDef: {
                    onCellValueChanged: this.updateRetailerStore
                }
            }
        },
        methods: {
            onGridReady(params) {
                let self = this;
                self.gridApi = params.api;
                self.columnApi = params.columnApi;
            }
        }
    }
</script>