<template>
    <div class="text-xs-center">
        <v-dialog persistent v-model="dialog" max-width="800px">
            <v-card>
                <v-toolbar dark flat color="primary">
                    <v-toolbar-title>Maintain Period</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="dialog = false">
                        <v-icon>close</v-icon>
                    </v-btn>
                </v-toolbar>

                <v-card-text>
                    <v-form>
                        <v-container grid-list-md>
                            <v-layout row wrap>
                                <v-flex md6>
                                    <v-menu v-model="menu2" :close-on-content-click="false" :nudge-right="40" lazy
                                        transition="scale-transition" offset-y full-width min-width="290px">
                                        <template v-slot:activator="{ on }">
                                            <v-text-field v-model="form.period_From_Date" label="Picker without buttons"
                                                prepend-icon="event" readonly v-on="on"></v-text-field>
                                        </template>
                                        <v-date-picker v-model="form.period_From_Date" @input="menu2 = true">
                                        </v-date-picker>
                                    </v-menu>
                                </v-flex>
                                <v-flex md6>
                                    <v-text-field label="Period Name" v-model="form.period_Name"></v-text-field>
                                </v-flex>
                                <v-flex md6>
                                    <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40" lazy
                                        transition="scale-transition" offset-y full-width min-width="290px">
                                        <template v-slot:activator="{ on }">
                                            <v-text-field v-model="form.period_To_Date" label="Picker without buttons"
                                                prepend-icon="event" readonly v-on="on"></v-text-field>
                                        </template>
                                        <v-date-picker v-model="form.period_To_Date" @input="menu = true">
                                        </v-date-picker>
                                    </v-menu>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-form>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="save">
                        Submit
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import Axios from 'axios';

    export default {
        props: ['name', 'headerName', 'hasCode', 'Manufacturer'],
        data() {
            return {
                code: true,
                dialog: false,
                isAdd: true,
                form: {},
                callback: null,
                headerItems: [],
                isAdd: true,
                menu: false,
                menu2: false,
                items: [],
                form: {
                    id: null,
                    period_Name: null,
                    period_To_Date: null,
                    period_From_Date: null
                },
                dialog: false
            }
        },
        methods: {
            onFilterTextBoxChanged() {
                let self = this;
                self.gridApi.setQuickFilter(self.filterText);
            },
            onGridReady(params) {
                let self = this;
                self.gridApi = params.api;
                self.columnApi = params.columnApi;
            },
            openEdit(item) {
                let self = this;
                self.$refs.modifyStore.open(item);
            },
            getItems() {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + `Retailer/Period`)
                    .then(r => {
                        self.items = r.data;

                        delete Axios.defaults.headers.common["TenantID"];
                    })
            },
             save() {
                let self = this;
                let type = self.isAdd ? "post" : "put";

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios[type](process.env.VUE_APP_API + `Retailer/Period`, self.form)
                    .then(r => {
                        if (!self.isAdd)
                            self.form.id = r.data.id;


                        Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                        self.dialog = false;
                    })
            },
        }
    }
</script>