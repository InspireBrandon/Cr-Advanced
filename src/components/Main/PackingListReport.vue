<template>
    <div>
        <v-container fluid class="pa-0 ma-0" grid-list-md>
            <v-layout row wrap class="pa-0 ma-0">
                <v-flex md12 class="pa-0 ma-0">
                    <v-toolbar flat dense dark>
                        <v-toolbar-title>Packing List: {{ storeName }}</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-btn :disabled="rowData.length == 0" @click="completePackingList" color="primary">Complete</v-btn>
                        <v-btn :disabled="rowData.length == 0" @click="sendBack" color="error">Send Back</v-btn>
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
        <YesNoModal ref="yesNo"></YesNoModal>
    </div>
</template>

<script>
    import {
        AgGridVue
    } from "ag-grid-vue";

    import Axios from "axios";
    import YesNoModal from "@/components/Common/YesNoModal";

    export default {
        components: {
            AgGridVue,
            YesNoModal
        },
        created() {
            let self = this;
            self.gridOptions.context.componentParent = this;
            self.getStockMovementReport();
            self.getStore();
        },
        data() {
            return {
                storeName: "",
                columnDefs: [{
                        headerName: "Planogram",
                        field: "planogram"
                    },
                    {
                        headerName: "Category",
                        field: "category"
                    },
                    {
                        headerName: "Product System ID",
                        field: "product_System_ID"
                    },
                    {
                        headerName: "Barcode",
                        field: "barcode"
                    },
                    {
                        headerName: "Description",
                        field: "product"
                    },
                    {
                        headerName: "Store To",
                        field: "storeTo"
                    },
                    {
                        headerName: "Store To Code",
                        field: "storeToCode"
                    },
                    {
                        headerName: "Quantity to send",
                        field: "quantity"
                    }
                ],
                rowData: [],
                defaultColDef: {
                    onCellValueChanged: this.updateQuantityToSend
                },
                gridOptions: {
                    pinnedTopRowData: [],
                    pinnedBottomRowData: [],
                    context: {
                        componentParent: this
                    }
                },
                packingListStores: [],
                sendableStoreID: null,
                recievableStoreID: null
            };
        },
        methods: {
            onGridReady(params) {
                let self = this;
                self.gridApi = params.api;
                self.columnApi = params.columnApi;
            },
            getStockMovementReport(callback) {
                let self = this;
                let storeID = self.$route.params.storeID;

                Axios.defaults.headers.common["TenantID"] =
                    sessionStorage.currentDatabase;

                Axios.get(
                    process.env.VUE_APP_API + `StockMovementReport?storeID=${storeID}`
                ).then(r => {
                    self.rowData = r.data;
                    self.fitColumns();
                });
            },
            fitColumns() {
                let self = this;

                var allColumnIds = [];

                self.columnApi.getAllColumns().forEach(function (column) {
                    allColumnIds.push(column.colId);
                });

                self.columnApi.autoSizeColumns(allColumnIds);
            },
            getStore() {
                let self = this;
                let storeID = self.$route.params.storeID;

                Axios.defaults.headers.common["TenantID"] =
                    sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + `Retailer/Store?id=${storeID}`).then(
                    r => {
                        self.storeName = r.data.displayname;
                    }
                );
            },
            completePackingList() {
                let self = this;

                self.$refs.yesNo.show(
                    "Confirm that items have been sent?",
                    goThrough => {
                        if (goThrough) {
                            let transactionIds = [];

                            self.gridOptions.api.forEachNodeAfterFilter((node, idx) => {
                                transactionIds.push(node.data.id);
                            });

                            Axios.defaults.headers.common["TenantID"] =
                                sessionStorage.currentDatabase;

                            Axios.post(
                                process.env.VUE_APP_API + `PackingList/CompletePacking`,
                                transactionIds
                            ).then(r => {
                                self.getStockMovementReport();
                            });
                        }
                    }
                );
            },
            sendBack() {
                let self = this;

                self.$refs.yesNo.show(
                    "Remove these items from the packing list?",
                    goThrough => {
                        if (goThrough) {
                            let transactionIds = [];

                            self.gridOptions.api.forEachNodeAfterFilter((node, idx) => {
                                transactionIds.push(node.data.id);
                            });

                            Axios.defaults.headers.common["TenantID"] =
                                sessionStorage.currentDatabase;

                            Axios.post(
                                process.env.VUE_APP_API + `PackingList/SendBack`,
                                transactionIds
                            ).then(r => {
                                self.getStockMovementReport();
                            });
                        }
                    }
                );
            }
        }
    };
</script>