<template>
    <v-dialog v-model="dialog" persistent scrollable max-width="800px">
        <v-card class="pa-0">
            <v-toolbar flat color="primary" dark>
                <v-toolbar-title>Merge Product</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
                <div class="mb-3">A product was found with a different barcode. Would you like to merge it?</div>
                <table style="width: 100%;">
                    <thead>
                        <th></th>
                        <th>Planogram Product</th>
                        <th>Range Product</th>
                    </thead>
                    <tbody v-if="product1 != null">
                        <tr>
                            <th>Product ID</th>
                            <td>{{ product1.productID }}</td>
                            <td>{{ product2.productID }}</td>
                        </tr>
                        <tr>
                            <th>Product System ID</th>
                            <td>{{ product1.product_System_ID }}</td>
                            <td>{{ product2.product_System_ID }}</td>
                        </tr>
                        <tr>
                            <th>Barcode</th>
                            <td>{{ product1.barcode }}</td>
                            <td>{{ product2.barcode }}</td>
                        </tr>
                        <tr>
                            <th>Description</th>
                            <td>{{ product1.description }}</td>
                            <td>{{ product2.description }}</td>
                        </tr>
                        <!-- <tr>
                            <th>Front Image</th>
                            <td></td>
                            <td></td>
                        </tr> -->
                    </tbody>
                </table>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="mergeProduct" color="primary">Yes</v-btn>
                <v-btn @click="returnData" color="secondary">NO</v-btn>
            </v-card-actions>
        </v-card>
        <YesNoModal ref="YesNoModal"></YesNoModal>
    </v-dialog>
</template>

<script>
    import Axios from 'axios';
    import YesNoModal from '@/components/Common/YesNoModal'

    export default {
        name: 'DetailsDialog',
        components: {
            YesNoModal
        },
        data() {
            return {
                dialog: false,
                afterComplete: null,
                product1: null,
                product2: null
            }
        },
        methods: {
            show(canMerge, product1, product2, afterComplete) {
                let self = this;

                if (canMerge) {
                    self.afterComplete = afterComplete;
                    self.product1 = product1;
                    self.product2 = product2;
                    self.dialog = true;
                } else {
                    afterComplete();
                }
            },
            returnData() {
                let self = this;
                self.dialog = false;
                self.afterComplete();
            },
            mergeProduct() {
                let self = this;

                self.$refs.YesNoModal.show("Are you sure you want to merge this product?", value => {
                    if (value) {
                        self.createAlternateBarcode(() => {
                            self.mergeImages();
                        })
                    }
                })
            },
            createAlternateBarcode(cb) {
                let self = this;

                Axios.post(process.env.VUE_APP_API + 'ProductAltCode?db=CR-Hinterland-Live', {
                        "product_ID": self.product2.productID,
                        "product_System_ID": self.product2.product_System_ID,
                        "barcode": self.product1.barcode
                    })
                    .then(r => {
                        cb()
                    })
                    .catch(e => {
                        alert("Failed to create alternate barcode. Please try again");
                    })
            },
            mergeImages() {
                let self = this;

                let oldBarcode = self.product1.barcode;
                let newBarcode = self.product2.barcode;

                Axios.post(process.env.VUE_APP_API +
                        `ProductImage?oldBarcode=${oldBarcode}&newBarcode=${newBarcode}`)
                    .then(r => {
                        self.dialog = false;
                        self.afterComplete();
                    })
                    .catch(e => {
                        alert("Failed to merge images. Please try again");
                    })
            }
        }
    }
</script>

<style scoped>
    table {
        border-collapse: collapse;
    }

    table,
    td,
    th {
        border: 1px solid gray;
    }

    td {
        background: white;
        color: black;
    }

    th {
        text-align: left;
        background: black;
        color: white;
        padding: 2px;
        border: 1px solid gray;
    }
</style>