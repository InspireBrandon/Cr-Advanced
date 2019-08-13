<template>
    <div>
        <v-toolbar dark dense flat>
            <v-toolbar-title>
                Retailer Config
            </v-toolbar-title>
        </v-toolbar>
        <v-container>
            <v-card flat>

                <v-layout row wrap justify-space-around>
                    <v-flex md3>
                        <v-toolbar flat dark color="primary">
                            <v-toolbar-title>
                                areas
                            </v-toolbar-title>
                        </v-toolbar>
                        <!-- <v-card>
                       
                        <v-card-text> -->
                        <v-text-field label="Area 1" v-model="config.area_1_Name" />
                        <v-text-field label="Area 2" v-model="config.area_2_Name" />
                        <v-text-field label="Area 3" v-model="config.area_3_Name" />
                        <v-text-field label="Area 4" v-model="config.area_4_Name" />
                        <v-text-field label="Area 5" v-model="config.area_5_Name" />
                        <!-- </v-card-text>
                    </v-card> -->
                    </v-flex>

                    <v-flex md3>
                        <v-toolbar flat dark color="primary">
                            <v-toolbar-title>
                                Baskets
                            </v-toolbar-title>
                        </v-toolbar>
                        <!-- <v-card>
                      
                        <v-card-text> -->
                        <v-text-field label="Basket 1 Name" v-model="config.basket_1_Name" />
                        <v-text-field label="Basket 2 Name" v-model="config.basket_2_Name" />
                        <v-text-field label="Basket 3 Name" v-model="config.basket_3_Name" />
                        <v-text-field label="Basket 4 Name" v-model="config.basket_4_Name" />
                        <v-text-field label="Basket 5 Name" v-model="config.basket_5_Name" />
                        <!-- </v-card-text>
                    </v-card> -->
                    </v-flex>
                    <v-flex md3>
                        <v-toolbar flat dark color="primary">
                            <v-toolbar-title>
                                Observations
                            </v-toolbar-title>
                        </v-toolbar>
                        <!-- <v-card>
                        
                        <v-card-text> -->
                        <v-text-field label="Observation 1" v-model="config.observation_1" />
                        <v-text-field label="Observation 2" v-model="config.observation_2" />
                        <v-text-field label="Observation 3" v-model="config.observation_3" />
                        <v-text-field label="Observation 4" v-model="config.observation_4" />
                        <v-text-field label="Observation 5" v-model="config.observation_5" />
                        <!-- </v-card-text>
                    </v-card> -->
                    </v-flex>
                </v-layout>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="success" @click="save">save</v-btn>
                </v-card-actions>
            </v-card>
        </v-container>
    </div>
</template>
<script>
    import Axios from 'axios'
    export default {
        data() {
            return {
                config: [],
            }
        },
        mounted() {
            this.GetData()
        },
        methods: {
            save() {
                let self = this
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.post(process.env.VUE_APP_API + `RetailerConfig?db=CR-Hinterland-Live`, config)
                    .then(r => {
                        console.log(r);
                        self.config = r.data
                        delete Axios.defaults.headers.common["TenantID"];
                    })
            },
            GetData() {

                let self = this
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + `RetailerConfig?db=CR-Hinterland-Live`)
                    .then(r => {
                        console.log(r);
                        self.config = r.data
                        delete Axios.defaults.headers.common["TenantID"];
                    })
            },
        }
    }
</script>