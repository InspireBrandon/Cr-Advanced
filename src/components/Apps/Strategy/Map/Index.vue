<template>
    <div oncontextmenu="return false;">
        <div id="thisone2" class="map">
        </div>
        <YesNoModal ref="yesNo"></YesNoModal>
        <Mapsetup ref="Mapsetup" />
    </div>
</template>

<script>
    import * as am4core from "@amcharts/amcharts4/core";
    import * as am4charts from "@amcharts/amcharts4/charts";
    import * as am4maps from "@amcharts/amcharts4/maps";
    import YesNoModal from '@/components/Common/YesNoModal'
    import Mapsetup from "./setup.vue"
    import am4geodata_worldLow from "@amcharts/amcharts4-geodata/southAfricaHigh";

    // http://www.climbing.co.za/wp-content/uploads/2012/10/rsamap.png

    export default {
        components: {
            YesNoModal,
            Mapsetup
        },
        props: ["rowData", "setupData"],
        data() {
            return {
                labels: true,
                lines: true,
                radius: 20,
            }
        },
        mounted() {
            // this.openSetup()
            this.drawMap(this.labels, 0)
        },
        methods: {
            openSetup() {
                let self = this
                self.$refs.Mapsetup.open(self.setupData, callback => {

                })
            },
            drawMap(labelState) {
                let self = this
                console.log(self.rowData);
                // todo sort rowdata by sales for heatmap legend
                let formattedData = [];
                let chart = am4core.create("thisone2", am4maps.MapChart);
                chart.name = "Map"
                chart.projection = new am4maps.projections.Miller();

                var title = chart.titles.create();
                title.text = "[bold font-size: 20]Store Sales Heatmap[/]";
                title.textAlign = "middle";
                self.rowData.forEach((element, idx) => {
                    element["color"] = '#424242'
                    formattedData.push(element);
                });
                /////////////////////////////////////////////////
                //potential Code for image fill
                ////////////////////////////


                /////////////////////////////////////////////////
                let asd = am4geodata_worldLow
                chart.geodata = asd;
                if (chart.geodata.features[9].geometry.coordinates.length == 3) {
                    chart.geodata.features[9].geometry.coordinates.splice(2, 1)
                    chart.geodata.features[9].geometry.coordinates.splice(0, 1)
                }


                chart.projection = new am4maps.projections.Mercator();
                let polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

                polygonSeries.strokeOpacity = 0.1;
                polygonSeries.useGeodata = true;
                // polygonSeries.exclude = ["ZA-WC"];


                // Configure series
                let polygonTemplate = polygonSeries.mapPolygons.template;

                polygonTemplate.tooltipText = "{name}";
                // polygonTemplate.tooltip.getFillFromObject = false;
                // polygonTemplate.tooltip.background.fill = am4core.color("#CEB1BE");

                var pattern_europe = new am4core.Pattern();
                var image = new am4core.Image();
                image.href = "sa hm.png"
                //  "Picture1.png"
                // "https://i.dlpng.com/static/png/4679756_thumb.png"
                // "http://www.climbing.co.za/w/images/2/2f/Rsamap.png";
                // // image.href = "https://pbs.twimg.com/profile_images/1847786693/John_Dorfling_400x400.jpg";

                console.log("polygonTemplate");
                console.log(polygonTemplate);
                polygonTemplate.tooltipColorSource=chart.colors.getIndex(1)

                image.width = 841.05;
                image.height = 750;
                pattern_europe.x = -300
                pattern_europe.y = -5
                pattern_europe.width = image.width;
                pattern_europe.height = image.height;
                pattern_europe.addElement(image.element);
                pattern_europe.fill= chart.colors.getIndex(3);
                // polygonTemplate.fill = chart.colors.getIndex(3);

                polygonTemplate.fill = pattern_europe
                polygonTemplate.strokeOpacity = 0.5;
                polygonTemplate.nonScalingStroke = true;

                // create capital markers
                let imageSeries = chart.series.push(new am4maps.MapImageSeries());
                // define template
                imageSeries.name = "Heatmap"
                imageSeries.data = formattedData
                imageSeries.dataFields.value = "sales";

                // if (type == 0) {
                let imageSeriesTemplate = imageSeries.mapImages.template;
                imageSeriesTemplate.propertyFields.latitude = "lat";
                imageSeriesTemplate.propertyFields.longitude = "long";
                imageSeriesTemplate.nonScaling = false

                chart.seriesContainer.events.on("hit", function (ev) {
                    if (ev.preventDefault != undefined)
                        ev.preventDefault();
                    if (ev.stopPropagation != undefined)
                        ev.stopPropagation();
                    self.$refs.yesNo.show('Would you like to make a tag here?', goThrough => {
                        if (goThrough) {
                            var mapMarker = imageSeriesTemplate.createChild(am4core.Sprite);
                            mapMarker.path =
                                "M4 12 A12 12 0 0 1 28 12 C28 20, 16 32, 16 32 C16 32, 4 20 4 12 M11 12 A5 5 0 0 0 21 12 A5 5 0 0 0 11 12 Z";
                            mapMarker.width = 32;
                            mapMarker.height = 32;
                            mapMarker.scale = 0.7;
                            mapMarker.fill = am4core.color("#3F4B3B");
                            mapMarker.fillOpacity = 0.8;
                            mapMarker.horizontalCenter = "middle";
                            mapMarker.verticalCenter = "bottom";
                            var coords = chart.svgPointToGeo(ev.svgPoint);
                            var marker = imageSeries.mapImages.create();
                            console.log(coords);

                            marker.latitude = coords.latitude;
                            marker.longitude = coords.longitude;
                            marker.events.on("rightclick", function (dataItem, ev) {
                                if (dataItem.hidden)
                                    marker.show(dataItem.index)
                                else
                                    marker.hide(dataItem.index);
                                event.stopPropagation();
                                // marker.latitude = dispose();
                                // marker.longitude = dispose();
                            })
                        }
                    })
                });

                var circle = imageSeriesTemplate.createChild(am4core.Circle);
                // todo make opacity in heat rules
                circle.fillOpacity = 0.7;
                // circle.propertyFields.fill = 'color';
                circle.tooltipText = "{storeName}: [bold]{sales}[/]";
                circle.radius = self.radius
                let label = imageSeriesTemplate.createChild(am4core.Label);
                label.text = "{storeName}";
                label.fill = am4core.color("#fff");

                label.nonScaling = false;
                label.hidden = labelState



                // imageSeries.heatRules.push({
                //     "target": circle,
                //     "property": "fill",
                //     // target: polygonSeries.mapPolygons.template,
                //     "min": chart.colors.getIndex(2).brighten(1),
                //     "max": chart.colors.getIndex(2).brighten(-0.3),
                //     // "target": circle,
                //     // "property": "radius",
                //     // // todo make circles radius configureable
                //     // "min": self.radius,
                //     // "max": self.radius,
                //     "dataField": "value"
                // })

                imageSeries.heatRules.push({
                    property: "fill",
                    target: circle,
                    min: chart.colors.getIndex(1).brighten(1),
                    max: chart.colors.getIndex(1).brighten(-1)
                });
                let heatLegend = chart.createChild(am4maps.HeatLegend);
                heatLegend.series = imageSeries;
                heatLegend.align = "right";
                heatLegend.width = am4core.percent(25);
                heatLegend.marginRight = am4core.percent(4);
                heatLegend.minValue = 0;
                heatLegend.maxValue = 40000000;
                heatLegend.valign = "bottom";

// ////////////////////////////////////////////////////////////

                // let pieSeries = chart.series.push(new am4maps.MapImageSeries());
                // let pieTemplate = pieSeries.mapImages.template;
                // pieTemplate.propertyFields.latitude = "lat";
                // pieTemplate.propertyFields.longitude = "long";
                // pieTemplate.nonScaling = true
                // let pieChartTemplate = pieTemplate.createChild(am4charts.PieChart);
                // pieChartTemplate.adapter.add("data", function (data, target) {
                //     if (target.dataItem) {
                //         return target.dataItem.dataContext.pieData;
                //     } else {
                //         return [];
                //     }
                // });
                // pieChartTemplate.propertyFields.width = "width";
                // pieChartTemplate.propertyFields.height = "height";
                // pieChartTemplate.horizontalCenter = "middle";
                // pieChartTemplate.verticalCenter = "middle";

                // let pieSeriesTemplate = pieChartTemplate.series.push(new am4charts.PieSeries);
                // pieSeriesTemplate.dataFields.category = "category";
                // pieSeriesTemplate.dataFields.value = "value";
                // pieSeriesTemplate.labels.template.disabled = true;
                // pieSeries.nonScalingStroke = false
                // pieSeries.name = "Pie Charts"

                if (self.lines) {
                    let graticuleSeries = chart.series.push(new am4maps.GraticuleSeries());
                    graticuleSeries.mapLines.template.line.strokeOpacity = 0.2;
                    graticuleSeries.longitudeStep = 2;
                    graticuleSeries.latitudeStep = 2
                    graticuleSeries.name = "lines"
                }
                // pieSeries.data = self.rowData

                let linkContainer = chart.createChild(am4core.Container);
                linkContainer.isMeasured = false;
                linkContainer.layout = "horizontal";
                linkContainer.x = am4core.percent(0);
                linkContainer.y = am4core.percent(0);

                let button = linkContainer.createChild(am4core.Button);
                button.label.text = "Toggle Labels";
                button.padding(5, 5, 5, 5);
                button.width = 100;
                button.align = "right";
                button.events.on("hit", function () {
                    self.labels = !self.labels
                    self.drawMap(self.labels)
                });

                let equirectangular = linkContainer.createChild(am4core.Button);
                equirectangular.label.text = "Toggle Line";
                equirectangular.padding(5, 5, 5, 5);
                equirectangular.width = 100;
                equirectangular.align = "left";
                equirectangular.marginLeft = 5;
                equirectangular.events.on("hit", function () {
                    // toggle draw lines
                    self.lines = !self.lines
                    self.drawMap(self.labels)
                })

                chart.legend = new am4maps.Legend();
                chart.legend.position = "right";
                chart.legend.align = "right";

            }
        }
    }
</script>

<style scoped>
    .map {
        height: calc(100vh - 225px);
        background-color: #cccccc;
    }
</style>