<template>
    <v-dialog width="800" persistent v-model="dialog">
        <v-card>
            <v-toolbar color="primary" dark dense>
                <v-toolbar-title>
                    Floor Configuration
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="dialog=false">
                    <v-icon>close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-container grid-list-md>
                <v-layout row wrap>
                    <v-flex md6>
                        Floor texture
                        <v-card max-width="300" @click="openMedia">
                            <v-img :src="imageSrc() == '' ? tmpImageURL : imageSrc()" aspect-ratio="1"
                                class="grey lighten-2" width="100%" height="200" max-width="300"
                                style="cursor: pointer;"></v-img>
                        </v-card>
                    </v-flex>
                    <v-flex md6>
                        <v-text-field type="number" v-model="floorConfig.blockRatio" label="Block Width (meters)">
                        </v-text-field>
                        <v-text-field type="number" v-model="floorConfig.floorWidth" label="Floor Width (meters)">
                        </v-text-field>
                        <v-text-field type="number" v-model="floorConfig.floorHeight" label="Floor Height (meters)">
                        </v-text-field>
                        <!-- <v-checkbox v-model="floorConfig.repeat" label="repeat image"></v-checkbox> -->
                    </v-flex>
                </v-layout>

            </v-container>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color='error' @click="dialog=false">cancel</v-btn>
                <v-btn color='primary' @click="submit">submit</v-btn>
            </v-card-actions>
        </v-card>
        <FloorPlanMediaModal ref="FloorPlanMediaModal" />
    </v-dialog>
</template>
<script>
import FloorPlanMediaModal from "./FloorPlanMediaModal"
    export default {
        components:{
            FloorPlanMediaModal
        },
        data() {
            return {
                dialog: false,
                callback: null,
                floorConfig: {
                    blockRatio: 1,
                    floorHeight: null,
                    floorWidth: null,
                    floorImageID:null,
                    repeat:false
                },
                tmpImageURL: 'https://www.okcballet.org/wp-content/uploads/2016/09/placeholder-image.png',
            }
        },
        methods: {
            openMedia(){
                let self = this
                self.$refs.FloorPlanMediaModal.open(true, media => {
                    self.floorConfig.floorImageID=media.id
                })

            },
            imageSrc() {
                let self = this
                return process.env.VUE_APP_API +
                    `FloorplanMedia/Image?ImageID=${self.floorConfig.floorImageID}&databaseID=${sessionStorage.currentDatabase}`
            },
            open(config, callback) {
                let self = this
                console.log(config);
                self.floorConfig.blockRatio = config.blockRatio
                self.floorConfig.floorHeight = config.floorHeight
                self.floorConfig.floorWidth = config.floorWidth
                self.callback = callback
                self.dialog = true
            },
            submit() {
                let self = this
                self.callback(self.floorConfig)
                self.dialog = false
            }
        }
    }
</script>