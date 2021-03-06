// ////////////////////////////////////////////////////////////////////////////////////////////////////
// Purpose: A common helper for the ranging tool
// Author: Brandon Lange
// Date: 2019-01-17
// ////////////////////////////////////////////////////////////////////////////////////////////////////
import csvToDataObject from '@/libs/helpers/csvToDataObject.js'
import Axios from 'axios';
import Vue from 'vue';

// Seasonality
let seasonalData = {
  average: 0,
  averageHigh: 0,
  averageLow: 0,
  rangeVolume: 0,
  currentOverSeasonalAverage: 0,
  seasonalPercent: 0,
  inSeason: true,
}

class RangingController {
  constructor(rangingData, vueInstance) {
    let self = this;

    self.allRangeProducts = rangingData.allRangeProducts;
    self.clusterData = rangingData.clusterData;
    self.storeSales = rangingData.storeSales;
    self.planogramName = rangingData.planogramName;
    self.planogramID = rangingData.planogramID;
    self.dateFrom = rangingData.dateFrom;
    self.dateTo = rangingData.dateTo;
    self.dateFromString = rangingData.dateFromString;
    self.dateToString = rangingData.dateToString;
    self.periodic = rangingData.periodic;
    self.monthsBetween = rangingData.monthsBetween;
    self.tag = rangingData.tag;
    self.totalsData = null;
    self.endingStock = null;
    self.averageStock = null;
    self.categoryCharacteristics = rangingData.categoryCharacteristics;

    self.allRangeProducts.forEach(rp => {
      let parsedCPQ = parseInt(rp.case_Pack_Qty);

      if (parsedCPQ == undefined || parsedCPQ == null || isNaN(parsedCPQ) || parsedCPQ < 1) {
        rp.case_Pack_Qty = 1;
      }
    })

    // SET TEST INDICATORS
    self.storeSales.forEach(store => {
      store.salesData.forEach(storeSale => {
        // SET TEST INDICATORS

        if (storeSale.test_Range_Indicator == undefined || storeSale.test_Range_Indicator == null) {
          Vue.set(storeSale, 'test_Range_Indicator', 'NO');
        }

        if (storeSale.test_Range_Indicator_ID == undefined || storeSale.test_Range_Indicator_ID == null) {
          Vue.set(storeSale, 'test_Range_Indicator_ID', 1);
        }
      });
    });
  }

  getClusterData() {
    let self = this;
    return self.clusterData;
  }

  getSeasonalData() {
    return seasonalData;
  }

  getSalesMonthlyTotals(planogramID, type, callback) {
    let self = this;
    self.planogramID = planogramID;

    Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

    Axios.post(process.env.VUE_APP_API + `Sales_Monthly_Total?period_from_id=${self.dateFrom}&period_to_id=${self.dateTo}`).then(r => {
      self.totalsData = r.data.sales_Monthly_Total_List;
      self.getEndingStock(type, () => {
        self.getTemporaryClusters(() => {
          self.getSeasonality(callback)
        });
        // callback();
      })
    })
  }

  getEndingStock(type, callback) {
    let self = this;

    Axios.get(process.env.VUE_APP_API + `Ranging/ClosingStock?planogramID=${self.planogramID}&periodID=${self.dateTo}&type=${type}`)
      .then(r => {
        self.endingStock = r.data;
        self.getAverageStock(type, () => {
          callback();
        })
      })
      .catch(e => {

      })
  }

  getAverageStock(type, callback) {
    let self = this;

    Axios.get(process.env.VUE_APP_API + `Ranging/AverageStock?planogramID=${self.planogramID}&periodFromID=${self.dateFrom - 6}&periodToID=${self.dateTo}&type=${type}`)
      .then(r => {
        self.averageStock = r.data;
        callback();
      })
      .catch(e => {

      })
  }

  getEndingStockData(clusterType, clusterID) {
    let self = this;
    let retval = [];

    if (clusterType == "stores") {
      self.endingStock.forEach(es => {
        if (es.store_ID == clusterID) {
          retval.push(es)
        }
      })
    } else {
      let stores = getStoresByCluster(this.clusterData, clusterType, clusterID);

      self.endingStock.forEach(es => {
        if (storeInCluster(es.store_ID, stores)) {
          retval.push(es)
        }
      })
    }

    return retval;
  }

  getAverageStockData(clusterType, clusterID) {
    let self = this;
    let retval = [];

    if (clusterType == "stores") {
      self.averageStock.forEach(es => {
        if (es.store_ID == clusterID) {
          retval.push(es)
        }
      })
    } else {
      let stores = getStoresByCluster(this.clusterData, clusterType, clusterID);

      self.averageStock.forEach(es => {
        if (storeInCluster(es.store_ID, stores)) {
          retval.push(es)
        }
      })
    }

    return retval;
  }

  getTemporaryClusters(callback) {
    let self = this;

    let tempClusters = []

    Axios.get(process.env.VUE_APP_API + `Clusters/TemporaryCluster`)
      .then(r => {
        tempClusters.push({
          clusterID: 1,
          clusterName: 'TEST',
          clusterStores: r.data
        })

        tempClusters = r.data;

        Vue.set(self.clusterData, 'tempClusters', tempClusters);
        callback();
      })
  }

