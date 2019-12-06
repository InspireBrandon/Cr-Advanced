<template>
    <v-dialog v-model="dialog" persistent width="800">
        <v-toolbar dark dense color="primary">
            <v-toolbar-title>
                Power Bi Config
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="dialog=false">
                <v-icon>
                    close
                </v-icon>
            </v-btn>
        </v-toolbar>

        <v-card>
            <v-container grid-list-md>
                <v-layout row wrap>
                    <v-flex md6>
                        <v-text-field v-model="config.apiUrl" label="Api Url">
                        </v-text-field>
                    </v-flex>
                    <v-flex md6>
                        <v-text-field v-model="config.authorityUrl" label="Authority Url">
                        </v-text-field>
                    </v-flex>
                    <v-flex md6>
                        <v-text-field v-model="config.resourceURL" label="Resource URL">
                        </v-text-field>
                    </v-flex>
                </v-layout>
            </v-container>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="dialog=false">cancel</v-btn>
                <v-btn @click="updateConfig" color="primary">update Config</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
    import Axios from 'axios'
    export default {
        data() {
            return {
                dialog: false,
                config: {
                    id: null,
                    apiUrl: null,
                    authorityUrl: null,
                    resourceURL: null,
                }
            }
        },
        methods: {
            getConfig() {
                let self = this
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                Axios.get(process.env.VUE_APP_API + `Power_BI/getConfig`).then(r => {
                    console.log("getConfig", r);
                    if (r.data.length > 0) {
                        self.config = r.data[0]
                    }
                    self.dialog = true
                })

            },
            open() {
                let self = this
                self.getConfig()
            },
            updateConfig() {
                let self = this
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                Axios.post(process.env.VUE_APP_API + `Power_BI/updateConfig`, self.config).then(r => {
                    console.log("updateConfig", r);
                    self.dialog=false;
                })
            }
        }
    }
</script>