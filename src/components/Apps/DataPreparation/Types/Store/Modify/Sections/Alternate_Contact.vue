<template>
    <div>
        <v-toolbar flat dark dense color="primary">Alternate Contact</v-toolbar>
        <v-form ref="form">
            <v-container grid-list-md>
                <v-layout row wrap>
                    <v-flex xl6 lg6 md6 sm12 xs12 class="pa-1">
                        <v-text-field v-model="form.alternate_Contact" label="Alternate Contact"></v-text-field>
                    </v-flex>
                    <v-flex xl6 lg6 md6 sm12 xs12 class="pa-1">
                        <v-text-field v-model="form.alternate_Contact_Cell" label="Alternate Contact Cell"></v-text-field>
                    </v-flex>
                    <v-flex xl6 lg6 md6 sm12 xs12 class="pa-1">
                        <v-text-field v-model="form.alternate_Contact_Email" label="Alternate Contact Email"></v-text-field>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-form>
    </div>
</template>
<script>
    export default {
        name: 'store_alternate_contact',
        data() {
            return {
                valid: true,
                form: {
                    
                    alternate_Contact: '',
                    alternate_Contact_Cell: '',
                    alternate_Contact_Email: ''
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