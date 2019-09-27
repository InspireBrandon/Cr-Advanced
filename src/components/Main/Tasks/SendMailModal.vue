<template>
    <v-dialog v-model="dialog" persistent max-width="600">
        <v-card>
            <v-toolbar dark flat color="primary">
                <v-toolbar-title>Mail User</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
                <v-autocomplete return-object v-model="selectedUser" :items="users" label="Select a user">
                </v-autocomplete>

                <v-autocomplete :items="projectGroups" @change="getProjectsByProjectGroup()"
                    v-model="selectedProjectGroup" label="Project Group">
                </v-autocomplete>

                <v-autocomplete :items="projects" v-model="selectedProject"
                    label="Project">
                </v-autocomplete>

                <v-textarea v-model="notes" label="Notes"></v-textarea>
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
                selectedProject: null,
                selectedUser: null,
                notes: null
            }
        },
        methods: {
            show(afterRuturn) {
                let self = this;
                self.users = [];

                self.getProjectGroups();

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
                    notes: self.notes,
                    project: self.selectedProject,
                    projectGroup: self.selectedProjectGroup
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
            getProjectGroups() {
                let self = this;

                return new Promise((resolve, reject) => {
                    Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                    Axios.get(process.env.VUE_APP_API + `ProjectGroup`)
                        .then(r => {
                            delete Axios.defaults.headers.common["TenantID"];
                            let tmp = r.data.projectGroupList;

                            self.projectGroups = [];

                            tmp.forEach(el => {
                                self.projectGroups.push({
                                    text: el.name,
                                    value: el.id
                                })
                            })

                            resolve(r);
                        })
                        .catch(e => {
                            delete Axios.defaults.headers.common["TenantID"];
                            reject(e);
                        })
                })
            },
            getProjectsByProjectGroup() {
                let self = this;
                return new Promise((resolve, reject) => {
                    Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                    self.$nextTick(() => {

                        let projectGroupID = self.selectedProjectGroup
                        Axios.get(process.env.VUE_APP_API +
                                `Project?projectGroupID=${projectGroupID}`)
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
        }
    }
</script>