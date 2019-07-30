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
                            <table style="width: 100%;" border>
                                <thead>
                                    <th>Planogram</th>
                                    <th>Barcode</th>
                                    <th>Name</th>
                                    <th>Zero Or Ten</th>
                                    <th>Modules</th>
                                </thead>
                                <tbody>
                                    <tr v-for="(item, idx) in Products" :key="idx">
                                        <td>{{item.PlanogramName}}</td>
                                        <td>{{item.Barcode}}</td>
                                        <td>{{item.ProductName}}</td>
                                        <td>{{item.ZeroOrTen}}</td>
                                        <td>
                                            {{item.modules}}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <!-- <v-list>
                                <div v-for="(item,index) in spacePlans" :key="index">
                                    <v-list-tile>

                                        <v-list-tile-content v-if="item.fileName!=undefined">
                                            {{item.fileName}} {{item.id}}
                                        </v-list-tile-content>
                                        <v-list-tile-content v-if="item.name!=undefined">
                                            {{item.name}} {{item.id}}
                                        </v-list-tile-content>
                                        <v-list-tile-action>
                                            <v-btn @click="UpdateField(item)">update</v-btn>
                                        </v-list-tile-action>
                                    </v-list-tile>
                                    <v-divider></v-divider>
                                </div>
                            </v-list> -->
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
                                <v-flex md12>
                                    {{Products.length}}
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
                headers: [{
                    text: 'Planogram',
                    value: 'Planogram'
                }, {
                    text: 'ProductName',
                    value: 'ProductName'
                }, {
                    text: 'Barcode',
                    value: 'Barcode'
                }],
                spacePlans: [],
                fileProgress: 0,
                currentAmount: 0,
                fileTotal: 0,
                totalFiles: 0,
                currentFileIndex: 0,
                currentPlanoName: "File names",
                planogramDetails: [],
                Products: [],
                index: 0,
            }

        },
        created() {
            this.loadData()
        },
        methods: {
            UpdateField(item) {
                let self = this
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

                let sendRequst = {
                    "systemFileID": parseInt(fileID),
                    "dateFromString": item.clusterData.dateFromString,
                    "dateToString": item.clusterData.dateToString,
                    "monthsBetween": parseInt(item.clusterData.monthsBetween),
                    "periodic": item.clusterData.periodic,
                    "planogramID": parseInt(item.clusterData.planogramID),
                    "planogramName": item.clusterData.planogramName,
                    "tag": item.clusterData.tag,
                    "storeCluster": item.clusterData.storeCluster,
                    "clusterID": parseInt(item.clusterData.clusterID),
                    "clusterType": item.clusterData.clusterType,
                    "clusterName": item.clusterData.clusterName,
                    "rangeID": parseInt(item.clusterData.rangeID),
                    "storeID": item.clusterData.storeID,
                    "storeName": item.clusterData.storeName,
                    "categoryCluster": item.clusterData.categoryCluster,
                    "modules": parseInt(item.dimensionData.modules),
                    "height": parseFloat(item.dimensionData.height),
                    "width": parseFloat(item.dimensionData.width),
                    "displays": parseInt(item.dimensionData.displays),
                    "pallettes": parseInt(item.dimensionData.pallettes),
                    "supplierStands": parseInt(item.dimensionData.supplierStands),
                    "fixtureType": item.clusterData.fixtureType,
                    "bins": parseInt(item.dimensionData.bins)
                }

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                // Axios.post(process.env.VUE_APP_API + 'Planogram_Details/Save', sendRequst).then(
                //     r => {
                //         console.log(r);

                //         callback(r)
                //         delete Axios.defaults.headers.common["TenantID"];
                //     })

                callback()
            },
            getSystemFile(item, callback) {
                let self = this

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

                Axios.get(process.env.VUE_APP_API +
                    `SystemFile/JSON/Planogram?db=CR-Devinspire&id=${item}&file=config_advanced`, config).then(
                    res => {


                        if (res.data != false) {

                            self.currentPlanoName = res.data.jsonObject.name
                            let item = res.data
                            
                            item.jsonObject.planogramData.forEach(Products => {
                                if (Products.Type == "PRODUCT") {

                                    let height = parseFloat(Products.Data.Data.height);
                                    let width = parseFloat(Products.Data.Data.width);
                                    let depth = parseFloat(Products.Data.Data.depth);

                                    let equalsTen = self.testDimensions(width, height, depth, 10);
                                    let equalsZero = self.testDimensions(width, height, depth, 0);
                                    // let equals10 = height == 10 && width == 10 && depth == 10;

                                    if (equalsTen || equalsZero) {
                                        self.Products.push({
                                            PlanogramName: self.currentPlanoName,
                                            Barcode: Products.Data.Data.barcode,
                                            ProductName: Products.Data.Data.description,
                                            ZeroOrTen: equalsTen ? 'Ten' : 'Zero',
                                            modules:" " + item.jsonObject.dimensionData.modules
                                        })
                                    }
                                }
                            })


                        } else {
                            self.currentPlanoName = "File not found"
                        }

                        self.currentFileIndex = self.currentFileIndex + 1

                        if (res.data != false) {
                            // 
                            //     // callback(res);
                            //     self.index = self.index + 1
                            //     self.getSystemFile(self.spacePlans[self.index].id, data => {})
                            // }, 2000)

                            self.createDetailTX(res.data.jsonObject, item, data => {
                                setTimeout(() => {
                                    if (self.currentFileIndex == self.totalFiles) {

                                        self.currentPlanoName = "All Files Loaded"

                                    } else {
                                        self.index = self.index + 1
                                        self.getSystemFile(self.spacePlans[self.index].id,
                                            data => {})
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
            testDimensions(w, h, d, valueToTest) {
                let testResult = w == valueToTest && h == valueToTest && d == valueToTest;
                // console.log("[TEST DIMENSIONS]", "TEST VAL", valueToTest, testResult, w, h, d);
                return testResult;
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
                        self.getSystemFile(self.spacePlans[self.index].id, data => {


                            r.data.jsonObject.planogramData.forEach(item => {
                                console.log(item);


                            })
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