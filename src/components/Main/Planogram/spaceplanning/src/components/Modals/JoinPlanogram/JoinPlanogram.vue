<template>
    <v-dialog v-model="dialog" fullscreen persistent scrollable>
        <v-card class="pa-0">
            <v-toolbar color="primary" dark>
                <v-toolbar-title>Join Planogram</v-toolbar-title>
            </v-toolbar>
            <v-card-text class="join-planogram-scroll">
                <v-container grid-list-md>
                    <v-layout row wrap>
                        <v-flex md8 sm12>
                            <v-autocomplete return-object v-model="selectedSpacePlans" multiple :items="spacePlans"
                                label="Planograms to merge: ">
                                <template v-slot:selection="{ item, index }">
                                    <span v-if="index == 0">{{ item.text }} </span>
                                    <span style="margin-left: 5px;" v-if="index == 1" class="grey--text caption">(+
                                        {{ selectedSpacePlans.length - 1 }} others)</span>
                                </template>
                            </v-autocomplete>
                        </v-flex>
                        <v-flex md4 sm12>
                            <v-autocomplete v-if="selectedSpacePlans.length >= 2" return-object
                                v-model="selectedRangeFile" :items="rangeFiles" label="New range file:">
                            </v-autocomplete>
                        </v-flex>
                        <v-flex md12>
                            <v-container class="pa-0" grid-list-md>
                                <v-layout column>
                                    <v-flex md6 class="pa-0" v-for="(item, idx) in selectedSpacePlans" :key="idx">
                                        <v-card dark dense flat color="primary" class="b-chip pa-0">
                                            <v-card-text class="pa-1" style="display: flex">
                                                <div style="width: 3%; margin-top: 8px; margin-left: 2%;">
                                                    {{ (idx + 1) }}
                                                </div>
                                                <div style="width: 5%">
                                                    <v-btn @click="swapIndex((idx - 1), idx)" :disabled="idx == 0"
                                                        class="pa-0 ma-0" icon>
                                                        <v-icon>arrow_upward</v-icon>
                                                    </v-btn>
                                                    <v-btn @click="swapIndex(idx, (idx + 1))"
                                                        :disabled="idx == selectedSpacePlans.length - 1"
                                                        class="pa-0 ma-0" icon>
                                                        <v-icon>arrow_downward</v-icon>
                                                    </v-btn>
                                                </div>
                                                <div style="width: 70%; margin-top: 8px;">{{ item.text }}</div>
                                                <div style="width: 20%; text-align: right;">
                                                    <v-btn @click="removeSelected(idx)" class="pa-0 ma-0"
                                                        style="margin-left: 10px;" icon>
                                                        <v-icon>close</v-icon>
                                                    </v-btn>
                                                </div>
                                            </v-card-text>
                                        </v-card>
                                    </v-flex>
                                </v-layout>
                            </v-container>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-card-text>
            <v-card-actions class="pa-0">
                <v-toolbar dark dense>
                    <v-spacer></v-spacer>
                    <v-btn :disabled="selectedSpacePlans.length < 2 || selectedRangeFile == null"
                        @click="joinPlanograms" color="primary">Join</v-btn>
                </v-toolbar>
            </v-card-actions>
        </v-card>
        <SpinnerText ref="spinner"></SpinnerText>
        <DetailsDialog ref="DetailsDialog"></DetailsDialog>
    </v-dialog>
</template>

