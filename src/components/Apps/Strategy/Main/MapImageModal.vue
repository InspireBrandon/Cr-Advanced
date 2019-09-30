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
                    v-model="selectedMap" hide-details @change="getImages">
                </v-select>
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
                            <img @click="openLegendFileDialog" :src="legendImgURL == '' ? legendImageURL : legendImgURL"
                                aspect-ratio="1" class="grey lighten-2" width="100%" max-height="200"
                                style="cursor: pointer;">
                        </v-flex>
                        <v-flex md4>
                            <img @click="openFileDialog" :src="MapImgURL == '' ? MapImageURL : MapImgURL"
                                aspect-ratio="1" class="grey lighten-2" width="100%" max-height="200"
                                style="cursor: pointer;">
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="saveNew()"> Save new </v-btn>
                <v-btn color="primary" @click="save" v-if="selectedMap!=null">Save </v-btn>
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
                legendImg: null,
                legendImageLinkAddress: '',
                MapImageURL: 'https://www.okcballet.org/wp-content/uploads/2016/09/placeholder-image.png',
                MapImgURL: '',
                MapImg: null,
                MapImageLinkAddress: '',
                maps: [],
                selectedMap: null,
                isAdd:true
            }
        },
        methods: {
            open(type,callback) {
                let self = this
                self.isAdd=type
               
                self.dialog = true
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + `MapImage`).then(r => {
                    console.log(r);
                    self.maps = []
                    r.data.forEach(e => {
                        self.maps.push({
                            text: e.name,
                            value: e.id
                        })
                    })
                })
                self.callback = callback
            },
            save() {
                let self = this
                let request = {
                    name: self.name,
                    id: self.selectedMap
                }
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.put(process.env.VUE_APP_API + `MapImage`, request).then(r => {
                    Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                    console.log(r);
                    Axios.post(process.env.VUE_APP_API + `MapImage?mapImageID=${self.selectedMap}&type=map`, self
                            .MapImg)
                        .then(
                            mapres => {
                                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                                Axios.post(process.env.VUE_APP_API +
                                    `MapImage?mapImageID=${self.selectedMap}&type=legend`,
                                    self.legendImg).then(legendRes => {

                                })
                            })
                })
                self.callback()
            },
            saveNew() {
                let self = this
                let request = {
                    name: self.name
                }
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.post(process.env.VUE_APP_API + `MapImage`, request).then(r => {
                    Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                    console.log(r);
                    Axios.post(process.env.VUE_APP_API + `MapImage?mapImageID=${r.data.id}&type=map`, self
                            .MapImg)
                        .then(
                            mapres => {
                                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                                Axios.post(process.env.VUE_APP_API +
                                    `MapImage?mapImageID=${r.data.id}&type=legend`,
                                    self.legendImg).then(legendRes => {

                                })
                            })
                })
                self.callback()
            },
            getImages() {
                let self = this
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                self.MapImgURL = process.env.VUE_APP_API + `MapImage?mapImageID=${self.selectedMap}&type=map`;
                self.legendImgURL = process.env.VUE_APP_API + `MapImage?mapImageID=${self.selectedMap}&type=legend`;

                // Axios.get(process.env.VUE_APP_API + `MapImage?mapImageID=${self.selectedMap}&type=map`)
                //     .then(r => {
                //         self.MapImgURL=r.data
                //         Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                //         console.log(r);
                //         Axios.get(process.env.VUE_APP_API + `MapImage?mapImageID=${self.selectedMap}&type=legend`)
                //             .then(res => {
                //                 console.log(res);
                //             })
                //     })

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
                self.MapImg = file;
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
                self.legendImg = file
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