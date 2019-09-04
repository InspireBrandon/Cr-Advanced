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

            <v-btn @click="getFilteredData(true)" color="primary" v-if="rowData.length>0">apply yes</v-btn>
            <v-btn @click="getFilteredData(false)" color="primary" v-if="rowData.length>0">apply no</v-btn>
            <v-spacer></v-spacer>
            <v-text-field append-icon="search" type="text" id="filter-text-box" placeholder="Filter..."
                @input="onFilterTextBoxChanged" v-model="filterText">
            </v-text-field>
            <v-spacer></v-spacer>
            <v-btn @click="runReport" v-if="rowData.length > 0" color="primary">Run Report</v-btn>
        </v-toolbar>
        <Grid :rowData="rowData" :basket="selectedBasket" v-if="selectedBasket != null" ref="Grid" />

        <basketMaint :getBaskets="getbaskets" ref="basketMaint" />
        <ClusterMaint :basket_ID="basket_ID" ref="ClusterMaint" />
        <StoreBasketReport ref="StoreBasketReport" />
        <Spinner ref="Spinner" />
        <YesNoModal ref="YesNoModal" />
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

    import Spinner from "@/components/Common/Spinner";
    import YesNoModal from "@/components/Common/YesNoModal";


    export default {
        components: {
            basketMaint,
            YesNoModal,
            Grid,
            BasketConfig,
            PremiumNature,
            ClusterMaint,
            StoreBasketReport,
            Spinner
        },
        data() {
            return {
                items: [],
                filterText: null,
                rowData: [],
                baskets: [],
                selectedBasket: null,
                projectGroups: [],
                selectedProjectGroup: null,
                basket_ID: null
            }
        },
        created() {

            let self = this;
            self.getbaskets()
        },
        methods: {
            onFilterTextBoxChanged() {
                let self = this;

                self.$nextTick(() => {
                    self.$refs.Grid.changeFilter(self.filterText)

                })
            },
            getFilteredData(value) {
                let self = this
                let title = "Confirm yes/no application to visible data?"
              
                self.$refs.YesNoModal.show(title, yesNoValue => {
                    if (yesNoValue) {
                        self.$refs.Spinner.show()
                        let tmp = []
                        tmp = self.$refs.Grid.getFilteredData()
                        let comp = tmp.last.columnController.allDisplayedColumns
                        let compareCriteria = comp[comp.length - 1].colId
                        let end = tmp.tmpArr
                        console.log(tmp);
                        end.forEach(item => {
                            item.active = value
                            item.basket_ID = self.selectedBasket.value;
                        })
                        Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                        Axios.post(process.env.VUE_APP_API + `Basket_Product_Link/SaveMany`, end)
                            .then(r => {
                                console.log(r);
                                tmp.tmpArrNode.forEach(item => {
                                    item.data.active = value
                                    item.setData(item.data)
                                    self.$refs.Spinner.hide()
                                })
                                delete Axios.defaults.headers.common["TenantID"];
                            })
                    }
                })
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
            getBasketReportData(datePicker) {
                let self = this;
                self.$refs.Spinner.show()
                self.basket_ID = self.selectedBasket.value
                Axios.get(process.env.VUE_APP_API + "BasketAnalysis?basketID=" + self.selectedBasket.value)
                    .then(r => {
                        console.log(r);

                        self.rowData = r.data.basket_LinkList;
                        self.$refs.Spinner.hide()

                    })
            },
            onBasketSelect() {
                let self = this;
                self.getBasketReportData();
            },
            runReport() {
                let self = this;
                self.$refs.StoreBasketReport.show(self.selectedBasket.text, self.selectedBasket.value);
            },

        }
    }

    function removeDuplicates(myArr, prop) {
        return myArr.filter((obj, pos, arr) => {
            return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
        });
    }
</script>