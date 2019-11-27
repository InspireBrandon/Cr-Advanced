<template>
    <div>
        <v-toolbar flat dense color="primary" class="subheading font-weight-regular font-italic" dark>Properties
            <v-spacer></v-spacer>
            <v-icon>perm_device_information</v-icon>
        </v-toolbar>
        <v-form ref="form">
            <v-container grid-list-md>
                <v-layout row wrap>
                    <v-flex xl6 lg6 md6 sm12 xs12>
                        <v-select v-model="form.store_Format_ID" label="Store Format"></v-select>
                    </v-flex>
                    <v-flex xl6 lg6 md6 sm12 xs12>
                        <v-select v-model="form.store_Type_ID" label="Store Type"></v-select>
                    </v-flex>
                    <v-flex xl6 lg6 md6 sm12 xs12>
                        <v-select  v-model="form.store_Status_ID" label="Store Status"></v-select>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-form>
    </div>
</template>
<script>
    export default {
        name: 'store_properties',
        data() {
            return {
                valid: true,
                form: {
                    store_Format_ID: '',
                    store_Type_ID: '',
                    store_Status_ID: ''
                }
            }
        },
        methods: {
            setForm(data) {
                let self = this;
                for (var prop in self.form) {
                    self.form[prop] = data[prop];
                }
            },
            validate() {
                let self = this;

                self.valid = self.$refs.form.validate();

                return self.valid;
            },
            getForm() {
                let self = this;
                return self.form;
            }
        }
    }
</script>