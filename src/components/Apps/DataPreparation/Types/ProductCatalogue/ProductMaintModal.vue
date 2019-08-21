<template>
  <div>
    <v-dialog fullscreen persistent v-model="dialog">

      <v-card dark>
        <v-card-title class="headline" primary-title>
          Product Maintenance
          <v-spacer></v-spacer>
          <v-btn v-if="!isAdd" small fab class="ma-0" @click="removeProduct" color="error">
            <v-icon>delete</v-icon>
          </v-btn>
        </v-card-title>

        <v-tabs centered color="grey darken-4" dark slider-color="primary" v-model="tab">
          <v-tab href="#details">Details</v-tab>
          <v-tab href="#product">Image</v-tab>
          <v-tab v-if="planoData != null" href="#planoData">Plano Data</v-tab>
        </v-tabs>

        <v-card-text class="main-container">
          <v-layout row wrap>
            <v-flex>
              <v-tabs-items v-model="tab">
                <v-tab-item value="details">
                  <v-card class="tab-height">
                    <v-container fluid grid-list-lg>
                      <v-layout row wrap>
                        <v-flex lg4 md12>
                          <v-card class="elevation-5 card-height">
                            <v-toolbar dense>
                              <v-spacer></v-spacer>
                              <v-toolbar-title>General</v-toolbar-title>
                              <v-spacer></v-spacer>
                            </v-toolbar>
                            <v-container fluid grid-list-lg>
                              <v-layout row wrap>
                                <v-flex md8>
                                  <v-text-field v-model="form.product_System_ID" :disabled="generateProductSysCode"
                                    dense hide-details label="Product System ID"></v-text-field>
                                </v-flex>
                                <v-flex md4>
                                  <v-checkbox v-if="isAdd" hide-details color="primary" @change="checkIfGenerate"
                                    v-model="generateProductSysCode" label="Generate"></v-checkbox>
                                </v-flex>
                                <v-flex md8>
                                  <v-text-field v-model="form.barcode" dense hide-details label="* Barcode"></v-text-field>
                                </v-flex>
                                <v-flex md8>
                                  <v-text-field v-model="form.product_Code" dense hide-details label="* Product Code"></v-text-field>
                                </v-flex>
                                <v-flex md12>
                                  <v-text-field v-model="form.description" dense hide-details label="* Description"></v-text-field>
                                </v-flex>
                                <v-flex md6>
                                  <v-autocomplete v-model="form.categoryLink_ID" :items="dropdownFilters.categoryLinks"
                                    label="* Category"></v-autocomplete>
                                </v-flex>
                                <v-flex md6>
                                  <v-autocomplete v-model="form.subcategory_ID" :items="dropdownFilters.subcategories"
                                    label="Subcategory"></v-autocomplete>
                                </v-flex>
                                <v-flex md6>
                                  <v-autocomplete v-model="form.segment_ID" :items="dropdownFilters.segments" label="Segment"></v-autocomplete>
                                </v-flex>
                                <v-flex md6>
                                  <v-autocomplete v-model="form.subsegment_ID" :items="dropdownFilters.subsegments"
                                    label="Subsegment"></v-autocomplete>
                                </v-flex>
                                <v-flex md6>
                                  <v-autocomplete v-model="form.planogram_ID" :items="dropdownFilters.planograms" label="* Planogram"></v-autocomplete>
                                </v-flex>
                                <v-flex md6>
                                  <v-autocomplete :disabled="generateProductSysCode && form.product_System_ID == 'Generate_SYS_Product_ID'"
                                    v-model="form.active_Shop_Code_ID" :items="dropdownFilters.active_Shop_Codes" label="Active Shop Code"></v-autocomplete>
                                </v-flex>
                              </v-layout>
                            </v-container>
                          </v-card>
                        </v-flex>
                        <v-flex lg4 md6>
                          <v-card class="elevation-5 card-height">
                            <v-toolbar dense>
                              <v-spacer></v-spacer>
                              <v-toolbar-title>Supplier</v-toolbar-title>
                              <v-spacer></v-spacer>
                            </v-toolbar>
                            <v-container fluid grid-list-lg>
                              <v-layout row wrap>
                                <v-flex md8>
                                  <v-autocomplete v-model="form.brand_ID" :items="dropdownFilters.brands" label="* Brand"></v-autocomplete>
                                </v-flex>
                                <v-flex md8>
                                  <v-autocomplete v-model="form.manufacturer_ID" :items="dropdownFilters.manufacturers"
                                    label="* Manufacturer"></v-autocomplete>
                                </v-flex>
                                <v-flex md8>
                                  <v-autocomplete v-model="form.supplier_ID" :items="dropdownFilters.suppliers" label="Supplier"></v-autocomplete>
                                </v-flex>
                              </v-layout>
                            </v-container>
                          </v-card>
                        </v-flex>
                        <v-flex lg4 md6>
                          <v-card class="elevation-5 card-height">
                            <v-toolbar dense>
                              <v-spacer></v-spacer>
                              <v-toolbar-title>Size Information</v-toolbar-title>
                              <v-spacer></v-spacer>
                            </v-toolbar>
                            <v-container fluid grid-list-lg>
                              <v-layout row wrap>
                                <v-flex md6>
                                  <v-text-field v-model="form.size" dense hide-details label="Size"></v-text-field>
                                </v-flex>
                                <v-flex md6>
                                  <v-text-field v-model="form.uom" dense hide-details label="UOM"></v-text-field>
                                </v-flex>
                                <v-flex md6>
                                  <v-text-field v-model="form.size_Description" dense hide-details label="Size Description"></v-text-field>
                                </v-flex>
                                <v-flex md6>
                                  <v-text-field v-model="form.case_Pack_QTY" dense hide-details label="Case Pack Quantity"></v-text-field>
                                </v-flex>
                              </v-layout>
                            </v-container>
                          </v-card>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-card>
                </v-tab-item>
                <v-tab-item value="product">
                  <v-card class="tab-height">
                    <v-container fluid grid-list-lg>
                      <v-layout row wrap>
                        <v-flex lg4 md6 sm6>
                          <v-card class="elevation-5 card-height">
                            <v-card-text>
                              <v-layout row wrap>
                                <v-flex md12>
                                  <v-btn-toggle @change="changePackingType" v-model="product_type" mandatory>
                                    <v-btn small flat>General</v-btn>
                                    <v-btn small flat>Tray</v-btn>
                                    <v-btn small flat>Case</v-btn>
                                    <v-btn small flat>Shrink</v-btn>
                                    <v-btn small flat>Pallet</v-btn>
                                  </v-btn-toggle>
                                </v-flex>
                                <v-flex md10 v-if="product_type == 0">
                                  <v-select :items="form.aleternateBarcode" v-model="bcDropdown" dense hide-details
                                    label="Alternate Barcode" @change="getAlternateImages"></v-select>
                                </v-flex>
                                <v-flex md2 v-if="product_type == 0">

                                  <v-speed-dial style="z-index: 99999;" v-model="fab" :top="top" :bottom="bottom"
                                    :right="right" :direction="direction" :open-on-hover="hover" :transition="transition">
                                    <v-btn small slot="activator" v-model="fab" color="primary" dark fab>
                                      <v-icon>more_vert</v-icon>
                                      <v-icon>close</v-icon>
                                    </v-btn>
                                    <v-btn fab dark small color="indigo">
                                      <v-icon @click="openAltBarcodeDialog('ADD')">add</v-icon>
                                    </v-btn>
                                    <v-btn v-if="bcDropdown != -1" fab dark small color="green">
                                      <v-icon @click="openAltBarcodeDialog('EDIT')">edit</v-icon>
                                    </v-btn>
                                    <v-btn v-if="bcDropdown != -1" fab dark small color="red" @click="deleteAlternateBarcode">
                                      <v-icon>delete</v-icon>
                                    </v-btn>
                                  </v-speed-dial>

                                </v-flex>
                                <v-flex md12 sm12 v-if="product_type == 1">
                                  <v-text-field v-model="form.tray_Barcode" dense hide-details label="Tray Barcode"></v-text-field>
                                </v-flex>
                                <v-flex md12 sm12 v-if="product_type == 2">
                                  <v-text-field v-model="form.case_Barcode" dense hide-details label="Case Barcode"></v-text-field>
                                </v-flex>
                                <v-flex md12 sm12 v-if="product_type == 3">
                                  <v-text-field v-model="form.shrink_Barcode" dense hide-details label="Shrink Barcode"></v-text-field>
                                </v-flex>
                                <v-flex md12 sm12 v-if="product_type == 4">
                                  <v-text-field v-model="form.pallet_Barcode" dense hide-details label="Pallet Barcode"></v-text-field>
                                </v-flex>
                                <v-flex md4 sm4>
                                  <v-menu v-model="showMenu" :position-x="x" :position-y="y" absolute offset-y>
                                    <v-list>
                                      <v-list-tile v-for="(item, index) in items" :key="index" @click="ImageSave">
                                        <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                                      </v-list-tile>
                                    </v-list>
                                  </v-menu>
                                  <div class="subheading">Front</div>
                                  <v-hover>
                                    <v-card @contextmenu="showImageMenu($event, 1)" slot-scope="{ hover }" :class="`elevation-${hover ? 12 : 2}`"
                                      class="mx-auto hover">
                                      <v-img ref="image1" @click="openFile(1)" :src="image1" :lazy-src="`static\img\no-image.png`"
                                        aspect-ratio="1" class="grey lighten-2">
                                        <v-layout slot="placeholder" fill-height align-center justify-center ma-0>
                                          <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                                        </v-layout>
                                      </v-img>
                                    </v-card>
                                  </v-hover>
                                </v-flex>
                                <v-flex md4 sm4>
                                  <div class="subheading">Side</div>
                                  <v-hover>
                                    <v-card @contextmenu="showImageMenu($event, 2)" slot-scope="{ hover }" :class="`elevation-${hover ? 12 : 2}`"
                                      class="mx-auto hover">
                                      <v-img @click="openFile(2)" :src="image2" :lazy-src="`static\img\no-image.png`"
                                        aspect-ratio="1" class="grey lighten-2">
                                        <v-layout slot="placeholder" fill-height align-center justify-center ma-0>
                                          <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                                        </v-layout>
                                      </v-img>
                                    </v-card>
                                  </v-hover>
                                </v-flex>
                                <v-flex md4 sm4>
                                  <div class="subheading">Top</div>
                                  <v-hover>
                                    <v-card @contextmenu="showImageMenu($event, 3)" slot-scope="{ hover }" :class="`elevation-${hover ? 12 : 2}`"
                                      class="mx-auto hover">
                                      <v-img @click="openFile(3)" :src="image3" :lazy-src="`static\img\no-image.png`"
                                        class="grey lighten-2">
                                        <v-layout slot="placeholder" fill-height align-center justify-center ma-0>
                                          <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                                        </v-layout>
                                      </v-img>
                                    </v-card>
                                  </v-hover>
                                </v-flex>
                                <v-flex md4 v-if="product_type == 0">
                                  <v-text-field v-model="form.height" dense hide-details type="number" label="Height"
                                    suffix="cm"></v-text-field>
                                </v-flex>
                                <v-flex md4 v-if="product_type == 0">
                                  <v-text-field v-model="form.width" dense hide-details type="number" label="Width"
                                    suffix="cm"></v-text-field>
                                </v-flex>
                                <v-flex md4 v-if="product_type == 0">
                                  <v-text-field v-model="form.depth" dense hide-details type="number" label="Depth"
                                    suffix="cm"></v-text-field>
                                </v-flex>
                                <v-flex md4 v-if="product_type == 1">
                                  <v-text-field v-model="form.tray_Height" dense hide-details type="number" label="Tray Height"
                                    suffix="cm"></v-text-field>
                                </v-flex>
                                <v-flex md4 v-if="product_type == 1">
                                  <v-text-field v-model="form.tray_Width" dense hide-details type="number" label="Tray Width"
                                    suffix="cm"></v-text-field>
                                </v-flex>
                                <v-flex md4 v-if="product_type == 1">
                                  <v-text-field v-model="form.tray_Depth" dense hide-details type="number" label="Tray Depth"
                                    suffix="cm"></v-text-field>
                                </v-flex>
                                <v-flex md4 v-if="product_type == 1">
                                  <v-text-field v-model="form.tray_Qty" dense hide-details type="number" label="Tray Qty"></v-text-field>
                                </v-flex>
                                <v-flex md4 v-if="product_type == 2">
                                  <v-text-field v-model="form.case_Height" dense hide-details type="number" label="Case Height"
                                    suffix="cm"></v-text-field>
                                </v-flex>
                                <v-flex md4 v-if="product_type == 2">
                                  <v-text-field v-model="form.case_Width" dense hide-details type="number" label="Case Width"
                                    suffix="cm"></v-text-field>
                                </v-flex>
                                <v-flex md4 v-if="product_type == 2">
                                  <v-text-field v-model="form.case_Depth" dense hide-details type="number" label="Case Depth"
                                    suffix="cm"></v-text-field>
                                </v-flex>
                                <v-flex md4 v-if="product_type == 2">
                                  <v-text-field v-model="form.case_Qty" dense hide-details type="number" label="Case Qty"></v-text-field>
                                </v-flex>
                                <v-flex md4 v-if="product_type == 3">
                                  <v-text-field v-model="form.shrink_Height" dense hide-details type="number" label="Shrink Height"
                                    suffix="cm"></v-text-field>
                                </v-flex>
                                <v-flex md4 v-if="product_type == 3">
                                  <v-text-field v-model="form.shrink_Width" dense hide-details type="number" label="Shrink Width"
                                    suffix="cm"></v-text-field>
                                </v-flex>
                                <v-flex md4 v-if="product_type == 3">
                                  <v-text-field v-model="form.shrink_Depth" dense hide-details type="number" label="Shrink Depth"
                                    suffix="cm"></v-text-field>
                                </v-flex>
                                <v-flex md4 v-if="product_type == 3">
                                  <v-text-field v-model="form.shrink_Qty" dense hide-details type="number" label="Shrink Qty"></v-text-field>
                                </v-flex>
                                <v-flex md4 v-if="product_type == 4">
                                  <v-text-field v-model="form.pallet_Height" dense hide-details type="number" label="Pallet Height"
                                    suffix="cm"></v-text-field>
                                </v-flex>
                                <v-flex md4 v-if="product_type == 4">
                                  <v-text-field v-model="form.pallet_Width" dense hide-details type="number" label="Pallet Width"
                                    suffix="cm"></v-text-field>
                                </v-flex>
                                <v-flex md4 v-if="product_type == 4">
                                  <v-text-field v-model="form.pallet_Depth" dense hide-details type="number" label="Pallet Depth"
                                    suffix="cm"></v-text-field>
                                </v-flex>
                                <v-flex md4 v-if="product_type == 4">
                                  <v-text-field v-model="form.pallet_Qty" dense hide-details type="number" label="Pallet Qty"></v-text-field>
                                </v-flex>
                                <v-flex md12>
                                  <v-checkbox true-value v-model="form.imageAudit" label="Image Audit?" color="primary"></v-checkbox>
                                </v-flex>
                              </v-layout>
                            </v-card-text>
                          </v-card>
                        </v-flex>
                        <v-flex lg8 md6 sm6>
                          <v-layout row wrap>
                            <v-flex lg8 md12>
                              <v-card style="height: calc(100vh - 250px)" class="elevation-5 card-height">
                                <v-card-text style="text-align: center;">
                                  <vue-cropper :img-style="{ 'max-width': '100%', 'height': 'calc(100vh - 290px)' }"
                                    ref="cropper" :src="imgSrc" alt="Source Image" :cropmove="cropImage">
                                  </vue-cropper>
                                </v-card-text>
                              </v-card>
                            </v-flex>
                            <v-flex lg4 md12 sm12>
                              <v-card class="text-md-center elevation-5 card-height">
                                <v-card-title style="text-align: center;">Tools</v-card-title>
                                <v-card-text>
                                  <v-btn-toggle @change="setMode" v-model="toggle" mandatory>
                                    <v-btn small>
                                      <v-icon>add</v-icon>
                                    </v-btn>
                                    <v-btn small>
                                      <v-icon>photo_size_select_large</v-icon>
                                    </v-btn>
                                  </v-btn-toggle>
                                  <v-divider vertical></v-divider>
                                  <v-btn-toggle>
                                    <v-btn small @click="zoomIn">
                                      <v-icon>zoom_in</v-icon>
                                    </v-btn>
                                    <v-btn small @click="zoomOut">
                                      <v-icon>zoom_out</v-icon>
                                    </v-btn>
                                  </v-btn-toggle>
                                  <v-divider vertical></v-divider>
                                  <v-btn-toggle>
                                    <v-btn small @click="flipHorizontal">
                                      <v-icon>swap_horiz</v-icon>
                                    </v-btn>
                                    <v-btn small @click="flipVertical">
                                      <v-icon>swap_vert</v-icon>
                                    </v-btn>
                                  </v-btn-toggle>
                                  <v-divider></v-divider>
                                  <v-slider :max="360" :min="0" v-model="rotation" prepend-icon="rotate_right"></v-slider>
                                  {{ iRotation }} deg
                                  <v-divider></v-divider>
                                  <v-divider></v-divider>
                                  <v-btn color="primary" @click="selectImage">Choose Image</v-btn>
                                  <v-btn color="primary" @click="updateImage">Upload Image</v-btn>
                                  <v-progress-linear v-model="uploadValue" v-if="showLoader" :indeterminate="inditerminate"></v-progress-linear>
                                  <div style="text-align: right;">
                                  </div>
                                </v-card-text>
                              </v-card>
                            </v-flex>
                          </v-layout>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-card>
                </v-tab-item>
                <v-tab-item value="planoData">
                  <v-card class="tab-height">
                    <v-container fluid grid-list-lg>
                      <v-layout row wrap>
                        <v-flex md4>
                          <v-card class="elevation-5 card-height">
                            <v-toolbar dense>
                              <v-spacer></v-spacer>
                              <v-toolbar-title>Overview</v-toolbar-title>
                              <v-spacer></v-spacer>
                            </v-toolbar>
                            <v-card-text>
                              <v-layout row wrap>
                                <v-flex md12>
                                  <v-card class="elevation-5">
                                    <v-card-text>Capacity: {{ calculationData.Capacity }}</v-card-text>
                                  </v-card>
                                </v-flex>
                                <v-flex md12>
                                  <v-card class="elevation-5">
                                    <v-card-text>Days Of Supply: {{ calculationData.DaysOfSupply }}</v-card-text>
                                  </v-card>
                                </v-flex>
                                <v-flex md12>
                                  <v-card class="elevation-5">
                                    <v-card-text>Weekly Sales: {{ calculationData.Weekly_Sales_Retail }}</v-card-text>
                                  </v-card>
                                </v-flex>
                                <v-flex md12>
                                  <v-card class="elevation-5">
                                    <v-card-text>Weekly Cost: {{ calculationData.Weekly_Sales_Cost }}</v-card-text>
                                  </v-card>
                                </v-flex>
                                <v-flex md12>
                                  <v-card class="elevation-5">
                                    <v-card-text>Weekly Units: {{ calculationData.Weekly_Sales_Units }}</v-card-text>
                                  </v-card>
                                </v-flex>
                                <v-flex md12>
                                  <v-card class="elevation-5">
                                    <v-card-text>Weekly Profit: {{ calculationData.Weekly_Sales_Profit }}</v-card-text>
                                  </v-card>
                                </v-flex>
                              </v-layout>
                            </v-card-text>
                          </v-card>
                        </v-flex>
                        <v-flex md4>
                          <v-card class="elevation-5 card-height">
                            <v-toolbar dense>
                              <v-spacer></v-spacer>
                              <v-toolbar-title>Facings</v-toolbar-title>
                              <v-spacer></v-spacer>
                            </v-toolbar>
                            <v-card-text>
                              <v-layout row wrap>
                                <v-flex md12>
                                  <v-text-field v-model="facings.Facings_X" type="number" dense hide-details label="Facings X"></v-text-field>
                                </v-flex>
                                <v-flex md12>
                                  <v-text-field v-model="facings.Facings_Y" type="number" dense hide-details label="Facings Y"></v-text-field>
                                </v-flex>
                                <v-flex md12>
                                  <v-text-field v-model="facings.Facings_Z" type="number" dense hide-details label="Facings Z"></v-text-field>
                                </v-flex>
                              </v-layout>
                            </v-card-text>
                          </v-card>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-card>
                </v-tab-item>
              </v-tabs-items>
            </v-flex>
            <input type="file" ref="fileInput" style="display: none;">
          </v-layout>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="dialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="returnData">Save</v-btn>
        </v-card-actions>

      </v-card>

    </v-dialog>
    <Prompt ref="prompt"></Prompt>
    <YesNoModal ref="yesNo"></YesNoModal>
    <input @change="setImage" style="display: none;" type="file" ref="fileInput">
    <a type="download" ref="downloadLink" style="display: hidden;"></a>
    <Dialog ref="Dialog"></Dialog>
  </div>
