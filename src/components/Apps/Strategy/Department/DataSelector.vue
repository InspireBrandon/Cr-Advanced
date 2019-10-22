<template>
    <v-dialog v-model="dialog" persistent width="800px">
        <v-toolbar dark flat color="primary">
            <v-toolbar-title>
                Select Data to Display
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="dialog=false">
                <v-icon>close</v-icon>
            </v-btn>
        </v-toolbar>
        <v-card>
            <v-container grid-list-md>
                <v-layout row wrap>
                    <v-flex md6>
                        <v-autocomplete :items="brands" v-model="selectedbrands" placeholder="select Brands" multiple
                            @change="getCategories"></v-autocomplete>
                    </v-flex>
                    <v-flex md6>
                        <v-autocomplete placeholder="select Categories" multiple></v-autocomplete>
                    </v-flex>
                    <v-flex md6>
                        <v-autocomplete placeholder="select Department" multiple></v-autocomplete>
                    </v-flex>
                    <v-flex md6>
                        <v-autocomplete placeholder="select Subdepartment" multiple></v-autocomplete>
                    </v-flex>
                </v-layout>
            </v-container>
            <v-spacer></v-spacer>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="submit">submit</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
    import Axios from 'axios'
    export default {
        data() {
            return {
                dialog: false,
                callback: null,
                brands: [],
                selectedbrands: null,
                categories: [],
                selectedCategories: null,
            }
        },
        methods: {
            show(callback) {
                let self = this
                self.dialog = true
                self.callback = callback
                self.getBrands()
            },
            getCategories() {
                let self = this
                self.$nextTick(() => {
                    let self = this
                    Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                    // Axios.get(process.env.VUE_APP_API +
                    //     `Retailer/Brand`
                    // ).then(r => {})
                })
            },
            getBrands() {
                let self = this
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API +
                    `Retailer/Brand`
                ).then(r => {
                    self.brands = []
                    r.data.forEach(element => {
                        self.brands.push({
                            text: element.displayname,
                            value: element.id
                        })
                    });
                    console.log(r);

                })
            },
            submit() {
                let self = this
                self.dialog = false
                self.callback()
            },
            submit() {
                let self = this
            }
        }
    }
</script>