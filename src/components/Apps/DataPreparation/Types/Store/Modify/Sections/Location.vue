<template>
    <div>
        <v-toolbar flat dense color="primary" class="subheading font-weight-regular font-italic" dark>Location
            <v-spacer></v-spacer>
            <v-icon>my_location</v-icon>
        </v-toolbar>
        <v-form ref="form">
            <v-container grid-list-md>
                <v-layout row wrap>
                    <v-flex xl6 lg6 md6 sm12 xs12>
                        <v-text-field v-model="form.physical_Address" label="Physical Address"></v-text-field>
                    </v-flex>
                    <v-flex xl6 lg6 md6 sm12 xs12>
                        <v-text-field v-model="form.city" label="City"></v-text-field>
                    </v-flex>
                    <v-flex xl6 lg6 md6 sm12 xs12>
                        <v-text-field v-model="form.region" label="Region"></v-text-field>
                    </v-flex>
                    <v-flex xl6 lg6 md6 sm12 xs12>
                        <v-text-field v-model="form.province" label="Province"></v-text-field>
                    </v-flex>
                    <v-flex xl6 lg6 md6 sm12 xs12>
                        <v-text-field v-model="form.country" label="Country"></v-text-field>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-form>
    </div>
</template>
<script>
    export default {
        name: 'store_location',
        data() {
            return {
                valid: true,
                form: {
                    
                    province: '',
                    region: '',
                    physical_Address: '',
                    city: '',
                    country: ''

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