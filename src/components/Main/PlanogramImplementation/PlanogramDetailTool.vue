<template>
    <v-card>
        <v-container grid-list-md>
            <v-layout row wrap>
                <v-flex md6>
                    <v-btn color="primary" dark>
                        start
                    </v-btn>
                </v-flex>
                <v-flex md6>
                </v-flex>
                <v-flex md6>
                    <v-btn color="primary" dark @click="selectSingle">
                        single
                    </v-btn>
                </v-flex>
                <v-flex md6>
                </v-flex>
                <v-flex md6>
                    <v-btn color="primary" dark @click="getAllSpacePlans">
                        All
                    </v-btn>
                </v-flex>
                <v-flex md6>
                </v-flex>
                <v-flex md8>
                    <v-card>
                        <v-toolbar color="primary" dark flat>
                            <v-toolbar-title>
                                Planogram Details
                            </v-toolbar-title>
                        </v-toolbar>
                        <div style="height: calc(100vh - 350px); overflow: auto;">
                            <v-list>
                                <div v-for="(item,index) in spacePlans" :key="index">
                                    <v-list-tile>
                                        
                                        <v-list-tile-content v-if="item.fileName!=undefined">
                                            {{item.fileName}}  {{item.id}}
                                        </v-list-tile-content>
                                        <v-list-tile-content v-if="item.name!=undefined">
                                            {{item.name}}  {{item.id}}
                                        </v-list-tile-content>
                                        <v-list-tile-action>
                                            <v-btn @click="UpdateField(item)">update</v-btn>
                                        </v-list-tile-action>
                                    </v-list-tile>
                                    <v-divider></v-divider>
                                </div>
                            </v-list>
                        </div>

                    </v-card>
                </v-flex>
                <v-flex md4>
                    <v-card>
                        <v-toolbar color="primary" dark flat>
                            <v-toolbar-title>
                                Updating Plannogram Details
                            </v-toolbar-title>
                        </v-toolbar>
                        <v-container grid-list-md>
                            <v-layout row wrap>
                                <v-flex md12>
                                    <h1>{{currentPlanoName}}</h1>
                                </v-flex>
                                <v-flex md12>
                                    DownLoading File: {{currentAmount.toFixed(2)}} MB / {{fileTotal.toFixed(2)}} MB
                                    <v-progress-linear color="primary" height="20" :value="fileProgress">
                                        <div style="color:white;  text-align: center;">
                                            {{ fileProgress}}%
                                        </div>
                                    </v-progress-linear>
                                </v-flex>
                                <v-flex md12>
                                    Files Complete: {{currentFileIndex}}/{{totalFiles}} files
                                    <v-progress-linear color="primary" height="20"
                                        :value="(currentFileIndex/totalFiles)*100">
                                        <div style="color:white; text-align: center">
                                            {{currentFileIndex}}/{{totalFiles}}
                                        </div>
                                    </v-progress-linear>
                                </v-flex>
                            </v-layout>
                        </v-container>


                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
        <SpacePlanSelector ref="SpacePlanSelector" />

    </v-card>
</template>

