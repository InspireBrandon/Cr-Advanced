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
                                <img style="width: 100%" src="data:image/png;base64,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" alt="no image found">
                            </v-card-text>
                        </v-card>
                        <v-card style="cursor: pointer;" @click="selected = noneConfig" v-else height="180"
                            color="grey lighten-3" flat tile>
                            <v-card-text>
                                <h4 style="text-decoration: underline;">{{ noneConfig.name }}</h4>
                                <img style="width: 100%" src="data:image/png;base64,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" alt="no image found">
                            </v-card-text>
                        </v-card>
                    </v-flex>
                     <v-flex md4>
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
                    </v-flex>
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
                self.callback(self.selected);
            },
            imageSrc(imgID) {
                let self = this;
                return process.env.VUE_APP_API + `MapImage?mapImageID=${imgID}&type=map`
            },
            getmaps() {
                let self = this
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