<template>
    <div>
        <div>
            <div v-for="(item, idx) in items" :key="idx">
                <div @click="folderClick(item)" @contextmenu.prevent="onContextMenu($event, item)" class="route-item"
                    v-if="item.type == 0">
                    <v-progress-circular :size="12" v-if="item.loading" :width="2" indeterminate color="primary">
                    </v-progress-circular>
                    <v-icon size="12">{{ item.showChildren ? 'folder_open' : 'folder' }}</v-icon>
                    <span style="font-size: 9px;" class="ml-1" v-if="!item.showEdit">{{item.name}}</span>
                    <v-form @submit.prevent="submitFolderRename">
                        <input :ref="'edit' + item.id" v-if="item.showEdit" @blur="submitFolderRename"
                            v-model="item.name" class="ml-1" style="border: 1px solid lightgrey" type="text">
                    </v-form>
                </div>
                <div @contextmenu.prevent="onContextMenuFile($event, item)" class="route-item" v-if="item.type == 1">
                    <v-progress-circular :size="12" v-if="item.loading" :width="2" indeterminate color="primary">
                    </v-progress-circular>
                    <v-icon size="12">insert_drive_file</v-icon>
                    <span style="font-size: 9px;" class="ml-1" v-if="!item.showEdit">{{item.name}}</span>
                    <v-form @submit.prevent="submitFolderRename">
                        <input :ref="'edit' + item.id" v-if="item.showEdit" @blur="submitFolderRename"
                            v-model="item.fileName" class="ml-1" style="border: 1px solid lightgrey" type="text">
                    </v-form>
                </div>
                <UserFiles :systemUserID="systemUserID" v-if="item.showChildren" style="margin-left: 5px;"
                    :onContextMenu="onContextMenu" :items="item.children"></UserFiles>
                <div v-if="item.showAddFolder" style="margin-left: 5px;">
                    <v-form @submit.prevent="submitFolder">
                        <v-icon size="12">folder</v-icon>
                        <input @blur="item.showAddFolder = false" :ref="'folderName' + item.id" v-model="folderName"
                            class="ml-1" style="border: 1px solid lightgrey" type="text">
                    </v-form>
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
                    <v-divider></v-divider>
                    <v-list-tile class="pa-0" @click="rename">
                        <v-list-tile-title class="pa-0">Rename</v-list-tile-title>
                    </v-list-tile>
                    <v-divider></v-divider>
                    <v-list-tile class="pa-0" @click="share">
                        <v-list-tile-title class="pa-0">Share</v-list-tile-title>
                    </v-list-tile>
                    <v-divider></v-divider>
                    <v-list-tile class="pa-0" @click="deleteItem">
                        <v-list-tile-title class="pa-0">Delete</v-list-tile-title>
                    </v-list-tile>
                </v-list>
            </v-menu>
            <v-menu v-model="showFileMenu" :position-x="x" :position-y="y" absolute offset-y>
                <v-list dense class="pa-0">
                    <v-list-tile class="pa-0" @click="downloadFile">
                        <v-list-tile-title class="pa-0">Download</v-list-tile-title>
                    </v-list-tile>
                    <v-divider></v-divider>
                    <v-list-tile class="pa-0" @click="rename">
                        <v-list-tile-title class="pa-0">Rename</v-list-tile-title>
                    </v-list-tile>
                    <v-divider></v-divider>
                    <v-list-tile class="pa-0" @click="share">
                        <v-list-tile-title class="pa-0">Share</v-list-tile-title>
                    </v-list-tile>
                    <v-divider></v-divider>
                    <v-list-tile class="pa-0" @click="deleteItem">
                        <v-list-tile-title class="pa-0">Delete</v-list-tile-title>
                    </v-list-tile>
                </v-list>
            </v-menu>
            <input multiple @change="onFileChange" type="file" ref="fileInput" style="display: none" />
            <a style="display: none;" ref="downloadLink" href="" download></a>
        </div>
        <YesNoModal style="position: absolute" ref="YesNoModal" />
        <UserSharedFileSelector style="position: absolute" ref="UserSelector" />
    </div>
</template>

