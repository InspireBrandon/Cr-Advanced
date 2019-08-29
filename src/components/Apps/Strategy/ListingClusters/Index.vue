<template>
    <v-card>
        <v-toolbar dark flat dense color="grey darken-3">
            <v-btn-toggle round v-model="selectedView" class="transparent" mandatory>
                <v-btn class="elevation-0" style="width: 100px" round @click="changeView(0)" color="primary">
                    Store
                </v-btn>
                <v-btn class="elevation-0" style="width: 100px" round @click="changeView(1)" color="primary">
                    Product
                </v-btn>
            </v-btn-toggle>
            <v-spacer></v-spacer>
            <v-toolbar-title>
                Listing Cluster
            </v-toolbar-title>
        </v-toolbar>
        <v-toolbar dark flat>
            <v-toolbar-items>
                <v-autocomplete style="margin-left: 10px; margin-top: 8px; width: 350px" placeholder="Select Planogram"
                    @change="onPlanogramChange" dense :items="planograms" v-model="selectedPlanogram" hide-details>
                </v-autocomplete>
                <v-select label="Primary Cluster" style="margin-left: 10px; margin-top: 8px; width: 150px"
                    placeholder="Item Percentage" @change="onPercentChange" dense :items="primaryClusters"
                    v-model="primaryCluster" hide-details></v-select>
                <v-select @change="onPercentChange" v-if="primaryCluster != 10" label="Secondary Cluster"
                    style="margin-left: 10px; margin-top: 8px; width: 150px" placeholder="Item Percentage" dense
                    :items="secondaryClusters" v-model="secondaryCluster" hide-details>
                </v-select>
                <v-select @change="onPercentChange" label="Groups"
                    style="margin-left: 10px; margin-top: 8px; width: 150px" dense :items="groups" v-model="group"
                    hide-details>
                </v-select>
                <v-select @change="onPercentChange" label="Levels"
                    style="margin-left: 10px; margin-top: 8px; width: 150px" dense :items="levels" v-model="level"
                    hide-details>
                </v-select>
            </v-toolbar-items>
            <v-spacer></v-spacer>
            <v-btn v-if="selectedView!=1" @click="handleResize(0)" color="primary">
                auto Size
            </v-btn>
            <v-btn v-if="selectedView!=0" @click="handleResize(1)" color="primary">
                auto Size
            </v-btn>
        </v-toolbar>
        <storeGrid v-if="selectedView==0  && storeRowData.length > 0" ref="storeGrid" :rowData="storeRowData" />
        <ProductGrid v-if="selectedView==1 && productRowData.length > 0" ref="ProductGrid" :rowData="productRowData"
            :stores="stores" />
        <DateRangeSelector ref="DateRangeSelector" />
        <Spinner ref="Spinner" />
    </v-card>
</template>
<script>
    import Axios from "axios"

    import storeGrid from "./storeGrid"
    import ProductGrid from "./ProductGrid"
    import Spinner from '@/components/Common/Spinner';

    import DateRangeSelector from '@/components/Common/DateRangeSelector';
    import ListingClusterController from './controller.js';

    import {
        AgGridVue
    } from "ag-grid-vue";
    export default {
        components: {
            Spinner,
            ProductGrid,
            storeGrid,
            AgGridVue,
            DateRangeSelector
        },
        data() {
            return {
                selectedView: 1,
                storeRowData: [],
                productRowData: [],
                stores: [],
                planograms: [],
                selectedPlanogram: null,
                headers: [],
                gridOptions: {
                    autoGroupColumnDef: {
                        headerName: 'Product Name', //custom header name for group
                        pinned: 'left', //force pinned left. Does not work in columnDef
                        cellRendererParams: {
                            suppressCount: true, //remove number in Group Column
                        }
                    },
                    rowHeight: 35,
                    pinnedTopRowData: [],
                    pinnedBottomRowData: [],
                    context: {
                        componentParent: this
                    },
                },
                defaultColDef: {

                },
                primaryCluster: 5,
                primaryClusters: [{
                        text: "10%",
                        value: 1
                    },
                    {
                        text: "20%",
                        value: 2
                    },
                    {
                        text: "30%",
                        value: 3
                    },
                    {
                        text: "40%",
                        value: 4
                    },
                    {
                        text: "50%",
                        value: 5
                    },
                    {
                        text: "60%",
                        value: 6
                    },
                    {
                        text: "70%",
                        value: 7
                    },
                    {
                        text: "80%",
                        value: 8
                    },
                    {
                        text: "90%",
                        value: 9
                    },
                    {
                        text: "100%",
                        value: 10
                    },
                ],
                secondaryCluster: 3,
                secondaryClusters: [{
                        text: "10%",
                        value: 1
                    },
                    {
                        text: "20%",
                        value: 2
                    },
                    {
                        text: "30%",
                        value: 3
                    },
                    {
                        text: "40%",
                        value: 4
                    },
                    {
                        text: "50%",
                        value: 5
                    },
                    {
                        text: "60%",
                        value: 6
                    },
                    {
                        text: "70%",
                        value: 7
                    },
                    {
                        text: "80%",
                        value: 8
                    },
                    {
                        text: "90%",
                        value: 9
                    },
                    {
                        text: "100%",
                        value: 10
                    },
                ],
                level: 3,
                levels: [1, 2, 3, 4, 5],
                group: 3,
                groups: [1, 2, 3],
                salesData: null
            }
        },
        created() {
            this.getPlanograms()
        },
        methods: {
            handleResize(type) {
                let self = this
                if (type == 1) {
                    self.$refs.ProductGrid.autoSize()
                } else {
                    self.$refs.storeGrid.autoSize()
                }
            },
            changeView(type) {
                let self = this
                self.selectedView = type;
            },
            onPlanogramChange() {
                let self = this;

                if (self.selectedPlanogram != null) {
                    self.$refs.Spinner.show()
                    self.$nextTick(() => {

                        Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                        Axios.get(process.env.VUE_APP_API +
                                `ListingCluster?planogram_ID=${self.selectedPlanogram}&period_from_id=${53}&period_to_id=${58}`
                            )
                            .then(r => {
                                delete Axios.defaults.headers.common["TenantID"];

                                self.salesData = r.data;

                                self.onPercentChange();

                                self.$refs.Spinner.hide()
                            })
                    })
                }
            },
            onPercentChange() {
                let self = this;

                self.$nextTick(() => {
                    if (self.secondaryCluster != null) {
                        let lcData = ListingClusterController.GenerateClusterOutput({
                            storeSalesData: self.salesData,
                            primaryCluster: self.primaryCluster,
                            secondaryCluster: self.secondaryCluster,
                            clusterLevels: self.level,
                            clusterGroups: self.group
                        });

                        self.storeRowData = lcData.storeData;
                        self.stores = lcData.stores;

                        self.productRowData = [];
                        self.productRowData = lcData.productData;
                    }
                })
            },
            getPlanograms() {
                let self = this
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + `Planogram/Distinct`)
                    .then(r => {
                        self.planograms = []
                        r.data.planogramList.forEach(e => {
                            self.planograms.push({
                                text: e.displayname,
                                value: e.id
                            })
                        })
                        delete Axios.defaults.headers.common["TenantID"];
                    })
            }
        }
    }
</script>

<style scoped>

</style>