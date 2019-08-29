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

        let clusterData = {
            primaryCluster: params.primaryCluster, // value used to determine the first level of the cluster
            secondaryCluster: params.secondaryCluster,
            clusterLevels: params.clusterLevels, // value used to determine the second level of the cluster
            clusterGroups: params.clusterGroups // value used to determine amount of primary clusters
        }

        // ////////////////////////////////////////////////////////////////////////////////////////////////////
        // CALCULATED VARIABLES
        // ////////////////////////////////////////////////////////////////////////////////////////////////////
        let stores = removeDuplicates(storeSalesData.map(item => ({
            storeName: item.storeName,
            store_ID: item.store_ID
        })), "store_ID"); // get all unique stores

        let storeSales = getStoreSales(stores, storeSalesData); // get total store sales
        let products = getProductsWeighted(storeSalesData); // get all unique products ordered by total weight in category
        let totalStoreProductSales = getTotalStoreProductSales(storeSales, products, storeSalesData, clusterData);
        let storeClusterCodes = accumulateCodes(totalStoreProductSales, stores, clusterData);
        storeClusterCodes = addRank(storeClusterCodes);
        let clusters = generateCluster(storeClusterCodes, clusterData);

        return {
            stores: storeClusterCodes,
            storeData: clusters,
            productData: totalStoreProductSales
        }
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

