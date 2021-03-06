<template>
    <v-dialog transition="dialog-bottom-transition" fullscreen persistent v-model="modalShow">
        <v-card>
            <v-progress-linear v-if="showLoader" class="ma-0" color="primary" indeterminate height="5">
            </v-progress-linear>
            <div v-if="!showLoader">
                <v-toolbar dark color="primary" prominent>
                    <v-toolbar-title>Users</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="modalShow = false">
                        <v-icon>arrow_back</v-icon>
                    </v-btn>

                </v-toolbar>
                <v-container class="pt-5">
                    <v-layout row wrap>
                        <v-flex md3>
                            <v-autocomplete style="max-width: 400px;" dense v-model="selectedUser" :items="users"
                                label="find a user"></v-autocomplete>
                        </v-flex>
                        <v-flex md9>
                            <v-btn :disabled="selectedUser == null" :loading="loading" icon @click="addUser">
                                <v-icon>check</v-icon>
                            </v-btn>
                        </v-flex>
                    </v-layout>
                    <v-card>
                        <v-card-text>
                            <v-data-table class="elevation-0" hide-actions :items="databaseUsers" :headers="headers">
                                <template v-slot:items="props">
                                    <td>
                                        <v-avatar size="40">
                                            <img :src="`data:image/jpeg;base64,${props.item.image}`" alt="avatar">
                                        </v-avatar>
                                    </td>
                                    <td>{{ props.item.firstname }}</td>
                                    <td>{{ props.item.lastname }}</td>
                                    <td>{{ props.item.emailAddress }}</td>
                                    <td>{{ props.item.username }}</td>
                                    <td>{{ props.item.password }}</td>
                                    <td>{{accessTypes[props.item.access == null ? 4 : props.item.access].text}}</td>
                                    <td>
                                        <v-menu>
                                            <v-btn slot="activator" icon>
                                                <v-icon>more_vert</v-icon>
                                            </v-btn>
                                            <v-list dense>
                                                <v-list-tile @click="setAccessType(props)">Set access type</v-list-tile>
                                                <v-divider></v-divider>
                                                <v-list-tile @click="setSubscriptionLevel(props)">Set subscription level
                                                </v-list-tile>
                                                <v-divider></v-divider>
                                                <v-list-tile @click="openFeatureAccessModal(props.item.systemUserID)">
                                                    Feature access</v-list-tile>
                                                <v-divider></v-divider>
                                                <v-list-tile @click="revoke_access(props.item)">Revoke access
                                                </v-list-tile>
                                            </v-list>
                                        </v-menu>
                                    </td>
                                </template>
                            </v-data-table>
                        </v-card-text>
                    </v-card>
                </v-container>
            </div>
        </v-card>
        <DatabaseFeatureAccessModal ref="DatabaseFeatureAccessModal"></DatabaseFeatureAccessModal>
        <AccessTypeModal ref="AccessTypeModal"></AccessTypeModal>
        <SubscriptionLevelModal ref="SubscriptionLevelModal"></SubscriptionLevelModal>
    </v-dialog>
</template>
<script>
    import Axios from 'axios';
    import jwt from 'jsonwebtoken';

    import DatabaseFeatureAccessModal from './DatabaseFeatureAccessModal';
    import AccessTypeModal from './AccessTypeModal';
    import SubscriptionLevelModal from './SubscriptionLevelModal';

    export default {
        data() {
            return {
                accessTypes: [{
                        text: 'Super User',
                        value: 0
                    },
                    {
                        text: 'Buyer',
                        value: 1
                    },
                    {
                        text: 'Supplier',
                        value: 2
                    },
                    {
                        text: 'Store',
                        value: 3
                    },
                    {
                        text: '',
                        value: 4
                    }
                ],
                headers: [{
                        text: '',
                        align: 'center',
                        sortable: false
                    }, {
                        text: 'First name',
                        align: 'left',
                        sortable: false,
                        value: 'firstname'
                    },
                    {
                        text: 'Last name',
                        align: 'left',
                        sortable: false,
                        value: 'lastname'
                    },
                    {
                        text: 'Email',
                        align: 'left',
                        sortable: false,
                        value: 'emailAddress'
                    },
                    {
                        text: 'Username',
                        align: 'left',
                        sortable: false,
                        value: 'username'
                    },
                    {
                        text: 'Password (click to view)',
                        align: 'left',
                        sortable: false,
                        value: 'password'
                    }, {
                        text: 'Access Type',
                        align: 'left',
                        sortable: false,
                        value: 'access'
                    },
                    {
                        text: '',
                        width: "10px",
                        sortable: false,
                    }
                ],
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
            DatabaseFeatureAccessModal,
            AccessTypeModal,
            SubscriptionLevelModal
        },
        methods: {
            getUsers() {
                let self = this;

                let encoded_details = jwt.decode(sessionStorage.accessToken);

                Axios.get(process.env.VUE_APP_API + `SystemUser`)
                    .then(r => {

                        let tmp = [];

                        r.data.forEach(el => {
                            el["showPassword"] = false;
                            tmp.push(el);
                        })

                        self.userDetails = tmp;

                        tmp.forEach(element => {

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
            getAccessType(systemUserID, tenantID, accessType) {
                let self = this;

                Axios.get(process.env.VUE_APP_API +
                        `TenantLink_AccessType?systemUserID=${systemUserID}&tenantID=${tenantID}`)
                    .then(r => {
                        if (r.data.tenantLink_AccessTypeList.length > 0) {
                            accessType(r.data.tenantLink_AccessTypeList[0].accessType)
                        } else {
                            accessType(4)
                        }
                    })
            },
            getDatabaseUsers() {
                let self = this;
                let encoded_details = jwt.decode(sessionStorage.accessToken);

                Axios.get(process.env.VUE_APP_API + `TenantAccess/User?tenantID=${self.tenantID}`)
                    .then(r => {
                        self.databaseUsers = r.data;

                        self.databaseUsers.forEach(e => {
                            self.getAccessType(e.systemUserID, self.tenantID, accessType => {

                                e.access = accessType
                            })
                        })
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
                self.$refs.DatabaseFeatureAccessModal.open(self.tenantID, systemUserID, function () {});
            },
            setAccessType(props) {
                let self = this;
                self.$refs.AccessTypeModal.open(props.item.systemUserID, self.tenantID, accessType => {});
            },
            revoke_access(item) {
                let self = this;

                Axios.delete(process.env.VUE_APP_API +
                        `TenantAccess/User?systemUserID=${item.systemUserID}&tenantID=${sessionStorage.currentDatabase}`
                        )
                    .then(r => {
                        if (r.data)
                            self.databaseUsers.splice(self.databaseUsers.indexOf(item), 1);
                    })
                    .catch(e => {

                    })
            },
            setSubscriptionLevel(props) {
                let self = this;

                self.$refs.SubscriptionLevelModal.show(props.item.subscriptionLevel, subscriptionLevel => {
                    props.item.subscriptionLevel = subscriptionLevel;

                    Axios.put(process.env.VUE_APP_API + `SystemUser`, props.item)
                        .then(r => {
                            console.log(r.data);
                        })
                })
            }
        }
    }
</script>