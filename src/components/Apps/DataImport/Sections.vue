<template>
    <v-container grid-list-md>
        <v-layout row wrap>
            <v-flex md4>
                <v-card>
                    <v-toolbar flat dark dense>
                        <v-toolbar-title>Data Imports</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-text-field placeholder="Find"></v-text-field>
                    </v-toolbar>
                    <v-list dense class="pa-0" style="height: calc(100vh - 200px); overflow-x: auto;">
                        <template v-for="(item, idx) in items">
                            <v-list-tile @click="selectedItem = item" :class="{ 'selected': selectedItem == item }"
                                :key="item">
                                {{ item }}
                            </v-list-tile>
                            <v-divider :key="idx"></v-divider>
                        </template>
                    </v-list>
                </v-card>
            </v-flex>
            <v-flex md8>
                <v-layout row wrap>
                    <v-flex>
                        <v-card>
                            <v-toolbar flat dark dense>
                                <v-toolbar-title>Data Import - {{ selectedItem }}</v-toolbar-title>
                                <v-spacer></v-spacer>
                                <v-btn icon small @click="downloadTemplate">
                                    <v-icon>attachment</v-icon>
                                </v-btn>
                            </v-toolbar>
                            <v-card-text>
                                <!-- <v-data-table hide-actions :headers="headers"></v-data-table> -->
                            </v-card-text>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-flex>
        </v-layout>
        <a display="none" ref="downloadLink" :href="serverAddress + 'DataImport/Template?templateName=' + selectedItem" download></a>
    </v-container>
</template>

<script>
    function cardItem(data) {
        this.name = data.name;
        this.icon = data.icon;
        this.route = data.route;
    }

    export default {
        name: 'DataImport',
        data: () => {
            return {
                serverAddress: process.env.VUE_APP_API,
                selectedItem: null,
                items: [
                    'Product Master',
                    'Sales Data',
                    'New Products',
                    'Duplicate Barcodes',
                    'Category Codes',
                    'Active Shop Codes',
                    'Product Dimentions',
                    'Product Stock',
                    'Store Clustering',
                    'Store Turnover Groups',
                    'Store Trading Space',
                    'Store Geographic Location',
                    'Store Contact Details',
                    'Store Details',
                    'New Store',
                    'Department Clustering',
                    'Catgory Clustering',
                    'Product Packaging',
                    'Item Indicators',
                    'RI by Store Cluster',
                    'RI by Custom Cluster',
                    'RI by Regional Cluster',
                    'RI by Store'
                ],
                headers: [{
                        text: "File Name",
                        sortable: false
                    },
                    {
                        text: "Date",
                        sortable: false
                    }
                ]
            }
        },
        methods: {
            openDataImport(name) {
                let self = this;
                self.$router.push('DataImport/' + name)
            },
            downloadTemplate() {
                let self = this;
                self.$refs.downloadLink.click();
            }
        }
    }
</script>

<style>
    .selected {
        background: rgb(210, 219, 223);
    }
</style>