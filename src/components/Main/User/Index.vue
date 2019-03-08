<template>
    <div>
        <v-progress-linear v-if="showLoader" class="ma-0" color="primary" indeterminate height="5"></v-progress-linear>
        <v-container grid-list-md v-if="!showLoader">
            <v-layout row wrap>
                <v-flex lg12 md12 sm12 xs12>
                    <v-container grid-list-md>
                        <v-layout row wrap>
                            <v-flex lg12 md12 sm12 xs12>
                                <v-card flat>
                                    <v-card-title primary-title>
                                        <v-layout class="header text-xs-center" row wrap>
                                            <v-flex lg12 md12 sm12 xs12>
                                                <v-avatar :tile="false" :size="150" color="grey lighten-4">
                                                    <img @click="openFileDialog" ref="avatarImage" :src="displayImage"
                                                        alt="avatar">
                                                </v-avatar>
                                            </v-flex>
                                        </v-layout>
                                    </v-card-title>
                                    <v-card-text>
                                        <v-form @submit.prevent="">
                                            <v-layout row wrap>
                                                <v-flex md6>
                                                    <v-text-field label="First Name" v-model="profile.firstname"></v-text-field>
                                                </v-flex>
                                                <v-flex md6>
                                                    <v-text-field label="Last Name" v-model="profile.lastname"></v-text-field>
                                                </v-flex>
                                                <v-flex md6>
                                                    <v-text-field label="Email Address" v-model="profile.emailAddress"></v-text-field>
                                                </v-flex>
                                                <input @change="onImageChange" type="file" style="display: none;" ref="fileInput">
                                            </v-layout>
                                        </v-form>
                                    </v-card-text>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="primary" :loading="loading" @click="submit">save</v-btn>
                                        <v-btn color="grey darken-1" @click="$router.go(-1)">cancel</v-btn>
                                    </v-card-actions>
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
    import {
        EventBus
    } from '@/libs/events/event-bus.js';

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
                loading: false,
                account: true,
                profile: {
                    image: ''
                },
                features: [],
                dataBases: [],
                showLoader: true,
                displayImage: '',
            }
        },
        created() {
            this.getAccountDetails()
        },
        methods: {
            submit() {
                let self = this

                self.loading = true;

                let request = {
                    systemUserID: self.profile.systemUserID,
                    systemUserUID: self.profile.systemUserUID,
                    accountID: self.profile.accountID,
                    firstname: self.profile.firstname,
                    lastname: self.profile.lastname,
                    emailAddress: self.profile.emailAddress,
                    username: self.profile.username,
                    password: self.profile.password,
                    superUser: self.profile.superUser,
                    image: self.profile.image
                };

                Axios.put(process.env.VUE_APP_API + `SystemUser`, request)
                    .then(() => {
                        self.loading = false;
                        EventBus.$emit('display-picture-changed', self.$refs.avatarImage.src);
                    })
            },
            getAccountDetails() {
                let self = this;
                let encoded_details = jwt.decode(sessionStorage.accessToken);

                Axios.get(process.env.VUE_APP_API + `SystemUser?id=${encoded_details.USER_ID}`)
                    .then(r => {
                        self.profile = r.data;
                        self.displayImage = 'data:image/png;base64,' + r.data.image;
                        self.showLoader = false;
                    })
            },
            openFileDialog() {
                let self = this;
                self.$refs.fileInput.value = null
                self.$refs.fileInput.click();
            },
            onImageChange(e) {
                let self = this;

                const files = e.target.files;
                let file = files[0];
                self.blobToDataUrl(file, url => {
                    self.$refs.avatarImage.src = url;
                    self.blobToArrayBuffer(file, result => {
                        self.profile.image = Array.from(new Uint8Array(result));
                    })
                })
            },
            blobToArrayBuffer(blob, callback) {
                var a = new FileReader();
                a.onload = function () {
                    callback(a.result);
                }
                a.readAsArrayBuffer(blob);
            },
            blobToDataUrl(blob, callback) {
                var a = new FileReader();
                a.onload = function () {
                    callback(a.result);
                }
                a.readAsDataURL(blob);
            },
        }
    }
</script>