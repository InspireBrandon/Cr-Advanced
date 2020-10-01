<template>
    <div>
        <v-dialog v-model="dialog" persistent scrollable width="600px">
            <v-card height="600px" style="overflow: auto;">
                <v-card-title style="text-align: center; display: block;" class="headline pa-0">
                    <v-toolbar dark color="primary">
                        <v-toolbar-title>Select A Floorplan</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-text-field color="white" v-model="searchText" append-icon="search"></v-text-field>
                        <v-btn icon @click.native="dialog = false">
                            <v-icon>close</v-icon>
                        </v-btn>
                    </v-toolbar>
                </v-card-title>

                <v-card-text>
                    <v-list dense hover>
                        <v-list-tile :class="{ 'highlighted': selectedFile == File  }" avatar @click="selectedFile = File" v-for="(File, idx) in filteredList" :key="idx">

                            <v-list-tile-content>
                                <v-list-tile-title v-text="File.name"></v-list-tile-title>
                            </v-list-tile-content>
                            <v-spacer></v-spacer>
                            <v-list-tile-action>
                                <v-menu offset-y>
                                    <v-btn @click="getversion(File)" slot="activator" icon>
                                        V {{File.version}}
                                    </v-btn>
                                    <v-list dense class="px-2">
                                        <div v-for="(item,idx) in versions" :key="idx">
                                            <v-list-tile @click="setVersion(File,item)">
                                                <v-list-tile-title>{{item.version}}</v-list-tile-title>
                                                  <v-list-avatar>
                                                    <v-icon v-if="item.isCurrent">
                                                        check
                                                    </v-icon>
                                                </v-list-avatar>
                                            </v-list-tile>
                                            <v-divider></v-divider>
                                        </div>
                                    </v-list>
                                </v-menu>
                            </v-list-tile-action>
                        </v-list-tile>
                    </v-list>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="returnFileFile">Continue</v-btn>
                    <!-- <v-btn flat @click="dialog = false">Cancel</v-btn> -->

                </v-card-actions>
            </v-card>
        </v-dialog>
        <Dialog ref="dialog"></Dialog>
    </div>
</template>

<script>
    import Axios from 'axios';
    import Dialog from '@/components/Common/Dialog';

    export default {
        name: 'FileSelectorModal',
        components: {
            Dialog
        },
        data() {
            return {
                dialog: false,
                FileData: [],
                afterComplete: null,
                selectedFile: null,
                searchText: '',
                folder: null,
                versions: [],
            }
        },
        computed: {
            filteredList() {
                return this.FileData.filter(item => {
                    if (!this.searchText) return this.FileData;
                    return (item.name.toLowerCase().includes(this.searchText.toLowerCase()))
                });
            }
        },

        methods: {
            setVersion(File, item) {
                let self = this
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                Axios.post(process.env.VUE_APP_API + `Floorplan/Versions?HeaderID=${File.id}&VersionID=${item.id}`)
                    .then(r => {
                        File.version = item.version
                    })
            },
            getversion(File) {
                let self = this
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                Axios.get(process.env.VUE_APP_API + `Floorplan/Versions?HeaderID=${File.id}`).then(r => {
                    console.log(r);
                    self.versions = r.data
                })
            },
            getFile(callback) {
                let self = this;

                self.FileData = [];
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + "GetFloorPlanHeaders")
                    .then(r => {
                        console.log("get floorplan headers", r.data);

                        self.FileData = r.data;

                        callback();
                    })
                    .catch(e => {
                        alert("Failed to get data...");
                    })
            },
            show(afterComplete) {
                let self = this;

                self.getFile(() => {
                    self.dialog = true;
                    self.afterComplete = afterComplete;
                })
            },
            returnFileFile() {
                let self = this;
                if (this.selectedFile == null) {
                    alert("Please Select A File");
                } else {
                    self.dialog = false;
                    console.log("selectedFile", self.selectedFile.id);

                    self.afterComplete(self.selectedFile);
                }
            },
        }
    }
</script>
<style>
    .highlighted {
        background-color: #1976d2;
        -webkit-text-fill-color: aliceblue
    }
</style>