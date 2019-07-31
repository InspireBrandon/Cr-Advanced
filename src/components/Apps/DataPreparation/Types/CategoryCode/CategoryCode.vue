<template>
    <div>
        <v-toolbar dark flat>
            <v-toolbar-title>Category Code</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-text-field append-icon="search" type="text" id="filter-text-box" placeholder="Filter..."
                @input="onFilterTextBoxChanged" v-model="filterText">
            </v-text-field>
            <v-spacer></v-spacer>

            <v-btn dark @click="openAdd" color="primary" class="my-0">
                <v-icon>add</v-icon>
            </v-btn>
        </v-toolbar>
        <div v-if="rowData.length>0">
            <ag-grid-vue :gridOptions="gridOptions" style="width: 100%;  height: calc(100vh - 130px);"
                :defaultColDef="defaultColDef" class="ag-theme-balham" :columnDefs="headers" :rowData="rowData"
                :enableSorting="true" :enableFilter="true" :suppressRowClickSelection="true"
                :enableRangeSelection="true" rowSelection="multiple" :rowDeselection="true" :enableColResize="true"
                :floatingFilter="true" :groupMultiAutoColumn="true" :onGridReady="onGridReady">
            </ag-grid-vue>
        </div>
        <Dialog ref="Dialog" />
        <addModal ref="addModal" />
    </div>
</template>

<script>
    import DropDown from "./DropDown"
    import Axios from 'axios'
    import {
        AgGridVue
    } from "ag-grid-vue";
    import {
        longStackSupport
    } from 'q';

    import addModal from "./CreateModal"
    import Dialog from "@/components/Common/Dialog";
    export default {
        props: ['name', 'headerName', 'hasCode'],
        components: {
            AgGridVue,
            Dialog,
            addModal,
            DropDown
        },
        data() {
            return {
                headers: [{
                        "headerName": "Category_Code",
                        "field": "category_Code",
                        "editable": true,
                    }, {
                        "headerName": "Category",
                        "field": "category",
                        "editable": true,

                    }, {
                        "headerName": "DisplayName",
                        "field": "displayName",
                        "editable": true,
                    },
                    // {
                    //     "headerName": "Supergroup_A_ID",
                    //     "field": "supergroup_A_ID"
                    // },{
                    //     "headerName": "Supergroup_B_ID",
                    //     "field": "supergroup_B_ID"
                    // },
                    {
                        "headerName": "Department",
                        "field": "department_ID",
                        "dropdownName": "departmentName",
                        "cellRendererFramework": "DropDown",
                    }, {
                        "headerName": "Subdepartment",
                        "field": "subdepartment_ID",
                        "cellRendererFramework": "DropDown",
                        "dropdownName": "subdepartmentName"
                    }, {
                        "headerName": "Planogram",
                        "field": "planogram_ID",
                        "cellRendererFramework": "DropDown",
                        "dropdownName": "planogramName",
                    }
                ],
                filterText: '',
                allowedRecords: 25,
                columnDefs: [],
                rowData: [],
                subdepartmentName: [],
                departmentName: [],
                planogramName: [],
                gridOptions: {
                    rowHeight: 35,
                    pinnedTopRowData: [],
                    pinnedBottomRowData: [],
                    context: {
                        componentParent: this
                    },
                },
                defaultColDef: {
                    onCellValueChanged: this.UpdateLine
                }
            }
        },
        created() {
            this.gridOptions.context.componentParent = this;
            this.getItems();
        },
        computed: {},
        mounted() {
            let self = this;
            this.GetPlanograms()
            this.GetDepartments()
            this.GetSubDepartments()
            // document.addEventListener('DOMContentLoaded', function () {
            //     var gridID = document.querySelector('#ag-grid');
            //     new agGrid.Grid(gridID, self.gridOptions);
            // });
        },
        methods: {
            GetPlanograms() {
                let self = this

                Axios.get(process.env.VUE_APP_API + "Planogram").then(r => {
                     self.planogramList=[]
                    r.data.planogramList.forEach(element => {
                        self.planogramName.push({
                            text: element.planogram,
                            value: element.id
                        })
                    });
                })
            },
            GetDepartments() {
                let self = this
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                Axios.get(process.env.VUE_APP_API + "Retailer/Department").then(r => {
                    console.log("Retailer/Department");
                    console.log(r);
                    self.departmentName=[]

                    r.data.forEach(element => {
                        self.departmentName.push({
                            text: element.department,
                            value: element.id
                        })
                    });
                    console.log(self.Departments);

                    delete Axios.defaults.headers.common["TenantID"];

                })
            },
            GetSubDepartments() {
                let self = this
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + "Retailer/SubDepartment").then(r => {
                    console.log("Retailer/SubDepartment");
                    console.log(r);
                    self.subdepartmentName=[]
                    r.data.forEach(element => {
                        self.subdepartmentName.push({
                            text: element.subdepartment,
                            value: element.id,
                            department_ID: element.department_ID,

                        })
                    });
                    delete Axios.defaults.headers.common["TenantID"];

                })
            },
            checkUniqueCode(item, callback) {
                let self = this
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.post(process.env.VUE_APP_API + `Retailer/Category_Link/CheckCode`, item)
                    .then(r => {
                        console.log(r);
                        delete Axios.defaults.headers.common["TenantID"];
                        callback(r.data)
                    })
            },
            SaveEntry(item, callback) {
                let self = this
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.post(process.env.VUE_APP_API + `Retailer/Category_Link/Save`, item)
                    .then(r => {
                        console.log("Save");
                        console.log(r);
                        delete Axios.defaults.headers.common["TenantID"];
                        callback(r.data)
                    })
            },
            UpdateLine(item) {
                let self = this
                let tmp = item.data
                let node = item.node
                console.log("[UPDATElINE]");
                
                self.checkUniqueCode(tmp, callback => {
                    console.log(callback);
                    if (callback != null) {
                        self.$refs.Dialog.openDialog({
                            headline: "Duplicate Category Code",
                            text: "Please Use a different Category Code"
                        })
                    } else {
                        self.SaveEntry(tmp, saveCallback => {
                            node.setData(saveCallback)
                        })
                    }

                })
                // tmp.id = data.store_Planogram.id
                // tmp.heightFit = data.store_Planogram.heightFit;
                // tmp.modulesFit = data.store_Planogram.modulesFit;
                // tmp.fits = data.store_Planogram.fits;
                // node.setData(tmp)
            },
            onFilterTextBoxChanged() {
                let self = this;
                self.gridApi.setQuickFilter(self.filterText);
            },
            onGridReady(params) {
                let self = this;
                self.gridApi = params.api;
                self.columnApi = params.columnApi;
                this.gridApi.resetRowHeights();
                this.gridApi.sizeColumnsToFit()
            },
            openEdit(item) {
                let self = this;
                self.$refs.maint.show(false, item, newItem => {
                    for (var prop in item) {
                        item[prop] = newItem[prop];
                    }
                });
            },
            getItems() {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + `Retailer/Category_Link`)
                    .then(r => {
                        console.log(r);

                        self.rowData = r.data;
                        delete Axios.defaults.headers.common["TenantID"];
                    })
            },
            openAdd() {
                let self = this;
                self.$refs.addModal.show(data => {
                    console.log("[ADDMODAL]");
                    console.log(data);
                    self.SaveEntry(data, saveCallback => {
                        console.log(saveCallback);
                        self.rowData.push(saveCallback)
                    })
                });
            }
        }
    }
</script>

<style scoped>
    .list-height {
        height: calc(100vh - 220px);
        overflow: auto;
    }
</style>