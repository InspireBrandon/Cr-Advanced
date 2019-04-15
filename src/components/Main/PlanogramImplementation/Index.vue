<template>
    <v-card>
        <v-toolbar dense dark>
            <v-spacer></v-spacer>
            <v-toolbar-title>Planogram Implementation</v-toolbar-title>
        </v-toolbar>
        <v-container grid-list-md>
            <v-layout row wrap>
                <v-flex v-if="authorityType == 0" xl3 lg6 md6 sm12 xs12>
                    <v-autocomplete @change="getProjectsByProjectGroup" v-model="selectedProjectGroup"
                        :items="projectGroupsSelect" hide-details label="Project Group">
                    </v-autocomplete>
                </v-flex>
                <v-flex v-else xl3 lg6 md6 sm12 xs12>
                    <v-autocomplete @change="getUserProjectsByProjectGroup" v-model="selectedProjectGroup"
                        :items="projectGroupsSelect" hide-details label="Project Group">
                    </v-autocomplete>
                </v-flex>
                <v-flex xl9 lg6 md6 sm0 xs0></v-flex>
                <v-flex xl3 lg6 md6 sm12 xs12>
                    <v-autocomplete @change="onProjectChange" v-if="selectedProjectGroup != null"
                        v-model="selectedProject" :items="projectsSelect" hide-details label="Project"></v-autocomplete>
                </v-flex>
                <v-flex xl9 lg6 md6 sm0 xs0></v-flex>
                <v-flex xl12 lg6 md12 sm12 xs12>
                    <h1 v-if="currentPlanogram != null">{{ currentPlanogram.name }}</h1>
                </v-flex>
                <v-flex xl12 lg12 md12 sm12 xs12 v-if="planograms.length > 0">
                    <v-tabs dark v-model="active" grow color="grey darken-4">
                        <v-tab ripple>Planograms</v-tab>
                        <v-tab ripple>Timeline</v-tab>
                        <v-tab-item>
                            <v-card style="height: calc(100vh - 340px); overflow: auto;">
                                <v-list dense class="pa-0 ma-0">
                                    <template v-if="item.name.toUpperCase().includes(currentPlanogram.displayname)"
                                        v-for="(item, index) in planograms">
                                        <v-list-tile :key="item.title" avatar ripple>
                                            <v-list-tile-content>
                                                <v-list-tile-title>{{ item.name }}</v-list-tile-title>
                                            </v-list-tile-content>
                                            <v-list-tile-action>
                                                <v-btn icon @click="$refs.PlanogramReportModal.show(item)">
                                                    <v-icon>visibility</v-icon>
                                                </v-btn>
                                            </v-list-tile-action>
                                        </v-list-tile>
                                        <v-divider v-if="index + 1 < planograms.length" :key="index"></v-divider>
                                    </template>
                                </v-list>
                            </v-card>
                        </v-tab-item>
                        <v-tab-item>
                            <v-card style="height: calc(100vh - 340px); overflow: auto;">
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
                        </v-tab-item>
                    </v-tabs>
                </v-flex>
            </v-layout>
        </v-container>
        <PlanogramReportModal ref="PlanogramReportModal"></PlanogramReportModal>
    </v-card>
</template>

<script>
    import Axios from 'axios';
    import jwt from 'jsonwebtoken';
    import PlanogramReportModal from './PlanogramReportModal';

    let _MODULE = "Planogram Implementation";

    export default {
        components: {
            PlanogramReportModal
        },
        data: () => {
            return {
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
                    },
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
        methods: {
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
                            resolve();
                        })
                        .catch(e => {
                            reject();
                        })
                })
            },
            getProjectTransactionsByProjectID(projectID) {
                let self = this;

                return new Promise((resolve, reject) => {

                    Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                    Axios.get(process.env.VUE_APP_API + `ProjectTX?projectID=${projectID}`)
                        .then(r => {
                            console.log(r.data);

                            delete Axios.defaults.headers.common["TenantID"];

                            self.timelineItems = [];

                            r.data.projectTXList.forEach((element, idx) => {

                                if (idx == 0)
                                    self.currentStatus = element.status;

                                self.timelineItems.push({
                                    status: element.status,
                                    notes: self.status[element.status].text,
                                    date: element.dateTimeString,
                                    user: element.username,
                                    type: element.type
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