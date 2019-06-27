<template>
    <v-container grid-list-md>
        <v-layout row wrap>
            <v-flex md4>
                <v-card>
                    <v-toolbar flat dark dense>
                        <v-toolbar-title>Data Imports</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-text-field v-model="search" placeholder="Find"></v-text-field>
                    </v-toolbar>
                    <v-list dense class="pa-0" style="height: calc(100vh - 200px); overflow-x: auto;">
                        <template v-for="(item, idx) in filteredItems">
                            <v-list-tile @click="selectedItem = item; getTransactionsFromFolder(item.name)"
                                :class="{ 'selected': selectedItem == item.name }" :key="idx">
                                {{ item.name }}
                            </v-list-tile>
                            <v-divider :key="'d-' + idx"></v-divider>
                        </template>
                    </v-list>
                </v-card>
            </v-flex>
            <v-flex md8>
                <v-layout row wrap>
                    <v-flex v-if="selectedItem != null">
                        <v-card>
                            <v-toolbar flat dark dense>
                                <v-toolbar-title>Data Import - {{ selectedItem == null ? "" : selectedItem.name }}</v-toolbar-title>
                                <v-spacer></v-spacer>
                                <v-btn icon small @click="openFileDialog">
                                    <v-icon>cloud_upload</v-icon>
                                </v-btn>
                                <input @change="onFileChange" type="file" ref="file" style="display: none">
                                <v-btn icon small @click="downloadTemplate">
                                    <v-icon>cloud_download</v-icon>
                                </v-btn>
                            </v-toolbar>
                            <v-card-text>
                                <v-data-table :headers="headers" :items="importTransactionItemList" class="elevation-1">
                                    <template v-slot:items="props">
                                        <td>{{ props.item.fileName }}</td>
                                        <td class="text-xs-right">{{ props.item.interactionDateTime }}</td>
                                    </template>
                                    <template v-slot:footer>
                                        <td :colspan="headers.length">
                                            <strong>{{ selectedItem == null ? "" : 'Files in Folder ' + selectedItem.name }}</strong>
                                        </td>
                                    </template>
                                </v-data-table>
                            </v-card-text>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-flex>
        </v-layout>
        <a v-if="selectedItem != null" display="none" ref="downloadLink" :href="serverAddress + 'DataImport/Template?templateName=' + selectedItem.name"
            download></a>
    </v-container>
</template>

<script>
    import Axios from 'axios';
    import jwt from 'jsonwebtoken';
    import {
        isNullOrUndefined
    } from 'util';

    function cardItem(data) {
        this.name = data.name;
        this.icon = data.icon;
        this.route = data.route;
    }

    export default {
        name: 'DataImport',
        data: () => {
            return {
                display: true,
                serverAddress: process.env.VUE_APP_API,
                selectedItem: null,
                search: "",
                items: [
                    {name: 'Product Master'},
                    {name: 'Sales Data'},
                    {name: 'New Products'},
                    {name: 'Duplicate Barcodes'},
                    {name: 'Category Codes'},
                    {name: 'Active Shop Codes'},
                    {name: 'Product Dimentions'},
                    {name: 'Product Stock'},
                    {name: 'Store Clustering'},
                    {name: 'Store Turnover Groups'},
                    {name: 'Store Trading Space'},
                    {name: 'Store Geographic Location'},
                    {name: 'Store Contact Details'},
                    {name: 'Store Details'},
                    {name: 'New Store'},
                    {name: 'Department Clustering'},
                    {name: 'Catgory Clustering'},
                    {name: 'Product Packaging'},
                    {name: 'Item Indicators'},
                    {name: 'RI by Store Cluster'},
                    {name: 'RI by Custom Cluster'},
                    {name: 'RI by Regional Cluster'},
                    {name: 'RI by Store'}
                ],
                headers: [{
                        text: "File Name",
                        sortable: false
                    },
                    {
                        text: "Date",
                        sortable: false
                    }
                ],
                importTransactionItemList: [{
                    id: 0,
                    uid: 0,
                    fileName: '',
                    importFolder: '',
                    typeFolder: '',
                    interactionDateTime: '',
                    interactionUserID: '',
                    errors: ''
                }]
            }
        },
        computed: {
            filteredItems() {
                let self = this;

                return self.items.filter(item => {
                    return item.name.toLowerCase().indexOf(self.search.toLowerCase()) > -1
                })
            }
        },
        methods: {
            downloadTemplate() {
                let self = this;
                self.$refs.downloadLink.click();
            },
            openFileDialog() {
                let self = this;
                self.$refs.file.click();
            },
            getTransactionsFromFolder(importFolder) {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + `DataImport/ImportDatabase?importFolder=${importFolder}`)
                    .then(r => {
                        self.importTransactionItemList = r.data.importTransactionItemList;
                        if (r.data.importTransactionItemList === 0) {
                            self.display = false;
                        } else {
                            self.display = true;
                        }

                        delete Axios.defaults.headers.common["TenantID"];
                    })
                    .catch(e => {
                        // TODO: add logging
                    })
            },
            onFileChange(e) {
                let self = this;
                const files = e.target.files;
                let file = files[0];

                self.createUploadTransaction(file.name, self.selectedItem.name, transactionID => {
                    self.uploadImportFile(transactionID, file, () => {
                        self.getTransactionsFromFolder(self.selectedItem.name)
                    })
                })
            },
            uploadImportFile(transactionID, file, callback) {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.post(self.serverAddress + `DataImport/ImportDatabase/UploadFile?importTransactionID=` +
                        transactionID, file)
                    .then(r => {
                        delete Axios.defaults.headers.common["TenantID"];
                    })
                    .catch(e => {
                        delete Axios.defaults.headers.common["TenantID"];
                    })
            },
            createUploadTransaction(fileName, importFolder, callback) {
                let self = this;

                let encoded_details = jwt.decode(sessionStorage.accessToken);

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.post(process.env.VUE_APP_API + `DataImport/ImportDatabase`, {
                        fileName: fileName,
                        importFolder: importFolder,
                        typeFolder: "1 - Import Ready",
                        interactionUserID: encoded_details.USER_ID
                    })
                    .then(r => {
                        delete Axios.defaults.headers.common["TenantID"];
                        callback(r.data.importTransactionItem.id);
                    })
                    .catch(e => {
                        delete Axios.defaults.headers.common["TenantID"];
                    })
            },
        }
    }
</script>

<style>
    .selected {
        background: rgb(210, 219, 223);
    }
</style>