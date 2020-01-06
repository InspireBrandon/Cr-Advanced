<template>
  <div width="100%">
    <v-toolbar color="grey darken-3" dense flat dark>
      <v-menu dark offset-y v-if="!viewOnlyMode">
        <v-btn slot="activator" flat>Setup</v-btn>
        <v-list>
          <v-list-tile @click="openRetailerModal()">
            <v-list-tile-title>Locations</v-list-tile-title>
          </v-list-tile>
          <v-list-tile @click="linkRetailerStore()">
            <v-list-tile-title>Link Retailer Stores</v-list-tile-title>
          </v-list-tile>
          <v-list-tile @click="openRetailerSupplierStorDialog()">
            <v-list-tile-title>Link Supplier Stores</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
      <v-menu v-if="!viewOnlyMode" dark offset-y>
        <v-btn slot="activator" flat>Image</v-btn>
        <v-list>
          <v-list-tile @click="mapImageAdd()">
            <v-list-tile-title>Add</v-list-tile-title>
          </v-list-tile>
          <v-list-tile @click="showSelector()">
            <v-list-tile-title>Manage</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
      <v-btn v-if="!viewOnlyMode" flat @click="openImport">Import</v-btn>
      <v-spacer></v-spacer>
      <v-toolbar-title>Maps</v-toolbar-title>
    </v-toolbar>
    <v-toolbar dark flat>
      <v-spacer></v-spacer>
      <v-toolbar-title>{{title}}</v-toolbar-title>


      <v-spacer></v-spacer>


      <v-menu v-model="openSideBar" :close-on-click="false" :close-on-content-click="false" left offset-y>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" @click="toggleSidbar" slot="activator" icon>
            <v-icon v-if="!openSideBar">visibility</v-icon>
            <v-icon v-if="openSideBar">visibility_off</v-icon>
          </v-btn>
        </template>

        <v-card max-height="400px;" width="400px" flat>
          <v-tabs class="elevation-4" dark>
            <v-tabs-slider color="blue"></v-tabs-slider>
            <v-tab href="#tab-1">Market Share</v-tab>
            <v-tab href="#tab-3">Legend</v-tab>
            <v-tab-item id="tab-1" class="elevation-2" justify-content: center>
              <v-toolbar dark flat dense color="primary">
                <v-toolbar-title>Market Share</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card height="calc(100vh - 273px)" style="overflow:auto;">
                <v-card>
                  <v-list>
                    <div v-for="(item, index) in AvailableData" :key="index">
                      <v-list-tile>
                        <v-list-tile-title>{{checkAlphaNumber(item.blockNumber)}}:
                          {{formatNumber(item.regionValues)}} </v-list-tile-title>
                      </v-list-tile>
                      <v-divider></v-divider>
                    </div>
                  </v-list>
                </v-card>
              </v-card>
            </v-tab-item>
            <v-tab-item id="tab-3" class="elevation-2" justify-content: center>
              <v-toolbar dark flat dense color="primary">
                <v-toolbar-title> Legend </v-toolbar-title>
                <v-spacer> </v-spacer>
              </v-toolbar>
              <img v-show="legendImgURL != '' && selectedmap != null"
                :src="legendImgURL == '' ? tmpImageURL : legendImgURL" :aspect-ratio="10/13" class="grey lighten-2 mt-0"
                width="200px" style="object-fit: fill;">
            </v-tab-item>
          </v-tabs>
        </v-card>

      </v-menu>
    </v-toolbar>
    <div oncontextmenu="return false;" class="mapContainer">
      <v-layout>

        <v-flex md12>

          <div id="thisone2" class="map" ref="thisone2"></div>
        </v-flex>
      </v-layout>
    </div>
    <YesNoModal ref="yesNo"></YesNoModal>
    <Spinner ref="Spinner" />
    <RetailerImportModal ref="RetailerImportModal" />
    <LinkRetailerStore ref="LinkRetailerStore" />
    <MapImageSelector ref="MapImageSelector" />
    <RetailerSupplierStoreDialog ref="RetailerSupplierStoreDialog" />
    <MapImageAdd ref="MapImageAdd" />
    <Research ref="Research" />
    <squareModal ref="squareModal" />
  </div>
