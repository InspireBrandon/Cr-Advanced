<template>
    <div>
        <v-dialog v-model="dialog" persistent width="800">
            <v-card>
                <v-toolbar dark color="primary" dense>
                    <v-toolbar-title>
                        FloorPlan Config
                    </v-toolbar-title>
                </v-toolbar>
                <v-container grid-list-xs>
                    <v-layout row wrap>
                        <v-flex md6>
                            <v-flex md12 style="padding: 2px;" class="px-2">
                                <v-select light placeholder="Clusters" @change="onClusterTypeChange" dense
                                    :items="clusterTypes" v-model="settings.selectedClusterType" solo hide-details>
                                </v-select>
                            </v-flex>
                            <v-flex md12 style="padding: 2px;" class="px-2 mb-1">
                                <v-select light :disabled="settings.selectedClusterType == null"
                                    :placeholder="'Select ' + settings.selectedClusterType + ' cluster'" dense
                                    :items="clusterOptions[settings.selectedClusterType]"
                                    v-model="settings.selectedClusterOption" solo hide-details>
                                </v-select>
                            </v-flex>
                        </v-flex>
                    </v-layout>
                </v-container>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="dialog=false" color="error">cancel</v-btn>
                    <v-btn @click="save" color="primary">
                        submit
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
    import axios from 'axios'
    export default {
        data() {
            return {
                dialog: false,
                callback: null,
                clusterTypes: [{
                        text: "All Stores Cluster",
                        value: "allStores"
                    },
                    {
                        text: "Select Stores",
                        value: "stores"
                    },
                    {
                        text: "Store Cluster",
                        value: "cluster"
                    },
                    {
                        text: "Department Cluster",
                        value: "department"
                    },
                    {
                        text: "Regional Cluster",
                        value: "regional"
                    },
                    {
                        text: "Custom Cluster",
                        value: "custom"
                    }
                ],
                clusterOptions: {
                    allStores: [{
                        text: "All Stores",
                        value: "allStores"
                    }],
                    category: [],
                    custom: [],
                    department: [],
                    regional: [],
                    cluster: [],
                    stores: [],
                },
                settings: {
                    selectedClusterOption: null,
                    selectedClusterType: null,
                }
            }
        },
        methods: {
            save() {
                let self = this
                self.dialog = false
                self.callback(self.settings)
            },
            open(currentSettings, callback) {
                let self = this
                self.getStores();
                self.getClusters()
                self.dialog = true
                self.callback = callback
                self.settings.selectedClusterOption = currentSettings.selectedClusterOption
                self.settings.selectedClusterType = currentSettings.selectedClusterType
            },
            getClusters() {
                let self = this
                axios.get(process.env.VUE_APP_API + `Cluster/Store`).then(r => {
                    self.clusterOptions.stores = []
                    r.data.forEach(store => {
                        self.clusterOptions.cluster.push({
                            text: store.store_Cluster,
                            value: store.id,
                        })
                    })
                })
            },
            getStores() {
                let self = this
                axios.get(process.env.VUE_APP_API + `Store?db=CR-Devinspire`).then(r => {
                    r.data.forEach(store => {
                        self.clusterOptions.stores.push({
                            text: store.storeName,
                            value: store.storeID,
                        })
                    })
                })
            },
            onClusterTypeChange() {
                let self = this;
              
            },
        }
    }
</script>