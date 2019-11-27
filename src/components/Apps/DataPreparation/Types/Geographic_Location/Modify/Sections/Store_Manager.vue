<template>
    <div>
        <v-toolbar flat dark dense color="primary" class="subheading font-weight-regular font-italic">Store Manager
            <v-spacer></v-spacer>
            <v-icon>star</v-icon>
        </v-toolbar>
        <v-form ref="form">
            <v-container grid-list-md>
                <v-layout row wrap>
                    <v-flex xl6 lg6 md6 sm12 xs12 class="pa-1">
                        <v-text-field v-model="form.store_Manager" label="Store Manager"></v-text-field>
                    </v-flex>
                    <v-flex xl6 lg6 md6 sm12 xs12 class="pa-1">
                        <v-text-field v-model="form.store_Manager_Cell" label="Store Manager Cell" mask="phone"></v-text-field>
                    </v-flex>
                    <v-flex xl6 lg6 md6 sm12 xs12 class="pa-1">
                        <v-text-field v-model="form.store_Manager_Email" label="Store Manager Email" type="email"></v-text-field>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-form>
    </div>
</template>
<script>
    export default {
        name: 'store_observation',
        data() {
            return {
                valid: true,
                form: {
                    store_Manager: '',
                    store_Manager_Cell: '',
                    store_Manager_Email: '',
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