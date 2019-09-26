<template>
    <v-dialog v-model="dialog" width="1000px" persistent>
        <v-card>
            <v-toolbar dark flat color="primary">
                <v-toolbar-title> Map Image </v-toolbar-title>
                <v-spacer> </v-spacer>
                <v-btn icon @click="dialog=false">
                    <v-icon> close </v-icon>
                </v-btn>
            </v-toolbar>
            <v-toolbar dark flat>
                <v-select style="margin-left: 10px; margin-top: 8px; width: 200px" dense :items="maps"
                    v-model="selectedMap" hide-details>
                </v-select>
                <v-btn color="primary"> new </v-btn>
                <v-spacer> </v-spacer>
            </v-toolbar>
            <v-card-text>
                <v-container grid-list-md>
                    <v-layout row wrap>
                        <v-flex md4>
                            Name
                        </v-flex>
                        <v-flex md4>
                            Legend
                        </v-flex>
                        <v-flex md4>
                            Map
                        </v-flex>
                        <v-flex md4>
                            <v-text-field v-model="name">
                            </v-text-field>
                        </v-flex>
                        <v-flex md4>
                            <v-img @click="openLegendFileDialog"
                                :src="legendImgURL == '' ? legendImageURL : legendImgURL" aspect-ratio="1"
                                class="grey lighten-2" width="100%" max-height="200" style="cursor: pointer;"></v-img>
                        </v-flex>
                        <v-flex md4>
                            <v-img @click="openFileDialog" :src="MapImgURL == '' ? MapImageURL : MapImgURL"
                                aspect-ratio="1" class="grey lighten-2" width="100%" max-height="200"
                                style="cursor: pointer;"></v-img>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="submit">Save </v-btn>
            </v-card-actions>
        </v-card>
        <input type="file" style="display: none;" ref="LegendfileInput" @change="onLegendImageChange">
        <input type="file" style="display: none;" ref="MapfileInput" @change="onImageChange">
    </v-dialog>
</template>
<script>
    import Axios from 'axios'
    export default {
        data() {
            return {
                dialog: false,
                callback: null,
                name: null,
                legendImageURL: 'https://www.okcballet.org/wp-content/uploads/2016/09/placeholder-image.png',
                legendImgURL: '',
                legendImageLinkAddress: '',
                MapImageURL: 'https://www.okcballet.org/wp-content/uploads/2016/09/placeholder-image.png',
                MapImgURL: '',
                MapImageLinkAddress: '',
                maps: [],
                selectedMap: null,
            }
        },
        methods: {
            open(callback) {
                let self = this
                self.dialog = true
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + `MapImage`).then(r => {
                    console.log(r);
                    self.maps=r.data
                })
                self.callback = callback
            },
            submit() {
                let self = this
                self.callback()
                self.dialog = false
            },
            openFileDialog() {
                let self = this;
                self.$refs.MapfileInput.value = null
                self.$refs.MapfileInput.click();
            },
            onImageChange(e) {
                let self = this;
                const files = e.target.files;
                let file = files[0];
                self.blobToDataUrl(file, url => {
                    self.MapImgURL = url;
                })
            },
            openLegendFileDialog() {
                let self = this;
                self.$refs.LegendfileInput.value = null
                self.$refs.LegendfileInput.click();
            },
            onLegendImageChange(e) {
                let self = this;
                const files = e.target.files;
                let file = files[0];
                self.blobToDataUrl(file, url => {
                    self.legendImgURL = url;
                })
            },
            blobToDataUrl(blob, callback) {
                var a = new FileReader();
                a.onload = function () {
                    callback(a.result);
                }
                a.readAsDataURL(blob);
            },
        }
    }
</script>