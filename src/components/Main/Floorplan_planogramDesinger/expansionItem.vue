<template>
    <div>
        <v-expansion-panel v-model="expansion">
            <v-expansion-panel-content>
                <div :class="{ 'highlighted': selectedFixtures == Drop  }" slot="header">{{Drop.id}}-{{Drop.name}}</div>
                <v-card color="grey lighten-1">
                    <v-container grid-list-md>
                        <v-layout row wrap>
                            <v-flex md10>
                                <v-select :items="shapes" v-model="Drop.shape" @change="changeDrop">
                                </v-select>
                            </v-flex>
                            <v-flex md2>
                                <!-- <v-btn icon color="primary" @click="saveImages">
                                    <v-icon>
                                        save
                                    </v-icon>
                                </v-btn> -->
                            </v-flex>
                            <v-flex md12>
                                <v-text-field v-if="Drop.shape=='Square'" @change="changeRotation(Drop,rotation)"
                                    type="number" label="Rotation" v-model="Drop.rotation" hide-details>
                                </v-text-field>
                            </v-flex>
                            <!-- <v-flex md6>
                                <h4 style="text-decoration: underline;"> Top</h4>
                                <v-card width="100" height="100" @click="openFileDialog('Top')">
                                    <img style="width: 100%;height:100%"
                                        :src="imgURL.TopImg  == null ? tmpImageURL : imgURL.TopImg"
                                        alt="no image found">
                                </v-card>
                            </v-flex>
                            <v-flex md6>
                                <h4 style="text-decoration: underline;"> Front</h4>
                                <v-card width="100" height="100" @click="openFileDialog('Front')">
                                    <img style="width: 100%;height:100%"
                                        :src="imgURL.FrontImg  == null ? tmpImageURL : imgURL.FrontImg"
                                        alt="no image found">
                                </v-card>
                            </v-flex>
                            <v-flex md6>
                                <h4 style="text-decoration: underline;"> Side</h4>
                                <v-card width="100" height="100" @click="openFileDialog('Side')">
                                    <img style="width: 100%;height:100%"
                                        :src="imgURL.SideImg  == null ? tmpImageURL : imgURL.SideImg"
                                        alt="no image found">
                                </v-card>
                            </v-flex>
                            <v-flex md6>
                                <h4 style="text-decoration: underline;"> Back</h4>
                                <v-card width="100" height="100" @click="openFileDialog('Back')">
                                    <img style="width: 100%;height:100%"
                                        :src="imgURL.BackImg  == null ? tmpImageURL : imgURL.BackImg"
                                        alt="no image found">
                                </v-card>
                            </v-flex> -->
                        </v-layout>
                    </v-container>
                </v-card>
            </v-expansion-panel-content>
        </v-expansion-panel>
        <input type="file" style="display: none;" ref="fileInput" @change="onImageChange">
    </div>
</template>
<script>
    import axios from "axios"
    export default {
        props: ["Drop", "reDraw", "selectedFixtures", "changeRotation"],
        data() {
            return {
                tmpImageURL: 'https://www.okcballet.org/wp-content/uploads/2016/09/placeholder-image.png',
                expansion: [true],
                shapes: ["Circle", "Square"],
                imageClicked: null,
                imgURL: {
                    TopImg: null,
                    Top: null,
                    SideImg: null,
                    Side: null,
                    FrontImg: null,
                    Front: null,
                    BackImg: null,
                    Back: null,
                },
                rotation: 0,

            }
        },
        mounted() {
            this.getImages()
            this.checkDrop()
        },
        methods: {
            checkDrop() {
                let self = this
                if (self.Drop.shape == null || self.Drop.shape == undefined) {
                    self.Drop.shape = "Square"
                }
            },
            changeDrop() {
                let self = this
                self.$nextTick(() => {
                    console.log("[CHANGEdROP]", self.Drop.id);

                    self.reDraw(self.Drop)
                })
            },
            log() {
                let self = this
                console.log(self.imgURL);

            },
            getImages() {
                let self = this
                self.imgURL.TopImg = self.imageSrc(self.Drop.id, "Top")
                self.imgURL.SideImg = self.imageSrc(self.Drop.id, "Side")
                self.imgURL.FrontImg = self.imageSrc(self.Drop.id, "Front")
                self.imgURL.BackImg = self.imageSrc(self.Drop.id, "Back")
            },
            saveImages() {
                let self = this
                axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                axios.post(process.env.VUE_APP_API + `FloorPlan_Fixtures/UploadImages?imageID=${self.Drop.id}&type=Top`,
                        self
                        .imgURL.Top)
                    .then(Topr => {
                        axios.post(process.env.VUE_APP_API +
                                `FloorPlan_Fixtures/UploadImages?imageID=${self.Drop.id}&type=Side`,
                                self
                                .imgURL.Side)
                            .then(Sider => {
                                axios.post(process.env.VUE_APP_API +
                                        `FloorPlan_Fixtures/UploadImages?imageID=${self.Drop.id}&type=Front`,
                                        self
                                        .imgURL.Front)
                                    .then(Frontr => {
                                        axios.post(process.env.VUE_APP_API +
                                                `FloorPlan_Fixtures/UploadImages?imageID=${self.Drop.id}&type=Back`,
                                                self
                                                .imgURL.Back)
                                            .then(Backr => {

                                            })
                                    })
                            })

                    })

            },
            imageSrc(imgID, type) {
                let self = this;
                return process.env.VUE_APP_API + `FloorplanFixture?mapImageID=${imgID}&type=${type}`
            },
            openFileDialog(image) {
                let self = this;
                self.imageClicked = image
                self.$refs.fileInput.value = null
                self.$refs.fileInput.click();
            },
            onImageChange(e) {
                let self = this;
                const files = e.target.files;
                let file = files[0];
                self.imgURL[self.imageClicked] = file
                self.blobToDataUrl(file, url => {
                    self.imgURL[self.imageClicked + "Img"] = url;
                })
            },
            blobToDataUrl(blob, callback) {
                var a = new FileReader();
                a.onload = function () {
                    callback(a.result);
                }
                a.readAsDataURL(blob);
            },
        },
    }
</script>