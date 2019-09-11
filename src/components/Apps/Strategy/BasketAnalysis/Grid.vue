<template>
    <div>
        <div>
            <ag-grid-vue :gridOptions="gridOptions" style="width: 100%;  height: calc(100vh - 272px);"
                :defaultColDef="defaultColDef" class="ag-theme-balham" :columnDefs="headers" :rowData="rowData"
                :sideBar='true' :enableSorting="true" :enableFilter="true" :suppressRowClickSelection="true"
                :enableRangeSelection="true" rowSelection="multiple" :rowDeselection="true" :enableColResize="true"
                :floatingFilter="true" :groupMultiAutoColumn="true" :onGridReady="onGridReady" :animateRows="true">
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

    import ProgressRenderer from './ProgressRenderer'

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    })

    import Axios from 'axios';

    export default {
        props: ['rowData'],
        components: {
            AgGridVue,
            ProgressRenderer
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

                self.headers = [{
                        "headerName": "Store",
                        "field": "displayname",
                    },
                    {
                        headerName: 'Sales %',
                        cellRendererFramework: "ProgressRenderer",
                        width: 500
                    },
                    {
                        "headerName": "Sales",
                        "field": "sales",
                        valueFormatter: function (params) {
                            return formatter.format(params.value).replace("$", "R");
                        }
                    },
                    {
                        "headerName": "System Basket Group",
                        "field": "level",
                    },
                    {
                        "headerName": "User Basket Group",
                        "field": "userDefinedCluster",
                        "editable": true
                    },
                ]
            }
        }
    }
</script>