<script>
    import Axios from 'axios';
    import YesNoModal from '@/components/Common/YesNoModal'
    import UserSharedFileSelector from './UserSharedFileSelector'

    export default {
        components: {
            YesNoModal,
            UserSharedFileSelector
        },
        data() {
            return {
                showMenu: false,
                showFileMenu: false,
                x: 0,
                y: 0,
                files: [],
                showAddFolder: false,
                folderName: "",
                selectedItem: null
            }
        },
        props: ['items', 'systemUserID'],
        name: 'UserFiles',
        methods: {
            onContextMenu(e, item) {
                let self = this;

                self.selectedItem = item;
                self.showMenu = false
                self.x = e.clientX
                self.y = e.clientY
                self.$nextTick(() => {
                    self.showMenu = true
                })
            },
            onContextMenuFile(e, item) {
                let self = this;

                self.selectedItem = item;
                self.showFileMenu = false
                self.x = e.clientX
                self.y = e.clientY
                self.$nextTick(() => {
                    self.showFileMenu = true
                })
            },
            getFolderFileByParentID(parentID, callback) {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + `FolderFile?parentID=${parentID}`)
                    .then(r => {
                        delete Axios.defaults.headers.common["TenantID"];

                        let tmp = [];

                        r.data.forEach(ff => {
                            tmp.push(new treeItem(ff))
                        });

                        callback(tmp);
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
            modifyFolderFile(callback) {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.put(process.env.VUE_APP_API + `FolderFile`, self.selectedItem)
                    .then(r => {
                        delete Axios.defaults.headers.common["TenantID"];
                        callback(r.data);
                    })
            },
            addFolder() {
                let self = this;

                self.folderName = "";

                if (!self.selectedItem.showChildren) {
                    self.getFolderFileByParentID(self.selectedItem.id, folderFiles => {
                        self.selectedItem.children = folderFiles;
                        self.selectedItem.showChildren = true;
                        self.selectedItem.showAddFolder = true;
                        setTimeout(() => {
                            self.$refs['folderName' + self.selectedItem.id][0].focus();
                        }, 200);
                    });
                } else {
                    self.selectedItem.showAddFolder = true;
                    setTimeout(() => {
                        self.$refs['folderName' + self.selectedItem.id][0].focus();
                    }, 200);
                }
            },
            submitFolder() {
                let self = this;

                let request = {
                    systemUserID: self.systemUserID,
                    parentID: self.selectedItem.id,
                    name: self.folderName,
                    type: 0
                }

                self.createFolderFile(request, newFolderFile => {
                    self.selectedItem.children.push(new treeItem(newFolderFile));
                    self.selectedItem.showAddFolder = false;
                })
            },
            rename() {
                let self = this;

                self.selectedItem.showEdit = true;

                setTimeout(() => {
                    self.$refs['edit' + self.selectedItem.id][0].focus();
                }, 200);
            },
            submitFolderRename() {
                let self = this;

                if (self.selectedItem.type == 1) {
                    self.selectedItem.name = self.selectedItem.fileName + "." + self.selectedItem.extension;
                }

                self.modifyFolderFile(() => {
                    self.selectedItem.showEdit = false;
                })
            },
            folderClick(item) {
                let self = this;

                if (item.showChildren) {
                    item.showChildren = false;
                    item.children = [];
                } else {
                    self.getFolderFileByParentID(item.id, folderFiles => {
                        item.children = folderFiles;
                        item.showChildren = true;
                    });
                }
            },
            deleteItem() {
                let self = this;
                let folderFile = self.selectedItem;

                self.$refs.YesNoModal.show(`Do you want to delete this ${ folderFile.type == 0 ? 'folder' : 'file' }?`,
                    val => {
                        if (val) {
                            Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                            Axios.delete(process.env.VUE_APP_API + `FolderFile?folderFileID=${folderFile.id}`)
                                .then(() => {
                                    self.items.splice(self.items.indexOf(self.selectedItem), 1);
                                    self.selectedItem = null;
                                })
                                .catch(e => {
                                    alert("Failed to delete folder");
                                    console.error("Failed to delete folder. " + e);
                                })
                        }
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
                        self.selectedItem.children.push(new treeItem(fileTransaction));
                        index++;

                        if (index < files.length)
                            self.uploadFilesRecursive(files, index)
                    })
                })
            },
            createFileTransaction(fileName, extension, callback) {
                let self = this;

                let request = {
                    parentID: self.selectedItem.id,
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
                        delete Axios.defaults.headers.common["TenantID"];
                        alert("Failed to create file");
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
                    })
            },
            downloadFile() {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios({
                        method: 'GET',
                        url: process.env.VUE_APP_API + `FolderFile?folderFileID=${self.selectedItem.id}`,
                        cache: false,
                        responseType: 'blob',
                        processData: false,
                        contentType: "application/octet-stream",
                    })
                    .then(r => {
                        self.$refs.downloadLink.href = window.URL.createObjectURL(r.data);
                        self.$refs.downloadLink.download = self.selectedItem.name;
                        self.$refs.downloadLink.click();
                        delete Axios.defaults.headers.common["TenantID"];
                    })
                    .catch(e => {
                        console.error(e);
                    })
            },
            share() {
                let self = this;

                self.$refs.UserSelector.show(self.selectedItem.id, userIDs => {
                    Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                    Axios.post(process.env.VUE_APP_API + `SharedFolderFile?folderFileID=${self.selectedItem.id}`, userIDs)
                        .then(r => {
                            delete Axios.defaults.headers.common["TenantID"];
                        })
                });
            }
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
        self.showAddFolder = false;
        self.fileName = "";

        if (self.type == 1) {
            self.fileName = self.name.replace("." + self.extension, "")
        }
    }
</script>

<style>
    .route-item {
        cursor: pointer;
        font-size: 12px;
        display: flex;
    }
</style>