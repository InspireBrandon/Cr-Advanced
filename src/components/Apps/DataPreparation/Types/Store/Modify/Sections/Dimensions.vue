<template>
    <div>
        <v-toolbar flat dark dense color="primary">Dimensions and Annual Direct Sales</v-toolbar>
        <v-form ref="form">
            <v-container grid-list-md>
                <v-layout row wrap>
                    <v-flex xl6 lg6 md6 sm12 xs12 class="pa-1">
                        <v-text-field v-model="form.sqm_Shop" label="Sqm Shop"></v-text-field>
                    </v-flex>
                    <v-flex xl6 lg6 md6 sm12 xs12 class="pa-1"></v-flex>
                    <v-flex lg6 md6 sm12 xs12 class="pa-1">
                        <v-text-field v-model="form.sqm_Area_1" label="Sqm Area 1"></v-text-field>
                    </v-flex>
                    <v-flex xl6 lg6 md6 sm12 xs12 class="pa-1">
                        <v-text-field  v-model="form.annual_Direct_Sales_Area_1" label="Annual Direct Sales Area 1"></v-text-field>
                    </v-flex>
                    <v-flex xl6 lg6 md6 sm12 xs12 class="pa-1">
                        <v-text-field v-model="form.sqm_Area_2" label="Sqm Area 2"></v-text-field>
                    </v-flex>
                    <v-flex xl6 lg6 md6 sm12 xs12 class="pa-1">
                        <v-text-field  v-model="form.annual_Direct_Sales_Area_2" label="Annual Direct Sales Area 2"></v-text-field>
                    </v-flex>
                    <v-flex xl6 lg6 md6 sm12 xs12 class="pa-1">
                        <v-text-field v-model="form.sqm_Area_3" label="Sqm Area 3"></v-text-field>
                    </v-flex>
                    <v-flex xl6 lg6 md6 sm12 xs12 class="pa-1">
                        <v-text-field v-model="form.annual_Direct_Sales_Area_3" label="Annual Direct Sales Area 3"></v-text-field>
                    </v-flex>
                    <v-flex xl6 lg6 md6 sm12 xs12 class="pa-1">
                        <v-text-field v-model="form.sqm_Area_4" label="Sqm Area 4"></v-text-field>
                    </v-flex>
                    <v-flex xl6 lg6 md6 sm12 xs12 class="pa-1">
                        <v-text-field v-model="form.annual_Direct_Sales_Area_4"  label="Annual Direct Sales Area 4"></v-text-field>
                    </v-flex>
                    <v-flex xl6 lg6 md6 sm12 xs12 class="pa-1">
                        <v-text-field v-model="form.sqm_Area_5" label="Sqm Area 5"></v-text-field>
                    </v-flex>
                    <v-flex xl6 lg6 md6 sm12 xs12 class="pa-1">
                        <v-text-field v-model="form.annual_Direct_Sales_Area_5" label="Annual Direct Sales Area 5"></v-text-field>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-form>
    </div>
</template>
<script>
    export default {
        name: 'store_dimensions',
        data() {
            return {
                valid: true,
                form: {
                   sqm_Shop:'',
                   annual_Direct_Sales_Area_1:'',
                   annual_Direct_Sales_Area_2:'',
                   annual_Direct_Sales_Area_3:'',
                   annual_Direct_Sales_Area_4:'',
                   annual_Direct_Sales_Area_5:'',
                   sqm_Area_1:'',
                   sqm_Area_2:'',
                   sqm_Area_3:'',
                   sqm_Area_4:'',
                   sqm_Area_5:'',
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
