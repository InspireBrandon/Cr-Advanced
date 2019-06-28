<template>
    <div>
        <v-container fluid class="pa-0 ma-0" grid-list-md>
            <v-layout row wrap class="pa-0 ma-0">
                <v-flex md12 class="pa-0 ma-0">
                    <v-toolbar flat dense dark>
                        <v-toolbar-title>Store</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-text-field append-icon="search" type="text" id="filter-text-box" placeholder="Filter..."
                            @input="onFilterTextBoxChanged" v-model="filterText">
                        </v-text-field>
                        <v-spacer></v-spacer>
                        <v-btn dark @click="openAdd" color="primary" class="my-0">
                            <v-icon>add</v-icon>
                        </v-btn>
                    </v-toolbar>
                    <ag-grid-vue id="ag-Grid" :gridOptions="gridOptions"
                        style="width: 100%; height: 35vh;" :defaultColDef="defaultColDef"
                        class="ag-theme-balham" :columnDefs="columnDefs" :rowData="rowData" :enableSorting="true"
                        :enableFilter="true" :suppressRowClickSelection="true" :enableRangeSelection="true"
                        rowSelection="multiple" :rowDeselection="true" :enableColResize="true" :floatingFilter="true"
                        :groupMultiAutoColumn="true" :gridReady="onGridReady">
                    </ag-grid-vue>
                    <div id="myChart" class="ag-theme-balham-dark my-chart"></div>
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

    var chartRef;

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
                        componentParent: self
                    },
                    rowClassRules: {
                        'disabled-line': 'data.can_edit'
                    },
                    onFirstDataRendered(params) {
                        var chartRangeParams = {
                            cellRange: {
                                columns: ['name', 'value', 'other']
                            },
                            chartType: 'groupedBar',
                            chartContainer: document.querySelector('#myChart'),
                            suppressChartRanges: true,
                            aggregate: true
                        };

                        chartRef = params.api.chartRange(chartRangeParams);
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
                    value: 5,
                    other: 6
                },
                {
                    name: "Piet",
                    value: 6,
                    other: 2
                },
                {
                    name: "Douglas",
                    value: 9,
                    other: 1
                },
                {
                    name: "TJ",
                    value: 12,
                    other: 8
                },
                {
                    name: "Jason",
                    value: 2,
                    other: 4
                },
                {
                    name: "Connor",
                    value: 2,
                    other: 99
                },
                {
                    name: "Brendan",
                    value: 3,
                    other: 12
                }
            ]
        },
        methods: {
            onFilterTextBoxChanged() {
                let self = this;
                self.gridApi.setQuickFilter(self.filterText);
            },
            onGridReady(params) {
                let self = this;
                self.gridApi = params.api;
                self.columnApi = params.columnApi;
            },
            createChart(type) {

                // destroy existing chart
                if (chartRef) {
                    chartRef.destroyChart();
                }

                var params = {
                    cellRange: {
                        columns: ['name', 'value', 'other']
                    },
                    chartContainer: document.querySelector('#myChart'),
                    chartType: type,
                    suppressChartRanges: true,
                    aggregate: true
                };

                chartRef = gridOptions.api.chartRange(params);
            }
        }

    }
</script>