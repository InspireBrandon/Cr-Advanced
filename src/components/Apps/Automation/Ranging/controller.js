let seasonalData = {
    average: 0,
    averageHigh: 0,
    averageLow: 0,
    rangeVolume: 0,
    currentOverSeasonalAverage: 0,
    seasonalPercent: 0,
    inSeason: true,
}

let dateFrom = 73;
let dateTo = 78;
let stockData = [];

import Axios from "axios";

class Controller {
    constructor() {
        let self = this;
    }

    static async getRequiredData(planogramID, type) {
        return new Promise(async (res, rej) => {
            await this.getSeasonality(planogramID);
            await this.getEndingStock(planogramID, type);
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
                    // self.getAverageStock(type, () => {
                    //     callback();
                    // })
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
}

export default Controller;

function numberifySales(string) {
    return parseFloat(string);
}