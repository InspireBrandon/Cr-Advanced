<template>
    <div v-if="rowData.length>0">
        <ag-grid-vue :gridOptions="gridOptions" :selectionChanged="onSelectionChanged" :sideBar='false'
            style="width: 100%;  height: calc(100vh - 235px);" :defaultColDef="defaultColDef" class="ag-theme-balham"
            :columnDefs="headers" :rowData="rowData" :enableSorting="true" :enableFilter="true"
            :suppressRowClickSelection="true" :enableRangeSelection="true" rowSelection="multiple"
            :rowDeselection="true" :enableColResize="true" :floatingFilter="true" :gridReady="onGridReady"
            :groupMultiAutoColumn="true">
        </ag-grid-vue>
        rows : {{rowData.length}}
    </div>
</template>
<script>
    import Button from "./button.vue"
    import Axios from 'axios'
    import {
        AgGridVue
    } from "ag-grid-vue";
    export default {
        props: ["rowData", "selectedProject", "getRowData", "assign"],
        components: {
            AgGridVue,
            Button,
        },
        data() {
            return {
                selectedItems: [],
                headers: [
                    //     {
                    //     "headerName": "",
                    //     "maxWidth": 50,
                    //     "minWidth": 50,
                    //       "cellRendererFramework": "CheckBox"
                    // },
                    {
                        "headerName": "Store",
                        "checkboxSelection": true,
                        "field": "storeName"
                    }, {
                        "headerName": "Store Cluster",
                        "field": "cluster"
                    }, {
                        "headerName": "Category Cluster",
                        "field": "categoryCluster",
                        "maxWidth": 100,
                        "minWidth": 100,
                    }, {
                        "headerName": "Name",
                        "field": "GeneratedName"
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
                    }, {
                        "headerName": "",
                        "editable": false,
                        "hide": false,
                        "pinned": "right",
                        "maxWidth": 100,
                        "minWidth": 100,
                        "cellRendererFramework": "Button"
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
                        'audit-image-breach': 'data.fits'
                    }
                },
            }
        },
        methods: {
            getSelectedRows() {
                let self = this
                return this.selectedItems
            },
            onSelectionChanged(e) {
                var rows = e.api.getSelectedNodes();
                this.selectedItems = rows;
            },
            createStorePlano(listItem, callback) {
                let self = this;
                let item = {
                    "id": listItem.id,
                    "store_ID": listItem.store_ID,
                    "project_ID": self.selectedProject,
                    "planogramDetail_ID": listItem.planogramDetail_ID,
                    "planogramStoreStatus": listItem.planogramStoreStatus,
                    "Modules": listItem.modules,
                    "Height": listItem.height,
                    "Width": parseFloat(listItem.width),
                    "Displays": listItem.displays,
                    "Pallettes": listItem.pallettes,
                    "SupplierStands": listItem.supplierStands,
                    "Bins": listItem.bins,
                    "Fits": false
                }
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                Axios.post(process.env.VUE_APP_API + 'Store_Planogram/Save', item)
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
            UpdateLine(item) {
                let self = this
                let tmp = item.data
                self.createStorePlano(tmp, data => {
                    self.getRowData()
                })
                // self.createPlanoGramDetailTX(tmp)
            },
            createPlanoGramDetailTX(item) {
                let self = this
                let detailsItem = null;

                if (item.planogramName == null) {
                    item.planogramName = "No assigned Planogram"
                }
                if (item.tag == null) {
                    item.tag = ""
                }
                if (item.storeCluster == null) {
                    item.storeCluster = ""
                }
                if (item.categoryCluster == null) {
                    item.categoryCluster = ""
                }
                if (item.clusterType == null) {
                    item.clusterType = ""
                }
                if (item.clusterName == null) {
                    item.clusterName = ""
                }

                let sendRequst = {
                    "systemFileID": item.systemFileID,
                    "dateFromString": "",
                    "dateToString": "",
                    "monthsBetween": parseInt(item.monthsBetween),
                    "periodic": item.periodic,
                    "planogramID": parseInt(item.planogramID),
                    "planogramName": item.planogramName,
                    "tag": item.tag,
                    "storeCluster": item.storeCluster,
                    "clusterID": parseInt(item.clusterID),
                    "clusterType": item.clusterType,
                    "clusterName": item.clusterName,
                    "rangeID": parseInt(item.rangeID),
                    "storeID": item.store_ID,
                    "storeName": item.storeName,
                    "categoryCluster": item.categoryCluster,
                    "modules": parseInt(item.modules),
                    "height": parseFloat(item.height),
                    "width": parseFloat(item.width),
                    "displays": parseInt(item.displays),
                    "pallettes": parseInt(item.pallettes),
                    "supplierStands": parseInt(item.supplierStands),
                    "bins": parseInt(item.bins)
                }

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                Axios.post(process.env.VUE_APP_API + 'Planogram_Details/Save', sendRequst).then(
                    r => {

                        let obj = {
                            "id": item.id,
                            "store_ID": item.store_ID,
                            "project_ID": self.selectedProject,
                            "planogramDetail_ID": r.data.planogram_Details.id,
                            "planogramStoreStatus": 0,
                        }
                        Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;


                        Axios.post(process.env.VUE_APP_API + 'Store_Planogram/Save', obj)
                            .then(res => {
                                self.getRowData()
                                // params.context.componentParent.getStorePlanograms()
                                delete Axios.defaults.headers.common["TenantID"];
                            }).catch(e => {
                                delete Axios.defaults.headers.common["TenantID"];

                            })


                        delete Axios.defaults.headers.common["TenantID"];
                    })
            },
            onGridReady(params) {
                this.gridApi = params.api;
                this.columnApi = params.columnApi;
                setTimeout(() => {
                    this.gridApi.resetRowHeights();
                    this.gridApi.sizeColumnsToFit()
                }, 200);
            },
        }
    }
</script>
<style>
    .ag-theme-balham .audit-image-breach {
        background-color: lightcoral !important;
    }
</style>