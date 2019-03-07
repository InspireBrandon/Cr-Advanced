<template>
    <div>
        <span class="app_name">{{ appDetails.name }}</span>
        <v-card class="elevation-0">
            <v-img :src="appDetails.imgSrc" height="200px">
                <v-container fill-height fluid pa-2>
                    <v-layout fill-height>
                        <v-flex xs12 align-end flexbox>
                            <span></span>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-img>

            <v-card-actions>
                <v-btn flat @click="openApp(appDetails)">
                    Launch
                </v-btn>
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
                        <div class="app_version">version: {{ appDetails.version }}</div>
                    </v-card>
                </v-menu>
            </v-card-actions>
        </v-card>
    </div>
</template>

<script>
    export default {
        name: 'app_block',
        props: ['appDetails', 'openApp']
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