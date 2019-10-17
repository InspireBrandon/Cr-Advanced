<template>
    <div>
        <v-layout row justify-center>
            <v-dialog v-model="dialog" persistent max-width="800">
                <v-card>
                    <v-toolbar color="primary" dark>
                        <v-toolbar-title>Assign a task</v-toolbar-title>
                    </v-toolbar>
                    <v-card flat>
                        <v-card-text>
                            <v-container grid-list-md class="pa-0">
                                <v-layout row wrap>
                                    <v-flex sm4>
                                        <v-select :disabled="elementsDisabled" :items="tasks" v-model="task"
                                            label="Task">
                                        </v-select>
                                    </v-flex>
                                    <v-flex sm8>
                                        <v-checkbox v-if="task == 3" v-model="useExisting" label="Modify existing?">
                                        </v-checkbox>
                                    </v-flex>
                                    <v-flex sm4>
                                        <v-autocomplete :disabled="elementsDisabled" :items="users" v-model="user"
                                            label="User">
                                        </v-autocomplete>
                                    </v-flex>
                                    <v-flex sm4>
                                        <v-autocomplete v-if="task==2" :items="approvalUsers" v-model="approvalUser"
                                            label="Approval User">
                                        </v-autocomplete>
                                    </v-flex>
                                    <v-flex sm4>
                                    </v-flex>
                                    <v-flex sm12>
                                        <v-autocomplete :disabled="elementsDisabled" v-if="task==2" :items="rangeData"
                                            v-model="selectedRange" label="Ranging file">
                                        </v-autocomplete>
                                        <v-autocomplete v-if="useExisting && task == 3" :disabled="elementsDisabled"
                                            :items="systemFiles" v-model="systemFile" label="Planogram">
                                        </v-autocomplete>
                                    </v-flex>
                                    <v-flex sm6>
                                        <v-autocomplete v-if="task == 3" :items="stores" v-model="store"
                                            @change="filterUsersByStore" label="Store"></v-autocomplete>
                                    </v-flex>
                                    <v-flex sm6></v-flex>
                                    <v-flex sm4>
                                        <v-autocomplete :disabled="store != null" v-if="task == 3" :items="storeClusters"
                                            v-model="storeCluster" label="Store Cluster"></v-autocomplete>
                                    </v-flex>
                                    <v-flex sm4>
                                        <v-autocomplete :disabled="store != null" v-if="task == 3" :items="customClusters"
                                            v-model="customCluster" label="Custom Cluster"></v-autocomplete>
                                    </v-flex>
                                    <v-flex sm4>
                                        <v-autocomplete :disabled="store != null" v-if="task == 3" :items="categoryClusters"
                                            v-model="categoryCluster" label="Category Cluster"></v-autocomplete>
                                    </v-flex>
                                </v-layout>
                            </v-container>
                            <v-textarea label="Notes" v-model="notes"></v-textarea>
                        </v-card-text>
                    </v-card>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" @click.native="returnResult" :disabled="task == null || user == null">
                            Assign</v-btn>
                        <v-btn flat color="secondary" @click.native="dialog = false">Cancel</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-layout>
    </div>
</template>

