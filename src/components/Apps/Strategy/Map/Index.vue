<template>
    <div width="100%">
        <div oncontextmenu="return false;" class="mapContainer">
            <div id="thisone2" class="map" ref="thisone2">
            </div>
            <div class="sideBar">
                <v-card height="75%">
                    <v-toolbar dark flat dense color="primary">
                        <v-toolbar-title> Image </v-toolbar-title>
                        <v-spacer> </v-spacer>
                        <v-btn @click="showSelector">maps</v-btn>
                        <!-- <v-autocomplete :items="maps" v-model="selectedmap" @change="onMapChange"> </v-autocomplete> -->
                    </v-toolbar>
                    <v-img :src="legendImgURL == '' ? tmpImageURL : legendImgURL" aspect-ratio="1"
                        class="grey lighten-2" width="100%" height="100%"></v-img>
                </v-card>

                <v-card>
                    <v-toolbar dark flat dense color="primary">
                        <v-toolbar-title> Store Import Co-Ords </v-toolbar-title>

                    </v-toolbar>
                    <v-list dense>
                        <v-list-tile>
                            <v-list-tile-avatar>
                                <v-btn icon @click="plotStore('item')">
                                    <v-icon> room </v-icon>
                                </v-btn>
                            </v-list-tile-avatar>
                            <v-list-tile-title>
                                longmans shops
                            </v-list-tile-title>
                            <v-list-tile-action>long:28.36 Lat:27.36</v-list-tile-action>
                        </v-list-tile>

                    </v-list>
                </v-card>
            </div>
        </div>
        <input type="file" style="display: none;" ref="fileInput" @change="onImageChange">
        <YesNoModal ref="yesNo"></YesNoModal>
        <Mapsetup ref="Mapsetup" />
        <MapImageSelector ref="MapImageSelector" />
    </div>
</template>

