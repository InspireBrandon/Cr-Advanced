<template>
    <v-card>
        <v-toolbar dense dark>
            <v-spacer></v-spacer>
            <v-toolbar-title>Planogram Implementation</v-toolbar-title>
        </v-toolbar>
        <v-container grid-list-md>
            <v-layout row wrap>
                <v-flex xl3 lg3 md4 sm12 xs12>
                    <v-select @change="getProjectsByProjectGroup" v-model="selectedProjectGroup"
                        :items="projectGroupsSelect" hide-details label="Project Group"></v-select>
                </v-flex>
                <v-flex xl9 lg9 md8 sm0 xs0></v-flex>
                <v-flex xl3 lg3 md4 sm12 xs12>
                    <v-select v-if="selectedProjectGroup != null" v-model="selectedProject" :items="projectsSelect"
                        hide-details label="Project"></v-select>
                </v-flex>
                <v-flex xl3 lg3 md4 sm12 xs12>
                </v-flex>
            </v-layout>
        </v-container>
    </v-card>
</template>

<script>
    import Axios from 'axios';
    import jwt from 'jsonwebtoken';

    let _MODULE = "Planogram Implementation";

    export default {
        data: () => {
            return {
                authorityType: -1,
                projectGroups: [],
                projectGroupsSelect: [],
                selectedProjectGroup: null,
                projects: [],
                projectsSelect: [],
                selectedProject: null,
            }
        },
        mounted() {
            let self = this;
            self.initialise();
        },
        methods: {
            initialise() {
                let self = this;
                let encoded_details = jwt.decode(sessionStorage.accessToken);
                let systemUserID = encoded_details.USER_ID;
                let tenantID = sessionStorage.currentDatabase;

                self.getUserDetails(systemUserID, tenantID)
                    .then(userType => {
                        self.handleUser(userType);
                    })
                    .catch(message => {
                        self.handleError(message);
                    })
            },
            getUserDetails(systemUserID, tenantID) {
                let self = this;

                self.inform("GET", "Getting user data.")

                return new Promise((resolve, reject) => {
                    Axios.get(process.env.VUE_APP_API +
                            `TenantLink_AccessType?systemUserID=${systemUserID}&tenantID=${tenantID}`)
                        .then(r => {
                            let userType = 0;

                            if (!r.data.isDatabaseOwner) {
                                userType = r.data.tenantLink_AccessTypeList[0].accessType
                            }

                            resolve(userType);
                        })
                        .catch(e => {
                            reject();
                        })
                })
            },
            handleUser(userType) {
                let self = this;

                self.authorityType = userType;

                self.inform("PROCESSING", "Selecting appropriate process.")

                switch (self.authorityType) {
                    case 0:
                        {
                            // Super User
                            self.processSuperUser()
                            .then(r => {

                            })
                            .catch(e => {

                            })
                        }
                        break;
                    case 1:
                        {
                            // Buyer
                            self.processBuyer();
                        }
                        break;
                    case 2:
                        {
                            // Supplier
                            self.processSupplier();
                        }
                        break;
                    case 3:
                        {
                            // Store
                            self.processStore();
                        }
                        break;
                }
            },
            processSuperUser() {
                let self = this;

                self.inform("PROCESSING", "Handling user of type SUPER USER.")

                return new Promise((resolve, reject) => {
                    self.getProjectGroups()
                        .then(r => {
                            self.projectGroups = r.data.projectGroupsList

                            resolve();
                        })
                        .catch(e => {
                            reject();
                        })
                })
            },
            processBuyer() {
                let self = this;

                self.inform("PROCESSING", "Handling user of type BUYER.")
            },
            processSupplier() {
                let self = this;

                self.inform("PROCESSING", "Handling user of type SUPPLIER.")
            },
            processStore() {
                let self = this;

                self.inform("PROCESSING", "Handling user of type STORE.")
            },
            getProjectGroups() {
                let self = this;

                return new Promise((resolve, reject) => {
                    Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                    Axios.get(process.env.VUE_APP_API + `ProjectGroup`)
                        .then(r => {
                            delete Axios.defaults.headers.common["TenantID"];
                            self.projectGroups = r.data.projectGroupList;

                            self.projectGroupsSelect = [];

                            self.projectGroups.forEach(el => {
                                self.projectGroupsSelect.push({
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
            },
            getProjectsByProjectGroup() {
                let self = this;

                return new Promise((resolve, reject) => {
                    Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                    self.$nextTick(() => {
                        let projectGroupID = self.selectedProjectGroup;

                        Axios.get(process.env.VUE_APP_API + `Project?projectGroupID=${projectGroupID}`)
                            .then(r => {
                                delete Axios.defaults.headers.common["TenantID"];
                                self.projects = r.data.projectList;

                                self.projectsSelect = [];

                                self.projects.forEach(el => {
                                    self.projectsSelect.push({
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
            inform(actionType, message) {
                console.log(`[${_MODULE.toUpperCase()}] - ${actionType.toUpperCase()} - ${message}`);
            },
            handleError(message) {
                alert(message);
            }
        }
    }
</script>