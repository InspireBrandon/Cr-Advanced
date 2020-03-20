<template>
    <v-card tile flat>
        <v-toolbar dense dark color="grey darken-4">
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
        <v-container grid-list-md v-if="promotion == null && !loading">
            <v-layout justify-center align-center>
                <v-flex md6 lg6>
                    <h1 style="text-align: center;">No promotion selected</h1>
                    <h3 style="text-align: center;">What would you like to do?</h3>
                </v-flex>
            </v-layout>
            <v-layout justify-center align-center class="mt-3">
                <v-flex md2 lg2>
                    <v-card @click="openFile" class="selectable">
                        <v-card-text style="text-align: center;">
                            <h3>Open</h3>
                            <v-icon class="mt-3" :size="40">folder</v-icon>
                        </v-card-text>
                    </v-card>
                </v-flex>
                <v-flex md2 lg2>
                    <v-card @click="newFile" class="selectable">
                        <v-card-text style="text-align: center;">
                            <h3>Create new</h3>
                            <v-icon class="mt-3" :size="40">add</v-icon>
                        </v-card-text>
                    </v-card>
                </v-flex>
                <v-flex md2 lg2>
                    <v-card class="selectable">
                        <v-card-text style="text-align: center;">
                            <h3>Import</h3>
                            <v-icon class="mt-3" :size="40">arrow_downward</v-icon>
                        </v-card-text>
                    </v-card>
                </v-flex>
            </v-layout>
            <v-layout justify-center align-center class="mt-3">
                <v-flex md6 lg6>
                    <v-list dense hover class="pa-0">
                        <template>
                            <v-list-tile avatar>
                                <v-list-tile-content>
                                    <v-list-tile-title>Promotion 1</v-list-tile-title>
                                </v-list-tile-content>
                                <v-spacer></v-spacer>
                            </v-list-tile>
                            <v-divider></v-divider>
                        </template>
                        <template>
                            <v-list-tile avatar>
                                <v-list-tile-content>
                                    <v-list-tile-title>Promotion 2</v-list-tile-title>
                                </v-list-tile-content>
                                <v-spacer></v-spacer>
                            </v-list-tile>
                            <v-divider></v-divider>
                        </template>
                        <template>
                            <v-list-tile avatar>
                                <v-list-tile-content>
                                    <v-list-tile-title>Promotion 3</v-list-tile-title>
                                </v-list-tile-content>
                                <v-spacer></v-spacer>
                            </v-list-tile>
                            <v-divider></v-divider>
                        </template>
                    </v-list>
                </v-flex>
            </v-layout>
        </v-container>
        <v-container grid-list-md v-if="promotion != null && !loading">
            <v-layout row wrap>
                <v-flex md3 lg3>
                    <label>Description</label>
                    <v-text-field style="border: 1px solid lightgrey;" flat solo hide-details v-model="promotion.description" label="Description"></v-text-field>
                </v-flex>
                <v-flex md3 lg3>
                    <label>Type</label>
                    <v-autocomplete style="border: 1px solid lightgrey;" flat solo hide-details :items="promotionTypes" item-text="displayname" item-value="id"
                        v-model="promotion.promotion_Type_ID" label="Promotion Type"></v-autocomplete>
                </v-flex>
                <v-flex md3 lg3>
                    <label>Date From</label>
                    <v-text-field style="border: 1px solid lightgrey;" flat solo hide-details v-model="promotion.startDate" label="Start Date"></v-text-field>
                </v-flex>
                <v-flex md3 lg3>
                    <label>Date To</label>
                    <v-text-field style="border: 1px solid lightgrey;" flat solo hide-details v-model="promotion.endDate" label="End Date"></v-text-field>
                </v-flex>
            </v-layout>
            <v-layout row wrap class="mt-4">
                <v-flex md3>
                    <div style="border: 1px solid lightgrey;">
                        <v-text-field v-model="search" flat solo prepend-inner-icon="search" placeholder="Search..." hide-details></v-text-field>
                    </div>
                </v-flex>
                <v-flex md9>
                    <div style="text-align: right;">
                        <v-btn style="margin-top: 12px!important;" @click="addProduct" color="primary" class="ma-0">Add
                            Product</v-btn>
                        <v-menu offset-y>
                            <template v-slot:activator="{ on }">
                                <v-btn style="margin-top: 12px!important;" color="primary" class="ma-0 ml-3" v-on="on">More</v-btn>
                            </template>
                            <v-list dense class="pa-0">
                                <v-list-tile @click="">
                                    <v-list-tile-title>Import Products</v-list-tile-title>
                                </v-list-tile>
                            </v-list>
                        </v-menu>
                    </div>
                </v-flex>
            </v-layout>
            <v-layout row wrap>
                <v-flex md12 style="height: calc(100vh - 300px); overflow-y: scroll;">
                    <table border="1" style="width: 100%">
                        <thead>
                            <tr>
                                <th style="width: 45%;">Barcode</th>
                                <th style="width: 45%;">Description</th>
                                <th style="width: 20px;"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, idx) in filteredProducts" :key="idx">
                                <td>{{ item.barcode }}</td>
                                <td>{{ item.description }}</td>
                                <td>
                                    <a @click.prevent="removeProduct(item)" href="#">remove</a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </v-flex>
            </v-layout>
        </v-container>
        <PromotionSelector ref="promotionSelector" />
        <Spinner ref="spinner"></Spinner>
    </v-card>
</template>

<script>
    import Axios from 'axios'
    import PromotionSelector from './PromotionSelector.vue'
    import Spinner from "@/components/Common/Spinner";

    export default {
        name: 'promotions',
        components: {
            PromotionSelector,
            Spinner
        },
        data() {
            return {
                promotion: null,
                loading: false,
                promotionTypes: [],
                search: ''
            }
        },
        computed: {
            filteredProducts() {
                let self = this;

                if(self.search == "") {
                    return self.promotion.products;
                }
                else {
                    return self.promotion.products.filter(item => {
                        return item.barcode.includes(self.search) || item.description.includes(self.search); 
                    });
                }
            }
        },
        methods: {
            newFile() {
                let self = this;
                self.getPromotionTypes();
                self.promotion = new Promotion();
            },
            openFile() {
                let self = this;

                self.$refs.promotionSelector.show(promotion => {
                    self.$refs.spinner.show();
                    self.loading = true;

                    Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                    Axios.get(process.env.VUE_APP_API + `Promotion?promotionID=${promotion.id}`)
                        .then(r => {
                            self.getPromotionTypes();
                            self.promotion = r.data;
                            self.$refs.spinner.hide();
                            self.loading = false;
                        })
                        .catch(e => {

                        })
                })
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
            },
            getPromotionTypes() {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + `PromotionTypes`)
                    .then(r => {
                        self.promotionTypes = r.data;
                    })
                    .catch(e => {

                    })
            },
            removeProduct(product) {
                let self = this;

                self.promotion.products.splice(self.promotion.products.indexOf(product), 1);
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

    .selectable {
        cursor: pointer;
    }

    .selectable:hover {
        background: lightgray;
        cursor: pointer;
    }
</style>