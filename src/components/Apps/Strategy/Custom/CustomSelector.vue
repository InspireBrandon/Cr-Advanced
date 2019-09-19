<template>
    <v-dialog v-model="dialog" persistent width="400px">
        <v-card>
            <v-toolbar dark flat color="primary">
                <v-toolbar-title>Custom Query</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="dialog = false">
                    <v-icon>close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-card-text>
                <v-select label="Field" :items="fields" v-model="field"></v-select>
                <!-- <v-autocomplete v-model="value" v-if="field == 'Category'" label="Category" :items="categories"></v-autocomplete>
                <v-autocomplete v-model="value" v-if="field == 'Brand'" label="Brand" :items="brands"></v-autocomplete>
                <v-autocomplete v-model="value" v-if="field == 'Manufacturer'" label="Manufacturer" :items="manufacturers">
                </v-autocomplete>
                <v-autocomplete v-model="value" v-if="field == 'Planogram'" label="Planogram" :items="planograms"></v-autocomplete>
                <v-autocomplete v-model="value" v-if="field == 'Department'" label="Department" :items="departments"></v-autocomplete> -->
            </v-card-text>
            <v-divider class="mx-2"></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="returnData">
                    Continue
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    import Axios from 'axios';

    export default {
        data() {
            return {
                dialog: false,
                afterReturn: null,
                fields: [
                    "Category",
                    "Brand",
                    "Manufacturer",
                    "Planogram",
                    "Department"
                ],
                field: null,
                categories: [],
                brands: [],
                manufacturers: [],
                planograms: [],
                departments: [],
                value: null
            }
        },
        methods: {
            save() {
                let self = this;
            },
            show(afterReturn) {
                let self = this;
                self.afterReturn = afterReturn;
                self.field = null;
                self.value = null;
                // self.getCategories();
                // self.getBrands();
                // self.getManufacturers();
                // self.getPlanograms();
                // self.getDepartments();
                self.dialog = true;
            },
            returnData() {
                let self = this;
                self.dialog = false;
                self.afterReturn({
                    field: self.field,
                    fieldID: self.value
                });
            },
            // getCategories() {
            //     let self = this;

            //     Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

            //     Axios.get(process.env.VUE_APP_API + `Retailer/Category_Link`)
            //         .then(r => {
            //             delete Axios.defaults.headers.common["TenantID"];
            //             self.categories = TextValueArray(r.data, 'displayName', 'id');
            //         })
            // },
            // getBrands() {
            //     let self = this;

            //     Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

            //     Axios.get(process.env.VUE_APP_API + `Retailer/Brand`)
            //         .then(r => {
            //             delete Axios.defaults.headers.common["TenantID"];
            //             self.brands = TextValueArray(r.data, 'displayname', 'id');
            //         })
            // },
            // getManufacturers() {
            //     let self = this;

            //     Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

            //     Axios.get(process.env.VUE_APP_API + `Retailer/Manufacturer`)
            //         .then(r => {
            //             delete Axios.defaults.headers.common["TenantID"];
            //             self.manufacturers = TextValueArray(r.data, 'displayname', 'id');
            //         })
            // },
            // getPlanograms() {
            //     let self = this;

            //     Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

            //     Axios.get(process.env.VUE_APP_API + `Planogram/Distinct`)
            //         .then(r => {
            //             delete Axios.defaults.headers.common["TenantID"];
            //             self.planograms = TextValueArray(r.data.planogramList, 'displayname', 'planogram_ID');
            //         })
            // },
            // getDepartments() {
            //     let self = this;

            //     Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

            //     Axios.get(process.env.VUE_APP_API + `Retailer/Department`)
            //         .then(r => {
            //             delete Axios.defaults.headers.common["TenantID"];
            //             self.departments = TextValueArray(r.data, 'displayname', 'id');
            //         })
            // },
        }
    }

    function TextValueArray(arr, text, value) {
        let tmp = [];

        arr.forEach(element => {
            tmp.push({
                text: element[text],
                value: element[value],
            })
        });

        return tmp;
    }
</script>

<style>
    .highlighted {
        background-color: #1976d2;
        -webkit-text-fill-color: aliceblue
    }
</style>