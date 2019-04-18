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

                    <v-flex v-if="showLoader" xl12 lg12 md12 sm12 xs12 style="text-align: center;">
                        <v-progress-circular class="ma-0" color="primary" indeterminate height="5">
                        </v-progress-circular>
                    </v-flex>
                    <v-flex xl12 lg12 md12 sm12 xs12 v-if="selectedPlanogram != null && !showLoader">
                        <v-toolbar color="primary" dark dense flat v-if="selectedPlanogram != null">
                            <v-toolbar-title>
                                Status: {{status[tmpItems[0].status].text}}
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
                                v-if="(( authorityType == 1)&&(projectsStatus.status==20)) || authorityType == 0 || authorityType == 1"
                                @click="openImplementationModal(projectsStatus.status,0)">Approve</v-btn>
                            <v-btn flat outline
                                v-if="((authorityType == 1)&&(projectsStatus.status==20)) || authorityType == 0 || authorityType == 1"
                                @click="openImplementationModal(projectsStatus.status,1)">Decline</v-btn>
                            <v-btn flat outline
                                v-if="((authorityType == 1)&&(projectsStatus.status==20)) || authorityType == 0 || authorityType == 1"
                                @click="openImplementationModal(projectsStatus.status,2)">Variation</v-btn>
                            <v-btn flat outline
                                v-if="(( authorityType == 3)&&(projectsStatus.status==13)) || authorityType == 0"
                                @click="openImplementationModal(projectsStatus.status,3)">Implement
                            </v-btn>
                            <v-btn flat outline
                                v-if="(( authorityType == 1)&&(projectsStatus.status==21)) || authorityType == 0"
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
                </v-flex>
                <v-flex xl5 lg5 md12 sm12 xs12 v-if="planogramObj != null">
                    <v-toolbar flat dense dark color="primary">
                        <v-toolbar-title>Planogram Timeline</v-toolbar-title>
                    </v-toolbar>
                    <v-card flat style="height: calc(100vh - 200px); overflow: auto;">
                        <v-card-text>
                            <v-timeline dense>
                                <v-timeline-item style="padding-bottom: 5px;" right
                                    :color="typeList[item.type == -1 ? 5 : item.type].color"
                                    v-for="(item,index) in timelineItems" :key="index" small>
                                    <v-card :color="typeList[item.type == -1 ? 5 : item.type].color" dark>
                                        <v-card-title class="title pa-2 ma-0">
                                            <span>{{ status[item.status  == -1 ? 18 : item.status].text }}</span>
                                            <span v-if="item.storeCluster != null" style="margin-left: 5px;"> -
                                                {{ item.storeCluster }}</span>
                                            <span v-if="item.store != null" style="margin-left: 5px;"> -
                                                {{ item.store }}</span>
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
                    <v-toolbar-title>
                        Planogram Image
                    </v-toolbar-title>
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
    import StatusHandler from '@/libs/system/projectStatusHandler'

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
                tmpItems: [],
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
                status: [],
                typeList: [],
                currentStatus: null,

            }
        },
        mounted() {
            let self = this;
            self.initialise();
            this.getTypeList()
            this.getStatusList()
        },
        computed: {
            filterPlanograms: function () {
                var self = this
                let value = self.type;
                if (self.selectedProjectGroup != null) {
                    if (self.PlanogramItems != null && self.currentPlanogram != null) {
                        return this.PlanogramItems.filter(function (item) {
                            return item.text.toUpperCase().includes(self.currentPlanogram.displayname);
                        })
                    } else {
                        return [];
                    }
                } else {
                    return [];
                }


            }
        },
        methods: {
            getTypeList() {
                let self = this
                let statushandler = new StatusHandler()
                self.typeList = statushandler.getTypeList()
            },
            getStatusList() {
                let self = this
                let statushandler = new StatusHandler()

                self.status = statushandler.getStatus()
            },
            openReport() {
                let self = this
                self.$refs.PlanogramReportModal.show(self.planogramObj)
            },
            selectPlanogram(planogram) {
                let self = this;
                self.showLoader = true

                self.$nextTick(() => {

                    Axios.get(process.env.VUE_APP_API + 'SystemFile/JSON?db=CR-DEVINSPIRE&id=' + planogram)
                        .then(r => {
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
                let systemUserID = encoded_details.USER_ID;

                let storeCluster = self.timelineItems[0].storeCluster;
                let storeID = self.timelineItems[0].store_ID;

                if (type == 0) {
                    self.$refs.PlanogramIplementationModal.show(
                        "Approve planogram", type, storeCluster, storeID, data => {
                            if (data.value == true) {
                                let trans = {
                                    "project_ID": self.projectID,
                                    "dateTime": new Date,
                                    "dateTimeString": moment(new Date).format('YYYY-MM-DD'),
                                    "username": self.timelineItems[self.timelineItems.length - 1].user,
                                    "status": 12,
                                    "type": 3,
                                    "storeCluster_ID": self.timelineItems[0].storeCluster_ID,
                                    "categoryCluster_ID": self.timelineItems[0].categoryCluster_ID,
                                    "systemUserID": self.timelineItems[self.timelineItems.length - 1].userID,
                                    "actionedByUserID": systemUserID
                                }
                                Axios.post(process.env.VUE_APP_API + 'ProjectTX', trans).then(
                                    res => {

                                        let element = res.data.projectTX;

                                        self.timelineItems.unshift({
                                            status: element.status,
                                            notes: self.status[element.status].text,
                                            date: element.dateTimeString,
                                            user: element.username,
                                            userID: element.systemUserID,
                                            type: element.type,
                                            storeID: element.store_ID,
                                            storeCluster_ID: element.storeCluster_ID,
                                            categoryCluster_ID: element.categoryCluster_ID
                                        })

                                        self.tmpItems.unshift({
                                            status: element.status,
                                            notes: self.status[element.status].text,
                                            date: element.dateTimeString,
                                            user: element.username,
                                            userID: element.systemUserID,
                                            type: element.type,
                                            storeID: element.store_ID,
                                            storeCluster_ID: element.storeCluster_ID,
                                            categoryCluster_ID: element.categoryCluster_ID
                                        })

                                        self.projectsStatus = self.timelineItems[0]

                                        delete Axios.defaults.headers.common["TenantID"];
                                    })
                            }
                        })
                }
                if (type == 1) {
                    self.$refs.PlanogramIplementationModal.show(
                        "Decline Planogram Approval?", storeCluster, storeID, type, data => {
                            if (data.value == true) {
                                let trans = {
                                    "project_ID": self.projectID,
                                    "dateTime": new Date,
                                    "dateTimeString": moment(new Date).format('YYYY-MM-DD'),
                                    "username": self.timelineItems[self.timelineItems.length - 1].user,
                                    "status": 11,
                                    "type": 3,
                                    "storeCluster_ID": self.timelineItems[0].storeCluster_ID,
                                    "categoryCluster_ID": self.timelineItems[0].categoryCluster_ID,
                                    "systemUserID": self.timelineItems[self.timelineItems.length - 1].userID,
                                }
                                Axios.post(process.env.VUE_APP_API + 'ProjectTX', trans).then(
                                    res => {

                                        let element = res.data.projectTX;

                                        self.timelineItems.unshift({
                                            status: element.status,
                                            notes: self.status[element.status].text,
                                            date: element.dateTimeString,
                                            user: element.username,
                                            userID: element.systemUserID,
                                            type: element.type,
                                            storeID: element.store_ID,
                                            storeCluster_ID: element.storeCluster_ID,
                                            categoryCluster_ID: element.categoryCluster_ID
                                        })

                                        self.tmpItems.unshift({
                                            status: element.status,
                                            notes: self.status[element.status].text,
                                            date: element.dateTimeString,
                                            user: element.username,
                                            userID: element.systemUserID,
                                            type: element.type,
                                            storeID: element.store_ID,
                                            storeCluster_ID: element.storeCluster_ID,
                                            categoryCluster_ID: element.categoryCluster_ID
                                        })

                                        self.projectsStatus = self.timelineItems[0]

                                        delete Axios.defaults.headers.common["TenantID"];
                                    })
                            }

                        })
                }
                if (type == 2) {
                    self.$refs.PlanogramIplementationModal.show(
                        "Request Planogram Variation?", type, storeCluster, storeID, data => {
                            if (data.value == true) {
                                let trans = {
                                    "project_ID": self.projectID,
                                    "dateTime": new Date,
                                    "dateTimeString": moment(new Date).format('YYYY-MM-DD'),
                                    "username": self.timelineItems[self.timelineItems.length - 1].user,
                                    "status": 14,
                                    "type": 3,
                                    "storeCluster_ID": self.timelineItems[0].storeCluster_ID,
                                    "categoryCluster_ID": self.timelineItems[0].categoryCluster_ID,
                                    "systemUserID": self.timelineItems[self.timelineItems.length - 1].userID,
                                }
                                Axios.post(process.env.VUE_APP_API + 'ProjectTX', trans).then(
                                    res => {
                                        let element = res.data.projectTX;

                                        self.timelineItems.unshift({
                                            status: element.status,
                                            notes: self.status[element.status].text,
                                            date: element.dateTimeString,
                                            user: element.username,
                                            userID: element.systemUserID,
                                            type: element.type,
                                            storeID: element.store_ID,
                                            storeCluster_ID: element.storeCluster_ID,
                                            categoryCluster_ID: element.categoryCluster_ID
                                        })

                                        self.tmpItems.unshift({
                                            status: element.status,
                                            notes: self.status[element.status].text,
                                            date: element.dateTimeString,
                                            user: element.username,
                                            userID: element.systemUserID,
                                            type: element.type,
                                            storeID: element.store_ID,
                                            storeCluster_ID: element.storeCluster_ID,
                                            categoryCluster_ID: element.categoryCluster_ID
                                        })

                                        self.projectsStatus = self.timelineItems[0]

                                        delete Axios.defaults.headers.common["TenantID"];
                                    })
                            }
                        })
                }
                if (type == 3) {
                    self.$refs.PlanogramIplementationModal.show(
                        "Implement Planogram?", type, storeCluster, storeID, data => {
                            if (data.value == true) {
                                let trans = {
                                    "project_ID": self.projectID,
                                    "dateTime": new Date,
                                    "dateTimeString": moment(new Date).format('YYYY-MM-DD'),
                                    "store_ID": self.projectsStatus.storeID,
                                    "username": self.projectsStatus.user,
                                    "status": 15,
                                    "type": 3,
                                    "storeCluster_ID": self.timelineItems[0].storeCluster_ID,
                                    "categoryCluster_ID": self.timelineItems[0].categoryCluster_ID,
                                    "systemUserID": self.projectsStatus.userID,
                                }
                                Axios.post(process.env.VUE_APP_API + 'ProjectTX', trans).then(
                                    res => {

                                        let element = res.data.projectTX;

                                        self.timelineItems.unshift({
                                            status: element.status,
                                            notes: self.status[element.status].text,
                                            date: element.dateTimeString,
                                            user: element.username,
                                            userID: element.systemUserID,
                                            type: element.type,
                                            storeID: element.store_ID,
                                            storeCluster_ID: element.storeCluster_ID,
                                            categoryCluster_ID: element.categoryCluster_ID
                                        })

                                        self.tmpItems.unshift({
                                            status: element.status,
                                            notes: self.status[element.status].text,
                                            date: element.dateTimeString,
                                            user: element.username,
                                            userID: element.systemUserID,
                                            type: element.type,
                                            storeID: element.store_ID,
                                            storeCluster_ID: element.storeCluster_ID,
                                            categoryCluster_ID: element.categoryCluster_ID
                                        })

                                        self.projectsStatus = self.timelineItems[0]

                                        delete Axios.defaults.headers.common["TenantID"];
                                    })
                            }
                        })
                }
                if (type == 4) {
                    self.$refs.PlanogramIplementationModal.show(
                        "Select the store to distribute to", type, storeCluster, storeID, data => {
                            if (data.value == true) {
                                let trans = {
                                    "project_ID": self.projectID,
                                    "dateTime": new Date,
                                    "dateTimeString": moment(new Date).format('YYYY-MM-DD'),
                                    "store_ID": data.stores,
                                    "username": self.projectsStatus.user,
                                    "status": 13,
                                    "type": 3,
                                    "storeCluster_ID": self.timelineItems[0].storeCluster_ID,
                                    "categoryCluster_ID": self.timelineItems[0].categoryCluster_ID,
                                    "systemUserID": data.users,
                                }

                                console.log(data);

                                Axios.post(process.env.VUE_APP_API + 'ProjectTX', trans).then(
                                    res => {
                                        let element = res.data.projectTX;

                                        self.timelineItems.unshift({
                                            status: element.status,
                                            notes: self.status[element.status].text,
                                            date: element.dateTimeString,
                                            user: element.username,
                                            userID: element.systemUserID,
                                            type: element.type,
                                            storeID: element.store_ID,
                                            store: element.store,
                                            storeCluster_ID: element.storeCluster_ID,
                                            storeCluster: element.storeCluster,
                                            categoryCluster_ID: element.categoryCluster_ID
                                        })

                                        self.tmpItems.unshift({
                                            status: element.status,
                                            notes: self.status[element.status].text,
                                            date: element.dateTimeString,
                                            user: element.username,
                                            userID: element.systemUserID,
                                            type: element.type,
                                            storeID: element.store_ID,
                                            storeCluster_ID: element.storeCluster_ID,
                                            categoryCluster_ID: element.categoryCluster_ID
                                        })

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
                            self.tmpItems = [];

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
                                        storeID: element.store_ID,
                                        store: element.store,
                                        storeCluster_ID: element.storeCluster_ID,
                                        storeCluster: element.storeCluster,
                                        categoryCluster_ID: element.categoryCluster_ID
                                    })

                                    if (element.type == 3 && element.status != 13) {
                                        self.tmpItems.push({
                                            status: element.status,
                                            notes: self.status[element.status].text,
                                            date: element.dateTimeString,
                                            user: element.username,
                                            userID: element.systemUserID,
                                            type: element.type,
                                            storeID: element.store_ID,
                                            store: element.store,
                                            storeCluster_ID: element.storeCluster_ID,
                                            storeCluster: element.storeCluster,
                                            categoryCluster_ID: element.categoryCluster_ID
                                        })
                                    }
                                }

                            })

                            console.log("[STUFF]", self.tmpItems)

                            self.projectsStatus = self.tmpItems[0]

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