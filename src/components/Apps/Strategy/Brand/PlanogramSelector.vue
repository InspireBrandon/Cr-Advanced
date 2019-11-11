<template>
    <div>
        <v-dialog v-model="dialog" width="700">
            <v-card height="400px" style="overflow: auto;">
                <v-card-title style="text-align: center; display: block;" class="headline pa-0">
                    <v-toolbar dark color="primary">
                        <v-toolbar-title>Select A Planogram</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-text-field color="white" v-model="searchText" append-icon="search"></v-text-field>
                        <v-btn icon @click.native="dialog = false">
                            <v-icon>close</v-icon>
                        </v-btn>
                    </v-toolbar>
                </v-card-title>

                <v-card-text  style="height: 280px; overflow: auto">
                    <v-list class="pa-0" dense hover>
                        <template v-for="(range, idx) in filteredList">
                            <v-list-tile :class="{ 'highlighted': selectedRange == range  }" avatar
                            @click="selectedRange = range" :key="idx">

                            <v-list-tile-content>
                                <v-list-tile-title v-text="range.displayname"></v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                        <v-divider :key="idx + 'd'"></v-divider>
                        </template>
                    </v-list>
                </v-card-text>

                <v-card-actions>

                    <v-spacer></v-spacer>

                    <v-btn color="primary" @click="returnRangeFile">Continue</v-btn>

                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import Axios from 'axios';

    export default {
        name: 'RangeSelectorModal',
        data() {
            return {
                dialog: false,
                rangeData: [],
                afterComplete: null,
                selectedRange: null,
                searchText: ''
            }
        },
        computed: {
            filteredList() {
                return this.rangeData.filter(item => {
                    if (!this.searchText) return this.rangeData;
                    return (item.displayname.toLowerCase().includes(this.searchText.toLowerCase()))
                });
            }
        },

        methods: {
            getPlanograms(callback) {
                let self = this
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + `Planogram/Distinct`)
                    .then(r => {
                        self.rangeData = r.data.planogramList;
                        callback();
                        delete Axios.defaults.headers.common["TenantID"];
                    })
            },
            show(afterComplete) {
                let self = this;
                self.getPlanograms(() => {
                    self.dialog = true;
                    self.afterComplete = afterComplete;
                })
            },
            returnRangeFile() {
                let self = this;
                if (this.selectedRange == null) {
                    alert("Please Select one");
                } else {
                    self.dialog = false;
                    self.afterComplete(self.selectedRange);
                }
            },
        }
    }
</script>
<style>
    .highlighted {
        background-color: #1976d2;
        -webkit-text-fill-color: aliceblue
    }
</style>