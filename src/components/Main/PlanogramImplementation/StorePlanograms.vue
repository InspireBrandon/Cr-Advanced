<template>
    <v-dialog persistent fullscreen v-model="allStoreDialog" flat>
        <v-card>
            <v-toolbar dark color="primary">
                <v-toolbar-title>
                    {{storeName}} Overview
                </v-toolbar-title>
                <v-spacer></v-spacer>

                <v-btn icon @click="allStoreDialog=false">
                    <v-icon>
                        close
                    </v-icon>
                </v-btn>
            </v-toolbar>
            <v-card-text style="height: calc(100vh - 120px); overflow-x: auto;">
                <v-data-table :headers="headers" :items="storePlanograms" class="elevation-1" hide-actions>
                    <template v-slot:items="props">
                        <tr>
                            <!-- <td>{{props.item.storeName}}</td>
                                <td></td>
                                <td>{{ StoreStatusList[props.item.planogramStoreStatus].text}}
                                </td>
                                <td>
                                    <v-btn @click="assignPlanogramToStore(props.item)" icon flat small color="primary">
                                        <v-icon>assignment</v-icon>
                                    </v-btn>
                                </td> -->
                        </tr>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>
<script>
    import Axios from 'axios'
    export default {
        data() {
            return {
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
                storePlanograms: [],
                storeName: null,
                allStoreDialog: false,
            }
        },
        methods: {
            open(item) {
                let self = this
                self.allStoreDialog = true
                self.storeName = item.storeName
                self.getDetails(item.store_ID)
            },
            getDetails(StoreID) {
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + `Store_Planogram?Store_ID=${StoreID}`)
                    .then(r => {
                        console.log(r.data);

                    })
            }
        }

    }
</script>