<script>
    import Axios from 'axios';
    import SpinnerText from '@/components/Common/SpinnerText'
    import DetailsDialog from "@/components/Main/Planogram/spaceplanning/src/components/Modals/JoinPlanogram/DetailsDialog.vue";

    function TextValue(text, value) {
        this.text = text;
        this.value = value;
    }

    function TextValueArray(array, textProperty, valueProperty) {
        let tmp = [];

        array.forEach(element => {
            tmp.push(new TextValue(element[textProperty], element[valueProperty]))
        });

        return tmp;
    }

    export default {
        name: 'JoinPlanogram',
        components: {
            SpinnerText,
            DetailsDialog
        },
        data() {
            return {
                dialog: false,
                spacePlans: [],
                selectedSpacePlans: [],
                rangeFiles: [],
                selectedRangeFile: null,
                spacePlanFiles: [],
                rootPlanogramFile: null
            }
        },
        methods: {
            getSpacePlans(callback) {
                let self = this;

                self.spacePlans = [];

                Axios.get(process.env.VUE_APP_API + "SystemFile/JSON?db=CR-Devinspire&folder=Space Planning")
                    .then(r => {
                        self.spacePlans = new TextValueArray(r.data, "name", "id");
                        callback();
                    })
                    .catch(e => {
                        alert("Failed to get space plans. Please try again");
                        self.dialog = false;
                    })
            },
            getRanges(callback) {
                let self = this;

                self.rangeFiles = [];

                Axios.get(process.env.VUE_APP_API + "SystemFile/JSON?db=CR-Devinspire&folder=Ranging")
                    .then(r => {
                        self.rangeFiles = new TextValueArray(r.data, "name", "id");
                        callback();
                    })
                    .catch(e => {
                        alert("Failed to get range files. Please try again");
                        self.dialog = false;
                    })
            },
            show() {
                let self = this;

                self.getSpacePlans(() => {
                    self.getRanges(() => {
                        self.dialog = true;
                    })
                })
            },
            getSpacePlanNameByID(id) {
                let self = this;
            },
            removeSelected(idx) {
                let self = this;

                self.selectedSpacePlans.splice(idx, 1);
            },
            swapIndex(idx1, idx2) {
                let self = this;

                let rows = [self.selectedSpacePlans[idx1], self.selectedSpacePlans[idx2]];
                self.selectedSpacePlans.splice(idx1, 2, rows[1], rows[0]);
            },
            joinPlanograms() {
                let self = this;

                // self.$refs.DetailsDialog.show(data => {
                //     console.log(data);
                // })

                self.$refs.spinner.show();

                self.spacePlanFiles = [];

                self.fetchPlanogramRecursive(0, () => {
                    self.setPlanogramData(() => {
                        setTimeout(() => {
                            self.$refs.spinner.setText("Join Success");
                            setTimeout(() => {
                                self.$refs.spinner.setText("Attempting to save...");
                                setTimeout(() => {
                                    self.saveFile(() => {
                                        self.$refs.spinner.hide();
                                    })
                                }, 1000);
                            }, 1000);
                        }, 1000);
                    });
                })
            },
            fetchPlanogramRecursive(count, callback) {
                let self = this;

                let fileID = self.selectedSpacePlans[count].value;
                let text = `Fetching file ${count + 1}/${self.selectedSpacePlans.length}...`
                self.$refs.spinner.setText(text);

                Axios.get(process.env.VUE_APP_API + `SystemFile/JSON?db=CR-Devinspire&id=${fileID}`)
                    .then(r => {
                        self.spacePlanFiles.push(r.data)

                        if (count < self.selectedSpacePlans.length - 1) {
                            count++;
                            self.fetchPlanogramRecursive(count, callback)
                        } else {
                            callback();
                        }
                    })
                    .catch(e => {
                        alert("Failed to get space plan. Please try again");
                    })
            },
            setPlanogramData(callback) {
                let self = this;

                self.$refs.spinner.setText("Joining files...");

                self.rootPlanogramFile = self.spacePlanFiles[0];

                let highestHeight = parseFloat(self.rootPlanogramFile.dimensionData.height);

                for (var i = 1; i < self.spacePlanFiles.length; i++) {
                    let planogramFile = self.spacePlanFiles[i];

                    planogramFile.planogramData.forEach(element => {
                        self.rootPlanogramFile.planogramData.push(element)
                    });

                    if (parseFloat(planogramFile.dimensionData.height) > highestHeight)
                        highestHeight = parseFloat(planogramFile.dimensionData.height)

                    self.rootPlanogramFile.dimensionData.height = highestHeight.toFixed(2).toString();
                    self.rootPlanogramFile.dimensionData.width = (parseFloat(self.rootPlanogramFile.dimensionData
                        .width) + parseFloat(planogramFile.dimensionData.width)).toFixed(2).toString();
                    self.rootPlanogramFile.dimensionData.modules = parseFloat(self.rootPlanogramFile.dimensionData
                        .modules) + parseFloat(planogramFile.dimensionData.modules);
                    self.rootPlanogramFile.dimensionData.displays = parseFloat(self.rootPlanogramFile.dimensionData
                        .displays) + parseFloat(planogramFile.dimensionData.displays);
                    self.rootPlanogramFile.dimensionData.pallettes = parseFloat(self.rootPlanogramFile.dimensionData
                        .pallettes) + parseFloat(planogramFile.dimensionData.pallettes);
                    self.rootPlanogramFile.dimensionData.supplierStands = parseFloat(self.rootPlanogramFile
                        .dimensionData.supplierStands) + parseFloat(planogramFile.dimensionData.supplierStands);
                    self.rootPlanogramFile.dimensionData.bins = parseFloat(self.rootPlanogramFile.dimensionData.bins) +
                        parseFloat(planogramFile.dimensionData.bins);
                }

                self.rootPlanogramFile.clusterData.planogramName = self.selectedRangeFile.text;
                self.rootPlanogramFile.clusterData.rangeID = self.selectedRangeFile.value;
                self.rootPlanogramFile.name = self.generatePlanogramName(self.rootPlanogramFile.clusterData, self
                    .rootPlanogramFile.dimensionData);

                callback();
            },
            generatePlanogramName(clusterData, dimensionData) {
                let self = this;

                let planogramName = "";

                if (clusterData.planogramName != null)
                    planogramName += clusterData.planogramName

                if (clusterData.tag != null && clusterData.tag != "")
                    planogramName += clusterData.tag;

                if (clusterData.storeCluster != null && clusterData.storeCluster != "") {
                    planogramName += " - " + clusterData.storeCluster;
                }

                if (clusterData.storeName != null && clusterData.storeName != "") {
                    planogramName += " - " + clusterData.storeName;
                }

                if (planogramName != "")
                    planogramName += " - XXX";

                planogramName += " - " + dimensionData.modules + " Module " + "(" + dimensionData.height + "M" + " x " +
                    dimensionData.width + "M)";

                if (planogramName[1] == "-")
                    planogramName = planogramName.replace(' -', "");

                if (planogramName != "") {
                    planogramName += " - D" + dimensionData.displays;
                    planogramName += " - P" + dimensionData.pallettes;
                    planogramName += " - S" + dimensionData.supplierStands;
                    planogramName += " - B" + dimensionData.bins;
                }

                return planogramName;
            },
            saveFile(callback) {
                let self = this;

                Axios.post(process.env.VUE_APP_API + "SystemFile/Json?db=CR-Devinspire", {
                            systemFile: {
                                systemUserID: 10,
                                folder: "Space Planning",
                                name: self.rootPlanogramFile.name
                            },
                            data: self.rootPlanogramFile
                        }
                    )
                    .then(result => {
                        if (result.data.success == true) {
                            self.dialog = false;
                            alert(self.rootPlanogramFile.name + " Successfully saved new.");
                        } else {
                            self.dialog = false;
                            alert("Server responded unsuccessfully!");
                        }
                    })
                    .catch(error => {
                        self.dialog = false;
                        console.error("Failed to save planogram file");
                    });
            }
        }
    }
</script>

<style>
    .b-chip {
        margin-bottom: 1px;
    }

    .join-planogram-scroll {
        height: calc(100vh - 60px);
        overflow: auto;
    }
</style>