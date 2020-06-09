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

    export default {
        name: "range-automation",
        data() {
            return {
                errorFiles: [],
                storesToUpdate: [124524, 124525, 124546, 124527, 124530, 124532, 124533, 124535, 124537, 124543],
                rangeFiles: [],
                currentIndex: 0,
                currentFile: null,
                fileData: null,
                fileProgress: 0,
                totalProgress: 0,
                currentMethod: "",
                currentMethodIndex: 0,
                selectedMethods: ["setUpAutorange", "exportProductSupply"],
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
                    .catch(e => {
                        alert("Failed to get data...");
                    });
            },
            getRoleConfigs() {
                let self = this;

                Axios.defaults.headers.common["TenantID"] =
                    sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + "AutoRangeConfig")
                    .then(r => {
                        self.autoRangeConfigs = r.data;
                    })
                    .catch(e => {
                        alert("Failed to get data...");
                    });
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
            // Automation Initializers
            startAutomation() {
                let self = this;

                self.currentIndex = 0;
                self.totalSeconds = 0;

                self.startTimer();

                self.getAllFiles(files => {
                    self.startAutomationProcess(() => {
                        console.log(`Automation process complete. ${self.errorFiles.length} errors encountered`);

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
                    self.formattedTotalTime = moment('2020-01-01').startOf('day').seconds(self.totalElapsedTime).format('mm:ss');
                }, 1000);
            },
            getAllFiles(callback) {
                let self = this;

                Axios.get(
                        process.env.VUE_APP_API +
                        "SystemFile/JSON?db=CR-Devinspire&folder=Ranging"
                    )
                    .then(r => {
                        self.rangeFiles = r.data;
                        callback();
                    })
                    .catch(e => {
                        alert("Failed to get data...");
                    });
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

                self.currentIndex++;
                self.fileProgress = 0;
                self.currentFile = self.rangeFiles[self.currentIndex];

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
                                var endDate   = new Date();
                                self.totalSeconds += (endDate.getTime() - startDate.getTime()) / 1000;

                                self.totalProgress = (self.currentIndex / self.rangeFiles.length) * 100;

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
            // Set up Highlights
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

                    self.storesToUpdate.forEach(storeID => {
                        if(e.storeID == storeID) {
                            canAdd = true;
                        }
                    });

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

                        let surplusRequired =
                            oneWeekStock * parseFloat(self.roleConfig.surplus_Stock);
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