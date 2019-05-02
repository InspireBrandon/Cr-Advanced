<template>
    <v-dialog v-model="dialog" persistent scrollable max-width="600px">
        <v-card class="pa-0">
            <v-toolbar flat color="primary" dark>
                <v-toolbar-title>Set Planogram Details</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
                <v-container grid-list-md>
                    <v-layout row wrap>
                        <v-flex md4 sm12>
                            <v-text-field v-model="formData.height" suffix="M" type="number" label="Height"></v-text-field>
                        </v-flex>
                        <v-flex md4 sm12>
                            <v-text-field v-model="formData.width" suffix="M" type="number" label="Width:"></v-text-field>
                        </v-flex>
                        <v-flex md4>
                        </v-flex>
                        <v-flex md4>
                            <v-text-field v-model="formData.modules" type="number" label="Modules:"></v-text-field>
                        </v-flex>
                        <v-flex md4>
                            <v-text-field v-model="formData.displays" type="number" label="Displays:"></v-text-field>
                        </v-flex>
                        <v-flex md4>
                            <v-text-field v-model="formData.pallettes" type="number" label="Pallettes:"></v-text-field>
                        </v-flex>
                        <v-flex md4>
                            <v-text-field v-model="formData.supplierStands" type="number" label="Supplier Stands:"></v-text-field>
                        </v-flex>
                        <v-flex md4>
                            <v-text-field v-model="formData.bins" type="number" label="Bins:"></v-text-field>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-card-text>
            <v-card-actions class="pa-0">
                <v-toolbar class="pa-0" dark dense>
                    <v-spacer></v-spacer>
                    <v-btn @click="dialog = false" color="error">Cancel</v-btn>
                    <v-btn @click="returnData" color="primary">Continue</v-btn>
                </v-toolbar>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    import Axios from 'axios';

    function TextValue(text, value) {
        this.text = text;
        this.value = value;
    }

    function TextValueArray(array, textProperty, valueProperty) {
        let tmp = [];

        array.forEach(element => {
            tmp.push(new TextValue(element[textProperty], element[valueProperty]))
        });

        return tmp;
    }

    export default {
        name: 'DetailsDialog',
        data() {
            return {
                dialog: false,
                afterComplete: null,
                formData: {
                    height: 0,
                    width: 0,
                    modules: 0,
                    displays: 0,
                    pallettes: 0,
                    supplierStands: 0,
                    bins: 0
                }
            }
        },
        methods: {
            show(afterComplete) {
                let self = this;
                self.afterComplete = afterComplete;
                self.dialog = true;
            },
            returnData() {
                let self = this;
                self.afterComplete(self.formData);
            }
        }
    }
</script>