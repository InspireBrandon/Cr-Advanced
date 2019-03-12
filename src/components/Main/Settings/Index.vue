<template>
    <v-card>
        <v-progress-linear v-if="showLoader" class="ma-0" color="primary" indeterminate height="5"></v-progress-linear>
        <v-container grid-list-md v-if="!showLoader">
            <v-layout row wrap>
                <v-flex lg12 md12 sm12 xs12>
                    <v-container grid-list-md>
                        <v-layout row wrap>
                            <v-flex lg12 md12 sm12 xs12>
                                <v-card flat>
                                    <v-card-title primary-title>
                                        <v-layout row wrap>
                                            <v-flex lg12 md12 sm12 xs12>
                                                <h3>Background Image</h3>
                                            </v-flex>
                                            <v-flex lg12 md12 sm12 xs12>
                                                <v-layout row wrap>
                                                    <v-flex lg4 md4 sm6 x12>
                                                        <v-img :aspect-ratio="16/9" @click="openFileDialog" ref="backgroundImage"
                                                            :src="displayImage" alt="avatar"></v-img>
                                                    </v-flex>
                                                </v-layout>
                                            </v-flex>
                                        </v-layout>
                                    </v-card-title>
                                    <v-card-text>
                                        <v-form>
                                            <input @change="onImageChange" type="file" style="display: none;" ref="fileInput">
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
                        <HelpFile></HelpFile>
                    </v-container>
                </v-flex>
            </v-layout>
        </v-container>
    </v-card>
</template>

<script>
    import Axios from 'axios';
    import jwt from 'jsonwebtoken';
    import {   
        EventBus
    } from '@/libs/events/event-bus.js';
    import HelpFile from '@/components/Main/HelpFile/Index.vue'

    export default {
        components: {
            HelpFile
        },
        data() {
            return {
                loading: false,
                showLoader: true,
                displayImage: 'https://www.logistec.com/wp-content/uploads/2017/12/placeholder.png',
                settings: {
                    backgroundImage: ''
                }
            }
        },
        created() {
            this.getSystemUserSetting();
        },
        methods: {
            openRoute(routeItem) {
                let self = this;
                self.$router.push(routeItem)
            },
            getSystemUserSetting() {
                let self = this;
                let encoded_details = jwt.decode(sessionStorage.accessToken);

                Axios.get(process.env.VUE_APP_API + "SystemUserSetting?systemUserID=" + encoded_details.USER_ID)
                    .then(r => {
                        console.log(r.data)

                        if (r.data == null) {
                            self.settings.systemUserID = encoded_details.USER_ID;
                        } else {
                            self.settings = r.data;
                            if (r.data.backgroundImage != null) {
                                self.displayImage = 'data:image/png;base64,' + r.data.backgroundImage;
                            }
                        }

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
                    self.displayImage = url;
                    self.blobToArrayBuffer(file, result => {
                        self.settings.backgroundImage = Array.from(new Uint8Array(result));
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
            submit() {
                let self = this

                self.loading = true;

                let request = {
                    systemUserSettingID: self.settings.systemUserSettingID,
                    systemUserSettingUID: self.settings.systemUserSettingUID,
                    systemUserID: self.settings.systemUserID,
                    backgroundImage: self.settings.backgroundImage
                };

                Axios.post(process.env.VUE_APP_API + `SystemUserSetting`, request)
                    .then(() => {
                        self.loading = false;
                        EventBus.$emit('background-picture-changed', self.$refs.backgroundImage.src);
                    })
            }
        }
    }
</script>