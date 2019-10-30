<template>
    <div>
        <v-dialog persistent v-model="dialog" width="1000">
            <v-card>
                <v-toolbar dark flat color="primary">
                    <v-toolbar-title>Map Cluster Changes</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn flat @click="showHelpMessage">Help</v-btn>
                </v-toolbar>
                <v-card-text style="height: 500px; overflow-y: scroll;">
                    <table class="mb-3">
                        <thead>
                            <tr>
                                <th>Store</th>
                                <th>Update Type</th>
                                <th>Previous Cluster</th>
                                <th>New Cluster</th>
                                <th style="width: 200px; text-align: center;">Use New Cluster Indicators?</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(descrep, idx2) in descreps" :key="idx2">
                                <td>{{ descrep.storeName }}</td>
                                <td style="padding: 2px;">
                                    <select @change="onTypeChange(descrep)" v-model="descrep.type" style="width: 100%;">
                                        <option :value="type" v-for="type in descrep.types" :key="type">{{ type }}
                                        </option>
                                    </select>
                                </td>
                                <td>{{ descrep.clusterName }}</td>
                                <td>{{ descrep.newClusterName }}</td>
                                <td style="text-align: center;">
                                    <span @click="descrep.newClusterIndicator = true">YES</span>
                                    <input v-model="descrep.newClusterIndicator" :value="true" class="ml-1" :name="idx2"
                                        type="radio">
                                    <span @click="descrep.newClusterIndicator = false" class="ml-4">NO</span>
                                    <input v-model="descrep.newClusterIndicator" :value="false" class="ml-1"
                                        :name="idx2" type="radio">
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="submit">Continue</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                dialog: false,
                descreps: [],
                allDescreps: []
            }
        },
        methods: {
            show(descreps, afterComplete) {
                let self = this;
                self.dialog = true;
                self.descreps = [];
                self.afterComplete = afterComplete;

                let uniqueStores = [];

                self.allDescreps = descreps;

                descreps.forEach(descrep => {
                    let canAdd = true;

                    uniqueStores.forEach(uniqueStore => {
                        if (uniqueStore.storeID == descrep.storeID)
                            canAdd = false;
                    });

                    if (canAdd) {
                        uniqueStores.push({
                            storeName: descrep.storeName,
                            storeID: descrep.storeID
                        })
                    }
                })

                uniqueStores.forEach(us => {
                    us.newClusterIndicator = true;
                    us.types = [];

                    descreps.forEach(descrep => {
                        if (descrep.storeID == us.storeID) {
                            us.types.push(descrep.type)
                        }
                    })

                    us.type = null;
                    us.type = us.types[0];

                    let clusterDetails = self.getClusterData(us);

                    us.clusterName = clusterDetails.clusterName;
                    us.clusterID = clusterDetails.clusterID;
                    us.newClusterName = clusterDetails.newClusterName;
                    us.newClusterID = clusterDetails.newClusterID;

                    self.descreps.push(us);
                });
            },
            submit() {
                let self = this;
                self.dialog = false;
                self.afterComplete(self.descreps);
            },
            onTypeChange(element) {
                let self = this;

                self.$nextTick(() => {
                    let cd = self.getClusterData(element);

                    element.clusterName = cd.clusterName;
                    element.clusterID = cd.clusterID;
                    element.newClusterName = cd.newClusterName;
                    element.newClusterID = cd.newClusterID;
                })
            },
            getClusterData(element) {
                let self = this;

                let type = element.type;
                let storeID = element.storeID;

                let finder = self.allDescreps.find(e => {
                    return (e.type == type && e.storeID == storeID);
                })

                return finder;
            },
            onMainChange(changeForCluster, idx) {
                let self = this;

                self.$nextTick(() => {
                    let item = self.uniques[idx];
                    let value = item.newClusterIndicator;

                    if (!item.storeSpecific) {
                        self.descreps.forEach(descrep => {

                            if (descrep.clusterName == item.name) {
                                descrep.newClusterIndicator = value;
                            }
                        })
                    }
                })
            },
            showHelpMessage() {
                let self = this;
                alert(
                    "Moving a Store from one cluster to another may affect the Range Indicators of that store. When a Store Moves from one Cluster to another select YES to Receive the indicators of the Cluster it is moving to, or NO if you would like to keep the Stores current Indicators. Please Note: The Store will move Clusters regardless of the decision Taken – and All Stores will have the Cluster Names as determined by the Clustering Module. When an Entire Cluster Moves (i.e. the Cluster is being renamed) – Selecting No will leave the Indicators as they currently are for each store, but they will receive the name of the NEW CLUSTER."
                );
            }
        }
    }
</script>

<style scoped>
    table {
        border-collapse: collapse;
        width: 100%;
    }

    table,
    td,
    th {
        border: 1px solid gray;
    }

    td {
        background: white;
        color: black;
        padding: 2px 5px;
    }

    th {
        text-align: left;
        background: black;
        color: white;
        padding: 2px;
        border: 1px solid gray;
    }
</style>