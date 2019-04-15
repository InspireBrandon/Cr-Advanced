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
                    <v-card-text id="planogram-report">
                        <v-card class="mb-3">
                            <v-toolbar flat dark dense>
                                <v-toolbar-title>Overview</v-toolbar-title>
                            </v-toolbar>
                            <v-card-text>
                                <v-container grid-list-md>
                                    <v-layout row wrap v-if="planogramData != null">
                                        <v-flex md12>
                                            <span>Planogram Name: {{ planogramData.clusterData.planogramName }}</span>
                                        </v-flex>
                                        <v-flex md12>
                                            <span>Store Cluster: {{ planogramData.clusterData.storeCluster }}</span>
                                        </v-flex>
                                        <v-flex md12>
                                            <span>Store: {{ planogramData.clusterData.planogramName }}</span>
                                        </v-flex>
                                        <v-flex md12>
                                            <span>Displays: {{ planogramData.dimensionData.displays }}</span>
                                        </v-flex>
                                        <v-flex md12>
                                            <span>Modules: {{ planogramData.dimensionData.modules }}</span>
                                        </v-flex>
                                        <v-flex md12>
                                            <span>Pallettes: {{ planogramData.dimensionData.pallettes }}</span>
                                        </v-flex>
                                        <v-flex md12>
                                            <span>Supplier Stands:
                                                {{ planogramData.dimensionData.supplierStands }}</span>
                                        </v-flex>
                                        <v-flex md12>
                                            <span>Bins: {{ planogramData.dimensionData.bins }}</span>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                                <div>
                                </div>
                            </v-card-text>
                        </v-card>
                        <v-card class="mb-3">
                            <v-toolbar flat dark dense>
                                <v-toolbar-title>Output</v-toolbar-title>
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
                                        <th>Name</th>
                                        <th>Qty</th>
                                        <th>Height(cm)</th>
                                        <th>Width(cm)</th>
                                        <th>Depth(cm)</th>
                                    </tr>
                                    <tr v-for="(item, idx) in fixtureReport" :key="idx">
                                        <td>{{ item.name }}</td>
                                        <td style="text-align: right;">{{ item.qty }}</td>
                                        <td style="text-align: right;">{{ item.height }}</td>
                                        <td style="text-align: right;">{{ item.width }}</td>
                                        <td style="text-align: right;">{{ item.depth }}</td>
                                    </tr>
                                </table>
                            </v-card-text>
                        </v-card>
                        <div class="print-break-page"></div>
                        <v-card class="mb-3">
                            <v-toolbar flat dark dense>
                                <v-toolbar-title>Product Report (by weekly sales)</v-toolbar-title>
                            </v-toolbar>
                            <v-card-text>
                                <table>
                                    <tr>
                                        <th>Name</th>
                                        <th>Barcode</th>
                                        <th>Qty</th>
                                        <th>DOS</th>
                                        <th>Sales Cost</th>
                                        <th>Sales Retail</th>
                                        <th>Sales Units</th>
                                    </tr>
                                    <tr v-for="(item, idx) in productReport" :key="idx">
                                        <td>{{ item.name }}</td>
                                        <td>{{ item.barcode }}</td>
                                        <td style="text-align: right;">{{ item.qty }}</td>
                                        <td style="text-align: right;">{{ item.daysOfSupply }}</td>
                                        <td style="text-align: right;">{{ item.weeklySalesCost }}</td>
                                        <td style="text-align: right;">{{ item.weeklySalesRetail }}</td>
                                        <td style="text-align: right;">{{ item.weeklySalesUnits }}</td>
                                    </tr>
                                </table>
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
        self.barcode = item.Data.Data.barcode;
        self.capacity = 0;
        self.daysOfSupply = item.Data.CalcData.DaysOfSupply;
        self.weeklyProfit = item.Data.CalcData.Weekly_Profit;
        self.weeklySalesCost = item.Data.CalcData.Weekly_Sales_Cost;
        self.weeklySalesRetail = item.Data.CalcData.Weekly_Sales_Retail;
        self.weeklySalesUnits = item.Data.CalcData.Weekly_Sales_Units;
        self.qty = 0;

        allItems.forEach(el => {
            if (el.Data.Data.id == self.id) {
                self.capacity += el.Data.CalcData.Capacity;
                self.qty++;
            }
        })

        self.qty = self.qty * item.Data.Facings.x * item.Data.Facings.y * item.Data.Facings.z;
    }

    export default {
        components: {
            Spinner
        },
        data() {
            return {
                dialog: false,
                planogramDetails: null,
                planogramData: null,
                fixtureReport: [],
                productReport: []
            }
        },
        methods: {
            show(item) {
                let self = this;

                self.setPlanogramDetails(item);

                self.dialog = true;
            },
            setPlanogramDetails(item) {
                let self = this;

                self.planogramData = null;
                self.fixtureReport = [];
                self.productReport = [];

                self.planogramName = item.name;

                self.getPlanogramByID(item.id)
                    .then(() => {
                        self.generateReports()
                    })
                    .catch(e => {

                    })
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

                        if (canPush)
                            tmp.push(new fixtureReportItem(element, self.planogramData.planogramData));
                    }
                });

                self.fixtureReport = tmp;
            },
            generateProductReport() {
                let self = this;

                console.log(self.planogramData);

                let tmp = [];

                self.planogramData.planogramData.forEach(element => {
                    if (element.Type == "PRODUCT") {
                        let canPush = true;

                        tmp.forEach(tmpItem => {
                            if (tmpItem.id == element.Data.Data.id)
                                canPush = false;
                        });

                        if (canPush)
                            tmp.push(new productReportItem(element, self.planogramData.planogramData));
                    }
                });

                self.productReport = tmp;
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
        border: 1px solid black;
        padding: 1px;
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