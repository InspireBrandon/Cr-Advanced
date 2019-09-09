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
            handleData(data, stores) {
                let self = this;

                let final = [];
                let headers = [];

                headers.push({
                    "headerName": "Store",
                    "field": "storeName",
                })

                if (data.basket != undefined) {
                    for (var basket in data.basket) {
                        headers.push({
                            "headerName": basket + " Basket",
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

                if (data.store != undefined) {
                    headers.push({
                        "headerName": "Store",
                        "field": "store",
                    })
                }

                stores.forEach(element => {

                    let tmpBasket = {
                        storeName: element.storeName
                    };

                    if (data.basket != undefined) {
                        for (var basket in data.basket) {

                            data.basket[basket].forEach(el => {
                                if (el.displayname == element.storeName) {
                                    tmpBasket["basket_" + basket] = el.cluster
                                }
                            })
                        }
                    }

                    if (data.listing != undefined) {
                        for (var listing in data.listing) {

                            data.listing[listing].forEach(el => {
                                if (el.storeName == element.storeName) {
                                    tmpBasket["listing_" + listing] = el.cluster
                                }
                            })
                        }
                    }

                    if (data.store != undefined) {
                        data.store.forEach(el => {
                            if (el.displayname == element.storeName) {
                                tmpBasket["store"] = el.level
                            }
                        })
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