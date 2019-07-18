<template>
  <v-card>
    <div>
      <SoftwareToolbar :openDatabaseText="'Open Planogram'" :afterOpenDatabase="openFile"></SoftwareToolbar>
      <v-container fluid grid-list-lg>
        <v-layout row wrap>
          <v-toolbar dark>
            <h3 v-if="selectedPlanogram != null">
              <span>Planogram Maintenance</span>
              <span>-</span>
              <span class="font-weight-light">{{ selectedPlanogram.displayname }}</span>
            </h3>
            <h3 v-if="selectedPlanogram == null">Planogram Maintenance</h3>
            <!-- <v-btn-toggle v-model="toggle_type">
            <v-btn flat>Planogram</v-btn>
            <v-btn flat>Category</v-btn>
            <v-btn flat>Unassigned</v-btn>
          </v-btn-toggle> -->
            <v-spacer></v-spacer>
            <!-- <v-text-field solo hide-details></v-text-field> -->
            <v-spacer></v-spacer>
            <v-btn @click="changeName" :disabled="selectedPlanogram == null" color="primary">Change Name</v-btn>
            <v-btn @click="changeActiveShopCode" :disabled="selectedItems.length < 1" color="primary">Update Active
              Shop
              Code</v-btn>
            <v-btn @click="move" :disabled="selectedItems.length <= 0" color="primary">move</v-btn>
          </v-toolbar>
          <ag-grid-vue @selection-changed="onSelectionChanged" :sideBar='true' style="width: 100%;  height: 70vh;"
            class="ag-theme-balham" :columnDefs="columnDefs" :gridOptions="gridOptions" :rowData="rowData"
            :enableSorting="true" :enableFilter="true" rowSelection="multiple" :rowDeselection="true"
            :enableColResize="true" :suppressRowClickSelection="true" :floatingFilter="true" :onGridReady="onGridReady"
            :groupMultiAutoColumn="true">
          </ag-grid-vue>
          <div>
            <p>{{ rowData.length }} Rows</p>
          </div>
          <div style="margin-left: 5px;">
            <p>{{ selectedItems.length }} Selected</p>
          </div>
        </v-layout>
      </v-container>
      <PlanogramSelector ref="planogramSelector"></PlanogramSelector>
      <NewOrExistingSelector ref="newOrExist"></NewOrExistingSelector>
      <ActiveShopCodeSelector ref="activeShopCodeSelector"></ActiveShopCodeSelector>
      <Prompt ref="prompt"></Prompt>
      <Dialog ref="Dialog" />
      <div class="text-xs-center">
        <v-dialog v-model="dialog" width="500">
          <v-card dark>

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
    </div>
  </v-card>
</template>

