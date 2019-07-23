<template>
    <div style="display: flex;">
        <v-tooltip bottom>
            <template v-slot:activator="{ on }">
                <v-btn @click="$router.push('/SpacePlanning')" class="icon_button" flat icon small>
                    <v-icon color="warning">visibility</v-icon>
                </v-btn>
            </template>
            <span>View</span>
        </v-tooltip>
        <v-tooltip bottom>
            <template v-slot:activator="{ on }">
                <v-btn @click="recall(params.data, 1)" class="icon_button" flat icon small>
                    <v-icon color="success">settings_backup_restore</v-icon>
                </v-btn>
            </template>
            <span>Recall</span>
        </v-tooltip>
        <v-tooltip bottom>
            <template v-slot:activator="{ on }">
                <v-btn @click="recall(params.data, 45)" class="icon_button" flat icon small>
                    <v-icon color="error">local_parking</v-icon>
                </v-btn>
            </template>
            <span>Recall</span>
        </v-tooltip>
        <v-tooltip bottom>
            <template v-slot:activator="{ on }">
                <div @click="replace(params.data)" class="btn_grid link" v-if="params.data.spacePlanStatus == 48 || params.data.spacePlanStatus == 13 || params.data.spacePlanStatus == 21 || params.data.spacePlanStatus == 19 || params.data.spacePlanStatus == 24">
                    <div class="btn_text">R</div>
                </div>
            </template>
            <span></span>
        </v-tooltip>
        <v-tooltip bottom>
            <template v-slot:activator="{ on }">
                <div class="btn_grid link" @click="link(params.data)" v-if="params.data.spacePlanStatus == 47">
                    <div class="btn_text">></div>
                </div>
            </template>
            <span></span>
        </v-tooltip>
        <PlanogramDetailsSelector ref="planogramDetailSelector" />

    </div>
</template>

