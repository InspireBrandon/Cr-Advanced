<template>
    <div id="thisone2" class="map"></div>
</template>

<script>
    import * as am4core from "@amcharts/amcharts4/core";
    import * as am4charts from "@amcharts/amcharts4/charts";
    import * as am4maps from "@amcharts/amcharts4/maps";
    import am4geodata_worldLow from "@amcharts/amcharts4-geodata/southAfricaHigh";



    export default {
        props: ["rowData"],
        data() {
            return {
                labels: true
            }
        },
        mounted() {
            this.drawMap(this.labels, 0)
        },
        methods: {
            drawMap(labelState, type) {
                let self = this

                let formattedData = [];

                let chart = am4core.create("thisone2", am4maps.MapChart);
                var title = chart.titles.create();
                title.text = "[bold font-size: 20]Store Sales Heatmap[/]";
                title.textAlign = "middle";
                self.rowData.forEach((element, idx) => {
                    element["color"] = '#424242'
                    formattedData.push(element);
                });

                chart.geodata = am4geodata_worldLow;
                chart.projection = new am4maps.projections.Mercator();
                let polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
                polygonSeries.useGeodata = true;
                polygonSeries.exclude = ["antarctica"];
                polygonSeries.exclude = ["AQ"];

                // Configure series
                let polygonTemplate = polygonSeries.mapPolygons.template;
                polygonTemplate.tooltipText = "{name}";
                polygonTemplate.fill = chart.colors.getIndex(0);
                polygonTemplate.strokeOpacity = 0.5;
                polygonTemplate.nonScalingStroke = true;


                // create capital markers
                let imageSeries = chart.series.push(new am4maps.MapImageSeries());
                // define template
                imageSeries.data = formattedData
                imageSeries.dataFields.value = "sales";
                if (type == 0) {
                    let imageSeriesTemplate = imageSeries.mapImages.template;
                    imageSeriesTemplate.propertyFields.latitude = "lat";
                    imageSeriesTemplate.propertyFields.longitude = "long";
                    imageSeriesTemplate.nonScaling = true

                    var circle = imageSeriesTemplate.createChild(am4core.Circle);
                    circle.fillOpacity = 0.7;
                    circle.propertyFields.fill = 'color';
                    // circle.fill=am4core.color("#fff");
                    circle.tooltipText = "{storeName}: [bold]{sales}[/]";




                    let label = imageSeriesTemplate.createChild(am4core.Label);
                    label.text = "{storeName}";
                    label.fill = am4core.color("#fff");

                    label.nonScaling = false;
                    label.hidden = labelState

                    imageSeries.heatRules.push({
                        "target": circle,
                        "property": "radius",
                        "min": 4,
                        "max": 30,
                        "dataField": "value"
                    })
                }
                if (type == 1) { // start pie chart series
                    let pieSeries = chart.series.push(new am4maps.MapImageSeries());
                    let pieTemplate = pieSeries.mapImages.template;
                    pieTemplate.propertyFields.latitude = "lat";
                    pieTemplate.propertyFields.longitude = "long";
                    pieTemplate.nonScaling = true
                    let pieChartTemplate = pieTemplate.createChild(am4charts.PieChart);
                    pieChartTemplate.adapter.add("data", function (data, target) {
                        if (target.dataItem) {
                            return target.dataItem.dataContext.pieData;
                        } else {
                            return [];
                        }
                    });
                    pieChartTemplate.propertyFields.width = "width";
                    pieChartTemplate.propertyFields.height = "height";
                    pieChartTemplate.horizontalCenter = "middle";
                    pieChartTemplate.verticalCenter = "middle";

                    // let pieTitle = pieChartTemplate.titles.create();
                    // pieTitle.text = "{storeName}";

                    let pieSeriesTemplate = pieChartTemplate.series.push(new am4charts.PieSeries);
                    pieSeriesTemplate.dataFields.category = "category";
                    pieSeriesTemplate.dataFields.value = "value";
                    pieSeriesTemplate.labels.template.disabled = true;
                    // pieSeriesTemplate.ticks.template.disabled = true;
                    pieSeries.nonScalingStroke = false


                    let graticuleSeries = chart.series.push(new am4maps.GraticuleSeries());
                    graticuleSeries.mapLines.template.line.strokeOpacity = 0.2;
                    graticuleSeries.longitudeStep = 2;
                    graticuleSeries.latitudeStep = 2


                    pieSeries.data = self.rowData
                }


                let button = chart.chartContainer.createChild(am4core.Button);
                button.label.text = "toggle labels";
                button.padding(5, 5, 5, 5);
                button.width = 100;
                button.align = "right";
                button.marginRight = 120;
                button.events.on("hit", function () {
                    self.labels = !self.labels
                    self.drawMap(self.labels)
                });

            }
        }
    }
</script>

<style scoped>
    .map {
        height: calc(100vh - 225px);
    }
</style>