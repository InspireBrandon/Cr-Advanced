<template>
    <v-dialog v-model="dialog" persistent width="800px">
        <v-card>
            <v-toolbar dark flat color="primary">
                <v-toolbar-title>Locations</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="close">
                    <v-icon>close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-toolbar dark flat>
                <v-spacer></v-spacer>
                <v-btn @click="addGroup" color="primary">Add Group</v-btn>
            </v-toolbar>
            <v-card-text class="pa-2" style="height: 400px; overflow: auto;">
                <div v-for="(rg, idx) in retailerGroups" :key="'rg-' + idx">
                    <div style="display: flex; cursor: pointer;">
                        <v-btn icon small class="mt-0" v-if="rg.hidden" @click="toggleHidden(rg)">
                            <v-icon>visibility</v-icon>
                        </v-btn>
                        <v-btn icon small class="mt-0" v-if="!rg.hidden" @click="toggleHidden(rg)">
                            <v-icon>visibility_off</v-icon>
                        </v-btn>
                        <div class="headline" @click="toggleHidden(rg)">{{ rg.name }}</div>

                        <v-btn icon small class="mt-0" @click="addRetailer(rg)">
                            <v-icon>add</v-icon>
                        </v-btn>
                        <v-btn icon small flat color="primary" class="mt-0" @click="editGroup(rg)">
                            <v-icon>edit</v-icon>
                        </v-btn>
                        <v-btn icon small flat color="error" class="mt-0" @click="deleteGroup(rg)">
                            <v-icon>delete</v-icon>
                        </v-btn>
                    </div>
                    <v-list dense hover>
                        <template v-for="(retailer, idx) in retailers" v-if="retailer.retailerGroupID == rg.id">
                            <v-list-tile avatar :key="idx" v-if="!rg.hidden">
                                <v-list-tile-avatar tile>
                                    <v-img style="cursor: pointer;" v-if="showImages"
                                        @click="openFileDialog(retailer.id)" :src="retailerImage(retailer.id)"
                                        :lazy-src="retailerImage(retailer.id)" aspect-ratio="1" contain></v-img>
                                </v-list-tile-avatar>
                                <v-list-tile-content>
                                    <v-list-tile-title> {{ retailer.name }}</v-list-tile-title>
                                </v-list-tile-content>
                                <v-spacer></v-spacer>
                                <v-list-tile-action>
                                    <div style="display: flex;">
                                        <v-btn @click="modifyRetailer(retailer)" flat color="primary" icon>
                                            <v-icon>edit</v-icon>
                                        </v-btn>
                                        <v-btn style="margin-left: 5px;" @click="modifyRetailerStores(retailer)" flat
                                            icon>
                                            <v-icon>list</v-icon>
                                        </v-btn>
                                        <v-btn style="margin-left: 5px;" @click="deleteRetailer(retailer)" flat
                                            color="error" icon>
                                            <v-icon>delete</v-icon>
                                        </v-btn>
                                    </div>
                                </v-list-tile-action>
                            </v-list-tile>
                            <v-divider v-if="!rg.hidden" :key="idx + 'd'"></v-divider>
                        </template>
                    </v-list>
                </div>
            </v-card-text>
            <input type="file" style="display: none;" ref="IconInput" @change="onIconImageChange">
            <RetailerStore ref="RetailerStore" />
            <Prompt ref="Prompt" />
            <YesNoModal ref="YesNoModal" />
        </v-card>
    </v-dialog>

