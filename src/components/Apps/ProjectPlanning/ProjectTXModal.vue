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
                                label="find a user" :rules="[v => !!v || 'You must Select a User!']"></v-autocomplete>
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
                status: 0,
                Store: null,
                StoreCluster: null,
                CategoryCluster: null,
                AssignedUser: null,
                storeObjects: [],
                typeList: [
                ],


                statusList: [
                    // {
                    //     text: "Project Start",
                    //     value: 0,
                    //     friendly: "Project Start",
                    //     color: "blue",
                    //     type: [0, 1, 2, 3, 4]
                    // },
                    // {
                    //     text: "In Progress",
                    //     value: 1,
                    //     color: "blue",
                    //     friendly: "In Progress",
                    //     type: [0, 1, 2, 3, 4]
                    // },
                    // {
                    //     text: "Complete",
                    //     value: 2,
                    //     color: "blue",
                    //     friendly: "Complete",
                    //     type: [0, 1, 2, 3, 4]
                    // },
                    // {
                    //     text: "Workshop",
                    //     value: 3,
                    //     color: "yellow",
                    //     friendly: "Workshop",
                    //     type: [0]
                    // }, {
                    //     text: "Workshop Complete",
                    //     value: 4,
                    //     color: "yellow",
                    //     friendly: "Workshop Complete",
                    //     type: [0]
                    // },
                    // {
                    //     text: "Meeting",
                    //     value: 5,
                    //     color: "yellow",
                    //     friendly: "Meeting",
                    //     type: [0]
                    // },
                    // {
                    //     text: "Data Preparation Start",
                    //     value: 6,
                    //     color: "red",
                    //     friendly: "Data Preparation Start",
                    //     type: [1]
                    // },
                    // {
                    //     text: "Ranging Start",
                    //     value: 7,
                    //     color: "red",
                    //     friendly: "Ranging Start",
                    //     type: [2]
                    // },
                    // {
                    //     text: "Planogram Start",
                    //     value: 8,
                    //     color: "green",
                    //     friendly: "Planogram Start",
                    //     type: [3]
                    // },
                    // {
                    //     text: "Meeting Supplier",
                    //     value: 9,
                    //     color: "green",
                    //     friendly: "Meeting Supplier",
                    //     type: [0]
                    // },
                    // {
                    //     text: "Requesting Approval",
                    //     value: 10,
                    //     color: "green",
                    //     friendly: "Requesting Approval",
                    //     type: [2, 3]
                    // },
                    // {
                    //     text: "Declined",
                    //     value: 11,
                    //     color: "green",
                    //     friendly: "Declined",
                    //     type: [2, 3]
                    // },
                    // {
                    //     text: "Approved",
                    //     value: 12,
                    //     color: "green",
                    //     friendly: "Approved",
                    //     type: [0, 1, 2, 3, 4]
                    // },
                    // {
                    //     text: "Implementation Pending",
                    //     value: 13,
                    //     color: "blue",
                    //     friendly: "Implementation Pending",
                    //     type: [0]
                    // },
                    // {
                    //     text: "Variation Request",
                    //     value: 14,
                    //     color: "blue",
                    //     friendly: 'Variation Request',
                    //     type: [2, 3]
                    // },
                    // {
                    //     text: "Implemented",
                    //     value: 15,
                    //     color: "blue",
                    //     friendly: "Implemented",
                    //     type: [3]
                    // },
                    // {
                    //     text: "On Hold",
                    //     value: 16,
                    //     color: "blue",
                    //     friendly: "On Hold",
                    //     type: [0]
                    // },
                    // {
                    //     text: "Waiting Fixture Requirements",
                    //     value: 17,
                    //     color: "blue",
                    //     friendly: "Waiting Fixture Requirements",
                    //     type: [3]
                    // }, {
                    //     text: "Waiting Supplier",
                    //     value: 18,
                    //     color: "blue",
                    //     friendly: "Waiting Supplier",
                    //     type: [0]
                    // }
                    // , {
                    //     text: "Awaiting Distribution",
                    //     value: 19,
                    //     color: "blue",
                    //     friendly: "Awaiting Distribution",
                    //     type: [3]
                    // },
                    //  {
                    //     text: "Approval In Progress",
                    //     value: 20,
                    //     color: "blue",
                    //     friendly: "Approval In Progress",
                    //     type: [3]
                    // }
                ]
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
        },
        methods: {
            getTypeList(){
                let self = this
                let statushandler = new StatusHandler()
                self.typeList=statushandler.getTypeList()
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
            open(isAdd, item, callback) {
                var self = this
                this.$refs.form.reset()

                self.dialog = true

                if (isAdd == false) {
                    self.isAdd = false
                    self.projectID = item.project_ID
                    self.id = item.id
                    self.uid = item.uid
                    self.type = item.type
                    self.selectedPlanogram = item.planogram_ID

                    self.timePicker = item.dateTimeString.slice(11, 16);

                    self.datePicker = item.dateTimeString.slice(0, 10);
                    self.status = item.status
                    self.Store = item.store_ID
                    self.StoreCluster = item.StoreCluster_ID
                    self.CategoryCluster = item.StoreCluster
                    self.AssignedUser = item.systemUserID
                }
                if (isAdd == true) {

                    self.projectID = item.id

                    self.isAdd = true
                    self.selectedPlanogram = item.planogram_ID,
                        self.date = null
                    self.status = 0
                    self.Store = null
                    self.StoreCluster = null
                    self.CategoryCluster = null
                }
                self.afterClose = callback
            },
            submit() {
                var self = this
                if (self.datePicker == null && self.timePicker == null && self.isAdd == false) {
                    alert("Please select a date and time")
                    return
                }
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

                            "dateTime": self.setDate,
                            "dateTimeString": self.setDate,
                            "status": self.status,
                            "type": self.type,
                            "username": tmpAssignedUser,
                            "systemUserID": self.AssignedUser,
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