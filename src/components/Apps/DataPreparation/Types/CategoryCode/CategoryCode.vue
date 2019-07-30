<template>
    <div>
        <v-toolbar dark flat>
            <v-toolbar-title>Category Code</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-text-field append-icon="search" type="text" id="filter-text-box" placeholder="Filter..."
                @input="onFilterTextBoxChanged" v-model="filterText">
            </v-text-field>
            <v-spacer></v-spacer>
           
            <!-- <v-btn dark @click="openAdd" color="primary" class="my-0">
                <v-icon>add</v-icon>
            </v-btn> -->
        </v-toolbar>
        <ag-grid-vue id="ag-Grid" :gridOptions="gridOptions" style="width: 100%;  height: calc(100vh - 130px);"
            :defaultColDef="defaultColDef" class="ag-theme-balham" :columnDefs="headers" :rowData="rowData"
            :enableSorting="true" :enableFilter="true" :suppressRowClickSelection="true" :enableRangeSelection="true"
            rowSelection="multiple" :rowDeselection="true" :enableColResize="true" :floatingFilter="true"
            :groupMultiAutoColumn="true" :onGridReady="onGridReady">
        </ag-grid-vue>
    </div>
</template>

<script>
    import Axios from 'axios'
    import {
        AgGridVue
    } from "ag-grid-vue";

    export default {
        props: ['name', 'headerName', 'hasCode'],
        components: {

            AgGridVue,
        },
        data: () => {
            let self = this;

            return {
                headers: [{
                        "headerName": "Category_Code",
                        "field": "category_Code",
                    }, {
                        "headerName": "Category",
                        "field": "category"
                    }, {
                        "headerName": "DisplayName",
                        "field": "displayName"
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
                        "field": "departmentName"
                    }, {
                        "headerName": "Subdepartment",
                        "field": "subdepartmentName"
                    }, {
                        "headerName": "Planogram",
                        "field": "planogramName"
                    }
                ],
                filterText: '',
                allowedRecords: 25,
                columnDefs: [],
                rowData: [],
                defaultColDef: {},
                gridOptions: {
                    rowHeight: 35,
                    pinnedTopRowData: [],
                    pinnedBottomRowData: [],
                    context: {
                        componentParent: this
                    },
                    rowClassRules: {
                        'disabled-line': 'data.can_edit'
                    }
                },

            }
        },
        created() {
            this.gridOptions.context.componentParent = this;
            this.getItems();
        },
        computed: {},

        mounted() {
            let self = this;

            document.addEventListener('DOMContentLoaded', function () {
                var gridID = document.querySelector('#ag-grid');
                new agGrid.Grid(gridID, self.gridOptions);
            });
        },
        methods: {
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
                self.$refs.maint.show(true, null, data => {
                    self.rowData.push(data);
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