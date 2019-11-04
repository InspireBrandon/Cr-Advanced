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

        let ProjectGroups = getProjectGroupsWeighted(storeSalesData); // get all unique ProjectGroups ordered by total weight in category

        let totalStoreProjectGroupSales = getTotalStoreProjectGroupSales(storeSales, ProjectGroups, storeSalesData, clusterData);

        let storeClusterCodes = accumulateCodes(totalStoreProjectGroupSales, stores, clusterData, ProjectGroups);
        storeClusterCodes = addRank(storeClusterCodes);
        let clusters = generateClusterNew(storeClusterCodes, clusterData, ProjectGroups);

        // let storeArrs = generateArrClusters(totalStoreProjectGroupSales, clusterData)
        // storeArrs=totalStoreProjectGroupSales



        return {
            stores: storeClusterCodes,
            storeData: clusters,
            ProjectGroupData: totalStoreProjectGroupSales,
            ProjectGroups: ProjectGroups,
            // storeArrs: storeArrs
        }
    }
}
// ////////////////////////////////////////////////////////////////////////////////////////////////////
// METHODS
// ////////////////////////////////////////////////////////////////////////////////////////////////////
function generateArrClusters(projectSales, clusterData) {
    let retval = []

    let tmp = JSON.parse(JSON.stringify(projectSales))

    tmp.forEach(e => {
        retval.push(e)
        e.ratioARR.sort((a, b) => {
            if (a.value > b.value) {
                return -1;
            }
            if (a.value < b.value) {
                return 1;
            }
            return 0;
        })
        e.clusterCode = ""
        let count = 0

        e.ratioARR.forEach(ratio => {
            if (ratio.code != null && ratio.code != undefined && count < clusterData.clusterGroups) {
                e.clusterCode += ratio.code
                count++
            }
        })
    })
    return retval

}

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

function getTotalStoreProjectGroupSales(stores, ProjectGroups, storeSalesData, clusterData) {
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

        ProjectGroups.sort((a, b) => {
            if (a.totalSales > b.totalSales) {
                return -1;
            }
            if (a.totalSales < b.totalSales) {
                return 1;
            }
            return 0;
        })
        let letters = ["a", "b", "c", "d", "e"]
        for (let index = 0; index < clusterData.clusterLevels; index++) {
            ProjectGroups[index].code = letters[index]

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

        // ProjectGroup["cumalitiveProjectSales"] += ProjectGroup.sales_Retail
        let lastAdded = 0
        ProjectGroups.forEach((ProjectGroup, idx) => {
            tmpObj[ProjectGroup.projectGroup + "_ratio"] = parseFloat(tmpObj[ProjectGroup.projectGroup + "_inStore"]) / parseFloat(tmpObj.projectTotal);
            if (tmpStoreData.length == 0) {
                tmpObj.ratioARR.push({
                    value: (parseFloat(tmpObj[ProjectGroup.projectGroup + "_inStore"]) / parseFloat(tmpObj.projectTotal)) * 100,
                    color: '#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6),
                    name: ProjectGroup.projectGroup,
                    code: ProjectGroup.code
                })
            } else {
                tmpObj.ratioARR.push({
                    value: (parseFloat(tmpObj[ProjectGroup.projectGroup + "_inStore"]) / parseFloat(tmpObj.projectTotal)) * 100,
                    color: tmpStoreData[0].ratioARR[idx].color,
                    name: ProjectGroup.projectGroup,
                    code: ProjectGroup.code,
                })
            }
            tmpObj[ProjectGroup.projectGroup + "_cumalitiveSales"] = lastAdded + parseFloat(tmpObj[ProjectGroup.projectGroup + "_ratio"])
            lastAdded += tmpObj[ProjectGroup.projectGroup + "_ratio"]

        })
        tmpStoreData.push(tmpObj);
    });

    return tmpStoreData;
}

