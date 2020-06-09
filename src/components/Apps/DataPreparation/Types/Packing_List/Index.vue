<template>
    <div>
        <v-container fluid class="pa-0 ma-0" grid-list-md>
            <v-layout row wrap class="pa-0 ma-0">
                <v-flex md12 class="pa-0 ma-0">
                    <v-toolbar flat dense dark>
                        <v-toolbar-title>Packing List</v-toolbar-title>
                    </v-toolbar>
                    <v-toolbar flat dark color="grey darken-3">
                        <div style="width: 220px" class="mt-3">
                            <v-autocomplete @change="onOptionChange" v-model="sendableStoreID" dense
                                :items="packingListStores" item-value="id" item-text="store" label="Store From:">
                            </v-autocomplete>
                        </div>
                        <div style="width: 220px" class="ml-2 mt-3">
                            <v-autocomplete @change="onOptionChange" v-model="recievableStoreID" dense
                                :items="packingListStores" item-value="id" item-text="store" label="Store To:">
                            </v-autocomplete>
                        </div>
                        <v-spacer></v-spacer>
                        <div class="summations">
                            <div>Total overstock: 0</div>
                            <div>Total recievable: 0</div>
                            <div>Total sent: 0</div>
                        </div>
                        <v-btn color="primary" @click="fillPackingList">Fill packing list</v-btn>
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
            self.getPackingListStores();
        },
        data() {
            return {
                columnDefs: [{
                        headerName: "Product System ID",
                        field: "product_System_ID"
                    },
                    {
                        headerName: "Current Overstock",
                        field: "current_Overstock_Display",
                    },
                    {
                        headerName: "Stock Receivable",
                        field: "stock_Attainable_Display",
                    },
                    {
                        headerName: "Quantity to send",
                        field: "quantity",
                        editable: true
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
        computed: {
            storesTo() {
                let self = this
            }
        },
        methods: {
            onGridReady(params) {
                let self = this;
                self.gridApi = params.api;
                self.columnApi = params.columnApi;
            },
            getSendable(callback) {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + `PackingList/Sendable?storeID=${self.sendableStoreID}`)
                    .then(r => {
                        callback(r.data)
                    })
            },
            getRecievable(callback) {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + `PackingList/Recievable?storeID=${self.recievableStoreID}`)
                    .then(r => {
                        callback(r.data)
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
            getPackingListStores() {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + `PackingListStores`)
                    .then(r => {
                        self.packingListStores = r.data;
                        delete Axios.defaults.headers.common["TenantID"];
                    })
            },
            onOptionChange() {
                let self = this;

                self.$nextTick(() => {
                    if (self.sendableStoreID != null && self.recievableStoreID != null) {
                        self.rowData = [];

                        self.getRecievable(recievable => {
                            self.getSendable(sendable => {
                                self.setRowData(recievable, sendable);
                            })
                        })
                    }
                })
            },
            setRowData(recievable, sendable) {
                let self = this;

                recievable.forEach(ri => {
                    let canAdd = false;

                    sendable.forEach(si => {
                        if (ri.product_ID == si.product_ID) {
                            self.rowData.push({
                                storeTo: self.recievableStoreID,
                                storeFrom: self.sendableStoreID,
                                product_System_ID: si.product_System_ID,
                                productID: si.product_ID,
                                current_Overstock_Display: si.current_Overstock_Display.toFixed(
                                    0),
                                stock_Attainable_Display: ri.stock_Attainable_Display.toFixed(
                                    0),
                                quantity: 0
                            })
                        }
                    })
                })
            },
            updateQuantityToSend(params) {
                let self = this;

                if (params.oldValue != params.newValue) {
                    let qty = parseInt(params.newValue);
                    let sendable = parseInt(params.data.current_Overstock_Display);
                    let recievable = parseInt(params.data.stock_Attainable_Display);

                    params.data.current_Overstock_Display = sendable - qty;
                    params.data.stock_Attainable_Display = recievable - qty;

                    self.updatePackingListRecord(params.data, () => {
                        self.onOptionChange();
                    });
                }
            },
            updatePackingListRecord(request, callback) {
                let self = this;

                Axios.post(process.env.VUE_APP_API +
                        `StockMovementTX?sendable=${request.current_Overstock_Display}&recievable=${request.stock_Attainable_Display}`,
                        request)
                    .then(r => {
                        callback();
                    })
                    .catch(e => {
                        alert("Failed to update record");
                    })
            },
            fillPackingList() {
                let self = this;

                let totalToComplete = self.rowData.length;
                let completed = 0;

                self.rowData.forEach(el => {
                    let qty = parseInt(el.quantity);
                    let sendable = parseInt(el.current_Overstock_Display);
                    let recievable = parseInt(el.stock_Attainable_Display);

                    let totalToReduce = 0;

                    if(sendable > recievable) {
                        totalToReduce = recievable;
                    } else {
                        totalToReduce = sendable;
                    }

                    el.current_Overstock_Display = sendable - totalToReduce;
                    el.stock_Attainable_Display = recievable - totalToReduce;
                    el.quantity = totalToReduce;

                    self.updatePackingListRecord(el, () => {
                        completed++;

                        if(completed == totalToComplete) {
                            self.onOptionChange();
                        }
                    })
                });
            }
        }
    };
</script>

<style>
    .summations {
        width: 200px;
        font-size: 12px;
    }
</style>