<template>
    <v-dialog v-model="dialog" persistent width="800px">
        <v-card>
            <v-toolbar dark flat color="primary">
                <v-toolbar-title>
                    Retailers
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="close">
                    <v-icon>close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-toolbar dark flat>
                <v-spacer></v-spacer>
                <v-btn @click="addRetailer" color="grey darken-3">Add</v-btn>
            </v-toolbar>
            <v-card-text class="pa-2" style="height: 400px; overflow: auto;">
                <v-list dense hover>
                    <template v-for="(retailer, idx) in retailers">
                        <v-list-tile avatar :key="idx">
                            <v-list-tile-avatar tile>
                                <v-img v-if="showImages" @click="openFileDialog(retailer.id)"
                                    :src="retailerImage(retailer.id)" :lazy-src="retailerImage(retailer.id)"
                                    aspect-ratio="1" contain></v-img>
                            </v-list-tile-avatar>
                            <v-list-tile-content>
                                <v-list-tile-title> {{ retailer.name }}</v-list-tile-title>
                            </v-list-tile-content>
                            <v-spacer></v-spacer>
                            <v-list-tile-action>
                                <v-btn @click="modifyRetailerStores(retailer)" flat color="primary" icon>
                                    <v-icon>edit</v-icon>
                                </v-btn>
                            </v-list-tile-action>
                        </v-list-tile>
                        <v-divider :key="idx + 'd'"></v-divider>
                    </template>
                </v-list>
            </v-card-text>
            <input type="file" style="display: none;" ref="IconInput" @change="onIconImageChange">
            <RetailerStore ref="RetailerStore" />
            <Prompt ref="Prompt" />
        </v-card>
    </v-dialog>

</template>
<script>
    import Axios from 'axios'
    import RetailerStore from './RetailerStore/Index'
    import Prompt from '@/components/Common/Prompt'

    export default {
        data() {
            return {
                showImages: true,
                dialog: false,
                callback: null,
                selected: null,
                retailers: [],
                currentRetailer: null
            }
        },
        components: {
            RetailerStore,
            Prompt
        },
        methods: {
            retailerImage(retailerID) {
                let self = this;

                return process.env.VUE_APP_API + `Retailer/Image?retailerID=${retailerID}`
            },
            update() {
                let self = this
                self.openFileDialog()
            },
            getRetailers() {
                let self = this

                self.retailers = [];

                Axios.get(process.env.VUE_APP_API + "Retailer")
                    .then(r => {
                        self.retailers = r.data.retailerList;
                    })
            },
            modifyRetailerStores(retailer) {
                let self = this;

                self.$refs.RetailerStore.open(retailer, newRetailer => {

                });
            },
            open(callback) {
                let self = this
                self.getRetailers();
                self.callback = callback
                self.dialog = true
            },
            addRetailer() {
                let self = this;

                self.$refs.Prompt.show("", "Retailer Name", "Name", name => {
                    if (name == "") {
                        alert("Please specify a name for the retailer.");
                    } else {
                        Axios.post(process.env.VUE_APP_API + "Retailer", {
                                name: name
                            })
                            .then(r => {
                                self.getRetailers();
                            })
                            .catch(e => {
                                console.error(e);
                            })
                    }
                })
            },
            close() {
                let self = this
                self.dialog = false
                self.callback()
            },
            openFileDialog(retailerID) {
                let self = this;
                self.currentRetailer = retailerID;
                self.$refs.IconInput.value = null
                self.$refs.IconInput.click();
            },
            onIconImageChange(e) {
                let self = this;
                const files = e.target.files;
                let file = files[0];
                self.uploadImage(file);
            },
            uploadImage(image) {
                let self = this;

                Axios.post(process.env.VUE_APP_API + `Retailer/Image?retailerID=${self.currentRetailer}`, image)
                    .then(r => {
                        self.showImages = false;
                        setTimeout(() => {
                            self.showImages = true;
                        }, 60);
                    })
            }
        }
    }
</script>