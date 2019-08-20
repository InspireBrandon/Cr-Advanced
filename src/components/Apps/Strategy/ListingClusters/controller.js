// ////////////////////////////////////////////////////////////////////////////////////////////////////
// Purpose: To get an output for the listing cluster
// Author: Brandon Lange
// Date 2019-08-19
// ////////////////////////////////////////////////////////////////////////////////////////////////////
class ListingClusterController {
    constructor() {
    }

    static GenerateClusterOutput(params) {
        let self = this;

        // params variables
        let storeSalesData = params.storeSalesData; // all store sales data for category over 12 months
        let topValue = params.topValue; // this is the value used to determine the x percentage of sales
        
        // calculated variables
        const stores = [...new Set(storeSalesData.map(item => item.store_ID))];
        const products = [...new Set(storeSalesData.map(item => item.product_ID))];
        const sumSales = accumulateStoreSales(storeSalesData);

        console.log("[LISTING CLUSTER] STORES", stores)
        console.log("[LISTING CLUSTER] PRODUCTS", products)
        console.log("[LISTING CLUSTER] SUMSALES", sumSales)
    }
}

// ////////////////////////////////////////////////////////////////////////////////////////////////////
// METHODS
// ////////////////////////////////////////////////////////////////////////////////////////////////////

function getSalesValues(storeSalesData, stores) {
    let retval = [];

    stores.forEach(store => {
        
    });

    // const stores = storeSalesData.find(x => {  }) 
}

function accumulateStoreSales(storeSalesData) {
    return storeSalesData.reduce(function(a, b) { 
        console.log(a);
        return a.sales_Retail + b.sales_Retail; 
    }, 0);
}

// ////////////////////////////////////////////////////////////////////////////////////////////////////
// HELPERS
// ////////////////////////////////////////////////////////////////////////////////////////////////////

class StoreSale {
    constructor(sales) {
        let self = this;
        self.storeID = sales[0].storeID;
        // self.totalSales = sales.
    }
} 

export default ListingClusterController;