<template>
    <v-dialog v-model="dialog" persistent width="800">
        <v-card>
            <v-toolbar color="primary" dense dark>
                <v-toolbar-title>
                    Image Maint
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="dialog=false">
                    <v-icon>close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-container grid-list-md>
                <v-layout row wrap>
                    <v-flex md6>
                        <v-card height="200" width="200">
                            <v-img @click="selectImage" :src="imageSrc == '' ? tmpImageURL : imageSrc" aspect-ratio="1"
                                class="grey lighten-2" width="100%" max-height="200" max-width="200"
                                style="cursor: pointer;"></v-img>
                        </v-card>
                    </v-flex>
                    <v-flex>
                        <v-text-field label="Name" v-model="name"></v-text-field>
                    </v-flex>
                </v-layout>
            </v-container>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" @click="dialog=false">cancel</v-btn>
                <v-btn color="primary" @click="save"> save</v-btn>
            </v-card-actions>
        </v-card>
        <input @change="onFileChange" type="file" style="display: none;" ref="fileInput">
        <Spinner ref="Spinner"></Spinner>

    </v-dialog>
</template>
<script>
    import axios from "axios"
    import Spinner from '@/components/Common/Spinner';

    export default {
        components: {
            Spinner
        },
        data() {
            return {
                dialog: false,
                callback: null,
                name: null,
                folder: null,
                file: null,
                ID: null,
                parentID: null,
                imageSrc: '',
                tmpImageURL: 'https://www.okcballet.org/wp-content/uploads/2016/09/placeholder-image.png',

            }
        },
        methods: {
            save() {
                let self = this
                self.$refs.Spinner.show()
                axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                let req = {
                    parent_ID: self.parentID,
                    id: self.ID,
                    name: self.name,
                    folder: self.name,
                    file: self.name
                }
                axios.post(process.env.VUE_APP_API + `FloorplanMedia/save`, req).then(r => {
                    if (r.data != null) {
                        axios.post(process.env.VUE_APP_API + `FloorplanMedia/Image?ImageID=${r.data.id}`, self
                            .file).then(resp => {
                            console.log(resp);
                            self.$refs.Spinner.hide()
                            self.callback()
                            self.dialog = false
                        })
                    }
                })

            },
            open(ID, parent_ID, callback) {
                let self = this
                self.dialog = true
                self.ID = ID
                self.parentID = parent_ID
                self.callback = callback
            },
            selectImage() {
                let self = this;
                self.$refs.fileInput.value = null
                self.$refs.fileInput.click();
            },
            onFileChange(e) {
                let self = this;

                const files = e.target.files;
                let file = files[0];
                self.file = file;
                blobToDataUrl(file, dataUrl => {
                    self.imageSrc = dataUrl
                })
            },
        },


    }

    function blobToDataUrl(blob, callback) {
        var a = new FileReader();

        a.onload = function () {
            callback(a.result);
        }

        a.readAsDataURL(blob);
    }
</script>