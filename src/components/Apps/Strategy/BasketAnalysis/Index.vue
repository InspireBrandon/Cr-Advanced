<template>
    <v-card tile>
        <v-toolbar flat dense dark color="grey darken-3">
            <v-toolbar-items>
                <v-menu dark offset-y style="margin-bottom: 10px;">
                    <v-btn slot="activator" flat>
                        File
                    </v-btn>
                    <v-list>
                        <v-list-tile>
                            <v-list-tile-title>Open</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile>
                            <v-list-tile-title>Save</v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu>
            </v-toolbar-items>
            <v-spacer></v-spacer>
            <v-toolbar-title>
                <span>Basket Analysis</span>
            </v-toolbar-title>
        </v-toolbar>
        <v-toolbar flat dark>
            <v-btn small fab color="primary" @click="openBasketMaint">
                <v-icon>edit</v-icon>
            </v-btn>
            <v-toolbar-items>
                <v-select :items="baskets" v-model="selectedBasket" return-object dark
                    style="margin-left: 10px; margin-top: 4px; width: 250px" placeholder="Select a basket" dense
                    hide-details>
                </v-select>
            </v-toolbar-items>
        </v-toolbar>
        <Grid :rowData="rowData" ref="Grid" />
        <basketMaint ref="basketMaint" />
    </v-card>
</template>

<script>
    import Axios from 'axios';

    let baskets = []

    import Grid from './Grid'
    import BasketConfig from './Basket_Config'
    import PremiumNature from './PremiumNature/PremiumNature.vue'
    import basketMaint from './basketMaint/BasketMaintenanceModal.vue'
    export default {
        components: {
            basketMaint,
            Grid,
            BasketConfig,
            PremiumNature
        },
        data() {
            return {
                rowData: [],
                baskets: [],
                selectedBasket: null
            }
        },
        created() {
            let self = this;
            self.getBasketReportData();
            self.getbaskets()
        },
        methods: {
            getbaskets() {
                let self = this
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + `Basket`)
                    .then(r => {
                        console.log(r);
                        r.data.forEach(e => {
                            self.baskets.push({
                                text: e.displayname,
                                value: e.id
                            })
                        })
                         console.log(self.baskets);
                        delete Axios.defaults.headers.common["TenantID"];
                    })
            },
            openBasketMaint() {
                let self = this
                self.$refs.basketMaint.open()
            },
            getBasketReportData() {
                let self = this;

                // Axios.get(process.env.VUE_APP_API + "BasketAnalysis")
            }
        }
    }
</script>