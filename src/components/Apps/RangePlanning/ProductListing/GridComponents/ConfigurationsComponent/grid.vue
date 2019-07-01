<template>
    <div>
        <ag-grid-vue id="ag-Grid" :gridOptions="gridOptions" style="width: 100%;  height: calc(100vh - 300px);"
            :defaultColDef="defaultColDef" class="ag-theme-balham" :columnDefs="columnDefs" :rowData="rowData"
            :sortable="true" :filter="true" :suppressRowClickSelection="true" :enableRangeSelection="true"
            rowSelection="multiple" :rowDeselection="true" :resizable="true" :floatingFilter="true"
            :groupMultiAutoColumn="true" :onGridReady="onGridReady">
        </ag-grid-vue>

        <v-dialog v-model="EditDialog" persistent max-width="600px" height="500px">
            <v-card>
                <v-toolbar dark flat color="blue darken-2" scroll-off-screen>
                    <v-toolbar-title>Configuration Edit</v-toolbar-title>
                </v-toolbar>
                <v-form @submit.prevent="saveForm">
                    <v-card-text>
                        <v-container grid-list-md>
                            <v-layout wrap>
                                <v-flex xs12 sm6 md6>
                                    <v-text-field label="First name" v-model="editForm.firstname" required>
                                    </v-text-field>
                                </v-flex>
                                <v-flex xs12 sm6 md6>
                                    <v-text-field label="Last name" v-model="editForm.lastname" required>
                                    </v-text-field>
                                </v-flex>
                                <v-flex xs12>
                                    <v-select required v-model="editForm.resourceType" :items="resourceTypeItems"
                                        item-text="text" item-value="key" label="Resource Type">
                                    </v-select>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="secondary" flat @click="EditDialog = false">Close</v-btn>
                        <v-btn color="primary" type="submit">Save</v-btn>
                    </v-card-actions>
                </v-form>
            </v-card>
        </v-dialog>
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
                EditDialog: false,
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
                    resourceType: 0
                },
                resourceTypeItems: [{
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
                self.gridApi.resetRowHeights();
                self.gridApi.sizeColumnsToFit()
            },
            openEdit(item) {
                let self = this;
                self.EditDialog = true;
                self.editForm = item;
            },
            saveForm(item) {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.put(process.env.VUE_APP_API + `Event_Sheet_Resource`, self.editForm)
                    .then(r => {
                        self.editForm.id = item.id
                        Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                        self.EditDialog = false;
                        self.rowData.push(r.data.event_Sheet_Resource);
                        self.params.context.redrawAllRows();
                    })
            },
        }
    }
</script>