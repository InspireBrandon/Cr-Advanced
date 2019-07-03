<template>
    <div>
        <!-- <v-toolbar flat dense dark>
            <v-toolbar-title>Report</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-text-field append-icon="search" type="text" id="filter-text-box" placeholder="Filter..."
                @input="onFilterTextBoxChanged" v-model="filterText">
            </v-text-field>
            <v-spacer></v-spacer>
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-icon color="info" dark v-on="on">info</v-icon>
                </template>
                <span>For more information hover over points of interest.<br>
                    You can create your own chart by selecting data to display on the grid and right
                    clicking
                </span>
            </v-tooltip>
            <v-btn dark color="primary" class="my-0">
                <v-icon>add</v-icon>
            </v-btn>
        </v-toolbar> -->
        <v-container grid-list-md>
            <v-layout row wrap class="pa-0 ma-0">
                <v-flex md12 class="pl-0">
                    <v-layout row wrap class="mt-0">
                        <v-flex md3 xs12 sm12>
                            <v-card class="pa-3 mt-3">
                                <v-layout row wrap>
                                    <v-flex md8>
                                        <v-card color="success" dark style="width: 53px; margin-top: -30px;"
                                            class="elevation-5">
                                            <v-icon size="50">trending_up</v-icon>
                                        </v-card>
                                    </v-flex>
                                    <v-flex md4 class="pa-2" style="text-align: right;">
                                        <div style="width: 100%;">
                                            <span style="width: 95%;" class="headline">Sales</span>
                                        </div>
                                        <span class="font-weight-light">R500 000</span>
                                    </v-flex>
                                    <v-flex md12>
                                        <v-divider></v-divider>
                                    </v-flex>
                                    <v-flex md12 class="font-weight-light">
                                        view performance
                                    </v-flex>
                                </v-layout>
                            </v-card>
                        </v-flex>
                        <v-flex md3 xs12 sm12>
                            <v-card class="pa-3 mt-3">
                                <v-layout row wrap>
                                    <v-flex md8>
                                        <v-card color="success" dark style="width: 53px; margin-top: -30px;"
                                            class="elevation-5">
                                            <v-icon size="50">trending_up</v-icon>
                                        </v-card>
                                    </v-flex>
                                    <v-flex md4 class="pa-2" style="text-align: right;">
                                        <div style="width: 100%;">
                                            <span style="width: 95%;" class="headline">Profit</span>
                                        </div>
                                        <span class="font-weight-light">R375 000</span>
                                    </v-flex>
                                    <v-flex md12>
                                        <v-divider></v-divider>
                                    </v-flex>
                                    <v-flex md12 class="font-weight-light">
                                        view performance
                                    </v-flex>
                                </v-layout>
                            </v-card>
                        </v-flex>
                        <v-flex md3 xs12 sm12>
                            <v-card class="pa-3 mt-3">
                                <v-layout row wrap>
                                    <v-flex md6>
                                        <v-card color="warning" dark style="width: 53px; margin-top: -30px;"
                                            class="elevation-5">
                                            <v-icon size="50">trending_flat</v-icon>
                                        </v-card>
                                    </v-flex>
                                    <v-flex md6 class="pa-2" style="text-align: right;">
                                        <div style="width: 100%;">
                                            <span style="width: 95%;" class="headline">Item Movement</span>
                                        </div>
                                        <span class="font-weight-light">20 000 units</span>
                                    </v-flex>
                                    <v-flex md12>
                                        <v-divider></v-divider>
                                    </v-flex>
                                    <v-flex md12 class="font-weight-light">
                                        view performance
                                    </v-flex>
                                </v-layout>
                            </v-card>
                        </v-flex>
                        <v-flex md3 xs12 sm12>
                            <v-card class="pa-3 mt-3">
                                <v-layout row wrap>
                                    <v-flex md8>
                                        <v-card color="error" dark style="width: 53px; margin-top: -30px;"
                                            class="elevation-5">
                                            <v-icon size="50">trending_down</v-icon>
                                        </v-card>
                                    </v-flex>
                                    <v-flex md4 class="pa-2" style="text-align: right;">
                                        <div style="width: 100%;">
                                            <span style="width: 95%;" class="headline">Productivity</span>
                                        </div>
                                        <span class="font-weight-light">-2%</span>
                                    </v-flex>
                                    <v-flex md12>
                                        <v-divider></v-divider>
                                    </v-flex>
                                    <v-flex md12 class="font-weight-light">
                                        view performance
                                    </v-flex>
                                </v-layout>
                            </v-card>
                        </v-flex>
                    </v-layout>
                </v-flex>
                <v-flex md6 class="pl-0">
                    <v-card>
                        <v-toolbar dense flat dark>
                            <v-toolbar-title>Monthly Sales</v-toolbar-title>
                        </v-toolbar>
                        <v-card-text>
                            <ag-grid-vue id="ag-Grid" :gridOptions="gridOptions" style="width: 100%; height: 60vh;"
                                :defaultColDef="defaultColDef" class="ag-theme-balham" :columnDefs="columnDefs"
                                :rowData="rowData" :filter="true" :suppressRowClickSelection="true"
                                :enableRangeSelection="true" rowSelection="multiple" :rowDeselection="true"
                                :resizable="true" :floatingFilter="true" :groupMultiAutoColumn="true"
                                :onGridReady="onGridReady" :sortable="true" @first-data-rendered="onFirstDataRendered">
                                <!-- :processChartOptions="processChartOptions" -->
                            </ag-grid-vue>
                        </v-card-text>
                    </v-card>
                </v-flex>
                <v-flex md6 class="pr-0">
                    <v-layout row wrap>
                        <v-flex md6 xs12 sm12>
                            <v-card>
                                <v-toolbar dense flat dark>
                                    <v-toolbar-title>Sales Value 6MMA</v-toolbar-title>
                                </v-toolbar>
                                <v-card-text>
                                    <div id="myGroupedBar1" class="ag-theme-balham-dark my-chart chart"></div>
                                </v-card-text>
                            </v-card>
                        </v-flex>
                        <v-flex md6 xs12 sm12>
                            <v-card>
                                <v-toolbar dense flat dark>
                                    <v-toolbar-title>Customers/Employee</v-toolbar-title>
                                </v-toolbar>
                                <v-card-text>
                                    <div id="myLineGraph1" class="ag-theme-balham-dark my-chart chart"></div>
                                </v-card-text>
                            </v-card>
                        </v-flex>
                        <v-flex md6 xs12 sm12>
                            <v-card>
                                <v-toolbar dense flat dark>
                                    <v-toolbar-title>Amount of sales</v-toolbar-title>
                                </v-toolbar>
                                <v-card-text>
                                    <div id="myPieChart1" class="ag-theme-balham-dark my-chart chart"></div>
                                </v-card-text>
                            </v-card>
                        </v-flex>
                        <v-flex md6 xs12 sm12>
                            <v-card>
                                <v-toolbar dense flat dark>
                                    <v-toolbar-title>Amount of sales</v-toolbar-title>
                                </v-toolbar>
                                <v-card-text>
                                    <div id="myStackedBarBar1" class="ag-theme-balham-dark my-chart chart"></div>
                                </v-card-text>
                            </v-card>
                        </v-flex>
                    </v-layout>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
    import Axios from 'axios'
    import {
        AgGridVue
    } from "ag-grid-vue";

    function Pie(params) {
        let self = this;

        self.cellRange = {
            columns: params.columns
        }

        self.chartType = 'pie';
        self.chartContainer = params.chartContainer;
        self.suppressChartRanges = params.suppressChartRanges;
        self.aggregate = params.aggregate;
    }

    function GroupedBar(params) {
        let self = this;

        self.cellRange = {
            columns: params.columns
        }

        self.chartType = 'groupedBar';
        self.chartContainer = params.chartContainer;
        self.suppressChartRanges = params.suppressChartRanges;
        self.aggregate = params.aggregate;
    }

    function StackedBar(params) {
        let self = this;

        self.cellRange = {
            columns: params.columns
        }

        self.chartType = 'stackedBar';
        self.chartContainer = params.chartContainer;
        self.suppressChartRanges = params.suppressChartRanges;
        self.aggregate = params.aggregate;
    }

    function Line(params) {
        let self = this;

        self.cellRange = {
            columns: params.columns
        }

        self.chartType = 'line';
        self.chartContainer = params.chartContainer;
        self.suppressChartRanges = params.suppressChartRanges;
        self.aggregate = params.aggregate;
    }

    var firstGroupedBar;
    var firstLine;
    var firstPieChart;
    var firstGroupedBar;

    export default {
        data() {
            return {
                filterText: '',
                items: [],
                pageNumber: 0,
                allowedRecords: 25,
                columnDefs: [],
                enableCharts: true,
                rowData: [],
                defaultColDef: {},
                gridOptions: {
                    enableCharts: true,
                    enableRangeSelection: true,
                    rowHeight: 35,
                    pinnedTopRowData: [],
                    pinnedBottomRowData: [],
                    context: {
                        componentParent: this
                    },
                    rowClassRules: {
                        'disabled-line': 'data.can_edit'
                    },
                    onFirstDataRendered(params) {
                        var firstGroupedBarRangeParams = new GroupedBar({
                            columns: ['name', 'value'],
                            chartContainer: document.querySelector('#myGroupedBar1'),
                            suppressChartRanges: true,
                            aggregate: true
                        })

                        var firstLineGraphRangeParams = new Line({
                            columns: ['name', 'customers'],
                            chartContainer: document.querySelector('#myLineGraph1'),
                            suppressChartRanges: true,
                            aggregate: true
                        })

                        var firstPieChartRangeParams = new Pie({
                            columns: ['name', 'sales'],
                            chartContainer: document.querySelector('#myPieChart1'),
                            suppressChartRanges: true,
                            aggregate: true
                        })

                        var firstStackedBarRangeParams = new StackedBar({
                            columns: ['name', 'sales', 'customers'],
                            chartContainer: document.querySelector('#myStackedBarBar1'),
                            suppressChartRanges: true,
                            aggregate: true
                        })

                        firstGroupedBar = params.api.chartRange(firstGroupedBarRangeParams);
                        firstLine = params.api.chartRange(firstLineGraphRangeParams);
                        firstPieChart = params.api.chartRange(firstPieChartRangeParams);
                        firstGroupedBar = params.api.chartRange(firstStackedBarRangeParams);
                    }
                },

            }
        },
        components: {
            AgGridVue,
        },
        created() {
            let self = this;
            self.gridOptions.context.componentParent = this;
        },
        beforeMount() {
            let self = this;
            self.columnDefs = require('./headers.json');
            self.rowData = [{
                    name: "Brandon",
                    sales: 5,
                    customers: 6,
                    value: 10000
                },
                {
                    name: "Piet",
                    sales: 6,
                    customers: 2,
                    value: 15000
                },
                {
                    name: "Douglas",
                    sales: 20,
                    customers: 2,
                    value: 10000
                },
                {
                    name: "TJ",
                    sales: 12,
                    customers: 8,
                    value: 13000
                },
                {
                    name: "Jason",
                    sales: 2,
                    customers: 4,
                    value: 25000
                },
                {
                    name: "Connor",
                    sales: 2,
                    customers: 99,
                    value: 9001
                },
                {
                    name: "Brendan",
                    sales: 42,
                    customers: 42,
                    value: 42000
                }
            ]
        },
        methods: {
            onFilterTextBoxChanged() {
                let self = this;
                self.gridApi.setQuickFilter(self.filterText);
            },
            // processChartOptions(params) {
            //     var options = params.options;
            // // console.log("chart options:", options);
            // switch (params.type) {
            //     case "groupedBar":

            //         console.log("chart type is " + params.type + ", making no changes.");
            //         return params.options;

            //         options.height = 500;
            //         options.width = 1000;
            //         options.padding = {
            //             top: 20,
            //             right: 20,
            //             bottom: 10,
            //             left: 20
            //         };
            //         options.tooltipClass = "my-tool-tip-class";
            //         options.legendPosition = "bottom";
            //         options.legendPadding = 20;
            //         var legend = options.legend;
            //         legend.markerStrokeWidth = 2;
            //         legend.markerSize = 25;
            //         legend.markerPadding = 10;
            //         legend.itemPaddingX = 120;
            //         legend.itemPaddingY = 20;
            //         legend.labelFont = "bold 18px Arial, sans-serif";
            //         legend.labelColor = "#3949AB";
            //         var xAxis = options.xAxis;
            //         xAxis.lineWidth = 1;
            //         xAxis.lineColor = "red";
            //         xAxis.tickWidth = 1;
            //         xAxis.tickSize = 10;
            //         xAxis.tickPadding = 10;
            //         xAxis.tickColor = "red";
            //         xAxis.labelFont = "bold 12px Arial, sans-serif";
            //         xAxis.labelColor = "#3949AB";
            //         xAxis.labelRotation = 20;
            //         xAxis.labelFormatter = function (value) {
            //             return value === "United Kingdom" ? "UK" : "(" + String(value) + ")";
            //         };
            //         xAxis.gridStyle = [{
            //             stroke: "rgba(55, 71, 79, 1)"
            //         }];
            //         var yAxis = options.yAxis;
            //         yAxis.lineWidth = 1;
            //         yAxis.lineColor = "red";
            //         yAxis.tickWidth = 1;
            //         yAxis.tickSize = 8;
            //         yAxis.tickPadding = 8;
            //         yAxis.tickColor = "red";
            //         yAxis.labelFont = "bold 12px Arial, sans-serif";
            //         yAxis.labelColor = "#3949AB";
            //         yAxis.labelRotation = 20;
            //         yAxis.labelFormatter = function (value) {
            //             return value.toString().toUpperCase();
            //         };
            //         yAxis.gridStyle = [{
            //                 stroke: "#80808044",
            //                 lineDash: undefined
            //             },
            //             {
            //                 stroke: "#80808044",
            //                 lineDash: [10, 3]
            //             }
            //         ];
            //         var seriesDefaults = options.seriesDefaults;
            //         seriesDefaults.fills = ["#18FFFF", "#0091EA"];
            //         seriesDefaults.strokes = ["black"];
            //         seriesDefaults.strokeWidth = 1;
            //         seriesDefaults.labelEnabled = true;
            //         seriesDefaults.labelFont = "italic 15px Arial, sans-serif";
            //         seriesDefaults.labelPadding = {
            //             x: 10,
            //             y: 10
            //         };
            //         seriesDefaults.labelColor = "green";
            //         seriesDefaults.shadow = {
            //             color: "rgba(0, 0, 0, 0.3)",
            //             offset: [5, 5],
            //             blur: 8
            //         };
            //         seriesDefaults.tooltipRenderer = function (params) {
            //             var xField = params.xField;
            //             var yField = params.yField;
            //             var x = params.datum[xField];
            //             var y = params.datum[yField];
            //             return "<b>" + xField.toUpperCase() + ":</b> " + x + "<br/><b>" + yField.toUpperCase() +
            //                 ":</b> " + y;
            //         };
            //         return options;
            //         break;

            //     case "pie":
            //         console.log("chart type is " + params.type + ", making no changes.");
            //         return params.options;

            //         options.height = 500;
            //         options.width = 1000;
            //         options.title = {
            //             text: "Gold Production",
            //             font: "italic bold 18px Arial, sans-serif",
            //             color: "#414182"
            //         };
            //         options.subtitle = {
            //             text: "by country",
            //             font: "italic 14px Arial, sans-serif",
            //             color: "rgb(100, 100, 100)"
            //         };
            //         options.padding = {
            //             top: 40,
            //             right: 10,
            //             bottom: 40,
            //             left: 20
            //         };
            //         options.tooltipClass = "my-tool-tip-class";
            //         options.legendPosition = "bottom";
            //         options.legendPadding = 20;
            //         var legend = options.legend;
            //         legend.markerStrokeWidth = 2;
            //         legend.markerSize = 10;
            //         legend.markerPadding = 10;
            //         legend.itemPaddingX = 100;
            //         legend.itemPaddingY = 5;
            //         legend.labelFont = "12px Arial, sans-serif";
            //         legend.labelColor = "#2222aa";
            //         var seriesDefaults = options.seriesDefaults;
            //         seriesDefaults.fills = ["#5e64b2", "#b594dc", "#fec444", "#f07372", "#35c2bd"];
            //         seriesDefaults.strokes = ["#42467d", "#7f689a", "#b28930", "#a85150", "#258884"];
            //         seriesDefaults.labelEnabled = true;
            //         seriesDefaults.labelMinAngle = 30;
            //         seriesDefaults.labelFont = "12px Arial, sans-serif";
            //         seriesDefaults.labelColor = "#2222aa";
            //         seriesDefaults.strokeWidth = 2;
            //         seriesDefaults.calloutStrokeWidth = 3;
            //         seriesDefaults.calloutColors = ["black"];
            //         seriesDefaults.calloutLength = 15;
            //         seriesDefaults.calloutPadding = 15;
            //         seriesDefaults.shadow = {
            //             color: "rgba(96, 96, 175, 0.5)",
            //             offset: [0, 0],
            //             blur: 10
            //         };
            //         seriesDefaults.tooltipRenderer = function (params) {
            //             var angleField = params.angleField;
            //             var value = params.datum[angleField];
            //             return "<b>" + angleField.toUpperCase() + ":</b> " + value;
            //         };
            // return options;
            //         break;
            //     case "stackedBar":
            //         break;
            //     case "line":
            //         break;
            // }
            // },

            onGridReady(params) {
                let self = this;

                console.log(params)

                self.gridApi = params.api;
                self.columnApi = params.columnApi;
            },
            createFirstGroupedBar(type) {
                let self = this;

                // destroy existing chart
                if (firstGroupedBar) {
                    firstGroupedBar.destroyChart();
                }

                var params = {
                    cellRange: {
                        columns: ['name', 'value']
                    },
                    chartContainer: document.querySelector('#myGroupedBar1'),
                    chartType: type,
                    suppressChartRanges: true,
                    aggregate: true,

                };

                console.log(self.gridApi)

                firstGroupedBar = self.gridApi.chartRange(params);
            },
            createChart2(type) {
                let self = this;

                // destroy existing chart
                if (firstLine) {
                    firstLine.destroyChart();
                }

                var params = {
                    cellRange: {
                        columns: ['name', 'customers']
                    },
                    chartContainer: document.querySelector('#myLineGraph1'),
                    chartType: type,
                    suppressChartRanges: true,
                    aggregate: true
                };

                console.log(self.gridApi)

                firstLine = self.gridApi.chartRange(params);
            },
            createChart3(type) {
                let self = this;

                // destroy existing chart
                if (firstPieChart) {
                    firstPieChart.destroyChart();
                }

                var params = {
                    cellRange: {
                        columns: ['name', 'sales']
                    },
                    chartContainer: document.querySelector('#myPieChart1'),
                    chartType: type,
                    suppressChartRanges: true,
                    aggregate: true
                };

                console.log(self.gridApi)

                firstPieChart = self.gridApi.chartRange(params);
            },
            createChart4(type) {
                let self = this;

                // destroy existing chart
                if (firstGroupedBar) {
                    firstGroupedBar.destroyChart();
                }

                var params = {
                    cellRange: {
                        columns: ['name', 'sales', 'customer']
                    },
                    chartContainer: document.querySelector('#myStackedBarBar1'),
                    chartType: type,
                    suppressChartRanges: true,
                    aggregate: true
                };

                console.log(self.gridApi)

                firstGroupedBar = self.gridApi.chartRange(params);
            }
        }

    }
</script>

<style>
    .chart {
        height: 246px;
        /* width: 600px; */
    }
</style>