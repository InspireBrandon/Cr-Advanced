<template>
    <div>
        <v-toolbar flat dense color="primary" dark>Name</v-toolbar>
        <v-form lazy-validation v-model="valid" ref="form">
            <v-container grid-list-md>
                <v-layout row wrap>
                    <v-flex xl6 lg6 md6 sm12 xs12>
                        <v-text-field :rules="[v => !!v || 'Code is required']" v-model="form.store_Code" label="Code">
                        </v-text-field>
                    </v-flex>
                    <v-flex xl6 lg6 md6 sm12 xs12>
                        <v-text-field :rules="[v => !!v || 'Name is required']" required v-model="form.store"
                            label="Name"></v-text-field>
                    </v-flex>
                    <v-flex xl6 lg6 md6 sm12 xs12>
                        <v-text-field :rules="[v => !!v || 'Display name is required']" required
                            v-model="form.displayname" label="Display name"></v-text-field>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-form>
    </div>
</template>

<script>
    export default {
        name: 'store_name',
        data() {
            return {
                valid: true,
                form: {
                    store_Code: '',
                    store: '',
                    displayname: ''
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