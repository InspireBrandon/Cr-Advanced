<template>
  <div class="ranging">
    <v-toolbar dense dark color="grey darken-3">

      <v-toolbar-items v-if="!$route.path.includes('RangePlanningView')">
        <v-menu dark offset-y style="margin-bottom: 10px;">
          <v-btn slot="activator" flat>
            File
          </v-btn>
          <v-list>
            <v-list-tile @click="newRange">
              <v-list-tile-title>New</v-list-tile-title>
            </v-list-tile>
            <v-list-tile @click="openRange">
              <v-list-tile-title>Open</v-list-tile-title>
            </v-list-tile>
            <v-list-tile :disabled="fileData.planogramName == ''" @click="promptForTag">
              <v-list-tile-title>Save</v-list-tile-title>
            </v-list-tile>
            <v-list-tile :disabled="fileData.planogramName == ''" @click="refreshRange">
              <v-list-tile-title>Refresh Range</v-list-tile-title>
            </v-list-tile>
            <v-divider></v-divider>
            <v-list-tile :disabled="fileData.planogramID == ''" @click="closeRange">
              <v-list-tile-title>Close</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
        <v-menu dark offset-y style="margin-bottom: 10px;">
          <v-btn slot="activator" flat>
            Options
          </v-btn>
          <v-list>
            <v-list-tile @click="fitColumns">
              <v-list-tile-title>Fit Columns</v-list-tile-title>
            </v-list-tile>
            <!-- <v-list-tile @click="saveRange">
              <v-list-tile-title>Save</v-list-tile-title>
            </v-list-tile> -->
          </v-list>
        </v-menu>
        <v-menu dark offset-y style="margin-bottom: 10px;">
          <v-btn slot="activator" flat>
            Database
          </v-btn>
          <v-list>
            <v-list-tile :disabled="rowData.length < 1" @click="updateStoreIndicators">
              <v-list-tile-title>Update Indicators</v-list-tile-title>
            </v-list-tile>
            <v-list-tile :disabled="rowData.length < 1" @click="updateProductDetails">
              <v-list-tile-title>Update Product Details</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
        <v-menu v-if="selectedClusterOption != null" dark offset-y style="margin-bottom: 10px;">
          <v-btn slot="activator" flat>
            View
          </v-btn>
          <v-list>
            <v-list-tile :disabled="selectedClusterOption == null" @click="setViewType('CLUSTER')">
              <v-list-tile-title>Cluster</v-list-tile-title>
            </v-list-tile>
            <v-list-tile :disabled="selectedClusterOption == null" @click="setViewType('STORE')">
              <v-list-tile-title>Store</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
        <v-menu v-if="rowData.length > 0" dark offset-y style="margin-bottom: 10px;">
          <v-btn slot="activator" flat>Configure</v-btn>
          <v-list>
            <v-list-tile :disabled="selectedClusterOption == null" @click="openAutoRangeModal">
              <v-list-tile-title>Auto Range</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-toolbar-items>

      <v-spacer></v-spacer>

      <span v-if="generateFileName() != ' Average Monthly To '">{{ generateFileName() + " " + fileData.tag }}</span>

      <v-spacer></v-spacer>

      <v-toolbar-title>
        <span>Range Planning</span>
        <HelpFileViewer style="margin-left: 10px;" component="Ranging"></HelpFileViewer>
      </v-toolbar-title>
    </v-toolbar>
    <div fluid grid-list-lg>
      <v-layout row wrap>
        <v-toolbar dark>
          <!-- <v-layout row wrap v-if="gotData"> -->
          <v-toolbar-items v-if="gotData">
            <v-select style="margin-left: 10px; margin-top: 8px; width: 200px" placeholder="Select cluster type"
              @change="onClusterTypeChange" dense :items="clusterTypes" v-model="selectedClusterType" hide-details>
            </v-select>

            <v-select style="margin-left: 10px; margin-top: 8px; width: 200px" @change="onClusterOptionChange"
              v-if="selectedClusterType != null" :placeholder="'Select ' + selectedClusterType + ' cluster'" dense
              :items="clusterOptions[selectedClusterType]" v-model="selectedClusterOption" hide-details>
            </v-select>

            <span style="margin-left: 30px; margin-top: 30px; " v-show="storesInCluster > -1">{{ storesInCluster }}
              Stores </span>
            <span v-show="getItemsToAudit() > 0"
              style="font-weight: bold; color: red;margin-left: 10px; margin-top: 30px;"> - {{ getItemsToAudit() }}
              product(s) need auditing</span>

          </v-toolbar-items>
          <v-spacer></v-spacer>
          <div v-show="storesInCluster > -1">
            <h4>Active Items Selected</h4>
            <div>Sales: R{{ (ais_Sales < 0 ? (ais_Sales * -1) : ais_Sales) }}</div>
            <div>Sales Potential: R{{ (ais_SalesPotential < 0 ? (ais_SalesPotential * -1) : ais_SalesPotential) }}</div>
          </div>
          <v-spacer></v-spacer>
          <v-btn v-if="rowData.length>0" @click="openReport" color="primary" small dark>Report</v-btn>
          <v-btn v-if="rowData.length>0" @click="onChart1" color="primary" small dark>graphs</v-btn>
          <v-btn  @click="openParetoModal" color="primary" small dark>Pareto</v-btn>
         
          <v-menu offset-y>
            <v-btn :disabled="selectedItems.length == 0" slot="activator" color="primary" small dark>Set Indicator
            </v-btn>
            <v-list dark>
              <v-list-tile @click="setIndicator('YES')">
                <v-list-tile-title>YES</v-list-tile-title>
              </v-list-tile>
              <v-list-tile @click="setIndicator('NO')">
                <v-list-tile-title>NO</v-list-tile-title>
              </v-list-tile>
              <v-list-tile @click="setSelectedStores">
                <v-list-tile-title>SELECTED</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
          <!-- <v-flex lg4 md4 style="margin-top: 15px;">
             
            </v-flex> -->
          <!-- <v-flex lg2 md-and-down></v-flex> -->
          <!-- <v-flex lg4 md2 style="text-align: right;"> -->

          <!-- </v-flex> -->
          <!-- </v-layout> -->
        </v-toolbar>
        <ag-grid-vue :gridOptions="gridOptions" :sideBar='true' style="width: 100%;  height: calc(100vh - 220px);"
          :defaultColDef="defaultColDef" class="ag-theme-balham" :columnDefs="columnDefs"
          @selection-changed="onSelectionChanged" :rowData="rowData" :enableSorting="true" :enableFilter="true"
          :suppressRowClickSelection="true" :enableRangeSelection="true" rowSelection="multiple" :rowDeselection="true"
          :enableColResize="true" :floatingFilter="true" :onGridReady="onGridReady" :groupMultiAutoColumn="true">
        </ag-grid-vue>
        <v-toolbar dark dense class="pa-0">
          <div>
            <span>{{ rowData.length }} Rows</span>
          </div>
          <div style="margin-left: 10px;">
            <span>{{ selectedItems.length }} Selected</span>
          </div>
        </v-toolbar>
      </v-layout>
      <v-dialog v-model="ShowGraph">
        <v-card>
          <v-toolbar>
            <v-toolbar-title>
              graph
            </v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <div id="myGroupedBar1" class="ag-theme-balham-dark my-chart chart"></div>
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>
    <PlanogramSelector ref="planogramSelector"></PlanogramSelector>
    <Spinner ref="spinner"></Spinner>
    <StoreIndicatorSelector ref="storeIndicatorSelector"></StoreIndicatorSelector>
    <DateRangeSelector ref="dateRangeSelector"></DateRangeSelector>
    <RangeSelectorModal ref="rangeSelectorModal"></RangeSelectorModal>
    <Snackbar ref="snackbar"></Snackbar>
    <Prompt ref="prompt"></Prompt>
    <Dialog ref="dialog"></Dialog>
    <YesNoModal ref="yesNo"></YesNoModal>
    <ProductMaintModal ref="productMaint"></ProductMaintModal>
    <!-- <ProductListing ref="productListing"></ProductListing> -->
    <SizeLoader ref="SizeLoader" />
    <AutoRangeModal ref="AutoRangeModal" />
    <RangingReportModal ref="RangingReportModal" />
    <GraphConfigurationModal ref="GraphConfigurationModal" />
    <ParetoModal ref="ParetoModal" />
  </div>
