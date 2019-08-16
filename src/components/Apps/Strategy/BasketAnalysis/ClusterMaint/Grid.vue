<template>
    <div>
        <ag-grid-vue :gridOptions="gridOptions" :sideBar='false' style="width: 100%;  height: calc(80vh - 112px);"
            :defaultColDef="defaultColDef" class="ag-theme-balham" :columnDefs="headers" :rowData="data"
            :enableSorting="true" :enableFilter="true" :suppressRowClickSelection="true" :enableRangeSelection="true"
            rowSelection="multiple" :rowDeselection="true" :enableColResize="true" :floatingFilter="true"
            :gridReady="gridReady" :onGridReady="onGridReady" :groupMultiAutoColumn="true">
        </ag-grid-vue>
        <v-toolbar dark dense class="pa-0">
            <span>rows : {{data.length}}</span>
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
        props: ["data"],
        components: {
            AgGridVue,
        },
        data() {
            return {

                selectedItems: [],
                headers: [{
                    "headerName": "Cluster Name",
                    "editable": true,
                    "field": "clusterName"

                }, {
                    "headerName": "Displayname",
                    "editable": true,

                    "field": "displayName"
                }, {
                    "headerName": "Value",
                    "editable": true,

                    "field": "value"
                }, {
                    "headerName": "Active",
                    "editable": true,

                    "field": "active"
                }, {
                    "headerName": "Rank",
                    "editable": true,

                    "field": "rank"
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
        created() {
            this.GetData
        },
        methods: {

            UpdateLine(item) {
                let self = this
                let tmp = item.data
                let node = item.node

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.post(process.env.VUE_APP_API + `Cluster/Save`, tmp)
                    .then(r => {
                        console.log(r);
                        
                        node.setData(tmp)
                        delete Axios.defaults.headers.common["TenantID"];
                    })
                // 
                // self.createStorePlano(tmp, data => {
                //     tmp.id = data.store_Planogram.id
                //     tmp.heightFit = data.store_Planogram.heightFit;
                //     tmp.modulesFit = data.store_Planogram.modulesFit;
                //     tmp.fits = data.store_Planogram.fits;
                //     
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