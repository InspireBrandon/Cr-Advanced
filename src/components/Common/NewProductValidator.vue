<template>
    <div>
        <v-layout row justify-center>
            <v-dialog v-model="dialog" persistent max-width="800">
                <v-card>
                    <v-form @submit.prevent="getProducts">
                        <v-toolbar color="primary" dark>
                            <v-toolbar-title>Add New Item</v-toolbar-title>
                        </v-toolbar>
                        <v-card flat>
                            <v-card-text class="pa-0">
                                <v-container fluid grid-list-xl>
                                    <v-layout row wrap>
                                        <v-flex md12>
                                            <v-checkbox @change="on_generate_change"
                                                v-model="generate_product_system_id" hide-details
                                                label="Generate product system id" color="primary">
                                            </v-checkbox>
                                        </v-flex>
                                        <v-flex md5 xs11>
                                            <v-text-field :loading="product_sys_id_loading"
                                                @blur="on_product_system_id_blur" v-model="form.product_System_ID"
                                                @keydown="handle_product_sys_keydown"
                                                :disabled="generate_product_system_id || product_sys_id_loading"
                                                label="Product system id"></v-text-field>
                                        </v-flex>
                                        <v-flex md1 xs1 class="pl-0">
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on }">
                                                    <v-icon transition="slide-x-transition" style="margin-top: 25px;"
                                                        color="info" v-on="on">info</v-icon>
                                                </template>
                                                <span>YESSSS</span>
                                            </v-tooltip>
                                        </v-flex>
                                        <v-flex md5 xs11>
                                            <v-text-field :loading="barcode_loading" @blur="on_barcode_blur"
                                                v-model="form.barcode" @keydown="save_disabled = true"
                                                :disabled="barcode_loading || form.product_System_ID == ''"
                                                label="Barcode"></v-text-field>
                                        </v-flex>
                                        <v-flex md1 xs1 class="pl-0">
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on }">
                                                    <v-icon transition="slide-x-transition" style="margin-top: 25px;"
                                                        color="info" v-on="on">info</v-icon>
                                                </template>
                                                <span>YESSSS</span>
                                            </v-tooltip>
                                        </v-flex>
                                        <v-flex md12>
                                            <v-text-field v-model="form.description" label="Description"></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                            </v-card-text>
                        </v-card>
                        <v-divider></v-divider>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn flat color="secondary" @click.native="dialog = false">Cancel</v-btn>
                            <v-btn :disabled="product_sys_id_loading || save_disabled" flat color="primary"
                                @click.native="returnData">
                                Continue</v-btn>
                        </v-card-actions>
                    </v-form>
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
                    },
                },
                afterReturn: null,
                product_sys_id_loading: false,
                barcode_loading: false,
                generate_product_system_id: false,
                save_disabled: true
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
            on_generate_change() {
                let self = this;

                self.$nextTick(() => {
                    if (self.generate_product_system_id) {
                        self.form.product_System_ID = "Generate_SYS_Product_ID";
                    } else {
                        self.form.product_System_ID = "";
                    }
                })
            },
            handle_product_sys_keydown() {
                let self = this;
                self.save_disabled = true;

                self.$nextTick(() => {
                    if(self.form.product_System_ID == "Generate_SYS_Product_ID")
                        self.product_sys_id_tooltip.show = false;
                })
            },
            on_product_system_id_blur() {
                let self = this;

                if (self.form.product_System_ID != "Generate_SYS_Product_ID") {
                    self.product_sys_id_loading = true;

                    setTimeout(() => {
                        self.product_sys_id_loading = false;
                        self.save_disabled = false;
                    }, 2000);
                }
            },
            on_barcode_blur() {
                let self = this;
                self.barcode_loading = true;

                setTimeout(() => {
                    self.barcode_loading = false;
                    self.save_disabled = false;
                }, 2000);
            }
        }
    }
</script>