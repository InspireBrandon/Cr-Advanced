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
                    <v-btn color="primary" @click="save">
                        Submit
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import Axios from 'axios';

    function lowercaseName(name) {
        return name.charAt(0).toLowerCase() + name.slice(1)
    }

    export default {
        props: ['name'],
        data() {
            return {
                dialog: false,
                isAdd: true,
                form: {},
                callback: null
            }
        },
        methods: {
            show(isAdd, item, callback) {
                let self = this;

                self.isAdd = isAdd;
                self.callback = callback;

                if (isAdd) {
                    self.form.id = null;
                    self.form.displayname = null;
                    self.form[lowercaseName(self.name)] = null;
                    self.form[lowercaseName(self.name) + "_Code"] = null;
                    self.form.temporary = false;
                } else {
                    self.form.id = item.id;
                    self.form.displayname = item.displayname;
                    self.form[lowercaseName(self.name)] = item[lowercaseName(self.name)];
                    self.form[lowercaseName(self.name) + "_Code"] = item[lowercaseName(self.name) + "_Code"];
                    self.form.temporary = item.temporary;
                }

                self.dialog = true;
            },
            save() {
                let self = this;
                let type = self.isAdd ? "post" : "put";

                Axios[type](process.env.VUE_APP_API + `Retailer/${self.name}`, self.form)
                    .then(r => {
                        if (self.isAdd)
                            self.form.id = r.data.id;

                        self.callback(self.form)
                        self.dialog = false;
                    })
            }
        }
    }
</script>