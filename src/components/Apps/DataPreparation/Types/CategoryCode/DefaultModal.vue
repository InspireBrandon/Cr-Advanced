<template>
    <v-dialog persistent width=60% v-model="dialog">
        <v-card>
            <v-toolbar dark flat color="primary">
                <v-toolbar-title>
                    Assign Default
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="dialog=false">
                    <v-icon>
                        close
                    </v-icon>
                </v-btn>
            </v-toolbar>
            <v-toolbar dark flat dense>
            </v-toolbar>
            <v-toolbar dark flat dense color="grey darken-3">
                <v-toolbar-items>
                    <v-text-field style="margin-top: -6px;" hide-details placeholder="search" append-icon="search"></v-text-field>
                </v-toolbar-items>
                <v-spacer />
                <v-btn color="success" @click="assignDefaults">
                    assign defaults
                </v-btn>
            </v-toolbar>
            <div v-if="rowData.length>0">
                <ag-grid-vue :gridOptions="gridOptions" style="width: 100%;  height: calc(100vh - 400px);"
                    :defaultColDef="defaultColDef" class="ag-theme-balham" :columnDefs="headers" :rowData="rowData"
                    :enableSorting="true" :enableFilter="true" :suppressRowClickSelection="true"
                    :enableRangeSelection="true" rowSelection="multiple" :rowDeselection="true" :enableColResize="true"
                    :floatingFilter="true" :groupMultiAutoColumn="true" :onGridReady="onGridReady">
                </ag-grid-vue>
            </div>
        </v-card>
    </v-dialog>
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
                dialog: false,
                headers: [{
                        "headerName": "Category_Code",
                        "field": "category_Code",
                        "width": 50
                    }, {
                        "headerName": "Category",
                        "field": "category",
                        "width": 150
                    }, {
                        "headerName": "Planogram Import Name",
                        "field": "default_Planogram",
                        "editable": true,
                    }
                    // {
                    //     "headerName": "Supergroup_A_ID",
                    //     "field": "supergroup_A_ID"
                    // },{
                    //     "headerName": "Supergroup_B_ID",
                    //     "field": "supergroup_B_ID"
                    // },

                ],
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
            let self = this
            self.getData()
        },
        methods: {

            show() {
                let self = this
                console.log("show");
                self.dialog = true;
                this.gridApi.resetRowHeights();
                this.gridApi.sizeColumnsToFit()
            },
            onGridReady(params) {
                let self = this;
                self.gridApi = params.api;
                self.columnApi = params.columnApi;
                this.gridApi.resetRowHeights();
                this.gridApi.sizeColumnsToFit()
            },
            getData() {
                let self = this
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + `Retailer/Category_Link/Default`)
                    .then(r => {
                        console.log(r);

                        self.rowData = r.data;
                        delete Axios.defaults.headers.common["TenantID"];
                    })
            },
            assignDefaults() {
                let self = this
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.post(process.env.VUE_APP_API + `Retailer/Category_Link/Default`, self.rowData).then(r => {
                    console.log(r);
                    self.getData()
                    delete Axios.defaults.headers.common["TenantID"];
                })
            },
        },
    }
</script>