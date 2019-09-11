<template>
    <v-card tile>
        <v-toolbar flat dense dark color="grey darken-3">
            <v-toolbar-items>
                <v-menu dark offset-y style="margin-bottom: 10px;">
                    <v-btn slot="activator" flat>
                        File
                    </v-btn>
                    <v-list>
                        <v-list-tile @click="newFile">
                            <v-list-tile-title>New</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile @click="openFile">
                            <v-list-tile-title>Open</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile @click="saveFile">
                            <v-list-tile-title>Save</v-list-tile-title>
                        </v-list-tile>
                        <!-- <v-list-tile>
                            <v-list-tile-title>Close</v-list-tile-title>
                        </v-list-tile> -->
                    </v-list>
                </v-menu>
                <v-menu dark offset-y style="margin-bottom: 10px;">
                    <v-btn slot="activator" flat>
                        Setup
                    </v-btn>
                    <v-list>
                        <v-list-tile @click="setupBaskets">
                            <v-list-tile-title>Baskets</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile @click="openLevels">
                            <v-list-tile-title>Basket Levels</v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu>
            </v-toolbar-items>
            <v-spacer></v-spacer>
            <div v-if="selectedBasket != null">{{ generateName() }}</div>
            <v-spacer></v-spacer>
            <v-toolbar-title>
                <span>Basket Analysis</span>
            </v-toolbar-title>
        </v-toolbar>
        <v-toolbar dark flat>
            <v-btn v-if="rowData.length > 0" color="primary" @click="refreshFile">Refresh</v-btn>
        </v-toolbar>
        <Grid ref="Grid" :rowData="rowData" />
        <BasketSelector ref="BasketSelector" />
        <DateRangeSelector ref="DateRangeSelector" />
        <BasketMaintenanceModal ref="BasketMaintenanceModal" />
        <FileDataSelector ref="FileDataSelector" />
        <!-- Modal -->
        <v-dialog v-model="dialog" persistent width="600px">
            <v-card>
                <v-toolbar dark flat color="primary">
                    <v-toolbar-title> Clusters </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="dialog=false">
                        <v-icon>close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-text class="pb-0">
                    <v-container grid-list-md class="pa-0">
                        <v-layout row wrap>
                            <v-flex md6>
                                <v-select @change="generateLevels" label="Clusters" :items="levelItems" class="mb-3"
                                    v-model="selectedLevel">
                                </v-select>
                            </v-flex>
                            <v-flex md6></v-flex>
                            <v-flex md6>
                                <v-text-field label="Cluster 1" v-model="level1"></v-text-field>
                                <v-text-field label="Cluster 2" v-if="selectedLevel>=1" v-model="level2">
                                </v-text-field>
                                <v-text-field label="Cluster 3" v-if="selectedLevel>=2" v-model="level3">
                                </v-text-field>
                                <v-text-field label="Cluster 4" v-if="selectedLevel>=3" v-model="level4">
                                </v-text-field>
                                <v-text-field label="Cluster 5" v-if="selectedLevel>=4" v-model="level5">
                                </v-text-field>
                            </v-flex>
                            <v-flex md6>
                                <v-text-field type="number" label="Greater than" v-model="level1Value"></v-text-field>
                                <v-text-field type="number" label="Greater than" v-if="selectedLevel>=1"
                                    v-model="level2Value">
                                </v-text-field>
                                <v-text-field :disabled="selectedLevel == 2" type="number" label="Greater than"
                                    v-if="selectedLevel>=2" v-model="level3Value">
                                </v-text-field>
                                <v-text-field :disabled="selectedLevel == 3" type="number" label="Greater than"
                                    v-if="selectedLevel>=3" v-model="level4Value">
                                </v-text-field>
                                <v-text-field :disabled="selectedLevel == 4" type="number" label="Greater than"
                                    v-if="selectedLevel>=4" v-model="level5Value">
                                </v-text-field>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card-text>
                <v-card-actions class="pr-3">
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="submitLevels">
                        Submit
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-card>
</template>

