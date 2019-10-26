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
                            <v-checkbox @change="onMainChange(unique.name, idx1)" v-model="unique.storeSpecific" class="mt-0" hide-details label="Store Specific">
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

                alert(
                    "When updating a stores cluster the indicators of the original cluster will be affected. Using this tool you will be able to decide how you would like to handle the new indicator changes. In order to update the indicators, select yes. Otherwise select no.");
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