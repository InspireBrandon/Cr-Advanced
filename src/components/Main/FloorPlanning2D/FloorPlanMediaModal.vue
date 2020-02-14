<template>
    <v-dialog fullscreen persistent v-model="dialog">
        <v-card>
            <v-toolbar dark color="primary">
                <v-toolbar-title>
                    Floorplan Images
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="dialog=false">
                    <v-icon>
                        close
                    </v-icon>
                </v-btn>
            </v-toolbar>
            <v-toolbar dense dark>
                <v-btn color="primary" @click="addimage">Add Image </v-btn>
                <v-btn color="primary" @click="addFolder">Add Folder </v-btn>
            </v-toolbar>
            <v-container grid-list-md>
                <v-layout row wrap>
                    <v-flex md1 v-if="lastParent.length>0">
                        <FloorplanMediaItem :item="backItem" :handleFolder="goback" />
                    </v-flex>
                    <v-flex md1 v-for="(item,idx) in Folders" :key="idx">
                        <FloorplanMediaItem :item="item" :handleFolder="handleFolder" :selectedimage="selectedimage"/>
                    </v-flex>
                </v-layout>
            </v-container>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" @click="dialog = false"> cancel</v-btn>
                <v-btn color="primary" @click="submit"> submit</v-btn>
            </v-card-actions>
        </v-card>
        <FloorPlanMediaMaint ref="FloorPlanMediaMaint" />
        <Prompt ref="Prompt" />

    </v-dialog>
</template>
<script>
    import axios from "axios"

    import FloorplanMediaItem from "./FloorplanMedia_Item"
    import FloorPlanMediaMaint from "./FloorPlanMediaMaint"
    import Prompt from '@/components/Common/Prompt';


    export default {
        components: {
            FloorplanMediaItem,
            FloorPlanMediaMaint,
            Prompt
        },
        data() {
            return {
                backItem:{
                    name:"back",
                    folder:"back",
                    type:"back"
                },
                Folders: [],
                dialog: false,
                callback: null,
                parentID: null,
                lastParent: [],
                selectedimage:null
            }
        },
        methods: {
            goback() {
                let self = this
                    self.getMedia(self.lastParent[self.lastParent.length - 1], cb => {
                        self.lastParent.splice(self.lastParent.length - 1, 1)
                        self.parentID = self.lastParent[self.lastParent.length - 1]
                    })
            },
            handleFolder(item) {
                let self = this
                console.log("HandleFolder", item);
                if (item.file == null) {
                    self.lastParent.push(self.parentID)
                    self.getMedia(item.id, cb => {
                        self.parentID = item.id
                        console.log(self.lastParent);
                    })
                }else{
                    console.log("selected");
                    
                    self.selectedimage=item
                }
            },
            addimage() {
                let self = this
                self.$refs.FloorPlanMediaMaint.open(null, self.parentID, callback => {

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

                    })
                })

            },
            open(isAdd, callback) {
                let self = this
                self.callback = callback
                self.lastParent=[]
                self.getMedia(null, data => {
                    self.dialog = true

                })
            },
            getMedia(parentID, callback) {
                let self = this
                axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                axios.get(process.env.VUE_APP_API + `FloorplanMedia/parent?parent_ID=${parentID}`).then(r => {
                    console.log(r);
                    self.Folders = r.data

                })
                callback()

            },
            submit() {
                let self = this
                self.callback(self.selectedimage)
                self.dialog = false
            },
        },
    }
</script>