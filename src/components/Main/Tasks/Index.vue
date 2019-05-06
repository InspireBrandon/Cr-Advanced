<template>
    <v-container grid-list-md fluid>
        <v-layout row wrap>
            <v-flex md12>
                <v-card flat>
                    <v-toolbar flat dark dense color="primary"></v-toolbar>
                    <v-card-text class="pa-0">
                        <v-data-table :headers="headers" :items="projectTransactions" class="elevation-0 scrollable"
                            hide-actions>
                            <template v-slot:items="props">
                                <tr
                                    :style="{ backgroundColor: (props.item.subtask == true  ? 'lightgrey' : 'transparent' )}">
                                    <td>{{ props.item.planogram }}</td>
                                    <td>{{ typeList[props.item.type == -1 ? 5 : props.item.type].text }}</td>
                                    <td>{{ status[props.item.status == -1 ? 18 : props.item.status].text }}</td>
                                    <td>{{ props.item.storeCluster }}</td>
                                    <td>{{ props.item.categoryCluster }}</td>
                                    <td>{{ props.item.store }}</td>
                                    <td>{{ props.item.dateTimeString }}</td>
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
                                                v-if="props.item.type == 1 && props.item.status == 1">View</v-btn>
                                            <v-btn small color="error" @click="setComplete(props.item)"
                                                v-if="props.item.type == 1 && props.item.status == 1">Complete</v-btn>
                                        </div>
                                        <v-btn small color="error" @click="closeTask(props.item, props.index)"
                                            v-if="(props.item.type == 1 && props.item.status == 2) && systemUserID == props.item.actionedByUserID">
                                            Close</v-btn>
                                        <v-btn small color="secondary" @click="assign(props.item)"
                                            v-if="(props.item.type == 1 && props.item.status == 2) && systemUserID == props.item.systemUserID">
                                            Assign</v-btn>
                                        <!-- END DATA PREPARATION -->
                                        <!-- RANGING -->
                                        <v-btn small color="success" @click="setInProgressAndView(props.item)"
                                            v-if="props.item.type == 2 && props.item.status == 7">View</v-btn>
                                        <div style="display: flex;">
                                            <v-btn small color="warning" @click="routeToView(props.item)"
                                                v-if="props.item.type == 2 && props.item.status == 1">View</v-btn>
                                            <v-btn small color="error" @click="setComplete(props.item)"
                                                v-if="props.item.type == 2 && props.item.status == 1">Complete</v-btn>
                                        </div>
                                        <v-btn small color="error" @click="closeTask(props.item, props.index)"
                                            v-if="(props.item.type == 2 && props.item.status == 2) && systemUserID == props.item.actionedByUserID">
                                            Close</v-btn>
                                        <v-btn small color="secondary" @click="assign(props.item)"
                                            v-if="(props.item.type == 2 && props.item.status == 2) && systemUserID == props.item.systemUserID">
                                            Assign</v-btn>
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
                                        <v-btn small color="error" @click="closeTask(props.item, props.index)" v-if="(props.item.type == 3 && props.item.status == 2) && systemUserID == props.item.actionedByUserID">
                                            Close</v-btn>
                                        <v-btn small color="primary" @click="submitForApproval(props.item)" v-if="(props.item.type == 3 && props.item.status == 2) && systemUserID == props.item.systemUserID">
                                            Submit</v-btn>
                                        <!-- SPACE PLANNING -->
                                        <!-- APPROVAL PROCESS -->
                                        <v-btn small color="success" @click="setApprovalInProgress(props.item)" v-if="props.item.type == 3 && props.item.status == 10">View</v-btn>
                                        <v-btn small color="warning" @click="routeToView(props.item)" v-if="props.item.type == 3 && props.item.status == 20">View</v-btn>
                                        <v-btn small color="error" @click="closeTask(props.item)" v-if="(props.item.type == 3 && props.item.status == 12) && systemUserID == props.item.actionedByUserID">Close</v-btn>
                                        <v-btn small color="primary" @click="routeToView(props.item)" v-if="(props.item.type == 3 && props.item.status == 12) && systemUserID == props.item.systemUserID">Send</v-btn>
                                        <!-- END APPROVAL PROCESS -->
                                        <!-- DISTRIBUTION -->
                                        <v-btn small color="success" @click="setDistributionInProgress(props.item)" v-if="props.item.type == 3 && props.item.status == 10">View</v-btn>
                                        <!-- END DISTRIBUTION -->
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
        <UserNotesModal ref="UserNotesModal"></UserNotesModal>
    </v-container>
</template>

