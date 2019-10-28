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

        let ProjectGroups = getProjectGroupsWeighted(storeSalesData); // get all unique ProjectGroups ordered by total weight in category

        let totalStoreProjectGroupSales = getTotalStoreProjectGroupSales(storeSales, ProjectGroups, storeSalesData, clusterData);

        let storeClusterCodes = accumulateCodes(totalStoreProjectGroupSales, ProjectGroups, clusterData);
        storeClusterCodes = addRank(storeClusterCodes);
        let clusters = generateClusterNew(storeClusterCodes, clusterData);

        return {
            stores: storeClusterCodes,
            storeData: clusters,
            ProjectGroupData: totalStoreProjectGroupSales,
            ProjectGroups: ProjectGroups
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

function getProjectGroupsWeighted(storeSalesData) {
    let uniqueProjectGroups = removeDuplicates(storeSalesData.map(item => ({
        projectGroup: item.projectGroup,
        projectGroup_ID: item.projectGroup_ID
    })), "projectGroup_ID"); // get all unique ProjectGroups

    uniqueProjectGroups.forEach(ProjectGroup => {
        let allProjectGroupSales = storeSalesData.filter(storeSale => {
            return storeSale.projectGroup_ID == ProjectGroup.projectGroup_ID;
        }); // get all ProjectGroup sales records

        let totalSalesValue = allProjectGroupSales.reduce((a, b) => {
            return {
                sales_Retail: a.sales_Retail + b.sales_Retail
            }
        }).sales_Retail // reduce array to return only total sales

        totalSalesValue = parseFloat(parseFloat(totalSalesValue.toFixed(2)));

        ProjectGroup["totalSales"] = totalSalesValue;
    });

    return uniqueProjectGroups.sort((a, b) => {
        if (a.totalSales > b.totalSales) {
            return -1;
        }
        if (a.totalSales < b.totalSales) {
            return 1;
        }
        return 0;
    })
}

function getTotalStoreProjectGroupSales(stores, ProjectGroups, storeSalesData) {
    let tmpStoreData = [];
    let currentCumulative = 0;

    var totalCategorySales = storeSalesData.reduce((a, b) => {
        return {
            sales_Retail: a.sales_Retail + b.sales_Retail
        }
    }).sales_Retail;

    stores.forEach(store => {
        var StoreSales = storeSalesData.filter(sd => {
            return sd.store_ID == store.store_ID;
        });

        var totalStoreSales = StoreSales.reduce((a, b) => {
            return {
                sales_Retail: a.sales_Retail + b.sales_Retail
            }
        }).sales_Retail;

        var cumulativStoreSales = currentCumulative + ((totalStoreSales / totalCategorySales) * 100);
        currentCumulative = cumulativStoreSales;

        let tmpObj = {
            store_ID: store.store_ID,
            storeName: store.storeName,
            totalStoreSales: parseFloat(parseFloat(totalStoreSales.toFixed(2))),
            cumulativStoreSales: cumulativStoreSales.toFixed(2),
            canHighlight: false,
            highlightLevel: 0,
            projectTotal: 0,
            ratioARR: []
        }

        ProjectGroups.forEach(ProjectGroup => {
            var storeProjectGroupSale = storeSalesData.filter(sd => {
                return sd.projectGroup_ID == ProjectGroup.projectGroup_ID && sd.store_ID == store.store_ID;
            });

            let tmpCode = "";
            let inStore = false;

            if (storeProjectGroupSale.length > 0) {
                let storeProjectGroupSaleItem = storeProjectGroupSale[0];

                if (storeProjectGroupSaleItem.sales_Retail > 0) {
                    tmpCode = "1";
                    tmpObj.projectTotal += parseFloat(storeProjectGroupSaleItem.sales_Retail)
                    inStore = storeProjectGroupSaleItem.sales_Retail
                } else {
                    tmpCode = "0";
                }
            } else {
                tmpCode = "0";
            }
            // parseFloat( storeProjectGroupSaleItem.sales_Retail)/parseFloat(ProjectGroup.totalSales);
            tmpObj[ProjectGroup.projectGroup] = tmpCode;
            tmpObj[ProjectGroup.projectGroup + "_inStore"] = inStore;

        });


        ProjectGroups.forEach((ProjectGroup, idx) => {
            tmpObj[ProjectGroup.projectGroup + "_ratio"] = parseFloat(tmpObj[ProjectGroup.projectGroup + "_inStore"]) / parseFloat(tmpObj.projectTotal);
            if (tmpStoreData.length == 0) {
                tmpObj.ratioARR.push({
                    value: parseFloat(tmpObj[ProjectGroup.projectGroup + "_inStore"]) / parseFloat(tmpObj.projectTotal),
                    color: '#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6),
                    name: ProjectGroup.projectGroup
                })
            } else {
                tmpObj.ratioARR.push({
                    value: parseFloat(tmpObj[ProjectGroup.projectGroup + "_inStore"]) / parseFloat(tmpObj.projectTotal),
                    color: tmpStoreData[0].ratioARR[idx].color,
                    name: ProjectGroup.projectGroup
                })
            }

        })
        tmpStoreData.push(tmpObj);
    });

    return tmpStoreData;
}

function accumulateCodes(tmpStoreData, stores, clusterData) {
    let storeClusterCodes = []

    let percentageOfCumulative = (clusterData.primaryCluster / 10) * 100;
    let percentageOfCumulativeSecond = ((clusterData.primaryCluster + (clusterData.secondaryCluster / 2)) / 10) * 100;
    let percentageOfCumulativeThird = ((clusterData.primaryCluster + clusterData.secondaryCluster) / 10) * 100;
    console.log("tmpStoreData", tmpStoreData);

    let cumulativeStoreData = tmpStoreData.filter(e => {
        return parseFloat(e.cumulativStoreSales) <= percentageOfCumulative;
    })


    let cumulativeStoreDataSecondLevel = tmpStoreData.filter((e, idx) => {
        return parseFloat(e.cumulativStoreSales) >= percentageOfCumulative && parseFloat(e.cumulativStoreSales) <= percentageOfCumulativeSecond;
    })

    let cumulativeStoreDataThirdLevel = tmpStoreData.filter((e, idx) => {
        return parseFloat(e.cumulativStoreSales) >= percentageOfCumulativeSecond && parseFloat(e.cumulativStoreSales) <= percentageOfCumulativeThird;
    })

    let cumulativeStoreDataSecondAndThirdLevel = tmpStoreData.filter((e, idx) => {
        return parseFloat(e.cumulativStoreSales) >= percentageOfCumulative && parseFloat(e.cumulativStoreSales) <= percentageOfCumulativeThird;
    })
    console.log("stores", stores);
    console.log("cumulativeStoreData", cumulativeStoreData);
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
            storeCodeData.storeCode += tmpStoreItem[store.projectGroup];
            storeCodeData.level1Code += tmpStoreItem[store.projectGroup];
            tmpStoreItem.canHighlight = true;
            tmpStoreItem.highlightLevel = 1;
        });


        if (clusterData.clusterGroups == 2) {
            cumulativeStoreDataSecondAndThirdLevel.forEach(tmpStoreItem => {
                storeCodeData.storeCode += tmpStoreItem[store.projectGroup];
                storeCodeData.level2Code += tmpStoreItem[store.projectGroup];
                tmpStoreItem.highlightLevel = 2;
                tmpStoreItem.canHighlight = true;
            })
        }

        if (clusterData.clusterGroups == 3) {
            cumulativeStoreDataSecondLevel.forEach(tmpStoreItem => {
                storeCodeData.storeCode += tmpStoreItem[store.projectGroup];
                storeCodeData.level2Code += tmpStoreItem[store.projectGroup];
                tmpStoreItem.highlightLevel = 2;
                tmpStoreItem.canHighlight = true;
            })

            cumulativeStoreDataThirdLevel.forEach(tmpStoreItem => {
                storeCodeData.storeCode += tmpStoreItem[store.projectGroup];
                storeCodeData.level3Code += tmpStoreItem[store.projectGroup];
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
    console.log("tmpFirstLevel", tmpFirstLevel);

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