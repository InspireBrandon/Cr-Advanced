<template>
  <div width="100%">
    <v-toolbar dark flat>
      <!-- <v-toolbar-items>
        <v-select style="margin-left: 10px; margin-top: 8px; width: 200px" placeholder="Field" hide-details></v-select>

        <v-select style="margin-left: 10px; margin-top: 8px; width: 200px" placeholder="Values" hide-details></v-select>
      </v-toolbar-items> -->
    </v-toolbar>
    <div oncontextmenu="return false;" class="mapContainer">
      <v-layout row wrap>
        <v-flex md9>
          <div id="thisone2" class="map" ref="thisone2"></div>
        </v-flex>
        <v-flex md3>
          <!-- <div class="sideBar"> -->
          <div>
            <v-card max-height="400px;" flat>
              <v-tabs class="elevation-4" centered dark fixed-tabs justify-content: center>
                <v-tabs-slider color="white"></v-tabs-slider>

                <!-- <v-tab href="#tab-1" justify-content: center>
                            Map Image
                </v-tab>-->
                <v-tab href="#tab-2" justify-content: center>Setup Map</v-tab>
                <v-tab href="#tab-3" justify-content: center>image</v-tab>
                <v-tab href="#tab-1" justify-content: center>Market Share</v-tab>
                <v-tab-item id="tab-3" class="elevation-2" justify-content: center>
                  <v-toolbar dark flat dense color="primary">
                    <v-toolbar-title> Image </v-toolbar-title>
                    <v-spacer> </v-spacer>
                    <v-btn @click="showSelector">maps</v-btn>
                  </v-toolbar>
                  <!-- <v-btn @click="getRectWidth">Test Rect</v-btn> -->
                  <img v-show="legendImgURL != '' && selectedmap != null"
                    :src="legendImgURL == '' ? tmpImageURL : legendImgURL" :aspect-ratio="10/13"
                    class="grey lighten-2 mt-0" width="200px" style="object-fit: fill;">
                </v-tab-item>
                <v-tab-item id="tab-1" class="elevation-2" justify-content: center>
                  <v-toolbar dark flat dense color="primary">
                    <v-toolbar-title>Market Share</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-toolbar-items>
                      <v-select style="margin-left: 10px;  width: 200px" placeholder="Select to see market share"
                        v-model="selectedCategory" :items="categories" hide-details></v-select>
                    </v-toolbar-items>
                  </v-toolbar>
                  <v-card height="calc(100vh - 273px)" style="overflow:auto;">

                    <v-card>
                      <v-list>
                        <v-list-tile v-for="(item, index) in AvailableData" :key="index">
                          <v-list-tile-title>
                            <v-layout>

                              <span>{{checkAlphaNumber(item.blockNumber)}} </span>
                              <v-spacer></v-spacer>

                              <span>
                                {{formatNumber(item.storeSummary.sales_Retail,item.squareTotalSales)}}
                              </span>
                              <!-- <v-spacer></v-spacer>
                              <span>{{item.squareTotalSalesPercentage}}%</span> -->
                            </v-layout>
                          </v-list-tile-title>
                        </v-list-tile>
                      </v-list>
                    </v-card>
                  </v-card>
                </v-tab-item>

                <v-tab-item id="tab-2" class="elevation-2" justify-content: center>
                  <v-card height="calc(100vh - 273px)">
                    <v-toolbar dark flat dense color="primary">
                      <v-toolbar-title>Setup</v-toolbar-title>
                      <v-spacer></v-spacer>
                    </v-toolbar>
                    <v-card-text>
                      <v-checkbox label="Draw Market Share Grid" hide-details v-model="drawGrid"></v-checkbox>
                      <v-divider></v-divider>
                      <v-checkbox label="Draw import stores" hide-details v-model="useImportStores"></v-checkbox>
                      <v-divider></v-divider>
                      <!-- <v-checkbox label="Pie Charts" hide-details v-model="usePiecharts"></v-checkbox>
                      <v-autocomplete v-if="usePiecharts" multiple :items="piechartItems"
                        v-model="selectedPiechartItems" label="Pie Charts Items"></v-autocomplete>
                      <v-divider></v-divider>

                      <v-checkbox label="Heatmaps" hide-details v-model="useHeatmap"></v-checkbox>
                      <v-text-field label="radius" type="number" v-if="useHeatmap" hide-details v-model="radius">
                      </v-text-field>
                      <v-autocomplete v-if="useHeatmap" multiple :items="heatmapItems" v-model="selectedHeatmapField"
                        label="Heatmaps"></v-autocomplete>
                      <v-divider></v-divider>

                      <v-checkbox label="Use Size Map" hide-details v-model="useSizeMap"></v-checkbox>
                      <v-autocomplete v-if="useSizeMap" multiple :items="heatmapItems" v-model="selectedSizeMapField"
                        label="Size Map Items"></v-autocomplete> -->
                      <v-divider></v-divider>

                      <v-checkbox label="Use Retailer Map" hide-details v-model="useRetailerMap"></v-checkbox>
                      <v-autocomplete v-if="useRetailerMap" multiple :items="selectedRetailers"
                        v-model="selectedRetailersFields" label="Size Map Items"></v-autocomplete>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="primary" @click="submitSidebar">draw Map</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-tab-item>
              </v-tabs>
            </v-card>
          </div>
        </v-flex>
      </v-layout>
    </div>
    <input type="file" style="display: none;" ref="fileInput" @change="onImageChange" />
    <YesNoModal ref="yesNo"></YesNoModal>
    <Mapsetup ref="Mapsetup" />
    <MapImageSelector ref="MapImageSelector" />
    <Spinner ref="Spinner" />

  </div>
