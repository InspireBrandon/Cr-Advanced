<template>
    <div>
        <v-dialog persistent v-model="dialog" width="1000">
            <v-card>
                <v-toolbar dark flat color="primary">
                    <v-toolbar-title>Custom Range Creator</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="dialog = false">
                        <v-icon>close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-text style="height: 600px; overflow: auto;">
                    <v-form @submit.prevent="scanBarcode">
                        <v-container grid-list-md class="pa-0">
                            <v-layout row wrap>
                                <v-flex md6>
                                    <v-text-field autofocus v-model="barcode" label="Barcode" hide-details>
                                    </v-text-field>
                                </v-flex>
                                <v-flex md6>
                                    <v-btn :disabled="barcode.length == 0" :loading="loading" @click="scanBarcode" large color="primary">Add</v-btn>
                                    <!-- <v-btn large>Find</v-btn> -->
                                    <!-- <v-btn large>Advanced</v-btn> -->
                                </v-flex>
                                <v-flex md12>
                                    <Grid :rowData="rowData" />
                                </v-flex>
                            </v-layout>
                        </v-container>
                        <button :disabled="barcode.length == 0" style="display: none" type="submit"></button>
                    </v-form>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                    <strong class="ml-2">
                        Products: {{ rowData.length }}
                    </strong>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" flat @click="submit">Generate Range</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import Grid from './Grid'
    import Axios from 'axios'

    export default {
        components: {
            Grid
        },
        data() {
            return {
                dialog: true,
                afterReturn: null,
                rowData: [],
                barcode: '',
                loading: false
            }
        },
        methods: {
            show(afterReturn) {
                let self = this;
                self.afterReturn = afterReturn;
                self.dialog = true;
            },
            scanBarcode() {
                let self = this;

                Axios.get(process.env.VUE_APP_API + 'Product/ProductByBarcode?db=CR-Hinterland-Live&barcode=' + self
                        .barcode)
                    .then(r => {
                        self.loading = false;

                        let item = {
                            barcode: self.barcode
                        }

                        if (r.data.length == 0) {
                            self.rowData.push(item);
                        } else {
                            r.data.forEach(element => {
                                self.rowData.push(element);
                            });
                        }

                        self.barcode = "";
                    })
                    .catch(e => {
                        alert("Failed to find a product. Please try again");
                        console.log(e);
                    })

            },
        }
    }
</script>