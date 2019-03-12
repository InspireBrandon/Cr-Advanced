<template>
  <div>
    <!-- <LibraryToolbar></LibraryToolbar> -->
    <v-layout row wrap fill-height>
      <v-flex xs9 id="stageMain">
        <div>
          <StageMain></StageMain>
        </div>
      </v-flex>
      <v-flex xs3 id="warehouseMain">
        <WarehouseMain></WarehouseMain>
      </v-flex>
    </v-layout>
    <!-- <v-navigation-drawer width="500" dark v-model="warehouse" right permanent fixed hide-overlay>
      <v-layout row wrap fill-height>
        <v-flex xs12 id="warehouseMain" py-2 px-2>
          <div>
            <WarehouseMain></WarehouseMain>
          </div>
        </v-flex>
      </v-layout>
    </v-navigation-drawer> -->
    <v-footer :fixed="fixed" app dark>
      <!-- <span class="ml-5">{{ footerTooltip }}</span> -->
      <span class="ml-1">{{ selectedItem }}</span>
    </v-footer>
  </div>
</template>

<script>
  import EventBus from "@/components/Main/Planogram/spaceplanning/src/libs/EventBus/EventBus.js";

  // import LibraryToolbar from "@/components/Toolbars/LibraryToolbar.vue";
  import StageMain from "@/components/Main/Planogram/spaceplanning/src/components/Stage/Stage.vue";
  import WarehouseMain from "@/components/Main/Planogram/spaceplanning/src/components/Stage/Warehouse.vue";
  import CalculationHandler from "@/components/Main/Planogram/spaceplanning/src/libs/CalculationLib/calculationHandler.js";
  import StoreHelper from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/StoreHelper/StoreHelper.js";

  export default {
    components: {
      // LibraryToolbar,
      StageMain,
      WarehouseMain
    },
    data() {
      return {
        footerTooltip: "",
        selectedItem: "",
        clipped: false,
        drawer: true,
        fixed: false,
        CalculationHandler: null
      };
    },
    computed: {},
    beforeDestroy() {
      EventBus.$off("FOOTER_DETAIL_TOOLTIP", this.showTooltip);
      EventBus.$off("FOOTER_DETAIL_SELECTION", this.hideTooltip);
      EventBus.$off(
        "NOTIFY_PRODUCT_GROUP_STATISTICS",
        this.event_product_group_statistics
      );
    },
    created() {
      this.$store.commit("setFullScreen", true);
      EventBus.$on("FOOTER_DETAIL_TOOLTIP", this.showTooltip);
      EventBus.$on("FOOTER_DETAIL_SELECTION", this.showSelectionDetail);
      EventBus.$on(
        "NOTIFY_PRODUCT_GROUP_STATISTICS",
        this.event_product_group_statistics
      );
    },
    methods: {
      event_product_group_statistics(eventData) {
        let self = this;

        if (eventData.show == true) {

          let productEventData = eventData.data;

          let planogramID = productEventData.ID;
          let productID = productEventData.Data.productID;

          let productData;

          let ctrl_store = new StoreHelper();
          let productStoreCopy = ctrl_store.getAllPlanogramItemsByType(
            self.$store,
            "PRODUCT"
          );

          productStoreCopy = productStoreCopy.slice(0, productStoreCopy.length);

          // let productStoreCopy = self.$store.getters.getAllProductGroups.slice(
          //   0,
          //   self.$store.getters.getAllProductGroups.length
          // );

          // var newArr = productStoreCopy.filter(el => {
          //   return el.ID == planogramID;
          // });

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
          var sales_retail = productData.ProductData.sales_Retail,
            sales_cost = productData.ProductData.sales_Cost,
            sales_units = productData.ProductData.sales_Units,
            weighted_distribution = productData.ProductData.Weighted_Distribution,
            total_facings = productData.TotalFacings;

          self.CalculationHandler = new CalculationHandler(self.$store.state.daysBetween)

          var weekly_profit = this.CalculationHandler.Calculate_Weekly_Profit(
              sales_retail,
              sales_cost
            ),
            weekly_volume_potential = this.CalculationHandler.Calculate_Weekly_Volume_Potential(
              sales_units,
              weighted_distribution
            ),
            weekly_sales_potential = this.CalculationHandler.Calculate_Weekly_Sales_Potential(
              sales_retail,
              weighted_distribution
            ),
            days_of_supply = this.CalculationHandler.Calculate_Days_Of_Supply_Potential(
              total_facings,
              sales_units
            ),
            weekly_sales_units = this.CalculationHandler.Calculate_Weekly_Sales_Units(sales_units);

          // if (eventData.show == true) {
          //   // populate footer
          //   self.footerTooltip = "PRODUCT -- ";
          //   self.selectedItem = `DESCRIPTION : ${
          //     productData.ProductData.description
          //   },
          //       X-FACINGS : ${productData.Facings_X},
          //       CAPACITY : ${productData.TotalFacings},
          //       DAYS OF SUPPLY : ${days_of_supply},`;
          // } else {
          //   self.footerTooltip = "";
          //   self.selectedItem = "";
          // }

          let barcode = productData.ProductData.barcode;

          if (productData.ProductData.useAlternateBarcode != undefined) {
            switch (productData.ProductData.alternatePackingType) {
              case 0:
                {
                  if (productData.ProductData.useAlternateBarcode)
                    barcode = productData.ProductData.alternateBarcode;
                }
                break;
              case 1:
                {
                  if (productData.ProductData.tray_Barcode != undefined && productData.ProductData.tray_Barcode != null &&
                    productData.ProductData.tray_Barcode != "")
                    barcode = productData.ProductData.tray_Barcode;
                }
                break;
              case 2:
                {
                  if (productData.ProductData.case_Barcode != undefined && productData.ProductData.case_Barcode != null &&
                    productData.ProductData.case_Barcode != "")
                    barcode = productData.ProductData.case_Barcode;
                }
                break;
              case 3:
                {
                  if (productData.ProductData.shrink_Barcode != undefined && productData.ProductData.shrink_Barcode !=
                    null &&
                    productData.ProductData.shrink_Barcode != "")
                    barcode = productData.ProductData.shrink_Barcode;
                }
                break;
              case 4:
                {
                  if (productData.ProductData.pallet_Barcode != undefined && productData.ProductData.pallet_Barcode !=
                    null &&
                    productData.ProductData.pallet_Barcode != "")
                    barcode = productData.ProductData.pallet_Barcode;
                }
                break;
            }
          }

          // populate footer
          self.footerTooltip = "";
          self.selectedItem =
            `${barcode} ${productData.ProductData.brand} ${productData.ProductData.description} FAC: ${productData.Facings_X} CAP: ${productData.TotalFacings} UNITS: ${weekly_sales_units} CAT: ${productData.ProductData.category} SUB: ${productData.ProductData.subcategory} SEG: ${productData.ProductData.segment} DOS: ${days_of_supply}`
          // self.selectedItem = `DESCRIPTION : ${productData.ProductData.description},
          //     X-FACINGS : ${productData.Facings_X},
          //     CAPACITY : ${productData.TotalFacings},
          //     DAYS OF SUPPLY : ${days_of_supply},`;
        } else {
          self.footerTooltip = "";
          self.selectedItem = "";
        }
      }
    }
  };
</script>

<style scoped>
  .stretch {
    width: 100%;
    height: 100%;
    margin: 20px;
    margin: 15px;
    border: 1px solid green;
  }
</style>