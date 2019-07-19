<template>
    <div>
        <ag-grid-vue :gridOptions="gridOptions" :sideBar='false' style="width: 100%;  height: calc(100vh - 203px);"
            :defaultColDef="defaultColDef" class="ag-theme-balham" :columnDefs="headers" :rowData="rowData"
            :enableSorting="true" :enableFilter="true" :suppressRowClickSelection="true" :enableRangeSelection="true"
            rowSelection="multiple" :rowDeselection="true" :enableColResize="true" :floatingFilter="true"
            :onGridReady="onGridReady" :groupMultiAutoColumn="true">
        </ag-grid-vue>
        <PlanogramDetailsSelector :PlanoName="selectedCat" ref="PlanogramDetailsSelector" />

        <YesNoModal ref="YesNoModal" />
        <VariationOrderModal ref="VariationOrderModal" />
        <UserNotesModal ref="UserNotesModal"></UserNotesModal>
        <v-toolbar dark dense class="pa-0">
            <span>rows : {{rowData.length}}</span>
        </v-toolbar>
    </div>
</template>
<script>
    import UserNotesModal from '@/components/Common/userNotesStoreView.vue'

    import YesNoModal from '@/components/Common/YesNoModal'
    import VariationOrderModal from '@/components/Main/PlanogramImplementation/VariationOrderModal'
    import jwt from 'jsonwebtoken';
    import PlanogramName from "./PlanogramName.vue"
    import Button from "./StoreButton.vue"
    import Fits from "./Fits.vue"
    import Axios from 'axios'
    import ModulesButton from "./ModulesButton.vue"
    import PlanogramDetailsSelector from '@/components/Common/PlanogramDetailsSelector'
    import {
        AgGridVue
    } from "ag-grid-vue";
    export default {
        props: ["rowData", "StoreID", "method"],
        components: {
            VariationOrderModal,
            YesNoModal,
            Fits,
            ModulesButton,
            AgGridVue,
            Button,
            UserNotesModal,
            PlanogramDetailsSelector,
            PlanogramName,

        },
        data() {
            return {
                currentStorePlanograms: [],
                headers: [{
                        "headerName": "Project Group",
                        "field": "groupName",
                        "minWidth": 200,
                    },
                    {
                        "headerName": "Planogram",
                        "field": "projectName",
                        "minWidth": 200,
                    }, {
                        "headerName": "Planogram Name",
                        "cellRendererFramework": "PlanogramName",
                        "minWidth": 500,
                    }, {
                        "headerName": "Current Status",
                        "field": "currentStatusText",
                        "minWidth": 120,
                    }, {
                        "headerName": "",
                        "editable": false,
                        "hide": false,
                        "minWidth": 180,
                        "cellRendererFramework": "Button"
                    }, {
                        "headerName": "Best Fit",
                        "cellRendererFramework": "Fits"
                    }, {
                        "headerName": "Modules",
                        "field": "Modules",
                        "minWidth": 50,
                        "editable": false,

                        "cellRendererFramework": "ModulesButton",
                        cellClassRules: {
                            'success-green': 'data.modulesFit == false && (data.planogramStoreStatus!=5 &&  data.planogramStoreStatus!=0 && data.planogramStoreStatus!=7 && data.planogramStoreStatus!=6)',
                            'error-red': 'data.modulesFit == true && (data.planogramStoreStatus!=5 &&  data.planogramStoreStatus!=0 && data.planogramStoreStatus!=7 && data.planogramStoreStatus!=6)',
                        }
                    }, {
                        "headerName": "Height",
                        "minWidth": 50,
                        // "cellRendererFramework": "height",
                        "editable": true,
                        "field": "height",
                        cellClassRules: {
                            'success-green': 'data.heightFit == false && (data.planogramStoreStatus!=5 &&  data.planogramStoreStatus!=0 && data.planogramStoreStatus!=7 && data.planogramStoreStatus!=6)',
                            'error-red': 'data.heightFit == true && (data.planogramStoreStatus!=5 &&  data.planogramStoreStatus!=0 && data.planogramStoreStatus!=7 && data.planogramStoreStatus!=6)',
                        }
                    },
                    //  {
                    //     "headerName": "Fixture Type",
                    //     "field": "fixtureType",
                    //     "cellEditor": "agRichSelectCellEditor",
                    //     "cellEditorParams": {
                    //         values: ["Standard",
                    //             "Industrial",
                    //             "Supplier Stand",
                    //             "Till point",
                    //             "pallettes",
                    //             "Custom"
                    //         ],
                    //     },
                    //     "editable": true,
                    //     "minWidth": 150,
                    // }, {
                    //     "headerName": "Displays",
                    //     "minWidth": 50,
                    //     "field": "displays"
                    // }, {
                    //     "headerName": "Pallettes",
                    //     "minWidth": 50,
                    //     "field": "pallettes"
                    // }, {
                    //     "headerName": "Supplier Stands",
                    //     "minWidth": 50,
                    //     "field": "supplierStands"
                    // }, {
                    //     "headerName": "Bins",
                    //     "field": "bins",
                    //     "minWidth": 50,
                    // }
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
                selectedCat: null,
                storePlanograms: [],
                storeName: null,
                allStoreDialog: false,
            }
        },
        methods: {
            unassignPlanogram(listItem) {
                let self = this

                let tmp = listItem.data
                let node = listItem.node

                self.$refs.YesNoModal.show("Do you want to remove this Planogram?", data => {
                    if (data) {

                        let moduleFit = false
                        let heightFit = false
                        let storeClusterFit = false
                        let planogramFit = false

                        let item = {
                            "id": tmp.id,
                            "store_ID": tmp.store_ID,
                            "project_ID": tmp.project_ID,
                            "planogramDetail_ID": null,
                            "planogramStoreStatus": 0,
                            "HeightFit": heightFit,
                            "StoreClusterFit": storeClusterFit,
                            "PlanogramFit": planogramFit,
                            "ModulesFit": moduleFit,
                            "Modules": tmp.modules,
                            "Height": tmp.height,
                            "Width": tmp.width,
                            "Displays": tmp.displays,
                            "Pallettes": tmp.pallettes,
                            "SupplierStands": listItem.supplierStands,
                            "Bins": listItem.bins,
                            "Fits": false
                        }

                        tmp.planogramStoreStatus = 0;
                        tmp.currentStatusText = "Unassigned"

                        console.log(tmp)

                        Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                        Axios.post(process.env.VUE_APP_API + 'Store_Planogram/Save', item)
                            .then(r => {
                                node.setData(tmp)
                                self.gridApi.redrawRows();
                                delete Axios.defaults.headers.common["TenantID"];
                            }).catch(e => {
                                delete Axios.defaults.headers.common["TenantID"];
                            })
                    }
                })


            },
            sendMail(currentItem) {
                let self = this;

                self.$refs.UserNotesModal.show(modalData => {
                    let request = JSON.parse(JSON.stringify(currentItem));

                    let projectTXGroupRequest = {
                        projectID: request.project_ID
                    }

                    // Create New Project Group
                    self.createProjectTransactionGroup(projectTXGroupRequest, newGroup => {
                        request.systemUserID = modalData.systemUserID;
                        request.actionedByUserID = null;
                        request.rollingUserID = null;
                        request.notes = modalData.notes;
                        request.projectTXGroup_ID = newGroup.id;
                        request.type = 7;
                        request.status = 43;
                        // Create New Project Transaction
                        self.createProjectTransaction(request, data => {
                            self.method(() => {
                                console.log("gotdata");

                            })
                        })
                    })
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
            createProjectTransactionGroup(request, callback) {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.post(process.env.VUE_APP_API + `ProjectTXGroup`, request).then(r => {
                    delete Axios.defaults.headers.common["TenantID"];
                    callback(r.data.projectTXGroup);
                })
            },
            viewSetinProgress(item) {
                let self = this
                item.planogramStoreStatus = 3
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                Axios.post(process.env.VUE_APP_API + 'Store_Planogram/Save', item).then(r => {
                    self.routeToView(item)
                })
            },
            setImplemented(item) {
                let self = this
                item.planogramStoreStatus = 4
                item.height = item.detailHeight
                item.modules = item.detailModules
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                Axios.post(process.env.VUE_APP_API + 'Store_Planogram/Save', item).then(r => {
                    self.method(
                        () => {}
                    )
                })
            },
            routeToView(item) {
                let self = this;
                let route;

                console.log("BRUH", item);
                console.log("[planogramStoreStatus]", item.planogramStoreStatus);

                switch (item.planogramStoreStatus) {
                    //     case 1: {
                    //         route = `/DataPreparation`
                    //         self.$router.push(route);
                    //     }
                    //     break;
                    // case 2: {
                    //     route = `/RangePlanning/${item.rangeFileID}`
                    //     self.$router.push(route);
                    // }
                    // break;
                    case 2: {
                        self.checkFileStatus(item.systemFileID, data => {
                            let status = 13

                            route =
                                `/PlanogramImplementation/${item.project_ID}/${item.systemFileID}/${status}`

                            if (data.status == 1) {
                                alert("this planogram has been recalled, task will be removed");
                            }

                            if (data.status == 2) {
                                alert(
                                    "A variation has been requested for this planogram, task will be removed"
                                );
                            }

                            if (route != undefined)
                                self.$router.push(route);
                        })
                    }
                    break;
                case 3: {
                    self.checkFileStatus(item.systemFileID, data => {
                        let status = 24
                        route = `/PlanogramImplementation/${item.project_ID}/${item.systemFileID}/${status}`

                        if (data.status == 1) {
                            alert("this planogram has been recalled, task will be removed");
                        }

                        if (data.status == 2) {
                            alert(
                                "A variation has been requested for this planogram, task will be removed"
                            );
                        }

                        if (route != undefined)
                            self.$router.push(route);
                    })
                }
                break;
                case 4: {
                    self.checkFileStatus(item.systemFileID, data => {
                        let status = 26
                        route =
                            `/PlanogramImplementation/${item.project_ID}/${item.systemFileID}/${status}`

                        if (data.status == 1) {
                            alert("this planogram has been recalled, task will be removed");
                        }

                        if (data.status == 2) {
                            alert(
                                "A variation has been requested for this planogram, task will be removed"
                            );
                        }

                        if (route != undefined)
                            self.$router.push(route);
                    })
                }
                break;
                }

            },
            checkFileStatus(fileID, callback) {
                let self = this;

                Axios.get(process.env.VUE_APP_API + "SystemFile?db=CR-DEVINSPIRE&id=" + fileID)
                    .then(r => {
                        console.log(r.data);
                        callback(r.data);
                    })
            },
            resize() {
                setTimeout(() => {
                    this.gridApi.resetRowHeights();
                    this.gridApi.sizeColumnsToFit()
                }, 200);
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
            createVariationRequest(variation_Order, order_Detail, variation_Order_Store_Links, stores, callback) {
                let self = this

                let request = {
                    Variation_Order: variation_Order,
                    Variaton_Order_Detail: order_Detail,
                    Variaton_Order_Store_Link: variation_Order_Store_Links,
                    Stores: stores
                }
                console.log(request);
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                Axios.post(process.env.VUE_APP_API + 'Variation_Order', request).then(r => {
                    console.log(r);
                    callback()
                    delete Axios.defaults.headers.common["TenantID"];
                })
            },
            openOrder(data, type, title) {
                let self = this
                let item = data.data
                let node = data.node
                self.getProjectOwner(item.project_ID, ownerCallback => {
                    let encoded_details = jwt.decode(sessionStorage.accessToken);
                    let systemUserID = encoded_details.USER_ID;
                    self.$refs.VariationOrderModal.show(item, type, title, VariationCB => {
                        let notes = VariationCB.notes
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
                                        "notes": VariationCB.notes,
                                        "status": 14,
                                        "systemUserID": ownerCallback.systemUserID,
                                        "planogram_ID": item.planogramID,
                                        "systemFileID": item.systemFileID,
                                        "rangeFileID": item.rangeID,
                                    }
                                    self.createProjectTransaction(TXrequest, txCallback => {
                                        let variation_Order = {
                                            Planogram_Detail_ID: item
                                                .planogramDetail_ID,
                                            Project_TX_ID: txCallback.id,
                                            DateRequested: new Date(),
                                            Status: 0,
                                        }
                                        let order_Detail = {
                                            Height: VariationCB.height,
                                            Modules: VariationCB.totalModules,
                                            Notes: VariationCB.notes,
                                        }
                                        if (type == 0) {
                                            let variation_Order_Store_Links = [{
                                                Store_Planogram_ID: item.id

                                            }]
                                            self.createVariationRequest(
                                                variation_Order,
                                                order_Detail,
                                                variation_Order_Store_Links,
                                                null,
                                                callback => {
                                                    self.getRowData()
                                                })
                                        } else {
                                            let stores = VariationCB.stores
                                            self.createVariationRequest(
                                                variation_Order,
                                                order_Detail,
                                                null,
                                                stores,
                                                callback => {
                                                    self.getRowData()
                                                })
                                        }
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
            onGridReady(params) {
                this.gridApi = params.api;
                this.columnApi = params.columnApi;
                setTimeout(() => {
                    this.gridApi.resetRowHeights();
                    this.gridApi.sizeColumnsToFit()
                }, 300);
            },
            checkFits(storePlan, planDetails, callback) {
                let self = this
                let retval = false
                if (storePlan.modules < planDetails.modules) {
                    retval = true
                }
                if (storePlan.height < planDetails.height) {
                    retval = true
                }
                if (storePlan.cluster != planDetails.storeCluster) {
                    retval = true
                }
                callback(retval)
            },
            assignPlanogramToStore(data) {
                let self = this;
                let listItem = data.data
                let node = data.node
                self.selectedCat = listItem.projectName
                self.$refs.PlanogramDetailsSelector.show(listItem, true, listItem.planogram_ID, data => {
                    //   busy here with fits addition for store view
                    let moduleFit = false
                    let heightFit = false
                    let storeClusterFit = false
                    let planogramFit = false
                    self.checkFits(listItem, data, fits => {

                        if (listItem.modules < data.modules) {
                            moduleFit = true
                        }

                        let Lheight = listItem.height * 0.9
                        let Uheight = listItem.height * 1.1
                        if (Lheight < data.height && data.height < Uheight) {
                            heightFit = true
                        }

                        if (listItem.cluster != data.clusterName) {
                            storeClusterFit = true
                        }

                        let item = {
                            "id": listItem.id,
                            "store_ID": self.StoreID,
                            "project_ID": listItem.project_ID,
                            "planogramDetail_ID": data.id,
                            "planogramStoreStatus": 1,
                            "HeightFit": heightFit,
                            "StoreClusterFit": storeClusterFit,
                            "PlanogramFit": planogramFit,
                            "ModulesFit": moduleFit,
                            "Fits": fits
                        }
                        Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                        Axios.post(process.env.VUE_APP_API + 'Store_Planogram/Save', item)
                            .then(r => {
                                let item = {
                                    store_ID: self.StoreID
                                }
                                listItem.fileName = data.fileName
                                listItem.currentStatusText = "Assigned"
                                listItem.heightFit = heightFit
                                listItem.storeClusterFit = storeClusterFit
                                listItem.planogramFit = planogramFit
                                listItem.modulesFit = moduleFit
                                listItem.fits = fits
                                listItem.planogramStoreStatus = 1
                                listItem.systemFileID = data.systemFileID
                                listItem.rangeID = data.rangeID
                                node.setData(listItem)
                                delete Axios.defaults.headers.common["TenantID"];
                            }).catch(e => {
                                delete Axios.defaults.headers.common["TenantID"];
                            })
                    })
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
            createUpdate(listItem, callback) {

                let self = this;
                let moduleFit = false
                let heightFit = false
                let overallFits = false
                let storeClusterFit = false

                if (listItem.modules < listItem.detailModules) {
                    moduleFit = true
                }
                if (listItem.height < listItem.detailHeight) {
                    heightFit = true
                }

                if (listItem.storeClusterFit == true || heightFit == true || moduleFit == true) {
                    overallFits = true
                }

                let item = {
                    "id": listItem.id,
                    "store_ID": listItem.store_ID,
                    "project_ID": listItem.project_ID,
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
                    "Fits": overallFits
                }
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                Axios.post(process.env.VUE_APP_API + 'Store_Planogram/Save', item)
                    .then(r => {
                        delete Axios.defaults.headers.common["TenantID"];
                        callback(r.data)
                    }).catch(e => {
                        delete Axios.defaults.headers.common["TenantID"];
                        callback(e)
                    })
            },
            // UpdateLine(item) {
            //     let self = this
            //     let text = ""
            //     if (item.requiredInStore == true) {
            //         text = "Do you want to innclude this category in this store?"
            //     } else {
            //         text = "Are you sure you want to remove this category ?"
            //     }
            //     self.$refs.YesNoModal.show(text, data => {
            //         if (data) {
            //             self.createStorePlano(item, data => {

            //             })
            //         }
            //     })
            // },
            removeFromStore(item, state, Status) {
                let self = this
                let tmp = item.data
                let node = item.node

                self.createUpdate(tmp, data => {
                    tmp.id = data.store_Planogram.id
                    tmp.heightFit = data.store_Planogram.heightFit;
                    tmp.modulesFit = data.store_Planogram.modulesFit;
                    node.setData(tmp)
                })

                let text = ""

                if (item.requiredInStore == true) {
                    text = "Do you want to innclude this category in this store?"
                } else {
                    text = "Are you sure you want to remove this category ?"
                }

                self.$refs.YesNoModal.show(text, val => {
                    if (val) {
                        self.remove(tmp, state, Status, data => {
                            node.setData(data)
                        })
                    }
                })
            },
            // remove(listItem, state, Status, callback) {
            //     let self = this;
            //     if (state == true) {
            //         listItem.planogramDetail_ID = null
            //         listItem.HeightFit = false
            //         listItem.modulesFit = false
            //         listItem.storeClusterFit = false
            //         listItem.PlanogramFit = false
            //         listItem.Fits = false
            //         listItem.systemFileID = 0
            //     }

            //     listItem.requiredInStore = state
            //     listItem.planogramStoreStatus = Status

            //     Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
            //     Axios.post(process.env.VUE_APP_API + 'Store_Planogram/Save', listItem)
            //         .then(r => {
            //             delete Axios.defaults.headers.common["TenantID"];
            //             callback(r)
            //         }).catch(e => {
            //             delete Axios.defaults.headers.common["TenantID"];
            //             callback(e)
            //         })
            // },
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
            saveStoreFixtureDetails(store_planogram_fixture_list, callback) {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.post(process.env.VUE_APP_API + 'Store_Planogram_Fixture', store_planogram_fixture_list)
                    .then(r => {
                        delete Axios.defaults.headers.common["TenantID"];
                        callback(r.data)
                    }).catch(e => {
                        console.error(e);
                        delete Axios.defaults.headers.common["TenantID"];
                    })
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
                // console.log(listItem.height +">" +  Uheight)
                console.log(listItem.height + "||" + listItem.detailHeight);

                if (parseFloat(listItem.height) < Lheight || Uheight < parseFloat(listItem.height)) {
                    heightFit = true
                }

                if (listItem.storeClusterFit == true || heightFit == true || moduleFit == true) {
                    overallFits = true
                }

                let item = {
                    "id": listItem.id,
                    "store_ID": listItem.store_ID,
                    "project_ID": listItem.project_ID,
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
        }
    }
</script>