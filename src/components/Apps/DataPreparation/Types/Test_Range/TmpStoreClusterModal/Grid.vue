<template>
    <div>
        <ag-grid-vue id="ag-Grid" :gridOptions="gridOptions" style="width: 100%;  height: calc(70vh);"
            :defaultColDef="defaultColDef" class="ag-theme-balham" :columnDefs="columnDefs" :rowData="rowData"
            :sortable="true" :filter="true" :suppressRowClickSelection="true" :enableRangeSelection="true"
            rowSelection="multiple" :rowDeselection="true" :resizable="true" :floatingFilter="true"
            :groupMultiAutoColumn="true" :onGridReady="onGridReady">
        </ag-grid-vue>
    </div>
</template>

<script>
    import Axios from 'axios';

    import {
        AgGridVue
    } from "ag-grid-vue";

    export default {
        components: {
            AgGridVue
        },
        data() {
            return {
                selectedCategory: null,
                filterText: '',
                clusterLinkDetails: '',
                items: [],
                Category_Link: [],
                pageNumber: 0,
                allowedRecords: 25,
                store_Cluster: [],
                columnDefs: [{
                    "headerName": "Store Name",
                    "field": "storeName"
                }, {
                    "headerName": "Store Cluster",
                    "field": "storeCluster"
                }, {
                    "headerName": "Temporary Cluster",
                    "field": "temporaryCluster",
                    "editable": true
                }],
                rowData: [],
                defaultColDef: {
                    onCellValueChanged: this.UpdateTemporaryCluster
                },
                gridOptions: {
                    pinnedTopRowData: [],
                    pinnedBottomRowData: [],
                    context: {
                        componentParent: this
                    },
                    rowClassRules: {
                        'disabled-line': 'data.can_edit'
                    }
                },
            }
        },
        methods: {
            onGridReady(params) {
                let self = this;
                self.gridApi = params.api;
                self.columnApi = params.columnApi;
            },
            UpdateTemporaryCluster(params) {
                let self = this

                if (params.newValue != params.oldValue) {
                    let item = params.data;
                    let node = params.node;

                    Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                    Axios.post(process.env.VUE_APP_API +
                            `Clusters/StoreTemporaryCluster?storeID=${item.storeID}&cluster=${item.temporaryCluster}`)
                        .then(r => {
                        })
                        .catch(e => {
                            alert("Failed to update");
                        })
                }
            },
            getSelectedStores() {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + "Clusters/StoreTemporaryCluster")
                    .then(r => {
                        self.rowData = r.data.sort((a, b) => (a.storeName > b.storeName) ? 1 : -1);
                    })
                    .catch(e => {
                        alert("Failed to get stores");
                    })
            },
        }
    }
</script>