<script>
    import SpacePlanSelector from '@/components/Common/SpacePlanSelector'
    import Axios from 'axios'
    import {
        setTimeout
    } from 'timers';
    export default {
        components: {
            SpacePlanSelector

        },
        data() {
            return {
                spacePlans: [],
                fileProgress: 0,
                currentAmount: 0,
                fileTotal: 0,
                totalFiles: 0,
                currentFileIndex: 0,
                currentPlanoName: "File names",
                planogramDetails: [],
                index: 0,
            }

        },
        created() {
            this.loadData()
        },
        methods: {
            UpdateField(item) {
                let self = this
                console.log(item.systemFileID);
                 self.currentFileIndex = 0
                    self.totalFiles = 1
                self.getSystemFile(item.systemFileID, callback => {
                   
                })
            },
            selectSingle() {
                let self = this
                 self.currentFileIndex = 0
                    self.totalFiles = 1
                self.$refs.SpacePlanSelector.show(data => {
                   
                    self.getSystemFile(data, callback => {

                    })


                })
            },
            createDetailTX(item, fileID, callback) {
                let self = this
                let detailsItem = null;
                // console.log(item);
                let sendRequst = {
                    "id":null,
                    "systemFileID": parseInt(fileID),
                    "dateFromString": item.clusterData.dateFromString,
                    "dateToString": item.clusterData.dateToString,
                    "monthsBetween": parseInt(item.clusterData.monthsBetween),
                    "periodic": parseInt(item.clusterData.periodic),
                    "planogramID": parseInt(item.clusterData.planogramID),
                    "planogramName": item.clusterData.planogramName,
                    "tag": item.clusterData.tag,
                    "storeCluster": item.clusterData.storeCluster,
                    "clusterID": parseInt(item.clusterData.clusterID),
                    "clusterType": item.clusterData.clusterType,
                    "clusterName": item.clusterData.clusterName,
                    "rangeID": parseInt(item.clusterData.rangeID),
                    "storeID": parseInt(item.clusterData.storeID),
                    "storeName": item.clusterData.storeName,
                    "categoryCluster": item.clusterData.categoryCluster,
                    "modules": parseInt(item.dimensionData.modules),
                    "height": parseFloat(item.dimensionData.height),
                    "width": parseFloat(item.dimensionData.width),
                    "displays": parseInt(item.dimensionData.displays),
                    "pallettes": parseInt(item.dimensionData.pallettes),
                    "supplierStands": parseInt(item.dimensionData.supplierStands),
                    "bins": parseInt(item.dimensionData.bins)
                }
                console.log(sendRequst);

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                Axios.post(process.env.VUE_APP_API + 'Planogram_Details/Save', sendRequst).then(
                    r => {
                        console.log("attemtping to create new tx");
                        console.log(r);
                        callback(r)
                        delete Axios.defaults.headers.common["TenantID"];
                    })
            },
            getSystemFile(item, callback) {
                let self = this
                console.log(item);
                
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                let config = {
                    onDownloadProgress: progressEvent => {
                        self.currentAmount = progressEvent.loaded * 0.000001
                        self.fileTotal = progressEvent.total * 0.000001
                        self.fileProgress = Math.floor((progressEvent.loaded * 100) / progressEvent.total);
                        // do whatever you like with the percentage complete
                        // maybe dispatch an action that will update a progress bar or something
                    }
                }
                Axios.get(process.env.VUE_APP_API + `SystemFile/JSON/Planogram?db=CR-Devinspire&id=${item}&file=config_advanced` +  config).then(
                    res => {
                        console.log(res);
                        
                        self.currentPlanoName = res.data.jsonObject.name
                        self.currentFileIndex = self.currentFileIndex + 1

                        if (res.data != false) {
                            console.log("Creating Transaction");
                            // 
                            //     // callback(res);
                            //     self.index = self.index + 1
                            //     self.getSystemFile(self.spacePlans[self.index].id, data => {})
                            //     console.log("Creating Transaction Complete");
                            // }, 2000)
                            self.createDetailTX(res.data.jsonObject, item, data => {
                                console.log("createDetailTX");
                               setTimeout(() => {
                               if (self.currentFileIndex == self.totalFiles) {

                                    self.currentPlanoName = "All Files Loaded"

                                } else {
                                    self.index = self.index + 1
                                    self.getSystemFile(self.spacePlans[self.index].id, data => {})
                                }
                            }, 200)

                            })
                        } else {
                            if (self.currentFileIndex == self.totalFiles) {

                                self.currentPlanoName = "All Files Loaded"

                            } else {
                                self.index = self.index + 1
                                self.getSystemFile(self.spacePlans[self.index].id, data => {})
                            }
                        }

                        delete Axios.defaults.headers.common["TenantID"];
                    })
            },
            getAllSpacePlans() {
                let self = this
                Axios.get(process.env.VUE_APP_API + "SystemFile/JSON?db=CR-Devinspire&folder=Space Planning")
                    .then(r => {
                        self.spacePlans = r.data;
                        self.currentFileIndex = 0
                        self.totalFiles = 0
                        self.totalFiles = self.spacePlans.length
                        self.index = 0
                        console.log("started");
                        self.getSystemFile(self.spacePlans[self.index].id, data => {


                        })
                    })
                   
            },
            loadData() {
                let self = this
                self.currentAmount = 0
                self.fileTotal = 0
                self.fileProgress = 0
                self.spacePlans = []
                self.planogramDetails = []
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                let config = {
                    onDownloadProgress: progressEvent => {
                        self.currentAmount = progressEvent.loaded * 0.000001
                        self.fileTotal = progressEvent.total * 0.000001
                        self.fileProgress = Math.floor((progressEvent.loaded * 100) / progressEvent.total);
                        // do whatever you like with the percentage complete
                        // maybe dispatch an action that will update a progress bar or something
                    }
                }
                Axios.get(process.env.VUE_APP_API + 'Planogram_Details', config).then(res => {
                    res.data.planogram_DetailsList.forEach(element => {
                        element.systemFileID = element.fileID
                        self.spacePlans.push(element)
                        self.planogramDetails.push(element)

                    });
                    //  self.items=res.data.planogram_DetailsList

                    delete Axios.defaults.headers.common["TenantID"];

                })
            }
        }

    }
</script>