</template>
<script>
    import Axios from 'axios'
    import RetailerStore from './RetailerStore/Index'
    import Prompt from '@/components/Common/Prompt'
    import YesNoModal from '@/components/Common/YesNoModal'

    export default {
        data() {
            return {
                showImages: true,
                dialog: false,
                callback: null,
                selected: null,
                retailers: [],
                retailerGroups: [],
                currentRetailer: null
            }
        },
        components: {
            RetailerStore,
            Prompt,
            YesNoModal
        },
        methods: {
            retailerImage(retailerID) {
                let self = this;

                return process.env.VUE_APP_API + `Retailer/Image?retailerID=${retailerID}`
            },
            update() {
                let self = this
                self.openFileDialog()
            },
            getRetailerGroups() {
                let self = this;

                self.retailerGroups = [];

                Axios.get(process.env.VUE_APP_API + "RetailerGroup")
                    .then(r => {
                        r.data.retailerGroupList.forEach(element => {
                            element.hidden = true
                        });
                        self.retailerGroups = r.data.retailerGroupList;

                    })
            },
            getRetailers() {
                let self = this

                self.retailers = [];

                Axios.get(process.env.VUE_APP_API + "Retailer")
                    .then(r => {
                        self.retailers = r.data.retailerList;
                    })
            },
            modifyRetailerStores(retailer) {
                let self = this;

                self.$refs.RetailerStore.open(retailer, newRetailer => {

                });
            },
            open(callback) {
                let self = this
                self.getRetailerGroups();
                self.getRetailers();
                self.callback = callback
                self.dialog = true
            },
            addRetailer(rg) {
                let self = this;

                self.$refs.Prompt.show("", "Location file Name", "Name", name => {
                    if (name == "") {
                        alert("Please specify a name for the location.");
                    } else {
                        Axios.post(process.env.VUE_APP_API + "Retailer", {
                                retailerGroupID: rg.id,
                                name: name
                            })
                            .then(r => {
                                self.getRetailers();
                            })
                            .catch(e => {
                                console.error(e);
                            })
                    }
                })
            },
            addGroup() {
                let self = this;

                self.$refs.Prompt.show("", "Location Group Name", "Name", name => {
                    if (name == "") {
                        alert("Please specify a name for the location group.");
                    } else {
                        Axios.post(process.env.VUE_APP_API + "RetailerGroup", {
                                name: name
                            })
                            .then(r => {
                                self.getRetailerGroups();
                            })
                            .catch(e => {
                                console.error(e);
                            })
                    }
                })
            },
            toggleHidden(group) {
                let self = this
                group.hidden = !group.hidden
            },
            close() {
                let self = this
                self.dialog = false
                self.callback()
            },
            editGroup(group) {
                let self = this

                self.$refs.Prompt.show(group.name, "Location Group Name", "Name", name => {
                    if (name == "") {
                        alert("Please specify a name for the location group.");
                    } else {
                        group.name = name
                        Axios.put(process.env.VUE_APP_API + "RetailerGroup", group)
                            .then(r => {})
                            .catch(e => {
                                console.error(e);
                            })
                    }
                })
            },
            modifyRetailer(retailer) {
                let self = this;

                self.$refs.Prompt.show(retailer.name, "Location Name", "Name", name => {
                    if (name == "") {
                        alert("Please specify a name for the location.");
                    } else {
                        retailer.name = name
                        Axios.put(process.env.VUE_APP_API + "Retailer", retailer)
                            .then(r => {})
                            .catch(e => {
                                console.error(e);
                            })
                    }
                })
            },
            deleteGroup(group) {
                let self = this

                self.$refs.YesNoModal.show("Delete this location group?", value => {
                    if (value) {
                        Axios.delete(process.env.VUE_APP_API + "RetailerGroup?retailerGroupID=" + group.id)
                            .then(r => {
                                self.retailerGroups.splice(self.retailerGroups.indexOf(group), 1);
                            })
                    }
                })
            },
            openFileDialog(retailerID) {
                let self = this;
                self.currentRetailer = retailerID;
                self.$refs.IconInput.value = null
                self.$refs.IconInput.click();
            },
            onIconImageChange(e) {
                let self = this;
                const files = e.target.files;
                let file = files[0];
                self.uploadImage(file);
            },
            uploadImage(image) {
                let self = this;

                Axios.post(process.env.VUE_APP_API + `Retailer/Image?retailerID=${self.currentRetailer}`, image)
                    .then(r => {
                        self.showImages = false;
                        setTimeout(() => {
                            self.showImages = true;
                        }, 60);
                    })
            },
            deleteRetailer(retailer) {
                let self = this;

                self.$refs.YesNoModal.show("Delete this location?", value => {
                    if (value) {
                        Axios.delete(process.env.VUE_APP_API + "Retailer?retailerID=" + retailer.id)
                            .then(r => {
                                self.retailers.splice(self.retailers.indexOf(retailer), 1);
                            })
                    }
                })
            }
        }
    }
</script>