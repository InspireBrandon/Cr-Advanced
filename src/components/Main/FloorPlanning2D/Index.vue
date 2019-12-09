<template>
    <div>
        <v-toolbar dark dense flat color="primary">
            <v-toolbar-title>Floor Planning 2D</v-toolbar-title>
        </v-toolbar>
        <div id="toolbar">
            <v-menu offset-y>
                <v-btn slot="activator" class="ma-0 pa-0" flat small>file</v-btn>
                <v-list dense>
                    <v-list-tile>
                        <v-list-tile-title>New</v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile>
                        <v-list-tile-title>Open</v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile>
                        <v-list-tile-title>Save</v-list-tile-title>
                    </v-list-tile>
                    <v-divider></v-divider>
                    <v-list-tile>
                        <v-list-tile-title>Close</v-list-tile-title>
                    </v-list-tile>
                </v-list>
            </v-menu>
        </div>
        <!-- <v-toolbar dense flat color="white" style="border-bottom: 1px solid lightgrey">
            <v-toolbar-items>
                <v-menu offset-y style="margin-bottom: 10px;">
                    <v-btn slot="activator" flat>file</v-btn>
                    <v-list dense>
                        <v-list-tile>
                            <v-list-tile-title>New</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile>
                            <v-list-tile-title>Open</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile>
                            <v-list-tile-title>Save</v-list-tile-title>
                        </v-list-tile>
                        <v-divider></v-divider>
                        <v-list-tile>
                            <v-list-tile-title>Close</v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu>
            </v-toolbar-items>
        </v-toolbar> -->
        <div id="docker"></div>
    </div>
</template>

<script>
    import Docker from './src/libs/dock/docker.js'
    import Settings from './views/Settings'

    export default {
        components: {
            Settings
        },
        data() {
            return {
                docker: null,
                view: {
                    showDocument: true,
                    showSettings: true,
                    showLayers: true,
                }
            }
        },
        mounted() {
            let self = this;
            self.init();
        },
        methods: {
            init() {
                let self = this;
                self.initDocker();
            },
            initDocker() {
                let self = this;

                let config = {
                    components: {
                        settings: Settings
                    }
                }

                self.docker = new Docker(config);
                self.docker.init();
            },
            setView() {
                let self = this;
                console.log(self.docker)
            }
        }
    }
</script>

<style scoped>
    #docker {
        height: calc(100vh - 97px);
        width: 100%;
    }

    #toolbar {
        padding-left: 15px;
    }
</style>