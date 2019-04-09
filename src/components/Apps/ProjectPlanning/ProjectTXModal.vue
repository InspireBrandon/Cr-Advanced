<template>

    <v-dialog fullscreen v-model="dialog">
        <v-card>
            <v-toolbar color="primary" flat dark>
                <v-toolbar-title>Project Transaction Modal</v-toolbar-title>
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
                        <v-flex md4 v-if="isAdd==true"></v-flex>
                        <v-flex md4 v-if="isAdd==false">
                            <v-menu ref="menu" v-model="menu" :close-on-content-click="false" :return-value.sync="date"
                                lazy transition="scale-transition" offset-y full-width min-width="290px">
                                <template v-slot:activator="{ on }">
                                    <v-text-field v-model="date" label="Picker in menu" prepend-icon="event" readonly
                                        v-on="on"></v-text-field>
                                </template>
                                <v-date-picker v-model="date" no-title scrollable>
                                    <v-spacer></v-spacer>
                                    <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
                                    <v-btn flat color="primary" @click="$refs.menu.save(date)">OK</v-btn>
                                </v-date-picker>
                            </v-menu>
                            <!-- <v-text-field label="Date" placeholder="Date" v-model="date"></v-text-field> -->
                        </v-flex>
                        <v-flex md4>
                            <v-select label="status" placeholder="status" :items="statusList" v-model="status">
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
    import jwt from 'jsonwebtoken';
    import Axios from 'axios'

    export default {
        data() {
            return {
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
                typeList: [{
                        text: "Data Preparation",
                        value: 0
                    }, {
                        text: "Ranging",
                        value: 1
                    },
                    {
                        text: "Planogram",
                        value: 2
                    }, {
                        text: "Promotion",
                        value: 3
                    }
                ],
                statusList: [{
                        value: 0,
                        text: "Project Start"
                    },
                    {
                        value: 1,
                        text: "In Progress"
                    },
                    {
                        value: 2,
                        text: "Complete"
                    },
                    {
                        value: 3,
                        text: "Ranging Start"
                    },
                    {
                        value: 4,
                        text: "Planogram Start"
                    },
                    {
                        value: 5,
                        text: "Checking"
                    },
                    {
                        value: 6,
                        text: "Requesting Approval"
                    },
                    {
                        value: 7,
                        text: "Declined"
                    },
                    {
                        value: 8,
                        text: "Approved"
                    },
                    {
                        value: 9,
                        text: "Implementation Pending"
                    },
                    {
                        value: 10,
                        text: 'Variation Request'
                    },
                    {
                        value: 11,
                        text: "Implemented"
                    },
                    {
                        value: 12,
                        text: "On Hold"
                    }
                ]
            }

        },
        mounted() {
            this.getPlanograms()
            this.getUsers()
            this.getstores()
            this.getStoreClusters()
        },
        methods: {
            getstores() {
                let self = this
                Axios.get(process.env.VUE_APP_API + `Store?db=CR-Hinterland-LIVE`).then(r => {

                    r.data.forEach(element => {
                        self.stores.push({
                            text: element.storeName,
                            value: element.id
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

                        r.data.forEach(element => {

                            if (element.emailAddress != null) {
                                let isDatabaseUser = false;


                                if (!isDatabaseUser) {
                                    if (element.systemUserID != encoded_details.USER_ID) {
                                        self.users.push({
                                            text: element.emailAddress.toString(),
                                            value: element.systemUserID
                                        })
                                    }
                                }
                            }
                        });

                        self.showLoader = false;
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
                self.dialog = true

                if (isAdd == false) {
                    self.isAdd = false
                    self.projectID = item.project_ID
                    self.id = item.id
                    self.uid = item.uid
                    self.type = item.type
                    self.selectedPlanogram = item.planogram_ID
                    self.date = item.dateTimeString
                    self.status = item.status
                    self.Store = item.store_ID
                    self.StoreCluster = item.storeCluster_ID
                    self.CategoryCluster = item.storeCluster
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
                    self.AssignedUser = null
                }
                self.afterClose = callback
            },
            submit() {
                var self = this
                if (this.$refs.form.validate()) {
                    let tmpStore = null
                    let tmpStoreCluster = null
                    let tmpCategoryCluster = null
                    let tmpAssignedUser = null

                    if (self.Store != null || self.Store != undefined) {
                        self.stores.forEach(e => {
                            if (e.value == self.store) {
                                 tmpStore=e.text   
                            }
                        })
                    }
                    if (self.StoreCluster != null || self.StoreCluster != undefined) {
                         self.StoreClusters.forEach(e => {
                            if (e.value == self.StoreCluster) {
                                 
                                 tmpStoreCluster=e.text   
                            }
                        })
                    }
                    // if(self.CategoryCluster!=null||self.CategoryCluster!=undefined)
                    // {} 
                    if (self.AssignedUser != null || self.AssignedUser != undefined) {
                        self.users.forEach(e => {
                            if (e.value == self.AssignedUser) {
                                
                                 tmpAssignedUser=e.text   
                            }
                        })
                    }
                    let encoded_details = jwt.decode(sessionStorage.accessToken);
                    Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;


                    if (self.isAdd == false) {
                        let trans = {
                            "id": self.id,
                            "uid": self.uid,
                            "project_ID": self.projectID,
                            "storeCluster": tmpStoreCluster,
                            "storeCluster_ID": self.storeCluster,
                            "store_ID": self.Store,
                            "store": tmpStore,

                            "dateTime": self.date,
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
                    if (self.isAdd == true) {
                        let trans = {
                            "project_ID": self.projectID,
                            "storeCluster_ID": self.storeCluster,
                            "store_ID": self.Store,
                            "dateTime": self.date,
                            "status": self.status,
                            "type": self.type,
                            "username": tmpAssignedUser,
                            "store": tmpStore,
                            "storeCluster": tmpStoreCluster,
                            "systemUserID": self.AssignedUser,
                        }
                        Axios.post(process.env.VUE_APP_API + 'ProjectTX', trans).then(res => {
                            self.afterClose(trans)

                            delete Axios.defaults.headers.common["TenantID"];
                        })
                    }
                    self.dialog = false

                    self.dialog = false

                }
            }
        }
    }
</script>