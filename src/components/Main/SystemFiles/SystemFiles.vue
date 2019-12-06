<template>
    <div>
        <div>
            <div v-for="(item, idx) in items" :key="idx">
                <div @click="folderClick(item)" @contextmenu.prevent="onContextMenu($event, item)" class="route-item"
                    v-if="item.type == 0">
                    <v-progress-circular :size="12" v-if="item.loading" :width="2" indeterminate color="primary">
                    </v-progress-circular>
                    <v-icon size="12">{{ item.showChildren ? 'folder_open' : 'folder' }}</v-icon>
                    <span class="ml-1" v-if="!item.showEdit">{{item.name}}</span>
                    <v-form @submit.prevent="submitFolderRename">
                        <input :ref="'edit' + item.id" v-if="item.showEdit" @blur="submitFolderRename"
                            v-model="item.name" class="ml-1" style="border: 1px solid lightgrey" type="text">
                    </v-form>
                </div>
                <div @click="$router.push(`/Bi/${item.id}`)" @contextmenu.prevent="onContextMenuFile($event, item)" class="route-item" v-if="item.type == 1">
                    <v-progress-circular :size="12" v-if="item.loading" :width="2" indeterminate color="primary">
                    </v-progress-circular>
                    <v-icon size="12">bar_chart</v-icon>
                    <span class="ml-1" v-if="!item.showEdit">{{item.name}}</span>
                    <v-form @submit.prevent="submitFolderRename">
                        <input :ref="'edit' + item.id" v-if="item.showEdit" @blur="submitFolderRename"
                            v-model="item.name" class="ml-1" style="border: 1px solid lightgrey" type="text">
                    </v-form>
                </div>
                <UserFiles :systemUserID="systemUserID" v-if="item.showChildren" style="margin-left: 15px;"
                    :onContextMenu="onContextMenu" :items="item.children"></UserFiles>
                <div v-if="item.showAddFolder" style="margin-left: 15px;">
                    <v-form @submit.prevent="submitFolderFile">
                        <v-icon size="12">{{ currentType == 'folder' ? 'folder' : 'bar_chart' }}</v-icon>
                        <input @blur="item.showAddFolder = false" :ref="'folderName' + item.id" v-model="folderName" class="ml-1"
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
                    <v-divider></v-divider>
                    <v-list-tile class="pa-0" @click="rename">
                        <v-list-tile-title class="pa-0">Rename</v-list-tile-title>
                    </v-list-tile>
                    <v-divider></v-divider>
                    <v-list-tile class="pa-0" @click="deleteItem">
                        <v-list-tile-title class="pa-0">Delete</v-list-tile-title>
                    </v-list-tile>
                </v-list>
            </v-menu>
            <v-menu v-model="showFileMenu" :position-x="x" :position-y="y" absolute offset-y>
                <v-list dense class="pa-0">
                    <v-list-tile class="pa-0" @click="setupPage">
                        <v-list-tile-title class="pa-0">Setup</v-list-tile-title>
                    </v-list-tile>
                    <v-divider></v-divider>
                    <v-list-tile class="pa-0" @click="rename">
                        <v-list-tile-title class="pa-0">Rename</v-list-tile-title>
                    </v-list-tile>
                    <v-divider></v-divider>
                    <v-list-tile class="pa-0" @click="deleteItem">
                        <v-list-tile-title class="pa-0">Delete</v-list-tile-title>
                    </v-list-tile>
                </v-list>
            </v-menu>
        </div>
        <YesNoModal style="position: absolute" ref="YesNoModal" />
        <PageSetup style="position: absolute" ref="PageSetup" />
    </div>
</template>

<script>
    import Axios from 'axios';
    import YesNoModal from '@/components/Common/YesNoModal'
    import PageSetup from './PageSetup'

    export default {
        components: {
            YesNoModal,
            PageSetup
        },
        data() {
            return {
                currentType: '',
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
            setupPage() {
                let self = this;

                self.$refs.PageSetup.show(self.selectedItem.id, data => {
                    self.savePage(data)
                })
            },
            savePage(data) {
                let self = this;

                let request = {
                    systemFolderFileID: data.systemFolderFileID,
                    systemPageSectionList: [{
                        bi_ReportID: data.bi_ReportID
                    }]
                }

                Axios.post(process.env.VUE_APP_API + "SystemPage", request)
                    .then(r => {
                    })
            },
            getFolderFileByParentID(parentID, callback) {
                let self = this;

                Axios.get(process.env.VUE_APP_API + `SystemFolderFile?parentID=${parentID}`)
                    .then(r => {

                        let tmp = [];

                        r.data.systemFolderFileList.forEach(ff => {
                            let ti = new treeItem(ff)

                            tmp.push(ti)

                            console.log(ti)
                        });

                        callback(tmp);
                    })
            },
            createFolderFile(request, callback) {
                let self = this;

                Axios.post(process.env.VUE_APP_API + `SystemFolderFile`, request)
                    .then(r => {
                        callback(r.data);
                    })
            },
            modifyFolderFile(callback) {
                let self = this;

                Axios.put(process.env.VUE_APP_API + `SystemFolderFile`, self.selectedItem)
                    .then(r => {
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
            submitFolderFile() {
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
            addFolderFile(type) {
                let self = this;

                self.folderName = "";
                self.currentType = type;

                if (!self.selectedItem.showChildren) {
                    self.getFolderFileByParentID(self.selectedItem.id, folderFiles => {
                        self.selectedItem.children = folderFiles;
                        self.selectedItem.showChildren = true;
                        self.selectedItem.showAddFolder = true;
                        setTimeout(() => {
                            self.$refs['folderName' + self.selectedItem.id][0].focus();
                        }, 200);
                    })
                } else {
                    self.selectedItem.showAddFolder = true;
                    setTimeout(() => {
                        self.$refs['folderName' + self.selectedItem.id][0].focus();
                    }, 200);
                }
            },
            submitFolderFile() {
                let self = this;

                let type = self.currentType == 'folder' ? 0 : 1;

                let request = {
                    parentID: self.selectedItem.id,
                    name: self.folderName,
                    type: type
                }

                self.createFolderFile(request, newFolderFile => {
                    self.selectedItem.children.push(new treeItem(newFolderFile));
                    self.selectedItem.showAddFolder = false;
                })
            },
            createFolderFile(request, callback) {
                let self = this;

                Axios.post(process.env.VUE_APP_API + `SystemFolderFile`, request)
                    .then(r => {
                        callback(r.data.systemFolderFile);
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

                self.$refs.YesNoModal.show(
                    `Do you want to delete this ${ folderFile.type == 0 ? 'folder' : 'page' }?`,
                    val => {
                        if (val) {

                            Axios.delete(process.env.VUE_APP_API +
                                    `SystemFolderFile?systemFolderFileID=${folderFile.id}`)
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