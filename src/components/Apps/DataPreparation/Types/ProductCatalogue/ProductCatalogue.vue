<template>
  <div style="background: white;">
    <v-toolbar dense dark flat>
      <v-spacer></v-spacer>
      <v-toolbar-title>Product Catalogue</v-toolbar-title>
    </v-toolbar>
    <v-toolbar flat color="grey darken-3">
      <v-dialog persistent v-model="FilterDialog" width="40vw">
        <v-card>
          <v-toolbar flat dark color="primary">
            <v-toolbar-title>Set Filters</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click.native="FilterDialog = false">
              <v-icon>close</v-icon>
            </v-btn>

          </v-toolbar>
          <!-- <v-card-title class="headline">Set Filters</v-card-title> -->
          <v-card-text>
            <v-container fluid grid-list-lg>
              <v-layout row wrap>
                <v-flex lg6 md6 sm12>
                  <v-autocomplete dense menu-props="auto" :items="activeShopCodesDropdown" label="Active Shop Code"
                    v-model="activeShopCode"></v-autocomplete>
                </v-flex>
                <v-flex lg6 md6 sm12>
                  <v-autocomplete dense menu-props="auto" :items="departments" label="Department" v-model="department">
                  </v-autocomplete>
                </v-flex>
                <v-flex lg6 md6 sm12>
                  <v-autocomplete dense menu-props="auto" :items="subdepartments" label="Sub Department"
                    v-model="subdepartment"></v-autocomplete>
                </v-flex>
                <v-flex lg6 md6 sm12>
                  <v-autocomplete dense menu-props="auto" :items="categories" label="Category" v-model="category">
                  </v-autocomplete>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn color="primary" @click="filter">
              Filter
            </v-btn>

          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog persistent v-model="FilterScanBarcode" width="40vw">
        <v-card>
          <v-toolbar dense flat dark color="primary">
            <v-toolbar-title>
              Scan Barcode
            </v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-container fluid grid-list-lg>
              <v-layout row wrap>
                <v-flex lg6 md6 sm12>
                  <v-text-field v-model="ScanBarcodeTextfield" label="ScanBarcode"></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn color="error" @click="FilterScanBarcode = false">
              Cancel
            </v-btn>

            <v-btn color="primary" @click="ScanBarcode">
              Scan
            </v-btn>

          </v-card-actions>
        </v-card>
      </v-dialog>


      <v-text-field style="margin-top: 8px; max-width: 400px" @input="onFilterTextBoxChanged" v-model="searchFilter"
        light solo label="Search"></v-text-field>

      <v-spacer></v-spacer>
      <v-menu offset-y>
        <v-btn slot="activator" color="primary">
          Action
        </v-btn>
        <v-list>
          <v-list-tile @click="FilterDialog = true">
            <v-list-tile-title>Set Filters</v-list-tile-title>
          </v-list-tile>
          <v-list-tile @click="FilterScanBarcode = true">
            <v-list-tile-title>Scan Barcode</v-list-tile-title>
          </v-list-tile>
          <v-list-tile @click="openAdd">
            <v-list-tile-title>Add</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>

      <v-btn color="primary" v-if="rowData.length > 0" @click="downloadImages">
        Download Images
      </v-btn>

    </v-toolbar>
    <ag-grid-vue style="width: 100%; height: calc(100vh - 210px);" class="ag-theme-balham" :columnDefs="columnDefs"
      :rowData="rowData" :enableSorting="true" :enableFilter="true" rowSelection="multiple" :rowDeselection="true"
      :onGridReady="onGridReady" :enableColResize="true" :floatingFilter="true" :gridOptions="gridOptions"
      :suppressDragLeaveHidesColumns="true" :suppressMakeColumnVisibleAfterUnGroup="true"
      :suppressRowClickSelection="true" :enableRangeSelection="true"
      :defaultColDef="defaultColDef" :filterChanged="filterChanged" :sideBar='sideBar' @row-clicked="rowClicked">
    </ag-grid-vue>
    <v-toolbar dark dense flat>
      <p>{{ rowData.length }} Rows</p>
    </v-toolbar>
    <div class="text-xs-center">
      <v-dialog v-model="dialog" width="500">
        <v-card>

          <v-card-text style="text-align: center;">
            <img style="max-width: 250px; max-height: 250px;" :src="imgSrc" alt="">
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" @click="dialog = false">
              close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <ProductMaintModal ref="productMaint"></ProductMaintModal>
    <Dialog ref="dialog"></Dialog>
    <Prompt ref="prompt"></Prompt>
    <Spinner ref="spinner"></Spinner>
    <ProgressDialog ref="progressDialog"></ProgressDialog>
    <a style="display: none;" ref="anchor" href=""></a>
  </div>
</template>

