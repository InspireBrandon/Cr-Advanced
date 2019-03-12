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
        // loop through planogramData and check to see if item is product
        planogramData.forEach(currentPlanogramItem => {
            if(currentPlanogramItem.Type.toUpperCase() == "PRODUCT") {
                let productData = currentPlanogramItem.Data.Data; // actual product data
                let itemExists = false;
                // Check through warehouse to see if find the correct product
                warehouseProducts.forEach(warehouseProduct => {
                    if(warehouseProduct.productID == productData.productID) {
                        // verify that product exists
                        itemExists = true;
                        productData.store_Range_Indicator = warehouseProduct.store_Range_Indicator;
                        // TODO: Set any other details that may need to be set ** DO NOT INCLUDE DIMENSIONS HERE
                    }
                })

                if(!itemExists) {
                    productData.store_Range_Indicator = 'NO';
                }
            }
        })

        return planogramData;
    }
}

export default StageWarehouseMiddleware;