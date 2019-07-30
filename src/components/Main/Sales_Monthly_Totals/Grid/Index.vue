<template>
    <div>
        <ag-grid-vue :gridOptions="gridOptions" :sideBar='false' style="width: 100%;  height: calc(100vh - 128px);"
            :defaultColDef="defaultColDef" class="ag-theme-balham" :columnDefs="headers" :rowData="rowData"
            :enableSorting="true" :enableFilter="true" :suppressRowClickSelection="true" :enableRangeSelection="true"
            rowSelection="multiple" :rowDeselection="true" :enableColResize="true" :floatingFilter="true"
            :onGridReady="onGridReady" :groupMultiAutoColumn="true">
        </ag-grid-vue>
    </div>
</template>

<script>
    import {
        AgGridVue
    } from "ag-grid-vue";

    export default {
        props: ["rowData"],

        components: {
            AgGridVue
        },
        data() {
            return {
                defaultColDef: {
                    onCellValueChanged: this.updateCheck
                },
                gridOptions: {
                    rowHeight: 35,
                    context: {
                        componentParent: this
                    },
                    rowClassRules: {
                        'audit-image-breach': 'data.imageAudit'
                    }
                },
                headers: [{
                        "headerName": "Period From",
                        "field": "period_From_String"
                    },
                    {
                        "headerName": "Period To",
                        "field": "period_To_String"
                    },
                    {
                        "headerName": "Sales Retail",
                        "field": "sales_Retail"
                    },
                    {
                        "headerName": "Sales Cost",
                        "field": "sales_Cost"
                    },
                    {
                        "headerName": "Sales Units",
                        "field": "sales_Units"
                    },
                    {
                        "headerName": "Sales Profit",
                        "field": "sales_Profit"
                    },
                    {
                        "headerName": "Items In Busines",
                        "field": "items_In_Business"
                    }
                ]
            }
        },
        methods: {
            onGridReady(params) {
                this.gridApi = params.api;
                this.columnApi = params.columnApi;
                this.gridApi.resetRowHeights();
                this.gridApi.sizeColumnsToFit()
            }
        }
    }
</script>