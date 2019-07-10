<template>
    <v-dialog v-model="dialog" persistent max-width="700px">
        <v-card>
            <v-toolbar dark flat color="primary">
                <v-toolbar-title>
                    Order Variation
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="dialog = false">
                    <v-icon>close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-container grid-list-md>
                <v-layout row wrap>
                    <v-flex md12>
                        <v-select v-model="selectedPlanoDetail" :items="planoDetails" label="Planogram"></v-select>
                    </v-flex>
                    <v-flex md6>
                        <v-text-field label="Store Name" disabled v-model="storeName"  v-if="variationType==0"></v-text-field>
                    </v-flex>
                    <v-flex md6>
                        <!-- <v-select :items="FixtureTypes" label="Variation Type" v-model="FixtureType">
                        </v-select> -->
                    </v-flex>
                    <v-flex md4>
                        <v-text-field v-model="height" label="Height"></v-text-field>
                    </v-flex>
                    <v-flex md4>
                        <v-text-field v-model="width" label="Width"></v-text-field>
                    </v-flex>
                    <v-flex md4>
                        <v-text-field v-model="modules" label="Modules"></v-text-field>
                    </v-flex>
                    <v-flex md3>
                        <v-text-field v-model="displays" label="Displays"></v-text-field>
                    </v-flex>
                    <v-flex md3>
                        <v-text-field v-model="pallettes" label="Pallettes"></v-text-field>
                    </v-flex>
                    <v-flex md3>
                        <v-text-field v-model="supplierStands" label="Supplier Stands"></v-text-field>
                    </v-flex>
                    <v-flex md3>
                        <v-text-field v-model="bins" label="Bins"></v-text-field>
                    </v-flex>
                    <v-flex md12>
                        <v-textarea v-model="additionalNotes" outline label="Additional Notes"></v-textarea>
                    </v-flex>
                </v-layout>
            </v-container>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="success" @click="submit()">
                    send
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    import Axios from 'axios'
    import {
        request
    } from 'http';
    export default {
        data() {
            return {
                FixtureTypes: [{
                    text: "Model",
                    value:0
                }, {
                    text: "Store",
                    value:0
                }],
                FixtureType: null,
                variationType:null,
                dialog: false,
                height: null,
                width: null,
                modules: null,
                bins: null,
                displays: null,
                supplierStands: null,
                pallettes: null,
                additionalNotes: null,
                planoDetails: [],
                selectedPlanoDetail: null,
                storeName: null,
                listitem: null,
                project: null,
                afterReturn: null
            }
        },
        methods: {
            show(item,variationType, afterReturn) {
                let self = this
                self.getPlanoDetails()
                self.listitem = item
                self.dialog = true
                self.variationType=variationType
                self.height = item.height
                self.width = item.width
                self.modules = item.width
                self.bins = item.bins
                self.storeName = item.storeName
                self.displays = item.displays
                self.supplierStands = item.supplierStands
                self.pallettes = item.pallettes
                self.FixtureType = item.fixtureType
                self.additionalNotes = ""
                if (item.planogramDetail_ID != 0) {
                    self.selectedPlanoDetail = item.planogramDetail_ID
                }
                self.afterReturn = afterReturn
                Axios.get(process.env.VUE_APP_API + `Project?ProjectID=${item.project_ID}`).then(r => {
                    console.log(r);
                    self.project = r.data.projectList[0]
                }).catch(e => {
                    console.log(e);
                })
            },
            close() {
                let self = this
                self.dialog = false
            },
            getPlanoDetails() {
                let self = this
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                Axios.get(process.env.VUE_APP_API + "Planogram_Details").then(r => {
                    console.log(r.data);
                    self.planoDetails = [];
                    r.data.planogram_DetailsList.forEach(element => {
                        self.planoDetails.push({
                            text: element.fileName,
                            value: element.id
                        })
                    });
                }).catch(e => {
                    console.log(e);
                })
            },
            buildString() {
                let self = this
                let name = ""
                self.planoDetails.forEach(e => {
                    if (e.value == self.selectedPlanoDetail) {
                        name = e.text
                    }
                })

                let string = "Variation requested for " + name + " with the following details  " + "\r\n" + "\r\n"
                
                string += "Height: " + self.height + "\r\n"
                string += "Width: " + self.width + "\r\n"
                string += "Modules: " + self.modules + "\r\n"
                string += "Bins: " + self.bins + "\r\n"
                string += "Displays: " + self.displays + "\r\n"
                string += "Supplier Stands: " + self.supplierStands + "\r\n"
                string += "Palettes: " + self.pallettes + "\r\n"
                if(self.variationType==0){
                string += "Store: " + self.storeName + "\r\n"
                }
                // string += "Fixture Type: " + self.FixtureType + "\r\n"
                string += "Additional Notes: " + self.additionalNotes
                return string
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
            submit() {
                let self = this
                let text = self.buildString()

                // let projectTXGroupRequest = {
                //     projectID: listitem.project_ID
                // }

                // request.type = 3;
                // request.status = 41;s
                // request.systemUserID = null;
                // request.actionedByUserID = systemUserID;

                // request.systemFileID = self.listitem.systemFileID
                // request.rangeFileID = self.listitem.rangeID;
                // request.project_ID = self.listitem.project_ID;
                // request.storeCluster_ID = self.listitem.storeCluster;
                // request.store_ID = self.listitem.store_ID;
                // request.notes = self.buildString()
                // create tx group
                // then create tx with notes = text 
                self.additionalNotes = text


                self.dialog = false
                self.afterReturn(text);
            },
        },
        created() {
            this.getPlanoDetails()
        },

    }
</script>