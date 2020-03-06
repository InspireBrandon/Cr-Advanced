<template>
    <div>
        <v-layout row justify-center>
            <v-dialog v-model="dialog" persistent max-width="600">
                <v-card v-if="config != null">
                    <v-toolbar flat dark dense color="primary">
                        <v-toolbar-title>Edit {{ planogramName }} Baskets</v-toolbar-title>
                    </v-toolbar>
                    <v-card-text>
                        <v-form @submit.prevent="returnText">
                            <div v-for="i in 5" :key="i">
                                <label>Basket {{ i }}</label>
                                <div>
                                    <v-select class="pt-0" v-model="config[`basket_${i}_Name`]" :items="graphTypes"></v-select>
                                    <!-- <v-text-field class="pt-0" v-model="retailerConfig[`basket_${i}_Name`]">
                                    </v-text-field> -->
                                </div>
                            </div>
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="error darken-1" @click.native="dialog = false">Cancel</v-btn>
                        <v-btn color="primary darken-1" @click.native="saveConfig">Save</v-btn>
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
                planogramID: null,
                planogramName: '',
                config: null,
                dialog: false,
                afterRuturn: null,
                graphTypes: []
            }
        },
        methods: {
            show(planogramID, planogramName, afterRuturn) {
                let self = this;
                self.planogramID = planogramID;
                self.planogramName = planogramName;
                self.config = null;
                self.getDistinctGraphTypes();
                self.getConfig();
                self.afterRuturn = afterRuturn;
                self.dialog = true;
            },
            getConfig() {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + "PowerBI/GetPlanogramBaskets?planogramID=" + self.planogramID)
                    .then(r => {
                        self.config = r.data;
                    })
            },
            saveConfig() {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                for (var i = 1; i < 6; i++) {
                    let item = self.config[`basket_${i}_Name`];
                    if(item == undefined || item == null)
                        self.config[`basket_${i}_Name`] = "";
                }
                
                console.log(self.config)

                self.config.planogramID = self.planogramID;

                Axios.post(process.env.VUE_APP_API + "PowerBI/SavePlanogramBaskets", self.config)
                    .then(r => {
                        self.dialog = false;
                    })
            },
            getDistinctGraphTypes() {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + "PowerBI/GetDistinctGraphTypes")
                    .then(r => {
                        self.graphTypes = r.data;
                        self.graphTypes.unshift('');
                    })
            },
        }
    }
</script>