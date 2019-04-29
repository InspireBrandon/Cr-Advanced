<template>

    <v-dialog fullscreen v-model="dialog">
        <v-card>
            <v-toolbar color="primary" flat dark>
                <v-toolbar-title>Project Transaction</v-toolbar-title>
                <v-spacer></v-spacer>

                <v-btn icon @click="dialog=false">
                    <v-icon>
                        close
                    </v-icon>
                </v-btn>

            </v-toolbar>
            <v-container grid-list-md>
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-layout row wrap>
                        <!-- <v-flex md12>
                        <v-autocomplete placeholder="Please select a Spaceplan..." v-model="selectedPlanogram" :items="planogramsList"
                            solo light>
                        </v-autocomplete>
                    </v-flex> -->
                        <v-flex md4>
                            <v-autocomplete style="max-width: 400px;" dense v-model="type" :items="typeList"
                                label="Component"></v-autocomplete>
                            <!-- <v-text-field label="AssignedUser" placeholder="AssignedUser" v-model="AssignedUser"></v-text-field> -->
                        </v-flex>
                        <v-flex md4>

                        </v-flex>
                        <v-flex md4></v-flex>
                        <!-- <v-flex md4 v-if="isAdd==true"></v-flex> -->
                        <!-- <v-flex md4 v-if="isAdd==false">
                            <v-menu ref="menu" v-model="menu" :close-on-content-click="false" lazy
                                transition="scale-transition" offset-y full-width min-width="290px">
                                <template v-slot:activator="{ on }">
                                    <v-text-field v-model="date" label="please select a date" prepend-icon="event"
                                        readonly v-on="on"></v-text-field>
                                </template>
                                <v-date-picker v-model="date" no-title scrollable>
                                </v-date-picker>
                            </v-menu>
                        </v-flex> -->
                        <v-flex md4>
                            <v-select label="status" placeholder="status" :items="filterStatus" v-model="status">
                            </v-select>

                        </v-flex>
                        <v-flex md4>
                        </v-flex>
                        <v-flex md4>
                        </v-flex>
                        <v-flex md4>
                            <!-- <v-text-field label="StoreCluster" placeholder="StoreCluster" v-model="StoreCluster"></v-text-field> -->
                            <v-autocomplete style="max-width: 400px;" dense v-model="StoreCluster"
                                :items="StoreClusters" label="select a Store Cluster"></v-autocomplete>
                        </v-flex>
                        <v-flex md4>
                            <!-- <v-text-field label="CategoryCluster" placeholder="CategoryCluster" v-model="CategoryCluster"></v-text-field> -->
                            <v-autocomplete disabled style="max-width: 400px;" dense v-model="CategoryCluster"
                                :items="CategoryClusters" label="select a Category Cluster"></v-autocomplete>
                        </v-flex>
                        <v-flex md4>
                            <!-- <v-text-field label="Store" placeholder="Store" v-model="Store"></v-text-field> -->
                            <v-autocomplete style="max-width: 400px;" dense v-model="Store" :items="stores"
                                label="select a Store"></v-autocomplete>
                        </v-flex>


                        <v-flex md6>
                            <v-autocomplete style="max-width: 400px;" dense v-model="AssignedUser" :items="users"
                                label="find a user"></v-autocomplete>
                            <!-- <v-text-field label="AssignedUser" placeholder="AssignedUser" v-model="AssignedUser"></v-text-field> -->
                        </v-flex>

                        <v-flex md8>
                            <v-autocomplete style="max-width: 600px;" dense v-model="systemFileID" :items="systemFiles"
                                label="Planogram"></v-autocomplete>
                            <!-- <v-text-field label="AssignedUser" placeholder="AssignedUser" v-model="AssignedUser"></v-text-field> -->
                        </v-flex>

                    </v-layout>
                </v-form>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="submit" :disabled="!valid"> submit</v-btn>

                </v-card-actions>
            </v-container>


        </v-card>

    </v-dialog>

