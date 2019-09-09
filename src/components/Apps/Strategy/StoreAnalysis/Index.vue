<template>
    <v-card tile>
        <v-toolbar flat dense dark color="grey darken-3">
            <v-toolbar-items>
                <v-menu dark offset-y style="margin-bottom: 10px;">
                    <v-btn slot="activator" flat>
                        File
                    </v-btn>
                    <v-list>
                        <v-list-tile @click="openFile">
                            <v-list-tile-title>Open</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile @click="saveFile">
                            <v-list-tile-title>Save</v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu>
                <v-menu dark offset-y style="margin-bottom: 10px;">
                    <v-btn slot="activator" flat>
                        Setup
                    </v-btn>
                    <v-list>
                        <v-list-tile @click="openLevels">
                            <v-list-tile-title>Levels</v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu>
            </v-toolbar-items>
            <v-spacer></v-spacer>
            <v-toolbar-title>
                <span>Store Analysis</span>
            </v-toolbar-title>
        </v-toolbar>
        <v-toolbar dark flat>
            <v-toolbar-items>
                <v-select label="Supergroup A" style="margin-left: 10px; margin-top: 8px; width: 300px"
                    placeholder="Please select one" @change="onSuperGroupChange" dense :items="superGroups"
                    v-model="selectedSuperGroup" hide-details></v-select>
            </v-toolbar-items>
        </v-toolbar>
        <v-dialog v-model="clusterDialog" persistent width="800px">
            <v-card>
                <v-toolbar dark flat color="primary">
                    <v-toolbar-title> Clusters </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="clusterDialog=false">
                        <v-icon>close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-text>
                    <v-container grid-list-md>
                        <v-layout row wrap>
                            <v-flex md6>
                                <v-select @change="generateLevels" label="Clusters" :items="levelItems"
                                    v-model="selectedLevel">
                                </v-select>
                            </v-flex>
                            <v-flex md6>

                            </v-flex>
                            <v-flex md12>
                                <v-divider></v-divider>
                            </v-flex>
                            <v-flex md6>
                                <v-text-field label="Cluster 1" v-model="level1">
                                </v-text-field>
                                <v-text-field label="Cluster 2" v-if="selectedLevel>=1" v-model="level2">
                                </v-text-field>
                                <v-text-field label="Cluster 3" v-if="selectedLevel>=2" v-model="level3">
                                </v-text-field>
                            </v-flex>
                            <v-flex md6>
                                <v-text-field label="Cluster 4" v-if="selectedLevel>=3" v-model="level4">
                                </v-text-field>
                                <v-text-field label="Cluster 5" v-if="selectedLevel>=4" v-model="level5">
                                </v-text-field>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="submitLevels">
                        Submit
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <Grid :rowData="rowData" ref="Grid" />
    </v-card>
</template>

