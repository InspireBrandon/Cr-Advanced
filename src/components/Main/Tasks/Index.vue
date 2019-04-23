<template>
    <v-container grid-list-md fluid>
        <v-layout row wrap>
            <v-flex md12>
                <v-card>
                    <v-toolbar flat dark>
                        <v-toolbar-title>My Tasks</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-spacer></v-spacer>
                        <v-spacer></v-spacer>
                        <v-autocomplete v-if="systemUserID == 1" label="Select User" @change="userChange" v-model="selectedUser" :items="users"></v-autocomplete>
                    </v-toolbar>
                    <v-data-table :items="projectTransactions" class="elevation-1 scrollable" hide-actions hide-headers>
                        <template v-slot:items="props">
                            <td>{{ props.item.planogram }}</td>
                            <td>{{ typeList[props.item.type == -1 ? 5 : props.item.type].text }}</td>
                            <td>{{ status[props.item.status == -1 ? 18 : props.item.status].text }}</td>
                            <td>{{ props.item.storeCluster }}</td>
                            <td>{{ props.item.categoryCluster }}</td>
                            <td>{{ props.item.store }}</td>
                            <td>{{ props.item.dateTimeString }}</td>
                            <td style="width: 5%;">
                                <v-btn small color="primary" @click="$router.push('/PlanogramImplementation')"
                                    v-if="props.item.status == 40">
                                    <span>Progress</span>
                                </v-btn>
                                <!-- Product -->
                                <v-btn small color="success" @click="setInProgress(props.item)"
                                    v-if="props.item.type == 1 && props.item.status == 6 && systemUserID == props.item.systemUserID">
                                    <span>Start</span>
                                </v-btn>
                                <v-btn flat color="error" @click="$router.push('/PlanogramImplementation')"
                                    v-if="props.item.type == 1 && props.item.status == 6 && systemUserID == props.item.actionedByUserID">
                                    <span>View</span>
                                </v-btn>
                                <v-btn small :color="props.item.status == 1 ? 'error': 'primary'" @click="$router.push('/DataPreparation/ProductCatalogue')"
                                    v-if="props.item.type == 1 && (props.item.status == 1 || props.item.status == 2)">
                                    <span>View</span>
                                </v-btn>
                                <v-btn small color="warning"
                                    v-if="props.item.type == 1 && props.item.status == 1 && systemUserID == props.item.systemUserID"
                                    @click="setComplete(props.item, props.index)">
                                    <span>Complete</span>
                                </v-btn>
                                <!-- Ranging -->
                                <v-btn small color="success" @click="setInProgress(props.item)"
                                    v-if="props.item.type == 2 && props.item.status == 7 && systemUserID == props.item.systemUserID">
                                    <span>Start</span>
                                </v-btn>
                                <v-btn flat color="error" @click="$router.push('/PlanogramImplementation')"
                                    v-if="props.item.type == 2 && props.item.status == 7 && systemUserID == props.item.actionedByUserID">
                                    <span>View</span>
                                </v-btn>
                                <v-btn small :color="props.item.status == 1 ? 'error': 'primary'" @click="$router.push('/RangePlanning')"
                                    v-if="props.item.type == 2 && (props.item.status == 1 || props.item.status == 2)">
                                    <span>View</span>
                                </v-btn>
                                <v-btn small color="warning"
                                    v-if="props.item.type == 2 && props.item.status == 1 && systemUserID == props.item.systemUserID"
                                    @click="setComplete(props.item, props.index)">
                                    <span>Complete</span>
                                </v-btn>
                                <!-- Planogram -->
                                <v-btn small color="success" @click="setInProgress(props.item)"
                                    v-if="props.item.type == 3 && props.item.status == 8 && systemUserID == props.item.systemUserID">
                                    <span>Start</span>
                                </v-btn>
                                <v-btn flat color="error" @click="$router.push('/SpacePlanning')"
                                    v-if="props.item.type == 3 && props.item.status == 8 && systemUserID == props.item.actionedByUserID">
                                    <span>View</span>
                                </v-btn>
                                <v-btn small :color="props.item.status == 1 ? 'error': 'primary'" @click="$router.push('/SpacePlanning')"
                                    v-if="props.item.type == 3 && (props.item.status == 1 || props.item.status == 2)">
                                    <span>View</span>
                                </v-btn>
                                <v-btn small color="warning"
                                    v-if="props.item.type == 3 && props.item.status == 1 && systemUserID == props.item.systemUserID"
                                    @click="setComplete(props.item, props.index)">
                                    <span>Complete</span>
                                </v-btn>
                                <!-- Approval -->
                                <v-btn small color="success" v-if="props.item.type == 3 && props.item.status == 10"
                                    @click="setPlanogramApprovalInProgress(props.item)">
                                    <span>Start</span>
                                </v-btn>
                                <v-btn small color="primary" v-if="props.item.type == 3 && props.item.status == 20"
                                    @click="$router.push('/PlanogramImplementation')">
                                    <span>View</span>
                                </v-btn>
                                <v-btn small color="error"
                                    v-if="props.item.type == 3 && props.item.status == 12 && systemUserID == props.item.projectOwnerID"
                                    @click="sendForDistribution(props.item, props.index)">
                                    <span>Send</span>
                                </v-btn>
                                <v-btn small color="primary"
                                    v-if="props.item.type == 3 && props.item.status == 12 && systemUserID == props.item.actionedByUserID"
                                    @click="$router.push('/PlanogramImplementation')">
                                    <span>View</span>
                                </v-btn>
                                <v-btn small color="primary" v-if="props.item.type == 3 && props.item.status == 19"
                                    @click="startDistributionProgress(props.item, props.index)">
                                    <span>View</span>
                                </v-btn>
                                <v-btn small color="primary" v-if="props.item.type == 3 && props.item.status == 21"
                                    @click="$router.push('/PlanogramImplementation')">
                                    <span>View</span>
                                </v-btn>
                                <v-btn small color="warning" v-if="props.item.type == 3 && props.item.status == 21"
                                    @click="completeDistribution(props.item, props.index)">
                                    <span>Complete</span>
                                </v-btn>
                                <v-btn small color="success" v-if="props.item.status == 28"
                                    @click="ChangeWaitingStart(props.item, props.index,29)">
                                    <span>Start</span>
                                </v-btn>
                                <v-btn small color="warning" v-if="props.item.status == 29"
                                    @click="ChangeWaitingcomplete(props.item, props.index,30)">
                                    <span>Complete</span>
                                </v-btn>
                                <v-btn small color="success" v-if="props.item.status == 31"
                                    @click="ChangeWaitingStart(props.item, props.index,32)">
                                    <span>Start</span>
                                </v-btn>
                                <v-btn small color="warning" v-if="props.item.status == 32"
                                    @click="ChangeWaitingcomplete(props.item, props.index,33)">
                                    <span>Complete</span>
                                </v-btn>
                                <v-btn small color="success" v-if="props.item.status == 34"
                                    @click="ChangeWaitingStart(props.item, props.index,35)">
                                    <span>Start</span>
                                </v-btn>
                                <v-btn small color="warning" v-if="props.item.status == 35"
                                    @click="ChangeWaitingcomplete(props.item, props.index,36)">
                                    <span>Complete</span>
                                </v-btn>
                                <v-btn small color="success" v-if="props.item.status == 37"
                                    @click="ChangeWaitingStart(props.item, props.index,38)">
                                    <span>Start</span>
                                </v-btn>
                                <v-btn small color="warning" v-if="props.item.status == 38"
                                    @click="ChangeWaitingcomplete(props.item, props.index,39)">
                                    <span>Complete</span>
                                </v-btn>
                            </td>
                            <td style="width: 5%;">
                                <v-menu left>
                                    <v-btn icon slot="activator">
                                        <v-icon>more_vert</v-icon>
                                    </v-btn>
                                    <v-list dense class="pa-0 ma-0">

                                        <v-list-tile @click="assignTask(props.item)">
                                            <span>Assign</span>
                                        </v-list-tile>

                                        <v-divider></v-divider>
                                        <!--Waiting Product Info  -->
                                        <v-list-tile
                                            @click="ChangeWaitingType(props.item, props.index,28)">
                                            <span>Request Product Info</span>
                                        </v-list-tile>

                                        <v-divider>
                                        </v-divider>
                                        <!-- Waiting Planogram Input -->
                                        <v-list-tile
                                            @click="ChangeWaitingType(props.item, props.index,31)">
                                            <span>Request Planogram Input</span>
                                        </v-list-tile>

                                        <v-divider>
                                        </v-divider>
                                        <!-- Waiting Fixture Input -->
                                        <v-list-tile
                                            @click="ChangeWaitingType(props.item, props.index,34)">
                                            <span>Request Fixture Input</span>
                                        </v-list-tile>

                                        <v-divider>
                                        </v-divider>
                                        <!-- Waiting Check Planogram -->
                                        <v-list-tile
                                            @click="ChangeWaitingType(props.item, props.index,37)">
                                            <span>Request Planogram Check</span>
                                        </v-list-tile>
                                    </v-list>
                                </v-menu>
                            </td>
                            <td style="width: 2%">
                                <v-tooltip bottom v-if="props.item.subtask">
                                    <template v-slot:activator="{ on }">
                                        <v-btn @click="acknowledgeOutstandingRequest" icon v-on="on">
                                            <v-icon v-on="on">check</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>request outstanding</span>
                                </v-tooltip>
                            </td>
                            <td style="width: 2%">
                                <v-tooltip bottom v-if="props.item.notes != null">
                                    <template v-slot:activator="{ on }">
                                        <v-icon v-on="on">note</v-icon>
                                    </template>
                                    <span>{{ props.item.notes }}</span>
                                </v-tooltip>
                            </td>
                        </template>
                    </v-data-table>
                </v-card>
            </v-flex>
        </v-layout>
        <UserSelector ref="userSelector" />
        <AssignTask ref="assignTask" />
    </v-container>
