<template>
    <div>
        <v-toolbar dark flat dense>
            <v-toolbar-title>
                Report
            </v-toolbar-title>
        </v-toolbar>
        <div >
            <ag-grid-vue :gridOptions="gridOptions" style="width: 100%;  height: calc(100vh - 130px);"
                :defaultColDef="defaultColDef" class="ag-theme-balham" :columnDefs="headers" :rowData="rowData" :sideBar='true'
                :enableSorting="true" :enableFilter="true" :suppressRowClickSelection="true"
                :enableRangeSelection="true" rowSelection="multiple" :rowDeselection="true" :enableColResize="true"
                :floatingFilter="true" :groupMultiAutoColumn="true" :onGridReady="onGridReady" >
            </ag-grid-vue>
        </div>


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
        data() {
            return {
                rowData: [],
                headers: [{
                    "headerName": "Project Group",
                    "field": "ProjectGroup"
                }, {
                    "headerName": "Planogram",
                    "field": "Planogram"
                }, {
                    "headerName": "Department",
                    "field": "Department",
                     "hide": true,
                }, {
                    "headerName": "SubDepartment",
                     "hide": true,
                    "field": "SubDepartment"
                    
                }, {
                    "headerName": "Category",
                    "field": "Category"
                }, {
                    "headerName": "Subcategory",
                    "hide": true,
                    "field": "Subcategory"
                }, {
                    "headerName": "Segment",
                    "hide": true,
                    "field": "Segment"
                }, {
                    "headerName": "manufacturer",
                    "field": "manufacturer"
                }, {
                    "headerName": "Brand",
                    "hide": true,
                    "field": "Brand"
                }, {
                    "headerName": "Size Description",
                    "hide": true,
                    "field": "SizeDescription"
                }],
                gridOptions: {
                    rowHeight: 35,
                    pinnedTopRowData: [],
                    pinnedBottomRowData: [],
                    context: {
                        componentParent: this
                    },
                },
                defaultColDef: {
                    // onCellValueChanged: this.UpdateLine
                }
            }
        },
        methods: {
            onGridReady(params) {
                let self = this;
                self.gridApi = params.api;
                self.columnApi = params.columnApi;
                this.gridApi.resetRowHeights();
                this.gridApi.sizeColumnsToFit()
            },
        }

    }
</script>