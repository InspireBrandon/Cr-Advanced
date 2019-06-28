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
                                    <Grid ref="grid" :rowData="rowData" />
                                </div>
                            </v-flex>
                        </v-layout>

                        <v-divider></v-divider>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="info" flat @click="dialog = false">Cancel</v-btn>
                        </v-card-actions>
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
            },
            removeLine() {

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