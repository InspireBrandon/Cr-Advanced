<template>
    <div>
        <v-layout row justify-center>
            <v-dialog v-model="dialog" persistent max-width="800">
                <v-card>
                    <v-toolbar color="primary" dark>
                        <v-toolbar-title>Add New Listing</v-toolbar-title>
                    </v-toolbar>
                    <v-card flat>
                        <v-card-text>
                            <v-form @submit.prevent="getProducts">
                                <v-container fluid grid-list-xl>
                                    <v-layout row wrap>
                                        <v-flex md4>
                                            <v-checkbox label="Generate" color="primary"></v-checkbox>
                                        </v-flex>
                                        <v-flex md8>
                                            <v-text-field label="Product system id"></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                            </v-form>
                        </v-card-text>
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
                form: {
                    product_System_ID: '',
                    barcode: '',
                    description: '',
                    clear() {
                        this.product_System_ID = '';
                        this.barcode = '';
                        this.description = '';
                    }
                },
                afterReturn: null
            }
        },
        created() {},
        methods: {
            show(afterReturn) {
                let self = this;
                self.dialog = true;
            },
            returnData() {
                let self = this;
                // self.afterReturn();
                self.dialog = false;
            },
        }
    }
</script>

<style>
    .selected {
        background: rgb(214, 214, 214);
    }
</style>