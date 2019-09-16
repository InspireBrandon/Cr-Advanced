<template>
    <v-card tile>
        <v-toolbar flat dense dark color="grey darken-3">
            <v-toolbar-items>
                <v-menu dark offset-y style="margin-bottom: 10px;">
                    <v-btn slot="activator" flat>
                        File
                    </v-btn>
                    <v-list tile>
                        <v-list-tile @click="newFile">
                            <v-list-tile-title>New</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile @click="openFile">
                            <v-list-tile-title>Open</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile @click="saveFile">
                            <v-list-tile-title>Save</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile @click="close">
                            <v-list-tile-title>Close</v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu>
                <!-- <v-menu dark offset-y style="margin-bottom: 10px;" v-if="rowData.length > 0 && !showingSaved">
                    <v-btn slot="activator" flat>
                        Setup
                    </v-btn>
                    <v-list>
                        <v-list-tile @click="openLevels">
                            <v-list-tile-title>Turnover Groups</v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu> -->
            </v-toolbar-items>
            <v-spacer></v-spacer>
            <div style="display: flex">
                <div>{{ generateName() }}</div>
            </div>
            <v-spacer></v-spacer>
            <v-toolbar-title>
                <span>Store Analysis</span>
            </v-toolbar-title>
        </v-toolbar>
        <v-toolbar dark flat>
            <v-btn v-if="selectedSupergroup != null" color="primary" @click="refreshFile">Refresh</v-btn>
            <v-btn v-if="selectedSupergroup != null" color="primary" @click="openLevels">Setup</v-btn>
        </v-toolbar>
        <v-dialog v-model="clusterDialog" persistent width="600px">
            <v-card>
                <v-toolbar dark flat color="primary">
                    <v-toolbar-title> Clusters </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="clusterDialog=false">
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
        <Grid :rowData="rowData" ref="Grid" />
        <FileDataSelector ref="FileDataSelector" />
        <SupergroupSelector ref="SupergroupSelector" />
        <DateRangeSelector ref="DateRangeSelector" />
        <SizeLoader ref="SizeLoader" />
        <Spinner ref="Spinner" />
    </v-card>
</template>

