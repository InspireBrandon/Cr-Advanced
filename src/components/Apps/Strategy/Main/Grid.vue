<template>
    <div>
        <div>
            <div style="width: 100%;  height: calc(100vh - 272px); text-align: center; font-size: 20px; padding-top: 10%;"
                v-show="!showGrid">
                <div>Please <a href="#" @click.prevent="selectFile">select</a> or <a href="#"
                        @click.prevent="createFile">create</a> a file to continue</div>
            </div>
            <ag-grid-vue v-show="showGrid" :gridOptions="gridOptions" style="width: 100%;  height: calc(100vh - 272px);"
                :defaultColDef="defaultColDef" class="ag-theme-balham" :columnDefs="headers" :rowData="rowData"
                :sideBar='true' :enableSorting="true" :enableFilter="true" :suppressRowClickSelection="true"
                :enableRangeSelection="true" rowSelection="multiple" :rowDeselection="true" :enableColResize="true"
                :floatingFilter="true" :groupMultiAutoColumn="true" :onGridReady="onGridReady">
            </ag-grid-vue>
        </div>
        <v-toolbar dark flat dense>
            Rows: {{rowData.length}}
        </v-toolbar>
    </div>
</template>
<script>
    import {
        AgGridVue
    } from "ag-grid-vue";

    import ProgressRenderer from './ProgressRenderer'

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    })

    import Axios from 'axios';

    export default {
        props: ['rowData', 'headers', 'selectFile', 'createFile', 'showGrid'],
        components: {
            AgGridVue,
            ProgressRenderer
        },
        data() {
            let self = this;

            return {
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
                    onCellValueChanged: this.UpdateStoreCluster
                }
            }
        },
        created() {
            let self = this;
        },
        methods: {
            UpdateStoreCluster(params) {
                let self = this
                let item = params.data;
                let node = params.node;
                switch (params.colDef.field) {
                    case "customCluster": {
                        Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                        Axios.post(process.env.VUE_APP_API +
                                `Store/UpdateCustomCluster?planogram_ID=${self.selectedCategory}&cluster_Name=${item.customCluster}&store_ID=${item.store_ID}`
                            )
                            .then(r => {
                                console.log("[FIELD UPDATED]");
                                delete Axios.defaults.headers.common["TenantID"];
                            })
                    }
                    break;
                case "storeCluster": {
                    Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                    Axios.post(process.env.VUE_APP_API +
                            `Store/UpdateStoreCluster?cluster_Name=${item.storeCluster}&store_ID=${item.store_ID}`)
                        .then(r => {
                            console.log("[FIELD UPDATED]");

                            delete Axios.defaults.headers.common["TenantID"];
                        })
                    break;
                }

                }

            },
            onGridReady(params) {
                let self = this;
                self.gridApi = params.api;
                self.columnApi = params.columnApi;
            },
            setOrder() {
                let self = this;

                var defaultSortModel = [{
                        colId: "userDefinedCluster",
                        sort: "asc"
                    },
                    {
                        colId: "basket_Premium Basket",
                        sort: "asc"
                    },
                    {
                        colId: "totalSales",
                        sort: "desc"
                    }
                ];

                self.gridApi.setSortModel(defaultSortModel);
            },
            getState() {
                let self = this;
                return self.columnApi.getColumnState();
            }
        }
    }
</script>