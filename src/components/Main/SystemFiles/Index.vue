<template>
    <div style="margin-top: 3px;">
        <div @contextmenu.prevent="onContextMenu" class="route-item" @click="folderClick">
            <v-icon size="12">{{ showFolders ? 'folder_open' : 'folder' }}</v-icon>
            <span class="ml-1">Reports</span>
        </div>
        <div style="margin-left: 15px;" v-if="showFolders">
            <SystemFiles :systemUserID="systemUserID" :items="folderFiles" />
            <div v-if="showAddFolder">
                <v-form @submit.prevent="submitFolderFile">
                    <v-icon size="12">{{ currentType == 'folder' ? 'folder' : 'bar_chart' }}</v-icon>
                    <input @blur="showAddFolder = false" ref="folderName" v-model="folderName" class="ml-1"
                        style="border: 1px solid lightgrey" type="text">
                </v-form>
            </div>
        </div>
        <v-menu v-model="showMenu" :position-x="x" :position-y="y" absolute offset-y>
            <v-list dense class="pa-0">
                <v-list-tile class="pa-0" @click="addFolderFile('folder')">
                    <v-list-tile-title class="pa-0">Add Folder</v-list-tile-title>
                </v-list-tile>
                <v-divider></v-divider>
                <v-list-tile class="pa-0" @click="addFolderFile('page')">
                    <v-list-tile-title class="pa-0">Add Page</v-list-tile-title>
                </v-list-tile>
            </v-list>
        </v-menu>
    </div>
</template>

<script>
    import Axios from 'axios'
    import jwt from 'jsonwebtoken';
    import SystemFiles from './SystemFiles';

    export default {
        components: {
            SystemFiles
        },
        data() {
            return {
                currentType: '',
                systemUserID: -1,
                showFolders: false,
                folderFiles: [],
                showMenu: false,
                x: 0,
                y: 0,
                showAddFolder: false,
                folderName: ""
            }
        },
        mounted() {
            let self = this;
            let encoded_details = jwt.decode(sessionStorage.accessToken);
            self.systemUserID = encoded_details.USER_ID;
        },
        methods: {
            folderClick() {
                let self = this;

                if (self.showFolders) {
                    self.showFolders = false;
                    self.folderFiles = [];
                } else {
                    self.getSystemFolderFiles(() => {
                        self.showFolders = true;
                    })
                }
            },
            getSystemFolderFiles(callback) {
                let self = this;

                self.folderFiles = [];

                Axios.get(process.env.VUE_APP_API + `SystemFolderFile?parentID=null`)
                    .then(r => {
                        r.data.systemFolderFileList.forEach(folderFile => {
                            self.folderFiles.push(new treeItem(folderFile));
                        });

                        callback();
                    })
            },
            onContextMenu(e, item) {
                let self = this;
                self.showMenu = false
                self.x = e.clientX
                self.y = e.clientY
                self.$nextTick(() => {
                    self.showMenu = true
                })
            },
            addFolderFile(type) {
                let self = this;

                self.folderName = "";
                self.currentType = type;

                if (!self.showMyFiles)
                    self.showMyFiles = true;

                self.showAddFolder = true;

                setTimeout(() => {
                    self.$refs.folderName.focus();
                }, 100);
            },
            submitFolderFile() {
                let self = this;

                let type = self.currentType == 'folder' ? 0 : 1;

                let request = {
                    parentID: null,
                    name: self.folderName,
                    type: type
                }

                self.createFolderFile(request, newFolderFile => {
                    self.folderFiles.push(new treeItem(newFolderFile));
                    self.showAddFolder = false;
                })
            },
            createFolderFile(request, callback) {
                let self = this;

                Axios.post(process.env.VUE_APP_API + `SystemFolderFile`, request)
                    .then(r => {
                        callback(r.data.systemFolderFile);
                    })
            },
        }
    }

    function treeItem(data) {
        let self = this;

        for (var prop in data) {
            self[prop] = data[prop];
        }

        self.children = [];
        self.showChildren = false;
        self.showAddFolder = false;
        self.showEdit = false;
    }
</script>

<style>
    .route-item {
        cursor: pointer;
        font-size: 12px;
        display: flex;
    }
</style>