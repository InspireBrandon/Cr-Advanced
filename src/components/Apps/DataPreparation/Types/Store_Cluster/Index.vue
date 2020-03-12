<template>
    <div>
        <v-container fluid class="pa-0 ma-0" grid-list-md>
            <v-layout row wrap class="pa-0 ma-0">
                <v-flex md12 class="pa-0 ma-0">
                    <v-toolbar flat dense dark>
                        <v-toolbar-title>Store</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-autocomplete class="pa-0 ma-0" label="Category" @change="changeCategory"
                            v-model="selectedCategory" :items="Category_Link"></v-autocomplete>
                        <v-spacer></v-spacer>
                        <v-spacer></v-spacer>
                        <v-text-field append-icon="search" type="text" id="filter-text-box" placeholder="Filter..."
                            @input="onFilterTextBoxChanged" v-model="filterText">
                        </v-text-field>
                        <v-spacer></v-spacer>
                    </v-toolbar>
                    <ag-grid-vue id="ag-Grid" :gridOptions="gridOptions"
                        style="width: 100%;  height: calc(100vh - 160px);" :defaultColDef="defaultColDef"
                        class="ag-theme-balham" :columnDefs="columnDefs" :rowData="rowData" :sortable="true"
                        :filter="true" :suppressRowClickSelection="true" :enableRangeSelection="true"
                        rowSelection="multiple" :rowDeselection="true" :resizable="true" :floatingFilter="true"
                        :groupMultiAutoColumn="true" :onGridReady="onGridReady">
                    </ag-grid-vue>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
    import Selector from "./Selector.vue";
    import Axios from 'axios'

    import {
        AgGridVue
    } from "ag-grid-vue";


    export default {
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
                columnDefs: [],
                rowData: [],
                defaultColDef: {
                    onCellValueChanged: this.UpdateStoreCluster
                },
                gridOptions: {
                    rowHeight: 35,
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
        components: {
            AgGridVue,
            Selector
        },
        created() {
            let self = this;
            self.gridOptions.context.componentParent = this;
            self.getStores();
            self.getCategories();
        },
        beforeMount() {
            let self = this;
            self.columnDefs = require('./headers.json');
        },
        methods: {
            changeCategory() {
                let self = this
                self.$nextTick(() => {
                    Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                    Axios.get(process.env.VUE_APP_API + `StoreClustering?planogram_ID=${self.selectedCategory}`)
                        .then(r => {

                            self.rowData = r.data

                            delete Axios.defaults.headers.common["TenantID"];
                        })
                })
            },
            onFilterTextBoxChanged() {
                let self = this;
                self.gridApi.setQuickFilter(self.filterText);
            },
            onGridReady(params) {
                let self = this;
                self.gridApi = params.api;
                self.columnApi = params.columnApi;
            },
            openEdit(item) {
                let self = this;
                self.$refs.modifyStore.open(item);
            },
            getStores() {
                let self = this


            },
            getCategories() {
                let self = this

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + `Planogram/Distinct`)
                    .then(r => {
                        console.log(r);
                        

                        let Category_Link = r.data.planogramList;
                        self.Category_Link = [];
                        Category_Link.forEach(element => {
                            self.Category_Link.push({
                                text: element.displayname,
                                value: element.id
                            })
                        });
                        self.selectedCategory = self.Category_Link[0].value
                        self.changeCategory()
                        delete Axios.defaults.headers.common["TenantID"];
                    })
            },
            getClusters() {
                let self = this

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + `Cluster/Store`)
                    .then(r => {
                        console.log("cluster", r.data);

                        let store_clusters = r.data;
                        self.store_Cluster = [];

                        self.store_Cluster.push({
                            text: "None",
                            value: null
                        })

                        store_clusters.forEach(element => {


                            self.store_Cluster.push({
                                text: element.displayname,
                                value: element.id
                            })
                        });

                        delete Axios.defaults.headers.common["TenantID"];
                    })
            },
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
                                delete Axios.defaults.headers.common["TenantID"];
                            })
                    }
                    break;
                case "storeCluster": {
                    Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                    Axios.post(process.env.VUE_APP_API +
                            `Store/UpdateStoreCluster?cluster_Name=${item.storeCluster}&store_ID=${item.store_ID}`)
                        .then(r => {
                            delete Axios.defaults.headers.common["TenantID"];
                        })
                    break;
                }

                }

            },
            saveOnChange() {
                console.log("save");
                let self = this

                // Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                // Axios.post(process.env.VUE_APP_API + `Cluster/Store`)
                //     .then(r => {
                //         console.log("cluster", r.data);

                //         delete Axios.defaults.headers.common["TenantID"];
                //     })
            }
        }
    }
</script>