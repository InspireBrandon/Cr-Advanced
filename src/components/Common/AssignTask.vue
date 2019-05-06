<template>
    <div>
        <v-layout row justify-center>
            <v-dialog v-model="dialog" persistent max-width="500px;">
                <v-card>
                    <v-toolbar color="primary" dark>
                        <v-toolbar-title>Assign a task</v-toolbar-title>
                    </v-toolbar>
                    <v-card flat>
                        <v-card-text>
                            <v-select :items="tasks" v-model="task" label="Task"></v-select>
                            <div v-if="task == 3">
                                <v-checkbox v-model="useExisting" label="Modify existing?"></v-checkbox>
                                <div v-if="useExisting">
                                    <v-select :items="systemFiles" v-model="systemFile" label="Planogram">
                                    </v-select>
                                </div>
                                <div v-else>
                                    <v-select :items="storeClusters" v-model="storeCluster" label="Store Cluster">
                                    </v-select>
                                    <v-select disabled :items="categoryClusters" v-model="categoryCluster"
                                        label="Category Cluster"></v-select>
                                    <v-select :items="stores" v-model="store" label="Store"></v-select>
                                </div>
                            </div>
                            <v-select :items="users" v-model="user" label="User"></v-select>
                            <v-autocomplete v-if="task==2" :items="rangeData" v-model="selectedRange"
                                label="Ranging file">

                            </v-autocomplete>
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

    function TextValueArray(array, textProperty, valueProperty, insertNull) {
        let tmp = [];

        if (insertNull)
            tmp.push({
                text: "",
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
                user: null,
                notes: null,
                systemFiles: [],
                systemFile: null,
                storeClusters: [],
                storeCluster: null,
                categoryClusters: [],
                categoryCluster: null,
                stores: [],
                store: null,
                useExisting: false,
                rangeData: []
            }
        },
        created() {},
        methods: {
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
                        // self.rangeData = r.data;
                        console.log(self.rangeData);

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
                            self.storeClusters = new TextValueArray(r.data, 'displayname', 'id', false)
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
                            self.stores = new TextValueArray(r.data, 'storeName', 'storeID', true)
                            resolve();
                        })
                        .catch(e => {
                            reject();
                        })
                })
            },
            getUsers() {
                let self = this;

                return new Promise((resolve, reject) => {
                    Axios.get(process.env.VUE_APP_API + `SystemUser`, false)
                        .then(r => {
                            self.users = [];

                            for (var i = 0; i < r.data.length; i++) {
                                let item = r.data[i];

                                self.users.push({
                                    text: item.firstname + " " + item.lastname,
                                    value: item.systemUserID
                                });
                            }

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
                self.afterRuturn = afterRuturn;
                self.getData(() => {
                    self.dialog = true;
                })
            },
            showWithData(data, afterRuturn) {
                let self = this;
                self.user = null
                self.task = null;
                self.afterRuturn = afterRuturn;
                self.getData(() => {
                    console.log(data);
                    if (data.userID != null) {
                        self.user = data.userID
                    } else {
                        self.user = data.projectOwnerID
                    }
                    if (data.systemFileID == null) {
                        self.useExisting = false;
                        self.storeCluster = data.storeID;
                        self.categoryCluster = data.categoryCluster_ID;
                        self.store_ID = data.store_ID;
                    } else {
                        self.useExisting = false;
                        self.systemFile = data.systemUserID;
                    }
                    self.dialog = true;
                })
            },
            returnResult() {
                let self = this;

                if (self.task != 3) {
                    self.afterRuturn({
                        type: self.task,
                        systemUserID: self.user,
                        notes: self.notes,
                        rangeFileID: self.selectedRange
                    });
                } else {
                    if (self.useExisting) {
                        self.afterRuturn({
                            type: self.task,
                            systemUserID: self.user,
                            notes: self.notes,
                            rangeFileID: self.selectedRange,
                            systemFile: self.systemFile
                        });
                    } else {
                        self.afterRuturn({
                            type: self.task,
                            systemUserID: self.user,
                            notes: self.notes,
                            rangeFileID: self.selectedRange,
                            storeCluster: self.storeCluster,
                            categoryCluster: self.categoryCluster,
                            store: self.store
                        });
                    }
                }

                self.dialog = false;
            },
        }
    }
</script>