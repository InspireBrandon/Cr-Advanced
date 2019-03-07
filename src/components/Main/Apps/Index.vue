<template>
    <v-container fluid grid-list-md>
        <v-layout row wrap>
            <v-flex lg3 md4 sm4 xs12 v-for="(appDetail, index) in appDetails" :key="index">
                <app-block :openApp="openApp" :appDetails="appDetail"></app-block>
            </v-flex>
            <v-flex lg4 md4 sm4 xs4>
            </v-flex>
        </v-layout>
    </v-container>
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
                appDetails: [],
                applicationDetailsHelper: null,
            }
        },
        created() {
            let self = this;
            self.applicationDetailsHelper = new ApplicationDetailsHelper();
            self.appDetails = self.applicationDetailsHelper.getAllApplicationDetails();
        },
        methods: {
            openApp(appDetail) {

                console.log(appDetail);

                // let routeData = this.$router.resolve({
                //     name: 'range_planning',
                //     // query: {
                //     //     data: "someData"
                //     // }
                // });
                // window.open(routeData.href, '_blank');
            }
        }
    }
</script>