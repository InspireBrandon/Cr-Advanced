<template>
    <v-dialog fullscreen v-model="storeView">
        <v-card>
            <v-toolbar flat color="primary" dark>
                <v-toolbar-title>
                    Store Planogram Overview: {{ProjectName.text}}
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon flat dark @click="storeView=false">
                    <v-icon>close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-toolbar dark flat dense>
                <v-menu>
                    <v-btn slot="activator">options</v-btn>
                    <v-list>
                        <v-list-tile>asdf</v-list-tile>
                        <v-list-tile>asdf</v-list-tile>
                        <v-list-tile>asdf</v-list-tile>
                    </v-list>
                </v-menu>
            </v-toolbar>
            <v-card-text style="height: calc(100vh - 120px); overflow-x: auto;">
                <v-data-table :headers="headers" :items="currentStorePlanograms" class="elevation-1" hide-actions>
                    <template v-slot:items="props">
                        <tr>
                            <td>{{props.item.storeName}}</td>
                            <td></td>
                            <td>{{ StoreStatusList[props.item.planogramStoreStatus].text}}
                            </td>
                            <td>
                                <!-- UNASSIGNED -->
                                <v-btn @click="assignPlanogramToStore(props.item)" icon flat small color="primary">
                                    <v-icon>assignment</v-icon>
                                </v-btn>
                                <v-btn icon @click="openStoreOver(props.item)">
                                    <v-icon>
                                        more_vert
                                    </v-icon>
                                </v-btn>
                                <!-- DISTRIBUTED TO STORE -->
                            </td>
                        </tr>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>
        <StorePlanograms ref="StorePlanograms" />
        <PlanogramDetailsSelector ref="PlanogramDetailsSelector" />
    </v-dialog>
</template>
<script>
    import Axios from 'axios'
    import PlanogramDetailsSelector from '@/components/Common/PlanogramDetailsSelector'
    import StorePlanograms from './StorePlanograms.vue'


    export default {

        props: ['ProjectName', 'selectedProject'],
        components: {
            PlanogramDetailsSelector,
            StorePlanograms
        },
        data() {

            return {
                allStoreDialog: false,
                headers: [{
                    text: "Store",
                    sortable: false
                }, {
                    text: "Planogram",
                    sortable: false
                }, {
                    text: "Current Status",
                    sortable: false
                }, {
                    text: "Options",
                    sortable: false,
                    width: '280px'
                }],
                StoreStatusList: [{
                        text: "Unassigned"
                    },

                    {
                        text: "DistrubutedToStore"
                    },
                    {
                        text: "ImplementationInProgress"
                    },
                    {
                        text: "Implemented"
                    },
                    {
                        text: "VariationRequested"
                    }
                ],
                currentStorePlanograms: [],
                storeView: false,
            }
        },
        methods: {
            openStoreOver(item) {
                let self = this
                self.$refs.StorePlanograms.open(item)
                console.log(item);

            },
            getStorePlanograms() {
                let self = this
                console.log(self.selectedProject);
                
                self.currentStorePlanograms = [];

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + 'Store_Planogram?project_ID=' + self.selectedProject)
                    .then(r => {
                        console.log(r.data);

                        self.currentStorePlanograms = r.data.store_PlanogramList;
                    })
            },
            open() {
                let self = this
                
                self.storeView = true
                self.getStorePlanograms()
            },
            assignPlanogramToStore(listItem) {
                let self = this;
                self.$refs.PlanogramDetailsSelector.show(data => {
                    console.log(data);
                    console.log("listitme");
                    
                    console.log(listItem);

                    let item = {
                        "id": listItem.id,
                        "store_ID": listItem.store_ID,
                        "project_ID": self.selectedProject,
                        "planogramDetail_ID": data,
                        "planogramStoreStatus": 1,
                    }
                    Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                    Axios.post(process.env.VUE_APP_API + 'Store_Planogram/Save', item)
                        .then(r => {
                            console.log(r.data);
                            self.getStorePlanograms()
                            delete Axios.defaults.headers.common["TenantID"];
                        }).catch(e => {
                            delete Axios.defaults.headers.common["TenantID"];

                        })


                })
            },
        }
    }
</script>