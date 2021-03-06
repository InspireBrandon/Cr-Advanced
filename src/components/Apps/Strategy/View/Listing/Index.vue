<template>
    <v-card>
        <v-toolbar dark flat dense color="grey darken-3">
            <v-spacer></v-spacer>
            {{ generateScreenName() }}
            <v-spacer></v-spacer>
            <v-toolbar-title>
                Listing Cluster
            </v-toolbar-title>
        </v-toolbar>
        <v-toolbar dark flat>
            <v-spacer></v-spacer>
            <v-btn-toggle v-if="storeRowData.length > 0" round v-model="selectedView" class="transparent" mandatory>
                <v-btn class="elevation-0" style="width: 100px" round @click="changeView(0)" color="primary">
                    Store
                </v-btn>
                <v-btn class="elevation-0" style="width: 100px" round @click="changeView(1)" color="primary">
                    Product
                </v-btn>
            </v-btn-toggle>
        </v-toolbar>
        <storeGrid v-if="selectedView==0  && storeRowData.length > 0" ref="storeGrid" :rowData="storeRowData" />
        <ProductGrid v-if="selectedView==1 && productRowData.length > 0" ref="ProductGrid" :rowData="productRowData"
            :stores="stores" />
        <Spinner ref="Spinner" />
    </v-card>
