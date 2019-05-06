<template>
    <v-card>
        <v-toolbar dense dark>
            <v-spacer></v-spacer>
            <v-toolbar-title>Planogram Implementation</v-toolbar-title>
        </v-toolbar>
        <v-container fluid grid-list-md>
            <v-layout row wrap>
                <v-flex xl7 lg7 md12 sm12 xs12>
                    <v-flex v-if="authorityType == 0 && routeProjectID == null" xl6 lg6 md6 sm12 xs12>
                        <v-autocomplete :disabled="showLoader" @change="getProjectsByProjectGroup"
                            v-model="selectedProjectGroup" :items="projectGroupsSelect" hide-details
                            label="Project Group">
                        </v-autocomplete>
                    </v-flex>

                    <v-flex v-if="authorityType != 0 && routeProjectID == null" xl6 lg6 md6 sm12 xs12>
                        <v-autocomplete :disabled="showLoader" @change="getUserProjectsByProjectGroup"
                            v-model="selectedProjectGroup" :items="projectGroupsSelect" hide-details
                            label="Project Group">
                        </v-autocomplete>
                    </v-flex>

                    <v-flex xl6 lg6 md6 sm12 xs12 v-if="selectedProjectGroup != null">
                        <v-autocomplete :disabled="showLoader" @change="onProjectChange" v-model="selectedProject"
                            :items="projectsSelect" hide-details label="Project">
                        </v-autocomplete>
                    </v-flex>

                    <v-flex xl12 lg12 md6 sm12 xs12
                        v-if="(currentPlanogram != null && selectedProject != null) && routeProjectID == null">
                        <h1 v-if="routeProjectID == null">{{ currentPlanogram.name }} </h1>
                        <v-autocomplete :disabled="showLoader" @change="selectPlanogram(selectedPlanogram)" dense
                            v-model="selectedPlanogram" :items="filterPlanograms" label="Planogram"></v-autocomplete>
                    </v-flex>

                    <v-flex v-if="showLoader" xl12 lg12 md12 sm12 xs12 style="text-align: center;">
                        <v-progress-circular class="ma-0" color="primary" indeterminate height="5">
                        </v-progress-circular>
                    </v-flex>
                    <v-flex xl12 lg12 md12 sm12 xs12
                        v-if="(selectedPlanogram != null || routeProjectID != null) && !showLoader">
                        <v-toolbar color="primary" dark dense flat
                            v-if="selectedPlanogram != null || routeProjectID != null">
                            <v-toolbar-title v-if="routeStatus!=null">
                                Status: {{status[routeStatus].text}}
                            </v-toolbar-title>
                            <v-toolbar-title v-else>
                                Status: {{status[timelineItems[0].status].text}}
                            </v-toolbar-title>
                        </v-toolbar>
                        <v-divider></v-divider>
                        <v-toolbar color="primary" dark dense flat
                            v-if="selectedPlanogram != null || routeProjectID != null">
                            <v-btn
                                v-if="authorityType == 0||(authorityType == 1)&&(projectsStatus.status==20||routeStatus==20)"
                                flat outline @click="approve()">Approve</v-btn>
                            <v-btn flat outline @click="assignTask(currentProjectTx)">Assign</v-btn>
                            <v-btn flat outline
                                @click="openImplementationModal(projectsStatus.status,2,timelineItems[0])">Variation
                            </v-btn>
                            <v-btn flat
                                v-if="authorityType == 0||(authorityType == 3)&&(projectsStatus.status==24||routeStatus==24)"
                                outline @click="openImplementationModal(projectsStatus.status,3,timelineItems[0])">
                                Implemented</v-btn>
                            <!-- <v-btn flat v-if="authorityType == 0||(authorityType == 1)&&(projectsStatus.status==21||routeStatus==21)" outline @click="distribute(projectsStatus.status,4,timelineItems[0])">Distribute</v-btn> -->
                            <v-btn flat outline @click="distribute(projectsStatus.status,4,timelineItems[0])">Distribute
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
                                    :color="getColor(item.type, item.status)" v-for="(item,index) in timelineItems"
                                    :key="index" small>
                                    <v-card :color="getColor(item.type, item.status)" dark>
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
        <AssignTask ref="assignTask"></AssignTask>
    </v-card>
</template>

