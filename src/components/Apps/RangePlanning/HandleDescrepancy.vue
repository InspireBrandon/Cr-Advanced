<template>
    <div>
        <v-dialog persistent v-model="dialog" width="700">
            <v-card>
                <v-toolbar dark flat color="primary">
                    <v-toolbar-title>Map Cluster Changes</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn flat @click="showHelpMessage">Help</v-btn>
                </v-toolbar>
                <v-card-text style="height: 500px; overflow-y: scroll;">
                    <div v-for="(unique, idx1) in uniques" :key="idx1" class="mb-2">
                        <h3>{{ unique.name }}</h3>
                        <div>
                            <v-checkbox @change="onMainChange(unique.name, idx1)" v-model="unique.storeSpecific" class="mt-0" hide-details label="Show">
                            </v-checkbox>
                        </div>
                        <table v-if="unique.storeSpecific" class="mb-3">
                            <thead>
                                <tr>
                                    <th>Store</th>
                                    <th style="width: 200px; text-align: center;">Use New Cluster Indicators?</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(descrep, idx2) in descreps" :key="idx2"
                                    v-if="descrep.clusterName == unique.name">
                                    <td>{{ descrep.storeName }}</td>
                                    <td style="text-align: center;">
                                        <span @click="descrep.newClusterIndicator = true">YES</span>
                                        <input v-model="descrep.newClusterIndicator" :value="true" class="ml-1"
                                            :name="idx2" type="radio">
                                        <span @click="descrep.newClusterIndicator = false" class="ml-4">NO</span>
                                        <input v-model="descrep.newClusterIndicator" :value="false" class="ml-1"
                                            :name="idx2" type="radio">
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div v-else class="mb-3">
                            <span @click="unique.newClusterIndicator = true; onMainChange(unique.name, idx1)">YES</span>
                            <input @change="onMainChange(unique.name, idx1)" v-model="unique.newClusterIndicator" :value="true" class="ml-1" :name="idx1 + 'a'"
                                type="radio">
                            <span @click="unique.newClusterIndicator = false; onMainChange(unique.name, idx1)" class="ml-4">NO</span>
                            <input @change="onMainChange(unique.name, idx1)" v-model="unique.newClusterIndicator" :value="false" class="ml-1" :name="idx1 + 'a'"
                                type="radio">
                        </div>
                    </div>
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
                uniques: []
            }
        },
        methods: {
            show(descreps, afterComplete) {
                let self = this;
                self.dialog = true;
                self.descreps = [];
                self.uniques = [];
                self.afterComplete = afterComplete;

                descreps.forEach(descrep => {
                    descrep.newClusterIndicator = true;
                    self.descreps.push(descrep);
                });

                let uniques = [...new Set(descreps.map(item => item.clusterName))];

                uniques.forEach(unique => {
                    self.uniques.push({
                        name: unique,
                        storeSpecific: false,
                        newClusterIndicator: true
                    })
                })
            },
            submit() {
                let self = this;
                self.dialog = false;
                self.afterComplete(self.descreps);
            },
            onMainChange(changeForCluster, idx) {
                let self = this;

                self.$nextTick(() => {
                    let item = self.uniques[idx];
                    let value = item.newClusterIndicator;

                    if(!item.storeSpecific) {
                        self.descreps.forEach(descrep => {

                            if(descrep.clusterName == item.name) {
                                descrep.newClusterIndicator = value;
                            }
                        })
                    }

                    console.log(self.descreps);
                })
            },
            showHelpMessage() {
                let self = this;

                alert("Moving a Store from one cluster to another may affect the Range Indicators of that store. When a Store Moves from one Cluster to another select YES to Receive the indicators of the Cluster it is moving to, or NO if you would like to keep the Stores current Indicators. Please Note: The Store will move Clusters regardless of the decision Taken – and All Stores will have the Cluster Names as determined by the Clustering Module. When an Entire Cluster Moves (i.e. the Cluster is being renamed) – Selecting No will leave the Indicators as they currently are for each store, but they will receive the name of the NEW CLUSTER.");
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