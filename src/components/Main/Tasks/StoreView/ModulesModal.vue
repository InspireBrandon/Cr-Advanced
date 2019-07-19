<template>
    <div>
        <v-layout row justify-center>
            <v-dialog v-model="dialog" persistent max-width="800">
                <v-card>
                    <v-toolbar dark flat color="primary">
                        <v-toolbar-title>Configure Modules</v-toolbar-title>
                    </v-toolbar>
                    <v-card-text style="height: 300px; overflow-x: auto;">
                        {{ store_planogram_fixtures }}
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
    import Axios from 'axios';

    export default {
        data() {
            return {
                dialog: false,
                afterRuturn: null,
                store_Planogram_ID: null,
                store_planogram_fixtures: []
            }
        },
        methods: {
            show(data, afterRuturn) {
                let self = this;
                self.afterRuturn = afterRuturn;
                self.store_Planogram_ID = data.id;
                self.getStorePlanogramModules(data.id);
                self.dialog = true;
            },
            returnText() {
                let self = this;
                self.afterRuturn();
                self.dialog = false;
            },
            getStorePlanogramModules(store_Planogram_ID) {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + 'Store_Planogram_Fixture?store_Planogram_ID=' + store_Planogram_ID)
                    .then(r => {
                        delete Axios.defaults.headers.common["TenantID"];
                        self.store_planogram_fixtures = r.data.store_Planogram_FixtureList;
                    })
            }
        }
    }
</script>