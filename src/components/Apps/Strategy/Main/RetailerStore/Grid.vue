<template>
    <div>
        <ag-grid-vue :gridOptions="gridOptions" style="width: 100%;  height: 600px;"
            :defaultColDef="defaultColDef" class="ag-theme-balham" :columnDefs="columnDefs" :rowData="rowData"
            :sideBar='false' :enableSorting="true" :enableFilter="true" :suppressRowClickSelection="true"
            :enableRangeSelection="true" rowSelection="multiple" :rowDeselection="true" :enableColResize="true"
            :floatingFilter="true" :groupMultiAutoColumn="true" :onGridReady="onGridReady">
        </ag-grid-vue>
    </div>
</template>

<script>
    import {
        AgGridVue
    } from "ag-grid-vue";

    export default {
        props: ["rowData", "updateRetailerStore"],
        components: {
            AgGridVue
        },
        data() {
            return {
                columnDefs: [{
                    "headerName": "Store Name",
                    "field": "name",
                    "editable": true
                },{
                    "headerName": "X Coordinate",
                    "field": "xCoordinate",
                    "editable": true
                },{
                    "headerName": "Y Coordinate",
                    "field": "yCoordinate",
                    "editable": true
                }],
                gridOptions: {
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