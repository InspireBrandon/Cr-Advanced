<template>
    <v-card tile>
        <v-toolbar color="grey darken-3" dark dense flat>
            <v-toolbar-title>
                Planogram Overview: <strong v-if="selectedProject!=null">{{title}}</strong>
            </v-toolbar-title>
            <v-spacer></v-spacer>
        </v-toolbar>
        <v-toolbar dark flat>
            <v-btn @click="assignGroups" color="blue-grey darken-2 ma-2">
                group assign
            </v-btn>
            <v-toolbar-items>
                <v-autocomplete style="margin-left: 10px; margin-top: 8px; width: 300px" :items="projectGroups"
                    @change="getProjectsByProjectGroup()" v-model="selectedProjectGroup" label="Project Group">
                </v-autocomplete>

                <v-autocomplete style="margin-left: 10px; margin-top: 8px; width: 300px" :items="projects"
                    @change="getStorePlanograms()" v-model="selectedProject" label="Project">
                </v-autocomplete>
            </v-toolbar-items>
        </v-toolbar>
        <grid ref="grid" :getRowData="getStorePlanograms" :selectedProject="selectedProject" :rowData="rowData"
            :assign="assignGroups" :Planogram_ID="Planogram_ID" />

        <StorePlanograms ref="StorePlanograms" :getStoreData="getStorePlanograms" />
        <PlanogramDetailsSelector :PlanoName="title" ref="PlanogramDetailsSelector" />
        <YesNoModal ref="YesNoModal" />

    </v-card>

