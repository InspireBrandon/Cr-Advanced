<template>
    <v-card tile>
        <v-toolbar color="grey darken-3" dark dense flat>
            <v-toolbar-title v-if="selectedView==0">
                Planogram Distribution: <strong v-if="selectedProject!=null">{{title}}</strong>
            </v-toolbar-title>
            <v-toolbar-title v-if="selectedView==1">
                Store Overview: <strong v-if="selectedStore!=null">{{storeTitle}}</strong>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <!-- <v-btn-toggle round v-model="selectedView" class="transparent" mandatory>
                <v-btn class="elevation-0" style="width: 100px" round @click="changeView(0)" color="primary">
                    Planogram
                </v-btn>
                <v-btn class="elevation-0" style="width: 100px" round @click="changeView(1)" color="primary">
                    Store
                </v-btn>
            </v-btn-toggle> -->
        </v-toolbar>
        <v-toolbar dark flat>
            <v-menu dark offset-y style="margin-bottom: 10px;">
                <v-btn color="primary" slot="activator">
                    Actions
                </v-btn>
                <v-list>
                    <v-list-tile @click="assignGroups">
                        <v-list-tile-title>Group Assign</v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile @click="groupRemove">
                        <v-list-tile-title>Group Remove</v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile @click="groupPark">
                        <v-list-tile-title>Group Park</v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile @click="sendMail">
                        <v-list-tile-title>Send Mail</v-list-tile-title>
                    </v-list-tile>
                </v-list>
            </v-menu>

            <v-toolbar-items>
                <v-autocomplete disabled v-if="selectedView==1" style="margin-left: 10px; margin-top: 8px; width: 300px"
                    :items="stores" @change="GetStoreData()" return-object v-model="selectedStore" label="Store">
                </v-autocomplete>
                <v-autocomplete disabled v-if="selectedView==0" style="margin-left: 10px; margin-top: 8px; width: 300px"
                    :items="projectGroups" @change="getProjectsByProjectGroup()" v-model="selectedProjectGroup"
                    label="Project Group">
                </v-autocomplete>

                <v-autocomplete disabled v-if="selectedView==0" style="margin-left: 10px; margin-top: 8px; width: 300px"
                    :items="projects" @change="getStorePlanograms()" v-model="selectedProject" label="Project">
                </v-autocomplete>

                <v-autocomplete disabled @change="updateProjectOwner"
                    v-if="projectOwer != undefined && projectOwer != null"
                    style="margin-left: 10px; margin-top: 8px; width: 300px" :items="systemUsers" v-model="projectOwer"
                    label="Project Owner">
                </v-autocomplete>
            </v-toolbar-items>

        </v-toolbar>
        <grid ref="grid" :getRowData="getStorePlanograms"
            :selectedProject="selectedProject" :rowData="rowData" :assign="assignGroups" :Planogram_ID="Planogram_ID"
            :heads="headers" />

        <StorePlanograms ref="StorePlanograms" :getStoreData="getStorePlanograms" />
        <PlanogramDetailsSelector :PlanoName="title" ref="PlanogramDetailsSelector" />
        <YesNoModal ref="YesNoModal" />
        <SystemUserSelector ref="SystemUserSelector" />
        <UserNotesModal ref="UserNotesModal" />
    </v-card>

