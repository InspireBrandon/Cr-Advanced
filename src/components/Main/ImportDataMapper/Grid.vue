<template>
    <div>
        <ag-grid-vue :gridOptions="gridOptions" :sideBar='false' style="width: 100%;  height: calc(100vh - 170px);"
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

    import Linker from './GridComponents/Linker'

    export default {
        components: {
            AgGridVue,
            Linker
        },
        data() {
            return {
                rowData: [{
                    importValue: "Klerksdorp Hinterland",
                    linkedTo: null,
                },{
                    importValue: "Bloemfontein Hinterland",
                    linkedTo: null,
                }],
                headers: [{
                    headerName: "Import Value",
                    field: "importValue",
                }, {
                    headerName: "Linked To",
                    field: "linkedTo",
                    cellRendererFramework: "Linker",
                }],
                defaultColDef: {
                    onCellValueChanged: this.updateCheck
                },
                gridOptions: {
                    context: {
                        componentParent: this
                    }
                },
            }
        },
        methods: {
            onGridReady(params) {
                this.gridApi = params.api;
                this.columnApi = params.columnApi;
                setTimeout(() => {
                    this.gridApi.resetRowHeights();
                    this.gridApi.sizeColumnsToFit()
                }, 60);
            },
        }
    }
</script>