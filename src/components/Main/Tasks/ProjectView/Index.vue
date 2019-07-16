<template>
    <div>
        <ag-grid-vue :gridOptions="gridOptions" style="width: 100%;  height: calc(100vh - 180px);"
            :defaultColDef="defaultColDef" class="ag-theme-balham" :columnDefs="columnDefs"
            :selectionChanged="onSelectionChanged" :rowData="data" :enableSorting="true" :enableFilter="true"
            :suppressRowClickSelection="true" :enableRangeSelection="true" rowSelection="multiple"
            :rowDeselection="true" :enableColResize="true" :floatingFilter="true" :onGridReady="onGridReady"
            :groupMultiAutoColumn="true">
        </ag-grid-vue>
        <AssignTask ref="assignTask" />
        <SubtaskModal ref="SubtaskModal" />
    </div>
</template>

<script>
    // Libs
    import Axios from 'axios';
    import jwt from 'jsonwebtoken';
    import {
        EventBus
    } from '@/libs/events/event-bus.js';

    // Components
    import {
        AgGridVue
    } from "ag-grid-vue";
    import Type from "./GridComponents/Type.vue";
    import Status from "./GridComponents/Status.vue";
    import Actions from "./GridComponents/Actions.vue";
    import AssignTask from '@/components/Common/AssignTask'
    import SubtaskModal from './../Subtask.vue'

    export default {
        name: 'ProjectView',
        props: ['data', 'typeList', 'statusList', 'accessType'],
        components: {
            AssignTask,
            SubtaskModal,
            AgGridVue,
            Status,
            Type,
            Actions
        },
        data() {
            return {
                columnDefs: [],
                defaultColDef: {
                    onCellValueChanged: this.onCellValueChanged
                },
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
                searchType: null,
                filterList: [],
                dropSearch: null,
                users: [],
                selectedUser: null,
                projects: [],
                projectsList: [],
                userAccess: null,
                userAccessTypeID: -1,
                rowData: []
            }
        },
        created() {
            this.gridOptions.context.componentParent = this;
        },
        beforeMount() {
            let self = this;
            self.columnDefs = require('./Headers.json');
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
                this.gridApi = params.api;
                this.columnApi = params.columnApi;

                setTimeout(() => {
                    self.gridApi.resetRowHeights();
                    self.gridApi.sizeColumnsToFit()
                }, 60);
            },
            onSelectionChanged() {

            },
            getItems() {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + `ProjectTX/TakeoverView`)
                    .then(r => {
                        self.rowData = r.data;
                        console.log("data", r.data)
                        delete Axios.defaults.headers.common["TenantID"];
                    })
            },
        }
    }

    function returnStartStatusByType(type) {
        let retval;

        switch (type) {
            case 1: {
                retval = 6;
            }
            break;
        case 2: {
            retval = 7;
        }
        break;
        case 3: {
            retval = 8;
        }
        break;
        }

        return retval;
    }
</script>

<style scoped>
    .scrollable {
        height: calc(100vh - 300px);
        overflow: auto;
    }
</style>