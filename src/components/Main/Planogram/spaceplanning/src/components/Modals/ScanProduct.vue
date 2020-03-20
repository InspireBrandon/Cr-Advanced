<template>
    <div>
        <v-layout row justify-center>
            <v-dialog v-model="dialog" persistent max-width="400">
                <v-card>
                    <v-toolbar flat dark dense color="primary">
                        <v-toolbar-title>Scan Barcode</v-toolbar-title>
                    </v-toolbar>
                    <v-card-text>
                        <v-form @submit.prevent="scanBarcode">
                            <label>Barcode</label>
                            <v-text-field autofocus ref="textField" @blur="retainFocus" v-model="barcode" required>
                            </v-text-field>
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="error darken-1" @click.native="dialog = false">Close</v-btn>
                        <v-btn :disabled="barcode.length < 1" class="mr-2" color="primary darken-1"
                            @click.native="scanBarcode">Continue</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-layout>
    </div>
</template>

<script>
    import Axios from 'axios';

    export default {
        data() {
            return {
                barcode: '',
                dialog: false,
                onAddProduct: null,
            }
        },
        methods: {
            show(onAddProduct) {
                let self = this;
                self.dialog = true;
                self.onAddProduct = onAddProduct;
                setTimeout(() => {
                    self.$nextTick(self.$refs.textField.focus());
                }, 60);
            },
            retainFocus() {
                let self = this;
                self.$nextTick(self.$refs.textField.focus());
            },
            returnText() {
                let self = this;
                self.dialog = false;
            },
            scanBarcode() {
                let self = this;
                self.getProduct();
            },
            getProduct() {
                let self = this;

                Axios.get(process.env.VUE_APP_API + 'Product/ProductByBarcode?db=CR-Hinterland-Live&barcode=' + self.barcode)
                    .then(r => {
                        self.onAddProduct(r.data[0])
                        self.barcode = '';
                    })
                    .catch(e => {
                        console.log(e)
                        alert("Failed to find a product. Please try again");
                    })
            }
        }
    }
</script>