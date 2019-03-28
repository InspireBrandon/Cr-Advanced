<template>
  <div class="ranging">
    <v-toolbar dense dark>

      <v-toolbar-items>
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
            <v-list-tile @click="fitColumns" >
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
      </v-toolbar-items>

      <v-spacer></v-spacer>

      <span v-if="generateFileName() != ' Average Monthly To '">{{ generateFileName() + " " + fileData.tag }}</span>

      <v-spacer></v-spacer>

      <v-toolbar-title>
        <span>Range Planning</span>
        <HelpFileViewer component="Ranging"></HelpFileViewer>
      </v-toolbar-title>
    </v-toolbar>
    <v-container fluid grid-list-lg>
      <v-layout row wrap>
        <v-toolbar dark>
          <v-layout row wrap v-if="gotData">
            <v-flex lg2 md3>
              <v-select placeholder="Select cluster type" @change="onClusterTypeChange" dense :items="clusterTypes"
                v-model="selectedClusterType" solo hide-details></v-select>
            </v-flex>
            <v-flex lg2 md3>
              <v-select @change="onClusterOptionChange" v-if="selectedClusterType != null" :placeholder="'Select ' + selectedClusterType + ' cluster'"
                dense :items="clusterOptions[selectedClusterType]" v-model="selectedClusterOption" solo hide-details></v-select>
            </v-flex>
            <v-flex lg4 md4 style="margin-top: 15px;">
              <span v-show="storesInCluster > -1">{{ storesInCluster }} Stores </span>
              <span v-show="getItemsToAudit() > 0" style="font-weight: bold; color: red;"> - {{ getItemsToAudit() }}
                product(s) need auditing</span>
            </v-flex>
            <!-- <v-flex lg2 md-and-down></v-flex> -->
            <v-flex lg4 md2 style="text-align: right;">
              <v-menu offset-y>
                <v-btn :disabled="selectedItems.length == 0" slot="activator" color="primary" dark>Set Indicator</v-btn>
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
            </v-flex>
          </v-layout>
        </v-toolbar>
        <ag-grid-vue :gridOptions="gridOptions" :sideBar='true' style="width: 100%;  height: calc(70vh - 25px);"
          :defaultColDef="defaultColDef" class="ag-theme-balham" :columnDefs="columnDefs" :selectionChanged="onSelectionChanged"
          :rowData="rowData" :enableSorting="true" :enableFilter="true" :suppressRowClickSelection="true"
          :enableRangeSelection="true" rowSelection="multiple" :rowDeselection="true" :enableColResize="true"
          :floatingFilter="true" :gridReady="onGridReady" :groupMultiAutoColumn="true">
        </ag-grid-vue>
        <div>
          <p>{{ rowData.length }} Rows</p>
        </div>
        <div style="margin-left: 10px;">
          <p>{{ selectedItems.length }} Selected</p>
        </div>
      </v-layout>
    </v-container>
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
  </div>
</template>

<script>
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
      HelpFileViewer
    },
    data() {
      return {
        isAdd: true,
        rangingController: null,
        storesInCluster: -1,
        viewType: 'CLUSTER',
        planogramName: "",
        columnDefs: [],
        rowData: [],
        gridOptions: {
          context: {
            componentParent: this
          },
          rowClassRules: {
            'audit-image-breach': 'data.imageAudit'
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
        tmpString: ""
      }
    },
    created() {
      let self = this;
      self.getColumnDefenitions();
    },
    methods: {
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
                self.setRangingClusterData(r.data.clusterData);
                if (self.selectedClusterType != null && self.selectedClusterOption != null) {
                  self.rowData = self.rangingController.getSalesDataByCluster(self.selectedClusterType, self.selectedClusterOption);
                  console.log(self.rowData);
                  self.fitColumns();
                }
                self.$refs.spinner.hide();
                self.gotData = true
              })
          })
        })
      },
      openRange() {
        let self = this;

        self.isAdd = false;

        self.$refs.rangeSelectorModal.show(fileID => {
          Axios.get(process.env.VUE_APP_API + `SystemFile/JSON?db=CR-Devinspire&id=${fileID}`)
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
              self.setRangingClusterData(r.data.clusterData);
              if (self.selectedClusterType != null && self.selectedClusterOption != null) {
                self.rowData = self.rangingController.getSalesDataByCluster(self.selectedClusterType, self.selectedClusterOption);
                self.fitColumns();
              }
              self.$refs.spinner.hide();
              self.gotData = true
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
              self.rangingController = new RangingController(r.data);
              self.setRangingClusterData(r.data.clusterData);
              if (self.selectedClusterType != null && self.selectedClusterOption != null) {
                self.rowData = self.rangingController.getSalesDataByCluster(self.selectedClusterType, self.selectedClusterOption);
                self.fitColumns();
              }
              self.$refs.spinner.hide();
              self.gotData = true
            })
        })
      },
      getColumnDefenitions() {
        let self = this;
        return new Promise((resolve, reject) => {
          try {
            self.columnDefs = require('./headers.json');
            self.columnDefs.push({
              headerName: 'Options',
              field: 'barcode',
              cellRendererFramework: 'optionsComponent',
              pinned: 'right'
            })
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
          self.rangingController.setClusterIndicator(self.selectedClusterType, self.selectedClusterOption, el.data.productID,
            indicator);
        })
        self.rowData = self.rangingController.getSalesDataByCluster(self.selectedClusterType, self.selectedClusterOption);
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
                  self.rangingController.setStoreIndicatorByProductID(newStores, e.data.productID);
                  self.rowData = self.rangingController.getSalesDataByCluster(self.selectedClusterType, self.selectedClusterOption);
                })
            } else {
              self.rangingController.setClusterIndicator(self.selectedClusterType, self.selectedClusterOption, e.data.productID,
                e.newValue);
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

            self.storesInCluster = self.rangingController.getStoresByCluster(self.selectedClusterType, self.selectedClusterOption)
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
              }
              else {
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
            self.$refs.snackbar.show("Successfully saved: " + self.generateFileName() + tag);
          })
          .catch(e => {

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
              self.rowData = self.rangingController.getSalesDataByCluster(self.selectedClusterType, self.selectedClusterOption);
            })
        } else {
          let productID = self.selectedItems[0].data.productID;

          let stores = self.rangingController.getStoresByProductAndCluster(productID, self.selectedClusterType, self.selectedClusterOption);

          self.$refs.storeIndicatorSelector.show(stores, self.selectedClusterType, self.selectedClusterOption,
            newStores => {
              self.rangingController.setStoreIndicatorByProductID(newStores, productID);
              self.rowData = self.rangingController.getSalesDataByCluster(self.selectedClusterType, self.selectedClusterOption);
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
          case 'CLUSTER':
            {
              self.columnDefs = require('./headers.json');
              self.rowData = self.rangingController.getSalesDataByCluster(self.selectedClusterType, self.selectedClusterOption);
            }
            break;
          case 'STORE':
            {
              let storelevel = self.rangingController.getStoreIndicators(self.selectedClusterType, self.selectedClusterOption);
              self.columnDefs = storelevel.headers;
              self.rowData = storelevel.data;
            }
            break;
        }
      }
    }
  }

</script>

<style>
  .ag-theme-balham .audit-image-breach {
    background-color: lightcoral !important;
  }

</style>
