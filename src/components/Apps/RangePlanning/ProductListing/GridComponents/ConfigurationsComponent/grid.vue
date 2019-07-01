<template>
    <div>
        <ag-grid-vue id="ag-Grid" :gridOptions="gridOptions" style="width: 100%;  height: calc(100vh - 300px);"
            :defaultColDef="defaultColDef" class="ag-theme-balham" :columnDefs="columnDefs" :rowData="rowData"
            :sortable="true" :filter="true" :suppressRowClickSelection="true" :enableRangeSelection="true"
            rowSelection="multiple" :rowDeselection="true" :resizable="true" :floatingFilter="true"
            :groupMultiAutoColumn="true" :onGridReady="onGridReady">
        </ag-grid-vue>

    </div>

</template>

<script>
    import Axios from 'axios';
    import Button from './button.vue';
    import ResourceType from './ResourceType.vue';

    import {
        AgGridVue
    } from "ag-grid-vue";

    export default {
        props: ['rowData'],
        components: {
            AgGridVue,
            Button,
            ResourceType
        },
        data() {
            return {
                columnDefs: [],
                defaultColDef: {},
                gridOptions: {
                    context: {
                        componentParent: this
                    }
                },
            }
        },
        beforeMount() {
            let self = this;
            self.columnDefs = require('./headers.json');
        },
        methods: {
            onGridReady(params) {
                let self = this;
                self.gridApi = params.api;
                self.columnApi = params.columnApi;
                self.gridApi.resetRowHeights();
                self.gridApi.sizeColumnsToFit()
            },
        }
    }
</script>