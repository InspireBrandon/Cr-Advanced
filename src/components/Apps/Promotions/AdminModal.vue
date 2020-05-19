<template>
    <v-dialog v-model="dialog" persistent width="1000" height="1000" style="overflow:hidden">
        <v-toolbar dark color="primary">
            <v-toolbar-title>
                Manage Admin
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="dialog=false">
                <v-icon>close</v-icon>
            </v-btn>
        </v-toolbar>
        <v-toolbar dark>
            <v-btn @click="openUserModal">
                Add user
            </v-btn>
            <v-btn @click="openGroupModal">
                Add user Group
            </v-btn>
            <v-spacer></v-spacer>
        </v-toolbar>
        <v-card>
            <grid ref="grid" :updateLine="updateLine" :rowData="adminUsers" />
        </v-card>
        <v-dialog v-model="userModal" persistent width="800" height="800">
            <v-toolbar dark color="primary">
                <v-toolbar-title>
                    Add User
                </v-toolbar-title>

                <v-spacer></v-spacer>
                <v-btn icon @click="userModal = false">
                    <v-icon>
                        close
                    </v-icon>
                </v-btn>
            </v-toolbar>
            <v-card>
                <v-container grid-list-md>
                    <v-layout row wrap>
                        <v-flex md6>
                            <v-text-field label="name" placeholder="Name" v-model="userItem.name">
                            </v-text-field>
                        </v-flex>
                        <v-flex md6>
                            <v-text-field label="E Mail" placeholder="E Mail" v-model="userItem.eMail">
                            </v-text-field>
                        </v-flex>
                        <v-flex md6>
                            <v-autocomplete label="Admin Group" placeholder="Admin Group" :items="adminGroups"
                                v-model="userItem.promotion_Admin_Group_ID">
                            </v-autocomplete>
                        </v-flex>
                    </v-layout>
                </v-container>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="submitUser" color="primary">
                        submit
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="userGroupModal" persistent width="800" height="800">
            <v-toolbar dark color="primary">
                <v-toolbar-title>
                    Add User Group
                </v-toolbar-title>

                <v-spacer></v-spacer>
                <v-btn icon @click="userGroupModal = false">
                    <v-icon>
                        close
                    </v-icon>
                </v-btn>
            </v-toolbar>
            <v-card>
                <v-container grid-list-md>
                    <v-layout row wrap>
                        <v-flex md12>
                            <v-text-field label="name" placeholder="Name" v-model="groupItem.name">
                            </v-text-field>
                        </v-flex>
                    </v-layout>
                </v-container>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="submitGroup" color="primary">submit</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-dialog>
</template>
<script>
    import grid from "./Grid.vue"
    import axios from "axios"
    export default {
        components: {
            grid
        },
        data() {
            return {
                dialog: false,
                adminList: [],
                userModal: false,
                userGroupModal: false,
                userItem: {
                    iD: null,
                    name: null,
                    promotion_Admin_Group_ID: null,
                    eMail: null,
                },
                groupItem: {
                    name: null,
                    id: null,
                },
                adminGroups: [],
                adminUsers: [],
            }
        },
        methods: {
            updateLine(line){
                let self = this
                console.log("updateLine",line.data);
                 axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                axios.post(process.env.VUE_APP_API + `Promotion/saveLine`, self.groupItem).then(r => {
                    self.getAdminUsers()
                })
                
            },
            open(callback) {
                let self = this
                self.dialog = true
                self.getAdminGroups()
                self.getAdminUsers();
            },
            submitGroup() {
                let self = this
                axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                axios.post(process.env.VUE_APP_API + `Promotion/SaveAdminGroup`, self.groupItem).then(r => {
                    self.userGroupModal = false
                    for (var prop in self.groupItem) {
                        self.groupItem[prop] = null
                    }
                    self.getAdminUsers()
                })
            },
            submitUser() {
                let self = this
                axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                axios.post(process.env.VUE_APP_API + `Promotion/SaveAdminUser`, self.userItem).then(r => {
                    self.userGroupModal = false
                    for (var prop in self.userItem) {
                        self.userItem[prop] = null
                    }
                })
            },
            getAdminGroups() {
                let self = this
                axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                axios.get(process.env.VUE_APP_API + `Promotion/AdminUserGroups`).then(r => {
                    console.log("getAdminGroupsss", r.data);

                    self.adminGroups = []
                    r.data.forEach(element => {
                        self.adminGroups.push({
                            text: element.name,
                            value: element.id
                        })
                    });

                })
            },
            getAdminUsers() {
                let self = this
                axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                axios.get(process.env.VUE_APP_API + `Promotion/GetAllAdminUsers`).then(r => {
                    console.log("getAdminUsers", r.data);
                    self.adminUsers = r.data
                })
            },
            openUserModal(item) {
                let self = this
                if (item) {
                    self.userItem = item
                } else {
                    for (var prop in self.userItem) {
                        self.userItem[prop] = null
                    }
                }
                self.getAdminGroups()
                self.userModal = true
            },
            openGroupModal(item) {
                let self = this
                if (item) {
                    self.groupItem = item
                } else {
                    for (var prop in self.groupItem) {
                        self.groupItem[prop] = null
                    }
                }
                self.userGroupModal = true
            }
        },

    }
</script>