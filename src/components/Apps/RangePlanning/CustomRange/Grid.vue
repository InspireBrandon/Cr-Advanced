<template>
    <div>
        <ag-grid-vue :gridOptions="gridOptions" style="width: 100%;  height: 500px;" :defaultColDef="defaultColDef"
            class="ag-theme-balham" :columnDefs="columnDefs" :rowData="rowData" :enableSorting="true"
            :enableFilter="true" :suppressRowClickSelection="true" :enableRangeSelection="true" rowSelection="multiple"
            :rowDeselection="true" :enableColResize="true" :floatingFilter="true" :onGridReady="onGridReady"
            :groupMultiAutoColumn="true">
        </ag-grid-vue>
    </div>
</template>

<script>
    import {
        AgGridVue
    } from "ag-grid-vue";

    export default {
        props: ['rowData'],
        components: {
            AgGridVue
        },
        data() {
            return {
                columnDefs: [{
                    "headerName": "Barcode",
                    "field": "barcode",
                },{
                    "headerName": "Product System ID",
                    "field": "product_System_ID"
                },{
                    "headerName": "Description",
                    "field": "description",
                    "Width": 400,
                }],
                defaultColDef: {
                    onCellValueChanged: this.onCellValueChanged
                },
                gridOptions: {
                    rowHeight: 35,
                    context: {
                        componentParent: this
                    },
                    rowClassRules: {
                        'disabled-line': 'data.can_edit'
                    }
                },
            }
        },
        methods: {
            onGridReady(params) {
                let self = this;
                self.gridApi = params.api;
                self.columnApi = params.columnApi;
            }
        }
    }
</script>