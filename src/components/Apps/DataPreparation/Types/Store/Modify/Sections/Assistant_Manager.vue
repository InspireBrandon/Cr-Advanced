<template>
    <div>
        <v-toolbar flat dense dark color="primary">Assistant Manager</v-toolbar>
        <v-form ref="form">
            <v-container grid-list-md>
                <v-layout row wrap>
                    <v-flex xl6 lg6 md6 sm12 xs12 class="pa-1">
                        <v-text-field  v-model="form.assistant_Manager" label="Assistant Manager Name"></v-text-field>
                    </v-flex>
                    <v-flex xl6 lg6 md6 sm12 xs12 class="pa-1">
                        <v-text-field  v-model="form.assistant_Manager_Cell" label="Assistant Manager Cell"></v-text-field>
                    </v-flex>
                    <v-flex xl6 lg6 md6 sm12 xs12 class="pa-1">
                        <v-text-field v-model="form.assistant_Manager_Email" label="Assistant Manager Email"></v-text-field>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-form>
    </div>
</template>
<script>
    export default {
        name: 'store_assistant_Manager',
        data() {
            return {
                valid: true,
                form: {
                   assistant_Manager:'',
                   assistant_Manager_Cell:'',
                   assistant_Manager_Email:'',
                   
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
