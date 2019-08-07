<template>
    <div>
        <v-toolbar dark flat dense>
            <v-toolbar-title>
                Premium Nature
            </v-toolbar-title>
        </v-toolbar>
        <div v-if="rowData.length>0">
            <ag-grid-vue :gridOptions="gridOptions" style="width: 100%;  height: calc(100vh - 130px);"
                :defaultColDef="defaultColDef" class="ag-theme-balham" :columnDefs="headers" :rowData="rowData"
                :enableSorting="true" :enableFilter="true" :suppressRowClickSelection="true"
                :enableRangeSelection="true" rowSelection="multiple" :rowDeselection="true" :enableColResize="true"
                :floatingFilter="true" :groupMultiAutoColumn="true" :onGridReady="onGridReady">
            </ag-grid-vue>
        </div>


    </div>
</template>
<script>
    import {
        AgGridVue
    } from "ag-grid-vue";
    export default {
        components: {
            AgGridVue
        },
        data() {
            return {
                rowData: [{storeName:"asd",
                premiumNature:"high",
                }],
                headers: [{
                    "headerName": "Store Name",
                    "field": "storeName"
                }, {
                    "headerName": "Premium Nature",
                    "field": "premiumNature"
                }, {
                    "headerName": "% Premium Basket",
                    "field": "premiumBasketPercentage"
                }],
                gridOptions: {
                    rowHeight: 35,
                    pinnedTopRowData: [],
                    pinnedBottomRowData: [],
                    context: {
                        componentParent: this
                    },
                },
                defaultColDef: {
                    // onCellValueChanged: this.UpdateLine
                }
            }
        },
        methods: {
            onGridReady(params) {
                let self = this;
                self.gridApi = params.api;
                self.columnApi = params.columnApi;
                this.gridApi.resetRowHeights();
                this.gridApi.sizeColumnsToFit()
            },
        }

    }
</script>