  getSeasonality(callback) {
    let self = this;

    Axios.get(process.env.VUE_APP_API +
        `SeasonalityReport?planogramID=${self.planogramID}&periodFromID=${(self.dateFrom - 6)}&periodToID=${self.dateTo}`
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

        callback();
      })
      .catch(e => {
        console.log(e);
      })
  }

  getRangingFile() {
    return {
      allRangeProducts: this.allRangeProducts,
      clusterData: this.clusterData,
      storeSales: this.storeSales,
      planogramName: this.planogramName,
      planogramID: this.planogramID,
      dateFrom: this.dateFrom,
      dateTo: this.dateTo,
      dateFromString: this.dateFromString,
      dateToString: this.dateToString,
      periodic: this.periodic,
      monthsBetween: this.monthsBetween,
      tag: this.tag,
      categoryCharacteristics: this.categoryCharacteristics
    }
  }

  setClusterData(clusterData) {
    this.clusterData = clusterData;
  }

  getClusterData() {
    return this.clusterData;
  }

  getAllRangeProducts() {
    return this.allRangeProducts;
  }

  getImportCSV() {
    let finalArr = [];

    for (let i = 0; i < this.storeSales.length; i++) {
      let store = this.storeSales[i];
      for (let j = 0; j < store.salesData.length; j++) {
        let product = store.salesData[j];

        if (product.store_Range_Indicator_ID == 0 && (product.updated != undefined && product.updated)) {

          switch (product.store_Range_Indicator) {
            case 'YES': {
              product.store_Range_Indicator_ID = 2;
              product["updated"] = true;
            }
            break;
          case 'NO': {
            product.store_Range_Indicator_ID = 1;
            product["updated"] = true;
          }
          break;
          case 'SELECT': {
            product.store_Range_Indicator_ID = 3;
            product["updated"] = true;
          }
          break;
          }
        }

        if (product.updated != undefined && product.updated) {

          let storeIndicator = {
            ID: product.store_Indicator_ID,
            Store_ID: store.storeID,
            Product_ID: product.productID,
            Causal_From_Date: product.causal_From_Date,
            Causal_To_Date: product.causal_To_Date,
            Core_Range_Indicator_ID: product.core_Range_Indicator_ID,
            Store_Range_Indicator_ID: product.store_Range_Indicator_ID
          }

          finalArr.push(storeIndicator);
        }
      }
    }

    finalArr.forEach(element1 => {
      let itemCount = 0;
      let itemFirstIndex = 0;

      finalArr.forEach((element2, idx) => {
        if (element1.ID == element2.ID) {
          itemCount++;
          itemFirstIndex = idx;
        }
      });

      if (itemCount == 2) {
        finalArr.splice(itemFirstIndex, 1);
      }
    });

    return finalArr
  }

  getTestImportCSV() {
    let finalArr = [];

    for (let i = 0; i < this.storeSales.length; i++) {
      let store = this.storeSales[i];
      for (let j = 0; j < store.salesData.length; j++) {
        let product = store.salesData[j];

        let storeIndicator = {
          Store_ID: store.storeID,
          Product_ID: product.productID,
          Store_Range_Indicator_ID: product.test_Range_Indicator_ID
        }

        finalArr.push(storeIndicator);
      }
    }

    return finalArr
  }

  getIndicatorsByCluster(clusterData, clusterType, clusterID) {
    let self = this;

    let stores = getStoresByCluster(clusterData, clusterType, clusterID);

    let retval = [];

    self.allRangeProducts.forEach(rp => {

      let currentProductIndicator = "";
      let allSame = true;

      self.storeSales.forEach(ss => {
        if (storeInCluster(ss.storeID, stores)) {
          ss.salesData.forEach(sdp => {
            if (sdp.productID === rp.productID) {
              if (currentProductIndicator === "") {
                currentProductIndicator = sdp.store_Range_Indicator;
              } else {
                if (sdp.store_Range_Indicator !== currentProductIndicator) {
                  allSame = false;
                }
              }
            }
          })
        }
      })

      if (allSame) {
        retval.push({
          productID: rp.productID,
          indicator: currentProductIndicator
        })
      } else {
        retval.push({
          productID: rp.productID,
          indicator: "SELECTED"
        })
      }
    })

    return retval;
  }

  getStoreCountByCluster(clusterType, clusterID) {
    return this.getStoresByCluster(clusterType, clusterID).length;
  }

  getStoresByCluster(clusterType, clusterID) {
    return getStoresByCluster(this.clusterData, clusterType, clusterID)
  }

  getStoresByProduct(productID) {
    return getStoresByProduct(this.storeSales, productID);
  }

  getStoresByProductAndCluster(productID, clusterType, clusterID) {
    return getStoresByProductAndCluster(this.storeSales, productID, this.clusterData, clusterType, clusterID);
  }

  setStoreIndicatorByProductID(stores, productID) {
    setStoreIndicatorByProductID(stores, this.storeSales, productID);
  }

  setTestStoreIndicatorByProductID(stores, productID) {
    setTestStoreIndicatorByProductID(stores, this.storeSales, productID);
  }

  getAllProducts() {
    return this.allRangeProducts;
  }

  getStoreSales() {
    return this.storeSales;
  }

  getAllProductID() {
    let productIDArr = [];

    this.allRangeProducts.forEach(product => {
      productIDArr.push(product.productID);
    });

    return productIDArr;
  }

  setIndicator(productID, indicator) {
    this.allRangeProducts.forEach(product => {
      if (product.productID == productID)
        product.store_Range_Indicator = indicator;
    });
  }

  setClusterIndicator(clusterType, clusterID, productID, indicator) {
    let stores = getStoresByCluster(this.clusterData, clusterType, clusterID);

    if (stores[0] == 1) {
      stores = [{
        storeID: clusterID
      }];
    }

    stores.forEach(store => {
      this.storeSales.forEach(storeSales => {
        if (store.storeID == storeSales.storeID) {

          let products = storeSales.salesData;

          products.forEach(product => {

            if (product.productID == productID) {

              switch (indicator) {
                case "YES": {
                  product.store_Range_Indicator = indicator;
                  product.store_Range_Indicator_ID = 2;
                  product["updated"] = true;
                }
                break;
              case "NO": {
                product.store_Range_Indicator = indicator;
                product.store_Range_Indicator_ID = 1;
                product["updated"] = true;
              }
              break;
              case "SELECT": {
                product.store_Range_Indicator = "SELECTED";
                product.store_Range_Indicator_ID = 3;
                product["updated"] = true;
              }
              break;
              }
            }
          })
        }
      });
    })
  }

  setTestClusterIndicator(clusterType, clusterID, productID, indicator) {
    let stores = getStoresByCluster(this.clusterData, clusterType, clusterID);

    if (stores[0] == 1) {
      stores = [{
        storeID: clusterID
      }];
    }

    stores.forEach(store => {
      this.storeSales.forEach(storeSales => {
        if (store.storeID == storeSales.storeID) {

          let products = storeSales.salesData;

          products.forEach(product => {

            if (product.productID == productID) {

              switch (indicator) {
                case "YES": {
                  product.test_Range_Indicator = indicator;
                  product.test_Range_Indicator_ID = 2;
                  product["updated"] = true;
                }
                break;
              case "NO": {
                product.test_Range_Indicator = indicator;
                product.test_Range_Indicator_ID = 1;
                product["updated"] = true;
              }
              break;
              case "SELECT": {
                product.test_Range_Indicator = "SELECTED";
                product.test_Range_Indicator_ID = 3;
                product["updated"] = true;
              }
              break;
              }
            }
          })
        }
      });
    })
  }

  getSalesDataByStore(storeID, autoRangeData) {
    let store = getStoreByID(storeID, this.storeSales);
    let sales = getSalesDataByStore(store, this.allRangeProducts, this.storeSales, this.totalsData, autoRangeData, this.endingStock, this.averageStock);
    return sales;
  }

  getSalesDataByCluster(clusterType, clusterID, autoRangeData) {
    let stores = getStoresByCluster(this.clusterData, clusterType, clusterID);

    let sales = getSalesDataByStores(stores, this.allRangeProducts, this.storeSales, this.clusterData, clusterType, clusterID, this.totalsData, autoRangeData, this.endingStock, this.averageStock);
    return sales;
  }

  getStoreIndicators(clusterType, clusterID) {
    let retval = {
      headers: [],
      data: []
    }

    let headersCreated = false;

    let stores = getStoresByCluster(this.clusterData, clusterType, clusterID);

    this.storeSales.forEach(ss => {
      if (storeInCluster(ss.storeID, stores)) {

        if (!headersCreated) {
          retval.headers.push({
            "headerName": "Product System ID",
            "field": "product_System_ID",
          }, {
            "headerName": "Barcode",
            "field": "barcode"
          }, {
            "headerName": "Description",
            "field": "description"
          })

          headersCreated = true
        }

        retval.headers.push({
          "headerName": ss.storeName,
          "field": ss.storeName,
          "isIndicator": true,
          "editable": true,
          "cellEditor": "agRichSelectCellEditor",
          "cellEditorParams": {
            "values": ["YES", "NO"]
          },
          "cellStyle": {
            "background-color": "#E3F2FD"
          },
          "filterParams": {
            "newRowsAction": "keep"
          }
        })
      }
    })

    this.allRangeProducts.forEach(arp => {
      let productIndicator = {
        product_System_ID: arp.product_System_ID,
        barcode: arp.barcode,
        description: arp.description,
        productID: arp.id
      }

      stores.forEach(store => {
        this.storeSales.forEach(ss => {
          if (store.storeID == ss.storeID) {
            ss.salesData.forEach(sd => {
              this.allRangeProducts.forEach(arp2 => {
                if (sd.productID == arp.productID) {
                  productIndicator[ss.storeName] = sd.store_Range_Indicator;
                  productIndicator[ss.storeName + "ID"] = sd.storeID;
                }
              })
            })
          }
        })
      })

      retval.data.push(productIndicator);
    })

    return retval;
  }

  setProductData(productID, property, newValue) {
    this.allRangeProducts.forEach(product => {
      if (product.productID == productID) {
        product[property] = newValue;
        product[property + "Dirty"] = true;
      }
    })
  }

  setAllProductData(el) {
    this.allRangeProducts.forEach(product => {
      if (product.productID == el.productID) {
        for (var prop in el) {
          if (prop != "useAlternateBarcode") {
            if (product[prop] != el[prop]) {
              product[prop + "Dirty"] = true;
              product[prop] = el[prop];
            }
          }
        }
      }
    })

    // setDefaultValuesIfNull();
  }

  getOosDaysStore(productID, storeID) {
    return getOosDaysStore(this.storeSales, productID, storeID);
  }

  calculateConstraints(min, max, autoRangeData, average_price, isNewItem) {
    return calculateConstraints(min, max, autoRangeData, average_price, isNewItem);
  }

  getStockUnitsStore(productID, storeID) {
    return getStockUnitsStore(this.endingStock, productID, storeID);
  }
}

export default RangingController;

function getStoreByID(storeID, storeSales) {
  let retval = null;

  storeSales.forEach(store => {
    if (store.storeID == storeID)
      retval = store;
  })

  return retval;
}

// Get all the stores that belong to a cluster
function getStoresByCluster(clusters, clusterType, clusterID) {
  let stores = [];

  if (clusterType == "stores") {
    stores = [1];
  } else {
    let clusterItems = clusters[clusterType + "Clusters"];

    for (let i = 0; i < clusterItems.length; i++) {
      let clusterItem = clusterItems[i];
      if (clusterItem.clusterID == clusterID)
        stores = clusterItem.clusterStores;
    }
  }

  return stores;
}

function getStoresByProductAndCluster(storeSales, productID, clusters, clusterType, clusterID) {
  let storeArr = [];

  let allStores = getStoresByCluster(clusters, clusterType, clusterID)

  storeSales.forEach(store => {
    if (IsClusterStore(allStores, store.storeID)) {
      store.salesData.forEach(product => {
        if (product.productID == productID) {
          if (product.store_Range_Indicator == "YES") {
            storeArr.push({
              storeID: store.storeID,
              storeName: store.storeName,
              selected: true
            })
          } else {
            storeArr.push({
              storeID: store.storeID,
              storeName: store.storeName,
              selected: false
            })
          }
        }
      })
    }
  })

  return storeArr;
}

