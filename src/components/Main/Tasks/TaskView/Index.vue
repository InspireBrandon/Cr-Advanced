<template>
    <v-container grid-list-md fluid class="pa-0">
        <v-layout row wrap>
            <v-flex md12 class="pt-0">
                <ag-grid-vue :gridOptions="gridOptions" style="width: 100%;  height: calc(100vh - 173px);"
                    :defaultColDef="defaultColDef" class="ag-theme-balham" :columnDefs="columnDefs"
                    :selectionChanged="onSelectionChanged" :rowData="data" :enableSorting="true" :enableFilter="true"
                    :suppressRowClickSelection="true" :enableRangeSelection="true" rowSelection="multiple"
                    :rowDeselection="true" :enableColResize="true" :floatingFilter="true" :onGridReady="onGridReady"
                    :groupMultiAutoColumn="true">
                </ag-grid-vue>
                <v-dialog v-model="notesDialog" max-width="600px">
                    <v-card>
                        <v-card-title>
                            <v-menu bottom left>
                                <template v-slot:activator="{ on }">
                                    <v-textarea rows="15" readonly outline label="Notes" :value="currentNotes">
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
        <YesNoModal ref="yesNoModal"></YesNoModal>
        <NotesModal ref="NotesModal"></NotesModal>
        <NewTask ref="NewTask"></NewTask>
        <UserSelectorModalDynamic ref="UserSelectorModalDynamic" />
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
    import YesNoModal from '@/components/Common/YesNoModal';
    import Status from './GridComponents/Status.vue'

    import UserSelector from '@/components/Common/UserSelector'
    import AssignTask from '@/components/Common/AssignTask'
    import SubtaskModal from '../Subtask.vue'
    import SpacePlanSelector from '@/components/Common/SpacePlanSelector.vue'
    import RangeSelectorModal from '@/components/Common/RangeSelectorModal.vue'
    import UserNotesModal from '@/components/Common/UserNotesModal.vue'
    import NotesModal from '@/components/Common/NotesModal.vue'
    import NewTask from '../NewTask'
    import UserSelectorModalDynamic from '@/components/Common/UserSelectorModalDynamic.vue'

    import {
        AgGridVue
    } from "ag-grid-vue";
    export default {
        name: 'TaskView',
        props: ['data', 'typeList', 'statusList', 'systemUserID', 'accessType', 'goToDistribution'],
        components: {
            UserSelector,
            AssignTask,
            SubtaskModal,
            SpacePlanSelector,
            RangeSelectorModal,
            YesNoModal,
            NewTask,
            UserNotesModal,
            NotesModal,
            AgGridVue,
            Actions,
            Files,
            Options,
            Notes,
            Type,
            Status,
            UserSelectorModalDynamic
        },
        data() {
            return {
                columnDefs: [{
                        "headerName": "Project",
                        "field": "planogram",
                        "editable": false,
                        "hide": false
                    },
                    {
                        "headerName": "Type",
                        "field": "type",
                        "editable": false,
                        "hide": false,
                        "cellRendererFramework": "Type"
                    },
                    {
                        "headerName": "Status",
                        "field": "status",
                        "editable": false,
                        "hide": false,
                        "cellRendererFramework": "Status"
                    },
                    {
                        "headerName": "Intended Stores",
                        "editable": false,
                        "hide": false,
                        "valueFormatter": function (params) {
                            if (params.data.store != null || params.data.store != undefined) {
                                return params.data.store
                            } else {
                                return (checkNull(params.data.storeCluster) + " " + checkNull(params.data
                                    .categoryCluster) + " " + checkNull(params.data.customCluster))
                            }
                        }
                    },
                    // {
                    //     "headerName": "Category Cluster",
                    //     "field": "categoryCluster",
                    //     "editable": false,
                    //     "hide": false
                    // },
                    // {
                    //     "headerName": "Custom Cluster",
                    //     "field": "customCluster",
                    //     "editable": false,
                    //     "hide": false
                    // },
                    // {
                    //     "headerName": "Store",
                    //     "field": "store",
                    //     "editable": false,
                    //     "hide": false
                    // },
                    {
                        "headerName": "Date",
                        "field": "dateTimeString",
                        "editable": false,
                        "hide": false
                    },
                    {
                        "headerName": "User Assigned",
                        "field": "username",
                        "editable": false,
                        "hide": false
                    },
                    {
                        "headerName": "Actioned By",
                        "field": "actionedByUserName",
                        "editable": false,
                        "hide": false
                    },
                    {
                        "headerName": "Actions",
                        "field": "",
                        "editable": false,
                        "hide": false,
                        "cellRendererFramework": "Actions",
                        "width": 280
                    },
                    {
                        "headerName": "Notes",
                        "field": "",
                        "editable": false,
                        "hide": false,
                        "cellRendererFramework": "Notes",
                        "width": 90
                    },
                    {
                        "headerName": "Files",
                        "field": "",
                        "editable": false,
                        "hide": false,
                        "cellRendererFramework": "Files",
                        "width": 130
                    },
                    {
                        "headerName": "",
                        "field": "",
                        "editable": false,
                        "hide": false,
                        "cellRendererFramework": "Options",
                        "width": 80,
                        "minWidth": 30
                    }
                ],
                defaultColDef: {
                    onCellValueChanged: this.onCellValueChanged
                },
                gridOptions: {
                    rowHeight: 35,
                    context: {
                        componentParent: this
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

            // self.columnDefs = require('./headers.json');

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
                self.gridApi.resetRowHeights();
                self.gridApi.sizeColumnsToFit();
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
            openNotesObj(obj) {
                let self = this
                self.notesDialog = true
                self.currentNotes = obj.notes
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

                request.notes = ""

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
                    request.approvalUserID = taskDetails.approvalUserID;
                    request.project_ID = currentItem.project_ID;
                    request.storeCluster_ID = taskDetails.storeCluster;
                    request.categoryCluster_ID = taskDetails.categoryCluster;
                    request.store_ID = taskDetails.store;
                    request.customCluster_ID = taskDetails.customCluster;
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
                    request.approvalUserID = taskDetails.approvalUserID;
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
            recall(item) {
                let self = this

                let request = JSON.parse(JSON.stringify(item))
                let tmpUser = request.systemUserID;
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.post(process.env.VUE_APP_API + `Store_Planogram/ReCall?SystemFileID=${item.systemFileID}`).then(
                    r => {

                        Axios.post(process.env.VUE_APP_API +
                                `SystemFile/UpdateStatus?db=CR-Devinspire&systemFileID=${item.systemFileID}&newStatus=1`
                            )
                            .then(nsr => {
                                delete Axios.defaults.headers.common["TenantID"];
                            })
                    })
            },
            setDistributionViewed(item) {
                let self = this;

                self.setCanDistribute(item.systemFileID, () => {
                    let request = JSON.parse(JSON.stringify(item))
                    let tmpUser = request.systemUserID;

                    self.checkTaskTakeover(request, () => {
                        request.systemUserID = tmpUser;
                        request.status = 44;
                        request.notes = self.findAndReplaceNote(request.notes);

                        self.createProjectTransaction(request, newItem => {
                            // self.routeToView(newItem)
                            self.goToDistribution(item);
                        })
                    })
                })
            },
            goToDistributionView(item) {
                let self = this;

                // self.setDistributionViewed()

                self.setCanDistribute(item.systemFileID, () => {
                    self.setDistributionInProgress(item);
                })
            },
            setDiscontinued(params) {
                let self = this
                self.$refs.yesNoModal.show('Are you sure you want to discontinue this Category?', value => {
                    if (value) {
                        Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                        Axios.post(process.env.VUE_APP_API +
                            `/Project?Project_ID=${params.project_ID}&Value=${true}`).then(
                            r => {

                                self.closeTask(params)
                            })
                    }
                })
            },
            setParked(item) {
                let self = this;

                let request = JSON.parse(JSON.stringify(item))
                let tmpUser = request.systemUserID;

                self.checkTaskTakeover(request, () => {
                    request.systemUserID = tmpUser;
                    request.status = 45;
                    request.notes = self.findAndReplaceNote(request.notes);

                    self.createProjectTransaction(request, newItem => {
                        self.$parent.$parent.getTaskViewData();
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
            setCanDistribute(sp, callback) {
                let self = this;

                self.$nextTick(() => {
                    Axios.post(process.env.VUE_APP_API +
                            `SystemFile/SetDistribute?db=CR-DEVINSPIRE&systemFileID=${sp}&canDistribute=true`
                        )
                        .then(r => {
                            callback();
                        })
                })
            },
            setDistributionInProgress(item) {
                let self = this;

                self.setCanDistribute(item.systemFileID, () => {
                    let request = JSON.parse(JSON.stringify(item))
                    let tmpUser = request.systemUserID;

                    self.checkTaskTakeover(request, () => {
                        request.systemUserID = tmpUser;
                        request.status = 21;
                        request.notes = self.findAndReplaceNote(request.notes);

                        self.createProjectTransaction(request, newItem => {
                            // self.routeToView(newItem)
                            self.goToDistribution(item);
                        })
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
                        self.updateStorePlanogramStatus(request.store_ID, request
                            .systemFileID, 3, sp => {
                                self.routeToView(newItem)
                            })
                    })
                })

                // self.checkFileStatus(request.systemFileID, data => {
                //     if (data.status == 1) {
                //         alert("this planogram has been recalled, task will be removed");
                //     } else if (data.status == 2) {
                //         alert("A variation has been requested for this planogram, task will be removed");
                //     } else {}
                // })
            },
            checkFileStatus(fileID, callback) {
                let self = this;

                Axios.get(process.env.VUE_APP_API + "SystemFile?db=CR-DEVINSPIRE&id=" + fileID)
                    .then(r => {
                        callback(r.data);
                    })
            },
            sendToApprovalUser(item) {
                let self = this;

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

                        // Create New Process Assigned for "New Group"
                        self.getApprovalUser(request.project_ID, request.approvalUserID,
                            systemUserID => {
                                request.systemUserID = systemUserID;
                                request.actionedByUserID = null;
                                request.notes = self.findAndReplaceNote(request.notes);
                                self.createProjectTransaction(request, processStartProjectTX => {
                                    // Create Requesting Approval process for "New Group"
                                    request.status = 10;
                                    request.notes = self.findAndReplaceNote(
                                        request
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
            },
            getApprovalUser(projectID, approvalUserID, callback) {
                let self = this;
                Axios.get(process.env.VUE_APP_API + `SystemUser`).then(userresp => {
                    let users = userresp.data
                    if (approvalUserID == null) {
                        Axios.get(process.env.VUE_APP_API +
                                `ProjectUsers?typeName=Ranging&projectID=${projectID}`)
                            .then(r => {
                                console.log("project users", r.data);


                                if (r.data.length > 1) {
                                    let items = []
                                    console.log("All users", users);
                                    r.data.forEach(item => {
                                        users.forEach(user => {
                                            console.log(
                                                "user.systemUserID == item.userID_2:",
                                                user
                                                .systemUserID == item.userID_2);

                                            if (user.systemUserID == item.userID_2) {
                                                items.push({
                                                    text: user.firstname + " " +
                                                        user.lastname,
                                                    value: user.systemUserID
                                                })
                                            }
                                        })

                                    })
                                    console.log("items to push", items);

                                    self.$refs.UserSelectorModalDynamic.open(
                                        "Please select a user to send to", items,
                                        cb => {
                                            callback(cb);
                                        })
                                }
                                if (r.data.length == 0 || r.data == null) {
                                    let items = []
                                    users.forEach(item => {
                                        items.push({
                                            text: item.firstname + " " + item.lastname,
                                            value: item.systemUserID
                                        })
                                    })
                                    self.$refs.UserSelectorModalDynamic.open(
                                        "Please select a user to send to", items,
                                        cb => {
                                            callback(cb);
                                        })
                                }
                                if (r.data.length == 1) {
                                    callback(r.data[0].userID_2);
                                }

                            })
                            .catch(e => {
                                console.log("approval ussesr catch", e);

                                callback(approvalUserID);
                            })
                    } else {
                        callback(approvalUserID);
                    }
                })

            },
            setDeclined(item) {
                let self = this
                let request = JSON.parse(JSON.stringify(item));
                let tmpUser = request.systemUserID;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API +
                        `ProjectTXGroupSingle?projectTXGroupID=${request.projectTXGroup_ID}`
                    )
                    .then(r => {
                        if (r.data.projectTX == null) {
                            alert("No user transaction")
                        }
                        self.$refs.NotesModal.show("Reason for decline", callback => {
                            self.checkTaskTakeover(request, () => {
                                request.status = 11;
                                request.actionedByUserID = tmpUser;
                                request.systemUserID = null;
                                request.notes = callback;
                                // Create complete transaction
                                self.createProjectTransaction(request,
                                    completeTransactionCloseTask => {
                                        let projectTXGroupRequest = {
                                            projectID: item.project_ID
                                        }
                                        // Create new project transaction group
                                        self.createProjectTransactionGroup(
                                            projectTXGroupRequest,
                                            newGroup => {
                                                request.projectTXGroup_ID = newGroup.id;
                                                request.systemUserID = r.data.projectTX
                                                    .systemUserID;
                                                request.actionedByUserID = null;
                                                request.notes = callback;
                                                // Create complete transaction for new group
                                                self.createProjectTransaction(request,
                                                    newGroupTransaction => {
                                                        self.$parent.$parent
                                                            .getTaskViewData();
                                                    })
                                            })
                                    })
                            })
                        })

                        delete Axios.defaults.headers.common["TenantID"];

                    })
            },
            updateStorePlanogramStatus(store_id, system_file_id, new_status, callback) {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.post(process.env.VUE_APP_API +
                        `Store_Planogram/Status?store_id=${store_id}&system_file_id=${system_file_id}&new_status=${new_status}`
                    )
                    .then(r => {
                        delete Axios.defaults.headers.common["TenantID"];
                        callback(r.data);
                    })
            },
            routeToView(item) {
                let self = this;
                let route;

                switch (item.type) {
                    case 1: {
                        route = `/DataPreparation`
                        self.$router.push(route);
                    }
                    break;
                case 2: {
                    route = `/RangePlanning/${item.rangeFileID}`
                    self.$router.push(route);
                }
                break;
                case 3: {
                    if (item.status == 1 || item.status == 8 || item.status == 41 || item.status == 46 || item.status ==
                        47 || item.status == 50 || item.status == 51) {
                        route = `/SpacePlanning`
                        self.$router.push(route);
                    } else if (item.status == 21 || item.status == 27) {
                        self.setCanDistribute(item.systemFileID, () => {
                            route = `/PlanogramDistribution/${item.project_ID}/${item.project_Group_ID}`
                            self.$router.push(route);
                        })
                    } else {
                        self.checkFileStatus(item.systemFileID, data => {
                            route =
                                `/PlanogramImplementation/${item.project_ID}/${item.systemFileID}/${item.status}`

                            // if (data.status == 1) {
                            //     alert("this planogram has been recalled, task will be removed");
                            // }

                            // if (data.status == 2) {
                            //     alert(
                            //         "A variation has been requested for this planogram, task will be removed"
                            //     );
                            // }

                            if (route != undefined)
                                self.$router.push(route);
                        })
                    }
                }
                break;
                }
            },
            setApproved(item) {
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
            getProjectUser() {
                let self = this;
            },
            routeToImplementation(item) {
                let self = this;
                self.$router.push(`/PlanogramImplementation/${item.project_ID}/${item.systemFileID}/${item.status}`)
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
                                                    self.createCheckPlanogramSubtask(request, () => {
                                                        self.$parent.$parent.getTaskViewData();
                                                    })
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

                    self.setCanDistribute(item.systemFileID, () => {
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
                                self.createProjectTransactionGroup(
                                    projectTXGroupRequest,
                                    newGroupTX => {
                                        // Create New Process Assigned for "New Group"
                                        request.systemUserID = modalData
                                            .systemUserID;
                                        request.actionedByUserID = null;
                                        request.projectTXGroup_ID = newGroupTX.id;
                                        request.notes = self.findAndReplaceNote(
                                            request.notes);
                                        self.createProjectTransaction(request,
                                            processStartProjectTX => {
                                                // Create Requesting Approval process for "New Group"
                                                request.status = 19;
                                                request.notes = self
                                                    .findAndReplaceNote(
                                                        modalData
                                                        .notes);
                                                self.createProjectTransaction(
                                                    request,
                                                    approvalTransaction => {
                                                        self.$parent.$parent
                                                            .getTaskViewData();
                                                    })
                                            })
                                    })
                            })
                        })
                    })
                })
            },
            createCheckPlanogramSubtask(request, callback) {
                let self = this;

                let projectTXGroupRequest = {
                    projectID: request.project_ID
                }

                self.createProjectTransactionGroup(projectTXGroupRequest, newGroupTX => {
                    request.rollingUserID = self.systemUserID;
                    request.projectTXGroup_ID = newGroupTX.id;
                    request.type = 6;
                    request.status = 37;
                    request.systemUserID = 4;

                    self.createProjectTransaction(request, newItem => {
                        callback();
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

                self.checkTaskTakeover(request, () => {
                    newRequest.systemUserID = tmpUser;

                    let projectTXGroupRequest = {
                        projectID: item.project_ID
                    }

                    item.removed = true;
                    Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                    Axios.put(process.env.VUE_APP_API + "ProjectTX?update=false", item).then(r => {

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
            setVariationComplete(item) {
                let self = this;

                let newItem = JSON.parse(JSON.stringify(item))

                self.$refs.NewTask.show(data => {
                    newItem.rangeFileID = data.rangeFile;
                    newItem.systemFileID = data.spacePlanFile;
                    newItem.store_ID = data.store;
                    newItem.storeCluster_ID = data.storeCluster;
                    newItem.categoryCluster_ID = data.categoryCluster;
                    newItem.customCluster_ID = data.customCluster;
                    newItem.status = 47;

                    self.createProjectTransaction(newItem, data => {
                        self.$parent.$parent.getTaskViewData();
                    })
                })
            },
            // setVariationComplete(item) {
            //     let self = this;

            //     let newItem = JSON.parse(JSON.stringify(item))

            //     self.$refs.SpacePlanSelector.show(spacePlanID => {
            //         self.$refs.RangeSelectorModal.show(rangePlanID => {

            //             let self = this;
            //             let request = JSON.parse(JSON.stringify(item))

            //             let tmpUser = request.systemUserID;

            //             self.checkTaskTakeover(request, () => {
            //                 request.systemUserID = tmpUser;
            //                 request.status = 47;
            //                 request.projectTXGroup_ID = item.projectTXGroup_ID
            //                 request.systemFileID = spacePlanID;
            //                 request.rangeFileID = rangePlanID;
            //                 self.createProjectTransaction(request, newItem => {
            //                     self.$parent.$parent.getTaskViewData();
            //                 })
            //             })
            //         })
            //     })
            // },
            setRecallInProgressandView(item) {
                let self = this;
                let request = JSON.parse(JSON.stringify(item))

                let tmpUser = request.systemUserID;

                self.checkTaskTakeover(request, () => {
                    request.systemUserID = tmpUser;
                    request.status = 50;
                    self.createProjectTransaction(request, newItem => {
                        self.routeToView(newItem)
                    })
                })
            },
            setRecalledComplete(item) {
                let self = this;

                let newItem = JSON.parse(JSON.stringify(item))

                self.$refs.SpacePlanSelector.show(spacePlanID => {
                    self.$refs.RangeSelectorModal.show(rangePlanID => {

                        let self = this;
                        let request = JSON.parse(JSON.stringify(item))

                        let tmpUser = request.systemUserID;

                        self.checkTaskTakeover(request, () => {
                            request.systemUserID = tmpUser;
                            request.status = 51;
                            request.systemFileID = spacePlanID;
                            request.rangeFileID = rangePlanID;
                            self.createProjectTransaction(request, newItem => {
                                self.$parent.$parent.getTaskViewData();
                            })
                        })
                    })
                })
            },
            sendRecall(item) {
                let self = this
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                Axios.post(process.env.VUE_APP_API +
                    `Variation_Order?projectTXID=${item.id}&systemFileID=${item.systemFileID}`).then(r => {
                    let request = JSON.parse(JSON.stringify(item))

                    let tmpUser = request.systemUserID;
                    self.checkTaskTakeover(request, () => {
                        request.systemUserID = tmpUser;
                        request.status = 52;
                        self.createProjectTransaction(request, newItem => {
                            self.$parent.$parent.getTaskViewData();

                        })
                    })
                    delete Axios.defaults.headers.common["TenantID"];
                })
            },
            sendVariation(item) {
                let self = this
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                Axios.post(process.env.VUE_APP_API +
                    `Variation_Order?projectTXID=${item.id}&systemFileID=${item.systemFileID}`).then(r => {
                    let request = JSON.parse(JSON.stringify(item))

                    let tmpUser = request.systemUserID;
                    self.checkTaskTakeover(request, () => {
                        request.systemUserID = tmpUser;
                        request.status = 48;

                        request.projectTXGroup_ID = item.projectTXGroup_ID
                        self.createProjectTransaction(request, newItem => {
                            // self.updateStorePlanogramStatus(request.store_ID, request
                            //     .systemFileID, 3, sp => {
                            //         self.routeToView(newItem)
                            //     })
                            self.$parent.$parent.getTaskViewData();

                        })
                    })
                    delete Axios.defaults.headers.common["TenantID"];
                })
            },
            setVariationInProgressandView(item) {
                let self = this;
                let request = JSON.parse(JSON.stringify(item))

                let tmpUser = request.systemUserID;

                self.checkTaskTakeover(request, () => {
                    request.systemUserID = tmpUser;
                    request.status = 46;

                    request.projectTXGroup_ID = item.projectTXGroup_ID
                    self.createProjectTransaction(request, newItem => {
                        self.routeToView(newItem)
                    })
                })
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
            sendDiscontinue(item) {
                let self = this;
                self.$refs.yesNoModal.show('Are you sure you want to Discontinue this Category?', value => {
                    if (value) {
                        let request = JSON.parse(JSON.stringify(item))
                        let tmpUser = 1;

                        self.checkTaskTakeover(request, () => {
                            request.systemUserID = tmpUser;
                            request.status = 45;
                            request.notes = "[DISCONTINUE REQUESTED]"
                            request.notes = self.findAndReplaceNote(request.notes);

                            self.createProjectTransaction(request, newItem => {
                                self.$parent.$parent.getTaskViewData();
                            })
                        })
                    }
                })

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
            },
            forward(currentItem) {
                let self = this;

                self.$refs.userSelector.show(user => {

                    let projectTXGroupRequest = {
                        projectID: currentItem.project_ID
                    }

                    self.createProjectTransactionGroup(projectTXGroupRequest, newProjectTX => {
                        currentItem.systemUserID = user.systemUserID;
                        currentItem.projectTXGroup_ID = newProjectTX.id;

                        Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                        Axios.put(process.env.VUE_APP_API + 'ProjectTX?update=false', currentItem).then(
                            res => {
                                delete Axios.defaults.headers.common["TenantID"];
                                self.$parent.$parent.getTaskViewData();
                            })
                    })
                })
            }
        }
    }

    function checkNull(prop) {
        if (prop == null) {
            return ""
        } else {
            return prop
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