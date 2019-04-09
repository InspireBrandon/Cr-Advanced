<template>
    <v-card>
        <v-toolbar dense dark>
            <v-spacer></v-spacer>
            <v-toolbar-title>Planogram Implementation</v-toolbar-title>
        </v-toolbar>
        <v-container grid-list-md>
            <v-layout row wrap>
                <v-flex xl4 lg4 md6 sm12 xs12>
                    <v-autocomplete @change="getPlanogramByID" placeholder="Select a project" v-model="project"
                        :items="projects_dropdown" label="Current Project"></v-autocomplete>
                </v-flex>
                <v-flex v-if="project != null && planogramsList.length == 0" lg9 md4 sm12 xs12>
                    No planograms found
                </v-flex>
                <v-flex v-if="project != null && planogramsList.length > 0" lg9 md4 sm12 xs12>
                    <v-card>
                        <v-toolbar dark color="primary" flat dense>Planograms <v-spacer></v-spacer>
                        </v-toolbar>
                        <v-autocomplete @change="selectPlanogram" placeholder="Please select a Planogram..." v-model="selectedPlanogram"
                            :items="planogramsList" solo light :disabled="storeDisabled">
                        </v-autocomplete>
                        <div v-if="selectedPlanoList!=null">
                            <v-flex v-if="selectedPlanoList!=null">Status: {{status[selectedPlanoList.status == null ?
                                2 :
                                selectedPlanoList.status].friendy}} </v-flex>
                            <v-btn v-if="selectedPlanoList.status==4" @click="implementPlano(selectedPlanoList)">
                                Implement Planogram
                            </v-btn>
                            <v-flex>
                                <v-btn v-if="selectedPlanoList.status==2 " @click="ApprovePlano(selectedPlanogram)">
                                    Approve
                                </v-btn>
                                <v-btn v-if="selectedPlanoList.status==2 ||selectedPlanoList.status==null" avatar
                                    @click="$router.push(`/PlanogramImplementation/RequestNewPlanogram/`+selectedPlanoList.id)">
                                    Request Variation
                                </v-btn>
                            </v-flex>

                        </div>

                    </v-card>
                    <v-layout row wrap>
                        <v-flex v-if="selectedPlanogram != null" lg8 md8 sm12 xs12 @click="openImage">
                            <v-card light>
                                <v-toolbar color="primary" dark flat dense>
                                    Planogram Image
                                    <v-spacer></v-spacer>
                                    <v-tooltip bottom>
                                        <v-btn icon slot="activator" @click="downloadImage">
                                            <v-icon>save_alt</v-icon>
                                        </v-btn>
                                        <span>downoad planogram image</span>
                                    </v-tooltip>
                                </v-toolbar>
                                <v-card-text>
                                    <v-img contain style="max-height: 400px;" :src="image"></v-img>
                                </v-card-text>
                            </v-card>
                        </v-flex>
                        <v-flex v-if="selectedPlanogram != null" lg4 md4 sm12 xs12>
                            <v-card>
                                <v-toolbar dark color="primary" flat dense>Reports</v-toolbar>
                                <v-list light dense>
                                    <v-list-tile @click="goToReport('ProductReport')">
                                        <v-list-tile-title>Product Report</v-list-tile-title>
                                    </v-list-tile>
                                    <v-divider></v-divider>
                                    <v-list-tile @click="goToReport('FixtureReport')">
                                        <v-list-tile-title>Fixture Report</v-list-tile-title>
                                    </v-list-tile>
                                    <v-divider></v-divider>
                                    <v-list-tile @click="goToReport('ProductFixtureReport')">
                                        <v-list-tile-title>Product Fixture Report</v-list-tile-title>
                                    </v-list-tile>
                                    <v-divider></v-divider>
                                </v-list>
                            </v-card>
                        </v-flex>
                    </v-layout>
                </v-flex>
                <v-flex v-if="project != null" lg3 md4 sm12 xs12>
                    <v-card class="mx-auto" max-width="400">
                        <v-card dark color="primary">
                            <v-card-title>
                                <h3 class="title font-weight-light text-xs-center grow">Status Timeline</h3>
                            </v-card-title>
                        </v-card>
                        <v-card-text class="py-0">
                            <v-timeline align-top dense>
                                <v-timeline-item v-for="(item,index) in timelineItems" :key="index" small>
                                    <v-layout pt-3>
                                        <v-flex xs3>
                                            <div class="caption">{{item.date}}</div>
                                        </v-flex>
                                        <v-spacer></v-spacer>
                                        <v-flex>
                                            <strong>{{status[item.status].friendy}}</strong>
                                            <div class="caption">{{item.notes}}</div>
                                        </v-flex>
                                    </v-layout>
                                </v-timeline-item>
                            </v-timeline>
                        </v-card-text>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
    </v-card>
</template>

