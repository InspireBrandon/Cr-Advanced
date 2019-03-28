<template>
    <v-card>
        <v-progress-linear v-if="showLoader" class="ma-0" color="primary" indeterminate height="5"></v-progress-linear>
        <v-container v-show="!showLoader" grid-list-md>
            <v-layout row wrap>
                <v-flex lg3 md4 sm12 xs12>
                    Store
                    <v-autocomplete placeholder="Please select a store..." @change="getPlanogramsByStore" v-model="selectedStore"
                        :items="storesDropdown" solo light :disabled="storeDisabled"></v-autocomplete>
                </v-flex>
                <v-flex lg9 md8 sm12 xs12></v-flex>
                <v-flex v-if="selectedStore != null && planogramsList.length == 0" lg9 md4 sm12 xs12>
                    No planograms found for selected store
                </v-flex>
                <v-flex v-if="selectedStore != null && planogramsList.length > 0" lg9 md4 sm12 xs12>
                    <v-card>
                        <v-toolbar dark color="primary" flat dense>Planograms <v-spacer></v-spacer>
                            <!-- <v-btn flat outline @click="$router.push(`/PlanogramImplementation/RequestNewPlanogram/`+null)">Request
                                new</v-btn> -->
                        </v-toolbar>
                        <v-data-table hide-actions :headers="headers" :items="planogramsList" class="elevation-1">
                            <template v-slot:items="props">
                                <tr @click.prevent="selectPlanogram(props.item)">
                                    <td>{{ props.item.name }}</td>
                                    <td>{{status[props.item.status].friendy}}</td>
                                    <td>
                                        <v-menu>
                                            <v-btn slot="activator" class="pa-0 ma-0" icon>
                                                <v-icon>more_vert</v-icon>
                                            </v-btn>
                                            <v-list dense>
                                                <v-list-tile avatar v-if="props.item.status==0">
                                                    <v-list-tile-avatar>
                                                        <v-icon>share</v-icon>
                                                    </v-list-tile-avatar>
                                                    <v-list-tile-content>
                                                        <v-list-tile-title>No options</v-list-tile-title>
                                                    </v-list-tile-content>
                                                </v-list-tile>
                                                <v-list-tile avatar v-if="props.item.status==4" @click="implementPlano(props.item)">
                                                    <v-list-tile-avatar>
                                                        <v-icon>share</v-icon>
                                                    </v-list-tile-avatar>
                                                    <v-list-tile-content>
                                                        <v-list-tile-title>Implement Planogram</v-list-tile-title>
                                                    </v-list-tile-content>
                                                </v-list-tile>
                                                <v-list-tile avatar v-if="props.item.status==2" @click="ApprovePlano(props.item)">
                                                    <v-list-tile-avatar>
                                                        <v-icon>share</v-icon>
                                                    </v-list-tile-avatar>
                                                    <v-list-tile-content>
                                                        <v-list-tile-title>Approve</v-list-tile-title>
                                                    </v-list-tile-content>
                                                </v-list-tile>
                                                <v-list-tile v-if="props.item.status==2" avatar @click="$router.push(`/PlanogramImplementation/RequestNewPlanogram/`+props.item.id)">
                                                    <v-list-tile-avatar>
                                                        <v-icon>share</v-icon>
                                                    </v-list-tile-avatar>
                                                    <v-list-tile-content>
                                                        <v-list-tile-title>Request Variation</v-list-tile-title>
                                                    </v-list-tile-content>
                                                </v-list-tile>
                                            </v-list>
                                        </v-menu>
                                    </td>
                                </tr>
                            </template>
                        </v-data-table>

                    </v-card>
                    <v-layout>
                        <v-flex v-if="selectedPlanogram != null" lg4 md4 sm12 xs12 @click="openImage">
                            <v-card light>
                                <v-toolbar color="primary" dark flat dense>
                                    Planogram Image
                                    <v-spacer></v-spacer>
                                    <v-tooltip bottom>
                                        <v-btn icon slot="activator" @click="downloadImage">
                                            <v-icon>save_alt</v-icon>
                                        </v-btn>
                                        <span>downoad planogram image</span>
                                    </v-tooltip>
                                </v-toolbar>
                                <v-card-text>
                                    <v-img style="max-width: 200px; max-height: 200px;" :src="image"></v-img>
                                </v-card-text>
                            </v-card>
                        </v-flex>
                        <v-flex v-if="selectedPlanogram != null" lg8 md4 sm12 xs12>
                            <v-card>
                                <v-toolbar dark color="primary" flat dense>Reports</v-toolbar>
                                <v-list light dense>
                                    <v-list-tile @click="goToReport('ProductReport')">
                                        <v-list-tile-title>Product Report</v-list-tile-title>
                                    </v-list-tile>
                                    <v-divider></v-divider>
                                    <v-list-tile @click="goToReport('FixtureReport')">
                                        <v-list-tile-title>Fixture Report</v-list-tile-title>
                                    </v-list-tile>
                                    <v-divider></v-divider>
                                    <v-list-tile @click="goToReport('ProductFixtureReport')">
                                        <v-list-tile-title>Product Fixture Report</v-list-tile-title>
                                    </v-list-tile>
                                    <v-divider></v-divider>
                                </v-list>
                            </v-card>
                        </v-flex>
                    </v-layout>
                </v-flex>
                <v-flex v-if="selectedPlanogram != null" lg3 md4 sm12 xs12>
                    <v-card class="mx-auto" max-width="400">
                        <v-card dark color="primary">
                            <v-card-title>
                                <h3 class="title font-weight-light text-xs-center grow">Status Timeline</h3>
                            </v-card-title>
                        </v-card>
                        <v-card-text class="py-0">
                            <v-timeline align-top dense>
                                <v-timeline-item v-for="(item,index) in timelineItems" :key="index" :color="status[item.status].color"
                                    small>
                                    <v-layout pt-3>
                                        <v-flex xs3>
                                            <div class="caption">{{item.date}}</div>


                                        </v-flex>
                                        <v-spacer></v-spacer>
                                        <v-flex>
                                            <strong>{{status[item.status].friendy}}</strong>
                                            <div class="caption">{{item.notes}}</div>
                                        </v-flex>
                                    </v-layout>
                                </v-timeline-item>


                            </v-timeline>
                        </v-card-text>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
        <v-dialog fullscreen v-model="imageModal">
            <v-card>
                <v-toolbar dark color="primary" prominent>
                    <v-spacer></v-spacer>
                    <v-btn @click="imageModal = false" icon>
                        <v-icon>close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card flat style="padding: 5px;">
                    <img style="max-height: calc(100vh - 80px); max-width: 1000px;" :src="image">
                </v-card>
            </v-card>
        </v-dialog>
    </v-card>
