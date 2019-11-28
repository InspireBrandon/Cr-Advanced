<template>
    <div style="margin-top: 3px;">
        <div class="route-item" @click="folderClick">
            <v-icon size="12">{{ showFolders ? 'folder_open' : 'folder' }}</v-icon>
            <span class="ml-1">Documents</span>
        </div>
        <div style="margin-left: 15px;" v-if="showFolders">
            <div>
                <div @contextmenu.prevent="onContextMenu" @click="myFolderClick" class="route-item">
                    <v-icon size="12">{{ showMyFiles ? 'folder_open' : 'folder' }}</v-icon>
                    <span class="ml-1">My Files</span>
                </div>
                <div style="margin-left: 15px;" v-if="showMyFiles">
                    <!-- add Uploaded Files -->
                    <UserFiles :systemUserID="systemUserID" :items="myFilesMain" />
                    <div v-if="showAddFolder">
                        <v-form @submit.prevent="submitFolder">
                            <v-icon size="12">folder</v-icon>
                            <input @blur="showAddFolder = false" ref="folderName" v-model="folderName" class="ml-1"
                                style="border: 1px solid lightgrey" type="text">
                        </v-form>
                    </div>
                </div>
            </div>
            <div>
                <div @click="sharedFolderClick" class="route-item">
                    <v-icon size="12">{{ showSharedFiles ? 'folder_open' : 'folder' }}</v-icon>
                    <span class="ml-1">Shared With Me</span>
                </div>
                <div style="margin-left: 15px;" v-if="showSharedFiles">
                    <!-- <UserFiles :systemUserID="systemUserID" :items="myFilesMain" /> -->
                    <div v-for="(item, idx) in sharedFiles" :key="idx">
                        <div @click="item.showChildren = !item.showChildren" class="route-item">
                            <v-icon size="12">{{ item.showChildren ? 'folder_open' : 'folder' }}</v-icon>
                            <span class="ml-1">{{ item.ownerName }}</span>
                        </div>
                        <div v-if="item.showChildren" style="margin-left: 15px;">
                            <SharedUserFiles :systemUserID="systemUserID" :items="item.children" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <v-menu v-model="showMenu" :position-x="x" :position-y="y" absolute offset-y>
            <v-list dense class="pa-0">
                <v-list-tile class="pa-0" @click="addFolder">
                    <v-list-tile-title class="pa-0">Add Folder</v-list-tile-title>
                </v-list-tile>
                <v-divider></v-divider>
                <v-list-tile class="pa-0" @click="openFileDialog">
                    <v-list-tile-title class="pa-0">Add File</v-list-tile-title>
                </v-list-tile>
            </v-list>
        </v-menu>
        <input @change="onFileChange" type="file" multiple ref="fileInput" style="display: none;" />
    </div>
</template>

