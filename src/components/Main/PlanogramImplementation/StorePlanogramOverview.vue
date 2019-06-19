<template>
    <v-dialog fullscreen v-model="storeView">
        <v-card>
            <v-toolbar flat color="primary" dark>
                <v-toolbar-title>
                    Store Planogram Overview: {{title}}
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon flat dark @click="storeView=false">
                    <v-icon>close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-toolbar dark flat dense>
                <v-menu>
                    <v-btn slot="activator">options</v-btn>
                    <v-list>
                        <v-list-tile>asdf</v-list-tile>
                        <v-list-tile>asdf</v-list-tile>
                        <v-list-tile>asdf</v-list-tile>
                    </v-list>
                </v-menu>
            </v-toolbar>
            <grid ref="grid" :selectedProject="selectedProject" :rowData="rowData" />


            
            <StorePlanograms  ref="StorePlanograms" />
            <PlanogramDetailsSelector :PlanoName="ProjectName.text" ref="PlanogramDetailsSelector" />
        </v-card>
    </v-dialog>
</template>
<script>
    import Axios from 'axios'
    import PlanogramDetailsSelector from '@/components/Common/PlanogramDetailsSelector'
    import StorePlanograms from './StorePlanograms.vue'
    import {
        AgGridVue
    } from "ag-grid-vue";
    import grid from "./grid.vue"



    export default {

        props: ['ProjectName', 'selectedProject'],
        components: {
            grid,
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
                headers: [{
                    "headerName": "Store",
                    "field": "storeName"
                },{
                    "headerName": "Cluster Name",
                    "field": "clusterName"
                }, {
                    "headerName": "Modules",
                    "field": "modules"
                }, {
                    "headerName": "Height",
                    "field": "height"
                }, {
                    "headerName": "Width",
                    "field": "width"
                }, {
                    "headerName": "Displays",
                    "field": "displays"
                }, {
                    "headerName": "Palletes",
                    "field": "palletes"
                }, {
                    "headerName": "Supplier Stands",
                    "field": "supplierStands"
                }, {
                    "headerName": "Bins",
                    "field": "bins"
                }, {
                    "headerName": "Current Status",
                    "field": "currentStatusText"
                }, {
                    "headerName": "Options",
                    "field": "Options"
                }, {
                    "headerName": "",
                    "editable": false,
                    "hide": false,
                    "pinned": "right",
                    "maxWidth": 100,
                    "minWidth": 100,
                    "cellRendererFramework": "Button"
                }],
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
                currentStorePlanograms: [],
                storeView: false,
            }
        },
        methods: {
            assignPlanogramToStore(listItem) {
                let self = this;
                self.$refs.PlanogramDetailsSelector.show(listItem,true, data => {
                  
                    let item = {
                        "id": listItem.id,
                        "store_ID": listItem.store_ID,
                        "project_ID": self.selectedProject,
                        "planogramDetail_ID": data,
                        "planogramStoreStatus": 1,
                    }
                    Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                    Axios.post(process.env.VUE_APP_API + 'Store_Planogram/Save', item)
                        .then(r => {
                            self.getStorePlanograms()
                            delete Axios.defaults.headers.common["TenantID"];
                        }).catch(e => {
                            delete Axios.defaults.headers.common["TenantID"];

                        })


                })
            },
            UpdateLine(item) {
                let self = this
                self.createPlanoGramDetailTX(item)
                // create new detail tx
                // update details then update store_planogram if necesssary

            },
            createPlanoGramDetailTX(item) {
                let self = this
                let detailsItem = null;
              
                if (item.planogramName == null) {
                    item.planogramName = "No assigned Planogram"
                }
                if (item.tag == null) {
                    item.tag = "NPA"
                }
                if (item.storeCluster == null) {
                    item.storeCluster = "L TM2"
                }
                if (item.clusterType == null) {
                    item.clusterType = "store"
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
                               
                                delete Axios.defaults.headers.common["TenantID"];
                            }).catch(e => {
                                delete Axios.defaults.headers.common["TenantID"];

                            })


                        delete Axios.defaults.headers.common["TenantID"];
                    })
                // .catch(err => {
                // alert("THE BIG OOF")
                // })
            },
            getStoreClusters() {
                let self = this
                self.StoreClusters = []
                Axios.get(process.env.VUE_APP_API + `Cluster/Store`).then(r => {

                    r.data.forEach(element => {
                        self.StoreClusters.push({
                            text: element.displayname,
                            value: element.id
                        })
                    })
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
                        self.rowData=[]   
                        self.currentStorePlanograms=[]    
                        self.currentStorePlanograms = r.data.store_PlanogramList;
                        self.currentStorePlanograms.forEach(e => {
                            e.GeneratedName = self.GenerateName(e)
                            e.currentStatusText = self.StoreStatusList[e.planogramStoreStatus].text
                        })
                        self.rowData = self.currentStorePlanograms
                        console.log("overview");
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