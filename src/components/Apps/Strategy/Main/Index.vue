<template>
    <v-card tile>
        <v-toolbar flat dense dark color="grey darken-3">
            <v-toolbar-items>
                <v-menu dark offset-y style="margin-bottom: 10px;">
                    <v-btn slot="activator" flat>
                        File
                    </v-btn>
                    <v-list>
                        <v-list-tile @click="openFile">
                            <v-list-tile-title>Open</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile @click="saveFile">
                            <v-list-tile-title>Save</v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu>
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
            <v-btn color="primary" @click="getHinterlandStores">Refresh</v-btn>
            <v-toolbar-items>
                <v-select @change="changeFile" style="margin-left: 10px; margin-top: 8px; width: 300px"
                    placeholder="Select File" dense :items="files" v-model="selectedFile" hide-details>
                </v-select>
            </v-toolbar-items>
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
        <Prompt ref="Prompt" />
    </v-card>
</template>

<script>
    import Axios from 'axios';
    import Grid from './Grid'
    import Setup from './Setup'
    import Spinner from '@/components/Common/Spinner';
    import Map from '../Map/Index'
    import ClusterModels from '../ClusterModels/Index'
    import Prompt from '@/components/Common/Prompt'

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
            ClusterModels,
            Prompt
        },
        data() {
            return {
                headers: [],
                rowData: [],
                stores: [],
                selectedView: 0,
                mapData: null,
                fileData: null,
                fileName: null,
                selectedFile: null,
                files: null,
                firstLoad: true
            }
        },
        mounted() {
            let self = this;
            self.getHinterlandStores();
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
                                self.fileData = r.data;

                                if (!self.firstLoad) {
                                    self.handleData(r.data, stores);
                                } else {
                                    self.prepareFiles(r.data)
                                    self.$refs.Spinner.hide();
                                }

                                self.firstLoad = false;
                            })
                    })
            },
            prepareFiles(data) {
                let self = this;

                self.files = [];

                if (data.report != undefined && data.report != null) {
                    for (var report in data.report) {
                        self.files.push(report);
                    }
                }

                if (self.files.length == 0) {
                    self.handleData(self.fileData, self.stores);
                }
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
                            "field": "level",
                            "hide": true
                        }, {
                            "headerName": "User Turnover Group",
                            "field": "userDefinedCluster"
                        })
                    }
                }

                if (data.basket != undefined) {
                    for (var basket in data.basket) {

                        let hide = false;

                        if (self.fileData.report != undefined || self.fileData.report != null) {
                            if (self.selectedFile != undefined && self.selectedFile != null) {
                                hide = self.fileData.report[self.selectedFile]["basket_" + basket];
                            }
                        }

                        headers.push({
                            "headerName": basket,
                            "field": "basket_" + basket,
                            "hide": hide
                        })
                    }
                }

                if (data.listing != undefined) {
                    for (var listing in data.listing) {
                        let hide = false;

                        if (self.fileData.report != undefined || self.fileData.report != null) {
                            if (self.selectedFile != undefined && self.selectedFile != null) {
                                hide = self.fileData.report[self.selectedFile]["listing_" + listing];
                            }
                        }

                        headers.push({
                            "headerName": listing + " Listing",
                            "field": "listing_" + listing,
                            "hide": hide
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

                                    tmpBasket["totalSales"] = el.totalSales.toFixed(0);
                                    tmpBasket["sales"] = formatter.format(el.totalSales).replace("$",
                                        "R");
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
                    let long = parseFloat(longLat[1]);
                    let lat = parseFloat(longLat[0]);

                    tmpBasket["long"] = long;
                    tmpBasket["lat"] = lat;

                    if (storeFound)
                        final.push(tmpBasket);
                })

                final = removeDuplicates(final, 'storeName')

                self.headers = headers;
                self.rowData = final;
                self.$refs.Spinner.hide();

                setTimeout(() => {
                    self.$refs.Grid.setOrder();
                }, 60);
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
                self.getData(stores);
            },
            openFile() {
                let self = this;
            },
            saveFile() {
                let self = this;

                self.$refs.Prompt.show("", "File Name", "", text => {
                    let columns = self.$refs.Grid.getState();
                    let output = {};

                    columns.forEach(el => {
                        output[el.colId] = el.hide;
                    })

                    if (self.fileData.report == undefined || self.fileData.report == null) {
                        self.fileData.report = {};
                    }

                    self.fileData.report[text] = output;

                    self.files.push(text);
                    self.selectedFile = text;

                    self.appendAndSaveFile(self.fileData);
                })
            },
            appendAndSaveFile(fileData) {
                Axios.post(process.env.VUE_APP_API + "SystemFile/JSON?db=CR-Devinspire", {
                        SystemFile: {
                            SystemUser_ID: -1,
                            Folder: "CLUSTER REPORT",
                            Name: "REPORT",
                            Extension: '.json'
                        },
                        Data: fileData
                    })
                    .then(r => {
                        alert("Successfully saved");
                    })
                    .catch(e => {
                        alert("Failed to save");
                    })
            },
            changeFile() {
                let self = this;

                self.$nextTick(() => {
                    self.handleData(self.fileData, self.stores);
                })
            }
        }
    }

    function removeDuplicates(myArr, prop) {
        return myArr.filter((obj, pos, arr) => {
            return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
        });
    }
</script>