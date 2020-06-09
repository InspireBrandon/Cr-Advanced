<template>
    <div>
        <v-container fluid class="pa-0 ma-0" grid-list-md>
            <v-layout row wrap class="pa-0 ma-0">
                <v-flex md12 class="pa-0 ma-0">
                    <v-toolbar flat dense dark>
                        <v-toolbar-title>Stock Movement</v-toolbar-title>
                    </v-toolbar>
                    <v-toolbar flat dense dark color="grey darken-3">
                        <v-toolbar-items>
                            <!-- <v-menu offset-y>
                                <v-btn slot="activator" flat>File</v-btn>
                                <v-list dense>
                                    <v-list-tile @click="resetRange">
                                        <v-list-tile-title>Reset</v-list-tile-title>
                                    </v-list-tile>
                                </v-list>
                            </v-menu>
                            <v-menu offset-y>
                                <v-btn slot="activator" flat>Setup</v-btn>
                                <v-list dense>
                                    <v-list-tile @click="editCluster">
                                        <v-list-tile-title>Cluster</v-list-tile-title>
                                    </v-list-tile>
                                </v-list>
                            </v-menu>
                            <v-select style="margin-left: 20px; margin-top: -5px; width: 300px"
                                placeholder="Select cluster type" @change="getReport" dense :items="temporaryClusters"
              v-model="selectedTemp" hide-details></v-select>-->
                        </v-toolbar-items>
                    </v-toolbar>
                    <ag-grid-vue id="ag-Grid" :gridOptions="gridOptions"
                        style="width: 100%;  height: calc(100vh - 160px);" :defaultColDef="defaultColDef"
                        class="ag-theme-balham" :columnDefs="columnDefs" :rowData="rowData" :sortable="true"
                        :filter="true" :suppressRowClickSelection="true" :enableColResize="true" :enableSorting="true"
                        :enableFilter="true" :enableRangeSelection="true" rowSelection="multiple" :rowDeselection="true"
                        :resizable="true" :floatingFilter="true" :groupMultiAutoColumn="true"
                        :onGridReady="onGridReady"></ag-grid-vue>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
    import {
        AgGridVue
    } from "ag-grid-vue";

    import Options from './Options.vue'

    import Axios from 'axios'

    export default {
        components: {
            AgGridVue,
            Options
        },
        created() {
            let self = this;
            self.gridOptions.context.componentParent = this;
            self.getStockMovement();
        },
        data() {
            return {
                columnDefs: [{
                        headerName: "Planogram",
                        field: "planogram"
                    },
                    {
                        headerName: "Category",
                        field: "category"
                    },
                    {
                        headerName: "Store",
                        field: "store"
                    },
                    {
                        headerName: "Store Code",
                        field: "store_Code"
                    },
                    {
                        headerName: "Product System ID",
                        field: "product_System_ID"
                    },
                    {
                        headerName: "TYP",
                        field: "typ"
                    },
                    {
                        headerName: "LS",
                        field: "ls"
                    },
                    {
                        headerName: "Min",
                        field: "min"
                    },
                    {
                        headerName: "Max",
                        field: "max"
                    },
                    {
                        headerName: "Seasonal Min",
                        field: "seasonal_Min"
                    },
                    {
                        headerName: "Seasonal Max",
                        field: "seasonal_Max"
                    },
                    {
                        headerName: "Current Overstock",
                        field: "current_Overstock_Display",
                        valueFormatter(params) {
                            return params.value < 1 ? 0 : params.value.toFixed(0);
                        },
                    },
                    {
                        headerName: "Stock Receivable",
                        field: "stock_Attainable_Display",
                        valueFormatter(params) {
                            return params.value < 1 ? 0 : params.value.toFixed(0);
                        },
                    },
                    {
                        headerName: '',
                        field: 'id',
                        cellRendererFramework: 'Options'
                    }
                ],
                rowData: [],
                defaultColDef: {
                    onCellValueChanged: this.UpdateStoreCluster
                },
                gridOptions: {
                    pinnedTopRowData: [],
                    pinnedBottomRowData: [],
                    context: {
                        componentParent: this
                    }
                }
            };
        },
        methods: {
            onGridReady(params) {
                let self = this;
                self.gridApi = params.api;
                self.columnApi = params.columnApi;
            },
            getStockMovement() {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + `StockMovement`)
                    .then(r => {
                        self.rowData = r.data;
                        delete Axios.defaults.headers.common["TenantID"];
                        self.fitColumns();
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
    };
</script>