</template>

<script>
  function GroupedBar(params) {
    let self = this;

    self.cellRange = {
      columns: params.columns
    }

    self.chartType = 'groupedBar';
    self.chartContainer = params.chartContainer;
    self.suppressChartRanges = params.suppressChartRanges;
    self.aggregate = params.aggregate;
  }
  var firstGroupedBar;

  import SoftwareToolbar from "@/components/Common/SoftwareToolbar"
  import PlanogramSelector from '@/components/Common/PlanogramSelector';
  import DateRangeSelector from '@/components/Common/DateRangeSelector';
  import StoreIndicatorSelector from '@/components/Common/StoreIndicatorSelector';
  import RangeSelectorModal from '@/components/Common/RangeSelectorModal';
  import Spinner from '@/components/Common/Spinner';
  import RangingController from './ranging-controller';
  import HelpFileViewer from '@/components/Main/HelpFile/HelpFileViewer'
  import Snackbar from '@/components/Common/Snackbar';
  import Prompt from '@/components/Common/Prompt';
  import YesNoModal from '@/components/Common/YesNoModal'
  import ProductMaintModal from '@/components/Main/DataPreparation/Views/ImagePreparation/ProductMaintModal'
  import ProductListing from '@/components/Apps/RangePlanning/ProductListing/Index'
  import SizeLoader from '@/components/Common/SizeLoader';
  import AutoRangeModal from './AutoRangeModal.vue';
  import RangingReportModal from './RangingReportModal.vue'
  import GraphConfigurationModal from './GraphConfigurationModal.vue'
  import ParetoModal from './ParetoModal.vue'
  

  import {
    AgGridVue
  } from "ag-grid-vue";
  import Axios from "axios"
  import optionsComponent from "./button.vue"

  function textValue(data) {
    let self = this;
    self.text = data.clusterName;
    self.value = data.clusterID;
  }

  export default {
    name: 'Ranging',
    components: {
      ParetoModal,
      SizeLoader,
      YesNoModal,
      ProductMaintModal,
      SoftwareToolbar,
      AgGridVue,
      PlanogramSelector,
      Spinner,
      StoreIndicatorSelector,
      DateRangeSelector,
      RangeSelectorModal,
      Snackbar,
      Prompt,
      optionsComponent,
      HelpFileViewer,
      ProductListing,
      AutoRangeModal,
      RangingReportModal,
      GraphConfigurationModal
    },
    data() {
      return {
        ShowGraph: false,
        isAdd: true,
        rangingController: null,
        storesInCluster: -1,
        viewType: 'CLUSTER',
        planogramName: "",
        columnDefs: [],
        rowData: [],
        gridOptions: {
          enableCharts: true,
          enableRangeSelection: true,
          context: {
            componentParent: this
          },
          // rowClassRules: {
          //   'audit-image-breach': 'data.imageAudit'
          // },
          rowClassRules: {
            'audit-image-breach': function (params) {

            },
            'auto-range-item': function (params) {
              return params.data.autoRangeItem == undefined ? false : params.data.autoRangeItem;
            }
          },
        },
        autoRangeData: {
          sales_index: 100,
          profit_index: 100,
          volume_index: 100,
          sales: 80,
          volume: 80,
          profit: 80,
          potential_sales: 80,
          potential_volume: 80,
          potential_profit: 80,
          audit: false
        },
        gotData: false,
        defaultColDef: {
          onCellValueChanged: this.onCellValueChanged
        },
        selectedClusterType: null,
        clusterTypes: [{
            text: "All Stores Cluster",
            value: "allStores"
          },
          {
            text: "Store Cluster",
            value: "store"
          },
          {
            text: "Category Cluster",
            value: "category"
          },
          {
            text: "Department Cluster",
            value: "department"
          },
          {
            text: "Regional Cluster",
            value: "regional"
          },
          {
            text: "Custom Cluster",
            value: "custom"
          }
        ],
        selectedClusterOption: 'allStores',
        clusterOptions: {
          allStores: [],
          category: [],
          custom: [],
          department: [],
          regional: [],
          store: []
        },
        selectedPlanogram: null,
        selectedDateRange: null,
        selectedItems: [],
        fileData: {
          planogramName: "",
          planogramID: "",
          dateFrom: "",
          dateTo: "",
          dateFromString: "",
          dateToString: "",
          periodic: false,
          monthsBetween: 0,
          tag: "",
          active_Shop_Code_ID: 0
        },
        canRefresh: false,
        tmpString: "",
        ais_Sales: 0,
        ais_SalesPotential: 0,
        periodData: []
      }
    },
    created() {
      let self = this;
      self.gridOptions.context.componentParent = this;
      self.gridOptions.popupParent = document.body;
      self.getColumnDefenitions();
      self.checkparams()
    },
    methods: {
      openParetoModal(){
        let self = this
        self.$refs.ParetoModal.open()
      },
      checkparams() {
        let self = this
        if (self.$route.params != null) {
          Axios.get(process.env.VUE_APP_API + `SystemFile/JSON?db=CR-Devinspire&id=${self.$route.params.rangeFileID}`)
            .then(r => {
              self.fileData.planogramName = r.data.planogramName;
              self.fileData.planogramID = r.data.planogramID;
              self.fileData.dateFrom = r.data.dateFrom;
              self.fileData.dateTo = r.data.dateTo;
              self.fileData.dateFromString = r.data.dateFromString;
              self.fileData.dateToString = r.data.dateToString;
              self.fileData.periodic = r.data.periodic;
              self.fileData.monthsBetween = r.data.monthsBetween;
              self.fileData.tag = r.data.tag;
              self.fileData.active_Shop_Code_ID = r.data.active_Shop_Code_ID;

              self.canRefresh = true;

              self.rangingController = new RangingController(r.data);

              self.rangingController.getSalesMonthlyTotals(() => {
                self.setRangingClusterData(r.data.clusterData);
                if (self.selectedClusterType != null && self.selectedClusterOption != null) {
                  self.rowData = self.rangingController.getSalesDataByCluster(self.selectedClusterType, self
                    .selectedClusterOption);

                  self.ais_Sales = 0;
                  self.ais_SalesPotential = 0;

                  self.rowData.forEach(el => {
                    if (el.store_Range_Indicator == "YES") {
                      self.ais_Sales = (parseFloat(self.ais_Sales) + parseFloat(el.sales_Retail)).toFixed(2);
                      self.ais_SalesPotential = (parseFloat(self.ais_SalesPotential) + parseFloat(el
                        .sales_potential)).toFixed(2);
                    }
                  })

                  self.fitColumns();
                }
                self.$refs.spinner.hide();
                self.gotData = true
              })
            })

        }
      },
      onGridReady(params) {
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
      },
      openEdit(product) {
        let self = this

        this.$refs.productMaint.show({
          isAdd: false,
          formData: product.data,
          afterClose: function (newData) {

            self.$refs.spinner.show();

            for (var prop in newData) {
              product.data[prop] = newData[prop]; // todo: set grid data(dropdowns)
            }

          }
        })
      },
      newRange() {
        let self = this;

        self.isAdd = true;

        self.canRefresh = false;

        self.$refs.planogramSelector.show(false, planogram => {

          self.selectedPlanogram = planogram;

          self.$refs.dateRangeSelector.show(dateRange => {

            self.selectedDateRange = dateRange;
            self.$refs.spinner.show();

            self.fileData.planogramName = planogram.displayname;
            self.fileData.planogramID = planogram.planogram_ID;
            self.fileData.dateFrom = dateRange.dateFrom;
            self.fileData.dateTo = dateRange.dateTo;
            self.fileData.dateFromString = dateRange.dateFromString;
            self.fileData.dateToString = dateRange.dateToString;
            self.fileData.periodic = dateRange.periodic;
            self.fileData.monthsBetween = dateRange.monthsBetween;
            self.fileData.tag = "";

            Axios.get(process.env.VUE_APP_API +
                `RangingAdvanced?planogramID=${planogram.planogram_ID}&dateFromID=${dateRange.dateFrom}&dateToID=${dateRange.dateTo}`
              )
              .then(r => {
                self.rangingController = new RangingController(r.data);

                self.rangingController.getSalesMonthlyTotals(() => {
                  self.setRangingClusterData(r.data.clusterData);
                  if (self.selectedClusterType != null && self.selectedClusterOption != null) {
                    self.rowData = self.rangingController.getSalesDataByCluster(self.selectedClusterType,
                      self
                      .selectedClusterOption);

                    self.ais_Sales = 0;
                    self.ais_SalesPotential = 0;

                    self.rowData.forEach(el => {
                      if (el.store_Range_Indicator == "YES") {
                        self.ais_Sales = (parseFloat(self.ais_Sales) + parseFloat(el.sales_Retail))
                          .toFixed(
                            2);
                        self.ais_SalesPotential = (parseFloat(self.ais_SalesPotential) + parseFloat(el
                          .sales_potential)).toFixed(2);
                      }
                    })

                    self.fitColumns();
                  }
                  self.$refs.spinner.hide();
                  self.gotData = true
                })
              })
          })
        })
      },
      newProductListing() {
        let self = this;
        self.$refs.productListing.show();
      },
      updateLoader(data) {
        let self = this
        self.$refs.SizeLoader.updateLoader(data)
      },
      openRange() {
        let self = this;
        var startTime = new Date()
        self.isAdd = false;
        let config = {
          onDownloadProgress: progressEvent => {
            var currentFileSize = progressEvent.loaded * 0.000001
            var FileTotalSize = progressEvent.total * 0.000001

            var TIME_TAKEN = new Date().getTime() - startTime.getTime()
            var DownloadSpeed = currentFileSize / (TIME_TAKEN / 1000)
            self.updateLoader({
              text1: "Downloading Range",
              currentFileSize: currentFileSize,
              FileTotalSize: FileTotalSize,
              DownloadSpeed: DownloadSpeed,
            })
          }
        }
        self.$refs.rangeSelectorModal.show(fileID => {
          self.$refs.SizeLoader.show()
          Axios.get(process.env.VUE_APP_API + `SystemFile/JSON?db=CR-Devinspire&id=${fileID}`, config)
            .then(r => {
              console.log(r.data);

              self.fileData.planogramName = r.data.planogramName;
              self.fileData.planogramID = r.data.planogramID;
              self.fileData.dateFrom = r.data.dateFrom;
              self.fileData.dateTo = r.data.dateTo;
              self.fileData.dateFromString = r.data.dateFromString;
              self.fileData.dateToString = r.data.dateToString;
              self.fileData.periodic = r.data.periodic;
              self.fileData.monthsBetween = r.data.monthsBetween;
              self.fileData.tag = r.data.tag;
              self.fileData.active_Shop_Code_ID = r.data.active_Shop_Code_ID;

              self.canRefresh = true;

              self.rangingController = new RangingController(r.data);

              self.rangingController.getSalesMonthlyTotals(() => {

                self.setRangingClusterData(r.data.clusterData);
                if (self.selectedClusterType != null && self.selectedClusterOption != null) {
                  self.rowData = self.rangingController.getSalesDataByCluster(self.selectedClusterType, self
                    .selectedClusterOption);

                  self.ais_Sales = 0;
                  self.ais_SalesPotential = 0;

                  self.rowData.forEach(el => {
                    if (el.store_Range_Indicator == "YES") {
                      self.ais_Sales = (parseFloat(self.ais_Sales) + parseFloat(el.sales_Retail)).toFixed(
                        2);
                      self.ais_SalesPotential = (parseFloat(self.ais_SalesPotential) + parseFloat(el
                        .sales_potential)).toFixed(2);
                    }
                  })

                  self.fitColumns();
                }
                self.$refs.SizeLoader.close()
                self.gotData = true
              })
            })
        })
      },
      closeRange() {
        let self = this;
        self.rowData = [];
        self.selectedPlanogram = null;
        self.selectedDateRange = null;
        self.selectedItems = [];
        self.gotData = false;
      },
      refreshRange() {
        let self = this;

        self.$refs.dateRangeSelector.show(dateRange => {

          self.fileData.dateFrom = dateRange.dateFrom;
          self.fileData.dateTo = dateRange.dateTo;
          self.fileData.dateFromString = dateRange.dateFromString;
          self.fileData.dateToString = dateRange.dateToString;
          self.fileData.periodic = dateRange.periodic;
          self.fileData.monthsBetween = dateRange.monthsBetween;

          self.$refs.spinner.show();
          Axios.get(process.env.VUE_APP_API +
              `RangingAdvanced?planogramID=${self.fileData.planogramID}&dateFromID=${self.fileData.dateFrom}&dateToID=${self.fileData.dateTo}`
            )
            .then(r => {
              r.data["dateFrom"] = self.fileData.dateFrom;
              r.data["dateTo"] = self.fileData.dateTo;

              self.rangingController = new RangingController(r.data);

              self.rangingController.getSalesMonthlyTotals(() => {
                self.setRangingClusterData(r.data.clusterData);
                if (self.selectedClusterType != null && self.selectedClusterOption != null) {
                  self.rowData = self.rangingController.getSalesDataByCluster(self.selectedClusterType, self
                    .selectedClusterOption);

                  self.ais_Sales = 0;
                  self.ais_SalesPotential = 0;

                  self.rowData.forEach(el => {
                    if (el.store_Range_Indicator == "YES") {
                      self.ais_Sales = (parseFloat(self.ais_Sales) + parseFloat(el.sales_Retail)).toFixed(
                        2);
                      self.ais_SalesPotential = (parseFloat(self.ais_SalesPotential) + parseFloat(el
                        .sales_potential)).toFixed(2);
                    }
                  })

                  self.fitColumns();
                }
                self.$refs.spinner.hide();
                self.gotData = true
              })
            })
        })
      },
      getColumnDefenitions() {
        let self = this;
        return new Promise((resolve, reject) => {
          try {
            self.columnDefs = require('./headers.json');

            if (self.columnDefs[self.columnDefs.length - 1].headerName != "Options") {
              self.columnDefs.push({
                headerName: 'Options',
                field: 'barcode',
                cellRendererFramework: 'optionsComponent',
                pinned: 'right'
              })
            }
            resolve(true);
          } catch (exc) {
            reject();
          }
        })
      },
      updateStoreIndicators() {
        let self = this;

        let updatedIndicators = self.rangingController.getImportCSV();

        if (updatedIndicators.length <= 0) {
          alert("No indicators to update");
        } else {
          self.$refs.spinner.show();
          Axios.put(process.env.VUE_APP_API + `Ranging/UpdateIndicators?db=CR-Hinterland-Live`, updatedIndicators)
            .then(r => {
              if (r.data) {

              } else {
                alert("There was an error updating the indicators");
              }
              self.$refs.spinner.hide();
            })
        }
      },
      updateProductDetails() {
        let self = this;

        let updatedProducts = self.rangingController.getAllProducts();

        updatedProducts.forEach(el => {
          el["id"] = el.productID;
        })

        Axios.put(process.env.VUE_APP_API + "Product/UpdateProductList?db=CR-Hinterland-Live", updatedProducts)
          .then(r => {
            if (r.data) {
              alert("Successfully updated product details");
            } else {
              alert("Failed to update product details");
            }
          })
          .catch(e => {
            alert(e);
            console.log(e);
          })
      },
      setRangingClusterData(data) {
        let self = this;

        data.allStoresClusters.forEach(element => {
          self.clusterOptions.allStores.push(new textValue(element));
        });

        data.categoryClusters.forEach(element => {
          self.clusterOptions.category.push(new textValue(element));
        });

        data.customClusters.forEach(element => {
          self.clusterOptions.custom.push(new textValue(element));
        });

        data.departmentClusters.forEach(element => {
          self.clusterOptions.department.push(new textValue(element));
        });

        data.regionalClusters.forEach(element => {
          self.clusterOptions.regional.push(new textValue(element));
        });

        data.storeClusters.forEach(element => {
          self.clusterOptions.store.push(new textValue(element));
        });
      },
      onSelectionChanged(e) {
        let self = this;
        var rows = e.api.getSelectedNodes();
        self.selectedItems = rows;
      },
      setIndicator(indicator) {
        let self = this;

        self.selectedItems.forEach(el => {
          self.rangingController.setClusterIndicator(self.selectedClusterType, self.selectedClusterOption, el.data
            .productID,
            indicator);
        })
        self.rowData = self.rangingController.getSalesDataByCluster(self.selectedClusterType, self
          .selectedClusterOption);

        self.ais_Sales = 0;
        self.ais_SalesPotential = 0;

        self.rowData.forEach(el => {
          if (el.store_Range_Indicator == "YES") {
            self.ais_Sales = (parseFloat(self.ais_Sales) + parseFloat(el.sales_Retail)).toFixed(2);
            self.ais_SalesPotential = (parseFloat(self.ais_SalesPotential) + parseFloat(el.sales_potential))
              .toFixed(2);
          }
        })
      },
      onCellValueChanged(e) {
        let self = this;
        let field = e.colDef.field;

        if (field != "store_Range_Indicator") {
          if (e.oldValue != e.newValue) {
            self.rangingController.setProductData(e.data.productID, field, e.newValue);
          }
        } else {
          if (e.oldValue != e.newValue) {
            if (e.newValue == "SELECTED") {
              let stores = self.rangingController.getStoresByCluster(self.selectedClusterType, self
                .selectedClusterOption);

              let tmpStores = [];

              stores.forEach(el => {
                tmpStores.push({
                  storeID: el.storeID,
                  storeName: el.storeName,
                  selected: false
                })
              })

              self.$refs.storeIndicatorSelector.show(tmpStores, self.selectedClusterType, self.selectedClusterOption,
                newStores => {
                  self.rangingController.setStoreIndicatorByProductID(newStores, e.data.productID);
                  self.rowData = self.rangingController.getSalesDataByCluster(self.selectedClusterType, self
                    .selectedClusterOption);

                  self.ais_Sales = 0;
                  self.ais_SalesPotential = 0;

                  self.rowData.forEach(el => {
                    if (el.store_Range_Indicator == "YES") {
                      self.ais_Sales = (parseFloat(self.ais_Sales) + parseFloat(el.sales_Retail)).toFixed(2);
                      self.ais_SalesPotential = (parseFloat(self.ais_SalesPotential) + parseFloat(el
                        .sales_potential)).toFixed(2);
                    }
                  })
                })
            } else {
              self.rangingController.setClusterIndicator(self.selectedClusterType, self.selectedClusterOption, e.data
                .productID, e.newValue);

              self.ais_Sales = 0;
              self.ais_SalesPotential = 0;

              self.rowData.forEach(el => {
                if (el.store_Range_Indicator == "YES") {
                  self.ais_Sales = (parseFloat(self.ais_Sales) + parseFloat(el.sales_Retail)).toFixed(2);
                  self.ais_SalesPotential = (parseFloat(self.ais_SalesPotential) + parseFloat(el.sales_potential))
                    .toFixed(2);
                }
              })
            }
          }
        }
      },
      onClusterTypeChange() {
        let self = this;

        self.selectedClusterOption = null;
      },
      onClusterOptionChange() {
        let self = this;

        self.$nextTick(() => {
          if (self.selectedClusterOption != null) {
            self.rowData = [];

            self.setViewType(self.viewType);

            self.storesInCluster = self.rangingController.getStoresByCluster(self.selectedClusterType, self
                .selectedClusterOption)
              .length;
            self.fitColumns();
          }
        })
      },
      fitColumns() {
        let self = this;

        var allColumnIds = [];

        self.columnApi.getAllColumns().forEach(function (column) {
          allColumnIds.push(column.colId);
        });

        self.columnApi.autoSizeColumns(allColumnIds);
      },
      promptForTag() {
        let self = this;

        self.$refs.prompt.show(self.fileData.tag.replace(" - ", ""), "Optional File Name Tag", 'Tag', tag => {

          if (self.isAdd) {
            Axios.post(process.env.VUE_APP_API + "SystemFile/Exists?db=CR-Devinspire", {
              SystemFile: {
                SystemUser_ID: -1,
                Folder: "Ranging",
                Name: self.generateFileName() + tag,
                Extension: '.json'
              }

            }).then(r => {
              if (r.data == true) {
                self.$refs.yesNo.show('File already Exists, Would you like to overwrite it?', goThrough => {
                  if (goThrough) {
                    self.saveRange(tag);
                  }
                })
              } else {
                self.saveRange(tag);
              }
            })
          } else {
            self.saveRange(tag);
          }

        })
      },
      saveRange(tag) {
        let self = this;

        if (tag != '')
          tag = " - " + tag;

        let fileData = self.rangingController.getRangingFile();

        fileData["planogramName"] = self.fileData.planogramName;
        fileData["planogramID"] = self.fileData.planogramID;
        fileData["dateFrom"] = self.fileData.dateFrom;
        fileData["dateTo"] = self.fileData.dateTo;
        fileData["dateFromString"] = self.fileData.dateFromString;
        fileData["dateToString"] = self.fileData.dateToString;
        fileData["periodic"] = self.fileData.periodic;
        fileData["monthsBetween"] = self.fileData.monthsBetween;
        fileData["tag"] = tag;

        Axios.post(process.env.VUE_APP_API + "SystemFile/JSON?db=CR-Devinspire", {
            SystemFile: {
              SystemUser_ID: -1,
              Folder: "Ranging",
              Name: self.generateFileName() + tag,
              Extension: '.json'
            },
            Data: fileData
          })
          .then(r => {
            alert("Successfully saved: " + self.generateFileName() + tag)
          })
          .catch(e => {
            console.log(e);
          })
      },
      setSelectedStores() {
        let self = this;

        if (self.selectedItems.length > 1) {
          let stores = self.rangingController.getStoresByCluster(self.selectedClusterType, self.selectedClusterOption);

          let tmpStores = [];

          stores.forEach(el => {
            tmpStores.push({
              storeID: el.storeID,
              storeName: el.storeName,
              selected: false
            })
          })

          self.$refs.storeIndicatorSelector.show(tmpStores, self.selectedClusterType, self.selectedClusterOption,
            newStores => {
              self.selectedItems.forEach(el => {
                self.rangingController.setStoreIndicatorByProductID(newStores, el.data.productID);
              })
              self.rowData = self.rangingController.getSalesDataByCluster(self.selectedClusterType, self
                .selectedClusterOption);

              self.ais_Sales = 0;
              self.ais_SalesPotential = 0;

              self.rowData.forEach(el => {
                if (el.store_Range_Indicator == "YES") {
                  self.ais_Sales = (parseFloat(self.ais_Sales) + parseFloat(el.sales_Retail)).toFixed(2);
                  self.ais_SalesPotential = (parseFloat(self.ais_SalesPotential) + parseFloat(el.sales_potential))
                    .toFixed(2);
                }
              })
            })
        } else {
          let productID = self.selectedItems[0].data.productID;

          let stores = self.rangingController.getStoresByProductAndCluster(productID, self.selectedClusterType, self
            .selectedClusterOption);

          self.$refs.storeIndicatorSelector.show(stores, self.selectedClusterType, self.selectedClusterOption,
            newStores => {
              self.rangingController.setStoreIndicatorByProductID(newStores, productID);
              self.rowData = self.rangingController.getSalesDataByCluster(self.selectedClusterType, self
                .selectedClusterOption);

              self.ais_Sales = 0;
              self.ais_SalesPotential = 0;

              self.rowData.forEach(el => {
                if (el.store_Range_Indicator == "YES") {
                  self.ais_Sales = (parseFloat(self.ais_Sales) + parseFloat(el.sales_Retail)).toFixed(2);
                  self.ais_SalesPotential = (parseFloat(self.ais_SalesPotential) + parseFloat(el.sales_potential))
                    .toFixed(2);
                }
              })
            })
        }
      },
      generateFileName() {
        let self = this;
        if (self.fileData.planogramName != "") {
          if (self.fileData.periodic) {
            return `${self.fileData.planogramName} - ${self.fileData.monthsBetween} MMA`;
          } else {
            return `${self.fileData.planogramName} Average Monthly ${self.fileData.dateFromString} To ${self.fileData.dateToString}`;
          }
        } else {
          return "";
        }
      },
      getItemsToAudit() {
        let self = this;

        let retval = 0;

        if (self.rangingController != undefined && self.rowData.length > 0) {
          self.rangingController.getAllRangeProducts().forEach(element => {
            if (element.imageAudit)
              retval++;
          });
        }

        return retval;
      },
      setViewType(type) {
        let self = this;

        self.viewType = type;

        switch (type) {
          case 'CLUSTER': {
            self.columnDefs = require('./headers.json');
            self.rowData = self.rangingController.getSalesDataByCluster(self.selectedClusterType, self
              .selectedClusterOption);

            self.ais_Sales = 0;
            self.ais_SalesPotential = 0;

            self.rowData.forEach(el => {
              if (el.store_Range_Indicator == "YES") {
                self.ais_Sales = (parseFloat(self.ais_Sales) + parseFloat(el.sales_Retail)).toFixed(2);
                self.ais_SalesPotential = (parseFloat(self.ais_SalesPotential) + parseFloat(el.sales_potential))
                  .toFixed(2);
              }
            })
          }
          break;
        case 'STORE': {
          let storelevel = self.rangingController.getStoreIndicators(self.selectedClusterType, self
            .selectedClusterOption);

          self.ais_Sales = 0;
          self.ais_SalesPotential = 0;

          self.rowData.forEach(el => {
            if (el.store_Range_Indicator == "YES") {
              self.ais_Sales = (parseFloat(self.ais_Sales) + (parseFloat(el.sales_Retail) / self.storesInCluster))
                .toFixed(2);
              self.ais_SalesPotential = (parseFloat(self.ais_SalesPotential) + (parseFloat(el.sales_potential) /
                self.storesInCluster)).toFixed(2);
            }
          })
          self.columnDefs = storelevel.headers;
          self.rowData = storelevel.data;
        }
        break;
        }
      },
      onChart1() {
        let self = this;

        self.$refs.GraphConfigurationModal.show(graph_config => {

          self.columnApi.setColumnVisible(graph_config.selected_fact, true);
          self.columnApi.setColumnVisible(graph_config.selected_graph, true);

          var params = {
            cellRange: {
              columns: [graph_config.selected_fact, graph_config.selected_graph]
            },
            aggregate: true,
            chartType: graph_config.selected_graph_type,
            processChartOptions: function (params) {
              let opts = params.options;

              opts.title = {
                text: graph_config.graphName
              };

              return opts;
            }
          };
          console.log(params);
          
          this.gridApi.chartRange(params);
          self.columnApi.setColumnVisible(graph_config.selected_fact, false);
          self.columnApi.setColumnVisible(graph_config.selected_graph, false);
        });
      },
      openAutoRangeModal() {
        let self = this;

        self.$refs.AutoRangeModal.show(self.autoRangeData, autoRangeData => {
          self.autoRangeData = autoRangeData;
          self.calculateAutoRange();
        });
      },
      openReport() {
        let self = this;

        let reportObj = self.calculateReport();

        self.$refs.RangingReportModal.show(reportObj);
      },
      calculateAutoRange() {
        let self = this;

        self.rowData.forEach(el => {
          el.autoRangeItem = false;
          if (self.testAutoRangeProduct(el, self.rowData)) {
            el.autoRangeItem = true;
          }
        })
      },
      testAutoRangeProduct(product, allProducts) {
        let self = this;
        let partOfRange = true;
        let config = self.autoRangeData;

        if (!config.audit && product.imageAudit) {
          partOfRange = false;
        }

        if (product.sales_contribution <= config.sales_index) {
          partOfRange = false;
        }

        if (product.profit_contribution <= config.profit_index) {
          partOfRange = false;
        }

        if (product.units_contribution <= config.volume_index) {
          partOfRange = false;
        }

        if (!self.inPercentage(allProducts, config.sales, product, 'sales_Retail')) {
          partOfRange = false;
        }

        if (!self.inPercentage(allProducts, config.volume, product, 'sales_Units')) {
          partOfRange = false;
        }

        if (!self.inPercentage(allProducts, config.profit, product, 'sales_Profit')) {
          partOfRange = false;
        }

        if (!self.inPercentage(allProducts, config.potential_sales, product, 'sales_contribution')) {
          partOfRange = false;
        }

        if (!self.inPercentage(allProducts, config.potential_volume, product, 'units_contribution')) {
          partOfRange = false;
        }

        if (!self.inPercentage(allProducts, config.potential_profit, product, 'profit_contribution')) {
          partOfRange = false;
        }

        return partOfRange;
      },
      inPercentage(allProducts, percentage, product, field) {
        let self = this;

        let sorted = allProducts.sort((a, b) => {
          return a[field] < b[field];
        })

        let sortedCount = Math.round((percentage / 100) * sorted.length);
        let diff = allProducts.length - sortedCount;
        let partOfRange = false;

        for (var i = allProducts.length - 1; i >= diff; i--) {
          let item = sorted[i];
          if (item.barcode == product.barcode) {
            partOfRange = true;
          }
        }

        return partOfRange;
      },
      calculateReport() {
        let self = this;
        let reportObj = new RangeReports(self.rowData);
        return reportObj;
      }
    }
  }

  function RangeReports(rangingData) {
    let self = this;
    self.current = new RangeReport(rangingData, 'current');
    self.potential = new RangeReport(rangingData, 'potential');
  }

  function RangeReport(data, type) {
    let self = this;
    self.type = type;


    self.sales = new RangeReportRow(data, type, 'sales', 'money');
    self.units = new RangeReportRow(data, type, 'units', 'number');
    self.profit = new RangeReportRow(data, type, 'profit', 'money');
    self.item_count = new RangeReportRow(data, type, 'item_count', 'number');
    self.gross_profit = new RangeReportRow(data, type, 'gross_profit', 'percent');
    self.stock_on_hand_units = new RangeReportRow(data, type, 'stock_on_hand_units');
    self.stock_on_hand_cost = new RangeReportRow(data, type, 'stock_on_hand_cost');
  }

  function RangeReportRow(rowData, report_type, type, format) {
    let self = this;
    self.total_category = 0;
    self.items_selected = 0;
    self.selected_stores = 0;
    self.discontinued = 0;

    rowData.forEach(productData => {
      switch (type) {
        case 'sales': {
          self.total_category += (report_type == 'current' ? parseFloat(productData.sales_Retail.toFixed(2)) :
            parseFloat(productData.sales_potential.toFixed(2)));

          if (productData.store_Range_Indicator == 'YES')
            self.items_selected += (report_type == 'current' ? parseFloat(productData.sales_Retail.toFixed(2)) :
              parseFloat(productData.sales_potential.toFixed(2)));

          if (productData.store_Range_Indicator == 'SELECTED')
            self.selected_stores += (report_type == 'current' ? parseFloat(productData.sales_Retail.toFixed(2)) :
              parseFloat(productData.sales_potential.toFixed(2)));

          if (productData.store_Range_Indicator == 'NO')
            self.discontinued += (report_type == 'current' ? parseFloat(productData.sales_Retail.toFixed(2)) :
              parseFloat(productData.sales_potential.toFixed(2)));
        }
        break;
      case 'units': {
        self.total_category += (report_type == 'current' ? parseFloat(productData.sales_Units.toFixed(2)) :
          parseFloat(productData.volume_potential.toFixed(2)));

        if (productData.store_Range_Indicator == 'YES')
          self.items_selected += (report_type == 'current' ? parseFloat(productData.sales_Units.toFixed(2)) :
            parseFloat(productData.volume_potential.toFixed(2)));

        if (productData.store_Range_Indicator == 'SELECTED')
          self.selected_stores += (report_type == 'current' ? parseFloat(productData.sales_Units.toFixed(2)) :
            parseFloat(productData.volume_potential.toFixed(2)));

        if (productData.store_Range_Indicator == 'NO')
          self.discontinued += (report_type == 'current' ? parseFloat(productData.sales_Units.toFixed(2)) :
            parseFloat(productData.volume_potential.toFixed(2)));
      }
      break;
      case 'profit': {
        self.total_category += (report_type == 'current' ? parseFloat(productData.sales_Profit.toFixed(2)) :
          parseFloat(productData.profit_potential.toFixed(2)));

        if (productData.store_Range_Indicator == 'YES')
          self.items_selected += (report_type == 'current' ? parseFloat(productData.sales_Profit.toFixed(2)) :
            parseFloat(productData.profit_potential.toFixed(2)));

        if (productData.store_Range_Indicator == 'SELECTED')
          self.selected_stores += (report_type == 'current' ? parseFloat(productData.sales_Profit.toFixed(2)) :
            parseFloat(productData.profit_potential.toFixed(2)));

        if (productData.store_Range_Indicator == 'NO')
          self.discontinued += (report_type == 'current' ? parseFloat(productData.sales_Profit.toFixed(2)) :
            parseFloat(productData.profit_potential.toFixed(2)));
      }
      break;
      case 'item_count': {
        self.total_category = rowData.length;

        if (productData.store_Range_Indicator == 'YES')
          self.items_selected += 1;

        if (productData.store_Range_Indicator == 'SELECTED')
          self.selected_stores += 1;

        if (productData.store_Range_Indicator == 'NO')
          self.discontinued += 1;
      }
      break;
      case 'gross_profit': {
        self.total_category = calculate_gp(rowData, '');
        self.items_selected = calculate_gp(rowData, 'YES');
        self.selected_stores = calculate_gp(rowData, 'SELECTED');
        self.discontinued = calculate_gp(rowData, 'NO');
      }
      break;
      case 'stock_on_hand_units': {

      }
      break;
      case 'stock_on_hand_cost': {

      }
      break;
      }
    })

    switch (format) {
      case 'money': {
        self.total_category = 'R ' + self.total_category.toFixed(2);
        self.items_selected = 'R ' + self.items_selected.toFixed(2);
        self.selected_stores = 'R ' + self.selected_stores.toFixed(2);
        self.discontinued = 'R ' + self.discontinued.toFixed(2);
      }
      break;
      case 'number': {
        self.total_category = self.total_category.toFixed(0);
        self.items_selected = self.items_selected.toFixed(0);
        self.selected_stores = self.selected_stores.toFixed(0);
        self.discontinued = self.discontinued.toFixed(0);
      }
      break;
      case 'percent': {
        self.total_category = self.total_category.toFixed(2) + '%';
        self.items_selected = + self.items_selected.toFixed(2) + '%';
        self.selected_stores = + self.selected_stores.toFixed(2) + '%';
        self.discontinued = + self.discontinued.toFixed(2) + '%';
      }
      break;
    }

    // self.selected_stores = self.selected_stores.toFixed(2);    
    // self.discontinued = self.discontinued.toFixed(2);    
  }

  function calculate_gp(allProducts, indicator) {
    let self = this;

    let total_selling_price = 0;
    let total_cost_price = 0;

    allProducts.forEach(el => {
      if (indicator == "") {
        if (el.sales_Retail != 0 && el.sales_Units != 0 && el.sales_Profit != 0) {
          total_selling_price += el.sales_Retail / el.sales_Units;
          total_cost_price += (el.sales_Retail - el.sales_Profit) / el.sales_Units;
        }
      } else if (el.store_Range_Indicator == indicator) {
        if (el.sales_Retail != 0 && el.sales_Units != 0 && el.sales_Profit != 0) {
          total_selling_price += el.sales_Retail / el.sales_Units;
          total_cost_price += (el.sales_Retail - el.sales_Profit) / el.sales_Units;
        }
      }
    })

    let gross_profit = ((total_selling_price - total_cost_price) / total_selling_price) * 100;
    return gross_profit;
  }
</script>

<style>
  .ag-theme-balham .audit-image-breach {
    background-color: lightcoral !important;
  }

  .ag-theme-balham .auto-range-item {
    background-color: #cfffcf !important;
  }
</style>