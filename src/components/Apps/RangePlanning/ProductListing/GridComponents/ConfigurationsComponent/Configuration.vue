<template>
    <div class="text-xs-center">
        <v-container fluid class="pa-0 ma-0" grid-list-md>
            <v-layout justify-center>
                <v-dialog v-model="dialog" width="1500">
                    <v-card>
                        <v-toolbar flat dark color="blue darken-2" scroll-off-screen>
                            <v-toolbar-title>Configuration</v-toolbar-title>
                            <v-spacer></v-spacer>
                            <v-btn icon @click="dialog = false">
                                <v-icon>close</v-icon>
                            </v-btn>
                        </v-toolbar>
                        <v-layout row wrap>
                            <v-flex md2 justify-start>
                                <v-list dense class="pt-0">
                                    <template v-for="(item, idx) in items">
                                        <v-list-tile @click="selectedItem = item"
                                            :class="{ 'section-selected': selectedItem == item }" :key="idx">
                                            <v-list-tile-action>
                                                <v-icon>{{ item.icon }}</v-icon>
                                            </v-list-tile-action>
                                            <v-list-tile-content>
                                                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                                            </v-list-tile-content>
                                        </v-list-tile>
                                        <v-divider :key="'d' + idx"></v-divider>
                                    </template>
                                </v-list>
                            </v-flex>
                            <v-flex md10 justify-end>
                                <v-toolbar dark flat>
                                    <v-toolbar-title>{{ selectedItem == null ? "" : selectedItem.title}}
                                    </v-toolbar-title>
                                    <v-spacer></v-spacer>
                                    <v-text-field append-icon="search" type="text" id="filter-text-box"
                                        placeholder="Filter..." @input="onFilterTextBoxChanged" v-model="filterText">
                                    </v-text-field>
                                    <v-spacer></v-spacer>
                                    Add a {{ selectedItem == null ? "" : selectedItem.title}}
                                    <v-btn dark @click="openAdd" color="primary" class="my-0">
                                        <v-icon>add</v-icon>
                                    </v-btn>
                                </v-toolbar>
                                <div>
                                    <Grid ref="grid" :rowData="rowData" :resourceTypeItems="ResourceTypeItems" />
                                </div>
                            </v-flex>
                        </v-layout>
                    </v-card>
                </v-dialog>
                <v-dialog v-model="AddDialog" persistent max-width="600px" height="500px">
                    <v-card>
                        <v-form @submit.prevent="saveForm" ref="form">
                            <v-toolbar dark flat color="blue darken-2" scroll-off-screen>
                                <v-toolbar-title>Configuration Add</v-toolbar-title>
                            </v-toolbar>
                            <v-card-text>
                                <v-container grid-list-md>
                                    <v-layout wrap>
                                        <v-flex xs12 sm6 md6>
                                            <v-text-field label="First name" v-model="addForm.firstname" required>
                                            </v-text-field>
                                        </v-flex>
                                        <v-flex xs12 sm6 md6>
                                            <v-text-field label="Last name" v-model="addForm.lastname" required>
                                            </v-text-field>
                                        </v-flex>
                                        <v-flex xs12>
                                            <v-select required v-model="addForm.resourceType" :items="ResourceTypeItems"
                                                item-text="text" item-value="key" label="Resource Type">
                                            </v-select>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                            </v-card-text>
                            <v-divider></v-divider>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="secondary" flat @click="AddDialog = false">Close</v-btn>
                                <v-btn color="primary" type="submit">Save</v-btn>
                            </v-card-actions>
                        </v-form>
                    </v-card>
                </v-dialog>

            </v-layout>
        </v-container>
    </div>
</template>

<script>
    import Axios from 'axios';

    import Grid from './grid';

    export default {
        name: "config",
        components: {
            Grid
        },
        data() {
            return {
                AddDialog: false,
                addForm: {
                    id: 0,
                    firstname: '',
                    lastname: '',
                    resourceType: 0
                },
                ResourceTypeItems: [{
                        value: 0,
                        text: "Retail Buyer"
                    },
                    {
                        value: 1,
                        text: "Retail Stock Planner"
                    },
                    {
                        value: 2,
                        text: "Buyer Assistant"
                    },
                    {
                        value: 3,
                        text: "Order Clerk"
                    }
                ],
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
                rowData: [],
                selectedItem: null
            }
        },
        created() {
            this.selectedItem = this.items[0];
        },
        computed: {},
        methods: {
            show(afterReturn) {
                let self = this;
                self.getItems();
                self.afterReturn = afterReturn;
                self.dialog = true;
            },
            onFilterTextBoxChanged() {
                let self = this;
                self.$refs.grid.gridApi.setQuickFilter(self.filterText);
            },
            openAdd() {
                let self = this;
                self.AddDialog = true;
                self.$refs.form.reset()
            },
            saveForm() {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.post(process.env.VUE_APP_API + `Event_Sheet_Resource`, self.addForm)
                    .then(r => {
                        Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                        self.AddDialog = false;
                        self.rowData.push(r.data.event_Sheet_Resource);
                    })
            },
            getItems() {
                let self = this;


                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + `Event_Sheet_Resource`)
                    .then(r => {
                        self.rowData = r.data.event_Sheet_Resources;
                        delete Axios.defaults.headers.common["TenantID"];
                    })
            },
        }
    }
</script>

<style>
    .section-selected {
        background: lightgray;
    }
</style>