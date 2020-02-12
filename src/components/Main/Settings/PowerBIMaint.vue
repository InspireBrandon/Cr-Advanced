<template>
    <div>
        <v-toolbar dense dark color="grey darken-3">
            <v-toolbar-title>
                Power BI
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <!-- <v-btn color="primary" @click="updateTables">update tables </v-btn> -->
            <v-btn color="primary" @click="openConfigEditor">Edit Config </v-btn>
        </v-toolbar>
        <v-container grid-list-md style="height: calc(100vh - 158px)">
            <v-layout row wrap>
                <v-flex md3>
                    <v-autocomplete :items="applications" v-model="selectedApplication" label="Applications"
                        @change="onApplicationChange">
                    </v-autocomplete>
                </v-flex>
                <v-flex md9>
                    <v-btn @click="openApplicationCreate()" icon dark color="green">
                        <v-icon>add</v-icon>
                    </v-btn>
                    <v-btn @click="deleteApplication" icon color="error">
                        <v-icon>delete</v-icon>
                    </v-btn>
                </v-flex>
                <v-flex md12>
                    <v-card elevation=1>
                        <v-toolbar flat dense color="primary" dark>
                            <v-toolbar-title>
                                Application Details
                            </v-toolbar-title>
                            <v-spacer></v-spacer>
                            <v-btn v-if="selectedApplicationObject!=null"
                                @click="updateApplication(selectedApplicationObject)" icon color="primary">
                                <v-icon>edit</v-icon>
                            </v-btn>
                        </v-toolbar>
                        <v-container grid-list-md v-if="selectedApplicationObject!=null">
                            <v-layout row wrap>
                                <v-flex md3>
                                    <v-text-field readonly v-model="selectedApplicationObject.name" hide-details
                                        label="Name">

                                    </v-text-field>
                                </v-flex>
                                <v-flex md3>
                                    <v-text-field readonly v-model="selectedApplicationObject.username" hide-details
                                        label="Username">

                                    </v-text-field>
                                </v-flex>
                                <v-flex md3>
                                    <v-text-field readonly v-model="selectedApplicationObject.password" type="password"
                                        hide-details label="Password">

                                    </v-text-field>
                                </v-flex>
                                <v-flex md3>
                                    <v-text-field readonly v-model="selectedApplicationObject.applicationID"
                                        hide-details label="Application ID">

                                    </v-text-field>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-card>
                </v-flex>
            </v-layout>
            <hr>
            <v-layout>
                <v-flex md12>
                    <v-toolbar flat dense color="primary" dark>
                        <v-toolbar-title>
                            Workspaces
                        </v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-btn v-if="selectedApplication!=null" @click="openWorkspaceCreate" icon dark color="green">
                            <v-icon>add</v-icon>
                        </v-btn>
                    </v-toolbar>
                    <v-card elevation=1>
                        <v-container grid-list-md v-if="selectedApplication!=null">
                            <v-layout row wrap v-for="(item,idx) in workspaces" :key="idx">
                                <v-flex md1>
                                    <v-checkbox @change="updateDefault(item)" v-model="item.isDefault" label="Default">
                                    </v-checkbox>
                                </v-flex>
                                <v-flex md3>
                                    <v-text-field readonly v-model="item.name" hide-details label="Name">
                                    </v-text-field>
                                </v-flex>
                                <v-flex md3>
                                    <v-text-field readonly hide-details v-model="item.workspaceID" label="Workspace ID">
                                    </v-text-field>
                                </v-flex>
                                <v-flex md3>
                                    <v-btn @click="deleteWorkspace(item)" icon color="error">
                                        <v-icon>delete</v-icon>
                                    </v-btn>
                                    <v-btn @click="updateWorkspace(item)" icon color="primary">
                                        <v-icon>edit</v-icon>
                                    </v-btn>
                                </v-flex>
                                <v-flex md2>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
        <!-- create workspace dialog -->
        <v-dialog v-model="workspaceDialog" persistent width="900px">
            <v-card elevation=1>
                <v-toolbar flat dense color="primary" dark>
                    <v-toolbar-title>
                        Add Workspace
                    </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="workspaceDialog=false">
                        <v-icon>close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-container grid-list-md>
                    <v-layout row wrap>
                        <v-flex md2>
                            <v-checkbox v-model="createWorkspaceObject.isDefault" label="Default">
                            </v-checkbox>
                        </v-flex>
                        <v-flex md5>
                            <v-text-field v-model="createWorkspaceObject.name" hide-details label="Name">
                            </v-text-field>
                        </v-flex>
                        <v-flex md5>
                            <v-text-field hide-details v-model="createWorkspaceObject.workspaceID" label="Workspace ID">
                            </v-text-field>
                        </v-flex>
                    </v-layout>
                </v-container>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="workspaceDialog=false">cancel</v-btn>
                    <v-btn color="primary" @click="createWorkspace()">Submit</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <!-- create application dialog -->
        <v-dialog v-model="applicationDialog" persistent width="900px">
            <v-card elevation=1>
                <v-toolbar flat dense color="primary" dark>
                    <v-toolbar-title>
                        Add Application
                    </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="applicationDialog=false">
                        <v-icon>close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-container grid-list-md>
                    <v-layout row wrap>
                        <v-flex md6>
                            <v-text-field v-model="applicationModalObject.name" hide-details label="Name">
                            </v-text-field>
                        </v-flex>
                        <v-flex md6>
                            <v-text-field hide-details v-model="applicationModalObject.username" label="Username">
                            </v-text-field>
                        </v-flex>
                        <v-flex md6>
                            <v-text-field hide-details v-model="applicationModalObject.password" type="password"
                                label="Password">
                            </v-text-field>
                        </v-flex>
                        <v-flex md6>
                            <v-text-field hide-details v-model="applicationModalObject.applicationID"
                                label="Application ID">
                            </v-text-field>
                        </v-flex>
                    </v-layout>
                </v-container>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="applicationDialog=false">cancel</v-btn>
                    <v-btn color="primary" @click="creatApplication()">Submit</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <YesNoModal ref="yesNoModal"></YesNoModal>
        <configModal ref="configModal" />
        <TableUpdateModal ref="TableUpdateModal" />
    </div>
