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
                                label="Planograms">
                                <template v-slot:selection="{ item, index }">
                                    <span v-if="index == 0">{{ item.text }} </span>
                                    <span v-if="index == 1" class="grey--text caption">(+
                                        {{ selectedSpacePlans.length - 1 }} others)</span>
                                </template>
                            </v-autocomplete>
                        </v-flex>
                        <v-flex md4 sm12>
                            <v-autocomplete return-object v-model="selectedRangeFile" :items="rangeFiles" label="Range">
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
                    <v-btn @click="joinPlanograms" color="primary">Join</v-btn>
                </v-toolbar>
            </v-card-actions>
        </v-card>
        <Spinner ref="spinner"></Spinner>
    </v-dialog>
</template>

<script>
    import Axios from 'axios';
    import Spinner from '@/components/Common/Spinner'

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
        components: { Spinner },
        data() {
            return {
                dialog: false,
                spacePlans: [],
                selectedSpacePlans: [],
                rangeFiles: [],
                selectedRangeFile: null
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

                self.$refs.spinner.show();
            }
        }
    }
</script>

<style>
    .b-chip {
        margin-bottom: 2px;
    }

    .b-chip-text {
        width: 90%;
    }

    .b-chip-close {
        width: 10%;
        text-align: right;
    }

    .join-planogram-scroll {
        height: calc(100vh - 60px);
        overflow: auto;
    }
</style>