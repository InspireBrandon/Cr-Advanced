<template>
    <v-dialog v-model="dialog" persistent width="600">
        <v-toolbar dark color="primary">
            <v-toolbar-title>Page setup</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="dialog=false">
                <v-icon>
                    close
                </v-icon>
            </v-btn>
        </v-toolbar>

        <v-card>
            <v-container grid-list-md>
                <v-layout row wrap>
                    <v-flex md12>
                        <v-autocomplete :disabled="loading" hide-details v-model="selectedReport" :items="reports"
                            label="Report">
                        </v-autocomplete>
                    </v-flex>
                    <v-flex md12>
                        <v-progress-linear v-if="loading" indeterminate></v-progress-linear>
                    </v-flex>
                </v-layout>
            </v-container>

            <v-card-actions class="mx-3">
                <v-spacer></v-spacer>
                <v-btn @click="save" color="primary">Save</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
    import Axios from 'axios'

    export default {
        data() {
            return {
                dialog: false,
                systemFolderFileID: null,
                afterReturn: null,
                reports: [],
                selectedReport: null,
                loading: false
            }
        },
        mounted() {
            let self = this;
        },
        methods: {
            getBIReports(callback) {
                let self = this;

                Axios.get(process.env.VUE_APP_API + "PowerBI/GetReports")
                    .then(r => {
                        r.data.value.forEach(report => {
                            self.reports.push({
                                text: report.name,
                                value: report.id
                            })
                        });
                        callback();
                    })
            },
            show(systemFolderFileID, afterReturn) {
                let self = this;
                self.selectedReport = null;
                self.loading = true;
                self.systemFolderFileID = systemFolderFileID;
                self.afterReturn = afterReturn;
                self.dialog = true;

                self.getBIReports(() => {
                    self.loading = false;
                })
            },
            save() {
                let self = this;

                self.dialog = false;

                self.afterReturn({
                    systemFolderFileID: self.systemFolderFileID,
                    bi_ReportID: self.selectedReport
                })
            },
            getPage(callback) {
                let self = this;

                Axios.get(process.env.VUE_APP_API + "PowerBI/GetReports")
                    .then(r => {
                        r.data.value.forEach(report => {
                            self.reports.push({
                                text: report.name,
                                value: report.id
                            })
                        });
                        callback();
                    })
            },
            getPageSections() {
                let self = this;

                Axios.get(process.env.VUE_APP_API + "PowerBI/GetReports")
                    .then(r => {
                        r.data.value.forEach(report => {
                            self.reports.push({
                                text: report.name,
                                value: report.id
                            })
                        });
                        callback();
                    })
            }
        }
    }
</script>