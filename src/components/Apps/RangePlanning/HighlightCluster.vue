<template>
    <v-dialog width="500px" justify-center v-model="dialog" persistent>
        <v-card>
            <v-toolbar flat dark color="primary">
                <v-toolbar-title> Clusters
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="dialog = false">
                    <v-icon>close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-card-text>
                <v-select @change="onClusterTypeChange" ref="selectClusterType" placeholder="Select cluster type" dense
                    :items="clusterTypes" v-model="selectedClusterType" required :rules="[(v) => !!v || 'Cluster Type is required']">
                </v-select>

                <v-autocomplete color="blue" :disabled="selectedClusterType == null"
                    :placeholder="'Select ' + selectedClusterType + ' cluster'" dense
                    :items="clusterOptions[selectedClusterType]" v-model="selectedClusterOption" required :rules="[(v) => !!v || 'Cluster Option is required']">
                </v-autocomplete>

                <v-select ref="selectIndicator" placeholder="Select Indicator type" dense :items="indicator"
                    v-model="selectedIndicator" required :rules="[(v) => !!v || 'Indicator is required']">
                </v-select>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="submit" flat color="primary">
                    Submit
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    import axios from 'axios';

    function textValue(data) {
        let self = this;
        self.text = data.clusterName;
        self.value = data.clusterID;
    }


    export default {
        data() {
            return {
                dialog: false,
                selectedClusterType: null,
                clusterTypes: [{
                        text: "All Stores Cluster",
                        value: "allStores"
                    },
                    {
                        text: "Store Cluster",
                        value: "store"
                    },
                    {
                        text: "Category Cluster",
                        value: "category"
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
                selectedClusterOption: 'allStores',
                clusterOptions: {
                    allStores: [],
                    category: [],
                    custom: [],
                    department: [],
                    regional: [],
                    store: []
                },
                indicator: [
                    "Yes",
                    "No",
                    "Selected",
                    "Select"
                ],
                selectedIndicator: null,
                rangingClusterData: '',
                clusterdata: [],
                afterReturn: null
            }
        },
        methods: {
            show(data, afterReturn) {
                let self = this;
                self.setRangingClusterData(data);
                self.afterReturn = afterReturn;
                self.dialog = true;
                self.reset();
            },

            reset() {
                let self = this;

                self.$refs.selectClusterType.reset();
                self.$refs.selectIndicator.reset();
            },
            setRangingClusterData(data) {
                let self = this;

                data.allStoresClusters.forEach(element => {
                    self.clusterOptions.allStores.push(new textValue(element));
                });

                data.categoryClusters.forEach(element => {
                    self.clusterOptions.category.push(new textValue(element));
                });

                data.customClusters.forEach(element => {
                    self.clusterOptions.custom.push(new textValue(element));
                });

                data.departmentClusters.forEach(element => {
                    self.clusterOptions.department.push(new textValue(element));
                });

                data.regionalClusters.forEach(element => {
                    self.clusterOptions.regional.push(new textValue(element));
                });

                data.storeClusters.forEach(element => {
                    self.clusterOptions.store.push(new textValue(element));
                });
            },
            onClusterTypeChange() {
                let self = this;

                self.selectedClusterOption = null;
            },
            submit() {
                let self = this;
                self.afterReturn({
                    selectClusterType: self.selectClusterType,
                    selectedClusterOption: self.selectedClusterOption
                })
            }
        }
    }
</script>

<style>

</style>