<script>
    import Axios from 'axios';

    import Grid from './Grid'
    import BasketSelector from './BasketSelector'
    import DateRangeSelector from "@/components/Common/DateRangeSelector"
    import BasketMaintenanceModal from './basketMaint/BasketMaintenanceModal';
    import FileDataSelector from './FileDataSelector';

    export default {
        components: {
            Grid,
            BasketSelector,
            DateRangeSelector,
            BasketMaintenanceModal,
            FileDataSelector
        },
        data() {
            return {
                selectedBasket: null,
                selectedPeriod: null,
                rowData: [],
                storeData: [],
                runData: [],
                level1: "LARGE",
                level2: "MEDIUM",
                level3: "SMALL",
                level4: "EXTRA LARGE",
                level5: "EXTRA SMALL",
                level1Value: 0,
                level2Value: 0,
                level3Value: 0,
                level4Value: 0,
                level5Value: 0,
                selectedLevel: 2,
                levelItems: [{
                    text: "3",
                    value: 2
                }, {
                    text: "4",
                    value: 3
                }, {
                    text: "5",
                    value: 4
                }],
                levels: ["LARGE", "MEDIUM", "SMALL"],
                dialog: false,
                levelsCallback: null
            }
        },
        created() {
            let self = this;
            self.getFile(data => {
                if (data != null && data != false) {
                    self.getFileData(data.id, fileData => {
                        if (!Array.isArray(fileData.store)) {
                            self.runData = [];

                            if (fileData.config != undefined && fileData.config != null) {
                                if (fileData.config.basket != undefined && fileData.config.basket !=
                                    null) {
                                    let tg = fileData.config.basket.turnoverGroups;
                                    let tgv = fileData.config.basket.turnoverGroupUserValues;

                                    for (var i = 0; i < tg.length; i++) {
                                        self["level" + (i + 1)] = tg[i];
                                    }

                                    for (var i = 0; i < tgv.length; i++) {
                                        self["level" + (i + 1) + "Value"] = tgv[i];
                                    }
                                }
                            }

                            self.fileData = fileData.basket;

                            for (var prop in fileData.basket) {
                                self.runData.push({
                                    prop: prop,
                                    name: self.generateNameParams(fileData.basket[prop].config
                                        .selectedBasket, fileData.basket[prop].config
                                        .selectedPeriod)
                                })
                            }
                        }
                    })
                }
            })
        },
        methods: {
            newFile() {
                let self = this;

                self.$refs.BasketSelector.show(basket => {
                    self.selectedBasket = basket;
                    self.$refs.DateRangeSelector.show(period => {
                        self.selectedPeriod = period;
                        self.getData();
                    })
                })
            },
            getData() {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API +
                        `StoreBasketReport?basket_ID=${self.selectedBasket.id}&periodFrom=${self.selectedPeriod.dateFrom}&periodTo=${self.selectedPeriod.dateTo}`
                    )
                    .then(r => {
                        self.storeData = r.data;
                        self.setData(r.data);
                        delete Axios.defaults.headers.common["TenantID"];
                    })
            },
            setData(data) {
                let self = this;
                let highest = data[0].sales;
                let levels = JSON.parse(JSON.stringify(self.levels))
                let levelLength = self.levels.length;

                data.forEach(el => {
                    el.salesPercent = parseFloat(((el.sales / highest) * 100).toFixed(2));
                })

                let mp = self.getMidPoints(data, levelLength);

                data.forEach(el => {
                    let hasValue = false;

                    el.level = undefined

                    for (var i = 0; i < (levelLength - 2); i++) {
                        let highestMP = mp[i];
                        let lowestMP = mp[i + 1];

                        if (!hasValue) {

                            if (el.sales > highestMP) {
                                el["level"] = levels[i];
                                hasValue = true;
                            } else {
                                if (el.sales > lowestMP) {
                                    let highDiff = highestMP - el.sales;
                                    let lowestDiff = el.sales - lowestMP;

                                    if (highDiff < lowestDiff) {
                                        el["level"] = levels[i];
                                        hasValue = true;
                                    } else {
                                        el["level"] = levels[i + 1];
                                        hasValue = true;
                                    }
                                }
                            }
                        }
                    }

                    if (!hasValue) {

                        let highDiff = mp[mp.length - 2] - el.sales;
                        let lowestDiff = el.sales - mp[mp.length - 1];

                        if (highDiff < lowestDiff) {
                            el["level"] = levels[mp.length - 2];
                            hasValue = true;
                        } else {
                            el["level"] = levels[mp.length - 1];
                            hasValue = true;
                        }
                    }
                })

                data = self.getUserDefined(data, levels)

                self.rowData = data;

                self.$nextTick(() => {
                    self.$refs.Grid.gridApi.redrawRows();
                })
            },
            getUserDefined(data, levels) {
                let self = this;

                for (var i = (data.length - 1); i >= 0; i--) {
                    let currentElement = data[i];
                    let valueIDX = 1;

                    for (var j = 0; j < (levels.length - 1); j++) {
                        if (currentElement.sales > parseFloat(self["level" + (j + 1) + "Value"])) {
                            valueIDX++;
                        }

                        currentElement["userDefinedCluster"] = levels[levels.length - valueIDX];
                    }
                }

                return data;
            },
            getMidPoints(data, levels) {
                let self = this;
                let totalLength = data.length;
                let levelDescrep = Math.floor(totalLength / levels);

                let mids = [];

                for (var i = 0; i < levels; i++) {
                    let total = 0;

                    for (var j = 0; j < levelDescrep; j++) {
                        let currentElIDX = (levelDescrep * i) + j;
                        let currentEL = data[currentElIDX];
                        total += currentEL.sales;
                    }

                    let diff = total / levelDescrep;
                    mids.push(diff);
                }

                return mids;
            },
            openFile() {
                let self = this;

                self.$refs.FileDataSelector.show(self.runData, fileData => {
                    self.showingSaved = true;
                    let reader = self.fileData[fileData.prop];
                    self.selectedBasket = reader.config.selectedBasket;
                    self.selectedPeriod = reader.config.selectedPeriod;
                    self.rowData = reader.data;
                });
            },
            saveFile() {
                let self = this;
            },
            setupBaskets() {
                let self = this;
                self.$refs.BasketMaintenanceModal.open();
            },
            openLevels() {
                let self = this
                self.openClusterLevels(levels => {
                    self.$nextTick(() => {
                        self.levels = levels;
                        self.dialog = false;
                        self.rowData = [];
                        self.setData(self.storeData);
                    })
                })
            },
            openClusterLevels(callback) {
                let self = this
                self.dialog = true
                self.levelsCallback = callback
            },
            generateName() {
                let self = this;

                if (self.selectedPeriod != null) {
                    if (self.selectedPeriod.periodic) {
                        return `${self.selectedBasket.description} - ${self.selectedPeriod.monthsBetween} MMA (${self.selectedPeriod.dateFromString} TO ${self.selectedPeriod.dateToString})`;
                    } else {
                        return `${self.selectedBasket.description} Average Monthly ${self.selectedPeriod.dateFromString} TO ${self.selectedPeriod.dateToString}`;
                    }
                } else {
                    return "";
                }
            },
            generateNameParams(selectedBasket, selectedPeriod) {
                let self = this;

                if (selectedPeriod.periodic) {
                    return `${selectedBasket.description} - ${selectedPeriod.monthsBetween} MMA (${selectedPeriod.dateFromString} TO ${selectedPeriod.dateToString})`;
                } else {
                    return `${selectedBasket.description} Average Monthly ${selectedPeriod.dateFromString} TO ${selectedPeriod.dateToString}`;
                }
            },
            generateLevels(amount) {
                let self = this

                self["level" + (self.selectedLevel + 1) + "Value"] = 0;

                if (self.selectedLevel >= 3) {
                    self.level1 = "EXTRA LARGE"
                    self.level2 = "LARGE"
                    self.level3 = "MEDIUM"
                    self.level4 = "SMALL"
                    self.level5 = "EXTRA SMALL"
                } else {
                    self.level1 = "LARGE"
                    self.level2 = "MEDIUM"
                    self.level3 = "SMALL"
                    self.level4 = "EXTRA LARGE"
                    self.level5 = "EXTRA SMALL"
                }

                if (self.selectedLevel == 1) {
                    self.level1 = "LARGE"
                    self.level2 = "SMALL"
                }
            },
            submitLevels() {
                let self = this
                let tmp = [];

                self.$nextTick(() => {
                    for (var i = 0; i < (self.selectedLevel + 1); i++) {
                        tmp.push(self["level" + (i + 1)]);
                    }

                    self.levelsCallback(tmp);
                })
            },
            refreshFile() {
                let self = this;

                self.$refs.DateRangeSelector.show(period => {
                    self.selectedPeriod = period;
                    self.getData();
                })
            },
            getFile(callback) {
                let self = this;

                Axios.get(process.env.VUE_APP_API +
                        `SystemFile/JSON?db=CR-Devinspire&folder=CLUSTER REPORT&file=REPORT`)
                    .then(r => {
                        callback(r.data);
                    })
            },
            saveFile() {
                let self = this;

                self.getFile(fileTransaction => {

                    let levelValues = [];

                    for (var i = 0; i < self.levels.length; i++) {
                        levelValues.push(self[`level${(i + 1)}Value`])
                    }

                    if (fileTransaction == null || fileTransaction == false) {
                        let tmp = {
                            basket: {},
                            config: {
                                basket: {
                                    turnoverGroups: self.levels,
                                    turnoverGroupUserValues: levelValues
                                }
                            }
                        }

                        tmp.basket[self.selectedBasket.description] = {
                            data: self.rowData,
                            config: {
                                selectedBasket: self.selectedBasket,
                                selectedPeriod: self.selectedPeriod
                            }
                        };

                        self.appendAndSaveFile(tmp);
                    } else {
                        self.getFileData(fileTransaction.id, fileData => {
                            let tmp = fileData;

                            if (tmp == false) {
                                tmp = {
                                    basket: {},
                                    config: {
                                        basket: {
                                            turnoverGroups: self.levels,
                                            turnoverGroupUserValues: levelValues
                                        }
                                    }
                                }
                            }

                            if (tmp.basket == undefined)
                                tmp.basket = {};

                            if (Array.isArray(tmp.basket))
                                tmp.basket = {};

                            if (tmp.config == undefined || tmp.config == null) {
                                tmp.config = {
                                    basket: {
                                        turnoverGroups: self.levels,
                                        turnoverGroupUserValues: levelValues
                                    }
                                }
                            } else {
                                tmp.config.basket = {
                                    turnoverGroups: self.levels,
                                    turnoverGroupUserValues: levelValues
                                }
                            }

                            tmp.basket[self.selectedBasket.description] = {
                                data: self.rowData,
                                config: {
                                    selectedBasket: self.selectedBasket,
                                    selectedPeriod: self.selectedPeriod
                                }
                            };

                            self.appendAndSaveFile(tmp);
                        })
                    }
                })
            },
            getFileData(id, callback) {
                let self = this;
                Axios.get(process.env.VUE_APP_API + `SystemFile/JSON?db=CR-Devinspire&id=${id}`)
                    .then(r => {
                        callback(r.data);
                    })
            },
            appendAndSaveFile(fileData) {
                Axios.post(process.env.VUE_APP_API + "SystemFile/JSON?db=CR-Devinspire", {
                        SystemFile: {
                            SystemUser_ID: -1,
                            Folder: "CLUSTER REPORT",
                            Name: "REPORT",
                            Extension: '.json'
                        },
                        Data: fileData
                    })
                    .then(r => {
                        alert("Successfully saved");
                    })
                    .catch(e => {
                        alert("Failed to save");
                    })
            },
        }
    }
</script>