function accumulateCodes(tmpStoreData, stores, clusterData, ProjectGroups) {

    let storesTotalSales = 0
    tmpStoreData.forEach(store => {
        storesTotalSales += parseFloat(store.totalStoreSales)
    })

    ProjectGroups.forEach((projectGroup, idx) => {
        projectGroup.StoretotalPercentage = ((parseFloat(projectGroup.totalSales) / parseFloat(storesTotalSales)) * 100).toFixed(2)
        if (idx == 0) {
            projectGroup.cumulativeProjectPercentage = parseFloat(projectGroup.StoretotalPercentage)
        } else {
            projectGroup.cumulativeProjectPercentage = parseFloat(ProjectGroups[idx - 1].cumulativeProjectPercentage) + parseFloat(projectGroup.StoretotalPercentage)
        }

    })
    let storeClusterCodes = []

    let percentageOfCumulative = (clusterData.primaryCluster / 10) * 100;
    let percentageOfCumulativeSecond = ((clusterData.primaryCluster + (clusterData.secondaryCluster / 2)) / 10) * 100;
    let percentageOfCumulativeThird = ((clusterData.primaryCluster + clusterData.secondaryCluster) / 10) * 100;


    let cumulativeStoreData = ProjectGroups.filter(e => {
        return parseFloat(e.cumulativeProjectPercentage) <= percentageOfCumulative;
    })


    let level1Lowest = 0
    let level1Hightest = 0
    cumulativeStoreData.forEach((project) => {
        tmpStoreData.forEach((store, idx) => {
            if (store.linetotal1 == undefined) {
                store.linetotal1 = store[project.projectGroup + "_inStore"]
            } else {
                store.linetotal1 += store[project.projectGroup + "_inStore"]
            }
        })
    })
    cumulativeStoreData.forEach((project) => {
        tmpStoreData.forEach((store, idx) => {
            if (level1Hightest < store.linetotal1) {
                level1Hightest = store.linetotal1
            }
            if (level1Lowest == 0) {
                level1Lowest = level1Hightest
            }
            if (level1Lowest > store.linetotal1) {
                level1Lowest = store.linetotal1
            }
            if (store.totallvl1Sales == undefined) {
                store.totallvl1Sales = store[project.projectGroup + "_inStore"]
            } else {
                store.totallvl1Sales += store[project.projectGroup + "_inStore"]
            }
        })
    })
    let cumulativeStoreDataSecondLevel = ProjectGroups.filter((e, idx) => {
        return parseFloat(e.cumulativeProjectPercentage) >= percentageOfCumulative && parseFloat(e.cumulativeProjectPercentage) <= percentageOfCumulativeSecond;
    })
    let level2Lowest = 0
    let level2Hightest = 0


    cumulativeStoreDataSecondLevel.forEach((project) => {
        tmpStoreData.forEach((store, idx) => {
            if (store.linetotal2 == undefined) {
                store.linetotal2 = store[project.projectGroup + "_inStore"]
            } else {
                store.linetotal2 += store[project.projectGroup + "_inStore"]
            }
        })
    })
    cumulativeStoreDataSecondLevel.forEach((project) => {
        tmpStoreData.forEach((store, idx) => {
            if (level2Hightest < store.linetotal2) {
                level2Hightest = store.linetotal2
            }
            if (level2Lowest == 0) {
                level2Lowest = level2Hightest
            }
            if (level2Lowest > store.linetotal2) {
                level2Lowest = store.linetotal2
            }
            if (store.totallvl2Sales == undefined) {
                store.totallvl2Sales = store[project.projectGroup + "_inStore"]
            } else {
                store.totallvl2Sales += store[project.projectGroup + "_inStore"]
            }
        })
    })




    let cumulativeStoreDataThirdLevel = ProjectGroups.filter((e, idx) => {
        return parseFloat(e.cumulativeProjectPercentage) >= percentageOfCumulativeSecond && parseFloat(e.cumulativeProjectPercentage) <= percentageOfCumulativeThird;
    })
    let level3Lowest = 0
    let level3Hightest = 0
    cumulativeStoreDataThirdLevel.forEach((project) => {
        tmpStoreData.forEach((store, idx) => {
            if (store.linetotal3 == undefined) {
                store.linetotal3 = store[project.projectGroup + "_inStore"]
            } else {
                store.linetotal3 += store[project.projectGroup + "_inStore"]
            }
        })
    })
    cumulativeStoreDataThirdLevel.forEach((project) => {
        tmpStoreData.forEach((store, idx) => {
            if (level3Hightest < store.linetotal3) {
                level3Hightest = store.linetotal3
            }
            if (level3Lowest == 0) {
                level3Lowest = level3Hightest
            }
            if (level3Lowest > store.linetotal3) {
                level3Lowest = store.linetotal3
            }
            if (store.totallvl3Sales == undefined) {
                store.totallvl3Sales = store[project.projectGroup + "_inStore"]
            } else {
                store.totallvl3Sales += store[project.projectGroup + "_inStore"]
            }
        })
    })
    // cumulativeStoreDataThirdLevel.forEach(project => {
    //     tmpStoreData.forEach((store, idx) => {
    //         if (store.totallvl3Sales == undefined) {
    //             store.totallvl3Sales = store[project.projectGroup + "_inStore"]

    //         } else {
    //             store.totallvl3Sales += store[project.projectGroup + "_inStore"]
    //         }
    //     })
    // })
    let cumulativeStoreDataSecondAndThirdLevel = ProjectGroups.filter((e, idx) => {
        return parseFloat(e.cumulativeProjectPercentage) >= percentageOfCumulative && parseFloat(e.cumulativeProjectPercentage) <= percentageOfCumulativeThird;
    })
    cumulativeStoreDataSecondAndThirdLevel.forEach((project) => {
        tmpStoreData.forEach((store, idx) => {
            if (store.linetotal == undefined) {
                store.linetotal = store[project.projectGroup + "_inStore"]
            } else {
                store.linetotal += store[project.projectGroup + "_inStore"]
            }
        })
    })
    // cumulativeStoreDataSecondAndThirdLevel.forEach((project) => {
    //     tmpStoreData.forEach((store, idx) => {
    //         if (level2Hightest < store.linetotal) {
    //             level2Hightest = store.linetotal
    //         }
    //         if (level2Lowest == 0) {
    //             level2Lowest = level2Hightest
    //         }
    //         if (level2Lowest > store.linetotal) {
    //             level2Lowest = store.linetotal
    //         }
    //         if (store.totallvl2Sales == undefined) {
    //             store.totallvl2Sales = store[project.projectGroup + "_inStore"]
    //         } else {
    //             store.totallvl2Sales += store[project.projectGroup + "_inStore"]
    //         }
    //     })
    // })
    // console.table(tmpStoreData);

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
            tmpStoreData.forEach(lineItem => {
                if (lineItem.store_ID == store.store_ID) {
                    let lowest = level1Lowest
                    let highest = level1Hightest
                    let comparitor = (highest - lowest) / clusterData.clusterLevels
                    let code = 0
                    for (let index = 0; index < clusterData.clusterLevels; index++) {
                        if ((comparitor * index + lowest) < lineItem.totallvl1Sales) {
                            code = clusterData.clusterLevels - (index + 1)
                        }
                    }
                    storeCodeData.storeCode += code;
                    storeCodeData.level1Code = code
                    tmpStoreItem.canHighlight = true;
                    tmpStoreItem.highlightLevel = 1;
                }
            })
        });


        if (clusterData.clusterGroups == 2) {
            cumulativeStoreDataSecondAndThirdLevel.forEach(tmpStoreItem => {
                tmpStoreData.forEach(lineItem => {
                    if (lineItem.store_ID == store.store_ID) {
                        let lowest = level2Lowest
                        let highest = level2Hightest
                        let comparitor = (highest - lowest) / clusterData.clusterLevels
                        let code = 0
                        for (let index = 0; index < clusterData.clusterLevels; index++) {
                            if ((comparitor * index + lowest) < lineItem.totallvl2Sales) {
                                code = clusterData.clusterLevels - (index + 1)
                            }
                        }
                        storeCodeData.storeCode += code;
                        storeCodeData.level2Code = code
                        tmpStoreItem.canHighlight = true;
                        tmpStoreItem.highlightLevel = 2;
                    }
                })
            });
            // cumulativeStoreDataSecondAndThirdLevel.forEach(tmpStoreItem => {
            //     storeCodeData.storeCode += code;
            //     storeCodeData.level2Code += tmpStoreItem[store.projectGroup];
            //     tmpStoreItem.highlightLevel = 2;
            //     tmpStoreItem.canHighlight = true;
            // })
        }

        if (clusterData.clusterGroups == 3) {
            cumulativeStoreDataSecondLevel.forEach(tmpStoreItem => {
                tmpStoreData.forEach(lineItem => {
                    if (lineItem.store_ID == store.store_ID) {
                        let lowest = level2Lowest
                        let highest = level2Hightest
                        let comparitor = (highest - lowest) / clusterData.clusterLevels
                        let code = 0
                        for (let index = 0; index < clusterData.clusterLevels; index++) {
                            if ((comparitor * index + lowest) < lineItem.totallvl2Sales) {
                                code = clusterData.clusterLevels - (index + 1)
                            }
                        }
                        storeCodeData.storeCode += code;
                        storeCodeData.level2Code = code
                        tmpStoreItem.canHighlight = true;
                        tmpStoreItem.highlightLevel = 2;
                    }
                })
            });
            // cumulativeStoreDataSecondLevel.forEach(tmpStoreItem => {
            //     storeCodeData.storeCode += code;
            //     storeCodeData.level2Code += tmpStoreItem[store.projectGroup];
            //     tmpStoreItem.highlightLevel = 2;
            //     tmpStoreItem.canHighlight = true;
            // })

            cumulativeStoreDataThirdLevel.forEach(tmpStoreItem => {
                tmpStoreData.forEach(lineItem => {
                    if (lineItem.store_ID == store.store_ID) {
                        let lowest = level3Lowest
                        let highest = level3Hightest
                        let comparitor = (highest - lowest) / clusterData.clusterLevels
                        let code = 0
                        for (let index = 0; index < clusterData.clusterLevels; index++) {
                            if ((comparitor * index + lowest) < lineItem.totallvl3Sales) {
                                code = clusterData.clusterLevels - (index + 1)
                            }
                        }
                        storeCodeData.storeCode += code;
                        storeCodeData.level3Code = code
                        tmpStoreItem.canHighlight = true;
                        tmpStoreItem.highlightLevel = 3;
                    }
                })
            });
            // storeCodeData.storeCode += code;
            // storeCodeData.level3Code += tmpStoreItem[store.projectGroup];
            // tmpStoreItem.highlightLevel = 3;
            // tmpStoreItem.canHighlight = true;
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


    tmpFirstLevel.forEach((el, idx) => {
        let counter = 0;
        let assigned = false;

        // for (var i = 0; i < (commonGroups1.length - 1); i++) {
        //     let highest = commonGroups1[i];
        //     let lowest = commonGroups1[i + 1];

        //     if (el.level1Code >= lowest && el.level1Code <= highest) {
        //         let closest = closestTo(el.level1Code, lowest, highest);

        //         if (closest.highest > closest.lowest) {
        //             counter = i;
        //         } else {
        //             counter = i + 1;
        //         }

        //         assigned = true;
        //     }
        // }

        if (!assigned)
            counter = letters.length - 1;

        el.cluster = letters[el.level1Code];
    })

    let highestSecond = tmpSecondLevel[0].level2Code;
    let commonGroups2 = getMostCommonGroups(tmpSecondLevel, clusterLevels, 2);

    tmpSecondLevel.forEach((el, idx) => {
        let counter = 0;
        let assigned = false;

        // for (var i = 0; i < (commonGroups2.length - 1); i++) {
        //     let highest = commonGroups2[i];
        //     let lowest = commonGroups2[i + 1];

        //     if (el.level2Code >= lowest && el.level2Code <= highest) {
        //         let closest = closestTo(el.level2Code, lowest, highest);

        //         if (closest.highest > closest.lowest) {
        //             counter = i + 1;
        //         } else {
        //             counter = i + 2;
        //         }

        //         assigned = true;
        //     }
        // }

        // if (!assigned)
        //     counter = letters.length - 1;

        el.cluster = el.level2Code+1
    })

    let highestThird = tmpThirdLevel[0].level3Code;
    let commonGroups3 = getMostCommonGroups(tmpThirdLevel, clusterLevels, 3);

    tmpThirdLevel.forEach((el, idx) => {
    //     let counter = 0;
    //     let assigned = false;

    //     for (var i = 0; i < (commonGroups3.length - 1); i++) {
    //         let highest = commonGroups3[i];
    //         let lowest = commonGroups3[i + 1];

    //         if (el.level3Code >= lowest && el.level3Code <= highest) {
    //             let closest = closestTo(el.level3Code, lowest, highest);

    //             if (closest.highest > closest.lowest) {
    //                 counter = i;
    //             } else {
    //                 counter = i + 1;
    //             }

    //             assigned = true;
    //         }
    //     }

    //     if (!assigned)
    //         counter = letters.length - 1;

    //     el.cluster = (counter == (letters.length - 1)) ? letters[counter] : letters[counter].toLowerCase();
    el.cluster = letters[el.level3Code].toLowerCase();
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
            return 1;
        }
        if (a.storeCode < b.storeCode) {
            return -1;
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