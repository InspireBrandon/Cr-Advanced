// ////////////////////////////////////////////////////////////////////////////////////////////////////
// Purpose: To be able to control data between warehouse and stage 
// Author: Brandon Lange
// Date: 2019-02-15
// ////////////////////////////////////////////////////////////////////////////////////////////////////
class StageWarehouseMiddleware {
  constructor() {

  }

  // Uses the product data the planogram file and verifies against the new file if any changes have occured - Main reason is for loading of a planogram
  static verifyIntegrityOfWarehouseData(planogramData, warehouseProducts) {
    planogramData = planogramData.slice(0, planogramData.length);
    warehouseProducts = warehouseProducts.slice(0, warehouseProducts.length);

    // loop through planogramData and check to see if item is product
    planogramData.forEach((currentPlanogramItem, idx) => {
      if (currentPlanogramItem == undefined && currentPlanogramItem == null) {
        planogramData.splice(idx, 1);
      } else {
        if (currentPlanogramItem.Type.toUpperCase() == "PRODUCT") {

          let productData = currentPlanogramItem.Data.Data; // actual product data
          let itemExists = false;
          // Check through warehouse to see if find the correct product
          warehouseProducts.forEach(warehouseProduct => {

            if (warehouseProduct.barcode == productData.barcode) {

              for (var prop in productData) {
                if (prop != "useAlternateBarcode" && prop != "alternateBarcode" && prop != "alternatePackingType" && prop != "cost_potential") {
                  if (warehouseProduct[prop] != undefined && warehouseProduct[prop] != null) {
                    productData[prop] = warehouseProduct[prop];
                  }
                }
              }

              console.log(productData);

              productData["sales_Retail"] = warehouseProduct["sales_Retail"];
              productData["sales_Cost"] = warehouseProduct["sales_Cost"];
              productData["sales_Units"] = warehouseProduct["sales_Units"];
              productData["sales_Profit"] = warehouseProduct["sales_Profit"];
              productData["stock_Cost"] = warehouseProduct["stock_Cost"];
              productData["stock_Units"] = warehouseProduct["stock_Units"];
              productData["number_Distribution"] = warehouseProduct["number_Distribution"];
              productData["weighted_Distribution"] = warehouseProduct["weighted_Distribution"];
              productData["sales_potential"] = warehouseProduct["sales_potential"];
              productData["volume_potential"] = warehouseProduct["volume_potential"];
              productData["profit_potential"] = warehouseProduct["profit_potential"];
              productData["cost_potential"] = warehouseProduct["cost_potential"];
              productData["profit_potential_rank"] = warehouseProduct["profit_potential_rank"];
              productData["item_volume_rank"] = warehouseProduct["item_volume_rank"];
              productData["item_sales_rank"] = warehouseProduct["item_sales_rank"];
              productData["item_profit_rank"] = warehouseProduct["item_profit_rank"];
              productData["dos_fac"] = warehouseProduct["dos_fac"];
              productData["gross_profit"] = warehouseProduct["gross_profit"];
              productData["markup"] = warehouseProduct["markup"];
              productData["store_Range_Indicator"] = warehouseProduct["store_Range_Indicator"];
              productData["sales_contribution"] = warehouseProduct["sales_contribution"];
              productData["units_contribution"] = warehouseProduct["units_contribution"];
              productData["profit_contribution"] = warehouseProduct["profit_contribution"];
              productData["autoRangeItem"] = warehouseProduct["autoRangeItem"];
              productData["autoRangeOneItem"] = warehouseProduct["autoRangeOneItem"];
              productData["alt_Store_Range_Indicator"] = warehouseProduct["alt_Store_Range_Indicator"];
              productData["alt_Store_Range_Indicator_ID"] = warehouseProduct["alt_Store_Range_Indicator_ID"];

              // currentPlanogramItem.Data.Data = warehouseProduct;
              // verify that product exists
              itemExists = true;
              productData.store_Range_Indicator = warehouseProduct.store_Range_Indicator;
              // TODO: Set any other details that may need to be set ** DO NOT INCLUDE DIMENSIONS HERE
            }
          })

          if (!itemExists) {

            if (productData.isHybridProduct) {
              productData.store_Range_Indicator = 'YES';
            } else {
              productData.store_Range_Indicator = 'NO';
            }
          }
        }
      }
    })

    return planogramData;
  }
}

export default StageWarehouseMiddleware;