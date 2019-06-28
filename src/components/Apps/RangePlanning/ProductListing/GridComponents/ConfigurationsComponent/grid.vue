<template>
    <div>
        <ag-grid-vue id="ag-Grid" :gridOptions="gridOptions" style="width: 100%;  height: calc(100vh - 300px);"
            :defaultColDef="defaultColDef" class="ag-theme-balham" :columnDefs="columnDefs" :rowData="rowData"
            :sortable="true" :filter="true" :suppressRowClickSelection="true" :enableRangeSelection="true"
            rowSelection="multiple" :rowDeselection="true" :resizable="true" :floatingFilter="true"
            :groupMultiAutoColumn="true" :onGridReady="onGridReady">
        </ag-grid-vue>

        <v-dialog v-model="openEditDialog" persistent max-width="600px" height="500px">
            <v-card>
                <v-toolbar dark flat color="blue darken-2" scroll-off-screen>
                    <v-toolbar-title>Configuration Edit</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                    <v-container grid-list-md>
                        <v-layout wrap>
                            <v-flex xs12 sm6 md6>
                                <v-text-field label="First name" required></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6 md6>
                                <v-text-field label="Last name" required>
                                </v-text-field>
                            </v-flex>
                            <v-flex xs12>
                                <v-select required v-model="editForm.ResourceType" :items="ResourceTypeItems"
                                    item-text="text" item-value="key" label="Resource Type">
                                </v-select>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="secondary" flat @click="openEditDialog = false">Close</v-btn>
                    <v-btn color="primary" @click="openEditDialog = false">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>

</template>

<script>
    import Button from './button.vue';

    import {
        AgGridVue
    } from "ag-grid-vue";

    export default {
        props: ['rowData'],
        components: {
            AgGridVue,
            Button
        },
        data() {
            return {
                openEditDialog: false,
                columnDefs: [],
                defaultColDef: {},
                gridOptions: {
                    context: {
                        componentParent: this
                    }
                },
                editForm: {
                    id: 0,
                    firstname: '',
                    lastname: '',
                    ResourceType: 0
                },
                ResourceTypeItems: [{
                        key: 1,
                        text: "Retail Buyer"
                    },
                    {
                        key: 2,
                        text: "Retail Stock Planner"
                    },
                    {
                        key: 3,
                        text: "Buyer Assistant"
                    },
                    {
                        key: 4,
                        text: "Order Clerk"
                    }
                ],
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
            },
            openEdit(item) {
                let self = this;
                console.log("Here we are", item)
                self.openEditDialog = true;
            },
        }
    }
</script>