<template>
    <div>
        <v-toolbar dark flat dense color="grey darken-3">
            <v-spacer></v-spacer>
            <v-toolbar-title>
                Listing Clusters
            </v-toolbar-title>
        </v-toolbar>
        <v-toolbar dark flat>
            <v-toolbar-items>
                <v-autocomplete style="margin-left: 10px; margin-top: 8px; width: 300px" placeholder="Select Planogram"
                    @change="onPlanogramChange" dense :items="planograms" v-model="selectedPlanogram" hide-details>
                </v-autocomplete>
            </v-toolbar-items>
        </v-toolbar>

        <ag-grid-vue :gridOptions="gridOptions" style="width: 100%;  height: calc(100vh - 175px);"
            :defaultColDef="defaultColDef" class="ag-theme-balham" :columnDefs="headers" :rowData="rowData"
            :sideBar='true' :enableSorting="true" :enableFilter="true" :suppressRowClickSelection="true"
            :enableRangeSelection="true" rowSelection="multiple" :rowDeselection="true" :enableColResize="true"
            :floatingFilter="true" :groupMultiAutoColumn="true" :onGridReady="onGridReady">
        </ag-grid-vue>
        <DateRangeSelector ref="DateRangeSelector" />
    </div>
</template>
<script>
    import Axios from "axios"

    import DateRangeSelector from '@/components/Common/DateRangeSelector';
    import ListingClusterController from './controller.js';

    import {
        AgGridVue
    } from "ag-grid-vue";
    export default {
        components: {
            AgGridVue,
            DateRangeSelector
        },
        data() {
            return {
                rowData: [],
                planograms: [],
                selectedPlanogram: null,
                headers: [],
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

                }
            }
        },
        created() {
            this.getPlanograms()
        },
        methods: {
            onGridReady(params) {
                this.gridApi = params.api;
                this.columnApi = params.columnApi;
                this.gridApi.sizeColumnsToFit()
            },
            onPlanogramChange() {
                let self = this
                self.$nextTick(() => {

                    Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                    Axios.get(process.env.VUE_APP_API +
                            `ListingCluster?planogram_ID=${self.selectedPlanogram}&period_from_id=${53}&period_to_id=${58}`
                        )
                        .then(r => {
                            delete Axios.defaults.headers.common["TenantID"];

                            let lcData = ListingClusterController.GenerateClusterOutput({
                                storeSalesData: r.data,
                                topValue: 80
                            });

                            self.setHeaderDefaults();
                            // self.setStoreHeaders(lcData.storeSales);

                            self.rowData = lcData.totalStoreProductSales;

                            setTimeout(() => {
                                self.autoSizeAll();
                            }, 200);
                        })
                })
            },
            autoSizeAll() {
                let self = this;
                var allColumnIds = [];
                self.columnApi.getAllColumns().forEach(function (column) {
                    allColumnIds.push(column.colId);
                });
                self.columnApi.autoSizeColumns(allColumnIds);
            },
            setHeaderDefaults() {
                let self = this;

                self.headers = [{
                    headerName: 'Store Name',
                    field: 'storeName'
                }, {
                    headerName: 'Current Rank',
                    field: 'currentRank'
                }, {
                    headerName: 'Current Formula',
                    field: 'storeCode'
                }, {
                    headerName: '3 Level Cluster',
                    field: 'threeLevelCluster'
                }]
            },
            // setStoreHeaders(storeSales) {
            //     let self = this;

            //     storeSales.forEach(store => {
            //         self.headers.push({
            //             headerName: store.storeName,
            //             field: store.storeName,
            //             children: [{
            //                 headerName: "In Store",
            //                 field: store.storeName + '_inStore',
            //                 cellStyle: function (params) {
            //                     if (params.data[store.storeName + '_inStore']) {
            //                         return {
            //                             backgroundColor: "#5ef35e86"
            //                         };
            //                     } else {
            //                         return {
            //                             backgroundColor: "#ff9e9e91"
            //                         };
            //                     }
            //                 },
            //             }]
            //         })
            //     });
            // },
            getPlanograms() {
                let self = this
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + `Planogram/Distinct`)
                    .then(r => {
                        console.log(r);
                        self.planograms = []
                        r.data.planogramList.forEach(e => {
                            self.planograms.push({
                                text: e.displayname,
                                value: e.id
                            })
                        })
                        delete Axios.defaults.headers.common["TenantID"];
                    })
            }
        }
    }
</script>

<style scoped>

</style>