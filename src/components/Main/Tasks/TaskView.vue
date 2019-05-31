<template>
    <v-container grid-list-md fluid>
        <v-layout row wrap>
            <v-flex md12>
                <v-card flat>
                    <v-card-text class="pa-0">
                        <table>
                            <thead>
                                <tr>
                                    <th>Project</th>
                                    <th>Type</th>
                                    <th>Status</th>
                                    <th>Store Cluster</th>
                                    <th>CC</th>
                                    <th>Store</th>
                                    <th>Date</th>
                                    <th>User Assigned</th>
                                    <th>Actioned By</th>
                                    <th style="width: 120px;"></th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th style="width: 80px;"></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item,idx) in data" :key="idx"
                                    :style="{ backgroundColor: (item.subtask == true  ? 'lightgrey' : 'transparent' )}">


                                    <td>{{ item.planogram }}</td>
                                    <td>{{ typeList[item.type == -1 ? 5 : item.type].text }}</td>
                                    <td>{{ statusList[item.status == -1 ? 18 : item.status].text }}</td>
                                    <td>{{ item.storeCluster }}</td>
                                    <td>{{ item.categoryCluster }}</td>
                                    <td>{{ item.store }}</td>
                                    <td>{{ item.dateTimeString }}</td>
                                    <td>{{item.username}}</td>
                                    <td>{{item.actionedByUserName}}</td>
                                    <td style="width: 5%;">
                                        <!-- PROJECT START -->
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on }">
                                                <v-btn color="secondary" @click="assign(item)" flat icon small
                                                    v-if="item.status == 0">
                                                    <v-icon v-on="on">assignment</v-icon>
                                                </v-btn>
                                            </template>
                                            <span>Assign</span>
                                        </v-tooltip>

                                        <!-- END PROJECT START -->
                                        <!-- PROCESS ASSIGNED -->
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on }">
                                                <v-btn color="error" @click="closeTask(item, index)" flat icon small
                                                    v-if="item.status == 40">
                                                    <v-icon v-on="on">close</v-icon>
                                                </v-btn>
                                            </template>
                                            <span>close</span>
                                        </v-tooltip>

                                        <!-- END PROCESS ASSIGNED -->
                                        <!-- DATA PREPARATION -->
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on }">
                                                <v-btn flat icon small color="success"
                                                    @click="setInProgressAndView(item)"
                                                    v-if="item.type == 1 && item.status == 6">
                                                    <v-icon v-on="on">visibility</v-icon>
                                                </v-btn>
                                            </template>
                                            <span>View</span>
                                        </v-tooltip>

                                        <div style="display: flex;">
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on }">
                                                    <v-btn flat icon small color="warning" @click="routeToView(item)"
                                                        v-if="item.type == 1 && (item.status == 1) && systemUserID == item.systemUserID">
                                                        <v-icon v-on="on">visibility</v-icon>
                                                    </v-btn>
                                                </template>
                                                <span>View</span>
                                            </v-tooltip>

                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on }">
                                                    <v-btn flat icon small color="error" @click="setComplete(item)"
                                                        v-if="item.type == 1 && item.status == 1">
                                                        <v-icon v-on="on">check</v-icon>
                                                    </v-btn>
                                                </template>
                                                <span>complete</span>
                                            </v-tooltip>

                                        </div>
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on }">
                                                <v-btn flat icon small color="error" @click="closeTask(item, index)"
                                                    v-if="(item.type == 1 && item.status == 2) && systemUserID == item.actionedByUserID">
                                                    <v-icon v-on="on">close</v-icon>
                                                </v-btn>
                                            </template>
                                            <span>close</span>
                                        </v-tooltip>

                                        <div style="display: flex;">
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on }">
                                                    <v-btn flat icon small color="warning" @click="routeToView(item)"
                                                        v-if="(item.type == 1 && item.status == 2) && systemUserID == item.systemUserID">
                                                        <v-icon v-on="on">visibility</v-icon>
                                                    </v-btn>
                                                </template>
                                                <span>View</span>
                                            </v-tooltip>

                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on }">
                                                    <v-btn flat icon small color="secondary" @click="assign(item)"
                                                        v-if="(item.type == 1 && item.status == 2) && systemUserID == item.systemUserID">
                                                        <v-icon v-on="on">assignment</v-icon>
                                                    </v-btn>
                                                </template>
                                                <span>Assign</span>
                                            </v-tooltip>
                                        </div>
                                        <!-- END DATA PREPARATION -->
                                        <!-- RANGING -->
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on }">
                                                <v-btn flat icon small color="success"
                                                    @click="setInProgressAndView(item)"
                                                    v-if="item.type == 2 && item.status == 7">
                                                    <v-icon v-on="on">visibility</v-icon>
                                                </v-btn>
                                            </template>
                                            <span>View</span>
                                        </v-tooltip>

                                        <div style="display: flex;">
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on }">
                                                    <v-btn flat icon small color="warning" @click="routeToView(item)"
                                                        v-if="item.type == 2 && (item.status == 1) && systemUserID == item.systemUserID">
                                                        <v-icon v-on="on">visibility</v-icon>
                                                    </v-btn>
                                                </template>
                                                <span>View</span>
                                            </v-tooltip>

                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on }">
                                                    <v-btn flat icon small color="error" @click="setComplete(item)"
                                                        v-if="item.type == 2 && item.status == 1">
                                                        <v-icon v-on="on">check</v-icon>
                                                    </v-btn>
                                                </template>
                                                <span>complete</span>
                                            </v-tooltip>

                                        </div>

                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on }">
                                                <v-btn flat icon small color="error" @click="closeTask(item, index)"
                                                    v-if="(item.type == 2 && item.status == 2) && systemUserID == item.actionedByUserID">
                                                    <v-icon v-on="on">close</v-icon>
                                                </v-btn>
                                            </template>
                                            <span>close</span>
                                        </v-tooltip>

                                        <div style="display: flex;">
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on }">
                                                    <v-btn flat icon small color="warning" @click="routeToView(item)"
                                                        v-if="(item.type == 2 && item.status == 2) && systemUserID == item.systemUserID">
                                                        <v-icon v-on="on">visibility</v-icon>
                                                    </v-btn>
                                                </template>
                                                <span>View</span>
                                            </v-tooltip>

                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on }">
                                                    <v-btn flat icon small color="secondary" @click="assign(item)"
                                                        v-if="(item.type == 2 && item.status == 2) && systemUserID == item.systemUserID">
                                                        <v-icon v-on="on">assignment</v-icon>
                                                    </v-btn>
                                                </template>
                                                <span>Assign</span>
                                            </v-tooltip>

                                        </div>
                                        <!-- END RANGING -->
                                        <!-- SPACE PLANNING -->
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on }">
                                                <v-btn flat icon small color="success"
                                                    @click="setInProgressAndView(item)"
                                                    v-if="item.type == 3 && item.status == 8">
                                                    <v-icon v-on="on">visibility</v-icon>
                                                </v-btn>
                                            </template>
                                            <span>View</span>
                                        </v-tooltip>

                                        <div style="display: flex;">
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on }">
                                                    <v-btn flat icon small color="warning" @click="routeToView(item)"
                                                        v-if="item.type == 3 && item.status == 1">
                                                        <v-icon v-on="on">visibility</v-icon>
                                                    </v-btn>
                                                </template>
                                                <span>View</span>
                                            </v-tooltip>

                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on }">
                                                    <v-btn flat icon small color="error"
                                                        @click="setPlanogramComplete(item)"
                                                        v-if="item.type == 3 && item.status == 1">
                                                        <v-icon v-on="on">check</v-icon>
                                                    </v-btn>
                                                </template>
                                                <span>complete</span>
                                            </v-tooltip>

                                        </div>
                                        <div style="display: flex;">
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on }">
                                                    <v-btn flat icon small color="error" @click="closeTask(item, index)"
                                                        v-if="(item.type == 3 && item.status == 2) && systemUserID == item.actionedByUserID">
                                                        <v-icon v-on="on">close</v-icon>
                                                    </v-btn>
                                                </template>
                                                <span>close</span>
                                            </v-tooltip>

                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on }">
                                                    <v-btn flat icon small color="primary" @click="routeToView(item)"
                                                        v-if="(item.type == 3 && item.status == 2) && systemUserID == item.systemUserID">
                                                        <v-icon v-on="on">visibility</v-icon>
                                                    </v-btn>
                                                </template>
                                                <span>View</span>
                                            </v-tooltip>

                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on }">
                                                    <v-btn flat icon small color="primary"
                                                        @click="submitForApproval(item)"
                                                        v-if="(item.type == 3 && item.status == 2) && systemUserID == item.systemUserID">
                                                        <v-icon v-on="on">send</v-icon>
                                                    </v-btn>
                                                </template>
                                                <span>send</span>
                                            </v-tooltip>

                                        </div>
                                        <!-- SPACE PLANNING -->
                                        <!-- APPROVAL PROCESS -->
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on }">

                                                <v-btn flat icon small color="success"
                                                    @click="setApprovalInProgress(item)"
                                                    v-if="item.type == 3 && item.status == 10">
                                                    <v-icon v-on="on">visibility</v-icon>
                                                </v-btn>
                                            </template>
                                            <span>View</span>
                                        </v-tooltip>

                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on }">
                                                <v-btn flat icon small color="warning" @click="routeToView(item)"
                                                    v-if="item.type == 3 && item.status == 20">
                                                    <v-icon v-on="on">visibility</v-icon>
                                                </v-btn>
                                            </template>
                                            <span>View</span>
                                        </v-tooltip>


                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on }">
                                                <v-btn flat icon small color="error" @click="closeTask(item , index)"
                                                    v-if="(item.type == 3 && item.status == 12) && systemUserID == item.actionedByUserID">
                                                    <v-icon v-on="on">close</v-icon>
                                                </v-btn>
                                            </template>
                                            <span>close</span>
                                        </v-tooltip>
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on }">
                                                <v-btn flat icon small color="primary"
                                                    @click="submitForDistribution(item)"
                                                    v-if="(item.type == 3 && item.status == 12) && systemUserID == item.systemUserID">
                                                    <v-icon v-on="on">send</v-icon>
                                                </v-btn>
                                            </template>
                                            <span>Send</span>
                                        </v-tooltip>

                                        <!-- END APPROVAL PROCESS -->
                                        <!-- DISTRIBUTION -->
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on }">
                                                <v-btn flat icon small color="success"
                                                    @click="setDistributionInProgress(item)"
                                                    v-if="item.type == 3 && item.status == 19">
                                                    <v-icon v-on="on">visibility</v-icon>
                                                </v-btn>
                                            </template>
                                            <span>View</span>
                                        </v-tooltip>

                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on }">
                                                <v-btn flat icon small color="warning" @click="routeToView(item)"
                                                    v-if="item.type == 3 && item.status == 21">
                                                    <v-icon v-on="on">visibility</v-icon>
                                                </v-btn>
                                            </template>
                                            <span>View</span>
                                        </v-tooltip>

                                        <!-- END DISTRIBUTION -->
                                        <!-- IMPLEMENTATION -->
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on }">
                                                <v-btn flat icon small color="success"
                                                    @click="setImplementationInProgress(item)"
                                                    v-if="item.type == 3 && item.status == 13">
                                                    <v-icon v-on="on">visibility</v-icon>
                                                </v-btn>
                                            </template>
                                            <span>View</span>
                                        </v-tooltip>


                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on }">
                                                <v-btn flat icon small color="warning" @click="routeToView(item)"
                                                    v-if="item.type == 3 && item.status == 24">
                                                    <v-icon v-on="on">visibility</v-icon>
                                                </v-btn>
                                            </template>
                                            <span>View</span>
                                        </v-tooltip>
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on }">
                                                <v-btn flat icon small color="primary" @click="routeToView(item)"
                                                    v-if="item.type == 3 && item.status == 26">
                                                    <v-icon v-on="on">visibility</v-icon>
                                                </v-btn>
                                            </template>
                                            <span>View</span>
                                        </v-tooltip>

                                        <!-- END IMPLEMENTATION -->
                                        <!-- ON HOLD -->
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on }">
                                                <v-btn flat icon small color="error" @click="closeTask(item , index)"
                                                    v-if="item.status == 16 && systemUserID == item.systemUserID">
                                                    <v-icon v-on="on">close</v-icon>
                                                </v-btn>
                                            </template>
                                            <span>close</span>
                                        </v-tooltip>

                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on }">
                                                <v-btn flat icon small color="error" @click="closeTask(item , index)"
                                                    v-if="item.status == 16 && systemUserID == item.actionedByUserID">
                                                    <v-icon v-on="on">close</v-icon>
                                                </v-btn>
                                            </template>
                                            <span>close</span>
                                        </v-tooltip>

                                        <!-- END ON HOLD -->
                                        <!-- VARIATION REQUEST -->
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on }">
                                                <v-btn small icon flat color="secondary" @click="assign(item)"
                                                    v-if="item.status == 14 && systemUserID == item.systemUserID">
                                                    <v-icon v-on="on">assignment</v-icon>
                                                </v-btn>
                                            </template>
                                            <span>Assign</span>
                                        </v-tooltip>

                                        <!-- END VARIATION REQUEST -->
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on }">
                                                <v-btn flat icon small color="secondary" @click="assign(item)"
                                                    v-if="item.status == 41 && systemUserID == item.systemUserID">
                                                    <v-icon v-on="on">assignment</v-icon>
                                                </v-btn>
                                            </template>
                                            <span>Assign</span>
                                        </v-tooltip>

                                        <!-- TASK Takeover -->
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on }">
                                                <v-btn flat icon small color="error" @click="closeTask(item)"
                                                    v-if="item.status == 42 && systemUserID == item.actionedByUserID">
                                                    <v-icon v-on="on">close</v-icon>
                                                </v-btn>
                                            </template>
                                            <span>Close</span>
                                        </v-tooltip>
                                        <!-- END TASK Takeover -->
                                        <!-- SUBTASKS SET IN PROGRESS AND VIEW -->
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on }">
                                                <v-btn flat icon small color="success"
                                                    @click="setSubtaskInProgressAndView(item)"
                                                    v-if="item.status == 28 && item.rollingUserID != systemUserID">
                                                    <v-icon v-on="on">done</v-icon>
                                                </v-btn>
                                            </template>
                                            <span>received</span>
                                        </v-tooltip>

                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on }">
                                                <v-btn flat icon small color="success"
                                                    @click="setSubtaskInProgressAndView(item)"
                                                    v-if="item.status == 31 && item.rollingUserID != systemUserID">
                                                    <v-icon v-on="on">done</v-icon>
                                                </v-btn>
                                            </template>
                                            <span>received</span>
                                        </v-tooltip>

                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on }">
                                                <v-btn flat icon small color="success"
                                                    @click="setSubtaskInProgressAndView(item)"
                                                    v-if="item.status == 34 && item.rollingUserID != systemUserID">
                                                    <v-icon v-on="on">done</v-icon>
                                                </v-btn>
                                            </template>
                                            <span>received</span>
                                        </v-tooltip>

                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on }">
                                                <v-btn flat icon small color="success"
                                                    @click="setSubtaskInProgressAndView(item)"
                                                    v-if="item.status == 37 && item.rollingUserID != systemUserID">
                                                    <v-icon v-on="on">done</v-icon>
                                                </v-btn>
                                            </template>
                                            <span>received</span>
                                        </v-tooltip>

                                        <!-- END SUBTASKS SET IN PROGRESS AND VIEW -->
                                        <!-- SUBTASKS VIEW -->
                                        <div style="display: flex;">
                                            <!-- <v-btn small color="warning" @click="goToSubtaskView(item)"
                                                v-if="item.status == 29 && item.rollingUserID != systemUserID">View</v-btn> -->
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on }">
                                                    <v-btn flat icon small color="error" @click="completeSubtask(item)"
                                                        v-if="item.status == 29 && item.rollingUserID != systemUserID">
                                                        <v-icon v-on="on">check</v-icon>
                                                    </v-btn>
                                                </template>
                                                <span>Complete</span>
                                            </v-tooltip>

                                        </div>
                                        <div style="display: flex;">
                                            <!-- <v-btn small color="warning" @click="goToSubtaskView(item)"
                                                v-if="item.status == 32 && item.rollingUserID != systemUserID">View</v-btn> -->
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on }">
                                                    <v-btn flat icon small color="error" @click="completeSubtask(item)"
                                                        v-if="item.status == 32 && item.rollingUserID != systemUserID">
                                                        <v-icon v-on="on">check</v-icon>
                                                    </v-btn>
                                                </template>
                                                <span>Complete</span>
                                            </v-tooltip>

                                        </div>
                                        <div style="display: flex;">
                                            <!-- <v-btn small color="warning" @click="goToSubtaskView(item)"
                                                v-if="item.status == 35 && item.rollingUserID != systemUserID">View</v-btn> -->
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on }">
                                                    <v-btn small icon color="error" @click="completeSubtask(item)"
                                                        v-if="item.status == 35 && item.rollingUserID != systemUserID">
                                                        <v-icon v-on="on">check</v-icon>
                                                    </v-btn>
                                                </template>
                                                <span>Complete</span>
                                            </v-tooltip>

                                        </div>
                                        <div style="display: flex;">
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on }">
                                                    <v-btn flat icon small color="warning"
                                                        @click="goToSubtaskView(item)"
                                                        v-if="item.status == 38 && item.rollingUserID != systemUserID">
                                                        <v-icon v-on="on">visibility</v-icon>

                                                    </v-btn>
                                                </template>
                                                <span>View</span>
                                            </v-tooltip>
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on }">
                                                    <v-btn flat icon small color="error" @click="completeSubtask(item)"
                                                        v-if="item.status == 38 && item.rollingUserID != systemUserID">
                                                        <v-icon v-on="on">check</v-icon>
                                                    </v-btn>
                                                </template>
                                                <span>Complete</span>
                                            </v-tooltip>

                                        </div>
                                        <!-- END SUBTASKS VIEW -->
                                        <!-- CLOSE SUBTASKS -->
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on }">
                                                <v-btn flat icon small color="error" @click="closeTask(item)"
                                                    v-if="item.status == 30">
                                                    <v-icon v-on="on">Close</v-icon>
                                                </v-btn>
                                            </template>
                                            <span>Close</span>
                                        </v-tooltip>
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on }">
                                                <v-btn flat icon small color="error" @click="closeTask(item)"
                                                    v-if="item.status == 33">
                                                    <v-icon v-on="on">Close</v-icon>
                                                </v-btn>
                                            </template>
                                            <span>Close</span>
                                        </v-tooltip>
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on }">
                                                <v-btn flat icon small color="error" @click="closeTask(item)"
                                                    v-if="item.status == 36">
                                                    <v-icon v-on="on">Close</v-icon>
                                                </v-btn>
                                            </template>
                                            <span>Close</span>
                                        </v-tooltip>
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on }">
                                                <v-btn flat icon small color="error" @click="closeTask(item)"
                                                    v-if="item.status == 39">
                                                    <v-icon v-on="on">Close</v-icon>
                                                </v-btn>
                                            </template>
                                            <span>Close</span>
                                        </v-tooltip>
                                        <!-- END CLOSE SUBTASKS -->
                                    </td>
                                    <td style="width: 2%">
                                        <v-tooltip bottom v-if="item.notes != null">
                                            <template v-slot:activator="{ on }">
                                                <v-icon v-on="on">note</v-icon>
                                            </template>
                                            <span>{{ item.notes }}</span>
                                        </v-tooltip>
                                    </td>
                                    <td style="width: 2%">
                                        <v-tooltip bottom v-if="item.systemFileName != null">
                                            <template v-slot:activator="{ on }">
                                                <v-icon v-on="on">web</v-icon>
                                            </template>
                                            <span>{{ item.systemFileName }}</span>
                                        </v-tooltip>
                                    </td>
                                    <td style="width: 2%">
                                        <v-tooltip bottom v-if="item.rangeFileName != null">
                                            <template v-slot:activator="{ on }">
                                                <v-icon v-on="on">assessment</v-icon>
                                            </template>
                                            <span>{{ item.rangeFileName }}</span>
                                        </v-tooltip>
                                    </td>
                                    <td style="width: 2%">
                                        <v-menu left>
                                            <v-btn v-if="userAccess != 3" icon slot="activator">
                                                <v-icon>more_vert</v-icon>
                                            </v-btn>
                                            <v-list dense class="pa-0 ma-0">

                                                <v-list-tile @click="assignNotNew(item)">
                                                    <span>Assign</span>
                                                </v-list-tile>

                                                <v-divider></v-divider>

                                                <v-list-tile @click="putTaskOnHold(item)">
                                                    <span>Put On Hold</span>
                                                </v-list-tile>

                                                <v-divider></v-divider>

                                                <v-list-tile @click="startSubtask(item)">
                                                    <span>New subtask</span>
                                                </v-list-tile>
                                                <v-divider></v-divider>

                                                <v-list-tile
                                                    v-if="( item.status == 2||item.status == 2)&&item.actionedByUserID==null"
                                                    @click="closeTask(item)">
                                                    <span>close</span>
                                                </v-list-tile>

                                            </v-list>
                                        </v-menu>
                                    </td>
                                </tr>
                                <!-- <td>
                                                <v-btn color="success" flat icon small>
                                                    <v-icon>visibility</v-icon>
                                                </v-btn>
                                                <v-btn color="warning" flat icon small>
                                                    <v-icon>check</v-icon>
                                                </v-btn>
                                            </td>
                                            <td>
                                                <v-tooltip bottom v-if="item.notes != null">
                                                    <template v-slot:activator="{ on }">
                                                        <v-icon v-on="on">note</v-icon>
                                                    </template>
                                                    <span>{{ item.notes }}</span>
                                                </v-tooltip>
                                            </td>
                                            <td>
                                                <v-tooltip bottom v-if="item.systemFileName != null">
                                                    <template v-slot:activator="{ on }">
                                                        <v-icon v-on="on">web</v-icon>
                                                    </template>
                                                    <span>{{ item.systemFileName }}</span>
                                                </v-tooltip>
                                            </td>
                                            <td>
                                                <v-tooltip bottom v-if="item.rangeFileName != null">
                                                    <template v-slot:activator="{ on }">
                                                        <v-icon v-on="on">assessment</v-icon>
                                                    </template>
                                                    <span>{{ item.rangeFileName }}</span>
                                                </v-tooltip>
                                            </td>
                                            <td style="text-align: center;">
                                                <v-btn small icon>
                                                    <v-icon>more_vert</v-icon>
                                                </v-btn>
                                            </td> -->
                            </tbody>
                        </table>
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