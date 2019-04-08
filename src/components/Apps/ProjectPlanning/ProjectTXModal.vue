<template>

    <v-dialog fullscreen v-model="dialog">
        <v-card>
            <v-toolbar color="primary" flat dark>
                <v-toolbar-title>Project Modal</v-toolbar-title>
                <v-spacer></v-spacer>

                <v-btn icon @click="dialog=false">
                    <v-icon>
                        close
                    </v-icon>
                </v-btn>

            </v-toolbar>
            <v-container grid-list-md>
                <v-layout row wrap>
                    <v-flex md12>
                        <v-autocomplete placeholder="Please select a Spaceplan..." v-model="selectedPlanogram" :items="planogramsList"
                            solo light>
                        </v-autocomplete>
                    </v-flex>

                    <v-flex md6>
                        <v-text-field label="Date" placeholder="Date" v-model="date"></v-text-field>
                    </v-flex>
                    <v-flex md6>
                        <v-select label="Status" placeholder="Status" :items="statusList" v-model="Status"></v-select>

                    </v-flex>
                    <v-flex md6>
                        <!-- <v-text-field label="Store" placeholder="Store" v-model="Store"></v-text-field> -->
                        <v-autocomplete style="max-width: 400px;" dense v-model="Store" :items="Stores" label="select a Store"></v-autocomplete>
                    </v-flex>
                    <v-flex md6>
                        <!-- <v-text-field label="StoreCluster" placeholder="StoreCluster" v-model="StoreCluster"></v-text-field> -->
                        <v-autocomplete style="max-width: 400px;" dense v-model="StoreCluster" :items="StoreClusters"
                            label="select a StoreCluster"></v-autocomplete>
                    </v-flex>
                    <v-flex md6>
                        <!-- <v-text-field label="CategoryCluster" placeholder="CategoryCluster" v-model="CategoryCluster"></v-text-field> -->
                        <v-autocomplete disabled style="max-width: 400px;" dense v-model="CategoryCluster" :items="CategoryClusters"
                            label="select a CategoryCluster"></v-autocomplete>
                    </v-flex>
                    <v-flex md6>
                        <v-autocomplete style="max-width: 400px;" dense v-model="AssignedUser" :items="users" label="find a user"></v-autocomplete>
                        <!-- <v-text-field label="AssignedUser" placeholder="AssignedUser" v-model="AssignedUser"></v-text-field> -->
                    </v-flex>
                    <v-flex md6>
                        <v-autocomplete style="max-width: 400px;" dense v-model="Type" :items="typeList" label="Select a Type"></v-autocomplete>
                        <!-- <v-text-field label="AssignedUser" placeholder="AssignedUser" v-model="AssignedUser"></v-text-field> -->
                    </v-flex>
                </v-layout>
                <v-card-actions>
                    <v-btn @click="dialog = false">cancel</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="submit"> submit</v-btn>

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
                id: null,
                uid: null,
                Type: null,
                Stores: [],
                StoreClusters: [],
                CategoryClusters: [],
                users: [],
                dialog: false,
                planogramsList: [],
                selectedPlanogram: null,
                date: null,
                Status: null,
                Store: null,
                StoreCluster: null,
                CategoryCluster: null,
                AssignedUser: null,
                typeList: [{
                        text: "DataPreparation",
                        value: 0
                    }, {
                        text: "Ranging",
                        value: 1
                    },
                    {
                        text: "Planogram",
                        value: 2
                    }, {
                        text: "DataPrePromotionparation",
                        value: 3
                    }
                ],
                statusList: [{
                        value: 0,
                        text: "Project Start"
                    },
                    {
                        value: 1,
                        text: "InProgress"
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
            this.getStores()
            this.getStoreClusters()
        },
        methods: {
            getStores() {
                let self = this
                Axios.get(process.env.VUE_APP_API + `Store?db=CR-Hinterland-LIVE`).then(r => {

                    r.data.forEach(element => {
                        self.Stores.push({
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
            open(isAdd, item) {
                var self = this
                console.log("isAdd");

                console.log(item);



                self.dialog = true



                if (isAdd == false) {
                    self.isAdd = false
                    self.projectID = item.project_ID
                    self.id = item.id
                    self.uid = item.uid
                    self.Type = item.type
                    self.selectedPlanogram = item.planogram_ID
                    self.date = item.dateTimeString
                    self.Status = item.status
                    self.Store = item.store_ID
                    self.StoreCluster = item.storeCluster_ID
                    self.CategoryCluster = item.storeCluster
                    self.AssignedUser = item.systemUserID
                }
                if (isAdd == true) {
                    self.projectID = item.id

                    self.isAdd = true
                    self.Type = null,
                        self.selectedPlanogram = item.planogram_ID,
                        self.date = null
                    self.Status = null
                    self.Store = null
                    self.StoreCluster = null
                    self.CategoryCluster = null
                    self.AssignedUser = null
                }
            },
            submit() {
                var self = this
                let encoded_details = jwt.decode(sessionStorage.accessToken);
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;


                if (self.isAdd == false) {
                    let trans = {
                        "id": self.id,
                        "uid": self.uid,
                        "project_ID": self.projectID,
                        "storeCluster_ID": self.storeCluster,
                        "store_ID": self.Store,
                        "dateTime": self.date,
                        "status": self.status,
                        "Type": self.Type,
                        "systemUserID": self.AssignedUser,
                    }
                    Axios.put(process.env.VUE_APP_API + 'ProjectTX', trans).then(res => {
                        console.log(res);

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
                        "Type": self.Type,
                        "systemUserID": self.AssignedUser,
                    }
                    Axios.post(process.env.VUE_APP_API + 'ProjectTX', trans).then(res => {
                        console.log(res);

                        delete Axios.defaults.headers.common["TenantID"];
                    })
                }
                self.dialog = false

                self.dialog = false

            }
        }
    }
</script>