<template>
    <div class="text-xs-center">
        <v-dialog v-model="dialog" max-width="800px">
            <v-card>
                <v-toolbar dark flat color="primary">
                    <v-toolbar-title>Maintain {{ name }}</v-toolbar-title>
                </v-toolbar>

                <v-card-text>
                    <v-form>
                        <v-container grid-list-md>
                            <v-layout row wrap>
                                <v-flex md6>
                                    <v-text-field :label="name" v-model="form.manufacturer"></v-text-field>
                                </v-flex>
                                <v-flex md6>
                                    <v-text-field label="Display Name" v-model="form.displayname"></v-text-field>
                                </v-flex>
                                <v-flex md6>
                                    <v-text-field label="Code" v-model="form.manufacturer_Code"></v-text-field>
                                </v-flex>
                                <v-flex md6>
                                </v-flex>
                                <v-flex md6>
                                    <v-checkbox label="Temporary"></v-checkbox>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-form>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="dialog = false">
                        Submit
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    export default {
        props: ['name'],
        data() {
            return {
                dialog: false,
                form: {
                    displayname: null,
                    props: null,
                    props_Code: null,
                }

            }
        },
        methods: {
            show(isAdd, item) {
                let self = this;
                console.log(item);

                if (isAdd == true) {

                }
                if (isAdd == false) {
                    self.form.displayname = item.displayname
                    self.form.manufacturer = item.manufacturer
                    self.form.manufacturer_Code = item.manufacturer_Code
                }

                self.dialog = true;
            }
        }
    }
</script>