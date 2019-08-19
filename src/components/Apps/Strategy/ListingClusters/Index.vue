<template>
    <div>
        <v-toolbar dark flat dense color="grey darken-3">
            <v-spacer></v-spacer>
            <v-toolbar-title>
                Listing Clusters
            </v-toolbar-title>
        </v-toolbar>
        <v-toolbar dark flat>
            <v-toolbar-items>
                <v-autocomplete style="margin-left: 10px; margin-top: 8px; width: 200px" placeholder="Select Planogram"
                    @change="onPlanogramChange" dense :items="planograms" v-model="selectedPlanogram" hide-details>
                </v-autocomplete>
            </v-toolbar-items>
        </v-toolbar>

        <ag-grid-vue :gridOptions="gridOptions" style="width: 100%;  height: calc(100vh - 175px);"
            :defaultColDef="defaultColDef" class="ag-theme-balham" :columnDefs="headers" :rowData="rowData"
            :sideBar='true' :enableSorting="true" :enableFilter="true" :suppressRowClickSelection="true"
            :enableRangeSelection="true" rowSelection="multiple" :rowDeselection="true" :enableColResize="true"
            :floatingFilter="true" :groupMultiAutoColumn="true" :onGridReady="onGridReady">
        </ag-grid-vue>
    </div>
</template>
<script>
    import Axios from "axios"

    import {
        AgGridVue
    } from "ag-grid-vue";
    export default {
        components: {
            AgGridVue
        },
        data() {
            return {
                rowData: [],
                planograms: [],
                selectedPlanogram: null,
                headers: [],
                gridOptions: {
                    rowHeight: 35,
                    pinnedTopRowData: [],
                    pinnedBottomRowData: [],
                    context: {
                        componentParent: this
                    },
                },
                defaultColDef: {
                    onCellValueChanged: this.UpdateLine
                }
            }
        },
        created() {
            this.getPlanograms()
        },
        methods: {
            onGridReady(params) {
                this.gridApi = params.api;
                this.columnApi = params.columnApi;
                this.gridApi.sizeColumnsToFit()
            },
            onPlanogramChange() {
                let self = this
                self.$nextTick(() => {
                    //get data
                    //      Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                    // Axios.get(process.env.VUE_APP_API + `Planogram/Distinct`)
                    //     .then(r => {
                    //         console.log(r);
                    //         self.planograms = []
                    //         r.data.planogramList.forEach(e => {
                    //             self.planograms.push({
                    //                 text: e.displayname,
                    //                 value: e.id
                    //             })
                    //         })
                    //         delete Axios.defaults.headers.common["TenantID"];
                    // })
                })
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