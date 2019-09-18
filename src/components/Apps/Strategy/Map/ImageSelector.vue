<template>
    <v-card>
        <v-toolbar dark dense flat color="primary">
            <v-toolbar-title>Display</v-toolbar-title>
        </v-toolbar>
        <v-card-text class="pt-0" style="height: 500px; overflow: auto;">
            <v-radio-group v-model="current">
                <v-radio value="none" label="None"></v-radio>
                <v-radio value="upload" label="Upload"></v-radio>
                <v-radio value="link" label="Link"></v-radio>
            </v-radio-group>
            <v-card flat v-show="current == 'upload'">
                <v-img @click="openFileDialog" :src="imgURL == '' ? tmpImageURL : imgURL" aspect-ratio="1" class="grey lighten-2" width="100%" max-height="200" style="cursor: pointer;"></v-img>
            </v-card>
            <v-card flat v-show="current == 'link'">
                <v-text-field v-model="imageLinkAddress" label="Link Address:"></v-text-field>
                <v-img :src="imageLinkAddress == '' ? tmpImageURL : imageLinkAddress" aspect-ratio="1" class="grey lighten-2" width="100%" max-height="200"></v-img>
            </v-card>
        </v-card-text>
        <input type="file" style="display: none;" ref="fileInput" @change="onImageChange">
    </v-card>
</template>

<script>
    export default {
        name: 'ImageSelector',
        data() {
            return {
                current: 'none',
                tmpImageURL: 'https://www.okcballet.org/wp-content/uploads/2016/09/placeholder-image.png',
                imgURL: '',
                imageLinkAddress: ''
            }
        },
        methods: {
            openFileDialog() {
                let self = this;
                self.$refs.fileInput.value = null
                self.$refs.fileInput.click();
            },
            onImageChange(e) {
                let self = this;
                const files = e.target.files;
                let file = files[0];
                self.blobToDataUrl(file, url => {
                    self.imgURL = url;
                })
            },
            blobToDataUrl(blob, callback) {
                var a = new FileReader();
                a.onload = function () {
                    callback(a.result);
                }
                a.readAsDataURL(blob);
            },
            returnData() {
                let self = this;

                return {
                    imageType: self.current,
                    imgURL: self.imgURL,
                    imageLinkAddress: self.imageLinkAddress
                }
            }
        }
    }
</script>