<script>
    import * as am4core from "@amcharts/amcharts4/core";
    import * as am4charts from "@amcharts/amcharts4/charts";
    import * as am4maps from "@amcharts/amcharts4/maps";
    import YesNoModal from '@/components/Common/YesNoModal'
    import Mapsetup from "./setup.vue"
    import am4geodata_worldLow from "@amcharts/amcharts4-geodata/southAfricaHigh";
    import Axios from 'axios'

    import MapImageSelector from './MapImageSelector'

    // http://www.climbing.co.za/wp-content/uploads/2012/10/rsamap.png
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    })
    export default {
        components: {
            YesNoModal,
            Mapsetup,
            MapImageSelector
        },
        props: ["rowData", "setupData"],
        data() {
            return {
                labels: true,
                lines: true,
                radius: 20,
                stores: [],
                config: null,
                tmpImageURL: 'https://www.okcballet.org/wp-content/uploads/2016/09/placeholder-image.png',
                imgURL: '',
                imageLinkAddress: '',
                fileData: null,
                heatData: null,
                pieData: null,
                canPlot: false,
                currentPlotStore: null,
                maxHeatLegend: 4000000,
                maps: [],
                selectedmap: null,
                MapImgURL: '',
                legendImgURL: '',
                plottableStores: []
            }
        },
        mounted() {
            // this.openSetup()
            // this.drawMap(this.labels)
            this.getmaps()
            this.getHinterlandStores()
        },
        methods: {
            showSelector() {
                let self = this;

                self.$refs.MapImageSelector.show(callback => {
                    self.selectedmap = callback.id
                    self.onMapChange()
                })
            },
            onMapChange() {
                let self = this
                self.$nextTick(() => {
                    console.log(self.selectedmap);

                    self.MapImgURL = process.env.VUE_APP_API +
                        `MapImage?mapImageID=${self.selectedmap}&type=map`;
                    self.legendImgURL = process.env.VUE_APP_API +
                        `MapImage?mapImageID=${self.selectedmap}&type=legend`;
                    if (self.config == null) {
                        self.drawMap(this.labels, {
                            useHeatmap: false,
                            usePiecharts: false,
                            imageDetails: {
                                imageType: "none",
                                imgURL: self.MapImgURL,
                                imageLinkAddress: null
                            }
                        }, null, null)
                    } else {
                        self.drawMap(self.labels, self.config, self.heatData, self.pieData)
                    }
                })
            },
            getmaps() {
                let self = this
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + `MapImage`).then(r => {
                    console.log(r);
                    self.maps = []
                    self.maps.push({
                        text: "None",
                        value: null
                    })
                    r.data.forEach(e => {
                        self.maps.push({
                            text: e.name,
                            value: e.id
                        })
                    })
                    console.log(self.maps);

                })
            },
            plotStore(item) {
                let self = this
                self.canplot = true
                self.currentPlotStore = item
            },
            openFileDialog() {
                let self = this;
                self.$refs.fileInput.value = null
                self.$refs.fileInput.click();
            },
            onImageChange(e) {
                let self = this;
                const files = e.target.files;
                let file = files[0];
                self.blobToDataUrl(file, url => {
                    self.imgURL = url;
                })
            },
            blobToDataUrl(blob, callback) {
                var a = new FileReader();
                a.onload = function () {
                    callback(a.result);
                }
                a.readAsDataURL(blob);
            },
            getHinterlandStores() {
                let self = this;

                let stores = require('@/assets/storeData/Hinterland.json');
                self.prepareStoreResults(stores.Response);
            },
            prepareStoreResults(storeData) {
                let self = this;

                let stores = storeData.filter(e => {
                    return e.siteType == "SHOP";
                })

                self.stores = stores;


                self.getData(stores);
            },
            getData(stores) {
                let self = this;
                Axios.get(process.env.VUE_APP_API +
                        `SystemFile/JSON?db=CR-Devinspire&folder=CLUSTER REPORT&file=REPORT`)
                    .then(fd => {
                        Axios.get(process.env.VUE_APP_API + `SystemFile/JSON?db=CR-Devinspire&id=${fd.data.id}`)
                            .then(r => {

                                self.fileData = r.data
                                self.drawMap(this.labels, {
                                    useHeatmap: false,
                                    usePiecharts: false,
                                    imageDetails: {
                                        imageType: "none",
                                        imgURL: null,
                                        imageLinkAddress: null
                                    }
                                }, null, null)
                            })
                    })
            },
            openSetup() {
                let self = this
                self.$refs.Mapsetup.open(self.setupData, callback => {
                    let tmp = {
                        heatmap: [],
                        piechart: [],
                    }


                    if (callback.useHeatmap) {
                        callback.selectedHeatmapField.forEach(field => {
                            tmp.heatmap.push(self.fileData.basket[field])
                        })
                        tmp.heatmap.forEach(field => {
                            field.graphArr = self.handelData(field, false)
                        })
                    }
                    let pieArr = []
                    if (callback.usePiecharts) {
                        callback.selectedPiechartItems.forEach(field => {
                            tmp.piechart.push(self.fileData.basket[field])
                        })
                        pieArr = self.handelPiechartData(tmp.piechart, true)
                    }
                    self.config = callback
                    self.heatData = tmp
                    self.pieData = pieArr

                    self.drawMap(this.labels, callback, tmp, pieArr)
                })
            },
            handelData(data, usePiechart) {
                let self = this
                console.log(data);
                let final = [];
                self.stores.forEach(element => {
                    let storeFound = false;
                    let tmpBasket = {
                        storeName: element.PlaceGroup.toUpperCase()
                    };
                    for (var store in data.data) {
                        data.data.forEach(el => {
                            if (el.displayname == element.PlaceGroup.toUpperCase()) {
                                storeFound = true;
                                tmpBasket["sales"] = formatter.format(el.sales)
                                    .replace("$",
                                        "R");
                                tmpBasket["width"] = 20
                                tmpBasket["height"] = 20
                                tmpBasket["salesPercent"] = el.salesPercent
                            }
                        })
                    }
                    let longLat = element.OfficeGPS.split(",");
                    let long = parseFloat(longLat[1]);
                    let lat = parseFloat(longLat[0]);
                    tmpBasket["long"] = long;
                    tmpBasket["lat"] = lat;
                    final.push(tmpBasket);
                })
                final = removeDuplicates(final, 'storeName')
                final.sort((a, b) => (a.sales < b.sales) ? 1 : -1)
                self.maxHeatLegend = parseInt(final[0].sales)
                return final
            },
            handelPiechartData(data, usePiechart) {
                let self = this
                console.log(data);
                let final = [];
                self.stores.forEach(element => {
                    let storeFound = false;
                    let tmpBasket = {
                        storeName: element.PlaceGroup.toUpperCase()
                    };
                    let longLat = element.OfficeGPS.split(",");
                    let long = parseFloat(longLat[1]);
                    let lat = parseFloat(longLat[0]);
                    tmpBasket["long"] = long;
                    tmpBasket["lat"] = lat;
                    tmpBasket["pieData"] = []
                    tmpBasket["width"] = 100
                    tmpBasket["height"] = 100
                    final.push(tmpBasket);
                })
                final = removeDuplicates(final, 'storeName')
                data.forEach((el, idx) => {
                    console.log(el);
                    final.forEach(finalStore => {
                        el.data.forEach(store => {
                            if (finalStore.storeName == store.displayname) {
                                finalStore.pieData.push({
                                    "category": el.config.selectedBasket.basket,
                                    "value": store.sales
                                })
                            }
                        })
                    })
                })

                return final
            },
            drawMap(labelState, config, setupdata, piechartArray) {
                let self = this

                let screeWidth = returnInnerWidth()

                // todo sort rowdata by sales for heatmap legend
                let formattedData = [];
                let chart = am4core.create("thisone2", am4maps.MapChart);
                chart.name = "Map"
                chart.projection = new am4maps.projections.Miller();
                // chart.width=800

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

                polygonSeries.strokeOpacity = 0.9;
                // polygonSeries.width=600
                polygonSeries.useGeodata = true;
                // polygonSeries.exclude = ["ZA-WC"];


                // Configure series

                let polygonTemplate = polygonSeries.mapPolygons.template;


                var pattern_europe = new am4core.Pattern();
                var image = new am4core.Image();

                ;
                polygonTemplate.tooltipColorSource = "rgb(103,148,220)"
                var height = this.$refs.thisone2.clientHeight

                image.width = screeWidth.width;
                image.height = height + 80;

                pattern_europe.x = screeWidth.width / screeWidth.offsetX
                pattern_europe.y = -39
                // pattern_europe.x = screeWidth/2.2
                // pattern_europe.y = -45
                pattern_europe.width = image.width;
                pattern_europe.height = image.height;
                if (self.selectedmap != null) {
                    polygonTemplate.tooltipHTML =
                        '<a style="background-color: #cccccc;" href="https://en.wikipedia.org/wiki/{category.urlEncode()}">{name}</a>'
                    image.href = self.MapImgURL
                    pattern_europe.addElement(image.element);
                    polygonTemplate.fill = pattern_europe
                    polygonTemplate.strokeOpacity = 0;
                } else {
                    polygonTemplate.fill = chart.colors.getIndex(1);
                    polygonTemplate.strokeOpacity = 1;
                    polygonTemplate.tooltipText = "{name}";

                }
                polygonTemplate.nonScalingStroke = true;
                if (config.useHeatmap) {
                    self.radius = parseInt(config.heatMapRadius)
                    setupdata.heatmap.forEach((heatmapItem, idx) => {
                        let imageSeries = chart.series.push(new am4maps.MapImageSeries());
                        // define template
                        imageSeries.name = heatmapItem.config.selectedBasket.basket
                        imageSeries.data = heatmapItem.graphArr
                        imageSeries.dataFields.value = "sales";

                        // if (type == 0) {
                        let imageSeriesTemplate = imageSeries.mapImages.template;
                        imageSeriesTemplate.propertyFields.latitude = "lat";
                        imageSeriesTemplate.propertyFields.longitude = "long";
                        imageSeriesTemplate.nonScaling = false
                        imageSeriesTemplate.fill = chart.colors.getIndex(1)


                        var circle = imageSeriesTemplate.createChild(am4core.Circle);
                        circle.fillOpacity = 0.5;
                        circle.tooltipText = heatmapItem + "{storeName}: [bold]{sales}[/]";
                        circle.radius = self.radius + idx
                        let label = imageSeriesTemplate.createChild(am4core.Label);
                        label.text = "{storeName}";
                        label.fill = am4core.color("#fff");
                        label.fontSize = 5
                        label.nonScaling = false;
                        label.hidden = labelState
                        console.log("label");
                        console.log(label);

                        imageSeries.heatRules.push({
                            property: "fill",
                            target: circle,
                            min: chart.colors.getIndex(11).brighten(1),
                            max: chart.colors.getIndex(11).brighten(-1)
                        });
                        console.log("chart.colors");
                        console.log(chart.colors.getIndex(11).brighten(1));
                        // + (idx + 1)
                        let heatLegend = chart.createChild(am4maps.HeatLegend);
                        heatLegend.series = imageSeries;
                        heatLegend.align = "right";
                        heatLegend.width = am4core.percent(25);
                        heatLegend.marginRight = am4core.percent(4);
                        heatLegend.minValue = 0;


                        heatLegend.maxValue = self.maxHeatLegend;
                        heatLegend.valign = "bottom";
                    })
                }
                chart.seriesContainer.events.on("hit", function (ev) {
                    if (!self.canPlot) {
                        return
                    }
                    if (ev.preventDefault != undefined)
                        ev.preventDefault();
                    if (ev.stopPropagation != undefined)
                        ev.stopPropagation();
                    self.$refs.yesNo.show('Would you like to make a tag here?', goThrough => {
                        if (goThrough) {
                            var mapMarker = imageSeriesTemplate.createChild(am4core
                                .Sprite);
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
                            // //////////////////////
                            // todo set Store plot data
                            // self.currentPlotStore= click event data
                            // //////////////////////
                            marker.latitude = coords.latitude;
                            marker.longitude = coords.longitude;
                            marker.events.on("rightclick", function (dataItem, ev) {
                                if (dataItem.hidden)
                                    marker.show(dataItem.index)
                                else
                                    marker.hide(dataItem.index);
                                event.stopPropagation();
                            })
                        }
                    })
                });
                if (config.usePiecharts) {
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

                    let pieSeriesTemplate = pieChartTemplate.series.push(new am4charts.PieSeries);
                    pieSeriesTemplate.dataFields.category = "category";
                    pieSeriesTemplate.dataFields.value = "value";
                    pieSeriesTemplate.slices.template.stroke = am4core.color("#fff");
                    pieSeriesTemplate.slices.template.strokeWidth = 1;
                    pieSeriesTemplate.slices.template.strokeOpacity = 1;
                    pieSeriesTemplate.labels.template.disabled = true;

                    pieSeries.nonScalingStroke = true
                    pieSeries.name = "Pie Charts"
                    pieSeries.data = piechartArray
                }
                if (self.lines) {
                    let graticuleSeries = chart.series.push(new am4maps.GraticuleSeries());
                    graticuleSeries.mapLines.template.line.strokeOpacity = 0.2;
                    graticuleSeries.longitudeStep = 2;
                    graticuleSeries.latitudeStep = 2
                    graticuleSeries.name = "lines"
                }
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
                    self.drawMap(self.labels, self.config, self.heatData, self.pieData)
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
                    self.drawMap(self.labels, self.config, self.heatData, self.pieData)
                })

                chart.legend = new am4maps.Legend();
                chart.legend.position = "right";
                chart.legend.align = "right";
            }
        }
    }

    function returnInnerWidth() {
        let width = screen.width;
        let cw = 613;
        let offsetX = 3.19;

        // if (width > 1280) {
        //     cw = 800;
        //     offsetX = 800;
        // }

        // if (width > 1360) {
        //     retval = 800;
        // }

        if (width > 1365) {
            cw = 737.05;
            offsetX = 3.5
        }

        if (width > 1439) {
            cw = 737.05;
            offsetX = 3.1
        }

        if (width > 1599) {
            cw = 737.05;
            offsetX = 2.4
        }

        if (width > 1768) {
            cw = 841.05;
            offsetX = 2.22
        }

        return {
            width: cw,
            offsetX: offsetX,
        };
    }

    function removeDuplicates(myArr, prop) {
        return myArr.filter((obj, pos, arr) => {
            return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
        });
    }
</script>

<style scoped>
    .map {
        height: calc(100vh - 225px);
        width: 1600px;
        background-color: #cccccc;
        float: left;
    }

    .mapContainer {
        display: inline-flex;
        width: 100%
    }

    .sideBar {
        float: right;
        width: 17%
    }

    @media screen and (min-width:1280px) {
        .map {
            width: 1000px;
        }

        .sideBar {

            width: calc(100vw - 1000px)
        }
    }

    @media screen and (min-width:1336px) {
        .map {
            width: 1200px;
        }

        .sideBar {

            width: calc(100vw - 1200px)
        }
    }

    @media screen and (min-width:1440px) {
        .map {
            width: 1200px;
        }

        .sideBar {

            width: calc(100vw - 1200px)
        }
    }

    @media screen and (min-width:1600px) {
        .map {
            width: 1400px;
        }

        .sideBar {

            width: calc(100vw - 1400px)
        }
    }

    @media screen and (min-width:1920px) {
        .map {
            width: 1600px;
        }

        .sideBar {

            width: calc(100vw - 1600px)
        }
    }
</style>