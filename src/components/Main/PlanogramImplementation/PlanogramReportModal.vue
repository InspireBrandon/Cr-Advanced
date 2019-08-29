<template>
    <div>
        <v-layout row justify-center>
            <v-dialog v-model="dialog" persistent fullscreen>
                <v-card>
                    <v-toolbar prominent dark color="primary">
                        <v-toolbar-title>Planogram Report</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-btn icon @click="print">
                            <v-icon>print</v-icon>
                        </v-btn>
                        <v-btn icon @click="dialog = false">
                            <v-icon>close</v-icon>
                        </v-btn>
                    </v-toolbar>
                    <v-card-text style="height: calc(100vh - 64px); overflow: auto;" id="planogram-report">
                        <v-card class="mb-3">
                            <v-toolbar flat dark dense>
                                <v-toolbar-title>Title</v-toolbar-title>
                            </v-toolbar>
                            <v-card-text>
                                <v-container grid-list-md>
                                    <v-layout row wrap v-if="planogramData != null">
                                        <v-flex md8>
                                            <v-flex md12>
                                                <span>Planogram Name:
                                                    {{ planogramData.clusterData.planogramName }}</span>
                                            </v-flex>
                                            <v-flex md12>
                                                <span>Store Cluster: {{ planogramData.clusterData.storeCluster }}</span>
                                            </v-flex>
                                            <v-flex md12>
                                                <span>Store: {{ planogramData.clusterData.storeName }}</span>
                                            </v-flex>
                                            <v-flex md12 v-for="(item, idx) in fixture_types" :key="idx" v-show="item.modules > 0">
                                                <span>{{ item.displayName }}: {{ item.modules }}</span>
                                            </v-flex>
                                        </v-flex>
                                        <v-flex md4>
                                            <img style="max-height: 400px; max-width: 400px;"
                                                src="http://project1.devinspire.co.za/static/img/Chain-Research-Logo1.a3c73b4.png"
                                                alt="">
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                                <div>
                                </div>
                            </v-card-text>
                        </v-card>
                        <v-card class="mb-3">
                            <v-toolbar flat dark dense>
                                <v-toolbar-title>Planogram</v-toolbar-title>
                            </v-toolbar>
                            <v-card-text class="pa-2">
                                <v-container class="pa-0" grid-list-md>
                                    <v-layout align-center justify-center class="pa-0" row wrap>
                                        <v-flex md12 v-if="planogramData != null">
                                            <img :src="planogramData.image" style="width: 100%;">
                                        </v-flex>
                                        <v-flex md12 style="text-align: center;" v-else>
                                            <v-progress-circular color="primary" indeterminate></v-progress-circular>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                            </v-card-text>
                        </v-card>
                        <div class="print-break-page"></div>
                        <v-card class="mb-3">
                            <v-toolbar flat dark dense>
                                <v-toolbar-title>Fixture Report</v-toolbar-title>
                            </v-toolbar>
                            <v-card-text>
                                <table>
                                    <tr>
                                        <th style="min-width:400px">Name</th>
                                        <th style="min-width:50px">Qty</th>
                                        <th style="min-width:100px">Height(cm)</th>
                                        <th style="min-width:100px">Width(cm)</th>
                                        <th style="min-width:100px">Depth(cm)</th>
                                        <th style="min-width:50px">Cost</th>

                                    </tr>
                                    <tr v-for="(item, idx) in fixtureReport" :key="idx">
                                        <td>{{ item.name }}</td>
                                        <td style="text-align: right;">{{ item.qty }}</td>
                                        <td style="text-align: right;">{{ item.height }}</td>
                                        <td style="text-align: right;">{{ item.width }}</td>
                                        <td style="text-align: right;">{{ item.depth }}</td>
                                        <td style="text-align: right;">{{ item.cost == undefined ? 0 : item.cost}}</td>

                                    </tr>
                                    <tr>

                                        <td colspan="6" style="text-align: right;background:black;color:white">
                                            Total Cost: {{totalCost}}
                                        </td>
                                    </tr>
                                </table>
                            </v-card-text>
                        </v-card>
                        <div class="print-break-page"></div>
                        <v-card class="mb-3">
                            <v-toolbar flat dark dense>
                                <v-toolbar-title>Product Report - Weekly Average</v-toolbar-title>
                            </v-toolbar>
                            <v-card-text>
                                <table>
                                    <tr>
                                        <th style="min-width:150px">Product Code</th>
                                        <th style="min-width:150px">Barcode</th>
                                        <th style="min-width:400px">Description</th>
                                        <th style="min-width:100px">Capacity</th>
                                        <th style="min-width:100px">Forward Capacity</th>
                                        <th style="min-width:100px">DOS</th>
                                        <th style="min-width:100px" v-if="accesstype!=2">Sales Cost</th>
                                        <th style="min-width:100px">Sales Retail</th>
                                        <th style="min-width:100px">Sales Units</th>
                                    </tr>
                                    <tr v-for="(item, idx) in productReport" :key="idx">
                                        <td>{{item.product_Code}}</td>
                                        <td>{{ item.barcode }}</td>
                                        <td>{{ item.name }}</td>
                                        <td style="text-align: right;">{{ item.qty }}</td>
                                        <td style="text-align: right;">{{ item.xyqty }}</td>
                                        <td style="text-align: right;">{{ item.daysOfSupply }}</td>
                                        <td style="text-align: right;" v-if="accesstype!=2">{{ item.weeklySalesCost }}
                                        </td>
                                        <td style="text-align: right;">{{ item.weeklySalesRetail }}</td>
                                        <td style="text-align: right;">{{ item.weeklySalesUnits }}</td>
                                    </tr>
                                </table>
                            </v-card-text>
                        </v-card>
                        <div class="print-break-page"></div>
                        <v-card class="mb-3">
                            <v-toolbar flat dark dense>
                                <v-toolbar-title>Product Fixture Report</v-toolbar-title>
                            </v-toolbar>
                            <v-card-text>
                                <TreeVue style="border: 1px solid black; margin-bottom: 10px;"
                                    v-for="(parent, idx) in productFixtureReport" :childdark="false" :key="idx"
                                    :data="parent" />
                            </v-card-text>
                        </v-card>
                    </v-card-text>
                </v-card>
            </v-dialog>
        </v-layout>
        <Spinner ref="spinner" />
    </div>
