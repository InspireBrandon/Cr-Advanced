<template>
    <div>
        <div>
            <ag-grid-vue :gridOptions="gridOptions" style="width: 100%;  height: calc(100vh - 225px);"
                :defaultColDef="defaultColDef" class="ag-theme-balham" :columnDefs="headers" :rowData="rowData"
                :sideBar='true' :enableSorting="true" :enableFilter="true" :suppressRowClickSelection="true"
                :enableRangeSelection="true" rowSelection="multiple" :rowDeselection="true" :enableColResize="true"
                :floatingFilter="true" :groupMultiAutoColumn="true" :onGridReady="onGridReady">
            </ag-grid-vue>
        </div>
    </div>
</template>
<script>
    var Etat_acces = {
        false: "NO",
        true: "YES"
    };

    import {
        AgGridVue
    } from "ag-grid-vue";

    import Axios from 'axios';

    export default {
        props: ['rowData', 'basket'],
        components: {
            AgGridVue
        },
        data() {
            let self = this;

            return {
                headers: [],
                gridOptions: {
                    rowHeight: 35,
                    pinnedTopRowData: [],
                    pinnedBottomRowData: [],
                    context: {
                        componentParent: this
                    },
                    afterFilterChanged: () => console.log(gridOptions.api.inMemoryRowController.rowsAfterFilter),

                },
                defaultColDef: {
                    onCellValueChanged: this.UpdateLine
                }
            }
        },
        created() {
            let self = this;
            self.setHeaders();
        },
        methods: {
            changeFilter(text) {
                let self = this
                self.gridApi.setQuickFilter(text);
            },
            getFilteredData() {
                let self = this
                var tmpArr = []
                var tmpArrNode = []
                var last = self.gridApi.getDisplayedRowAtIndex(0)
                self.gridApi.forEachNodeAfterFilter(function (rowNode, index) {
                    tmpArr.push(rowNode.data)
                    tmpArrNode.push(rowNode)
                });
                return {
                    tmpArr,
                    last,
                    tmpArrNode
                }
            },
            onGridReady(params) {
                let self = this;
                self.gridApi = params.api;
                self.columnApi = params.columnApi;
                // this.gridApi.resetRowHeights();
                // this.gridApi.sizeColumnsToFit()
            },
            UpdateLine(params) {
                let self = this;

                let request = JSON.parse(JSON.stringify(params.data));

                request["basket_ID"] = self.basket.value;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.post(process.env.VUE_APP_API + "Basket_Product_Link", request)
                    .then(r => {
                        delete Axios.defaults.headers.common["TenantID"];
                    })
            },
            setHeaders() {
                let self = this;

                self.headers = [{
                        "headerName": "Basket",
                        "editable": true,
                        "field": "active",
                        "cellEditor": "agRichSelectCellEditor",
                        cellEditorParams: {
                            values: extractValues(Etat_acces)
                        },
                        cellClassRules: {
                            'success-green': 'data.active == true',
                        },
                        valueFormatter: function (params) {
                            return lookupValue(Etat_acces, params.value);
                        },
                        valueParser: function (params) {
                            return lookupKey(Etat_acces, params.newValue);
                        }
                    },
                    {
                        "headerName": "Project Group",
                        "field": "projectGroup"
                    }, {
                        "headerName": "Planogram",
                        "field": "planogram"
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
                        "headerName": "Manufacturer",
                        "field": "manufacturer"
                    }, {
                        "headerName": "Brand",
                        "hide": true,
                        "field": "brand"
                    }, {
                        "headerName": "Size Description",
                        "hide": true,
                        "field": "size_Description"
                    }, {
                        "headerName": "Description",
                        "hide": true,
                        "field": "product_Description"
                    }
                ]
            }
        }
    }

    function extractValues(mappings) {
        return Object.keys(mappings);
    }

    function lookupValue(mappings, key) {
        return mappings[key];
    }

    function lookupKey(mappings, name) {
        for (var key in mappings) {
            if (mappings.hasOwnProperty(key)) {
                if (name === mappings[key]) {
                    return key;
                }
            }
        }
    }
</script>