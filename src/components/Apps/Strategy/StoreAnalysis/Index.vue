<template>
    <v-card tile>
        <v-toolbar flat dense dark color="grey darken-3">
            <v-toolbar-items>
                <!-- <v-menu dark offset-y style="margin-bottom: 10px;">
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
                            <v-list-tile-title>Basket Levels</v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu> -->
            </v-toolbar-items>
            <v-spacer></v-spacer>
            <v-toolbar-title>
                <span>Store Analysis</span>
            </v-toolbar-title>
            <!-- <v-btn small fab color="primary" @click="openBasketMaint">
                <v-icon>edit</v-icon>
            </v-btn> -->

        </v-toolbar>
        <v-toolbar dark flat>

            <!-- <v-toolbar-items>
                <v-select @change="onBasketSelect" :items="baskets" v-model="selectedBasket" return-object dark
                    style="margin-left: 10px; margin-top: 4px; width: 250px" placeholder="Select a basket" dense
                    hide-details>
                </v-select>
            </v-toolbar-items>

            <v-btn @click="getFilteredData" color="primary" v-if="rowData.length>0">Set Visible to yes</v-btn>
            <v-spacer></v-spacer>
            <v-text-field append-icon="search" type="text" id="filter-text-box" placeholder="Filter..."
                @input="onFilterTextBoxChanged" v-model="filterText">
            </v-text-field>
            <v-spacer></v-spacer>
            <v-btn @click="runReport" v-if="rowData.length > 0" color="primary">Run Report</v-btn> -->
        </v-toolbar>
        <Grid :rowData="rowData" ref="Grid" />

        <!-- <basketMaint :getBaskets="getbaskets" ref="basketMaint" />
        <ClusterMaint :basket_ID="basket_ID" ref="ClusterMaint" />
        <StoreBasketReport ref="StoreBasketReport" />
        <Spinner ref="Spinner" /> -->
    </v-card>
</template>

<script>
    import Axios from 'axios';

    import Grid from './Grid'
    // import BasketConfig from './Basket_Config'
    // import PremiumNature from './PremiumNature/PremiumNature.vue'
    // import basketMaint from './BasketMaint/BasketMaintenanceModal.vue'
    // import ClusterMaint from './ClusterMaint/ClusterMaintModal.vue'
    // import StoreBasketReport from './StoreBasketReport/StoreBasketReport.vue'

    // import Spinner from "@/components/Common/Spinner";

    export default {
        components: {
            // basketMaint,
            Grid,
            // BasketConfig,
            // PremiumNature,
            // ClusterMaint,
            // StoreBasketReport,
            // Spinner
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
            self.getData();
        },
        methods: {
            getData() {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + `StoreAnalysis`)
                    .then(r => {
                        self.prepareTurnoverGroups(r.data)
                        delete Axios.defaults.headers.common["TenantID"];
                    })
            },
            prepareTurnoverGroups(data) {
                let self = this;
                let levels = ["HIGH", "MEDIUM", "LOW"]

                let totalStoreSales = data.reduce((a, b) => {
                    return {
                        totalSales: a.totalSales + b.totalSales
                    }
                }).totalSales

                let currentPercent = 0;

                data.forEach(el => {
                    let storePercent = currentPercent + ((el.totalSales / totalStoreSales) * 100);
                    el["cumulativePercent"] = storePercent;
                    currentPercent = storePercent;
                })

                let mcg = self.getMostCommonGroups(data, 3);
                let highestVal = data[0].totalSales;
                let lowestVal = data[data.length - 1].totalSales;
                let average = highestVal / 3;

                data.forEach(el => {
                    let currentHigh = average * 3;
                    let currentLow = (average * 3) - average;

                    console.log(el.displayname);

                    for (var i = 0; i < 3; i++) {
                        console.log(el.totalSales, currentLow, currentHigh)

                        if (el.totalSales >= currentLow && el.totalSales <= currentHigh) {
                            el["level"] = levels[i];
                        }

                        currentHigh = currentLow;
                        currentLow = currentLow - average;
                    }

                    console.log("**************************************");
                })

                console.log(data)
                self.rowData = data;
            },
            nearestTenth(number) {
                return Math.ceil(number / 10) * 10;
            },
            getAverage(levels, highest, lowest) {
                let self = this;

                return (highest - lowest) / levels;
            },
            getMostCommonGroups(data, levels) {
                let self = this;
                let tmp = JSON.parse(JSON.stringify(data))
                let currentCount = 0;
                let retval = [];

                for (var i = 0; i < levels; i++) {
                    let currentHighest = 0;
                    let currentHighestString = "";

                    tmp.forEach(el => {
                        console.log(self.nearestTenth(el.cumulativePercent))

                        let count = tmp.filter(fel => {
                            return self.nearestTenth(fel.cumulativePercent) == self.nearestTenth(el
                                .cumulativePercent);
                        }).length;

                        if (count > currentHighest) {
                            currentHighest = count;
                            currentHighestString = self.nearestTenth(el.cumulativePercent);
                        }
                    })

                    tmp = tmp.filter(fel => {
                        return self.nearestTenth(fel.cumulativePercent) != currentHighestString;
                    });

                    if (currentHighest > 1) {
                        retval.push(currentHighestString);
                    }
                }

                return retval.sort((a, b) => {
                    if (a > b) {
                        return -1;
                    }
                    if (a < b) {
                        return 1;
                    }
                    return 0;
                });
            },
            onFilterTextBoxChanged() {
                let self = this;

                self.$nextTick(() => {
                    self.$refs.Grid.changeFilter(self.filterText)

                })
            },
            getFilteredData() {
                let self = this
                self.$refs.Spinner.show()
                let tmp = []
                tmp = self.$refs.Grid.getFilteredData()
                let comp = tmp.last.columnController.allDisplayedColumns
                let compareCriteria = comp[comp.length - 1].colId
                let end = tmp.tmpArr
                console.log(tmp);

                end.forEach(item => {
                    item.active = true
                    item.basket_ID = self.selectedBasket.value;
                })

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.post(process.env.VUE_APP_API + `Basket_Product_Link/SaveMany`, end)
                    .then(r => {
                        console.log(r);

                        tmp.tmpArrNode.forEach(item => {
                            item.data.active = true

                            item.setData(item.data)
                            self.$refs.Spinner.hide()
                        })
                        delete Axios.defaults.headers.common["TenantID"];
                    })


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