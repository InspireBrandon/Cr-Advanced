<template>
    <v-card>
        <v-toolbar dark dense flat color="grey darken-3">
            <v-spacer>
            </v-spacer>
            <v-toolbar-title>
                Account Settings
            </v-toolbar-title>
        </v-toolbar>
        <v-progress-linear v-if="showLoader" class="ma-0" color="primary" indeterminate height="5"></v-progress-linear>
        <v-flex v-if="!showLoader && profile.accountID != null" lg12 md12 sm12 xs12>
            <v-container grid-list-md>
                <v-layout row wrap>
                    <v-flex lg8 md12 sm12 xs12>
                        <v-flex lg12 md12 sm12 xs12>
                            <v-toolbar dark color="primary">
                                <v-toolbar-title>Databases</v-toolbar-title>
                                <v-spacer></v-spacer>
                                <v-btn icon @click="openDatabaseModal" :disabled="profile.accountID == null"
                                    color="primary">
                                    <v-icon>add</v-icon>
                                </v-btn>
                            </v-toolbar>
                        </v-flex>

                        <v-flex lg12 md12 sm12 xs12>
                            <v-card v-for="(item,index) in dataBases" :key=index color="grey lighten-5">
                                <v-container class="pa-2 mb-2">
                                    <v-layout>
                                        <v-flex> {{item.databaseName}}</v-flex>
                                        <v-spacer></v-spacer>
                                        <v-menu>
                                            <v-btn slot="activator" class="pa-0 ma-0" icon>
                                                <v-icon>more_vert</v-icon>
                                            </v-btn>
                                            <v-list dense>
                                                <!-- <v-list-tile avatar @click="editDatabase(item)">
                                                    <v-list-tile-avatar>
                                                        <v-icon>share</v-icon>
                                                    </v-list-tile-avatar>
                                                    <v-list-tile-content>
                                                        <v-list-tile-title>Edit</v-list-tile-title>
                                                    </v-list-tile-content>
                                                </v-list-tile> -->
                                                <v-list-tile @click="maintainUsers(item)">
                                                    <v-list-tile-content>
                                                        <v-list-tile-title>Users</v-list-tile-title>
                                                    </v-list-tile-content>
                                                </v-list-tile>
                                                <!-- <v-list-tile avatar @click="deleteDatabase(item)">
                                                    <v-list-tile-avatar>
                                                        <v-icon>delete</v-icon>
                                                    </v-list-tile-avatar>
                                                    <v-list-tile-content>
                                                        <v-list-tile-title>Delete</v-list-tile-title>
                                                    </v-list-tile-content>
                                                </v-list-tile> -->
                                            </v-list>
                                        </v-menu>
                                    </v-layout>
                                </v-container>
                            </v-card>
                        </v-flex>

                    </v-flex>
                    <v-flex lg4 md4 sm12 xs12>
                        <v-flex lg12 md12 sm12 xs12>
                            <v-card color="grey lighten-5">
                                <v-toolbar dark color="primary">
                                    <v-toolbar-title>Account</v-toolbar-title>
                                    <v-spacer></v-spacer>
                                    <v-btn icon @click.prevent="openAccountModal" color="primary">
                                        <v-icon>edit</v-icon>
                                    </v-btn>
                                </v-toolbar>
                                <v-card-title primary-title>
                                    <v-flex lg12 md12 sm12 xs12>
                                        <v-text-field label="Domain" v-model="domain" disabled> </v-text-field>
                                    </v-flex>
                                    <v-flex lg12 md12 sm12 xs12>
                                        <v-text-field label="Country" v-model="country" disabled> </v-text-field>
                                    </v-flex>
                                </v-card-title>
                            </v-card>
                        </v-flex>
                    </v-flex>
                    <v-flex lg12 md12 sm12 xs12>
                        <v-flex lg12 md12 sm12 xs12>
                            <v-toolbar dark color="primary">
                                <v-toolbar-title>Account Summary</v-toolbar-title>
                            </v-toolbar>
                        </v-flex>
                        <v-layout row wrap>
                            <v-flex lg3 md3 sm6 xs6 v-for="(item,index) in features" :key="index">
                                <v-card color="grey lighten-5">
                                    <v-container class="pa-2 mb-2">
                                        <v-layout>
                                            <v-flex md6>{{item.name}}</v-flex>
                                            <v-flex md6>{{item.price}}</v-flex>
                                        </v-layout>
                                    </v-container>
                                </v-card>
                            </v-flex>
                            <v-flex lg12 md12 sm12 xs12>
                                <v-card color="grey lighten-5">
                                    <v-container class="pa-2 mb-2">
                                        <v-layout>
                                            <v-flex md6>Total</v-flex>
                                            <v-flex md6>R{{totalPrice}} pm</v-flex>
                                        </v-layout>
                                    </v-container>
                                </v-card>
                            </v-flex>
                        </v-layout>
                    </v-flex>
                </v-layout>
            </v-container>

        </v-flex>
        <DatabaseModal ref="DatabaseModal"></DatabaseModal>
        <AccountModal ref="AccountModal"></AccountModal>
        <DatabaseUserModal ref="DatabaseUserModal"></DatabaseUserModal>
        <v-flex lg8 md12 sm12 xs12 v-if="profile.accountID == null  && !showLoader">
            <br>
            <p>In order to create a database you must first register an account. Please <a href="#"
                    @click.prevent="openAccountModal">click
                    here</a> to register.</p>
        </v-flex>
    </v-card>
