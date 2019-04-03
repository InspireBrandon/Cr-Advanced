<template>
    <v-card>
        <v-progress-linear v-if="showLoader" class="ma-0" color="primary" indeterminate height="5"></v-progress-linear>
        <v-container v-show="!showLoader" grid-list-md>
            <v-layout row wrap>
                <v-flex lg3 md4 sm12 xs12>
                    Store
                    <v-autocomplete placeholder="Please select a store..." @change="getPlanogramsByStore" v-model="selectedStore"
                        :items="storesDropdown" solo light :disabled="storeDisabled">
                    </v-autocomplete>
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
                        <v-autocomplete placeholder="Please select a Planogram..." @change="selectPlanogram(selectedPlanogram)"
                            v-model="selectedPlanogram" :items="planogramsList" solo light :disabled="storeDisabled">
                        </v-autocomplete>
                        <div v-if="selectedPlanoList!=null">



                            <v-flex v-if="selectedPlanoList!=null">Status: {{status[selectedPlanoList.status == null ?
                                2 :
                                selectedPlanoList.status].friendy}} </v-flex>
                            <v-btn v-if="selectedPlanoList.status==4" @click="implementPlano(selectedPlanoList)">
                                Implement Planogram
                            </v-btn>
                            <v-flex>
                                <v-btn v-if="selectedPlanoList.status==2 " @click="ApprovePlano(selectedPlanogram)">
                                    Approve
                                </v-btn>
                                <v-btn v-if="selectedPlanoList.status==2 ||selectedPlanoList.status==null" avatar
                                    @click="$router.push(`/PlanogramImplementation/RequestNewPlanogram/`+selectedPlanoList.id)">
                                    Request Variation
                                </v-btn>
                            </v-flex>

                        </div>

                        <!-- <v-data-table hide-actions :headers="headers" :items="planogramsList" class="elevation-1">
                            <template v-slot:items="props">
                                <tr @click.prevent="selectPlanogram(props.item)">
                                    <td>{{ props.item.name }}</td>
                                    <td>{{status[props.item.status == null ? 2 : props.item.status].friendy}}</td>
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
                        </v-data-table> -->

                    </v-card>
                    <v-layout row wrap>
                        <v-flex v-if="selectedPlanogram != null" lg8 md8 sm12 xs12 @click="openImage">
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
                                    <v-img contain style="max-height: 400px;" :src="image"></v-img>
                                </v-card-text>
                            </v-card>
                        </v-flex>
                        <v-flex v-if="selectedPlanogram != null" lg4 md4 sm12 xs12>
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
                    <v-img contain style="max-height: calc(100vh - 80px); width: 100%;" :src="image"></v-img>
                </v-card>
            </v-card>
        </v-dialog>
        <PlanogramAprovalModal ref="PlanogramAprovalModal"></PlanogramAprovalModal>
    </v-card>

</template>