<script>
    import Axios from 'axios';
    import jwt from 'jsonwebtoken';
    import PlanogramDetailsSelector from '@/components/Common/PlanogramDetailsSelector.vue'

    export default {
        props: ['params'],
        components: {
            PlanogramDetailsSelector
        },
        created() {},
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
            setParked(item) {
                let self = this;

                let request = JSON.parse(JSON.stringify(item))
                let tmpUser = request.systemUserID;

                request.systemUserID = tmpUser;
                request.status = 45;
                request.notes = self.findAndReplaceNote(request.notes);

                self.createProjectTransaction(request, newItem => {
                    self.$parent.$parent.getTaskViewData();
                })
            },
            checkTaskTakeover(request, callback) {
                let self = this;
                let encoded_details = jwt.decode(sessionStorage.accessToken);
                let systemUserID = encoded_details.USER_ID;

                if (request.systemUserID != systemUserID) {
                    request.systemUserID = systemUserID;
                    request.actionedByUserID = null;
                    request.status = 42;
                    request.Closed = true;

                    self.createProjectTransaction(request, () => {
                        callback();
                    })
                } else {
                    callback();
                }
            },
            replace(item) {
                let self = this
                let proTX = null
                // openOrder(data, type, title) {
                console.log("item");
                console.log(item);
                // get project transaction
                Axios.get(process.env.VUE_APP_API + `ProjectTXSingle?projectTXID=${item.txid}`)
                    .then(res => {

                        proTX = res.data.projectTX
                        // get Project  owner For task
                        self.getProjectOwner(proTX.project_ID, ownerCallback => {
                            let owner = ownerCallback.systemUserID
                            let encoded_details = jwt.decode(sessionStorage.accessToken);
                            let systemUserID = encoded_details.USER_ID;
                            let store_planos = null
                            // get all store_planograms 
                            Axios.get(process.env.VUE_APP_API +
                                    `Store_Planogram?SystemFileID=${item.planogramID}`)
                                .then(r => {

                                    store_planos = r.data.store_PlanogramList
                                    // build store array
                                    let storeArray = []
                                    for (let index = 0; index < store_planos.length; index++) {
                                        const e = store_planos[index];
                                        storeArray.push(e.store_ID)
                                    }

                                    let notes = "Replace"
                                    item.planogramStoreStatus = 5
                                    Axios.defaults.headers.common["TenantID"] = sessionStorage
                                        .currentDatabase;
                                    item.currentStatusText = "Variation"

                                    let groupRequest = {
                                        ProjectID: proTX.project_ID
                                    }

                                    let storeID = null

                                    let TXrequest = {
                                        "project_ID": proTX.project_ID,
                                        "projectTXGroup_ID": proTX.projectTXGroup_ID,
                                        "type": 3,
                                        "storeCluster_ID": item.clusterID,
                                        "store_ID": storeID,
                                        "notes": notes,
                                        "status": 14,
                                        "systemUserID": owner,
                                        "systemFileID": item.planogramID,
                                        "rangeFileID": item.rangeID,
                                    }

                                    self.createProjectTransaction(TXrequest, txCallback => {

                                        let variation_Order = {
                                            Planogram_Detail_ID: item.planogramDetailsID,
                                            Project_TX_ID: txCallback.id,
                                            DateRequested: new Date(),
                                            Status: 0,
                                        }
                                        let order_Detail = {
                                            Height: 0,
                                            Modules: 0,
                                            Notes: notes,
                                        }
                                        let stores = storeArray
                                        self.createVariationRequest(
                                            variation_Order,
                                            order_Detail,
                                            null,
                                            stores,
                                            callback => {})
                                    })
                                    delete Axios.defaults.headers.common["TenantID"];
                                })

                        })
                    })
            },
            createVariationRequest(variation_Order, order_Detail, variation_Order_Store_Links, stores, callback) {
                let self = this

                let request = {
                    Variation_Order: variation_Order,
                    Variaton_Order_Detail: order_Detail,
                    Variaton_Order_Store_Link: variation_Order_Store_Links,
                    Stores: stores
                }

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                Axios.post(process.env.VUE_APP_API + 'Variation_Order', request).then(r => {
                    callback()
                    delete Axios.defaults.headers.common["TenantID"];
                })
            },
            getProjectOwner(projectID, callback) {
                let self = this
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                Axios.get(process.env.VUE_APP_API + `Project?projectID=${projectID}`).then(r => {
                    console.log(r.data)
                    callback(r.data.projectList[0])
                }).catch(e => {
                    alert("Failed to get project owner: " + e)
                })
            },
            link(item) {
                let self = this


                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                Axios.post(process.env.VUE_APP_API +
                    `Variation_Order?projectTXID=${item.txid}&systemFileID=${item.planogramID}`).then(
                    r => {
                        Axios.get(process.env.VUE_APP_API + `ProjectTXSingle?projectTXID=${item.txid}`)
                            .then(res => {
                                let request = JSON.parse(JSON.stringify(res.data.projectTX))

                                let tmpUser = request.systemUserID;
                                self.checkTaskTakeover(request, () => {
                                    request.systemUserID = tmpUser;
                                    request.status = 48;
                                    self.createProjectTransaction(request, newItem => {})
                                })

                                delete Axios.defaults.headers.common["TenantID"];
                            })
                    })
            },
            recall(item, status) {
                let self = this

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.post(process.env.VUE_APP_API + `Store_Planogram/ReCall?SystemFileID=${item.planogramID}`).then(
                    r => {

                        Axios.post(process.env.VUE_APP_API +
                                `SystemFile/UpdateStatus?db=CR-Devinspire&systemFileID=${item.planogramID}&newStatus=1`
                            )
                            .then(nsr => {
                                Axios.get(process.env.VUE_APP_API + `ProjectTXSingle?projectTXID=${item.txid}`)
                                    .then(res => {
                                        let request = JSON.parse(JSON.stringify(res.data.projectTX))

                                        let tmpUser = request.systemUserID;
                                        self.checkTaskTakeover(request, () => {
                                            request.systemUserID = tmpUser;
                                            request.status = status;
                                            request.projectTXGroup_ID = item.projectTXGroup_ID
                                            self.createProjectTransaction(request, newItem => {})
                                        })

                                        delete Axios.defaults.headers.common["TenantID"];
                                    })
                            })
                    })
            }
        }
    }
</script>

<style scoped>
    .icon_button {
        margin: 1px;
    }

    .start {
        background: #ff7200;
        border: 1px solid grey;
        color: white;
    }

    .link {
        background: #fff;
        border: 1px solid blue;
        color: blue;
    }

    .btn_grid {
        height: 20px;
        border-radius: 3px;
        margin-top: 1px;
        text-align: center;
        font-size: 18px;
        width: 20px;
        font-weight: 600;
        margin: 8px 3px;
    }

    .start:hover {
        background: #c75a00;
        cursor: pointer;
    }

    .link:hover {
        background: rgb(235, 235, 235);
        cursor: pointer;
    }

    .btn_text {
        margin-top: -5px;
    }
</style>