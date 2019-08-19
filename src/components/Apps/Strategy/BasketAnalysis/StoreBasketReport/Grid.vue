<template>
    <div>
        <ag-grid-vue :gridOptions="gridOptions" :sideBar='false' style="width: 100%;  height: 500px;"
            :defaultColDef="defaultColDef" class="ag-theme-balham" :columnDefs="headers" :rowData="rowData"
            :enableSorting="true" :enableFilter="true" :suppressRowClickSelection="true" :enableRangeSelection="true"
            rowSelection="multiple" :rowDeselection="true" :enableColResize="true" :floatingFilter="true"
            :onGridReady="onGridReady" :groupMultiAutoColumn="true">
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
        props: ["rowData"],
        components: {
            AgGridVue,
        },
        data() {
            return {
                selectedItems: [],
                headers: [{
                    "headerName": "Store Name",
                    "field": "storeName"

                }, {
                    "headerName": "Premium Nature",
                    "field": "premiumNature"
                }, {
                    "headerName": "Basket Percentage",
                    "field": "basketPercentage"
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
        created() {
        },
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
</script>

<style>
</style>