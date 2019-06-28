<template>
    <div class="text-xs-center">
        <v-container fluid class="pa-0 ma-0" grid-list-md>
            <v-layout justify-center>
                <v-dialog v-model="dialog" width="1500">
                    <v-card>
                        <v-toolbar flat color="primary" dark>
                            <v-toolbar-title>Title</v-toolbar-title>
                            <v-spacer></v-spacer>
                        </v-toolbar>
                        <v-layout row wrap>
                            <v-flex md2 justify-start fill-height>
                                <v-list dense class="pt-0" fill-height>
                                    <v-list-tile v-for="item in items" :key="item.title">
                                        <v-list-tile-action>
                                            <v-icon>{{ item.icon }}</v-icon>
                                        </v-list-tile-action>

                                        <v-list-tile-content>
                                            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                                        </v-list-tile-content>
                                    </v-list-tile>
                                </v-list>
                            </v-flex>
                            <v-flex md10 justify-end>
                                <v-toolbar flat color="primary" dark>
                                    <v-toolbar-title>Title</v-toolbar-title>
                                    <v-spacer></v-spacer>
                                </v-toolbar>
                            </v-flex>
                            <v-flex md10>
                                <v-card-text class="pt-0">
                                    <ag-grid-vue id="ag-Grid" :gridOptions="gridOptions"
                                        style="width: 100%;  height: calc(100vh - 130px);"
                                        :defaultColDef="defaultColDef" class="ag-theme-balham" :columnDefs="columnDefs"
                                        :rowData="rowData" :enableSorting="true" :enableFilter="true"
                                        :suppressRowClickSelection="true" :enableRangeSelection="true"
                                        rowSelection="multiple" :rowDeselection="true" :enableColResize="true"
                                        :floatingFilter="true" :groupMultiAutoColumn="true" :gridReady="onGridReady">
                                    </ag-grid-vue>
                                </v-card-text>
                            </v-flex>
                        </v-layout>

                        <v-divider></v-divider>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="info" flat @click="dialog = false">Cancel</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
    import Axios from 'axios';

    import {
        AgGridVue
    } from "ag-grid-vue";

    import Button from "./button.vue";

    export default {
        name: "config",
        components: {
            AgGridVue,
            Button,
        },

        data() {
            return {
                dialog: false,
                drawer: null,
                items: [{
                        title: 'Event sheet',
                        icon: 'dashboard'
                    },
                    {
                        title: 'Option 2',
                        icon: 'account_box'
                    },
                    {
                        title: 'Option 3',
                        icon: 'gavel'
                    }
                ],
                filterText: '',
                columnDefs: [],
                rowData: [],
                defaultColDef: {},
                gridOptions: {
                    rowHeight: 35,
                    pinnedTopRowData: [],
                    pinnedBottomRowData: [],
                    context: {
                        componentParent: self
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
            self.columnDefs = require('./headers.json');
        },
        mounted() {
            let self = this;

            document.addEventListener('DOMContentLoaded', function () {
                var gridID = document.querySelector('#ag-grid');
                new agGrid.Grid(gridID, self.gridOptions);
            });
        },
        methods: {
            show(afterReturn) {
                let self = this;
                self.afterReturn = afterReturn;
                self.dialog = true;
            },
            onFilterTextBoxChanged() {
                let self = this;
                this.gridApi.setQuickFilter(self.filterText);
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

                Axios.get(process.env.VUE_APP_API + `Event_Sheet_Resource`)
                    .then(r => {
                        self.rowData = r.data;
                        delete Axios.defaults.headers.common["TenantID"];
                    })
            },
        }
    }
</script>