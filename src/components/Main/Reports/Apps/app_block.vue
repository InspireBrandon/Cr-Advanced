<template>
    <div>
        <span class="app_name">{{appConfigDetail.detail.name}}</span>
        <v-card class="elevation-10">
            <v-img :src="appConfigDetail.detail.imgSrc" height="200px">
                <v-container fill-height fluid pa-2>
                    <v-layout fill-height>
                        <v-flex xs12 align-end flexbox>
                            <span></span>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-img>

            <v-card-actions>
                <v-btn @click="openApp(appConfigDetail.config.ReportListRoute.route)" 
                    flat>
                    open reports
                </v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>

<script>
    export default {
        name: 'app_block',
        props: ['appConfigDetail'],
        methods: {
            openApp(routeItem) {
                let self = this;
                self.$router.push(routeItem)
            }
        }
    }
</script>

<style scoped>
    .app_name {
        cursor: pointer;
    }

    .app_name:hover {
        font-weight: 500;
    }

    .app_version {
        text-align: center;
    }
</style>