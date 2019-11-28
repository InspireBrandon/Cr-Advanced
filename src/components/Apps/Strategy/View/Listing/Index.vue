<template>
    <div>
        <v-toolbar dark>
            <v-toolbar-title>
                Listing Cluster
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <!-- <div v-if="selectedBasket != null">{{ generateName() }}</div> -->
            <v-spacer></v-spacer>

        </v-toolbar>
        <ag-grid-vue :gridOptions="gridOptions" style="width: 100%;  height: calc(100vh - 172px);"
            :defaultColDef="defaultColDef" class="ag-theme-balham" :columnDefs="headers" :rowData="rowData"
            :sideBar='true' :enableSorting="true" :enableFilter="true" :suppressRowClickSelection="true"
            :enableRangeSelection="true" rowSelection="multiple" :rowDeselection="true" :enableColResize="true"
            :floatingFilter="true" :groupMultiAutoColumn="true" :onGridReady="onGridReady">
        </ag-grid-vue>
        <v-toolbar dark flat dense>
            Rows: {{rowData.length}}
        </v-toolbar>
    </div>
</template>
<script>
    import Axios from "axios"
    import progressRenderer from "./progressRenderer";
    import {
        AgGridVue
    } from "ag-grid-vue";
    export default {
        components: {
            AgGridVue,
            progressRenderer
        },
        // props: ["rowData"],
        data() {
            return {
                rowData: [],
                gridOptions: {
                    autoGroupColumnDef: {
                        headerName: 'Product Name', //custom header name for group
                        pinned: 'left', //force pinned left. Does not work in columnDef
                        cellRendererParams: {
                            suppressCount: true, //remove number in Group Column
                        }
                    },
                    pinnedTopRowData: [],
                    pinnedBottomRowData: [],
                    context: {
                        componentParent: this
                    },
                },
                defaultColDef: {

                },
                headers: [{
                    headerName: 'Store Name',
                    field: 'storeName'
                }, {
                    headerName: 'Formula 1',
                    field: 'level1Code',
                    hide: true
                }, {
                    headerName: 'Formula 2',
                    field: 'level2Code',
                    hide: true
                }, {
                    headerName: 'Formula 3',
                    field: 'level3Code',
                    hide: true
                }, {
                    headerName: 'Current Rank',
                    field: 'currentRank'
                }, {
                    headerName: 'Cluster',
                    field: 'cluster'
                }]
            }
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
            generateNameParams(selectedSupergroup, selectedPeriod) {
                let self = this;

                if (selectedPeriod.periodic) {
                    return `${selectedSupergroup.displayname} - ${selectedPeriod.monthsBetween} MMA (${selectedPeriod.dateFromString} TO ${selectedPeriod.dateToString})`;
                } else {
                    return `${selectedSupergroup.displayname} Average Monthly ${selectedPeriod.dateFromString} TO ${selectedPeriod.dateToString}`;
                }
            },
            openFile() {
                let self = this;
                console.log(self.$route.params);


                let reader = self.fileData[self.$route.params.fileID];
                self.selectedBasket = reader.config.selectedBasket;
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
            getFileData(id, callback) {
                let self = this;
                Axios.get(process.env.VUE_APP_API + `SystemFile/JSON?db=CR-Devinspire&id=${id}`)
                    .then(r => {
                        console.log("getFileData", r.data);

                        callback(r.data);
                    })
            },
            getFile(callback) {
                let self = this;

                Axios.get(process.env.VUE_APP_API +
                        `SystemFile/JSON?db=CR-Devinspire&folder=CLUSTER REPORT&file=REPORT`)
                    .then(r => {
                        console.log("getFile", r.data);

                        callback(r.data);
                    })
            },
            autoSize() {
                let self = this;
                var allColumnIds = [];
                self.columnApi.getAllColumns().forEach(function (column) {
                    allColumnIds.push(column.colId);
                });
                self.columnApi.autoSizeColumns(allColumnIds);
            },
            autoSizeAll() {
                let self = this;
                var allColumnIds = [];
                self.columnApi.getAllColumns().forEach(function (column) {
                    allColumnIds.push(column.colId);
                });
                self.columnApi.autoSizeColumns(allColumnIds);
            },
            onGridReady(params) {
                this.gridApi = params.api;
                this.columnApi = params.columnApi;
                this.gridApi.sizeColumnsToFit()
            },
        },
    }
</script>