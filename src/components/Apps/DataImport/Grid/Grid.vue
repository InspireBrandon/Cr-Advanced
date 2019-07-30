<template>
    <div>
        <ag-grid-vue :gridOptions="gridOptions" :sideBar='true' style="width: 100%;  height: calc(100vh - 235px);"
            :defaultColDef="defaultColDef" class="ag-theme-balham" :columnDefs="headers" :rowData="rowData"
            :enableSorting="true" :enableFilter="true" :suppressRowClickSelection="true" :enableRangeSelection="true"
            rowSelection="multiple" :rowDeselection="true" :enableColResize="true" :floatingFilter="true"
            :onGridReady="onGridReady" :gridReady="onGridReady" :groupMultiAutoColumn="true">
        </ag-grid-vue>
        rows:{{rowData.length}}
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
        props: ["rowData"],
        data() {
            return {

                defaultColDef: {},
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
                    "headerName": "File Name",
                    "field": "fileName"
                }, {
                    "headerName": "Date",
                    "field": "interactionDateTime"
                }, ]
            }
        },
        methods: {
            onGridReady(params) {
                this.gridApi = params.api;
                this.columnApi = params.columnApi;
                setTimeout(() => {
                    this.gridApi.resetRowHeights();
                    this.gridApi.sizeColumnsToFit()
                }, 300);
            },
        }
    }
</script>