</template>

<script>
    import Axios from 'axios';
    import jwt from 'jsonwebtoken';


    import DatabaseModal from "./DatabaseModal.vue"
    import AccountModal from "./AccountModal.vue"
    import DatabaseUserModal from './DatabaseUserModal.vue'

    export default {
        components: {
            AccountModal,
            DatabaseModal,
            DatabaseUserModal
        },
        data() {
            return {
                showLoader: true,
                domain: null,
                country: null,
                account: true,
                accountID: null,
                profile: {
                    image: ''
                },
                features: [],
                dataBases: [],
                totalPrice: 0
            }
        },
        created() {
            let self = this
            self.getUserDetails()
        },
        methods: {
            maintainUsers(database) {
                let self = this;

                self.$refs.DatabaseUserModal.open(database.tenantID, function () {

                });
            },
            deleteDatabase(item) {
                let self = this;

                let encoded_details = jwt.decode(sessionStorage.accessToken);

                Axios.delete(process.env.VUE_APP_API +
                    `Tenant?tenantID=${item.tenantID}`

                ).then(() => {
                    self.getDatabases(encoded_details.USER_ID, () => {});
                })
            },
            getUserFeatures(userID, callback) {
                let self = this

                Axios.get(process.env.VUE_APP_API + `Features?systemUserID=${userID}`).then(r => {
                    callback(self.features = r.data,
                        self.features.forEach(el => {
                            self.totalPrice += el.price;
                        })
                    )
                })
            },
            getAccountDetails(accountID, callback) {
                let self = this;

                self.accountID = accountID
                Axios.get(process.env.VUE_APP_API + `AccountProfile?accountID=${accountID}`)
                    .then(r => {
                        if (r.data) {
                            callback(
                                self.country = r.data.country,
                                self.domain = r.data.domain
                            )


                        }
                    })
            },
            getUserDetails() {

                let self = this;
                let encoded_details = jwt.decode(sessionStorage.accessToken);

                Axios.get(process.env.VUE_APP_API + `SystemUser?id=${encoded_details.USER_ID}`)
                    .then(r => {
                        self.profile = r.data;

                        if (self.profile.accountID != null) {
                            self.domain = r.data.domain
                            self.country = r.data.country
                            self.getAccountDetails(self.profile.accountID, () => {
                                self.getUserFeatures(encoded_details.USER_ID, () => {
                                    self.getDatabases(encoded_details.USER_ID, () => {});
                                })
                            })
                        } else {
                            setTimeout(() => {
                                self.showLoader = false;
                            }, 1000);
                        }
                    })
            },
            getDatabases(userID, callback3) {
                let self = this;

                Axios.get(process.env.VUE_APP_API + `Tenant?userID=${userID}`)
                    .then(r => {
                        callback3(self.dataBases = r.data,
                            self.showLoader = false, )
                        setTimeout(() => {
                            self.showLoader = false;
                        }, 1000);
                    })
            },
            openProfileModal() {
                let self = this
                self.$refs.ProfileModal.open(self.profile, function () {
                    self.getAccountDetails(self.accountID, () => {
                        self.$refs.ProfileModal.close();
                    });

                })
            },
            openAccountModal() {
                let self = this
                let encoded_details = jwt.decode(sessionStorage.accessToken);
                self.$refs.AccountModal.open(encoded_details.USER_ID, self.country, self.domain, self.accountID,
                    callback => {
                        self.accountID = callback.accountID
                        self.profile.accountID = callback.accountID
                        self.getAccountDetails(self.accountID, () => {
                            self.$refs.AccountModal.close();
                            self.country = callback.country
                            self.domain = callback.domain
                        });
                    })
            },
            openDatabaseModal() {
                let self = this;
                let encoded_details = jwt.decode(sessionStorage.accessToken);
                self.$refs.DatabaseModal.open(encoded_details.USER_ID, function () {
                    self.getAccountDetails(self.accountID, () => {});
                    self.getDatabases(encoded_details.USER_ID, () => {});
                    self.$refs.DatabaseModal.close();
                })
            }
        }
    }
</script>