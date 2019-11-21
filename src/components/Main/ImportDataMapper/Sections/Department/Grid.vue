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

    import Linker from './Linker'
    import Unlinker from './Unlinker'
    import Axios from 'axios'

    export default {
        props: ['rowData'],
        components: {
            AgGridVue,
            Linker,
            Unlinker
        },
        data() {
            return {
                headers: [{
                    headerName: "Import Value",
                    field: "name",
                }, {
                    headerName: "System Value",
                    field: "systemDepartment_Name",
                    cellRendererFramework: "Linker",
                }, {
                    headerName: "",
                    field: "",
                    width: 50,
                    cellRendererFramework: "Unlinker"
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
            updateLinkedDepartment(request, callback) {
                let self = this;

                Axios.put(process.env.VUE_APP_API + `SuplierLocationImportTX/Department`, request)
                    .then(r => {
                        callback();
                    })
            }
        }
    }
</script>