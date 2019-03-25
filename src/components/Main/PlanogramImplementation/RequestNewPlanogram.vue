<template>
    <v-card>
        <v-toolbar dark color="primary">
            Request {{toolTitle}}
        </v-toolbar>
        <v-card-text style="text-align: center;">
            <v-container grid-list-md>
                <v-layout row wrap>
                    <v-flex lg6 md6 sm12 xs12>
                        <v-autocomplete placeholder="Please select a category..." @change="CategoryChange" v-model="selectedCategory"
                            :items="categoryDropdown" solo light></v-autocomplete>
                    </v-flex>
                    <v-flex lg12 md12 sm12 xs12>
                        <h3>Image</h3>
                        <v-card class="elevation-5" @click="openFileExplorer" style="width: 150px; height: 150px; background: white; cursor: pointer; margin: 0 auto;">
                            <img ref="changeImage" style="max-height: 150px; max-width: 150px;" src="" alt="">
                        </v-card>
                        <input ref="fileInput" style="display: none" @change="imageChange" type="file">
                    </v-flex>
                    <v-container class="pa-0" grid-list-md>
                        <v-layout row wrap>
                            <v-flex xs4>
                                <v-text-field v-model="form.height" type="number" suffix="M" hide-details label="Height"></v-text-field>
                            </v-flex>
                            <v-flex xs4>
                                <v-text-field v-model="form.width" type="number" suffix="M" hide-details label="Width"></v-text-field>
                            </v-flex>
                            <v-flex xs4></v-flex>
                            <v-flex xs4>
                                <v-text-field v-model="form.modules" type="number" hide-details label="Modules"></v-text-field>
                            </v-flex>
                            <v-flex xs4>
                                <v-text-field v-model="form.displays" type="number" hide-details label="Displays"></v-text-field>
                            </v-flex>
                            <v-flex xs4>
                                <v-text-field v-model="form.pallettes" type="number" hide-details label="Pallettes"></v-text-field>
                            </v-flex>
                            <v-flex xs4>
                                <v-text-field v-model="form.supplierStands" type="number" hide-details label="Supplier Stands"></v-text-field>
                            </v-flex>
                            <v-flex xs4>
                                <v-text-field v-model="form.bins" type="number" hide-details label="Bins"></v-text-field>
                            </v-flex>
                            <v-flex lg12 md12 sm12 xs12>
                                <v-textarea label="Additional Notes" auto-grow v-model="form.notes">
                                </v-textarea>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-layout>
            </v-container>
        </v-card-text>
        <v-card-actions style="text-align: right; display: block;">
            <v-spacer></v-spacer>
            <v-btn color="error" @click.native="$router.go(-1)">Cancel</v-btn>
            <v-btn color="primary" @click.native="submit">submit</v-btn>
        </v-card-actions>
    </v-card>
</template>
<script>
    import Axios from "axios"
    export default {
        data() {
            return {
                toolTitle: null,
                form: {
                    notes: null,
                    height: null,
                    bins: null,
                    supplierStands: null,
                    pallettes: null,
                    displays: null,
                    modules: null,
                    width: null,
                    image: null,
                },
                categoryDropdown: [],
                selectedCategory: null,
                isNew: null,

            }
        },
        created() {
            let self = this
            this.getPlanograms()

            let tmp = self.$route.params.IsNew
            if (tmp != "null") {
                Axios.get(process.env.VUE_APP_API + 'SystemFile/JSON?db=CR-DEVINSPIRE&id=' + tmp)
                    .then(r => {
                        console.log("inside");
                        console.log(r.data)
                        self.form.height = r.data.dimensionData.height
                        self.form.bins = r.data.dimensionData.bins
                        self.form.supplierStands = r.data.dimensionData.supplierStands
                        self.form.pallettes = r.data.dimensionData.pallettes
                        self.form.displays = r.data.dimensionData.displays
                        self.form.modules = r.data.dimensionData.modules
                        self.form.width = r.data.dimensionData.width
                        self.form.image = r.data.image
                        self.$refs.changeImage.src = r.data.image
                    })
                self.isNew = false
                self.toolTitle = "Planogram Variation"
            } else {
                self.isNew = true
                self.toolTitle = "New Planogram"
            }
        },

        methods: {
            imageChange(e) {
                let self = this;
                const files = e.target.files;
                let file = files[0];
                self.blobToDataUrl(file, url => {
                    let splitUrl = url.split(',', 2);
                    let imageString = splitUrl[1];
                    self.$refs.changeImage.src = url;
                    self.form.image = imageString;
                })
            },
            changeImage() {},
            openFileExplorer() {
                let self = this;
                self.$refs.fileInput.value = null
                self.$refs.fileInput.click();
            },
            CategoryChange() {

            },
            getPlanograms() {
                let self = this
                Axios.get(process.env.VUE_APP_API + "PlanogramActiveShopCode").then(r => {
                    console.log(r.data)
                    r.data.planogramActiveList.forEach(element => {
                        self.categoryDropdown.push({
                            text: element.displayname,
                            value: element.planogram_ID
                        })
                    });


                })
            },
            submit() {
                let self = this

                if (self.isNew == false) {
                    
                    let request = {
                        systemFile_ID: self.$route.params.IsNew,
                        status: 3,
                        transactionDateTime: new Date(),
                        notes: self.form.notes
                    }
                    Axios.post(process.env.VUE_APP_API + `SystemFileApproval?db=CR-DEVINSPIRE`, request).then(r => {
                    }).catch(e => {
                        console.log(e);
                    })

                }
                if (self.isNew == true) {
                    alert("create request saved")
                }

            },
            blobToDataUrl(blob, callback) {
                var a = new FileReader();
                a.onload = function (e) {
                    callback(a.result);
                }
                a.readAsDataURL(blob);
            },
            blobToArrayBuffer(blob, callback) {
                var a = new FileReader();
                a.onload = function (e) {
                    callback(a.result);
                }
                a.re(blob);
            },


        }
    }
</script>