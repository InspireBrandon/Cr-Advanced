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
            <v-list-tile @click="newCustom">
              <v-list-tile-title>New Custom</v-list-tile-title>
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
        <v-menu v-if="rowData.length > 0" dark offset-y style="margin-bottom: 10px;">
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
        <v-menu v-if="rowData.length > 0" dark offset-y style="margin-bottom: 10px;">
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
            <v-list-tile :disabled="rowData.length < 1" @click="getActiveShopCodes">
              <v-list-tile-title>Get Active Shop Codes</v-list-tile-title>
            </v-list-tile>
            <v-list-tile :disabled="rowData.length < 1" @click="getClusters">
              <v-list-tile-title>Get Clusters</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
        <v-menu v-if="rowData.length > 0" dark offset-y style="margin-bottom: 10px;">
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
          <v-btn slot="activator" flat>Highlight</v-btn>
          <v-list>
            <v-list-tile :disabled="selectedClusterOption == null" @click="openAutoRangeModal">
              <v-list-tile-title>Auto Range</v-list-tile-title>
            </v-list-tile>
            <v-list-tile :disabled="selectedClusterOption == null" @click="showClusterHighlight">
              <v-list-tile-title>Cluster</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
        <v-menu v-if="rowData.length > 0" dark offset-y style="margin-bottom: 10px;">
          <v-btn slot="activator" flat>Export</v-btn>
          <v-list>
            <v-list-tile @click="exportData('Excel')">
              <v-list-tile-title>Excel</v-list-tile-title>
            </v-list-tile>
            <v-list-tile @click="exportData('Csv')">
              <v-list-tile-title>CSV</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-toolbar-items>

      <v-spacer></v-spacer>

      <div v-if="rowData.length > 0">
        <span>{{ generateFileName() + fileData.tag + " (" + fileData.dateFromString + " TO " + fileData.dateToString + ")" }}</span>
      </div>

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
          <div v-if="rowData.length > 0">
            <h4>Active Items Selected</h4>
            <div>Sales: R{{ (ais_Sales < 0 ? (ais_Sales * -1) : ais_Sales) }}</div>
            <div>Sales Potential: R{{ (ais_SalesPotential < 0 ? (ais_SalesPotential * -1) : ais_SalesPotential) }}</div>
          </div>
          <v-spacer></v-spacer>
          <v-btn v-if="rowData.length>0" @click="openReport" color="primary" small dark>Report</v-btn>
          <v-btn v-if="rowData.length>0" @click="onChart1" color="primary" small dark>graphs</v-btn>
          <!-- <v-btn @click="openParetoModal" color="primary" small dark>Pareto</v-btn> -->
          <v-menu v-if="rowData.length > 0" dark offset-y>
            <v-btn slot="activator" v-if="rowData.length>0" color="pink" small dark>Apply Highlight</v-btn>
            <v-list class="pa-0">
              <v-list-tile :disabled="selectedClusterOption == null" @click="applyHighlight('YES')">
                <v-list-tile-title>YES</v-list-tile-title>
              </v-list-tile>
              <v-divider></v-divider>
              <v-list-tile :disabled="selectedClusterOption == null" @click="applyHighlight('NO')">
                <v-list-tile-title>NO</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
          <v-btn v-if="rowData.length > 0" @click="showNote = !showNote" color="primary" small dark>Note</v-btn>
          <!-- <v-btn @click="showNote = !showNote" color="primary" small dark>Note</v-btn> -->
          <v-menu offset-y>
            <v-btn v-if="selectedItems.length > 0" :disabled="selectedItems.length == 0" slot="activator"
              color="primary" small dark>Set Indicator
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
        <v-container grid-list-md fluid class="ma-0 pa-0">
          <v-layout row wrap>
            <v-flex :class="{ 'md10': showNote, 'md12': !showNote }" class="pa-0">
              <ag-grid-vue :gridOptions="gridOptions" :sideBar='true' style="width: 100%;  height: calc(100vh - 220px);"
                :defaultColDef="defaultColDef" class="ag-theme-balham" :columnDefs="columnDefs"
                @selection-changed="onSelectionChanged" :rowData="rowData" :enableSorting="true" :enableFilter="true"
                :suppressRowClickSelection="true" :enableRangeSelection="true" rowSelection="multiple"
                :rowDeselection="true" :enableColResize="true" :floatingFilter="true" :onGridReady="onGridReady"
                :groupMultiAutoColumn="true" :getContextMenuItems="getContextMenuItems">
              </ag-grid-vue>
            </v-flex>
            <v-flex v-show="showNote" class="pa-0" :class="{ 'md2': showNote, 'md0': !showNote }">
              <v-card flat tile style="height: calc(100vh - 220px)">
                <v-toolbar dark flat color="grey darken-3">
                  <h2>Range Notes</h2>
                  <v-spacer></v-spacer>
                  <v-btn @click="openHelpFileMaint" fab small color="primary">
                    <v-icon>edit</v-icon>
                  </v-btn>
                </v-toolbar>
                <v-card-text style="height: calc(100vh - 290px); overflow: scroll;">
                  <div v-html="note"></div>
                </v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
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
    <HighlightCluster ref="HighlightCluster"></HighlightCluster>
    <SizeLoader ref="SizeLoader" />
    <AutoRangeModal ref="AutoRangeModal" />
    <RangingReportModal ref="RangingReportModal" />
    <GraphConfigurationModal ref="GraphConfigurationModal" />
    <ParetoModal ref="ParetoModal" />
    <GpGraph ref="GpGraph" />
    <LineGraphModal ref="LineGraphModal" />
    <StorePieGraph ref="StorePieGraph" />
    <CategorySelector ref="CategorySelector" />
    <HelpFileMaint ref="HelpFileMaint" />
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
  import CategorySelector from '@/components/Common/CategorySelector';
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
  import LineGraphModal from './LineGraphModal.vue'
  import StorePieGraph from './StorePieGraph.vue'
  import GpGraph from './GpGraph.vue'
  import HighlightCluster from './HighlightCluster.vue'
  import HelpFileMaint from '../../Main/HelpFile/HelpFileMaint'

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
      StorePieGraph,
      LineGraphModal,
      GpGraph,
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
      GraphConfigurationModal,
      HighlightCluster,
      CategorySelector,
      HelpFileMaint
    },
    data() {
      return {
        showNote: false,
        note: "",
        filters: null,
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
          rowClassRules: {
            'audit-image-breach': function (params) {
              let self = params.context.componentParent;
              return self.autoRangeData.audit && params.data.imageAudit;
            }
          }
        },
        autoRangeData: {
          sales_index: 100,
          profit_index: 100,
          volume_index: 100,
          sales: 60,
          volume: 60,
          profit: 60,
          potential_sales: 60,
          potential_volume: 60,
          potential_profit: 60,
          audit: false,
          dos_units: 6,
          setDefaults() {
            this.use_sales_index = true;
            this.sales_index = 100;

            this.use_profit_index = true;
            this.profit_index = 100;

            this.use_volume_index = true;
            this.volume_index = 100;

            this.sales = 60;
            this.use_sales = true;

            this.volume = 60;
            this.use_volume = true;

            this.profit = 60;
            this.use_profit = true;

            this.potential_sales = 60;
            this.use_potential_sales = true;

            this.potential_volume = 60;
            this.use_potential_volume = true;

            this.potential_profit = 60;
            this.use_potential_profit = true;

            this.audit = false;
            this.use_audit = true;

            this.dos_units = 6;
          }
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
      openHelpFileMaint() {
        let self = this;

        let type = "PLANOGRAM"

        if (self.fileData.useType == "CLUSTER")
          type = "CLUSTER"

        self.$refs.HelpFileMaint.show("RANGE - " + type + " - " + self.fileData.planogramID, html => {
          self.note = html;
        })
      },
      getHelpFile() {
        let self = this;

        let type = "PLANOGRAM"

        if (self.fileData.useType == "CLUSTER")
          type = "CLUSTER"

        Axios.get(process.env.VUE_APP_API + "HelpFile?systemComponent=" + "RANGE - " + type + " - " + self.fileData.planogramID)
          .then(r => {
            if (r.data.success) {
              self.note = r.data.helpFile.html;
            } else {
              self.note = "";
            }

            self.dialog = true;
          })
      },
      applyHighlight(indicator) {
        let self = this;

        self.rowData.forEach(el => {
          if (el.alt_Store_Range_Indicator == indicator) {
            self.rangingController.setClusterIndicator(self.selectedClusterType, self.selectedClusterOption, el
              .productID, indicator);

            self.gridApi.forEachNodeAfterFilter((node, idx) => {
              if (node.data.productID == el.productID) {
                node.setDataValue("alt_Store_Range_Indicator", indicator)
                node.setDataValue("store_Range_Indicator", indicator)
                node.setDataValue("alt_Store_Range_Indicator_ID", indicator == "YES" ? 2 : 1)
                node.setDataValue("store_Range_Indicator_ID", indicator == "YES" ? 2 : 1)
              }
            })

            self.gridApi.redrawRows();
          }
        })
      },
      showClusterHighlight() {
        let self = this;
        let highlightObj = self.rangingController.getClusterData();
        self.$refs.HighlightCluster.show(highlightObj, data => {

          let altRowData = self.rangingController.getSalesDataByCluster(data.selectedClusterType, data
            .selectedClusterOption, self.autoRangeData);

          altRowData.forEach(element => {
            self.rowData.forEach(el => {
              if (el.productID == element.productID) {
                el.alt_Store_Range_Indicator = element.store_Range_Indicator
                el.alt_Store_Range_Indicator_ID = element.store_Range_Indicator_ID
              }
            });
          });

          self.gridApi.redrawRows();
        });
      },
      showLineChart(params) {
        let self = this
        Axios.get(process.env.VUE_APP_API +
          `GetTrendData?productID=${params.productID}&periodFromID=${self.fileData.dateTo}&periodToID=${self.fileData.dateTo-11}`
        ).then(r => {
          self.$refs.LineGraphModal.open(r.data, params.description, params.barcode, callback => {})

        })
      },
      showStorePieGraph(params) {
        let self = this

        Axios.get(process.env.VUE_APP_API +
          `GetAvgStoreUnits?productID=${params.productID}&periodFromID=${self.fileData.dateTo}&periodToID=${self.fileData.dateTo-11}&clusterType=${self.selectedClusterType}&clusterID=${self.selectedClusterOption}`
        ).then(r => {
          self.$refs.StorePieGraph.open(r.data, params.description, params.barcode, callback => {})

        })
      },
      openParetoModal(fact, fact_name) {
        let self = this

        self.$refs.ParetoModal.open(self.rowData, {
            key: 'description',
            value: fact,
            fact_name: fact_name,
            altValue: 'count',
            rangeName: self.generateFileName(),
            percent: 'percent'
          },
          callback => {
            callback.forEach(el => {
              console.log(el);

              self.rowData.forEach(rowitem => {
                if (el.productID == rowitem.productID) {

                  self.rangingController.setClusterIndicator(self.selectedClusterType, self
                    .selectedClusterOption, rowitem.productID,
                    "YES");
                }
              })
            })
            self.rowData = self.rangingController.getSalesDataByCluster(self.selectedClusterType, self
              .selectedClusterOption, self.autoRangeData);

            self.ais_Sales = 0;
            self.ais_SalesPotential = 0;

            self.rowData.forEach(el => {
              if (el.store_Range_Indicator == "YES") {
                self.ais_Sales = (parseFloat(self.ais_Sales) + parseFloat(el.sales_Retail)).toFixed(2);
                self.ais_SalesPotential = (parseFloat(self.ais_SalesPotential) + parseFloat(el.sales_potential))
                  .toFixed(2);
              }
            })
          });
      },
      openGPModal(fact, fact_name, selected_graph, graph_Type) {
        let self = this

        self.$refs.GpGraph.open(self.rowData, {
            key: 'description',
            value: fact,
            fact_name: fact_name,
            altValue: 'count',
            rangeName: self.generateFileName(),
            percent: 'percent',
            graph: selected_graph
          }, graph_Type,
          callback => {});
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
                    .selectedClusterOption, self.autoRangeData);

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
      newCustom() {
        let self = this;

        self.isAdd = true;

        self.canRefresh = false;

        self.$refs.CategorySelector.show(category => {

          self.selectedPlanogram = category;

          self.$refs.dateRangeSelector.show(dateRange => {

            self.selectedDateRange = dateRange;
            self.$refs.spinner.show();

            self.fileData.planogramName = category.displayName;
            self.fileData.planogramID = category.id;
            self.fileData.dateFrom = dateRange.dateFrom;
            self.fileData.dateTo = dateRange.dateTo;
            self.fileData.dateFromString = dateRange.dateFromString;
            self.fileData.dateToString = dateRange.dateToString;
            self.fileData.periodic = dateRange.periodic;
            self.fileData.monthsBetween = dateRange.monthsBetween;
            self.fileData.tag = "CATEGORY";
            self.fileData.useType = "CATEGORY";

            self.getHelpFile();

            Axios.get(process.env.VUE_APP_API +
                `RangingAdvanced?planogramID=${category.id}&dateFromID=${dateRange.dateFrom}&dateToID=${dateRange.dateTo}&type=CATEGORY`
              )
              .then(r => {
                r.data["dateFrom"] = dateRange.dateFrom;
                r.data["dateTo"] = dateRange.dateTo;
                self.rangingController = new RangingController(r.data);

                self.rangingController.getSalesMonthlyTotals(() => {
                  self.setRangingClusterData(r.data.clusterData);
                  if (self.selectedClusterType != null && self.selectedClusterOption != null) {
                    self.rowData = self.rangingController.getSalesDataByCluster(self.selectedClusterType,
                      self
                      .selectedClusterOption, self.autoRangeData);

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
            self.fileData.useType = "PLANOGRAM";

            self.getHelpFile();

            Axios.get(process.env.VUE_APP_API +
                `RangingAdvanced?planogramID=${planogram.planogram_ID}&dateFromID=${dateRange.dateFrom}&dateToID=${dateRange.dateTo}&type=PLANOGRAM`
              )
              .then(r => {
                r.data["dateFrom"] = dateRange.dateFrom;
                r.data["dateTo"] = dateRange.dateTo;
                self.rangingController = new RangingController(r.data);

                self.rangingController.getSalesMonthlyTotals(() => {
                  self.setRangingClusterData(r.data.clusterData);
                  if (self.selectedClusterType != null && self.selectedClusterOption != null) {
                    self.rowData = self.rangingController.getSalesDataByCluster(self.selectedClusterType,
                      self
                      .selectedClusterOption, self.autoRangeData);

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

              self.getHelpFile();

              if (r.data.autoRangeConfig != undefined && r.data.autoRangeConfig != null) {
                for (var prop in r.data.autoRangeConfig) {
                  self.autoRangeData[prop] = r.data.autoRangeConfig[prop];
                }
              } else {
                self.autoRangeData.sales_index = 100;
                self.autoRangeData.use_sales_index = true;

                self.autoRangeData.profit_index = 100;
                self.autoRangeData.use_profit_index = true;

                self.autoRangeData.volume_index = 100;
                self.autoRangeData.use_volume_index = true;

                self.autoRangeData.sales = 60;
                self.autoRangeData.use_sales = true;

                self.autoRangeData.volume = 60;
                self.autoRangeData.use_volume = true;

                self.autoRangeData.profit = 60;
                self.autoRangeData.use_profit = true;

                self.autoRangeData.potential_sales = 60;
                self.autoRangeData.use_potential_sales = true;

                self.autoRangeData.potential_volume = 60;
                self.autoRangeData.use_potential_volume = true;

                self.autoRangeData.potential_profit = 60;
                self.autoRangeData.use_potential_profit = true;

                self.autoRangeData.audit = false;
                self.autoRangeData.use_audit = true;

                self.autoRangeData.dos_units = 6;
              }

              self.canRefresh = true;

              self.rangingController = new RangingController(r.data);

              self.rangingController.getSalesMonthlyTotals(() => {

                self.setRangingClusterData(r.data.clusterData);

                if (self.selectedClusterType != null && self.selectedClusterOption != null) {
                  self.rowData = self.rangingController.getSalesDataByCluster(self.selectedClusterType, self
                    .selectedClusterOption, self.autoRangeData);


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
              `RangingAdvanced?planogramID=${self.fileData.planogramID}&dateFromID=${self.fileData.dateFrom}&dateToID=${self.fileData.dateTo}&type=${self.fileData.useType}`
            )
            .then(r => {
              r.data["dateFrom"] = self.fileData.dateFrom;
              r.data["dateTo"] = self.fileData.dateTo;

              self.rangingController = new RangingController(r.data);

              self.rangingController.getSalesMonthlyTotals(() => {
                self.setRangingClusterData(r.data.clusterData);
                if (self.selectedClusterType != null && self.selectedClusterOption != null) {
                  self.rowData = self.rangingController.getSalesDataByCluster(self.selectedClusterType, self
                    .selectedClusterOption, self.autoRangeData);

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

            self.columnDefs[4] = {
              "headerName": "Description",
              "field": "description",
              "filterParams": {
                "newRowsAction": "keep"
              },
              cellStyle: function (params) {
                if (params.data.alt_Store_Range_Indicator == "YES") {
                  return {
                    backgroundColor: "#5ef35e86"
                  };
                }

                if (params.data.alt_Store_Range_Indicator == "NO") {
                  return {
                    backgroundColor: "#ff9e9e91"
                  };
                }
              }
            }

            self.columnDefs[13] = {
                headerName: "Indicator",
                field: "store_Range_Indicator",
                editable: true,
                cellEditor: "agRichSelectCellEditor",
                cellEditorParams: {
                  values: ["YES", "NO", "SELECTED", "SELECT"]
                },
                cellStyle: function (params) {

                  if (params.data.autoRangeOneItem && params.data.autoRangeItem) {
                    return {
                      backgroundColor: "#8ef58e"
                    };
                  } else if (params.data.autoRangeOneItem) {
                    return {
                      backgroundColor: "#b0fdb0"
                    };
                  } else {
                    return {
                      backgroundColor: "#dcdcdc"
                    };
                  }
                },
              },

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
                alert("Successfully updated indicators")
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
          .selectedClusterOption, self.autoRangeData);

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
                    .selectedClusterOption, self.autoRangeData);

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

        let filters = self.gridApi;

        self.$nextTick(() => {
          if (self.selectedClusterOption != null) {
            // self.rowData = [];

            self.setViewType(self.viewType);

            self.storesInCluster = self.rangingController.getStoresByCluster(self.selectedClusterType, self
              .selectedClusterOption).length;
            self.fitColumns();
            self.calculateAutoRange();
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

        fileData["autoRangeConfig"] = self.autoRangeData;

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
                .selectedClusterOption, self.autoRangeData);

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
                .selectedClusterOption, self.autoRangeData);

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
            let tmp = self.rangingController.getSalesDataByCluster(self.selectedClusterType, self.selectedClusterOption,
              self.autoRangeData);

            tmp.forEach(tmpItem => {
              self.rowData.forEach(rowDataItem => {
                if (tmpItem.productID == rowDataItem.productID) {
                  tmpItem.alt_Store_Range_Indicator = rowDataItem.alt_Store_Range_Indicator;
                  tmpItem.alt_Store_Range_Indicator_ID = rowDataItem.alt_Store_Range_Indicator_ID;
                }
              })
            })

            self.rowData = tmp;

            self.gridApi.redrawRows();

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
          if (graph_config.selected_fact == "gross_profit" && graph_config.selected_graph != "Pareto") {

            self.openGPModal(graph_config.selected_fact, graph_config.selected_fact_name, graph_config
              .selected_graph, graph_config.selected_graph_type)

          } else {
            if (graph_config.selected_graph == "Pareto") {
              self.openParetoModal(graph_config.selected_fact, graph_config.selected_fact_name)
            } else {
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
                    text: self.generateFileName() + " " + self.fileData.tag + " ",
                    fontFamily: "Roboto, sans-serif",
                    fontWeight: "undefined",
                    fontSize: 12
                  };

                  let clusterName = "";

                  self.clusterOptions[self.selectedClusterType].forEach(el => {
                    if (el.value == self.selectedClusterOption)
                      clusterName = el.text
                  })

                  opts.subtitle = {
                    text: graph_config.graphName + " For " + clusterName + " - " + self.storesInCluster +
                      " Stores",
                    fontFamily: "'Roboto', sans-serif"
                  }

                  return opts;
                }
              };

              this.gridApi.chartRange(params);
              self.columnApi.setColumnVisible(graph_config.selected_fact, false);
              self.columnApi.setColumnVisible(graph_config.selected_graph, false);
            }
          }
        });
      },
      openAutoRangeModal() {
        let self = this;

        self.$refs.AutoRangeModal.show(self.autoRangeData, autoRangeData => {
          self.autoRangeData = autoRangeData;
          self.rowData = self.rangingController.getSalesDataByCluster(self.selectedClusterType, self
            .selectedClusterOption, self.autoRangeData);

          self.ais_Sales = 0;
          self.ais_SalesPotential = 0;

          self.rowData.forEach(el => {
            if (el.store_Range_Indicator == "YES") {
              self.ais_Sales = (parseFloat(self.ais_Sales) + parseFloat(el.sales_Retail)).toFixed(2);
              self.ais_SalesPotential = (parseFloat(self.ais_SalesPotential) + parseFloat(el.sales_potential))
                .toFixed(2);
            }
          })
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
          el.autoRangeOneItem = false;

          var test = self.testAutoRangeProduct(el, self.rowData)

          if (test.passesOne)
            el.autoRangeOneItem = true;

          if (test.passesAll)
            el.autoRangeItem = true;
        })
      },
      testAutoRangeProduct(product, allProducts) {
        let self = this;
        let passesAll = true;
        let passesOne = false;
        let config = self.autoRangeData;

        // Audit
        // if (config.use_audit) {
        //   if (!config.audit && product.imageAudit) {
        //     passesAll = false;
        //   }
        //   else {
        //     passesOne = true
        //   }
        // }

        // Sales Index
        if (config.use_sales_index) {
          if (product.sales_contribution <= config.sales_index) {
            passesAll = false;
          } else {
            passesOne = true
          }
        }

        // Sales Index
        if (config.use_profit_index) {
          if (product.profit_contribution <= config.profit_index) {
            passesAll = false;
          } else {
            passesOne = true
          }
        }

        // Volume Index
        if (config.use_volume_index) {
          if (product.units_contribution <= config.volume_index) {
            passesAll = false;
          } else {
            passesOne = true
          }
        }

        // Sales
        if (config.use_sales) {
          if (!self.inPercentage(allProducts, config.sales, product, 'item_sales_rank')) {
            passesAll = false;
          } else {
            passesOne = true
          }
        }

        // Units
        if (config.use_volume) {
          if (!self.inPercentage(allProducts, config.volume, product, 'item_volume_rank')) {
            passesAll = false;
          } else {
            passesOne = true
          }
        }

        // Profit
        if (config.use_profit) {
          if (!self.inPercentage(allProducts, config.profit, product, 'item_profit_rank')) {
            passesAll = false;
          } else {
            passesOne = true
          }
        }

        // Potential Sales
        if (config.use_potential_sales) {
          if (!self.inPercentage(allProducts, config.potential_sales, product, 'sales_potential_rank')) {
            passesAll = false;
          } else {
            passesOne = true
          }
        }

        // Potential Volume
        if (config.use_potential_volume) {
          if (!self.inPercentage(allProducts, config.potential_volume, product, 'volume_potential_rank')) {
            passesAll = false;
          } else {
            passesOne = true
          }
        }

        // Potential Profit
        if (config.use_potential_profit) {
          if (!self.inPercentage(allProducts, config.potential_profit, product, 'profit_potential_rank')) {
            passesAll = false;
          } else {
            passesOne = true
          }
        }

        return {
          passesOne: passesOne,
          passesAll: passesAll
        };
      },
      inPercentage(allProducts, percentage, product, field) {
        let self = this;

        allProducts = allProducts.filter(item => {
          return parseInt(item.sales_Retail) > 0;
        })

        let sorted = allProducts.sort(function (a, b) {
          return b[field] - a[field];
        })

        let sortedCount = Math.round((percentage / 100) * sorted.length);
        let diff = sorted.length - sortedCount;

        let partOfRange = false;

        for (var i = sorted.length - 1; i >= diff; i--) {
          let item = sorted[i];
          if (item.barcode == product.barcode && item.sales_Retail > 0) {
            partOfRange = true;
          }
        }

        return partOfRange;
      },
      calculateReport() {
        let self = this;
        let reportObj = new RangeReports(self.rowData);
        return reportObj;
      },
      getContextMenuItems(params) {
        let self = this;
        var result = [
          "copy",
          "paste",
          "separator",
          {
            name: "Show Trend",
            action: () => {
              self.showLineChart(params.node.data)
            }
          },

          {
            name: "Store Sales",
            action: () => {
              self.showStorePieGraph(params.node.data)
            }
          }
        ];

        return result;
      },
      getActiveShopCodes() {
        let self = this;

        let product_id_list = [];

        self.rowData.forEach(product => {
          product_id_list.push(product.productID)
        })

        Axios.post(process.env.VUE_APP_API + "Product/GetActiveShopCodes?db=CR-Hinterland-Live", {
            productIDList: product_id_list
          })
          .then(r => {
            let new_asc = r.data.productActiveShopCodeList

            self.rowData.forEach((product, idx) => {
              product.active_Shop_Code = new_asc[idx].active_Shop_Code;
              product.active_Shop_Code_ID = new_asc[idx].active_Shop_Code_ID;
            })

            alert("Get Active Shop Codes Complete");
          })
          .catch(e => {
            alert("An error has occured")
          })
      },
      getClusters() {
        let self = this;

        Axios.get(process.env.VUE_APP_API + "Ranging/GetClusterData?planogramID=" + self.fileData.planogramID)
          .then(r => {
            let clusterData = r.data.clusterData;

            self.rangingController.setClusterData(clusterData);
            self.setRangingClusterData(clusterData);
            alert("Get Clusters Complete");
          })
      },
      exportData(type) {
        let self = this;

        let params = {
          fileName: self.generateFileName() + self.fileData.tag + " (" + self.fileData.dateFromString + " TO " + self
            .fileData.dateToString + ")",
          sheetName: self.generateFileName() + self.fileData.tag + " (" + self.fileData.dateFromString + " TO " + self
            .fileData.dateToString + ")",
          allColumns: true
        }

        self.gridApi[`exportDataAs${type}`](params);
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
    self.stock_on_hand_units = new RangeReportRow(data, type, 'stock_on_hand_units', 'number');
    self.stock_on_hand_cost = new RangeReportRow(data, type, 'stock_on_hand_cost', 'money');
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

          if (productData.store_Range_Indicator == 'SELECT')
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

        if (productData.store_Range_Indicator == 'SELECT')
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

        if (productData.store_Range_Indicator == 'SELECT')
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

        if (productData.store_Range_Indicator == 'SELECT')
          self.selected_stores += 1;

        if (productData.store_Range_Indicator == 'NO')
          self.discontinued += 1;
      }
      break;
      case 'gross_profit': {
        let cat = calculate_gp(rowData, '', report_type);
        self.total_category = cat < 0 ? (cat * -1) : cat;

        let is = calculate_gp(rowData, 'YES', report_type)
        self.items_selected = is < 0 ? (is * -1) : is;

        let ss = calculate_gp(rowData, 'SELECT', report_type);
        self.selected_stores = ss < 0 ? (ss * -1) : ss;

        let dis = calculate_gp(rowData, 'NO', report_type)
        self.discontinued = dis < 0 ? (dis * -1) : dis;
      }
      break;
      case 'stock_on_hand_units': {
        self.total_category += parseFloat(productData.stock_Units.toFixed(2));

        if (productData.store_Range_Indicator == 'YES')
          self.items_selected += parseFloat(productData.stock_Units.toFixed(2));

        if (productData.store_Range_Indicator == 'SELECT')
          self.selected_stores += parseFloat(productData.stock_Units.toFixed(2));

        if (productData.store_Range_Indicator == 'NO')
          self.discontinued += parseFloat(productData.stock_Units.toFixed(2));
      }
      break;
      case 'stock_on_hand_cost': {
        self.total_category += parseFloat(productData.stock_Cost.toFixed(2));

        if (productData.store_Range_Indicator == 'YES')
          self.items_selected += parseFloat(productData.stock_Cost.toFixed(2));

        if (productData.store_Range_Indicator == 'SELECT')
          self.selected_stores += parseFloat(productData.stock_Cost.toFixed(2));

        if (productData.store_Range_Indicator == 'NO')
          self.discontinued += parseFloat(productData.stock_Cost.toFixed(2));
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
      self.items_selected = +self.items_selected.toFixed(2) + '%';
      self.selected_stores = +self.selected_stores.toFixed(2) + '%';
      self.discontinued = +self.discontinued.toFixed(2) + '%';
    }
    break;
    }
  }

  function calculate_gp(allProducts, indicator, report_type) {
    let total_category_sales = 0;
    let total_category_cost = 0;

    let total_indicator_sales = 0;
    let total_indicator_cost = 0;

    allProducts.forEach(el => {

      total_category_sales += parseFloat(report_type == 'current' ? el.sales_Retail : el.sales_potential);
      total_category_cost += parseFloat(report_type == 'current' ? el.sales_Cost : el.cost_potential);

      if (indicator != '') {
        if (el.store_Range_Indicator == indicator) {
          total_indicator_sales += parseFloat(report_type == 'current' ? el.sales_Retail : el.sales_potential);
          total_indicator_cost += parseFloat(report_type == 'current' ? el.sales_Cost : el.cost_potential);
        }
      }
    })

    let gross_profit = 0;

    if (indicator == '') {
      gross_profit = ((total_category_sales - total_category_cost) / total_category_sales) * 100;
    } else {
      gross_profit = ((total_indicator_sales - total_indicator_cost) / total_category_sales) * 100;
    }

    return isNaN(gross_profit) ? 0 : gross_profit;
  }
</script>

<style>
  .ag-theme-balham .audit-image-breach {
    background-color: rgb(226, 195, 195) !important;
  }

  .ag-theme-balham .auto-range-item {
    background-color: #cfffcf !important;
  }

  .indicator-yes {
    background-color: #5ef35e86 !important;
  }

  .indicator-no {
    background-color: #ff9e9e91 !important;
  }

  .indicator-select {
    background-color: rgb(248, 204, 123) !important;
  }

  /* .indicator-select {
    background-color: rgba(148, 148, 148, 0.609) !important;
  } */
</style>