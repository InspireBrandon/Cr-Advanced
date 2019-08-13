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
                Sales Trend - {{ barcode }} - {{ productName }}
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
                callback: null,
                productName: '',
                barcode: '',
                data: null
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
            open(data, productName, barcode, callback) {
                let self = this

                self.productName = productName;
                self.barcode = barcode;

                self.dialog = true

                self.callback = callback;
                setTimeout(() => {
                    self.drawChart(data);
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
            drawChart(itemData) {
                let self = this;
                console.log(itemData);

                let chart = am4core.create("lineChartdiv", am4charts.XYChart);
                chart.paddingRight = 20;

                let data = itemData;
                let visits = 10;
                let previousValue;

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
                valueAxis.renderer.opposite = true;

                let series = chart.series.push(new am4charts.LineSeries());
                series.dataFields.dateX = "period_From_Date";
                series.dataFields.valueY = "sales_Retail";
                series.strokeWidth = 2;
                series.tooltipText = " Sales: {sales_Retail}";

                let series2 = chart.series.push(new am4charts.LineSeries());
                series2.dataFields.dateX = "period_From_Date";
                series2.dataFields.valueY = "sales_Profit";
                series2.strokeWidth = 2;
                series2.tooltipText = " Profit: {sales_Profit}";

                let series4 = chart.series.push(new am4charts.LineSeries());
                series4.dataFields.dateX = "period_From_Date";
                series4.dataFields.valueY = "sales_Units";
                series4.strokeWidth = 2;
                series4.tooltipText = "Volume: {sales_Units}";

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