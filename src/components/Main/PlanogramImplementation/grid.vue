<template>
    <div>
        <ag-grid-vue :gridOptions="gridOptions" :sideBar='true' style="width: 100%;  height: calc(100vh - 235px);"
            :defaultColDef="defaultColDef" class="ag-theme-balham" :columnDefs="headers" :rowData="rowData"
            :enableSorting="true" :enableFilter="true" :suppressRowClickSelection="true" :enableRangeSelection="true"
            rowSelection="multiple" :rowDeselection="true" :enableColResize="true" :floatingFilter="true"
            :gridReady="onGridReady" :groupMultiAutoColumn="true">
        </ag-grid-vue>
    </div>

</template>
<script>
    import Button from "./button.vue"

    import {
        AgGridVue
    } from "ag-grid-vue";
    export default {
        props: ["rowData"],
        components: {
            AgGridVue,
            Button,
        },

        data() {
            return {
                headers: [{
                    "headerName": "Store",
                    "field": "storeName"
                }, {
                    "headerName": "Cluster Name",
                    "field": "clusterName"
                }, {
                    "headerName": "Modules",
                    "maxWidth": 50,
                    "minWidth": 50,
                    "field": "modules"
                }, {
                    "headerName": "Height",
                    "maxWidth": 50,
                    "minWidth": 50,
                    "field": "height"
                }, {
                    "headerName": "Width",
                    "maxWidth": 50,
                    "minWidth": 50,
                    "field": "width"
                }, {
                    "headerName": "Displays",
                    "maxWidth": 50,
                    "minWidth": 50,
                    "field": "displays"
                }, {
                    "headerName": "Pallettes",
                    "maxWidth": 50,
                    "minWidth": 50,
                    "field": "pallettes"
                }, {
                    "headerName": "Supplier Stands",
                    "maxWidth": 50,
                    "minWidth": 50,
                    "field": "supplierStands"
                }, {
                    "headerName": "Bins",
                    "field": "bins",
                    "maxWidth": 50,
                    "minWidth": 50,
                }, {
                    "headerName": "Current Status",
                    "field": "currentStatusText"
                }, {
                    "headerName": "",
                    "editable": false,
                    "hide": false,
                    "pinned": "right",
                    "maxWidth": 100,
                    "minWidth": 100,
                    "cellRendererFramework": "Button"
                }],
                defaultColDef: {
                    onCellValueChanged: this.onCellValueChanged
                },
                gridOptions: {
                    context: {
                        componentParent: this
                    },
                    rowClassRules: {
                        'audit-image-breach': 'data.imageAudit'
                    }
                },
            }
        },
        methods: {
            UpdateLine(item) {
                let self = this
                self.createPlanoGramDetailTX(item)
                // create new detail tx
                // update details then update store_planogram if necesssary

            },
            createPlanoGramDetailTX(item) {
                let self = this
                let detailsItem = null;
                console.log("item");
                console.log(item);
                if (item.planogramName == null) {
                    item.planogramName = "No assigned Planogram"
                }
                if (item.tag == null) {
                    item.tag = "NPA"
                }
                if (item.storeCluster == null) {
                    item.storeCluster = "L TM2"
                }
                if (item.clusterType == null) {
                    item.clusterType = "store"
                }
                if (item.clusterName == null) {
                    item.clusterName = ""
                }

                let sendRequst = {
                    "systemFileID": item.systemFileID,
                    "dateFromString": "",
                    "dateToString": "",
                    "monthsBetween": parseInt(item.monthsBetween),
                    "periodic": item.periodic,
                    "planogramID": parseInt(item.planogramID),
                    "planogramName": item.planogramName,
                    "tag": item.tag,
                    "storeCluster": item.storeCluster,
                    "clusterID": parseInt(item.clusterID),
                    "clusterType": item.clusterType,
                    "clusterName": item.clusterName,
                    "rangeID": parseInt(item.rangeID),
                    "storeID": item.store_ID,
                    "storeName": item.storeName,
                    "categoryCluster": item.categoryCluster,
                    "modules": parseInt(item.modules),
                    "height": parseFloat(item.height),
                    "width": parseFloat(item.width),
                    "displays": parseInt(item.displays),
                    "pallettes": parseInt(item.pallettes),
                    "supplierStands": parseInt(item.supplierStands),
                    "bins": parseInt(item.bins)
                }
                console.log(sendRequst);

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                Axios.post(process.env.VUE_APP_API + 'Planogram_Details/Save', sendRequst).then(
                    r => {
                        console.log(r);
                        let obj = {
                            "id": item.id,
                            "store_ID": item.store_ID,
                            "project_ID": self.selectedProject,
                            "planogramDetail_ID": r.data.planogram_Details.id,
                            "planogramStoreStatus": 0,
                        }
                        Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                        console.log("obj");
                        console.log(obj);

                        Axios.post(process.env.VUE_APP_API + 'Store_Planogram/Save', obj)
                            .then(res => {
                                console.log(res.data);
                                self.getStorePlanograms()
                                delete Axios.defaults.headers.common["TenantID"];
                            }).catch(e => {
                                delete Axios.defaults.headers.common["TenantID"];

                            })


                        delete Axios.defaults.headers.common["TenantID"];
                    })
                // .catch(err => {
                // alert("THE BIG OOF")
                // })
            },
            onGridReady(params) {
                this.gridApi = params.api;
                this.columnApi = params.columnApi;
            },
        }
    }
</script>