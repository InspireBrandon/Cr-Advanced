<template>
    <div>
        <!-- <SimpleList name="Store"></SimpleList> -->
        <v-container fluid class="pa-0 ma-0" grid-list-md>
            <v-layout row wrap class="pa-0 ma-0">
                <v-flex md12 class="pa-0 ma-0">
                    <v-toolbar flat dense dark>
                        <v-toolbar-title>Store</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-text-field append-icon="search" type="text" id="filter-text-box" placeholder="Filter..."
                            @input="onFilterTextBoxChanged" v-model="filterText">
                        </v-text-field>
                        <v-spacer></v-spacer>
                        <v-btn dark @click="openAdd" color="primary" class="my-0">
                            <v-icon>add</v-icon>
                        </v-btn>
                    </v-toolbar>
                    <ag-grid-vue id="ag-Grid" :gridOptions="gridOptions"
                        style="width: 100%;  height: calc(100vh - 160px);" :defaultColDef="defaultColDef"
                        class="ag-theme-balham" :columnDefs="columnDefs" :rowData="rowData" :sortable="true"
                        :filter="true" :suppressRowClickSelection="true" :enableRangeSelection="true"
                        rowSelection="multiple" :rowDeselection="true" :resizable="true" :floatingFilter="true"
                        :groupMultiAutoColumn="true" :onGridReady="onGridReady">
                    </ag-grid-vue>
                </v-flex>
            </v-layout>
        </v-container>
        <ModifyStore ref="modifyStore" />
    </div>
</template>

<script>
    import ModifyStore from '@/components/Apps/DataPreparation/Types/Store/Modify/Index.vue'
    import Button from './Modify/GridComponents/button';
    import Axios from 'axios'
    import {
        AgGridVue
    } from "ag-grid-vue";


    export default {
        data() {
            return {
                filterText: '',
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
                        componentParent: this
                    },
                    rowClassRules: {
                        'disabled-line': 'data.can_edit'
                    }
                },

            }
        },
        components: {
            ModifyStore,
            AgGridVue,
            Button
        },
        created() {
            let self = this;

            self.gridOptions.context.componentParent = this;
            self.getStores();
        },
        beforeMount() {
            let self = this;
            // console.log(require('./headers.json'))
            self.columnDefs = require('./headers.json');
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
                self.$refs.modifyStore.open(item);
            },
            getStores() {
                let self = this

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + `Retailer/Store`)
                    .then(r => {
                        console.log(r);

                        self.rowData = r.data;
                        delete Axios.defaults.headers.common["TenantID"];
                    })
            },
            openAdd() {},
        }

    }
</script>