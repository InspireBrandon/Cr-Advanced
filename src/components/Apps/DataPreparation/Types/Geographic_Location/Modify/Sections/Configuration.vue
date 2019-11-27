<template>
    <div>
        <v-toolbar flat dense color="primary" class="subheading font-weight-regular font-italic" dark>Configuration
            <v-spacer></v-spacer>
            <v-icon>settings</v-icon>
        </v-toolbar>
        <v-form ref="form">
            <v-container grid-list-md>
                <v-layout row wrap>
                    <v-flex xl6 lg6 md6 sm12 xs12>
                        <v-checkbox color="primary" v-model="form.catman_Data_Sharing" label="Catman Data Sharing"></v-checkbox>
                    </v-flex>
                    <v-flex xl6 lg6 md6 sm12 xs12>
                        <v-select v-model="form.retail_Chain_ID" label="Retail Chain"></v-select>
                    </v-flex>
                    <v-flex xl6 lg6 md6 sm12 xs12>
                        <v-text-field v-model="form.loyalty_Card" label="Loyalty Card"></v-text-field>
                    </v-flex>
                     <v-flex xl6 lg6 md6 sm12 xs12>
                        <v-text-field v-model="form.poS_System" label="POS System"></v-text-field>
                    </v-flex>
                     <v-flex xl6 lg6 md6 sm12 xs12>
                        <v-text-field v-model="form.till_Points" label="Till Points"></v-text-field>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-form>
    </div>
</template>
<script>
    export default {
        name: 'store_Configuration',
        data() {
            return {
                valid: true,
                form: {
                   catman_Data_Sharing:'',
                   retail_Chain_ID:'',
                   till_Points:'',
                   loyalty_Card:'',
                   poS_System:'',
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