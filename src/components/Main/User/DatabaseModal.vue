<template>
    <v-dialog transition="dialog-bottom-transition" fullscreen persistent v-model="modalShow">
        <v-card>
            <v-toolbar>
                <v-toolbar-title>Database Details</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn color="error" @click="close"> close
                </v-btn>
            </v-toolbar>
            <v-container grid-list-md>
                <v-layout row wrap>
                    <v-flex lg6 md6 sm12 xs12>
                        <v-text-field label="Database Name" v-model="databaseFriendly"> </v-text-field>
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
                tenantID: -1,
                tenantUID: '',
                databaseName: '',
                databaseFriendly: '',
                licenseID: -1,
                created: false,
                retryCount: 0,
                userID: -1,
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
                    tenantID: self.tenantID,
                    tenantUID: self.tenantUID,
                    databaseName: self.databaseName,
                    databaseFriendly: self.databaseFriendly,
                    licenseID: self.licenseID,
                    created: self.created,
                    retryCount: self.retryCount
                };

                Axios.post(process.env.VUE_APP_API + `Tenant?userID=${self.userID}`, request)
                    .then(r => {
                        if (r.data) {
                            self.afterClose(request)
                        }
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
            open(userID, callback) {
                let self = this
                self.afterClose = callback;
                self.userID = userID;
                self.modalShow = true
            }
        }
    }
</script>