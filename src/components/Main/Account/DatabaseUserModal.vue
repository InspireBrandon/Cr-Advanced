<template>
    <v-dialog transition="dialog-bottom-transition" fullscreen persistent v-model="modalShow">
        <v-card>
            <v-progress-linear v-if="showLoader" class="ma-0" color="primary" indeterminate height="5"></v-progress-linear>
            <div v-if="!showLoader"> 
                <v-toolbar prominent>
                    <v-btn icon @click="modalShow = false">
                        <v-icon>arrow_back</v-icon>
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn :disabled="selectedUser == null" :loading="loading" icon @click="addUser">
                        <v-icon>check</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-container class="pt-0">
                    <v-autocomplete v-model="selectedUser" :items="users" label="find a user"></v-autocomplete>
                    <v-list dense style="height: calc(100vh - 148px); overflow: auto;">
                        <template v-for="(item, index) in databaseUsers">
                            <div :key="index">
                                <v-list-tile color="grey-darken-4" avatar>
                                    <v-list-tile-avatar v-if="item.image == '' || item.image == null">
                                        <v-img :src="'http://oakclifffilmfestival.com/assets/placeholder-user.png'"></v-img>
                                    </v-list-tile-avatar>

                                    <v-list-tile-avatar v-else>
                                        <v-img :src="'data:image/png;base64,' + item.image"></v-img>
                                    </v-list-tile-avatar>

                                    <v-list-tile-content>
                                        <v-list-tile-title>{{ item.firstname }} {{ item.lastname }}</v-list-tile-title>
                                    </v-list-tile-content>

                                    <v-spacer></v-spacer>

                                    <v-list-tile-action>
                                        <v-menu>
                                            <v-btn slot="activator" icon>
                                                <v-icon>more_vert</v-icon>
                                            </v-btn>
                                            <v-list dense>
                                                <v-list-tile @click="openFeatureAccessModal(item.systemUserID)">set rights</v-list-tile>
                                                <v-list-tile>revoke access</v-list-tile>
                                            </v-list>
                                        </v-menu>
                                    </v-list-tile-action>

                                </v-list-tile>

                                <v-divider :inset="item.inset"></v-divider>
                            </div>
                        </template>
                    </v-list>
                </v-container>
            </div>
        </v-card>
        <DatabaseFeatureAccessModal ref="DatabaseFeatureAccessModal"></DatabaseFeatureAccessModal>
    </v-dialog>
</template>
<script>
    import Axios from 'axios';
    import jwt from 'jsonwebtoken';

    import DatabaseFeatureAccessModal from './DatabaseFeatureAccessModal';

    export default {
        data() {
            return {
                showLoader: true,
                loading: false,
                extended: false,
                modalShow: false,
                inviteText: '',
                afterClose: null,
                autoUpdate: true,
                friends: null,
                userDetails: [],
                users: [],
                selectedUser: null,
                databaseUsers: [],
                tenantID: null
            }
        },
        components: {
            DatabaseFeatureAccessModal
        },
        methods: {
            getUsers() {
                let self = this;

                let encoded_details = jwt.decode(sessionStorage.accessToken);

                Axios.get(process.env.VUE_APP_API + `SystemUser`)
                    .then(r => {

                        self.userDetails = r.data;

                        r.data.forEach(element => {

                            if (element.emailAddress != null) {
                                let isDatabaseUser = false;

                                self.databaseUsers.forEach((dbu, idx) => {
                                    if (dbu.systemUserID == element.systemUserID) {
                                        isDatabaseUser = true;
                                    }

                                    if (dbu.systemUserID == encoded_details.USER_ID) {
                                        self.databaseUsers.splice(idx, 1);
                                    }
                                })

                                if (!isDatabaseUser) {
                                    if (element.systemUserID != encoded_details.USER_ID) {
                                        self.users.push({
                                            text: element.emailAddress.toString(),
                                            value: element.systemUserID
                                        })
                                    }
                                }
                            }
                        });

                        self.showLoader = false;
                    })
            },
            getDatabaseUsers() {
                let self = this;
                let encoded_details = jwt.decode(sessionStorage.accessToken);

                Axios.get(process.env.VUE_APP_API + `TenantAccess/User?tenantID=${self.tenantID}`)
                    .then(r => {
                        self.databaseUsers = r.data;
                        self.getUsers();
                    })
            },
            addUser() {
                let self = this;

                self.extended = true;
                self.loading = true;
                let userObj = null;

                let encoded_details = jwt.decode(sessionStorage.accessToken);

                self.userDetails.forEach(element => {
                    if (element.systemUserID == self.selectedUser) {
                        userObj = element;
                    }
                })

                self.users.forEach((element, idx) => {
                    if (element.value == self.selectedUser) {
                        self.users.splice(idx, 1);
                    }
                })

                Axios.post(process.env.VUE_APP_API +
                        `TenantAccess?systemUserID=${self.selectedUser}&tenantID=${self.tenantID}`)
                    .then(r => {
                        self.databaseUsers.push(userObj);
                        self.selectedUser = null;
                        self.loading = false;
                    })
            },
            close() {
                let self = this
                self.modalShow = false
            },
            open(tenantID, callback) {
                let self = this
                self.showLoader = true;
                self.afterClose = callback;
                self.tenantID = tenantID;
                this.getDatabaseUsers();
                self.modalShow = true
            },
            remove(item) {
                const index = this.friends.indexOf(item.name)
                if (index >= 0) this.friends.splice(index, 1)
            },
            openFeatureAccessModal(systemUserID) {
                let self = this;
                self.$refs.DatabaseFeatureAccessModal.open(self.tenantID, systemUserID, function() {
                    
                });
            }
        }
    }
</script>