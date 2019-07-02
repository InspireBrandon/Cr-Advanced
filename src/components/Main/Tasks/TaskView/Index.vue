<template>
    <v-container grid-list-md fluid class="pa-0">
        <v-layout row wrap>
            <v-flex md12 class="pt-0">
                <ag-grid-vue :gridOptions="gridOptions" style="width: 100%;  height: calc(100vh - 180px);"
                    :defaultColDef="defaultColDef" class="ag-theme-balham" :columnDefs="columnDefs"
                    :selectionChanged="onSelectionChanged" :rowData="data" :enableSorting="true" :enableFilter="true"
                    :suppressRowClickSelection="true" :enableRangeSelection="true" rowSelection="multiple"
                    :rowDeselection="true" :enableColResize="true" :floatingFilter="true" :onGridReady="onGridReady"
                    :groupMultiAutoColumn="true">
                </ag-grid-vue>
                <v-dialog v-model="notesDialog" max-width="500px">
                    <v-card>
                        <v-card-title>
                            <v-menu bottom left>
                                <template v-slot:activator="{ on }">
                                    <v-textarea readonly outline label="Notes" :value="currentNotes">
                                    </v-textarea>
                                </template>
                            </v-menu>
                        </v-card-title>
                        <v-card-actions>
                            <v-btn color="primary" flat @click="notesDialog=false">Close</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
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
    import Actions from './GridComponents/Actions-TMP.vue'
    import Files from './GridComponents/Files.vue'
    import Options from './GridComponents/Options.vue'
    import Notes from './GridComponents/Notes.vue'
    import Type from './GridComponents/Type.vue'
    import Status from './GridComponents/Status.vue'

    import UserSelector from '@/components/Common/UserSelector'
    import AssignTask from '@/components/Common/AssignTask'
    import SubtaskModal from '../Subtask.vue'
    import SpacePlanSelector from '@/components/Common/SpacePlanSelector.vue'
    import RangeSelectorModal from '@/components/Common/RangeSelectorModal.vue'
    import UserNotesModal from '@/components/Common/UserNotesModal.vue'
    import NotesModal from '@/components/Common/NotesModal.vue'

    import {
        AgGridVue
    } from "ag-grid-vue";

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
            NotesModal,
            AgGridVue,
            Actions,
            Files,
            Options,
            Notes,
            Type,
            Status
        },
        data() {
            return {
                columnDefs: [],
                defaultColDef: {
                    onCellValueChanged: this.onCellValueChanged
                },
                gridOptions: {
                    rowHeight: 35,
                    context: {
                        componentParent: this
                    },
                    rowClassRules: {
                        'audit-image-breach': 'data.imageAudit'
                    }
                },
                notesDialog: false,
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
                userAccessTypeID: -1,
                currentNotes: null,
            }
        },
        mounted() {
            let self = this

            self.columnDefs = require('./headers.json');

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
            setColumnDefs() {},
            onGridReady(params) {
                let self = this;
                this.gridApi = params.api;
                this.columnApi = params.columnApi;

                setTimeout(() => {
                    self.gridApi.resetRowHeights();
                    self.gridApi.sizeColumnsToFit()
                }, 60);
            },
            onSelectionChanged() {

            },
            onCellValueChanged(e) {
                console.log(e);
            },
            openNotes(notes) {
                let self = this
                self.notesDialog = true
                self.currentNotes = notes
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
            checkTaskTakeover(request, callback) {
                let self = this;
                let encoded_details = jwt.decode(sessionStorage.accessToken);
                let systemUserID = encoded_details.USER_ID;

                if (request.systemUserID != systemUserID) {
                    request.systemUserID = systemUserID;
                    request.actionedByUserID = null;
                    request.status = 42;
                    request.Closed = true;

                    self.createProjectTransaction(request, () => {
                        callback();
                    })
                } else {
                    callback();
                }
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
                                        actualTransaction => {
                                            self.$parent.$parent.getTaskViewData();
                                        })
                                })
                        })
                })
            },
            closeTask(item) {
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
                let tmpUser = request.systemUserID;

                self.checkTaskTakeover(request, () => {
                    request.systemUserID = tmpUser;
                    request.status = 1;
                    request.notes = self.findAndReplaceNote(request.notes);

                    self.createProjectTransaction(request, newItem => {
                        self.routeToView(newItem)
                    })
                })
            },
            setApprovalInProgress(item) {
                let self = this;

                let request = JSON.parse(JSON.stringify(item))
                let tmpUser = request.systemUserID;

                self.checkTaskTakeover(request, () => {
                    request.systemUserID = tmpUser;
                    request.status = 20;
                    request.notes = self.findAndReplaceNote(request.notes);

                    self.createProjectTransaction(request, newItem => {
                        self.routeToView(newItem)
                    })
                })
            },
            setDistributionInProgress(item) {
                let self = this;

                let request = JSON.parse(JSON.stringify(item))
                let tmpUser = request.systemUserID;

                self.checkTaskTakeover(request, () => {
                    request.systemUserID = tmpUser;
                    request.status = 21;
                    request.notes = self.findAndReplaceNote(request.notes);

                    self.createProjectTransaction(request, newItem => {
                        self.routeToView(newItem)
                    })
                })
            },
            setImplementationInProgress(item) {
                let self = this;

                let request = JSON.parse(JSON.stringify(item))
                let tmpUser = request.systemUserID;

                self.checkTaskTakeover(request, () => {
                    request.systemUserID = tmpUser;
                    request.status = 24;
                    request.notes = self.findAndReplaceNote(request.notes);

                    self.createProjectTransaction(request, newItem => {
                        self.routeToView(newItem)
                    })
                })
            },
            routeToView(item) {
                let self = this;
                let route;

                console.log(item);

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
                    } else if(item.status == 19 || item.status == 21 || item.status == 27) {
                        route = `/PlanogramDistribution/${item.project_ID}/${item.project_Group_ID}`
                    } else {
                        route = `/PlanogramImplementation/${item.project_ID}/${item.systemFileID}/${item.status}`
                    }
                }
                break;
                }

                self.$router.push(route);
            },
            setComplete(item) {
                let self = this;
                let request = JSON.parse(JSON.stringify(item));
                let tmpUser = request.systemUserID;

                self.checkTaskTakeover(request, () => {
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
                    let tmpUser = request.systemUserID;

                    self.checkTaskTakeover(request, () => {
                        request.systemUserID = tmpUser;

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
                            self.createProjectTransactionGroup(projectTXGroupRequest,
                                newGroupTX => {
                                    // Create New Process Assigned for "New Group"
                                    request.systemUserID = modalData.systemUserID;
                                    request.actionedByUserID = null;
                                    request.projectTXGroup_ID = newGroupTX.id;
                                    request.notes = self.findAndReplaceNote(request.notes);
                                    self.createProjectTransaction(request,
                                        processStartProjectTX => {
                                            // Create Requesting Approval process for "New Group"
                                            request.status = 10;
                                            request.notes = self.findAndReplaceNote(
                                                modalData
                                                .notes);
                                            self.createProjectTransaction(request,
                                                approvalTransaction => {
                                                    self.$parent.$parent
                                                        .getTaskViewData();
                                                })
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
                    let tmpUser = request.systemUserID;

                    self.checkTaskTakeover(request, () => {
                        request.systemUserID = tmpUser;

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
                            self.createProjectTransactionGroup(projectTXGroupRequest,
                                newGroupTX => {
                                    // Create New Process Assigned for "New Group"
                                    request.systemUserID = modalData.systemUserID;
                                    request.actionedByUserID = null;
                                    request.projectTXGroup_ID = newGroupTX.id;
                                    request.notes = self.findAndReplaceNote(request.notes);
                                    self.createProjectTransaction(request,
                                        processStartProjectTX => {
                                            // Create Requesting Approval process for "New Group"
                                            request.status = 19;
                                            request.notes = self.findAndReplaceNote(
                                                modalData
                                                .notes);
                                            self.createProjectTransaction(request,
                                                approvalTransaction => {
                                                    self.$parent.$parent
                                                        .getTaskViewData();
                                                })
                                        })
                                })
                        })
                    })
                })
            },
            putTaskOnHold(item) {
                let self = this;

                let request = JSON.parse(JSON.stringify(item));
                let tmpUser = request.systemUserID;

                self.checkTaskTakeover(request, () => {
                    request.systemUserID = tmpUser;

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
                            self.createProjectTransactionGroup(projectTXGroupRequest,
                                newGroupTX => {
                                    // Create on hold transaction for "New Group"
                                    request.systemUserID = request.projectOwnerID;
                                    request.actionedByUserID = null;
                                    request.projectTXGroup_ID = newGroupTX.id;
                                    request.notes = self.findAndReplaceNote(notes);
                                    self.createProjectTransaction(request,
                                        processStartProjectTX => {
                                            self.$parent.$parent.getTaskViewData();
                                        })
                                })
                        })
                    })
                })
            },
            startSubtask(item) {
                let self = this;

                let request = JSON.parse(JSON.stringify(item));
                let tmpUser = request.systemUserID;

                self.checkTaskTakeover(request, () => {
                    request.systemUserID = tmpUser;
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
                })
            },
            setSubtaskInProgressAndView(item) {
                let self = this;

                let request = JSON.parse(JSON.stringify(item));
                let newRequest = JSON.parse(JSON.stringify(item));
                let tmpUser = request.systemUserID;

                self.checkTaskTakeover(request, () => {
                    newRequest.systemUserID = tmpUser;

                    newRequest.notes = self.findAndReplaceNote(newRequest.notes);

                    newRequest.status++;
                    newRequest.actionedByUserID = null;

                    self.createProjectTransaction(newRequest, subtaskTransaction => {
                        self.$parent.$parent.getTaskViewData();
                        // self.goToSubtaskView(request)
                    })
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
                let newRequest = JSON.parse(JSON.stringify(item));
                let tmpUser = request.systemUserID;

                console.log(tmpUser);

                self.checkTaskTakeover(request, () => {
                    newRequest.systemUserID = tmpUser;

                    let projectTXGroupRequest = {
                        projectID: item.project_ID
                    }

                    item.removed = true;
                    Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                    Axios.put(process.env.VUE_APP_API + "ProjectTX?update=false", item).then(r => {
                        console.log(r);

                        self.$refs.NotesModal.show("Subtask complete notes", notes => {
                            newRequest.status++;
                            newRequest.notes = self.findAndReplaceNote(newRequest.notes);
                            newRequest.actionedByUserID = newRequest.systemUserID;
                            newRequest.systemUserID = null;
                            let tmpRollover = newRequest.rollingUserID;
                            newRequest.rollingUserID = null;

                            // Create complete transaction
                            self.createProjectTransaction(newRequest, endTransaction => {
                                // Create new group to inform other user
                                self.createProjectTransactionGroup(
                                    projectTXGroupRequest,
                                    newGroup => {
                                        newRequest.notes = self.findAndReplaceNote(
                                            notes);
                                        newRequest.systemUserID = tmpRollover;
                                        newRequest.actionedByUserID = null;
                                        newRequest.rollingUserID = null;
                                        newRequest.projectTXGroup_ID = newGroup.id;

                                        // Create new transaction
                                        self.createProjectTransaction(newRequest,
                                            newRequest => {
                                                self.$parent.$parent
                                                    .getTaskViewData();
                                            })
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
            },
            sendMail(currentItem) {
                let self = this;

                self.$refs.UserNotesModal.show(modalData => {
                    let request = JSON.parse(JSON.stringify(currentItem));

                    let projectTXGroupRequest = {
                        projectID: request.project_ID
                    }

                    // Create New Project Group
                    self.createProjectTransactionGroup(projectTXGroupRequest, newGroup => {
                        request.systemUserID = modalData.systemUserID;
                        request.actionedByUserID = null;
                        request.rollingUserID = null;
                        request.notes = modalData.notes;
                        request.projectTXGroup_ID = newGroup.id;
                        request.type = 7;
                        request.status = 43;
                        // Create New Project Transaction
                        self.createProjectTransaction(request, data => {
                            self.$parent.$parent.getTaskViewData();
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
        height: calc(100vh - 300px);
        overflow: auto;
    }

    table {
        border-collapse: collapse;
        width: 100%;
        font-family: sans-serif;
    }

    table,
    th,
    td {
        border: 1px solid rgb(199, 199, 199);
        border-left: 0px !important;
        border-right: 0px !important;
        font-size: 13px;
        text-align: left;
    }

    th {
        padding: 5px 0px;
    }

    td {
        border-bottom: 0px !important;
        font-size: 12px;
        padding: 0px 2px;
    }
</style>