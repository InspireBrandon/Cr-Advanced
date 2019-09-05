<template>
    <div>
        <ag-grid-vue :gridOptions="gridOptions" :sideBar='false' style="width: 100%;  height: calc(100vh - 64px);"
            :defaultColDef="defaultColDef" class="ag-theme-balham" :columnDefs="headers" :rowData="data"
            :enableSorting="true" :enableFilter="true" :suppressRowClickSelection="true" :enableRangeSelection="true"
            rowSelection="multiple" :rowDeselection="true" :enableColResize="true" :floatingFilter="true"
            :onGridReady="onGridReady">
        </ag-grid-vue>
    </div>
</template>
<script>
    import jwt from 'jsonwebtoken';
    import Axios from 'axios'
    import {
        AgGridVue
    } from "ag-grid-vue";
    export default {
        props: ['data'],
        components: {
            AgGridVue,
        },
        data() {
            return {
                selectedItems: [],
                headers: [{
                    "headerName": "Store Name",
                    "field": "displayname"

                }, {
                    "headerName": "Level",
                    "field": "cluster"
                }, {
                    "headerName": "% Store",
                    "field": "percentage"
                }, {
                    "headerName": "% Basket",
                    "field": "basketSalesPercentage"
                }, {
                    "headerName": "Sales",
                    "field": "sales",
                    // valueFormatter: function (params) {
                    //         return formatter.format(params.value).replace("$", "R");
                    //     }
                }],
                defaultColDef: {
                    // onCellValueChanged: this.UpdateLine
                },
                gridOptions: {
                    context: {
                        componentParent: this
                    },

                },
            }
        },
        created() {},
        methods: {
            resize() {
                this.gridApi.sizeColumnsToFit()
            },
            onGridReady(params) {
                this.gridApi = params.api;
                this.columnApi = params.columnApi;
                this.gridApi.sizeColumnsToFit()
            }
        }
    }
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    })
</script>

<style>
</style>