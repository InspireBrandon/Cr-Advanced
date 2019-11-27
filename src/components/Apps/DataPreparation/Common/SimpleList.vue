<template>
    <div>
        <v-toolbar dark flat>
            <v-toolbar-title>{{name}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-text-field append-icon="search" type="text" id="filter-text-box" placeholder="Filter..."
                @input="onFilterTextBoxChanged" v-model="filterText">
            </v-text-field>
            <v-spacer></v-spacer>
            Add a {{name}}
            <v-btn dark @click="openAdd" color="primary" class="my-0">
                <v-icon>add</v-icon>
            </v-btn>
        </v-toolbar>
        <ag-grid-vue id="ag-Grid" :gridOptions="gridOptions" style="width: 100%;  height: calc(100vh - 130px);"
            :defaultColDef="defaultColDef" class="ag-theme-balham" :columnDefs="columnDefs" :rowData="rowData"
            :enableSorting="true" :enableFilter="true" :suppressRowClickSelection="true" :enableRangeSelection="true"
            rowSelection="multiple" :rowDeselection="true" :enableColResize="true" :floatingFilter="true"
            :groupMultiAutoColumn="true" :onGridReady="onGridReady">
        </ag-grid-vue>
        <SimpleMaint :hasCode="hasCode" :name="name" :headerName="headerName" ref="maint"></SimpleMaint>
    </div>
</template>

<script>
    import SimpleMaint from '@/components/Apps/DataPreparation/Common/SimpleMaint.vue'
    import Button from './GridComponents/button';
    import Axios from 'axios';
    import {
        AgGridVue
    } from "ag-grid-vue";

    export default {
        name: 'common-import-list',
        props: ['name', 'headerName', 'hasCode', 'passedHeaders'],
        components: {
            SimpleMaint,
            AgGridVue,
            Button
        },
        data ()  {
            let self = this;

            return {
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
        beforeMount() {
            let self = this;
            console.log("passedHeaders",self.passedHeaders);
            
            if (self.passedHeaders == null) {
                self.columnDefs = require('./headers.json');
            } else {
                self.columnDefs = self.passedHeaders
            }

        },
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

                Axios.get(process.env.VUE_APP_API + `Retailer/${self.name}`)
                    .then(r => {
                        console.log(r.data);

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