<template>
    <v-dialog width="800" persistent v-model="dialog">
        <v-toolbar dark color="primary">
            <v-toolbar-title>
                Floorplan Media
            </v-toolbar-title>
            <v-spacer></v-spacer>
        </v-toolbar>
        <v-toolbar dense dark>
            <v-btn v-if="selectedimage!=null" color="primary" @click="renameItem">Rename </v-btn>
            <v-btn v-if="selectedimage!=null" color="error" @click="deleteItem">Delete </v-btn>
        </v-toolbar>
        <v-card>
            <v-card @contextmenu.prevent="openContext($event)"  tile flat height="600" style="overflow-y: auto">
                <v-container grid-list-md>
                    <v-layout row wrap >
                        <v-flex md3 v-if="lastParent.length>0">
                            <FloorplanMediaItem :item="backItem" :handleFolder="goback" :EditName="false" />
                        </v-flex>
                        <v-flex md3 v-for="(item,idx) in Folders" :key="idx"
                          >
                            <FloorplanMediaItem :item="item" :handleFolder="handleFolder" :Rename="endEdit"
                                :selectedimage="selectedimage" :EditName="item.EditName" />
                            <v-menu v-model="showMenu" :position-x="x" :position-y="y" absolute offset-y>
                                <v-list dense class="pa-0">
                                    <v-list-tile class="pa-0" v-if="selectedItem!=null" @click.prevent="deleteItem">
                                        <v-list-tile-title class="pa-0">Delete</v-list-tile-title>
                                    </v-list-tile>
                                    <v-divider></v-divider>
                                    <v-list-tile class="pa-0" v-if="selectedItem!=null" @click.prevent="renameItem">
                                        <v-list-tile-title class="pa-0">Rename</v-list-tile-title>
                                    </v-list-tile>
                                    <v-divider></v-divider>
                                    <v-list-tile class="pa-0" @click.prevent="addFolder">
                                        <v-list-tile-title class="pa-0">Add Folder</v-list-tile-title>
                                    </v-list-tile>
                                    <v-divider></v-divider>
                                    <v-list-tile class="pa-0" @click.prevent="addimage">
                                        <v-list-tile-title class="pa-0">Add Image</v-list-tile-title>
                                    </v-list-tile>

                                </v-list>
                            </v-menu>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-card>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" @click="dialog = false"> cancel</v-btn>
                <v-btn color="primary" @click="submit"> submit</v-btn>
            </v-card-actions>
        </v-card>


        <FloorPlanMediaMaint ref="FloorPlanMediaMaint" />
        <Prompt ref="Prompt" />
        <YesNoModal ref="YesNoModal" />
        <Spinner ref="Spinner"></Spinner>



    </v-dialog>
</template>
<script>
    import axios from "axios"

    import FloorplanMediaItem from "./FloorplanMedia_Item"
    import FloorPlanMediaMaint from "./FloorPlanMediaMaint"
    import Prompt from '@/components/Common/Prompt';
    import YesNoModal from '@/components/Common/YesNoModal';
    import Spinner from '@/components/Common/Spinner';





    export default {
        components: {
            FloorplanMediaItem,
            FloorPlanMediaMaint,
            Prompt,
            YesNoModal,
            Spinner
        },
        data() {
            return {
                showMenu: false,
                x: null,
                y: null,
                backItem: {
                    name: "back",
                    folder: "back",
                    type: "back"
                },
                Folders: [],
                dialog: false,
                callback: null,
                parentID: null,
                lastParent: [],
                selectedimage: null,
                selectedItem: null,
            }
        },
        methods: {
            endEdit(item) {
                let self = this
                item.EditName = false
            },
            deleteItem() {
                let self = this
                self.$refs.YesNoModal.show("Are you sure you want to delete this item", value => {
                    if (value) {
                        axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                        axios.delete(process.env.VUE_APP_API + `FloorplanMedia?Item_ID=${self.selectedItem.id}`)
                            .then(r => {
                                self.getMedia(self.parentID, cab => {

                                })
                            })
                    }

                })

            },
            renameItem() {
                let self = this
                self.selectedItem.EditName = true

            },
            openContext(e, item) {
                console.log("item", item);
                console.log(e);
                console.log("evt",e.target.data);


                let self = this;
                self.selectedItem = item;
                self.showMenu = false
                self.x = e.clientX
                self.y = e.clientY
                self.$nextTick(() => {
                    self.showMenu = true
                })
            },

            goback() {
                let self = this
                self.getMedia(self.lastParent[self.lastParent.length - 1], cb => {
                    self.lastParent.splice(self.lastParent.length - 1, 1)
                    self.parentID = self.lastParent[self.lastParent.length - 1]
                })
            },
            handleFolder(item) {
                let self = this
                if (item.file == null && self.selectedimage == item) {
                    self.$refs.Spinner.show()
                    self.lastParent.push(self.parentID)
                    self.getMedia(item.id, cb => {
                        self.parentID = item.id
                        self.$refs.Spinner.hide()
                    })
                }
                self.selectedimage = item
            },
            addimage() {
                let self = this
                self.$refs.FloorPlanMediaMaint.open(null, self.parentID, callback => {
                    console.log("getting media");
                    self.getMedia(self.parentID, data => {
                        console.log("got media");
                    })
                })
            },
            addFolder() {
                let self = this
                axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                self.$refs.Prompt.show("", " Add Folder", "Please enter Folder name", Name => {
                    let req = {
                        parent_ID: self.parentID,
                        name: Name,
                        folder: Name,
                        file: null
                    }
                    axios.post(process.env.VUE_APP_API + `FloorplanMedia/save`, req).then(r => {
                        self.getMedia(self.parentID, data => {


                        })
                    })
                })

            },
            open(isAdd, callback) {
                let self = this
                self.callback = callback
                self.lastParent = []
                self.getMedia(null, data => {
                    self.dialog = true

                })
            },
            getMedia(parentID, callback) {
                let self = this
                self.selectedimage=null
                self.$refs.Spinner.show()
                axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                axios.get(process.env.VUE_APP_API + `FloorplanMedia/parent?parent_ID=${parentID}`).then(r => {
                    self.Folders = r.data
                    self.$refs.Spinner.hide()
                     callback()
                })
               
            },
            submit() {
                let self = this
                self.callback(self.selectedimage)
                self.dialog = false
            },
        },
    }
</script>