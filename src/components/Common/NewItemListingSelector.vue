<template>
    <div>
        <v-dialog v-model="dialog" persistent max-width="800">
            <v-card height="500px" style="overflow: auto;">

                <v-card-title style=" display: block;" class="headline pa-0">
                    <v-toolbar dark color="primary">
                        <v-toolbar-title>Select A File</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-text-field v-model="searchText" append-icon="search"></v-text-field>
                        <v-btn icon @click.native="dialog = false">
                            <v-icon>close</v-icon>
                        </v-btn>
                    </v-toolbar>
                </v-card-title>

                <v-card-text class="pa-0" style="height: 380px; overflow-x: auto;">
                    <v-list class="pa-0" dense hover>
                        <template v-for="(sp, idx) in filteredSpacePlans">
                            <v-list-tile :key="idx" avatar @click="selectedSpacePlan = sp" :class="{ 'highlighted_selected': selectedSpacePlan == sp  }">
                                <v-list-tile-content>
                                    <v-list-tile-title v-text="sp.name"></v-list-tile-title>
                                </v-list-tile-content>
                                <v-spacer></v-spacer>
                            </v-list-tile>
                            <v-divider :key="'divider' + idx"></v-divider>
                        </template>
                    </v-list>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-btn :disabled="selectedSpacePlan == null" color="error" @click="deleteSpacePlanFile">Delete
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="returnSpacePlanFile">Continue</v-btn>
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
        name: 'RangeSelectorModal',
        components: {
            Dialog
        },
        data() {
            return {
                searchText: null,
                dialog: false,
                spaceData: [],
                afterComplete: null,
                selectedSpacePlan: null,

                status: [{
                    type: 0,
                    friendy: "New",
                    color: "blue"
                }, {
                    type: 1,
                    color: "blue",
                    friendy: "In Progress"
                }, {
                    type: 2,
                    color: "blue",
                    friendy: "Requsting Approval"
                }, {
                    type: 3,
                    color: "red",
                    friendy: "Variation Requested"
                }, {
                    type: 4,
                    color: "green",
                    friendy: "Approved"
                }, {
                    type: 5,
                    color: "green",
                    friendy: "Implemented"
                }, {
                    type: 6,
                    color: "black",
                    friendy: "Retracted"
                }],
            }
        },
        computed: {
            filteredSpacePlans() {
                return this.spaceData.filter(item => {
                    if (!this.searchText) return this.spaceData;
                    return (item.name.toLowerCase().includes(this.searchText.toLowerCase()))
                });
            }
        },
        methods: {
            getSpacePlans(callback) {
                let self = this;

                self.spaceData = [];

                Axios.get(process.env.VUE_APP_API + "SystemFile/JSON?db=CR-Devinspire&folder=New Item Listing")
                    .then(r => {
                        self.spaceData = r.data;

                        callback();
                    })
                    .catch(e => {
                        alert("Failed to get data...");
                    })
            },
            show(afterComplete) {
                let self = this;
                self.getSpacePlans(() => {
                    self.dialog = true;
                    self.afterComplete = afterComplete;
                })
            },
            returnSpacePlanFile() {
                let self = this;
                if (this.selectedSpacePlan == null) {
                    alert("Please Select A File");
                } else {
                    self.dialog = false;

                    self.afterComplete(self.selectedSpacePlan.id, self.selectedSpacePlan);
                }
            },
            deleteSpacePlanFile() {
                let self = this;

                self.$refs.dialog.openDialog({
                    headline: "Delete file?",
                    text: "Are you sure you want to delete this file?",
                    callback: function () {

                        Axios.delete(process.env.VUE_APP_API +
                                `SystemFile/JSON/Delete?db=CR-Devinspire&id=${self.selectedSpacePlan.id}`)
                            .then(r => {
                                if (r.data) {
                                    self.spaceData.splice(self.spaceData.indexOf(self
                                        .selectedSpacePlan), 1);
                                    self.selectedSpacePlan = null;
                                }
                            })
                    }
                })
            }
        }
    }
</script>

<style>
    .highlighted_selected {
        background-color: #b8dcff;
    }
</style>