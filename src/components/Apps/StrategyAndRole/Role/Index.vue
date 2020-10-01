<template>
    <div>
        <!-- <ag-grid-vue id="ag-Grid" :gridOptions="gridOptions" style="width: 100%;  height: calc(100vh - 110px);"
            :defaultColDef="defaultColDef" class="ag-theme-balham" :columnDefs="columnDefs" :rowData="rowData"
            :sortable="true" :filter="true" :suppressRowClickSelection="true" :enableColResize="true"
            :enableRangeSelection="true" rowSelection="multiple" :rowDeselection="true" :resizable="true"
            :floatingFilter="true" :groupMultiAutoColumn="true" :onGridReady="onGridReady" :enableFilter="true">
        </ag-grid-vue> -->
        <Housebrand />
    </div>
</template>

<script>
    import {
        AgGridVue
    } from "ag-grid-vue";

    import Housebrand from './HouseBrand/index.vue';

    import Axios from 'axios';

    export default {
        components: {
            AgGridVue,
            Housebrand
        },
        data() {
            return {
                columnDefs: [{
                        headerName: "Department",
                        field: "department",
                        sortable: true,
                    },
                    {
                        headerName: "Planogram",
                        field: "planogram",
                        sortable: true,
                    },
                    {
                        headerName: "Volume",
                        field: "sales_Units",
                        sortable: true,
                        cellStyle: {
                            'text-align': "right"
                        }
                    },
                    {
                        headerName: "Sales",
                        field: "sales_Retail",
                        sortable: true,
                        cellStyle: {
                            'text-align': "right"
                        }
                    },
                    {
                        headerName: "Profit",
                        field: "sales_Profit",
                        sortable: true,
                        cellStyle: {
                            'text-align': "right"
                        }
                    },
                    {
                        headerName: "Margin",
                        field: "margin",
                        sortable: true,
                        cellStyle: {
                            'text-align': "right"
                        }
                    },
                    {
                        headerName: "Price",
                        field: "margin",
                        sortable: true,
                        cellStyle: {
                            'text-align': "right"
                        }
                    },
                    {
                        headerName: "Index",
                        children: [{
                                headerName: "Housebrand",
                                field: "housebrand",
                            },
                            {
                                headerName: "Promo",
                                field: "housebrand",
                            },
                            {
                                headerName: "Seasonal",
                                field: "housebrand",
                            },
                            {
                                headerName: "Price Sensitivity",
                                field: "housebrand",
                            },
                            {
                                headerName: "KVI",
                                field: "housebrand",
                            },
                            {
                                headerName: "Impulse",
                                field: "housebrand",
                            }
                        ]
                    },
                    {
                        headerName: "System Role",
                        field: ""
                    },
                    {
                        headerName: "User Role",
                        field: "user_Role"
                    },
                ],
                rowData: [],
                defaultColDef: {
                    onCellValueChanged: this.updatePlanogramRole
                },
                gridOptions: {
                    rowHeight: 35,
                    pinnedTopRowData: [],
                    pinnedBottomRowData: [],
                    context: {
                        componentParent: this
                    }
                }
            };
        },
        mounted() {
            let self = this;
            self.getCategoryRole();
        },
        methods: {
            onGridReady(params) {
                let self = this;
                self.gridApi = params.api;
                self.columnApi = params.columnApi;
            },
            getCategoryRole() {
                let self = this;

                Axios.get(process.env.VUE_APP_API + "Strategy/CategoryRole")
                    .then(r => {
                        self.rowData = r.data;
                        self.gridApi.sizeColumnsToFit();
                    })
                    .catch(e => {

                    })
            },
            fitColumns() {
                let self = this;

                var allColumnIds = [];

                self.columnApi.getAllColumns().forEach(function (column) {
                    allColumnIds.push(column.colId);
                });

                self.columnApi.autoSizeColumns(allColumnIds);
            },
        }
    }
</script>