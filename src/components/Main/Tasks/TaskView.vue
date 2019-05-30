<template>
    <v-container grid-list-md fluid>
        <v-layout row wrap>
            <v-flex md12>
                <v-card flat>
                    <v-card-text class="pa-0">
                        <v-data-table :headers="headers" :items="data" class="elevation-0 scrollable"
                            :rows-per-page-items="[10,50,75,100,{'text':'$vuetify.dataIterator.rowsPerPageAll','value':-1}]">
                            <template v-slot:no-data>
                                <div style="text-align:center;">
                                    You have no tasks. Please view Projects and Stores
                                </div>
                            </template>
                            <template v-slot:items="props">
                                <tr :key='props.item.id'
                                    :style="{ backgroundColor: (props.item.subtask == true  ? 'lightgrey' : 'transparent' )}">
                                    <td>{{ props.item.planogram }}</td>
                                    <td>{{ typeList[props.item.type == -1 ? 5 : props.item.type].text }}</td>
                                    <td>{{ statusList[props.item.status == -1 ? 18 : props.item.status].text }}</td>
                                    <td>{{ props.item.storeCluster }}</td>
                                    <td>{{ props.item.categoryCluster }}</td>
                                    <td>{{ props.item.store }}</td>
                                    <td>{{ props.item.dateTimeString }}</td>
                                    <td>{{props.item.username}}</td>
                                    <td>{{props.item.actionedByUserName}}</td>
                                    <td style="width: 5%;">
                                        <!-- PROJECT START -->
                                        <v-btn color="secondary" @click="assign(props.item)" small
                                            v-if="props.item.status == 0">Assign</v-btn>
                                        <!-- END PROJECT START -->
                                        <!-- PROCESS ASSIGNED -->
                                        <v-btn color="error" @click="closeTask(props.item, props.index)" small
                                            v-if="props.item.status == 40">Close</v-btn>
                                        <!-- END PROCESS ASSIGNED -->
                                        <!-- DATA PREPARATION -->
                                        <v-btn small color="success" @click="setInProgressAndView(props.item)"
                                            v-if="props.item.type == 1 && props.item.status == 6">View</v-btn>
                                        <div style="display: flex;">
                                            <v-btn small color="warning" @click="routeToView(props.item)"
                                                v-if="props.item.type == 1 && (props.item.status == 1) && systemUserID == props.item.systemUserID">
                                                View</v-btn>
                                            <v-btn small color="error" @click="setComplete(props.item)"
                                                v-if="props.item.type == 1 && props.item.status == 1">Complete</v-btn>
                                        </div>
                                        <v-btn small color="error" @click="closeTask(props.item, props.index)"
                                            v-if="(props.item.type == 1 && props.item.status == 2) && systemUserID == props.item.actionedByUserID">
                                            Close</v-btn>
                                        <div style="display: flex;">
                                            <v-btn small color="warning" @click="routeToView(props.item)"
                                                v-if="(props.item.type == 1 && props.item.status == 2) && systemUserID == props.item.systemUserID">
                                                View</v-btn>
                                            <v-btn small color="secondary" @click="assign(props.item)"
                                                v-if="(props.item.type == 1 && props.item.status == 2) && systemUserID == props.item.systemUserID">
                                                Assign</v-btn>
                                        </div>
                                        <!-- END DATA PREPARATION -->
                                        <!-- RANGING -->
                                        <v-btn small color="success" @click="setInProgressAndView(props.item)"
                                            v-if="props.item.type == 2 && props.item.status == 7">View</v-btn>
                                        <div style="display: flex;">
                                            <v-btn small color="warning" @click="routeToView(props.item)"
                                                v-if="props.item.type == 2 && (props.item.status == 1) && systemUserID == props.item.systemUserID">
                                                View</v-btn>
                                            <v-btn small color="error" @click="setComplete(props.item)"
                                                v-if="props.item.type == 2 && props.item.status == 1">Complete</v-btn>
                                        </div>
                                        <v-btn small color="error" @click="closeTask(props.item, props.index)"
                                            v-if="(props.item.type == 2 && props.item.status == 2) && systemUserID == props.item.actionedByUserID">
                                            Close</v-btn>
                                        <div style="display: flex;">
                                            <v-btn small color="warning" @click="routeToView(props.item)"
                                                v-if="(props.item.type == 2 && props.item.status == 2) && systemUserID == props.item.systemUserID">
                                                View</v-btn>
                                            <v-btn small color="secondary" @click="assign(props.item)"
                                                v-if="(props.item.type == 2 && props.item.status == 2) && systemUserID == props.item.systemUserID">
                                                Assign</v-btn>
                                        </div>
                                        <!-- END RANGING -->
                                        <!-- SPACE PLANNING -->
                                        <v-btn small color="success" @click="setInProgressAndView(props.item)"
                                            v-if="props.item.type == 3 && props.item.status == 8">View</v-btn>
                                        <div style="display: flex;">
                                            <v-btn small color="warning" @click="routeToView(props.item)"
                                                v-if="props.item.type == 3 && props.item.status == 1">View</v-btn>
                                            <v-btn small color="error" @click="setPlanogramComplete(props.item)"
                                                v-if="props.item.type == 3 && props.item.status == 1">Complete</v-btn>
                                        </div>
                                        <div style="display: flex;">
                                            <v-btn small color="error" @click="closeTask(props.item, props.index)"
                                                v-if="(props.item.type == 3 && props.item.status == 2) && systemUserID == props.item.actionedByUserID">
                                                Close</v-btn>
                                            <v-btn small color="primary" @click="routeToView(props.item)"
                                                v-if="(props.item.type == 3 && props.item.status == 2) && systemUserID == props.item.systemUserID">
                                                View</v-btn>
                                            <v-btn small color="primary" @click="submitForApproval(props.item)"
                                                v-if="(props.item.type == 3 && props.item.status == 2) && systemUserID == props.item.systemUserID">
                                                Submit</v-btn>
                                        </div>
                                        <!-- SPACE PLANNING -->
                                        <!-- APPROVAL PROCESS -->
                                        <v-btn small color="success" @click="setApprovalInProgress(props.item)"
                                            v-if="props.item.type == 3 && props.item.status == 10">View</v-btn>
                                        <v-btn small color="warning" @click="routeToView(props.item)"
                                            v-if="props.item.type == 3 && props.item.status == 20">View</v-btn>
                                        <v-btn small color="error" @click="closeTask(props.item , props.index)"
                                            v-if="(props.item.type == 3 && props.item.status == 12) && systemUserID == props.item.actionedByUserID">
                                            Close</v-btn>
                                        <v-btn small color="primary" @click="submitForDistribution(props.item)"
                                            v-if="(props.item.type == 3 && props.item.status == 12) && systemUserID == props.item.systemUserID">
                                            Send</v-btn>
                                        <!-- END APPROVAL PROCESS -->
                                        <!-- DISTRIBUTION -->
                                        <v-btn small color="success" @click="setDistributionInProgress(props.item)"
                                            v-if="props.item.type == 3 && props.item.status == 19">View</v-btn>
                                        <v-btn small color="warning" @click="routeToView(props.item)"
                                            v-if="props.item.type == 3 && props.item.status == 21">View</v-btn>
                                        <!-- END DISTRIBUTION -->
                                        <!-- IMPLEMENTATION -->
                                        <v-btn small color="success" @click="setImplementationInProgress(props.item)"
                                            v-if="props.item.type == 3 && props.item.status == 13">View</v-btn>
                                        <v-btn small color="warning" @click="routeToView(props.item)"
                                            v-if="props.item.type == 3 && props.item.status == 24">View</v-btn>
                                        <v-btn small color="primary" @click="routeToView(props.item)"
                                            v-if="props.item.type == 3 && props.item.status == 26">View</v-btn>
                                        <!-- END IMPLEMENTATION -->
                                        <!-- ON HOLD -->
                                        <v-btn small color="error" @click="closeTask(props.item , props.index)"
                                            v-if="props.item.status == 16 && systemUserID == props.item.systemUserID">
                                            close</v-btn>
                                        <v-btn small color="error" @click="closeTask(props.item , props.index)"
                                            v-if="props.item.status == 16 && systemUserID == props.item.actionedByUserID">
                                            Close</v-btn>
                                        <!-- END ON HOLD -->
                                        <!-- VARIATION REQUEST -->
                                        <v-btn small color="secondary" @click="assign(props.item)"
                                            v-if="props.item.status == 14 && systemUserID == props.item.systemUserID">
                                            Assign</v-btn>
                                        <!-- END VARIATION REQUEST -->
                                        <v-btn small color="secondary" @click="assign(props.item)"
                                            v-if="props.item.status == 41 && systemUserID == props.item.systemUserID">
                                            Assign</v-btn>
                                        <!-- TASK Takeover -->
                                        <v-btn small color="error" @click="closeTask(props.item)"
                                            v-if="props.item.status == 42 && systemUserID == props.item.actionedByUserID">
                                            Close</v-btn>
                                        <!-- END TASK Takeover -->
                                        <!-- SUBTASKS SET IN PROGRESS AND VIEW -->
                                        <v-btn small color="success" @click="setSubtaskInProgressAndView(props.item)"
                                            v-if="props.item.status == 28 && props.item.rollingUserID != systemUserID">
                                            Recieved</v-btn>
                                        <v-btn small color="success" @click="setSubtaskInProgressAndView(props.item)"
                                            v-if="props.item.status == 31 && props.item.rollingUserID != systemUserID">
                                            Recieved</v-btn>
                                        <v-btn small color="success" @click="setSubtaskInProgressAndView(props.item)"
                                            v-if="props.item.status == 34 && props.item.rollingUserID != systemUserID">
                                            Recieved</v-btn>
                                        <v-btn small color="success" @click="setSubtaskInProgressAndView(props.item)"
                                            v-if="props.item.status == 37 && props.item.rollingUserID != systemUserID">
                                            Recieved</v-btn>
                                        <!-- END SUBTASKS SET IN PROGRESS AND VIEW -->
                                        <!-- SUBTASKS VIEW -->
                                        <div style="display: flex;">
                                            <!-- <v-btn small color="warning" @click="goToSubtaskView(props.item)"
                                                v-if="props.item.status == 29 && props.item.rollingUserID != systemUserID">View</v-btn> -->
                                            <v-btn small color="error" @click="completeSubtask(props.item)"
                                                v-if="props.item.status == 29 && props.item.rollingUserID != systemUserID">
                                                Complete</v-btn>
                                        </div>
                                        <div style="display: flex;">
                                            <!-- <v-btn small color="warning" @click="goToSubtaskView(props.item)"
                                                v-if="props.item.status == 32 && props.item.rollingUserID != systemUserID">View</v-btn> -->
                                            <v-btn small color="error" @click="completeSubtask(props.item)"
                                                v-if="props.item.status == 32 && props.item.rollingUserID != systemUserID">
                                                Complete</v-btn>
                                        </div>
                                        <div style="display: flex;">
                                            <!-- <v-btn small color="warning" @click="goToSubtaskView(props.item)"
                                                v-if="props.item.status == 35 && props.item.rollingUserID != systemUserID">View</v-btn> -->
                                            <v-btn small color="error" @click="completeSubtask(props.item)"
                                                v-if="props.item.status == 35 && props.item.rollingUserID != systemUserID">
                                                Complete</v-btn>
                                        </div>
                                        <div style="display: flex;">
                                            <v-btn small color="warning" @click="goToSubtaskView(props.item)"
                                                v-if="props.item.status == 38 && props.item.rollingUserID != systemUserID">
                                                View</v-btn>
                                            <v-btn small color="error" @click="completeSubtask(props.item)"
                                                v-if="props.item.status == 38 && props.item.rollingUserID != systemUserID">
                                                Complete</v-btn>
                                        </div>
                                        <!-- END SUBTASKS VIEW -->
                                        <!-- CLOSE SUBTASKS -->
                                        <v-btn small color="error" @click="closeTask(props.item)"
                                            v-if="props.item.status == 30">Close</v-btn>
                                        <v-btn small color="error" @click="closeTask(props.item)"
                                            v-if="props.item.status == 33">Close</v-btn>
                                        <v-btn small color="error" @click="closeTask(props.item)"
                                            v-if="props.item.status == 36">Close</v-btn>
                                        <v-btn small color="error" @click="closeTask(props.item)"
                                            v-if="props.item.status == 39">Close</v-btn>
                                        <!-- END CLOSE SUBTASKS -->
                                    </td>
                                    <td style="width: 2%">
                                        <v-tooltip bottom v-if="props.item.notes != null">
                                            <template v-slot:activator="{ on }">
                                                <v-icon v-on="on">note</v-icon>
                                            </template>
                                            <span>{{ props.item.notes }}</span>
                                        </v-tooltip>
                                    </td>
                                    <td style="width: 2%">
                                        <v-menu left>
                                            <v-btn v-if="userAccess != 3" icon slot="activator">
                                                <v-icon>more_vert</v-icon>
                                            </v-btn>
                                            <v-list dense class="pa-0 ma-0">

                                                <v-list-tile @click="assignNotNew(props.item)">
                                                    <span>Assign</span>
                                                </v-list-tile>

                                                <v-divider></v-divider>

                                                <v-list-tile @click="putTaskOnHold(props.item)">
                                                    <span>Put On Hold</span>
                                                </v-list-tile>

                                                <v-divider></v-divider>

                                                <v-list-tile @click="startSubtask(props.item)">
                                                    <span>New subtask</span>
                                                </v-list-tile>
                                                <v-divider></v-divider>

                                                <v-list-tile
                                                    v-if="( props.item.status == 2||props.item.status == 2)&&props.item.actionedByUserID==null"
                                                    @click="closeTask(props.item)">
                                                    <span>close</span>
                                                </v-list-tile>

                                            </v-list>
                                        </v-menu>
                                    </td>
                                </tr>
                            </template>
                        </v-data-table>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
        <UserSelector ref="userSelector" />
        <AssignTask ref="assignTask" />
        <SubtaskModal ref="SubtaskModal" />
        <SpacePlanSelector ref="SpacePlanSelector"></SpacePlanSelector>
        <RangeSelectorModal ref="RangeSelectorModal"></RangeSelectorModal>
        <UserNotesModal ref="UserNotesModal"></UserNotesModal>
        <NotesModal ref="NotesModal"></NotesModal>
    </v-container>