<script>
    import Axios from 'axios';
    import jwt from 'jsonwebtoken';

    function TextValue(text, value) {
        this.text = text;
        this.value = value;
    }

    function TextValueArray(array, textProperty, valueProperty, insertNull, nullText) {
        let tmp = [];

        if (insertNull)
            tmp.push({
                text: nullText,
                value: null
            })

        array.forEach(element => {
            tmp.push(new TextValue(element[textProperty], element[valueProperty]))
        });

        return tmp;
    }

    export default {
        data() {
            return {
                dialog: false,
                afterRuturn: null,
                tasks: [
                    // {
                    //     text: "Event",
                    //     value: 0
                    // },
                    {
                        text: "Data Preparation",
                        value: 1
                    },

                    {
                        text: "Ranging",
                        value: 2
                    },

                    {
                        text: "Planogram",
                        value: 3
                    },
                    // {
                    //     text: "Promotion",
                    //     value: 4
                    // }
                ],
                selectedRange: null,
                task: null,
                users: [],
                approvalUsers: [],
                tmpUsers: [],
                approvalUser: null,
                user: null,
                notes: null,
                systemFiles: [],
                systemFile: null,
                storeClusters: [],
                storeCluster: null,
                categoryClusters: [],
                categoryCluster: null,
                customClusters: [],
                customCluster: null,
                stores: [],
                store: null,
                useExisting: true,
                rangeData: [],
                elementsDisabled: false,
                planogramID: null
            }
        },
        created() {},
        methods: {
            filterUsersByStore() {
                let self = this;

                // let tmp = [];
                // self.tmpUsers.forEach(e => {
                //     if (e.accessType.accessType == 2) {
                //         if (e.accessType.storeID == self.store) {
                //             tmp.push(e)
                //         }
                //     }
                // })

                // self.users = tmp

                self.$nextTick(() => {
                    if (self.store != null) {
                        self.storeCluster = null;
                        self.customCluster = null;
                        self.categoryCluster = null;
                    }
                })
            },
            getRange(callback) {
                let self = this;

                self.rangeData = [];

                Axios.get(process.env.VUE_APP_API + "SystemFile/JSON?db=CR-Devinspire&folder=Ranging")
                    .then(r => {
                        r.data.forEach(e => {
                            self.rangeData.push({
                                text: e.name,
                                value: e.id
                            })
                        })

                        callback();
                    })
                    .catch(e => {
                        alert("Failed to get data...");
                    })
            },
            getData(callback) {
                let self = this;
                self.getRange(() => {
                    self.getSpacePlans()
                        .then(() => {
                            self.getStoreClusters()
                                .then(() => {
                                    self.getStores()
                                        .then(() => {
                                            self.getUsers()
                                                .then(() => {
                                                    callback();
                                                })
                                        })
                                })
                        })
                })

                self.getCustomClusters();
                self.getCategoryClusters();
            },
            getSpacePlans() {
                let self = this;

                return new Promise((resolve, reject) => {
                    Axios.get(process.env.VUE_APP_API +
                            "SystemFile/JSON?db=CR-Devinspire&folder=Space Planning")
                        .then(r => {
                            self.systemFiles = new TextValueArray(r.data, 'name', 'id', false)
                            resolve();
                        })
                        .catch(e => {
                            reject();
                        })
                })
            },
            getStoreClusters() {
                let self = this;

                return new Promise((resolve, reject) => {
                    Axios.get(process.env.VUE_APP_API + "Cluster/Store")
                        .then(r => {
                            self.storeClusters = new TextValueArray(r.data, 'displayname', 'id', true,
                                "None")
                            resolve();
                        })
                        .catch(e => {
                            reject();
                        })
                })
            },
            getCategoryClusters() {
                let self = this;

                return new Promise((resolve, reject) => {
                    resolve();
                    // Axios.get(process.env.VUE_APP_API + "Store?db=CR-Devinspire")
                    //     .then(r => {
                    //         self.stores = [];
                    //         self.stores = new TextValueArray(r.data, 'storeName', 'storeID')
                    //         resolve();
                    //     })
                    //     .catch(e => {
                    //         reject();
                    //     })
                })
            },
            getStores() {
                let self = this;

                return new Promise((resolve, reject) => {
                    Axios.get(process.env.VUE_APP_API + "Store?db=CR-Devinspire")
                        .then(r => {
                            self.stores = new TextValueArray(r.data, 'storeName', 'storeID', true,
                                "All Stores")
                            resolve();
                        })
                        .catch(e => {
                            reject();
                        })
                })
            },
            getAccessType(systemUserID, accessType) {
                let self = this;
                let tenantID = sessionStorage.currentDatabase

                Axios.get(process.env.VUE_APP_API +
                        `TenantLink_AccessType?systemUserID=${systemUserID}&tenantID=${tenantID}`)
                    .then(r => {
                        if (r.data.tenantLink_AccessTypeList != null) {
                            if (r.data.tenantLink_AccessTypeList.length > 0) {
                                accessType(r.data.tenantLink_AccessTypeList[0])
                            } else {
                                accessType(4)
                            }
                        } else {
                            accessType(4)
                        }

                    })
            },
            getUsers() {
                let self = this;

                return new Promise((resolve, reject) => {
                    Axios.get(process.env.VUE_APP_API + `SystemUser`, false)
                        .then(r => {

                            self.users = [];
                            self.approvalUsers = [{
                                text: "None",
                                value: null
                            }];

                            for (var i = 0; i < r.data.length; i++) {
                                let item = r.data[i];

                                let tmp = {
                                    text: item.firstname + " " + item.lastname,
                                    value: item.systemUserID,
                                }

                                self.users.push(tmp);

                                self.approvalUsers.push(tmp)
                            }

                            self.users.forEach(e => {
                                self.getAccessType(e.value, accessType => {
                                    e.accessType = accessType
                                })
                            })

                            self.tmpUsers = self.users
                            resolve();
                        })
                        .catch(e => {
                            reject();
                        })
                })
            },
            show(afterRuturn) {
                let self = this;
                self.task = null;
                self.user = null;
                self.elementsDisabled = false;
                self.afterRuturn = afterRuturn;
                self.getData(() => {
                    self.dialog = true;
                })
            },
            showWithData(data, afterRuturn) {

                console.log(data);

                let self = this;
                self.user = null
                self.task = data.type;
                self.afterRuturn = afterRuturn;
                self.selectedRange = data.rangeFileID;
                self.elementsDisabled = false;
                self.storeCluster = data.storeCluster_ID;
                self.categoryCluster = data.categoryCluster_ID;
                self.store_ID = data.store_ID;
                self.systemFile = data.systemFileID;
                self.user = data.projectOwnerID
                self.approvalUser = data.approvalUserID
                self.notes = data.notes;
                self.planogramID = data.planogram_ID;
                self.storeCluster = data.storeCluster_ID;
                self.customCluster = data.customCluster_ID;
                self.categoryCluster = data.categoryCluster_ID;

                self.getData(() => {
                    if (data.userID != null) {
                        self.user = data.userID
                    } else {
                        self.useExisting = false;
                    }
                    if (data.systemFileID == null) {
                        self.useExisting = false;
                    } else {
                        self.useExisting = true;
                    }
                    self.dialog = true;
                })


            },
            returnResult() {
                let self = this;

                self.afterRuturn({
                    type: self.task,
                    systemUserID: self.user,
                    notes: self.notes,
                    rangeFileID: self.selectedRange,
                    systemFile: self.systemFile,
                    useExisting: self.useExisting,
                    storeCluster: self.storeCluster,
                    categoryCluster: self.categoryCluster,
                    customCluster: self.customCluster,
                    store: self.store,
                    approvalUserID: self.approvalUser
                });

                self.dialog = false;
            },
            // getStoreClusters() {
            //     let self = this;

            //     self.storeClusters = [{
            //         text: "None",
            //         value: null
            //     }];

            //     Axios.get(process.env.VUE_APP_API + "Cluster/Store")
            //         .then(r => {
            //             r.data.forEach(el => {
            //                 self.storeClusters.push({
            //                     text: el.displayname,
            //                     value: el.id
            //                 })
            //             })
            //         })
            // },
            getCategoryClusters() {
                let self = this;

                self.categoryClusters = [{
                    text: "None",
                    value: null
                }];

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API +
                        `Clusters/CategoryCluster?planogramID=${self.planogramID}`
                    )
                    .then(r => {
                        delete Axios.defaults.headers.common["TenantID"];

                        r.data.forEach(el => {
                            self.categoryClusters.push({
                                text: el.displayname,
                                value: el.id
                            })
                        })
                    })
            },
            getCustomClusters() {
                let self = this;

                self.customClusters = [{
                    text: "None",
                    value: null
                }];

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API +
                        `Clusters/CustomCluster?planogramID=${self.planogramID}`
                    )
                    .then(r => {
                        delete Axios.defaults.headers.common["TenantID"];

                        r.data.forEach(el => {
                            self.customClusters.push({
                                text: el.displayname,
                                value: el.id
                            })
                        })
                    })
            },
        }
    }
</script>