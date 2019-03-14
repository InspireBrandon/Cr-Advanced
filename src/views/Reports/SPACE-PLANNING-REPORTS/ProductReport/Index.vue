<template>
        <v-card>

            <v-toolbar color="primary">
                <v-btn color="primary" icon @click="$router.go(-1)">
                        <v-icon dark>arrow_back_ios</v-icon>
                    </v-btn>
                <v-toolbar-title>
                    Space Planning Product Report
                </v-toolbar-title>
                
            </v-toolbar>
            <ag-grid-vue :columnDefs="columnDefs" :rowData="rowData" class="ag-theme-balham" :gridOptions="gridOptions "
                :sideBar='true' style="width: 100%;height: calc(70vh - 25px)">
            </ag-grid-vue>
            <!-- :gridOptions="gridOptions" :sideBar='true' style="  height: calc(70vh - 25px);"
                    :defaultColDef="defaultColDef"  :columnDefs="columnDefs" :selectionChanged="onSelectionChanged"
                    :rowData="rowData" :enableSorting="true" :enableFilter="true" :suppressRowClickSelection="true"
                    :enableRangeSelection="true" rowSelection="multiple" :rowDeselection="true" :enableColResize="true"
                    :floatingFilter="true"  :groupMultiAutoColumn="true" -->
        </v-card>
</template>

<script>
    import {
        AgGridVue
    } from "ag-grid-vue";
    export default {
        components: {
            AgGridVue,
        },
        data() {
            return {
                columnDefs: [],
                rowData: [],
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
        created() {
            let self = this
            let tmp = require('./headers.json');
            tmp.forEach(element => {
                self.columnDefs.push({
                    headerName: element.headerName,
                    field: element.field
                })
            });
        },
        methods: {

        }
    }
</script>