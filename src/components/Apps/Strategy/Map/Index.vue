<template>
    <div id="thisone2" class="map"></div>
</template>

<script>
    import * as am4core from "@amcharts/amcharts4/core";
    import * as am4maps from "@amcharts/amcharts4/maps";
    import am4geodata_worldLow from "@amcharts/amcharts4-geodata/southAfricaHigh";

    export default {
        props:["rowData"],   
        mounted() {
            this.drawMap()
        },
        methods: {
            drawMap() {
                let self = this
                console.log(self.rowData);
                
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
                imageSeries.data = self.rowData
                imageSeries.dataFields.value = "totalSales";



                let imageSeriesTemplate = imageSeries.mapImages.template;
                imageSeriesTemplate.propertyFields.latitude = "lat";
                imageSeriesTemplate.propertyFields.longitude = "long";

                var circle = imageSeriesTemplate.createChild(am4core.Circle);
                circle.fillOpacity = 0.7;
                circle.propertyFields.fill = am4core.color("#fff");
                // circle.fill=am4core.color("#fff");
                // circle.tooltipText = "{title}: [bold]{value}[/]";

                let label = imageSeriesTemplate.createChild(am4core.Label);
                label.text = "{storeName}:\n[bold]Sales : {totalSales} [/]";
                label.fill = am4core.color("#fff");
                label.verticalCenter = "middle";
                label.horizontalCenter = "middle";
                label.nonScaling = true;

                imageSeries.heatRules.push({
                    "target": circle,
                    "property": "radius",
                    "min": 4,
                    "max": 10,
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