<template>
    <v-dialog fullscreen v-model="storeView">
        <v-card>
        <v-toolbar flat color="primary" dark>
            <v-toolbar-title>
                Store Planogram Overview: {{ProjectName.text}}
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
            <grid ref="grid" :rowData="rowData" />


        <v-data-table :headers="headers" :items="currentStorePlanograms" class="elevation-1">
            <template v-slot:items="props">
                <tr>
                    <td>{{props.item.storeName}}
                        <!-- <v-edit-dialog large lazy persistent @save="UpdateLine(props.item)" @cancel="''" @open="''" @close="''">
                                    <div></div>
                                    <template v-slot:input>
                                    </template>
                                    <template v-slot:input>
                                        <v-text-field label="storeName" v-model="props.item.storeName"></v-text-field>
                                    </template>
                                </v-edit-dialog> -->
                    </td>
                    <td>{{props.item.clusterName}}
                        <!-- <v-edit-dialog large lazy persistent @save="UpdateLine(props.item)" @cancel="''" @open="''" @close="''">
                                    <div>{{props.item.clusterName}}</div>
                                    <template v-slot:input>
                                    </template>
                                    <template v-slot:input>
                                        <v-text-field label="clusterName" v-model="props.item.clusterName"></v-text-field>
                                    </template>
                                </v-edit-dialog> -->
                    </td>
                    <td>
                        <v-edit-dialog large lazy persistent @save="UpdateLine(props.item)" @cancel="''" @open="''"
                            @close="''">
                            <div>{{props.item.modules}}</div>
                            <template v-slot:input>
                            </template>
                            <template v-slot:input>
                                <v-text-field label="Modules" v-model="props.item.modules"></v-text-field>
                            </template>
                        </v-edit-dialog>
                    </td>
                    <td>
                        <v-edit-dialog large lazy persistent @save="UpdateLine(props.item)" @cancel="''" @open="''"
                            @close="''">
                            <div>{{props.item.height}}</div>
                            <template v-slot:input>
                            </template>
                            <template v-slot:input>
                                <v-text-field label="Height" v-model="props.item.height"></v-text-field>
                            </template>
                        </v-edit-dialog>
                    </td>
                    <td>
                        <v-edit-dialog large lazy persistent @save="UpdateLine(props.item)" @cancel="''" @open="''"
                            @close="''">
                            <div>{{props.item.width}}</div>
                            <template v-slot:input>
                            </template>
                            <template v-slot:input>
                                <v-text-field label="Width" v-model="props.item.width"></v-text-field>
                            </template>
                        </v-edit-dialog>
                    </td>
                    <td>
                        <v-edit-dialog large lazy persistent @save="UpdateLine(props.item)" @cancel="''" @open="''"
                            @close="''">
                            <div>{{props.item.displays}}</div>
                            <template v-slot:input>
                            </template>
                            <template v-slot:input>
                                <v-text-field label="Displays" v-model="props.item.displays"></v-text-field>
                            </template>
                        </v-edit-dialog>
                    </td>
                    <td>
                        <v-edit-dialog large lazy persistent @save="UpdateLine(props.item)" @cancel="''" @open="''"
                            @close="''">
                            <div>{{props.item.pallettes}}</div>
                            <template v-slot:input>
                            </template>
                            <template v-slot:input>
                                <v-text-field label="Pallettes" v-model="props.item.pallettes"></v-text-field>
                            </template>
                        </v-edit-dialog>
                    </td>
                    <td>
                        <v-edit-dialog large lazy persistent @save="UpdateLine(props.item)" @cancel="''" @open="''"
                            @close="''">
                            <div>{{props.item.supplierStands}}</div>
                            <template v-slot:input>
                            </template>
                            <template v-slot:input>
                                <v-text-field label="S1upplier Stands" v-model="props.item.supplierStands">
                                </v-text-field>
                            </template>
                        </v-edit-dialog>
                    </td>
                    <td>
                        <v-edit-dialog large lazy persistent @save="UpdateLine(props.item)" @cancel="''" @open="''"
                            @close="''">
                            <div>{{props.item.bins}}</div>
                            <template v-slot:input>
                            </template>
                            <template v-slot:input>
                                <v-text-field label="Bins" v-model="props.item.bins"></v-text-field>
                            </template>
                        </v-edit-dialog>
                    </td>

                    <td>{{ StoreStatusList[props.item.planogramStoreStatus].text}}
                    </td>
                    <td>
                        <!-- UNASSIGNED -->
                        <v-btn @click="assignPlanogramToStore(props.item)" icon flat small color="primary">
                            <v-icon>assignment</v-icon>
                        </v-btn>
                        <v-btn icon @click="openStoreOver(props.item)">
                            <v-icon>
                                more_vert
                            </v-icon>
                        </v-btn>
                        <!-- DISTRIBUTED TO STORE -->
                    </td>
                </tr>
            </template>
        </v-data-table>
        <StorePlanograms ref="StorePlanograms" />
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
               
                StoreClusters: [],
                allStoreDialog: false,
                headers: [{
                    "headerName": "Store",
                    "field": "storeName"
                }, {
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
          
            UpdateLine(item) {
                let self = this
                self.createPlanoGramDetailTX(item)
                // create new detail tx
                // update details then update store_planogram if necesssary

            },
            createPlanoGramDetailTX(item) {
                let self = this
                let detailsItem = null;
                console.log("item");
                console.log(item);
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
                console.log(sendRequst);

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                Axios.post(process.env.VUE_APP_API + 'Planogram_Details/Save', sendRequst).then(
                    r => {
                        console.log(r);
                        let obj = {
                            "id": item.id,
                            "store_ID": item.store_ID,
                            "project_ID": self.selectedProject,
                            "planogramDetail_ID": r.data.planogram_Details.id,
                            "planogramStoreStatus": 0,
                        }
                        Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                        console.log("obj");
                        console.log(obj);

                        Axios.post(process.env.VUE_APP_API + 'Store_Planogram/Save', obj)
                            .then(res => {
                                console.log(res.data);
                                self.getStorePlanograms()
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
                console.log(item);

            },
            getStorePlanograms() {
                let self = this
                console.log(self.selectedProject);

                self.currentStorePlanograms = [];

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + 'Store_Planogram?project_ID=' + self.selectedProject)
                    .then(r => {
                        console.log(r.data);

                        self.currentStorePlanograms = r.data.store_PlanogramList;
                        self.currentStorePlanograms.forEach(e => {
                            e.GeneratedName = self.GenerateName(e)
                            e.currentStatusText = self.StoreStatusList[e.planogramStoreStatus].text
                        })
                        self.rowData = self.currentStorePlanograms
                        console.log(self.currentStorePlanograms);

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

                self.storeView = true
                self.getStorePlanograms()
            },
            assignPlanogramToStore(listItem) {
                let self = this;
                self.$refs.PlanogramDetailsSelector.show(listItem, data => {
                    console.log(data);
                    console.log("listitme");

                    console.log(listItem);

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
                            console.log(r.data);
                            self.getStorePlanograms()
                            delete Axios.defaults.headers.common["TenantID"];
                        }).catch(e => {
                            delete Axios.defaults.headers.common["TenantID"];

                        })


                })
            },
        }
    }
</script>