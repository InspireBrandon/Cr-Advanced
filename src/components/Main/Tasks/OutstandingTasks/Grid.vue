<template>
    <div>
        <ag-grid-vue :gridOptions="gridOptions" style="width: 100%;  height: 600px;" class="ag-theme-balham"
            :columnDefs="columnDefs" :rowData="rowData" :enableSorting="true" :enableFilter="true"
            :suppressRowClickSelection="true" :enableRangeSelection="true" rowSelection="multiple"
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
        props: ['rowData', 'statusList', 'typeList'],
        components: {
            AgGridVue
        },
        mounted() {
            let self = this;

            self.columnDefs = [{
                "headerName": "User",
                "field": "username"
            }, {
                "headerName": "Project",
                "field": "planogram"
            }, {
                "headerName": "Type",
                "field": "typeFormatted"
            }, {
                "headerName": "Intended Stores",
                "field": "intendedStores"
            }, {
                "headerName": "Status",
                "field": "statusFormatted"
            }, {
                "headerName": "Date Requested",
                "field": "dateTimeString",
            }, {
                "headerName": "Days Since",
                "field": "daysSince",
            }, {
                "headerName": "Planogram File",
                "field": "systemFileName"
            }, {
                "headerName": "Range File",
                "field": "rangeFileName"
            }]
        },
        data() {
            let self = this;

            return {
                columnDefs: [],
                gridOptions: {
                    groupMultiAutoColumn: true,
                    rowHeight: 35,
                    pinnedTopRowData: [],
                    pinnedBottomRowData: [],
                    context: {
                        componentParent: this
                    },
                    suppressRowTransform: true
                },
            }
        },
        methods: {
            onGridReady(params) {
                let self = this;
                this.gridApi = params.api;
                this.columnApi = params.columnApi;
            },
        }
    }
</script>