</template>
<script>
    import Axios from 'axios'
    import YesNoModal from '@/components/Common/YesNoModal'
    import configModal from './Power_BI_configModal'
    import TableUpdateModal from "./TableUpdateModal"

    export default {
        components: {
            YesNoModal,
            configModal,
            TableUpdateModal
        },
        data() {
            return {
                applicationsArray: [],
                workspaceDialog: false,
                selectedApplicationObject: null,
                applications: [],
                selectedApplication: null,
                workspaces: [],
                applicationDialog: false,
                applicationModalObject: {
                    id: null,
                    name: null,
                    username: null,
                    password: null,
                    applicationID: null,
                },
                createWorkspaceObject: {
                    id: null,
                    power_BI_Application_ID: null,
                    workspaceID: null,
                    name: null,
                    isDefault: false
                }

            }
        },
        mounted() {
            this.getApplications()
        },
        methods: {
            updateTables() {
                let self = this
                self.$refs.TableUpdateModal.open()
            },
            onApplicationChange() {
                let self = this
                self.$nextTick(() => {
                    self.getWorkspaces()
                    let tmp = self.applicationsArray.filter(item => {
                        return item.id == self.selectedApplication;
                    })
                    self.selectedApplicationObject = tmp[0]
                })
            },
            getApplications() {
                let self = this
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                self.applications = []
                Axios.get(process.env.VUE_APP_API + `Power_BI/GetApplications`).then(r => {

                    self.applicationsArray = r.data
                    r.data.forEach(element => {
                        self.applications.push({
                            text: element.name,
                            value: element.id
                        })
                    });
                    if (self.selectedApplication != null) {
                        let tmp = self.applicationsArray.filter(item => {
                            return item.id == self.selectedApplication;
                        })
                        self.selectedApplicationObject = tmp[0]
                    } else {
                        self.selectedApplication = r.data[0].id
                        self.onApplicationChange()
                    }
                })
            },
            updateApplication(item) {
                let self = this
                for (var prop in self.applicationModalObject) {
                    self.applicationModalObject[prop] = item[prop]
                }
                self.applicationDialog = true
            },
            updateWorkspace(item) {
                let self = this
                for (var prop in self.createWorkspaceObject) {
                    self.createWorkspaceObject[prop] = item[prop]
                }
                self.workspaceDialog = true
            },
            updateDefault(item) {
                let self = this
                self.checkValid(item, isvalid => {
                    if (isvalid) {
                        Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                        item.power_BI_Application_ID = self.selectedApplication
                        Axios.post(process.env.VUE_APP_API + `Power_BI/CreateWorkspace`, item).then(r => {
                            self.getWorkspaces()
                            // self.applications = r.data
                            self.workspaceDialog = false
                        })
                    } else {
                        alert("Please ensure all fields are filled in")
                    }
                })

            },
            getWorkspaces() {
                let self = this
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + `Power_BI/GetWorkSpaces?ID=${self.selectedApplication}`).then(
                    r => {
                        self.workspaces = r.data
                    })
            },
            openApplicationCreate() {
                let self = this
                for (var prop in self.applicationModalObject) {
                    self.applicationModalObject[prop] = null
                }
                self.applicationDialog = true
            },
            openWorkspaceCreate() {
                let self = this
                for (var prop in self.createWorkspaceObject) {
                    self.createWorkspaceObject[prop] = null
                }
                self.workspaceDialog = true
            },
            checkValid(object, callback) {
                let self = this
                let valid = true
                for (var prop in object) {
                    if (prop == null) {
                        valid = false
                        callback(valid)
                    }
                }
                callback(valid)
            },
            creatApplication() {
                let self = this
                self.checkValid(self.applicationModalObject, isvalid => {
                    if (isvalid) {
                        Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                        Axios.post(process.env.VUE_APP_API + `Power_BI/CreateApplication`, self
                            .applicationModalObject).then(r => {
                            self.applicationDialog = false

                            self.getApplications()
                        })
                    } else {
                        alert("Please ensure all fields are filled in")
                    }
                })
            },
            createWorkspace() {
                let self = this
                self.checkValid(self.createWorkspaceObject, isvalid => {
                    if (isvalid) {
                        Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                        self.createWorkspaceObject.power_BI_Application_ID = self.selectedApplication
                        Axios.post(process.env.VUE_APP_API + `Power_BI/CreateWorkspace`, self
                            .createWorkspaceObject).then(r => {
                            self.getWorkspaces()
                            // self.applications = r.data
                            self.workspaceDialog = false
                        })
                    } else {
                        alert("Please ensure all fields are filled in")
                    }
                })
            },
            deleteApplication() {
                let self = this
                self.$refs.yesNoModal.show("would you like to delete This Application?", response => {
                    if (response) {
                        Axios.post(process.env.VUE_APP_API +
                            `Power_BI/DeleteApplication?ID=${self.selectedApplication}`).then(
                            r => {
                                self.getApplications()

                            })
                    }
                })
            },
            deleteWorkspace(item) {
                let self = this
                self.$refs.yesNoModal.show("would you like to delete This Workspace?", response => {
                    if (response) {
                        Axios.post(process.env.VUE_APP_API + `Power_BI/DeleteWorkspace?ID=${item.id}`).then(
                            r => {
                                self.getWorkspaces()

                            })
                    }
                })

            },
            openConfigEditor() {
                let self = this
                self.$refs.configModal.open()
            }
        }
    }
</script>