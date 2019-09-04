<template>
    <div>
        <ag-grid-vue :gridOptions="gridOptions" :sideBar='false' style="width: 100%;  height: calc(40vh - 112px);"
            :defaultColDef="defaultColDef" class="ag-theme-balham" :columnDefs="headers" :rowData="data"
            :enableSorting="true" :enableFilter="true" :suppressRowClickSelection="true" :enableRangeSelection="true"
            rowSelection="multiple" :rowDeselection="true" :enableColResize="true" :gridReady="gridReady"
            :onGridReady="onGridReady" :groupMultiAutoColumn="true">
        </ag-grid-vue>
    </div>
</template>
<script>
    import jwt from 'jsonwebtoken';
    import Axios from 'axios'
    import rank from "./rank"

    import {
        AgGridVue
    } from "ag-grid-vue";
    export default {
        props: ["data", "getData"],
        components: {
            AgGridVue,
            rank
        },
        data() {
            return {
                selectedItems: [],
                headers: [{
                    "headerName": "Basket",
                    "editable": true,
                    "field": "basket"
                }, {
                    "headerName": "Displayname",
                    "editable": true,
                    "field": "displayname"
                }, {
                    "headerName": "Description",
                    "editable": true,
                    "field": "description"
                }, {
                    "headerName": "Active",
                    "editable": true,
                    "field": "active"
                }, {
                    "headerName": "Rank",
                    "editable": true,
                    "field": "rank"
                }, {
                    "headerName": "Levels",
                    "editable": true,
                    "field": "Levels"
                }, {
                    "headerName": "",
                    "cellRendererFramework": "rank",
                }],
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
            deleteBasket(params) {
                let self = this
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.post(process.env.VUE_APP_API + `Basket/Delete?Basket_ID=${params.data.id}`)
                    .then(r => {
                        console.log(r);
                        self.getData()
                        self.$refs.grid.resize()
                        delete Axios.defaults.headers.common["TenantID"];
                    })
            },
            HandleRankUp(params) {
                console.log("up");
                let item = params.data
                let node = params.node
                let tmp
                let self = this
                for (let index = 0; index < self.data.length; index++) {
                    const element = self.data[index];
                    if (element.id == item.id) {
                        let up = item.rank
                        let down = self.data[index - 1].rank
                        tmp = self.data[index - 1]
                        item.rank = down
                        tmp.rank = up
                        self.UpdateLineNoNode(item, callback => {
                            self.UpdateLineNoNode(tmp, callback2 => {
                                self.getData()
                            })
                        })
                    }
                }
            },
            HandleRankDown(params) {
                console.log("down");
                let item = params.data
                let node = params.node
                let tmp
                let self = this
                for (let index = 0; index < self.data.length; index++) {
                    const element = self.data[index];
                    if (element.id == item.id) {
                        let up = item.rank
                        let down = self.data[index + 1].rank
                        tmp = self.data[index + 1]
                        item.rank = down
                        tmp.rank = up
                        self.UpdateLineNoNode(item, callback => {
                            self.UpdateLineNoNode(tmp, callback2 => {
                                self.getData()
                            })
                        })
                    }
                }
            },
            UpdateLineNoNode(item, callback) {
                let self = this
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.post(process.env.VUE_APP_API + `Basket`, item)
                    .then(r => {
                        console.log(r);

                        callback(r)
                        delete Axios.defaults.headers.common["TenantID"];
                    })

            },
            UpdateLine(item) {
                let self = this
                let tmp = item.data
                let node = item.node

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.post(process.env.VUE_APP_API + `Basket`, tmp)
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