function getTotalStoreProductSales(stores, products, storeSalesData) {
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
            cumulativProductSales: cumulativProductSales.toFixed(2),
            canHighlight: false,
            highlightLevel: 0
        }

        stores.forEach(store => {
            var storeProductSale = storeSalesData.filter(sd => {
                return sd.product_ID == product.product_ID && sd.store_ID == store.store_ID;
            });

            let tmpCode = "";
            let inStore = false;

            if (storeProductSale.length > 0) {
                let storeProductSaleItem = storeProductSale[0];

                if (storeProductSaleItem.sales_Retail > 0) {
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

    return tmpStoreData;
}

function accumulateCodes(tmpStoreData, stores, clusterData) {
    let storeClusterCodes = []

    let percentageOfCumulative = (clusterData.primaryCluster / 10) * 100;
    let percentageOfCumulativeSecond = ((clusterData.primaryCluster + (clusterData.secondaryCluster / 2)) / 10) * 100;
    let percentageOfCumulativeThird = ((clusterData.primaryCluster + clusterData.secondaryCluster) / 10) * 100;

    let cumulativeStoreData = tmpStoreData.filter(e => {
        return parseFloat(e.cumulativProductSales) <= percentageOfCumulative;
    })

    let cumulativeStoreDataSecondLevel = tmpStoreData.filter((e, idx) => {
        return parseFloat(e.cumulativProductSales) >= percentageOfCumulative && parseFloat(e.cumulativProductSales) <= percentageOfCumulativeSecond;
    })

    let cumulativeStoreDataThirdLevel = tmpStoreData.filter((e, idx) => {
        return parseFloat(e.cumulativProductSales) >= percentageOfCumulativeSecond && parseFloat(e.cumulativProductSales) <= percentageOfCumulativeThird;
    })

    let cumulativeStoreDataSecondAndThirdLevel = tmpStoreData.filter((e, idx) => {
        return parseFloat(e.cumulativProductSales) >= percentageOfCumulative && parseFloat(e.cumulativProductSales) <= percentageOfCumulativeThird;
    })

    stores.forEach(store => {
        let storeCodeData = {
            storeCode: "",
            level1Code: "",
            level2Code: "",
            level3Code: "",
            store_ID: store.store_ID,
            storeName: store.storeName,
            currentRank: -1,
            cluster: ""
        }

        cumulativeStoreData.forEach(tmpStoreItem => {
            storeCodeData.storeCode += tmpStoreItem[store.storeName];
            storeCodeData.level1Code += tmpStoreItem[store.storeName];
            tmpStoreItem.canHighlight = true;
            tmpStoreItem.highlightLevel = 1;
        });

        if (clusterData.clusterGroups == 2) {
            cumulativeStoreDataSecondAndThirdLevel.forEach(tmpStoreItem => {
                storeCodeData.storeCode += tmpStoreItem[store.storeName];
                storeCodeData.level2Code += tmpStoreItem[store.storeName];
                tmpStoreItem.highlightLevel = 2;
                tmpStoreItem.canHighlight = true;
            })
        }

        if (clusterData.clusterGroups == 3) {
            cumulativeStoreDataSecondLevel.forEach(tmpStoreItem => {
                storeCodeData.storeCode += tmpStoreItem[store.storeName];
                storeCodeData.level2Code += tmpStoreItem[store.storeName];
                tmpStoreItem.highlightLevel = 2;
                tmpStoreItem.canHighlight = true;
            })

            cumulativeStoreDataThirdLevel.forEach(tmpStoreItem => {
                storeCodeData.storeCode += tmpStoreItem[store.storeName];
                storeCodeData.level3Code += tmpStoreItem[store.storeName];
                tmpStoreItem.highlightLevel = 3;
                tmpStoreItem.canHighlight = true;
            })
        }

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

function generateCluster(tmpStoreData, clusterData) {
    let clusterGroups = clusterData.clusterGroups;
    let clusterLevels = clusterData.clusterLevels;
    let letters = ["A", "B", "C", "D", "E"];

    let parsed = JSON.parse(JSON.stringify(tmpStoreData))

    let tmpFirstLevel = parsed.sort((a, b) => {
        if (a.level1Code > b.level1Code) {
            return -1;
        }
        if (a.level1Code < b.level1Code) {
            return 1;
        }
        return 0;
    })

    let tmpSecondLevel = parsed.sort((a, b) => {
        if (a.level2Code > b.level2Code) {
            return -1;
        }
        if (a.level2Code < b.level2Code) {
            return 1;
        }
        return 0;
    })

    let tmpThirdLevel = parsed.sort((a, b) => {
        if (a.level2Code > b.level2Code) {
            return -1;
        }
        if (a.level2Code < b.level2Code) {
            return 1;
        }
        return 0;
    })

    let FirstLevelIndexLevel = 1;
    let SecondLevelIndexLevel = 1;
    let ThirdLevelIndexLevel = 1;

    tmpFirstLevel.forEach((el, idx) => {
        SecondLevelIndexLevel = 1;
        ThirdLevelIndexLevel = 1;

        if((idx) / FirstLevelIndexLevel >= ((tmpFirstLevel.length) / clusterLevels)) {
            FirstLevelIndexLevel++;
            SecondLevelIndexLevel = 1;
            ThirdLevelIndexLevel = 1;
        }
        
        el.cluster = letters[FirstLevelIndexLevel - 1];
        
        tmpSecondLevel.forEach((el2, idx2) => {
            // ThirdLevelIndexLevel = 1;

            if((idx2) / SecondLevelIndexLevel >= ((tmpSecondLevel.length) / (clusterLevels * clusterLevels))) {
                SecondLevelIndexLevel++;
                ThirdLevelIndexLevel = 1;

                if(SecondLevelIndexLevel > clusterLevels) {
                    SecondLevelIndexLevel = 1;
                    ThirdLevelIndexLevel = 1;
                }
            }

            if(el2.store_ID == el.store_ID) {
                el.cluster += SecondLevelIndexLevel
                SecondLevelIndexLevel = 1;
                ThirdLevelIndexLevel = 1;

                tmpThirdLevel.forEach((el3, idx3) => {
                    if((idx3) / ThirdLevelIndexLevel >= ((tmpThirdLevel.length) / (clusterLevels * clusterLevels * clusterLevels))) {
                        ThirdLevelIndexLevel++;

                        if(ThirdLevelIndexLevel > clusterLevels)
                            ThirdLevelIndexLevel = 1
                    }

                    if(el3.store_ID == el2.store_ID) {
                        el.cluster += letters[ThirdLevelIndexLevel - 1].toLowerCase();
                        ThirdLevelIndexLevel = 1;
                    }
                })
            }
        })
    })

    return parsed.sort((a, b) => {
        if (a.storeCode > b.storeCode) {
            return -1;
        }
        if (a.storeCode < b.storeCode) {
            return 1;
        }
        return 0;
    });
}

function removeDuplicates(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
}

export default ListingClusterController;