<template>
    <div v-if="rowData.length>0">
        <ag-grid-vue :gridOptions="gridOptions" :sideBar='false' style="width: 100%;  height: calc(100vh - 235px);"
            :defaultColDef="defaultColDef" class="ag-theme-balham" :columnDefs="headers" :rowData="rowData"
            :enableSorting="true" :enableFilter="true" :suppressRowClickSelection="true" :enableRangeSelection="true"
            rowSelection="multiple" :rowDeselection="true" :enableColResize="true" :floatingFilter="true"
            :gridReady="onGridReady" :groupMultiAutoColumn="true">
        </ag-grid-vue>
        <PlanogramDetailsSelector :PlanoName="selectedCat" ref="PlanogramDetailsSelector" />
        rows:{{rowData.length}}
        <YesNoModal ref="YesNoModal" />
        <VariationOrderModal ref="VariationOrderModal" />

    </div>
</template>
<script>
    import YesNoModal from '@/components/Common/YesNoModal'
    import VariationOrderModal from '@/components/Main/PlanogramImplementation/VariationOrderModal'
    import PlanogramName from "./PlanogramName.vue"
    import Button from "./StoreButton.vue"
    import Axios from 'axios'
    import PlanogramDetailsSelector from '@/components/Common/PlanogramDetailsSelector'
    import {
        AgGridVue
    } from "ag-grid-vue";
    export default {
        props: ["rowData", "StoreID", "method"],
        components: {
            VariationOrderModal,
            YesNoModal,
            AgGridVue,
            Button,
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
                        "minWidth": 650,
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
                    }, {
                        "headerName": "Category Cluster",
                        "field": "categoryCluster",
                        "minWidth": 70,
                    }, {
                        "headerName": "Modules",
                        "minWidth": 70,
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
                        "minWidth": 70,
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
                        "minWidth": 70,
                        "field": "width"
                    }, {
                        "headerName": "Displays",
                        "minWidth": 70,
                        "field": "displays"
                    }, {
                        "headerName": "Pallettes",
                        "minWidth": 70,
                        "field": "pallettes"
                    }, {
                        "headerName": "Supplier Stands",
                        "minWidth": 70,
                        "field": "supplierStands"
                    }, {
                        "headerName": "Bins",
                        "field": "bins",
                        "minWidth": 70,
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
                selectedCat: null,
                storePlanograms: [],
                storeName: null,
                allStoreDialog: false,
            }
        },
        methods: {
            unassignPlanogram(listItem) {
                let self = this
                console.log("unassign");
                console.log(listItem);
                self.$refs.YesNoModal.show("Do you want to remove this Planogram?", data => {
                    if (data) {

                        let moduleFit = false
                        let heightFit = false
                        let storeClusterFit = false
                        let planogramFit = false


                        let item = {
                            "id": listItem.id,
                            "store_ID": listItem.store_ID,
                            "project_ID": listItem.project_ID,
                            "planogramDetail_ID": null,
                            "planogramStoreStatus": 0,
                            "HeightFit": heightFit,
                            "StoreClusterFit": storeClusterFit,
                            "PlanogramFit": planogramFit,
                            "ModulesFit": moduleFit,
                            "Modules": listItem.modules,
                            "Height": listItem.height,
                            "Width": listItem.width,
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
                                self.method(listItem)
                                delete Axios.defaults.headers.common["TenantID"];
                            }).catch(e => {
                                console.log(e);
                                delete Axios.defaults.headers.common["TenantID"];
                            })
                    }
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
                            self.method(item)
                        }).catch(e => {
                            console.log(e);
                            delete Axios.defaults.headers.common["TenantID"];

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
            assignPlanogramToStore(listItem) {
                let self = this;
                console.log(listItem);
                self.selectedCat = listItem.projectName
                self.$refs.PlanogramDetailsSelector.show(listItem, true, data => {
                    //   busy here with fits addition for store view
                    let moduleFit = false
                    let heightFit = false
                    let storeClusterFit = false
                    let planogramFit = false
                    self.checkFits(listItem, data, fits => {
                        console.log(listItem.modules + " : " + data.modules)
                        console.log(listItem.modules < data.modules);

                        if (listItem.modules < data.modules) {
                            moduleFit = true
                        }
                        if (listItem.height < data.height) {
                            heightFit = true
                        }
                        if (listItem.cluster != data.clusterName) {
                            storeClusterFit = true
                        }
                        let item = {
                            "id": listItem.id,
                            "store_ID": self.StoreID,
                            "project_ID": listItem.projectID,
                            "planogramDetail_ID": data.id,
                            "planogramStoreStatus": 1,
                            "HeightFit": heightFit,
                            "StoreClusterFit": storeClusterFit,
                            "PlanogramFit": planogramFit,
                            "ModulesFit": moduleFit,
                            // "Modules": data.modules,
                            // "Height": data.height,
                            // "Width": data.width,
                            // "Displays": data.displays,
                            // "Pallettes": data.pallettes,
                            // "SupplierStands": data.supplierStands,
                            // "Bins": data.bins,
                            "Fits": fits
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
            removeFromStore(item, state, Status) {
                let self = this
                let text = ""
                if (item.requiredInStore == true) {
                    text = "Do you want to innclude this category in this store?"
                } else {
                    text = "Are you sure you want to remove this category ?"
                }
                self.$refs.YesNoModal.show(text, data => {
                    if (data) {
                        self.remove(item, state, Status, data => {
                            self.method(item)
                        })
                    }
                })

                // self.createPlanoGramDetailTX(tmp)
            },
            remove(listItem, state, Status, callback) {
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
                console.log(Status);

                listItem.requiredInStore = state
                listItem.planogramStoreStatus = Status
                console.log(listItem);

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