<template>
    <v-dialog  persistent width=1000 v-model="dialog">
        <v-card>
            <v-toolbar dark dense flat color="primary">
                <v-toolbar-title>
                    GP Graph
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="close">
                    <v-icon>
                        close
                    </v-icon>
                </v-btn>
            </v-toolbar>
            <v-toolbar dark dense flat color="grey darken-3">
                <v-spacer></v-spacer>
                {{ rangeName }} {{fact_name}}
                <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
                <div id="chartdiv"></div>
            </v-card-text>
        </v-card>
        <Dialog ref="Dialog" />
    </v-dialog>
</template>
<script>
    import * as am4core from "@amcharts/amcharts4/core";
    import * as am4charts from "@amcharts/amcharts4/charts";
    import Dialog from '@/components/Common/Dialog';

    import am4themes_animated from "@amcharts/amcharts4/themes/animated";
    import {
        GradientModifier
    } from '@amcharts/amcharts4/.internal/core/rendering/fills/GradientModifier';

    am4core.useTheme(am4themes_animated);
    export default {
        components: {
            Dialog
        },
        data() {
            return {
                dialog: false,
                chart: null,
                rangeName: null,
                fact: null,
                fact_name: null,
                rowdata: [],
                item_index: null,
                item_name: null,
                callback: null
            }
        },
        mounted() {},

        methods: {
            close() {
                let chart = document.getElementById('chartdiv');

                // chart.clear();
                chart = null;

                if (this.chart) {
                    console.log("[Destroyed]");
                    this.chart.dispose();
                    this.chart = null;
                }
                this.dialog = false
            },
            open(data, key_value, graph_Type, callback) {
                let self = this
                self.HandelGpGraphData(data, key_value.graph, callback => {
                    self.fact = "sales_Profit"
                    self.rangeName = key_value.rangeName
                    self.dialog = true
                    self.fact_name = key_value.fact_name

                    self.callback = callback;
                    setTimeout(() => {
                        self.drawChart(callback, key_value, graph_Type);
                    }, 100);
                })

            },
       
            HandelGpGraphData(data, selected_graph, callback) {
                let self = this
                let tmp = []
                let TotalSales = 0
                console.log(selected_graph);
                console.log(data);
              
                
                    for (let index = 0; index < data.length; index++) {
                        const item = data[index];
                        var canAdd = true
                        TotalSales += parseFloat(item.sales_Retail)
                        for (let index = 0; index < tmp.length; index++) {
                            const tmpitem = tmp[index];
                            if (item[selected_graph] == tmpitem.Name) {
                                canAdd = false
                            }
                        }
                        if (canAdd == true) {
                            tmp.push({
                                Name: item[selected_graph],
                                sales_profit: item.sales_Profit,
                                sales_units: item.sales_Units,
                                sales_retail: item.sales_Retail
                            })
                        }
                    }
                    console.log("tmp");
                    console.log(tmp);

                    tmp.forEach(item => {
                        data.forEach(rowItem => {
                            if (rowItem[selected_graph] == item.Name) {
                                item.sales_profit += rowItem.sales_Profit
                                item.sales_units += rowItem.sales_Units
                                item.sales_retail += rowItem.sales_Retail
                            }
                        })
                    })
                    tmp.forEach(item => {
                        item.selling_price = item.sales_retail / item.sales_units
                        item.cost_price = (item.sales_retail - item.sales_profit) / item.sales_units;
                        item.gross_profit = (item.sales_profit / TotalSales * 100).toFixed(2)
                    })
                    console.log("tmp");
                    console.log(tmp);
                    //  for (let index = 0; index < tmp.length; index++) {
                    //         const tmpItem = tmp[index];
                    //         if (item.manufacturer_ID != tmpItem.manufacturer_ID) {
                    //             tmp.push({
                    //                
                    //             })
                    //         } else {
                    //            
                    //         }
                    //     }
                    callback(tmp)
            },
            
            drawChart(data, key_value, graph_Type) {
                let self = this;
                console.log(data);

                console.log("graph_Type");
                console.log(graph_Type);


                if (graph_Type == "bar") {
                    let chart = am4core.create("chartdiv", am4charts.XYChart);


                    let sortedData = data.sort(function (a, b) {
                        return b[key_value.value] - a[key_value.value];
                    })

                    chart.data = sortedData;
                    this.rowdata = sortedData

                    // Create axes

                    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
                    categoryAxis.dataFields.category = "Name";
                    categoryAxis.renderer.grid.template.location = 0;
                    categoryAxis.renderer.minGridDistance = 30;

                    categoryAxis.renderer.labels.template.adapter.add("dy", function (dy, target) {
                        if (target.dataItem && target.dataItem.index & 2 == 2) {
                            return dy + 25;
                        }
                        return dy;
                    });

                    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

                    // Create series
                    let series = chart.series.push(new am4charts.ColumnSeries());
                    series.dataFields.valueY = "gross_profit";
                    series.dataFields.categoryX = "Name";
                    series.name = "gross_profit";
                    series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
                    series.columns.template.fillOpacity = .8;

                    let columnTemplate = series.columns.template;
                    columnTemplate.strokeWidth = 2;
                    columnTemplate.strokeOpacity = 1;
                    this.chart = chart

                } 
                if(graph_Type=="pie")
                {
                    let chart = am4core.create("chartdiv", am4charts.PieChart3D);
                    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

                    chart.legend = new am4charts.Legend();
                    let sortedData = data.sort(function (a, b) {
                        return b[key_value.value] - a[key_value.value];
                    })

                    chart.data = sortedData;
                    this.rowdata = sortedData

                    // Add and configure Series
                    let series = chart.series.push(new am4charts.PieSeries3D());
                    series.dataFields.value = "gross_profit";
                    series.dataFields.category = "Name";
                      this.chart = chart
                }

            },

        }
    }
</script>

<style scoped>
    #chartdiv {
        height: 600px;
    }
</style>