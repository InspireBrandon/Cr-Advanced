<template>
    <v-card>
        <v-toolbar dense dark>
            <v-spacer></v-spacer>
            <v-toolbar-title>Planogram Implementation</v-toolbar-title>
        </v-toolbar>
        <v-container fluid grid-list-md>
            <v-layout row wrap>
                <v-flex xl7 lg7 md12 sm12 xs12>
                    <v-flex v-if="authorityType == 0" xl6 lg6 md6 sm12 xs12>
                        <v-autocomplete :disabled="showLoader" @change="getProjectsByProjectGroup"
                            v-model="selectedProjectGroup" :items="projectGroupsSelect" hide-details
                            label="Project Group">
                        </v-autocomplete>
                    </v-flex>

                    <v-flex v-else xl6 lg6 md6 sm12 xs12>
                        <v-autocomplete :disabled="showLoader" @change="getUserProjectsByProjectGroup"
                            v-model="selectedProjectGroup" :items="projectGroupsSelect" hide-details
                            label="Project Group">
                        </v-autocomplete>
                    </v-flex>

                    <v-flex xl6 lg6 md6 sm12 xs12>
                        <v-autocomplete :disabled="showLoader" @change="onProjectChange"
                            v-if="selectedProjectGroup != null" v-model="selectedProject" :items="projectsSelect"
                            hide-details label="Project">
                        </v-autocomplete>
                    </v-flex>


                    <v-flex xl12 lg12 md6 sm12 xs12 v-if="currentPlanogram != null && selectedProject != null">
                        <h1>{{ currentPlanogram.name }} </h1>
                        <v-autocomplete :disabled="showLoader" @change="selectPlanogram(selectedPlanogram)" dense
                            v-model="selectedPlanogram" :items="filterPlanograms" label="Planogram"></v-autocomplete>
                    </v-flex>
                    <v-flex xl12 lg12 md12 sm12 xs12 style="text-align: center;">
                        <v-progress-circular v-if="showLoader" class="ma-0" color="primary" indeterminate height="5">
                        </v-progress-circular>
                    </v-flex>
                    <v-flex xl12 lg12 md12 sm12 xs12 v-if="planogramObj != null && !showLoader">
                        <v-toolbar color="primary" dark dense flat v-if="selectedPlanogram != null">
                            <v-toolbar-title>
                                Status: {{status[timelineItems[0].status].text}}

                            </v-toolbar-title>
                            <!-- <v-btn v-if="(( authorityType == 1)&&(projectsStatus.status==10))" >Approve</v-btn>
                             <v-btn v-if="((authorityType == 1)&&(projectsStatus.status==10))">Decline</v-btn>
                               <v-btn v-if="((authorityType == 1)&&(projectsStatus.status==10))">Request Variation</v-btn>
                                 <v-btn v-if="(( authorityType == 3)&&(projectsStatus.status==13))">Implement Planogram</v-btn>
                                   <v-btn v-if="(( authorityType == 1)&&(projectsStatus.status==19))">Distribute Planograms</v-btn> -->
                        </v-toolbar>
                        <v-divider></v-divider>
                        <v-toolbar color="primary" dark dense flat v-if="selectedPlanogram != null">

                            <v-btn flat outline
                                v-if="(( authorityType == 1)&&(projectsStatus.status==10)) || authorityType == 0"
                                @click="openImplementationModal(projectsStatus.status,0)">Approve</v-btn>
                            <v-btn flat outline
                                v-if="((authorityType == 1)&&(projectsStatus.status==10)) || authorityType == 0"
                                @click="openImplementationModal(projectsStatus.status,1)">Decline</v-btn>
                            <v-btn flat outline
                                v-if="((authorityType == 1)&&(projectsStatus.status==10)) || authorityType == 0"
                                @click="openImplementationModal(projectsStatus.status,2)">Variation</v-btn>
                            <v-btn flat outline
                                v-if="(( authorityType == 3)&&(projectsStatus.status==13)) || authorityType == 0"
                                @click="openImplementationModal(projectsStatus.status,3)">Implement
                            </v-btn>
                            <v-btn flat outline
                                v-if="(( authorityType == 1)&&(projectsStatus.status==19)) || authorityType == 0"
                                @click="openImplementationModal(projectsStatus.status,4)">Distribute
                            </v-btn>
                        </v-toolbar>
                    </v-flex>
                    <v-flex v-if="planogramObj != null && !showLoader" lg12 md12 sm12 xs12>
                        <v-card light>
                            <v-toolbar color="primary" dark flat dense>
                                Planogram Image
                                <v-spacer></v-spacer>
                                <v-tooltip bottom>
                                    <v-btn flat outline slot="activator" @click="openReport">
                                        <!-- <v-icon>save_alt</v-icon> -->
                                        Open Report
                                    </v-btn>
                                    <span>Open Report</span>
                                </v-tooltip>
                            </v-toolbar>
                            <v-card-text>
                                <v-img contain style="max-height: 350px;" :src="image" @click="openImage"></v-img>
                            </v-card-text>
                        </v-card>
                    </v-flex>
                    <!-- <v-flex xl12 lg12 md12 sm12 xs12 v-if="planograms.length > 0">

                        <v-list dense class="pa-0 ma-0">
                            <template v-if="item.name.toUpperCase().includes(currentPlanogram.displayname)"
                                v-for="(item, index) in planograms">
                                <v-list-tile :key="item.title" avatar ripple>
                                    <v-list-tile-content>
                                        <v-list-tile-title>{{ item.name }}</v-list-tile-title>
                                    </v-list-tile-content>
                                    <v-list-tile-action>
                                        <v-menu left>
                                            <v-btn icon slot="activator">
                                                <v-icon>more_vert</v-icon>
                                            </v-btn>

                                            <v-list dense class="pa-0 ma-0">
                                                <v-list-tile @click="$refs.PlanogramReportModal.show(item)">
                                                    <v-list-tile-title>Show</v-list-tile-title>
                                                </v-list-tile>
                                                <v-divider
                                                    v-if="((authorityType == 0 || authorityType == 1)&&(projectsStatus.status==10))">
                                                </v-divider>
                                                <v-list-tile v-if="(( authorityType == 1)&&(projectsStatus.status==10))"
                                                    @click="openImplementationModal(projectsStatus.status,0)">
                                                    <v-list-tile-title>Approve</v-list-tile-title>
                                                </v-list-tile>
                                                <v-divider v-if="(( authorityType == 1)&&(projectsStatus.status==10))">
                                                </v-divider>
                                                <v-list-tile v-if="((authorityType == 1)&&(projectsStatus.status==10))"
                                                    @click="openImplementationModal(projectsStatus.status,1)">
                                                    <v-list-tile-title>Decline</v-list-tile-title>
                                                </v-list-tile>
                                                <v-divider v-if="((authorityType == 1)&&(projectsStatus.status==10))">
                                                </v-divider>
                                                <v-list-tile v-if="((authorityType == 1)&&(projectsStatus.status==10))"
                                                    @click="openImplementationModal(projectsStatus.status,2)">
                                                    <v-list-tile-title>Request Variation</v-list-tile-title>
                                                </v-list-tile>
                                                <v-divider v-if="(( authorityType == 1)&&(projectsStatus.status==13))">
                                                </v-divider>
                                                <v-list-tile v-if="(( authorityType == 3)&&(projectsStatus.status==13))"
                                                    @click="openImplementationModal(projectsStatus.status,3)">
                                                    <v-list-tile-title>Implement Planogram</v-list-tile-title>
                                                </v-list-tile>
                                                <v-divider v-if="(( authorityType == 1)&&(projectsStatus.status==19))">
                                                </v-divider>
                                                <v-list-tile v-if="(( authorityType == 1)&&(projectsStatus.status==19))"
                                                    @click="openImplementationModal(projectsStatus.status,4)">
                                                    <v-list-tile-title>Distribute Planograms</v-list-tile-title>
                                                </v-list-tile>
                                            </v-list>

                                        </v-menu>
                                    </v-list-tile-action>
                                </v-list-tile>
                                <v-divider v-if="index + 1 < planograms.length" :key="index"></v-divider>
                            </template>
                        </v-list>
                    </v-flex> -->
                </v-flex>
                <v-flex xl5 lg5 md12 sm12 xs12 v-if="timelineItems.length > 0">
                    <v-toolbar flat dense dark color="primary">
                        <v-toolbar-title>Project Timeline</v-toolbar-title>
                    </v-toolbar>
                    <v-card flat style="height: calc(100vh - 200px); overflow: auto;">
                        <v-card-text>
                            <v-timeline dense>
                                <v-timeline-item right :color="typeList[item.type == -1 ? 5 : item.type].color"
                                    v-for="(item,index) in timelineItems" :key="index" small>
                                    <v-card :color="typeList[item.type == -1 ? 5 : item.type].color" dark>
                                        <v-card-title class="title pa-2 ma-0">
                                            <span>{{ status[item.status  == -1 ? 18 : item.status].text }}</span>
                                            <v-spacer></v-spacer>
                                            <span>{{ item.date }}</span>
                                        </v-card-title>
                                    </v-card>
                                    <template v-slot:opposite>
                                        <span>{{ item.user }}</span>
                                    </template>
                                </v-timeline-item>
                            </v-timeline>
                        </v-card-text>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
        <v-dialog fullscreen v-model="imageModal">
            <v-card>
                <v-toolbar dark color="primary" prominent>
                    <v-spacer></v-spacer>
                    <v-btn @click="imageModal = false" icon>
                        <v-icon>close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card flat style="padding: 5px; overflow-x: auto; text-align: center;">
                    <img contain style="max-height: calc(100vh - 100px);" :src="image">
                </v-card>
            </v-card>
        </v-dialog>
        <PlanogramReportModal ref="PlanogramReportModal"></PlanogramReportModal>
        <PlanogramIplementationModal ref="PlanogramIplementationModal"></PlanogramIplementationModal>
    </v-card>