<script>
    import Axios from 'axios';
    import jwt from 'jsonwebtoken';
    import UserSelector from '@/components/Common/UserSelector'
    import AssignTask from '@/components/Common/AssignTask'
    import StatusHandler from '@/libs/system/projectStatusHandler'
    import SubtaskModal from './Subtask.vue'
    import SpacePlanSelector from '@/components/Common/SpacePlanSelector.vue'
    import UserNotesModal from '@/components/Common/UserNotesModal.vue'

    export default {
        name: 'tasks',
        components: {
            UserSelector,
            AssignTask,
            SubtaskModal,
            SpacePlanSelector,
            UserNotesModal
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
                    },
                    {
                        text: '',
                        sortable: false
                    }
                ],
                showLoader: true,
                accessType: null,
                projectTransactionsProjectTab: [],
                projectTransactions: [],
                status: [],
                typeList: [],
                systemUserID: null,
                selectedUser: null,
                users: []
            }
        },
        created() {
            let self = this;

            self.getLists(() => {
                let encoded_details = jwt.decode(sessionStorage.accessToken);
                let systemUserID = encoded_details.USER_ID;
                self.systemUserID = systemUserID;
                self.getTransactionsByUser(systemUserID, () => {})
            })
        },
        methods: {
            getLists(callback) {
                let self = this
                let statusHandler = new StatusHandler()
                self.status = statusHandler.getStatus()
                self.typeList = statusHandler.getTypeList()
                callback()
            },
            getTransactionsByUser(systemUserID, callback) {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + `UserProjectTX?userID=${systemUserID}`).then(r => {
                        self.projectTransactions = r.data.projectTXList;
                        delete Axios.defaults.headers.common["TenantID"];
                        callback();
                    })
                    .catch(e => {
                        delete Axios.defaults.headers.common["TenantID"];
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
            assign(currentItem) {
                let self = this;

                let request = JSON.parse(JSON.stringify(currentItem))
                let encoded_details = jwt.decode(sessionStorage.accessToken);
                let systemUserID = encoded_details.USER_ID;

                self.$refs.assignTask.show(taskDetails => {
                    let projectTXGroupRequest = {
                        projectID: currentItem.project_ID
                    }

                    // Create first project transaction group
                    self.createProjectTransactionGroup(projectTXGroupRequest, projectTXGroupSwitch => {
                        request.type = taskDetails.type;
                        request.status = 40;
                        request.systemUserID = null;
                        request.actionedByUserID = systemUserID;
                        request.projectTXGroup_ID = projectTXGroupSwitch.id;
                        request.project_ID = currentItem.project_ID;
                        request.storeCluster_ID = taskDetails.storeCluster;
                        request.categoryCluster_ID = taskDetails.categoryCluster;
                        request.store_ID = taskDetails.store;
                        // Create first process assigned TX
                        self.createProjectTransaction(request, firstProcessAssigned => {
                            // Create second project transaction group
                            self.createProjectTransactionGroup(projectTXGroupRequest,
                                projectTXGroupNew => {
                                    // Create second process assigned TX
                                    request.systemUserID = taskDetails.systemUserID;
                                    request.actionedByUserID = null;
                                    request.projectTXGroup_ID = projectTXGroupNew.id;
                                    self.createProjectTransaction(request,
                                        secondProcessAssigned => {
                                            // Create actual transaction
                                            request.status = returnStartStatusByType(
                                                request.type);
                                            request.notes = taskDetails.notes;
                                            self.createProjectTransaction(request,
                                                actualTransaction => {
                                                    self.getTransactionsByUser(
                                                        systemUserID);
                                                })
                                        })
                                })
                        })
                    })
                })
            },
            closeTask(item, index) {
                let self = this;
                self.projectTransactions.splice(index, 1);
            },
            setInProgressAndView(item) {
                let self = this;

                let request = JSON.parse(JSON.stringify(item))
                request.status = 1;
                request.notes = null;

                self.createProjectTransaction(request, newItem => {
                    self.routeToView(newItem)
                })
            },
            setApprovalInProgress(item) {
                let self = this;

                let request = JSON.parse(JSON.stringify(item))
                request.status = 20;
                request.notes = null;

                self.createProjectTransaction(request, newItem => {
                    self.routeToView(newItem)
                })
            },
            setDistributionInProgress() {
                let self = this;

                let request = JSON.parse(JSON.stringify(item))
                request.status = 21;
                request.notes = null;

                self.createProjectTransaction(request, newItem => {
                    self.routeToView(newItem)
                })
            },
            routeToView(item) {
                let self = this;
                let route;

                switch (item.type) {
                    case 1:
                        {
                            route = `/DataPreparation`
                        }
                        break;
                    case 2:
                        {
                            route = `/RangePlanning`
                        }
                        break;
                    case 3:
                        {
                            if (item.status == 1 || item.status == 8) {
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
                        // Create complete transaction for new group
                        self.createProjectTransaction(request, newGroupTransaction => {
                            self.getTransactionsByUser(self.systemUserID);
                        })
                    })
                })
            },
            setPlanogramComplete(item) {
                let self = this;

                let newItem = JSON.parse(JSON.stringify(item))

                self.$refs.SpacePlanSelector.show(spacePlanID => {
                    newItem.systemFileID = spacePlanID;
                    self.setComplete(newItem);
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
                    // Create New Process Assigned for complete group
                    self.createProjectTransaction(request, processEndProjectTX => {
                        // Create "New Group"
                        self.createProjectTransactionGroup(projectTXGroupRequest, newGroupTX => {
                            // Create New Process Assigned for "New Group"
                            request.systemUserID = modalData.systemUserID;
                            request.actionedByUserID = null;
                            request.projectTXGroup_ID = newGroupTX.id;
                            self.createProjectTransaction(request, processStartProjectTX => {
                                // Create Requesting Approval process for "New Group"
                                request.status = 10;
                                request.notes = modalData.notes;
                                self.createProjectTransaction(request,
                                    approvalTransaction => {
                                        self.getTransactionsByUser(self
                                            .systemUserID);
                                    })
                            })
                        })
                    })
                })
            }
        }
    }

    function returnStartStatusByType(type) {
        let retval;

        switch (type) {
            case 1:
                {
                    retval = 6;
                }
                break;
            case 2:
                {
                    retval = 7;
                }
                break;
            case 3:
                {
                    retval = 8;
                }
                break;
        }

        return retval;
    }
</script>

<style scoped>
    .scrollable {
        height: calc(100vh - 240px);
        overflow: auto;
    }
</style>