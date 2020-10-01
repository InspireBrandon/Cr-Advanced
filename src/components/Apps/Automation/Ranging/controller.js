let seasonalData = {
    average: 0,
    averageHigh: 0,
    averageLow: 0,
    rangeVolume: 0,
    currentOverSeasonalAverage: 0,
    seasonalPercent: 0,
    inSeason: true,
}

let dateFrom = 76;
let dateTo = 81;
let stockData = [];
let totalsData = null;

import Axios from "axios";

class Controller {
    constructor() {
        let self = this;
    }

    static async getRequiredData(planogramID, type) {
        return new Promise(async (res, rej) => {
            await this.getSeasonality(planogramID);
            await this.getEndingStock(planogramID, type);
            await this.getSalesMonthlyTotals(planogramID, type)
            res();
        })
    }

    static getOosDaysStore(storeSales, productID) {
        let oosDays = 0;

        storeSales.forEach(product => {
            if (product.productID == productID) {
                if (numberifySales(product.ooS_Days) > 0) {
                    oosDays += numberifySales(product.ooS_Days);
                }
            }
        });

        return oosDays;
    }

    static getStockUnitsStore(productID, storeID) {
        let stockUnits = 0;

        stockData.forEach(stockData => {
            if (stockData.store_ID == storeID) {
                if (stockData.product_ID == productID) {
                    stockUnits += stockData.closingUnits;
                }
            }
        })

        return stockUnits;
    }

    static getSeasonalData() {
        return seasonalData;
    }

    static getSeasonality(planogramID) {
        return new Promise((res, rej) => {
            Axios.get(process.env.VUE_APP_API +
                    `SeasonalityReport?planogramID=${planogramID}&periodFromID=${(dateFrom - 6)}&periodToID=${dateTo}`
                )
                .then(r => {
                    let data = r.data;

                    let rangeVolume = 0;

                    for (var i = ((data.length / 2)); i < data.length; i++) {
                        let el = data[i];
                        rangeVolume += el.volume;
                    }

                    rangeVolume = rangeVolume / (data.length / 2);

                    let avgVolume = 0;
                    let avgHighVolume = 0;
                    let avgLowVolume = 0;

                    // Get sum of all volume
                    data.forEach(element => {
                        avgVolume += element.volume;
                    });

                    // Get average volume
                    avgVolume = avgVolume / data.length;

                    let highs = [];
                    let lows = [];

                    // Get percent away from average and get high and low volumes
                    data.forEach(element => {
                        element['percentOf'] = (((element.volume - avgVolume) / avgVolume) * 100).toFixed(1);

                        if (element.volume > avgVolume) {
                            highs.push(element.volume);
                        }

                        if (element.volume <= avgVolume) {
                            lows.push(element.volume);
                        }
                    });

                    // sum average high volume
                    highs.forEach(volume => {
                        avgHighVolume += volume;
                    })

                    // sum average low volume
                    lows.forEach(volume => {
                        avgLowVolume += volume;
                    })

                    // get average
                    avgHighVolume = avgHighVolume / highs.length;
                    avgLowVolume = avgLowVolume / lows.length;

                    // Set averages for display
                    seasonalData.average = avgVolume.toFixed(0);
                    seasonalData.averageHigh = avgHighVolume.toFixed(0);
                    seasonalData.averageLow = avgLowVolume.toFixed(0);
                    seasonalData.rangeVolume = rangeVolume.toFixed(0);
                    seasonalData.currentOverSeasonalAverage = (((rangeVolume - seasonalData.average) / seasonalData.average) * 100).toFixed(0);

                    let seasonalDiff = seasonalData.rangeVolume - seasonalData.average;
                    seasonalData.seasonalPercent = (seasonalDiff / seasonalData.average) * 100;

                    seasonalData.inSeason = seasonalData.rangeVolume > seasonalData.average;

                    res();
                })
        })
    }

    static getEndingStock(planogramID, type) {
        return new Promise((res, rej) => {
            Axios.get(process.env.VUE_APP_API + `Ranging/ClosingStock?planogramID=${planogramID}&periodID=${dateTo}&type=${type}`)
                .then(r => {
                    stockData = r.data;
                    res();
                })
        })
    }

    static getSalesMonthlyTotals(planogramID, type) {
        return new Promise((res, rej) => {
            Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

            Axios.post(process.env.VUE_APP_API + `Sales_Monthly_Total?period_from_id=${dateFrom}&period_to_id=${dateTo}`).then(r => {
                totalsData = r.data.sales_Monthly_Total_List;
                res();
            })
        })
    }

