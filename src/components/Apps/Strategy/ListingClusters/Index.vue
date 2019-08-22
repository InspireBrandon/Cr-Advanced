<template>
    <div>
        <v-toolbar dark flat dense color="grey darken-3">
            <v-btn-toggle v-model="selectedView" class="transparent" mandatory>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <v-btn  @click="changeView(0)" color="pink">
                            Product
                        </v-btn>
                    </template>
                    <span>Data-Prep</span>
                </v-tooltip>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <v-btn  @click="changeView(1)" color="pink">
                            Store
                        </v-btn>
                    </template>
                    <span>Ranging</span>
                </v-tooltip>
            </v-btn-toggle>
            <v-spacer></v-spacer>
            <v-toolbar-title>
                Listing Clusters
            </v-toolbar-title>
        </v-toolbar>
        <v-toolbar dark flat>
            <v-toolbar-items>
                <v-autocomplete style="margin-left: 10px; margin-top: 8px; width: 300px" placeholder="Select Planogram"
                    @change="onPlanogramChange" dense :items="planograms" v-model="selectedPlanogram" hide-details>
                </v-autocomplete>
                <v-select label="Category Percent" style="margin-left: 10px; margin-top: 8px; width: 150px"
                    placeholder="Item Percentage" @change="onPlanogramChange" dense :items="percentages"
                    v-model="selectedPercentage" hide-details></v-select>
            </v-toolbar-items>
            <v-spacer></v-spacer>
            <v-btn v-if="selectedView!=1" @click="handleResize(0)" color="primary">
                auto Size
            </v-btn>
            <v-btn v-if="selectedView!=0" @click="handleResize(1)" color="primary">
                auto Size
            </v-btn>
        </v-toolbar>
        <ProductGrid v-if="selectedView==0" ref="ProductGrid" :rowData="productRowData" :stores="stores" />
        <storeGrid v-if="selectedView==1" ref="storeGrid" :rowData="storeRowData" />
        <DateRangeSelector ref="DateRangeSelector" />
        <Spinner ref="Spinner" />
    </div>
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
                percentages: [{
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
                selectedPercentage: 2
            }
        },
        created() {
            this.getPlanograms()
        },
        methods: {
            handleResize(type) {
                let self = this
                if (type == 0) {
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

                                let lcData = ListingClusterController.GenerateClusterOutput({
                                    storeSalesData: r.data,
                                    levels: self.selectedPercentage
                                });

                                self.storeRowData = lcData.totalStoreProductSales;
                                self.productRowData = lcData.productData;
                                self.stores = lcData.stores;

                                self.$refs.Spinner.hide()
                            })
                    })
                }
            },
            getPlanograms() {
                let self = this
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + `Planogram/Distinct`)
                    .then(r => {
                        console.log(r);
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