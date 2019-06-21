<template>
    <div v-if="rowData.length>0">
        <ag-grid-vue :gridOptions="gridOptions" :sideBar='true' style="width: 100%;  height: calc(100vh - 235px);"
            :defaultColDef="defaultColDef" class="ag-theme-balham" :columnDefs="headers" :rowData="rowData"
            :enableSorting="true" :enableFilter="true" :suppressRowClickSelection="true" :enableRangeSelection="true"
            rowSelection="multiple" :rowDeselection="true" :enableColResize="true" :floatingFilter="true"
            :gridReady="onGridReady" :groupMultiAutoColumn="true">
        </ag-grid-vue>
        <PlanogramDetailsSelector :PlanoName="'ProjectName.text'" ref="PlanogramDetailsSelector" />
        rows:{{rowData.length}}
        <YesNoModal ref="YesNoModal" />
    </div>
</template>
<script>
    import YesNoModal from '@/components/Common/YesNoModal'

    import Button from "./StoreButton.vue"
    import Axios from 'axios'
    import PlanogramDetailsSelector from '@/components/Common/PlanogramDetailsSelector'
    import {
        AgGridVue
    } from "ag-grid-vue";
    export default {
        props: ["rowData", "StoreID", "method"],
        components: {
            YesNoModal,
            AgGridVue,
            Button,
            PlanogramDetailsSelector
        },
        data() {
            return {
                currentStorePlanograms: [],
                headers: [{
                        "headerName": "Planogram",
                        "field": "name"
                    }, {
                        "headerName": "Category Cluster",
                        "field": "categoryCluster"
                    }, {
                        "headerName": "Name",
                        "field": "GeneratedName"
                    }, {
                        "headerName": "Modules",
                        "maxWidth": 90,
                        "minWidth": 50,
                        "field": "modules"
                    }, {
                        "headerName": "Height",
                        "maxWidth": 90,
                        "minWidth": 50,
                        "field": "height"
                    }, {
                        "headerName": "Width",
                        "maxWidth": 90,
                        "minWidth": 50,
                        "field": "width"
                    }, {
                        "headerName": "Displays",
                        "maxWidth": 90,
                        "minWidth": 50,
                        "field": "displays"
                    }, {
                        "headerName": "Pallettes",
                        "maxWidth": 90,
                        "minWidth": 50,
                        "field": "pallettes"
                    }, {
                        "headerName": "Supplier Stands",
                        "maxWidth": 90,
                        "minWidth": 50,
                        "field": "supplierStands"
                    }, {
                        "headerName": "Bins",
                        "field": "bins",
                        "maxWidth": 90,
                        "minWidth": 50,
                    }, {
                        "headerName": "unRequired In Store",
                        "field": "requiredInStore",
                    }, {
                        "headerName": "Current Status",
                        "field": "currentStatusText"
                    },
                    {
                        "headerName": "",
                        "editable": false,
                        "hide": false,
                        "pinned": "right",
                        "maxWidth": 120,
                        "minWidth": 120,
                        "cellRendererFramework": "Button"
                    }
                ],
                StoreStatusList: [{
                        text: "Unassigned"
                    }, {
                        text: "Selected"
                    },
                    {
                        text: "DistrubutedToStore"
                    },
                    {
                        text: "ImplementationInProgress"
                    },
                    {
                        text: "Implemented"
                    },
                    {
                        text: "VariationRequested"
                    }
                ],
                defaultColDef: {},
                gridOptions: {
                    rowHeight: 35,
                    context: {
                        componentParent: this
                    },
                    rowClassRules: {
                        'audit-image-breach': 'data.imageAudit'
                    }
                },
                storePlanograms: [],
                storeName: null,
                allStoreDialog: false,
            }
        },
        methods: {
            onGridReady(params) {
                this.gridApi = params.api;
                this.columnApi = params.columnApi;
                setTimeout(() => {
                    this.gridApi.resetRowHeights();
                    this.gridApi.sizeColumnsToFit()
                }, 300);
            },
            assignPlanogramToStore(listItem) {
                let self = this;
                self.$refs.PlanogramDetailsSelector.show(listItem, false, data => {
                    let item = {
                        "store_ID": self.StoreID,
                        "project_ID": listItem.id,
                        "planogramDetail_ID": data.id,
                        "planogramStoreStatus": 1,
                    }
                    Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                    Axios.post(process.env.VUE_APP_API + 'Store_Planogram/Save', item)
                        .then(r => {
                            let item = {
                                store_ID: self.StoreID
                            }
                            self.method(item)
                            delete Axios.defaults.headers.common["TenantID"];
                        }).catch(e => {
                            delete Axios.defaults.headers.common["TenantID"];
                        })
                })
            },
            UpdateLine(item) {
                let self = this
                let text = ""
                if (item.requiredInStore == true) {
                    text = "Do you want to innclude this category in this store?"
                } else {
                    text = "Are you sure you want to remove this category ?"
                }
                self.$refs.YesNoModal.show(text, data => {
                    if (data) {
                        self.createStorePlano(item, data => {
                            self.method(item)
                        })
                    }
                })

                // self.createPlanoGramDetailTX(tmp)
            },
            createStorePlano(listItem, callback) {
                let self = this;

                listItem.requiredInStore = !listItem.requiredInStore
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                Axios.post(process.env.VUE_APP_API + 'Store_Planogram/Save', listItem)
                    .then(r => {
                        console.log(r);
                        delete Axios.defaults.headers.common["TenantID"];
                        callback(r)
                    }).catch(e => {
                        console.log(e);
                        delete Axios.defaults.headers.common["TenantID"];
                        callback(e)
                    })
            },
        }
    }
</script>