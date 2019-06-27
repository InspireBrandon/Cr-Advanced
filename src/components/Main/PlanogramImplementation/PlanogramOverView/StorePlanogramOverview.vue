<template>
    <v-dialog persistent fullscreen v-model="storeView">
        <v-card>
            <v-toolbar color="primary" dark>
                <v-toolbar-title>
                    Planogram Overview: <strong>{{title}}</strong>
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon flat dark @click="storeView=false">
                    <v-icon>close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-toolbar dark flat dense>
                <v-btn @click="assignGroups" color="blue-grey darken-2">
                    group assign
                </v-btn>

                <!-- <v-menu>
                    <v-btn slot="activator">options</v-btn>
                    <v-list>
                        <v-list-tile>asdf</v-list-tile>
                        <v-list-tile>asdf</v-list-tile>
                        <v-list-tile>asdf</v-list-tile>
                    </v-list>
                </v-menu> -->
            </v-toolbar>
            <grid ref="grid" :getRowData="getStorePlanograms" :selectedProject="selectedProject" :rowData="rowData"
                :assign="assignGroups" />

            <StorePlanograms ref="StorePlanograms" :getStoreData="getStorePlanograms" />
            <PlanogramDetailsSelector :PlanoName="ProjectName.text" ref="PlanogramDetailsSelector" />
            <YesNoModal ref="YesNoModal" />

        </v-card>
    </v-dialog>
</template>
<script>
    import Axios from 'axios'
    import YesNoModal from '@/components/Common/YesNoModal'

    import PlanogramDetailsSelector from '@/components/Common/PlanogramDetailsSelector'
    import StorePlanograms from '@/components/Main/PlanogramImplementation/StoreOverView/StorePlanograms'
    import {
        AgGridVue
    } from "ag-grid-vue";
    import grid from "./grid.vue"