</template>
<script>
    import Axios from 'axios'
    import YesNoModal from '@/components/Common/YesNoModal'
    import jwt from 'jsonwebtoken';
    import PlanogramDetailsSelector from '@/components/Common/PlanogramDetailsSelector'
    import StorePlanograms from '@/components/Main/PlanogramImplementation/StoreOverView/StorePlanograms'
    import {
        AgGridVue
    } from "ag-grid-vue";
    import grid from "./grid.vue"
    import {
        setTimeout
    } from 'timers';

    export default {
        props: ['ProjectName', ],
        components: {
            grid,
            YesNoModal,
            AgGridVue,
            PlanogramDetailsSelector,
            StorePlanograms
        },
        data() {
            return {
                projectsObject:[],
                Planogram_ID:null,
                projects: [],
                projectGroups: [],
                selectedProjectGroup: null,
                index: null,
                rowData: [],
                title: null,
                StoreClusters: [],
                allStoreDialog: false,
                selectedProject: null,
                StoreStatusList: [{
                        text: "Unassigned"
                    },
                    {
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
                    },
                    {
                        text: "On Hold"
                    },
                    {
                        text: "Recalled"
                    }
                ],
                currentStorePlanograms: [],
                storeView: false,
            }
        },
        mounted() {
            this.open()
        },
        methods: {
            showStore(data) {
                let self = this
                self.$refs.StorePlanograms.show(data)
            },
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

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.post(process.env.VUE_APP_API + `ProjectTX`, request).then(r => {
                    delete Axios.defaults.headers.common["TenantID"];
                    console.log(`ProjectTX`);
                    console.log(r);

                    callback(r.data.projectTX)
                })
            },
            getStoreUser(StoreID, callback) {
                let self = this
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                Axios.get(process.env.VUE_APP_API + `SystemUser?store_ID=${StoreID}`).then(r => {
                    console.log("getStoreUser");
                    console.log(r);
                    callback(r.data)
                })
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
            Distribute(rowData) {
                let self = this;
                let encoded_details = jwt.decode(sessionStorage.accessToken);
                let systemUserID = encoded_details.USER_ID;
                let data = rowData.data
                let systemFile = data.systemFileID
                console.log(systemFile);

                let node = rowData.node
                console.log(data);

                self.getStoreUser(data.store_ID, storeUserCallback => {
                    if (storeUserCallback.length > 0) {
                        if (storeUserCallback.length > 1) {
                            alert("there are 2 users assigned to this store assigning to first one")
                        }
                        data.planogramStoreStatus = 2
                        Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                        Axios.post(process.env.VUE_APP_API + 'Store_Planogram/Save', data)
                            .then(r => {
                                console.log(r);
                                let groupRequest = {
                                    ProjectID: data.project_ID
                                }

                                self.createProjectTransactionGroup(groupRequest, callback => {
                                    console.log("createProjectTransactionGroup");
                                    let TXrequest = {
                                        "project_ID": data.project_ID,
                                        "projectTXGroup_ID": callback.id,
                                        "type": 3,
                                        "storeCluster_ID": data.clusterID,
                                        "store_ID": data.store_ID,
                                        "status": 13,
                                        "systemUserID": storeUserCallback[0]
                                            .systemUserID, //store user
                                        "systemFileID": systemFile,
                                        "rangeFileID": data.rangeID,
                                    }
                                    console.log(TXrequest);

                                    self.createProjectTransaction(TXrequest, txCallback => {
                                        console.log("txCallback");
                                        console.log(txCallback);
                                        data.currentStatusText = "Distributed"
                                        node.setData(data)
                                        delete Axios.defaults.headers.common["TenantID"];
                                    })

                                })

                            }).catch(e => {
                                console.log(e);
                                delete Axios.defaults.headers.common["TenantID"];
                                callback(e)
                            })
                    } else {
                        alert("There are no users assigned to this store")
                    }
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
                self.$refs.PlanogramDetailsSelector.show(data[0], true,self.Planogram_ID, detailID => {
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
                    let Lheight = listItem.height * 0.9
                    let Uheight = listItem.height * 1.1
                    if (parseFloat(data.height) < Lheight || Uheight < parseFloat(data.height)) {
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
                let idx = data.rowIndex
                let moduleFit = false
                let heightFit = false
                let storeClusterFit = false
                let planogramFit = false
                let listItem = data.data


                let node = data.node
                self.$refs.PlanogramDetailsSelector.show(listItem, true, self.Planogram_ID,data => {

                    self.checkFits(listItem, data, fits => {

                        console.log(listItem.modules + " : " + data.modules)
                        console.log(listItem.modules < data.modules);

                        if (listItem.modules < data.modules) {
                            moduleFit = true
                        }
                        let Lheight = listItem.height * 0.9
                        let Uheight = listItem.height * 1.1
                        console.log(Lheight + " < " + data.height + " < " + Uheight);

                        if ((parseFloat(data.height) < Lheight || Uheight < parseFloat(data.height))) {
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
                                listItem.id = r.data.store_Planogram.id
                                listItem.fileName = data.fileName
                                listItem.currentStatusText = "Assigned"
                                listItem.heightFit = heightFit
                                listItem.storeClusterFit = storeClusterFit
                                listItem.project_ID = self.selectedProject
                                listItem.planogramFit = planogramFit
                                listItem.modulesFit = moduleFit
                                listItem.fits = fits
                                listItem.planogramStoreStatus = 1
                                listItem.planogramDetail_ID = data.id
                                listItem.detailHeight = data.height
                                listItem.detailModules = data.modules
                                listItem.systemFileID = data.systemFileID
                                listItem.rangeID = data.rangeID
                                node.setData(listItem)

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
            unassignPlanogram(rowstuff) {
                let self = this
                let listItem = rowstuff.data
                let node = rowstuff.node
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
                                listItem.planogramDetail_ID = null
                                listItem.heightFit = false
                                listItem.fileName = null
                                listItem.modulesFit = false
                                listItem.storeClusterFit = false
                                listItem.planogramFit = false
                                listItem.fits = false
                                listItem.systemFileID = 0
                                listItem.rangeID = 0
                                listItem.planogramStoreStatus = 0
                                listItem.currentStatusText = "Unassigned"
                                node.setData(listItem)
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
                console.log("[REFRESH]");
                
                self.$nextTick(() => {
                    self.currentStorePlanograms = [];

                    Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                    Axios.get(process.env.VUE_APP_API + 'Store_Planogram?project_ID=' + self.selectedProject)
                        .then(r => {
                            self.rowData = []
                            console.log(self.projectsObject);
                            
                            self.projectsObject.forEach(element => {
                                if(element.id==self.selectedProject){
                                    self.Planogram_ID=element.planogram_ID
                                }
                            });
                            self.currentStorePlanograms = []
                            self.currentStorePlanograms = r.data.store_PlanogramList;
                            self.currentStorePlanograms.forEach(e => {
                                e.currentStatusText = self.StoreStatusList[e.planogramStoreStatus]
                                    .text
                            })
                            self.rowData = self.currentStorePlanograms
                            setTimeout(() => {}, 300);
                            console.log(self.rowData);
                            delete Axios.defaults.headers.common["TenantID"];
                            self.projects.forEach(e => {
                                if (e.value == self.selectedProject) {
                                    self.title = e.text
                                }
                            })
                        

                        })
                })
            },
            getProjectGroups() {
                let self = this;

                return new Promise((resolve, reject) => {
                    Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                    Axios.get(process.env.VUE_APP_API + `ProjectGroup`)
                        .then(r => {
                            delete Axios.defaults.headers.common["TenantID"];
                            let tmp = r.data.projectGroupList;

                            self.projectGroups = [];

                            tmp.forEach(el => {
                                self.projectGroups.push({
                                    text: el.name,
                                    value: el.id
                                })
                            })

                            resolve(r);
                        })
                        .catch(e => {
                            delete Axios.defaults.headers.common["TenantID"];
                            reject(e);
                        })
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
            getProjectsByProjectGroup() {
                let self = this;
                return new Promise((resolve, reject) => {
                    Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                    self.$nextTick(() => {


                        let projectGroupID = self.selectedProjectGroup
                        Axios.get(process.env.VUE_APP_API +
                                `Project?projectGroupID=${projectGroupID}`)
                            .then(r => {
                                delete Axios.defaults.headers.common["TenantID"];
                                let tmp = r.data.projectList;
                                self.projectsObject=tmp    
                                self.projects = [];

                                tmp.forEach(el => {
                                    self.projects.push({
                                        text: el.name,
                                        value: el.id
                                    })
                                })
                                resolve();
                            })
                            .catch(e => {
                                delete Axios.defaults.headers.common["TenantID"];

                                reject();
                            })
                    })
                })
            },
            open() {
                let self = this

                self.getProjectGroups().then(r => {
                    console.log("[START]");
                    console.log(self.projectGroups);
                    if (self.$route.params.projectGroupID != null || self.$route.params.projectGroupID !=
                        undefined) {
                        self.selectedProjectGroup = parseInt(self.$route.params.projectGroupID)
                        if (self.$route.params.ProjectID != null || self.$route.params.ProjectID != undefined) {
                            self.selectedProject = parseInt(self.$route.params.ProjectID)
                            self.getProjectsByProjectGroup()
                                .then(() => {
                                    self.getStorePlanograms();
                                })
                        }
                    }
                })
            },
        }
    }
</script>