<script>
    import Axios from 'axios';
    import jwt from 'jsonwebtoken';
    import PlanogramAprovalModal from './PlanogramIplementationModal';


    export default {
        components: {
            PlanogramAprovalModal
        },
        data: () => {
            return {
                accessType: null,
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
                PlanoList: [],
                selectedPlanoList: null,
                stores: [],
                storesDropdown: [],
                selectedStore: null,
                planograms: [],
                planogramsList: [],
                selectedPlanogram: null,
                image: '',
                storeDisabled: false,
                spacePlanID: null,
            }
        },
        created() {},
        mounted() {
            let self = this;

            self.getStores();
        },
        methods: {

            getAccessType() {
                let self = this
                let encoded_details = jwt.decode(sessionStorage.accessToken);
                Axios.get(process.env.VUE_APP_API +
                        `TenantLink_AccessType?systemUserID=${encoded_details.USER_ID}&tenantID=${sessionStorage.currentDatabase}`
                    )
                    .then(r => {
                        console.log(r.data);

                        if (r.data.isDatabaseOwner) {
                            self.accessType = 0
                        } else {
                            self.accessType = r.data.tenantLink_AccessTypeList[0]

                        }

                        if (r.data.isDatabaseOwner) {
                            self.getPlanogramsByStore();
                        } else {
                            if (r.data.tenantLink_AccessTypeList != null && r.data.tenantLink_AccessTypeList.length >
                                1) {
                                let item = r.data.tenantLink_AccessTypeList[0];




                                if (item.accessType == 2) {
                                    // store
                                    self.selectedStore = item.storeID;
                                    self.storeDisabled = true;
                                    self.getPlanogramsByStore();
                                } else {
                                    self.getPlanogramsByStore();
                                }
                            } else {
                                self.getPlanogramsByStore();
                            }
                        }

                        self.showLoader = false;
                    }).catch(e => {
                        self.accessType = -1
                        self.showLoader = false;
                    })
            },
            goToReport(reportName) {
                let self = this
                self.$router.push(`/Reports/SpacePlanning/${reportName}/` + self.selectedPlanogram)

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
            getPlanogramsByStore(type) {
                let self = this;
                let encoded_details = jwt.decode(sessionStorage.accessToken);
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
                            if (self.accessType.accessType == 3 && (planogram.status == 4 || planogram.status ==
                                    5)) {
                                console.log("Store User");
                                if (self.accessType.storeID == planogram.storeID) {
                                    tmpPlanograms.push({
                                        text: planogram.name,
                                        value: planogram.id
                                    });
                                }

                            }
                            if (self.accessType.accessType == 1 && (planogram.status == 2 || planogram.status ==
                                    5)) {
                                console.log("buyer User");
                                if (encoded_details.USER_ID == planogram.buyerID) {
                                    tmpPlanograms.push({
                                        text: planogram.name,
                                        value: planogram.id
                                    });
                                }
                            }
                            if (self.accessType == 0) {

                                tmpPlanograms.push({
                                    text: planogram.name,
                                    value: planogram.id
                                });


                            }

                            self.PlanoList.push(planogram)
                        }
                    })


                    console.log(self.planograms);


                    self.planogramsList = tmpPlanograms;
                })
            },
            ApprovePlano(item) {
                let self = this
                var tmp = null
                self.planograms.forEach(p => {
                    if (p.id == item) {
                        tmp = p
                    }
                })

                self.$refs.PlanogramAprovalModal.show('Submit planogram for aproval?', (value, notesModal, selectedUser) => {

                    if (value == true) {
                        if (item != null) {


                            let systemFileApproval = {
                                systemFile_ID: item,
                                status: 4,
                                transactionDateTime: new Date(),
                                notes: notesModal,

                            }

                            // axios.put(process.env.VUE_APP_API+`SystemFileApproval?db=CR-Devinspire&buyerID=`+self.spacePlanID,{})


                            Axios.post(process.env.VUE_APP_API + "SystemFileApproval?db=CR-Devinspire&buyerID=" +
                                tmp.buyerID + "&storeID=" +
                                selectedUser, {
                                    systemFileApproval: systemFileApproval
                                }).then(
                                r => {

                                    self.planograms.forEach(p => {
                                        if (p.id == systemFileApproval.systemFile_ID) {
                                            p.status = systemFileApproval.status
                                        }
                                    })
                                })
                        }
                    }
                })
            },
            implementPlano(item) {
                let systemFileApproval = {
                    systemFile_ID: item.id,
                    status: 5,
                    transactionDateTime: new Date(),
                    notes: null
                }
                let encoded_details = jwt.decode(sessionStorage.accessToken);
                item.status = 5
                Axios.post(process.env.VUE_APP_API + "SystemFileApproval?db=CR-Devinspire&buyerID=" +
                    item.buyerID + "&storeID=" +
                    encoded_details.USER_ID, {
                        systemFileApproval: systemFileApproval
                    }).then(
                    r => {})
            },
            selectPlanogram(planogram) {
                let self = this;
                self.$nextTick(() => {
                    self.selectedPlanogram = planogram;



                    self.PlanoList.forEach(item => {

                        if (item.id == planogram) {


                            self.selectedPlanoList = item
                        }
                    })
                    Axios.get(process.env.VUE_APP_API + 'SystemFile/JSON?db=CR-DEVINSPIRE&id=' + planogram)
                        .then(r => {
                            self.image = r.data.image;
                            console.log(r.data);
                            
                            Axios.get(process.env.VUE_APP_API +
                                `SystemFileApproval?db=CR-DEVINSPIRE&systemFileID=${planogram}`).then(
                                resp => {

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