import { setTimeout } from 'timers';

    export default {
        props: ['ProjectName', 'selectedProject',],
        components: {
            grid,
            YesNoModal,
            AgGridVue,
            PlanogramDetailsSelector,
            StorePlanograms
        },
        data() {
            return {
                index:null,
                rowData: [],
                title: null,
                StoreClusters: [],
                allStoreDialog: false,
                StoreStatusList: [{
                        text: "Unassigned"
                    }, {
                        text: "Assigned"
                    },
                    {
                        text: "Distrubuted"
                    },
                    {
                        text: "Implementation In Progress"
                    },
                    {
                        text: "Implemented"
                    },
                    {
                        text: "Variation"
                    }, {
                        text: "On Hold"
                    }
                ],
                currentStorePlanograms: [],
                storeView: false,
            }
        },
        methods: {

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
            Distribute(data) {
                let self = this;

                data.planogramStoreStatus = 2
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                Axios.post(process.env.VUE_APP_API + 'Store_Planogram/Save', data)
                    .then(r => {
                        console.log(r);
                        delete Axios.defaults.headers.common["TenantID"];
                        self.getStorePlanograms()
                    }).catch(e => {
                        console.log(e);
                        delete Axios.defaults.headers.common["TenantID"];
                        callback(e)
                    })
            },
            assignGroups() {
                let self = this
                let data = self.$refs.grid.getSelectedRows()
                if (data.length < 1) {
                    alert("Please select at least one store")
                    return
                }
                let count = 0
                self.$refs.PlanogramDetailsSelector.show(data[0], true, detailID => {
                    data.forEach(e => {
                        self.assignPlanogramToStoreNoRefresh(e.data, detailID, () => {
                            count = count + 1
                            if (data.length == count) {
                                self.getStorePlanograms()
                            }
                        })
                    })
                })
            },
            assignPlanogramToStoreNoRefresh(listItem, data, callback) {
                let self = this;
                let moduleFit = false
                let heightFit = false
                let storeClusterFit = false
                let planogramFit = false
                self.checkFits(listItem, data, fits => {
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
                        "store_ID": listItem.store_ID,
                        "project_ID": self.selectedProject,
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
                            console.log(r);
                            delete Axios.defaults.headers.common["TenantID"];
                            callback()
                        }).catch(e => {
                            console.log(e);
                            delete Axios.defaults.headers.common["TenantID"];
                            callback()
                        })
                })
            },

            assignPlanogramToStore(data) {
                let self = this;
                console.log(data);
                let idx= data.rowIndex
                let moduleFit = false
                let heightFit = false
                let storeClusterFit = false
                let planogramFit = false
                let listItem=data.data
                let node = data.node
                self.$refs.PlanogramDetailsSelector.show(listItem, true, data => {

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
                            "store_ID": listItem.store_ID,
                            "project_ID": self.selectedProject,
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
                                listItem.id=r.data.store_Planogram.id
                                listItem.fileName = data.fileName
                                listItem.currentStatusText = "Assigned"
                                listItem.heightFit = heightFit
                                listItem.storeClusterFit = storeClusterFit
                                listItem.planogramFit = planogramFit
                                listItem.modulesFit = moduleFit
                                listItem.fits = fits
                                listItem.planogramStoreStatus= 1
                                listItem.planogramDetail_ID=data.id
                                listItem.detailHeight = data.height
                                listItem.detailModules = data.modules
                                node.setData(listItem)

                                self.$refs.grid.redrawAllRows()
                                self.index = idx
                                // self.getStorePlanograms()
                                delete Axios.defaults.headers.common["TenantID"];
                            }).catch(e => {
                                console.log(e);
                                delete Axios.defaults.headers.common["TenantID"];
                            })
                    })

                })
            },
            unassignPlanogram(listItem) {
                let self = this
                self.$refs.YesNoModal.show("Do you want to remove this Planogram?", data => {
                    if (data) {

                        let moduleFit = false
                        let heightFit = false
                        let storeClusterFit = false
                        let planogramFit = false


                        let item = {
                            "id": listItem.id,
                            "store_ID": listItem.store_ID,
                            "project_ID": self.selectedProject,
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
                                self.getStorePlanograms()
                                delete Axios.defaults.headers.common["TenantID"];
                            }).catch(e => {
                                console.log(e);
                                delete Axios.defaults.headers.common["TenantID"];
                            })
                    }
                })


            },
            openStoreOver(item) {
                let self = this
                self.$refs.StorePlanograms.open(item)
            },
            getStorePlanograms() {
                let self = this

                self.currentStorePlanograms = [];

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + 'Store_Planogram?project_ID=' + self.selectedProject)
                    .then(r => {
                        self.rowData = []
                        self.currentStorePlanograms = []
                        self.currentStorePlanograms = r.data.store_PlanogramList;
                        self.currentStorePlanograms.forEach(e => {
                            e.GeneratedName = self.GenerateName(e)
                            e.currentStatusText = self.StoreStatusList[e.planogramStoreStatus].text
                        })
                        self.rowData = self.currentStorePlanograms
                        setTimeout(() => {
                        }, 300);
                        console.log(self.rowData);
                    })
            },
            GenerateName(data) {
                if (data.planogramID == 0) {
                    return null
                }
                let planogramName = data.planogramName
                if (planogramName != null) {

                    planogramName += " - " + data.monthsBetween + "MMA";
                } else {
                    planogramName += " - " + data.dateFromString + " to " + data.dateToString;
                }
                if (data.tag != null && data.tag != "")
                    planogramName += data.tag;

                if (data.storeCluster != null && data.storeCluster != "") {
                    planogramName += " - " + data.storeCluster;
                }

                if (data.storeName != null && data.storeName != "") {
                    planogramName += " - " + data.storeName;
                }

                if (planogramName != "")
                    planogramName += " - XXX";

                planogramName += " - " + data.modules + " Module " + "(" + data.height + "M" + " x " +
                    data.width + "M)";

                if (planogramName[1] == "-")
                    planogramName = planogramName.replace(' -', "");

                if (planogramName != "") {
                    planogramName += " - D" + data.displays;
                    planogramName += " - P" + data.pallettes;
                    planogramName += " - S" + data.supplierStands;
                    planogramName += " - B" + data.bins;
                }
                return planogramName
            },
            open() {
                let self = this
                self.title = self.ProjectName.text
                self.storeView = true
                self.$refs.grid.resize()
                self.getStorePlanograms()
            },

        }
    }
</script>