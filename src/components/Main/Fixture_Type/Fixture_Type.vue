<template>
    <v-container>
        <v-card>
            <v-toolbar flat dense dark>
                <v-toolbar-title>Fixture Type</v-toolbar-title>
                <v-divider class="mx-2" inset vertical></v-divider>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog" max-width="800px" persistent>
                    <template v-slot:activator="{ on }">
                        <v-btn color="primary" dark class="mb-2" v-on="on">New Item</v-btn>
                    </template>
                    <v-card>
                        <v-card-title>
                            <span class="headline">{{ formTitle }}</span>
                        </v-card-title>
                        <v-card-text>
                            <v-container grid-list-md>
                                <v-layout wrap>
                                    <v-flex xs12 sm6 md4>
                                        <v-text-field v-model="editedItem.name" label="Name"></v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm6 md4>
                                        <v-text-field v-model="editedItem.code" label="Code"></v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm6 md4>
                                        <v-text-field v-model="editedItem.displayName" label="Display Name">
                                        </v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm6 md4>
                                        <v-text-field type="number" v-model="editedItem.order_Index" label="Order Index">
                                        </v-text-field>
                                    </v-flex>
                                </v-layout>
                            </v-container>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" flat @click="close">Cancel</v-btn>
                            <v-btn color="blue darken-1" flat @click="save">Save</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-toolbar>
            <v-data-table :search="search" :headers="headers" :items="items" class="elevation-1">
                <template v-slot:items="props">
                    <td>{{ props.item.name }}</td>
                    <td class="text-xs-center">{{ props.item.code }}</td>
                    <td class="text-xs-center">{{ props.item.displayName }}</td>
                    <td class="text-xs-center">{{ props.item.order_Index }}</td>
                    <td class="justify-center layout px-0">
                        <v-icon small class="mr-2" @click="editItem(props.item)">
                            edit
                        </v-icon>
                        <v-icon small @click="deleteItem(props.item)">
                            delete
                        </v-icon>
                    </td>
                </template>
                <template v-slot:no-results>
                    <v-alert :value="true" color="error" icon="warning">
                        Your search for "{{ search }}" found no results.
                    </v-alert>
                </template>
            </v-data-table>
        </v-card>
    </v-container>
</template>

<script>
    import Axios from 'axios';
    export default {
        data() {
            return {
                search: '',
                dialog: false,
                editedIndex: -1,
                items: [{
                    id: 0,
                    name: '',
                    code: '',
                    displayName: '',
                    order_Index: 0,
                }],
                headers: [{
                        text: 'Name',
                        align: 'left',
                        sortable: false,
                        value: 'name'
                    },
                    {
                        text: 'Code',
                        value: 'code',
                        sortable: false,
                    },
                    {
                        text: 'Display Name',
                        value: 'DisplayName',
                        sortable: false,
                    },
                    {
                        text: 'Index',
                        value: 'Index',
                        sortable: false,
                    },
                    {
                        text: 'Actions',
                        value: 'Actions',
                        sortable: false,
                    },
                    {
                        text: '',
                        value: 'buttons',
                        sortable: false,
                    }
                ],
                editedItem: {
                    id: 0,
                    name: '',
                    code: '',
                    displayName: '',
                    order_Index: 0,
                },
            }
        },
        computed: {
            formTitle() {
                let self = this;

                return self.editedIndex === -1 ? 'New Item' : 'Edit Item'
            }
        },
        watch: {
            dialog(val) {
                let self = this;

                val || self.close()
            }
        },
        mounted() {
            let self = this;
            self.getFixtureType();
        },
        methods: {
            getFixtureType() {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + "Fixture_Type/Get")
                    .then(r => {
                        self.items = r.data.fixture_TypeList
                        console.log("passed data", r.data.fixture_TypeList);
                        delete Axios.defaults.headers.common["TenantID"];
                    })
                    .catch(er => {
                        console.log("Error", er)
                    });
            },
            editItem(item) {
                let self = this;

                self.editedIndex = self.items.indexOf(item)
                self.editedItem = Object.assign({}, item)
                self.dialog = true
            },

            deleteItem(item) {
                let self = this;

                const index = self.items.indexOf(item)

                confirm('Are you sure you want to delete this item?') && self.items.splice(index, 1)

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                        Axios.delete(process.env.VUE_APP_API + `Fixture_Type/Delete?id=` + item.id)
                            .then(result => {
                                delete Axios.defaults.headers.common["TenantID"];

                                console.log("Result", result);
                            })
                            .catch(error => {
                                alert("Failed to delete : ", error);
                            })
            },

            close() {
                let self = this;

                self.dialog = false
                setTimeout(() => {
                    self.editedItem = Object.assign({}, self.items)
                    self.editedIndex = -1
                }, 300)
            },
            save() {
                let self = this;

                 let request = {
                        name: self.editedItem.name,
                        code: self.editedItem.code,
                        displayName: self.editedItem.displayName,
                        order_Index: parseInt(self.editedItem.order_Index),
                    };

                    console.log(request)

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                if (self.editedIndex > -1) {
                    Object.assign(self.items[self.editedIndex], self.editedItem)

                    Axios.put(process.env.VUE_APP_API + `Fixture_Type/Modify`, request)
                        .then(r => {
                            delete Axios.defaults.headers.common["TenantID"];

                            if (r.data) {
                                request.id = r.data
                            }
                        })

                } else {
                    Axios.post(process.env.VUE_APP_API + `Fixture_Type/Create`, request)
                        .then(r => {
                            delete Axios.defaults.headers.common["TenantID"];
                            if (r.data) {
                                request.id = r.data
                                self.items.push(self.editedItem)
                            }
                        })
                }
                self.close()
            }
        }
    }
</script>

<style>

</style>