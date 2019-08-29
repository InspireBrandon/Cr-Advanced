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
                            <v-list-tile-title>Baskets</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile @click="openClusterSetup">
                            <v-list-tile-title>Clusters</v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu>
            </v-toolbar-items>
            <v-spacer></v-spacer>
            <v-toolbar-title>
                <span>Basket Analysis</span>
            </v-toolbar-title>
            <!-- <v-btn small fab color="primary" @click="openBasketMaint">
                <v-icon>edit</v-icon>
            </v-btn> -->

        </v-toolbar>
        <v-toolbar dark flat>

            <v-toolbar-items>
                <v-select @change="onBasketSelect" :items="baskets" v-model="selectedBasket" return-object dark
                    style="margin-left: 10px; margin-top: 4px; width: 250px" placeholder="Select a basket" dense
                    hide-details>
                </v-select>
            </v-toolbar-items>
            <v-btn @click="getFilteredData">get</v-btn>
            <v-spacer></v-spacer>
            <v-btn @click="runReport" v-if="rowData.length > 0" color="primary">Run Report</v-btn>
        </v-toolbar>
        <Grid :rowData="rowData" :basket="selectedBasket" v-if="selectedBasket != null" ref="Grid" />

        <basketMaint :getBaskets="getbaskets" ref="basketMaint" />
        <ClusterMaint ref="ClusterMaint" />
        <StoreBasketReport ref="StoreBasketReport" />
    </v-card>
</template>

<script>
    import Axios from 'axios';

    import Grid from './Grid'
    import BasketConfig from './Basket_Config'
    import PremiumNature from './PremiumNature/PremiumNature.vue'
    import basketMaint from './BasketMaint/BasketMaintenanceModal.vue'
    import ClusterMaint from './ClusterMaint/ClusterMaintModal.vue'
    import StoreBasketReport from './StoreBasketReport/StoreBasketReport.vue'


    export default {
        components: {
            basketMaint,
            Grid,
            BasketConfig,
            PremiumNature,
            ClusterMaint,
            StoreBasketReport
        },
        data() {
            return {
                items: [],

                rowData: [],
                baskets: [],
                selectedBasket: null,
                projectGroups: [],
                selectedProjectGroup: null,
            }
        },
        created() {

            let self = this;
            self.getbaskets()
        },
        methods: {
            getFilteredData() {
                let self = this
                let tmp = []
                return tmp = self.$refs.Grid.getFilteredData()
            },

            getData() {
                let self = this
            },
            openClusterSetup() {
                let self = this
                self.$refs.ClusterMaint.open()
            },
            getbaskets() {
                let self = this
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + `Basket`)
                    .then(r => {
                        self.baskets = []
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
                        console.log(r);

                        self.rowData = r.data.basket_LinkList;
                    })
            },
            onBasketSelect() {
                let self = this;

                self.getBasketReportData();
            },
            runReport() {
                let self = this;
                self.$refs.StoreBasketReport.show(self.selectedBasket.text);
            },

        }
    }
</script>