</template>

<script>
    import Axios from 'axios';
    import Spinner from '@/components/Common/Spinner';
    import TreeVue from './TreeVue';

    function makeTree(data, parent = null) {

        return data.reduce(function (r, e) {
            if (e.Type != "TEXTHEADER") {
                if (e.Data.ParentID == parent) {
                    if (e.Type == "PRODUCT") {
                        e.Data.Data.name = e.Data.Data.description
                    }
                    e.children = makeTree(data, e.Data.ID)
                    r.push(e)
                }
            }
            return r;
        }, [])
    }

    function fixtureReportItem(item, allItems) {
        let self = this;

        self.id = item.Data.Data.id;
        self.name = item.Data.Data.name;
        self.height = item.Data.Data.height;
        self.width = item.Data.Data.width;
        self.depth = item.Data.Data.depth;
        self.qty = 0;

        allItems.forEach(el => {
            if (el.Data.Data.id == self.id)
                self.qty++;
        })
    }

    function productReportItem(item, allItems) {
        let self = this;

        self.id = item.Data.Data.id;
        self.name = item.Data.Data.description;
        self.product_Code = item.Data.Data.product_System_ID;
        self.barcode = item.Data.Data.barcode;
        self.capacity = 0;
        self.forwardCapacity = 0;
        self.daysOfSupply = item.Data.CalcData.DaysOfSupply;
        self.weeklyProfit = item.Data.CalcData.Weekly_Profit;
        self.weeklySalesCost = item.Data.CalcData.Weekly_Sales_Cost;
        self.weeklySalesRetail = item.Data.CalcData.Weekly_Sales_Retail;
        self.weeklySalesUnits = item.Data.CalcData.Weekly_Sales_Units;
        self.qty = 0;
        self.xyqty = 0;

        allItems.forEach(el => {
            if (self.id == undefined) {
                if (el.Data.Data.barcode == self.barcode) {
                    self.capacity += el.Data.CalcData.Capacity;

                    if (el.Data.CalcData.ForwardCapacity != undefined)
                        self.forwardCapacity += el.Data.CalcData.ForwardCapacity;

                    self.qty++;
                    self.xyqty++;
                }
            } else {
                if (el.Data.Data.id == self.id) {
                    self.capacity += el.Data.CalcData.Capacity;

                    if (el.Data.CalcData.ForwardCapacity != undefined)
                        self.forwardCapacity += el.Data.CalcData.ForwardCapacity;

                    self.qty++;
                    self.xyqty++;
                }
            }
        })

        self.qty = self.qty * item.Data.Facings.x * item.Data.Facings.y * item.Data.Facings.z;
        self.xyqty = self.xyqty * item.Data.Facings.x * item.Data.Facings.y;
    }

    export default {
        props: ['accesstype'],

        components: {
            Spinner,
            TreeVue
        },
        data() {
            return {
                dialog: false,
                planogramDetails: null,
                planogramData: null,
                open: [],
                fixtureReport: [],
                productReport: [],
                productFixtureReport: [],
                totalCost: 0,
                fixture_types: []
            }
        },
        methods: {
            show(item, fixture_types) {
                let self = this;

                self.fixture_types = fixture_types;
                self.setPlanogramDetails(item);

                self.dialog = true;
            },
            setPlanogramDetails(item) {
                let self = this;

                self.planogramData = null;
                self.fixtureReport = [];
                self.productReport = [];
                self.productFixtureReport = [];
                self.planogramData = item;
                self.generateReports();
            },
            getPlanogramByID(id) {
                let self = this;

                return new Promise((resolve, reject) => {
                    Axios.get(process.env.VUE_APP_API + 'SystemFile/JSON?db=CR-DEVINSPIRE&id=' + id)
                        .then(r => {
                            self.planogramData = r.data;
                            resolve();
                        })
                        .catch(e => {
                            reject();
                        })
                })
            },
            generateReports() {
                let self = this;

                self.generateFixtureReport();
                self.generateProductReport();
                self.generateProductFixtureReport();
            },
            generateFixtureReport() {
                let self = this;

                let tmp = [];

                self.planogramData.planogramData.forEach(element => {
                    if (element.Type != "PRODUCT" && element.Type != "TEXTHEADER") {
                        let canPush = true;

                        tmp.forEach(tmpItem => {
                            if (tmpItem.id == element.Data.Data.id)
                                canPush = false;
                        });
                        if (canPush) {

                            if (element.Data.Data.cost != undefined || element.Data.Data.cost != null) {
                                self.totalCost = self.totalCost + element.Data.Data.cost

                            }
                            tmp.push(new fixtureReportItem(element, self.planogramData.planogramData));
                        }

                    }
                });

                self.fixtureReport = tmp;


            },
            generateProductReport() {
                let self = this;
                let tmp = [];

                self.planogramData.planogramData.forEach(element => {

                    if (element.Type == "PRODUCT") {
                        let canPush = true;

                        tmp.forEach(tmpItem => {
                            if (tmpItem.id == undefined) {
                                if (tmpItem.barcode == element.Data.Data.barcode)
                                    canPush = false;
                            } else {
                                if (tmpItem.id == element.Data.Data.id)
                                    canPush = false;
                            }
                        });

                        if (canPush)
                            tmp.push(new productReportItem(element, self.planogramData.planogramData));
                    }
                });
                console.log(tmp);

                tmp.sort(function (a, b) {
                    if (a.weeklySalesUnits != "N/A") {
                        if (parseFloat(a.weeklySalesUnits) > parseFloat(b.weeklySalesUnits)) {
                            return 1;
                        } else {
                            return -1;
                        }
                    }

                });
                self.productReport = tmp;
            },
            generateProductFixtureReport() {
                let self = this;
                console.log(self.planogramData.planogramData);

                self.planogramData.planogramData.sort(function (a, b) {
                    if (a.Position > b.Position) {
                        return 1;
                    } else {
                        return -1;
                    }
                });

                self.productFixtureReport = makeTree(self.planogramData.planogramData);
                console.log(self.productFixtureReport);


            },
            print() {
                var printContents = document.getElementById("planogram-report").innerHTML;
                var printWindow = window.open('', 'PRINT');
                printWindow.document.body.innerHTML = printContents;
                printWindow.document.close();
                printWindow.focus();
                printWindow.print();
                printWindow.close();

                return true;
            }
        }
    }
</script>

<style scoped>
    .header-item {
        padding: 0px 0px;
        padding-bottom: 8px;
        margin-top: 5px;
    }

    table {
        border-collapse: collapse;
        width: 100%;
    }

    th {
        background: rgb(85, 85, 85);
        color: white;
    }

    table,
    th,
    td {
        padding: 0px 2px;
        border: 1px solid;
    }

    @media print {

        #Header,
        #Footer {
            display: none !important;
        }
    }

    @media print {
        body {
            overflow: auto;
            height: auto;
        }

        .scroll-y {
            height: auto;
            overflow: visible;
        }
    }

    .print-break-page {
        page-break-after: always;
    }
</style>