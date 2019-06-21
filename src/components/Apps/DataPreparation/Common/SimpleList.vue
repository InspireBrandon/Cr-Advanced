<template>
    <div>
        <!-- <v-container grid-list-md>
            <v-layout row wrap>
                <v-flex>
                    <v-card>
                        <v-toolbar flat dense dark>
                            <v-btn icon @click="$router.go(-1)">
                                <v-icon>arrow_back</v-icon>
                            </v-btn>
                            <v-toolbar-title>{{ name }}</v-toolbar-title>
                            <v-spacer></v-spacer>
                            <v-btn icon @click="openAdd">
                                <v-icon>add_circle</v-icon>
                            </v-btn>
                        </v-toolbar>
                        <v-list dense class="pa-0 list-height">
                            <template v-if="index < 25" v-for="(item, index) in paginatedItems">
                                <v-list-tile :key="item.title" avatar ripple>
                                    <v-list-tile-content>
                                        <v-list-tile-title>
                                            <span class="font-weight-medium">{{ item.displayname }}</span>
                                        </v-list-tile-title>
                                    </v-list-tile-content>
                                    <v-list-tile-action>
                                        <v-menu left>
                                            <v-btn slot="activator" icon>
                                                <v-icon>more_vert</v-icon>
                                            </v-btn>
                                            <v-list dense>
                                                <v-list-tile @click="openEdit(item)">Edit</v-list-tile>
                                                <v-divider></v-divider>
                                                <v-list-tile>Delete</v-list-tile>
                                            </v-list>
                                        </v-menu>
                                    </v-list-tile-action>
                                </v-list-tile>
                                <v-divider v-if="index + 1 < items.length" :key="index"></v-divider>
                            </template>
                        </v-list>
                        <v-toolbar flat dense dark>
                            <v-spacer></v-spacer>
                            <v-btn :disabled="pageNumber == 0" color="primary" @click="pageNumber--">back</v-btn>
                            {{ pageNumber + 1 }} /
                            {{ Math.round(items.length / allowedRecords) == 0 ? 1 : Math.round(items.length / allowedRecords) }}
                            <v-btn :disabled="pageNumber == (Math.round(items.length / allowedRecords) - 1) "
                                color="primary" @click="pageNumber++">next</v-btn>
                            <v-spacer></v-spacer>
                        </v-toolbar>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container> -->
        <v-toolbar dark flat>
            <v-toolbar-title>{{name}}</v-toolbar-title>
            <v-spacer></v-spacer>
            Add a {{name}}
            <v-btn dark @click="openAdd" class="ma-0" small icon>
                <v-icon color="primary">add</v-icon>
            </v-btn>
        </v-toolbar>
        <v-text-field v-model="searchTerm" placeholder="Filter"></v-text-field>
        <ag-grid-vue :gridOptions="gridOptions"
            style="width: 100%;  height: calc(100vh - 130px);" :defaultColDef="defaultColDef" class="ag-theme-balham"
            :columnDefs="columnDefs" :rowData="filteredFields" :enableSorting="true" :enableFilter="true"
            :suppressRowClickSelection="true" :enableRangeSelection="true" rowSelection="multiple"
            :rowDeselection="true" :enableColResize="true" :floatingFilter="true" :gridReady="onGridReady"
            :groupMultiAutoColumn="true">
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
        props: ['name', 'headerName', 'hasCode'],
        components: {
            SimpleMaint,
            AgGridVue,
            Button
        },
        data: () => {
            let self = this;

            return {
                searchTerm: '',
                items: [],
                pageNumber: 0,
                allowedRecords: 25,
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
        computed: {
            paginatedItems() {
                let self = this;

                let items = JSON.parse(JSON.stringify(self.items));
                let tmp = items.splice(((self.pageNumber * self.allowedRecords)), self.allowedRecords)
                return tmp;
            },
            filteredFields() {
                let self = this;

                let filteredFields = self.rowData.filter(data => {
                    return data.displayname.toLowerCase().includes(self.searchTerm.toLowerCase());
                })

                return filteredFields;
            }
        },
        beforeMount() {
            let self = this;
            // console.log(require('./headers.json'))
            self.columnDefs = require('./headers.json');
        },
        methods: {
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