function getNumericDistribution(storeSales, productID, clusters, clusterType, clusterID) {
  let stores = 0;

  let clusterStores = getStoresByCluster(clusters, clusterType, clusterID);

  storeSales.forEach(store => {
    if (storeInCluster(store.storeID, clusterStores)) {
      store.salesData.forEach(product => {
        if (product.productID == productID) {
          if (numberifySales(product.sales_Retail) > 0)
            stores++;
        }
      })
    }
  })

  return (stores / clusterStores.length) * 100;
}

function getWeightedDistribution(storeSales, productID, clusters, clusterType, clusterID) {
  let productSales = 0;
  let totalStoreSales = 0;

  let clusterStores = getStoresByCluster(clusters, clusterType, clusterID);

  storeSales.forEach(store => {
    if (storeInCluster(store.storeID, clusterStores)) {
      store.salesData.forEach(product => {
        totalStoreSales += numberifySales(product.sales_Retail);
        if (product.productID == productID) {
          if (numberifySales(product.sales_Retail) > 0) {
            store.salesData.forEach(product => {
              productSales += numberifySales(product.sales_Retail);
            })
          }
        }
      })
    }
  })

  return (productSales / totalStoreSales) * 100;
}

function getSalesContribution(storeSales, productID, clusters, clusterType, clusterID, totalsData) {
  let clusterStores = getStoresByCluster(clusters, clusterType, clusterID);
  let totalStoreSales = 0;
  let totalProducts = 0;

  // Get avg per store
  totalsData.forEach(store => {
    if (storeInCluster(store.store_ID, clusterStores)) {
      totalStoreSales += parseFloat(store.sales_Retail) / parseInt(store.items_In_Business);
    }
  })

  let avgProductSales = totalStoreSales;

  let productSales = 0;

  storeSales.forEach(store => {
    if (storeInCluster(store.storeID, clusterStores)) {
      store.salesData.forEach(product => {
        if (product.productID == productID) {
          productSales += parseFloat(product.sales_Retail);
        }
      })
    }
  })

  let contribution = productSales == 0 ? 0 : (productSales / avgProductSales) * 100;
  return contribution;
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

  storeSales.forEach(store => {
    if (store.storeID == storeID) {
      store.salesData.forEach(product => {
        if (product.productID == productID) {
          productSales += parseFloat(product.sales_Retail);
        }
      })
    }
  })

  let contribution = productSales == 0 ? 0 : (productSales / avgProductSales) * 100;
  return contribution;
}

function getUnitsContribution(storeSales, productID, clusters, clusterType, clusterID, totalsData) {
  let clusterStores = getStoresByCluster(clusters, clusterType, clusterID);
  let totalStoreUnits = 0;
  let totalUnits = 0;

  // Get avg per store
  totalsData.forEach(store => {
    if (storeInCluster(store.store_ID, clusterStores)) {
      totalStoreUnits += parseFloat(store.sales_Units);
      totalUnits += parseInt(store.items_In_Business) / clusterStores.length;
    }
  })

  let avgProductUnits = totalStoreUnits / totalUnits;
  let productUnits = 0;

  storeSales.forEach(store => {
    if (storeInCluster(store.storeID, clusterStores)) {
      store.salesData.forEach(product => {
        if (product.productID == productID) {
          productUnits += parseFloat(product.sales_Units);
        }
      })
    }
  })

  let contribution = productUnits == 0 ? 0 : (productUnits / avgProductUnits) * 100;
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

  storeSales.forEach(store => {
    if (store.storeID == storeID) {
      store.salesData.forEach(product => {
        if (product.productID == productID) {
          productUnits += parseFloat(product.sales_Units);
        }
      })
    }
  })

  let contribution = productUnits == 0 ? 0 : (productUnits / avgProductUnits) * 100;
  return contribution;
}

function getProfitContribution(storeSales, productID, clusters, clusterType, clusterID, totalsData) {
  let clusterStores = getStoresByCluster(clusters, clusterType, clusterID);
  let totalStoreProfit = 0;
  let totalProfit = 0;

  // Get avg per store
  totalsData.forEach(store => {
    if (storeInCluster(store.store_ID, clusterStores)) {
      totalStoreProfit += parseFloat(store.sales_Profit);
      totalProfit += parseInt(store.items_In_Business) / clusterStores.length;
    }
  })

  let avgProductProfit = totalStoreProfit / totalProfit;
  let productProfit = 0;

  storeSales.forEach(store => {
    if (storeInCluster(store.storeID, clusterStores)) {
      store.salesData.forEach(product => {
        if (product.productID == productID) {
          productProfit += parseFloat(product.sales_Profit);
        }
      })
    }
  })

  let contribution = productProfit == 0 ? 0 : (productProfit / avgProductProfit) * 100;
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

  storeSales.forEach(store => {
    if (store.storeID == storeID) {
      store.salesData.forEach(product => {
        if (product.productID == productID) {
          productProfit += parseFloat(product.sales_Profit);
        }
      })
    }
  })

  let contribution = productProfit == 0 ? 0 : (productProfit / avgProductProfit) * 100;
  return contribution;
}

function getDaysOfSupplyPerX(dos_units, clusters, clusterType, clusterID, volume_potential, autoRangeData) {
  let clusterStores = getStoresByCluster(clusters, clusterType, clusterID);
  let storeCount = clusterStores.length;
  let capacity = autoRangeData == undefined ? 6 : autoRangeData.dos_units;
  let other = volume_potential == 0 ? 0 : capacity / (volume_potential / storeCount) * 30 / storeCount;
  return other;
}

function getDaysOfSupplyFacings(clusters, clusterType, clusterID, volume_potential, depth) {
  let clusterStores = getStoresByCluster(clusters, clusterType, clusterID);
  let storeCount = clusterStores.length;
  let fdepth = parseFloat(depth);

  let capacity = autoRangeData == undefined ? 6 : autoRangeData.dos_units;

  let other = volume_potential == 0 ? 0 : capacity / (volume_potential / storeCount) * 30;

  return other;
}

function getDaysOfSupplyFacingsStore(storeID, volume_potential, depth, autoRangeData) {
  let storeCount = 1;

  let capacity = autoRangeData == undefined ? 6 : autoRangeData.dos_units;

  let other = volume_potential == 0 ? 0 : capacity / (volume_potential / storeCount) * 30;

  return other;
}

function getStockCost(stockData, productID, clusters, clusterType, clusterID) {
  let clusterStores = getStoresByCluster(clusters, clusterType, clusterID);

  let stockCost = 0;

  stockData.forEach(stockData => {
    if (IsClusterStore(clusterStores, stockData.store_ID)) {
      if (stockData.product_ID == productID) {
        stockCost += stockData.closingCost;
      }
    }
  })

  return stockCost;
}

function getStockCostStore(stockData, productID, storeID) {
  let stockCost = 0;

  stockData.forEach(stockData => {
    if (stockData.store_ID == storeID) {
      if (stockData.product_ID == productID) {
        stockCost += stockData.closingCost;
      }
    }
  })

  return stockCost;
}

function getStockUnits(stockData, productID, clusters, clusterType, clusterID) {
  let clusterStores = getStoresByCluster(clusters, clusterType, clusterID);

  let stockunits = 0;

  stockData.forEach(stockData => {
    if (IsClusterStore(clusterStores, stockData.store_ID)) {
      if (stockData.product_ID == productID) {
        stockunits += stockData.closingUnits;
      }
    }
  })

  return stockunits;
}

function getAverageStock(stockData, productID, clusters, clusterType, clusterID) {
  let clusterStores = getStoresByCluster(clusters, clusterType, clusterID);

  let stockunits = 0;

  stockData.forEach(stockData => {
    if (IsClusterStore(clusterStores, stockData.store_ID)) {
      if (stockData.product_ID == productID) {
        stockunits += stockData.closingCost;
      }
    }
  })

  return stockunits;
}

