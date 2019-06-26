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
        <VariationOrderModal ref="VariationOrderModal" />
        <YesNoModal ref="YesNoModal" />

    </div>
</template>
<script>
    import PlanogramName from "./PlanogramName.vue"
    import Button from "./button.vue"
    import Fits from "./Fits.vue"
    import YesNoModal from '@/components/Common/YesNoModal'
    import VariationOrderModal from '@/components/Main/PlanogramImplementation/VariationOrderModal'

    import Axios from 'axios'
    import {
        AgGridVue
    } from "ag-grid-vue";
    import {
        stat
    } from 'fs';
    export default {
        props: ["rowData", "selectedProject", "getRowData", "assign"],
        components: {
            AgGridVue,
            VariationOrderModal,
            Button,
            Fits,
            PlanogramName,
            YesNoModal,
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
                        "field": "storeName",
                        "minWidth": 200,
                    }, {
                        "headerName": "Planogram Name",
                        "cellRendererFramework": "PlanogramName",

                        "minWidth": 650,
                        cellStyle: function (params) {
                            if (params.data.planogramFit == true) {
                                //mark police cells as red
                                return {
                                    // color: 'red',
                                    backgroundColor: " rgb(240, 125, 125)"
                                };
                            } else {
                                return {
                                    // backgroundColor: " #C8E6C9"
                                };
                            }
                        }
                    }, {
                        "headerName": "Current Status",
                        "field": "currentStatusText",
                        "minWidth": 100,
                    }, {
                        "headerName": "",
                        "editable": false,
                        "hide": false,
                        "minWidth": 140,
                        "cellRendererFramework": "Button"
                    },
                    {
                        "headerName": "Best Fit",
                        "cellRendererFramework": "Fits"
                    }, {
                        "headerName": "Store Cluster",
                        "field": "cluster",
                        "minWidth": 75,
                        cellStyle: function (params) {
                            if (params.data.storeClusterFit == true) {
                                //mark police cells as red
                                return {
                                    // color: 'red',
                                    backgroundColor: " rgb(240, 125, 125)"
                                };
                            } else {
                                return {
                                    backgroundColor: "#C8E6C9"
                                };
                            }
                        }
                    }, {
                        "headerName": "Category Cluster",
                        "field": "categoryCluster",
                        "minWidth": 75,
                    }, {
                        "headerName": "Modules",
                        "minWidth": 50,
                        "editable": true,
                        "field": "modules",
                        cellStyle: function (params) {
                            if (params.data.modulesFit == true) {
                                //mark police cells as red
                                return {
                                    // color: 'red',
                                    backgroundColor: " rgb(240, 125, 125)"
                                };
                            } else {
                                return {
                                    backgroundColor: " #C8E6C9"
                                };
                            }
                        }
                    }, {
                        "headerName": "Height",
                        "minWidth": 50,
                        "editable": true,
                        "field": "height",
                        cellStyle: function (params) {
                            if (params.data.heightFit == true) {
                                //mark police cells as red
                                return {
                                    // color: 'red',
                                    backgroundColor: " rgb(240, 125, 125)"
                                };
                            } else {
                                return {
                                    backgroundColor: " #C8E6C9"
                                };
                            }
                        }
                    }, {
                        "headerName": "Width",
                        "minWidth": 50,
                        "editable": true,
                        "field": "width"
                    }, {
                        "headerName": "Displays",
                        "minWidth": 50,
                        "editable": true,
                        "field": "displays"
                    }, {
                        "headerName": "Pallettes",
                        "minWidth": 50,
                        "editable": true,
                        "field": "pallettes"
                    }, {
                        "headerName": "Supplier Stands",
                        "minWidth": 50,
                        "editable": true,
                        "field": "supplierStands"
                    }, {
                        "headerName": "Bins",
                        "field": "bins",
                        "minWidth": 50,
                        "editable": true,
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

                },
            }
        },
        methods: {
            createProjectTransactionGroup(request, callback) {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.post(process.env.VUE_APP_API + `ProjectTXGroup`, request).then(r => {
                    delete Axios.defaults.headers.common["TenantID"];
                    callback(r.data.projectTXGroup);
                })
            },
            createProjectTransaction(request, callback) {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.post(process.env.VUE_APP_API + `ProjectTX`, request).then(r => {
                    delete Axios.defaults.headers.common["TenantID"];
                    callback(r.data.projectTX)
                })
            },
            openOrder(item) {
                let self = this
                self.$refs.VariationOrderModal.show(item, callback => {
                    item.planogramStoreStatus = 5
                    Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                    Axios.post(process.env.VUE_APP_API + 'Store_Planogram/Save', item)
                        .then(r => {
                            console.log(r);
                            delete Axios.defaults.headers.common["TenantID"];
                          self.getRowData()
                        }).catch(e => {
                            console.log(e);
                            delete Axios.defaults.headers.common["TenantID"];
                          
                        })
                })
            },
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
                let moduleFit = false
                let heightFit = false
                let overallFits = true
                let storeClusterFit = false
                if (listItem.modules < listItem.detailModules) {
                    moduleFit = true
                }
                if (listItem.height < listItem.detailHeight) {
                    heightFit = true
                }
                if (listItem.storeCluster != listItem.cluster) {
                    storeClusterFit = true
                }
                if (storeClusterFit == true || heightFit == true || moduleFit == true) {
                    overallFits = true
                }

                console.log(listItem);

                let item = {
                    "id": listItem.id,
                    "store_ID": listItem.store_ID,
                    "project_ID": self.selectedProject,
                    "planogramDetail_ID": listItem.planogramDetail_ID,
                    "planogramStoreStatus": listItem.planogramStoreStatus,
                    "Modules": listItem.modules,
                    "Height": parseFloat(listItem.height),
                    "Width": parseFloat(listItem.width),
                    "modulesFit": moduleFit,
                    "storeClusterFit": storeClusterFit,
                    "Displays": listItem.displays,
                    "Pallettes": listItem.pallettes,
                    "heightFit": heightFit,
                    "SupplierStands": listItem.supplierStands,
                    "Bins": listItem.bins,
                    "Fits": overallFits
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
            removeFromStore(item, state, Status) {
                let self = this
                let text = ""
                console.log("status");

                console.log(Status);

                if (item.requiredInStore == true) {
                    text = "Do you want to innclude this category in this store?"
                } else {
                    text = "Are you sure you want to remove this category ?"
                }
                self.$refs.YesNoModal.show(text, data => {
                    if (data) {
                        self.remove(item, state, Status, data => {
                            self.getRowData()
                        })
                    }
                })

                // self.createPlanoGramDetailTX(tmp)
            },
            remove(listItem, state, status, callback) {
                let self = this;
                if (state == true) {
                    console.log("removing state");

                    listItem.planogramDetail_ID = null
                    listItem.HeightFit = false
                    listItem.modulesFit = false
                    listItem.storeClusterFit = false
                    listItem.PlanogramFit = false
                    listItem.Fits = false
                    listItem.systemFileID = 0
                }
                console.log("status");
                console.log(status);

                listItem.requiredInStore = state
                listItem.planogramStoreStatus = status
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
        background-color: rgb(247, 199, 65) !important;
    }
</style>