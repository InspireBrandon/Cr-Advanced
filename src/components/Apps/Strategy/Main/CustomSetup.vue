<template>
    <div>
        <v-dialog v-model="dialog" width="800" persistent>
            <v-card style="overflow: auto;">
                <v-toolbar dark flat color="primary">
                    <v-toolbar-title>Custom Cluster Setup</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon @click.native="dialog = false">
                        <v-icon>close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-text>
                    <v-container grid-list-md>
                        <v-layout row wrap>
                            <v-flex md4>
                                <v-checkbox v-model="selected" value="System Turnover Group" hide-details
                                    label="System Turnover Group"></v-checkbox>
                                <v-checkbox v-model="selected" value="User Turnover Group" hide-details
                                    label="User Turnover Group"></v-checkbox>
                                <v-checkbox v-model="selected" value="User Premium Basket" hide-details
                                    label="User Premium Basket"></v-checkbox>
                                <v-checkbox v-model="selected" value="System Premium Basket" hide-details
                                    label="System Premium Basket"></v-checkbox>
                                <v-checkbox v-model="selected" value="User Sheep Farming" hide-details
                                    label="User Sheep Farming"></v-checkbox>
                                <v-checkbox v-model="selected" value="System Sheep Farming" hide-details
                                    label="System Sheep Farming"></v-checkbox>
                            </v-flex>
                            <v-flex md8>
                                <v-card flat>
                                    <v-list dense>
                                        <v-list-tile>
                                            <v-list-tile-avatar>1</v-list-tile-avatar>
                                            <v-list-tile-content>Store Cluster</v-list-tile-content>
                                        </v-list-tile>
                                        <v-list-tile v-for="(item, idx) in selected" :key="idx">
                                            <v-list-tile-avatar>{{ (idx + 2) }}</v-list-tile-avatar>
                                            <v-list-tile-content>{{ item }}</v-list-tile-content>
                                            <v-list-tile-actions>
                                                <v-btn flat small :disabled="idx == 0">
                                                    <v-icon>arrow_upward</v-icon>
                                                </v-btn>
                                                <v-btn flat small :disabled="idx == selected.length - 1">
                                                    <v-icon>arrow_downward</v-icon>
                                                </v-btn>
                                            </v-list-tile-actions>
                                        </v-list-tile>
                                    </v-list>
                                </v-card>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card-text>
                <v-divider class="mx-2"></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="returnSetupConfig">Continue</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import Axios from 'axios';

    export default {
        data() {
            return {
                dialog: false,
                afterComplete: null,
                selected: []
            }
        },
        methods: {
            show(afterComplete) {
                let self = this;
                self.dialog = true;
                self.afterComplete = afterComplete;
            },
            returnSetupConfig() {
                let self = this;

                self.dialog = false;
                self.afterComplete();
            }
        }
    }
</script>