function getStockUnitsStore(stockData, productID, storeID) {
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

function getAverageStockStore(stockData, productID, storeID) {
  let stockUnits = 0;

  stockData.forEach(stockData => {
    if (stockData.store_ID == storeID) {
      if (stockData.product_ID == productID) {
        stockUnits += stockData.closingCost;
      }
    }
  })

  return stockUnits;
}

// Out Of Stock Days
function getOosDays(storeSales, productID, clusters, clusterType, clusterID) {
  let oosDays = 0;

  let clusterStores = getStoresByCluster(clusters, clusterType, clusterID);

  storeSales.forEach(store => {
    if (storeInCluster(store.storeID, clusterStores)) {
      store.salesData.forEach(product => {
        if (product.productID == productID) {
          if (numberifySales(product.ooS_Days) > 0)
            oosDays += numberifySales(product.ooS_Days);
        }
      })
    }
  })

  return {
    stores: clusterStores.length,
    oos_days: oosDays
  };
}

function getOosDaysStore(storeSales, productID, storeID) {
  let oosDays = 0;

  storeSales.forEach(store => {
    if (store.storeID == storeID) {
      store.salesData.forEach(product => {
        if (product.productID == productID) {
          if (numberifySales(product.ooS_Days) > 0) {
            oosDays += numberifySales(product.ooS_Days);
            console.log(product);
          }
        }
      })
    }
  })

  return oosDays;
}

function calculateLostSales(storeSales, productID, clusters, clusterType, clusterID) {
  let clusterStores = getStoresByCluster(clusters, clusterType, clusterID);
  let totalLostSales = 0;

  clusterStores.forEach(clusterStore => {
    let productSales = 0;
    let oosDays = 0;

    storeSales.forEach(store => {
      if (store.storeID == clusterStore.storeID) {
        store.salesData.forEach(product => {
          if (product.productID == productID) {
            if (parseFloat(product.sales_Retail) > 0) {
              productSales += parseFloat(product.sales_Retail);
            }

            if (numberifySales(product.ooS_Days) > 0) {
              oosDays += numberifySales(product.ooS_Days);
            }
          }
        })
      }
    })

    if (productSales > 0) {
      let days = 30 * 6;
      let lostSales = productSales / days * oosDays;
      totalLostSales += lostSales;
    }
  })

  return totalLostSales / clusterStores.length;
}

function calculateLostUnits(storeSales, productID, clusters, clusterType, clusterID) {
  let clusterStores = getStoresByCluster(clusters, clusterType, clusterID);
  let totalLostSales = 0;

  clusterStores.forEach(clusterStore => {
    let productUnits = 0;
    let oosDays = 0;

    storeSales.forEach(store => {
      if (store.storeID == clusterStore.storeID) {
        store.salesData.forEach(product => {
          if (product.productID == productID) {
            if (parseFloat(product.sales_Units) > 0) {
              productUnits += parseFloat(product.sales_Units);
            }

            if (numberifySales(product.ooS_Days) > 0) {
              oosDays += numberifySales(product.ooS_Days);
            }
          }
        })
      }
    })

    if (productUnits > 0) {
      let days = 30 * 6;
      let lostSales = productUnits / days * oosDays;
      totalLostSales += lostSales;
    }
  })

  return totalLostSales / clusterStores.length;
}

function calculateLostProfit(storeSales, productID, clusters, clusterType, clusterID) {
  let clusterStores = getStoresByCluster(clusters, clusterType, clusterID);
  let totalLostSales = 0;

  clusterStores.forEach(clusterStore => {
    let productProfit = 0;
    let oosDays = 0;

    storeSales.forEach(store => {
      if (store.storeID == clusterStore.storeID) {
        store.salesData.forEach(product => {
          if (product.productID == productID) {
            if (parseFloat(product.sales_Retail) > 0) {
              productProfit += parseFloat(product.sales_Retail) - parseFloat(product.sales_Cost);
            }

            if (numberifySales(product.ooS_Days) > 0) {
              oosDays += numberifySales(product.ooS_Days);
            }
          }
        })
      }
    })

    if (productProfit > 0) {
      let days = 30 * 6;
      let lostSales = productProfit / days * oosDays;
      totalLostSales += lostSales;
    }
  })

  return totalLostSales / clusterStores.length;
}

function calculateLostCost(storeSales, productID, clusters, clusterType, clusterID) {
  let clusterStores = getStoresByCluster(clusters, clusterType, clusterID);
  let totalLostSales = 0;

  clusterStores.forEach(clusterStore => {
    let productCost = 0;
    let oosDays = 0;

    storeSales.forEach(store => {
      if (store.storeID == clusterStore.storeID) {
        store.salesData.forEach(product => {
          if (product.productID == productID) {
            if (parseFloat(product.sales_Cost) > 0) {
              productCost += parseFloat(product.sales_Cost);
            }

            if (numberifySales(product.ooS_Days) > 0) {
              oosDays += numberifySales(product.ooS_Days);
            }
          }
        })
      }
    })

    if (productCost > 0) {
      let days = 30 * 6;
      let lostSales = productCost / days * oosDays;
      totalLostSales += lostSales;
    }
  })

  return totalLostSales / clusterStores.length;
}

function IsClusterStore(clusterStores, storeID) {
  let isClusterStore = false;

  clusterStores.forEach(store => {
    if (store.storeID == storeID)
      isClusterStore = true
  })

  return isClusterStore;
}

function getStoresByProduct(storeSales, productID) {
  let storeArr = [];

  storeSales.forEach(store => {
    store.salesData.forEach(product => {
      if (product.productID == productID) {
        if (product.store_Range_Indicator == "YES") {
          storeArr.push({
            storeID: store.storeID,
            storeName: store.storeName
          })
        }
      }
    })
  })

  return storeArr;
}

function GetStoreRanks(storeSales, storeID) {
  let retArr = [];

  storeSales[0].salesData.forEach(el => {
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

  storeSales.forEach(ss => {
    if (ss.storeID == storeID) {
      ss.salesData.forEach(sd => {
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
    }
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

function GetRanks(storeSales, clusters, clusterType, clusterID) {
  let stores = getStoresByCluster(clusters, clusterType, clusterID)

  let retArr = []

  storeSales[0].salesData.forEach(el => {
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

  storeSales.forEach(ss => {
    if (storeInCluster(ss.storeID, stores)) {
      ss.salesData.forEach(sd => {


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
    }
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

function getSalesDataByStore(store, allProducts, storeSales, totalsData, autoRangeData, endingStock, averageStock) {
  let sales = [];

  let salesArr = getStoreSalesByStoreID(storeSales, store.storeID);

  for (let i = 0; i < salesArr.length; i++) {
    const salesItem = salesArr[i];
    sales.push(salesItem);
  }

  let totalSales = getTotalStoreProductSales(allProducts, sales, storeSales, [store], store.storeID, totalsData, autoRangeData, endingStock, averageStock);
  return totalSales;
}

// Get all the sum of sales data by stores
function getSalesDataByStores(stores, allProducts, storeSales, clusters, clusterType, clusterID, totalsData, autoRangeData, endingStock, averageStock) {
  let sales = [];

  for (let i = 0; i < stores.length; i++) {
    let store = stores[i];
    let salesArr = getStoreSalesByStoreID(storeSales, store.storeID);

    for (let i = 0; i < salesArr.length; i++) {
      const salesItem = salesArr[i];
      sales.push(salesItem);
    }
  }

  let totalSales = getTotalProductSales(allProducts, sales, storeSales, stores, clusters, clusterType, clusterID, totalsData, autoRangeData, endingStock, averageStock);
  return totalSales;
}

// Get store product sales
function getStoreSalesByStoreID(storeSales, storeID) {
  let sales;

  for (let i = 0; i < storeSales.length; i++) {
    const store = storeSales[i];
    if (store.storeID == storeID)
      sales = store.salesData;
  }

  return sales;
}

function getTotalStoreProductSales(allProducts, sales, storeSales, stores, storeID, totalsData, autoRangeData, endingStock, averageStock) {
  let productSales = [];

  let totalSales = 0;

  storeSales.forEach(storeSale => {
    storeSale.salesData.forEach(product => {
      totalSales += numberifySales(product.sales_Retail);
    })
  })

  let tmp = GetStoreRanks(storeSales, storeID)

  for (let i = 0; i < allProducts.length; i++) {
    const product = allProducts[i];

    let sales_retail = 0;
    let sales_cost = 0;
    let sales_units = 0;
    let stock_cost = 0;
    let stock_units = 0;

    for (let j = 0; j < sales.length; j++) {
      const sale = sales[j];

      if (sale.productID == product.productID) {
        sales_retail += numberifySales(sale.sales_Retail)
        sales_cost += numberifySales(sale.sales_Cost)
        sales_units += numberifySales(sale.sales_Units)
        stock_cost += numberifySales(sale.stock_Cost);
        stock_units += numberifySales(sale.stock_Units);
      }
    };

    let use_adjuested = false;
    let arminumum_stock = 0;
    let armaximum_stock = 0;
    let aruse_seasonal_index = false;
    let arsurplus_stock = 0;
    let aruse_transaction_oos = false;

    if (autoRangeData != undefined && autoRangeData != null) {
      use_adjuested = autoRangeData.use_volume_adjusted;
      arminumum_stock = autoRangeData.minumum_stock;
      armaximum_stock = autoRangeData.maximum_stock;
      aruse_seasonal_index = autoRangeData.use_seasonal_index;
      arsurplus_stock = autoRangeData.surplus_stock;
      aruse_transaction_oos = autoRangeData.use_transactional_out_of_stock;
    }

    let calculated_oos_days = getOosDaysStore(storeSales, product.productID, storeID);

    let oosMonths = 6 - ((calculated_oos_days / (30 * 6)) * 6);

    if(!aruse_transaction_oos) {
      sales_units = (sales_units * 6) / oosMonths;
    }

    let lost_units = (parseFloat(sales_units * 6).toFixed(1) / ((30 * 6) - calculated_oos_days) * calculated_oos_days) / 6;
    let volume_adjusted = sales_units + lost_units;

    let volumeToUse = use_adjuested ? volume_adjusted : sales_units;

    let lost_sales = (parseFloat(sales_retail * 6).toFixed(0) / ((30 * 6) - calculated_oos_days) * calculated_oos_days) / 6;
    let lost_cost = (parseFloat(sales_cost * 6).toFixed(0) / ((30 * 6) - calculated_oos_days) * calculated_oos_days) / 6;

    let salesToUse = use_adjuested ? (lost_sales + sales_retail) : sales_retail;
    let costToUse = use_adjuested ? (lost_cost + sales_cost) : sales_cost;

    let sales_profit = salesToUse - costToUse;
    let lost_profit = (parseFloat(sales_profit * 6).toFixed(0) / ((30 * 6) - calculated_oos_days) * calculated_oos_days) / 6;

    // complex calculations;
    let selling_price = salesToUse / volume_adjusted;
    let cost_price = (salesToUse - sales_profit) / volume_adjusted;

    let number_distribution = 100;
    let weighted_distribution = 100;

    let sales_contribution = getSalesContributionStore(storeSales, product.productID, storeID, totalsData);
    let units_contribution = getUnitsContributionStore(storeSales, product.productID, storeID, totalsData);
    let profit_contribution = getProfitContributionStore(storeSales, product.productID, storeID, totalsData);

    let new_Stock_Cost = getStockCostStore(endingStock, product.productID, storeID);
    let new_Stock_Units = getStockUnitsStore(endingStock, product.productID, storeID);
    let average_Stock = getAverageStockStore(averageStock, product.productID, storeID);

    let oos_days = calculated_oos_days / 6;

    let average_cost = isNaN(costToUse / volume_adjusted) ? 0 : costToUse / volume_adjusted;
    let average_price = isNaN(salesToUse / volume_adjusted) ? 0 : salesToUse / volume_adjusted;

    let days_of_supply = 0;

    if (new_Stock_Units != 0 && volumeToUse != 0) {
      days_of_supply = isNaN(new_Stock_Units / volumeToUse * 30) ? 0 : new_Stock_Units / volumeToUse * 30;
    }

    let stock_turn = isNaN((sales_cost * 12) / average_Stock) ? 0 : (sales_cost * 12) / average_Stock;

    let gross_profit = ((selling_price - cost_price) / selling_price) * 100;
    let markup = ((selling_price - cost_price) / cost_price) * 100;

    let oneWeekStock = volumeToUse / 4;

    let minimum_Stock = oneWeekStock * arminumum_stock;
    let maximum_Stock = oneWeekStock * armaximum_stock;

    let inSeasonRatio = ((seasonalData.averageHigh - seasonalData.rangeVolume) / seasonalData.averageHigh);
    let outSeasonRatio = ((seasonalData.rangeVolume - seasonalData.averageLow) / seasonalData.rangeVolume);

    let seasonal_Minimum = (oneWeekStock + (inSeasonRatio * oneWeekStock)) * arminumum_stock;
    let seasonal_Maximum = (oneWeekStock + (inSeasonRatio * oneWeekStock)) * armaximum_stock;

    let seasonal_Minimum_Out = (oneWeekStock - (outSeasonRatio * oneWeekStock)) * arminumum_stock;
    let seasonal_Maximum_Out = (oneWeekStock - (outSeasonRatio * oneWeekStock)) * armaximum_stock;

    let surplusRequired = oneWeekStock * parseFloat(arsurplus_stock);
    let surplus_Stock = new_Stock_Units - surplusRequired;

    let casePackFix = (product.case_Pack_Qty == undefined || product.case_Pack_Qty == null || parseFloat(product.case_Pack_Qty) < 1) ? 1 : parseFloat(product.case_Pack_Qty);

    let isNewItem = product.active_Shop_Code_ID == '1';

    let _minMax = calculateConstraints(Math.round(minimum_Stock), Math.round(maximum_Stock), autoRangeData, average_price, isNewItem);
    let _minMaxIn = calculateConstraints(Math.round(seasonal_Minimum), Math.round(seasonal_Maximum), autoRangeData, average_price, isNewItem);
    let _minMaxOut = calculateConstraints(Math.round(seasonal_Minimum_Out), Math.round(seasonal_Maximum_Out), autoRangeData, average_price, isNewItem);

    let case_Pack_Qty_Exceeded = 0;

    if (casePackFix > 1) {
      let min = aruse_seasonal_index ? seasonal_Minimum_Out : minimum_Stock;
      let max = aruse_seasonal_index ? seasonal_Minimum : maximum_Stock;

      if (max > 0) {
        let minMaxDiff = min - 1;

        let casePackExceeds = minMaxDiff + casePackFix;

        if (casePackExceeds > max) {
          let exceedsByDiff = casePackExceeds - max;
          case_Pack_Qty_Exceeded = exceedsByDiff;
        }
      }
    }

    if (surplus_Stock < 0) {
      surplus_Stock = 0;
    }

    let sales_potential = 0;
    let volume_potential = 0;
    let profit_potential = 0;
    let item_sales_rank = 0;
    let item_volume_rank = 0;
    let item_profit_rank = 0;
    let sales_potential_rank = 0;
    let volume_potential_rank = 0;
    let profit_potential_rank = 0;

    tmp.forEach(t => {
      if (product.productID == t.productID) {
        item_sales_rank = t.itemSalesRank
        item_volume_rank = t.itemVolumeRank
        item_profit_rank = t.itemProfitRank
      }
    })

    // if (weighted_distribution != 0 && sales_retail != 0)
    //   // (sales_potential = sales_retail / weighted_distribution * 100).toFixed(0);

    // if (weighted_distribution != 0 && sales_units != 0)
    //   // (volume_potential = sales_units / weighted_distribution * 100).toFixed(0);

    // if (weighted_distribution != 0 && sales_units != 0)
    //   // (profit_potential = sales_profit / weighted_distribution * 100).toFixed(0);

    let dos_fac = getDaysOfSupplyFacingsStore(storeID, sales_units, product.depth, autoRangeData);

    productSales.push(new RangeProduct(product, {
      sales_retail: parseFloat((salesToUse).toFixed(0)),
      sales_cost: parseFloat((costToUse).toFixed(0)),
      sales_units: parseFloat((volumeToUse).toFixed(1)),
      sales_profit: parseFloat((sales_profit).toFixed(0)),
      stock_units: parseFloat(new_Stock_Units.toFixed(0)),
      stock_cost: parseFloat(new_Stock_Cost.toFixed(0)),
      oos_days: parseFloat(oos_days.toFixed(0)),
      lost_sales: parseFloat(lost_sales.toFixed(0)),
      lost_units: parseFloat(lost_units.toFixed(1)),
      lost_profit: parseFloat(lost_profit.toFixed(0)),
      lost_cost: parseFloat(lost_cost.toFixed(0)),
      average_cost: parseFloat(average_cost.toFixed(2)),
      average_price: parseFloat(average_price.toFixed(2)),
      average_stock: parseFloat(average_Stock.toFixed(0)),
      days_of_supply: parseFloat(days_of_supply.toFixed(0)),
      stock_turn: parseFloat(stock_turn.toFixed(0)),
      number_distribution: number_distribution.toFixed(0),
      weighted_distribution: weighted_distribution.toFixed(0),
      sales_potential: parseFloat(sales_potential.toFixed(0)),
      volume_potential: Math.round(parseFloat(volume_potential.toFixed(0))),
      profit_potential: parseFloat(profit_potential.toFixed(0)),
      item_sales_rank: item_sales_rank,
      item_volume_rank: item_volume_rank,
      item_profit_rank: item_profit_rank,
      sales_potential_rank: sales_potential_rank,
      volume_potential_rank: volume_potential_rank,
      profit_potential_rank: profit_potential_rank,
      dos_fac: dos_fac.toFixed(0),
      gross_profit: parseFloat(gross_profit.toFixed(0)),
      markup: markup.toFixed(0),
      sales_contribution: parseFloat(sales_contribution.toFixed(0)),
      units_contribution: parseFloat(units_contribution.toFixed(0)),
      profit_contribution: parseFloat(profit_contribution.toFixed(0)),
      minimum_Stock: parseFloat(minimum_Stock.toFixed(0)),
      maximum_Stock: parseFloat(maximum_Stock.toFixed(0)),
      seasonal_Minimum: parseFloat(seasonal_Minimum.toFixed(0)),
      seasonal_Maximum: parseFloat(seasonal_Maximum.toFixed(0)),
      seasonal_Minimum_Out: parseFloat(seasonal_Minimum_Out.toFixed(0)),
      seasonal_Maximum_Out: parseFloat(seasonal_Maximum_Out.toFixed(0)),
      surplus_Stock: parseFloat(surplus_Stock.toFixed(0)),
      case_Pack_Qty_Exceeded: parseFloat(case_Pack_Qty_Exceeded.toFixed(0)),
      constraintMinMax: _minMax,
      constraintMinMaxIn: _minMaxIn,
      constraintMinMaxOut: _minMaxOut,
    }, getProductIndicator(product.productID, storeSales, stores), getTestProductIndicator(product.productID, storeSales, stores)))
  }

  productSales.sort((a, b) => (parseFloat(a.sales_potential) > parseFloat(b.sales_potential)) ? 1 : ((parseFloat(b.sales_potential) > parseFloat(a.sales_potential)) ? -1 : 0));
  for (let index = 0; index < productSales.length; index++) {
    const element = productSales[index];
    element.sales_potential_rank = productSales.length - index
  }

  productSales.sort((a, b) => (parseFloat(a.volume_potential) > parseFloat(b.volume_potential)) ? 1 : ((parseFloat(b.volume_potential) > parseFloat(a.volume_potential)) ? -1 : 0));
  for (let index = 0; index < productSales.length; index++) {
    const element = productSales[index];
    element.volume_potential_rank = productSales.length - index
  }

  return productSales;
}

function storeInCluster(storeID, clusterStores) {
  let inCluster = false;

  clusterStores.forEach(store => {
    if (store.storeID == storeID)
      inCluster = true;
  })

  return inCluster;
}

// Get total product sales
function getTotalProductSales(allProducts, sales, storeSales, stores, clusters, clusterType, clusterID, totalsData, autoRangeData, endingStock, averageStock) {
  let productSales = [];

  let totalSales = 0;

  let clusterStores = getStoresByCluster(clusters, clusterType, clusterID);

  storeSales.forEach(storeSale => {
    storeSale.salesData.forEach(product => {
      totalSales += numberifySales(product.sales_Retail);
    })
  })

  let tmp = GetRanks(storeSales, clusters, clusterType, clusterID)

  for (let i = 0; i < allProducts.length; i++) {
    const product = allProducts[i];

    let sales_retail = 0;
    let sales_cost = 0;
    let sales_units = 0;

    for (let j = 0; j < sales.length; j++) {
      const sale = sales[j];

      if (sale.productID == product.productID) {
        sales_retail += numberifySales(sale.sales_Retail)
        sales_cost += numberifySales(sale.sales_Cost)
        sales_units += numberifySales(sale.sales_Units)
      }
    };

    let use_adjuested = false;
    let arminumum_stock = 0;
    let armaximum_stock = 0;
    let aruse_seasonal_index = false;
    let arsurplus_stock = 0;
    let aruse_transaction_oos = false;

    if (autoRangeData != undefined && autoRangeData != null) {
      use_adjuested = autoRangeData.use_volume_adjusted;
      arminumum_stock = autoRangeData.minumum_stock;
      armaximum_stock = autoRangeData.maximum_stock;
      aruse_seasonal_index = autoRangeData.use_seasonal_index;
      arsurplus_stock = autoRangeData.surplus_stock;
      aruse_transaction_oos = autoRangeData.use_transactional_out_of_stock;
    }

    let calculated_oos_days = getOosDays(storeSales, product.productID, clusters, clusterType, clusterID);

    let oosMonths = ((6 * clusterStores.length) - ((calculated_oos_days.oos_days / (clusterStores.length * (30 * 6))) * (6 * clusterStores.length)) / clusterStores.length) / clusterStores.length;

    if(!aruse_transaction_oos) {
      sales_units = (sales_units * 6) / oosMonths;
    }

    let lost_units = (parseFloat(sales_units * 6).toFixed(1) / ((30 * 6) - (calculated_oos_days.oos_days / clusterStores.length)) * (calculated_oos_days.oos_days / clusterStores.length)) / 6;
    let volume_adjusted = sales_units + lost_units;

    let volumeToUse = use_adjuested ? volume_adjusted : sales_units;

    let lost_sales = (parseFloat(sales_retail * 6).toFixed(0) / ((30 * 6) - (calculated_oos_days.oos_days / clusterStores.length)) * (calculated_oos_days.oos_days / clusterStores.length)) / 6;
    let lost_cost = (parseFloat(sales_cost * 6).toFixed(0) / ((30 * 6) - (calculated_oos_days.oos_days / clusterStores.length)) * (calculated_oos_days.oos_days / clusterStores.length)) / 6;

    let salesToUse = use_adjuested ? (lost_sales + sales_retail) : sales_retail;
    let costToUse = use_adjuested ? (lost_cost + sales_cost) : sales_cost;

    let sales_profit = salesToUse - costToUse;
    let lost_profit = (parseFloat(sales_profit * 6).toFixed(0) / ((30 * 6) - (calculated_oos_days.oos_days / clusterStores.length)) * (calculated_oos_days.oos_days / clusterStores.length)) / 6 / clusterStores.length;

    // complex calculations;
    let selling_price = salesToUse / volumeToUse;
    let cost_price = (salesToUse - sales_profit) / volumeToUse;

    let gross_profit = ((selling_price - cost_price) / selling_price) * 100;
    let markup = ((selling_price - cost_price) / cost_price) * 100;

    let number_distribution = getNumericDistribution(storeSales, product.productID, clusters, clusterType, clusterID);
    let weighted_distribution = getWeightedDistribution(storeSales, product.productID, clusters, clusterType, clusterID);
    let sales_contribution = getSalesContribution(storeSales, product.productID, clusters, clusterType, clusterID, totalsData);
    let units_contribution = getUnitsContribution(storeSales, product.productID, clusters, clusterType, clusterID, totalsData);
    let profit_contribution = getProfitContribution(storeSales, product.productID, clusters, clusterType, clusterID, totalsData);

    let new_Stock_Cost = getStockCost(averageStock, product.productID, clusters, clusterType, clusterID);
    let new_Stock_Units = getStockUnits(averageStock, product.productID, clusters, clusterType, clusterID);
    let average_Stock = getAverageStock(averageStock, product.productID, clusters, clusterType, clusterID);

    let oos_days = calculated_oos_days.oos_days / calculated_oos_days.stores /  6;

    let average_cost = isNaN(costToUse / volumeToUse) ? 0 : costToUse / volumeToUse;
    let average_price = isNaN(salesToUse / volumeToUse) ? 0 : salesToUse / volumeToUse;

    let days_of_supply = 0;

    if (new_Stock_Units != 0 && volumeToUse != 0) {
      days_of_supply = isNaN(new_Stock_Units / volumeToUse * 30) ? 0 : new_Stock_Units / volumeToUse * 30;
    }

    let stock_turn = isNaN((sales_cost * 12) / average_Stock) ? 0 : (sales_cost * 12) / average_Stock;

    let totalDays = 30 * 6 * clusterStores.length;
    let numberOfStores = clusterStores.length;

    let oneWeekStock = volumeToUse / 4;

    let minimum_Stock = oneWeekStock * arminumum_stock;
    let maximum_Stock = oneWeekStock * armaximum_stock;

    let inSeasonRatio = ((seasonalData.averageHigh - seasonalData.rangeVolume) / seasonalData.averageHigh);
    let outSeasonRatio = ((seasonalData.rangeVolume - seasonalData.averageLow) / seasonalData.rangeVolume);

    let seasonal_Minimum = (oneWeekStock + (inSeasonRatio * oneWeekStock)) * arminumum_stock;
    let seasonal_Maximum = (oneWeekStock + (inSeasonRatio * oneWeekStock)) * armaximum_stock;

    let seasonal_Minimum_Out = (oneWeekStock - (outSeasonRatio * oneWeekStock)) * arminumum_stock;
    let seasonal_Maximum_Out = (oneWeekStock - (outSeasonRatio * oneWeekStock)) * armaximum_stock;

    // Do min max calcs
    let min = aruse_seasonal_index ? seasonal_Minimum_Out : minimum_Stock;
    let max = aruse_seasonal_index ? seasonal_Minimum : maximum_Stock;

    let isNewItem = product.active_Shop_Code_ID == '1';

    let _minMax = calculateConstraints(Math.round(minimum_Stock), Math.round(maximum_Stock), autoRangeData, average_price, isNewItem);
    let _minMaxIn = calculateConstraints(Math.round(seasonal_Minimum), Math.round(seasonal_Maximum), autoRangeData, average_price, isNewItem);
    let _minMaxOut = calculateConstraints(Math.round(seasonal_Minimum_Out), Math.round(seasonal_Maximum_Out), autoRangeData, average_price, isNewItem);

    let surplusRequired = oneWeekStock * parseFloat(arsurplus_stock);
    let surplus_Stock = new_Stock_Units - surplusRequired;

    let casePackFix = (product.case_Pack_Qty == undefined || product.case_Pack_Qty == null || parseFloat(product.case_Pack_Qty) < 1) ? 1 : parseFloat(product.case_Pack_Qty);

    let case_Pack_Qty_Exceeded = 0;

    if (casePackFix > 1) {

      if (max > 0) {
        let minMaxDiff = min - 1;

        let casePackExceeds = minMaxDiff + casePackFix;

        if (casePackExceeds > max) {
          let exceedsByDiff = casePackExceeds - max;
          case_Pack_Qty_Exceeded = exceedsByDiff;
        }
      }
    }

    if (surplus_Stock < 0) {
      surplus_Stock = 0;
    }

    let sales_potential = 0;
    let volume_potential = 0;
    let profit_potential = 0;
    let cost_potential = 0;
    let item_sales_rank = 0
    let item_volume_rank = 0
    let item_profit_rank = 0
    let sales_potential_rank = 0
    let volume_potential_rank = 0
    let profit_potential_rank = 0

    tmp.forEach(t => {
      if (product.productID == t.productID) {
        item_sales_rank = t.itemSalesRank
        item_volume_rank = t.itemVolumeRank
        item_profit_rank = t.itemProfitRank
      }
    })

    if (weighted_distribution != 0 && salesToUse != 0)
      (sales_potential = salesToUse / weighted_distribution * 100).toFixed(0);

    if (weighted_distribution != 0 && sales_units != 0)
      (volume_potential = volumeToUse / weighted_distribution * 100).toFixed(0);

    if (weighted_distribution != 0 && sales_units != 0)
      (profit_potential = sales_profit / weighted_distribution * 100).toFixed(0);

    if (weighted_distribution != 0 && sales_units != 0)
      (cost_potential = costToUse / weighted_distribution * 100).toFixed(0);

    // dos_fac = getDaysOfSupplyFacings(clusters, clusterType, clusterID, volume_potential, product.depth)
    let dos_fac = (autoRangeData == undefined || autoRangeData == null) ? 0 : getDaysOfSupplyPerX(autoRangeData.dos_units, clusters, clusterType, clusterID, volume_potential, autoRangeData)

    productSales.push(new RangeProduct(product, {
      sales_retail: parseFloat((salesToUse).toFixed(0)),
      sales_cost: parseFloat((costToUse).toFixed(0)),
      sales_units: parseFloat((volumeToUse).toFixed(1)),
      sales_profit: parseFloat((sales_profit).toFixed(0)),
      stock_units: parseFloat(new_Stock_Units.toFixed(0)),
      stock_cost: parseFloat(new_Stock_Cost.toFixed(0)),
      oos_days: parseFloat(oos_days.toFixed(0)),
      lost_sales: parseFloat(lost_sales.toFixed(0)),
      lost_units: parseFloat(lost_units.toFixed(1)),
      lost_profit: parseFloat(lost_profit.toFixed(0)),
      lost_cost: parseFloat(lost_cost.toFixed(0)),
      average_cost: parseFloat(average_cost.toFixed(0)),
      average_price: parseFloat(average_price.toFixed(0)),
      average_stock: parseFloat(average_Stock.toFixed(0)),
      days_of_supply: parseFloat(days_of_supply.toFixed(0)),
      stock_turn: parseFloat(stock_turn.toFixed(0)),
      number_distribution: number_distribution.toFixed(0),
      weighted_distribution: weighted_distribution.toFixed(0),
      sales_potential: parseFloat(sales_potential.toFixed(0)),
      volume_potential: Math.round(parseFloat(volume_potential.toFixed(0))),
      profit_potential: parseFloat(profit_potential.toFixed(0)),
      cost_potential: parseFloat(cost_potential.toFixed(0)),
      item_sales_rank: item_sales_rank,
      item_volume_rank: item_volume_rank,
      item_profit_rank: item_profit_rank,
      sales_potential_rank: sales_potential_rank,
      volume_potential_rank: volume_potential_rank,
      profit_potential_rank: profit_potential_rank,
      dos_fac: dos_fac.toFixed(0),
      gross_profit: parseFloat(gross_profit.toFixed(0)),
      markup: markup.toFixed(0),
      sales_contribution: parseFloat(sales_contribution.toFixed(0)),
      units_contribution: parseFloat(units_contribution.toFixed(0)),
      profit_contribution: parseFloat(profit_contribution.toFixed(0)),
      minimum_Stock: parseFloat(minimum_Stock.toFixed(0)),
      maximum_Stock: parseFloat(maximum_Stock.toFixed(0)),
      seasonal_Minimum: parseFloat(seasonal_Minimum.toFixed(0)),
      seasonal_Maximum: parseFloat(seasonal_Maximum.toFixed(0)),
      seasonal_Minimum_Out: parseFloat(seasonal_Minimum_Out.toFixed(0)),
      seasonal_Maximum_Out: parseFloat(seasonal_Maximum_Out.toFixed(0)),
      surplus_Stock: parseFloat(surplus_Stock.toFixed(0)),
      case_Pack_Qty_Exceeded: parseFloat(case_Pack_Qty_Exceeded.toFixed(0)),
      constraintMinMax: _minMax,
      constraintMinMaxIn: _minMaxIn,
      constraintMinMaxOut: _minMaxOut,
    }, getProductIndicator(product.productID, storeSales, stores), getTestProductIndicator(product.productID, storeSales, stores)))
  }

  productSales.sort((a, b) => (parseFloat(a.sales_potential) > parseFloat(b.sales_potential)) ? 1 : ((parseFloat(b.sales_potential) > parseFloat(a.sales_potential)) ? -1 : 0));
  for (let index = 0; index < productSales.length; index++) {
    const element = productSales[index];
    element.sales_potential_rank = productSales.length - index
  }

  productSales.sort((a, b) => (parseFloat(a.volume_potential) > parseFloat(b.volume_potential)) ? 1 : ((parseFloat(b.volume_potential) > parseFloat(a.volume_potential)) ? -1 : 0));
  for (let index = 0; index < productSales.length; index++) {
    const element = productSales[index];
    element.volume_potential_rank = productSales.length - index
  }

  productSales.sort((a, b) => (parseFloat(a.profit_potential) > parseFloat(b.profit_potential)) ? 1 : ((parseFloat(b.profit_potential) > parseFloat(a.profit_potential)) ? -1 : 0));
  for (let index = 0; index < productSales.length; index++) {
    const element = productSales[index];
    element.profit_potential_rank = productSales.length - index
  }

  return productSales;
}

function calculateConstraints(min, max, autoRangeData, average_price, isNewItem) {
  let retval = {
    min: min,
    max: max,
    minUpdated: false,
    maxUpdated: false,
  }

  if (autoRangeData != undefined && autoRangeData != null) {
    // DEFAULT MINIMUM UNITS
    if (min <= autoRangeData.default_minimum) {
      retval.minUpdated = retval.min < autoRangeData.default_minimum ? true : false;
      retval.min = retval.min < autoRangeData.default_minimum ? autoRangeData.default_minimum : retval.min;

      retval.maxUpdated = retval.max != autoRangeData.default_minimum_max ? true : false;
      retval.max = retval.max != autoRangeData.default_minimum_max ? autoRangeData.default_minimum_max : retval.max;

      if (average_price < autoRangeData.default_price_minimum) {
        retval.minUpdated = retval.min >= autoRangeData.default_price_minimum_min ? false : true;
        retval.maxUpdated = retval.max >= autoRangeData.default_price_minimum_max ? false : true;
        retval.min = retval.min > autoRangeData.default_price_minimum_min ? retval.min : autoRangeData.default_price_minimum_min;
        retval.max = retval.max > autoRangeData.default_price_minimum_max ? retval.max : autoRangeData.default_price_minimum_max;
      }
    } else {
      // DEFAULT MINIMUM UNITS GREATER
      if (min >= autoRangeData.default_minimum_greater && min <= autoRangeData.default_minimum_greater_max) {
        retval.maxUpdated = retval.max > autoRangeData.default_minimum_greater_max ? false : true;
        retval.max = retval.max > autoRangeData.default_minimum_greater_max ? retval.max : autoRangeData.default_minimum_greater_max;
      } else {
        // DEFAULT NEW ITEM

        if (isNewItem && min <= autoRangeData.default_new_item_max) {
          retval.maxUpdated = true;
        }

        // DEFAULT PRICE MINIMUM
        if (average_price < autoRangeData.default_price_minimum) {
          retval.minUpdated = retval.min >= autoRangeData.default_price_minimum_min ? false : true;
          retval.maxUpdated = retval.max >= autoRangeData.default_price_minimum_max ? false : true;
          retval.min = retval.min > autoRangeData.default_price_minimum_min ? retval.min : autoRangeData.default_price_minimum_min;
          retval.max = retval.max > autoRangeData.default_price_minimum_max ? retval.max : autoRangeData.default_price_minimum_max;
        }
      }
    }
  }

  return retval;
}

function setStoreIndicatorByProductID(stores, storeSales, productID) {

  stores.forEach(store => {
    storeSales.forEach(storeSale => {
      if (store.storeID == storeSale.storeID) {
        storeSale.salesData.forEach(product => {
          if (product.productID == productID) {
            if (store.selected) {
              product.store_Range_Indicator = "YES"
              product.store_Range_Indicator_ID = 2;
              product["updated"] = true;
            } else {
              product.store_Range_Indicator = "NO"
              product.store_Range_Indicator_ID = 1;
              product["updated"] = true;
            }
          }
        })
      }
    })
  })
}

function setTestStoreIndicatorByProductID(stores, storeSales, productID) {

  stores.forEach(store => {
    storeSales.forEach(storeSale => {
      if (store.storeID == storeSale.storeID) {
        storeSale.salesData.forEach(product => {
          if (product.productID == productID) {
            if (store.selected) {
              product.test_Range_Indicator = "YES"
              product.test_Range_Indicator_ID = 2;
            } else {
              product.test_Range_Indicator = "NO"
              product.test_Range_Indicator_ID = 1;
            }
          }
        })
      }
    })
  })
}

function getProductIndicator(productID, storeSales, stores) {
  let indicator = "NO";
  let indicatorComparer = "";
  let select = true;

  for (let i = 0; i < storeSales.length; i++) {
    let storeSale = storeSales[i];

    if (storeInCluster(storeSale.storeID, stores)) {
      // Check to see if select
      for (let j = 0; j < storeSale.salesData.length; j++) {
        const saleItem = storeSale.salesData[j];
        if (saleItem.productID == productID) {
          if (saleItem.store_Range_Indicator != "SELECTED")
            select = false;
        }
      }

      if (!select) {
        for (let j = 0; j < storeSale.salesData.length; j++) {
          if (indicator != "SELECTED") {
            const saleItem = storeSale.salesData[j];
            if (saleItem.productID == productID) {

              let sri = saleItem.store_Range_Indicator;

              if (indicatorComparer == "") {
                indicatorComparer = sri;
                indicator = sri;
              } else {

                if (indicatorComparer != sri) {
                  indicator = "SELECTED"
                }
              }
            }
          }
        }
      } else {
        indicator = "SELECT";
      }
    }
  }

  return indicator;
}

function getTestProductIndicator(productID, storeSales, stores) {
  let indicator = "NO";
  let indicatorComparer = "";
  let select = true;

  for (let i = 0; i < storeSales.length; i++) {
    let storeSale = storeSales[i];

    if (storeInCluster(storeSale.storeID, stores)) {
      // Check to see if select
      for (let j = 0; j < storeSale.salesData.length; j++) {
        const saleItem = storeSale.salesData[j];
        if (saleItem.productID == productID) {
          if (saleItem.test_Range_Indicator != "SELECTED")
            select = false;
        }
      }

      if (!select) {
        for (let j = 0; j < storeSale.salesData.length; j++) {
          if (indicator != "SELECTED") {
            const saleItem = storeSale.salesData[j];
            if (saleItem.productID == productID) {

              let sri = saleItem.test_Range_Indicator;

              if (indicatorComparer == "") {
                indicatorComparer = sri;
                indicator = sri;
              } else {

                if (indicatorComparer != sri) {
                  indicator = "SELECTED"
                }
              }
            }
          }
        }
      } else {
        indicator = "SELECT";
      }
    }
  }

  return indicator;
}

// Helper function to format numbers
function numberifySales(string) {
  return parseFloat(string);
}

// Class for range product
function RangeProduct(productData, salesData, indicator, testIndicator) {
  let self = this;

  for (var prop in productData) {
    self[prop] = productData[prop]
  }

  // self.height = parseInt(productData.height);
  // self.width = parseInt(productData.width);
  // self.depth = parseInt(productData.depth);
  self.sales_Retail = salesData.sales_retail;
  self.sales_Cost = salesData.sales_cost;
  self.sales_Units = salesData.sales_units;
  self.sales_Profit = salesData.sales_profit;
  self.stock_Cost = salesData.stock_cost;
  self.stock_Units = salesData.stock_units;
  self.oos_Days = salesData.oos_days;
  self.lost_Sales = salesData.lost_sales;
  self.lost_Units = salesData.lost_units;
  self.lost_Profit = salesData.lost_profit;
  self.lost_Cost = salesData.lost_cost;
  self.average_cost = salesData.average_cost;
  self.average_price = salesData.average_price;
  self.average_stock = salesData.average_stock;
  self.days_of_supply = salesData.days_of_supply;
  self.stock_turn = salesData.stock_turn;
  self.number_Distribution = salesData.number_distribution + " %";
  self.weighted_Distribution = salesData.weighted_distribution + " %";
  self.sales_potential = salesData.sales_potential;
  self.volume_potential = salesData.volume_potential;
  self.profit_potential = salesData.profit_potential;
  self.cost_potential = salesData.cost_potential;
  self.profit_potential_rank = salesData.profit_potential_rank;
  self.item_volume_rank = salesData.item_volume_rank;
  self.item_sales_rank = salesData.item_sales_rank;
  self.item_profit_rank = salesData.item_profit_rank;
  self.dos_fac = salesData.dos_fac;
  self.gross_profit = (isNaN(salesData.gross_profit) ? 0 : salesData.gross_profit) + "%";
  self.markup = (isNaN(salesData.markup) ? 0 : salesData.markup) + "%";
  self.store_Range_Indicator = indicator;
  self.sales_contribution = salesData.sales_contribution;
  self.units_contribution = salesData.units_contribution;
  self.profit_contribution = salesData.profit_contribution;
  self.autoRangeItem = false;
  self.autoRangeOneItem = false;
  self.alt_Store_Range_Indicator = "";
  self.alt_Store_Range_Indicator_ID = null;
  self.test_Range_Indicator = testIndicator;
  // Product Supply Fields
  self.minimum_Stock = salesData.minimum_Stock;
  self.maximum_Stock = salesData.maximum_Stock;
  self.seasonal_Minimum = salesData.seasonal_Minimum;
  self.seasonal_Maximum = salesData.seasonal_Maximum;
  self.seasonal_Minimum_Out = salesData.seasonal_Minimum_Out;
  self.seasonal_Maximum_Out = salesData.seasonal_Maximum_Out;
  self.surplus_Stock = salesData.surplus_Stock;
  self.case_Pack_Qty_Exceeded = salesData.case_Pack_Qty_Exceeded;
  self.constraintMinMax = salesData.constraintMinMax;
  self.constraintMinMaxIn = salesData.constraintMinMaxIn;
  self.constraintMinMaxOut = salesData.constraintMinMaxOut;
}

function storeStocksProduct(storeSales, storeID, productID) {
  let storeStocksProduct = false;

  storeSales.forEach(storeSale => {
    if (storeSale.storeID == storeID) {
      storeSale.salesData.forEach(sale => {
        if (sale.productID == productID && sale.store_Range_Indicator == "YES")
          storeStocksProduct = true;
      })
    }
  })

  return storeStocksProduct;
}