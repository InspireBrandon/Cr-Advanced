<template>
    <v-container grid-list-md fluid>
        <v-progress-linear v-if="showLoader" :indeterminate="true">
        </v-progress-linear>
        <v-layout row wrap>
            <v-flex md12 v-if="!showLoader">
                <!-- start of tab if super user -->
                <v-card v-if="accessType == 0 || accessType == 2">
                    <v-tabs dark color="primary">
                        <v-tab>
                            My tasks
                        </v-tab>
                        <v-tab-item>
                            <v-card flat>
                                <v-toolbar flat dark>
                                    <v-toolbar-title>My Tasks</v-toolbar-title>
                                    <v-spacer></v-spacer>
                                    <v-spacer></v-spacer>
                                    <v-spacer></v-spacer>
                                    <v-autocomplete v-if="accessType == 0" label="Select User" @change="userChange"
                                        v-model="selectedUser" :items="users"></v-autocomplete>
                                </v-toolbar>
                                <v-data-table :items="projectTransactions" class="elevation-1 scrollable" hide-actions
                                    hide-headers>
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
                                            <!-- DATA PREPARATION -->
                                            <td style="width: 5%;">
                                                <v-btn small v-if="props.item.type == 1"></v-btn>
                                                <v-btn small v-if="props.item.type == 1"></v-btn>
                                                <v-btn small v-if="props.item.type == 1"></v-btn>
                                                <v-btn small v-if="props.item.type == 1"></v-btn>
                                            </td>
                                            <!-- END DATA PREPARATION -->
                                        </tr>
                                    </template>
                                </v-data-table>
                            </v-card>
                        </v-tab-item>
                        <v-tab>My Projects</v-tab>
                        <v-tab-item>
                            <v-card flat>
                                <v-toolbar flat dark>
                                    <v-toolbar-title>My Projects</v-toolbar-title>
                                    <v-spacer></v-spacer>
                                    <v-spacer></v-spacer>
                                    <v-spacer></v-spacer>
                                    <v-autocomplete v-if="systemUserID == 1" label="Select User" @change="userChange"
                                        v-model="selectedUser" :items="users"></v-autocomplete>
                                </v-toolbar>
                                <!-- {{status[projectTransactionsProjectTab[0].status].text}} -->
                                <v-data-table :items="projectTransactionsProjectTab" class="elevation-1 scrollable"
                                    hide-actions hide-headers>
                                    <template v-slot:items="props">
                                        <tr
                                            :style="{ backgroundColor: (props.item.subtask ==true  ? 'lightgrey' : 'transparent' )  }">
                                            <td>{{ props.item.planogram }}</td>
                                            <td>{{ typeList[props.item.type == -1 ? 5 : props.item.type].text }}</td>
                                            <td>
                                                {{ status[props.item.status == -1 ? 18 : props.item.status].text }}
                                            </td>
                                            <td>{{ props.item.storeCluster }}</td>
                                            <td>{{ props.item.categoryCluster }}</td>
                                            <td>{{ props.item.store }}</td>
                                            <td>{{ props.item.dateTimeString }}</td>
                                            <td style="width: 2%">
                                                <v-btn
                                                    @click="$router.push('/PlanogramImplementation/' + props.item.project_ID + '/' + props.item.systemFileID+'/' + props.item.status)"
                                                    small color="primary" v-if="props.item.type == 3">View</v-btn>
                                            </td>
                                        </tr>
                                    </template>
                                </v-data-table>
                            </v-card>
                        </v-tab-item>
                    </v-tabs>
                </v-card>

                <!-- card start of view without super user -->
                <v-card v-if="accessType == 1 || accessType == 3">
                    <v-toolbar flat dark>
                        <v-toolbar-title>My Tasks</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-spacer></v-spacer>
                        <v-spacer></v-spacer>
                        <v-autocomplete v-if="accessType == 0" label="Select User" @change="userChange"
                            v-model="selectedUser" :items="users"></v-autocomplete>
                    </v-toolbar>
                    <v-data-table :items="projectTransactions" class="elevation-1 scrollable" hide-actions hide-headers>
                        <template v-slot:items="props">
                            <tr
                                :style="{ backgroundColor: (props.item.subtask == true  ? 'lightgrey' : 'transparent' )}">
                                <td>{{ props.item.planogram }}</td>
                                <td>{{ typeList[props.item.type == -1 ? 5 : props.item.type].text }}</td>
                                <td>{{ status[props.item.status == -1 ? 18 : props.item.status].text }}</td>
                                <td>{{ props.item.storeCluster }}</td>
                                <td>{{ props.item.categoryCluster }}< /td> <td>{{ props.item.store }}</td>
                                <td>{{ props.item.dateTimeString }}</td>
                                <td style="width: 5%;">
                                    <v-btn small></v-btn>
                                </td>
                            </tr>
                        </template>
                    </v-data-table>
                </v-card>
            </v-flex>
        </v-layout>
        <UserSelector ref="userSelector" />
        <AssignTask ref="assignTask" />
        <SubtaskModal ref="SubtaskModal" />
        <SpacePlanSelector ref="SpacePlanSelector"></SpacePlanSelector>
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

    export default {
        name: 'tasks',
        components: {
            UserSelector,
            AssignTask,
            SubtaskModal,
            SpacePlanSelector
        },
        data() {
            return {
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
            self.getLists(callback => {
                setTimeout(() => {
                    let tenantID = sessionStorage.currentDatabase;

                    let encoded_details = jwt.decode(sessionStorage.accessToken);
                    let systemUserID = encoded_details.USER_ID;

                    self.getUserAccess(systemUserID, tenantID, () => {
                        self.systemUserID = systemUserID;
                        self.getTransactionsByUser(systemUserID)
                        self.getUsers(callback => {
                            self.showLoader = false
                        })
                    })
                }, 1000)
            })

        },
        methods: {
            SubmitForApproval(item) {
                let self = this

                let encoded_details = jwt.decode(sessionStorage.accessToken);
                let systemUserID = encoded_details.USER_ID;

                self.$refs.SubtaskModal.show("Submit for Approval", user => {
                    Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                    let trans = JSON.parse(JSON.stringify(item));

                    trans.status = 10;
                    trans.notes = user.notes;
                    trans.actionedByUserID = systemUserID
                    trans.systemUserID = null;

                    Axios.post(process.env.VUE_APP_API + 'ProjectTX', trans).then(
                        res => {

                            trans.systemUserID = user.systemUserID;
                            trans.actionedByUserID = null
                            Axios.post(process.env.VUE_APP_API + 'ProjectTX', trans).then(
                                r => {
                                    delete Axios.defaults.headers.common["TenantID"];
                                    self.getTransactionsByUser(self.systemUserID)
                                })
                        })
                })

            },
            getUserAccess(systemUserID, tenantID, callback) {
                let self = this;

                Axios.get(process.env.VUE_APP_API +
                        `TenantLink_AccessType?systemUserID=${systemUserID}&tenantID=${tenantID}`)
                    .then(r => {

                        if (r.data.isDatabaseOwner) {
                            self.accessType = 0
                        } else {
                            self.accessType = r.data.tenantLink_AccessTypeList[0].accessType;
                            self.getProjectTabTransactionsByUser(systemUserID);
                        }

                        if (self.accessType == 0 || self.accessType == 2) {
                            self.getSuperUserProjectTransactions(systemUserID)
                        }

                        callback();
                    })

            },
            ChangeWaitingcomplete(item, index, type) {
                let self = this
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                let trans = JSON.parse(JSON.stringify(item));
                trans.status = type;
                trans.notes = null;
                Axios.post(process.env.VUE_APP_API + 'ProjectTX', trans).then(
                    res => {
                        item.status = type
                        // self.projectTransactions.splice(index, 1);

                        Axios.get(process.env.VUE_APP_API +
                                `ProjectTXSingle?projectTXID=${item.transactionRolloverID}`)
                            .then(rolloverItemResponse => {
                                let projectTX = rolloverItemResponse.data.projectTX;

                                setTimeout(() => {
                                    Axios.post(process.env.VUE_APP_API + 'ProjectTX', projectTX).then(
                                        rolledOverResponse => {
                                            console.log(rolledOverResponse.data)
                                            self.getTransactionsByUser(self.systemUserID)
                                            delete Axios.defaults.headers.common["TenantID"];
                                        })
                                }, 200);
                            })
                    })
            },
            forceRollover(item) {
                let self = this
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                self.$nextTick(() => {
                    Axios.get(process.env.VUE_APP_API +
                            `ProjectTXSingle?projectTXID=${item.transactionRolloverID}`)
                        .then(rolloverItemResponse => {
                            let projectTX = rolloverItemResponse.data.projectTX;

                            setTimeout(() => {
                                Axios.post(process.env.VUE_APP_API + 'ProjectTX', projectTX).then(
                                    rolledOverResponse => {
                                        self.getTransactionsByUser(self.systemUserID)
                                        delete Axios.defaults.headers.common["TenantID"];
                                    })
                            }, 200);
                        })
                })
            },
            ChangeWaitingStart(item, index, type) {
                let self = this
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                let trans = JSON.parse(JSON.stringify(item));
                trans.status = type;
                trans.notes = null;
                Axios.post(process.env.VUE_APP_API + 'ProjectTX', trans).then(
                    res => {
                        item.status = type
                        self.getTransactionsByUser(self.systemUserID)
                        delete Axios.defaults.headers.common["TenantID"];
                    })
            },
            ChangeWaitingType(item, index, type, title) {
                let self = this

                let encoded_details = jwt.decode(sessionStorage.accessToken);
                let systemUserID = encoded_details.USER_ID;

                self.$refs.SubtaskModal.show(title, user => {
                    Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                    let trans = JSON.parse(JSON.stringify(item));

                    trans.subtask = true;
                    trans.status = type;
                    trans.notes = user.notes;
                    trans.actionedByUserID = systemUserID
                    trans.actionedByUserID = self.systemUserID;
                    trans.systemUserID = null;
                    trans.transactionRolloverID = item.id;
                    trans.systemFileID = item.systemFileID;

                    Axios.post(process.env.VUE_APP_API + 'ProjectTX', trans).then(
                        res => {
                            trans.actionedByUserID = null;
                            trans.systemUserID = user.systemUserID;

                            Axios.post(process.env.VUE_APP_API + 'ProjectTX', trans)
                                .then(r => {
                                    delete Axios.defaults.headers.common["TenantID"];
                                    self.getTransactionsByUser(self.systemUserID)
                                })
                        })
                })

            },
            getLists(callback) {
                let self = this
                let statusHandler = new StatusHandler()
                self.status = statusHandler.getStatus()
                self.typeList = statusHandler.getTypeList()
                console.log(self.status);
                callback()

            },
            getProjectTabTransactionsByUser(systemUserID) {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + `SupplierUserProjectTX?userID=${systemUserID}`)

                    .then(r => {
                        console.log(r.data);

                        self.projectTransactionsProjectTab = r.data.projectTXList;
                        delete Axios.defaults.headers.common["TenantID"];
                    })
                    .catch(e => {
                        delete Axios.defaults.headers.common["TenantID"];
                    })
            },
            getSuperUserProjectTransactions(systemUserID) {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + `SuperUserProjectTX?userID=${systemUserID}`)
                    .then(r => {
                        self.projectTransactionsProjectTab = r.data.projectTXList;
                        delete Axios.defaults.headers.common["TenantID"];
                    })
                    .catch(e => {
                        delete Axios.defaults.headers.common["TenantID"];
                    })
            },
            getTransactionsByUser(systemUserID) {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + `UserProjectTX?userID=${systemUserID}`).then(r => {
                        self.projectTransactions = r.data.projectTXList;
                        delete Axios.defaults.headers.common["TenantID"];
                    })
                    .catch(e => {
                        console.error(e);
                        delete Axios.defaults.headers.common["TenantID"];

                    })
            },
            setInProgress(item) {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                let trans = JSON.parse(JSON.stringify(item));
                trans.status = 1;
                trans.notes = null;

                Axios.post(process.env.VUE_APP_API + 'ProjectTX', trans).then(
                    res => {
                        item.status = 1;
                        self.getTransactionsByUser(self.systemUserID)
                        delete Axios.defaults.headers.common["TenantID"];
                    })
            },
            setComplete(item, index) {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                let trans = JSON.parse(JSON.stringify(item));
                trans.status = 2;
                trans.notes = null;
                trans.systemUserID = null;
                trans.actionedByUserID = self.systemUserID;

                Axios.post(process.env.VUE_APP_API + 'ProjectTX', trans).then(
                    res => {
                        item.status = 2;
                        self.getTransactionsByUser(self.systemUserID)
                        trans.systemUserID = item.projectOwnerID;
                        trans.actionedByUserID = null
                        Axios.post(process.env.VUE_APP_API + 'ProjectTX', trans).then(
                            r => {
                                item.status = 2;
                                self.getTransactionsByUser(self.systemUserID)

                            })
                        delete Axios.defaults.headers.common["TenantID"];
                    })

            },
            setPlanogramComplete(item, index) {
                let self = this;

                self.$refs.SpacePlanSelector.show(spacePlanID => {

                    Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                    let trans = JSON.parse(JSON.stringify(item));
                    trans.status = 2;
                    trans.notes = null;
                    trans.systemUserID = null;
                    trans.actionedByUserID = self.systemUserID;
                    trans.systemFileID = spacePlanID;

                    Axios.post(process.env.VUE_APP_API + 'ProjectTX', trans).then(
                        res => {
                            item.status = 2;
                            self.getTransactionsByUser(self.systemUserID)
                            trans.systemUserID = item.projectOwnerID;
                            trans.actionedByUserID = null
                            Axios.post(process.env.VUE_APP_API + 'ProjectTX', trans).then(
                                r => {
                                    item.status = 2;
                                    self.getTransactionsByUser(self.systemUserID)

                                })

                            delete Axios.defaults.headers.common["TenantID"];
                        })
                })
            },
            setPlanogramApprovalInProgress(item, index) {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                let trans = JSON.parse(JSON.stringify(item));
                trans.status = 20;
                trans.notes = null;

                Axios.post(process.env.VUE_APP_API + 'ProjectTX', trans).then(
                    res => {
                        item.status = 20;
                        self.getTransactionsByUser(self.systemUserID)
                        delete Axios.defaults.headers.common["TenantID"];
                    })
            },
            sendForDistribution(item, index) {
                let self = this;
                let encoded_details = jwt.decode(sessionStorage.accessToken);
                let systemUserID = encoded_details.USER_ID;
                self.$refs.userSelector.show(user => {
                    Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                    let trans = JSON.parse(JSON.stringify(item));
                    trans.status = 19;
                    trans.notes = null;
                    trans.systemUserID = null;
                    trans.actionedByUserID = self.systemUserID;

                    Axios.post(process.env.VUE_APP_API + 'ProjectTX', trans).then(
                        res => {
                            trans.actionedByUserID = null;
                            trans.systemUserID = user.systemUserID;
                            Axios.post(process.env.VUE_APP_API + 'ProjectTX', trans).then(
                                res => {
                                    self.getTransactionsByUser(self.systemUserID)
                                    delete Axios.defaults.headers.common["TenantID"];
                                })
                        })
                })
            },
            startDistributionProgress(item) {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                let trans = JSON.parse(JSON.stringify(item));
                trans.status = 21;
                trans.notes = null;

                Axios.post(process.env.VUE_APP_API + 'ProjectTX', trans).then(
                    res => {
                        delete Axios.defaults.headers.common["TenantID"];
                        self.$router.push("/PlanogramImplementation/" + item.project_ID + "/" + item.systemFileID +
                            "/" + 21);
                    })
            },
            completeDistribution(item, index) {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                let trans = JSON.parse(JSON.stringify(item));
                trans.status = 21;
                trans.notes = null;

                Axios.post(process.env.VUE_APP_API + 'ProjectTX', trans).then(
                    res => {
                        delete Axios.defaults.headers.common["TenantID"];
                        self.$router.push("/PlanogramImplementation/" + item.project_ID + "/" + item.systemFileID +
                            "/" + 21);
                    })
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
                    // assignedToRequest.notes = data.notes;
                    assignedToRequest.status = 40;

                    Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                    task.type = data.type;

                    Axios.post(process.env.VUE_APP_API + 'ProjectTX', assignedToRequest).then(res1 => {
                        task.status = 5 + data.type;
                        task.systemUserID = data.systemUserID;
                        task.notes = data.notes;
                        task.storeCluster_ID = data.storeCluster;
                        task.categoryCluster_ID = data.categoryCluster;
                        task.store_ID = data.store;
                        task.systemFileID = data.systemFile;
                        task.actionedByUserID = null;
                        Axios.post(process.env.VUE_APP_API + 'ProjectTX', task).then(res2 => {
                            delete Axios.defaults.headers.common["TenantID"];
                            self.getTransactionsByUser(self.systemUserID)
                        })
                    })
                })
            },
            getUsers(callback) {
                let self = this;

                let accountID = jwt.decode(sessionStorage.accessToken).ACCOUNT_ID;

                Axios.get(process.env.VUE_APP_API + `SystemUser`)
                    .then(r => {
                        for (var i = 0; i < r.data.length; i++) {
                            let item = r.data[i];
                            self.users.push({
                                text: item.firstname + " " + item.lastname,
                                value: item.systemUserID
                            });
                        }

                        self.selectedUser = self.systemUserID;
                        callback()
                    })
                    .catch(e => {
                        callback()
                    })
            },
            userChange() {
                let self = this;

                self.$nextTick(() => {
                    self.getTransactionsByUser(self.selectedUser);
                })
            },
            startImplementation(item) {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                let trans = JSON.parse(JSON.stringify(item));
                trans.status = 24;
                trans.notes = null;
                trans.actionedByUserID = null;

                Axios.post(process.env.VUE_APP_API + 'ProjectTX', trans).then(
                    res => {
                        delete Axios.defaults.headers.common["TenantID"];
                        self.$router.push("/PlanogramImplementation/" + item.project_ID + "/" + item.systemFileID +
                            "/" + 24);
                    })
            },
            RemoveTransaction(item, index) {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                let trans = JSON.parse(JSON.stringify(item));
                trans.removed = true;

                Axios.put(process.env.VUE_APP_API + 'ProjectTX', trans).then(
                    res => {
                        delete Axios.defaults.headers.common["TenantID"];
                        self.projectTransactions.splice(index, 1);
                    })
            }
        }
    }
</script>

<style scoped>
    .scrollable {
        height: calc(100vh - 240px);
        overflow: auto;
    }
</style>