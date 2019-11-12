<template>
    <div>
        <v-toolbar dark>
            <v-toolbar-title>
                Store
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <div v-if="selectedBasket != null">{{ generateName() }}</div>
            <v-spacer></v-spacer>

        </v-toolbar>
        <ag-grid-vue :gridOptions="gridOptions" style="width: 100%;  height: calc(100vh - 172px);"
            :defaultColDef="defaultColDef" class="ag-theme-balham" :columnDefs="headers" :rowData="rowData"
            :sideBar='true' :enableSorting="true" :enableFilter="true" :suppressRowClickSelection="true"
            :enableRangeSelection="true" rowSelection="multiple" :rowDeselection="true" :enableColResize="true"
            :floatingFilter="true" :groupMultiAutoColumn="true" :onGridReady="onGridReady">
        </ag-grid-vue>
        <v-toolbar dark flat dense>
            Rows: {{rowData.length}}
        </v-toolbar>
    </div>
</template>
<script>
    import progressRenderer from "./progressRenderer";
    import {
        AgGridVue
    } from "ag-grid-vue";
    export default {
        components: {
            AgGridVue,
            progressRenderer
        },
        // props: ["rowData"],
        data() {
            return {
                rowData:[],
                gridOptions: {
                    autoGroupColumnDef: {
                        headerName: 'Product Name', //custom header name for group
                        pinned: 'left', //force pinned left. Does not work in columnDef
                        cellRendererParams: {
                            suppressCount: true, //remove number in Group Column
                        }
                    },
                    pinnedTopRowData: [],
                    pinnedBottomRowData: [],
                    context: {
                        componentParent: this
                    },
                },
                defaultColDef: {

                },
                headers: [{
                    headerName: 'Store Name',
                    field: 'storeName'
                }, {
                    headerName: 'Formula 1',
                    field: 'level1Code',
                    hide: true
                }, {
                    headerName: 'Formula 2',
                    field: 'level2Code',
                    hide: true
                }, {
                    headerName: 'Formula 3',
                    field: 'level3Code',
                    hide: true
                }, {
                    headerName: 'Current Rank',
                    field: 'currentRank'
                }, {
                    headerName: 'Cluster',
                    field: 'cluster'
                }]
            }
        },
        methods: {
            autoSize() {
                let self = this;
                var allColumnIds = [];
                self.columnApi.getAllColumns().forEach(function (column) {
                    allColumnIds.push(column.colId);
                });
                self.columnApi.autoSizeColumns(allColumnIds);
            },
            autoSizeAll() {
                let self = this;
                var allColumnIds = [];
                self.columnApi.getAllColumns().forEach(function (column) {
                    allColumnIds.push(column.colId);
                });
                self.columnApi.autoSizeColumns(allColumnIds);
            },
            onGridReady(params) {
                this.gridApi = params.api;
                this.columnApi = params.columnApi;
                this.gridApi.sizeColumnsToFit()
            },
        },
    }
</script>