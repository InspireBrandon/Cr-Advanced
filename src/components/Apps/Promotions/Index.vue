<template>
    <v-card tile flat>
        <v-toolbar dense dark color="grey darken-3">
            <v-toolbar-items>
                <v-menu dark offset-y style="margin-bottom: 10px;">
                    <v-btn slot="activator" flat>
                        File
                    </v-btn>
                    <v-list dense>
                        <v-list-tile @click="newFile">
                            <v-list-tile-title>New</v-list-tile-title>
                        </v-list-tile>
                        <v-divider></v-divider>
                        <v-list-tile @click="openFile">
                            <v-list-tile-title>Open</v-list-tile-title>
                        </v-list-tile>
                        <v-divider></v-divider>
                        <v-list-tile @click="saveFile" :disabled="promotion == null">
                            <v-list-tile-title>Save</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile @click="saveFileAs" :disabled="promotion == null">
                            <v-list-tile-title>Save as</v-list-tile-title>
                        </v-list-tile>
                        <v-divider></v-divider>
                        <v-list-tile @click="closeFile" :disabled="promotion == null">
                            <v-list-tile-title>Close</v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu>
            </v-toolbar-items>
            <v-spacer></v-spacer>
            <v-toolbar-title>
                <span>Promotions</span>
            </v-toolbar-title>
        </v-toolbar>
        <v-container grid-list-md v-if="promotion != null">
            <v-layout row wrap>
                <v-flex md3 lg3>
                    <v-text-field v-model="promotion.description" label="Description"></v-text-field>
                </v-flex>
                <v-flex md3 lg3>
                    <v-text-field v-model="promotion.startDate" label="Start Date"></v-text-field>
                </v-flex>
                <v-flex md3 lg3>
                    <v-text-field v-model="promotion.endDate" label="End Date"></v-text-field>
                </v-flex>
            </v-layout>
            <v-layout row wrap>
                <v-flex md12>
                    <div style="text-align: right;">
                        <v-btn @click="addProduct" color="primary" class="ma-0 mb-2">Add Product</v-btn>
                    </div>
                    <table border="1" style="width: 100%">
                        <thead>
                            <tr>
                                <th style="width: 45%;">Barcode</th>
                                <th style="width: 45%;">Description</th>
                                <th style="width: 20px;"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, idx) in promotion.products" :key="idx">
                                <td>{{ item.barcode }}</td>
                                <td>{{ item.description }}</td>
                                <td>
                                    <a @click.prevent="" href="#">remove</a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </v-flex>
            </v-layout>
        </v-container>
    </v-card>
</template>

<script>
    import Axios from 'axios'

    export default {
        name: 'promotions',
        data() {
            return {
                promotion: null
            }
        },
        methods: {
            newFile() {
                let self = this;
                self.promotion = new Promotion();
            },
            openFile() {
                let self = this;
            },
            saveFile() {
                let self = this;
                alert("This will save this promotion to the database");
            },
            saveFileAs() {
                let self = this;
            },
            closeFile() {
                let self = this;
                self.promotion = null;
            },
            addProduct() {
                let self = this;
                self.promotion.products.push(new Promotion_Product());
            }
        }
    }

    function Promotion() {
        let self = this;
        self.id = 0;
        self.promotion_Type_ID = 0;
        self.description = "";
        self.startPeriodID = 0;
        self.startDate = "";
        self.endPeriodID = 0;
        self.endDate = "";
        self.filter_Type = 0;
        self.filter_ID = 0;
        self.products = [];
    }

    function Promotion_Product() {
        let self = this;
        self.promotion_ID = 0;
        self.store_ID = 0;
        self.product_ID = 0;
        self.barcode = "0001";
        self.description = "Product";
    }
</script>

<style scoped>
    table {
        border-collapse: collapse;
        width: 100%;
    }

    table,
    td,
    th {
        border: 1px solid gray;
    }

    td {
        background: white;
        color: black;
        padding: 2px 5px;
    }

    th {
        text-align: left;
        background: black;
        color: white;
        padding: 2px;
        border: 1px solid gray;
    }
</style>