</template>

<script>
  import * as am4core from "@amcharts/amcharts4/core";
  import * as am4charts from "@amcharts/amcharts4/charts";
  import * as am4maps from "@amcharts/amcharts4/maps";
  import YesNoModal from "@/components/Common/YesNoModal";
  import Mapsetup from "./setup.vue";
  import am4geodata_worldLow from "@amcharts/amcharts4-geodata/southAfricaHigh";
  import Axios from "axios";
  import jwt from "jsonwebtoken";
  import MapImageSelector from "./MapImageSelector";
  import {
    relativeRadiusToValue
  } from "@amcharts/amcharts4/.internal/core/utils/Utils";
  import Spinner from '@/components/Common/Spinner';


  // http://www.climbing.co.za/wp-content/uploads/2012/10/rsamap.png
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  });
  export default {
    components: {
      YesNoModal,
      Spinner,
      Mapsetup,
      MapImageSelector
    },
    props: ["rowData", "setGeogridData"],
    data() {
      return {
        // start sidebar setup
        usePiecharts: false,
        useHeatmap: false,
        useSizeMap: false,
        useRetailerMap: false,
        selectedPiechartItems: [],
        selectedHeatmapField: [],
        selectedSizeMapField: [],
        selectedRetailers: [],
        selectedRetailersFields: [],
        setupMapData: [],
        piechartItems: [],
        heatmapItems: [],
        selectedPlanograms: null,
        // end sidebar setup
        SupplierData: null,
        labels: true,
        lines: false,
        radius: 20,
        stores: [],
        imageHeight: null,
        imageWidth: null,
        config: null,
        tmpImageURL: "https://www.okcballet.org/wp-content/uploads/2016/09/placeholder-image.png",
        imgURL: "",
        imageLinkAddress: "",
        fileData: null,
        heatData: null,
        pieData: null,
        canPlot: false,
        useImportStores: false,
        SystemUser_ID: null,
        currentPlotStore: null,
        maxHeatLegend: 4000000,
        maps: [],
        selectedmap: null,
        MapImgURL: "",
        legendImgURL: "",
        plottableStores: [],
        supplierImport: [],
        clusters: [{
          text: "store",
          value: "store"
        }, {
          text: "basket",
          value: "basket"
        }, {
          text: "listing",
          value: "listing"
        }, {
          text: "custom",
          value: "custom"
        }, ],
        color: [
          am4core.color("rgb(255,99,71)"),
          am4core.color("rgb(255,255,0)"),
          am4core.color("rgb(0,204,0)"),
          am4core.color("rgb(255,128,0)"),
          am4core.color("rgb(204,0,204)")
        ],
        accrossCities: [],
        majorCities: [],
        acrossArr: [],
        sideArr: [],
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
        selectedCategory: null,
        categories: [{
          text: "PET ACCESSORIES",
          value: 33
        }, {
          text: "PET HEALTHCARE",
          value: 34
        }]
      };

    },
    computed: {

      AvailableData() {
        let self = this;

        let retVal = [];

        if (self.geoGridData != undefined && self.geoGridData != null) {
          self.geoGridData.forEach((el, idx) => {
            if (el.retailerStores.length > 0) {
              el.blockNumber = idx;
              el.storeSummary = self.MapStoreData(el)
              retVal.push(el);
            }
          });
        }

        return retVal;
      }
    },
    mounted() {
      let self = this;
      let encoded_details = jwt.decode(sessionStorage.accessToken);
      self.SystemUser_ID = encoded_details.USER_ID;
      // this.openSetup()
      // this.drawMap(this.labels)
      self.$refs.Spinner.show()
      self.getSupplierStores();
      self.getGeoGrid(() => {
        self.getmaps();
        self.getCities();
        self.getRetailers();
      });
    },
    methods: {
      MapStoreData(el) {
        let self = this;
        let retVal = {
          planogram: "",
          sales_Retail: 0
        };
        if (el.retailerStores.length > 0) {
          el.retailerStores.forEach(e => {
            if (e.planogram_ID == self.selectedCategory) {
              retVal.sales_Retail += e.sales_Retail
              retVal.planogram = e.planogram
            }
          })
        }
        // retVal = el.retailerStores.map(item => ({
        //   planogram: item.planogram,
        //   planogram_ID: item.planogram_ID,
        //   retailerStore: item.retailerStore,
        //   sales_Retail: item.sales_Retail,
        //   store: item.sales_Retail,
        //   store_ID: item.store_ID,
        //   xCoordinate: item.xCoordinate,
        //   yCoordinate: item.yCoordinate,
        // })), "planogram"

        return retVal;
      },
      getSupplierStores() {
        let self = this
        Axios.defaults.headers.common["TenantID"] =
          sessionStorage.currentDatabase;

        let encoded_details = jwt.decode(sessionStorage.accessToken);

        Axios.get(
          process.env.VUE_APP_API +
          `SuplierLocationImportTX/ByUser?userID=${encoded_details.USER_ID}`
        ).then(r => {

          self.supplierImport = r.data
        })
      },
      getRectWidth() {
        let self = this
        var el = document.querySelector(
          "#thisone2 > div > svg > g > g:nth-child(2) > g:nth-child(1) > g:nth-child(2) > g:nth-child(1) > g:nth-child(2) > g:nth-child(1) > g > g:nth-child(1) > g > g:nth-child(3) > g > g > path"
        )
        self.imageHeight = el.getBoundingClientRect().height
        self.imageWidth = el.getBoundingClientRect().width




      },
      DrawGeoGrid(chart, callback) {
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
      },
      getGeoGrid(callback) {
        let self = this;
        Axios.defaults.headers.common["TenantID"] =
          sessionStorage.currentDatabase;

        let encoded_details = jwt.decode(sessionStorage.accessToken);

        Axios.get(
          process.env.VUE_APP_API + `SuplierLocationImportTX/GeoReport?userID=${encoded_details.USER_ID}`
        ).then(r => {
          console.log("getGeoGrid", r.data);

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
      submitSidebar() {
        let self = this;

        let tmp = {
          heatmap: [],
          piechart: [],
          sizeMap: [],
          retailerMap: []
        };

        let imageDetails = {
          imageType: "none",
          imgURL: self.MapImgURL,
          imageLinkAddress: null
        };

        let item = {
          heatMapRadius: self.radius,
          usePiecharts: self.usePiecharts,
          useHeatmap: self.useHeatmap,
          useSizeMap: self.useSizeMap,
          useRetailerMap: self.useRetailerMap,
          useImportStores: self.useImportStores,
          selectedPiechartItems: self.selectedPiechartItems,
          selectedHeatmapField: self.selectedHeatmapField,
          selectedSizeMapField: self.selectedSizeMapField,
          imageDetails: imageDetails,
          drawGrid: self.drawGrid,
          selectedRetailers: self.selectedRetailersFields
        };

        if (self.useSizeMap) {
          self.selectedSizeMapField.forEach(field => {
            tmp.sizeMap.push(self.fileData.basket[field]);
          });
          tmp.sizeMap.forEach(field => {
            field.graphArr = self.handelData(field, false);
          });
        }

        if (self.useHeatmap) {
          self.selectedHeatmapField.forEach(field => {
            tmp.heatmap.push(self.fileData.basket[field]);
          });
          tmp.heatmap.forEach(field => {
            field.graphArr = self.handelData(field, false);
          });
        }

        let pieArr = [];

        if (self.usePiecharts) {
          self.selectedPiechartItems.forEach(field => {
            tmp.piechart.push(self.fileData.basket[field]);
          });
          pieArr = self.handelPiechartData(tmp.piechart, true);
        }

        if (self.useRetailerMap) {
          self.selectedRetailersFields.forEach(field => {
            tmp.retailerMap.push(field);
          });
        }
        self.config = item;
        self.heatData = tmp;
        self.pieData = pieArr;

        self.drawMap(this.labels, item, tmp, pieArr);
      },
      getMapsetupMapData(callback) {
        let self = this
        let asd = []
        self.setupMapData = []

        self.clusters.forEach((e, idx) => {

          asd.push(self.fileData[e.value])
          var names = Object.getOwnPropertyNames(asd[0]);


          let obj = asd[idx]
          for (var item in obj) {
            let count = 0

            self.setupMapData.push({
              text: item,
              cluster: e.value
            })
            count++
          }
          let tmp = [];
          self.setupMapData.forEach(element => {
            if (element.cluster == "basket") {
              tmp.push(element);
            }
          });
          self.heatmapItems = tmp;
          self.piechartItems = tmp;
        })
        callback()
      },
      buildGraphArr(field, callback) {
        let self = this;

        Axios.defaults.headers.common["TenantID"] =
          sessionStorage.currentDatabase;

        Axios.get(
          process.env.VUE_APP_API + `RetailerStore?retailerID=${field}`
        ).then(r => {

          let tmp = r.data.retailerStoreList;
          tmp.forEach(e => {
            e.image =
              process.env.VUE_APP_API + `Retailer/Image?retailerID=${field}`;
          });

          callback(tmp);
        });
      },
      showSelector() {
        let self = this;

        self.getRectWidth()

        self.$refs.MapImageSelector.show(callback => {
          if (callback.name == "None") {
            self.lines = false;
            self.selectedmap = null;
            self.drawMap(
              this.labels, {
                useHeatmap: false,
                usePiecharts: false,
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
            if (callback.name == "Geogrid") {
              self.lines = true;
              if (self.config == null) {
                self.drawMap(
                  this.labels, {
                    useHeatmap: false,
                    usePiecharts: false,
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
                self.drawMap(
                  self.labels,
                  self.config,
                  self.heatData,
                  self.pieData
                );
              }
            } else {
              self.lines = false;

              self.selectedmap = callback.id;
              self.onMapChange();
            }
          }
        });
      },
      onMapChange() {
        let self = this;
        self.$nextTick(() => {
          self.MapImgURL =
            process.env.VUE_APP_API +
            `MapImage?mapImageID=${self.selectedmap}&type=map`;
          self.legendImgURL =
            process.env.VUE_APP_API +
            `MapImage?mapImageID=${self.selectedmap}&type=legend`;

          if (self.config == null) {
            self.drawMap(
              this.labels, {
                useHeatmap: false,
                usePiecharts: false,
                imageDetails: {
                  imageType: "none",
                  imgURL: self.MapImgURL,
                  imageLinkAddress: null
                }
              },
              null,
              null
            );
          } else {
            self.drawMap(self.labels, self.config, self.heatData, self.pieData);
          }
        });
      },
      getmaps() {
        let self = this;
        Axios.defaults.headers.common["TenantID"] =
          sessionStorage.currentDatabase;

        Axios.get(process.env.VUE_APP_API + `MapImage`).then(r => {
          self.maps = [];
          self.maps.push({
            text: "None",
            value: null
          });
          r.data.forEach(e => {
            self.maps.push({
              text: e.name,
              value: e.id
            });
          });
        });
      },
      getFile(callback) {
        let self = this;

        Axios.get(
          process.env.VUE_APP_API +
          `SystemFile/JSON?db=CR-Devinspire&folder=CLUSTER REPORT&file=REPORT`
        ).then(r => {
          callback(r.data);
        });
      },
      getUserFile(callback) {
        let self = this;

        Axios.get(
          process.env.VUE_APP_API +
          `SystemFile/JSON?db=CR-Devinspire&folder=SUPPLIER MARKET SHARE IMPORT/${self.SystemUser_ID}&file=REPORT`
        ).then(r => {
          callback(r.data);
        });
      },
      getFileData(id, callback) {
        let self = this;
        Axios.get(
          process.env.VUE_APP_API + `SystemFile/JSON?db=CR-Devinspire&id=${id}`
        ).then(r => {
          callback(r.data);
        });
      },
      plotStore(item) {
        let self = this;
        self.canplot = true;
        self.currentPlotStore = item;
      },
      openFileDialog() {
        let self = this;
        self.$refs.fileInput.value = null;
        self.$refs.fileInput.click();
      },
      onImageChange(e) {
        let self = this;
        const files = e.target.files;
        let file = files[0];
        self.blobToDataUrl(file, url => {
          self.imgURL = url;
        });
      },
      blobToDataUrl(blob, callback) {
        var a = new FileReader();
        a.onload = function () {
          callback(a.result);
        };
        a.readAsDataURL(blob);
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
            self.getMapsetupMapData(callback => {
              self.drawMap(
                this.labels, {
                  useHeatmap: false,
                  usePiecharts: false,
                  imageDetails: {
                    imageType: "none",
                    imgURL: null,
                    imageLinkAddress: null
                  }
                },
                null,
                null
              );
            })

          });
        });
      },
      openSetup() {
        let self = this;
        self.$refs.Mapsetup.open(self.setupMapData, callback => {
          let tmp = {
            heatmap: [],
            piechart: []
          };

          if (callback.useHeatmap) {
            callback.selectedHeatmapField.forEach(field => {
              tmp.heatmap.push(self.fileData.basket[field]);
            });
            tmp.heatmap.forEach(field => {
              field.graphArr = self.handelData(field, false);
            });
          }
          let pieArr = [];
          if (callback.usePiecharts) {
            callback.selectedPiechartItems.forEach(field => {
              tmp.piechart.push(self.fileData.basket[field]);
            });
            pieArr = self.handelPiechartData(tmp.piechart, true);
          }
          self.config = callback;
          self.heatData = tmp;
          self.pieData = pieArr;

          self.drawMap(this.labels, callback, tmp, pieArr);
        });
      },
      handelData(data, usePiechart) {
        let self = this;
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
                tmpBasket["sales"] = formatter.format(el.sales).replace("$", "R");

                tmpBasket["salesPercent"] = el.salesPercent;
              }
            });
          }
          let longLat = element.OfficeGPS.split(",");
          let long = parseFloat(longLat[1]);
          let lat = parseFloat(longLat[0]);
          tmpBasket["long"] = long;
          tmpBasket["lat"] = lat;
          final.push(tmpBasket);
        });
        final = removeDuplicates(final, "storeName");
        final.sort((a, b) => (a.salesPercent > b.salesPercent ? 1 : -1));
        self.maxHeatLegend = parseInt(final[0].sales);
        return final;
      },
      handelPiechartData(data, usePiechart) {
        let self = this;
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
          tmpBasket["pieData"] = [];
          tmpBasket["width"] = 100;
          tmpBasket["height"] = 100;
          final.push(tmpBasket);
        });
        final = removeDuplicates(final, "storeName");
        data.forEach((el, idx) => {
          final.forEach(finalStore => {
            el.data.forEach(store => {
              if (finalStore.storeName == store.displayname) {
                finalStore.pieData.push({
                  category: el.config.selectedBasket.basket,
                  value: store.sales,
                  color: self.color[idx]
                });
              }
            });
          });
        });

        return final;
      },
      drawPolygonseries(chart, screeWidth) {
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
      },
      drawRetailerMap(chart, mapData) {
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
            self.selectedRetailers.where;
            imageSeries.name = seriesName;
            imageSeries.data = callback;

            let imageSeriesTemplate = imageSeries.mapImages.template;
            imageSeriesTemplate.propertyFields.latitude = "xCoordinate";
            imageSeriesTemplate.propertyFields.longitude = "yCoordinate";
            imageSeriesTemplate.nonScaling = false;
            imageSeriesTemplate.fill = "black";
            let storeImage = imageSeriesTemplate.createChild(am4core.Image);
            storeImage.propertyFields.href = "image";
            storeImage.width = 15;
            storeImage.height = 15;
            storeImage.horizontalCenter = "middle";
            storeImage.verticalCenter = "bottom";
            storeImage.propertyFields.tooltipText = "name";
          });
        });
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
      },
      drawRetailerImport(chart, config) {
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
      },
      drawHeatMaps(chart, config, setupMapData) {
        // /////////////////////////////////////////////////////
        //  start draw configured heatmap series
        // /////////////////////////////////////////////////////
        let self = this;
        self.radius = parseInt(config.heatMapRadius);
        setupMapData.heatmap.forEach((heatmapItem, idx) => {
          let imageSeries = chart.series.push(new am4maps.MapImageSeries());
          // define template
          imageSeries.name = heatmapItem.config.selectedBasket.basket;
          imageSeries.data = heatmapItem.graphArr;
          imageSeries.dataFields.value = "sales";

          // if (type == 0) {
          let imageSeriesTemplate = imageSeries.mapImages.template;
          imageSeriesTemplate.propertyFields.latitude = "lat";
          imageSeriesTemplate.propertyFields.longitude = "long";
          imageSeriesTemplate.nonScaling = false;
          imageSeriesTemplate.fill = chart.colors.getIndex(1);

          var circle = imageSeriesTemplate.createChild(am4core.Circle);
          circle.fillOpacity = 0.5;
          circle.tooltipText = heatmapItem + "{storeName}: [bold]{sales}[/]";
          circle.radius = self.radius + idx;

          imageSeries.heatRules.push({
            property: "fill",
            target: circle,
            min: chart.colors.getIndex(11).brighten(1),
            max: chart.colors.getIndex(11).brighten(-1)
          });
          // imageSeries.heatRules.push({
          //     property: "radius",
          //     target: circle,
          //     min: 8,
          //     max: 15
          // });
          if (idx == 0) {
            let heatLegend = chart.createChild(am4maps.HeatLegend);
            heatLegend.series = imageSeries;
            heatLegend.align = "right";
            heatLegend.width = am4core.percent(25);
            heatLegend.marginRight = am4core.percent(4);
            heatLegend.minValue = 0;
            heatLegend.maxValue = self.maxHeatLegend;
            heatLegend.valign = "bottom";
          }

        });

      },
      drawSizeMaps(chart, config, setupMapData) {
        // /////////////////////////////////////////////////////
        //  start draw configured sizemap series
        // /////////////////////////////////////////////////////
        let self = this;

        self.radius = parseInt(config.heatMapRadius);
        setupMapData.sizeMap.forEach((heatmapItem, idx) => {
          let imageSeries = chart.series.push(new am4maps.MapImageSeries());
          // define template
          imageSeries.name = heatmapItem.config.selectedBasket.basket;
          imageSeries.data = heatmapItem.graphArr;
          imageSeries.dataFields.value = "sales";

          // if (type == 0) {
          let imageSeriesTemplate = imageSeries.mapImages.template;
          imageSeriesTemplate.propertyFields.latitude = "lat";
          imageSeriesTemplate.propertyFields.longitude = "long";
          imageSeriesTemplate.nonScaling = false;
          imageSeriesTemplate.fill = chart.colors.getIndex(11).brighten(1);

          var circle = imageSeriesTemplate.createChild(am4core.Circle);
          circle.fillOpacity = 0.5;
          circle.tooltipText = heatmapItem + "{storeName}: [bold]{sales}[/]";
          circle.radius = self.radius + idx;

          // imageSeries.heatRules.push({
          //     property: "fill",
          //     target: circle,
          //     min: chart.colors.getIndex(11).brighten(1),
          //     max: chart.colors.getIndex(11).brighten(-1)
          // });
          imageSeries.heatRules.push({
            property: "radius",
            target: circle,
            min: 8,
            max: 15
          });
          // let heatLegend = chart.createChild(am4maps.HeatLegend);
          // heatLegend.series = imageSeries;
          // heatLegend.align = "right";
          // heatLegend.width = am4core.percent(25);
          // heatLegend.marginRight = am4core.percent(4);
          // heatLegend.minValue = 0;
          // heatLegend.maxValue = self.maxHeatLegend;
          // heatLegend.valign = "bottom";
        });
      },
      drawPiecharts(chart, piechartArray) {
        let self = this;
        // /////////////////////////////////////////////////////
        // start Draw of configured piecharts
        // /////////////////////////////////////////////////////
        let pieSeries = chart.series.push(new am4maps.MapImageSeries());
        let pieTemplate = pieSeries.mapImages.template;
        pieTemplate.propertyFields.latitude = "lat";
        pieTemplate.propertyFields.longitude = "long";
        pieTemplate.nonScaling = true;

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

        let pieSeriesTemplate = pieChartTemplate.series.push(
          new am4charts.PieSeries()
        );
        pieSeriesTemplate.dataFields.category = "category";
        pieSeriesTemplate.dataFields.value = "value";
        pieSeriesTemplate.slices.template.propertyFields.fill = "color";

        pieSeriesTemplate.slices.template.stroke = am4core.color("#fff");
        pieSeriesTemplate.slices.template.strokeWidth = 1;
        pieSeriesTemplate.slices.template.strokeOpacity = 1;
        pieSeriesTemplate.labels.template.disabled = true;

        pieSeries.nonScalingStroke = false;
        pieSeries.name = "Pie Charts";
        pieSeries.data = piechartArray;
      },
      drawGridLines(chart) {
        let self = this;
        // /////////////////////////////////////////////////////
        // start Draw of Line grid
        // /////////////////////////////////////////////////////
        let graticuleSeries = chart.series.push(new am4maps.GraticuleSeries());
        graticuleSeries.mapLines.template.line.strokeOpacity = 0.4;
        graticuleSeries.longitudeStep = 0.5;
        graticuleSeries.latitudeStep = 0.5;
        graticuleSeries.name = "lines";
        let accrossCitiesImageSeries = chart.series.push(
          new am4maps.MapImageSeries()
        );
        accrossCitiesImageSeries.data = self.acrossArr;
        let accrossCitiesImageSeriesTemplate =
          accrossCitiesImageSeries.mapImages.template;
        accrossCitiesImageSeriesTemplate.propertyFields.latitude = "latitude";
        accrossCitiesImageSeriesTemplate.propertyFields.longitude = "longitude";
        accrossCitiesImageSeriesTemplate.nonScaling = false;
        accrossCitiesImageSeriesTemplate.fill = "black";

        var accrossCitiesCircle = accrossCitiesImageSeriesTemplate.createChild(
          am4core.Circle
        );
        accrossCitiesCircle.fillOpacity = 0.5;
        accrossCitiesCircle.tooltipText = "{city}: [bold]{text}[/]";
        accrossCitiesCircle.radius = 0;
        let accrossCitiesLabel = accrossCitiesImageSeriesTemplate.createChild(
          am4core.Label
        );
        accrossCitiesLabel.text = "{text}";
        ('<a style="background-color: black;color: white;font-size:1px" >{text}</a>');
        accrossCitiesLabel.fontSize = 10;
        accrossCitiesLabel.nonScaling = false;
      },
      drawMap(labelState, config, setupMapData, piechartArray) {
        let self = this;
        self.$refs.Spinner.show()
        // //////////////////////////////////////////////////
        // start draw of base chart
        // //////////////////////////////////////////////////
        let screeWidth = returnInnerWidth();
        let formattedData = [];
        let chart = am4core.create("thisone2", am4maps.MapChart);
        chart.name = "Map";
        chart.projection = new am4maps.projections.Miller();
        var title = chart.titles.create();
        title.text = "[bold font-size: 20]Store Sales Heatmap[/]";
        title.textAlign = "middle";
        // self.rowData.forEach((element, idx) => {
        //     element["color"] = '#424242'
        //     formattedData.push(element);
        // });

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

        self.drawPolygonseries(chart, screeWidth);
        self.drawMajorCitiesImageSeries(chart);
        self.drawMinorCities(chart);
        // draw standard supplier import
        if (config.useImportStores) {
          // drawing imported stores
          let imageSeries = chart.series.push(new am4maps.MapImageSeries());
          imageSeries.name = "Import stores";
          imageSeries.data = self.supplierImport;
          imageSeries.dataFields.value = "sales";
          let imageSeriesTemplate = imageSeries.mapImages.template;
          imageSeriesTemplate.propertyFields.latitude = "yCoordinate";
          imageSeriesTemplate.propertyFields.longitude = "xCoordinate";
          imageSeriesTemplate.nonScaling = false;
          imageSeriesTemplate.fill = chart.colors.getIndex(9).brighten(1);
          var circle = imageSeriesTemplate.createChild(am4core.Circle);
          circle.fillOpacity = 0.5;
          circle.tooltipText = "{storeName}: [bold]{sales}[/]";
          circle.radius = 2;
        }


        if (
          config.selectedRetailers != undefined &&
          config.selectedRetailers.length > 0
        ) {
          self.drawRetailerImport(chart, config);
        }
        if (config.useHeatmap) {
          self.drawHeatMaps(chart, config, setupMapData);
        }
        if (config.usePiecharts) {
          self.drawPiecharts(chart, piechartArray);
        }
        if (config.useSizeMap) {
          self.drawSizeMaps(chart, config, setupMapData);
        }
        // self.drawGridLines(chart)
        // if (self.lines) {
        //     self.drawGridLines(chart)
        // }

        if (self.useRetailerMap) {
          self.drawRetailerMap(chart, setupMapData.retailerMap);
        }
        // /////////////////////////////////////////////////////
        // event for plotting stores mostly used for debug
        // /////////////////////////////////////////////////////
        chart.seriesContainer.events.on("hit", function (ev) {
          var coords = chart.svgPointToGeo(ev.svgPoint);

          if (!self.canPlot) {
            return;
          }
          if (ev.preventDefault != undefined) ev.preventDefault();
          if (ev.stopPropagation != undefined) ev.stopPropagation();
          self.$refs.yesNo.show(
            "Would you like to make a tag here?",
            goThrough => {
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
                // //////////////////////
                // todo set Store plot data
                // self.currentPlotStore= click event data
                // //////////////////////
                marker.latitude = coords.latitude;
                marker.longitude = coords.longitude;
                marker.events.on("rightclick", function (dataItem, ev) {
                  if (dataItem.hidden) marker.show(dataItem.index);
                  else marker.hide(dataItem.index);
                  event.stopPropagation();
                });
              }
            }
          );
        });
        // /////////////////////////////////////////////////////

        // /////////////////////////////////////////////////////
        // start Draw of map legend
        // /////////////////////////////////////////////////////
        let linkContainer = chart.createChild(am4core.Container);
        linkContainer.isMeasured = false;
        linkContainer.layout = "horizontal";
        linkContainer.x = am4core.percent(0);
        linkContainer.y = am4core.percent(0);

        chart.legend = new am4maps.Legend();
        chart.legend.margin(10, 10, 10, 20);
        chart.legend.background.fill = am4core.color("#fff");
        chart.legend.background.fillOpacity = 0.6;
        chart.legend.padding(5, 10, 15, 10);
        chart.legend.position = "right";
        chart.legend.valign = "top";
        let legendLength = chart.legend.data.length;

        if (config.drawGrid) {
          self.DrawGeoGrid(chart, callback => {
            // chart.legend.data.forEach((e, idx) => {
            //   if (e.name == undefined) {
            //     chart.legend.data.splice(idx, 1);
            //   }
            // })

            // chart.legend.data.splice(
            //   legendLength,
            //   chart.legend.data.length - legendLength
            // );
          });
        }
        self.$refs.Spinner.hide()
      },
      testKak(rowData) {
        let self = this;

        let alpharray = [
          "A",
          "B",
          "C",
          "D",
          "E",
          "F",
          "G",
          "H",
          "I",
          "J",
          "K",
          "L",
          "M",
          "N",
          "O",
          "P",
          "Q",
          "R",
          "S",
          "T",
          "U",
          "V",
          "W",
          "X",
          "Y",
          "Z",
          "AA",
          "AB",
          "AC",
          "AD",
          "AE",
          "AF",
          "AG",
          "AH"
        ];

        let latBetween = 25.5;
        let lowestLat = -34.87;
        let highestLat = -22.14;

        let longBetween = 33;
        let lowestLong = 16.5;
        let highestLong = 32.91;

        let latIncr = (highestLat - lowestLat) / latBetween;
        let longIncr = (highestLong - lowestLong) / longBetween;

        let latCount = highestLat;
        let latIDX = 0;

        let lats = {};

        let acrossArr = [];
        let sideArr = [];

        while (latCount >= lowestLat) {
          let allLatsBetween = [];

          acrossArr.push({
            latitude: latCount,
            longitude: 16.260933711249336,
            text: latIDX + 1
          });

          rowData.forEach(el => {
            if (el.lat < latCount && el.lat + latIncr > latCount)
              allLatsBetween.push(el);
          });

          if (allLatsBetween.length > 0) lats[latIDX + 1] = allLatsBetween;

          latCount -= latIncr;
          latIDX++;
        }

        let longCount = lowestLong;
        let longIDX = 0;

        let longs = {};

        while (longCount <= highestLong) {
          let allLongsBetween = [];

          acrossArr.push({
            latitude: -21.922142292657245,
            longitude: longCount,
            text: alpharray[longIDX]
          });

          rowData.forEach(el => {
            if (el.long < longCount && el.long + longIncr > longCount)
              allLongsBetween.push(el);
          });

          if (allLongsBetween.length > 0) longs[longIDX] = allLongsBetween;

          longCount += longIncr;
          longIDX++;
        }

        let final = {};

        for (var long in longs) {
          let longArr = longs[long];

          longArr.forEach(lon => {
            for (var lat in lats) {
              let latArr = lats[lat];

              latArr.forEach(latt => {
                let elName = alpharray[long] + lat;
                let arr = final[alpharray[long] + lat];

                if (arr == undefined) {
                  final[elName] = [];
                }

                if (lon.storeName == latt.storeName) final[elName].push(latt);
              });
            }
          });
        }
        let finalFinal = {};
        for (var prop in final) {
          if (final[prop].length > 0) {
            finalFinal[prop] = final[prop];
          }
        }
        self.setGeogridData(finalFinal);
        self.acrossArr = acrossArr;
      },
      formatNumber(storeSales, totalSales) {
        let string = ""
        if (storeSales > 0 && totalSales != 0) {
          string = ((storeSales / totalSales) * 100).toFixed(2)
          string += "%"
        }
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
      cw = 488.35;
      offsetX = 1.6;
    }

    if (width > 1439) {
      cw = 737.05;
      offsetX = 3.1;
    }

    if (width > 1599) {
      cw = 737.05;
      offsetX = 2.4;
    }

    if (width > 1768) {
      cw = 841.05;
      offsetX = 2.22;
    }

    if (width > 2559) {
      cw = 966.53;
      offsetX = 1.566;
    }

    return {
      width: cw,
      offsetX: offsetX
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
    /* width: 1600px; */
    width: 100%;
    background-color: #cccccc;
    float: left;
  }

  .mapContainer {
    display: inline-flex;
    width: 100%;
  }

  .sideBar {
    float: right;
    width: 17%;
  }

  /* @media screen and (min-width:1280px) {
        .map {
            width: 1000px;
        }

        .sideBar {

            width: calc(100vw - 1000px)
        }
    }

    @media screen and (min-width:1366px) {
        .map {
            width: 1100px;
        }

        .sideBar {

            width: calc(100vw - 1100px)
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

    @media screen and (min-width:2560px) {
        .map {
            width: 2200px;
        }

        .sideBar {

            width: calc(100vw - 2200px)
        }
    } */
</style>