<script>
    import Axios from 'axios';
    import Grid from './Grid'

    export default {
        components: {
            Grid,
        },
        data() {
            return {
                level1: "Large",
                level2: "Medium",
                level3: "Small",
                level4: "Extra Large",
                level5: "Extra Small",
                selectedLevel: 2,
                levelItems: [{
                    text: "1",
                    value: 0
                }, {
                    text: "2",
                    value: 1
                }, {
                    text: "3",
                    value: 2
                }, {
                    text: "4",
                    value: 3
                }, {
                    text: "5",
                    value: 4
                }],
                items: [],
                filterText: null,
                rowData: [],
                storeAnalysiss: [],
                selectedstoreAnalysis: null,
                projectGroups: [],
                selectedProjectGroup: null,
                storeAnalysis_ID: null,
                superGroups: [],
                selectedSuperGroup: null,
                clusterDialog: false,
                levelsCallback: null,
            }
        },
        created() {
            let self = this;
            self.getSuperGroups();
            self.getFile(data => {
                if (data != null && data != false) {
                    self.getFileData(data.id, fileData => {
                        if(fileData.config != undefined && fileData.config != null) {
                            if(fileData.config.supergroup_a_id != undefined && fileData.config.supergroup_a_id != null) {
                                self.selectedSuperGroup = fileData.config.supergroup_a_id;
                                self.getData();
                            }
                        }
                    })
                }
            })
        },
        methods: {
            openLevels() {
                let self = this
                self.openClusterLevels(callback => {
                    console.log(callback);

                })
            },
            submitLevels() {
                let self = this
                self.levelsCallback([self.level1,
                    self.level2,
                    self.level3,
                    self.level4,
                    self.level5
                ])
            },
            generateLevels(amount) {
                let self = this
                if (self.selectedLevel >= 3) {
                    self.level1 = "Extra Large"
                    self.level2 = "Large"
                    self.level3 = "Medium"
                    self.level4 = "Small"
                    self.level5 = "Extra Small"
                } else {
                    self.level1 = "Large"
                    self.level2 = "Medium"
                    self.level3 = "Small"
                    self.level4 = "Extra Large"
                    self.level5 = "Extra Small"
                }
            },
            openClusterLevels(callback) {
                let self = this
                self.clusterDialog = true
                self.levelsCallback = callback
                console.log(self.levelsCallback);
                
            },
            getData() {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API +
                        `StoreAnalysis?supergroup_a_id=${self.selectedSuperGroup}&periodFrom_ID=66&periodTo_ID=71`)
                    .then(r => {
                        self.prepareTurnoverGroups(r.data)
                        delete Axios.defaults.headers.common["TenantID"];
                    })
            },
            prepareTurnoverGroups(data) {
                let self = this;
                let levels = ["LARGE", "MEDIUM", "SMALL"]

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

                let mcg = self.getMostCommonGroups(data, 3);
                let highestVal = data[0].totalSales;
                let lowestVal = data[data.length - 1].totalSales;
                let average = highestVal / 3;

                let mp = self.getMidPoints(data, 3);

                data.forEach(el => {
                    let hasValue = false;

                    for (var i = 0; i < 2; i++) {
                        let highestMP = mp[i];
                        let lowestMP = mp[i + 1];

                        if (!hasValue) {

                            if (el.totalSales > highestMP) {
                                el["level"] = levels[i];
                                hasValue = true;
                            } else {
                                if (el.totalSales > lowestMP) {
                                    let highDiff = highestMP - el.totalSales;
                                    let lowestDiff = el.totalSales - lowestMP;

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

                    if (el.level == undefined) {
                        let highDiff = mp[mp.length - 2] - el.totalSales;
                        let lowestDiff = el.totalSales - mp[mp.length - 1];

                        if (highDiff < lowestDiff) {
                            el["level"] = levels[mp.length - 2];
                            hasValue = true;
                        } else {
                            el["level"] = levels[mp.length - 1];
                            hasValue = true;
                        }
                    }
                })

                self.rowData = data;
            },
            nearestTenth(number) {
                return Math.ceil(number / 10) * 10;
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
                    let high = data[levelDescrep * i];
                    let low = data[levelDescrep * (i + 1)]
                    let diff = high.totalSales - low.totalSales;
                    mids.push(diff);
                }

                return mids;
            },
            getMostCommonGroups(data, levels) {
                let self = this;
                let tmp = JSON.parse(JSON.stringify(data))
                let currentCount = 0;
                let retval = [];

                for (var i = 0; i < levels; i++) {
                    let currentHighest = 0;
                    let currentHighestString = "";

                    tmp.forEach(el => {
                        let count = tmp.filter(fel => {
                            return self.nearestTenth(fel.cumulativePercent) == self.nearestTenth(el
                                .cumulativePercent);
                        }).length;

                        if (count > currentHighest) {
                            currentHighest = count;
                            currentHighestString = self.nearestTenth(el.cumulativePercent);
                        }
                    })

                    tmp = tmp.filter(fel => {
                        return self.nearestTenth(fel.cumulativePercent) != currentHighestString;
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
            },
            getSuperGroups() {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + `Retailer/Supergroup_A`)
                    .then(r => {
                        delete Axios.defaults.headers.common["TenantID"];

                        let tmp = [];

                        r.data.forEach(el => {
                            tmp.push({
                                text: el.displayname,
                                value: el.id
                            })
                        })

                        self.superGroups = tmp;
                    })
            },
            onSuperGroupChange() {
                let self = this;

                self.$nextTick(() => {
                    self.getData();
                })
            },
            openFile() {
                let self = this;
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

                    if (fileTransaction == null || fileTransaction == false) {
                        let tmp = {
                            store: {},
                            config: {
                                supergroup_a_id: self.selectedSuperGroup
                            }
                        }

                        tmp.store = self.rowData;

                        self.appendAndSaveFile(tmp);
                    } else {
                        self.getFileData(fileTransaction.id, fileData => {
                            let tmp = fileData;

                            if (tmp == false) {
                                tmp = {
                                    store: {},
                                    config: {
                                        supergroup_a_id: self.selectedSuperGroup
                                    }
                                }
                            }

                            if (tmp.store == undefined)
                                tmp.store = {};

                            tmp.store = self.rowData;
                            tmp.config = { supergroup_a_id: self.selectedSuperGroup };

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

    function removeDuplicates(myArr, prop) {
        return myArr.filter((obj, pos, arr) => {
            return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
        });
    }
</script>