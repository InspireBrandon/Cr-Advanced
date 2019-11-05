// ////////////////////////////////////////////////////////////////////////////////////////////////////
// Purpose: To get an output for the listing cluster
// Author: Brandon Lange
// Date 2019-08-19
// ////////////////////////////////////////////////////////////////////////////////////////////////////
class ListingClusterController {
    constructor() {}

    static GenerateClusterOutput(params) {
        let self = this;
        console.log(params);

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
        let clusters = generateClusterNew(storeClusterCodes, clusterData);

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
        product_ID: item.product_ID,
        sales_Retail: item.sales_Retail,
        size_Description: item.size_Description,
        supplier: item.supplier,
        manufacturer: item.manufacturer,
        brand_Name: item.brand_Name,
        subcategory: item.subcategory,
        category: item.category
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
    console.log("products");
    console.log(products);

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
            highlightLevel: 0,
            sales_Retail: product.sales_Retail,
            size_Description: product.size_Description,
            supplier: product.supplier,
            manufacturer: product.manufacturer,
            brand_Name: product.brand_Name,
            subcategory: product.subcategory,
            category: product.category
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

function getMostCommonGroups(codeData, levels, group) {
    let tmp = JSON.parse(JSON.stringify(codeData))
    let currentCount = 0;
    let retval = [];

    for (var i = 0; i < levels; i++) {
        let currentHighest = 0;
        let currentHighestString = "";

        tmp.forEach(el => {
            let count = tmp.filter(fel => {
                return fel["level" + group + "Code"] == el["level" + group + "Code"];
            }).length;

            if (count > currentHighest) {
                currentHighest = count;
                currentHighestString = el["level" + group + "Code"];
            }
        })

        tmp = tmp.filter(fel => {
            return fel["level" + group + "Code"] != currentHighestString;
        });

        if (currentHighest > 1) {
            retval.push(currentHighestString);
        }
    }

    return retval.sort((a, b) => {
        if (a > b) {
            return -1;
        }
        if (a < b) {
            return 1;
        }
        return 0;
    });
}

function generateClusterNew(tmpStoreData, clusterData) {
    let clusterGroups = clusterData.clusterGroups;
    let clusterLevels = clusterData.clusterLevels;

    let letters = ["A", "B", "C", "D", "E", "X"];
    let tmp = [];

    tmpStoreData.forEach(element => {
        let tmpObj = {};

        for (var prop in element) {
            tmpObj[prop] = element[prop];
        }

        tmp.push(tmpObj);
    });

    tmpStoreData = JSON.parse(JSON.stringify(tmpStoreData));

    let tmpFirstLevel = tmp.sort((a, b) => {
        if (a.level1Code > b.level1Code) {
            return -1;
        }
        if (a.level1Code < b.level1Code) {
            return 1;
        }
        return 0;
    })

    tmpFirstLevel = JSON.parse(JSON.stringify(tmpFirstLevel))

    let tmpSecondLevel = tmp.sort((a, b) => {
        if (a.level2Code > b.level2Code) {
            return -1;
        }
        if (a.level2Code < b.level2Code) {
            return 1;
        }
        return 0;
    })

    tmpSecondLevel = JSON.parse(JSON.stringify(tmpSecondLevel))

    let tmpThirdLevel = tmp.sort((a, b) => {
        if (a.level3Code > b.level3Code) {
            return -1;
        }
        if (a.level3Code < b.level3Code) {
            return 1;
        }
        return 0;
    })

    tmpThirdLevel = JSON.parse(JSON.stringify(tmpThirdLevel))

    let firstHighest = parseInt(tmpFirstLevel[0].level1Code);
    let firstLowest = parseInt(tmpFirstLevel[tmpFirstLevel.length - 1].level1Code);

    let countValue = Math.floor(parseFloat((firstHighest - firstLowest) / clusterLevels));
    let highestPoint = countValue * clusterLevels;

    let highestFirst = tmpFirstLevel[0].level1Code;
    let commonGroups1 = getMostCommonGroups(tmpFirstLevel, clusterLevels, 1);

    console.log("Common Group", commonGroups1)

    tmpFirstLevel.forEach((el, idx) => {
        let counter = 0;
        let assigned = false;

        for (var i = 0; i < (commonGroups1.length - 1); i++) {
            let highest = commonGroups1[i];
            let lowest = commonGroups1[i + 1];

            if (el.level1Code >= lowest && el.level1Code <= highest) {
                let closest = closestTo(el.level1Code, lowest, highest);

                if (closest.highest > closest.lowest) {
                    counter = i;
                } else {
                    counter = i + 1;
                }

                assigned = true;
            }
        }

        if (!assigned)
            counter = letters.length - 1;

        el.cluster = letters[counter];
    })

    let highestSecond = tmpSecondLevel[0].level2Code;
    let commonGroups2 = getMostCommonGroups(tmpSecondLevel, clusterLevels, 2);

    tmpSecondLevel.forEach((el, idx) => {
        let counter = 0;
        let assigned = false;

        for (var i = 0; i < (commonGroups2.length - 1); i++) {
            let highest = commonGroups2[i];
            let lowest = commonGroups2[i + 1];

            if (el.level2Code >= lowest && el.level2Code <= highest) {
                let closest = closestTo(el.level2Code, lowest, highest);

                if (closest.highest > closest.lowest) {
                    counter = i + 1;
                } else {
                    counter = i + 2;
                }

                assigned = true;
            }
        }

        if (!assigned)
            counter = letters.length - 1;

        el.cluster = (counter == (letters.length - 1)) ? letters[counter] : counter;
    })

    let highestThird = tmpThirdLevel[0].level3Code;
    let commonGroups3 = getMostCommonGroups(tmpThirdLevel, clusterLevels, 3);

    tmpThirdLevel.forEach((el, idx) => {
        let counter = 0;
        let assigned = false;

        for (var i = 0; i < (commonGroups3.length - 1); i++) {
            let highest = commonGroups3[i];
            let lowest = commonGroups3[i + 1];

            if (el.level3Code >= lowest && el.level3Code <= highest) {
                let closest = closestTo(el.level3Code, lowest, highest);

                if (closest.highest > closest.lowest) {
                    counter = i;
                } else {
                    counter = i + 1;
                }

                assigned = true;
            }
        }

        if (!assigned)
            counter = letters.length - 1;

        el.cluster = (counter == (letters.length - 1)) ? letters[counter] : letters[counter].toLowerCase();
    })

    tmp.forEach(el => {
        tmpFirstLevel.forEach(el2 => {
            if (el.store_ID == el2.store_ID) {
                el.cluster = el2.cluster;
            }
        })

        if (clusterGroups > 1) {
            tmpSecondLevel.forEach(el2 => {
                if (el.store_ID == el2.store_ID) {
                    el.cluster += el2.cluster;
                }
            })
        }

        if (clusterGroups > 2) {
            tmpThirdLevel.forEach(el2 => {
                if (el.store_ID == el2.store_ID) {
                    el.cluster += el2.cluster;
                }
            })
        }
    })

    return tmp.sort((a, b) => {
        if (a.storeCode > b.storeCode) {
            return -1;
        }
        if (a.storeCode < b.storeCode) {
            return 1;
        }
        return 0;
    });
}

function closestTo(comparitor, lowest, highest) {
    let counter = {
        lowest: 0,
        highest: 0
    }

    for (var i = 0; i < comparitor.length; i++) {
        if (comparitor[i] == lowest[i]) {
            counter.lowest++;
        }

        if (comparitor[i] == highest[i]) {
            counter.highest++;
        }
    }

    return counter;
}

function removeDuplicates(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
}

export default ListingClusterController;