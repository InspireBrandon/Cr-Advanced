<template>
    <div>
        <v-toolbar dark>
            <v-toolbar-title>
                Department Cluster
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
        <Spinner ref="Spinner" />

    </div>
</template>
<script>
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    })
    import Axios from 'axios'

    import {
        AgGridVue
    } from "ag-grid-vue";
    import DeptRenderer from "./DeptRenderer";
    import progressRenderer from "../../Brand/progressRenderer";
    import Spinner from '@/components/Common/Spinner';
    import ListingClusterController from '../../Department/controller.js';


    export default {
        components: {
            AgGridVue,
            DeptRenderer,
            progressRenderer,
            Spinner
        },
        // props: ["rowData", "stores","headers"],
        data() {
            return {
                rowData: [],
                fileData: [],
                headers: [],
                ProjectGroups: [],
                storeRowData: [],
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
            onPercentChange() {
                let self = this
                self.$refs.Spinner.show()

                if (self.secondaryCluster != null) {
                    let lcData = ListingClusterController.GenerateClusterOutput({
                        storeSalesData: self.salesData,
                        primaryCluster: self.primaryCluster,
                        secondaryCluster: self.secondaryCluster,
                        clusterLevels: self.level,
                        clusterGroups: self.group,
                        selectedCategory: self.selectedCategory
                    });
                    self.storeRowData = lcData.storeData;
                    self.rowData = lcData.ProjectGroupData;
                    self.stores = lcData.stores;
                    self.ProjectGroups = lcData.ProjectGroups

                    self.setHeaders()
                    self.$refs.Spinner.hide()
                }
            },
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
                let data = self.fileData[item.fileID];

                self.salesData = data.data;
                self.selectedPlanogram = data.config.selectedPlanogram;
                self.selectedCategory = data.config.selectedCategory;
                self.selectedPeriod = data.config.selectedPeriod;
                self.primaryCluster = data.config.primaryCluster;
                self.secondaryCluster = data.config.secondaryCluster;
                self.level = data.config.level;
                self.group = data.config.group;
                self.onPercentChange();



            },

            setHeaders() {
                let self = this;
                let tmpCategory = null
                switch (self.selectedCategory) {
                    case 0:
                        tmpCategory = "category"
                        break;
                    case 1:
                        tmpCategory = "subcategory"
                        break;
                    case 2:
                        tmpCategory = "brand"
                        break;
                    case 3:
                        tmpCategory = "manufacturer"
                        break;
                    case 4:
                        tmpCategory = "supplier"
                        break;
                    case 5:
                        tmpCategory = "size_Description"
                        break;

                    default:
                        break;
                }

                let tmp = [{
                        headerName: 'Store Name',
                        field: 'storeName'
                    },
                    {
                        headerName: 'Total Sales',
                        field: 'totalStoreSales',
                        valueFormatter: function (params) {
                            return formatter.format(params.value).replace("$", "R");
                        }
                    }, {
                        headerName: 'Cumulative Sales',
                        cellRendererFramework: "progressRenderer"
                    },
                    {
                        headerName: 'Cluster',
                        field: 'levelText'
                    },
                    {
                        headerName: 'Stack bar',
                        cellRendererFramework: "DeptRenderer",
                        width: 220
                    },
                    {
                        headerName: "Cumulative Sales",
                        field: "cumulativStoreSales",
                        cellStyle: function (params) {
                            if (params.data.canHighlight) {
                                if (params.data.highlightLevel == 1) {
                                    return {
                                        backgroundColor: "#9c9c9c"
                                    };
                                }

                                if (params.data.highlightLevel == 2) {
                                    return {
                                        backgroundColor: "#b9b9b9"
                                    };
                                }

                                if (params.data.highlightLevel == 3) {
                                    return {
                                        backgroundColor: "#e0e0e0"
                                    };
                                }
                            }
                        }
                    }
                ]

                self.ProjectGroups.forEach((projectGroup, idx) => {
                    if (idx == 0) {
                        let tmp = self.rowData
                        self.rowData = tmp.sort((a, b) => {
                            if (a[projectGroup[tmpCategory] + "_ratio"] > b[projectGroup[tmpCategory] +
                                    "_ratio"]) {
                                return -1;
                            }
                            if (a[projectGroup[tmpCategory] + "_ratio"] < b[projectGroup[tmpCategory] +
                                    "_ratio"]) {
                                return 1;
                            }
                            return 0;
                        })
                    }
                    tmp.push({
                        headerName: projectGroup[tmpCategory],
                        children: [{
                                headerName: "Ratio",
                                width: 100,
                                "valueFormatter": function (params) {
                                    if (params.data[projectGroup[tmpCategory] +
                                            "_inStore"] ==
                                        false) {
                                        return 0
                                    } else {
                                        return ((parseFloat(params.data[projectGroup[
                                                tmpCategory] + "_ratio"])) * 100)
                                            .toFixed(2)
                                    }
                                },
                                cellStyle: function (params) {
                                    if (projectGroup.canHighlight) {

                                        if (projectGroup.highlightLevel == 1) {
                                            return {
                                                backgroundColor: "#5ef35e86"
                                            };
                                        }

                                        if (projectGroup.highlightLevel == 2) {
                                            return {
                                                backgroundColor: "#5ef35e40"
                                            };
                                        }

                                        if (projectGroup.highlightLevel == 3) {
                                            return {
                                                backgroundColor: "#5ef35e17"
                                            };
                                        }
                                    }
                                }
                            },
                            {
                                headerName: "In Store",
                                field: projectGroup[tmpCategory] + "_inStore",
                                width: 100,
                                valueFormatter: function (params) {
                                    return formatter.format(params.value).replace("$",
                                        "R");
                                },
                                cellStyle: function (params) {
                                    if (projectGroup.canHighlight) {

                                        if (projectGroup.highlightLevel == 1) {
                                            return {
                                                backgroundColor: "#5ef35e86"
                                            };
                                        }

                                        if (projectGroup.highlightLevel == 2) {
                                            return {
                                                backgroundColor: "#5ef35e40"
                                            };
                                        }

                                        if (projectGroup.highlightLevel == 3) {
                                            return {
                                                backgroundColor: "#5ef35e17"
                                            };
                                        }
                                    }
                                }
                            },
                            {
                                headerName: "Level",
                                field: projectGroup[tmpCategory] + "_level",
                                width: 100,
                            }
                        ]
                    })
                })
                self.headers = tmp;
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