<template>
    <div>
        <v-progress-linear v-if="showLoader" class="ma-0" color="primary" indeterminate height="5"></v-progress-linear>
        <v-container v-if="!showLoader" fluid grid-list-md>
            <v-layout row wrap>
                
                <v-flex>
                    <store-carousel :appConfigDetail="appConfigDetail"></store-carousel>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
    import Axios from 'axios';
    import jwt from 'jsonwebtoken';

    import ApplicationDetailsHelper from '@/libs/system/application/application-details-helper.js';
    import store_carousel from '@/components/Main/Store/store_carousel.vue';

    export default {
        name: 'apps',
        components: {
            'store-carousel': store_carousel
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
                        console.log(r.data);
                    })
            },
            getAppsFromManifest(installedApps) {
                let self = this;

                self.applicationDetailsHelper = new ApplicationDetailsHelper();
                self.apps = self.applicationDetailsHelper.getAllApplications();

                self.apps.forEach(app => {
                    let appInstalled = false

                    installedApps.forEach(installedApp => {
                        if(app.system_code == installedApp.systemCode)
                            appInstalled = true;
                    })

                    self.appConfigDetail.push(new ConfigDetail(
                        self.applicationDetailsHelper.getApplicationConfigBySystemCode(app.system_code),
                        self.applicationDetailsHelper.getApplicationDetailsBySystemCode(app.system_code),
                        app.system_code,
                        appInstalled
                    ));
                })

                self.showLoader = false;
            }
        }
    }

    function ConfigDetail(config, detail, system_code, installed) {
        this.config = config;
        this.detail = detail;
        this.system_code = system_code;
        this.installed = installed
    }
</script>