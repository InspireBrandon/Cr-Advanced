<template>
    <v-dialog persistent width=1000 v-model="dialog">
        <v-card>
            <v-toolbar dark dense flat color="primary">
                <v-toolbar-title>
                 Line Graph
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
                Sales Trend
                <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
                <div id="lineChartdiv"></div>
            </v-card-text>
        </v-card>

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
                let chart = document.getElementById('lineChartdiv');

                // chart.clear();
                chart = null;

                if (this.chart) {
                    console.log("[Destroyed]");
                    this.chart.dispose();
                    this.chart = null;
                }
                this.dialog = false
            },
            open(data, callback) {
                let self = this

               
                self.dialog=true

                self.callback = callback;
                setTimeout(() => {
                    self.drawChart(data );
                }, 300);
            },
            closeAndSendRowdata(data) {
                let self = this;
                self.callback(data);
                self.close();
            },
            handleClick(data, item_index, item_name) {
                let self = this
                let obj = {
                    headline: "Range Handling",
                    text: "Would you like to cut this range after product " + item_index,
                    callback: self.HandleRowData
                }
                self.item_index = item_index
                self.item_name = item_name
                self.$refs.Dialog.openDialog(obj)
                console.log("[CLICK EVT]", item_index + " || " + item_name)

            },
            HandleRowData() {
                let self = this
                let tmp = []
                for (let index = 0; index < self.rowdata.length; index++) {
                    const element = self.rowdata[index];
                    if (index < self.item_index) {
                        tmp.push(element)
                    }
                }
                console.log(tmp.length);
                console.log("handleing rowdata");
                self.closeAndSendRowdata(tmp)
            },
            drawChart(itemData ) {
                let self = this;
                console.log(itemData);
               
                let chart = am4core.create("lineChartdiv", am4charts.XYChart);
                chart.paddingRight = 20;

                let data = [];
                let visits = 10;
                let previousValue;

                for (var i = 0; i < 100; i++) {
                    visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);

                    if (i > 0) {
                        // add color to previous data item depending on whether current value is less or more than previous value
                        if (previousValue <= visits) {
                            data[i - 1].color = chart.colors.getIndex(0);
                        } else {
                            data[i - 1].color = chart.colors.getIndex(5);
                        }
                    }

                    data.push({
                        date: new Date(2018, 0, i + 1),
                        value: visits
                    });
                    previousValue = visits;
                }

                chart.data = data;

                let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
                dateAxis.renderer.grid.template.location = 0;
                dateAxis.renderer.axisFills.template.disabled = true;
                dateAxis.renderer.ticks.template.disabled = true;

                let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
                valueAxis.tooltip.disabled = true;
                valueAxis.renderer.minWidth = 35;
                valueAxis.renderer.axisFills.template.disabled = true;
                valueAxis.renderer.ticks.template.disabled = true;

                let series = chart.series.push(new am4charts.LineSeries());
                series.dataFields.dateX = "date";
                series.dataFields.valueY = "value";
                series.strokeWidth = 2;
                series.tooltipText = "value: {valueY}, day change: {valueY.previousChange}";

                // set stroke property field
                series.propertyFields.stroke = "color";

                chart.cursor = new am4charts.XYCursor();

               

               
                this.chart = chart
            }
        }
    }
</script>

<style scoped>
    #lineChartdiv {
        height: 600px;
    }
</style>