</template>
<script>
    import moment from 'moment'
    import jwt from 'jsonwebtoken';
    import Axios from 'axios'
    import StatusHandler from '@/libs/system/projectStatusHandler'

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
                datePicker: null,
                timePicker: null,
                isAdd: null,
                afterClose: null,
                valid: true,
                menu: null,
                id: null,
                uid: null,
                type: 0,
                stores: [],
                StoreClusters: [],
                CategoryClusters: [],
                users: [],
                dialog: false,
                planogramsList: [],
                selectedPlanogram: null,
                date: null,
                dateTime: null,
                status: 0,
                Store: null,
                StoreCluster: null,
                CategoryCluster: null,
                AssignedUser: null,
                storeObjects: [],
                typeList: [],
                statusList: [],
                systemFiles: [],
                systemFileID: null,
                actionedByUserID: null,
                form: null
            }

        },
        computed: {
            // a computed getter
            setDate: function () {
                // `this` points to the vm instance
                return this.datePicker + ' ' + this.timePicker
                //   return this.datePicker = this.datePicker+this.timePicker
            },

            filterStatus: function () {
                var self = this
                let value = self.type;
                let statushandler = new StatusHandler()

                return statushandler.getStatus(value)


                // return this.statusList.filter(function (status) {
                //     return status.type.indexOf(value) > -1;
                // })
            }
        },

        mounted() {
            this.getTypeList()
            this.getPlanograms()
            this.getDatabaseUsers()
            this.getstores()
            this.getStoreClusters()
            this.getSpacePlans()
        },
        methods: {
            getTypeList() {
                let self = this
                let statushandler = new StatusHandler()
                self.typeList = statushandler.getTypeList()
            },
            getstores() {
                let self = this
                Axios.get(process.env.VUE_APP_API + `Store?db=CR-Hinterland-LIVE`).then(r => {
                    self.storeObjects = r.data
                    r.data.forEach(element => {
                        self.stores.push({
                            text: element.storeName,
                            value: element.storeID
                        })
                    })
                })
            },
            getStoreClusters() {
                let self = this
                Axios.get(process.env.VUE_APP_API + `Cluster/Store`).then(r => {

                    r.data.forEach(element => {
                        self.StoreClusters.push({
                            text: element.displayname,
                            value: element.id
                        })
                    })
                })
            },
            getUsers() {
                let self = this;

                let encoded_details = jwt.decode(sessionStorage.accessToken);

                Axios.get(process.env.VUE_APP_API + `SystemUser`)
                    .then(r => {

                        self.userDetails = r.data;

                        self.users.push({
                            text: r.data[0].username.toString(),
                            value: r.data[0].systemUserID
                        })

                        r.data.forEach(element => {

                            if (element.emailAddress != null) {
                                let isDatabaseUser = false;

                                self.databaseUsers.forEach((dbu, idx) => {

                                    if (dbu.systemUserID == element.systemUserID) {
                                        isDatabaseUser = true;
                                    }
                                })

                                if (isDatabaseUser) {
                                    self.users.push({
                                        text: element.username.toString(),
                                        value: element.systemUserID
                                    })
                                }
                            }
                        });

                        self.showLoader = false;
                        self.AssignedUser = self.users[0].value;
                    })
            },
            getDatabaseUsers() {
                let self = this;
                let encoded_details = jwt.decode(sessionStorage.accessToken);
                let tmp = sessionStorage.currentDatabase
                Axios.get(process.env.VUE_APP_API + `TenantAccess/User?tenantID=${tmp}`)
                    .then(r => {
                        self.databaseUsers = r.data;
                        self.getUsers();
                    })
            },
            getPlanograms() {
                let self = this;

                Axios.get(process.env.VUE_APP_API + 'Planogram')
                    .then(r => {

                        r.data.planogramList.forEach(element => {

                            self.planogramsList.push({
                                text: element.displayname,
                                value: element.id
                            })
                        });
                    })
            },
            getSpacePlans() {
                let self = this;

                Axios.get(process.env.VUE_APP_API + "SystemFile/JSON?db=CR-Devinspire&folder=Space Planning")
                    .then(r => {
                        console.log(r.data)
                        self.systemFiles = new TextValueArray(r.data, 'name', 'id', true)
                    })
                    .catch(e => {
                    })
            },
            open(isAdd, item, callback) {
                var self = this

                self.dialog = true

                if (isAdd == false) {
                    self.form = item; 

                    self.isAdd = false
                    self.projectID = item.project_ID
                    self.id = item.id
                    self.uid = item.uid
                    self.type = item.type
                    self.selectedPlanogram = item.planogram_ID
                    self.datePicker = item.dateTimeString;
                    self.dateTime = item.dateTime;
                    self.status = item.status
                    self.Store = item.store_ID
                    self.StoreCluster = item.storeCluster_ID
                    self.CategoryCluster = item.storeCluster
                    self.AssignedUser = item.systemUserID
                    self.systemFileID = item.systemFileID;
                }
                if (isAdd == true) {
                    self.projectID = item.id
                    self.isAdd = true
                    self.selectedPlanogram = item.planogram_ID,
                    self.date = null
                    self.status = 0
                    self.Store = null
                    self.StoreCluster = null
                    self.CategoryCluster = null;
                    self.systemFileID = null;
                }

                self.afterClose = callback
            },
            submit() {
                var self = this
                // if (self.datePicker == null && self.timePicker == null && self.isAdd == false) {
                //     alert("Please select a date and time")
                //     return
                // }
                if (this.$refs.form.validate()) {

                    let tmpStore = null
                    let tmpStoreCluster = null
                    let tmpCategoryCluster = null
                    let tmpAssignedUser = null

                    if (self.Store != null || self.Store != undefined) {

                        self.storeObjects.forEach(e => {


                            if (e.storeID == self.Store) {
                                tmpStore = e.storeName
                            }
                        })

                    }
                    if (self.StoreCluster != null || self.StoreCluster != undefined) {
                        self.StoreClusters.forEach(e => {
                            if (e.value == self.StoreCluster) {

                                tmpStoreCluster = e.text
                            }
                        })
                    }
                    // if(self.CategoryCluster!=null||self.CategoryCluster!=undefined)
                    // {} 
                    if (self.AssignedUser != null || self.AssignedUser != undefined) {
                        self.users.forEach(e => {
                            if (e.value == self.AssignedUser) {

                                tmpAssignedUser = e.text
                            }
                        })
                    }
                    let encoded_details = jwt.decode(sessionStorage.accessToken);
                    Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;


                    if (!self.isAdd) {
                        let trans = {
                            "id": self.id,
                            "uid": self.uid,
                            "project_ID": self.projectID,
                            "storeCluster": tmpStoreCluster,
                            "storeCluster_ID": self.StoreCluster,
                            "store_ID": self.Store,
                            "store": tmpStore,
                            "dateTime": self.form.dateTime,
                            "dateTimeString": self.form.dateTimeString,
                            "status": self.status,
                            "type": self.type,
                            "username": tmpAssignedUser,
                            "systemUserID": self.AssignedUser,
                            "systemFileID": self.systemFileID,
                            "actionedByUserID": self.form.actionedByUserID,
                            "subtask": self.form.subtask,
                            "transactionRolloverID": self.form.transactionRolloverID,
                            "notes": self.form.notes
                        }
                        Axios.put(process.env.VUE_APP_API + 'ProjectTX', trans).then(res => {

                            self.afterClose(trans)
                            delete Axios.defaults.headers.common["TenantID"];
                        })
                    }
                    if (self.isAdd) {
                        let trans = {
                            "project_ID": self.projectID,
                            "storeCluster_ID": self.StoreCluster,
                            "store_ID": self.Store,
                            "dateTime": new Date,
                            "dateTimeString": moment(new Date).format('YYYY-MM-DD hh:mm'),
                            "status": self.status,
                            "type": self.type,
                            "username": tmpAssignedUser,
                            "store": tmpStore,
                            "storeCluster": tmpStoreCluster,
                            "systemUserID": self.AssignedUser,
                            "systemFileID": self.systemFileID,
                            "actionedByUserID": self.actionedByUserID
                        }
                        Axios.post(process.env.VUE_APP_API + 'ProjectTX', trans).then(res => {
                            self.afterClose(res.data.projectTX)

                            delete Axios.defaults.headers.common["TenantID"];
                        })
                    }
                    self.dialog = false
                }
            }
        }
    }
</script>