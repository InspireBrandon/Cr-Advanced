<template>
    <div>
        <ag-grid-vue id="ag-Grid" :gridOptions="gridOptions" style="width: 100%;  height: calc(100vh - 174px);"
            :defaultColDef="defaultColDef" class="ag-theme-balham" :columnDefs="columnDefs" :rowData="rowData"
            :sortable="true" :filter="true" :suppressRowClickSelection="true" :enableRangeSelection="true"
            rowSelection="multiple" :rowDeselection="true" :resizable="true" :floatingFilter="true"
            :groupMultiAutoColumn="true" :onGridReady="onGridReady"></ag-grid-vue>
    </div>
</template>

<script>
    import Axios from "axios";

    import {
        AgGridVue
    } from "ag-grid-vue";

    export default {
        components: {
            AgGridVue
        },
        mounted() {
            let self = this;
            self.getCategories();
        },
        data() {
            return {
                selectedCategory: null,
                columnDefs: [{
                        headerName: "Store Name",
                        field: "store",
                        editable: false,
                        hide: false
                    },
                    {
                        headerName: "Store Cluster",
                        editable: true,
                        hide: false,
                        field: "storeCluster"
                    },
                    {
                        headerName: "Custom Cluster",
                        field: "customCluster",
                        editable: true,
                        hide: false
                    }
                ],
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
                        "disabled-line": "data.can_edit"
                    }
                }
            };
        },
        methods: {
            changeCategory(planogram) {
                let self = this
                self.$nextTick(() => {
                    console.log(planogram)

                    Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                    Axios.get(process.env.VUE_APP_API + `StoreClustering?planogram_ID=${planogram}`)
                        .then(r => {

                            self.rowData = r.data;

                            delete Axios.defaults.headers.common["TenantID"];
                        })
                })
            },
            onGridReady(params) {
                let self = this;
                self.gridApi = params.api;
                self.columnApi = params.columnApi;
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
            UpdateStoreCluster(params) {
                let self = this;
                let item = params.data;
                let node = params.node;

                switch (params.colDef.field) {
                    case "customCluster": {
                        Axios.defaults.headers.common["TenantID"] =
                            sessionStorage.currentDatabase;
                        Axios.post(
                            process.env.VUE_APP_API +
                            `Store/UpdateCustomCluster?planogram_ID=${self.selectedCategory}&cluster_Name=${item.customCluster}&store_ID=${item.store_ID}`
                        ).then(r => {
                            delete Axios.defaults.headers.common["TenantID"];
                        });
                    }
                    break;
                case "storeCluster": {
                    Axios.defaults.headers.common["TenantID"] =
                        sessionStorage.currentDatabase;
                    Axios.post(
                        process.env.VUE_APP_API +
                        `Store/UpdateStoreCluster?cluster_Name=${item.storeCluster}&store_ID=${item.store_ID}`
                    ).then(r => {
                        delete Axios.defaults.headers.common["TenantID"];
                    });
                    break;
                }
                }
            }
        }
    };
</script>