</template>

<script>
    import Axios from 'axios';
    import jwt from 'jsonwebtoken';
    
    export default {
        data: () => {
            return {
                showLoader: true,
                status: [{
                    type: 0,
                    friendy: "New",
                    color: "blue"
                }, {
                    type: 1,
                    color: "blue",
                    friendy: "In Progress"
                }, {
                    type: 2,
                    color: "blue",
                    friendy: "Requsting Approval"
                }, {
                    type: 3,
                    color: "red",
                    friendy: "Variation Requested"
                }, {
                    type: 4,
                    color: "green",
                    friendy: "Approved"
                }, {
                    type: 5,
                    color: "green",
                    friendy: "Implemented"
                }],
                timelineItems: [],
                headers: [{
                    text: "Name",
                    value: name
                }, {
                    text: "Status",
                    value: name
                }, {
                    text: "Actions",
                    value: name
                }],
                imageModal: false,
                stores: [],
                storesDropdown: [],
                selectedStore: null,
                planograms: [],
                planogramsList: [],
                selectedPlanogram: null,
                image: '',
                storeDisabled: false
            }
        },
        created() {
            let self = this;
            self.getStores();
        },
        methods: {
            getAccessType() {
                let self = this
                let encoded_details = jwt.decode(sessionStorage.accessToken);
                   Axios.get(process.env.VUE_APP_API +
                        `TenantLink_AccessType?systemUserID=${encoded_details.USER_ID}&tenantID=${sessionStorage.currentDatabase}`)
                    .then(r => {
                        if (r.data.tenantLink_AccessTypeList.length > 0) {
                            let item = r.data.tenantLink_AccessTypeList[0];

                            if(item.accessType == 3) {
                                self.selectedStore = item.storeID;
                                self.storeDisabled = true;
                                self.getPlanogramsByStore();
                            }
                        }

                        self.showLoader = false;
                    })
            },
            goToReport(reportName) {
                let self = this
                self.$router.push(`/Reports/SpacePlanning/${reportName}/` + self.selectedPlanogram.id)

            },
            openImage() {
                this.imageModal = true;
            },
            getStores() {
                let self = this;
                Axios.get(process.env.VUE_APP_API + 'Store?db=CR-DEVINSPIRE')
                    .then(r => {
                        self.stores = r.data;

                        r.data.forEach(element => {

                            self.storesDropdown.push({
                                text: element.storeName,
                                value: element.storeID
                            })
                        });

                        self.getPlanograms();
                    })
            },
            getPlanograms() {
                let self = this;

                Axios.get(process.env.VUE_APP_API + 'SystemFile/JSON?db=CR-DEVINSPIRE&folder=SPACE PLANNING')
                    .then(r => {
                        self.planograms = r.data;

                        self.getAccessType();
                    })
            },
            getPlanogramsByStore() {
                let self = this;
                self.selectedPlanogram = null;
                self.$nextTick(() => {
                    let cluster = "";

                    self.stores.forEach(store => {
                        if (store.storeID == self.selectedStore) {
                            cluster = store.storeClusterName;
                        }
                    })

                    let tmpPlanograms = [];

                    self.planograms.forEach(planogram => {
                        if (planogram.name.includes(cluster)) {
                            tmpPlanograms.push(planogram);
                        }
                    })

                    self.planogramsList = tmpPlanograms;
                })
            },
            ApprovePlano(item, index) {
                let self = this
                let systemFileApproval = {
                    systemFile_ID: item.id,
                    status: 4,
                    transactionDateTime: new Date(),
                    notes: null
                }

                item.status = 4
                Axios.post(process.env.VUE_APP_API + "SystemFileApproval?db=CR-Devinspire", {
                    systemFileApproval: systemFileApproval
                }).then(
                    r => {})
            },
            implementPlano(item, index) {
                let self = this
                let systemFileApproval = {
                    systemFile_ID: item.id,
                    status: 5,
                    transactionDateTime: new Date(),
                    notes: null
                }
                item.status = 5
                Axios.post(process.env.VUE_APP_API + "SystemFileApproval?db=CR-Devinspire", {
                    systemFileApproval: systemFileApproval
                }).then(
                    r => {})
            },
            selectPlanogram(planogram) {
                let self = this;

                self.selectedPlanogram = planogram;

                Axios.get(process.env.VUE_APP_API + 'SystemFile/JSON?db=CR-DEVINSPIRE&id=' + planogram.id)
                    .then(r => {
                        console.log(r.data)
                        self.image = r.data.image;

                        Axios.get(process.env.VUE_APP_API +
                            `SystemFileApproval?db=CR-DEVINSPIRE&systemFileID=${planogram.id}`).then(resp => {

                            self.timelineItems = []

                            resp.data.systemFileApprovalList.forEach(element => {
                                self.timelineItems.push({
                                    status: element.status,
                                    notes: element.notes,
                                    date: element.transactionDateTime
                                })
                            })
                            self.timelineItems.sort(function (a, b) {


                                a = new Date(a.date);
                                b = new Date(b.date);
                                return a > b ? -1 : a < b ? 1 : 0;
                            });

                        })
                    })
            },
            downloadImage() {
                let self = this;
            }
        }
    }
</script>

<style>
    .selected-planogram {
        background: 'black';
    }
</style>