</template>
<script>
    import Axios from 'axios'
    import YesNoModal from '@/components/Common/YesNoModal'
    import SystemUserSelector from '@/components/Common/SystemUserSelector'
    import UserNotesModal from '@/components/Common/UserNotesModal'
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
        props: ['ProjectName', 'userAccess'],
        components: {
            SystemUserSelector,
            grid,
            YesNoModal,
            AgGridVue,
            PlanogramDetailsSelector,
            StorePlanograms,
            UserNotesModal
        },
        data() {
            return {
                storeTitle: null,
                selectedView: 0,
                projectsObject: [],
                Planogram_ID: null,
                projects: [],
                projectGroups: [],
                selectedProjectGroup: null,
                projectOwer: null,
                systemUsers: [],
                index: null,
                rowData: [],
                title: null,
                StoreClusters: [],
                allStoreDialog: false,
                selectedProject: null,
                stores: [],
                selectedStore: null,
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
                        text: "Parked"
                    },
                    {
                        text: "Recalled"
                    }
                ],
                currentStorePlanograms: [],
                storeView: false,
                currentProject: null,
                headers: []
            }
        },
        mounted() {
            let self = this;
            this.open()
            this.getSystemUsers();
            this.getStores()

            let encoded_details = jwt.decode(sessionStorage.accessToken);
            self.systemUserID = encoded_details.USER_ID;

            self.headers = [{
                    "headerName": "Store",
                    "checkboxSelection": true,
                    "field": "storeName",
                    "headerCheckboxSelection": true,
                    "headerCheckboxSelectionFilteredOnly": true,
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
                    "hide": false,
                    "minWidth": 340,
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
                        'success-green': 'data.storeClusterFit == false && (data.planogramStoreStatus!=5 &&  data.planogramStoreStatus!=0 && data.planogramStoreStatus!=7 && data.planogramStoreStatus!=6)',
                        'error-red': 'data.storeClusterFit == true && (data.planogramStoreStatus!=5 &&  data.planogramStoreStatus!=0 && data.planogramStoreStatus!=7 && data.planogramStoreStatus!=6)',
                    }
                }, {
                    "headerName": "Custom Cluster",
                    "field": "customCluster",
                    "minWidth": 100,
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
                        'success-green': 'data.modulesFit == false && (data.planogramStoreStatus!=5 &&  data.planogramStoreStatus!=0 && data.planogramStoreStatus!=7 && data.planogramStoreStatus!=6)',
                        'error-red': 'data.modulesFit == true && ( data.planogramStoreStatus!=5 && data.planogramStoreStatus!=0 && data.planogramStoreStatus!=7 && data.planogramStoreStatus!=6)',
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
                }, {
                    "headerName": "Audit",
                    "minWidth": 50,
                    "field": "audit",
                    "cellRendererFramework": "Audit"
                }
            ]
        },
        methods: {
            getStores() {
                let self = this;

                Axios.get(process.env.VUE_APP_API + "Store?db=CR-Devinspire")
                    .then(r => {
                        r.data.forEach(e => {
                            self.stores.push({
                                text: e.storeName,
                                value: e.storeID
                            })
                        })
                    })
                    .catch(e => {})
            },
            GetStoreData() {
                let self = this
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                console.log(self.selectedStore);
                self.storeTitle = self.selectedStore.text

                Axios.get(process.env.VUE_APP_API + `Store_Planogram?Store_ID=${self.selectedStore.value}`)
                    .then(r => {
                        console.log(r);

                        self.rowData = []
                        self.currentStorePlanograms = []
                        self.currentStorePlanograms = r.data.store_PlanogramList;

                        r.data.store_PlanogramList.forEach((e) => {
                            e.GeneratedName = self.GenerateName(e)
                            e.currentStatusText = self.StoreStatusList[e.planogramStoreStatus].text
                        })

                        self.rowData = self.currentStorePlanograms

                        console.log(self.rowData);

                    }).catch(e => {
                        console.log(e);

                    })
            },
            changeView(type) {
                let self = this
                self.selectedView = type;
                self.headers = []
                self.rowData = []
                self.selectedStore = null
                self.selectedProjectGroup = null
                self.selectedProject = null
                if (type == 0) {
                    self.headers.push({
                        "headerName": "Store",
                        "checkboxSelection": true,
                        "field": "storeName",
                        "headerCheckboxSelection": true,
                        "headerCheckboxSelectionFilteredOnly": true,
                        "minWidth": 200,
                    })
                } else {
                    self.headers.push({
                        "headerName": "Project Group",
                        "field": "groupName",
                        "minWidth": 200,
                    }, {
                        "headerName": "Planogram",
                        "field": "projectName",
                        "minWidth": 200,
                    })
                }

                self.headers.push({
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
                    "hide": false,
                    "minWidth": 340,
                    "cellRendererFramework": "Button"
                }, {
                    "headerName": "Best Fit",
                    "cellRendererFramework": "Fits",
                    "minWidth": 50
                }, {
                    "headerName": "Custom Cluster",
                    "field": "customCluster",
                    "minWidth": 100,
                }, {
                    "headerName": "Store Cluster",
                    "field": "cluster",
                    "minWidth": 75,
                    cellClassRules: {
                        'success-green': 'data.storeClusterFit == false && (data.planogramStoreStatus!=5 &&  data.planogramStoreStatus!=0 && data.planogramStoreStatus!=7 && data.planogramStoreStatus!=6)',
                        'error-red': 'data.storeClusterFit == true && (data.planogramStoreStatus!=5 &&  data.planogramStoreStatus!=0 && data.planogramStoreStatus!=7 && data.planogramStoreStatus!=6)',
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
                        'success-green': 'data.modulesFit == false && (data.planogramStoreStatus!=5 &&  data.planogramStoreStatus!=0 && data.planogramStoreStatus!=7 && data.planogramStoreStatus!=6)',
                        'error-red': 'data.modulesFit == true && ( data.planogramStoreStatus!=5 && data.planogramStoreStatus!=0 && data.planogramStoreStatus!=7 && data.planogramStoreStatus!=6)',
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
                }, {
                    "headerName": "Audit",
                    "minWidth": 50,
                    "field": "audit",
                    "cellRendererFramework": "Audit"
                })
            },
            sendMail() {
                let self = this

                self.$refs.UserNotesModal.show(modalData => {
                    let request = {
                        systemUserID: null,
                        notes: null,
                        projectTXGroup_ID: null,
                        type: null,
                        status: null,
                        project_ID: self.selectedProject,
                        project_Group_ID: self.selectedProjectGroup
                    };

                    let projectTXGroupRequest = {
                        projectID: request.project_ID
                    }

                    self.createProjectTransactionGroup(projectTXGroupRequest, newGroup => {
                        request.systemUserID = modalData.systemUserID;
                        request.actionedByUserID = null;
                        request.rollingUserID = null;
                        request.notes = modalData.notes;
                        request.projectTXGroup_ID = newGroup.id;
                        request.type = 7;
                        request.status = 43;
                        self.createProjectTransaction(request, data => {})
                    })
                })
            },
            showStore(data) {
                let self = this
                self.$refs.StorePlanograms.show(data)
            },
            viewPlanogram(data) {
                let self = this;

                self.$router.push(`/PlanogramImplementation/${self.selectedProject}/${data.systemFileID}/21`);
            },
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
            getStoreUser(StoreID, callback) {
                let self = this
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                Axios.get(process.env.VUE_APP_API + `SystemUser?store_ID=${StoreID}`).then(r => {
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
            setImplemented(params) {
                let self = this;
                let encoded_details = jwt.decode(sessionStorage.accessToken);
                let systemUserID = encoded_details.USER_ID;
                let data = params.data
                let systemFile = data.systemFileID
                console.log(systemFile);
                let node = params.node
                console.log(data);
                data.planogramStoreStatus = 4
                data.ImmplementedDate = new Date(),
                    Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                Axios.post(process.env.VUE_APP_API + 'Store_Planogram/Save', data)
                    .then(r => {
                        data.currentStatusText = "Implemented"
                        node.setData(data)
                    }).catch(e => {
                        console.log(e);
                        delete Axios.defaults.headers.common["TenantID"];
                    })
            },
            Distribute(rowData) {
                let self = this;
                let encoded_details = jwt.decode(sessionStorage.accessToken);
                let systemUserID = encoded_details.USER_ID;
                let data = rowData.data
                let systemFile = data.systemFileID
                let node = rowData.node

                self.getStoreUser(data.store_ID, storeUserCallback => {
                    if (storeUserCallback.length > 0) {
                        if (storeUserCallback.length > 1) {
                            alert("there are 2 users assigned to this store assigning to first one")
                        }
                        data.planogramStoreStatus = 2
                        Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                        Axios.post(process.env.VUE_APP_API + 'Store_Planogram/Save', data)
                            .then(r => {
                                let groupRequest = {
                                    ProjectID: data.project_ID
                                }

                                self.createProjectTransactionGroup(groupRequest, callback => {
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

                                    self.createProjectTransaction(TXrequest, txCallback => {
                                        data.currentStatusText = "Distributed"
                                        node.setData(data)
                                        delete Axios.defaults.headers.common["TenantID"];
                                    })

                                })

                            }).catch(e => {
                                delete Axios.defaults.headers.common["TenantID"];
                                callback(e)
                            })
                    } else {
                        alert("There are no users assigned to this store")
                    }
                })

            },
            groupRemove() {
                let self = this
                self.removeGroups(callback => {
                    if (self.selectedView == 0) {
                        self.getStorePlanograms()
                    } else {
                        self.GetStoreData()
                    }
                })

            },
            removeGroups(callback) {
                let self = this
                let deleteRows = self.$refs.grid.getSelectedRows()
                if (deleteRows.length < 1) {
                    alert("Please select at least one store")
                    return
                }
                let count = 0

                self.$refs.YesNoModal.show("Do you want to remove this Planogram?", data => {
                    if (data) {
                        deleteRows.forEach(rowstuff => {
                            let listItem = rowstuff.data
                            let node = rowstuff.node
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
                                    delete Axios.defaults.headers.common["TenantID"];
                                }).catch(e => {
                                    delete Axios.defaults.headers.common["TenantID"];
                                })
                        })
                        callback()
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
                self.$refs.PlanogramDetailsSelector.show(data[0], true, self.Planogram_ID, detailID => {
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
                            delete Axios.defaults.headers.common["TenantID"];
                            callback()
                        }).catch(e => {
                            delete Axios.defaults.headers.common["TenantID"];
                            callback()
                        })
                })
            },
            assignPlanogramToStore(data) {
                let self = this;
                let idx = data.rowIndex
                let moduleFit = false
                let heightFit = false
                let storeClusterFit = false
                let planogramFit = false
                let listItem = data.data

                let node = data.node
                self.$refs.PlanogramDetailsSelector.show(listItem, true, self.Planogram_ID, data => {

                    self.checkFits(listItem, data, fits => {

                        if (listItem.modules < data.modules) {
                            moduleFit = true
                        }
                        let Lheight = listItem.height * 0.9
                        let Uheight = listItem.height * 1.1

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
                                delete Axios.defaults.headers.common["TenantID"];
                            })
                    })

                })
            },
            replacePlanogram(data) {
                let self = this;
                let idx = data.rowIndex
                let moduleFit = false
                let heightFit = false
                let storeClusterFit = false
                let planogramFit = false
                let listItem = data.data
                let node = data.node

                self.$refs.PlanogramDetailsSelector.show(listItem, true, self.Planogram_ID, data => {

                    self.checkFits(listItem, data, fits => {
                        if (listItem.modules < data.modules) {
                            moduleFit = true
                        }

                        let Lheight = listItem.height * 0.9
                        let Uheight = listItem.height * 1.1

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
                            "Fits": fits
                        }

                        Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                        Axios.post(process.env.VUE_APP_API + 'Store_Planogram/Save', item)
                            .then(r => {
                                listItem.id = r.data.store_Planogram.id
                                listItem.fileName = data.fileName
                                listItem.currentStatusText = "Distrubuted"
                                listItem.heightFit = heightFit
                                listItem.storeClusterFit = storeClusterFit
                                listItem.project_ID = self.selectedProject
                                listItem.planogramFit = planogramFit
                                listItem.modulesFit = moduleFit
                                listItem.fits = fits
                                listItem.planogramStoreStatus = 2
                                listItem.planogramDetail_ID = data.id
                                listItem.detailHeight = data.height
                                listItem.detailModules = data.modules
                                listItem.systemFileID = data.systemFileID
                                listItem.rangeID = data.rangeID
                                node.setData(listItem)
                                self.index = idx
                                delete Axios.defaults.headers.common["TenantID"];
                            }).catch(e => {
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

                self.$nextTick(() => {
                    self.currentStorePlanograms = [];

                    Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                    Axios.get(process.env.VUE_APP_API + 'Store_Planogram?project_ID=' + self.selectedProject)
                        .then(r => {
                            self.rowData = []

                            self.projectsObject.forEach(element => {
                                if (element.id == self.selectedProject) {
                                    self.Planogram_ID = element.planogram_ID
                                    self.projectOwer = element.systemUserID;
                                    self.currentProject = element;
                                }
                            });

                            self.currentStorePlanograms = []
                            self.currentStorePlanograms = r.data.store_PlanogramList;
                            self.currentStorePlanograms.forEach(e => {
                                e.currentStatusText = self.StoreStatusList[e.planogramStoreStatus]
                                    .text
                            })
                            self.rowData = self.currentStorePlanograms

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
            getSystemUsers() {
                let self = this;

                Axios.get(process.env.VUE_APP_API + "SystemUser")
                    .then(r => {
                        self.systemUsers = [];

                        r.data.forEach(el => {
                            self.systemUsers.push({
                                text: el.firstname + " " + el.lastname,
                                value: el.systemUserID
                            })
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
                                self.projectsObject = tmp
                                self.projects = [];
                                self.projectOwer = null;

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
                    if (self.$route.params.projectGroupID != null || self.$route.params.projectGroupID != undefined) {
                        self.selectedProjectGroup = parseInt(self.$route.params.projectGroupID)
                        if (self.$route.params.projectID != null && self.$route.params.projectID != undefined) {
                            self.selectedProject = parseInt(self.$route.params.projectID)
                            self.getProjectsByProjectGroup()
                                .then(() => {
                                    self.getStorePlanograms();
                                })
                        }
                    }
                    if (self.$route.params.ProjectID == ":ProjectID") {
                        self.selectedProject = null
                    }
                })
            },
            groupPark() {
                let self = this
                let data = self.$refs.grid.getSelectedRows()
                if (data.length < 1) {
                    alert("Please select at least one store")
                    return
                }
                let text = "Do you want to park these stores?";

                // if (!state)
                //     text = "Do you want to continue distribution to this store?"

                self.$refs.YesNoModal.show(text, val => {
                    if (val) {
                        data.forEach(item => {
                            self.removeFromStore(item, true, 0)
                        })
                    }
                })
            },
            removeFromStore(rowdata, state, Status) {
                let self = this
                let item = rowdata.data
                let node = rowdata.node


                self.remove(item, state, Status, data => {
                    console.log(data)
                    // node.setData(data)
                })
            },
            remove(listItem, state, status, callback) {
                let self = this;

                console.log(listItem);

                if (state == true) {
                    listItem.planogramStoreStatus = 6
                    listItem.currentStatusText = "Parked"
                } else {
                    if (listItem.planogramDetail_ID == null || listItem.planogramDetail_ID == 0) {
                        listItem.currentStatusText = "Unassigned"
                        listItem.planogramStoreStatus = 0
                    } else {
                        listItem.currentStatusText = "Assigned"
                        listItem.planogramStoreStatus = 1
                    }
                }

                listItem.project_ID = self.selectedProject

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                Axios.post(process.env.VUE_APP_API + 'Store_Planogram/Save', listItem)
                    .then(r => {
                        delete Axios.defaults.headers.common["TenantID"];
                        callback(listItem)
                    }).catch(e => {
                        delete Axios.defaults.headers.common["TenantID"];
                        callback(e)
                    })
            },
            parkStoreDistribution(row) {
                let self = this;
                let data = row.data;
                let node = row.node;
            },
            updateProjectOwner() {
                let self = this;

                self.$nextTick(() => {
                    Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                    self.currentProject.systemUserID = self.projectOwer;

                    Axios.put(process.env.VUE_APP_API + "Project", self.currentProject)
                        .then(r => {
                            console.log(r.data);
                        })
                })
            },
            setView(pgID, pid, callback) {
                let self = this;
                self.selectedProjectGroup = pgID;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                self.$nextTick(() => {
                    let projectGroupID = self.selectedProjectGroup
                    Axios.get(process.env.VUE_APP_API +
                            `Project?projectGroupID=${projectGroupID}`)
                        .then(r => {
                            delete Axios.defaults.headers.common["TenantID"];
                            let tmp = r.data.projectList;
                            self.projectsObject = tmp
                            self.projects = [];
                            self.projectOwer = null;

                            tmp.forEach(el => {
                                self.projects.push({
                                    text: el.name,
                                    value: el.id
                                })
                            })

                            self.selectedProject = pid;

                            self.getStorePlanograms();
                        })
                        .catch(e => {
                            delete Axios.defaults.headers.common["TenantID"];
                        })
                })
            }
        }
    }
</script>