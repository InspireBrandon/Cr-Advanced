<template>
    <div>
        <ag-grid-vue :gridOptions="gridOptions" style="width: 100%;  height: calc(100vh - 160px);"
            :defaultColDef="defaultColDef" class="ag-theme-balham" :columnDefs="headers" :rowData="rowData"
            :sideBar='true' :enableSorting="true" :enableFilter="true" :suppressRowClickSelection="true"
            :enableRangeSelection="true" rowSelection="multiple" :rowDeselection="true" :enableColResize="true"
            :floatingFilter="true" :groupMultiAutoColumn="true" :onGridReady="onGridReady">
        </ag-grid-vue>
        <!-- <v-toolbar dark flat dense>
            Rows: {{rowData.length}}
        </v-toolbar> -->
    </div>
</template>
<script>
    import {
        AgGridVue
    } from "ag-grid-vue";

    export default {
        components: {
            AgGridVue
        },
        props: ["rowData"],
        data() {
            return {
                headers: [{
                        headerName: 'Project Group',
                        field: 'projectGroup'
                    },
                    {
                        headerName: 'Project',
                        field: 'project'
                    },
                    {
                        headerName: 'Planogram',
                        field: 'spacePlan'
                    },
                    {
                        headerName: 'Product System ID',
                        field: 'product_System_ID'
                    },
                    {
                        headerName: 'Barcode',
                        field: 'barcode'
                    },
                    {
                        headerName: 'Description',
                        field: 'description'
                    },
                    {
                        headerName: "Facings",
                        children: [{
                                headerName: "X",
                                field: "facings_X",
                            },
                            {
                                headerName: "Y",
                                field: "facings_Y",
                            },
                            {
                                headerName: "Z",
                                field: "facings_Z",
                            }
                        ]
                    },
                    {
                        headerName: "Actual Sales",
                        children: [{
                                headerName: "Sales",
                                field: "weekly_Sales",
                            },
                            {
                                headerName: "Units",
                                field: "weekly_Units",
                            },
                            {
                                headerName: "Profit",
                                field: "weekly_Profit",
                            },
                            {
                                headerName: "Days Of Supply",
                                field: "dos",
                            }
                        ]
                    },
                    {
                        headerName: "Potential Sales",
                        children: [{
                                headerName: "Sales",
                                field: "weekly_Sales_Potential",
                            },
                            {
                                headerName: "Units",
                                field: "weekly_Units_Potential",
                            },
                            {
                                headerName: "Profit",
                                field: "weekly_Profit_Potential",
                            },
                            {
                                headerName: "Days Of Supply",
                                field: "doS_Potential",
                            }
                        ]
                    },
                ],
                gridOptions: {
                    context: {
                        componentParent: this
                    },
                },
                defaultColDef: {

                },
            }
        },
        mounted() {
            //  this.setHeaders(this.stores)
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
                // this.gridApi.sizeColumnsToFit()
            },
        },
    }
</script>