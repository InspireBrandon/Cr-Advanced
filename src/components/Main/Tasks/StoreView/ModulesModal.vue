<template>
    <div>
        <v-layout row justify-center>
            <v-dialog v-model="dialog" persistent max-width="800">
                <v-card>
                    <v-toolbar dark flat color="primary">
                        <v-toolbar-title>Configure Modules</v-toolbar-title>
                    </v-toolbar>
                    <v-card-text style="height: 300px; overflow-x: auto;">
                        <FixtureDetails ref="fixtureDetails" />
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-actions>
                        Total Modules: <span v-if="$refs.fixtureDetails != undefined">{{ $refs.fixtureDetails.totalModules }}</span> 
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
    import Axios from 'axios';
    import FixtureDetails from './FixtureDetails'

    export default {
        components: {
            FixtureDetails
        },
        data() {
            return {
                dialog: false,
                afterRuturn: null,
                store_Planogram_ID: null,
            }
        },
        methods: {
            show(data, afterRuturn) {
                let self = this;
                self.afterRuturn = afterRuturn;
                self.store_Planogram_ID = data.id;
                self.dialog = true;
                self.$refs.fixtureDetails.getStorePlanogramModules(data.id);
            },
            returnText() {
                let self = this;
                var newData = self.$refs.fixtureDetails.getFixtureData();
                self.afterRuturn(newData.fixture_types, newData.totalModules, newData.height);
                self.dialog = false;
            }
        }
    }
</script>