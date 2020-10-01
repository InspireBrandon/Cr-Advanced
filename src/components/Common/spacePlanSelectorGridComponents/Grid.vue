<template>
    <div>
        <ag-grid-vue v-if="rowData" :gridOptions="gridOptions" @selection-changed="onSelectionChanged" :sideBar='false'
            style="width: 100%;  height: calc(100vh - 120px);" :defaultColDef="defaultColDef" class="ag-theme-balham"
            :columnDefs="headers" :rowData="rowData" :enableSorting="true" :enableFilter="true"
            :suppressRowClickSelection="false" :enableRangeSelection="true" rowSelection="multiple"
            :rowDeselection="true" :enableColResize="true" :floatingFilter="true" :gridReady="gridReady"
            :onGridReady="onGridReady" :groupMultiAutoColumn="true">
        </ag-grid-vue>
    </div>
</template>

<script>
    import completeCheckbox from '@/components/Common/spacePlanSelectorGridComponents/completeCheckBox'
    import distribute from '@/components/Common/spacePlanSelectorGridComponents/Distribute'
    import FloorPlan from '@/components/Common/spacePlanSelectorGridComponents/FloorPlan.vue'

    import {
        AgGridVue
    } from "ag-grid-vue";
    export default {
        components: {
            completeCheckbox,
            AgGridVue,
            distribute,
            FloorPlan
        },
        props: ["headers", "rowData", "setCanDistribute", "setComplete", "setFloorPlan", "selectedSpacePlan", "setSelectedPlano"],
        data() {
            return {
                defaultColDef: {
                    onCellValueChanged: this.UpdateLine
                },
                gridOptions: {
                    rowHeight: 35,
                    context: {
                        componentParent: this
                    },

                },
            }
        },
        methods: {
            gridReady(params) {
                this.gridApi = params.api;
                this.columnApi = params.columnApi;

                setTimeout(() => {
                    this.gridApi.resetRowHeights();
                    this.gridApi.sizeColumnsToFit()
                }, 200);
            },
            onGridReady(params) {
                this.gridApi = params.api;
                this.columnApi = params.columnApi;

                setTimeout(() => {
                    this.gridApi.resetRowHeights();
                    this.gridApi.sizeColumnsToFit()
                }, 200);
            },
            onSelectionChanged(e) {
                let self = this
                var rows = e.api.getSelectedNodes()
                let newslct = rows[0].data
                self.setSelectedPlano(newslct)
            },
        }
    }
</script>