    static calculateConstraints(min, max, autoRangeData, average_price, isNewItem) {
        let retval = {
            min: min,
            max: max,
            minUpdated: false,
            maxUpdated: false,
        }

        // DEFAULT MINIMUM UNITS
        if (min <= autoRangeData.default_Minimum) {
            retval.minUpdated = retval.min < autoRangeData.default_Minimum ? true : false;
            retval.min = retval.min < autoRangeData.default_Minimum ? autoRangeData.default_Minimum : retval.min;

            retval.maxUpdated = retval.max != autoRangeData.default_Minimum_Max ? true : false;
            retval.max = retval.max != autoRangeData.default_Minimum_Max ? autoRangeData.default_Minimum_Max : retval.max;

            if (average_price < autoRangeData.default_Price_Minimum) {
                retval.minUpdated = retval.min >= autoRangeData.default_Price_Minimum_Min ? false : true;
                retval.maxUpdated = retval.max >= autoRangeData.default_Price_Minimum_Max ? false : true;
                retval.min = retval.min > autoRangeData.default_price_Minimum_Min ? retval.min : autoRangeData.default_Price_Minimum_Min;
                retval.max = retval.max > autoRangeData.default_price_Minimum_Max ? retval.max : autoRangeData.default_Price_Minimum_Max;
            }
        } else {
            // DEFAULT MINIMUM UNITS GREATER
            if (min >= autoRangeData.default_Minimum_Greater && min <= autoRangeData.default_Minimum_Greater_Max) {
                retval.maxUpdated = retval.max > autoRangeData.default_Minimum_Greater_Max ? false : true;
                retval.max = retval.max > autoRangeData.default_Minimum_Greater_Max ? retval.max : autoRangeData.default_Minimum_Greater_Max;
            } else {
                // DEFAULT NEW ITEM

                if (isNewItem && min <= autoRangeData.default_New_Item_Max) {
                    retval.maxUpdated = true;
                }

                // DEFAULT PRICE MINIMUM
                if (average_price < autoRangeData.default_Price_Minimum) {
                    retval.minUpdated = retval.min >= autoRangeData.default_Price_Minimum_Min ? false : true;
                    retval.maxUpdated = retval.max >= autoRangeData.default_Price_Minimum_Max ? false : true;
                    retval.min = retval.min > autoRangeData.default_Price_Minimum_Min ? retval.min : autoRangeData.default_Price_Minimum_Min;
                    retval.max = retval.max > autoRangeData.default_Price_Minimum_Max ? retval.max : autoRangeData.default_Price_Minimum_Max;
                }
            }
        }

        return retval;
    }

    static getTotalStoreProductSales(storeSales, products) {
        let self = this;
        let retval = [];

        let storeRanks = getStoreRanks(storeSales.salesData, storeSales.storeID);

        products.forEach(product => {
            let productSales = storeSales.salesData.find(e => {
                return e.productID == product.productID;
            })

            let rangeProduct = new RangeProduct(product.barcode);

            rangeProduct.sales_retail = productSales.sales_Retail;
            rangeProduct.sales_units = productSales.sales_Units;

            rangeProduct.sales_contribution = getSalesContributionStore(storeSales.salesData, product.productID, storeSales.storeID, totalsData);
            rangeProduct.units_contribution = getUnitsContributionStore(storeSales.salesData, product.productID, storeSales.storeID, totalsData);
            rangeProduct.profit_contribution = getProfitContributionStore(storeSales.salesData, product.productID, storeSales.storeID, totalsData);

            let productRank = storeRanks.find(e => {
                return e.productID == product.productID;
            })

            rangeProduct.item_sales_rank = productRank.itemSalesRank;
            rangeProduct.item_volume_rank = productRank.itemVolumeRank;
            rangeProduct.item_profit_rank = productRank.itemProfitRank;

            retval.push(rangeProduct.toFormatted());
        })

        return retval;
    }
}

export default Controller;

function numberifySales(string) {
    return parseFloat(string);
}

function RangeProduct(barcode) {
    let self = this;

    self.barcode = barcode;
    self.sales_retail = 0;
    self.sales_units = 0;
    self.sales_contribution = 0;
    self.units_contribution = 0;
    self.profit_contribution = 0;
    self.item_sales_rank = 0;
    self.item_volume_rank = 0;
    self.item_profit_rank = 0;

    self.toFormatted = function () {
        return {
            barcode: self.barcode,
            sales_retail: numberify(self.sales_retail, 0), 
            sales_units: numberify(self.sales_units, 2),
            sales_contribution: numberify(self.sales_contribution, 0),
            units_contribution: numberify(self.units_contribution, 0),
            profit_contribution: numberify(self.profit_contribution, 0),
            item_sales_rank: numberify(self.item_sales_rank, 0),
            item_volume_rank: numberify(self.item_volume_rank, 0),
            item_profit_rank: numberify(self.item_profit_rank, 0),
            autoRangeItem: false,
            autoRangeOneItem: false,
        }
    }
}

