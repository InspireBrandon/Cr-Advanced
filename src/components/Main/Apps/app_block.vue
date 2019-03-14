<template>
    <div>
        <v-card class="elevation-10">
            <v-toolbar dense color="primary" dark>
                <span @click="$router.push(appConfigDetail.config.configName + '_Details')" class="app_name">{{ appConfigDetail.detail.name }}</span>
            </v-toolbar>
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
                <v-btn @click="openApp(appConfigDetail.config.routes[0])" v-if="appConfigDetail.config.routes.length == 1">
                    Launch
                </v-btn>
                <v-menu offset-y v-if="appConfigDetail.config.routes.length > 1">
                    <v-btn slot="activator">
                        Launch
                    </v-btn>
                    <v-list>
                        <v-list-tile @click="openApp(routeItem)" v-for="(routeItem, index) in appConfigDetail.config.routes"
                            :key="index">
                            <v-list-tile-title>{{ routeItem.title }}</v-list-tile-title>
                            <v-divider></v-divider>
                        </v-list-tile>
                    </v-list>
                </v-menu>
                <v-spacer></v-spacer>
                <v-menu :close-on-content-click="false" offset-y bottom>
                    <v-btn slot="activator" icon>
                        <v-icon>settings</v-icon>
                    </v-btn>
                    <v-card>
                        <v-list>
                            <v-list-tile>
                                <v-list-tile-action>
                                    <v-switch></v-switch>
                                </v-list-tile-action>
                                <v-list-tile-title>Enable messages</v-list-tile-title>
                            </v-list-tile>
                            <v-list-tile>
                                <v-list-tile-action>
                                    <v-switch></v-switch>
                                </v-list-tile-action>
                                <v-list-tile-title>Enable hints</v-list-tile-title>
                            </v-list-tile>
                        </v-list>
                        <v-divider></v-divider>
                        <div class="app_version">version: {{ appConfigDetail.detail.version }}</div>
                    </v-card>
                </v-menu>
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
                if (routeItem.openInNewWindow) {
                   
                    
                    let routeData = this.$router.resolve({
                        name: routeItem.routeName
                    });

                    window.open(routeData.href, '_blank');
                } else {
                    self.$router.push(routeItem.route)
                }
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