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

        let storeSales = getStoreSales(stores, storeSalesData);

        const products = getProductsWeighted(storeSalesData); // get all unique products ordered by total weight in category

        const response = getTotalStoreProductSales(stores, products, storeSalesData, levels);
        let totalStoreProductSales = response.response;
        let tmpStoreData = response.tmpStoreData;

        return { totalStoreProductSales: totalStoreProductSales, productData: tmpStoreData, stores: storeSales };
    }
}
// ////////////////////////////////////////////////////////////////////////////////////////////////////
// METHODS
// ////////////////////////////////////////////////////////////////////////////////////////////////////
function getStoreSales(stores, storeSales) {
    let retval = [];

    stores.forEach(store => {
        let tmp = {
            store_ID: store.store_ID,
            storeName: store.storeName,
            sumSales: 0
        }

        var totalStoreSales = storeSales.filter(sales => {
            return sales.store_ID == store.store_ID;
        })

        let sumStoreSales = totalStoreSales.reduce((a, b) => {
            return {
                sales_Retail: a.sales_Retail + b.sales_Retail
            }
        }).sales_Retail

        tmp.sumSales = sumStoreSales;

        retval.push(tmp); 
    })

    return retval.sort((a, b) => {
        if (a.sumSales > b.sumSales) {
            return -1;
        }
        if (a.sumSales < b.sumSales) {
            return 1;
        }
        return 0;
    })
}

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

function getTotalStoreProductSales(stores, products, storeSalesData, levels) {
    let tmpStoreData = [];
    let currentCumulative = 0;

    var totalCategorySales = storeSalesData.reduce((a, b) => {
        return {
            sales_Retail: a.sales_Retail + b.sales_Retail
        }
    }).sales_Retail;

    products.forEach(product => {
        var productSales = storeSalesData.filter(sd => {
            return sd.product_ID == product.product_ID;
        });

        var totalProductSales = productSales.reduce((a, b) => {
            return {
                sales_Retail: a.sales_Retail + b.sales_Retail
            }
        }).sales_Retail;

        var cumulativProductSales = currentCumulative + ((totalProductSales / totalCategorySales) * 100);
        currentCumulative = cumulativProductSales;

        let tmpObj = {
            product_ID: product.product_ID,
            productName: product.productName,
            totalProductSales: parseFloat(parseFloat(totalProductSales.toFixed(2))),
            cumulativProductSales: cumulativProductSales.toFixed(2)
        }

        stores.forEach(store => {
            var storeProductSale = storeSalesData.filter(sd => {
                return sd.product_ID == product.product_ID && sd.store_ID == store.store_ID;
            });

            let tmpCode = "";
            let inStore = false;

            if(storeProductSale.length > 0) {
                let storeProductSaleItem = storeProductSale[0];

                if(storeProductSaleItem.sales_Retail > 0) {
                    tmpCode = "1";
                    inStore = true;
                } else {
                    tmpCode = "0";
                }
            } else {
                tmpCode = "0";
            }

            tmpObj[store.storeName] = tmpCode;
            tmpObj[store.storeName + "_inStore"] = inStore;
        });

        tmpStoreData.push(tmpObj);
    });

    let response = accumulateCodes(tmpStoreData, stores);
    response = addRank(response);
    response = GenerateCluster(response, levels);

    tmpStoreData = tmpStoreData.sort((a, b) => {
        if (a.totalProductSales > b.totalProductSales) {
            return -1;
        }
        if (a.totalProductSales < b.totalProductSales) {
            return 1;
        }
        return 0;
    })

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
            cluster: ""
        }

        tmpStoreData.forEach(tmpStoreItem => {
            storeCodeData.storeCode += tmpStoreItem[store.storeName];
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

    tmpStoreData.forEach(tmpStoreItem => {
        let percentageOfStoreCode = ((parseInt(levels) / 10) * tmpStoreItem.storeCode.length).toFixed(0);

        let currentCode = tmpStoreItem.storeCode.substr(0, percentageOfStoreCode);

        if(lastCode == "" || currentCode == lastCode) {
            tmpStoreItem.cluster = letters[letterIndex];
        }
        else 
        {
            letterIndex++;
            tmpStoreItem.cluster = letters[letterIndex];
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