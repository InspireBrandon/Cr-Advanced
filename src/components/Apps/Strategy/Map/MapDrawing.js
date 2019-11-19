import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/southAfricaHigh";


class MapDrawing {
    constructor() {}

    static DrawMap(chart, config, setupMapData) {

        // drawMap(config, setupMapData) {
        let self = this;

        let formattedData = [];
        // let chart = am4core.create("thisone2", am4maps.MapChart);
        chart.name = "Map";
        chart.projection = new am4maps.projections.Miller();
        var title = chart.titles.create();
        title.text = "[bold font-size: 20]Store Sales Heatmap[/]";
        title.textAlign = "middle";

        let asd = am4geodata_worldLow;
        chart.geodata = asd;
        if (chart.geodata.features[9].geometry.coordinates.length == 3) {
            chart.geodata.features[9].geometry.coordinates.splice(2, 1);
            chart.geodata.features[9].geometry.coordinates.splice(0, 1);
        }
        chart.projection = new am4maps.projections.Mercator();
        // //////////////////////////////////////////////////
        // end draw of base chart
        // //////////////////////////////////////////////////

        self.drawPolygonseries(chart);
        self.drawMajorCitiesImageSeries(chart);
        self.drawMinorCities(chart);
        // draw standard supplier import

        if (
            config.selectedRetailers != undefined &&
            config.selectedRetailers.length > 0
        ) {
            self.drawRetailerImport(chart, config);
        }
        if (self.useRetailerMap) {
            self.drawRetailerMap(chart, setupMapData.retailerMap);
        }

        if (config.drawGrid) {
            // self.DrawGeoGrid(chart, callback => {});
        }
    }
    static DrawGeoGrid(chart, callback) {
        let self = this;

        self.geoGridData.forEach((e, idx) => {
            let arr = [e.squareFormattedList];

            let x = e.squareFormattedList[0].longitude;
            let y = e.squareFormattedList[0].latitude;

            let shapeSeries = chart.series.push(new am4maps.MapPolygonSeries());

            shapeSeries.data = [{
                title: "Bermuda triangle",
                geoPolygon: arr
            }];
            shapeSeries.hiddenInLegend = true;
            shapeSeries.name = "block";

            let shapeTemplate = shapeSeries.mapPolygons.template;
            shapeTemplate.stroke = am4core.color("#e33");
            shapeTemplate.strokeWidth = 2;
            shapeTemplate.fill = shapeTemplate.stroke;
            shapeTemplate.hiddenInLegend = true;
            shapeTemplate.fillOpacity = 0.2;
            shapeTemplate.nonScalingStroke = true;
            shapeTemplate.tooltipText = self.checkAlphaNumber(idx);

            var labelSeries = chart.series.push(new am4maps.MapImageSeries());
            labelSeries.hiddenInLegend = true;
            var labelTemplate = labelSeries.mapImages.template.createChild(
                am4core.Label
            );
            labelTemplate.horizontalCenter = "middle";
            labelTemplate.verticalCenter = "middle";
            labelTemplate.fontSize = 14;
            labelTemplate.interactionsEnabled = false;
            labelTemplate.nonScaling = true;
            labelTemplate.hiddenInLegend = true;



            // Set up label series to populate
            if (idx == 0) {
                shapeSeries.events.on("inited", function () {
                    shapeSeries.mapPolygons.each(function (polygon) {
                        var label = labelSeries.mapImages.create();

                        //var state = polygon.dataItem.dataContext.id.split("-").pop();
                        label.latitude = y + 0.25;
                        label.longitude = polygon.visualLongitude;
                        label.children.getIndex(0).text = idx + 1;
                        label.hiddenInLegend = true;
                        label = labelSeries.mapImages.create();
                        //var state = polygon.dataItem.dataContext.id.split("-").pop();
                        label.latitude = polygon.visualLatitude;
                        label.longitude = x - 0.25;
                        label.children.getIndex(0).text = "A";
                        label.hiddenInLegend = true;
                    });
                });
            } else if (idx > 0 && idx < 10) {
                shapeSeries.events.on("inited", function () {
                    shapeSeries.mapPolygons.each(function (polygon) {
                        var label = labelSeries.mapImages.create();
                        label.hiddenInLegend = true;
                        //var state = polygon.dataItem.dataContext.id.split("-").pop();
                        label.latitude = y + 0.25;
                        label.longitude = polygon.visualLongitude;
                        label.children.getIndex(0).text = idx + 1;
                        label.hiddenInLegend = true;
                    });
                });
            } else if (idx % 10 === 0) {
                var found = self.alpharray.find(el => {
                    return el.rangeStart == idx;
                });

                shapeSeries.events.on("inited", function () {
                    shapeSeries.mapPolygons.each(function (polygon) {
                        var label = labelSeries.mapImages.create();
                        label.hiddenInLegend = true;
                        //var state = polygon.dataItem.dataContext.id.split("-").pop();
                        label.latitude = polygon.visualLatitude;
                        label.longitude = x - 0.25;
                        label.children.getIndex(0).text = found.text;
                        label.hiddenInLegend = true;
                    });
                });
            }
        });

        callback();
    }
    static drawRetailerMap(chart, mapData) {
        // /////////////////////////////////////////////////////
        // start base retailer store image series
        // /////////////////////////////////////////////////////
        let self = this;
        mapData.forEach(r => {
            self.buildGraphArr(r, callback => {
                let imageSeries = chart.series.push(new am4maps.MapImageSeries());
                // define template
                let seriesName = null;
                self.selectedRetailers.forEach(e => {
                    if (e.value == r) {
                        seriesName = e.text;
                    }
                });
                imageSeries.name = seriesName;
                imageSeries.data = callback;

                let imageSeriesTemplate = imageSeries.mapImages.template;
                imageSeriesTemplate.propertyFields.latitude = "xCoordinate";
                imageSeriesTemplate.propertyFields.longitude = "yCoordinate";
                imageSeriesTemplate.propertyFields.tooltipText = "name";
                // imageSeriesTemplate.nonScaling = true;
                // imageSeriesTemplate.nonScalingStroke=true
                imageSeriesTemplate.fill = "black";
                let storeImage = imageSeriesTemplate.createChild(am4core.Image);
                storeImage.propertyFields.href = "image";
                storeImage.width = 50;
                storeImage.height = 50;
                storeImage.horizontalCenter = "middle";
                storeImage.verticalCenter = "bottom";
                // storeImage.propertyFields.tooltipText = "name";
                // storeImage.nonScalingStroke=false
                storeImage.nonScaling = true;


            });
        });
    }
    static drawPolygonseries(chart) {
        // //////////////////////////////////////////////////
        // start image background overlay/color fill
        // //////////////////////////////////////////////////
        let self = this;
        let polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

        polygonSeries.strokeOpacity = 0.9;
        polygonSeries.useGeodata = true;
        let polygonTemplate = polygonSeries.mapPolygons.template;
        var pattern_europe = new am4core.Pattern();


        var image = new am4core.Image();
        polygonTemplate.tooltipColorSource = "rgb(103,148,220)";
        // var height = this.$refs.thisone2.clientHeight;
        image.width = self.imageWidth;
        image.height = self.imageHeight;
        var el = document.querySelector(
            "#thisone2"
        )
        let containerHeight = el.getBoundingClientRect().height
        let containerWidth = el.getBoundingClientRect().width


        pattern_europe.x = (containerWidth - image.width) / 2
        pattern_europe.y = containerHeight - image.height
        pattern_europe.width = image.width;
        pattern_europe.height = image.height;

        if (self.selectedmap != null) {
            polygonTemplate.tooltipHTML =
                '<a style="background-color: #cccccc;" href="https://en.wikipedia.org/wiki/{category.urlEncode()}">{name}</a>';
            image.href = self.MapImgURL;
            pattern_europe.addElement(image.element);
            polygonTemplate.fill = pattern_europe;
            polygonTemplate.strokeOpacity = 1;

        } else {
            polygonTemplate.fill = chart.colors.getIndex(1);
            polygonTemplate.strokeOpacity = 1;
            polygonTemplate.tooltipText = "{name}";
        }
        polygonTemplate.nonScalingStroke = true;
    }

