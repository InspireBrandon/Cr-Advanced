<template>
    <v-dialog persistent width=800 v-model="dialog">
        <v-card>
            <v-toolbar dark flat color="primary">
                <v-toolbar-title>
                    Seasonality Report
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="close">
                    <v-icon>
                        close
                    </v-icon>
                </v-btn>
            </v-toolbar>
            <v-card-text>
                <div v-if="loading" style="text-align: center;">
                    <v-progress-circular indeterminate></v-progress-circular>
                </div>
                <div v-if="!loading" id="chartdiv"></div>
                <div v-if="!loading">
                    <v-divider class="my-2"></v-divider>
                    <div style="display: flex;">
                        <div>
                            <v-icon :color="colors.green">fiber_manual_record</v-icon>
                        </div>
                        <div style="margin-top: 2px;">Average High - {{ averageHigh }}</div>
                    </div>
                    <div style="display: flex;">
                        <div>
                            <v-icon :color="colors.blue">fiber_manual_record</v-icon>
                        </div>
                        <div style="margin-top: 2px;">Average - {{ average }}</div>
                    </div>
                    <div style="display: flex;">
                        <div>
                            <v-icon :color="colors.red">fiber_manual_record</v-icon>
                        </div>
                        <div style="margin-top: 2px;">Average Low - {{ averageLow }}</div>
                    </div>
                    <div style="display: flex;">
                        <div>
                            <v-icon :color="colors.grey">fiber_manual_record</v-icon>
                        </div>
                        <div style="margin-top: 2px;">Range File - {{ rangeVolume }} - ({{ overAverageText(currentOverSeasonalAverage) }})</div>
                    </div>
                </div>
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

    import Axios from 'axios';

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
                loading: false,
                colors: {
                    green: "#03fc24",
                    yellow: "#fcba03",
                    red: "#fc0303",
                    blue: "#03b5fc",
                    grey: "#424242"
                },
                averageHigh: 0,
                average: 0,
                averageLow: 0,
                rangeVolume: 0,
                currentOverSeasonalAverage: 0
            }
        },
        mounted() {},
        methods: {
            getReportData(queryData, callback) {
                let self = this;

                Axios.get(process.env.VUE_APP_API +
                        `SeasonalityReport?planogramID=${queryData.planogramID}&periodFromID=${queryData.periodFromID}&periodToID=${queryData.periodToID}`
                        )
                    .then(r => {
                        callback(r.data)
                    })
                    .catch(e => {

                    })
            },
            close() {
                let chart = document.getElementById('chartdiv');

                chart = null;

                if (this.chart) {
                    this.chart.dispose();
                    this.chart = null;
                }

                this.dialog = false
            },
            show(queryData) {
                let self = this;

                self.loading = true;
                self.dialog = true

                self.getReportData(queryData, data => {
                    queryData.periodFromID = queryData.periodFromID + 6;
                    self.getReportData(queryData, currentRangeData => {
                        self.loading = false;
                        let rangeVolume = 0;

                        console.log(currentRangeData);
                        
                        currentRangeData.forEach(el => {
                            rangeVolume += el.volume;
                        })

                        rangeVolume = rangeVolume / currentRangeData.length;

                        self.rangeVolume = rangeVolume.toFixed(0);

                        self.$nextTick(() => {
                            self.drawChart(data, self.rangeVolume);
                        })
                    });
                })
            },
            drawChart(data, rangeVolume) {
                let self = this;
                let chart = am4core.create("chartdiv", am4charts.XYChart);

                let avgVolume = 0;
                let avgHighVolume = 0;
                let avgLowVolume = 0;

                // Get sum of all volume
                data.forEach(element => {
                    avgVolume += element.volume;
                });

                // Get average volume
                avgVolume = avgVolume / data.length;

                let highs = [];
                let lows = [];

                // Get percent away from average and get high and low volumes
                data.forEach(element => {
                    element['percentOf'] = (((element.volume - avgVolume) / avgVolume) * 100).toFixed(1);

                    if (element.volume > avgVolume) {
                        highs.push(element.volume);
                    }

                    if (element.volume <= avgVolume) {
                        lows.push(element.volume);
                    }
                });

                // sum average high volume
                highs.forEach(volume => {
                    avgHighVolume += volume;
                })

                // sum average low volume
                lows.forEach(volume => {
                    avgLowVolume += volume;
                })

                // get average
                avgHighVolume = avgHighVolume / highs.length;
                avgLowVolume = avgLowVolume / lows.length;

                // Set averages for display
                self.average = avgVolume.toFixed(0);
                self.averageHigh = avgHighVolume.toFixed();
                self.averageLow = avgLowVolume.toFixed(0);

                self.currentOverSeasonalAverage = (((rangeVolume - self.average) / self.average) * 100).toFixed(0);

                // Add data
                chart.data = data;

                // Create axes
                var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
                dateAxis.renderer.grid.template.location = 0.5;
                dateAxis.renderer.labels.template.location = 0.5;
                dateAxis.dataFields.category = "date";

                var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
                valueAxis.title.text = "Volume";

                // Create series
                var series = chart.series.push(new am4charts.ColumnSeries());
                series.dataFields.valueY = "volume";
                series.dataFields.dateX = "date";
                // series.fill = am4core.color("blue")
                series.name = "Volume";

                // series.adapter.add("fill", function(fill, target) {
                //     if (target.dataFields && (target.dataFields.valueY < 5000)) {
                //         return am4core.color("#a55");
                //     }
                //     else {
                //         return am4core.color("#a55");
                //     }
                // })

                var valueLabel = series.bullets.push(new am4charts.LabelBullet());
                valueLabel.label.text = "{percentOf}%";
                valueLabel.label.fontSize = 12;
                valueLabel.label.verticalCenter = "bottom";

                // Create avg trendline
                createTrendLine(chart, self.colors.blue, [{
                        "date": data[0].date,
                        "volume": avgVolume.toFixed(0)
                    },
                    {
                        "date": data[data.length - 1].date,
                        "volume": avgVolume.toFixed(0)
                    }
                ]);

                // Create high avg trendline
                createTrendLine(chart, self.colors.green, [{
                        "date": data[0].date,
                        "volume": avgHighVolume.toFixed(0)
                    },
                    {
                        "date": data[data.length - 1].date,
                        "volume": avgHighVolume.toFixed(0)
                    }
                ]);

                // Create low avg trendline
                createTrendLine(chart, self.colors.red, [{
                        "date": data[0].date,
                        "volume": avgLowVolume.toFixed(0)
                    },
                    {
                        "date": data[data.length - 1].date,
                        "volume": avgLowVolume.toFixed(0)
                    }
                ]);

                // Create range avg trendline
                createTrendLine(chart, self.colors.grey, [{
                        "date": data[0].date,
                        "volume": rangeVolume
                    },
                    {
                        "date": data[data.length - 1].date,
                        "volume": rangeVolume
                    }
                ]);

                this.chart = chart
            },
            overAverageText(value) {
                if(value == 0) {
                    return "equals average"
                }
                if(value > 0) {
                    return `${value}% over average`;
                } else {
                    return `${(value * -1)}% below average`;
                }
            }
        }

    }

    function createTrendLine(chart, color, data) {
        var trend = chart.series.push(new am4charts.LineSeries());
        trend.dataFields.valueY = "volume";
        trend.dataFields.dateX = "date";
        trend.strokeWidth = 2
        trend.stroke = trend.fill = am4core.color(color);
        trend.data = data;

        var bullet = trend.bullets.push(new am4charts.CircleBullet());
        bullet.tooltipText = "{date}\n[bold font-size: 17px]value: {valueY}[/]";
        bullet.strokeWidth = 2;
        bullet.stroke = am4core.color("#fff")
        bullet.circle.fill = trend.stroke;

        var hoverState = bullet.states.create("hover");
        hoverState.properties.scale = 1.7;

        return trend;
    };
</script>

<style scoped>
    #chartdiv {
        height: 300px;
    }
</style>