<script>
    import Axios from 'axios';
    import jwt from 'jsonwebtoken';
    import PlanogramReportModal from './PlanogramReportModal';
    import PlanogramIplementationModal from './PlanogramIplementationModal'
    import moment from 'moment'
    import StatusHandler from '@/libs/system/projectStatusHandler'
    import AssignTask from '@/components/Common/AssignTask'

    let _MODULE = "Planogram Implementation";

    export default {
        components: {
            PlanogramReportModal,
            PlanogramIplementationModal,
            AssignTask
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
                currentProjectTx: null,
                routeProjectID: null,
                routePlanogramID: null,
                routeStatus: null,
                tmpRequest: null
            }
        },
        mounted() {
            let self = this;

            self.getTypeList()
            self.getStatusList()
            self.initialise();
            if (self.$route.params.projectTransactionID != undefined) {
                self.routeProjectID = self.$route.params.projectTransactionID;
                self.selectedProject = self.routeProjectID;
                self.routePlanogramID = self.$route.params.planogramID
                self.routeStatus = self.$route.params.status
                self.onRouteEnter(function () {
                    self.selectPlanogram(self.routePlanogramID);
                })
            } else {
                self.initialise();
            }
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
            openImplementationModal(status, type, item) {
                let self = this

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                let encoded_details = jwt.decode(sessionStorage.accessToken);
                let systemUserID = encoded_details.USER_ID;
                let storeCluster = self.timelineItems[0].storeCluster;
                let storeID = self.timelineItems[0].store_ID;

                if (type == 0) {
                    self.$refs.submitForApproval.show(
                        "Approve planogram", type, storeCluster, storeID, null, data => {
                            if (data.value == true) {
                                let trans = {
                                    "project_ID": self.projectID,
                                    "dateTime": new Date,
                                    "dateTimeString": moment(new Date).format('YYYY-MM-DD'),
                                    // "username": self.timelineItems[self.timelineItems.length - 1].user,
                                    "status": 12,
                                    "type": 3,
                                    "storeCluster_ID": self.timelineItems[0].storeCluster_ID,
                                    "categoryCluster_ID": self.timelineItems[0].categoryCluster_ID,
                                    // "systemUserID": self.timelineItems[self.timelineItems.length - 1].userID,
                                    "actionedByUserID": systemUserID,
                                    "notes": data.notes,
                                    "ProjectTXGroup_ID": self.timelineItems[0].ProjectTXGroup_ID,
                                    "systemFileID": self.routePlanogramID
                                }
                                Axios.post(process.env.VUE_APP_API + 'ProjectTX', trans).then(
                                    res => {

                                        let element = res.data.projectTX;

                                        self.currentProjectTx = res.data.projectTX
                                        let ProjectTxGroup = {
                                            projectID: self.selectedProject
                                        }
                                        console.log("hree");
                                        Axios.defaults.headers.common["TenantID"] = sessionStorage
                                            .currentDatabase;
                                        Axios.post(process.env.VUE_APP_API + 'ProjectTXGroup', ProjectTxGroup)
                                            .then(resp => {
                                                console.log("resp");
                                                console.log(resp);


                                                let trans2 = {
                                                    "project_ID": self.projectID,
                                                    "dateTime": new Date,
                                                    "dateTimeString": moment(new Date).format(
                                                        'YYYY-MM-DD'),
                                                    "username": self.timelineItems[self.timelineItems
                                                        .length - 1].user,
                                                    "status": 12,
                                                    "type": 3,
                                                    "storeCluster_ID": self.timelineItems[0]
                                                        .storeCluster_ID,
                                                    "categoryCluster_ID": self.timelineItems[0]
                                                        .categoryCluster_ID,
                                                    "systemUserID": self.timelineItems[self
                                                        .timelineItems.length - 1].userID,
                                                    // "actionedByUserID": systemUserID,
                                                    "notes": data.notes,
                                                    "systemFileID": self.routePlanogramID,
                                                    "ProjectTXGroup_ID": resp.data.projectTXGroup.id
                                                }
                                                Axios.defaults.headers.common["TenantID"] = sessionStorage
                                                    .currentDatabase;
                                                Axios.post(process.env.VUE_APP_API + 'ProjectTX', trans2)
                                                    .then(res => {
                                                        delete Axios.defaults.headers.common[
                                                            "TenantID"];
                                                        console.log("res");
                                                        console.log(res);

                                                    })

                                            })
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
                                            store: element.store,
                                            storeCluster_ID: element.storeCluster_ID,
                                            storeCluster: element.storeCluster,
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
                        "Decline Planogram Approval?", type, storeCluster, storeID, null, data => {
                            if (data.value == true) {
                                let trans = {
                                    "project_ID": self.projectID,
                                    "dateTime": new Date,
                                    "dateTimeString": moment(new Date).format('YYYY-MM-DD'),
                                    "username": self.timelineItems[self.timelineItems.length - 1].user,
                                    "ProjectTXGroup_ID": self.timelineItems[0].ProjectTXGroup_ID,
                                    "status": 11,
                                    "type": 3,
                                    "storeCluster_ID": self.timelineItems[0].storeCluster_ID,
                                    "categoryCluster_ID": self.timelineItems[0].categoryCluster_ID,
                                    "systemUserID": self.timelineItems[self.timelineItems.length - 1].userID,
                                    "actionedByUserID": systemUserID,
                                    "notes": data.notes,
                                    "systemFileID": self.routePlanogramID
                                }
                                Axios.post(process.env.VUE_APP_API + 'ProjectTX', trans).then(
                                    res => {

                                        let element = res.data.projectTX;

                                        self.currentProjectTx = res.data.projectTX

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
                                            store: element.store,
                                            storeCluster_ID: element.storeCluster_ID,
                                            storeCluster: element.storeCluster,
                                            categoryCluster_ID: element.categoryCluster_ID
                                        })
                                        console.log(here);

                                        self.projectsStatus = self.timelineItems[0]



                                        delete Axios.defaults.headers.common["TenantID"];

                                    })
                            }

                        })
                }
                if (type == 2) {
                    self.$refs.assignTask.showWithData(item, data => {

                        let trans = {
                            "project_ID": self.projectID,
                            "dateTime": new Date,
                            "dateTimeString": moment(new Date).format('YYYY-MM-DD'),
                            "username": self.timelineItems[self.timelineItems.length - 1].user,
                            "status": 14,
                            "type": 3,
                            "storeCluster_ID": self.timelineItems[0].storeCluster_ID,
                            "categoryCluster_ID": self.timelineItems[0].categoryCluster_ID,
                            "systemUserID": null,
                            "actionedByUserID": systemUserID,
                            "notes": data.notes,
                            "systemFileID": data.systemFile
                        }
                        Axios.post(process.env.VUE_APP_API + 'ProjectTX', trans).then(
                            res => {
                                let element = res.data.projectTX;

                                trans.systemUserID = data.systemUserID;
                                trans.actionedByUserID = null;

                                Axios.post(process.env.VUE_APP_API + 'ProjectTX', trans)

                                self.currentProjectTx = res.data.projectTX

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
                                    store: element.store,
                                    storeCluster_ID: element.storeCluster_ID,
                                    storeCluster: element.storeCluster,
                                    categoryCluster_ID: element.categoryCluster_ID
                                })

                                self.projectsStatus = self.timelineItems[0]

                                delete Axios.defaults.headers.common["TenantID"];
                            })
                    })

                    // self.$refs.PlanogramIplementationModal.show(
                    //     "Request Planogram Variation?", type, storeCluster, storeID, data => {
                    //         if (data.value == true) {
                    //             let trans = {
                    //                 "project_ID": self.projectID,
                    //                 "dateTime": new Date,
                    //                 "dateTimeString": moment(new Date).format('YYYY-MM-DD'),
                    //                 "username": self.timelineItems[self.timelineItems.length - 1].user,
                    //                 "status": 14,
                    //                 "type": 3,
                    //                 "storeCluster_ID": self.timelineItems[0].storeCluster_ID,
                    //                 "categoryCluster_ID": self.timelineItems[0].categoryCluster_ID,
                    //                 "systemUserID": self.timelineItems[self.timelineItems.length - 1].userID,
                    //                 "notes": data.notes
                    //             }
                    //             Axios.post(process.env.VUE_APP_API + 'ProjectTX', trans).then(
                    //                 res => {
                    //                     let element = res.data.projectTX;

                    //                     self.currentProjectTx = res.data.projectTX

                    //                     self.timelineItems.unshift({
                    //                         status: element.status,
                    //                         notes: self.status[element.status].text,
                    //                         date: element.dateTimeString,
                    //                         user: element.username,
                    //                         userID: element.systemUserID,
                    //                         type: element.type,
                    //                         storeID: element.store_ID,
                    //                         store: element.store,
                    //                         storeCluster_ID: element.storeCluster_ID,
                    //                         storeCluster: element.storeCluster,
                    //                         categoryCluster_ID: element.categoryCluster_ID
                    //                     })

                    //                     self.tmpItems.unshift({
                    //                         status: element.status,
                    //                         notes: self.status[element.status].text,
                    //                         date: element.dateTimeString,
                    //                         user: element.username,
                    //                         userID: element.systemUserID,
                    //                         type: element.type,
                    //                         storeID: element.store_ID,
                    //                         store: element.store,
                    //                         storeCluster_ID: element.storeCluster_ID,
                    //                         storeCluster: element.storeCluster,
                    //                         categoryCluster_ID: element.categoryCluster_ID
                    //                     })

                    //                     self.projectsStatus = self.timelineItems[0]

                    //                     delete Axios.defaults.headers.common["TenantID"];
                    //                 })
                    //         }
                    //     })
                }
                if (type == 3) {

                    self.$refs.PlanogramIplementationModal.show(


                        "Implement Planogram?", type, storeCluster, storeID, null, data => {


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
                                    "systemUserID": self.timelineItems[0].actionedByUserID,
                                    "actionedByUserID": self.timelineItems[0].userID,
                                    "notes": data.notes,
                                    "systemFileID": self.routePlanogramID
                                }

                                Axios.post(process.env.VUE_APP_API + 'ProjectTX', trans).then(
                                    res => {

                                        let element = res.data.projectTX;

                                        self.currentProjectTx = res.data.projectTX

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
                                            categoryCluster_ID: element.categoryCluster_ID,
                                            actionedByUserID: element.actionedByUserID
                                        })

                                        self.tmpItems.unshift({
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
                                            categoryCluster_ID: element.categoryCluster_ID,
                                            actionedByUserID: element.actionedByUserID
                                        })

                                        self.projectsStatus = self.timelineItems[0]

                                        delete Axios.defaults.headers.common["TenantID"];
                                    })
                            }
                        })
                }
                if (type == 4) {
                    let tmp = []
                    console.log(item);

                    self.PlanogramItems.forEach(element => {
                        console.log(element.value + "|" + item.systemFileID);
                        if (element.value == item.systemFileID) {
                            tmp.push(element)
                        }


                    });

                    self.$refs.PlanogramIplementationModal.show(
                        "Select the store to distribute to", type, storeCluster, storeID, tmp,
                        data => {
                            if (data.value == true) {
                                let trans = {
                                    "project_ID": self.projectID,
                                    "dateTime": new Date,
                                    "dateTimeString": moment(new Date).format('YYYY-MM-DD'),
                                    "store_ID": data.stores,
                                    "systemFileID": data.planogram,
                                    "username": self.projectsStatus.user,
                                    "status": 13,
                                    "type": 3,
                                    "storeCluster_ID": self.timelineItems[0].storeCluster_ID,
                                    "categoryCluster_ID": self.timelineItems[0].categoryCluster_ID,
                                    "systemUserID": data.users,
                                    "actionedByUserID": null,
                                    "notes": data.notes,
                                    "systemFileID": self.routePlanogramID
                                }

                                Axios.post(process.env.VUE_APP_API + 'ProjectTX', trans).then(
                                    res => {
                                        let element = res.data.projectTX;

                                        self.currentProjectTx = res.data.projectTX

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
            onRouteEnter(callback) {
                let self = this;

                self.$nextTick(() => {
                    self.selectedPlanogram = null
                    self.planogramObj = null;
                    self.image = null;
                    let currentProjectID = self.selectedProject;

                    self.getPlanogramByID(self.routePlanogramID)
                        .then(() => {

                            self.getPlanograms()
                                .then(() => {
                                    self.getProjectTransactionsByProjectID(currentProjectID)
                                        .then(() => {
                                            callback();
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
                            self.items = r.data.projectTXList;

                            r.data.projectTXList.forEach((element, idx) => {

                                if (idx == 0) {
                                    self.currentStatus = element.status;
                                    self.currentProjectTx = element
                                }

                                if (element.type == 3 && element.status == 20) {
                                    self.tmpRequest = element;
                                }

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
                                        categoryCluster_ID: element.categoryCluster_ID,
                                        actionedByUserID: element.actionedByUserID,
                                        projectOwnerID: element.projectOwnerID,
                                        systemFileID: element.systemFileID

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
                                            categoryCluster_ID: element.categoryCluster_ID,
                                            actionedByUserID: element.actionedByUserID
                                        })
                                    }
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
            },
            assignTask(item) {
                let self = this;

                let encoded_details = jwt.decode(sessionStorage.accessToken);
                let systemUserID = encoded_details.USER_ID;

                self.$refs.assignTask.show(function (data) {
                    let tmp = JSON.parse(JSON.stringify(item))
                    let assignedToRequest = tmp;
                    let task = tmp;

                    assignedToRequest.systemUserID = data.systemUserID;
                    assignedToRequest.actionedByUserID = systemUserID;
                    assignedToRequest.notes = data.notes;
                    assignedToRequest.status = 40;

                    Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                    Axios.post(process.env.VUE_APP_API + 'ProjectTX', assignedToRequest).then(res1 => {
                        task.type = data.type;
                        task.status = 5 + data.type;
                        task.systemUserID = data.systemUserID;
                        task.notes = data.notes;
                        task.actionedByUserID = null;

                        let element1 = res1.data.projectTX;

                        self.timelineItems.unshift({
                            status: element1.status,
                            notes: self.status[element1.status].text,
                            date: element1.dateTimeString,
                            user: element1.username,
                            userID: element1.systemUserID,
                            type: element1.type,
                            storeID: element1.store_ID,
                            store: element1.store,
                            storeCluster_ID: element1.storeCluster_ID,
                            storeCluster: element1.storeCluster,
                            categoryCluster_ID: element1.categoryCluster_ID
                        })

                        self.tmpItems.unshift({
                            status: element1.status,
                            notes: self.status[element1.status].text,
                            date: element1.dateTimeString,
                            user: element1.username,
                            userID: element1.systemUserID,
                            type: element1.type,
                            storeID: element1.store_ID,
                            store: element1.store,
                            storeCluster_ID: element1.storeCluster_ID,
                            storeCluster: element1.storeCluster,
                            categoryCluster_ID: element1.categoryCluster_ID
                        })

                        Axios.post(process.env.VUE_APP_API + 'ProjectTX', task).then(res2 => {
                            delete Axios.defaults.headers.common["TenantID"];

                            let element2 = res2.data.projectTX;

                            self.currentProjectTx = res2.data.projectTX

                            self.timelineItems.unshift({
                                status: element2.status,
                                notes: self.status[element2.status].text,
                                date: element2.dateTimeString,
                                user: element2.username,
                                userID: element2.systemUserID,
                                type: element2.type,
                                storeID: element2.store_ID,
                                store: element2.store,
                                storeCluster_ID: element2.storeCluster_ID,
                                storeCluster: element2.storeCluster,
                                categoryCluster_ID: element2.categoryCluster_ID
                            })

                            self.tmpItems.unshift({
                                status: element2.status,
                                notes: self.status[element2.status].text,
                                date: element2.dateTimeString,
                                user: element2.username,
                                userID: element2.systemUserID,
                                type: element2.type,
                                storeID: element2.store_ID,
                                store: element2.store,
                                storeCluster_ID: element2.storeCluster_ID,
                                storeCluster: element2.storeCluster,
                                categoryCluster_ID: element2.categoryCluster_ID
                            })
                        })
                    })
                })
            },
            getColor(type, status) {
                return StatusHandler.getColorByTypeAndStatus(type, status)
            },
            approve() {
                let self = this;

                let encoded_details = jwt.decode(sessionStorage.accessToken);
                let systemUserID = encoded_details.USER_ID;

                let request = JSON.parse(JSON.stringify(self.tmpRequest))

                let projectTXGroupRequest = {
                    projectID: request.project_ID
                }

                request.status = 12;
                request.actionedByUserID = systemUserID;
                request.systemUserID = null;

                // Create Approved Project Transaction
                self.createProjectTransaction(request, newTransaction => {
                    // Create New Group Project Transaction
                    self.createProjectTransactionGroup(projectTXGroupRequest, newProjectGroup => {
                        // Create Approved Project Transaction For New Group
                        request.actionedByUserID = null;
                        request.systemUserID = request.projectOwnerID;
                        request.projectTXGroup_ID = newProjectGroup.id;
                        self.createProjectTransaction(request, latestTransaction => {
                            self.getProjectTransactionsByProjectID(request.project_ID);
                        })
                    })
                })
            },
            distribute() {
                let self = this;

                // Select a store
                self.$refs.PlanogramIplementationModal.show("Distribute Planogram?", 3, null, null, null, data => {
                    console.log(data);
                })
            },
            createProjectTransactionGroup(request, callback) {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.post(process.env.VUE_APP_API + `ProjectTXGroup`, request).then(r => {
                    delete Axios.defaults.headers.common["TenantID"];
                    callback(r.data.projectTXGroup);
                })
            },
            createProjectTransaction(request, callback) {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.post(process.env.VUE_APP_API + `ProjectTX`, request).then(r => {
                    delete Axios.defaults.headers.common["TenantID"];
                    callback(r.data.projectTX)
                })
            },
        }
    }
</script>


<style scoped>
    .selected {
        background: #1976d2;
        color: white;
    }
</style>