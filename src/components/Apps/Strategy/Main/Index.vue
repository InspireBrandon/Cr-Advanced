<template>
    <v-card tile>
        <v-toolbar flat dense dark color="grey darken-3">
            <v-toolbar-items>
                <v-btn slot="activator" flat @click="setup">
                    Setup
                </v-btn>
            </v-toolbar-items>
            <v-spacer></v-spacer>
            <v-toolbar-title>
                <span>Main</span>
            </v-toolbar-title>
        </v-toolbar>
        <v-toolbar dark flat>
            <v-btn color="primary" @click="getData">Refresh</v-btn>
            <v-spacer></v-spacer>
            <v-btn-toggle v-model="selectedView" round class="transparent" mandatory>
                <v-btn class="elevation-0" style="width: 100px" round color="primary">
                    Output
                </v-btn>
                <v-btn class="elevation-0" style="width: 100px" round color="primary">
                    Map
                </v-btn>
                <v-btn class="elevation-0" style="width: 100px" round color="primary">
                    Model
                </v-btn>
            </v-btn-toggle>
        </v-toolbar>
        <Grid v-if="selectedView == 0" :rowData="rowData" :headers="headers" ref="Grid" />
        <Map v-if="selectedView == 1" :rowData="rowData" ref="Map" />
        <ClusterModels :fileData="rowData" v-if="selectedView == 2" ref="ClusterModels" />
        <Setup ref="Setup" />
        <Spinner ref="Spinner" />
    </v-card>
</template>

<script>
    import Axios from 'axios';
    import Grid from './Grid'
    import Setup from './Setup'
    import Spinner from '@/components/Common/Spinner';
    import Map from '../Map/Index'
    import ClusterModels from '../ClusterModels/Index'

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    })

    export default {
        components: {
            Grid,
            Setup,
            Spinner,
            Map,
            ClusterModels
        },
        data() {
            return {
                headers: [],
                rowData: [],
                stores: [],
                selectedView: 0,
                mapData: null
            }
        },
        mounted() {
            let self = this;
            self.$refs.Spinner.show();
            self.getHinterlandStores();
            // self.getStores();
        },
        methods: {
            getData(stores) {
                let self = this;

                self.$refs.Spinner.show();

                Axios.get(process.env.VUE_APP_API +
                        `SystemFile/JSON?db=CR-Devinspire&folder=CLUSTER REPORT&file=REPORT`)
                    .then(fd => {
                        Axios.get(process.env.VUE_APP_API + `SystemFile/JSON?db=CR-Devinspire&id=${fd.data.id}`)
                            .then(r => {
                                self.handleData(r.data, stores);
                            })
                    })
            },
            getStores(cb) {
                let self = this;

                Axios.get(process.env.VUE_APP_API + `Store?db=CR-HINTERLAND-LIVE`)
                    .then(r => {
                        self.stores = r.data;
                        self.getData(r.data)
                    })
            },
            handleData(data, storeData) {
                let self = this;

                let final = [];
                let headers = [];

                let stores = [];

                headers.push({
                    "headerName": "Store",
                    "field": "storeName",
                })

                if (data.store != undefined) {
                    for (var store in data.store) {

                        headers.push({
                            headerName: 'Sales %',
                            cellRendererFramework: "ProgressRenderer",
                            width: 500
                        }, {
                            "headerName": "Sales",
                            "field": "totalSales",
                            valueFormatter: function (params) {
                                return formatter.format(params.value).replace("$", "R");
                            }
                        }, {
                            "headerName": "Cumulative Sales %",
                            "field": "cumulativePercent",
                            valueFormatter: function (params) {
                                return params.value.toFixed(1) + "%";
                            }
                        }, {
                            "headerName": "System Turnover Group",
                            "field": "level"
                        }, {
                            "headerName": "User Turnover Group",
                            "field": "userDefinedCluster"
                        })
                    }
                }

                if (data.basket != undefined) {
                    for (var basket in data.basket) {
                        headers.push({
                            "headerName": basket,
                            "field": "basket_" + basket,
                        })
                    }
                }

                if (data.listing != undefined) {
                    for (var listing in data.listing) {
                        headers.push({
                            "headerName": listing + " Listing",
                            "field": "listing_" + listing,
                        })
                    }
                }

                storeData.forEach(element => {
                    let storeFound = false;

                    let tmpBasket = {
                        storeName: element.PlaceGroup.toUpperCase()
                    };

                    if (data.store != undefined) {
                        for (var store in data.store) {

                            data.store[store].data.forEach(el => {
                                if (el.displayname == element.PlaceGroup.toUpperCase()) {
                                    storeFound = true;

                                    tmpBasket["totalSales"] = el.totalSales;
                                    tmpBasket["cumulativePercent"] = el.cumulativePercent;
                                    tmpBasket["level"] = el.level;
                                    tmpBasket["userDefinedCluster"] = el.userDefinedCluster;
                                    tmpBasket["salesPercent"] = el.salesPercent
                                }
                            })
                        }
                    }

                    if (data.basket != undefined) {
                        for (var basket in data.basket) {

                            data.basket[basket].data.forEach(el => {
                                if (el.displayname == element.PlaceGroup.toUpperCase()) {
                                    storeFound = true;
                                    tmpBasket["basket_" + basket] = el.level
                                }
                            })
                        }
                    }

                    if (data.listing != undefined) {
                        for (var listing in data.listing) {

                            data.listing[listing].forEach(el => {
                                if (el.storeName == element.PlaceGroup.toUpperCase()) {
                                    storeFound = true;
                                    tmpBasket["listing_" + listing] = el.cluster
                                }
                            })
                        }
                    }

                    let longLat = element.OfficeGPS.split(",");
                    let long = longLat[0];
                    let lat = longLat[1];

                    tmpBasket["long"] = long;
                    tmpBasket["lat"] = lat;

                    if(storeFound)
                        final.push(tmpBasket);
                })

                console.log(final)

                self.headers = headers;
                self.rowData = final;
                self.$refs.Spinner.hide();
            },
            setup() {
                let self = this;
                self.$refs.Setup.show(() => {

                })
            },
            getHinterlandStores() {
                let self = this;

                let stores = require('@/assets/storeData/Hinterland.json');
                self.prepareStoreResults(stores.Response);
            },
            prepareStoreResults(storeData) {
                let self = this;

                let stores = storeData.filter(e => {
                    return e.siteType == "SHOP";
                })

                self.stores = stores;
                self.getData(stores)
            }
        }
    }
</script>