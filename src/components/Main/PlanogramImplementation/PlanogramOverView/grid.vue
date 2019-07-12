<template>
    <div>
        <ag-grid-vue :gridOptions="gridOptions" @selection-changed="onSelectionChanged" :sideBar='false'
            style="width: 100%;  height: calc(100vh - 220px);" :defaultColDef="defaultColDef" class="ag-theme-balham"
            :columnDefs="headers" :rowData="rowData" :enableSorting="true" :enableFilter="true"
            :suppressRowClickSelection="true" :enableRangeSelection="true" rowSelection="multiple"
            :rowDeselection="true" :enableColResize="true" :floatingFilter="true" :gridReady="gridReady"
            :onGridReady="onGridReady" :groupMultiAutoColumn="true">
        </ag-grid-vue>
        <v-toolbar dark dense class="pa-0">
            <span>rows : {{rowData.length}}</span>
        </v-toolbar>
        <VariationOrderModal ref="VariationOrderModal" />
        <YesNoModal ref="YesNoModal" />
    </div>
</template>
<script>
    import PlanogramName from "./PlanogramName.vue"
    import Button from "./button.vue"
    import Audit from "./audit.vue"
    import Fits from "./Fits.vue"
    import height from "./height.vue"
    import jwt from 'jsonwebtoken';
    import FixtureType from "./FixtureType.vue"
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
            FixtureType,
            Fits,
            PlanogramName,
            height,
            YesNoModal,
            Audit
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

                        "minWidth": 300,
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
                        "headerName": "Status",
                        "field": "currentStatusText",
                        "minWidth": 100,
                    }, {
                        "headerName": "Actions",
                        "editable": false,
                        "hide": false,
                        "minWidth": 180,
                        "cellRendererFramework": "Button"
                    },
                    {
                        "headerName": "Best Fit",
                        "cellRendererFramework": "Fits",
                        "minWidth": 50
                    },
                    {
                        "headerName": "Store Cluster",
                        "field": "cluster",
                        "minWidth": 75,
                        cellClassRules: {
                            'success-green': 'data.storeClusterFit == false && ( data.planogramStoreStatus!=0 && data.planogramStoreStatus!=7 && data.planogramStoreStatus!=6)',
                            'error-red': 'data.storeClusterFit == true && ( data.planogramStoreStatus!=0 && data.planogramStoreStatus!=7 && data.planogramStoreStatus!=6)',
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
                        cellClassRules: {
                            'success-green': 'data.modulesFit == false && ( data.planogramStoreStatus!=0 && data.planogramStoreStatus!=7 && data.planogramStoreStatus!=6)',
                            'error-red': 'data.modulesFit == true && ( data.planogramStoreStatus!=0 && data.planogramStoreStatus!=7 && data.planogramStoreStatus!=6)',
                        }

                    }, {
                        "headerName": "Height",
                        "minWidth": 50,
                        // "cellRendererFramework": "height",
                        "editable": true,
                        "field": "height",
                        cellClassRules: {
                            'success-green': 'data.heightFit == false && ( data.planogramStoreStatus!=0 && data.planogramStoreStatus!=7 && data.planogramStoreStatus!=6)',
                            'error-red': 'data.heightFit == true && ( data.planogramStoreStatus!=0 && data.planogramStoreStatus!=7 && data.planogramStoreStatus!=6)',
                        }
                    }, {
                        "headerName": "Audit",
                        "minWidth": 50,
                        "field": "audit",
                        "cellRendererFramework": "Audit"
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
                    console.log(`ProjectTXGroup`);
                    console.log(r);
                    callback(r.data.projectTXGroup);
                })
            },
            createProjectTransaction(request, callback) {
                let self = this;
                console.log(request);

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.post(process.env.VUE_APP_API + `ProjectTX`, request).then(r => {
                    delete Axios.defaults.headers.common["TenantID"];
                    console.log(`ProjectTX`);
                    console.log(r);

                    callback(r.data.projectTX)
                })
            },

            getProjectOwner(projectID, callback) {
                let self = this
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                Axios.get(process.env.VUE_APP_API + `Project?projectID=${projectID}`).then(r => {
                    console.log(r);

                    callback(r.data.projectList[0])
                }).catch(e => {
                    alert("Failed to get project owner: " + e)
                })
            },
            openOrder(data, type, title) {
                let self = this
                let item = data.data
                let node = data.node
                self.getProjectOwner(item.project_ID, ownerCallback => {
                    console.log("ownerCallback");
                    console.log(ownerCallback);
                    let owner = ownerCallback.systemUserID
                    let encoded_details = jwt.decode(sessionStorage.accessToken);
                    let systemUserID = encoded_details.USER_ID;
                    self.$refs.VariationOrderModal.show(item, type, title, VariationCB => {
                        let notes = VariationCB
                        item.planogramStoreStatus = 5
                        Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                        Axios.post(process.env.VUE_APP_API + 'Store_Planogram/Save', item)
                            .then(r => {
                                console.log(r);
                                item.currentStatusText = "Variation"
                                node.setData(item)
                                let groupRequest = {
                                    ProjectID: item.project_ID
                                }
                                self.createProjectTransactionGroup(groupRequest, callback => {
                                    let storeID = null
                                    if (type == 0) {
                                        storeID = item.store_ID
                                    } else {
                                        storeID = null
                                    }
                                    let TXrequest = {
                                        "project_ID": item.project_ID,
                                        "projectTXGroup_ID": callback.id,
                                        "type": 3,
                                        "storeCluster_ID": item.clusterID,
                                        "store_ID": storeID,
                                        "notes": notes,
                                        "status": 14,
                                        "systemUserID": owner,
                                        "planogram_ID": item.planogramID,
                                        "systemFileID": item.systemFileID,
                                        "rangeFileID": item.rangeID,
                                    }
                                    self.createProjectTransaction(TXrequest, txCallback => {

                                    })
                                })
                                delete Axios.defaults.headers.common["TenantID"];
                            }).catch(e => {
                                console.log(e);
                                delete Axios.defaults.headers.common["TenantID"];
                            })
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
                let overallFits = false
                let storeClusterFit = false

                if (listItem.modules < listItem.detailModules) {
                    moduleFit = true
                }

                let Lheight = listItem.detailHeight * 0.9
                let Uheight = listItem.detailHeight * 1.1

                if (parseFloat(listItem.height) < Lheight || Uheight < parseFloat(listItem.height)) {
                    heightFit = true
                }

                if (listItem.storeClusterFit == true || heightFit == true || moduleFit == true) {
                    overallFits = true
                }

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
                    "storeClusterFit": listItem.storeClusterFit,
                    "Displays": listItem.displays,
                    "Pallettes": listItem.pallettes,
                    "heightFit": heightFit,
                    "SupplierStands": listItem.supplierStands,
                    "Bins": listItem.bins,
                    "FixtureType": listItem.fixtureType,
                    "Fits": overallFits,
                    "audit": listItem.audit
                }

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.post(process.env.VUE_APP_API + 'Store_Planogram/Save', item)
                    .then(r => {
                        console.log(r);
                        delete Axios.defaults.headers.common["TenantID"];
                        callback(r.data)
                    }).catch(e => {
                        console.log(e);
                        delete Axios.defaults.headers.common["TenantID"];
                        callback(e)
                    })
            },
            UpdateLine(item) {
                let self = this
                let tmp = item.data
                let node = item.node
                self.createStorePlano(tmp, data => {
                    tmp.id = data.store_Planogram.id
                    tmp.heightFit = data.store_Planogram.heightFit;
                    tmp.modulesFit = data.store_Planogram.modulesFit;
                    tmp.fits = data.store_Planogram.fits;
                    node.setData(tmp)
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
                    "fixtureType": item.fixtureType,
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
            removeFromStore(rowdata, state, Status) {
                let self = this
                let item = rowdata.data
                let node = rowdata.node


                let text = ""
                console.log("status");

                console.log(Status);

                if (item.requiredInStore == true) {
                    text = "Do you want to innclude this category in this store?"
                } else {
                    text = "Are you sure you want to remove this category ?"
                }
                self.$refs.YesNoModal.show(text, val => {
                    if (val) {
                        self.remove(item, state, Status, data => {
                            console.log("node data");
                            console.log(data);

                            node.setData(data)
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
                    listItem.fileName = null
                    listItem.modulesFit = false
                    listItem.storeClusterFit = false
                    listItem.PlanogramFit = false
                    listItem.Fits = false
                    listItem.systemFileID = 0
                    listItem.currentStatusText = "On Hold"
                } else {
                    listItem.currentStatusText = "Unassigned"
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
                        callback(listItem)
                    }).catch(e => {
                        console.log(e);
                        delete Axios.defaults.headers.common["TenantID"];
                        callback(e)
                    })
            },
            resize() {
                setTimeout(() => {
                    this.gridApi.resetRowHeights();
                    this.gridApi.sizeColumnsToFit()
                }, 200);
            },
            onGridReady(params) {
                this.gridApi = params.api;
                this.columnApi = params.columnApi;

                console.log("From on grid ready")
                console.log(params, this.gridApi);

                setTimeout(() => {
                    this.gridApi.resetRowHeights();
                    this.gridApi.sizeColumnsToFit()
                }, 200);
            },
            gridReady(params) {
                this.gridApi = params.api;
                this.columnApi = params.columnApi;

                console.log("From grid ready")
                console.log(params, this.gridApi);

                setTimeout(() => {
                    this.gridApi.resetRowHeights();
                    this.gridApi.sizeColumnsToFit()
                }, 200);
            },
            redrawAllRows() {
                let self = this;
                console.log("redrawing rows")
                this.gridApi.redrawRows();
            },
        }
    }
</script>
<style>
    .ag-theme-balham .audit-image-breach {
        background-color: rgb(247, 199, 65) !important;
    }

    .success-green {
        background: #C8E6C9;
    }

    .error-red {
        background: rgb(240, 125, 125);
    }
</style>