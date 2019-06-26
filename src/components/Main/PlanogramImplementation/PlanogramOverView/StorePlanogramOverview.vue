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
                <v-btn @click="assignGroups">
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

            <StorePlanograms ref="StorePlanograms" />
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

    export default {
        props: ['ProjectName', 'selectedProject'],
        components: {
            grid,
            YesNoModal,
            AgGridVue,
            PlanogramDetailsSelector,
            StorePlanograms
        },
        data() {
            return {
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
                        text: "Variation Requested"
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
                if(data.length<1){
                    alert("Please select at least one store")
                    return
                }
                let count = 0
                self.$refs.PlanogramDetailsSelector.show(null, false, detailID => {
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
            assignPlanogramToStoreNoRefresh(listItem, detailID, callback) {
                let self = this;
                self.checkFits(listItem, data, fits => {
                   
                    let item = {
                        "id": listItem.id,
                        "store_ID": listItem.store_ID,
                        "project_ID": self.selectedProject,
                        "planogramDetail_ID": detailID.id,
                        "planogramStoreStatus": 1,
                        // "Modules": detailID.modules,
                        // "Height": detailID.height,
                        // "Width": detailID.width,
                        // "Displays": detailID.displays,
                        // "Pallettes": detailID.pallettes,
                        // "SupplierStands": detailID.supplierStands,
                        // "Bins": detailID.bins,
                        "Fits": fits

                    }
                    Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                    Axios.post(process.env.VUE_APP_API + 'Store_Planogram/Save', item)
                        .then(r => {
                            console.log(r);
                            delete Axios.defaults.headers.common["TenantID"];
                        }).catch(e => {
                            console.log(e);
                            delete Axios.defaults.headers.common["TenantID"];
                        })
                })
            },

            assignPlanogramToStore(listItem) {
                let self = this;
                let moduleFit=false
                let heightFit=false
                let storeClusterFit = false
                let planogramFit = false
                self.$refs.PlanogramDetailsSelector.show(listItem, true, data => {
                    self.checkFits(listItem, data, fits => {
                        console.log(listItem.modules+ " : "+ data.modules)
                      console.log(listItem.modules < data.modules);
                      
                      if(listItem.modules< data.modules){
                            moduleFit=true
                        }
                        if(listItem.height< data.height){
                            heightFit=true
                        }
                        if(listItem.cluster!= data.clusterName){
                            storeClusterFit=true
                        }
                        let item = {
                            "id": listItem.id,
                            "store_ID": listItem.store_ID,
                            "project_ID": self.selectedProject,
                            "planogramDetail_ID": data.id,
                            "planogramStoreStatus": 1,
                            "HeightFit":heightFit,
                            "StoreClusterFit":storeClusterFit,
                            "PlanogramFit":planogramFit,
                            "ModulesFit":moduleFit,
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
                                self.getStorePlanograms()
                                delete Axios.defaults.headers.common["TenantID"];
                            }).catch(e => {
                                console.log(e);
                                delete Axios.defaults.headers.common["TenantID"];
                            })
                    })

                })
            },
            unassignPlanogram(listItem){
                let self = this
                  self.$refs.YesNoModal.show("Do you want to remove this Planogram?", data => {
                    if (data) {
                        
                let moduleFit=false
                let heightFit=false
                let storeClusterFit = false
                let planogramFit = false
                  
                       
                        let item = {
                            "id": listItem.id,
                            "store_ID": listItem.store_ID,
                            "project_ID": self.selectedProject,
                            "planogramDetail_ID": null,
                            "planogramStoreStatus": 0,
                            "HeightFit":heightFit,
                            "StoreClusterFit":storeClusterFit,
                            "PlanogramFit":planogramFit,
                            "ModulesFit":moduleFit,
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
                self.getStorePlanograms()
            },

        }
    }
</script>