<script>
    import Axios from 'axios';
    import Grid from './Grid';
    import FileDataSelector from './FileDataSelector';
    import SupergroupSelector from './SupergroupSelector';
    import DateRangeSelector from "@/components/Common/DateRangeSelector"
    import SizeLoader from '@/components/Common/SizeLoader';
    import Spinner from '@/components/Common/Spinner';

    export default {
        components: {
            Grid,
            FileDataSelector,
            SupergroupSelector,
            DateRangeSelector,
            SizeLoader,
            Spinner
        },
        data() {
            return {
                level1: "LARGE",
                level2: "MEDIUM",
                level3: "SMALL",
                level4: "Extra LARGE",
                level5: "Extra SMALL",
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
                items: [],
                filterText: null,
                rowData: [],
                storeAnalysiss: [],
                selectedstoreAnalysis: null,
                projectGroups: [],
                selectedProjectGroup: null,
                storeAnalysis_ID: null,
                superGroups: [],
                selectedSupergroup: null,
                selectedPeriod: null,
                clusterDialog: false,
                levelsCallback: null,
                storeData: [],
                runData: [],
                possibleFiles: [],
                fileData: null,
                showingSaved: false
            }
        },
        created() {
            let self = this;
            self.getFile(data => {
                if (data != null && data != false) {
                    self.getFileData(data.id, fileData => {
                        if (!Array.isArray(fileData.store)) {
                            self.runData = [];

                            self.fileData = fileData.store;

                            for (var prop in fileData.store) {
                                self.runData.push({
                                    prop: prop,
                                    name: self.generateNameParams(fileData.store[prop].config
                                        .selectedSupergroup, fileData.store[prop].config
                                        .selectedPeriod)
                                })
                            }
                        }
                    })
                }
            })
        },
        methods: {
            close() {
                let self = this
                self.rowData = []
                self.selectedBasket = null
                self.selectedPeriod = null
            },
            updateLoader(data) {
                let self = this
                self.$refs.SizeLoader.updateLoader(data)
            },
            generateNameParams(selectedSupergroup, selectedPeriod) {
                let self = this;

                if (selectedPeriod.periodic) {
                    return `${selectedSupergroup.displayname} - ${selectedPeriod.monthsBetween} MMA (${selectedPeriod.dateFromString} TO ${selectedPeriod.dateToString})`;
                } else {
                    return `${selectedSupergroup.displayname} Average Monthly ${selectedPeriod.dateFromString} TO ${selectedPeriod.dateToString}`;
                }
            },
            generateName() {
                let self = this;

                if (self.selectedPeriod != null) {
                    if (self.selectedPeriod.periodic) {
                        return `${self.selectedSupergroup.displayname} - ${self.selectedPeriod.monthsBetween} MMA (${self.selectedPeriod.dateFromString} TO ${self.selectedPeriod.dateToString})`;
                    } else {
                        return `${self.selectedSupergroup.displayname} Average Monthly ${self.selectedPeriod.dateFromString} TO ${self.selectedPeriod.dateToString}`;
                    }
                } else {
                    return "";
                }
            },
            openLevels() {
                let self = this
                self.openClusterLevels(levels => {
                    self.$nextTick(() => {
                        self.levels = levels;
                        self.clusterDialog = false;
                        self.rowData = [];
                        self.prepareTurnoverGroups(self.storeData);
                    })
                })
            },
            submitLevels() {
                let self = this
                let tmp = [];

                self.$nextTick(() => {

                    for (var i = 0; i < (self.selectedLevel + 1); i++) {
                        tmp.push(self["level" + (i + 1)]);
                    }

                    self.levels = tmp;
                    self.clusterDialog = false;

                    if (self.rowData.length > 0) {
                        self.$nextTick(() => {
                            if (self.showingSaved) {
                                self.prepareTurnoverGroups(self.rowData);
                            } else {
                                self.levelsCallback(tmp);
                            }
                        })
                    }
                })
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
            openClusterLevels(callback) {
                let self = this
                self.clusterDialog = true
                self.levelsCallback = callback
            },
            getData() {
                let self = this;

                self.showingSaved = false;

                var startTime = new Date()

                let config = {
                    onDownloadProgress: progressEvent => {
                        var currentFileSize = progressEvent.loaded * 0.000001
                        var FileTotalSize = progressEvent.total * 0.000001

                        var TIME_TAKEN = new Date().getTime() - startTime.getTime()
                        var DownloadSpeed = currentFileSize / (TIME_TAKEN / 1000)
                        self.updateLoader({
                            text1: "Downloading Basket",
                            currentFileSize: currentFileSize,
                            FileTotalSize: FileTotalSize,
                            DownloadSpeed: DownloadSpeed,
                        })
                    }
                }

                self.$refs.Spinner.show();

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API +
                        `StoreAnalysis?supergroup_a_id=${self.selectedSupergroup.id}&periodFrom_ID=${self.selectedPeriod.dateFrom}&periodTo_ID=${self.selectedPeriod.dateTo}`,
                        config)
                    .then(r => {
                        self.storeData = r.data;
                        self.prepareTurnoverGroups(r.data)
                        delete Axios.defaults.headers.common["TenantID"];
                        self.$refs.Spinner.hide();
                    })
            },
            prepareTurnoverGroups(data) {
                let self = this;
                let levels = JSON.parse(JSON.stringify(self.levels))

                let levelLength = self.levels.length;

                let totalStoreSales = data.reduce((a, b) => {
                    return {
                        totalSales: a.totalSales + b.totalSales
                    }
                }).totalSales

                let currentPercent = 0;

                let highest = data[0].totalSales;

                data.forEach(el => {
                    let storePercent = currentPercent + ((el.totalSales / totalStoreSales) * 100);
                    el["salesPercent"] = ((el.totalSales / highest) * 100);
                    el["cumulativePercent"] = storePercent;
                    currentPercent = storePercent;
                })

                let highestVal = data[0].totalSales;
                let lowestVal = data[data.length - 1].totalSales;
                let average = highestVal / levelLength;

                let mp = self.getMidPoints(data, levelLength);

                data.forEach(el => {
                    let hasValue = false;

                    el.level == undefined

                    for (var i = 0; i < (levelLength - 2); i++) {
                        let highestMP = mp[i];
                        let lowestMP = mp[i + 1];

                        if (!hasValue) {

                            if (el.totalSales > highestMP) {
                                el["level"] = levels[i];
                                el["levelValue"] = i;
                                hasValue = true;
                            } else {
                                if (el.totalSales > lowestMP) {
                                    let highDiff = highestMP - el.totalSales;
                                    let lowestDiff = el.totalSales - lowestMP;

                                    if (highDiff < lowestDiff) {
                                        el["level"] = levels[i];
                                        el["levelValue"] = i;
                                        hasValue = true;
                                    } else {
                                        el["level"] = levels[i + 1];
                                        el["levelValue"] = i + 1;
                                        hasValue = true;
                                    }
                                }
                            }
                        }
                    }

                    if (!hasValue) {
                        let highDiff = mp[mp.length - 2] - el.totalSales;
                        let lowestDiff = el.totalSales - mp[mp.length - 1];

                        if (highDiff < lowestDiff) {
                            el["level"] = levels[mp.length - 2];
                            el["levelValue"] = mp.length - 2;
                            hasValue = true;
                        } else {
                            el["level"] = levels[mp.length - 1];
                            el["levelValue"] = mp.length - 1;
                            hasValue = true;
                        }
                    }
                })

                // get user defined values
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
                        if (currentElement.totalSales > parseFloat(self["level" + (j + 1) + "Value"])) {
                            valueIDX++;
                        }

                        currentElement["userDefinedCluster"] = levels[levels.length - valueIDX];
                        currentElement["userDefinedClusterValue"] = levels.length - valueIDX;
                    }
                }

                return data;
            },
            getAverage(levels, highest, lowest) {
                let self = this;

                return (highest - lowest) / levels;
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
                        total += currentEL.totalSales;
                    }

                    let diff = total / levelDescrep;
                    mids.push(diff);
                }

                return mids;
            },
            newFile() {
                let self = this;

                self.$refs.SupergroupSelector.show(supergroup => {
                    self.selectedSupergroup = supergroup;

                    self.$refs.DateRangeSelector.show(period => {
                        self.selectedPeriod = period;
                        self.getData();
                    })
                })
            },
            openFile() {
                let self = this;

                self.$refs.FileDataSelector.show(self.runData, fileData => {
                    self.showingSaved = true;
                    let reader = self.fileData[fileData.prop];
                    self.selectedSupergroup = reader.config.selectedSupergroup;
                    self.selectedPeriod = reader.config.selectedPeriod;

                    if (reader.config.turnoverGroups != undefined && reader.config.turnoverGroups != null) {
                        let tg = reader.config.turnoverGroups;
                        let tgv = reader.config.turnoverGroupUserValues;

                        self.selectedLevel = tg.length - 1;

                        for (var i = 0; i < tg.length; i++) {
                            self["level" + (i + 1)] = tg[i];
                        }

                        for (var i = 0; i < tgv.length; i++) {
                            self["level" + (i + 1) + "Value"] = tgv[i];
                        }
                    }

                    self.rowData = reader.data;
                });
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
                            store: {}
                        }

                        tmp.store[self.selectedSupergroup.displayname] = {
                            data: self.rowData,
                            config: {
                                selectedSupergroup: self.selectedSupergroup,
                                selectedPeriod: self.selectedPeriod,
                                turnoverGroups: self.levels,
                                turnoverGroupUserValues: levelValues
                            }
                        };

                        self.appendAndSaveFile(tmp);
                    } else {
                        self.getFileData(fileTransaction.id, fileData => {
                            let tmp = fileData;

                            if (tmp == false) {
                                tmp = {
                                    store: {}
                                }
                            }

                            if (tmp.store == undefined)
                                tmp.store = {};

                            if (Array.isArray(tmp.store))
                                tmp.store = {};

                            tmp.store[self.selectedSupergroup.displayname] = {
                                data: self.rowData,
                                config: {
                                    selectedSupergroup: self.selectedSupergroup,
                                    selectedPeriod: self.selectedPeriod,
                                    turnoverGroups: self.levels,
                                    turnoverGroupUserValues: levelValues
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
                let self = this;

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
                        self.fileData = fileData;
                        alert("Successfully saved");
                    })
                    .catch(e => {
                        alert("Failed to save");
                    })
            },
            refreshFile() {
                let self = this;

                self.$refs.DateRangeSelector.show(period => {
                    self.selectedPeriod = period;
                    self.getData();
                })
            }
        }
    }

    function removeDuplicates(myArr, prop) {
        return myArr.filter((obj, pos, arr) => {
            return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
        });
    }
</script>