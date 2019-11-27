<template>
    <v-dialog v-model="dialog" persistent width="600px">
        <v-card>
            <v-toolbar dark color="primary">
                <v-toolbar-title>Map Setup </v-toolbar-title>
                <v-spacer> </v-spacer>
                <v-btn icon @click="dialog=false">
                    <v-icon> close </v-icon>
                </v-btn>
            </v-toolbar>
            <v-container grid-list-md class="pa-2">
                <v-layout row wrap style="height: 400px; overflow-x: auto;">
                    <v-flex md4>
                        <v-card style="cursor: pointer;" v-if="selected == noneConfig" height="180"
                            color="grey lighten-1" flat tile>
                            <v-card-text>
                                <h4 style="text-decoration: underline;">{{ noneConfig.name }}</h4>
                                <img style="width: 100%" src="nomap.png" alt="no image found">
                            </v-card-text>
                        </v-card>
                        <v-card style="cursor: pointer;" @click="selected = noneConfig" v-else height="180"
                            color="grey lighten-3" flat tile>
                            <v-card-text>
                                <h4 style="text-decoration: underline;">{{ noneConfig.name }}</h4>
                                <img style="width: 100%" src="nomap.png" alt="no image found">
                            </v-card-text>
                        </v-card>
                    </v-flex>
                     <!-- <v-flex md4>
                        <v-card style="cursor: pointer;" v-if="selected == geogridConfig" height="180"
                            color="grey lighten-1" flat tile>
                            <v-card-text>
                                <h4 style="text-decoration: underline;">{{ geogridConfig.name }}</h4>
                                <img style="width: 100%" src="https://www.conservationtech.com/PROJECTS/2010HAITI/GingerbreadSurvey/OSM-plan%20with%20GeoGrid.jpg" alt="no image found">
                            </v-card-text>
                        </v-card>
                        <v-card style="cursor: pointer;" @click="selected = geogridConfig" v-else height="180"
                            color="grey lighten-3" flat tile>
                            <v-card-text>
                                <h4 style="text-decoration: underline;">{{ geogridConfig.name }}</h4>
                                <img style="width: 100%" src="https://www.conservationtech.com/PROJECTS/2010HAITI/GingerbreadSurvey/OSM-plan%20with%20GeoGrid.jpg" alt="no image found">
                            </v-card-text>
                        </v-card>
                    </v-flex> -->
                    <v-flex md4 v-for="(map, idx) in maps" :key="idx">
                        <v-card style="cursor: pointer;" v-if="map == selected" height="180" color="grey lighten-1" flat
                            tile>
                            <v-card-text>
                                <h4 style="text-decoration: underline;">{{ map.name }}</h4>
                                <img style="width: 100%" :src="imageSrc(map.id)" alt="no image found">
                            </v-card-text>
                        </v-card>
                        <v-card style="cursor: pointer;" @click="selected = map" v-else height="180"
                            color="grey lighten-3" flat tile>
                            <v-card-text>
                                <h4 style="text-decoration: underline;">{{ map.name }}</h4>
                                <img style="width: 100%" :src="imageSrc(map.id)" alt="no image found">
                            </v-card-text>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-container>
            <v-card-actions>
                <v-spacer> </v-spacer>
                <v-btn :disabled="selected == null" color="primary" @click="close">Confirm</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    import Axios from 'axios';

    export default {
        data() {
            return {
                dialog: false,
                callback: null,
                maps: [],
                selected: null,
                geogridConfig: {
                    id: -1,
                    name: "Geogrid"
                },
                 noneConfig: {
                    id: -1,
                    name: "None"
                }
            }
        },
        methods: {
            show(callback) {
                let self = this
                self.getmaps();
                self.selected = null;
                self.callback = callback
                self.dialog = true;
            },
            close() {
                let self = this;
                self.dialog = false;
                console.log("selectedmap",self.selected);
                
                self.callback(self.selected);
            },
            imageSrc(imgID) {
                let self = this;
                return process.env.VUE_APP_API + `MapImage?mapImageID=${imgID}&type=map`
            },
            getmaps() {
                let self = this
                self.maps=[]
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + `MapImage`).then(r => {
                    r.data.forEach(element => {
                        self.maps.push(element);
                    });
                })
            },
        }
    }
</script>