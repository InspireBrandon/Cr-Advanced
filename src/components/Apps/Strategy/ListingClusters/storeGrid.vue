<template>
    <div>
        <ag-grid-vue :gridOptions="gridOptions" style="width: 100%;  height: calc(100vh - 175px);"
            :defaultColDef="defaultColDef" class="ag-theme-balham" :columnDefs="headers" :rowData="rowData"
            :sideBar='true' :enableSorting="true" :enableFilter="true" :suppressRowClickSelection="true"
            :enableRangeSelection="true" rowSelection="multiple" :rowDeselection="true" :enableColResize="true"
            :floatingFilter="true" :groupMultiAutoColumn="true" :onGridReady="onGridReady">
        </ag-grid-vue>
    </div>
</template>
<script>
    import progressRenderer from "./progressRenderer";
    import {
        AgGridVue
    } from "ag-grid-vue";
    export default {
        components:{
            AgGridVue,
            progressRenderer
        },
        props: ["rowData"],
        data() {
            return {
                gridOptions: {
                    autoGroupColumnDef: {
                        headerName: 'Product Name', //custom header name for group
                        pinned: 'left', //force pinned left. Does not work in columnDef
                        cellRendererParams: {
                            suppressCount: true, //remove number in Group Column
                        }
                    },
                    rowHeight: 35,
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
                    headerName: 'Current Rank',
                    field: 'currentRank'
                }, {
                    headerName: 'Cluster',
                    field: 'cluster'
                }]
            }
        },
        methods: {
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