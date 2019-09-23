<template>
    <v-dialog v-model="dialog" persistent max-width="900">
        <v-card>
            <v-toolbar dark flat color="primary">
                <v-toolbar-title>Start new task</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
                <v-container class="pa-0" grid-list-md>
                    <v-layout row wrap>
                        <v-flex md6>
                            <v-autocomplete v-model="selectedUser" :items="users" label="User" hide-details>
                            </v-autocomplete>
                        </v-flex>
                        <v-flex md6></v-flex>
                        <v-flex md6>
                            <v-select v-model="selectedTask" :items="tasks" label="Task" hide-details></v-select>
                        </v-flex>
                        <v-flex md12>
                            <div class="mt-4"></div>
                        </v-flex>
                        <v-flex md6>
                            <v-autocomplete @change="getProjects" v-model="selectedProjectGroup" :items="projectGroups"
                                label="Project Group" hide-details></v-autocomplete>
                        </v-flex>
                        <v-flex md6>
                            <v-autocomplete v-model="selectedProject" :items="projects" label="Project" hide-details>
                            </v-autocomplete>
                        </v-flex>
                        <v-flex md12>
                            <div class="mt-4"></div>
                        </v-flex>
                        <v-flex md12>
                            <v-autocomplete v-model="selectedRangeFile" :items="rangeFiles" label="Range File"
                                hide-details>
                            </v-autocomplete>
                        </v-flex>
                        <v-flex md12>
                            <v-autocomplete v-model="selectedSpacePlanFile" :items="spacePlanFiles"
                                label="Space Plan File" hide-details>
                            </v-autocomplete>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-card-text>
            <v-divider class="mx-2"></v-divider>
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

    export default {
        data() {
            return {
                dialog: false,
                afterReturn: null,
                tasks: [{
                    text: "Data Preparation",
                    value: 1
                }, {
                    text: "Ranging",
                    value: 2
                }, {
                    text: "Planogram",
                    value: 3
                }],
                selectedTask: null,
                users: [],
                selectedUser: null,
                projectGroups: [],
                selectedProjectGroup: null,
                projects: [],
                selectedProject: null,
                rangeFiles: [],
                selectedRangeFile: null,
                spacePlanFiles: [],
                selectedSpacePlanFile: null
            }
        },
        created() {
            let self = this;
            self.getSystemUsers();
            self.getProjectGroups();
            self.getRanges();
            self.getSpacePlans();
        },
        methods: {
            show(afterReturn) {
                let self = this;
                self.selectedTask = null;
                self.selectedUser = null;
                self.selectedProjectGroup = null;
                self.selectedProject = null;
                self.afterReturn = afterReturn;
                self.dialog = true;
            },
            returnValue() {
                let self = this;
                self.dialog = false;

                self.afterReturn({
                    task: self.selectedTask,
                    user: self.selectedUser,
                    projectGroup: self.selectedProjectGroup,
                    project: self.selectedProject,
                    rangeFile: self.selectedRangeFile,
                    spacePlanFile: self.selectedSpacePlanFile
                });
            },
            getSystemUsers() {
                let self = this;

                Axios.get(process.env.VUE_APP_API + 'SystemUser')
                    .then(r => {
                        self.users = [];

                        r.data.forEach(el => {
                            self.users.push({
                                text: el.firstname + ' ' + el.lastname,
                                value: el.systemUserID
                            })
                        });
                    })
            },
            getProjectGroups() {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + `ProjectGroup`).then(r => {
                    delete Axios.defaults.headers.common["TenantID"];
                    self.projectGroups = [];

                    r.data.projectGroupList.forEach(el => {
                        self.projectGroups.push({
                            text: el.name,
                            value: el.id
                        })
                    })
                })
            },
            getProjects() {
                let self = this;

                self.$nextTick(() => {
                    Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                    Axios.get(process.env.VUE_APP_API + `Project?projectGroupID=${self.selectedProjectGroup}`)
                        .then(r => {
                            delete Axios.defaults.headers.common["TenantID"];

                            self.projects = [];
                            r.data.projectList.forEach(el => {
                                self.projects.push({
                                    text: el.name,
                                    value: el.id
                                })
                            })
                        })
                })
            },
            getRanges(callback) {
                let self = this;

                self.rangeFiles = [];

                Axios.get(process.env.VUE_APP_API + "SystemFile/JSON?db=CR-Devinspire&folder=Ranging")
                    .then(r => {
                        r.data.forEach(e => {
                            self.rangeFiles.push({
                                text: e.name,
                                value: e.id
                            })
                        })

                        callback();
                    })
                    .catch(e => {})
            },
            getSpacePlans(callback) {
                let self = this;

                self.spacePlanFiles = [];

                Axios.get(process.env.VUE_APP_API + "SystemFile/JSON?db=CR-Devinspire&folder=Space Planning")
                    .then(r => {
                        r.data.forEach(e => {
                            self.spacePlanFiles.push({
                                text: e.name,
                                value: e.id
                            })
                        })

                        callback();
                    })
                    .catch(e => {

                    })
            },
        }
    }
</script>