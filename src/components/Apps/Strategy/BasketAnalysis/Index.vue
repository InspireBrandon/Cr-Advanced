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
            <v-spacer></v-spacer>
            <v-btn @click="runReport" v-if="rowData.length > 0" color="primary">Run Report</v-btn>
        </v-toolbar>
        <v-tabs class="elevation-4" centered dark fixed-tabs justify-content: center>
            <v-tabs-slider color="white"></v-tabs-slider>

            <v-tab justify-content: center fixed-tabs>
                Filter
            </v-tab>
            <v-tab-item>
                <v-card>
                    <v-container grid-list-md>

                        <v-layout row wrap>
                            <v-flex md6>
                                <v-select v-for="(item, idx) in criteriaItems" :key="idx" :placeholder="item.field"
                                    :items="item.values" @change="pushNewCriteria(idx)" v-model="item.selectedValue">
                                </v-select>
                            </v-flex>
                            <v-flex md6>
                                <v-select v-for="(item, idx) in items" :key="idx" :placeholder="item.field"
                                    :items="item.values" @change="pushNewcriteriaOption(idx)"
                                    v-model="item.selectedValue">
                                </v-select>
                            </v-flex>
                        </v-layout>
                    </v-container>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn @click="getData" color="primary">
                            Apply
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-tab-item>
            <v-tab justify-content: center fixed-tabs>
                output
            </v-tab>
            <v-tab-item>
                <Grid :rowData="rowData" :basket="selectedBasket" v-if="selectedBasket != null" ref="Grid" />
            </v-tab-item>
        </v-tabs>
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

    function Item(values, field, selectedValue) {
        let self = this;
        self.values = values;
        self.field = field;
        self.selectedValue = selectedValue
    }
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
                criteriaObject: [{
                    "text": "Project Group",
                    "value": 0
                }, {
                    "text": "Planogram",
                    "value": 1
                }, {
                    "text": "Department",
                    "value": 2,
                }, {
                    "text": "Subdepartment",
                    "value": 3
                }, {
                    "text": "Category",
                    "value": 4
                }, {
                    "text": "Subcategory",
                    "value": 5
                }, {
                    "text": "Segment",
                    "value": 6
                }, {
                    "text": "Manufacturer",
                    "value": 7
                }, {
                    "text": "Brand",
                    "value": 8
                }, {
                    "text": "Size Description",
                    "value": 9
                }],
                criteriaItems: [new Item([{
                    "text": "Project Group",
                    "value": 0
                }, {
                    "text": "Planogram",
                    "value": 1
                }, {
                    "text": "Department",
                    "value": 2,
                }, {
                    "text": "Subdepartment",
                    "value": 3
                }, {
                    "text": "Category",
                    "value": 4
                }, {
                    "text": "Subcategory",
                    "value": 5
                }, {
                    "text": "Segment",
                    "value": 6
                }, {
                    "text": "Manufacturer",
                    "value": 7
                }, {
                    "text": "Brand",
                    "value": 8
                }, {
                    "text": "Size Description",
                    "value": 9
                }], "Search Criteria", null)],
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
            pushNewCriteria(idx) {
                let self = this
                // todo Getdata
                self.removeCriteriaOption(idx)

                this.items.push(new Item([1, 2, 3], "Field 2", null));

            },
            pushNewcriteriaOption() {
                let self = this

                self.$nextTick(() => {
                   console.log(this.criteriaItems[this.criteriaItems.length - 1].selectedValue);
                    
                    //todo get new criteria opject
                    let arr = self.criteriaObject.splice(this.items[this.items.length - 1].selectedValue, this
                        .items.length)
                    console.log(arr);

                    this.criteriaItems.push(new Item([1, 2, 3], "search Criteria", null));
                })
            },
            removeCriteria(idx) {
                let self = this
                self.criteriaItems.splice(idx)
            },
            removeCriteriaOption(idx) {
                let self = this
                self.items.splice(idx)
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
            addItem: function () {
                this.items.push(new Item([1, 2, 3], "Field 1", null));
            }
        }
    }
</script>