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
    </div>
</template>
<script>
    import Button from "./StoreButton.vue"
    import Axios from 'axios'
    import PlanogramDetailsSelector from '@/components/Common/PlanogramDetailsSelector'
    import {
        AgGridVue
    } from "ag-grid-vue";
    export default {
        props: ["rowData", "StoreID", "method"],
        components: {
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
                        "headerName": "Name",
                        "field": "GeneratedName"
                    }, {
                        "headerName": "Planogram Cluster",
                        "field": "clusterName"
                    }, {
                        "headerName": "Modules",
                        "maxWidth": 90,
                        "minWidth": 50,
                        "editable": true,
                        "field": "modules"
                    }, {
                        "headerName": "Height",
                        "maxWidth": 90,
                        "minWidth": 50,
                        "editable": true,
                        "field": "height"
                    }, {
                        "headerName": "Width",
                        "maxWidth": 90,
                        "minWidth": 50,
                        "editable": true,
                        "field": "width"
                    }, {
                        "headerName": "Displays",
                        "maxWidth": 90,
                        "minWidth": 50,
                        "editable": true,
                        "field": "displays"
                    }, {
                        "headerName": "Pallettes",
                        "maxWidth": 90,
                        "minWidth": 50,
                        "editable": true,
                        "field": "pallettes"
                    }, {
                        "headerName": "Supplier Stands",
                        "maxWidth": 90,
                        "minWidth": 50,
                        "editable": true,
                        "field": "supplierStands"
                    }, {
                        "headerName": "Bins",
                        "field": "bins",
                        "maxWidth": 90,
                        "minWidth": 50,
                        "editable": true,
                    }, {
                        "headerName": "Current Status",
                        "field": "currentStatusText"
                    },
                    {
                        "headerName": "",
                        "editable": false,
                        "hide": false,
                        "pinned": "right",
                        "maxWidth": 100,
                        "minWidth": 100,
                        "cellRendererFramework": "Button"
                    }
                ],
                StoreStatusList: [{
                        text: "Unassigned"
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
                defaultColDef: {
                    onCellValueChanged: this.UpdateLine
                },
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
                        "planogramDetail_ID": data,
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
        }
    }
</script>