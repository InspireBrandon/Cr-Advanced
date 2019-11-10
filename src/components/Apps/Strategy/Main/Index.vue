<template>
    <v-card tile>
        <v-toolbar flat dense dark color="grey darken-3">
            <v-btn-toggle round v-model="selectedView" class="transparent" mandatory>
                <v-btn class="elevation-0" style="width: 100px" round @click="changeView(0)" color="primary">
                    Store
                </v-btn>
                <v-btn class="elevation-0" style="width: 100px" round @click="changeView(1)" color="primary">
                    Custom
                </v-btn>
            </v-btn-toggle>
            <v-toolbar-items>

            </v-toolbar-items>
            <v-spacer></v-spacer>
            <div v-if="title != ''">
                {{ currentToggle + ' - ' + title }}
            </div>
            <v-spacer></v-spacer>
            <v-toolbar-title>
                <span>Main</span>
            </v-toolbar-title>
        </v-toolbar>
        <v-toolbar dark flat>
            <v-toolbar-items>
                <v-menu dark offset-y style="margin-bottom: 10px;">
                    <v-btn slot="activator" flat>
                        File
                    </v-btn>
                    <v-list>
                        <v-list-tile :disabled="!showGrid" @click="saveFile">
                            <v-list-tile-title>Save</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile @click="openFile">
                            <v-list-tile-title>Open</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile @click="getHinterlandStores">
                            <v-list-tile-title>Refresh</v-list-tile-title>
                        </v-list-tile>
                        <!-- <v-list-tile @click="openRetailerModal">
                            <v-list-tile-title>openRetailerModal</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile @click="LinkRetailerStore">
                            <v-list-tile-title>LinkRetailerStore</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile @click="LinkRetailerStore">
                            <v-list-tile-title>LinkRetailerStore</v-list-tile-title>
                        </v-list-tile> -->
                    </v-list>
                </v-menu>
                <v-menu dark offset-y style="margin-bottom: 10px;">
                    <v-btn slot="activator" flat>
                        Setup
                    </v-btn>
                    <v-list>
                        <v-list-tile @click="customSetup">
                            <v-list-tile-title>Cluster</v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu>
                <v-autocomplete class="pt-0" return-object :items="planograms" v-if="selectedView==1"
                    v-model="selectedPlanogram" style="width: 300px; margin-top: 15px;" placeholder="Select a planogram"
                    dense hide-details>
                </v-autocomplete>
            </v-toolbar-items>
            <v-spacer></v-spacer>
        </v-toolbar>
        <Grid :showGrid="showGrid" :selectFile='openFile' :createFile="customSetup" :rowData="rowData"
            :headers="headers" ref="Grid" />
        <Setup ref="Setup" />
        <CustomSetup ref="CustomSetup" />
        <Spinner ref="Spinner" />
        <Prompt ref="Prompt" />
        <CustomSelector ref="CustomSelector" />
        <MapImageSelector ref="MapImageSelector" />
        <FileSelector ref="FileSelector" />
        <MapImageModal ref="MapImageModal" />
        <ImportCities ref="ImportCities" />
        <RetailerImportModal ref="RetailerImportModal" />
        <LinkRetailerStore ref="LinkRetailerStore" />
    </v-card>
</template>

