<template>
    <div grid-list-md>
        <v-layout class="pa-0 ma-0" row wrap>
            <v-flex md12>
                <v-toolbar flat dark dense color="grey darken-3">
                    <v-toolbar-title>Data Imports - </v-toolbar-title>
                    <v-toolbar-items>
                        <v-autocomplete hide-details filled style="margin-left: 10px; margin-top: 0px; width: 300px"
                            :items="filteredItems" @change="getTransactionsFromFolder(selectedItem)"
                            v-model="selectedItem">
                        </v-autocomplete>


                    </v-toolbar-items>
                    <v-spacer></v-spacer>
                    <v-text-field v-model="search" placeholder="Find"></v-text-field>
                </v-toolbar>

            </v-flex>
            <!-- <Grid ref="Grid" :rowData="importTransactionItemList" /> -->

            <!-- <v-flex md4> -->
            <!-- <v-card>

                    <v-list dense class="pa-0" style="height: calc(100vh - 200px); overflow-x: auto;">
                        <template v-for="(item, idx) in filteredItems">
                            <v-list-tile @click="selectedItem = item; getTransactionsFromFolder(item.name)"
                                :class="{ 'selected': selectedItem == item.name }" :key="idx">
                                {{ item.name }}
                            </v-list-tile>
                            <v-divider :key="'d-' + idx"></v-divider>
                        </template>
                    </v-list>
                </v-card> -->
            <!-- </v-flex> -->
            <v-flex md12>
                <v-layout row wrap>
                    <v-flex>

                        <v-toolbar flat dark dense>
                            <v-toolbar-title> {{ selectedItem == null ? "" : selectedItem }}
                            </v-toolbar-title>

                            <v-spacer></v-spacer>
                            <v-btn icon small @click="openFileDialog">
                                <v-icon>cloud_upload</v-icon>
                            </v-btn>
                            <input @change="onFileChange" type="file" ref="file" style="display: none">
                            <v-btn icon small @click="downloadTemplate">
                                <v-icon>cloud_download</v-icon>
                            </v-btn>
                        </v-toolbar>
                        <Grid ref="Grid" :rowData="importTransactionItemList" />

                    </v-flex>
                </v-layout>
            </v-flex>
        </v-layout>
        <a v-if="selectedItem != null" display="none" ref="downloadLink"
            :href="serverAddress + 'DataImport/Template?templateName=' + selectedItem" download></a>
        <SizeLoader ref="SizeLoader" />

    </div>
</template>

<script>
    import Axios from 'axios';

    import jwt from 'jsonwebtoken';
    import {
        isNullOrUndefined
    } from 'util';

    import Grid from './Grid/Grid.vue';
    import SizeLoader from '@/components/Common/SizeLoader';


    function cardItem(data) {
        this.name = data.name;
        this.icon = data.icon;
        this.route = data.route;
    }

    export default {
        components: {
            Grid,
            SizeLoader
        },
        name: 'DataImport',
        data: () => {
            return {
                display: true,
                serverAddress: process.env.VUE_APP_API,
                selectedItem: null,
                search: "",
                items: [{
                        value: 'Product Master',
                        text: 'Product Master',
                    },
                    {
                        text: 'Sales Data',

                        value: 'Sales Data'
                    },
                    {
                        value: 'New Products',
                        text: 'New Products'
                    },
                    {
                        value: 'Duplicate Barcodes',
                        text: 'Duplicate Barcodes'
                    },
                    {
                        text: 'Category Codes',
                        value: 'Category Codes'
                    },
                    {
                        text: 'Active Shop Codes',
                        value: 'Active Shop Codes'
                    },
                    {
                        text: 'Product Dimentions',
                        value: 'Product Dimentions'
                    },
                    {
                        value: 'Product Stock',
                        text: 'Product Stock'
                    },
                    {
                        value: 'Store Clustering',
                        text: 'Store Clustering'
                    },
                    {
                        value: 'Store Turnover Groups',
                        text: 'Store Turnover Groups'
                    },
                    {
                        value: 'Store Trading Space',
                        text: 'Store Trading Space'
                    },
                    {
                        value: 'Store Geographic Location',
                        text: 'Store Geographic Location'
                    },
                    {
                        value: 'Store Contact Details',
                        text: 'Store Contact Details'
                    },
                    {
                        value: 'Store Details',
                        text: 'Store Details'
                    },
                    {
                        text: 'New Store',
                        value: 'New Store'
                    },
                    {
                        value: 'Department Clustering',
                        text: 'Department Clustering'
                    },
                    {
                        value: 'Catgory Clustering',
                        text: 'Catgory Clustering'
                    },
                    {
                        value: 'Product Packaging',
                        text: 'Product Packaging'
                    },
                    {
                        value: 'Item Indicators',
                        text: 'Item Indicators'
                    },
                    {
                        value: 'RI by Store Cluster',
                        text: 'RI by Store Cluster'
                    },
                    {
                        value: 'RI by Custom Cluster',
                        text: 'RI by Custom Cluster'
                    },
                    {
                        value: 'RI by Regional Cluster',
                        text: 'RI by Regional Cluster'
                    },
                    {
                        value: 'RI by Store',
                        text: 'RI by Store'
                    }
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
                    return item.text.toLowerCase().indexOf(self.search.toLowerCase()) > -1
                })
            }
        },
        methods: {
            updateLoader(data) {

                let self = this
                self.$refs.SizeLoader.updateLoader(data)

            },
            downloadTemplate() {
                let self = this;
                self.$refs.downloadLink.click();
            },
            openFileDialog() {
                let self = this;
                self.$refs.file
                self.$refs.file.click();
            },
            getTransactionsFromFolder(importFolder) {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + `DataImport/ImportDatabase?importFolder=${importFolder}`)
                    .then(r => {
                        console.log("[getTransactionsFromFolder]");
                        console.log(r);

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

                self.createUploadTransaction(file.name, self.selectedItem, transactionID => {
                    self.uploadImportFile(transactionID, file, () => {
                        self.getTransactionsFromFolder(self.selectedItem)
                    })
                })
            },
            uploadImportFile(transactionID, file, callback) {
                let self = this;
                self.$refs.SizeLoader.show()
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                self.updateLoader({
                    currentFileSize: 0,
                    FileTotalSize: 0,
                })
                var startTime = new Date()
                let config = {
                    onUploadProgress: progressEvent => {
                        var currentFileSize = progressEvent.loaded * 0.000001
                        var FileTotalSize = progressEvent.total * 0.000001
                        var progress = (currentFileSize / FileTotalSize) * 100
                        var TIME_TAKEN = new Date().getTime() - startTime.getTime()
                        var DownloadSpeed = currentFileSize / (TIME_TAKEN / 1000)

                        // do whatever you like with the percentage complete
                        // maybe dispatch an action that will update a progress bar or something
                        self.updateLoader({
                            title: "Uploading File",
                            text1: self.selectedItem,
                            currentFileSize: currentFileSize,
                            FileTotalSize: FileTotalSize,
                            progress: progress,
                            currentFile: null,
                            totalFiles: 1,
                            DownloadSpeed: DownloadSpeed,
                        })
                    }
                }

                Axios.post(self.serverAddress + `DataImport/ImportDatabase/UploadFile?importTransactionID=` +
                        transactionID, file, config)
                    .then(r => {
                        console.log("[uploadImportFile]");
                        console.log(r);
                        self.$refs.SizeLoader.close()

                        callback(r)
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
                        console.log("[createUploadTransaction]");
                        console.log(r);

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