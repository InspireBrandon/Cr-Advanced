<template>
    <div>
        <div>
            <ag-grid-vue :gridOptions="gridOptions" style="width: 100%;  height: calc(100vh - 175px);"
                :defaultColDef="defaultColDef" class="ag-theme-balham" :columnDefs="headers" :rowData="rowData"
                :sideBar='true' :enableSorting="true" :enableFilter="true" :suppressRowClickSelection="true"
                :enableRangeSelection="true" rowSelection="multiple" :rowDeselection="true" :enableColResize="true"
                :floatingFilter="true" :groupMultiAutoColumn="true" :onGridReady="onGridReady">
            </ag-grid-vue>
        </div>
    </div>
</template>
<script>
    import {
        AgGridVue
    } from "ag-grid-vue";
    export default {
        props: ['rowData', 'basket'],
        components: {
            AgGridVue
        },
        data() {
            let self = this;

            return {
                headers: [{
                        "headerName": "Basket",
                        "editable": true,
                        "field": "yesNo",
                        "cellEditor": "agRichSelectCellEditor",
                        "cellEditorParams": {
                            "values": ["YES", "NO"]
                        }
                    },
                    {
                        "headerName": "Project Group",
                        "field": "projectGroup"
                    }, {
                        "headerName": "Planogram",
                        "field": "project"
                    }, {
                        "headerName": "Department",
                        "field": "department",
                        "hide": true,
                    }, {
                        "headerName": "Subdepartment",
                        "hide": true,
                        "field": "subdepartment"
                    }, {
                        "headerName": "Category",
                        "field": "category"
                    }, {
                        "headerName": "Subcategory",
                        "hide": true,
                        "field": "subcategory"
                    }, {
                        "headerName": "Segment",
                        "hide": true,
                        "field": "segment"
                    }, {
                        "headerName": "manufacturer",
                        "field": "manufacturer"
                    }, {
                        "headerName": "Brand",
                        "hide": true,
                        "field": "brand"
                    }, {
                        "headerName": "Size Description",
                        "hide": true,
                        "field": "size_Description"
                    }
                ],
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
                // this.gridApi.resetRowHeights();
                // this.gridApi.sizeColumnsToFit()
            },
        }

    }
</script>