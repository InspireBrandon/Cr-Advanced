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

    console.log("Planogram Data", planogramData, warehouseProducts);

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

              for(var prop in productData) {
                if(warehouseProduct[prop] != undefined && warehouseProduct[prop] != null) {
                  productData[prop] = warehouseProduct[prop];
                }
              }

              // currentPlanogramItem.Data.Data = warehouseProduct;
              // verify that product exists
              itemExists = true;
              productData.store_Range_Indicator = warehouseProduct.store_Range_Indicator;
              // TODO: Set any other details that may need to be set ** DO NOT INCLUDE DIMENSIONS HERE
            }
          })

          if (!itemExists) {
            productData.store_Range_Indicator = 'NO';
          }
        }
      }
    })

    return planogramData;
  }
}

export default StageWarehouseMiddleware;
