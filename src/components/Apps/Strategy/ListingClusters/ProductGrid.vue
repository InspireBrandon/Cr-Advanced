<template>
    <div>
        <ag-grid-vue :gridOptions="gridOptions" style="width: 100%;  height: calc(100vh - 223px);"
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
        components: {
            AgGridVue,
            progressRenderer
        },
        props: ["rowData", "stores", "autosize"],
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
                headers: []
            }
        },
        mounted() {
            this.setHeaders(this.stores)
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
                // let self = this;
                // var allColumnIds = [];
                // self.columnApi.getAllColumns().forEach(function (column) {
                //     allColumnIds.push(column.colId);
                // });
                // self.columnApi.autoSizeColumns(allColumnIds);
            },
            onGridReady(params) {
                this.gridApi = params.api;
                this.columnApi = params.columnApi;
            },
            setHeaders(stores) {
                let self = this;

                let tmp = [{
                    headerName: 'Product Name',
                    field: 'productName'
                }, {
                    headerName: 'Cumulative Sales',
                    cellRendererFramework: "progressRenderer"
                }, {
                    headerName: "Sales (12 Month Average)",
                    field: "totalProductSales",

                }, {
                    headerName: "Cumulative Sales",
                    field: "cumulativProductSales",
                    cellStyle: function (params) {
                        if (params.data.canHighlight) {
                            if (params.data.highlightLevel == 1) {
                                return {
                                    backgroundColor: "#9c9c9c"
                                };
                            }

                            if (params.data.highlightLevel == 2) {
                                return {
                                    backgroundColor: "#b9b9b9"
                                };
                            }

                            if (params.data.highlightLevel == 3) {
                                return {
                                    backgroundColor: "#e0e0e0"
                                };
                            }
                        }
                    }
                }]
                self.stores.forEach(store => {
                    tmp.push({
                        headerName: store.storeName,
                        children: [{
                            headerName: "In Store",
                            field: store.storeName + "_inStore",
                            cellStyle: function (params) {
                                if (params.data.canHighlight) {
                                    if (params.data[store.storeName + "_inStore"]) {
                                        return {
                                            backgroundColor: "#5ef35e86"
                                        };
                                    }

                                    if (!params.data[store.storeName + "_inStore"]) {
                                        return {
                                            backgroundColor: "#ff9e9e91"
                                        };
                                    }
                                }
                            }
                        }]
                    })
                })

                self.headers = tmp;
            }
        },
    }
</script>