<script>
  import {
    AgGridVue
  } from "ag-grid-vue";

  import VueCropper from 'vue-cropperjs';
  import BarcodeHandler from '@/libs/barcodeHandler.js';
  import Dialog from '@/components/Common/Dialog'
  import Prompt from '@/components/Common/Prompt'
  import Spinner from '@/components/Common/Spinner'
  import ProgressDialog from '@/components/Common/ProgressDialog'
  import ProductMaintModal from '@/components/Main/DataPreparation/Views/ImagePreparation/ProductMaintModal'
  import Axios from 'axios';
  import optionsComponent from './options.vue';
  import sideBarComponent from './SideBar'
  import imageComponent from './Image.vue'

  export default {
    name: 'Main',
    components: {
      AgGridVue,
      ProductMaintModal,
      Dialog,
      Prompt,
      Spinner,
      ProgressDialog,
      sideBarComponent,
      optionsComponent,
    },
    data() {
      return {
        searchFilter: "",
        dialog: false,
        editImageSrc: '',
        rotation: 0,
        FilterDialog: false,
        FilterScanBarcode: false,
        sheet: false,
        columnDefs: null,
        rowData: [],
        imgSrc: "",
        dialog: false,
        defaultColDef: {
          onCellValueChanged: this.onCellValueChanged
        },
        sideBar: {
          toolPanels: [
            'columns',
            'filters',
            {
              id: 'images',
              labelKey: 'images',
              labelDefault: 'Images',
              iconKey: 'filter',
              toolPanelFramework: 'sideBarComponent'
            },
          ],
          defaultToolPanel: 'images'
        },
        filters: null,
        activeShopCodes: [],
        activeShopCode: null,
        department: null,
        subdepartment: null,
        category: null,
        filterText: '',
        categoryCodes: [],
        dropdown_edit: [{
            text: '100%'
          },
          {
            text: '75%'
          },
          {
            text: '50%'
          },
          {
            text: '25%'
          },
          {
            text: '0%'
          }
        ],
        selectedItem: null,
        canUpdateSys: false,
        ScanBarcodeTextfield: ''
      }
    },
    computed: {
      activeShopCodesDropdown() {
        let self = this;

        let tmp = [];

        tmp.push({
          text: 'All',
          value: null
        })

        for (let index = 0; index < self.activeShopCodes.length; index++) {
          const element = self.activeShopCodes[index];
          tmp.push({
            text: element.displayname,
            value: element.id
          })
        }

        return tmp;
      },
      departments() {
        let self = this;

        let tmp = [];

        tmp.push({
          text: 'All',
          value: null
        })

        for (let index = 0; index < self.categoryCodes.length; index++) {
          const element = self.categoryCodes[index];
          tmp.push({
            text: element.department,
            value: element.departmentID
          })
        }

        return tmp;
      },
      subdepartments() {
        let self = this;

        let tmp = [];

        tmp.push({
          text: 'All',
          value: null
        })

        let bUseDepartment = (self.department != null);

        for (let index = 0; index < self.categoryCodes.length; index++) {
          const element = self.categoryCodes[index];

          if (bUseDepartment) {
            if (element.departmentID == self.department) {
              tmp.push({
                text: element.subdepartment,
                value: element.subdepartmentID
              })
            }
          } else {
            tmp.push({
              text: element.subdepartment,
              value: element.subdepartmentID
            })
          }
        }

        return tmp;
      },
      categories() {
        let self = this;

        let tmp = [];

        tmp.push({
          text: 'All',
          value: null
        })

        let bUseDepartment = (self.department != null);
        let bUseSubepartment = (self.subdepartment != null);

        for (let index = 0; index < self.categoryCodes.length; index++) {
          const element = self.categoryCodes[index];

          if (bUseDepartment || bUseSubepartment) {
            if (bUseDepartment) {
              if (bUseSubepartment) {
                if (element.departmentID == self.department && element.subdepartmentID == self.subdepartment) {
                  tmp.push({
                    text: element.category,
                    value: element.categoryID
                  })
                }
              } else {
                if (element.departmentID == self.department) {
                  tmp.push({
                    text: element.category,
                    value: element.categoryID
                  })
                }
              }
            } else {
              if (element.subdepartmentID == self.subdepartment) {
                tmp.push({
                  text: element.category,
                  value: element.categoryID
                })
              }
            }
          } else {
            tmp.push({
              text: element.category,
              value: element.categoryID
            })
          }
        }

        return tmp;
      },
      cRotation() {
        if (this.$refs.cropper != undefined) {
          this.$refs.cropper.rotateTo(parseInt(this.rotation))
        }

        return parseInt(this.rotation);
      }
    },
    beforeMount() {
      let self = this;

      self.getFilters();

      this.gridOptions = {
        context: {
          componentParent: this
        }
      };

      this.columnDefs = [{
          headerName: 'Product System ID',
          field: 'product_System_ID'
        },
        {
          headerName: 'Active Shop Code',
          field: 'active_Shop_Code'
        },
        {
          headerName: 'Barcode',
          field: 'barcode',
          editable: true
        },
        {
          headerName: 'Brand',
          field: 'brand',
          hide: true
        },
        {
          headerName: 'Manufacturer',
          field: 'manufacturer',
          hide: true
        },
        {
          headerName: 'Description',
          field: 'description',
          editable: true
        },
        {
          headerName: 'Planogram',
          field: 'planogram',
          editable: true
        },
        {
          headerName: 'Category',
          field: 'category',
        },
        {
          headerName: 'Category Code',
          field: 'category_Code',
        },
        {
          headerName: 'Subcategory',
          field: 'subcategory',
          editable: true
        },
        {
          headerName: 'Segment',
          field: 'segment',
          editable: true
        },
        {
          headerName: 'Size',
          field: 'size',
          editable: true,
          hide: true
        },
        {
          headerName: 'UOM',
          field: 'uom',
          editable: true,
          hide: true
        },
        {
          headerName: 'Size Description',
          field: 'size_Description',
          editable: true,
          hide: true
        },
        {
          headerName: 'Height',
          field: 'height',
          editable: true
        },
        {
          headerName: 'Width',
          field: 'width',
          editable: true
        },
        {
          headerName: 'Depth',
          field: 'depth',
          editable: true
        },
        {
          headerName: 'Image Audit',
          field: 'imageAudit',
          editable: true
        },
        // {
        //   headerName: 'Front',
        //   field: 'barcode',
        //   cellRendererFramework: 'imageComponent',
        //   hide: true
        // }, {
        //   headerName: 'Side',
        //   field: 'barcode',
        //   cellRendererFramework: 'imageComponent',
        //   hide: true
        // }, {
        //   headerName: 'Top',
        //   field: 'barcode',
        //   cellRendererFramework: 'imageComponent',
        //   hide: true
        // },
        {
          headerName: 'Options',
          field: 'barcode',
          cellRendererFramework: 'optionsComponent',
          pinned: 'right'
        }
      ];
    },
    methods: {
      onGridReady(params) {
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
        params.api.sizeColumnsToFit();
      },
      filter() {
        let self = this;
        self.$refs.spinner.show();
        self.FilterDialog = false;

        fetch(process.env.VUE_APP_API +
            `View/ProductCatalogue?activeShopCodeID=${self.activeShopCode}&departmentID=${self.department}&subdepartmentID=${self.subdepartment}&categoryLinkID=${self.category}`
          )
          .then(result => result.json())
          .then(rowData => {
            self.rowData = rowData;
            self.$refs.spinner.hide();
          });
      },
      ScanBarcode() {
        let self = this;

        Axios.get(process.env.VUE_APP_API + 'Product/ProductByBarcode?db=CR-Hinterland-Live&barcode=' + self
            .ScanBarcodeTextfield)
          .then(r => {
            self.FilterScanBarcode = false;
            self.rowData = [];
            self.rowData.push(r.data);
          })
          .catch(e => {
            alert("Failed to find a product. Please try again");
            console.log(e);
          })

      },
      getCSVData() {
        let self = this;

        self.gridApi.exportDataAsCsv({
          columnGroups: true,
          skipGroups: true,
          fileName: "Brandon"
        })
      },
      getFilters() {
        let self = this;

        fetch(process.env.VUE_APP_API +
            'View/Filters'
          )
          .then(result => result.json())
          .then(filters => {
            self.activeShopCodes = filters.activeShopCodes;
            self.categoryCodes = filters.categoryCodes;
          });
      },
      getSelectedRows() {
        const selectedNodes = this.gridApi.getSelectedNodes();
        const selectedData = selectedNodes.map(node => node.data);
        const selectedDataStringPresentation = selectedData.map(node => node.make + ' ' + node.model).join(', ');
        alert(`Selected nodes: ${selectedDataStringPresentation}`);
      },
      insertRow() {
        this.gridApi.updateRowData({
          add: [{}],
          addIndex: 0
        });
      },
      deleteRow(cell) {
        let self = this;
        self.$refs.dialog.openDialog({
          headline: "Are you sure?",
          text: "Delete this product?",
          callback() {
            self.gridApi.updateRowData({
              remove: [cell.data]
            });
          }
        })
      },
      removeSelected(product) {
        let self = this;

        let productIDS = [product.data.id];

        self.$refs.dialog.openDialog({
          headline: "Are you sure?",
          text: "Delete this product?",
          callback() {
            Axios.post(process.env.VUE_APP_API + `Product/Delete?db=CR-Hinterland-Live`, productIDS)
              .then(r => {
                self.gridApi.updateRowData({
                  remove: [product.data]
                });
              })
              .catch(e => {
                alert("There was an error deleting the product. " + e);
              })
          }
        })
      },
      onFilterTextBoxChanged() {
        let self = this;
        this.gridApi.setQuickFilter(self.filterText);
      },
      setImage(e) {
        const file = e.target.files[0];

        self.file = file;

        if (!file.type.includes('image/')) {
          alert('Please select an image file');
          return;
        }
        if (typeof FileReader === 'function') {
          const reader = new FileReader();
          reader.onload = (event) => {
            this.imgSrc = event.target.result;
            // rebuild cropperjs with the updated source
            this.$refs.cropper.replace(event.target.result);
          };
          reader.readAsDataURL(file);
        } else {
          alert('Sorry, FileReader API not supported');
        }
      },
      openAdd() {
        let self = this;

        this.$refs.productMaint.show({
          isAdd: true,
          afterClose: function (request) {
            self.saveProduct(request, newProduct => {
              self.$refs.spinner.hide();
              self.$refs.productMaint.hide();
            })
          }
        })
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

            Axios.put(process.env.VUE_APP_API + "Product?db=CR-Hinterland-Live", product.data)
              .then(r => {
                if (r.data) {
                  self.$refs.productMaint.hide();
                  product.node.setData(r.data);
                  self.$refs.spinner.hide();
                } else {
                  alert("Failed to update product.")
                  self.$refs.spinner.hide();
                }
              })
              .catch(e => {
                alert("Failed to update product. " + e)
              })
          }
        })
      },
      saveProduct(request, callback) {
        let self = this;

        self.$refs.spinner.show();

        Axios.post(process.env.VUE_APP_API + "Product?db=CR-Hinterland-Live", request)
          .then(newProduct => {
            callback(newProduct);
          })
      },
      rowClicked(e) {
        this.selectedItem = e;
      },
      updateProductSysID(product) {
        let self = this;

        let productID = product.data.id;

        self.$refs.prompt.show("", "Update Product System ID", "Product System ID:", newSysID => {
          Axios.post(process.env.VUE_APP_API + "Product/UpdateProductSystemID?db=CR-Hinterland-Live&productID=" +
              productID + "&newID=" + newSysID)
            .then(r => {
              if (r.data.success) {
                product.node.setDataValue('product_System_ID', newSysID);
              } else {
                alert(r.data.errorMessage);
              }
            })
            .catch(e => {
              alert("Failed to update product system ID. " + e)
            })
        })
      },
      onCellValueChanged(e) {
        if (e.newValue != e.oldValue) {
          Axios.put(process.env.VUE_APP_API + "Product?db=CR-Hinterland-Live", e.data)
            .then(r => {
              if (!r.data) {
                console.error("Failed to update item - " + e.data);
              }
            })
            .catch(ex => {
              console.error(ex);
            })
        }
      },
      filterChanged(e) {},
      onFilterTextBoxChanged() {
        let self = this;
        self.gridApi.setQuickFilter(self.searchFilter);
      },
      saveAs(data, url) {
        var self = this;
        var link = document.createElement('a');

        if (typeof link.download === 'string') {
          document.body.appendChild(link); // Firefox requires the link to be in the body
          link.download = 'result.zip';
          link.href = data;
          setTimeout(() => {
            link.click();
            document.body.removeChild(link); // remove the link when done
          }, 200)
        } else {
          // location.replace(url);
        }
      },
      downloadImages() {
        let self = this;

        let barcodes = [];

        self.gridApi.forEachNode((node, idx) => {
          barcodes.push(node.data.barcode);
        })

        self.$refs.progressDialog.setCurrentValue(0);
        self.$refs.progressDialog.setText("Downloading Images");
        self.$refs.progressDialog.show();

        Axios({
            method: 'POST',
            data: barcodes,
            url: process.env.VUE_APP_API + "ProductImage/DownloadMany?rangeStart=1&rangeEnd=3&type=0",
            cache: false,
            responseType: 'blob',
            processData: false,
            contentType: "application/octet-stream",
            onDownloadProgress: (progressEvent => {
              if (progressEvent.lengthComputable) {
                self.$refs.progressDialog.setCurrentValue(progressEvent.loaded / progressEvent.total)
              }
            })
          })
          .then(r => {
            if (r.data) {
              self.$refs.progressDialog.hide();
              var objectUrl = URL.createObjectURL(r.data)
              self.saveAs(objectUrl, '')
            }
          })
      }
    }
  }
</script>
<style>
  .grid-image {
    max-width: 25px;
    max-height: 25px;
  }

  .side-image {
    max-width: 150px;
    max-height: 150px;
  }
</style>

<style scoped>
  .img-big {
    max-width: 50px;
    max-height: 50px;
  }
</style>