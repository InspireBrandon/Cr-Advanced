<template>
    <div>
        <v-toolbar dense dark color="primary"> <span class="app_name" @click="$router.push(appConfigDetail.config.configName + '_Details')">{{
                appConfigDetail.detail.name }} </span></v-toolbar>
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
                <v-btn v-if="!appConfigDetail.installed" @click="installApp" :loading="loading" style="width: 100%;"
                    flat>
                    Install
                </v-btn>
                <v-btn v-else @click="uninstallApp" :loading="loading" style="width: 100%;">
                    Uninstall
                </v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>

<script>
    import Axios from 'axios';
    import jwt from 'jsonwebtoken';

    export default {
        data() {
            return {
                loading: false
            }
        },
        name: 'app_block',
        props: ['appConfigDetail'],
        methods: {
            installApp() {
                let self = this;
                let encoded_details = jwt.decode(sessionStorage.accessToken);
                self.loading = true;

                Axios.post(process.env.VUE_APP_API +
                        `Features/Install?systemUserID=${encoded_details.USER_ID}&systemCode=${self.appConfigDetail.system_code}`
                    )
                    .then(r => {
                        self.loading = false;
                        self.appConfigDetail.installed = true;
                    })
            },
            uninstallApp() {
                let self = this;
                let encoded_details = jwt.decode(sessionStorage.accessToken);
                self.loading = true;

                Axios.post(process.env.VUE_APP_API +
                        `Features/Uninstall?systemUserID=${encoded_details.USER_ID}&systemCode=${self.appConfigDetail.system_code}`
                    )
                    .then(r => {
                        self.loading = false;
                        self.appConfigDetail.installed = false;
                    })
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