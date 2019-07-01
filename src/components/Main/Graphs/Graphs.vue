<template>
    <div>
        <v-toolbar flat dense dark>
            <v-toolbar-title>Report</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-text-field append-icon="search" type="text" id="filter-text-box" placeholder="Filter..."
                @input="onFilterTextBoxChanged" v-model="filterText">
            </v-text-field>
            <v-spacer></v-spacer>
            <!-- <v-tooltip bottom>
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
            </v-btn> -->
        </v-toolbar>
        <v-container grid-list-md>
            <v-layout row wrap class="pa-0 ma-0">
                <v-flex md12 class="pl-0">
                    <v-layout row wrap class="mt-0">
                        <v-flex md6 class="pr-0">
                            <v-layout row wrap>
                                <v-flex md6>
                                    <v-card class="pa-3">
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
                                <v-flex md3>
                                    <v-card class="pa-3">
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
                            </v-layout>
                        </v-flex>
                        <v-flex md6>
                            <v-flex md6>
                                <v-card class="pa-3">
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
                            <v-flex md6>
                                <v-card class="pa-3">
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
                                :onGridReady="onGridReady" :sortable="true" :processChartOptions="processChartOptions">
                            </ag-grid-vue>
                        </v-card-text>
                    </v-card>
                </v-flex>
                <v-flex md6 class="pr-0">
                    <v-layout row wrap>
                        <v-flex md6>
                            <v-card>
                                <v-toolbar dense flat dark>
                                    <v-toolbar-title>Sales Value 6MMA</v-toolbar-title>
                                </v-toolbar>
                                <v-card-text>
                                    <div id="myChart1" class="ag-theme-balham-dark my-chart chart"></div>
                                </v-card-text>
                            </v-card>
                        </v-flex>
                        <v-flex md6>
                            <v-card>
                                <v-toolbar dense flat dark>
                                    <v-toolbar-title>Customers/Employee</v-toolbar-title>
                                </v-toolbar>
                                <v-card-text>
                                    <div id="myChart2" class="ag-theme-balham-dark my-chart chart"></div>
                                </v-card-text>
                            </v-card>
                        </v-flex>
                        <v-flex md6>
                            <v-card>
                                <v-toolbar dense flat dark>
                                    <v-toolbar-title>Amount of sales</v-toolbar-title>
                                </v-toolbar>
                                <v-card-text>
                                    <div id="myChart3" class="ag-theme-balham-dark my-chart chart"></div>
                                </v-card-text>
                            </v-card>
                        </v-flex>
                        <v-flex md6>
                            <v-card>
                                <v-toolbar dense flat dark>
                                    <v-toolbar-title>Amount of sales</v-toolbar-title>
                                </v-toolbar>
                                <v-card-text>
                                    <div id="myChart4" class="ag-theme-balham-dark my-chart chart"></div>
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

    var chart1Ref;
    var chart2Ref;
    var chart3Ref;
    var chart4Ref;

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
                        var chart1RangeParams = new GroupedBar({
                            columns: ['name', 'value'],
                            chartContainer: document.querySelector('#myChart1'),
                            suppressChartRanges: true,
                            aggregate: true,
                        })

                        var chart2RangeParams = new Line({
                            columns: ['name', 'customers'],
                            chartContainer: document.querySelector('#myChart2'),
                            suppressChartRanges: true,
                            aggregate: true,
                        })

                        var chart3RangeParams = new Pie({
                            columns: ['name', 'sales'],
                            chartContainer: document.querySelector('#myChart3'),
                            suppressChartRanges: true,
                            aggregate: true
                        })

                        var chart4RangeParams = new StackedBar({
                            columns: ['name', 'sales', 'customers'],
                            chartContainer: document.querySelector('#myChart4'),
                            suppressChartRanges: true,
                            aggregate: true,
                        })

                        chart1Ref = params.api.chartRange(chart1RangeParams);
                        chart2Ref = params.api.chartRange(chart2RangeParams);
                        chart3Ref = params.api.chartRange(chart3RangeParams);
                        chart4Ref = params.api.chartRange(chart4RangeParams);
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
                    sales: 420,
                    customers: 420,
                    value: 42000
                }
            ]
        },
        methods: {
            onFilterTextBoxChanged() {
                let self = this;
                self.gridApi.setQuickFilter(self.filterText);
            },
            processChartOptions(params) {
                var options = params.options;
                // console.log("chart options:", options);
                // if (params.type !== "stackedBar" && params.type !== "groupedBar" && params.type !== "line") {
                //     console.log("chart type is " + params.type + ", making no changes.");
                //     return params.options;
                // }
                // options.height = 500;
                // options.width = 1000;
                // options.padding = {
                //     top: 20,
                //     right: 10,
                //     bottom: 10,
                //     left: 20
                // };
                // options.tooltipClass = "my-tool-tip-class";
                // options.legendPosition = "bottom";
                // options.legendPadding = 20;
                // var legend = options.legend;
                // legend.markerStrokeWidth = 2;
                // legend.markerSize = 25;
                // legend.markerPadding = 10;
                // legend.itemPaddingX = 120;
                // legend.itemPaddingY = 20;
                // legend.labelFont = "bold 18px Arial, sans-serif";
                // legend.labelColor = "#555";
                // var xAxis = options.xAxis;
                // xAxis.lineWidth = 2;
                // xAxis.lineColor = "gray";
                // xAxis.tickWidth = 2;
                // xAxis.tickSize = 10;
                // xAxis.tickPadding = 10;
                // xAxis.tickColor = "gray";
                // xAxis.labelFont = "bold 15px Arial, sans-serif";
                // xAxis.labelColor = "#de7b73";
                // xAxis.labelRotation = 20;
                // xAxis.labelFormatter = function (value) {
                //     return value === "United Kingdom" ? "UK" : "(" + String(value) + ")";
                // };
                // xAxis.gridStyle = [{
                //     stroke: "rgba(94,100,178,0.5)"
                // }];
                // var yAxis = options.yAxis;
                // yAxis.lineWidth = 2;
                // yAxis.lineColor = "gray";
                // yAxis.tickWidth = 2;
                // yAxis.tickSize = 10;
                // yAxis.tickPadding = 10;
                // yAxis.tickColor = "gray";
                // yAxis.labelFont = "bold 15px Arial, sans-serif";
                // yAxis.labelColor = "#de7b73";
                // yAxis.labelRotation = 20;
                // yAxis.labelFormatter = function (value) {
                //     return value.toString().toUpperCase();
                // };
                // yAxis.gridStyle = [{
                //         stroke: "#80808044",
                //         lineDash: undefined
                //     },
                //     {
                //         stroke: "#80808044",
                //         lineDash: [6, 3]
                //     }
                // ];
                // var seriesDefaults = options.seriesDefaults;
                // seriesDefaults.fills = ["#e1ba00", "silver", "peru"];
                // seriesDefaults.strokes = ["black"];
                // seriesDefaults.strokeWidth = 2;
                // seriesDefaults.labelEnabled = true;
                // seriesDefaults.labelFont = "italic 15px Arial, sans-serif";
                // seriesDefaults.labelPadding = {
                //     x: 10,
                //     y: 10
                // };
                // seriesDefaults.labelColor = "green";
                // seriesDefaults.shadow = {
                //     color: "rgba(0, 0, 0, 0.3)",
                //     offset: [5, 5],
                //     blur: 8
                // };
                // seriesDefaults.tooltipRenderer = function (params) {
                //     var xField = params.xField;
                //     var yField = params.yField;
                //     var x = params.datum[xField];
                //     var y = params.datum[yField];
                //     return "<b>" + xField.toUpperCase() + ":</b> " + x + "<br/><b>" + yField.toUpperCase() +
                //         ":</b> " + y;
                // };
                return options;
            },
            onGridReady(params) {
                let self = this;

                console.log(params)

                self.gridApi = params.api;
                self.columnApi = params.columnApi;
            },
            createChart1(type) {
                let self = this;

                // destroy existing chart
                if (chart1Ref) {
                    chart1Ref.destroyChart();
                }

                var params = {
                    cellRange: {
                        columns: ['name', 'value']
                    },
                    chartContainer: document.querySelector('#myChart1'),
                    chartType: type,
                    suppressChartRanges: true,
                    aggregate: true
                };

                console.log(self.gridApi)

                chart1Ref = self.gridApi.chartRange(params);
            },
            createChart2(type) {
                let self = this;

                // destroy existing chart
                if (chart2Ref) {
                    chart2Ref.destroyChart();
                }

                var params = {
                    cellRange: {
                        columns: ['name', 'customers']
                    },
                    chartContainer: document.querySelector('#myChart2'),
                    chartType: type,
                    suppressChartRanges: true,
                    aggregate: true
                };

                console.log(self.gridApi)

                chart2Ref = self.gridApi.chartRange(params);
            },
            createChart3(type) {
                let self = this;

                // destroy existing chart
                if (chart3Ref) {
                    chart3Ref.destroyChart();
                }

                var params = {
                    cellRange: {
                        columns: ['name', 'sales']
                    },
                    chartContainer: document.querySelector('#myChart3'),
                    chartType: type,
                    suppressChartRanges: true,
                    aggregate: true
                };

                console.log(self.gridApi)

                chart3Ref = self.gridApi.chartRange(params);
            },
            createChart4(type) {
                let self = this;

                // destroy existing chart
                if (chart4Ref) {
                    chart4Ref.destroyChart();
                }

                var params = {
                    cellRange: {
                        columns: ['name', 'sales', 'customer']
                    },
                    chartContainer: document.querySelector('#myChart4'),
                    chartType: type,
                    suppressChartRanges: true,
                    aggregate: true
                };

                console.log(self.gridApi)

                chart4Ref = self.gridApi.chartRange(params);
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