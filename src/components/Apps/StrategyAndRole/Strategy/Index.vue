<template>
    <div>
        <ag-grid-vue id="ag-Grid" :gridOptions="gridOptions" style="width: 100%;  height: calc(100vh - 110px);"
            :defaultColDef="defaultColDef" class="ag-theme-balham" :columnDefs="columnDefs" :rowData="rowData"
            :sortable="true" :filter="true" :suppressRowClickSelection="true" :enableColResize="true"
            :enableRangeSelection="true" rowSelection="multiple" :rowDeselection="true" :resizable="true"
            :floatingFilter="true" :groupMultiAutoColumn="true" :onGridReady="onGridReady" :enableFilter="true">
        </ag-grid-vue>
    </div>
</template>

<script>
    import {
        AgGridVue
    } from "ag-grid-vue";

    import Axios from 'axios';

    export default {
        components: {
            AgGridVue
        },
        data() {
            return {
                columnDefs: [{
                        headerName: "Category",
                        field: "category",
                        sortable: true,
                    },
                    {
                        headerName: "Subcategory",
                        field: "subcategory",
                        sortable: true,
                    },
                    {
                        headerName: "Segment",
                        field: "segment",
                        sortable: true,
                        editable: true
                    },
                ],
                rowData: [],
                defaultColDef: {
                    onCellValueChanged: this.updatePlanogramRole
                },
                gridOptions: {
                    rowHeight: 35,
                    pinnedTopRowData: [],
                    pinnedBottomRowData: [],
                    context: {
                        componentParent: this
                    }
                }
            };
        },
        mounted() {
            let self = this;
            self.getCategoryStrategy();
        },
        methods: {
            onGridReady(params) {
                let self = this;
                self.gridApi = params.api;
                self.columnApi = params.columnApi;
            },
            getCategoryStrategy() {
                let self = this;

                Axios.get(process.env.VUE_APP_API + "Strategy/CategoryStrategy")
                    .then(r => {
                        self.rowData = r.data;
                    })
                    .catch(e => {

                    })
            },
        }
    }
</script>