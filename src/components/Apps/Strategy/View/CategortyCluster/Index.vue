<template>
    <div>
        <v-toolbar dark>
            <v-toolbar-title>
                Category
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
    import Axios from 'axios'

    import {
        AgGridVue
    } from "ag-grid-vue";
    import DeptRenderer from "../../Brand/DeptRenderer";
    import progressRenderer from "../../Brand/progressRenderer";

    export default {
        components: {
            AgGridVue,
            DeptRenderer,
            progressRenderer
        },
        // props: ["rowData", "stores","headers"],
        data() {
            return {
                rowData: [],
                fileData: [],
                salesData: null,
                selectedPlanogram: null,
                selectedCategory: null,
                selectedPeriod: null,
                primaryCluster: null,
                secondaryCluster: null,
                level: null,
                group: null,
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

            }
        },
        mounted() {
            let self = this;

            self.getFile(data => {
                if (data != null && data != false) {
                    self.getFileData(data.id, fileData => {
                        self.runData = [];

                        self.fileData = fileData.categoryCluster;

                        for (var prop in fileData.categoryCluster) {
                            self.runData.push({
                                prop: prop,
                                name: prop
                            })
                        }
                        self.openFile()
                    })
                }
            })
        },
        methods: {
            getFile(callback) {
                let self = this;

                Axios.get(process.env.VUE_APP_API +
                        `SystemFile/JSON?db=CR-Devinspire&folder=Category Cluster&file=REPORT`)
                    .then(r => {
                        callback(r.data);
                    })
            },
            getFileData(id, callback) {
                let self = this;

                Axios.get(process.env.VUE_APP_API + `SystemFile/JSON?db=CR-Devinspire&id=${id}`)
                    .then(r => {
                        callback(r.data);
                    })
            },
            openFile() {
                let self = this;

                let item = self.$route.params
                let data = self.fileData[item.name];

                self.salesData = data.data;
                self.selectedPlanogram = data.config.selectedPlanogram;
                self.selectedCategory = data.config.selectedCategory;
                self.selectedPeriod = data.config.selectedPeriod;
                self.primaryCluster = data.config.primaryCluster;
                self.secondaryCluster = data.config.secondaryCluster;
                self.level = data.config.level;
                self.group = data.config.group;



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
                // this.gridApi.sizeColumnsToFit()
            },
        },
    }
</script>