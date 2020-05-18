<template>
    <div>
        <v-container fluid class="pa-0 ma-0" grid-list-md>
            <v-layout row wrap class="pa-0 ma-0">
                <v-flex md12 class="pa-0 ma-0">
                    <v-toolbar flat dense dark>
                        <v-toolbar-title>Test Range</v-toolbar-title>
                    </v-toolbar>
                    <v-toolbar flat dense dark color="grey darken-3">
                        <v-toolbar-items>
                            <v-btn flat>File</v-btn>
                            <v-menu offset-y>
                                <v-btn slot="activator" flat>Setup</v-btn>
                                <v-list dense>
                                    <v-list-tile @click="editCluster">
                                        <v-list-tile-title>Cluster</v-list-tile-title>
                                    </v-list-tile>
                                </v-list>
                            </v-menu>
                            <v-select style="margin-left: 20px; margin-top: -5px; width: 300px"
                                placeholder="Select cluster type" @change="getReport" dense :items="temporaryClusters"
                                v-model="selectedTemp" hide-details></v-select>
                        </v-toolbar-items>
                    </v-toolbar>
                    <ag-grid-vue id="ag-Grid" :gridOptions="gridOptions"
                        style="width: 100%;  height: calc(100vh - 160px);" :defaultColDef="defaultColDef"
                        class="ag-theme-balham" :columnDefs="columnDefs" :rowData="rowData" :sortable="true"
                        :filter="true" :suppressRowClickSelection="true" :enableColResize="true"
                        :enableRangeSelection="true" rowSelection="multiple" :rowDeselection="true" :resizable="true"
                        :floatingFilter="true" :groupMultiAutoColumn="true" :onGridReady="onGridReady"></ag-grid-vue>
                </v-flex>
            </v-layout>
        </v-container>
        <TmpStoreClusterModal ref="tmpStoreClusterModal" />
        <Loader ref="loader" />
    </div>
</template>

<script>
    import Axios from "axios";
    import TmpStoreClusterModal from "./TmpStoreClusterModal/Index.vue";
    import Loader from "./loader.vue";

    import {
        AgGridVue
    } from "ag-grid-vue";

    export default {
        data() {
            return {
                selectedCategory: null,
                filterText: "",
                clusterLinkDetails: "",
                items: [],
                Category_Link: [],
                pageNumber: 0,
                allowedRecords: 25,
                store_Cluster: [],
                columnDefs: [{
                        headerName: "Planogram",
                        field: "planogram",
                        sortable: true
                    },
                    {
                        headerName: "Active Shop Code",
                        field: "activeShopCode",
                        sortable: true
                    },
                    {
                        headerName: "Barcode",
                        field: "barcode",
                        sortable: true
                    },
                    {
                        headerName: "Product System ID",
                        field: "product_System_ID",
                        sortable: true
                    },
                    {
                        headerName: "Description",
                        field: "description",
                        sortable: true
                    },
                    {
                        headerName: "Test Indicator",
                        field: "testIndicator",
                        sortable: true
                    },
                    {
                        headerName: "Actual Indicator",
                        field: "currentIndicator",
                        sortable: true
                    }
                ],
                rowData: [],
                defaultColDef: {
                    onCellValueChanged: this.UpdateStoreCluster
                },
                gridOptions: {
                    rowHeight: 35,
                    pinnedTopRowData: [],
                    pinnedBottomRowData: [],
                    context: {
                        componentParent: this
                    },
                    rowClassRules: {
                        "disabled-line": "data.can_edit"
                    }
                },
                temporaryClusters: [],
                selectedTemp: null
            };
        },
        components: {
            AgGridVue,
            TmpStoreClusterModal,
            Loader
        },
        created() {
            let self = this;
            self.gridOptions.context.componentParent = this;
            self.getTemporaryClusters();
        },
        methods: {
            onFilterTextBoxChanged() {
                let self = this;
                self.gridApi.setQuickFilter(self.filterText);
            },
            onGridReady(params) {
                let self = this;
                self.gridApi = params.api;
                self.columnApi = params.columnApi;
            },
            getReport() {
                let self = this;

                self.$refs.loader.show();

                var config = {
                    onDownloadProgress(progressEvent) {
                        if(progressEvent.lengthComputable) {
                            self.$refs.loader.update(progressEvent.loaded, progressEvent.total);
                        }
                    }
                };

                self.$nextTick(() => {
                    Axios.get(
                            process.env.VUE_APP_API +
                            "TestIndicator/Report?clusterID=" +
                            self.selectedTemp, config
                        )
                        .then(r => {
                            self.rowData = r.data;
                            self.$refs.loader.hide();
                        })
                        .catch(e => {
                            self.$refs.loader.hide();
                        });
                });
            },
            getTemporaryClusters() {
                let self = this;

                Axios.get(process.env.VUE_APP_API + "Clusters/TemporaryClusterActual")
                    .then(r => {
                        self.temporaryClusters = r.data;
                        self.selectedTemp = self.temporaryClusters[0].value;
                        self.getReport();
                    })
                    .catch(e => {});
            },
            editCluster() {
                let self = this;

                self.$refs.tmpStoreClusterModal.show(() => {});
            }
        }
    };
</script>