// HELPER METHODS
function numberify(value, decimals) {
    return parseFloat(parseFloat(value).toFixed(decimals));
}

function getSalesContributionStore(storeSales, productID, storeID, totalsData) {
    let totalStoreSales = 0;
    let totalProducts = 0;

    // Get avg per store
    totalsData.forEach(store => {
        if (store.store_ID == storeID) {
            totalStoreSales += parseFloat(store.sales_Retail) / parseInt(store.items_In_Business);
        }
    })

    let avgProductSales = totalStoreSales;

    let productSales = 0;

    storeSales.forEach(product => {
        if (product.productID == productID) {
            productSales += parseFloat(product.sales_Retail);
        }
    })

    let contribution = productSales == 0 ? 0 : (productSales / avgProductSales) * 100;
    return contribution;
}

function getProfitContributionStore(storeSales, productID, storeID, totalsData) {
    let totalStoreProfit = 0;
    let totalProfit = 0;

    // Get avg per store
    totalsData.forEach(store => {
        if (store.store_ID == storeID) {
            totalStoreProfit += parseFloat(store.sales_Profit);
            totalProfit += parseInt(store.items_In_Business);
        }
    })

    let avgProductProfit = totalStoreProfit / totalProfit;
    let productProfit = 0;

    storeSales.forEach(product => {
        if (product.productID == productID) {
            productProfit += parseFloat(product.sales_Profit);
        }
    })

    let contribution = productProfit == 0 ? 0 : (productProfit / avgProductProfit) * 100;
    return contribution;
}

function getUnitsContributionStore(storeSales, productID, storeID, totalsData) {
    let totalStoreUnits = 0;
    let totalUnits = 0;

    // Get avg per store
    totalsData.forEach(store => {
        if (store.store_ID == storeID) {
            totalStoreUnits += parseFloat(store.sales_Units);
            totalUnits += parseInt(store.items_In_Business);
        }
    })

    let avgProductUnits = totalStoreUnits / totalUnits;
    let productUnits = 0;

    storeSales.forEach(product => {
        if (product.productID == productID) {
            productUnits += parseFloat(product.sales_Units);
        }
    })

    let contribution = productUnits == 0 ? 0 : (productUnits / avgProductUnits) * 100;
    return contribution;
}

function getStoreRanks(storeSales, storeID) {
    let retArr = [];

    storeSales.forEach(el => {
        retArr.push({
            productID: el.productID,
            itemSales: 0,
            itemSalesRank: 0,
            itemVolume: 0,
            itemVolumeRank: 0,
            itemProfit: 0,
            itemProfitRank: 0,
        })
    })

    storeSales.forEach(sd => {
        retArr.forEach(rA => {
            if (rA.productID == sd.productID) {
                rA.itemSales += parseFloat(sd.sales_Retail)
                rA.itemVolume += parseFloat(sd.sales_Units)
                rA.itemProfit += parseFloat(sd.sales_Profit)
                rA.salesPotential += parseFloat(sd.sales_potential)
                rA.volumePotential += parseFloat(sd.volume_potential)
            }
        })
    })

    // getting sales rank by sort
    retArr.sort((a, b) => (a.itemSales > b.itemSales) ? 1 : ((b.itemSales > a.itemSales) ? -1 : 0));

    for (let index = 0; index < retArr.length; index++) {
        const element = retArr[index];
        element.itemSalesRank = retArr.length - index
    }
    // getting volumeRank by sort

    retArr.sort((a, b) => (a.itemVolume > b.itemVolume) ? 1 : ((b.itemVolume > a.itemVolume) ? -1 : 0));

    for (let index = 0; index < retArr.length; index++) {
        const element = retArr[index];
        element.itemVolumeRank = retArr.length - index
    }
    // getting ItemProfitRank by sort

    retArr.sort((a, b) => (a.itemProfit > b.itemProfit) ? 1 : ((b.itemProfit > a.itemProfit) ? -1 : 0));

    for (let index = 0; index < retArr.length; index++) {
        const element = retArr[index];
        element.itemProfitRank = retArr.length - index
    }

    return retArr
}