</template>

<script>
    // LIBS
    import Axios from 'axios';
    import jwt from 'jsonwebtoken';
    import {
        EventBus
    } from '@/libs/events/event-bus.js';

    // Components
    import UserSelector from '@/components/Common/UserSelector'
    import AssignTask from '@/components/Common/AssignTask'
    import SubtaskModal from './Subtask.vue'
    import SpacePlanSelector from '@/components/Common/SpacePlanSelector.vue'
    import RangeSelectorModal from '@/components/Common/RangeSelectorModal.vue'
    import UserNotesModal from '@/components/Common/UserNotesModal.vue'
    import NotesModal from '@/components/Common/NotesModal.vue'

    export default {
        name: 'TaskView',
        props: ['data', 'typeList', 'statusList', 'systemUserID'],
        components: {
            UserSelector,
            AssignTask,
            SubtaskModal,
            SpacePlanSelector,
            RangeSelectorModal,
            UserNotesModal,
            NotesModal
        },
        data() {
            return {
                headers: [{
                        text: 'Project',
                        sortable: false
                    },
                    {
                        text: 'Type',
                        sortable: false
                    },
                    {
                        text: 'Status',
                        sortable: false
                    },
                    {
                        text: 'Store Cluster',
                        sortable: false
                    },
                    {
                        text: 'Category Cluster',
                        sortable: false
                    },
                    {
                        text: 'Store',
                        sortable: false
                    },
                    {
                        text: 'Date',
                        sortable: false
                    }, {
                        text: 'User Assigned',
                        sortable: false
                    }, {
                        text: 'Actioned by',
                        sortable: false
                    },
                    {
                        text: '',
                        sortable: false
                    },
                    {
                        text: '',
                        sortable: false
                    },
                    {
                        text: '',
                        sortable: false
                    }
                ],
                searchType: [],
                showLoader: true,
                accessType: null,
                projectTransactionsProjectTab: [],
                selectedUser: null,
                users: [],
                filterList: [],
                dropSearch: null,
                selectedUser: null,
                userAccess: null,
                eventBus: null,
                userAccessTypeID: -1
            }
        },
        mounted() {
            let self = this
            self.getUsers(() => {

            });
        },
        computed: {
            filteredTasks() {
                // filter for both buttons and field
                if (this.dropSearchComp == null && this.searchTypeComp == null) {
                    return this.taskData
                }

                if (this.searchTypeComp.length > 0 && this.dropSearchComp != null) {
                    let tmp = this.taskData.filter((tx) => {
                        if (this.searchTypeComp.includes(tx.type) && this.dropSearchComp == tx.planogram_ID) {
                            return tx
                        }
                        return
                    })
                    return tmp;
                }
                // search for buttons only                   
                if (this.searchTypeComp.length > 0) {
                    let tmp = this.taskData.filter((tx) => {
                        if (this.searchTypeComp.includes(tx.type)) {
                            return tx
                        }
                        return
                    })
                    return tmp;
                }
                //search for only field
                if (this.dropSearchComp != null) {
                    let tmp = this.taskData.filter((tx) => {
                        if (this.dropSearchComp == tx.planogram_ID) {
                            return tx
                        }
                        return
                    })
                    return tmp;
                }
                if (this.searchTypeComp.length == 0 && this.dropSearch == null) {
                    return this.taskData
                }
            }
        },
        methods: {
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
            assign(currentItem) {
                let self = this;

                let request = JSON.parse(JSON.stringify(currentItem))
                let encoded_details = jwt.decode(sessionStorage.accessToken);
                let systemUserID = encoded_details.USER_ID;

                self.$refs.assignTask.showWithData(request, taskDetails => {
                    let projectTXGroupRequest = {
                        projectID: currentItem.project_ID
                    }

                    request.type = taskDetails.type;
                    request.status = 40;
                    request.systemUserID = null;
                    request.rangeFileID = taskDetails.rangeFileID;
                    request.actionedByUserID = systemUserID;
                    request.project_ID = currentItem.project_ID;
                    request.storeCluster_ID = taskDetails.storeCluster;
                    request.categoryCluster_ID = taskDetails.categoryCluster;
                    request.store_ID = taskDetails.store;
                    request.notes = self.findAndReplaceNote(request.notes);
                    // Create first process assigned TX
                    self.createProjectTransaction(request, firstProcessAssigned => {
                        // Create second project transaction group
                        self.createProjectTransactionGroup(projectTXGroupRequest,
                            projectTXGroupNew => {
                                // Create second process assigned TX
                                request.systemUserID = taskDetails.systemUserID;
                                request.actionedByUserID = null;
                                request.projectTXGroup_ID = projectTXGroupNew.id;
                                request.notes = self.findAndReplaceNote(taskDetails.notes);
                                self.createProjectTransaction(request,
                                    secondProcessAssigned => {
                                        // Create actual transaction
                                        request.status = returnStartStatusByType(request.type);
                                        request.notes = self.findAndReplaceNote(request.notes);
                                        self.createProjectTransaction(request,
                                            actualTransaction => {
                                                self.$parent.$parent.getTaskViewData();
                                            })
                                    })
                            })
                    })
                })
            },
            assignNotNew(currentItem) {
                let self = this;

                let request = JSON.parse(JSON.stringify(currentItem))
                let encoded_details = jwt.decode(sessionStorage.accessToken);
                let systemUserID = encoded_details.USER_ID;

                self.$refs.assignTask.showWithData(request, taskDetails => {
                    let projectTXGroupRequest = {
                        projectID: currentItem.project_ID
                    }

                    request.type = taskDetails.type;
                    request.status = 40;
                    request.systemUserID = null;
                    request.rangeFileID = taskDetails.rangeFileID;
                    request.actionedByUserID = systemUserID;
                    request.project_ID = currentItem.project_ID;
                    request.storeCluster_ID = taskDetails.storeCluster;
                    request.categoryCluster_ID = taskDetails.categoryCluster;
                    request.store_ID = taskDetails.store;
                    request.notes = self.findAndReplaceNote(request.notes);
                    // Create first process assigned TX
                    // Create second project transaction group
                    self.createProjectTransactionGroup(projectTXGroupRequest,
                        projectTXGroupNew => {
                            // Create second process assigned TX
                            request.systemUserID = taskDetails.systemUserID;
                            request.actionedByUserID = null;
                            request.projectTXGroup_ID = projectTXGroupNew.id;
                            request.notes = self.findAndReplaceNote(taskDetails.notes);
                            self.createProjectTransaction(request,
                                secondProcessAssigned => {
                                    // Create actual transaction
                                    request.status = returnStartStatusByType(
                                        request.type);
                                    request.notes = self.findAndReplaceNote(request.notes);
                                    self.createProjectTransaction(request,
                                        actualTransaction => {})
                                })
                        })
                })
            },
            closeTask(item, index) {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                let trans = JSON.parse(JSON.stringify(item));
                trans.removed = true;
                trans.notes = self.findAndReplaceNote(trans.notes);

                Axios.put(process.env.VUE_APP_API + 'ProjectTX?update=false', trans).then(
                    res => {
                        delete Axios.defaults.headers.common["TenantID"];
                        self.$parent.$parent.getTaskViewData();
                    })
            },
            setInProgressAndView(item) {
                let self = this;

                let request = JSON.parse(JSON.stringify(item))
                request.status = 1;
                request.notes = self.findAndReplaceNote(request.notes);

                self.createProjectTransaction(request, newItem => {
                    self.routeToView(newItem)
                })
            },
            setApprovalInProgress(item) {
                let self = this;

                let request = JSON.parse(JSON.stringify(item))
                request.status = 20;
                request.notes = self.findAndReplaceNote(request.notes);

                self.createProjectTransaction(request, newItem => {
                    self.routeToView(newItem)
                })
            },
            setDistributionInProgress(item) {
                let self = this;

                let request = JSON.parse(JSON.stringify(item))
                request.status = 21;
                request.notes = self.findAndReplaceNote(request.notes);

                self.createProjectTransaction(request, newItem => {
                    self.routeToView(newItem)
                })
            },
            setImplementationInProgress(item) {
                let self = this;

                let request = JSON.parse(JSON.stringify(item))
                request.status = 24;
                request.notes = self.findAndReplaceNote(request.notes);

                self.createProjectTransaction(request, newItem => {
                    self.routeToView(newItem)
                })
            },
            routeToView(item) {
                let self = this;
                let route;

                switch (item.type) {
                    case 1: {
                        route = `/DataPreparation`
                    }
                    break;
                case 2: {
                    route = `/RangePlanning/${item.rangeFileID}`
                }
                break;
                case 3: {
                    if (item.status == 1 || item.status == 8 || item.status == 41) {
                        route = `/SpacePlanning`
                    } else {
                        route =
                            `/PlanogramImplementation/${item.project_ID}/${item.systemFileID}/${item.status}`
                    }
                }
                break;
                }

                self.$router.push(route);
            },
            setComplete(item) {
                let self = this;
                let request = JSON.parse(JSON.stringify(item));
                request.status = 2;
                request.actionedByUserID = item.systemUserID;
                request.systemUserID = null;
                request.notes = self.findAndReplaceNote(request.notes);
                // Create complete transaction
                self.createProjectTransaction(request, completeTransactionCloseTask => {
                    let projectTXGroupRequest = {
                        projectID: item.project_ID
                    }
                    // Create new project transaction group
                    self.createProjectTransactionGroup(projectTXGroupRequest, newGroup => {
                        request.projectTXGroup_ID = newGroup.id;
                        request.systemUserID = item.projectOwnerID;
                        request.actionedByUserID = null;
                        request.notes = self.findAndReplaceNote(request.notes);
                        // Create complete transaction for new group
                        self.createProjectTransaction(request, newGroupTransaction => {
                            self.$parent.$parent.getTaskViewData();
                        })
                    })
                })
            },
            setPlanogramComplete(item) {
                let self = this;

                let newItem = JSON.parse(JSON.stringify(item))

                self.$refs.SpacePlanSelector.show(spacePlanID => {
                    self.$refs.RangeSelectorModal.show(rangePlanID => {
                        newItem.systemFileID = spacePlanID;
                        newItem.rangeFileID = rangePlanID;
                        self.setComplete(newItem);
                    })
                })
            },
            submitForApproval(item) {
                let self = this;

                self.$refs.UserNotesModal.show(modalData => {
                    let request = JSON.parse(JSON.stringify(item));

                    let projectTXGroupRequest = {
                        projectID: item.project_ID
                    }

                    request.status = 40;
                    request.systemUserID = null;
                    request.actionedByUserID = self.systemUserID;
                    request.notes = self.findAndReplaceNote(request.notes);
                    // Create New Process Assigned for complete group
                    self.createProjectTransaction(request, processEndProjectTX => {
                        // Create "New Group"
                        self.createProjectTransactionGroup(projectTXGroupRequest, newGroupTX => {
                            // Create New Process Assigned for "New Group"
                            request.systemUserID = modalData.systemUserID;
                            request.actionedByUserID = null;
                            request.projectTXGroup_ID = newGroupTX.id;
                            request.notes = self.findAndReplaceNote(request.notes);
                            self.createProjectTransaction(request, processStartProjectTX => {
                                // Create Requesting Approval process for "New Group"
                                request.status = 10;
                                request.notes = self.findAndReplaceNote(modalData
                                    .notes);
                                self.createProjectTransaction(request,
                                    approvalTransaction => {
                                        self.$parent.$parent.getTaskViewData();
                                    })
                            })
                        })
                    })
                })
            },
            submitForDistribution(item) {
                let self = this;

                self.$refs.UserNotesModal.show(modalData => {
                    let request = JSON.parse(JSON.stringify(item));

                    let projectTXGroupRequest = {
                        projectID: item.project_ID
                    }

                    request.status = 40;
                    request.systemUserID = null;
                    request.actionedByUserID = self.systemUserID;
                    request.notes = self.findAndReplaceNote(request.notes);
                    // Create New Process Assigned for complete group
                    self.createProjectTransaction(request, processEndProjectTX => {
                        // Create "New Group"
                        self.createProjectTransactionGroup(projectTXGroupRequest, newGroupTX => {
                            // Create New Process Assigned for "New Group"
                            request.systemUserID = modalData.systemUserID;
                            request.actionedByUserID = null;
                            request.projectTXGroup_ID = newGroupTX.id;
                            request.notes = self.findAndReplaceNote(request.notes);
                            self.createProjectTransaction(request, processStartProjectTX => {
                                // Create Requesting Approval process for "New Group"
                                request.status = 19;
                                request.notes = self.findAndReplaceNote(modalData
                                    .notes);
                                self.createProjectTransaction(request,
                                    approvalTransaction => {
                                        self.$parent.$parent.getTaskViewData();
                                    })
                            })
                        })
                    })
                })
            },
            putTaskOnHold(item) {
                let self = this;

                let request = JSON.parse(JSON.stringify(item));

                let projectTXGroupRequest = {
                    projectID: item.project_ID
                }

                self.$refs.NotesModal.show("Why are you putting this task on hold?", notes => {
                    request.status = 16;
                    request.systemUserID = null;
                    request.actionedByUserID = self.systemUserID;
                    request.notes = self.findAndReplaceNote(request.notes);
                    // Create on hold transaction
                    self.createProjectTransaction(request, processEndProjectTX => {
                        // Create "New Group"
                        self.createProjectTransactionGroup(projectTXGroupRequest, newGroupTX => {
                            // Create on hold transaction for "New Group"
                            request.systemUserID = request.projectOwnerID;
                            request.actionedByUserID = null;
                            request.projectTXGroup_ID = newGroupTX.id;
                            request.notes = self.findAndReplaceNote(notes);
                            self.createProjectTransaction(request, processStartProjectTX => {
                                self.$parent.$parent.getTaskViewData();
                            })
                        })
                    })
                })
            },
            startSubtask(item) {
                let self = this;

                let request = JSON.parse(JSON.stringify(item));
                let encoded_details = jwt.decode(sessionStorage.accessToken);
                let systemUserID = encoded_details.USER_ID;

                let projectTXGroupRequest = {
                    projectID: item.project_ID
                }

                self.$refs.SubtaskModal.show("Start new subtask", subtaskDetails => {
                    // Create new transaction group
                    self.createProjectTransactionGroup(projectTXGroupRequest, newGroupTX => {
                        request.type = 6;
                        request.status = subtaskDetails.status;
                        request.systemUserID = subtaskDetails.systemUserID;
                        request.actionedByUserID = null;
                        request.notes = self.findAndReplaceNote(subtaskDetails.notes);
                        request.rollingUserID = systemUserID;
                        request.projectTXGroup_ID = newGroupTX.id;
                        // Set request dependant on subtask
                        // Create transaction
                        self.createProjectTransaction(request, subtaskTransaction => {
                            self.$parent.$parent.getTaskViewData();
                        })
                    })
                })
            },
            setSubtaskInProgressAndView(item) {
                let self = this;

                let request = JSON.parse(JSON.stringify(item));
                request.notes = self.findAndReplaceNote(request.notes);

                request.status++;
                request.actionedByUserID = null;

                self.createProjectTransaction(request, subtaskTransaction => {
                    self.$parent.$parent.getTaskViewData();
                    // self.goToSubtaskView(request)
                })
            },
            returnSubtaskView(item) {
                if (item.status == 28 || item.status == 29) {
                    return "/DataPreparation";
                }

                if (item.status == 31 || item.status == 32) {
                    return "/SpacePlanning";
                }

                if (item.status == 34 || item.status == 35) {
                    return "/Fixtures";
                }

                if (item.status == 37 || item.status == 38) {
                    return `/PlanogramImplementation/${item.project_ID}/${item.systemFileID}/${item.status}`
                }
            },
            goToSubtaskView(item) {
                let self = this;
                self.$router.push(self.returnSubtaskView(item))
            },
            completeSubtask(item) {
                let self = this;

                let request = JSON.parse(JSON.stringify(item));

                let projectTXGroupRequest = {
                    projectID: item.project_ID
                }
              item.removed = true;
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.put(process.env.VUE_APP_API + "ProjectTX?update=false", item).then(r => {
                    console.log(r);
                    
                    self.$refs.NotesModal.show("Subtask complete notes", notes => {
                        request.status++;
                        request.notes = self.findAndReplaceNote(request.notes);
                        request.actionedByUserID = request.systemUserID;
                        request.systemUserID = null;
                        let tmpRollover = request.rollingUserID;
                        request.rollingUserID = null;

                        // Create complete transaction
                        self.createProjectTransaction(request, endTransaction => {
                            // Create new group to inform other user
                            self.createProjectTransactionGroup(projectTXGroupRequest,
                                newGroup => {
                                    request.notes = self.findAndReplaceNote(notes);
                                    request.systemUserID = tmpRollover;
                                    request.actionedByUserID = null;
                                    request.rollingUserID = null;
                                    request.projectTXGroup_ID = newGroup.id;

                                    // Create new transaction
                                    self.createProjectTransaction(request, newRequest => {
                                        self.$parent.$parent.getTaskViewData();
                                    })
                                })
                        })
                    })
                })

            },
            getUsernameByUserID(userID) {
                let self = this;

                let userName = "";

                self.users.forEach(user => {
                    if (user.systemUserID == userID) {
                        userName = user.firstname + " " + user.lastname;
                    }
                })

                return userName;
            },
            getUsers(callback) {
                let self = this

                Axios.get(process.env.VUE_APP_API + `SystemUser`).then(r => {
                    r.data.forEach(e => {
                        self.users = r.data
                    })

                    callback()
                })
            },
            findAndReplaceNote(note) {
                let self = this;
                let encoded_details = jwt.decode(sessionStorage.accessToken);
                let systemUserID = encoded_details.USER_ID;
                let userName = self.getUsernameByUserID(systemUserID);
                let newNote = "";

                if (note != undefined && note != null) {
                    let noteARR = note.split(/-(.+)/);
                    if (noteARR.length > 1) {
                        newNote = userName + " - " + noteARR[1]
                    } else {
                        newNote = userName + " - " + noteARR[0]
                    }
                } else {
                    newNote = userName + " - ";
                }

                return newNote;
            }
        }
    }

    function returnStartStatusByType(type) {
        let retval;

        switch (type) {
            case 1: {
                retval = 6;
            }
            break;
        case 2: {
            retval = 7;
        }
        break;
        case 3: {
            retval = 8;
        }
        break;
        }

        return retval;
    }
</script>

<style scoped>
    .scrollable {
        height: calc(100vh - 300px);
        overflow: auto;
    }
</style>