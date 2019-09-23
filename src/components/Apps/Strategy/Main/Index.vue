<template>
    <v-card tile>
        <v-toolbar flat dense dark color="grey darken-3">
            <v-toolbar-items>
                <v-menu dark offset-y style="margin-bottom: 10px;">
                    <v-btn slot="activator" flat>
                        File
                    </v-btn>
                    <v-list>
                        <v-list-tile @click="newFile">
                            <v-list-tile-title>New</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile @click="saveFile">
                            <v-list-tile-title>Save</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile @click="openFile">
                            <v-list-tile-title>Open</v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu>
                <v-menu dark offset-y style="margin-bottom: 10px;">
                    <v-btn slot="activator" flat>
                        Setup
                    </v-btn>
                    <v-list>
                        <v-list-tile @click="setup">
                            <v-list-tile-title>Store Cluster</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile @click="customSetup">
                            <v-list-tile-title>Custom Clusters</v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu>
                <v-btn slot="activator" flat @click="customQuery">
                    Custom
                </v-btn>
            </v-toolbar-items>
            <v-spacer></v-spacer>
            {{ currentToggle + ' - ' + title }}
            <v-spacer></v-spacer>
            <v-toolbar-title>
                <span>Main</span>
            </v-toolbar-title>
        </v-toolbar>
        <v-toolbar dark flat>
            <v-btn color="primary" @click="setSystemUserHeaders">
                {{ currentToggle }}
            </v-btn>
            <v-btn color="primary" @click="getHinterlandStores">Refresh</v-btn>
            <v-toolbar-items>
                <!-- <v-select @change="changeFile" style="margin-left: 10px; margin-top: 8px; width: 300px"
                    placeholder="Select File" dense :items="files" v-model="selectedFile" hide-details>
                </v-select> -->
            </v-toolbar-items>
            <!-- <v-toolbar-items v-if="selectedView == 1">
                <v-autocomplete style="margin-left: 10px; margin-top: 8px; width: 200px"
                    placeholder="Select cluster type" :items="clusters" v-model="selectedCluster"
                    @change="onClusterChange"> </v-autocomplete>
                <v-autocomplete style="margin-left: 10px; margin-top: 8px; width: 200px"
                    placeholder="Select cluster data" :items="dataFields" v-model="selectedDataField"> </v-autocomplete>
            </v-toolbar-items> -->
            <v-btn color="primary" @click="openMapSetup" v-if="selectedView == 1">Setup Map </v-btn>
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
        <Grid v-show="selectedView == 0" :rowData="rowData" :headers="headers" ref="Grid" />
        <Map v-if="selectedView == 1" :rowData="rowData" :setupData="setupMapData" ref="Map" />
        <ClusterModels :fileData="rowData" v-if="selectedView == 2" ref="ClusterModels" />
        <Setup ref="Setup" />
        <CustomSetup ref="CustomSetup" />
        <Spinner ref="Spinner" />
        <Prompt ref="Prompt" />
        <CustomSelector ref="CustomSelector" />
        <!-- <ColorPicker ref="ColorPicker" /> -->
        <FileSelector ref="FileSelector" />
    </v-card>
</template>