<script>
    import Axios from 'axios'
    import UserFiles from './UserFiles'
    import SharedUserFiles from './SharedUserFiles'
    import jwt from 'jsonwebtoken';

    export default {
        name: 'recursive',
        components: {
            UserFiles,
            SharedUserFiles
        },
        data() {
            return {
                systemUserID: -1,
                showFolders: false,
                showMyFiles: false,
                myFilesMain: [],
                showSharedFiles: false,
                sharedFiles: [],
                sharedUsers: [],
                showMenu: false,
                x: 0,
                y: 0,
                showAddFolder: false,
                folderName: "",
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
                self.showFolders = !self.showFolders;
            },
            myFolderClick() {
                let self = this;

                if (self.showMyFiles) {
                    self.showMyFiles = false;
                    self.myFilesMain = [];
                } else {
                    self.getMyFiles(() => {
                        self.showMyFiles = true;
                    })
                }
            },
            sharedFolderClick() {
                let self = this;

                if (self.showSharedFiles) {
                    self.showSharedFiles = false;
                    self.sharedFiles = [];
                } else {
                    self.getSharedFiles(() => {
                        self.showSharedFiles = true;
                    })
                }
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
            getMyFiles(callback) {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                self.myFilesMain = [];

                Axios.get(process.env.VUE_APP_API + `FolderFile?parentID=null&userID=${self.systemUserID}`)
                    .then(r => {
                        delete Axios.defaults.headers.common["TenantID"];

                        r.data.forEach(folderFile => {
                            self.myFilesMain.push(new treeItem(folderFile));
                        });

                        callback();
                    })
            },
            getSharedFiles(callback) {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                self.sharedFiles = [];

                Axios.get(process.env.VUE_APP_API + `SharedFolderFile/SharedWithMe?systemUserID=${self.systemUserID}`)
                    .then(r => {
                        delete Axios.defaults.headers.common["TenantID"];

                        let tmpsharedUsers = []

                        r.data.forEach(folderFile => {
                            let add = true;
                            let currentItem = null;

                            tmpsharedUsers.forEach(sharedUser => {
                                if (folderFile.systemUserID == sharedUser.systemUserID) {
                                    currentItem = sharedUser;
                                    add = false;
                                }
                            })

                            if (add) {
                                currentItem = new treeItem(folderFile)
                                tmpsharedUsers.push(currentItem);
                            }

                            currentItem.children.push(new treeItem({
                                id: folderFile.folderFileID,
                                name: folderFile.name,
                                extension: folderFile.extension,
                                type: folderFile.type
                            }))
                        });

                        self.sharedFiles = tmpsharedUsers;

                        callback();
                    })
            },
            addFolder() {
                let self = this;

                self.folderName = "";

                if (!self.showMyFiles)
                    self.showMyFiles = true;

                self.showAddFolder = true;

                setTimeout(() => {
                    self.$refs.folderName.focus();
                }, 100);
            },
            submitFolder() {
                let self = this;

                let request = {
                    systemUserID: self.systemUserID,
                    parentID: null,
                    name: self.folderName,
                    type: 0
                }

                self.createFolderFile(request, newFolderFile => {
                    self.myFilesMain.push(new treeItem(newFolderFile));
                    self.showAddFolder = false;
                })
            },
            createFolderFile(request, callback) {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.post(process.env.VUE_APP_API + `FolderFile`, request)
                    .then(r => {
                        delete Axios.defaults.headers.common["TenantID"];

                        callback(r.data);
                    })
            },
            openFileDialog() {
                let self = this;
                self.$refs.fileInput.value = null;
                self.$refs.fileInput.click();
            },
            onFileChange(e) {
                let self = this;

                let files = e.target.files;

                if (files.length > 0) {
                    self.uploadFilesRecursive(files, 0);
                }
            },
            uploadFilesRecursive(files, index) {
                let self = this;
                let blob = files[index];
                let fileName = blob.name;
                var extension = fileName.substr(fileName.lastIndexOf('.') + 1);

                self.createFileTransaction(fileName, extension, fileTransaction => {
                    self.uploadFile(blob, fileTransaction.id, extension, () => {
                        self.myFilesMain.push(new treeItem(fileTransaction));
                        index++;

                        if (index < files.length)
                            self.uploadFilesRecursive(files, index)
                    })
                })
            },
            createFileTransaction(fileName, extension, callback) {
                let self = this;

                let request = {
                    parentID: null,
                    systemUserID: self.systemUserID,
                    name: fileName,
                    extension: extension,
                    type: 1
                }

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.post(process.env.VUE_APP_API + `FolderFile`, request)
                    .then(r => {
                        delete Axios.defaults.headers.common["TenantID"];
                        callback(r.data);
                    })
                    .catch(e => {
                        alert("Failed to create file");
                        console.error("Failed to create file. " + e);
                    })
            },
            uploadFile(blob, folderFileID, extension, callback) {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.post(process.env.VUE_APP_API + `FolderFile?folderFileID=${folderFileID}&extension=${extension}`,
                        blob)
                    .then(() => {
                        delete Axios.defaults.headers.common["TenantID"];
                        callback();
                    })
                    .catch(e => {
                        alert("Failed to upload file");
                        console.error("Failed to upload file. " + e);
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