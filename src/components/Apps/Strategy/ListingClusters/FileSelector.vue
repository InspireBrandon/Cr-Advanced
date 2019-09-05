<template>
    <div>
        <v-dialog v-model="dialog" width="700">
            <v-card height="400px" style="overflow: auto;">
                <v-card-title style="text-align: center; display: block;" class="headline pa-0">
                    <v-toolbar dark color="primary">
                        <v-toolbar-title>Select A File</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-text-field color="white" v-model="searchText" append-icon="search"></v-text-field>
                        <v-btn icon @click.native="dialog = false">
                            <v-icon>close</v-icon>
                        </v-btn>
                    </v-toolbar>
                </v-card-title>

                <v-card-text style="height: 280px; overflow: auto">
                    <v-list class="pa-0" dense hover>
                        <template v-for="(item, idx) in filteredList">
                            <v-list-tile :class="{ 'highlighted': selectedRange == item  }" avatar
                                @click="selectedRange = item" :key="idx">

                                <v-list-tile-content>
                                    <v-list-tile-title v-text="item.name"></v-list-tile-title>
                                </v-list-tile-content>
                            </v-list-tile>
                            <v-divider :key="idx + 'd'"></v-divider>
                        </template>
                    </v-list>
                </v-card-text>

                <v-card-actions>

                    <v-spacer></v-spacer>

                    <v-btn color="primary" @click="returnFile">Continue</v-btn>

                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import Axios from 'axios';

    export default {
        name: 'RangeSelectorModal',
        data() {
            return {
                dialog: false,
                items: [],
                afterComplete: null,
                selectedRange: null,
                searchText: ''
            }
        },
        computed: {
            filteredList() {
                return this.items.filter(item => {
                    if (!this.searchText) return this.items;
                    return (item.displayname.toLowerCase().includes(this.searchText.toLowerCase()))
                });
            }
        },

        methods: {
            show(afterComplete) {
                let self = this;
                self.getFiles(() => {
                    self.dialog = true;
                    self.afterComplete = afterComplete;
                })
            },
            returnFile() {
                let self = this;
                if (this.selectedRange == null) {
                    alert("Please Select one");
                } else {
                    self.dialog = false;
                    self.afterComplete(self.selectedRange);
                }
            },
            getFiles(callback) {
                let self = this

                Axios.get(process.env.VUE_APP_API + "SystemFile/JSON?db=CR-Devinspire&folder=CLUSTERING - LISTING")
                    .then(r => {
                        self.getPlanograms(r.data, callback)
                    })
                    .catch(e => {
                        alert("Failed to get data...");
                    })
            },
            getPlanograms(files, callback) {
                let self = this
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + `Planogram/Distinct`)
                    .then(r => {
                        let planograms = r.data.planogramList;

                        files.forEach(file => {
                            file.name = self.findAndReplaceName(file.name, planograms)
                        });

                        self.items = files;
                        
                        callback();
                        delete Axios.defaults.headers.common["TenantID"];
                    })
            },
            findAndReplaceName(name, planograms) {
                let self = this;

                let nameSplit = name.split(/ (.+)/);

                console.log(nameSplit)

                let planogram = planograms.find(e => {
                    return e.id == parseInt(nameSplit[0]);
                })

                console.log(planogram)

                return name.replace(nameSplit[0], planogram.displayname);
            }
        }
    }
</script>
<style>
    .highlighted {
        background-color: #1976d2;
        -webkit-text-fill-color: aliceblue
    }
</style>