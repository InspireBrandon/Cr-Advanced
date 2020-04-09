<template>
    <div>
        <v-toolbar dark flat>
            <v-toolbar-title>Retail Chain</v-toolbar-title>
        </v-toolbar>
        <div>
            <ag-grid-vue :gridOptions="gridOptions" style="width: 100%;  height: calc(100vh - 130px);"
                :defaultColDef="defaultColDef" class="ag-theme-balham" :columnDefs="headers" :rowData="rowData"
                :enableSorting="true" :enableFilter="true" :suppressRowClickSelection="true"
                :enableRangeSelection="true" rowSelection="multiple" :rowDeselection="true" :enableColResize="true"
                :floatingFilter="true" :groupMultiAutoColumn="true" :onGridReady="onGridReady">
            </ag-grid-vue>
        </div>
    </div>
</template>

<script>
    import SimpleList from '@/components/Apps/DataPreparation/Common/SimpleList.vue'
    import Axios from 'axios'
    import {
        AgGridVue
    } from "ag-grid-vue";

    export default {
        components: {
            AgGridVue
        },
        data() {
            return {
                rowData: [],
                headers: [{
                    "headerName": "Store Name",
                    "field": "storeName"
                }, {
                    "headerName": "Retail Chain",
                    "field": "retailChain",
                    "editable": true
                }],
                gridOptions: {
                    pinnedTopRowData: [],
                    pinnedBottomRowData: [],
                    context: {
                        componentParent: this
                    },
                },
                defaultColDef: {
                    onCellValueChanged: this.UpdateLine
                }
            }
        },
        created() {
            this.gridOptions.context.componentParent = this;
            this.getData();
        },
        methods: {
            onGridReady(params) {
                let self = this;
                self.gridApi = params.api;
                self.columnApi = params.columnApi;
            },
            getData() {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + "Retailer/Retail_Chain/Advanced")
                    .then(r => {
                        self.rowData = r.data;
                    })
            },
            UpdateLine(params) {
                let self = this

                if (params.newValue != params.oldValue) {
                    let item = params.data;
                    let node = params.node;

                    let request = {
                        retailChain: params.newValue,
                        storeID: item.store_ID
                    }

                    Axios.post(process.env.VUE_APP_API + `Retailer/Retail_Chain/Advanced`, request)
                        .then(r => {
                            console.log(r.data);
                        })
                }
            },
        }
    }
</script>