<template>
    <div>
        <ag-grid-vue :gridOptions="gridOptions" :sideBar='false' style="width: 100%;  height: calc(100vh - 335px);"
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
        props: ["rowData","updateLine"],
        data() {
            return {
                defaultColDef: {
                    onCellValueChanged: this.updateLine
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
                    "headerName": "Group",
                    "field": "promotionGroupName",
                    editable: true,
                }, {
                    "headerName": "Name",
                    "field": "name",
                    editable: true,
                }, {
                    "headerName": "E Mail",
                    "field": "eMail",
                    editable: true,
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