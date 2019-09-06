<template>
    <div id="map" class="map"></div>
</template>

<script>
    import * as am4core from "@amcharts/amcharts4/core";
    import * as am4maps from "@amcharts/amcharts4/maps";
    import am4themes_animated from "@amcharts/amcharts4/themes/animated";

    export default {
        mounted() {},
        methods: {
            drawMap() {
                am4core.ready(function () {

                    // Themes begin
                    am4core.useTheme(am4themes_animated);
                    // Themes end

                    var availableCountries = ["ZA"];

                    var selectedPolygon;
                    var userCountryId = "ZA";
                    var mapChart;
                    var continentsSeries;
                    var countriesSeries;
                    var mainContainer;
                    var flagContainer;
                    var colorSet = new am4core.ColorSet();
                    var heartAnimation;
                    var flag;
                    var countryName;

                    function init() {
                        mainContainer = am4core.create("map", am4core.Container);
                        mainContainer.background.fillOpacity = 1;
                        mainContainer.background.fill = am4core.color("#313950");
                        mainContainer.width = am4core.percent(100);
                        mainContainer.height = am4core.percent(100);
                        mainContainer.preloader.disabled = true;

                        var triangle = new am4core.Triangle();
                        triangle.width = 8;
                        triangle.height = 10;
                        triangle.fill = am4core.color("#ffffff");
                        triangle.direction = "right";
                        triangle.valign = "middle";
                        triangle.align = "center";
                        triangle.dx = 1;

                        flagContainer = mainContainer.createChild(am4core.Container);
                        flagContainer.horizontalCenter = "middle";
                        flagContainer.hiddenState.properties.dy = -180;
                        flagContainer.x = am4core.percent(50);
                        flagContainer.y = 30;
                        flagContainer.layout = "horizontal";

                        flag = flagContainer.createChild(am4core.Image);
                        flag.width = 50;
                        flag.height = 50;

                        countryName = flagContainer.createChild(am4core.Label);
                        countryName.marginLeft = 15;
                        countryName.fontSize = 25;
                        countryName.x = 100;
                        countryName.valign = "middle";
                        countryName.fill = am4core.color("#ffffff");

                        createMap();
                    }

                    function createMap() {
                        // MAP CHART
                        mapChart = mainContainer.createChild(am4maps.MapChart);
                        mapChart.zIndex = -1;
                        mapChart.maxZoomLevel = 3000;
                        mapChart.projection = new am4maps.projections.Mercator();
                        mapChart.seriesContainer.events.disableType("doublehit");
                        mapChart.chartContainer.background.events.disableType("doublehit");

                        mapChart.deltaLongitude = -11;
                        mapChart.seriesContainer.draggable = false;
                        mapChart.geodataSource.url =
                            "//www.amcharts.com/lib/4/geodata/json/continentsHigh.json";
                        mapChart.seriesContainer.resizable = false;
                        mapChart.mouseWheelBehavior = "none";

                        continentsSeries = mapChart.series.push(new am4maps.MapPolygonSeries());
                        continentsSeries.useGeodata = true;
                        continentsSeries.exclude = ["antarctica"];
                        continentsSeries.mapPolygons.template.fill = am4core.color("#283047");
                        continentsSeries.mapPolygons.template.strokeOpacity = 0;
                        continentsSeries.toBack();

                        countriesSeries = mapChart.series.push(new am4maps.MapPolygonSeries());
                        countriesSeries.useGeodata = true;
                        // countriesSeries.geodata = am4geodata_worldIndiaHigh;
                        countriesSeries.exclude = ["AQ"];
                        countriesSeries.mapPolygons.template.visible = false;
                        countriesSeries.mapPolygons.template.hiddenState.properties.opacity = 0;

                        countriesSeries.geodataSource.url =
                            "//www.amcharts.com/wp-content/uploads/assets/maps/worldCustomHigh.json";
                        countriesSeries.mapPolygons.template.fill = am4core.color("#0975da");
                        countriesSeries.mapPolygons.template.strokeOpacity = 0;

                        countriesSeries.geodataSource.events.on("ended", function () {
                            setTimeout(function () {
                                handleNext(userCountryId);
                            }, 500)
                        });
                    }

                    function handleNext(countryId) {

                        flagContainer.hide(1000);

                        if (availableCountries.indexOf(countryId) == -1) {
                            userCountryId = availableCountries[Math.floor(Math.random() * availableCountries
                                .length)];
                        }

                        zoomToSelectedPolygon();
                    }

                    function zoomToSelectedPolygon() {

                        if (selectedPolygon) {
                            selectedPolygon.hide();
                        }

                        selectedPolygon = countriesSeries.getPolygonById(userCountryId);
                        selectedPolygon.hide(0);
                        selectedPolygon.opacity = 0;
                        selectedPolygon.defaultState.properties.opacity = 1;
                        selectedPolygon.toFront();

                        var showAnimation = selectedPolygon.show(500);

                        showAnimation.events.on("animationended", function () {

                            flag.href = "//www.amcharts.com/wp-content/uploads/assets/flags/" +
                                userCountryId.toLowerCase() + ".svg";
                            countryName.text = selectedPolygon.dataItem.dataContext.name;

                            setTimeout(function () {
                                flagContainer.show();
                            }, 1000)

                            selectedPolygon.polygon.validate();
                            var w = selectedPolygon.polygon.bbox.width;
                            var h = selectedPolygon.polygon.bbox.height;

                            var x = selectedPolygon.polygon.bbox.x + w / 2;
                            var y = selectedPolygon.polygon.bbox.y + h / 2;

                            w = Math.max(w, h);

                            var path = am4core.path.moveTo({
                                x: x,
                                y: y + w / 3
                            });
                            path += am4core.path.cubicCurveTo({
                                x: x,
                                y: y - w / 4
                            }, {
                                x: x - w / 2 - w / 4,
                                y: y - w / 3
                            }, {
                                x: x - w / 8,
                                y: y - w / 2
                            });
                            path += am4core.path.cubicCurveTo({
                                x: x,
                                y: y + w / 3
                            }, {
                                x: x + w / 8,
                                y: y - w / 2
                            }, {
                                x: x + w / 2 + w / 4,
                                y: y - w / 3
                            });

                            var points = am4core.path.pathToPoints(path, 2000);

                            var middleLatitude = mapChart.zoomGeoPoint.latitude + (selectedPolygon
                                .latitude - mapChart.zoomGeoPoint.latitude) / 2;
                            var middleLongitude = mapChart.zoomGeoPoint.longitude + (selectedPolygon
                                .longitude - mapChart.zoomGeoPoint.longitude) / 2;

                            mapChart.zoomEasing = am4core.ease.sinOut;
                            
                            var zoomOutAnimation = mapChart.zoomToGeoPoint({
                                latitude: middleLatitude,
                                longitude: middleLongitude
                            }, 2, true);

                            zoomOutAnimation.events.on("animationended", function () {
                                mapChart.zoomEasing = am4core.ease.cubicInOut;
                                mapChart.zoomToMapObject(selectedPolygon, 1000 / Math.max(w / 1, h / 20000) *
                                    1, true, 1500);
                                selectedPolygon.polygon.points;
                                selectedPolygon.polygon.morpher.morphToSingle = true;
                                var animation;
                                if (points) {
                                    animation = selectedPolygon.polygon.morpher.morphToPolygon([
                                        [points]
                                    ]);
                                } else {
                                    animation = selectedPolygon.polygon.morpher.morphToCircle();
                                }


                                animation.stop();
                            })
                        })
                    }

                    init();
                });
            }
        }
    }
</script>

<style scoped>
    .map {
        height: calc(100vh - 112px);
    }
</style>