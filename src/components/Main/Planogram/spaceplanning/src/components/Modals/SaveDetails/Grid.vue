<template>
    <div>
        <ag-grid-vue :gridOptions="gridOptions" @selection-changed="onSelectionChanged" :sideBar='false'
            style="width: 100%;  height: calc(100vh - 400px);" :defaultColDef="defaultColDef" class="ag-theme-balham"
            :columnDefs="headers" :rowData="rowData" :enableSorting="true" :enableFilter="true"
            :suppressRowClickSelection="true" :enableRangeSelection="true" rowSelection="single" :rowDeselection="true"
            :enableColResize="true" :floatingFilter="true" :gridReady="gridReady" :onGridReady="onGridReady"
            :groupMultiAutoColumn="true">
        </ag-grid-vue>
    </div>
</template>
<script>
    import {
        AgGridVue
    } from "ag-grid-vue";
    import CheckBox from "./CheckBox"
    export default {
        components: {
            AgGridVue,
            CheckBox
        },
        props: ["rowData"],
        data() {
            return {
                totalModules: 0,
                headers: [{
                    "headerName": "Fixture Type",
                    "field": "displayName",
                    "minWidth": 200,
                }, {
                    "headerName": "Code",
                    "field": "code",
                    "minWidth": 50,
                }, {
                    "headerName": "Modules",
                    "field": "modules",
                    "editable": true,
                    "minWidth": 75,
                }, {
                    "headerName": "Height",
                    "field": "height",
                    "editable": true,
                    "minWidth": 75,
                }, {
                    "headerName": "Segment Width",
                    "field": "segmentWidth",
                    "editable": true,
                    "minWidth": 75,
                }, {
                    "headerName": "Depth",
                    "field": "depth",
                    "editable": true,
                    "minWidth": 75,
                }, {
                    "headerName": "Default",
                    "field": "isDefault",
                    "cellRendererFramework": "CheckBox",
                    "minWidth": 75,
                }, ],

                defaultColDef: {
                    onCellValueChanged: this.UpdateLine
                },
                gridOptions: {
                    rowHeight: 35,
                    context: {
                        componentParent: this
                    },

                },
            }
        },

        methods: {
            checkBoxChange(data) {
                let self = this
                self.rowData.forEach(e => {
                    if (e != data) {
                        e.isDefault = false
                    };
                })
            },
            getSelectedItems() {
                let self = this
                let items = []
                self.rowData.forEach(element => {
                    if (element.isDefault == true) {
                        items.push(element)
                    }
                });
                return items

            },
            getRowData() {
                let self = this
                return self.rowData
            },
            onSelectionChanged(e) {
                console.log(e);

                var rows = e.api.getSelectedNodes();
                this.selectedItems = rows;
            },
            onGridReady(params) {
                this.gridApi = params.api;
                this.columnApi = params.columnApi;

                console.log("From on grid ready")
                console.log(params, this.gridApi);

                setTimeout(() => {
                    this.gridApi.resetRowHeights();
                    this.gridApi.sizeColumnsToFit()
                }, 200);
            },
            gridReady(params) {
                this.gridApi = params.api;
                this.columnApi = params.columnApi;

                console.log("From grid ready")
                console.log(params, this.gridApi);

                setTimeout(() => {
                    this.gridApi.resetRowHeights();
                    this.gridApi.sizeColumnsToFit()
                }, 200);
            },
        }
    }
</script>