<template>
    <div>
        <v-layout row justify-center>
            <v-dialog v-model="dialog" persistent max-width="400">
                <v-card v-if="retailerConfig != null">
                    <v-toolbar flat dark dense color="primary">
                        <v-toolbar-title>Edit System Baskets</v-toolbar-title>
                    </v-toolbar>
                    <v-card-text>
                        <v-form @submit.prevent="returnText">
                            <div v-for="i in 5" :key="i">
                                <label>Basket {{ i }}</label>
                                <div>
                                    <v-text-field class="pt-0" v-model="retailerConfig[`basket_${i}_Name`]">
                                    </v-text-field>
                                </div>
                            </div>
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="error darken-1" @click.native="dialog = false">Cancel</v-btn>
                        <v-btn color="primary darken-1" @click.native="saveRetailerConfig">Save</v-btn>
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
                retailerConfig: null,
                dialog: false,
                afterRuturn: null,
            }
        },
        methods: {
            show(afterRuturn) {
                let self = this;
                self.retailerConfig = null;
                self.getRetailerConfig();
                self.afterRuturn = afterRuturn;
                self.dialog = true;
            },
            getRetailerConfig() {
                let self = this;

                Axios.get(process.env.VUE_APP_API + "RetailerConfig?db=CR-HINTERLAND-LIVE")
                    .then(r => {
                        self.retailerConfig = r.data;
                    })
            },
            saveRetailerConfig() {
                let self = this;

                Axios.post(process.env.VUE_APP_API + "RetailerConfig?db=CR-HINTERLAND-LIVE", self.retailerConfig)
                    .then(r => {
                        self.dialog = false;
                    })
            },
        }
    }
</script>