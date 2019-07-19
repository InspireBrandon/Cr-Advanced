<template>
    <div>
        <v-layout row justify-center>
            <v-dialog v-model="dialog" persistent max-width="800">
                <v-card>
                    <v-toolbar dark flat color="primary">
                        <v-toolbar-title>Configure Modules</v-toolbar-title>
                    </v-toolbar>
                    <v-card-text style="height: 300px; overflow-x: auto;">
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="error darken-1" @click.native="dialog = false">Cancel</v-btn>
                        <v-btn color="primary darken-1" @click.native="returnText">Continue</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-layout>
    </div>
</template>

<script>
    import axios from 'axios';

    export default {
        data() {
            return {
                dialog: false,
                afterRuturn: null
            }
        },
        methods: {
            show(afterRuturn) {
                let self = this;
                self.dialog = true;
            },
            returnText() {
                let self = this;
                self.afterRuturn();
                self.dialog = false;
            },
            getStorePlanogramModules() {
                let self = this;
            }
        }
    }
</script>