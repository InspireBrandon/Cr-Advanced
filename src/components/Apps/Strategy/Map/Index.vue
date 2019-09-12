<template>
    <div id="thisone2" class="map"></div>
</template>

<script>
    import * as am4core from "@amcharts/amcharts4/core";
    import * as am4maps from "@amcharts/amcharts4/maps";
    import am4geodata_worldLow from "@amcharts/amcharts4-geodata/southAfricaHigh";

    export default {
        mounted() {
            this.drawMap()
        },
        methods: {
            drawMap() {

                let chart = am4core.create("thisone2", am4maps.MapChart);
                var title = chart.titles.create();
                title.text = "[bold font-size: 20]Store sales Heatmap[/]";
                title.textAlign = "middle";


                chart.geodata = am4geodata_worldLow;
                let polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

                polygonSeries.useGeodata = true;

                // Configure series
                let polygonTemplate = polygonSeries.mapPolygons.template;
                polygonTemplate.tooltipText = "{name}";
                polygonTemplate.fill = chart.colors.getIndex(0);
                polygonTemplate.strokeOpacity = 0.5;
                polygonTemplate.nonScalingStroke = true;

                // create capital markers
                let imageSeries = chart.series.push(new am4maps.MapImageSeries());
                // define template
                imageSeries.data = [{
                    "title": "Klerksdorp",
                    "latitude": -26.762155,
                    "longitude": 26.662590,
                    "sales": 2000000,
                }, {
                    "title": "Bloemfontein",
                    "latitude": -29.034231,
                    "longitude": 26.211422,
                    "sales": 1235,

                }, {
                    "title": "Potchefstroom",
                    "latitude": -26.668117,
                    "longitude": 27.081858,
                    "sales": 4000000,


                }]
                imageSeries.dataFields.value = "sales";



                let imageSeriesTemplate = imageSeries.mapImages.template;
                imageSeriesTemplate.propertyFields.latitude = "latitude";
                imageSeriesTemplate.propertyFields.longitude = "longitude";

                var circle = imageSeriesTemplate.createChild(am4core.Circle);
                circle.fillOpacity = 0.7;
                circle.propertyFields.fill = "color";
                // circle.tooltipText = "{title}: [bold]{value}[/]";

                let label = imageSeriesTemplate.createChild(am4core.Label);
                label.text = "{title}:\n[bold]Sales : {sales} [/]";
                label.fill = am4core.color("#fff");
                label.verticalCenter = "middle";
                label.horizontalCenter = "middle";
                label.nonScaling = true;

                imageSeries.heatRules.push({
                    "target": circle,
                    "property": "radius",
                    "min": 4,
                    "max": 30,
                    "dataField": "value"
                })
            }
        }
    }
</script>

<style scoped>
    .map {
        height: calc(100vh - 125px);
    }
</style>