</template>

<script>
    import Axios from 'axios';
    import jwt from 'jsonwebtoken';
    import UserSelector from '@/components/Common/UserSelector'
    import AssignTask from '@/components/Common/AssignTask'
    import StatusHandler from '@/libs/system/projectStatusHandler'

    export default {
        name: 'tasks',
        components: {
            UserSelector,
            AssignTask
        },
        data() {
            return {
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

            let encoded_details = jwt.decode(sessionStorage.accessToken);
            let systemUserID = encoded_details.USER_ID;
            self.systemUserID = systemUserID;

            self.getTransactionsByUser(systemUserID)
            self.getUsers()
            self.getLists()
        },
        methods: {
            ChangeWaitingcomplete(item, index, type) {
                let self = this
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                let trans = JSON.parse(JSON.stringify(item));
                trans.status = type;
                trans.systemUserID = item.projectOwnerID;
                Axios.post(process.env.VUE_APP_API + 'ProjectTX', trans).then(
                    res => {
                        item.status = type
                        self.projectTransactions.splice(index, 1);
                        delete Axios.defaults.headers.common["TenantID"];
                    })
            },
            ChangeWaitingStart(item, index, type) {
                let self = this
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                let trans = JSON.parse(JSON.stringify(item));
                trans.status = type;
                Axios.post(process.env.VUE_APP_API + 'ProjectTX', trans).then(
                    res => {
                        item.status = type
                        delete Axios.defaults.headers.common["TenantID"];
                    })
            },
            ChangeWaitingType(item, index, type) {
                let self = this

                self.$refs.userSelector.show(user => {
                    Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                    let trans = JSON.parse(JSON.stringify(item));

                    trans.subtask = true;

                    Axios.put(process.env.VUE_APP_API + 'ProjectTX', trans)
                        .then(r => {
                            trans.status = type;
                            trans.systemUserID = user.systemUserID;
                            trans.subtask = false;
                            console.log(r);
                            Axios.post(process.env.VUE_APP_API + 'ProjectTX', trans).then(
                                res => {
                                    console.log(res);
                                    delete Axios.defaults.headers.common["TenantID"];
                                    self.getTransactionsByUser()
                                })
                        })
                })

            },
            getLists() {
                let self = this
                let statusHandler = new StatusHandler()
                self.status = statusHandler.getStatus()
                self.typeList = statusHandler.getTypeList()

            },
            getTransactionsByUser(systemUserID) {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + `UserProjectTX?userID=${systemUserID}`).then(r => {
                        self.projectTransactions = r.data.projectTXList;
                        console.log(self.projectTransactions);

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

                Axios.post(process.env.VUE_APP_API + 'ProjectTX', trans).then(
                    res => {
                        item.status = 1;
                        delete Axios.defaults.headers.common["TenantID"];
                    })
            },
            setComplete(item, index) {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                let trans = JSON.parse(JSON.stringify(item));
                trans.status = 2;
                trans.systemUserID = item.projectOwnerID;
                trans.actionedByUserID = item.systemUserID;

                Axios.post(process.env.VUE_APP_API + 'ProjectTX', trans).then(
                    res => {
                        item.status = 2;
                        delete Axios.defaults.headers.common["TenantID"];
                    })
            },
            setPlanogramApprovalInProgress(item) {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                let trans = JSON.parse(JSON.stringify(item));
                trans.status = 20;

                Axios.post(process.env.VUE_APP_API + 'ProjectTX', trans).then(
                    res => {
                        item.status = 20;
                        delete Axios.defaults.headers.common["TenantID"];
                    })
            },
            sendForDistribution(item, index) {
                let self = this;

                self.$refs.userSelector.show(user => {
                    Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                    let trans = JSON.parse(JSON.stringify(item));
                    trans.status = 19;
                    trans.systemUserID = user.systemUserID;

                    Axios.post(process.env.VUE_APP_API + 'ProjectTX', trans).then(
                        res => {
                            self.projectTransactions.splice(index, 1);
                            delete Axios.defaults.headers.common["TenantID"];
                        })
                })
            },
            startDistributionProgress(item) {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                let trans = JSON.parse(JSON.stringify(item));
                trans.status = 21;

                Axios.post(process.env.VUE_APP_API + 'ProjectTX', trans).then(
                    res => {
                        delete Axios.defaults.headers.common["TenantID"];
                        self.$router.push("/PlanogramImplementation");
                    })
            },
            completeDistribution(item, index) {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                let trans = JSON.parse(JSON.stringify(item));
                trans.status = 21;

                Axios.post(process.env.VUE_APP_API + 'ProjectTX', trans).then(
                    res => {
                        delete Axios.defaults.headers.common["TenantID"];
                        self.$router.push("/PlanogramImplementation");
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
                    assignedToRequest.notes = data.notes;
                    assignedToRequest.status = 40;

                    Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                    Axios.post(process.env.VUE_APP_API + 'ProjectTX', assignedToRequest).then(res1 => {
                        task.type = data.type;
                        task.status = 5 + data.type;
                        task.systemUserID = data.systemUserID;
                        task.notes = data.notes;
                        task.actionedByUserID = null;
                        Axios.post(process.env.VUE_APP_API + 'ProjectTX', task).then(res2 => {
                            delete Axios.defaults.headers.common["TenantID"];
                            self.getTransactionsByUser()
                        })
                    })
                })
            },
            acknowledgeOutstandingRequest() {

            },
            getUsers() {
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
                    })
                    .catch(e => {

                    })
            },
            userChange() {
                let self = this;

                self.$nextTick(() => {
                    self.getTransactionsByUser(self.selectedUser);
                })
            }
        }
    }
</script>

<style scoped>
    .scrollable {
        height: calc(100vh - 200px);
        overflow: auto;
    }
</style>