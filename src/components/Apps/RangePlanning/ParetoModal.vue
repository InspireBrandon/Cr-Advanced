<template>
    <v-dialog fullscreen persistent width=1000 v-model="dialog">
        <v-card>
            <v-toolbar dark dense flat color="primary">
                <v-toolbar-title>
                    Pareto Graph
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
                {{ rangeName }} {{fact_name}} Pareto
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
            open(data, key_value, callback) {
                let self = this

                self.fact = key_value.value
                self.rangeName = key_value.rangeName
                self.dialog = true
                self.fact_name = key_value.fact_name
               
                self.callback = callback;
                setTimeout(() => {
                    self.drawChart(data, key_value);
                }, 100);
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
            drawChart(data, key_value) {
                let self = this;
                let chart = am4core.create("chartdiv", am4charts.XYChart);

                chart.events.on("hit", function (event) {
                    console.log("[CLICK EVT]", event)
                    this.handleClick(data, event.target.series.values[1].tooltipDataItem.categoryX, event.target
                        .series.values[1].tooltipDataItem.categoryz)
                }, this);
                let sortedData = data.sort(function (a, b) {
                    return b[key_value.value] - a[key_value.value];
                })

                chart.data = sortedData;
                this.rowdata = sortedData
                prepareParetoData();

                function prepareParetoData() {
                    let total = 0;

                    for (var i = 0; i < chart.data.length; i++) {
                        let value = chart.data[i][key_value.value];
                        chart.data[i][key_value.altValue] = i + 1;


                        total += value;
                    }

                    let sum = 0;
                    for (var i = 0; i < chart.data.length; i++) {
                        let value = chart.data[i][key_value.value];
                        sum += value;
                        chart.data[i].pareto = sum / total * 100;
                    }
                }
                // Create axes

                let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
                categoryAxis.dataFields.category = key_value.altValue;
                categoryAxis.renderer.grid.template.location = 0;
                categoryAxis.renderer.minGridDistance = 60;
                categoryAxis.tooltip.disabled = true;

                categoryAxis.title.text = "Units";
                categoryAxis.title.rotation = 0;
                categoryAxis.title.align = "center";
                categoryAxis.title.valign = "top";
                // categoryAxis.title.dy = -40;
                categoryAxis.title.fontWeight = 600;

                // categoryAxis.renderer.labels._values.text = chart.data.altValue;

                let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
                valueAxis.renderer.minWidth = 50;
                valueAxis.min = 0;
                valueAxis.cursorTooltipEnabled = false;
                valueAxis.title.text = self.fact_name;
                // valueAxis.title.rotation = 0;
                // valueAxis.title.align = "center";
                // valueAxis.title.valign = "top";
                valueAxis.title.fontWeight = 600;

                // Create series
                let series = chart.series.push(new am4charts.ColumnSeries());
                series.sequencedInterpolation = false;
                series.dataFields.valueY = key_value.value;
                series.dataFields.categoryX = key_value.altValue;
                series.tooltipText = "[{categoryX}: bold]{valueY}[/]";
                series.columns.template.strokeWidth = 0;



                series.tooltip.pointerOrientation = "vertical";

                series.columns.template.column.cornerRadiusTopLeft = 10;
                series.columns.template.column.cornerRadiusTopRight = 10;
                series.columns.template.column.fillOpacity = 0.8;

                // on hover, make corner radiuses bigger
                let hoverState = series.columns.template.column.states.create("hover");
                hoverState.properties.cornerRadiusTopLeft = 0;
                hoverState.properties.cornerRadiusTopRight = 0;
                hoverState.properties.fillOpacity = 1;

                // series.columns.template.adapter.add("fill", function (fill, target) {
                //     return chart.colors.getIndex(target.dataItem.index);
                // })


                let paretoValueAxis = chart.yAxes.push(new am4charts.ValueAxis());
                paretoValueAxis.renderer.opposite = true;
                paretoValueAxis.min = 0;
                paretoValueAxis.max = 100;
                paretoValueAxis.strictMinMax = true;
                paretoValueAxis.renderer.grid.template.disabled = true;
                paretoValueAxis.numberFormatter = new am4core.NumberFormatter();
                paretoValueAxis.numberFormatter.numberFormat = "#'%'"
                paretoValueAxis.cursorTooltipEnabled = false;

                let paretoSeries = chart.series.push(new am4charts.LineSeries())
                paretoSeries.dataFields.valueY = "pareto";
                paretoSeries.dataFields.categoryX = key_value.altValue;
                paretoSeries.dataFields.categoryz = key_value.key;
                paretoSeries.yAxis = paretoValueAxis;
                paretoSeries.tooltipText = `{categoryX} / ${data.length} of the items = {valueY.formatNumber('#.0')}%[/] of ${self.fact_name}`;

                paretoSeries.bullets.push(new am4charts.CircleBullet());

                paretoSeries.strokeWidth = 2;
                paretoSeries.stroke = new am4core.InterfaceColorSet().getFor("alternativeBackground");
                paretoSeries.strokeOpacity = 0.5;

                // Cursor
                chart.cursor = new am4charts.XYCursor();
                chart.cursor.behavior = "panX";
                this.chart = chart

            }
        }
    }
</script>

<style scoped>
    #chartdiv {
        height: 84vh;
    }
</style>