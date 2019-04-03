<template>
    <div>
        <v-container grid-list-md>
            <v-layout row wrap>
                <v-flex>
                    <v-card>
                        <v-toolbar flat dense dark>
                            <v-btn icon @click="$router.go(-1)">
                                <v-icon>arrow_back</v-icon>
                            </v-btn>
                            <v-toolbar-title>{{ name }} Import</v-toolbar-title>
                            <v-spacer></v-spacer>
                            <v-btn icon>
                                <v-icon>attachment</v-icon>
                            </v-btn>
                            <v-btn icon @click="openFileDialog">
                                <v-icon>cloud_upload</v-icon>
                            </v-btn>
                        </v-toolbar>
                        <v-list dense class="pa-0">
                            <v-progress-linear class="ma-0" v-model="value" :active="show" :indeterminate="query"
                                :query="true">
                            </v-progress-linear>
                            <template v-if="items != null && items.length == 0">
                                <v-list-tile>No Items Found</v-list-tile>
                            </template>
                            <template v-else v-for="(item, index) in items">
                                <v-list-tile :key="item.title" avatar ripple @click="toggle(index)">
                                    <v-list-tile-avatar>
                                        <v-avatar>
                                            <v-icon v-if="item.status == 0" color="info">access_time</v-icon>
                                            <v-icon v-if="item.status == 1" color="success">check_circle_outline</v-icon>
                                            <v-icon v-if="item.status == 2" color="error">error_outline</v-icon>
                                        </v-avatar>
                                    </v-list-tile-avatar>
                                    <v-list-tile-content>
                                        <v-list-tile-title>
                                            <span class="font-weight-light">2018-01-0{{ index + 1 }} - </span>
                                            <span class="font-weight-medium">{{ item.name }}</span>
                                        </v-list-tile-title>
                                    </v-list-tile-content>
                                    <v-list-tile-action>
                                        <v-menu left>
                                            <v-btn slot="activator" icon>
                                                <v-icon>more_vert</v-icon>
                                            </v-btn>
                                            <v-list dense>
                                                <v-list-tile>Retry</v-list-tile>
                                                <v-divider></v-divider>
                                                <v-list-tile>Download</v-list-tile>
                                                <v-divider></v-divider>
                                                <v-list-tile>Details</v-list-tile>
                                            </v-list>
                                        </v-menu>
                                    </v-list-tile-action>
                                </v-list-tile>
                                <v-divider v-if="index + 1 < items.length" :key="index"></v-divider>
                            </template>
                        </v-list>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
        <input @change="onFileChange" accept=".csv" ref="fileInput" style="display: none" type="file">
    </div>
</template>

<script>

    import Axios from 'axios';

    export default {
        name: 'common-import-list',
        props: ['name'],
        data: () => {
            return {
                selected: [],
                items: null,
                value: 0,
                query: false,
                show: false,
                interval: 0
            }
        },
        created() {
            let self = this;
            self.getFilesByFolder();
        },
        beforeDestroy() {
            clearInterval(this.interval)
        },
        methods: {
            getFilesByFolder() {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + "DataImport/ImportDatabase?importFolder=" + self.name)
                    .then(r => {
                        if(r.data.success) {
                            self.items = r.data.importTransactionItemList;
                        }
                        else {
                            self.items = [];
                            alert(e.data.clientError);
                        }
                        delete Axios.defaults.headers.common["TenantID"];
                    })
                    .catch(e => {
                        alert("Failed to get imported files");
                        console.log(e);
                        delete Axios.defaults.headers.common["TenantID"];
                    })
            },
            toggle(index) {
                const i = this.selected.indexOf(index)

                if (i > -1) {
                    this.selected.splice(i, 1)
                } else {
                    this.selected.push(index)
                }
            },
            openFileDialog() {
                let self = this;
                self.$refs.fileInput.value = null;
                self.$refs.fileInput.click();
            },
            onFileChange(e) {
                let self = this;

                const files = e.target.files;
                let file = files[0];

                self.blobToArrayBuffer(file, result => {
                    var fileArray = Array.from(new Uint8Array(result));
                    self.queryAndIndeterminate(file.name)
                })
            },
            blobToArrayBuffer(blob, callback) {
                var a = new FileReader();
                a.onload = function () {
                    callback(a.result);
                }
                a.readAsArrayBuffer(blob);
            },
            uploadImportFile() {
            },
            queryAndIndeterminate(name) {
                let self = this;
                this.query = true
                this.show = true
                this.value = 0

                setTimeout(() => {
                    this.query = false;

                    this.interval = setInterval(() => {
                        if (this.value === 100) {
                            clearInterval(this.interval)
                            this.show = false
                            self.items.push({
                                name: name,
                                status: 0
                            })
                        }
                        this.value += 25
                    }, 1000)
                }, 2000);
            }
        }
    }
</script>