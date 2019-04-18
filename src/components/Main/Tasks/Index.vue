<template>
    <v-container grid-list-md fluid>
        <v-layout row wrap>
            <v-flex md12>
                <v-card>
                    <v-toolbar flat dark>
                        <v-toolbar-title>My Tasks</v-toolbar-title>
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
                                <v-btn small color="primary" @click="setRangingInProgress(props.item)"
                                    v-if="props.item.type == 2 && props.item.status == 7">
                                    <span>Start</span>
                                </v-btn>
                                <v-btn small color="primary" @click="$router.push('/RangePlanning')"
                                    v-if="props.item.type == 2 && props.item.status == 1">
                                    <span>View</span>
                                </v-btn>
                                <v-btn small color="primary" v-if="props.item.type == 2 && props.item.status == 1"
                                    @click="setRangingComplete(props.item, props.index)">
                                    <span>Complete</span>
                                </v-btn>
                                <v-btn small color="primary" v-if="props.item.type == 3 && props.item.status == 10"
                                    @click="setPlanogramApprovalInProgress(props.item)">
                                    <span>Start</span>
                                </v-btn>
                                <v-btn small color="primary" v-if="props.item.type == 3 && props.item.status == 20"
                                    @click="$router.push('/PlanogramImplementation')">
                                    <span>View</span>
                                </v-btn>
                                <v-btn small color="primary"
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
                                <v-btn small color="primary" v-if="props.item.type == 3 && props.item.status == 21"
                                    @click="completeDistribution(props.item, props.index)">
                                    <span>Complete</span>
                                </v-btn>
                                <v-btn small color="primary" v-if="props.item.status == 28"
                                    @click="ChangeWaitingStart(props.item, props.index,29)">
                                    <span>Start</span>
                                </v-btn>
                                <v-btn small color="primary" v-if="props.item.status == 29"
                                    @click="ChangeWaitingcomplete(props.item, props.index,30)">
                                    <span>Complete</span>
                                </v-btn>
                                <v-btn small color="primary" v-if="props.item.status == 31"
                                    @click="ChangeWaitingStart(props.item, props.index,32)">
                                    <span>Start</span>
                                </v-btn>
                                <v-btn small color="primary" v-if="props.item.status == 32"
                                    @click="ChangeWaitingcomplete(props.item, props.index,33)">
                                    <span>Complete</span>
                                </v-btn>
                                <v-btn small color="primary" v-if="props.item.status == 34"
                                    @click="ChangeWaitingStart(props.item, props.index,35)">
                                    <span>Start</span>
                                </v-btn>
                                <v-btn small color="primary" v-if="props.item.status == 35"
                                    @click="ChangeWaitingcomplete(props.item, props.index,36)">
                                    <span>Complete</span>
                                </v-btn>
                                <v-btn small color="primary" v-if="props.item.status == 37"
                                    @click="ChangeWaitingStart(props.item, props.index,38)">
                                    <span>Start</span>
                                </v-btn>
                                <v-btn small color="primary" v-if="props.item.status == 38"
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
                                        <!-- <v-list-tile>
                                            <span>Launch</span>
                                        </v-list-tile> -->
                                        <v-divider></v-divider>
                                        <!--Waiting Product Info  -->
                                        <v-list-tile
                                            v-if="(props.item.type == 3 ||props.item.type == 1) &&(props.item.status!=28&&props.item.status!=29)"
                                            @click="ChangeWaitingType(props.item, props.index,28)">
                                            <span>Request Product Info</span>
                                        </v-list-tile>

                                        <v-divider></v-divider>
                                        <!-- Waiting Planogram Input -->
                                        <v-list-tile
                                            v-if="(props.item.type == 3 ) &&(props.item.status!=31&&props.item.status!=32)"
                                            @click="ChangeWaitingType(props.item, props.index,31)">
                                            <span>Request Planogram Input</span>
                                        </v-list-tile>

                                        <v-divider></v-divider>
                                        <!-- Waiting Fixture Input -->
                                        <v-list-tile
                                            v-if="props.item.type == 3&&(props.item.status!=34&&props.item.status!=35)"
                                            @click="ChangeWaitingType(props.item, props.index,34)">
                                            <span>Request Fixture Input</span>
                                        </v-list-tile>

                                        <v-divider></v-divider>
                                        <!-- Waiting Check Planogram -->
                                        <v-list-tile
                                            v-if="props.item.type == 3 &&(props.item.status!=37&&props.item.status!=38)"
                                            @click="ChangeWaitingType(props.item, props.index,37)">
                                            <span>Request Planogram Check</span>
                                        </v-list-tile>

                                        <v-divider></v-divider>
                                    </v-list>
                                </v-menu>
                            </td>
                        </template>
                    </v-data-table>
                </v-card>
            </v-flex>
        </v-layout>
        <UserSelector ref="userSelector" />
    </v-container>
</template>

<script>
    import Axios from 'axios';
    import jwt from 'jsonwebtoken';
    import UserSelector from '@/components/Common/UserSelector'
    import StatusHandler from '@/libs/system/projectStatusHandler'


    export default {
        name: 'tasks',
        components: {
            UserSelector
        },
        data() {
            return {
                projectTransactions: [],
                status: [],
                typeList: [],
                systemUserID: null
            }
        },
        created() {
            let self = this;
            self.getTransactionsByUser()
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
                    trans.status = type;

                    trans.systemUserID = user.systemUserID;
                    Axios.post(process.env.VUE_APP_API + 'ProjectTX', trans).then(
                        res => {
                            delete Axios.defaults.headers.common["TenantID"];
                        })
                })

            },
            getLists() {
                let self = this
                let statusHandler = new StatusHandler()
                self.status = statusHandler.getStatus()
                self.typeList = statusHandler.getTypeList()

            },
            getTransactionsByUser() {
                let self = this;

                let encoded_details = jwt.decode(sessionStorage.accessToken);
                let systemUserID = encoded_details.USER_ID;

                self.systemUserID = systemUserID;

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
            setRangingInProgress(item) {
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
            setRangingComplete(item, index) {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                let trans = JSON.parse(JSON.stringify(item));
                trans.status = 2;
                trans.systemUserID = item.projectOwnerID;

                Axios.post(process.env.VUE_APP_API + 'ProjectTX', trans).then(
                    res => {
                        self.projectTransactions.splice(index, 1);
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