<script>
    import Axios from 'axios';
    import Grid from './Grid'
    import MapImageModal from './MapImageModal'
    import RetailerImportModal from './RetailerImportModal'
    import Setup from './Setup'
    import CustomSetup from './CustomSetup'
    import Spinner from '@/components/Common/Spinner';
    import Map from '../Map/Index'
    import ClusterModels from '../ClusterModels/Index'
    import Prompt from '@/components/Common/Prompt'
    import MapImageSelector from "@/components/Apps/Strategy/Map/MapImageSelector"
    import ImportCities from "./ImportCities"
    import Geogrid from './Geogrid'
    import LinkRetailerStore from './LinkRetailerStores/Index'

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
            RetailerImportModal,
            MapImageModal,
            Setup,
            CustomSetup,
            Spinner,
            Map,
            ClusterModels,
            Prompt,
            ColorPicker,
            CustomSelector,
            FileSelector,
            MapImageSelector,
            ImportCities,
            Geogrid,
            LinkRetailerStore
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
                clusterStores: [],
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
                selectableFiles: [],
                showGrid: true,
                geoGridData: {},
                planograms: [],
                selectedPlanogram: null,
                categoryClusters: []
            }
        },
        mounted() {
            let self = this;
            self.getHinterlandStores();
            self.getPlanograms();
        },
        methods: {
            changeView(value) {
                let self = this
                self.selectedView = value
                // if (value == 1) {
                //     self.handleCustomSetup(self.currentConfig);
                // }
                // customCluster: element.customCluster,
                //                         customCluster_ID: element.customCluster_ID,
                //                         storeCluster: element.storeCluster,
                //                         storeCluster_ID: element.storeCluster_ID,
                if (self.selectedView == 0) {
                    self.headers[4] = {
                        headerName: 'Store System Clusters',
                        editable: true,
                        field: "storeCluster",

                    }
                    // self.headers[5] = {
                    //     headerName: 'Store User Clusters',
                    // }
                } else {
                    self.headers[4] = {
                        headerName: 'Custom System Clusters',
                        editable: true,
                        field: "customCluster",

                    }
                    // self.headers[5] = {
                    //     headerName: 'Custom User Clusters',
                    // }
                }
                let tmp = self.headers
                self.headers = []
                self.headers = tmp
                console.log(self.headers);

                self.$refs.Grid.gridApi.setColumnDefs(self.headers);
                self.$refs.Grid.gridApi.redrawRows();
            },
            LinkRetailerStore() {
                let self = this;

                self.$refs.LinkRetailerStore.show(() => {

                })
            },
            openRetailerModal() {
                let self = this
                self.$refs.RetailerImportModal.open(callback => {

                })

            },
            onSetGeogridData(data) {
                let self = this;
                self.geoGridData = data;
            },
            maintainCities() {
                let self = this;

                self.$refs.ImportCities.show(data => {
                    console.log(data);
                })
            },
            showSelector() {
                let self = this;
                self.$refs.MapImageSelector.show(callback => {
                    console.log(callback);

                    self.openMapImageModal(false, callback)
                    // self.selectedmap=callback.id
                    // self.onMapChange()
                })
            },
            openMapImageModal(type, item) {
                let self = this
                self.$refs.MapImageModal.open(type, item, callback => {

                })
            },
            openMapSetup() {
                let self = this
                // self.getMapSetupData()
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

                let final = [];
                let headers = [];

                let stores = [];

                headers.push({
                    "headerName": "Store Name",
                    "field": "storeName",
                })

                if (data.store != undefined) {
                    for (var store in data.store) {

                        let options = self.fileData.store[store].config.turnoverGroups;
                        console.log("options", options);

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
                        }, )
                    }
                }
                if (self.selectedView == 0) {
                    headers.push({
                            headerName: 'Store System Clusters',
                            editable: true,
                            field: "storeCluster",

                        },
                        // {
                        //     headerName: 'Store User Clusters',

                        // }
                    )
                } else {
                    headers.push({
                            headerName: 'Custom System Clusters',
                            editable: true,
                            field: "customCluster",

                        },
                        // {
                        //     headerName: 'custom User Clusters',

                        // }
                    )
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
                storeData.forEach(HintStore => {
                    self.clusterStores.forEach(DBStore => {
                        // console.log(HintStore.PlaceGroup.toUpperCase() == DBStore.store.toUpperCase());

                        if (HintStore.PlaceGroup.toUpperCase() == DBStore.store.toUpperCase()) {
                            HintStore.customCluster = DBStore.customCluster
                            HintStore.customCluster_ID = DBStore.customCluster_ID
                            HintStore.storeCluster = DBStore.storeCluster
                            HintStore.storeCluster_ID = DBStore.storeCluster_ID
                            HintStore.store_ID = DBStore.store_ID
                        }
                    })
                });
                console.log("storeData", storeData);

                storeData.forEach(element => {
                    let storeFound = false;
                    let tmpBasket = {
                        storeName: element.PlaceGroup.toUpperCase(),
                        customCluster: element.customCluster,
                        customCluster_ID: element.customCluster_ID,
                        storeCluster: element.storeCluster,
                        store_ID: element.store_ID,
                        storeCluster_ID: element.storeCluster_ID,
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
                final.sort((a, b) => {
                    if (a.totalSales > b.totalSales) {
                        return -1;
                    }
                    if (a.totalSales < b.totalSales) {
                        return 1;
                    }
                    return 0;
                });
                self.rowData = final;
                console.log("self.rowData", self.rowData);


                setTimeout(() => {
                    self.headers = headers;
                    // self.getMapSetupData()
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

                let columnDefs = self.headers;
                let containsCluster = false;

                columnDefs.forEach(el => {
                    if (el.headerName == "Cluster") {
                        containsCluster = true;
                    }
                })

                if (containsCluster) {
                    self.headers.splice(self.headers.length - 1, 1);
                }

                let fields = self.getFieldsFromHeaders();

                columnDefs.push({
                    "headerName": "Cluster",
                    valueFormatter: function (params) {
                        let final = "";

                        fields.forEach(el => {
                            if (el == "userDefinedClusterValue") {
                                final += self.useSystemValues ? params.data.level :
                                    params.data.userDefinedCluster;
                            } else {
                                let userValue = params.data[el.replace("_value",
                                    "")];
                                let systemValue = params.data[el.replace("_value",
                                    "").replace("user_", "system_")];
                                final += self.useSystemValues ? systemValue :
                                    userValue;
                            }
                        })

                        return final;
                    }
                })

                self.$refs.Grid.gridApi.setColumnDefs(columnDefs);
                self.$refs.Grid.gridApi.redrawRows();

                // Set title
                self.title = "Store Cluster";

                // handle headers
                let hide = [];
                let show = [];

                self.headers.forEach(h => {
                    let inSelected = false;

                    // data.selectedItems.forEach(si => {
                    //     if (h.headerName == si) {
                    //         inSelected = true;
                    //     }
                    // })

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

                self.$refs.CustomSetup.show(self.headers, self.currentConfig, setup => {
                    self.currentConfig = setup;
                    self.selectedClusterType = setup.clusterType;
                    self.showGrid = true;
                    console.log("setup", setup);

                    if (self.selectedClusterType == 0) {
                        self.handleSetup(setup);
                    } else {
                        self.getCatgeoryReport(category => {
                            self.handleCustomSetup(setup, category);
                        })
                    }
                })
            },
            getCatgeoryReport(callback) {
                let self = this

                Axios.get(process.env.VUE_APP_API +
                    `SystemFile/JSON?db={db}&folder=${folder}&file=${self.selectedPlanogram.value}`).then(r => {
                    console.log(r);

                    let fileData = r.data
                    let res = fileData.CategoryClustering[self.selectedPlanogram.text]
                    self.categoryClusters = res
                    self.rowData.forEach(e => {
                        self.categoryClusters(catStore => {
                            if (catStore.store_ID == e.catStore) {
                                e.categoryCluster = catStore.cluster
                            }
                        })
                    })
                    callback(res)
                })
            },
            getFieldsFromHeaders() {
                let self = this;

                let fields = []

                self.currentConfig.selectedItems.forEach(si => {
                    self.headers.forEach(el => {
                        if (el.headerName == si && el.field != undefined)

                            fields.push(el.field);
                    })
                })

                return fields;
            },
            handleCustomSetup(data, category) {
                let self = this;

                let columnDefs = self.headers;
                let containsCluster = false;

                columnDefs.forEach(el => {
                    if (el.headerName == "Cluster") {
                        containsCluster = true;
                    }
                })

                if (containsCluster) {
                    self.headers.splice(self.headers.length - 1, 1);
                }
                columnDefs.push({
                    "headerName": "Category Cluster",
                    "field": "categoryCluster"
                })
                let fields = self.getFieldsFromHeaders();
                categoryCluster
                console.log("fields", fields);
                columnDefs.push({
                    "headerName": "Cluster",
                    valueFormatter: function (params) {
                        let final = "";

                        fields.forEach(el => {
                            if (el == "storeCluster") {} else {
                                if (el == "userDefinedClusterValue") {
                                    console.log("userDefinedClusterValue", el);

                                    final += self.useSystemValues ? params.data.level :
                                        params.data.userDefinedCluster;
                                } else {
                                    let userValue = params.data[el.replace("_value",
                                        "")];
                                    let systemValue = params.data[el.replace("_value",
                                        "").replace("user_", "system_")];
                                    final += self.useSystemValues ? systemValue :
                                        userValue;
                                }
                            }
                        })

                        return final;
                    }
                })

                self.$refs.Grid.gridApi.setColumnDefs(columnDefs);
                self.$refs.Grid.gridApi.redrawRows();

                // Set title
                self.title = data.selectedPlanogram.text + " - Custom Cluster";

                // handle headers
                // let hide = [];
                // let show = [];

                // self.headers.forEach(h => {
                //     let inSelected = false;

                //     data.selectedItems.forEach(si => {
                //         if (h.headerName == si) {
                //             inSelected = true;
                //         }
                //     })

                //     if (inSelected) {
                //         show.push(h.field)
                //     } else {
                //         if (h.field != 'storeName' && h.field != undefined && h.field != 'totalSales' && h
                //             .field != 'cumulativePercent') {
                //             hide.push(h.field)
                //         }
                //     }
                // })

                // self.$refs.Grid.columnApi.setColumnsVisible(show, true);
                // self.$refs.Grid.columnApi.setColumnsVisible(hide, false);

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
                    self.showGrid = true;
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
            },
            getPlanograms() {
                let self = this

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + `Planogram/Distinct`)
                    .then(r => {
                        let planograms = r.data.planogramList;
                        self.planograms = [];
                        planograms.forEach(element => {
                            self.planograms.push({
                                text: element.displayname,
                                value: element.id
                            })
                        });
                        self.selectedPlanogram = self.planograms[0].value

                        self.getStoresWithClusters();

                        delete Axios.defaults.headers.common["TenantID"];
                    })
            },
            getStoresWithClusters() {
                let self = this;

                Axios.get(process.env.VUE_APP_API + "StoreClustering?planogram_ID=" + self.selectedPlanogram)
                    .then(r => {
                        self.clusterStores = r.data
                        console.log("getStoresWithClusters", r.data);
                    })
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