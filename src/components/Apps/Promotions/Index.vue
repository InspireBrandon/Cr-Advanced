<template>
    <v-card tile>
        <v-toolbar dense dark color="grey darken-3">
            <v-toolbar-items>
                <v-menu dark offset-y style="margin-bottom: 10px;">
                    <v-btn slot="activator" flat>
                        File
                    </v-btn>
                    <v-list dense>
                        <v-list-tile>
                            <v-list-tile-title>New</v-list-tile-title>
                        </v-list-tile>
                        <v-divider></v-divider>
                        <v-list-tile>
                            <v-list-tile-title>Open</v-list-tile-title>
                        </v-list-tile>
                        <v-divider></v-divider>
                        <v-list-tile>
                            <v-list-tile-title>Save</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile>
                            <v-list-tile-title>Save as</v-list-tile-title>
                        </v-list-tile>
                        <v-divider></v-divider>
                        <v-list-tile>
                            <v-list-tile-title>Close</v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu>
            </v-toolbar-items>
            <v-spacer></v-spacer>
            <v-toolbar-title>
                <span>Promotions</span>
            </v-toolbar-title>
        </v-toolbar>
        <!-- <v-tabs-items v-model="active">
            <v-tab-item v-for="tab in tabs" :key="tab.name">
                <v-card flat tile>
                    <component ref="component" :is="tab.component"></component>
                </v-card>
            </v-tab-item>
        </v-tabs-items> -->
        <!-- <SettingsModal ref="settingsModal" />
        <Spinner ref="spinner"></Spinner> -->
    </v-card>
</template>

<script>
    export default {
        name: 'promotions',
        data() {
            return {}
        },
        methods: {
            newFile() {

            },
            openFile() {

            },
            saveFile() {

            },
            saveFileAs() {

            },
            closeFile() {

            }
        }
    }
</script>