</template>

<script>
  import Axios from 'axios';
  import VueCropper from 'vue-cropperjs';
  import BarcodeHandler from '@/libs/barcodeHandler.js'
  import EventBus from "@/components/Main/Planogram/spaceplanning/src/libs/EventBus/EventBus.js";
  import CustomEmitter from "@/components/Main/Planogram/spaceplanning/src/libs/EventBus/CustomEmitter.js";
  import CalculationHandler from "@/components/Main/Planogram/spaceplanning/src/libs/CalculationLib/calculationHandler.js";
  import StoreHelper from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/StoreHelper/StoreHelper.js";
  import Prompt from '@/components/Common/Prompt'
  import Dialog from '@/components/Common/Dialog'
  import YesNoModal from '@/components/Common/YesNoModal'

  import cloudinary from 'cloudinary-core';

  function KeyValueArray(array) {
    let retval = [];

    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      retval.push({
        text: element.displayname,
        value: element.id
      })
    }

    return retval;
  }

  export default {
    name: 'ProductMaintModal',
    created() {
      let self = this;

      EventBus.$on("MODAL_LOAD", function (data) {

        if (data.type.toUpperCase() === "PRODUCT") {
          self.show({
            isAdd: false,
            formData: data.object.Data,
            planoData: data,
            onDelete: function () {
              let event = new CustomEmitter();
              event.delete_product(EventBus, self.planoData.object.Data, self.planoData.object);
              self.hide();
            },
            afterClose: function (newData) {

              let newObj = self.planoData;

              newObj.object.Facings_X = self.facings.Facings_X;
              newObj.object.Facings_Y = self.facings.Facings_Y;
              newObj.object.Facings_Z = self.facings.Facings_Z;

              for (var prop in self.form) {
                newObj.object.Data[prop] = self.form[prop];
              }

              newObj.object.Data.useAlternateBarcode = self.bcDropdown != -1;

              let bc = "";

              if (self.bcDropdown == -1)
                bc = self.form.barcode;
              else {
                self.form.aleternateBarcode.forEach(el => {
                  if (el.value == self.bcDropdown) {
                    bc = el.text;
                  }
                })
              }

              newObj.object.Data.alternateBarcode = bc;
              newObj.object.Data.alternatePackingType = self.product_type;

              let event = new CustomEmitter();
              event.modal_saved(EventBus, self.planoData.type, self.planoData.subType, newObj, self.planoData
                .id,
                self.planoData.object);
              self.hide();
            }
          })
        }
      });
    },
    data() {
      return {
        eventID: null,
        eventType: null,
        image1: 'static\\img\\no-image.png',
        image2: 'static\\img\\no-image.png',
        image3: 'static\\img\\no-image.png',
        rotation: 0,
        product_type: 0,
        showLoader: false,
        showCropper: false,
        showCropperLoader: false,
        inditerminate: true,
        uploadValue: 0,
        isAdd: true,
        toggle: '#',
        cropImage: null,
        croppaHeight: 'calc(100vh - 320px)',
        imgSrc: '',
        dialog: false,
        tab: 'details',
        currentFacing: 0,
        direction: 'right',
        fab: false,
        fling: false,
        hover: false,
        tabs: null,
        top: false,
        right: false,
        bottom: false,
        left: false,
        transition: 'Scale',
        bcDropdown: -1,
        showMenu: false,
        x: 0,
        y: 0,
        items: [{
          title: 'Save'
        }],
        form: {
          id: null,
          active_Shop_Code_ID: 3,
          product_System_ID: 'Generate_SYS_Product_ID',
          barcode: null,
          product_Code: null,
          description: null,
          brand_ID: null,
          manufacturer_ID: null,
          supplier_ID: null,
          categoryLink_ID: null,
          subcategory_ID: null,
          segment_ID: null,
          subsegment_ID: null,
          planogram_ID: null,
          size: null,
          uom: null,
          aleternateBarcode: [],
          size_Description: null,
          case_Pack_QTY: null,
          imageAudit: true,
          height: null,
          width: null,
          depth: null,
          tray_Barcode: null,
          tray_Qty: null,
          tray_Height: null,
          tray_Width: null,
          tray_Depth: null,
          case_Barcode: null,
          case_Qty: null,
          case_Height: null,
          case_Width: null,
          case_Depth: null,
          shrink_Barcode: null,
          shrink_Qty: null,
          shrink_Height: null,
          shrink_Width: null,
          shrink_Depth: null,
          pallet_Barcode: null,
          pallet_Qty: null,
          pallet_Height: null,
          pallet_Width: null,
          pallet_Depth: null,
        },
        facings: {
          Facings_X: 0,
          Facings_Y: 0,
          Facings_Z: 0,
        },
        planoData: null,
        dropdownFilters: {
          active_Shop_Codes: [],
          brands: [],
          manufacturers: [],
          suppliers: [],
          categoryLinks: [],
          subcategories: [],
          segments: [],
          subsegments: [],
          planograms: []
        },
        calculationData: {
          XFacings: null,
          Capacity: null,
          DaysOfSupply: null,
          Weekly_Sales_Retail: null,
          Weekly_Sales_Cost: null,
          Weekly_Sales_Units: null,
          Weekly_Profit: null
        },
        generateProductSysCode: true,
        afterClose: null,
        onDelete: null,
        CalculationHandler: null,
        currentImageMenu: 0,
        selectedAltCode: -1
      }
    },
    computed: {
      iRotation() {
        if (this.$refs.cropper != undefined) {

          this.$refs.cropper.rotateTo(parseInt(this.rotation))
        }
        return parseInt(this.rotation);
      }
    },
    methods: {
      show(args) {

        let self = this;

        self.clearForm();
        self.afterClose = args.afterClose;
        self.onDelete = args.onDelete;
        self.isAdd = args.isAdd == null ? true : args.isAdd;
        self.toggle = 1;
        self.setMode();
        self.imageType = 0;
        self.$refs.cropper.replace("");
        self.product_type = 0;

        console.log("[currentStoreCount]", self.$store.state.currentStoreCount);

        if (args.planoData != undefined && args.planoData != null) {
          self.planoData = args.planoData;
          self.facings.Facings_X = self.planoData.object.Facings_X;
          self.facings.Facings_Y = self.planoData.object.Facings_Y;
          self.facings.Facings_Z = self.planoData.object.Facings_Z;

          self.CalculationHandler = new CalculationHandler(self.$store.state.daysBetween, self.$store.state.currentStoreCount)
        } else {
          self.facings.Facings_X = null;
          self.facings.Facings_Y = null;
          self.facings.Facings_Z = null;
        }

        self.getProductDropdownData(() => {

          if (!self.isAdd) {

            for (var prop in self.form) {
              if (prop.includes('ID') && prop != 'product_System_ID') {
                self.form[prop] = parseInt(args.formData[prop]);
              } else {
                self.form[prop] = args.formData[prop];
              }
            }

            if (self.planoData != undefined && self.planoData != null) {
              self.calculate();
              self.form.id = args.formData.productID;
            }

            self.image1 = process.env.VUE_APP_API + BarcodeHandler.imageFromBarcode(self.form.barcode, 1, "");
            self.image2 = process.env.VUE_APP_API + BarcodeHandler.imageFromBarcode(self.form.barcode, 2, "");
            self.image3 = process.env.VUE_APP_API + BarcodeHandler.imageFromBarcode(self.form.barcode, 3, "");

            self.form.aleternateBarcode = [{
              text: 'Default',
              value: -1
            }];

            self.bcDropdown = -1;

            self.getProductAlternateBarcodes();
          } else {
            self.form.active_Shop_Code_ID = 1;
          }

          self.dialog = true;

          setTimeout(() => {
            self.tab = 'product'
            setTimeout(() => {
              self.tab = 'details'
            }, 60);
          }, 60);
        })
      },
      hide() {
        let self = this;
        self.dialog = false;
      },
      validateData() {
        var self = this
        let valid = true
        let data = {
          text: "Required Fields Not filled in",
          headline: ""
        }

        if (self.form.barcode == null || self.form.barcode == undefined || self.form.barcode == '') {
          data.headline = "Barcode is required"
          self.$refs.Dialog.openDialog(data)
          return false
        }
        // if (self.form.product_Code == null || self.form.product_Code == undefined || self.form.product_Code == '') {
        //   data.headline = "Product Code is required"
        //   self.$refs.Dialog.openDialog(data)
        //   return false
        // }
        if (self.form.description == null || self.form.description == undefined || self.form.description == '') {
          data.headline = "Description is required"
          self.$refs.Dialog.openDialog(data)
          return false
        }
        if (self.form.categoryLink_ID == null || self.form.categoryLink_ID == undefined || self.form.categoryLink_ID ==
          '') {
          data.headline = "Category is required"
          self.$refs.Dialog.openDialog(data)
          return false
        }
        if (self.form.planogram_ID == null || self.form.planogram_ID == undefined || self.form.planogram_ID == '') {
          data.headline = "Planogram is required"
          self.$refs.Dialog.openDialog(data)
          return false
        }
        if (self.form.brand_ID == null || self.form.brand_ID == undefined || self.form.brand_ID == '') {
          data.headline = "Brand is required"
          self.$refs.Dialog.openDialog(data)
          return false
        }
        if (self.form.manufacturer_ID == null || self.form.manufacturer_ID == undefined || self.form.manufacturer_ID ==
          '') {
          data.headline = "Manufacturer is required"
          self.$refs.Dialog.openDialog(data)
          return false
        }

        valid = true
      },
      returnData() {
        let self = this;
        let valid = self.validateData()
        if (valid == false) {
          return
        }

        if (self.planoData == undefined || self.planoData == null) {
          let request = {
            id: self.form.id,
            active_Shop_Code_ID: self.form.active_Shop_Code_ID,
            active_Shop_Code: self.dropdownFilters.active_Shop_Codes.filter(el => {
              return el.value == self.form.active_Shop_Code_ID
            })[0].text,
            product_System_ID: self.form.product_System_ID,
            barcode: self.form.barcode,
            product_Code: self.form.product_Code,
            description: self.form.description,
            brand_ID: self.form.brand_ID,
            brand: self.dropdownFilters.brands.filter(el => {
              return el.value == self.form.brand_ID
            })[0].text,
            manufacturer_ID: self.form.manufacturer_ID,
            manufacturer: self.dropdownFilters.manufacturers.filter(el => {
              return el.value == self.form.manufacturer_ID
            })[0].text,
            supplier_ID: self.form.supplier_ID,
            category: self.dropdownFilters.categoryLinks.filter(el => {
              return el.value == self.form.categoryLink_ID
            })[0].text,
            categoryLink_ID: self.form.categoryLink_ID,
            subcategory_ID: self.form.subcategory_ID,
            segment_ID: self.form.segment_ID,
            subsegment_ID: self.form.subsegment_ID,
            planogram_ID: self.form.planogram_ID,
            size: self.form.size,
            uom: self.form.uom,
            size_Description: self.form.size_Description,
            case_Pack_QTY: self.form.case_Pack_QTY,
            imageAudit: self.form.imageAudit,
            height: self.form.height,
            width: self.form.width,
            depth: self.form.depth,
            tray_Barcode: self.form.tray_Barcode,
            tray_Height: self.form.tray_Height,
            tray_Width: self.form.tray_Width,
            tray_Depth: self.form.tray_Depth,
            case_Barcode: self.form.case_Barcode,
            case_Height: self.form.case_Height,
            case_Width: self.form.case_Width,
            case_Depth: self.form.case_Depth,
            shrink_Barcode: self.form.shrink_Barcode,
            shrink_Height: self.form.shrink_Height,
            shrink_Width: self.form.shrink_Width,
            shrink_Depth: self.form.shrink_Depth,
            pallet_Barcode: self.form.pallet_Barcode,
            pallet_Height: self.form.pallet_Height,
            pallet_Width: self.form.pallet_Width,
            pallet_Depth: self.form.pallet_Depth,
          }

          self.afterClose(request);
        } else {
          self.afterClose(null);
        }
      },
      getProductDropdownData(callback) {
        let self = this;

        Axios.get(process.env.VUE_APP_API + "Product/DropdownData?db=CR-Devinspire")
          .then(response => {
            self.dropdownFilters.active_Shop_Codes = new KeyValueArray(response.data.active_Shop_Codes);
            self.dropdownFilters.brands = new KeyValueArray(response.data.brands);
            self.dropdownFilters.manufacturers = new KeyValueArray(response.data.manufacturers);
            self.dropdownFilters.suppliers = new KeyValueArray(response.data.suppliers);
            self.dropdownFilters.categoryLinks = new KeyValueArray(response.data.categoryLinks);
            self.dropdownFilters.subcategories = new KeyValueArray(response.data.subcategories);
            self.dropdownFilters.segments = new KeyValueArray(response.data.segments);
            self.dropdownFilters.subsegments = new KeyValueArray(response.data.subsegments);
            self.dropdownFilters.planograms = new KeyValueArray(response.data.planograms);
            callback();
          })
      },
      checkIfGenerate() {
        let self = this;

        if (self.generateProductSysCode) {
          self.form.product_System_ID = "Generate_SYS_Product_ID"
          self.form.active_Shop_Code_ID = 1;
        } else {
          self.form.product_System_ID = "Enter Product System ID"
        }
      },
      clearForm() {
        let self = this;
        self.form.product_System_ID = 'Generate_SYS_Product_ID';
        self.form.active_Shop_Code_ID = null;
        self.form.barcode = null;
        self.form.product_Code = null;
        self.form.description = null;
        self.form.brand_ID = null;
        self.form.manufacturer_ID = null;
        self.form.supplier_ID = null;
        self.form.categoryLink_ID = null;
        self.form.subcategory_ID = null;
        self.form.segment_ID = null;
        self.form.subsegment_ID = null;
        self.form.planogram_ID = null;
        self.form.size = null;
        self.form.uom = null;
        self.form.size_Description = null;
        self.form.case_Pack_Qty = null;
        self.form.height = null;
        self.form.width = null;
        self.form.depth = null;
        self.form.tray_Barcode = null;
        self.form.tray_Height = null;
        self.form.tray_Width = null;
        self.form.tray_Depth = null;
        self.form.case_Barcode = null;
        self.form.case_Height = null;
        self.form.case_Width = null;
        self.form.case_Depth = null;
        self.form.shrink_Barcode = null;
        self.form.shrink_Height = null;
        self.form.shrink_Width = null;
        self.form.shrink_Depth = null;
        self.form.pallet_Barcode = null;
        self.form.pallet_Height = null;
        self.form.pallet_Width = null;
        self.form.pallet_Depth = null;
      },
      openFile(facing) {
        let self = this;
        self.showCropper = false;
        self.showCropperLoader = true;

        self.facing = facing;
        self.rotation = 0;

        this.$refs.cropper.replace(self["image" + self.facing]);
        self.showCropperLoader = false;
        self.showCropper = true;
      },
      selectImage() {
        let self = this;
        self.$refs.fileInput.click();
      },
      setImage(e) {
        let self = this;

        const file = e.target.files[0];

        self.imageName = file.name;
        self.imageType = file.type;

        if (!file.type.includes('image/')) {
          alert('Please select an image file');
          return;
        }

        if (typeof FileReader === 'function') {
          const reader = new FileReader();
          reader.onload = (event) => {
            this.imgSrc = event.target.result;
            this.$refs.cropper.replace(event.target.result);
            self.croppaHeight = 'calc(100vh - 500px)'
          };
          reader.readAsDataURL(file);
        } else {
          alert('Sorry, FileReader API not supported');
        }
      },
      setMode() {
        let self = this;

        switch (self.toggle) {
          case 0:
            {
              self.$refs.cropper.setDragMode("move");
            }
            break;
          case 1:
            {
              self.$refs.cropper.setDragMode("crop");
            }
            break;
        }
      },
      flipHorizontal() {
        let self = this;
        self.$refs.cropper.scale(-1, 1);
      },
      flipVertical() {
        let self = this;
        self.$refs.cropper.scale(1, -1);
      },
      zoomIn() {
        let self = this;
        self.$refs.cropper.zoom(0.1);
      },
      zoomOut() {
        let self = this;
        self.$refs.cropper.zoom(-0.1);
      },
      updateImage() {
        let self = this;

        let caseType = "";
        let bc = "";

        switch (self.product_type) {
          case 0:
            {
              if (self.bcDropdown == -1)
                bc = self.form.barcode;
              else {
                self.form.aleternateBarcode.forEach(el => {
                  if (el.value == self.bcDropdown) {
                    bc = el.text;
                  }
                })
              }
            }
            break;
          case 1:
            {
              caseType = "T";
              bc = self.form.barcode;
            }
            break;
          case 2:
            {
              caseType = "C";
              bc = self.form.barcode;
            }
            break;
          case 3:
            {
              caseType = "S";
              bc = self.form.barcode;
            }
            break;
          case 4:
            {
              caseType = "P";
              bc = self.form.barcode;
            }
            break;
        }

        let folderFile = BarcodeHandler.getFolderFile(bc);

        this.$refs.cropper.getCroppedCanvas().toBlob((blob) => {

          self.saveImageProgress(folderFile, caseType, blob, function () {
            self.showLoader = false;
            self["image" + self.facing] = self.$refs.cropper.getCroppedCanvas().toDataURL();
          })
        });
      },
      saveImageProgress(folderFile, caseType, blob, callback) {
        let self = this;

        let hasError = false;

        var item = self.file;

        self.showLoader = true;
        self.inditerminate = true;

        let xhrObj = new XMLHttpRequest();
        let url = process.env.VUE_APP_API +
          `ProductImage/Upload?folder=${folderFile.folder}&file=${folderFile.file}&caseType=${caseType}&type=${self.facing}`;

        xhrObj.open("Post", url);

        xhrObj.upload.onprogress = function (pe) {
          if (pe.lengthComputable) {
            self.inditerminate = false;
            self.uploadValue = (pe.loaded / pe.total) * 100;
          }
        }

        xhrObj.upload.onreadystatechange = function (oEvent) {

          if (xhrObj.upload.readyState === 4) {
            if (xhrObj.upload.status !== 200) {
              alert("ERROR")
            }
          }
        };

        xhrObj.upload.onerror = function (e) {
          alert("ERROR")
          hasError = true;
        }

        xhrObj.upload.onloadend = function (e) {
          setTimeout(() => {
            callback(hasError);
          }, 500);
        }

        xhrObj.setRequestHeader("X-File-Name", self.imageName);
        xhrObj.setRequestHeader("Content-type", self.imageType);

        xhrObj.send(blob);

      },
      changePackingType() {
        let self = this;

        let productType = "";
        let bc = "";

        switch (self.product_type) {
          case 0:
            {
              if (self.bcDropdown == -1)
                bc = self.form.barcode;
              else {
                self.form.aleternateBarcode.forEach(el => {
                  if (el.value == self.bcDropdown) {
                    bc = el.text;
                  }
                })
              }
            }
            break;
          case 1:
            {
              productType = "T";
              bc = self.form.barcode;
            }
            break;
          case 2:
            {
              productType = "C";
              bc = self.form.barcode;
            }
            break;
          case 3:
            {
              productType = "S";
              bc = self.form.barcode;
            }
            break;
          case 4:
            {
              productType = "P";
              bc = self.form.barcode;
            }
            break;
        }

        self.image1 = process.env.VUE_APP_API + BarcodeHandler.imageFromBarcode(bc, 1, productType);
        self.image2 = process.env.VUE_APP_API + BarcodeHandler.imageFromBarcode(bc, 2, productType);
        self.image3 = process.env.VUE_APP_API + BarcodeHandler.imageFromBarcode(bc, 3, productType);
      },
      calculate() {
        let self = this;
        var calcData = self.calculationData;

        let productEventData = self.planoData.data;

        let planogramID = productEventData.ID;
        let productID = productEventData.Data.productID;

        let productData;

        let ctrl_store = new StoreHelper();
        let productStoreCopy = ctrl_store.getAllPlanogramItemsByType(
          self.$store,
          "PRODUCT"
        );

        productStoreCopy = productStoreCopy.slice(0, productStoreCopy.length);

        productData = {
          ProductData: productEventData.Data, //newArr[0].Data,
          Facings_X: 0, //newArr[0].Facings_X,
          Facings_Y: 0, //newArr[0].Facings_Y,
          Facings_Z: 0, //newArr[0].Facings_Z,
          TotalFacings: 0 //newArr[0].TotalFacings
        };

        productStoreCopy.forEach((element, index) => {
          if (element.Data.productID == productID) {
            productData.Facings_X += element.Facings_X;
            productData.Facings_Y += element.Facings_Y;
            productData.Facings_Z += element.Facings_Z;
            productData.TotalFacings += element.TotalFacings;
          }
        });

        calcData.DaysOfSupply = self.CalculationHandler.Calculate_Days_Of_Supply_Potential(
          productData.TotalFacings,
          productData.ProductData.sales_Units
        );

        calcData.Weekly_Sales_Retail = self.CalculationHandler.Calculate_Weekly_Sales_Retail(productData.ProductData.sales_Retail);
        calcData.Weekly_Sales_Cost = self.CalculationHandler.Calculate_Weekly_Sales_Cost(productData.ProductData.sales_Cost);
        calcData.Weekly_Sales_Units = self.CalculationHandler.Calculate_Weekly_Sales_Units(productData.ProductData.sales_Units);
        calcData.Weekly_Profit = self.CalculationHandler.Calculate_Weekly_Profit(productData.ProductData.sales_Profit);
        calcData.XFacings = productData.Facings_X;
        calcData.Capacity = productData.TotalFacings;
      },
      removeProduct() {
        this.onDelete();
      },
      showImageMenu(e, imageMenu) {
        e.preventDefault()
        this.currentImageMenu = imageMenu;
        this.showMenu = false
        this.x = e.clientX
        this.y = e.clientY
        this.$nextTick(() => {
          this.showMenu = true
        })
      },
      ImageSave() {
        let self = this;

        let productType = "";

        switch (self.product_type) {
          case 1:
            {
              productType = "T";
            }
            break;
          case 2:
            {
              productType = "C";
            }
            break;
          case 3:
            {
              productType = "S";
            }
            break;
          case 4:
            {
              productType = "P";
            }
            break;
        }

        let bc = "";

        if (self.bcDropdown == -1)
          bc = self.form.barcode;
        else {
          self.form.aleternateBarcode.forEach(el => {
            if (el.value == self.bcDropdown) {
              bc = el.text;
            }
          })
        }

        var a = document.createElement('a');
        a.href = process.env.VUE_APP_API + BarcodeHandler.imageFromBarcode(bc, self.currentImageMenu,
          productType);
        a.click();
        a.remove();
      },
      openAltBarcodeDialog(type) {
        let self = this;
        let text = "";

        let newBarcode = "";

        self.form.aleternateBarcode.forEach(el => {
          if (el.value == self.bcDropdown) {
            newBarcode = el.text;
          }
        })

        if (type == "EDIT")
          text = newBarcode;

        self.$refs.prompt.show(text, "Alternate Barcode", "Alternate Barcode", bc => {
          if (bc == '') {
            alert("Please enter a value");
            self.openAltBarcodeDialog();
          } else {
            if (type == "ADD") {
              self.createAlternateBarcode(bc);
            } else {
              self.modifyAlternateBarcode(bc);
            }
          }
        })
      },
      getProductAlternateBarcodes() {
        let self = this;

        Axios.get(process.env.VUE_APP_API + "ProductAltCode?db=CR-Hinterland-Live&productID=" + self.form.id)
          .then(r => {
            r.data.forEach(el => {
              self.form.aleternateBarcode.push({
                text: el.barcode,
                value: el.id
              });
            })
          })
          .catch(e => {
            console.log(e);
          })
      },
      getAlternateImages() {
        let self = this;

        let altCode = "";

        self.$nextTick(() => {
          if (self.bcDropdown == -1) {
            altCode = self.form.barcode;
          } else {
            self.form.aleternateBarcode.forEach(el => {
              if (el.value == self.bcDropdown) {
                altCode = el.text;
              }
            })
          }

          let productType = "";

          self.image1 = process.env.VUE_APP_API + BarcodeHandler.imageFromBarcode(altCode, 1, productType);
          self.image2 = process.env.VUE_APP_API + BarcodeHandler.imageFromBarcode(altCode, 2, productType);
          self.image3 = process.env.VUE_APP_API + BarcodeHandler.imageFromBarcode(altCode, 3, productType);
        })
      },
      createAlternateBarcode(bc) {
        let self = this;

        Axios.post(process.env.VUE_APP_API + 'ProductAltCode?db=CR-Hinterland-Live', {
            "product_ID": self.form.id,
            "product_System_ID": self.form.product_System_ID,
            "barcode": bc
          })
          .then(r => {
            self.form.aleternateBarcode.push({
              text: r.data.barcode,
              value: r.data.id
            })
          })
          .catch(e => {
            alert("Failed to create alternate barcode. Please try again");
            console.log(e);
          })
      },
      modifyAlternateBarcode(bc) {
        let self = this;

        Axios.put(process.env.VUE_APP_API + 'ProductAltCode?db=CR-Hinterland-Live', {
            "id": self.bcDropdown,
            "product_ID": self.form.id,
            "product_System_ID": self.form.product_System_ID,
            "barcode": bc
          })
          .then(r => {
            if (r.data) {
              self.form.aleternateBarcode.forEach(el => {
                if (el.value == self.bcDropdown) {
                  el.text = bc;
                }
              })
            } else {
              alert("Failed to modify alternate barcode. Please try again");
            }
          })
          .catch(e => {
            alert("Failed to modify alternate barcode. Please try again");
            console.log(e);
          })
      },
      deleteAlternateBarcode() {
        let self = this;

        self.$refs.yesNo.show('Delete alternate barcode?', goThrough => {
          if (goThrough) {
            Axios.delete(process.env.VUE_APP_API + 'ProductAltCode?db=CR-Hinterland-Live&altCodeID=' + self.bcDropdown)
              .then(r => {
                if (r.data) {
                  self.form.aleternateBarcode.forEach((el, idx) => {
                    if (el.value == self.bcDropdown) {
                      self.form.aleternateBarcode.splice(idx, 1);
                      self.bcDropdown = -1;
                    }
                  })
                } else {
                  alert("Failed to delete alternate barcode. Please try again");
                }
              })
              .catch(e => {
                alert("Failed to delete alternate barcode. Please try again");
                console.log(e);
              })
          }
        })
      },
    },
    components: {
      Prompt,
      YesNoModal,
      Dialog
    }
  }

</script>

<style scoped>
  .hover {
    cursor: pointer;
  }

  /* .card-height {
    height: calc(110vh - 500px);
    overflow: auto;
  } */

  .tab-height {
    overflow-x: auto;
  }

  img {
    max-width: 100%;
    /* This rule is very important, please do not ignore this! */
  }

  .main-container {
    height: calc(100vh - 200px);
    overflow-x: auto;
  }

</style>
