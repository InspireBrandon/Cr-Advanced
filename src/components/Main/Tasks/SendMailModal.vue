<template>
    <v-dialog v-model="dialog" persistent max-width="600">
        <v-card>
            <v-toolbar dark flat color="primary">
                <v-toolbar-title>Mail User</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
                <v-autocomplete return-object v-model="selectedUser" :items="users" label="Select a user">
                </v-autocomplete>

                <v-autocomplete style="margin-left: 10px; margin-top: 8px; width: 300px" :items="projectGroups"
                    @change="getProjectsByProjectGroup()" v-model="selectedProjectGroup" label="Project Group">
                </v-autocomplete>

                <v-autocomplete style="margin-left: 10px; margin-top: 8px; width: 300px" :items="projects"
                    @change="getStorePlanograms()" v-model="selectedProject" label="Project">
                </v-autocomplete>

                <v-textarea v-model="notes" label="notes"></v-textarea>
            </v-card-text>
            <v-card-actions style="text-align: right;">
                <v-spacer></v-spacer>
                <v-btn color="secondary" @click.native="dialog = false">Cancel</v-btn>
                <v-btn color="primary darken-1" @click.native="returnValue(true)">Continue</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
    import Axios from 'axios';
    import jwt from 'jsonwebtoken';

    export default {
        data() {
            return {
                dialog: false,
                afterRuturn: null,
                users: [],
                selectedProjectGroup: null,
                projectGroups: [],
                projects: [],
                selectedProjectGroup: null,
                selectedProject: null,
                selectedUser: null,
                notes: null
            }
        },
        methods: {
            show(afterRuturn) {
                let self = this;
                self.users = [];

                self.getProjectsByProjectGroup();
                self.getStorePlanograms();

                self.getUsers(() => {
                    self.afterRuturn = afterRuturn;
                    self.selectedUser = null;
                    self.notes = null;
                    self.dialog = true;
                })
            },
            returnValue(value) {
                let self = this;
                self.afterRuturn({
                    systemUserID: self.selectedUser.value,
                    notes: self.notes
                });
                self.dialog = false;
            },
            getUsers(callback) {
                let self = this;

                let accountID = jwt.decode(sessionStorage.accessToken).ACCOUNT_ID;

                Axios.get(process.env.VUE_APP_API + `SystemUser`)
                    .then(r => {
                        r.data.forEach(element => {
                            self.users.push({
                                text: element.firstname + ' ' + element.lastname,
                                value: element.systemUserID
                            })
                        });

                        callback();
                    })
                    .catch(e => {

                    })
            },
            getProjectsByProjectGroup() {
                let self = this;
                return new Promise((resolve, reject) => {
                    Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                    self.$nextTick(() => {


                        let projectGroupID = self.selectedProjectGroup
                        Axios.get(process.env.VUE_APP_API +
                                `Project`)
                            .then(r => {
                                delete Axios.defaults.headers.common["TenantID"];
                                let tmp = r.data.projectList;
                                self.projectsObject = tmp
                                self.projects = [];
                                self.projectOwer = null;

                                tmp.forEach(el => {
                                    self.projects.push({
                                        text: el.name,
                                        value: el.id
                                    })
                                })
                                resolve();
                            })
                            .catch(e => {
                                delete Axios.defaults.headers.common["TenantID"];

                                reject();
                            })
                    })
                })
            },
            getStorePlanograms() {
                let self = this

                self.$nextTick(() => {
                    self.currentStorePlanograms = [];

                    Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                    Axios.get(process.env.VUE_APP_API + 'Store_Planogram')
                        .then(r => {
                            self.rowData = []

                            self.projectsObject.forEach(element => {
                                if (element.id == self.selectedProject) {
                                    self.Planogram_ID = element.planogram_ID
                                    self.projectOwer = element.systemUserID;
                                    self.currentProject = element;
                                }
                            });

                            self.currentStorePlanograms = []
                            self.currentStorePlanograms = r.data.store_PlanogramList;
                            self.currentStorePlanograms.forEach(e => {
                                e.currentStatusText = self.StoreStatusList[e.planogramStoreStatus]
                                    .text
                            })
                            self.rowData = self.currentStorePlanograms

                            delete Axios.defaults.headers.common["TenantID"];

                            self.projects.forEach(e => {
                                if (e.value == self.selectedProject) {
                                    self.title = e.text
                                }
                            })


                        })
                })
            },

        }
    }
</script>