</template>

<script>
  import * as am4core from "@amcharts/amcharts4/core";
  import * as am4charts from "@amcharts/amcharts4/charts";
  import * as am4maps from "@amcharts/amcharts4/maps";
  import YesNoModal from "@/components/Common/YesNoModal";
  import am4geodata_worldLow from "@amcharts/amcharts4-geodata/southAfricaHigh";
  import Axios from "axios";
  import jwt from "jsonwebtoken";
  import Spinner from '@/components/Common/Spinner';
  import LinkStores from "../Research/LinkStores";
  import Research from "../Research/Index";

  import RetailerImportModal from "../Main/RetailerImportModal";
  import LinkRetailerStore from "../Main/LinkRetailerStores/Index";
  import RetailerSupplierStoreDialog from "../Research/RetailerSupplierStore/RetailerSupplier";
  import MapImageSelector from "./MapImageSelector";
  import MapImageAdd from "../Main/MapImageModal"
  import squareModal from "./squareModal";



  import MapComponent from "./Index";

  import {
    EventBus
  } from '@/libs/events/event-bus.js';


  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  });
  export default {
    components: {
      YesNoModal,
      Spinner,
      MapImageSelector,
      MapComponent,
      squareModal,
      LinkStores,
      Research,
      RetailerImportModal,
      LinkRetailerStore,
      RetailerSupplierStoreDialog,
      MapImageSelector,
      MapImageAdd
    },
    data() {
      return {
        title: null,
        openSideBar: false,
        retailerData: [],
        // start sidebar setup
        useRetailerMap: false,
        selectedRetailers: [],
        selectedRetailersFields: [],
        // end sidebar setup
        stores: [],
        imageHeight: null,
        imageWidth: null,
        config: null,
        tmpImageURL: "https://www.okcballet.org/wp-content/uploads/2016/09/placeholder-image.png",
        imgURL: "",
        imageLinkAddress: "",
        fileData: null,
        maps: [],
        selectedmap: null,
        MapImgURL: "",
        legendImgURL: "",
        chart: null,
        accrossCities: [],
        majorCities: [],
        geoGridData: [],
        drawGrid: false,
        alpharray: [{
            text: "A",
            rangeStart: 0,
            rangeEnd: 10
          },
          {
            text: "B",
            rangeStart: 10,
            rangeEnd: 20
          },
          {
            text: "C",
            rangeStart: 20,
            rangeEnd: 30
          },
          {
            text: "D",
            rangeStart: 30,
            rangeEnd: 40
          },
          {
            text: "E",
            rangeStart: 40,
            rangeEnd: 50
          },
          {
            text: "F",
            rangeStart: 50,
            rangeEnd: 60
          },
          {
            text: "G",
            rangeStart: 60,
            rangeEnd: 70
          },
          {
            text: "H",
            rangeStart: 70,
            rangeEnd: 80
          },
          {
            text: "I",
            rangeStart: 80,
            rangeEnd: 90
          },
          {
            text: "J",
            rangeStart: 90,
            rangeEnd: 100
          },
          {
            text: "K",
            rangeStart: 100,
            rangeEnd: 110
          }
        ],
        viewOnlyMode: false,
        containerHeight: 0,
        containerWidth: 0,
        event_data: null,
      };

    },
    computed: {
      AvailableData() {
        let self = this;
        let retVal = [];
        if (self.geoGridData != undefined && self.geoGridData != null) {
          if (self.geoGridData.length > 0) {
            self.geoGridData.forEach((el, idx) => {
              if (el.regionValues != null && el.regionValues != undefined) {
                if (el.regionValues.length > 0) {
                  if (el.regionValues[0].otherSales != 0) {
                    el.blockNumber = idx;
                    retVal.push(el);
                  }
                }
              }
            });
          }
        }
        return retVal;
      }
    },
    mounted() {
      let self = this;
      self.$refs.Spinner.show()
      if (self.$route.params.params != null) {
        self.viewOnlyMode = true
      } else {
        self.viewOnlyMode = false
      }

      self.getGeoGrid(() => {
        self.getCities();
        self.getRetailers();
        EventBus.$emit('MAPPING_LOADED');
      });

      EventBus.$off('MAPPING_REDRAW')
      EventBus.$on('MAPPING_REDRAW', data => {
        self.event_data = data
        self.$refs.Spinner.show()
        self.viewOnlyMode = true
        self.handleEventData(data, )

      });
    },
    methods: {
      toggleSidbar() {
        let self = this
        self.openSideBar = !self.openSideBar
      },
      openImport() {
        let self = this
        self.$refs.Research.open()
      },
      openRetailerModal() {
        let self = this;
        self.$refs.RetailerImportModal.open(callback => {});
      },
      mapImageSelector() {
        let self = this;
        self.$refs.MapImageSelector.show(callback => {});
      },
      mapImageAdd() {
        let self = this;
        self.$refs.MapImageAdd.open(true, null, callback => {});
      },
      openRetailerSupplierStorDialog() {
        let self = this;
        self.$refs.RetailerSupplierStoreDialog.show();
      },
      linkRetailerStore() {
        let self = this;
        self.$refs.LinkRetailerStore.show(() => {});
      },
      showSelector() {
        let self = this;
        self.$refs.MapImageSelector.show(callback => {
          self.openMapImageModal(false, callback, anything => {})
        })
      },
      openMapImageModal(type, item) {
        let self = this
        self.$refs.MapImageAdd.open(type, item, callback => {})
      },
      getMarketShare(data, stores) {
        let self = this

        if (data.length != 0 && stores.length != 0) {


          self.$refs.Spinner.show()
          self.drawGrid = true
          self.title = "Marltons Market Share Hinterland"
          Axios.defaults.headers.common["TenantID"] =
            sessionStorage.currentDatabase;

          let encoded_details = jwt.decode(sessionStorage.accessToken);

          Axios.post(
            process.env.VUE_APP_API + `SuplierLocationImportTX/MArketShare`, data
          ).then(r => {

            self.geoGridData = r.data
            self.openSideBar = true
            self.$refs.Spinner.Hide()

          })
        } else {
          self.drawGrid = false
          self.title = null

        }

      },
      handleEventData(data) {
        let self = this
        self.$refs.Spinner.show()

        self.$nextTick(() => {
          self.setChartData(data, chartCB => {
            self.getRectWidth()
            self.selectedmap = data.mapImages[0]
            self.onMapChange(imagecb => {
              if (self.config == null) {
                self.drawMap({
                  imageDetails: {
                    imageType: "none",
                    imgURL: self.MapImgURL,
                    imageLinkAddress: null
                  }
                });
              } else {
                self.drawMap(self.config, self.heatData);
              }
            })
            self.getMarketShare(data.MarketShare, data.Store)
          });
        })
      },
      getRectWidth() {
        let self = this
        self.chart.goHome(0);
        var elMain = document.querySelector(
          "#thisone2"
        )
        if (elMain != null) {
          self.containerHeight = elMain.getBoundingClientRect().height
          self.containerWidth = elMain.getBoundingClientRect().width
        }

        var el = document.querySelector(
          "#thisone2 > div > svg > g > g:nth-child(2) > g:nth-child(1) > g:nth-child(2) > g:nth-child(1) > g:nth-child(2) > g:nth-child(1) > g > g:nth-child(1) > g > g:nth-child(3) > g > g > path"
        )

        if (el != null) {
          self.imageHeight = el.getBoundingClientRect().height
          self.imageWidth = el.getBoundingClientRect().width
        }


      },
      openSquareModal(square) {
        let self = this
        self.$refs.squareModal.open(square, self.event_data.MarketShare[0])

      },
      DrawGeoGrid(chart, callback) {
        let self = this;

        self.geoGridData.forEach((e, idx) => {
          let arr = [e.geoPolygon];

          // let x = e.squareFormattedList[0].longitude;
          // let y = e.squareFormattedList[0].latitude;
          let x = e.geoPolygon[0].longitude;
          let y = e.geoPolygon[0].latitude;

          // let shapeSeries = chart.series.push(new am4maps.MapPolygonSeries());

          // shapeSeries.data = [{
          //   "title": "Bermuda triangle",
          //   "geoPolygon": arr
          // }];

          // let shapeTemplate = shapeSeries.mapPolygons.template;
          // shapeTemplate.stroke = am4core.color("#e33");
          // shapeTemplate.strokeWidth = 2;
          // shapeTemplate.fill = shapeTemplate.stroke;
          // shapeTemplate.fillOpacity = 0.2;
          // shapeTemplate.nonScalingStroke = true;

          let shapeSeries = chart.series.push(new am4maps.MapPolygonSeries());
          let shapeTemplate = shapeSeries.mapPolygons.template;
          shapeTemplate.stroke = am4core.color("#e33");
          // if (e.regionValues == null) {
          //   shapeTemplate.stroke = am4core.color("#e33");
          // } else {
          //   if (e.regionValues.length == 0) {
          //     shapeTemplate.stroke = am4core.color("#e33");
          //   } else {
          //     shapeTemplate.stroke = am4core.color("#00ff00");
          //   }
          // }

          shapeTemplate.strokeWidth = 2;
          // shapeTemplate.fill = shapeTemplate.stroke;
          shapeTemplate.propertyFields.latitude = "longitude";
          shapeTemplate.propertyFields.longitude = "latitude";



          shapeTemplate.fillOpacity = 0.2;
          shapeTemplate.nonScalingStroke = true;
          shapeSeries.data = [{
            title: idx,
            geoPolygon: arr
          }];
          shapeTemplate.tooltipText = self.checkAlphaNumber(idx);
          shapeTemplate.events.on('hit', function () {
            self.openSquareModal(e)
          })
          shapeSeries.name = "block";



          // Set up label series to populate
          if (idx == 0) {
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
      },
      getGeoGrid(callback) {
        let self = this;
        Axios.defaults.headers.common["TenantID"] =
          sessionStorage.currentDatabase;

        let encoded_details = jwt.decode(sessionStorage.accessToken);
        Axios.get(
          process.env.VUE_APP_API + `SuplierLocationImportTX/GeoReport?userID=${encoded_details.USER_ID}`
        ).then(r => {
          self.geoGridData = r.data;
          self.getHinterlandStores();
          callback()
        });
      },
      getRetailers() {
        let self = this;
        Axios.defaults.headers.common["TenantID"] =
          sessionStorage.currentDatabase;

        Axios.get(process.env.VUE_APP_API + `Retailer`).then(r => {
          self.selectedRetailers = [];
          r.data.retailerList.forEach(e => {
            self.selectedRetailers.push({
              text: e.name,
              value: e.id
            });
          });
        });
      },
      setFieldImages(items, callback) {
        let self = this
        items.forEach((e, idx) => {
          e.image = process.env.VUE_APP_API + `Retailer/Image?retailerID=${e.retailerID}`
        })
        callback(items)

      },
      buildGraphArr(fields, store, callback) {
        let self = this;
        let tmp = []

        if (store.length > 0) {
          fields.push(store[0])
        }
        if (fields.length > 0) {
          Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
          Axios.post(process.env.VUE_APP_API + `RetailerStore/Multiple`, fields).then(r => {

            self.setFieldImages(r.data.retailerStoreList, formattedData => {
              tmp = formattedData
              callback(tmp)
            })

          })
        } else {
          callback(tmp)
        }
      },
      showSelector() {
        let self = this;
        self.getRectWidth()
        self.$refs.MapImageSelector.show(callback => {
          if (callback.name == "None") {
            self.selectedmap = null;
            self.drawMap({
                imageDetails: {
                  imageType: "none",
                  imgURL: "",
                  imageLinkAddress: null
                }
              },
              null,
              null
            );
          } else {
            self.selectedmap = callback.id;
            self.onMapChange();
          }
        });
      },
      onMapChange(callback) {
        let self = this;
        self.$nextTick(() => {
          if (self.selectedmap == undefined) {
            self.selectedmap = null
            callback()
          } else {
            self.MapImgURL =
              process.env.VUE_APP_API +
              `MapImage?mapImageID=${self.selectedmap}&type=map`;
            self.legendImgURL =
              process.env.VUE_APP_API +
              `MapImage?mapImageID=${self.selectedmap}&type=legend`;
            callback()
          }
        });
      },
      getCities() {
        let self = this;
        let cities = require("@/assets/CITIES/CITIES.json");
        let major = cities.filter(e => {
          return e.major;
        });
        let accross = cities.filter(e => {
          return !e.major;
        });
        self.majorCities = major;
        self.accrossCities = accross;
      },
      getHinterlandStores() {
        let self = this;

        let stores = require("@/assets/storeData/Hinterland.json");

        self.prepareStoreResults(stores.Response);
      },
      prepareStoreResults(storeData) {
        let self = this;
        let stores = storeData.filter(e => {
          return e.siteType == "SHOP";
        });
        stores.forEach(element => {
          let longLat = element.OfficeGPS.split(",");
          element.long = parseFloat(longLat[1]);
          element.lat = parseFloat(longLat[0]);
          element.imageURL = "Hinterland.png";
        });

        self.stores = stores;

        self.getData(stores);
      },
      getData(stores) {
        let self = this;
        Axios.get(
          process.env.VUE_APP_API +
          `SystemFile/JSON?db=CR-Devinspire&folder=CLUSTER REPORT&file=REPORT`
        ).then(fd => {
          Axios.get(
            process.env.VUE_APP_API +
            `SystemFile/JSON?db=CR-Devinspire&id=${fd.data.id}`
          ).then(r => {
            self.fileData = r.data;

            self.drawMap({
                imageDetails: {
                  imageType: "none",
                  imgURL: null,
                  imageLinkAddress: null
                }
              },
              null,
              null
            );

          });
        });
      },
      drawPolygonseries(chart) {
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
        image.width = self.imageWidth;
        image.height = self.imageHeight;

        pattern_europe.x = (self.containerWidth - image.width) / 2
        pattern_europe.y = self.containerHeight - image.height
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
      },
      drawRetailerMap(chart) {
        // /////////////////////////////////////////////////////
        // start base retailer store image series
        // /////////////////////////////////////////////////////
        let self = this;
        let imageSeries = chart.series.push(new am4maps.MapImageSeries());
        imageSeries.name = "retailerMap";
        imageSeries.data = chart.data.retailerData

        let imageSeriesTemplate = imageSeries.mapImages.template;
        imageSeriesTemplate.propertyFields.latitude = "xCoordinate";
        imageSeriesTemplate.propertyFields.longitude = "yCoordinate";
        imageSeriesTemplate.nonScaling = true;
        imageSeriesTemplate.fill = "black";

        let storeImage = imageSeriesTemplate.createChild(am4core.Image);
        storeImage.propertyFields.href = "image"
        storeImage.width = 25;
        storeImage.height = 25;
        storeImage.horizontalCenter = "middle";
        storeImage.verticalCenter = "bottom";
        storeImage.propertyFields.tooltipText = "name";
      },
      drawImageSeries(chart) {
        let self = this;
        // /////////////////////////////////////////////////////
        // start base hinterland store image series
        // /////////////////////////////////////////////////////

        let imageSeries = chart.series.push(new am4maps.MapImageSeries());
        // define template
        imageSeries.name = "Hinterland Stores";
        imageSeries.data = self.stores;

        let imageSeriesTemplate = imageSeries.mapImages.template;
        imageSeriesTemplate.propertyFields.latitude = "lat";
        imageSeriesTemplate.propertyFields.longitude = "long";
        imageSeriesTemplate.nonScaling = false;
        imageSeriesTemplate.fill = "black";
        let storeImage = imageSeriesTemplate.createChild(am4core.Image);
        storeImage.propertyFields.href = "imageURL";
        storeImage.width = 15;
        storeImage.height = 15;
        storeImage.horizontalCenter = "middle";
        storeImage.verticalCenter = "bottom";
        storeImage.propertyFields.tooltipText = "PlaceGroup";
      },
      drawMajorCitiesImageSeries(chart) {
        let self = this;
        // /////////////////////////////////////////////////////
        // start major/minor cities circle series
        // /////////////////////////////////////////////////////
        let majorCitiesImageSeries = chart.series.push(
          new am4maps.MapImageSeries()
        );
        majorCitiesImageSeries.name = "Major Cities";
        majorCitiesImageSeries.data = chart.data.majorCities;

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
      },
      drawMinorCities(chart) {
        let self = this;
        // /////////////////////////////////////////////////////
        //  start minor cities drawing
        // /////////////////////////////////////////////////////

        let accrossCitiesImageSeries = chart.series.push(
          new am4maps.MapImageSeries()
        );
        accrossCitiesImageSeries.name = "Minor Cities";
        accrossCitiesImageSeries.data = chart.data.minorCities

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
      },
      drawMap(config, setupMapData) {
        let self = this;
        // //////////////////////////////////////////////////
        // start draw of base chart
        // //////////////////////////////////////////////////
        self.openSideBar = false
        self.$refs.Spinner.show()
        if (self.chart != null) {
          self.chart.dispose()
        }
        let chart = am4core.create("thisone2", am4maps.MapChart);
        chart.name = "Map";
        chart.projection = new am4maps.projections.Miller();
        var title = chart.titles.create();
        title.textAlign = "middle";
        chart.zoomDuration=0.5;
        chart.updateOnReleaseOnly=true

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
        // setting chart data variables
        chart.data.majorCities = self.majorCities
        chart.data.minorCities = self.accrossCities;
        chart.data.retailerData = self.retailerData
        self.drawPolygonseries(chart);
        self.drawMajorCitiesImageSeries(chart);
        self.drawMinorCities(chart);

        if (self.drawGrid) {
          self.DrawGeoGrid(chart, callback => {
            self.drawRetailerMap(chart);
            console.log("[CHART SERIES]", chart.series);
          });
        } else {
          self.drawRetailerMap(chart);
        }

        self.chart = chart


        self.$refs.Spinner.hide()
      },
      setChartData(eventData, callback) {
        let self = this
        self.buildGraphArr(eventData.retailers, eventData.Store, retailerCallback => {
          self.retailerData = retailerCallback

          callback()
        })
      },
      formatNumber(regionValues) {
        let string = ""
        let percentage = 0
        if (regionValues.length == 1) {
          percentage = (regionValues[0].otherSales / regionValues[0].sales) * 100
        }
        string = percentage.toFixed(2)

        let salesstring = formatter.format(regionValues[0].otherSales).replace("$", "R");
        string += "%"

        string += "  Sales: " + salesstring
        return string
      },
      checkAlphaNumber(blockNumber) {
        let self = this;

        var found = self.alpharray.find(el => {
          return el.rangeStart <= blockNumber && el.rangeEnd > blockNumber;
        });

        let number = blockNumber - found.rangeStart + 1;

        return found.text + number;
      }
    }
  };
</script>

<style scoped>
  .map {
    height: calc(100vh - 177px);
    /* width: 1600px; */
    width: 100%;
    background-color: #cccccc;
    float: left;
  }

  .mapContainer {
    display: inline-flex;
    width: 100%;
  }
</style>