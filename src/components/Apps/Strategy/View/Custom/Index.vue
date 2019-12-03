<template>
    <div>
        <v-toolbar dark>
            <v-toolbar-items>
                <v-autocomplete @change="onPlanogramChange" class="pt-0" return-object :items="planograms"
                    v-model="selectedPlanogram" style="width: 300px; margin-top: 15px;" placeholder="Select a planogram"
                    dense hide-details>
                </v-autocomplete>
            </v-toolbar-items>
            <v-spacer></v-spacer>
            <v-toolbar-title>
                Custom
            </v-toolbar-title>
        </v-toolbar>
        <div>
            <ag-grid-vue :gridOptions="gridOptions" style="width: 100%;  height: calc(100vh - 172px);"
                :defaultColDef="defaultColDef" class="ag-theme-balham" :columnDefs="headers" :rowData="rowData"
                :sideBar='true' :enableSorting="true" :enableFilter="true" :suppressRowClickSelection="true"
                :enableRangeSelection="true" rowSelection="multiple" :rowDeselection="true" :enableColResize="true"
                :floatingFilter="true" :groupMultiAutoColumn="true" :onGridReady="onGridReady" :animateRows="true">
            </ag-grid-vue>
        </div>
        <v-toolbar dark flat dense>
            Rows: {{rowData.length}}
        </v-toolbar>
    </div>
</template>
<script>
    import {
        AgGridVue
    } from "ag-grid-vue";

    import ProgressRenderer from './ProgressRenderer'
    import CustomClusterValue from './CustomClusterValue'

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    })

    import Axios from 'axios';

    export default {
        // props: ['rowData'],
        components: {
            AgGridVue,
            ProgressRenderer,
            CustomClusterValue
        },
        data() {
            let self = this;

            return {
                customSystemClusters: [],
                selectedPlanogram: null,
                planograms: [],
                rowData: [],
                selectedSupergroup: null,
                selectedPeriod: null,
                fileData: [],
                headers: [],
                gridOptions: {
                    rowHeight: 35,
                    pinnedTopRowData: [],
                    pinnedBottomRowData: [],
                    context: {
                        componentParent: this
                    },
                    afterFilterChanged: () => console.log("gridOptions.api.inMemoryRowController.rowsAfterFilter"),
                },
                defaultColDef: {
                    onCellValueChanged: this.UpdateLine
                }
            }
        },
        created() {
            let self = this;
            self.setHeaders();
            self.getPlanograms();
        },
        mounted() {
            let self = this
            
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
                            self.openFile()
                        }
                    })
                }
            })

        },
        methods: {
            getStoreClusters() {
                let self = this;

                Axios.get(process.env.VUE_APP_API + "StoreClustering?planogram_ID=" + self.selectedPlanogram.value)
                    .then(r => {
                        self.customSystemClusters = r.data
                        console.log("getStoresWithClusters", r.data);
                    })
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
            getFileData(id, callback) {
                let self = this;
                Axios.get(process.env.VUE_APP_API + `SystemFile/JSON?db=CR-Devinspire&id=${id}`)
                    .then(r => {
                        callback(r.data);
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
            openFile() {
                let self = this;

                let reader = self.fileData[self.$route.params.fileID];
                self.selectedSupergroup = reader.config.selectedSupergroup;
                self.selectedPeriod = reader.config.selectedPeriod;

                if (reader.config.turnoverGroups != undefined && reader.config.turnoverGroups != null) {
                    let tg = reader.config.turnoverGroups;
                    let tgv = reader.config.turnoverGroupUserValues;
                    let updateUser = reader.config.updateUser;

                    self.selectedLevel = tg.length - 1;
                    self.updateUser = (updateUser == undefined || updateUser == null) ? false : updateUser;

                    for (var i = 0; i < tg.length; i++) {
                        self["level" + (i + 1)] = tg[i];
                    }

                    for (var i = 0; i < tgv.length; i++) {
                        self["level" + (i + 1) + "Value"] = tgv[i];
                    }
                }

                self.rowData = reader.data;
            },
            onGridReady(params) {
                let self = this;
                self.gridApi = params.api;
                self.columnApi = params.columnApi;
            },
            setHeaders() {
                let self = this;

                self.headers = [{
                        "headerName": "Store",
                        "field": "displayname",
                    },
                    {
                        headerName: 'Sales %',
                        cellRendererFramework: "ProgressRenderer",
                        width: 500
                    },
                    {
                        "headerName": "Sales",
                        "field": "totalSales",
                        valueFormatter: function (params) {
                            return formatter.format(params.value).replace("$", "R");
                        }
                    },
                    {
                        "headerName": "Cumulative Sales %",
                        "field": "cumulativePercent",
                        valueFormatter: function (params) {
                            return params.value.toFixed(1) + "%";
                        }
                    },
                    {
                        "headerName": "System Turnover Group",
                        "field": "level"
                    },
                    {
                        "headerName": "User Turnover Group",
                        "field": "userDefinedCluster"
                    },
                    {
                        "headerName": "Custom System Clusters",
                        "cellRendererFramework": "CustomClusterValue",
                        "field": "userDefinedCluster"
                    }
                ]
            },
            getPlanograms() {
                let self = this

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + `Planogram/Distinct`)
                    .then(r => {
                        let planograms = r.data.planogramList;
                        self.planograms = [];
                        planograms.forEach(element => {
                            self.planograms.push({
                                text: element.displayname,
                                value: element.id
                            })
                        });

                        self.selectedPlanogram = self.planograms[0]

                        delete Axios.defaults.headers.common["TenantID"];

                        self.getStoreClusters()
                    })
            },
            onPlanogramChange() {
                let self = this;

                self.$nextTick(() => {
                    self.getStoreClusters();
                })
            }
        }
    }
</script>