<template>
    <div>
        <v-progress-linear v-if="showLoader" class="ma-0" color="primary" indeterminate height="5"></v-progress-linear>
        <v-container v-if="!showLoader" fluid grid-list-md>
            <v-layout row wrap v-if="appConfigDetail.length > 0">
                <v-flex lg3 md4 sm6 xs12 v-for="(appConfigDetail, index) in appConfigDetail" :key="index">
                    <app-block :appConfigDetail="appConfigDetail"></app-block>
                </v-flex>
            </v-layout>
            <v-layout row wrap v-else>
                <v-flex lg12 md12 sm12 xs12 v-if="appConfigDetail.length <= 0">
                    <v-card>
                        <v-card-text>
                            <p>It appears that you dont have any apps installed that support reports. <a href="#" @click.prevent="$router.push('/Store')">Click
                                    Here</a> to go and install some.</p>
                        </v-card-text>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
    import Axios from 'axios';
    import jwt from 'jsonwebtoken';

    import ApplicationDetailsHelper from '@/libs/system/application/application-details-helper.js';
    import app_block from './app_block.vue';

    export default {
        name: 'apps',
        components: {
            'app-block': app_block
        },
        data() {
            return {
                showLoader: true,
                apps: [],
                appConfigDetail: [],
                applicationHelper: null,
                applicationConfigHelper: null,
                applicationDetailsHelper: null,
            }
        },
        created() {
            let self = this;
            self.getInstalledApps();
        },
        methods: {
            getInstalledApps() {
                let self = this;
                let encoded_details = jwt.decode(sessionStorage.accessToken);

                Axios.get(process.env.VUE_APP_API + `Features?systemUserID=${encoded_details.USER_ID}`)
                    .then(r => {
                        self.getAppsFromManifest(r.data)
                    })
            },
            getAppsFromManifest(installedApps) {
                let self = this;

                self.applicationDetailsHelper = new ApplicationDetailsHelper();
                self.apps = self.applicationDetailsHelper.getAllApplications();

                self.apps.forEach(app => {
                    let appInstalled = false

                    installedApps.forEach(installedApp => {
                        if (app.system_code == installedApp.systemCode)
                            appInstalled = true;
                    })

                    if (appInstalled) {
                        let tmp = []

                        tmp.push(new ConfigDetail(
                            self.applicationDetailsHelper.getApplicationConfigBySystemCode(app.system_code),
                            self.applicationDetailsHelper.getApplicationDetailsBySystemCode(app.system_code)
                        ));
                        tmp.forEach(t => {

                            if (t.config.report == true) {
                                self.appConfigDetail.push(t)
                            }
                        })
                    }
                })

                self.showLoader = false;
            }
        }
    }

    function ConfigDetail(config, detail, system_code) {
        this.config = config;
        this.detail = detail;
        this.system_code = system_code;
    }
</script>