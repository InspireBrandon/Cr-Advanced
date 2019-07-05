<template>
    <v-dialog max-width="1600px" persistent v-model="dialog">
        <v-card>
            <v-toolbar dark flat color="primary">
                <v-toolbar-title>
                    Save Details
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="dialog=false">
                    <v-icon>
                        close
                    </v-icon>
                </v-btn>
            </v-toolbar>
            <v-toolbar dense dark flat>
                <v-toolbar-title v-if="PlanoDetail!=null">
                    {{PlanoDetail.planogramName}}
                </v-toolbar-title>
                <v-spacer></v-spacer>

            </v-toolbar>
            <grid ref="grid" :rowData="RowData" />
            Total Modules: {{totalModules}}
            genName : {{genName}}
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="success" @click="close()"> Save</v-btn>
            </v-card-actions>

        </v-card>
    </v-dialog>
</template>

<script>
    import grid from "./Grid"
    import Axios from 'axios'
    export default {
        components: {
            grid
        },
        data() {
            return {
                RowData: [],
                dialog: false,
                totalModules: 0,
                PlanoDetail: null,
                genName: null,
                rangingData: null,
                cluster: null,
                callback: null,
                fileID: null,
            }
        },
        methods: {
            GetData(SystemFileID) {
                let self = this
                console.log(SystemFileID);
                if(SystemFileID==null){
                    SystemFileID=0
                }
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + `Planogram_Details?SystemFileID=${SystemFileID}`).then(r => {
                    console.log(r);
                   
                    self.PlanoDetail = r.data.planogram_DetailsList[0]
                    self.fileID=self.PlanoDetail.systemFileID
                    self.RowData = r.data.planogramDetails_fixtures
                    delete Axios.defaults.headers.common["TenantID"];
                })
            },
            generateName(rowdata) {
                let self = this
                let planogramName = ""
                let modules = 0
                self.totalModules = 0
                // get total modules
                rowdata.forEach(element => {
                    self.totalModules = self.totalModules + parseInt(element.modules)
                });
                rowdata.forEach(e => {
                    modules = modules + parseInt(e.modules)
                })
                planogramName += self.rangingData.planogramName
                // get period
                if (self.rangingData.periodic != null) {
                    if (self.rangingData.periodic)
                        planogramName += " - " + self.rangingData.monthsBetween + "MMA";
                    else
                        planogramName += " - " + self.rangingData.dateFromString + " to " + self.rangingData
                        .dateToString;
                }
                // // get TAg
                if (self.rangingData.tag != null && self.rangingData.tag != "")
                    planogramName += self.rangingData.tag;

                // // get Cluster
                let cluster = self.cluster
                if (cluster != null || cluster != undefined) {
                    planogramName += " - " + cluster;
                }

                // // get StoreName
                if (self.rangingData.storeName != null && self.rangingData.storeName != "") {
                    planogramName += " - " + self.rangingData.storeName;
                }

                if (planogramName != "")
                    planogramName += " - XXX";
                // GetRowData Modules for each fixture Type
                planogramName += " - " + self.totalModules + " Module"
                rowdata.forEach(e => {

                    if (parseInt(e.modules) != 0 && e.modules != null && e.modules != undefined) {
                        planogramName += " - " + e.code+"(" + e.modules + " x " + e.height+"M)"
                    }
                })
                return planogramName
            },
            save(callback) {
                let self = this
                let data = self.$refs.grid.getRowData()
                self.genName = self.generateName(data)
                let selected = self.$refs.grid.getSelectedItems()
                let PlanoDetails = {
                    "systemFileID": self.fileID,
                    "dateFromString": self.rangingData.dateFromString,
                    "dateToString": self.rangingData.dateToString,
                    "monthsBetween": parseInt(self.rangingData.monthsBetween),
                    "periodic": self.rangingData.periodic,
                    "planogramID": parseInt(self.rangingData.planogramID),
                    "planogramName": self.rangingData.planogramName,
                    "tag": self.rangingData.tag,
                    "storeCluster": self.rangingData.storeCluster,
                    "clusterID": parseInt(self.rangingData.clusterID),
                    "clusterType": self.rangingData.clusterType,
                    "clusterName": self.rangingData.clusterName,
                    "rangeID": parseInt(self.rangingData.rangeID),
                    "storeID": self.rangingData.storeID,
                    "storeName": self.rangingData.storeName,
                    "categoryCluster": self.rangingData.categoryCluster,
                    "height": parseFloat(selected.height),
                    "modules": parseInt(self.totalModules),
                }
                console.log(PlanoDetails);

                let request = {
                    planogramDetails_fixtures: data,
                    Planogram_DetailsList: [PlanoDetails]
                }

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                Axios.post(process.env.VUE_APP_API + 'Planogram_Details/Save', request).then(
                    r => {
                        console.log(r);
                        callback(r)

                        delete Axios.defaults.headers.common["TenantID"];
                    }).catch(e => {
                    alert("Save Failed" + e)
                })


            },
            show(rangingData, cluster, fileID, callback) {
                let self = this
                self.dialog = true
                self.cluster = cluster
                self.rangingData = rangingData
                self.callback = callback
                self.fileID = fileID
                console.log(self.rangingData);
                self.PlanoDetail = null
                self.GetData(fileID)
            },
            close() {
                let self = this
                self.save(() => {
                    self.dialog = false
                    self.callback({name:self.genName,
                    spaceID:self.fileID
                    
                    })
                })

            }
        }
    }
</script>