    static drawMajorCitiesImageSeries(chart) {
        let self = this;
        // /////////////////////////////////////////////////////
        // start major/minor cities circle series
        // /////////////////////////////////////////////////////
        let majorCitiesImageSeries = chart.series.push(
            new am4maps.MapImageSeries()
        );
        majorCitiesImageSeries.name = "Major Cities";
        majorCitiesImageSeries.data = self.majorCities;

        let majorCitiesImageSeriesTemplate =
            majorCitiesImageSeries.mapImages.template;
        majorCitiesImageSeriesTemplate.propertyFields.latitude = "latitude";
        majorCitiesImageSeriesTemplate.propertyFields.longitude = "longitude";
        majorCitiesImageSeriesTemplate.nonScaling = false;
        majorCitiesImageSeriesTemplate.fill = "black";

        var majorCitiesCircle = majorCitiesImageSeriesTemplate.createChild(
            am4core.Circle
        );
        majorCitiesCircle.fillOpacity = 0.5;
        majorCitiesCircle.tooltipText = "{city}: [bold]{sales}[/]";
        majorCitiesCircle.radius = 3;
        let majorCitiesLabel = majorCitiesImageSeriesTemplate.createChild(
            am4core.Label
        );
        majorCitiesLabel.html =
            '<a style="background-color: black;color: white;font-size:6px" >{city}</a>';
        majorCitiesLabel.fontSize = 5;
        majorCitiesLabel.nonScaling = false;
    }
    static drawMinorCities(chart) {
        let self = this;
        // /////////////////////////////////////////////////////
        //  start minor cities drawing
        // /////////////////////////////////////////////////////

        let accrossCitiesImageSeries = chart.series.push(
            new am4maps.MapImageSeries()
        );
        accrossCitiesImageSeries.name = "Minor Cities";
        accrossCitiesImageSeries.data = self.accrossCities;
        let accrossCitiesImageSeriesTemplate =
            accrossCitiesImageSeries.mapImages.template;
        accrossCitiesImageSeriesTemplate.propertyFields.latitude = "latitude";
        accrossCitiesImageSeriesTemplate.propertyFields.longitude = "longitude";
        accrossCitiesImageSeriesTemplate.nonScaling = false;
        accrossCitiesImageSeriesTemplate.fill = "black";

        var accrossCitiesCircle = accrossCitiesImageSeriesTemplate.createChild(
            am4core.Circle
        );
        accrossCitiesCircle.fillOpaaccrossCities = 0.5;
        accrossCitiesCircle.tooltipText = "{city}: [bold]{sales}[/]";
        accrossCitiesCircle.radius = 3;
        let accrossCitiesLabel = accrossCitiesImageSeriesTemplate.createChild(
            am4core.Label
        );
        accrossCitiesLabel.html =
            '<a style="background-color: black;color: white;font-size:1px" >{city}</a>';
        accrossCitiesLabel.fontSize = 3;
        accrossCitiesLabel.nonScaling = false;
    }