</template>

<script>
    import Axios from 'axios';
    import jwt from 'jsonwebtoken';
    import PlanogramReportModal from './PlanogramReportModal';
    import PlanogramIplementationModal from './PlanogramIplementationModal'
    import moment from 'moment'

    let _MODULE = "Planogram Implementation";

    export default {
        components: {
            PlanogramReportModal,
            PlanogramIplementationModal
        },
        data: () => {
            return {
                planogramObj: null,
                showLoader: false,
                imageModal: false,
                image: '',
                selectedPlanogram: null,
                PlanogramItems: [],
                projectID: null,
                authorityType: -1,
                projectGroups: [],
                projectGroupsSelect: [],
                selectedProjectGroup: null,
                projects: [],
                projectsSelect: [],
                selectedProject: null,
                planograms: [],
                currentPlanogram: null,
                active: 0,
                timelineItems: [],
                projectsStatus: null,
                status: [{
                        text: "Project Start",
                        value: 0,
                        friendly: "Project Start",
                        color: "blue",
                    },
                    {
                        text: "In Progress",
                        value: 1,
                        color: "blue",
                        friendly: "In Progress"

                    },
                    {
                        text: "Complete",
                        value: 2,
                        color: "blue",
                        friendly: "Complete"
                    },
                    {
                        text: "Workshop",
                        value: 3,
                        color: "warning",
                        friendly: "Workshop"
                    }, {
                        text: "Workshop Complete",
                        value: 4,
                        color: "warning",
                        friendly: "Workshop Complete"
                    },
                    {
                        text: "Meeting",
                        value: 5,
                        color: "warning",
                        friendly: "Meeting"
                    },
                    {
                        text: "Data Preparation Start",
                        value: 6,
                        color: "red",
                        friendly: "Data Preparation Start"
                    },
                    {
                        text: "Ranging Start",
                        value: 7,
                        color: "red",
                        friendly: "Ranging Start"
                    },
                    {
                        text: "Planogram Start",
                        value: 8,
                        color: "green",
                        friendly: "Planogram Start"
                    },
                    {
                        text: "Meeting Supplier",
                        value: 9,
                        color: "green",
                        friendly: "Meeting Supplier"
                    },
                    {
                        text: "Requesting Approval",
                        value: 10,
                        color: "green",
                        friendly: "Requesting Approval"
                    },
                    {
                        text: "Declined",
                        value: 11,
                        color: "green",
                        friendly: "Declined"
                    },
                    {
                        text: "Approved",
                        value: 12,
                        color: "green",
                        friendly: "Approved"
                    },
                    {
                        text: "Implementation Pending",
                        value: 13,
                        color: "blue",
                        friendly: "Implementation Pending"
                    },
                    {
                        text: "Variation Request",
                        value: 14,
                        color: "blue",
                        friendly: 'Variation Request'
                    },
                    {
                        text: "Implemented",
                        value: 15,
                        color: "blue",
                        friendly: "Implemented"
                    },
                    {
                        text: "On Hold",
                        value: 16,
                        color: "blue",
                        friendly: "On Hold"
                    },
                    {
                        text: "Waiting Fixture Requirements",
                        value: 17,
                        color: "blue",
                        friendly: "Waiting Fixture Requirements"
                    }, {
                        text: "Waiting Supplier",
                        value: 18,
                        color: "blue",
                        friendly: "Waiting Supplier"
                    }, {
                        text: "Awaiting Distribution",
                        value: 19,
                        color: "blue",
                        friendly: "Awaiting Distribution",
                    }
                ],
                typeList: [{
                        text: "Event",
                        value: 0,
                        color: "warning"
                    },
                    {
                        text: "Data Preparation",
                        value: 1,
                        color: "green"

                    }, {
                        text: "Ranging",
                        value: 2,
                        color: "red"

                    },
                    {
                        text: "Planogram",
                        value: 3,
                        color: "blue"

                    }, {
                        text: "Promotion",
                        value: 4,
                        color: "purple"

                    }, {
                        text: "",
                        value: 5
                    }
                ],
                currentStatus: null
            }
        },
        mounted() {
            let self = this;
            self.initialise();
        },
        computed: {
            filterPlanograms: function () {
                var self = this
                let value = self.type;

                if (self.PlanogramItems != null && self.currentPlanogram != null) {
                    return this.PlanogramItems.filter(function (item) {
                        return item.text.toUpperCase().includes(self.currentPlanogram.displayname);
                    })
                } else {
                    return [];
                }

            }
        },
        methods: {
            openReport() {
                let self = this
                console.log(self.planogramObj);
                self.$refs.PlanogramReportModal.show(self.planogramObj)
            },
            selectPlanogram(planogram) {
                let self = this;
                self.showLoader = true

                console.log(planogram)

                self.$nextTick(() => {

                    console.log(process.env.VUE_APP_API + 'SystemFile/JSON?db=CR-DEVINSPIRE&id=' + planogram)

                    Axios.get(process.env.VUE_APP_API + 'SystemFile/JSON?db=CR-DEVINSPIRE&id=' + planogram)
                        .then(r => {
                            console.log(r.data);
                            self.planogramObj = r.data
                            self.image = r.data.image;
                            self.showLoader = false
                        })
                })
            },
            downloadImage() {
                var self = this
            },
            openImage() {
                this.imageModal = true;
            },
            openImplementationModal(status, type) {
                let self = this

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                let encoded_details = jwt.decode(sessionStorage.accessToken);

                if (status == 10 && type == 0) {
                    self.$refs.PlanogramIplementationModal.show(
                        "Approve planogram", type, data => {
                            if (data.value == true) {

                                let trans = {
                                    "project_ID": self.projectID,
                                    "dateTime": new Date,
                                    "dateTimeString": moment(new Date).format('YYYY-MM-DD'),
                                    "username": self.timelineItems[self.timelineItems.length - 1].user,
                                    "status": 12,
                                    "type": 3,
                                    "systemUserID": self.timelineItems[self.timelineItems.length - 1].userID,
                                }
                                Axios.post(process.env.VUE_APP_API + 'ProjectTX', trans).then(
                                    res => {

                                        console.log(res);

                                        delete Axios.defaults.headers.common["TenantID"];
                                    })
                            }
                        })
                }
                if (status == 10 && type == 1) {
                    self.$refs.PlanogramIplementationModal.show(
                        "Decline Planogram Approval?", type, data => {
                            if (data.value == true) {



                                let trans = {
                                    "project_ID": self.projectID,
                                    "dateTime": new Date,
                                    "dateTimeString": moment(new Date).format('YYYY-MM-DD'),
                                    "username": self.timelineItems[self.timelineItems.length - 1].user,
                                    "status": 11,
                                    "type": 3,
                                    "systemUserID": self.timelineItems[self.timelineItems.length - 1].userID,
                                }
                                Axios.post(process.env.VUE_APP_API + 'ProjectTX', trans).then(
                                    res => {

                                        console.log(res);

                                        delete Axios.defaults.headers.common["TenantID"];
                                    })
                            }

                        })
                }
                if ((status == 12 || status == 10) && type == 2) {
                    self.$refs.PlanogramIplementationModal.show(
                        "Request Planogram Variation?", type, data => {
                            if (data.value == true) {


                                let trans = {
                                    "project_ID": self.projectID,
                                    "dateTime": new Date,
                                    "dateTimeString": moment(new Date).format('YYYY-MM-DD'),
                                    "username": self.timelineItems[self.timelineItems.length - 1].user,
                                    "status": 14,
                                    "type": 3,
                                    "systemUserID": self.timelineItems[self.timelineItems.length - 1].userID,
                                }
                                Axios.post(process.env.VUE_APP_API + 'ProjectTX', trans).then(
                                    res => {


                                        delete Axios.defaults.headers.common["TenantID"];
                                    })
                            }
                        })
                }
                if (status == 13 && type == 3) {
                    self.$refs.PlanogramIplementationModal.show(
                        "Implement Planogram?", type, data => {
                            if (data.value == true) {



                                let trans = {
                                    "project_ID": self.projectID,
                                    "dateTime": new Date,
                                    "dateTimeString": moment(new Date).format('YYYY-MM-DD'),
                                    "store_ID": self.projectsStatus.storeID,
                                    "username": self.projectsStatus.user,
                                    "status": 15,
                                    "type": 3,
                                    "systemUserID": self.projectsStatus.userID,
                                }
                                Axios.post(process.env.VUE_APP_API + 'ProjectTX', trans).then(
                                    res => {

                                        console.log(res);

                                        delete Axios.defaults.headers.common["TenantID"];
                                    })
                            }
                        })
                }
                if (status == 19 && type == 4) {
                    self.$refs.PlanogramIplementationModal.show(
                        "Select the Stores to distribute to", type, data => {
                            if (data.value == true) {



                                let trans = {
                                    "project_ID": self.projectID,
                                    "dateTime": new Date,
                                    "dateTimeString": moment(new Date).format('YYYY-MM-DD'),
                                    "store_ID": data.stores,
                                    "username": self.projectsStatus.user,
                                    "status": 13,
                                    "type": 3,
                                    "systemUserID": data.users,
                                }
                                Axios.post(process.env.VUE_APP_API + 'ProjectTX', trans).then(
                                    res => {

                                        console.log(res);

                                        delete Axios.defaults.headers.common["TenantID"];
                                    })

                            }
                        })
                }
            },
            initialise() {
                let self = this;
                let encoded_details = jwt.decode(sessionStorage.accessToken);
                let systemUserID = encoded_details.USER_ID;
                let tenantID = sessionStorage.currentDatabase;

                self.getUserDetails(systemUserID, tenantID)
                    .then(userType => {
                        self.handleUser(userType);
                    })
                    .catch(message => {
                        self.handleError(message);
                    })
            },
            getUserDetails(systemUserID, tenantID) {
                let self = this;

                self.inform("GET", "Getting user data.")

                return new Promise((resolve, reject) => {
                    Axios.get(process.env.VUE_APP_API +
                            `TenantLink_AccessType?systemUserID=${systemUserID}&tenantID=${tenantID}`)
                        .then(r => {
                            let userType = 0;

                            if (!r.data.isDatabaseOwner) {
                                userType = r.data.tenantLink_AccessTypeList[0].accessType
                            }

                            resolve(userType);
                        })
                        .catch(e => {
                            reject();
                        })
                })
            },
            handleUser(userType) {
                let self = this;

                self.authorityType = userType;

                self.inform("PROCESSING", "Selecting appropriate process.")

                switch (self.authorityType) {
                    case 0:
                        {
                            // Super User
                            self.processSuperUser()
                            .then(r => {

                            })
                            .catch(e => {

                            })
                        }
                        break;
                    case 1:
                        {
                            // Buyer
                            self.processBuyer();
                        }
                        break;
                    case 2:
                        {
                            // Supplier
                            self.processSupplier();
                        }
                        break;
                    case 3:
                        {
                            // Store
                            self.processStore();
                        }
                        break;
                }
            },
            processSuperUser() {
                let self = this;

                self.inform("PROCESSING", "Handling user of type SUPER USER.")

                return new Promise((resolve, reject) => {
                    self.getProjectGroups()
                        .then(r => {
                            self.projectGroups = r.data.projectGroupsList

                            resolve();
                        })
                        .catch(e => {
                            reject();
                        })
                })
            },
            processBuyer() {
                let self = this;

                self.inform("PROCESSING", "Handling user of type BUYER.")

                return new Promise((resolve, reject) => {
                    self.getProjectGroupsByUserID()
                        .then(() => {
                            resolve();
                        })
                        .catch(() => {
                            reject();
                        })
                })
            },
            processSupplier() {
                let self = this;

                self.inform("PROCESSING", "Handling user of type SUPPLIER.")

                return new Promise((resolve, reject) => {
                    self.getProjectGroupsByUserID()
                        .then(() => {
                            resolve();
                        })
                        .catch(() => {
                            reject();
                        })
                })
            },
            processStore() {
                let self = this;

                self.inform("PROCESSING", "Handling user of type STORE.")

                return new Promise((resolve, reject) => {
                    self.getProjectGroupsByUserID()
                        .then(() => {
                            resolve();
                        })
                        .catch(() => {
                            reject();
                        })
                })
            },
            getProjectGroups() {
                let self = this;

                return new Promise((resolve, reject) => {
                    Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                    Axios.get(process.env.VUE_APP_API + `ProjectGroup`)
                        .then(r => {
                            delete Axios.defaults.headers.common["TenantID"];
                            self.projectGroups = r.data.projectGroupList;

                            self.projectGroupsSelect = [];

                            self.projectGroups.forEach(el => {
                                self.projectGroupsSelect.push({
                                    text: el.name,
                                    value: el.id
                                })
                            })

                            resolve();
                        })
                        .catch(e => {
                            delete Axios.defaults.headers.common["TenantID"];
                            reject();
                        })
                })
            },
            getProjectGroupsByUserID() {
                let self = this;
                let encoded_details = jwt.decode(sessionStorage.accessToken);
                let systemUserID = encoded_details.USER_ID;

                return new Promise((resolve, reject) => {
                    Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                    Axios.get(process.env.VUE_APP_API + `ProjectGroup?userID=${systemUserID}`)
                        .then(r => {
                            delete Axios.defaults.headers.common["TenantID"];
                            self.projectGroups = r.data.projectGroupList;

                            self.projectGroupsSelect = [];

                            self.projectGroups.forEach(el => {
                                self.projectGroupsSelect.push({
                                    text: el.name,
                                    value: el.id
                                })
                            })

                            resolve();
                        })
                        .catch(e => {
                            delete Axios.defaults.headers.common["TenantID"];
                            reject();
                        })
                })

            },
            getProjectsByProjectGroup() {
                let self = this;
                self.projectsSelect = null
                self.selectedPlanogram = null
                self.planogramObj = null;
                self.image = null;
                self.selectedProject = null;
                self.timelineItems = []
                return new Promise((resolve, reject) => {
                    Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                    self.$nextTick(() => {
                        let projectGroupID = self.selectedProjectGroup;

                        Axios.get(process.env.VUE_APP_API + `Project?projectGroupID=${projectGroupID}`)
                            .then(r => {
                                delete Axios.defaults.headers.common["TenantID"];
                                self.projects = r.data.projectList;

                                self.projectsSelect = [];

                                self.projects.forEach(el => {
                                    self.projectsSelect.push({
                                        text: el.name,
                                        value: el.id
                                    })
                                })

                                resolve();
                            })
                            .catch(e => {
                                delete Axios.defaults.headers.common["TenantID"];

                                reject();
                            })
                    })
                })
            },
            getUserProjectsByProjectGroup() {
                let self = this;
                self.projectsSelect = null
                self.selectedPlanogram = null
                self.planogramObj = null;
                self.selectedProject = null;
                self.image = null;
                self.timelineItems = []
                let encoded_details = jwt.decode(sessionStorage.accessToken);
                let systemUserID = encoded_details.USER_ID;

                return new Promise((resolve, reject) => {
                    Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                    self.$nextTick(() => {
                        let projectGroupID = self.selectedProjectGroup;

                        Axios.get(process.env.VUE_APP_API +
                                `Project?projectGroupID=${projectGroupID}&userID=${systemUserID}`)
                            .then(r => {
                                delete Axios.defaults.headers.common["TenantID"];
                                self.projects = r.data.projectList;

                                self.projectsSelect = [];

                                self.projects.forEach(el => {
                                    self.projectsSelect.push({
                                        text: el.name,
                                        value: el.id
                                    })
                                })

                                resolve();
                            })
                            .catch(e => {
                                delete Axios.defaults.headers.common["TenantID"];

                                reject();
                            })
                    })
                })
            },
            onProjectChange() {
                let self = this;

                self.$nextTick(() => {
                    self.selectedPlanogram = null
                    self.planogramObj = null;
                    self.image = null;
                    let currentProjectID = self.selectedProject;
                    let currentProject;

                    self.projects.forEach(project => {
                        if (project.id == currentProjectID)
                            currentProject = project;
                    })

                    self.getPlanogramByID(currentProject.planogram_ID)
                        .then(() => {
                            self.getPlanograms()
                                .then(() => {
                                    self.getProjectTransactionsByProjectID(currentProjectID)
                                        .then(() => {

                                        })
                                        .catch(() => {

                                        })
                                })
                                .catch(() => {

                                })
                        })
                        .catch(() => {

                        })
                })
            },
            getPlanogramByID(planogramID) {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                return new Promise((resolve, reject) => {
                    Axios.get(process.env.VUE_APP_API + `Planogram?planogramID=${planogramID}`)
                        .then(r => {
                            delete Axios.defaults.headers.common["TenantID"];
                            self.currentPlanogram = r.data[0];
                            resolve();
                        })
                        .catch(e => {
                            delete Axios.defaults.headers.common["TenantID"];
                            reject();
                        })
                })
            },
            getPlanograms() {
                let self = this;

                return new Promise((resolve, reject) => {
                    Axios.get(process.env.VUE_APP_API +
                            'SystemFile/JSON?db=CR-DEVINSPIRE&folder=SPACE PLANNING')
                        .then(r => {
                            self.planograms = r.data;
                            r.data.forEach(e => {
                                self.PlanogramItems.push({
                                    text: e.name,
                                    value: e.id
                                })
                            })


                            resolve();
                        })
                        .catch(e => {
                            reject();
                        })
                })
            },
            getProjectTransactionsByProjectID(projectID) {
                let self = this;
                self.projectID = projectID
                return new Promise((resolve, reject) => {

                    Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                    Axios.get(process.env.VUE_APP_API + `ProjectTX?projectID=${projectID}`)
                        .then(r => {
                            delete Axios.defaults.headers.common["TenantID"];

                            self.timelineItems = [];

                            r.data.projectTXList.forEach((element, idx) => {

                                if (idx == 0)
                                    self.currentStatus = element.status;


                                if (element.deleted != true) {
                                    self.timelineItems.push({
                                        status: element.status,
                                        notes: self.status[element.status].text,
                                        date: element.dateTimeString,
                                        user: element.username,
                                        userID: element.systemUserID,
                                        type: element.type,
                                        storeID: element.store_ID
                                    })
                                }

                            })

                            self.projectsStatus = self.timelineItems[0]


                            resolve();
                        })
                        .catch(e => {
                            delete Axios.defaults.headers.common["TenantID"];
                            reject();
                        })
                })
            },
            getUserPlanograms() {
                let self = this;

                let encoded_details = jwt.decode(sessionStorage.accessToken);
                let systemUserID = encoded_details.USER_ID;

                self.inform("GET", "Getting user planograms.");

                return new Promise((resolve, reject) => {
                    Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                    Axios.get(process.env.VUE_APP_API + `ProjectPlanograms?userID=` + systemUserID)
                        .then(r => {
                            delete Axios.defaults.headers.common["TenantID"];

                            console.log(r.data);

                            resolve();
                        })
                        .catch(e => {
                            delete Axios.defaults.headers.common["TenantID"];
                            reject();
                        })
                })
            },
            inform(actionType, message) {
                console.log(`[${_MODULE.toUpperCase()}] - ${actionType.toUpperCase()} - ${message}`);
            },
            handleError(message) {
                alert(message);
            }
        }
    }
</script>


<style scoped>
    .selected {
        background: #1976d2;
        color: white;
    }
</style>