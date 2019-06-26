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
        <!-- <simple-maint ref="simpleMaint" /> -->
        <v-dialog persistent v-model="dialog" max-width="800px">
            <v-card>
                <v-toolbar dark flat color="primary">
                    <v-toolbar-title>Maintain Period</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="dialog = false">
                        <v-icon>close</v-icon>
                    </v-btn>
                </v-toolbar>

                <v-card-text>
                    <v-form>
                        <v-container grid-list-md>
                            <v-layout row wrap>
                                <v-flex md6>
                                    <v-menu v-model="menu2" :close-on-content-click="false" :nudge-right="40" lazy
                                        transition="scale-transition" offset-y full-width min-width="290px">
                                        <template v-slot:activator="{ on }">
                                            <v-text-field v-model="form.period_From_Date" label="Picker without buttons"
                                                prepend-icon="event" readonly v-on="on"></v-text-field>
                                        </template>
                                        <v-date-picker v-model="form.period_From_Date" @input="menu2 = true">
                                        </v-date-picker>
                                    </v-menu>
                                </v-flex>
                                <v-flex md6>
                                    <v-text-field label="Period Name" v-model="form.period_Name"></v-text-field>
                                </v-flex>
                                <v-flex md6>
                                    <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40" lazy
                                        transition="scale-transition" offset-y full-width min-width="290px">
                                        <template v-slot:activator="{ on }">
                                            <v-text-field v-model="form.period_To_Date" label="Picker without buttons"
                                                prepend-icon="event" readonly v-on="on"></v-text-field>
                                        </template>
                                        <v-date-picker v-model="form.period_To_Date" @input="menu = true">
                                        </v-date-picker>
                                    </v-menu>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-form>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="save">
                        Submit
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import Axios from 'axios';
    import {
        AgGridVue
    } from "ag-grid-vue";
    import moment from 'moment';
    import Button from './GridComponents/button';

    export default {
        name: 'common-import-list',
        props: ['name', 'headerName'],
        components: {
            AgGridVue,
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
                        self.items = r.data;
                        delete Axios.defaults.headers.common["TenantID"];
                    })
            },
            openEdit(items) {
                let self = this;
                self.isAdd = false
                self.dialog = true
                self.form.id = self.params.data.id
                self.form.period_Name = self.params.data.period_Name
                self.form.period_To_Date = moment(self.params.data.period_To_Date).format('YYYY-MM-DD')
                self.form.period_From_Date = moment(self.params.data.period_From_Date).format('YYYY-MM-DD')
            },
            openAdd() {
                let self = this;

                self.isAdd = true
                self.dialog = true
                self.form.period_Name = null
                self.form.period_To_Date = null
                self.form.period_From_Date = null
                self.rowData.push(data);
            },
            save() {
                let self = this;
                let type = self.isAdd ? "post" : "put";

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios[type](process.env.VUE_APP_API + `Retailer/Period`, self.form)
                    .then(r => {
                        if (!self.isAdd)
                            self.form.id = r.data.id;


                        Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                        self.dialog = false;
                    })
            },
        }
    }
</script>

<style scoped>
    .list-height {
        height: calc(100vh - 200px);
        overflow: auto;
    }
</style>