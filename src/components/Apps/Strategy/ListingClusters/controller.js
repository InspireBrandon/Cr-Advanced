// ////////////////////////////////////////////////////////////////////////////////////////////////////
// Purpose: To get an output for the listing cluster
// Author: Brandon Lange
// Date 2019-08-19
// ////////////////////////////////////////////////////////////////////////////////////////////////////
class ListingClusterController {
    constructor() {}

    static GenerateClusterOutput(params) {
        let self = this;

        // ////////////////////////////////////////////////////////////////////////////////////////////////////
        // PARAMS VARIABLES
        // ////////////////////////////////////////////////////////////////////////////////////////////////////
        let storeSalesData = params.storeSalesData; // all store sales data for category over 12 months
        let levels = params.levels; // value used to determine the x percentage of sales

        // ////////////////////////////////////////////////////////////////////////////////////////////////////
        // CALCULATED VARIABLES
        // ////////////////////////////////////////////////////////////////////////////////////////////////////
        const stores = removeDuplicates(storeSalesData.map(item => ({
            storeName: item.storeName,
            store_ID: item.store_ID
        })), "store_ID"); // get all unique stores

        const products = getProductsWeighted(storeSalesData); // get all unique products ordered by total weight in category

        const totalStoreProductSales = getTotalStoreProductSales(stores, products, storeSalesData);

        // return { totalStoreProductSales, storeSales };
    }
}
// ////////////////////////////////////////////////////////////////////////////////////////////////////
// METHODS
// ////////////////////////////////////////////////////////////////////////////////////////////////////
function getProductsWeighted(storeSalesData) {
    let uniqueProducts = removeDuplicates(storeSalesData.map(item => ({
        productName: item.productName,
        product_ID: item.product_ID
    })), "product_ID"); // get all unique products

    uniqueProducts.forEach(product => {
        let allProductSales = storeSalesData.filter(storeSale => {
            return storeSale.product_ID == product.product_ID;
        }); // get all product sales records

        let totalSalesValue = allProductSales.reduce((a, b) => {
            return {
                sales_Retail: a.sales_Retail + b.sales_Retail
            }
        }).sales_Retail // reduce array to return only total sales

        totalSalesValue = parseFloat(parseFloat(totalSalesValue.toFixed(2)));

        product["totalSales"] = totalSalesValue;
    });

    return uniqueProducts.sort((a, b) => {
        if (a.totalSales > b.totalSales) {
            return -1;
        }
        if (a.totalSales < b.totalSales) {
            return 1;
        }
        return 0;
    })
}

function getTotalStoreProductSales(stores, products, storeSalesData) {
    products.forEach(product => {
        stores.forEach(store => {
            
        })
    });
}

function removeDuplicates(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
}

export default ListingClusterController;