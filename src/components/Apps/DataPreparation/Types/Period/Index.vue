<template>
    <div>
        <v-toolbar dark flat>
            <v-toolbar-title>Period</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-text-field append-icon="search" type="text" id="filter-text-box" placeholder="Filter..."
                @input="onFilterTextBoxChanged" v-model="filterText">
            </v-text-field>
            <v-spacer></v-spacer>
            Add a Period
            <v-btn dark @click="openAdd" color="primary" class="my-0">
                <v-icon>add</v-icon>
            </v-btn>
        </v-toolbar>
        <ag-grid-vue id="ag-Grid" :gridOptions="gridOptions" style="width: 100%;  height: calc(100vh - 130px);"
            :defaultColDef="defaultColDef" class="ag-theme-balham" :columnDefs="columnDefs" :rowData="rowData"
            :enableSorting="true" :enableFilter="true" :suppressRowClickSelection="true" :enableRangeSelection="true"
            rowSelection="multiple" :rowDeselection="true" :enableColResize="true" :floatingFilter="true"
            :groupMultiAutoColumn="true" :gridReady="onGridReady">
        </ag-grid-vue>
        <simple-maint ref="simpleMaint" />
    </div>
</template>

<script>
    import Axios from 'axios';
    import SimpleMaint from './SimpleMaint.vue';
    import {
        AgGridVue
    } from "ag-grid-vue";
    import moment from 'moment';
    import Button from './GridComponents/button';
import { log } from 'util';


    export default {
        name: 'common-import-list',
        props: ['name', 'headerName'],
        components: {
            AgGridVue,
            SimpleMaint,
            Button
        },
        data: () => {
            return {
                filterText: '',
                items: [],
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
                isAdd: true,
                menu: false,
                menu2: false,
                items: [],
                form: {
                    id: null,
                    period_Name: null,
                    period_To_Date: null,
                    period_From_Date: null
                },
                dialog: false
            }
        },
        computed: {
            formatDate() {
                if (this.form.period_From_Date != null) {
                    moment(this.form.period_From_Date).format('YYYY-MM-DD')
                }
            }
        },
        mounted() {
            let self = this;
            document.addEventListener('DOMContentLoaded', function () {
                var gridID = document.querySelector('#ag-grid');
                new agGrid.Grid(gridID, self.gridOptions);
            });
        },
        beforeMount() {
            let self = this;
            // console.log(require('./headers.json'))
            self.columnDefs = require('./headers.json');
        },
        created() {
            this.getItems();
        },
        methods: {
            onFilterTextBoxChanged() {
                let self = this;
                this.gridApi.setQuickFilter(self.filterText);
            },
            onGridReady(params) {
                let self = this;
                self.gridApi = params.api;
                self.columnApi = params.columnApi;
            },
            getItems() {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + `Retailer/Period`)
                    .then(r => {
                        self.rowData = r.data;
                        console.log("log", r.data);
                        

                        delete Axios.defaults.headers.common["TenantID"];
                    })
            },
            openAdd() {
                let self = this;
                self.$refs.maint.show(true, null, data => {
                    self.isAdd = true

                    self.dialog = true
                    self.form.period_Name = null
                    self.form.period_To_Date = null
                    self.form.period_From_Date = null
                    self.rowData.push(data);
                });
            }
        }
    }
</script>

<style scoped>
    .list-height {
        height: calc(100vh - 200px);
        overflow: auto;
    }
</style>