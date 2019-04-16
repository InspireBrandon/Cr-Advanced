<template>
    <v-container grid-list-md>
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
                                <v-btn @click="setRangingInProgress(props.item)" small color="primary"
                                    v-if="props.item.type == 2 && props.item.status == 7">
                                    <span>In Progress</span>
                                </v-btn>
                                <v-btn @click="setRangingComplete(props.item, props.index)" small color="primary"
                                    v-if="props.item.type == 2 && props.item.status == 1">
                                    <span>Complete</span>
                                </v-btn>
                                <v-btn @click="setPlanogramApprovalInProgress(props.item)" small color="primary"
                                    v-if="props.item.type == 3 && props.item.status == 10">
                                    <span>In Progress</span>
                                </v-btn>
                                <v-btn @click="$router.push('/PlanogramImplementation')" small color="primary"
                                    v-if="props.item.type == 3 && props.item.status == 20">
                                    <span>View</span>
                                </v-btn>
                            </td>
                        </template>
                    </v-data-table>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import Axios from 'axios';
    import jwt from 'jsonwebtoken';

    export default {
        name: 'tasks',
        data() {
            return {
                projectTransactions: [],
                status: [{
                        text: "Project Start",
                        value: 0,
                        friendly: "Project Start",
                        color: "blue",
                    },
                    {
                        text: "In Progress",
                        value: 1,
                        color: "blue",
                        friendly: "In Progress"

                    },
                    {
                        text: "Complete",
                        value: 2,
                        color: "blue",
                        friendly: "Complete"
                    },
                    {
                        text: "Workshop",
                        value: 3,
                        color: "warning",
                        friendly: "Workshop"
                    }, {
                        text: "Workshop Complete",
                        value: 4,
                        color: "warning",
                        friendly: "Workshop Complete"
                    },
                    {
                        text: "Meeting",
                        value: 5,
                        color: "warning",
                        friendly: "Meeting"
                    },
                    {
                        text: "Data Preparation Start",
                        value: 6,
                        color: "red",
                        friendly: "Data Preparation Start"
                    },
                    {
                        text: "Ranging Start",
                        value: 7,
                        color: "red",
                        friendly: "Ranging Start"
                    },
                    {
                        text: "Planogram Start",
                        value: 8,
                        color: "green",
                        friendly: "Planogram Start"
                    },
                    {
                        text: "Meeting Supplier",
                        value: 9,
                        color: "green",
                        friendly: "Meeting Supplier"
                    },
                    {
                        text: "Requesting Approval",
                        value: 10,
                        color: "green",
                        friendly: "Requesting Approval"
                    },
                    {
                        text: "Declined",
                        value: 11,
                        color: "green",
                        friendly: "Declined"
                    },
                    {
                        text: "Approved",
                        value: 12,
                        color: "green",
                        friendly: "Approved"
                    },
                    {
                        text: "Implementation Pending",
                        value: 13,
                        color: "blue",
                        friendly: "Implementation Pending"
                    },
                    {
                        text: "Variation Request",
                        value: 14,
                        color: "blue",
                        friendly: 'Variation Request'
                    },
                    {
                        text: "Implemented",
                        value: 15,
                        color: "blue",
                        friendly: "Implemented"
                    },
                    {
                        text: "On Hold",
                        value: 16,
                        color: "blue",
                        friendly: "On Hold"
                    },
                    {
                        text: "Waiting Fixture Requirements",
                        value: 17,
                        color: "blue",
                        friendly: "Waiting Fixture Requirements"
                    }, {
                        text: "Waiting Supplier",
                        value: 18,
                        color: "blue",
                        friendly: "Waiting Supplier"
                    }, {
                        text: "Awaiting Distribution",
                        value: 19,
                        color: "blue",
                        friendly: "Awaiting Distribution",
                    },
                    {
                        text: "Approval In Progress",
                        value: 20,
                        color: "blue",
                        friendly: "Approval In Progress",
                    }
                ],
                typeList: [{
                        text: "Event",
                        value: 0,
                        color: "warning"
                    },
                    {
                        text: "Data Preparation",
                        value: 1,
                        color: "green"

                    }, {
                        text: "Ranging",
                        value: 2,
                        color: "red"

                    },
                    {
                        text: "Planogram",
                        value: 3,
                        color: "blue"

                    }, {
                        text: "Promotion",
                        value: 4,
                        color: "purple"

                    }, {
                        text: "",
                        value: 5
                    }
                ],
            }
        },
        created() {
            let self = this;
            self.getTransactionsByUser()
        },
        methods: {
            getTransactionsByUser() {
                let self = this;

                let encoded_details = jwt.decode(sessionStorage.accessToken);
                let systemUserID = encoded_details.USER_ID;

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