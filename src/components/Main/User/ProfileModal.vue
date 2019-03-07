<template>
    <v-dialog transition="dialog-bottom-transition" fullscreen persistent v-model="modalShow">
        <v-card>
            <v-toolbar>
                <v-toolbar-title>Profile Details</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn color="error" @click="close"> close
                </v-btn>
            </v-toolbar>
            <v-container grid-list-md>
                <v-layout row wrap>
                    <v-flex lg12 md12 sm12 xs12>
                        <v-avatar :tile="false" :size="150" color="grey lighten-4">
                            <img @click="openFileDialog" ref="avatarImage" :src="displayImage" alt="avatar" />
                        </v-avatar>
                    </v-flex>
                    <v-flex lg6 md6 sm12 xs12>
                        <v-text-field label="First Name" v-model="firstname"> </v-text-field>
                    </v-flex>
                    <v-flex lg6 md6 sm12 xs12>
                        <v-text-field label="Last Name" v-model="lastname"></v-text-field>
                    </v-flex>
                    <v-flex lg6 md6 sm12 xs12>
                        <v-text-field label="Email Address" v-model="emailAddress"></v-text-field>
                    </v-flex>
                </v-layout>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="submit">save</v-btn>
                </v-card-actions>
            </v-container>
            <input @change="onImageChange" type="file" style="display: none;" ref="fileInput">
        </v-card>
    </v-dialog>
</template>
<script>
    import Axios from 'axios';
    export default {

        data() {
            return {
                systemUserID: -1,
                systemUserUID: '',
                accountID: -1,
                firstname: '',
                lastname: '',
                emailAddress: '',
                username: '',
                password: '',
                superUser: false,
                image: '',
                displayImage: 'https://vuetifyjs.com/apple-touch-icon-180x180.png',
                modalShow: false,
                afterClose: null
            }

        },
        created() {},
        methods: {
            submit() {
                let self = this

                let request = {
                    systemUserID: self.systemUserID,
                    systemUserUID: self.systemUserUID,
                    accountID: self.accountID,
                    firstname: self.firstname,
                    lastname: self.lastname,
                    emailAddress: self.emailAddress,
                    username: self.username,
                    password: self.password,
                    superUser: self.superUser,
                    image: self.image
                };

                Axios.put(process.env.VUE_APP_API + `SystemUser`, request)
                    .then(r => {
                        if (r.data) {
                            self.afterClose(request)
                        }
                    })
            },
            setProfileData(data, afterClose) {
                let self = this;
                self.systemUserID = data.systemUserID;
                self.systemUserUID = data.systemUserUID;
                self.accountID = data.accountID;
                self.firstname = data.firstname;
                self.lastname = data.lastname;
                self.emailAddress = data.emailAddress;
                self.username = data.username;
                self.password = data.password;
                self.superUser = data.superUser;
                self.image = data.image;
                self.displayImage = 'data:image/png;base64,' + data.image;
                self.afterClose = afterClose;
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
                        self.image = Array.from(new Uint8Array(result));
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
            close() {
                let self = this
                self.modalShow = false
            },
            open(data, callback) {
                let self = this
                self.modalShow = true
                self.setProfileData(data, callback);
            }
        }
    }
</script>