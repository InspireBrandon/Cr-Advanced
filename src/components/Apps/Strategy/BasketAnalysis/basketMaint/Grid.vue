<template>
    <div>
        <ag-grid-vue :gridOptions="gridOptions" @selection-changed="onSelectionChanged" :sideBar='false'
            style="width: 100%;  height: calc(100vh - 220px);" :defaultColDef="defaultColDef" class="ag-theme-balham"
            :columnDefs="headers" :rowData="rowData" :enableSorting="true" :enableFilter="true"
            :suppressRowClickSelection="true" :enableRangeSelection="true" rowSelection="multiple"
            :rowDeselection="true" :enableColResize="true" :floatingFilter="true" :gridReady="gridReady"
            :onGridReady="onGridReady" :groupMultiAutoColumn="true">
        </ag-grid-vue>
        <v-toolbar dark dense class="pa-0">
            <span>rows : {{rowData.length}}</span>
        </v-toolbar>
        
    </div>
</template>
<script>
    import jwt from 'jsonwebtoken';
    import Axios from 'axios'
    import {
        AgGridVue
    } from "ag-grid-vue";
    export default {
        props: [],
        components: {
            AgGridVue,
        },
        data() {
            return {
                rowData:[],
                selectedItems: [],
                headers: [
                    //     {
                    //     "headerName": "",
                    //    "field":yeet
                    // },
                ],
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

            UpdateLine(item) {
                // let self = this
                // let tmp = item.data
                // let node = item.node
                // self.createStorePlano(tmp, data => {
                //     tmp.id = data.store_Planogram.id
                //     tmp.heightFit = data.store_Planogram.heightFit;
                //     tmp.modulesFit = data.store_Planogram.modulesFit;
                //     tmp.fits = data.store_Planogram.fits;
                //     node.setData(tmp)
                // })
                // self.createPlanoGramDetailTX(tmp)
            },

            resize() {
                setTimeout(() => {
                    this.gridApi.resetRowHeights();
                    this.gridApi.sizeColumnsToFit()
                }, 200);
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
            redrawAllRows() {
                let self = this;
                console.log("redrawing rows")
                this.gridApi.redrawRows();
            },
        }
    }
</script>
<style>
    .ag-theme-balham .audit-image-breach {
        background-color: lightcoral !important;
    }

    .success-green {
        background: #C8E6C9;
    }

    .error-red {
        background: rgb(240, 125, 125);
    }
</style>