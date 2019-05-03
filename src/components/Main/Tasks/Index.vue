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
                                <tr :style="{ backgroundColor: (props.item.subtask == true  ? 'lightgrey' : 'transparent' )}">
                                    <td>{{ props.item.planogram }}</td>
                                    <td>{{ typeList[props.item.type == -1 ? 5 : props.item.type].text }}</td>
                                    <td>{{ status[props.item.status == -1 ? 18 : props.item.status].text }}</td>
                                    <td>{{ props.item.storeCluster }}</td>
                                    <td>{{ props.item.categoryCluster }}</td>
                                    <td>{{ props.item.store }}</td>
                                    <td>{{ props.item.dateTimeString }}</td>
                                    <td style="width: 5%;">
                                        <!-- PROJECT START -->
                                        <v-btn @click="assignFirstTask(props.item)" small v-if="props.item.status == 0">
                                            Assign</v-btn>
                                        <!-- END PROJECT START -->
                                        <!-- DATA PREPARATION -->
                                        <v-btn small v-if="props.item.type == 1"></v-btn>
                                        <v-btn small v-if="props.item.type == 1"></v-btn>
                                        <v-btn small v-if="props.item.type == 1"></v-btn>
                                        <v-btn small v-if="props.item.type == 1"></v-btn>
                                        <!-- END DATA PREPARATION -->
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
                self.getTransactionsByUser(systemUserID, () => {

                })
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
        }
    }
</script>

<style scoped>
    .scrollable {
        height: calc(100vh - 240px);
        overflow: auto;
    }
</style>