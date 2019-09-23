<template>
    <div>
        <v-dialog v-model="dialog" width="1200" persistent>
            <v-card>
                <v-toolbar dark flat color="primary">
                    <v-toolbar-title>Custom Cluster Setup</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon @click.native="dialog = false">
                        <v-icon>close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-text style="height: 615px;">
                    <v-container grid-list-md class="pa-0">
                        <v-layout row wrap>
                            <v-flex md12>
                                <v-radio-group v-model="clusterType">
                                    <v-radio :value="0" label="Store Cluster"></v-radio>
                                    <v-radio :value="1" label="Custom Cluster"></v-radio>
                                </v-radio-group>
                            </v-flex>
                            <v-flex md12 style="height: 56px;">
                                <v-autocomplete class="pt-0" v-if="clusterType == 1" return-object :items="planograms" v-model="selectedPlanogram"
                                    style="width: 300px" placeholder="Select a planogram" dense hide-details>
                                </v-autocomplete>
                            </v-flex>
                            <v-flex md12 v-if="clusterType != null">
                                <v-switch v-model="useSystemValues" hide-details label="Use system values"></v-switch>
                            </v-flex>
                            <v-flex md4 class="mt-3" v-if="clusterType != null">
                                <v-toolbar dark flat dense color="primary">
                                    <v-toolbar-title>Fields</v-toolbar-title>
                                </v-toolbar>
                                <div style="height: 300px; overflow-y: scroll;">
                                    <v-checkbox color="primary" v-for="(item, idx) in items" :key="idx"
                                        v-model="selected" :value="item" hide-details :label="item"></v-checkbox>
                                </div>
                            </v-flex>
                            <v-flex md8 class="mt-3" v-if="clusterType != null">
                                <v-toolbar dark flat dense color="primary">
                                    <v-toolbar-title>Selected</v-toolbar-title>
                                </v-toolbar>
                                <div style="height: 300px; overflow-y: scroll;">
                                    <v-card flat>
                                        <v-list dense>
                                            <v-list-tile v-for="(item, idx) in selected" :key="idx">
                                                <v-list-tile-avatar>{{ (idx + 1) }}</v-list-tile-avatar>
                                                <v-list-tile-content>{{ item }}</v-list-tile-content>
                                                <v-btn @click="swapUp(idx)" flat small :disabled="idx == 0"
                                                    style="width: 30px">
                                                    <v-icon>arrow_upward</v-icon>
                                                </v-btn>
                                                <v-btn @click="swapDown(idx)" flat small style="width: 30px"
                                                    :disabled="idx == selected.length - 1">
                                                    <v-icon>arrow_downward</v-icon>
                                                </v-btn>
                                                <v-icon @click="remove(idx)">close</v-icon>
                                            </v-list-tile>
                                        </v-list>
                                    </v-card>
                                </div>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card-text>
                <v-divider class="mx-2"></v-divider>
                <v-card-actions>
                    <div v-if="clusterType == null" style="color: red">Please select store or custom cluster</div>
                    <div v-if="clusterType == 1 && selectedPlanogram == null" style="color: red">Please select a planogram</div>
                    <div v-if="clusterType == 1 && selectedPlanogram != null && selected.length == 0" style="color: red">Please select at least one field</div>
                    <div v-if="clusterType == 0 && selected.length == 0" style="color: red">Please select at least one field</div>
                    <v-spacer></v-spacer>
                    <v-btn v-if="clusterType == null" disabled>Continue</v-btn>
                    <v-btn v-if="clusterType == 1" :disabled="selectedPlanogram == null || selected.length == 0" color="primary" @click="returnSetupConfig">Continue</v-btn>
                    <v-btn v-if="clusterType == 0" :disabled="selected.length == 0" color="primary" @click="returnSetupConfig">Continue</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import Axios from 'axios';

    const clusterTypes = ["store", "custom"]

    export default {
        data() {
            return {
                dialog: false,
                afterComplete: null,
                selected: [],
                planograms: [],
                selectedPlanogram: null,
                items: [],
                useSystemValues: false,
                clusterType: null
            }
        },
        methods: {
            show(items, afterComplete) {
                let self = this;
                self.getPlanograms();
                self.selectedPlanogram = null;
                self.items = [];
                self.useSystemValues = false;
                self.selected = [];
                self.dialog = true;

                items = JSON.parse(JSON.stringify(items))

                items = items.splice(4, items.length - 1);

                // self.items.push("Store Cluster");

                items.forEach(el => {
                    self.items.push(el.headerName);
                })

                self.afterComplete = afterComplete;
            },
            returnSetupConfig() {
                let self = this;

                if (self.clusterType == 1 && self.selectedPlanogram == null) {
                    alert("Please select a planogram");
                } else {
                    self.dialog = false;
                    self.afterComplete({
                        clusterType: self.clusterType,
                        selectedPlanogram: self.selectedPlanogram,
                        selectedItems: self.selected,
                        useSystemValues: self.useSystemValues
                    });
                }
            },
            remove(idx) {
                let self = this;
                self.selected.splice(idx, 1);
            },
            swapUp(index) {
                let self = this;

                let aboveIndex = index - 1;

                self.swapArrayElements(index, aboveIndex);
            },
            swapDown(index) {
                let self = this;

                let belowIndex = index + 1;

                self.swapArrayElements(belowIndex, index);
            },
            swapArrayElements(indexA, indexB) {
                let self = this;
                let tmpArr = JSON.parse(JSON.stringify(self.selected));

                var temp = tmpArr[indexA];
                tmpArr[indexA] = tmpArr[indexB];
                tmpArr[indexB] = temp;

                self.selected = tmpArr;
            },
            getPlanograms() {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + `Planogram/Distinct`)
                    .then(r => {
                        delete Axios.defaults.headers.common["TenantID"];
                        self.planograms = TextValueArray(r.data.planogramList, 'displayname', 'planogram_ID');
                    })
            }
        }
    }

    function TextValueArray(arr, text, value) {
        let tmp = [];

        arr.forEach(element => {
            tmp.push({
                text: element[text],
                value: element[value],
            })
        });

        return tmp;
    }
</script>