<template>
    <v-container>
        <v-card>
            <v-flex lg12 md12 sm12 xs12>
                <v-container grid-list-md>
                    <v-layout row wrap>
                        <v-flex lg8 md12 sm12 xs12>
                            <v-flex lg12 md12 sm12 xs12>
                                <v-toolbar flat color="grey darken-2">
                                    <v-toolbar-title>Databases</v-toolbar-title>
                                    <v-spacer></v-spacer>
                                    <v-btn @click="openDatabaseModal" :disabled="profile.accountID == null" color="primary">Add
                                        New Database</v-btn>
                                </v-toolbar>
                            </v-flex>

                            <v-flex lg12 md12 sm12 xs12>
                                <v-card v-for="(item,index) in dataBases" :key=index flat color="grey darken-2">
                                    <v-container>
                                        <v-layout>
                                            <v-flex> {{item.databaseName}}</v-flex>
                                            <v-spacer></v-spacer>
                                            <v-btn class="pa-0 ma-0" icon>
                                                <v-icon>edit</v-icon>
                                            </v-btn>
                                        </v-layout>
                                    </v-container>
                                </v-card>
                            </v-flex>
                            <v-flex lg8 md12 sm12 xs12 v-if="profile.accountID == null">
                                <p>In order to create a database you must first register an account. Please <a href="#"
                                        @click.prevent="openAccountModal">click here</a> to register.</p>
                            </v-flex>
                        </v-flex>
                        <v-flex lg4 md4 sm12 xs12>
                            <v-flex lg12 md12 sm12 xs12>
                                <v-card color="grey darken-2">
                                    <v-toolbar flat color="grey darken-2">
                                        <v-toolbar-title>Account</v-toolbar-title>
                                        <v-spacer></v-spacer>
                                        <v-btn @click.prevent="openAccountModal" color="primary">Account Settings
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
                                <v-toolbar flat color="grey darken-2">
                                    <v-toolbar-title>Account Features</v-toolbar-title>
                                    <v-spacer></v-spacer>
                                  
                                </v-toolbar>
                            </v-flex>

                            <v-flex lg12 md12 sm12 xs12>
                                <v-card flat color="grey darken-2">
                                    <v-container>
                                        <v-layout>
                                            <v-flex>Name</v-flex>
                                            <v-spacer></v-spacer>
                                            <v-flex> Price</v-flex>
                                        </v-layout>
                                    </v-container>
                                </v-card>
                                <hr>
                                <v-card v-for="(item,index) in features" :key=index flat color="grey darken-2">
                                    <v-container>
                                        <v-layout>
                                            <v-flex> {{item.name}}</v-flex>
                                            <v-spacer></v-spacer>
                                            <v-flex> {{item.price}}</v-flex>
                                        </v-layout>
                                    </v-container>
                                </v-card>
                            </v-flex>
                            <v-flex lg8 md12 sm12 xs12 v-if="profile.accountID == null">
                                <p>In order to create a database you must first register an account. Please <a href="#"
                                        @click.prevent="openAccountModal">click here</a> to register.</p>
                            </v-flex>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-flex>

        </v-card>

        <DatabaseModal ref="DatabaseModal"></DatabaseModal>
        <AccountModal ref="AccountModal"></AccountModal>
    </v-container>

</template>

<script>
    import Axios from 'axios';
    import jwt from 'jsonwebtoken';


    import DatabaseModal from "./DatabaseModal.vue"
    import AccountModal from "./AccountModal.vue"
    import {
        throws
    } from 'assert';
    export default {
        components: {
            AccountModal,
            DatabaseModal
        },
        data() {
            return {
                domain: null,
                country: null,
                account: true,
                accountID: null,
                profile: {
                    image: ''
                },
                features: [],
                dataBases: [],
                showLoader: true
            }
        },
        created() {
            let self = this
            self.getUserDetails()
            
       
        },
        methods: {
            getUserFeatures(userID) {
                let self = this
                let encoded_details = jwt.decode(sessionStorage.accessToken);
              
               Axios.get(process.env.VUE_APP_API +
                    `Features?systemUserID=${userID}`
                       
                ).then(r => {
                    self.features = r.data
                })
            },
            getAccountDetails(accountID) {
                let self = this;
                let encoded_details = jwt.decode(sessionStorage.accessToken);
                self.accountID= accountID
                Axios.get(process.env.VUE_APP_API + `AccountProfile?accountID=${accountID}`)
                    .then(r => {
                        if (r.data) {
                            self.country=r.data.country
                            self.domain=r.data.domain
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
                            self.getAccountDetails(self.profile.accountID)
                             self.getUserFeatures(encoded_details.USER_ID)
                            self.getDatabases(encoded_details.USER_ID);
                        } else {
                            setTimeout(() => {
                                self.showLoader = false;
                            }, 1000);
                        }
                    })
            },
            getDatabases(userID) {
                let self = this;

                Axios.get(process.env.VUE_APP_API + `Tenant?userID=${userID}`)
                    .then(r => {
                        self.dataBases = r.data;
                        setTimeout(() => {
                            self.showLoader = false;
                        }, 1000);
                    })
            },
            openProfileModal() {
                let self = this
                self.$refs.ProfileModal.open(self.profile, function () {
                    self.getAccountDetails(self.accountID);
                    self.$refs.ProfileModal.close();
                })
            },
            openAccountModal() {
                let self = this

                let encoded_details = jwt.decode(sessionStorage.accessToken);

                self.$refs.AccountModal.open(encoded_details.USER_ID, callback => {
                    self.getAccountDetails(self.accountID);
                    self.$refs.AccountModal.close();
                    self.country = callback.country
                    self.domain = callback.domain
                })
            },
            openDatabaseModal() {
                let self = this;
                let encoded_details = jwt.decode(sessionStorage.accessToken);

                self.$refs.DatabaseModal.open(encoded_details.USER_ID, function () {
                    self.getAccountDetails(self.accountID);
                    self.$refs.DatabaseModal.close();
                })
            }
        }
    }
</script>