<script>
  import BarcodeHandler from '@/libs/barcodeHandler.js';

  import SoftwareToolbar from '@/components/Common/SoftwareToolbar';
  import PlanogramSelector from '@/components/Common/PlanogramSelector';
  import NewOrExistingSelector from '@/components/Common/NewOrExistingSelector'
  import ActiveShopCodeSelector from '@/components/Common/ActiveShopCodeSelector'
  import Prompt from '@/components/Common/Prompt'
  import Dialog from '@/components/Common/Dialog'
  import {
    AgGridVue
  } from "ag-grid-vue";
  import Axios from "axios";

  export default {
    beforeMount() {
      this.gridOptions = {
        context: {
          componentParent: this
        },
        selectionChanged: this.onSelectionChanged
      };
    },
    data() {
      return {
        toggle_type: 0,
        rowData: [],
        columnDefs: [],
        selectedItems: [],
        selectedPlanogram: null,
        imgSrc: null,
        dialog: false
      }
    },
    components: {
      SoftwareToolbar,
      AgGridVue,
      PlanogramSelector,
      NewOrExistingSelector,
      Prompt,
      Dialog,
      ActiveShopCodeSelector,
      imageComponent: {
        template: `<div @dblclick="openImage" style="text-align: center; cursor: pointer;">
                      <img class="grid-image" :src="getImage()">
                  </div>`,
        methods: {
          getImage() {
            return "http://160.119.254.66:8800/api/" + BarcodeHandler.imageFromBarcode(this.params.data.barcode, 1, "")
          },
          openImage() {
            this.params.context.componentParent.imgSrc = this.getImage();
            this.params.context.componentParent.dialog = true;
          }
        }
      },
    },
    created() {
      let self = this;

      self.columnDefs = [{
          headerName: 'Product',
          field: 'product',
          headerCheckboxSelection: true,
          headerCheckboxSelectionFilteredOnly: true,
          checkboxSelection: true
        }, {
          headerName: "Product System ID",
          field: 'product_System_ID'
        }, {
          headerName: 'Barcode',
          field: 'barcode'
        }, {
          headerName: 'Brand',
          field: 'brand',
          hide: true
        }, {
          headerName: 'Manufacturer',
          field: 'manufacturer',
          hide: true
        }, {
          headerName: 'Category',
          field: 'category',
        }, {
          headerName: 'Subcategory',
          field: 'subcategory',
          hide: true
        }, {
          headerName: 'Active_Shop_Code',
          field: 'active_Shop_Code',
        },
        {
          headerName: 'Image',
          field: 'barcode',
          cellRendererFramework: 'imageComponent',
          hide: true
        }
      ]
    },
    methods: {
      onGridReady(params) {
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
      },
      openFile() {
        let self = this;

        self.$refs.planogramSelector.show(true, (data, type) => {
          let activeShopCodeID = type;

          if (type == 0)
            activeShopCodeID = 3

          if (type == 1)
            activeShopCodeID = 1

          if (type == 2)
            activeShopCodeID = 2

          Axios.get(process.env.VUE_APP_API +
              `PlanogramProduct?planogramID=${data.planogram_ID}&activeShopCodeID=${activeShopCodeID}`)
            .then(r => {
              self.selectedPlanogram = data;
              self.rowData = r.data.planogramProductList;
              self.gridApi.sizeColumnsToFit();
            })

          //self.applyFilter("planogram", data.displayname);
        })
      },
      newFile() {
        let self = this;

        self.$refs.planogramSelector.show(data => {
          self.applyFilter("planogram", data.displayname);
        })
      },
      applyFilter(instance, value) {
        let self = this;
        var filterComponent = self.gridApi.getFilterInstance(instance);
        filterComponent.selectNothing();
        filterComponent.selectValue(value);
        self.gridApi.onFilterChanged();
      },
      onSelectionChanged(e) {
        console.log(e);

        var rows = e.api.getSelectedNodes();
        this.selectedItems = rows;
      },
      move() {
        let self = this;

        self.$refs.newOrExist.show("New or Existing?", noe => {
          if (noe == 'new') {
            self.$refs.prompt.show('', 'Please enter a planogram name', 'planogram name:', planoName => {
              // CHECK NAME HERE
              Axios.post(process.env.VUE_APP_API + "Planogram?db=CR-Hinterland-Live&planogramName=" +
                  planoName)
                .then(newPlanoRes => {
                  console.log(newPlanoRes);
                  if (newPlanoRes.data == "exists") {
                   let tmp = {
                      headline: "Name already in use",
                      text: "Please Use another name and try again"
                    }
                    self.$refs.Dialog.openDialog(tmp)
                  } else {
                    let request = []
                    self.selectedItems.forEach(el => {
                      request.push({
                        "id": el.data.id,
                        "product_ID": el.data.product_ID,
                        "planogram_ID": newPlanoRes.data.id,
                        "default_Planogram": true,
                        "packaging_Type": ""
                      })
                    })

                    // Axios.put(process.env.VUE_APP_API + "Planogram?db=CR-Hinterland-Live", request)
                    //   .then(r => {
                    //     console.log(r);

                    //     var rows = self.gridApi.getSelectedRows();
                    //     self.gridApi.updateRowData({
                    //       remove: rows
                    //     })
                    //   })
                  }
                })
            })
          }

          if (noe == 'existing') {
            self.$refs.planogramSelector.show(false, plano => {

              let request = []

              self.selectedItems.forEach(el => {

                request.push({
                  "id": el.data.id,
                  "product_ID": el.data.product_ID,
                  "planogram_ID": plano.planogram_ID,
                  "default_Planogram": true,
                  "packaging_Type": ""
                })
              })

              Axios.put(process.env.VUE_APP_API + "Planogram?db=CR-Hinterland-Live", request)
                .then(r => {
                  var rows = self.gridApi.getSelectedRows();
                  self.gridApi.updateRowData({
                    remove: rows
                  })
                })
            })
          }
        })
      },
      changeName() {
        let self = this;

        self.$refs.prompt.show(self.selectedPlanogram.displayname, 'Please enter a planogram name', 'planogram name:',
          newName => {
            if (newName == "") {
              alert("Name cannot be empty!");
            } else {
              Axios.put(process.env.VUE_APP_API +
                  `PlanogramName?db=CR-Hinterland-Live&planogramID=${self.selectedPlanogram.planogram_ID}&newName=${newName}`
                )
                .then(r => {
                  self.selectedPlanogram.displayname = newName;
                  console.log(r);
                })
            }
          })
      },
      changeActiveShopCode() {
        let self = this;

        self.$refs.activeShopCodeSelector.show('Select active shop code', 'active shop code:', asc => {
          let request = [];
          self.selectedItems.forEach(el => {
            request.push(el.data.product_ID);
          })

          Axios.put(process.env.VUE_APP_API + "ActiveShopCode?db=CR-Hinterland-Live&activeShopCodeId=" + asc,
              request)
            .then(r => {
              var rows = self.gridApi.getSelectedRows();
              self.gridApi.updateRowData({
                remove: rows
              })
            })
        })
      }
    }
  }

  // split - Split selected items into a new Planogram. Selected items will be removed from the current planogram.
  // duplicate - duplicate all items into a new planogram
</script>

<style>
  .grid-image {
    max-width: 25px;
    max-height: 25px;
  }
</style>

<style scoped>
  .img-big {
    max-width: 50px;
    max-height: 50px;
  }
</style>