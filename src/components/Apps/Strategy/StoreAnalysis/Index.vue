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
                items: [],
                filterText: null,
                rowData: [],
                storeAnalysiss: [],
                selectedstoreAnalysis: null,
                projectGroups: [],
                selectedProjectGroup: null,
                storeAnalysis_ID: null,
                superGroups: [],
                selectedSuperGroup: null
            }
        },
        created() {
            let self = this;
            self.getSuperGroups();
        },
        methods: {
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
                let levels = ["HIGH", "MEDIUM", "LOW"]

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
                                    // find closest
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

                    // Handle Low Values ERROR
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
                    let mp = Math.ceil((levelDescrep * (i + 1)) / 2);
                    let val = data[mp].totalSales
                    mids.push(val);
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
                    console.log(fileTransaction);

                    if (fileTransaction == null || fileTransaction == false) {
                        let tmp = {
                            store: {}
                        }

                        tmp.store = self.rowData;

                        self.appendAndSaveFile(tmp);
                    } else {
                        self.getFileData(fileTransaction.id, fileData => {
                            let tmp = fileData;
                            console.log("tmp");
                            console.log(tmp);
                            if (tmp == false) {
                                tmp = {
                                    store: {}
                                }
                            }
                            if (tmp.store == undefined)
                                tmp.store = {};

                            tmp.store = self.rowData;

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