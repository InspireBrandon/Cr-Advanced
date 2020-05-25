<template>
    <div>
        <v-container fluid class="pa-0 ma-0" grid-list-md>
            <v-layout row wrap class="pa-0 ma-0">
                <v-flex md12 class="pa-0 ma-0">
                    <v-toolbar flat dense dark>
                        <v-toolbar-title>Planogram Role</v-toolbar-title>
                    </v-toolbar>
                    <v-toolbar flat dense dark color="grey darken-3">
                        <v-spacer></v-spacer>
                        <v-btn @click="editRoleConfig" color="primary">Edit Role Defaults</v-btn>
                    </v-toolbar>
                    <ag-grid-vue id="ag-Grid" :gridOptions="gridOptions"
                        style="width: 100%;  height: calc(100vh - 160px);" :defaultColDef="defaultColDef"
                        class="ag-theme-balham" :columnDefs="columnDefs" :rowData="rowData" :sortable="true"
                        :filter="true" :suppressRowClickSelection="true" :enableColResize="true"
                        :enableRangeSelection="true" rowSelection="multiple" :rowDeselection="true" :resizable="true"
                        :floatingFilter="true" :groupMultiAutoColumn="true" :onGridReady="onGridReady"></ag-grid-vue>
                </v-flex>
            </v-layout>
        </v-container>
        <AutoRangeConfigModal ref="autoRangeConfigModal" />
    </div>
</template>

<script>
    import Axios from 'axios';
    import AutoRangeConfigModal from './AutoRangeConfigModal.vue';

    import {
        AgGridVue
    } from "ag-grid-vue";
    export default {
        data() {
            return {
                columnDefs: [{
                        headerName: "Planogram",
                        field: "planogram",
                        sortable: true,
                    },
                    {
                        headerName: "Role",
                        field: "role",
                        sortable: true,
                        editable: true
                    }
                ],
                rowData: [],
                defaultColDef: {
                    onCellValueChanged: this.updatePlanogramRole
                },
                gridOptions: {
                    rowHeight: 35,
                    pinnedTopRowData: [],
                    pinnedBottomRowData: [],
                    context: {
                        componentParent: this
                    }
                }
            };
        },
        components: {
            AgGridVue,
            AutoRangeConfigModal
        },
        created() {
            let self = this;
            self.gridOptions.context.componentParent = this;
            self.getReport();
        },
        methods: {
            editRoleConfig() {
                let self = this;
                
                self.$refs.autoRangeConfigModal.show();
            },
            onGridReady(params) {
                let self = this;
                self.gridApi = params.api;
                self.columnApi = params.columnApi;
            },
            getReport() {
                let self = this;

                Axios.get(process.env.VUE_APP_API + "PlanogramRole/Report")
                    .then(r => {
                        self.rowData = r.data;
                    })
                    .catch(e => {

                    })
            },
            updatePlanogramRole(params) {
                let self = this;

                if (params.newValue != params.oldValue) {
                    var planogramID = params.data.planogramID;
                    var categoryRole = params.newValue;

                    Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                    Axios.post(process.env.VUE_APP_API + `PlanogramRole?planogramID=${planogramID}&categoryRole=${categoryRole}`)
                        .then(r => {
                        })
                        .catch(e => {

                        })
                }
            }
        }
    };
</script>