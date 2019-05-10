<template>
    <v-container grid-list-md fluid>
        <v-layout row wrap>
            <v-flex md12>
                <v-card flat>
                    <!-- <v-toolbar flat dark dense color="primary">
                        <v-autocomplete prepend-inner-icon="search" placeholder="Search" :items="filterList"
                            v-model="dropSearch"></v-autocomplete>
                        <v-btn-toggle v-model="searchType" class="transparent" multiple>
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-btn v-on="on" :value="1" flat>
                                        <v-icon>
                                            perm_data_setting</v-icon>
                                    </v-btn>
                                </template>
                                <span>Data-Prep</span>
                            </v-tooltip>
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-btn v-on="on" :value="2" flat>
                                        <v-icon>assessment</v-icon>
                                    </v-btn>
                                </template>
                                <span>Ranging</span>
                            </v-tooltip>
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-btn v-on="on" :value="3" flat>
                                        <v-icon>web</v-icon>
                                    </v-btn>
                                </template>
                                <span>Planogram</span>
                            </v-tooltip>
                        </v-btn-toggle>
                        <v-spacer></v-spacer>
                        <v-autocomplete v-if="userAccess==0" @change="GetNewTransactions(selectedUser)"
                            placeholder="users" :items="users" v-model="selectedUser"></v-autocomplete>
                    </v-toolbar> -->
                    <v-card-text class="pa-0">
                        <v-data-table :headers="headers" :items="filteredTasks" class="elevation-0 scrollable"
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
                                            <v-btn small color="secondary" @click="assign(props.item)"
                                                v-if="(props.item.type == 2 && props.item.status == 2) && systemUserID == props.item.systemUserID">
                                                Assign</v-btn>
                                            <v-btn small color="warning" @click="routeToView(props.item)"
                                                v-if="(props.item.type == 2 && props.item.status == 2) && systemUserID == props.item.systemUserID">
                                                View</v-btn>
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
                                        <v-btn small color="warning" @click="routeToView(props.item)"
                                            v-if="props.item.type == 3 && props.item.status == 26">View</v-btn>
                                        <!-- END IMPLEMENTATION -->
                                        <!-- ON HOLD -->
                                        <v-btn small color="secondary" @click="assign(props.item)"
                                            v-if="props.item.status == 16 && systemUserID == props.item.systemUserID">
                                            Assign</v-btn>
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
                                            <v-btn icon slot="activator">
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
        <UserNotesModal ref="UserNotesModal"></UserNotesModal>
        <NotesModal ref="NotesModal"></NotesModal>
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
    import NotesModal from '@/components/Common/NotesModal.vue'
    import {
        EventBus
    } from '@/libs/events/event-bus.js';


    export default {
        name: 'tasks',
        props: ['searchTypeComp', 'dropSearchComp'],
        components: {
            UserSelector,
            AssignTask,
            SubtaskModal,
            SpacePlanSelector,
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
                projectTransactions: [],
                status: [],
                typeList: [],
                systemUserID: null,
                selectedUser: null,
                users: [],
                filterList: [],
                dropSearch: null,
                selectedUser: null,
                userAccess: null,
                eventBus: null,
            }
        },
        mounted() {
            let self = this
            EventBus.$on('user-select-changed', user => {
                self.GetNewTransactions(user)
            });
        },
        created() {
            let self = this;
            setTimeout(() => {
                self.getLists(() => {
                    self.checkAccessType()
                    self.getUsers()
                    // this.getDatabaseUsers()
                    let encoded_details = jwt.decode(sessionStorage.accessToken);
                    let systemUserID = encoded_details.USER_ID;
                    self.systemUserID = systemUserID;
                    self.getTransactionsByUser(systemUserID, () => {})
                })
            }, 1000);
        },
        computed: {
            // handlefilters(){
            //     let self = this
            //     self.searchType=self.searchTypeComp
            //     self.dropSearch=self.dropSearchComp

            // },
            filteredTasks() {
                // filter for both buttons and field
                if (this.dropSearchComp == null && this.searchTypeComp == null) {
                    return this.projectTransactions
                }

                console.log(this)

                if (this.searchTypeComp.length > 0 && this.dropSearchComp != null) {
                    let tmp = this.projectTransactions.filter((tx) => {
                        if (this.searchTypeComp.includes(tx.type) && this.dropSearchComp == tx.planogram_ID) {
                            return tx
                        }
                        return
                    })
                    return tmp;
                }
                // search for buttons only                   
                if (this.searchTypeComp.length > 0) {
                    let tmp = this.projectTransactions.filter((tx) => {
                        if (this.searchTypeComp.includes(tx.type)) {
                            return tx
                        }
                        return
                    })
                    return tmp;
                }
                //search for only field
                if (this.dropSearchComp != null) {
                    let tmp = this.projectTransactions.filter((tx) => {
                        if (this.dropSearchComp == tx.planogram_ID) {
                            return tx
                        }
                        return
                    })
                    return tmp;
                }
                if (this.searchTypeComp.length == 0 && this.dropSearch == null) {
                    return this.projectTransactions
                }
            }
        },
        methods: {
            getUsers() {
                let self = this
                let list = []
                Axios.get(process.env.VUE_APP_API +
                    `SystemUser`).then(r => {
                    console.log("users");
                    console.log(r);
                    r.data.forEach(e => {
                        list.push({
                            text: e.firstname + " " + e.lastname,
                            value: e.systemUserID
                        })
                    })
                    EventBus.$emit('stores-items-changed', list);
                })
            },
            checkAccessType() {
                let self = this;

                let encoded_details = jwt.decode(sessionStorage.accessToken);

                Axios.get(process.env.VUE_APP_API +
                        `TenantLink_AccessType?systemUserID=${encoded_details.USER_ID}&tenantID=${sessionStorage.currentDatabase}`
                    )
                    .then(r => {

                        if (r.data.isDatabaseOwner == true) {
                            self.userAccess = 0
                        } else {
                            self.userAccess = r.data.tenantLink_AccessTypeList[0].accessType
                        }
                    })
            },
            GetNewTransactions(userID) {
                let self = this
                EventBus.$emit('data-loading', userID);

                self.getTransactionsByUser(userID, () => {})
            },
            getDatabaseUsers() {
                let self = this;
                let encoded_details = jwt.decode(sessionStorage.accessToken);
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                Axios.get(process.env.VUE_APP_API + `Tenant?userID=${encoded_details.USER_ID}`)
                    .then(r => {
                        Axios.get(process.env.VUE_APP_API + `/SystemUser`).then(
                            resp => {
                                resp.data.forEach(e => {
                                    self.users.push({
                                        text: e.firstname + " " + e.lastname,
                                        value: e.systemUserID
                                    })
                                })

                                console.log(self.users)
                            })
                    })
            },
            getfilterList() {
                let self = this
                self.filterList = []
                self.projectTransactions.forEach(element => {
                    if (!self.filterList.includes(element.planogram_ID)) {
                        self.filterList.push({
                            value: element.planogram_ID,
                            text: element.planogram,
                        })
                    }
                });
                EventBus.$emit('filter-items-changed', self.filterList);

            },
            getLists(callback) {
                let self = this
                let statusHandler = new StatusHandler()
                self.status = statusHandler.getStatus()
                self.typeList = statusHandler.getTypeList()
                callback()
            },
            getTransactionsByUser(systemUserID, callback) {
                let self = this;
                EventBus.$emit('data-loading', systemUserID);

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + `UserProjectTX?userID=${systemUserID}`).then(r => {
                        self.projectTransactions = r.data.projectTXList;
                        delete Axios.defaults.headers.common["TenantID"];
                        self.getfilterList()
                EventBus.$emit('data-loaded', systemUserID);
                        
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
                    // Create first process assigned TX
                    self.createProjectTransaction(request, firstProcessAssigned => {
                        // Create second project transaction group
                        self.createProjectTransactionGroup(projectTXGroupRequest,
                            projectTXGroupNew => {
                                // Create second process assigned TX
                                request.systemUserID = taskDetails.systemUserID;
                                request.actionedByUserID = null;
                                request.projectTXGroup_ID = projectTXGroupNew.id;
                                request.notes = taskDetails.notes;
                                self.createProjectTransaction(request,
                                    secondProcessAssigned => {
                                        // Create actual transaction
                                        request.status = returnStartStatusByType(
                                            request.type);
                                        self.createProjectTransaction(request,
                                            actualTransaction => {
                                                self.getTransactionsByUser(
                                                    systemUserID);
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
                    // Create first process assigned TX
                    // Create second project transaction group
                    self.createProjectTransactionGroup(projectTXGroupRequest,
                        projectTXGroupNew => {
                            // Create second process assigned TX
                            request.systemUserID = taskDetails.systemUserID;
                            request.actionedByUserID = null;
                            request.projectTXGroup_ID = projectTXGroupNew.id;
                            request.notes = taskDetails.notes;
                            self.createProjectTransaction(request,
                                secondProcessAssigned => {
                                    // Create actual transaction
                                    request.status = returnStartStatusByType(
                                        request.type);
                                    self.createProjectTransaction(request,
                                        actualTransaction => {
                                            self.getTransactionsByUser(
                                                systemUserID);
                                        })
                                })
                        })
                })
            },
            closeTask(item, index) {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                let trans = JSON.parse(JSON.stringify(item));
                trans.removed = true;

                Axios.put(process.env.VUE_APP_API + 'ProjectTX?update=false', trans).then(
                    res => {
                        delete Axios.defaults.headers.common["TenantID"];
                        self.getTransactionsByUser(systemUserID);
                    })

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
            setDistributionInProgress(item) {
                let self = this;

                let request = JSON.parse(JSON.stringify(item))
                request.status = 21;
                request.notes = null;

                self.createProjectTransaction(request, newItem => {
                    self.routeToView(newItem)
                })
            },
            setImplementationInProgress(item) {
                let self = this;

                let request = JSON.parse(JSON.stringify(item))
                request.status = 24;
                request.notes = null;

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
                                request.status = 19;
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
                    // Create on hold transaction
                    self.createProjectTransaction(request, processEndProjectTX => {
                        // Create "New Group"
                        self.createProjectTransactionGroup(projectTXGroupRequest, newGroupTX => {
                            // Create on hold transaction for "New Group"
                            request.systemUserID = request.projectOwnerID;
                            request.actionedByUserID = null;
                            request.projectTXGroup_ID = newGroupTX.id;
                            request.notes = notes;
                            self.createProjectTransaction(request, processStartProjectTX => {
                                // Create Requesting Approval process for "New Group
                                self.getTransactionsByUser(self.systemUserID);
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
        height: calc(100vh - 240px);
        overflow: auto;
    }
</style>