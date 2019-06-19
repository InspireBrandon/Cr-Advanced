<template>
    <div>
        <v-layout row justify-center>
            <v-dialog v-model="dialog" persistent max-width="800">
                <v-card>
                    <v-toolbar color="primary" dark>
                        <v-toolbar-title>Product lookup</v-toolbar-title>
                    </v-toolbar>
                    <v-card flat>
                        <v-card-text>
                            <v-form @submit.prevent="getProducts">
                                <v-text-field v-model="identifier" label="Barcode"></v-text-field>
                                <div style="text-align: right">
                                    <v-btn :disabled="identifier.length < 3" class="ma-0" type="submit" color="primary">Search</v-btn>
                                </div>
                            </v-form>
                        </v-card-text>
                        <v-list dense class="pa-0" style="height: calc(100vh - 400px); overflow-x: auto;">
                            <template v-for="(item, idx) in products">
                                <v-list-tile avatar @click="selected_product = item"
                                    :class="{ 'selected': selected_product == item }" :key="idx">
                                    <!-- <v-list-tile-avatar>
                                        <v-avatar size="40" tile>
                                            <img style="height: 40px;" :src="getImage(item.barcode)" />
                                        </v-avatar>
                                    </v-list-tile-avatar> -->
                                    <v-list-tile-content>{{ item.barcode + ' - ' + item.description }}
                                    </v-list-tile-content>
                                </v-list-tile>
                                <v-divider :key="'d' + idx"></v-divider>
                            </template>
                        </v-list>
                    </v-card>
                    <v-divider></v-divider>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn flat color="secondary" @click.native="dialog = false">Cancel</v-btn>
                        <v-btn :disabled="selected_product == null" flat color="primary" @click.native="returnData">
                            Continue</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-layout>
    </div>
</template>

<script>
    import Axios from 'axios';
    import BarcodeHandler from '@/libs/barcodeHandler.js';

    export default {
        data() {
            return {
                dialog: false,
                identifier: '',
                products: [],
                selected_product: null,
                afterReturn: null
            }
        },
        created() {},
        methods: {
            show(afterReturn) {
                let self = this;
                self.identifier = '';
                self.products = []
                self.selected_product = null;
                self.afterReturn = afterReturn;
                self.dialog = true;
            },
            getProducts() {
                let self = this;

                Axios.get(process.env.VUE_APP_API +
                        `Product/ProductByLikeBarcode?db=CR-HINTERLAND-LIVE&identifier=${self.identifier}`)
                    .then(r => {
                        self.products = r.data;
                    })
            },
            returnData() {
                let self = this;
                self.afterReturn(self.selected_product);
                self.dialog = false;
            },
            getImage(barcode) {
                let self = this;
                return process.env.VUE_APP_API + BarcodeHandler.imageFromBarcode(barcode, "", "1");
            }
        }
    }
</script>

<style>
    .selected {
        background: rgb(214, 214, 214);
    }
</style>