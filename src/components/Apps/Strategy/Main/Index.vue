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
            <v-toolbar-items>
            </v-toolbar-items>
        </v-toolbar>
        <Grid :rowData="rowData" :headers="headers" ref="Grid" />
        <Setup ref="Setup" />
    </v-card>
</template>

<script>
    import Axios from 'axios';
    import Grid from './Grid'
    import Setup from './Setup'

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    })

    export default {
        components: {
            Grid,
            Setup
        },
        data() {
            return {
                headers: [],
                rowData: [],
                stores: []
            }
        },
        created() {
            let self = this;
            self.getStores();
        },
        methods: {
            getData(stores) {
                let self = this;

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
            handleData(data) {
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
                        data.store[store].data.forEach(el => {
                            stores.push(el.displayname);
                        })

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

                stores.forEach(element => {

                    let tmpBasket = {
                        storeName: element
                    };

                    if (data.store != undefined) {
                        for (var store in data.store) {

                            data.store[store].data.forEach(el => {
                                if (el.displayname == element) {
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
                                if (el.displayname == element) {
                                    tmpBasket["basket_" + basket] = el.level
                                }
                            })
                        }
                    }

                    if (data.listing != undefined) {
                        for (var listing in data.listing) {

                            data.listing[listing].forEach(el => {
                                if (el.storeName == element) {
                                    tmpBasket["listing_" + listing] = el.cluster
                                }
                            })
                        }
                    }

                    final.push(tmpBasket);
                })

                self.headers = headers;
                self.rowData = final;
            },
            setup() {
                let self = this;
                self.$refs.Setup.show(() => {

                })
            }
        }
    }
</script>