<template>
    <div>
        <v-toolbar flat dense color="primary" dark class="subheading font-weight-regular font-italic">Contact
            <v-spacer></v-spacer>
            <v-icon>contacts</v-icon>
        </v-toolbar>
        <v-form ref="form">
            <v-container grid-list-md>
                <v-layout row wrap>
                    <v-flex xl6 lg6 md6 sm12 xs12>
                        <v-text-field v-model="form.store_Phone" label="Phone" mask="phone"></v-text-field>
                    </v-flex>
                    <v-flex xl6 lg6 md6 sm12 xs12>
                        <v-text-field v-model="form.store_Fax"  label="Fax" mask="phone"></v-text-field>
                    </v-flex>
                    <v-flex xl6 lg6 md6 sm12 xs12>
                        <v-text-field v-model="form.store_Email"  label="Email" type="email"></v-text-field>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-form>
    </div>
</template>
<script>
    export default {
        name: 'store_contact',
        data() {
            return {
                valid: true,
                form: {
                    
                    store_Phone: '',
                    store_Fax: '',
                    store_Email: ''
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