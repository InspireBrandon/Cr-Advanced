<template>
    <v-card>
        <v-card-text>
            <v-btn @click="startAutomation">Start Automation</v-btn>
            <div v-if="currentFile != null">
                <div>Current File: {{ currentFile.name }}</div>
                <div>Current busy: {{ currentMethod }}</div>
                <div>Total Time: {{ formattedTotalTime }} Minutes</div>
                <div>Average time per file: {{ (totalSeconds / currentIndex).toFixed(0) }} Seconds</div>
            </div>
            <div style="height: 40px;"></div>File Download Progress:
            <v-progress-linear :value="fileProgress" style="width: 300px;"></v-progress-linear>Total Progress:
            <v-progress-linear :value="totalProgress" style="width: 300px;"></v-progress-linear>
        </v-card-text>
    </v-card>
</template>

<script>
    import Axios from "axios";
    import controller from "./controller.js";
    import moment from 'moment';

    let seasonalData = {
        average: 0,
        averageHigh: 0,
        averageLow: 0,
        rangeVolume: 0,
        currentOverSeasonalAverage: 0,
        seasonalPercent: 0,
        inSeason: true
    };

    let interval;

    // Method Arrays
    const refreshRange = ['updateStoreIndicators', 'updateProductDetails', 'refreshRange', 'saveRange'];
    const refreshRange2 = ['refreshRange', 'saveRange'];

    // THESE 2
    const productSupply = ['setUpAutorange', 'exportProductSupply'];
    const testIndicators = ['setUpAutorange', 'setTestIndicators', 'saveRange'];

    export default {
        name: "range-automation",
        data() {
            return {
                errorFiles: [],
                storesToUpdate: [124524],
                rangeFiles: [],
                currentIndex: 0,
                currentFile: null,
                fileData: null,
                fileProgress: 0,
                totalProgress: 0,
                currentMethod: "",
                currentMethodIndex: 0,
                selectedMethods: testIndicators,
                planogramRoles: [],
                autoRangeConfigs: [],
                roleConfig: null,
                roleID: null,
                totalSeconds: 0,
                totalElapsedTime: 0,
                formattedTotalTime: null,
            };
        },
        mounted() {
            let self = this;
            self.getPlanogramRoles();
            self.getRoleConfigs();
        },
        methods: {
            getPlanogramRoles() {
                let self = this;

                Axios.defaults.headers.common["TenantID"] =
                    sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + "PlanogramCategoryRole/Report")
                    .then(r => {
                        self.planogramRoles = r.data;
                    })
            },
            getRoleConfigs() {
                let self = this;

                Axios.defaults.headers.common["TenantID"] =
                    sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + "AutoRangeConfig")
                    .then(r => {
                        self.autoRangeConfigs = r.data;
                    })
            },
            getStores() {
                let self = this;
            },
            // Helper Methods
            getRoleConfigByPlanogram(planogramID) {
                let self = this;
                let role;

                if (self.fileData.tag.includes(" - CATEGORY")) {
                    role = self.planogramRoles.find(e => {
                        return e.categoryID == planogramID;
                    });
                } else {
                    role = self.planogramRoles.find(e => {
                        return e.planogramID == planogramID;
                    });
                }

                if (role == null) {
                    self.errorFiles.push({
                        systemFile: self.currentFile,
                        reason: "Could not find planogram role"
                    });

                    return null;
                } else {
                    self.roleID = role.roleID;

                    let config = self.autoRangeConfigs.find(e => {
                        return e.id == role.roleID;
                    });

                    return config;
                }
            },
            getCategoryByProductID(productID) {
                let self = this;

                let product = self.fileData.allRangeProducts.find(e => {
                    return e.productID == productID;
                });

                return product.categoryLink_ID;
            },
            getImportCSV() {
                let self = this;
                let finalArr = [];

                for (let i = 0; i < self.fileData.storeSales.length; i++) {
                    let store = self.fileData.storeSales[i];
                    for (let j = 0; j < store.salesData.length; j++) {
                        let product = store.salesData[j];

                        if (product.store_Range_Indicator_ID == 0 && (product.updated != undefined && product
                                .updated)) {

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
            },
            async calculateAutoRange() {
                let self = this;

                let retval = [];

                let type = self.fileData.tag == " - CATEGORY" ? 2 : 1;
                await controller.getSalesMonthlyTotals(self.fileData.planogramID, type);

                self.fileData.storeSales.forEach(ss => {
                    let productSales = controller.getTotalStoreProductSales(ss, self.fileData
                        .allRangeProducts);

                    productSales.forEach(el => {
                        var test = self.testAutoRangeProduct(el, productSales);

                        let sale = ss.salesData.find(e => {
                            return e.barcode == el.barcode;
                        })

                        if (test.passesOne || test.passesAll) {
                            sale.test_Range_Indicator = "YES"
                            sale.test_Range_Indicator_ID = 2;
                        } else {
                            sale.test_Range_Indicator = "NO"
                            sale.test_Range_Indicator_ID = 1;
                        }
                    });
                })
            },
            testAutoRangeProduct(product, allProducts) {
                let self = this;
                let passesAll = true;
                let passesOne = false;
                let config = self.roleConfig;

                // Sales Index
                if (config.use_Sales_Index) {
                    if (product.sales_contribution <= config.sales_Index) {
                        passesAll = false;
                    } else {
                        passesOne = true;
                    }
                }

                // Sales Index
                if (config.use_Profit_Index) {
                    if (product.profit_contribution <= config.profit_Index) {
                        passesAll = false;
                    } else {
                        passesOne = true;
                    }
                }

                // Volume Index
                if (config.use_Volume_Index) {
                    if (product.units_contribution <= config.volume_Index) {
                        passesAll = false;
                    } else {
                        passesOne = true;
                    }
                }

                // Minimum Units
                if (config.use_Inclusive_Units) {
                    if (product.sales_units < config.inclusive_Units) {
                        passesAll = false;
                    } else {
                        passesOne = true;
                    }
                }

                // Sales
                if (config.use_Sales) {
                    if (
                        !self.inPercentage(
                            allProducts,
                            config.sales,
                            product,
                            "item_sales_rank"
                        )
                    ) {
                        passesAll = false;
                    } else {
                        passesOne = true;
                    }
                }

                // Units
                if (config.use_Volume) {
                    if (
                        !self.inPercentage(
                            allProducts,
                            config.volume,
                            product,
                            "item_volume_rank"
                        )
                    ) {
                        passesAll = false;
                    } else {
                        passesOne = true;
                    }
                }

                // Profit
                if (config.use_Profit) {
                    if (
                        !self.inPercentage(
                            allProducts,
                            config.profit,
                            product,
                            "item_profit_rank"
                        )
                    ) {
                        passesAll = false;
                    } else {
                        passesOne = true;
                    }
                }

                // Minimum Units
                if (config.use_Minimum_Units) {
                    if (product.sales_units < config.minimum_Units) {
                        passesAll = false;
                        passesOne = false;
                    }
                }

                return {
                    passesOne: passesOne,
                    passesAll: passesAll
                };
            },
            inPercentage(allProducts, percentage, product, field) {
                let self = this;

                allProducts = allProducts.filter(item => {
                    return parseInt(item.sales_retail) > 0;
                });

                let sorted = allProducts.sort(function (a, b) {
                    return b[field] - a[field];
                });

                let sortedCount = Math.round((percentage / 100) * sorted.length);
                let diff = sorted.length - sortedCount;

                let partOfRange = false;

                for (var i = sorted.length - 1; i >= diff; i--) {
                    let item = sorted[i];
                    if (item.barcode == product.barcode && item.sales_retail > 0) {
                        partOfRange = true;
                    }
                }

                return partOfRange;
            },
            // Automation Initializers
            startAutomation() {
                let self = this;

                self.currentIndex = 0;
                self.totalSeconds = 0;

                self.startTimer();

                self.getAllFiles(files => {

                    self.startAutomationProcess(() => {
                        console.log(
                            `Automation process complete. ${self.errorFiles.length} errors encountered`
                        );

                        var strErrorText = "";

                        self.errorFiles.forEach(ef => {
                            strErrorText += "File name: " + ef.systemFile.name;
                            strErrorText += "\r\n";
                            strErrorText += "Error: " + ef.reason;
                            strErrorText += "\r\n";
                            strErrorText +=
                                "---------------------------------------------------";
                            strErrorText += "\r\n";
                            strErrorText += "\r\n";
                        });

                        download(strErrorText);

                        clearInterval(interval);
                    });
                });
            },
            startTimer() {
                let self = this;

                interval = setInterval(() => {
                    self.totalElapsedTime++;
                    self.formattedTotalTime = moment('2020-01-01').startOf('day').seconds(self.totalElapsedTime)
                        .format('mm:ss');
                }, 1000);
            },
            getAllFiles(callback) {
                let self = this;

                Axios.get(
                        process.env.VUE_APP_API +
                        "SystemFile/JSON?db=CR-Devinspire&folder=Ranging"
                    )
                    .then(r => {
                        let final = [];

                        r.data.forEach(el => {
                            let canAdd = false;

                            if (el.name == 'SENWES - BEVERAGES - REFRIGERATED - 6 MMA') {
                                canAdd = true;
                            }

                            if (canAdd) {
                                final.push(el);
                            }
                        })

                        console.log(final)

                        self.rangeFiles = final;
                        callback();
                    })
            },
            downloadFile(fileID, callback) {
                let self = this;

                self.currentMethodIndex = 0;
                self.currentMethod = "Downloading file";

                var config = {
                    onDownloadProgress(e) {
                        if (e.lengthComputable) {
                            self.fileProgress = (e.loaded / e.total) * 100;
                        }
                    }
                };

                Axios.get(
                    process.env.VUE_APP_API +
                    `SystemFile/JSON?db=CR-Devinspire&id=${fileID}`,
                    config
                ).then(r => {
                    self.fileData = r.data;
                    callback();
                });
            },
            startAutomationProcess(callback) {
                let self = this;

                var startDate = new Date();

                self.fileProgress = 0;
                self.currentFile = self.rangeFiles[self.currentIndex];
                self.currentIndex++;

                setTimeout(() => {
                    self.downloadFile(self.currentFile.id, () => {
                        if (
                            self.fileData == undefined ||
                            self.fileData == null ||
                            self.fileData == false
                        ) {
                            self.errorFiles.push({
                                systemFile: self.currentFile,
                                reason: "File data is undefined or null"
                            });

                            setTimeout(() => {
                                if (self.currentIndex + 1 < self.rangeFiles.length) {
                                    self.startAutomationProcess(callback);
                                } else {
                                    callback();
                                }
                            }, 500);
                        } else {
                            self.runSelectedMethods(() => {
                                self.currentMethod = "";
                                var endDate = new Date();
                                self.totalSeconds += (endDate.getTime() - startDate.getTime()) /
                                    1000;

                                self.totalProgress = (self.currentIndex / self.rangeFiles
                                    .length) * 100;

                                setTimeout(() => {
                                    if (self.currentIndex + 1 < self.rangeFiles
                                        .length) {
                                        self.startAutomationProcess(callback);
                                    } else {
                                        callback();
                                    }
                                }, 500);
                            });
                        }
                    });
                }, 500);
            },
            // Methods
            runSelectedMethods(callback) {
                let self = this;
                let method = self.selectedMethods[self.currentMethodIndex];

                self[method](() => {
                    self.currentMethodIndex++;
                    if (self.currentMethodIndex < self.selectedMethods.length) {
                        self.runSelectedMethods(callback);
                    } else {
                        callback();
                    }
                });
            },
            // Set Up Highlights
            setUpAutorange(callback) {
                let self = this;
                self.currentMethod = "Setting up highlights";

                self.roleConfig = self.getRoleConfigByPlanogram(
                    self.fileData.planogramID
                );

                if (self.roleConfig == null) {
                    self.errorFiles.push({
                        systemFile: self.currentFile,
                        reason: "Could not find planogram role config"
                    });
                } else {
                    // Do what needs to be done with the highlight
                }

                setTimeout(() => {
                    callback();
                }, 100);
            },
            async exportProductSupply(callback) {
                let self = this;

                self.currentMethod = "Exporting product supply";

                let type = self.fileData.tag == " - CATEGORY" ? 2 : 1;
                await controller.getRequiredData(self.fileData.planogramID, type);

                let seasonalData = controller.getSeasonalData();
                let request = [];

                let filteredStores = self.fileData.storeSales.filter(e => {
                    let canAdd = false;
                    return canAdd;
                })

                filteredStores.forEach(store => {
                    let sales = store.salesData;

                    sales.forEach(sale => {
                        let sales_Units = parseFloat(sale.sales_Units);

                        let calculated_oos_days = controller.getOosDaysStore(
                            sales,
                            sale.productID
                        );

                        let lost_units =
                            ((parseFloat(sales_Units * 6).toFixed(1) /
                                    (30 * 6 - calculated_oos_days)) *
                                calculated_oos_days) /
                            6;

                        let volume_adjusted = parseFloat(sales_Units) + lost_units;

                        let volumeToUse = self.roleConfig.use_Volume_Adjusted ?
                            volume_adjusted :
                            sale.sales_Units;
                        let oneWeekStock = volumeToUse / 4;
                        let new_Stock_Units = controller.getStockUnitsStore(
                            sale.productID,
                            store.storeID
                        );

                        let minimum_Stock = oneWeekStock * self.roleConfig.minumum_Stock;
                        let maximum_Stock = oneWeekStock * self.roleConfig.maximum_Stock;

                        let outSeasonRatio =
                            (seasonalData.rangeVolume - seasonalData.averageLow) /
                            seasonalData.rangeVolume;

                        let seasonal_Minimum_Out =
                            (oneWeekStock - outSeasonRatio * oneWeekStock) *
                            self.roleConfig.minumum_Stock;
                        let seasonal_Maximum_Out =
                            (oneWeekStock - outSeasonRatio * oneWeekStock) *
                            self.roleConfig.maximum_Stock;

                        let average_price = isNaN(sale.sales_Retail / volumeToUse) ?
                            0 :
                            sale.sales_retail / volumeToUse;

                        let minMax = controller.calculateConstraints(
                            Math.round(minimum_Stock),
                            Math.round(maximum_Stock),
                            self.roleConfig,
                            average_price,
                            true
                        );

                        let minMaxOut = controller.calculateConstraints(
                            Math.round(self.roleID == 4 ? seasonal_Minimum_Out : minimum_Stock),
                            Math.round(self.roleID == 4 ? seasonal_Maximum_Out : maximum_Stock),
                            self.roleConfig,
                            average_price,
                            true
                        );

                        let surplusRequired = oneWeekStock * parseFloat(self.roleConfig
                            .surplus_Stock);
                        let surplus_Stock = new_Stock_Units - surplusRequired;

                        let item = {
                            store_ID: store.storeID,
                            planogram_ID: sale.planogram_ID,
                            category_ID: self.getCategoryByProductID(sale.productID),
                            product_ID: sale.productID,
                            min: minMax.min,
                            max: minMax.max,
                            seasonal_Min: minMaxOut.min,
                            seasonal_Max: minMaxOut.max,
                            current_Overstock: surplus_Stock,
                            current_Overstock_Display: surplus_Stock,
                            stock_Attainable: surplusRequired - new_Stock_Units,
                            stock_Attainable_Display: surplusRequired - new_Stock_Units,
                            ls: "ND"
                        };

                        let useIndicator = true;

                        if (useIndicator) {
                            if (sale.store_Range_Indicator == "YES") {
                                if (item.min == 2) {
                                    item.ls = "EX";
                                }

                                if (item.min >= 3) {
                                    item.ls = "HB";
                                }
                            }
                        } else {
                            if (sale.sales_Retail > 0) {
                                if (item.min == 2) {
                                    item.ls = "EX";
                                }

                                if (item.min >= 3) {
                                    item.ls = "HB";
                                }
                            }
                        }

                        request.push(item);
                    });
                });

                Axios.post(process.env.VUE_APP_API + "StockMovement", request).then(r => {
                    callback();
                });
            },
            updateStoreIndicators(callback) {
                let self = this;
                self.currentMethod = "updating indicators";

                let updatedIndicators = self.getImportCSV();

                if (updatedIndicators.length > 0) {
                    Axios.put(
                        process.env.VUE_APP_API +
                        `Ranging/UpdateIndicators?db=CR-Hinterland-Live`,
                        updatedIndicators
                    ).then(r => {
                        callback();
                    });
                } else {
                    callback();
                }
            },
            updateProductDetails(callback) {
                let self = this;
                self.currentMethod = "updating product details";

                let updatedProducts = self.fileData.allRangeProducts;

                updatedProducts.forEach(el => {
                    el["id"] = el.productID;
                });

                Axios.put(process.env.VUE_APP_API + "Product/UpdateProductList?db=CR-Hinterland-Live", updatedProducts)
                    .then(r => {
                        callback();
                    })
            },
            refreshRange(callback) {
                let self = this;
                self.currentMethod = "Refreshing range";

                // Set Date Fields
                self.fileData.dateFrom = 76;
                self.fileData.dateTo = 81;
                self.fileData.dateFromString = '2019-12-01';
                self.fileData.dateToString = '2020-05-31';
                self.fileData.periodic = true;
                self.fileData.monthsBetween = 6;

                // Set retail chain
                self.fileData.retailChainID = 8;
                self.fileData.retailChainDisplayname = 'SENWES';
                
                self.fileData.useType = "CATEGORY";

                Axios.get(process.env.VUE_APP_API +
                    `RangingAdvanced?planogramID=${self.fileData.planogramID}&dateFromID=${self.fileData.dateFrom}&dateToID=${self.fileData.dateTo}&type=${self.fileData.useType}&retailChainID=8`
                ).then(r => {
                    if (r.data != false) {
                        self.fileData.allRangeProducts = r.data.allRangeProducts;
                        self.fileData.clusterData = r.data.clusterData;
                        self.fileData.productStock = r.data.productStock;
                        self.fileData.storeSales = r.data.storeSales;
                    }
                    callback();
                })
            },
            saveRange(callback) {
                let self = this;
                self.currentMethod = "Saving Range";

                self.updateFileName(self.generateFileName() + self.fileData.tag, () => {
                    Axios.post(process.env.VUE_APP_API + "SystemFile/JSON?db=CR-Devinspire", {
                            SystemFile: {
                                SystemUser_ID: -1,
                                Folder: "Ranging",
                                Name: self.generateFileName() + self.fileData.tag,
                                Extension: ".json"
                            },
                            Data: self.fileData
                        })
                        .then(r => {
                            callback();
                        })
                        .catch(e => {
                            console.log(e);
                        });
                })
            },
            updateFileName(name, callback) {
                let self = this;

                let url = encodeURI(process.env.VUE_APP_API +
                    `SystemFile/Rename?id=${self.currentFile.id}&name=${name}`)

                if (self.currentFile.id != null) {
                    Axios.post(url)
                        .then(r => {
                            callback();
                        })
                } else {
                    callback();
                }
            },
            generateFileName() {
                let self = this;

                if (self.fileData.planogramName != "") {
                    if (self.fileData.periodic) {
                        return `${self.fileData.retailChainDisplayname} - ${self.fileData.planogramName} - ${self.fileData.monthsBetween} MMA`;
                    } else {
                        return `${self.fileData.retailChainDisplayname} - ${self.fileData.planogramName} Average Monthly ${self.fileData.dateFromString} To ${self.fileData.dateToString}`;
                    }
                } else {
                    return "";
                }
            },
            setTestIndicators(callback) {
                let self = this;

                self.calculateAutoRange();

                if(self.fileData.autoRangeConfig == undefined || self.fileData.autoRangeConfig == null) {
                    self.fileData.autoRangeConfig = [];
                }

                for(var prop in self.roleConfig) {
                    self.fileData.autoRangeConfig[prop.toLowerCase()] = self.roleConfig[prop];
                }

                callback();
            }
        }
    };

    function download(text) {
        var element = document.createElement("a");
        element.setAttribute(
            "href",
            "data:text/plain;charset=utf-8," + encodeURIComponent(text)
        );
        element.setAttribute("download", "errors.txt");

        element.style.display = "none";
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }
</script>