<script>
    import Axios from 'axios';
    import Grid from './Grid'
    import Setup from './Setup'
    import CustomSetup from './CustomSetup'
    import Spinner from '@/components/Common/Spinner';
    import Map from '../Map/Index'
    import ClusterModels from '../ClusterModels/Index'
    import Prompt from '@/components/Common/Prompt'
    import ColorPicker from '@/components/Common/ColorPicker'
    import CustomSelector from './CustomSelector'
    import FileSelector from './FileSelector';

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    })

    const clusterTypes = ["Store", "Custom"]

    export default {
        components: {
            Grid,
            Setup,
            CustomSetup,
            Spinner,
            Map,
            ClusterModels,
            Prompt,
            ColorPicker,
            CustomSelector,
            FileSelector
        },
        data() {
            return {
                title: '',
                currentToggle: 'User',
                clusters: [{
                    text: "store",
                    value: "store"
                }, {
                    text: "basket",
                    value: "basket"
                }, {
                    text: "listing",
                    value: "listing"
                }, {
                    text: "custom",
                    value: "custom"
                }, ],
                selectedCluster: [],
                dataFields: [],
                selectedDataField: null,
                headers: [],
                rowData: [],
                stores: [],
                unhandledReportData: null,
                selectedView: 0,
                mapData: null,
                fileData: null,
                fileName: null,
                selectedFile: null,
                files: null,
                firstLoad: true,
                setupMapData: [],
                selectedClusterType: 0,
                currentConfig: null,
                selectableFiles: []
            }
        },
        mounted() {
            let self = this;
            self.getHinterlandStores();
        },
        methods: {
            openMapSetup() {
                let self = this
                self.getMapSetupData()
                self.$refs.Map.openSetup()
            },
            customQuery() {
                let self = this;

                self.$refs.CustomSelector.show(data => {
                    Axios.get(process.env.VUE_APP_API +
                            `Cluster/Advanced?field=${data.field}`)
                        .then(r => {
                            let queryStores = r.data;
                            let output = [];
                            self.rowData.forEach(rd => {
                                queryStores.forEach(qs => {
                                    if (rd.storeName == qs.displayname) {
                                        output.push({
                                            storeName: rd.storeName,
                                            long: rd.long,
                                            lat: rd.lat,
                                            totalSales: qs.Sales_Retail
                                        })
                                    }
                                })
                            })
                            console.log(self.rowData);
                        })
                })
            },
            close() {
                let self = this
                self.selectedDataField = null
                self.selectedCluster = null
                self.rowData = []
            },
            onClusterChange() {
                let self = this
                let tmp = []
                self.$nextTick(() => {
                    self.dataFields = []
                    tmp.push(self.unhandledReportData[self.selectedCluster])
                    var names = Object.getOwnPropertyNames(tmp[0]);
                    let obj = tmp[0]

                    for (var item in obj) {
                        let count = 0

                        self.dataFields.push({
                            text: item
                        })
                        count++
                    }
                })
            },
            getMapSetupData() {
                let self = this
                let tmp = []
                self.setupMapData = []
                self.clusters.forEach((e, idx) => {

                    tmp.push(self.unhandledReportData[e.value])
                    var names = Object.getOwnPropertyNames(tmp[0]);


                    let obj = tmp[idx]
                    // console.log(obj);
                    for (var item in obj) {
                        let count = 0

                        self.setupMapData.push({
                            text: item,
                            cluster: e.value
                        })
                        count++
                    }
                })
            },
            getData(stores) {
                let self = this;

                self.$refs.Spinner.show();

                Axios.get(process.env.VUE_APP_API +
                        `SystemFile/JSON?db=CR-Devinspire&folder=CLUSTER REPORT&file=REPORT`)
                    .then(fd => {
                        Axios.get(process.env.VUE_APP_API + `SystemFile/JSON?db=CR-Devinspire&id=${fd.data.id}`)
                            .then(r => {
                                self.fileData = r.data;

                                // getFileNames

                                if (self.fileData.report != undefined && self.fileData.report.clusters !=
                                    undefined) {
                                    self.selectableFiles = [];

                                    for (var prop in self.fileData.report.clusters) {
                                        self.selectableFiles.push(prop);
                                    }
                                }

                                if (!self.firstLoad) {
                                    self.handleData(r.data, stores);
                                } else {
                                    self.prepareFiles(r.data)
                                    self.$refs.Spinner.hide();
                                }

                                self.firstLoad = false;
                                self.unhandledReportData = r.data
                                self.handleData(r.data, stores);

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

                console.log(data);

                let final = [];
                let headers = [];

                let stores = [];

                headers.push({
                    "headerName": "Store",
                    "field": "storeName",
                })

                if (data.store != undefined) {
                    for (var store in data.store) {

                        let options = self.fileData.store[store].config.turnoverGroups;

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
                            "headerName": "Turnover Group",
                            "field": self.currentToggle == "User" ? ("userDefinedClusterValue") : (
                                "levelValue"),
                            "valueFormatter": function (params) {
                                let text = params.data[self.currentToggle == "User" ? (
                                    "userDefinedCluster") : ("level")];
                                let value = params.data[self.currentToggle == "User" ? (
                                    "userDefinedClusterValue") : ("levelValue")];

                                let inOptions = isInOptions(options, text);

                                if (inOptions) {
                                    return options[value];
                                } else {
                                    return text;
                                }
                            },
                            cellStyle: function (params) {
                                let text = params.data[self.currentToggle == "User" ? "userDefinedCluster" :
                                    "level"];
                                let value = params.data[self.currentToggle == "User" ?
                                    "userDefinedClusterValue" : "levelValue"];

                                let inOptions = isInOptions(options, text);

                                if (inOptions) {
                                    if (value == 0) {
                                        return {
                                            backgroundColor: "#1976d2"
                                        };
                                    }

                                    if (value == 1) {
                                        return {
                                            backgroundColor: "#1976d2c2"
                                        };
                                    }

                                    if (value == 2) {
                                        return {
                                            backgroundColor: "#1976d294"
                                        };
                                    }
                                } else {
                                    return {
                                        backgroundColor: "#fff"
                                    };
                                }
                            }
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

                        let options = self.fileData.basket[basket].config.turnoverGroups;

                        console.log(options)

                        headers.push(self.addBasketHeader(basket, options));
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

                                    tmpBasket["totalSales"] = parseInt(el.totalSales.toFixed(0));
                                    tmpBasket["sales"] = formatter.format(el.totalSales).replace("$",
                                        "R");
                                    tmpBasket["cumulativePercent"] = el.cumulativePercent;
                                    tmpBasket["level"] = el.level;
                                    tmpBasket["levelValue"] = el.levelValue;
                                    tmpBasket["userDefinedCluster"] = el.userDefinedCluster;
                                    tmpBasket["userDefinedClusterValue"] = el.userDefinedClusterValue;
                                    tmpBasket["salesPercent"] = el.salesPercent
                                    tmpBasket["width"] = 20
                                    tmpBasket["height"] = 20
                                    tmpBasket["pieData"] = [{
                                            "category": "Category #1",
                                            "value": 1200
                                        },
                                        {
                                            "category": "Category #2",
                                            "value": 500
                                        },
                                        {
                                            "category": "Category #3",
                                            "value": 765
                                        },
                                        {
                                            "category": "Category #4",
                                            "value": 260
                                        }
                                    ]
                                }
                            })
                        }
                    }

                    if (data.basket != undefined) {
                        for (var basket in data.basket) {

                            data.basket[basket].data.forEach(el => {
                                if (el.displayname == element.PlaceGroup.toUpperCase()) {
                                    storeFound = true;
                                    tmpBasket["user_basket_" + basket] = el.level;
                                    tmpBasket["user_basket_value_" + basket] = el.levelValue;
                                    tmpBasket["system_basket_" + basket] = el.userDefinedCluster;
                                    tmpBasket["system_basket_value_" + basket] = el
                                        .userDefinedClusterValue;
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

                self.headers = [];
                self.rowData = final;

                setTimeout(() => {
                    self.headers = headers;
                    self.$refs.Spinner.hide();
                    self.$refs.Grid.setOrder();
                }, 60);
            },
            addBasketHeader(basket, options) {
                let self = this;

                return {
                    "headerName": basket,
                    "field": self.currentToggle == "User" ? ("user_basket_value_" + basket) : ("system_basket_value_" +
                        basket),
                    "valueFormatter": function (params) {
                        let text = params.data[self.currentToggle == "User" ? ("user_basket_" + basket) : (
                            "system_basket_" + basket)];
                        let value = params.data[self.currentToggle == "User" ? ("user_basket_value_" + basket) : (
                            "system_basket_value_" + basket)];

                        let inOptions = isInOptions(options, text);

                        if (inOptions) {
                            return options[value];
                        } else {
                            return text;
                        }
                    },
                    "cellStyle": function (params) {
                        let text = params.data[self.currentToggle == "User" ? ("user_basket_" + basket) : (
                            "system_basket_" + basket)];
                        let value = params.data[self.currentToggle == "User" ? ("user_basket_value_" + basket) : (
                            "system_basket_value_" + basket)];

                        let inOptions = isInOptions(options, text);

                        if (inOptions) {
                            if (value == 0) {
                                return {
                                    backgroundColor: "#9c9c9c"
                                };
                            }

                            if (value == 1) {
                                return {
                                    backgroundColor: "#b9b9b9"
                                };
                            }

                            if (value == 2) {
                                return {
                                    backgroundColor: "#e0e0e0"
                                };
                            }
                        } else {
                            return {
                                backgroundColor: "#fff"
                            };
                        }
                    }
                }
            },
            addListingHeader(listing) {},
            setup() {
                let self = this;

                self.$refs.Setup.show(self.headers, setup => {
                    self.currentConfig = setup;
                    self.selectedClusterType = 0;
                    self.handleSetup(setup);
                })
            },
            handleSetup(data) {
                let self = this;

                // Set title
                self.title = "Store Cluster";

                // handle headers
                let hide = [];
                let show = [];

                self.headers.forEach(h => {
                    let inSelected = false;

                    data.selectedItems.forEach(si => {
                        if (h.headerName == si) {
                            inSelected = true;
                        }
                    })

                    if (inSelected) {
                        show.push(h.field)
                    } else {
                        if (h.field != 'storeName' && h.field != undefined && h.field != 'totalSales' && h
                            .field != 'cumulativePercent') {
                            hide.push(h.field)
                        }
                    }
                })

                self.$refs.Grid.columnApi.setColumnsVisible(show, true);
                self.$refs.Grid.columnApi.setColumnsVisible(hide, false);

                // handle system/user : set these incorrectly so that i can call change method
                if (data.useSystemValues) {
                    self.currentToggle = 'User';
                } else {
                    self.currentToggle = 'System';
                }

                self.setSystemUserHeaders();
            },
            customSetup() {
                let self = this;

                self.$refs.CustomSetup.show(self.headers, setup => {
                    self.currentConfig = setup;
                    self.selectedClusterType = setup.clusterType;

                    if(self.selectedClusterType == 0) {
                        self.handleSetup(setup);
                    } else {
                        self.handleCustomSetup(setup);
                    }
                })
            },
            handleCustomSetup(data) {
                let self = this;

                // Set title
                self.title = data.selectedPlanogram.text + " - Custom Cluster";

                // handle headers
                let hide = [];
                let show = [];

                self.headers.forEach(h => {
                    let inSelected = false;

                    data.selectedItems.forEach(si => {
                        if (h.headerName == si) {
                            inSelected = true;
                        }
                    })

                    if (inSelected) {
                        show.push(h.field)
                    } else {
                        if (h.field != 'storeName' && h.field != undefined && h.field != 'totalSales' && h
                            .field != 'cumulativePercent') {
                            hide.push(h.field)
                        }
                    }
                })

                self.$refs.Grid.columnApi.setColumnsVisible(show, true);
                self.$refs.Grid.columnApi.setColumnsVisible(hide, false);

                // handle system/user : set these incorrectly so that i can call change method
                if (data.useSystemValues) {
                    self.currentToggle = 'User';
                } else {
                    self.currentToggle = 'System';
                }

                self.setSystemUserHeaders();
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
            newFile() {
                let self = this;

                self.customSetup();
            },
            openFile() {
                let self = this;

                self.$refs.FileSelector.show(self.selectableFiles, file => {
                    let config = self.fileData.report.clusters[file];
                    self.currentConfig = config;
                    self.selectedClusterType = file == 'Store Cluster' ? 0 : 1;
                    if (self.selectedClusterType == 0) {
                        self.handleSetup(config);
                    } else {
                        self.handleCustomSetup(config);
                    }
                })
            },
            saveFile() {
                let self = this;

                let columns = self.$refs.Grid.getState();
                let output = {};

                if (self.fileData.report == undefined || self.fileData.report == null) {
                    self.fileData.report = {
                        clusters: {}
                    };
                }

                if (self.fileData.report.clusters == undefined || self.fileData.report.clusters == null) {
                    self.fileData.report.clusters = {};
                }

                self.fileData.report.clusters[self.title] = self.currentConfig;
                self.selectableFiles.push(self.title);

                self.appendAndSaveFile(self.fileData);
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
                        self.fileData = fileData;
                        alert("Successfully saved");
                    })
                    .catch(e => {
                        alert("Failed to save");
                    })
            },
            changeFile() {
                let self = this;

                self.$nextTick(() => {
                    self.title = self.selectedFile;
                    self.handleData(self.fileData, self.stores);
                })
            },
            setSystemUserHeaders() {
                let self = this;

                if (self.currentToggle == 'User') {
                    self.currentToggle = 'System';
                } else {
                    self.currentToggle = 'User';
                }

                self.$refs.Grid.gridApi.redrawRows();
            }
        }
    }

    function isInOptions(optionsArr, text) {
        let retval = false;

        optionsArr.forEach(el => {
            if (el == text)
                retval = true;
        })

        return retval;
    }

    function removeDuplicates(myArr, prop) {
        return myArr.filter((obj, pos, arr) => {
            return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
        });
    }
</script>