<template>
  <v-dialog persistent v-model="modalShow" max-width="50vw">
    <v-card dark v-if="newData != null">
      <v-card-title class="text-xs-center">Product Properties - {{ newData.description }}</v-card-title>
      <v-divider></v-divider>
      <v-tabs centered dark icons-and-text dense>
        <v-tabs-slider color="white"></v-tabs-slider>
        <v-tab href="#tab-overview">Overview
          <v-icon></v-icon>
        </v-tab>
        <v-tab href="#tab-dimensions">Dimensions
          <v-icon></v-icon>
        </v-tab>
        <v-tab href="#tab-color">Colour
          <v-icon></v-icon>
        </v-tab>

        <!-- dimensions -->
        <v-tab-item value="tab-overview" id="tab-overview">
          <v-card>
            <v-container>
              <v-layout row wrap>
                <v-flex xs4>
                  <v-text-field
                    type="number"
                    v-model="CalculationData.XFacings"
                    label="X Facings"
                    disabled
                    read-only
                  ></v-text-field>
                </v-flex>
                <v-flex xs4>
                  <v-text-field
                    type="number"
                    v-model="CalculationData.Capacity"
                    label="Capacity"
                    disabled
                    read-only
                  ></v-text-field>
                </v-flex>
                <v-flex xs4>
                  <v-text-field
                    type="number"
                    v-model="CalculationData.DaysOfSupply"
                    label="Days of Supply"
                    disabled
                    read-only
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card>
          <v-divider></v-divider>
        </v-tab-item>

        <v-tab-item value="tab-dimensions" id="tab-dimensions">
          <v-card flat>
            <v-card-text>
              <v-container elevation-5 grid-list-md>
                <v-layout row wrap>
                  <v-flex xs4>
                    <v-text-field type="number" v-model="newData.height" label="Height"></v-text-field>
                  </v-flex>
                  <v-flex xs4>
                    <v-text-field type="number" v-model="newData.width" label="Width"></v-text-field>
                  </v-flex>
                  <v-flex xs4>
                    <v-text-field type="number" v-model="newData.depth" label="Depth"></v-text-field>
                  </v-flex>
                </v-layout>
                <v-divider></v-divider>
              </v-container>
            </v-card-text>
          </v-card>
        </v-tab-item>

        <!-- color -->
        <v-tab-item value="tab-color" id="tab-color">
          <v-card flat>
            <v-card-text>
              <v-container elevation-5 grid-list-md>
                <v-layout row wrap>
                  <v-flex xs4>
                    <v-text-field type="text" v-model="newData.color" label="Colour"></v-text-field>
                  </v-flex>
                </v-layout>
                <v-divider></v-divider>
              </v-container>
            </v-card-text>
            <!-- <v-layout row wrap justify-end>
              <v-card-actions class>
                <v-btn color="primary" flat @click="save">Save</v-btn>
                <v-btn color="danger" flat @click="destroy">Close</v-btn>
              </v-card-actions>
            </v-layout>-->
          </v-card>
        </v-tab-item>
      </v-tabs>
      <!-- <v-card-text>
                <v-header>Dimensions</v-header>
                <v-container elevation-5>
                    <v-text-field type='number' v-model="newData.height" label="Height"></v-text-field>
                    <v-text-field type='number' v-model="newData.width" label="Width"></v-text-field>
                    <v-text-field type='number' v-model="newData.depth" label="Depth"></v-text-field>
                    <v-divider></v-divider>
                </v-container>
            </v-card-text>
            <v-layout row wrap justify-end>
                <v-card-actions class="">
                    <v-btn color="primary" flat @click="save">Save</v-btn>
                    <v-btn color="danger" flat @click="destroy">Close</v-btn>
                </v-card-actions>
      </v-layout>-->
      <v-layout row wrap>
        <v-btn color="red" @click="deleteProduct">Delete</v-btn>
        <v-spacer></v-spacer>
        <v-card-actions class>
          <v-btn color="primary" @click="save">Save</v-btn>
          <v-btn color="red" @click="destroy">Close</v-btn>
        </v-card-actions>
      </v-layout>
    </v-card>
  </v-dialog>
</template>

<script>
import EventBus from "@/components/Main/Planogram/spaceplanning/src/libs/EventBus/EventBus.js";
import CustomEmitter from "@/components/Main/Planogram/spaceplanning/src/libs/EventBus/CustomEmitter.js";
import CalculationHandler from "@/components/Main/Planogram/spaceplanning/src/libs/CalculationLib/calculationHandler.js";
import StoreHelper from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/StoreHelper/StoreHelper.js";

export default {
  data() {
    return {
      modalShow: false,
      newData: null,
      type: null,
      id: null,
      ProductObj: null,
      CalculationData: {
        XFacings: null,
        Capacity: null,
        DaysOfSupply: null
      },
      CalculationHandler: new CalculationHandler()
    };
  },
  created() {
    // EventBus.$on("MODAL_LOAD", this.open);
  },
  beforeDestroy() {
    EventBus.$off("MODAL_LOAD", this.open);
  },
  methods: {
    open(eventData) {
      let self = this;
      if (eventData.type.toUpperCase() === "PRODUCT") {
        console.log("PRODUCT MODAL EVENT :", eventData);
        self.modalShow = true;
        self.newData = eventData.object.Data;
        self.id = eventData.id;
        self.type = eventData.type;
        self.ProductObj = eventData.object;
        self.Calculate();
      } else {
        self.destroy();
      }
    },
    Calculate() {
      let self = this;
      var calcData = self.CalculationData;

      let productBarcode = self.newData.barcode;
      let productData;

      let ctrl_store = new StoreHelper();
      let productStoreCopy = ctrl_store.getAllPlanogramItemsByType(
        self.$store,
        "PRODUCT"
      );
      productStoreCopy = productStoreCopy.slice(0, productStoreCopy.length);

      var newArr = productStoreCopy.filter(el => {
        return el.Data.barcode == productBarcode;
      });

      productData = {
        ProductData: newArr[0].Data,
        Facings_X: newArr[0].Facings_X,
        Facings_Y: newArr[0].Facings_Y,
        Facings_Z: newArr[0].Facings_Z,
        TotalFacings: newArr[0].TotalFacings
      };

      if (newArr.length > 1) {
        newArr.forEach((element, index) => {
          if (index > 0) {
            productData.Facings_X += element.Facings_X;
            productData.Facings_Y += element.Facings_Y;
            productData.Facings_Z += element.Facings_Z;
            productData.TotalFacings += element.TotalFacings;
          }
        });
      }

      console.log("[PRODUCT MODAL] Calculate", productBarcode, productStoreCopy, productData)

      calcData.DaysOfSupply = self.CalculationHandler.Calculate_Days_Of_Supply_Potential(
        productData.TotalFacings,
        productData.ProductData.sales_Units
      );
      calcData.XFacings = productData.Facings_X;
      calcData.Capacity = productData.TotalFacings;
    },
    save() {
      let self = this;  
      let event = new CustomEmitter();
      event.modal_saved(EventBus, self.type, self.newData, self.id);
      self.destroy();
    },
    destroy() {
      let self = this;
      self.modalShow = false;
      // self.newData = null;
      // self.id = null;
      // self.type = null;
    },
    deleteProduct() {
      let self = this;
      let event = new CustomEmitter();
      self.newData.id = self.id;
      event.delete_product(EventBus, self.newData, self.ProductObj);
      self.destroy();
    }
  }
};
</script>

<style scoped>
</style>