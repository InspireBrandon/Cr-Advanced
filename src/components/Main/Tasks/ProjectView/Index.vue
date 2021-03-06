<template>
    <div>
        <ag-grid-vue :gridOptions="gridOptions" style="width: 100%;  height: calc(100vh - 158px);"
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
    import AssignTask from '@/components/Common/AssignTask'
    import SubtaskModal from './../Subtask.vue'

    import DataPrepAction from "./GridComponents/DataPrepAction.vue";
    import RangeAction from "./GridComponents/RangeAction.vue";
    import PlanogramAction from "./GridComponents/PlanogramAction/Index.vue";
    
    import ProjectGroupName from './GridComponents/ProjectGroupName.vue'

    export default {
        name: 'ProjectView',
        props: ['data', 'typeList', 'statusList', 'accessType'],
        components: {
            AssignTask,
            SubtaskModal,
            AgGridVue,
            Status,
            Type,
            DataPrepAction,
            RangeAction,
            PlanogramAction,
            ProjectGroupName
        },
        data() {
            return {
                columnDefs: [],
                defaultColDef: {
                    onCellValueChanged: this.onCellValueChanged
                },
                gridOptions: {
                    groupMultiAutoColumn: true,
                    rowHeight: 35,
                    pinnedTopRowData: [],
                    pinnedBottomRowData: [],
                    context: {
                        componentParent: this
                    },
                    suppressRowTransform: true
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

<style>
    .prominent {
        background: #424242;
        color: white;
    }

    .ag-theme-balham .ag-root {
        border-top: 0px !important;
    }
</style>


<style scoped>
    .scrollable {
        height: calc(100vh - 300px);
        overflow: auto;
    }
</style>