<template>
    <v-container fluid grid-list-md>
        <v-layout row wrap>
            <v-flex lg3 md4 sm4 xs6 v-for="(app, index) in apps" :key="index">
                <app-block :openApp="openApp" :appDetails="app.details"></app-block>
            </v-flex>
            <v-flex lg4 md4 sm4 xs4>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import app_block from '@/components/Main/Apps/app_block.vue';

    export default {
        name: 'apps',
        components: {
            'app-block': app_block
        },
        data() {
            return {
                apps: []
            }
        },
        created() {
            let self = this;
            self.apps = require('@/assets/manifest/app_manifest.json');
        },
        methods: {
            openApp() {
                let routeData = this.$router.resolve({
                    name: 'range_planning',
                    // query: {
                    //     data: "someData"
                    // }
                });
                window.open(routeData.href, '_blank');
            }
        }
    }
</script>