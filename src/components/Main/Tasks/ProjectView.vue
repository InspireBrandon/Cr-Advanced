<template>
    <v-container grid-list-md fluid>
        <v-layout row wrap>
            <v-flex md12>
                <v-card flat>
                    <v-card-text class="pa-0">
                        <v-data-table :headers="headers" :items="data" class="elevation-0 scrollable" hide-actions>
                            <template v-slot:no-data>
                                <div style="text-align:center;">
                                     View Tasks and Stores
                                </div>
                            </template>
                            <template v-slot:items="props">
                                <tr
                                    :style="{ backgroundColor: (props.item.subtask == true  ? 'lightgrey' : 'transparent' )}">
                                    <td>{{ props.item.planogram }}</td>
                                    <td>{{ typeList[props.item.type == -1 ? 5 : props.item.type].text }}</td>
                                    <td>{{ statusList[props.item.status == -1 ? 18 : props.item.status].text }}</td>
                                    <td>
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on }">
                                                <v-icon v-on="on" v-if="props.item.systemFileName!=null">
                                                    web</v-icon>
                                            </template>
                                            <span> {{props.item.systemFileName}}</span>
                                        </v-tooltip>

                                    </td>
                                    <td>
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on }">
                                                <v-icon v-on="on" v-if="props.item.rangeFileID!=null">
                                                    web</v-icon>
                                            </template>
                                            <span> {{props.item.rangeFileName}}</span>
                                        </v-tooltip>
                                    </td>
                                    <td>{{ props.item.storeCluster }}</td>
                                    <td>{{ props.item.categoryCluster }}</td>
                                    <td>{{ props.item.store }}</td>
                                    <td>{{ props.item.dateTimeString }}</td>
                                    <td>
                                        <v-btn
                                            v-if="(props.item.type != -1)&&(props.item.type==2 &&props.item.rangeFileID!=null)"
                                            color="success" small @click="routeToView(props.item)">View</v-btn>
                                        <v-btn
                                            v-if="(props.item.type != -1)&&((props.item.type==3 &&props.item.systemFileName!=null))"
                                            color="primary" small @click="routeToView(props.item)">View</v-btn>
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
        <AssignTask ref="assignTask" />
    </v-container>
</template>

<script>
    // Libs
    import Axios from 'axios';
    import jwt from 'jsonwebtoken';
    import {
        EventBus
    } from '@/libs/events/event-bus.js';

    // Components
    import AssignTask from '@/components/Common/AssignTask'

    export default {
        name: 'ProjectView',
        props: ['data', 'typeList', 'statusList'],
        components: {
            AssignTask,
        },
        data() {
            return {
                searchType: null,
                filterList: [],
                dropSearch: null,
                users: [],
                selectedUser: null,
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
                    }, {
                        text: 'Planogram',
                        sortable: false
                    }, {
                        text: 'Range',
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
                ],
                projects: [],
                projectsList: [],
                userAccess: null,
                userAccessTypeID: -1
            }
        },
        methods: {
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
                                            EventBus.$emit('get-tasks');
                                            // self.getTransactionsByUser(
                                            //     systemUserID);
                                        })
                                })
                        })
                })
            },
        },
    }
</script>

<style scoped>
    .scrollable {
        height: calc(100vh - 300px);
        overflow: auto;
    }
</style>