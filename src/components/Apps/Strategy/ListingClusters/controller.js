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

        const response = getTotalStoreProductSales(stores, products, storeSalesData, levels);
        let totalStoreProductSales = response.response;
        let tmpStoreData = response.tmpStoreData;

        return { totalStoreProductSales: totalStoreProductSales, productData: tmpStoreData, stores: stores };
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
        if (a.totalSales < b.totalSales) {
            return -1;
        }
        if (a.totalSales > b.totalSales) {
            return 1;
        }
        return 0;
    })
}

function getTotalStoreProductSales(stores, products, storeSalesData, levels) {
    let tmpStoreData = [];

    products.forEach(product => {
        let tmpObj = {
            product_ID: product.product_ID,
            productName: product.productName
        }

        stores.forEach(store => {
            var storeProductSale = storeSalesData.filter(sd => {
                return sd.product_ID == product.product_ID && sd.store_ID == store.store_ID;
            });

            let tmpCode = "";

            if(storeProductSale.length > 0) {
                let storeProductSaleItem = storeProductSale[0];

                if(storeProductSaleItem.sales_Retail > 0) {
                    tmpCode = "1";
                } else {
                    tmpCode = "0";
                }
            } else {
                tmpCode = "0";
            }

            tmpObj[store.store_ID] = tmpCode;
        });

        tmpStoreData.push(tmpObj);
    });

    let response = accumulateCodes(tmpStoreData, stores);
    response = addRank(response);
    response = GenerateCluster(response, levels);

    return { response, tmpStoreData };
}

function accumulateCodes(tmpStoreData, stores) {
    let storeClusterCodes = []

    stores.forEach(store => {
        let storeCodeData = {
            storeCode: "",
            store_ID: store.store_ID,
            storeName: store.storeName,
            currentRank: -1,
            threeLevelCluster: ""
        }

        tmpStoreData.forEach(tmpStoreItem => {
            storeCodeData.storeCode += tmpStoreItem[store.store_ID];
        });

        storeClusterCodes.push(storeCodeData);
    })

    return storeClusterCodes.sort((a, b) => {
        if (a.storeCode > b.storeCode) {
            return -1;
        }
        if (a.storeCode < b.storeCode) {
            return 1;
        }
        return 0;
    })
}

function addRank(tmpStoreData) {
    tmpStoreData.forEach((el, idx) => {
        el.currentRank = idx + 1;
    })

    return tmpStoreData;
}

function GenerateCluster(tmpStoreData, levels) {
    const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    let letterIndex = 0;
    let lastCode = "";

    console.log(tmpStoreData)

    tmpStoreData.forEach(tmpStoreItem => {
        let percentageOfStoreCode = ((parseInt(levels) / 10) * tmpStoreItem.storeCode.length).toFixed(0);
        console.log(percentageOfStoreCode)
        // itemLevels = percentageOfStoreCode;

        let currentCode = tmpStoreItem.storeCode.substr(0, percentageOfStoreCode);

        if(lastCode == "" || currentCode == lastCode) {
            tmpStoreItem.threeLevelCluster = letters[letterIndex];
        }
        else 
        {
            letterIndex++;
            tmpStoreItem.threeLevelCluster = letters[letterIndex];
        }

        lastCode = currentCode;
    })

    return tmpStoreData;
}

function removeDuplicates(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
}

export default ListingClusterController;