<script>
    import Axios from 'axios';
    import jwt from 'jsonwebtoken';
    import PlanogramAprovalModal from './PlanogramIplementationModal';

    export default {
        components: {
            PlanogramAprovalModal
        },
        data: () => {
            return {
                accessType: null,
                showLoader: true,
                status: [{
                    type: 0,
                    friendy: "New",
                    color: "blue"
                }, {
                    type: 1,
                    color: "blue",
                    friendy: "In Progress"
                }, {
                    type: 2,
                    color: "blue",
                    friendy: "Requsting Approval"
                }, {
                    type: 3,
                    color: "red",
                    friendy: "Variation Requested"
                }, {
                    type: 4,
                    color: "green",
                    friendy: "Approved"
                }, {
                    type: 5,
                    color: "green",
                    friendy: "Implemented"
                }, {
                    type: 6,
                    color: "black",
                    friendy: "Retracted"
                }],
                timelineItems: [],
                headers: [{
                    text: "Name",
                    value: name
                }, {
                    text: "Status",
                    value: name
                }, {
                    text: "Actions",
                    value: name
                }],
                imageModal: false,
                PlanoList: [],
                selectedPlanoList: null,
                stores: [],
                storesDropdown: [],
                selectedStore: null,
                planograms: [],
                planogramsList: [],
                selectedPlanogram: null,
                image: '',
                storeDisabled: false,
                spacePlanID: null,
                projects: [],
                projects_dropdown: [],
                project: null,
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
                        text: "Promotion",
                        value: 3
                    }
                ],
                status: [{
                        text: "Project Start"
                    },
                    {
                        text: "In Progress"
                    },
                    {
                        text: "Complete"
                    },
                    {
                        text: "Workshop"
                    }, 
                    {
                        text: "Meeting"
                    },
                    {
                        text: "Ranging Start"
                    },
                    {
                        text: "Planogram Start"
                    },
                    {
                        text: "Checking"
                    },
                    {
                        text: "Requesting Approval"
                    },
                    {
                        text: "Declined"
                    },
                    {
                        text: "Approved"
                    },
                    {
                        text: "Implementation Pending"
                    },
                    {
                        text: 'Variation Request'
                    },
                    {
                        text: "Implemented"
                    },
                    {
                        text: "On Hold"
                    }
                ]
            }
        },
        mounted() {
            let self = this;
            self.getPlanograms();
        },
        methods: {
            getProjects() {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + 'Project').then(r => {
                    let projects = r.data.projectList;
                    self.projects = projects;

                    self.projects_dropdown = [];

                    projects.forEach(element => {
                        self.projects_dropdown.push({
                            text: element.name,
                            value: element.id
                        })
                    });

                    delete Axios.defaults.headers.common["TenantID"];
                })
            },
            getPlanogramByID() {
                let self = this;

                self.selectedPlanogram = null;

                self.$nextTick(() => {
                    // get planogram id from selected project
                    let planogramID = -1;

                    self.projects.forEach(el => {
                        if (el.id == self.project)
                            planogramID = el.planogram_ID
                    })

                    Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                    Axios.get(process.env.VUE_APP_API + `ProjectTX?projectID=${self.project}`).then(r => {
                        delete Axios.defaults.headers.common["TenantID"];

                        self.timelineItems = [];

                        r.data.projectTXList.forEach(element => {
                            self.timelineItems.push({
                                status: element.type,
                                notes: self.status[element.status].text,
                                date: element.dateTimeString
                            })
                        })
                    })

                    Axios.get(process.env.VUE_APP_API + 'Planogram?planogramID=' + planogramID)
                        .then(r => {
                            self.populateSpacePlans(r.data[0]);
                        })
                        .catch(e => {

                        })
                })
            },
            populateSpacePlans(planogram) {
                let self = this;

                let tmpPlanograms = [];

                self.planograms.forEach(el => {
                    if (el.name.includes(planogram.displayname))
                        tmpPlanograms.push({
                            text: el.name,
                            value: el.id
                        })
                })

                self.planogramsList = tmpPlanograms;
            },
            getAccessType() {
                let self = this
                let encoded_details = jwt.decode(sessionStorage.accessToken);
                Axios.get(process.env.VUE_APP_API +
                        `TenantLink_AccessType?systemUserID=${encoded_details.USER_ID}&tenantID=${sessionStorage.currentDatabase}`
                    )
                    .then(r => {
                        if (r.data.isDatabaseOwner) {
                            self.accessType = 0
                        } else {
                            self.accessType = r.data.tenantLink_AccessTypeList[0]

                        }

                        if (r.data.isDatabaseOwner) {
                            self.getPlanogramsByStore();
                        } else {
                            if (r.data.tenantLink_AccessTypeList != null && r.data.tenantLink_AccessTypeList
                                .length >
                                1) {
                                let item = r.data.tenantLink_AccessTypeList[0];




                                if (item.accessType == 2) {
                                    // store
                                    self.selectedStore = item.storeID;
                                    self.storeDisabled = true;
                                    self.getPlanogramsByStore();
                                } else {
                                    self.getPlanogramsByStore();
                                }
                            } else {
                                self.getPlanogramsByStore();
                            }
                        }

                        self.showLoader = false;
                    }).catch(e => {
                        self.accessType = -1
                        self.showLoader = false;
                    })
            },
            goToReport(reportName) {
                let self = this
                self.$router.push(`/Reports/SpacePlanning/${reportName}/` + self.selectedPlanogram)
            },
            openImage() {
                this.imageModal = true;
            },
            getStores() {
                let self = this;

                Axios.get(process.env.VUE_APP_API + 'Store?db=CR-DEVINSPIRE')
                    .then(r => {
                        self.stores = r.data;

                        r.data.forEach(element => {

                            self.storesDropdown.push({
                                text: element.storeName,
                                value: element.storeID
                            })
                        });

                        self.getPlanograms();
                    })
            },
            getPlanograms() {
                let self = this;

                Axios.get(process.env.VUE_APP_API + 'SystemFile/JSON?db=CR-DEVINSPIRE&folder=SPACE PLANNING')
                    .then(r => {
                        self.planograms = r.data;
                        self.getProjects();
                        //self.getAccessType();
                    })
            },
            getPlanogramsByStore(type) {
                let self = this;
                let encoded_details = jwt.decode(sessionStorage.accessToken);
                self.selectedPlanogram = null;

                self.$nextTick(() => {
                    let cluster = "";


                    self.stores.forEach(store => {
                        if (store.storeID == self.selectedStore) {
                            cluster = store.storeClusterName;
                        }
                    })

                    let tmpPlanograms = [];

                    self.planograms.forEach(planogram => {
                        if (planogram.name.includes(cluster)) {
                            if (self.accessType.accessType == 3 && (planogram.status == 4 || planogram
                                    .status ==
                                    5)) {
                                if (self.accessType.storeID == planogram.storeID) {
                                    tmpPlanograms.push({
                                        text: planogram.name,
                                        value: planogram.id
                                    });
                                }

                            }
                            if (self.accessType.accessType == 1 && (planogram.status == 2 || planogram
                                    .status ==
                                    5)) {
                                if (encoded_details.USER_ID == planogram.buyerID) {
                                    tmpPlanograms.push({
                                        text: planogram.name,
                                        value: planogram.id
                                    });
                                }
                            }
                            if (self.accessType == 0) {

                                tmpPlanograms.push({
                                    text: planogram.name,
                                    value: planogram.id
                                });


                            }

                            self.PlanoList.push(planogram)
                        }
                    })

                    self.planogramsList = tmpPlanograms;
                })
            },
            ApprovePlano(item) {
                let self = this
                var tmp = null
                self.planograms.forEach(p => {
                    if (p.id == item) {
                        tmp = p
                    }
                })

                self.$refs.PlanogramAprovalModal.show('Submit planogram for aproval?', (value, notesModal,
                    selectedUser) => {

                    if (value == true) {
                        if (item != null) {


                            let systemFileApproval = {
                                systemFile_ID: item,
                                status: 4,
                                transactionDateTime: new Date(),
                                notes: notesModal,

                            }

                            // axios.put(process.env.VUE_APP_API+`SystemFileApproval?db=CR-Devinspire&buyerID=`+self.spacePlanID,{})


                            Axios.post(process.env.VUE_APP_API +
                                "SystemFileApproval?db=CR-Devinspire&buyerID=" +
                                tmp.buyerID + "&storeID=" +
                                selectedUser, {
                                    systemFileApproval: systemFileApproval
                                }).then(
                                r => {

                                    self.planograms.forEach(p => {
                                        if (p.id == systemFileApproval.systemFile_ID) {
                                            p.status = systemFileApproval.status
                                        }
                                    })
                                })
                        }
                    }
                })
            },
            implementPlano(item) {
                let systemFileApproval = {
                    systemFile_ID: item.id,
                    status: 5,
                    transactionDateTime: new Date(),
                    notes: null
                }
                let encoded_details = jwt.decode(sessionStorage.accessToken);
                item.status = 5
                Axios.post(process.env.VUE_APP_API + "SystemFileApproval?db=CR-Devinspire&buyerID=" +
                    item.buyerID + "&storeID=" +
                    encoded_details.USER_ID, {
                        systemFileApproval: systemFileApproval
                    }).then(
                    r => {})
            },
            selectPlanogram(planogram) {
                let self = this;
                self.$nextTick(() => {
                    self.selectedPlanogram = planogram;



                    self.PlanoList.forEach(item => {

                        if (item.id == planogram) {
                            self.selectedPlanoList = item
                        }
                    })
                    Axios.get(process.env.VUE_APP_API + 'SystemFile/JSON?db=CR-DEVINSPIRE&id=' + planogram)
                        .then(r => {
                            self.image = r.data.image;
                        })
                })
            },
            downloadImage() {
                let self = this;
            }
        }
    }
</script>

<style>
    .selected-planogram {
        background: 'black';
    }
</style>