    static drawRetailerImport(chart, config) {
        let self = this;
        // /////////////////////////////////////////////////////
        //  start draw retailer import
        // /////////////////////////////////////////////////////
        for (var retailer in self.SupplierData) {
            let currentHasImages = [
                "Absolute Vet",
                "Bkb Co-Ops",
                "Build It",
                "Builders Warehouse",
                "Chamberlain",
                "Choppies",
                "Coastal",
                "Co-Ops",
                "Crazy Plastics",
                "Dis-Chem",
                "Est Africa",
                "Family Pets",
                "Game",
                "Gwk Co-Ops",
                "Hinterland",
                "Makro",
                "Mica",
                "Ntk Agric",
                "OK Foods",
                "Overberg Agri Co-Ops",
                "Pet And Pool",
                "Pets World",
                "Pick n Pay",
                "Shoprite Checkers",
                "Spar",
                "The Queen",
                "Tuinroete Afgri",
                "Vetsmart",
                "West Pack"
            ];

            let hasImage = false;
            let inArray = false;

            currentHasImages.forEach(img => {
                if (retailer.includes(img)) hasImage = true;
            });

            config.selectedRetailers.forEach(el => {
                if (retailer == el) inArray = true;
            });

            if (hasImage && inArray) {
                self.SupplierData[retailer].forEach(el => {
                    if (retailer.includes("Hinterland")) {
                        el.image = "Hinterland.png";
                    } else {
                        el.image = el.retailer + ".png";
                    }
                });

                let SupplierCitiesImageSeries = chart.series.push(
                    new am4maps.MapImageSeries()
                );

                SupplierCitiesImageSeries.name = retailer;
                SupplierCitiesImageSeries.data = self.SupplierData[retailer];

                let SupplierCitiesImageSeriesTemplate =
                    SupplierCitiesImageSeries.mapImages.template;
                SupplierCitiesImageSeriesTemplate.propertyFields.latitude = "x";
                SupplierCitiesImageSeriesTemplate.propertyFields.longitude = "y";
                SupplierCitiesImageSeriesTemplate.nonScaling = true;
                SupplierCitiesImageSeriesTemplate.fill = "black";

                var SupplierCitiesCircle = SupplierCitiesImageSeriesTemplate.createChild(
                    am4core.Circle
                );
                SupplierCitiesCircle.fillOpaSupplierCities = 0.5;
                SupplierCitiesCircle.tooltipText =
                    "{retailer}: [bold]{sales}[/]{storeName}";
                SupplierCitiesCircle.radius = 0;

                let storeImage = SupplierCitiesImageSeriesTemplate.createChild(
                    am4core.Image
                );
                storeImage.propertyFields.href = "image";
                storeImage.width = 15;
                storeImage.height = 15;
                storeImage.horizontalCenter = "middle";
                storeImage.verticalCenter = "bottom";
                storeImage.tooltipText = "{storeName}: [bold]{sales}[/]";
            }
        }
    }


}


export default MapDrawing;