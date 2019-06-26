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
                                                v-model="form.generate_product_system_id" hide-details
                                                label="Generate product system id" color="primary">
                                            </v-checkbox>
                                        </v-flex>
                                        <v-flex md5 xs12>
                                            <v-text-field :rules="sysIDRules" counter="15" maxlength="15"
                                                @blur="on_product_system_id_blur" :loading="product_sys_id_loading"
                                                :disabled="form.generate_product_system_id || product_sys_id_loading"
                                                v-model="form.product_System_ID" label="Product system id">
                                            </v-text-field>
                                        </v-flex>
                                        <v-flex md1 xs1 class="pl-0">
                                            <v-tooltip bottom v-if="noIDMatches == true">
                                                <template v-slot:activator="{ on }">
                                                    <v-icon transition="slide-x-transition" style="margin-top: 25px;"
                                                        color="green" v-on="on">check</v-icon>
                                                </template>
                                                <span>No Matching Product System</span>
                                            </v-tooltip>
                                            <v-tooltip bottom v-if="noIDMatches == false">
                                                <template v-slot:activator="{ on }">
                                                    <v-icon transition="slide-x-transition" style="margin-top: 25px;"
                                                        color="red" v-on="on">clear</v-icon>
                                                </template>
                                                <span>There is already a product with this product system id</span>
                                            </v-tooltip>
                                        </v-flex>
                                        <v-flex md5 xs12>
                                            <v-text-field :rules="barcodeRules" counter="15" maxlength="15"
                                                @blur="on_barcode_blur" :loading="barcode_loading"
                                                :disabled="form.product_System_ID == '' || barcode_loading"
                                                v-model="form.barcode" label="Barcode"></v-text-field>
                                        </v-flex>
                                        <v-flex md1 xs1 class="pl-0">
                                            <v-tooltip bottom v-if="noBarcodeMatches == true">
                                                <template v-slot:activator="{ on }">
                                                    <v-icon transition="slide-x-transition" style="margin-top: 25px;"
                                                        color="green" v-on="on">check</v-icon>
                                                </template>
                                                <span>No Matching Barcode</span>
                                            </v-tooltip>
                                            <v-tooltip bottom v-if="noBarcodeMatches == false">
                                                <template v-slot:activator="{ on }">
                                                    <v-icon transition="slide-x-transition" style="margin-top: 25px;"
                                                        color="warning" v-on="on">info</v-icon>
                                                </template>
                                                <span>There is already a product with this barcode</span>
                                            </v-tooltip>
                                        </v-flex>
                                        <v-flex md12>
                                            <v-text-field :rules="descRules" counter="40" maxlength="40"
                                                v-model="form.description" label="Description"></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                            </v-card-text>
                        </v-card>
                        <v-divider></v-divider>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn flat color="secondary" @click.native="atClose">Cancel</v-btn>
                            <v-btn :disabled="save_disabled" flat color="primary" @click.native="returnData">Continue
                            </v-btn>
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
                noIDMatches: true,
                noBarcodeMatches: true,
                form: {
                    product_System_ID: '',
                    barcode: '',
                    description: '',
                    generate_product_system_id: false,
                    clear() {
                        this.generate_product_system_id = false;
                        this.product_System_ID = '';
                        this.barcode = '';
                        this.description = '';
                        this.save_disabled = true;
                    },
                },
                afterReturn: null,
                product_sys_id_loading: false,
                barcode_loading: false,
                save_disabled: true,
                sysIDRules: [
                    v => !!v || 'ID is required',
                    v => v.length <= 15 || 'ID must be 15 characters or less'
                ],
                barcodeRules: [
                    v => !!v || 'Barcode is required',
                    v => v.length <= 15 || 'Barcode must be 15 characters or less'
                ],
                descRules: [
                    v => !!v || 'Description must be 40 characters',
                    v => v.length <= 40 || 'Description must be less than 40 characters'
                ],
            }
        },
        created() {},
        methods: {
            show(afterReturn) {
                let self = this;
                self.form.clear();
                self.afterReturn = afterReturn;
                self.dialog = true;
            },
            atClose() {
                let self = this;
                self.dialog = false;
                self.form.clear();
            },
            returnData() {
                let self = this;
                self.afterReturn(self.form);
                self.dialog = false;
            },
            on_generate_change() {
                let self = this;

                self.$nextTick(() => {
                    if (self.form.generate_product_system_id) {
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
                    if (self.form.product_System_ID == "Generate_SYS_Product_ID")
                        self.product_sys_id_tooltip.show = false;
                })
            },
            on_product_system_id_blur() {
                let self = this;

                if (self.form.product_System_ID != "Generate_SYS_Product_ID") {
                    self.product_sys_id_loading = true;

                    self.get_product_by_product_system_id(self.form.product_System_ID, data => {
                        console.log(data);

                        // if data == null : there is no product with this product system id
                        // otherwise there is
                        // change tooltip based on these values
                        setTimeout(() => {
                            if (data == null) {
                                self.noIDMatches = true;
                            } else {
                                self.noIDMatches = false;
                                self.save_disabled = true;
                            }

                            self.product_sys_id_loading = false;
                        }, 1000);
                    })
                }
            },
            on_barcode_blur() {
                let self = this;

                self.barcode_loading = true;
                self.get_product_by_barcode(self.form.barcode, data => {
                    console.log(data);
                    setTimeout(() => {
                        if (data == null) {
                            self.noBarcodeMatches = true;
                            self.save_disabled = false;
                        } else {
                            self.noBarcodeMatches = false;
                            self.save_disabled = true;
                        }
                        self.barcode_loading = false;
                    }, 1000);
                })
            },
            get_product_by_product_system_id(product_system_id, callback) {
                let self = this;

                Axios.get(process.env.VUE_APP_API +
                        `Product/ProductByProductSystemID?db=CR-HINTERLAND-LIVE&productSystemId=${product_system_id}`
                    )
                    .then(r => {
                        callback(r.data)
                    })
                    .catch(e => {
                        alert("Failed to validate product by product system id");
                    })
            },
            get_product_by_barcode(barcode, callback) {
                let self = this;

                Axios.get(process.env.VUE_APP_API +
                        `Product/ProductByBarcode?db=CR-HINTERLAND-LIVE&barcode=${barcode}`)
                    .then(r => {
                        callback(r.data)
                    })
                    .catch(e => {
                        alert("Failed to validate product by product system id");
                    })
            }

        }
    }
</script>