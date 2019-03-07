<template>
    <div>
        <v-progress-linear v-if="showLoader" class="ma-0" color="primary" indeterminate height="5"></v-progress-linear>
        <v-container grid-list-md v-if="!showLoader">
            <v-layout row wrap>
                <v-flex lg8 md8 sm12 xs12>
                    <v-container grid-list-md>
                        <v-layout row wrap>
                            <v-flex lg12 md12 sm12 xs12>
                                <v-toolbar flat color="secondary">
                                    <v-toolbar-title>Databases</v-toolbar-title>
                                    <v-spacer></v-spacer>
                                    <v-btn @click="openDatabaseModal" :disabled="profile.accountID == null" color="primary">Add
                                        New Database</v-btn>
                                </v-toolbar>
                            </v-flex>
                            <v-flex lg12 md12 sm12 xs12 v-for="(item,index) in dataBases" :key=index>
                                <v-card flat>
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
                            <v-flex lg12 md12 sm12 xs12 v-if="profile.accountID == null">
                                <p>In order to create a database you must first register an account. Please <a href="#"
                                        @click.prevent="openAccountModal">click here</a> to register.</p>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-flex>
                <v-flex lg4 md4 sm12 xs12>
                    <v-container grid-list-md>
                        <v-layout row wrap>
                            <v-flex lg12 md12 sm12 xs12>
                                <v-card flat>
                                    <v-card-title primary-title>
                                        <v-layout class="header text-md-center" row wrap>
                                            <v-flex lg12 md12 sm12 xs12>
                                                <v-avatar :tile="false" :size="150" color="grey lighten-4">
                                                    <img :src="'data:image/png;base64,' + profile.image" alt="avatar">
                                                </v-avatar>
                                                <h3 class="headline">{{profile.firstname}} {{profile.lastname}}</h3>
                                            </v-flex>
                                            <v-divider />
                                            <v-flex lg12 md12 sm12 xs12>
                                                <v-btn @click="openProfileModal" color="info" flat>Update profile</v-btn>
                                            </v-flex>
                                        </v-layout>
                                    </v-card-title>
                                </v-card>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-flex>
            </v-layout>
            <ProfileModal ref="ProfileModal"></ProfileModal>
            <AccountModal ref="AccountModal"></AccountModal>
            <DatabaseModal ref="DatabaseModal"></DatabaseModal>
        </v-container>
    </div>
</template>

<script>
    import Axios from 'axios';
    import jwt from 'jsonwebtoken';

    import ProfileModal from "./ProfileModal.vue"
    import AccountModal from "./AccountModal.vue"
    import DatabaseModal from "./DatabaseModal.vue"

    export default {
        components: {
            ProfileModal,
            AccountModal,
            DatabaseModal
        },
        data() {
            return {
                account: true,
                profile: {
                    image: ''
                },
                features: [],
                dataBases: [],
                showLoader: true
            }
        },
        created() {
            this.getAccountDetails()
        },
        methods: {
            getAccountDetails() {
                let self = this;
                let encoded_details = jwt.decode(sessionStorage.accessToken);

                Axios.get(process.env.VUE_APP_API + `SystemUser?id=${encoded_details.USER_ID}`)
                    .then(r => {
                        self.profile = r.data;

                        if (self.profile.accountID != null) {
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
                    self.getAccountDetails();
                    self.$refs.ProfileModal.close();
                })
            },
            openAccountModal() {
                let self = this

                let encoded_details = jwt.decode(sessionStorage.accessToken);

                self.$refs.AccountModal.open(encoded_details.USER_ID, function () {
                    self.getAccountDetails();
                    self.$refs.AccountModal.close();
                })
            },
            openDatabaseModal() {
                let self = this;
                let encoded_details = jwt.decode(sessionStorage.accessToken);

                self.$refs.DatabaseModal.open(encoded_details.USER_ID, function () {
                    self.getAccountDetails();
                    self.$refs.DatabaseModal.close();
                })
            }
        }
    }
</script>