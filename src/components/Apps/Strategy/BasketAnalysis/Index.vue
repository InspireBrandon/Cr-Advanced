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
                <v-menu dark offset-y style="margin-bottom: 10px;">
                    <v-btn slot="activator" flat>
                        Setup
                    </v-btn>
                    <v-list>
                        <v-list-tile @click="openBasketMaint">
                            <v-list-tile-title>Basket</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile>
                            <v-list-tile-title @click="openClusterSetup">Clusters</v-list-tile-title>
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
            <!-- <v-btn small fab color="primary" @click="openBasketMaint">
                <v-icon>edit</v-icon>
            </v-btn> -->
            <v-toolbar-items>
                <v-select @change="onBasketSelect" :items="baskets" v-model="selectedBasket" return-object dark
                    style="margin-left: 10px; margin-top: 4px; width: 250px" placeholder="Select a basket" dense
                    hide-details>
                </v-select>
            </v-toolbar-items>
        </v-toolbar>
        <Grid :rowData="rowData" :basket="selectedBasket" v-if="selectedBasket != null" ref="Grid" />
        <basketMaint ref="basketMaint" />
        <ClusterMaint ref="ClusterMaint" />
    </v-card>
</template>

<script>
    import Axios from 'axios';

    import Grid from './Grid'
    import BasketConfig from './Basket_Config'
    import PremiumNature from './PremiumNature/PremiumNature.vue'
    import basketMaint from './basketMaint/BasketMaintenanceModal.vue'
    import ClusterMaint from './ClusterMaint/ClusterMaintModal.vue'
    export default {
        components: {
            basketMaint,
            Grid,
            BasketConfig,
            PremiumNature,
            ClusterMaint
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
            self.getbaskets()
        },
        methods: {
            openClusterSetup() {
                let self = this
                self.$refs.ClusterMaint.open()
            },
            getbaskets() {
                let self = this
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + `Basket`)
                    .then(r => {
                        r.data.forEach(e => {
                            self.baskets.push({
                                text: e.description,
                                value: e.id
                            })
                        })
                        delete Axios.defaults.headers.common["TenantID"];
                    })
            },
            openBasketMaint() {
                let self = this
                self.$refs.basketMaint.open()
            },
            getBasketReportData() {
                let self = this;

                Axios.get(process.env.VUE_APP_API + "BasketAnalysis?basketID=" + self.selectedBasket.value)
                    .then(r => {
                        self.rowData = r.data.basket_LinkList;
                    })
            },
            onBasketSelect() {
                let self = this;
                self.getBasketReportData();
            }
        }
    }
</script>