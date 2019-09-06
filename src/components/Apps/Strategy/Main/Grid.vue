<template>
    <div>
        <div>
            <ag-grid-vue :gridOptions="gridOptions" style="width: 100%;  height: calc(100vh - 272px);"
                :defaultColDef="defaultColDef" class="ag-theme-balham" :columnDefs="headers" :rowData="rowData" 
                :sideBar='true' :enableSorting="true" :enableFilter="true" :suppressRowClickSelection="true"
                :enableRangeSelection="true" rowSelection="multiple" :rowDeselection="true" :enableColResize="true"
                :floatingFilter="true" :groupMultiAutoColumn="true" :onGridReady="onGridReady">
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

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    })

    import Axios from 'axios';

    export default {
        props: ['rowData'],
        components: {
            AgGridVue
        },
        data() {
            let self = this;

            return {
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
        },
        methods: {
            onGridReady(params) {
                let self = this;
                self.gridApi = params.api;
                self.columnApi = params.columnApi;
            },
            setHeaders() {
                let self = this;

                self.headers = [
                    {
                        "headerName": "Store",
                        "field": "displayname",
                    },
                    {
                        "headerName": "Basket",
                    },
                    {
                        "headerName": "Listing",
                    },
                    {
                        "headerName": "Store",
                    }
                ]
            }
        }
    }
</script>