</template>
<script>
    import Axios from "axios"

    import storeGrid from "./storeGrid"
    import ProductGrid from "./ProductGrid"
    import Spinner from '@/components/Common/Spinner';

    import ListingClusterController from './controller.js';

    import {
        AgGridVue
    } from "ag-grid-vue";

    export default {
        components: {
            Spinner,
            ProductGrid,
            storeGrid,
            AgGridVue,
        },
        data() {
            return {
                selectedView: 1,
                storeRowData: [],
                productRowData: [],
                stores: [],
                planograms: [],
                selectedPlanogram: null,
                selectedPeriod: null,
                headers: [],
                gridOptions: {
                    autoGroupColumnDef: {
                        headerName: 'Product Name', //custom header name for group
                        pinned: 'left', //force pinned left. Does not work in columnDef
                        cellRendererParams: {
                            suppressCount: true, //remove number in Group Column
                        }
                    },
                    pinnedTopRowData: [],
                    pinnedBottomRowData: [],
                    context: {
                        componentParent: this
                    },
                },
                defaultColDef: {},
                primaryCluster: 5,
                primaryClusters: [{
                        text: "10%",
                        value: 1
                    },
                    {
                        text: "20%",
                        value: 2
                    },
                    {
                        text: "30%",
                        value: 3
                    },
                    {
                        text: "40%",
                        value: 4
                    },
                    {
                        text: "50%",
                        value: 5
                    },
                    {
                        text: "60%",
                        value: 6
                    },
                    {
                        text: "70%",
                        value: 7
                    },
                    {
                        text: "80%",
                        value: 8
                    },
                    {
                        text: "90%",
                        value: 9
                    },
                    {
                        text: "100%",
                        value: 10
                    },
                ],
                secondaryCluster: 3,
                secondaryClusters: [{
                        text: "10%",
                        value: 1
                    },
                    {
                        text: "20%",
                        value: 2
                    },
                    {
                        text: "30%",
                        value: 3
                    },
                    {
                        text: "40%",
                        value: 4
                    },
                    {
                        text: "50%",
                        value: 5
                    },
                    {
                        text: "60%",
                        value: 6
                    },
                    {
                        text: "70%",
                        value: 7
                    },
                    {
                        text: "80%",
                        value: 8
                    },
                    {
                        text: "90%",
                        value: 9
                    },
                    {
                        text: "100%",
                        value: 10
                    },
                ],
                level: 3,
                levels: [1, 2, 3, 4, 5],
                group: 3,
                groups: [1, 2, 3],
                salesData: null
            }
        },
        mounted() {
            let self = this;
            self.$refs.Spinner.show();
            self.openFile()
        },
        methods: {
            handleResize(type) {
                let self = this
                if (type == 1) {
                    self.$refs.ProductGrid.autoSize()
                } else {
                    self.$refs.storeGrid.autoSize()
                }
            },
            changeView(type) {
                let self = this
                self.selectedView = type;
            },
            runQuery(planogram, from, to) {
                let self = this;

                self.$refs.Spinner.show()
                self.$nextTick(() => {

                    Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                    Axios.get(process.env.VUE_APP_API +
                            `ListingCluster?planogram_ID=${planogram}&period_from_id=${from}&period_to_id=${to}`
                        )
                        .then(r => {
                            delete Axios.defaults.headers.common["TenantID"];

                            self.salesData = r.data;

                            self.onPercentChange();

                            self.$refs.Spinner.hide()
                        })
                })
            },
            onPercentChange() {
                let self = this;

                self.$nextTick(() => {
                    if (self.secondaryCluster != null) {
                        let lcData = ListingClusterController.GenerateClusterOutput({
                            storeSalesData: self.salesData,
                            primaryCluster: self.primaryCluster,
                            secondaryCluster: self.secondaryCluster,
                            clusterLevels: self.level,
                            clusterGroups: self.group
                        });

                        self.storeRowData = lcData.storeData;
                        self.stores = lcData.stores;
                        self.productRowData = lcData.productData;
                        self.$refs.Spinner.hide()
                    }
                })
            },
            newFile() {
                let self = this;

                self.$refs.PlanogramSelector.show(planogram => {
                    self.$refs.DateRangeSelector.show(dateRange => {
                        self.selectedPlanogram = planogram;
                        self.selectedPeriod = dateRange;
                        self.runQuery(planogram.id, dateRange.dateFrom, dateRange.dateTo)
                    })
                })
            },
            openFile() {
                let self = this;

                // TODO add loader
                Axios.get(process.env.VUE_APP_API + `SystemFile/JSON?db=CR-Devinspire&id=924`)
                    .then(r => {
                        self.salesData = r.data.salesData;
                        self.selectedPlanogram = r.data.config.planogramData;
                        self.selectedPeriod = r.data.config.periodData;

                        self.primaryCluster = r.data.config.setup.primaryCluster;
                        self.secondaryCluster = r.data.config.setup.secondaryCluster;
                        self.level = r.data.config.setup.level;
                        self.group = r.data.config.setup.group;

                        self.onPercentChange();
                    })
            },
            closeFile() {
                let self = this;

                self.salesData = null;
                self.selectedPlanogram = null;
                self.selectedPeriod = null;

                self.primaryCluster = 5;
                self.secondaryCluster = 3;
                self.level = 3;
                self.group = 3;

                self.storeRowData = [];
                self.stores = [];
                self.productRowData = [];
            },
            getFile(callback) {
                let self = this;

                Axios.get(process.env.VUE_APP_API +
                        `SystemFile/JSON?db=CR-Devinspire&folder=CLUSTER REPORT&file=REPORT`)
                    .then(r => {
                        callback(r.data);
                    })
            },
            saveFile() {
                let self = this;

                self.getFile(fileTransaction => {
                    if (fileTransaction == null || fileTransaction == false) {
                        let tmp = {
                            listing: {}
                        }

                        tmp.listing[self.selectedPlanogram.displayname] = self.storeRowData;

                        self.appendAndSaveFile(tmp);
                    } else {
                        self.getFileData(fileTransaction.id, fileData => {
                            let tmp = fileData;

                            if (tmp.listing == undefined)
                                tmp.listing = {};

                            tmp.listing[self.selectedPlanogram.displayname] = self.storeRowData;

                            self.appendAndSaveFile(tmp);
                        })
                    }
                })
            },
            getFileData(id, callback) {
                let self = this;

                Axios.get(process.env.VUE_APP_API + `SystemFile/JSON?db=CR-Devinspire&id=${id}`)
                    .then(r => {
                        callback(r.data);
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
            generateName() {
                let self = this;

                if (self.selectedPeriod != null) {
                    if (self.selectedPeriod.periodic) {
                        return `${self.selectedPlanogram.id} - ${self.selectedPeriod.monthsBetween} MMA`;
                    } else {
                        return `${self.selectedPlanogram.id} Average Monthly ${self.selectedPeriod.dateFromString} To ${self.selectedPeriod.dateToString}`;
                    }
                } else {
                    return "";
                }
            },
            generateScreenName() {
                let self = this;

                if (self.selectedPeriod != null) {
                    if (self.selectedPeriod.periodic) {
                        return `${self.selectedPlanogram.displayname} - ${self.selectedPeriod.monthsBetween} MMA`;
                    } else {
                        return `${self.selectedPlanogram.displayname} Average Monthly ${self.selectedPeriod.dateFromString} To ${self.selectedPeriod.dateToString}`;
                    }
                } else {
                    return "";
                }
            }
        }
    }
</script>

<style scoped>

</style>