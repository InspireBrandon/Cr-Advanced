<template>
    <v-container fluid grid-list-md>
        <v-toolbar dense flat>
            <v-toolbar-title>New</v-toolbar-title>
        </v-toolbar>
        <v-layout row wrap>
            <v-flex>
                <v-card color="grey darken-4">
                    <v-card-text>
                        <store-carousel :appConfigDetail="appConfigDetail"></store-carousel>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import ApplicationDetailsHelper from '@/libs/system/application/application-details-helper.js';
    import store_carousel from '@/components/Main/Store/store_carousel.vue';

    export default {
        name: 'apps',
        components: {
            'store-carousel': store_carousel
        },
        data() {
            return {
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
        },
        methods: {}
    }

    function ConfigDetail(config, detail) {
        this.config = config;
        this.detail = detail;
    }
</script>