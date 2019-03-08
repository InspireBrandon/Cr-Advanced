<template>
    <div>
        <v-progress-linear v-if="showLoader" class="ma-0" color="primary" indeterminate height="5"></v-progress-linear>
        <v-container v-if="!showLoader" fluid grid-list-md>
            <v-layout row wrap>
                <v-flex lg3 md4 sm4 xs12 v-for="(appConfigDetail, index) in appConfigDetail" :key="index">
                    <app-block :appConfigDetail="appConfigDetail"></app-block>
                </v-flex>
                <v-flex lg4 md4 sm4 xs4>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
    import ApplicationDetailsHelper from '@/libs/system/application/application-details-helper.js';
    import app_block from '@/components/Main/Apps/app_block.vue';

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
            self.applicationDetailsHelper = new ApplicationDetailsHelper();
            self.apps = self.applicationDetailsHelper.getAllApplications();

            self.apps.forEach(app => {
                self.appConfigDetail.push(new ConfigDetail(
                    self.applicationDetailsHelper.getApplicationConfigBySystemCode(app.system_code),
                    self.applicationDetailsHelper.getApplicationDetailsBySystemCode(app.system_code)
                ));
            })

            setTimeout(() => {
                    self.showLoader = false;
            }, 1000);
        },
        methods: {}
    }

    function ConfigDetail(config, detail) {
        this.config = config;
        this.detail = detail;
    }
</script>