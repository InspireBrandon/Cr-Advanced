<template>
    <div>
        <!-- PROJECT START -->
        <v-tooltip bottom>
            <template v-slot:activator="{ on }">
                <v-btn color="secondary" @click="params.context.componentParent.assign(params.data)" flat icon small v-if="params.data.status == 0">
                    <v-icon v-on="on">assignment</v-icon>
                </v-btn>
            </template>
            <span>Assign</span>
        </v-tooltip>

        <!-- END PROJECT START -->
        <!-- PROCESS ASSIGNED -->
        <v-tooltip bottom>
            <template v-slot:activator="{ on }">
                <v-btn @click="params.context.componentParent.closeTask(params.data, index)" flat icon small v-if="params.data.status == 40">
                    <v-icon color="error" v-on="on">close</v-icon>
                </v-btn>
            </template>
            <span>close</span>
        </v-tooltip>

        <!-- END PROCESS ASSIGNED -->
        <!-- DATA PREPARATION -->
        <v-tooltip bottom>
            <template v-slot:activator="{ on }">
                <v-btn flat icon small color="success" @click="params.context.componentParent.setInProgressAndView(params.data)"
                    v-if="params.data.type == 1 && params.data.status == 6">
                    <v-icon v-on="on">visibility</v-icon>
                </v-btn>
            </template>
            <span>View</span>
        </v-tooltip>

        <div style="display: flex;">
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn flat icon small color="warning" @click="params.context.componentParent.routeToView(params.data)"
                        v-if="params.data.type == 1 && (params.data.status == 1) && systemUserID == params.data.systemUserID">
                        <v-icon v-on="on">visibility</v-icon>
                    </v-btn>
                </template>
                <span>View</span>
            </v-tooltip>

            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn flat icon small @click="params.context.componentParent.setComplete(params.data)"
                        v-if="params.data.type == 1 && params.data.status == 1">
                        <v-icon color="error" v-on="on">check</v-icon>
                    </v-btn>
                </template>
                <span>complete</span>
            </v-tooltip>

        </div>
        <v-tooltip bottom>
            <template v-slot:activator="{ on }">
                <v-btn flat icon small @click="params.context.componentParent.closeTask(params.data, index)"
                    v-if="(params.data.type == 1 && params.data.status == 2) && systemUserID == params.data.actionedByUserID">
                    <v-icon color="error" v-on="on">close</v-icon>
                </v-btn>
            </template>
            <span>close</span>
        </v-tooltip>

        <div style="display: flex;">
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn flat icon small color="warning" @click="params.context.componentParent.routeToView(params.data)"
                        v-if="(params.data.type == 1 && params.data.status == 2) && systemUserID == params.data.systemUserID">
                        <v-icon v-on="on">visibility</v-icon>
                    </v-btn>
                </template>
                <span>View</span>
            </v-tooltip>

            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn flat icon small color="secondary" @click="params.context.componentParent.assign(params.data)"
                        v-if="(params.data.type == 1 && params.data.status == 2) && systemUserID == params.data.systemUserID">
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
                <v-btn flat icon small color="success" @click="params.context.componentParent.setInProgressAndView(params.data)"
                    v-if="params.data.type == 2 && params.data.status == 7">
                    <v-icon v-on="on">visibility</v-icon>
                </v-btn>
            </template>
            <span>View</span>
        </v-tooltip>

        <div style="display: flex;">
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn flat icon small color="warning" @click="params.context.componentParent.routeToView(params.data)"
                        v-if="params.data.type == 2 && (params.data.status == 1) && systemUserID == params.data.systemUserID">
                        <v-icon v-on="on">visibility</v-icon>
                    </v-btn>
                </template>
                <span>View</span>
            </v-tooltip>

            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn flat icon small @click="params.context.componentParent.setComplete(params.data)"
                        v-if="params.data.type == 2 && params.data.status == 1">
                        <v-icon color="error" v-on="on">check</v-icon>
                    </v-btn>
                </template>
                <span>complete</span>
            </v-tooltip>

        </div>

        <v-tooltip bottom>
            <template v-slot:activator="{ on }">
                <v-btn flat icon small @click="params.context.componentParent.closeTask(params.data, index)"
                    v-if="(params.data.type == 2 && params.data.status == 2) && systemUserID == params.data.actionedByUserID">
                    <v-icon v-on="on" color="error">close</v-icon>
                </v-btn>
            </template>
            <span>close</span>
        </v-tooltip>

        <div style="display: flex;">
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn flat icon small color="warning" @click="params.context.componentParent.routeToView(params.data)"
                        v-if="(params.data.type == 2 && params.data.status == 2) && systemUserID == params.data.systemUserID">
                        <v-icon v-on="on">visibility</v-icon>
                    </v-btn>
                </template>
                <span>View</span>
            </v-tooltip>

            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn flat icon small color="secondary" @click="params.context.componentParent.assign(params.data)"
                        v-if="(params.data.type == 2 && params.data.status == 2) && systemUserID == params.data.systemUserID">
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
                <v-btn flat icon small color="success" @click="params.context.componentParent.setInProgressAndView(params.data)"
                    v-if="params.data.type == 3 && params.data.status == 8">
                    <v-icon v-on="on">visibility</v-icon>
                </v-btn>
            </template>
            <span>View</span>
        </v-tooltip>

        <div style="display: flex;">
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn flat icon small color="warning" @click="params.context.componentParent.routeToView(params.data)"
                        v-if="params.data.type == 3 && params.data.status == 1">
                        <v-icon v-on="on">visibility</v-icon>
                    </v-btn>
                </template>
                <span>View</span>
            </v-tooltip>

            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn flat icon small color="error" @click="params.context.componentParent.setPlanogramComplete(params.data)"
                        v-if="params.data.type == 3 && params.data.status == 1">
                        <v-icon v-on="on">check</v-icon>
                    </v-btn>
                </template>
                <span>complete</span>
            </v-tooltip>

        </div>
        <div style="display: flex;">
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn flat icon small @click="params.context.componentParent.closeTask(params.data, index)"
                        v-if="(params.data.type == 3 && params.data.status == 2) && systemUserID == params.data.actionedByUserID">
                        <v-icon v-on="on" color="error">close</v-icon>
                    </v-btn>
                </template>
                <span>close</span>
            </v-tooltip>

            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn flat icon small color="primary" @click="params.context.componentParent.routeToView(params.data)"
                        v-if="(params.data.type == 3 && params.data.status == 2) && systemUserID == params.data.systemUserID">
                        <v-icon v-on="on">visibility</v-icon>
                    </v-btn>
                </template>
                <span>View</span>
            </v-tooltip>

            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn flat icon small color="primary" @click="params.context.componentParent.submitForApproval(params.data)"
                        v-if="(params.data.type == 3 && params.data.status == 2) && systemUserID == params.data.systemUserID">
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

                <v-btn flat icon small color="success" @click="params.context.componentParent.setApprovalInProgress(params.data)"
                    v-if="params.data.type == 3 && params.data.status == 10">
                    <v-icon v-on="on">visibility</v-icon>
                </v-btn>
            </template>
            <span>View</span>
        </v-tooltip>

        <v-tooltip bottom>
            <template v-slot:activator="{ on }">
                <v-btn flat icon small color="warning" @click="params.context.componentParent.routeToView(params.data)"
                    v-if="params.data.type == 3 && params.data.status == 20">
                    <v-icon v-on="on">visibility</v-icon>
                </v-btn>
            </template>
            <span>View</span>
        </v-tooltip>


        <v-tooltip bottom>
            <template v-slot:activator="{ on }">
                <v-btn flat icon small @click="params.context.componentParent.closeTask(params.data , index)"
                    v-if="(params.data.type == 3 && params.data.status == 12) && systemUserID == params.data.actionedByUserID">
                    <v-icon v-on="on" color="error">close</v-icon>
                </v-btn>
            </template>
            <span>close</span>
        </v-tooltip>
        <v-tooltip bottom>
            <template v-slot:activator="{ on }">
                <v-btn flat icon small color="primary" @click="params.context.componentParent.submitForDistribution(params.data)"
                    v-if="(params.data.type == 3 && params.data.status == 12) && systemUserID == params.data.systemUserID">
                    <v-icon v-on="on">send</v-icon>
                </v-btn>
            </template>
            <span>Send</span>
        </v-tooltip>

        <!-- END APPROVAL PROCESS -->
        <!-- DISTRIBUTION -->
        <v-tooltip bottom>
            <template v-slot:activator="{ on }">
                <v-btn flat icon small color="success" @click="params.context.componentParent.setDistributionInProgress(params.data)"
                    v-if="params.data.type == 3 && params.data.status == 19">
                    <v-icon v-on="on">visibility</v-icon>
                </v-btn>
            </template>
            <span>View</span>
        </v-tooltip>

        <v-tooltip bottom>
            <template v-slot:activator="{ on }">
                <v-btn flat icon small color="warning" @click="params.context.componentParent.routeToView(params.data)"
                    v-if="params.data.type == 3 && params.data.status == 21">
                    <v-icon v-on="on">visibility</v-icon>
                </v-btn>
            </template>
            <span>View</span>
        </v-tooltip>

        <!-- END DISTRIBUTION -->
        <!-- IMPLEMENTATION -->
        <v-tooltip bottom>
            <template v-slot:activator="{ on }">
                <v-btn flat icon small color="success" @click="params.context.componentParent.setImplementationInProgress(params.data)"
                    v-if="params.data.type == 3 && params.data.status == 13">
                    <v-icon v-on="on">visibility</v-icon>
                </v-btn>
            </template>
            <span>View</span>
        </v-tooltip>


        <v-tooltip bottom>
            <template v-slot:activator="{ on }">
                <v-btn flat icon small color="warning" @click="params.context.componentParent.routeToView(params.data)"
                    v-if="params.data.type == 3 && params.data.status == 24">
                    <v-icon v-on="on">visibility</v-icon>
                </v-btn>
            </template>
            <span>View</span>
        </v-tooltip>
        <v-tooltip bottom>
            <template v-slot:activator="{ on }">
                <v-btn flat icon small color="primary" @click="params.context.componentParent.routeToView(params.data)"
                    v-if="params.data.type == 3 && params.data.status == 26">
                    <v-icon v-on="on">visibility</v-icon>
                </v-btn>
            </template>
            <span>View</span>
        </v-tooltip>

        <!-- END IMPLEMENTATION -->
        <!-- ON HOLD -->
        <v-tooltip bottom>
            <template v-slot:activator="{ on }">
                <v-btn flat icon small @click="params.context.componentParent.closeTask(params.data , index)"
                    v-if="params.data.status == 16 && systemUserID == params.data.systemUserID">
                    <v-icon v-on="on" color="error">close</v-icon>
                </v-btn>
            </template>
            <span>close</span>
        </v-tooltip>

        <v-tooltip bottom>
            <template v-slot:activator="{ on }">
                <v-btn flat icon small @click="params.context.componentParent.closeTask(params.data , index)"
                    v-if="params.data.status == 16 && systemUserID == params.data.actionedByUserID">
                    <v-icon v-on="on" color="error">close</v-icon>
                </v-btn>
            </template>
            <span>close</span>
        </v-tooltip>

        <!-- END ON HOLD -->
        <!-- VARIATION REQUEST -->
        <v-tooltip bottom>
            <template v-slot:activator="{ on }">
                <v-btn small icon flat color="secondary" @click="params.context.componentParent.assign(params.data)"
                    v-if="params.data.status == 14 && systemUserID == params.data.systemUserID">
                    <v-icon v-on="on">assignment</v-icon>
                </v-btn>
            </template>
            <span>Assign</span>
        </v-tooltip>

        <!-- END VARIATION REQUEST -->
        <v-tooltip bottom>
            <template v-slot:activator="{ on }">
                <v-btn flat icon small color="secondary" @click="params.context.componentParent.assign(params.data)"
                    v-if="params.data.status == 41 && systemUserID == params.data.systemUserID">
                    <v-icon v-on="on">assignment</v-icon>
                </v-btn>
            </template>
            <span>Assign</span>
        </v-tooltip>

        <!-- TASK Takeover -->
        <v-tooltip bottom>
            <template v-slot:activator="{ on }">
                <v-btn flat icon small @click="params.context.componentParent.closeTask(params.data)"
                    v-if="params.data.status == 42 && systemUserID == params.data.actionedByUserID">
                    <v-icon v-on="on" color="error">close</v-icon>
                </v-btn>
            </template>
            <span>Close</span>
        </v-tooltip>
        <!-- END TASK Takeover -->
        <!-- SUBTASKS SET IN PROGRESS AND VIEW -->
        <v-tooltip bottom>
            <template v-slot:activator="{ on }">
                <v-btn flat icon small color="success" @click="params.context.componentParent.setSubtaskInProgressAndView(params.data)"
                    v-if="params.data.status == 28 && params.data.rollingUserID != systemUserID">
                    <v-icon v-on="on">done</v-icon>
                </v-btn>
            </template>
            <span>received</span>
        </v-tooltip>

        <v-tooltip bottom>
            <template v-slot:activator="{ on }">
                <v-btn flat icon small color="success" @click="params.context.componentParent.setSubtaskInProgressAndView(params.data)"
                    v-if="params.data.status == 31 && params.data.rollingUserID != systemUserID">
                    <v-icon v-on="on">done</v-icon>
                </v-btn>
            </template>
            <span>received</span>
        </v-tooltip>

        <v-tooltip bottom>
            <template v-slot:activator="{ on }">
                <v-btn flat icon small color="success" @click="params.context.componentParent.setSubtaskInProgressAndView(params.data)"
                    v-if="params.data.status == 34 && params.data.rollingUserID != systemUserID">
                    <v-icon v-on="on">done</v-icon>
                </v-btn>
            </template>
            <span>received</span>
        </v-tooltip>

        <v-tooltip bottom>
            <template v-slot:activator="{ on }">
                <v-btn flat icon small color="success" @click="params.context.componentParent.setSubtaskInProgressAndView(params.data)"
                    v-if="params.data.status == 37 && params.data.rollingUserID != systemUserID">
                    <v-icon v-on="on">done</v-icon>
                </v-btn>
            </template>
            <span>received</span>
        </v-tooltip>

        <!-- END SUBTASKS SET IN PROGRESS AND VIEW -->
        <!-- SUBTASKS VIEW -->
        <div style="display: flex;">
            <!-- <v-btn small color="warning" @click="goToSubtaskView(params.data)"
                                                v-if="params.data.status == 29 && params.data.rollingUserID != systemUserID">View</v-btn> -->
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn flat icon small @click="params.context.componentParent.completeSubtask(params.data)"
                        v-if="params.data.status == 29 && params.data.rollingUserID != systemUserID">
                        <v-icon v-on="on" color="error">check</v-icon>
                    </v-btn>
                </template>
                <span>Complete</span>
            </v-tooltip>

        </div>
        <div style="display: flex;">
            <!-- <v-btn small color="warning" @click="goToSubtaskView(params.data)"
                                                v-if="params.data.status == 32 && params.data.rollingUserID != systemUserID">View</v-btn> -->
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn flat icon small @click="params.context.componentParent.completeSubtask(params.data)"
                        v-if="params.data.status == 32 && params.data.rollingUserID != systemUserID">
                        <v-icon v-on="on" color="error">check</v-icon>
                    </v-btn>
                </template>
                <span>Complete</span>
            </v-tooltip>

        </div>
        <div style="display: flex;">
            <!-- <v-btn small color="warning" @click="goToSubtaskView(params.data)"
                                                v-if="params.data.status == 35 && params.data.rollingUserID != systemUserID">View</v-btn> -->
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn small icon @click="params.context.componentParent.completeSubtask(params.data)"
                        v-if="params.data.status == 35 && params.data.rollingUserID != systemUserID">
                        <v-icon color="error" v-on="on">check</v-icon>
                    </v-btn>
                </template>
                <span>Complete</span>
            </v-tooltip>

        </div>
        <div style="display: flex;">
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn flat icon small color="warning" @click="params.context.componentParent.goToSubtaskView(params.data)"
                        v-if="params.data.status == 38 && params.data.rollingUserID != systemUserID">
                        <v-icon v-on="on">visibility</v-icon>

                    </v-btn>
                </template>
                <span>View</span>
            </v-tooltip>
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn flat icon small @click="params.context.componentParent.completeSubtask(params.data)"
                        v-if="params.data.status == 38 && params.data.rollingUserID != systemUserID">
                        <v-icon v-on="on" color="error">check</v-icon>
                    </v-btn>
                </template>
                <span>Complete</span>
            </v-tooltip>

        </div>
        <!-- END SUBTASKS VIEW -->
        <!-- CLOSE SUBTASKS -->
        <v-tooltip bottom>
            <template v-slot:activator="{ on }">
                <v-btn flat icon small @click="params.context.componentParent.closeTask(params.data)" v-if="params.data.status == 30">
                    <v-icon v-on="on" color="error">Close</v-icon>
                </v-btn>
            </template>
            <span>Close</span>
        </v-tooltip>
        <v-tooltip bottom>
            <template v-slot:activator="{ on }">
                <v-btn flat icon small @click="params.context.componentParent.closeTask(params.data)" v-if="params.data.status == 33">
                    <v-icon v-on="on" color="error">Close</v-icon>
                </v-btn>
            </template>
            <span>Close</span>
        </v-tooltip>
        <v-tooltip bottom>
            <template v-slot:activator="{ on }">
                <v-btn flat icon small @click="params.context.componentParent.closeTask(params.data)" v-if="params.data.status == 36">
                    <v-icon v-on="on" color="error">Close</v-icon>
                </v-btn>
            </template>
            <span>Close</span>
        </v-tooltip>
        <v-tooltip bottom>
            <template v-slot:activator="{ on }">
                <v-btn flat icon small @click="params.context.componentParent.closeTask(params.data)" v-if="params.data.status == 39">
                    <v-icon v-on="on" color="error">Close</v-icon>
                </v-btn>
            </template>
            <span>Close</span>
        </v-tooltip>
        <!-- END CLOSE SUBTASKS -->
        <!-- MAIL -->
        <v-tooltip bottom>
            <template v-slot:activator="{ on }">
                <v-btn small icon @click="params.context.componentParent.closeTask(params.data)" v-if="params.data.status == 43 && params.data.type == 7">
                    <v-icon color="error" v-on="on">close</v-icon>
                </v-btn>
            </template>
            <span>Close</span>
        </v-tooltip>
        <!-- END MAIL -->
    </div>
</template>
<script>
    export default {
        data() {
            return {
                systemUserID: -1,
            }
        },
        methods: {},
        created() {
            let self = this;
            self.selectedUser = self.params.context.componentParent.selectedUser;
        }
    }
</script>