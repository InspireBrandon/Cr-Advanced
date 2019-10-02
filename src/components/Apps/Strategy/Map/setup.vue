<template>
    <v-dialog v-model="dialog" persistent width="1300px">
        <v-card>
            <v-toolbar dark color="primary">
                <v-toolbar-title>Map Setup </v-toolbar-title>
                <v-spacer> </v-spacer>
                <v-btn icon @click="dialog=false">
                    <v-icon> close </v-icon>
                </v-btn>
            </v-toolbar>
            <v-container grid-list-md>
                <v-layout row wrap>
                    <v-flex md3>
                        <v-checkbox label="Heatmap" hide-details v-model="useHeatmap"> </v-checkbox>
                        <v-text-field label="radius" type="number" v-if="useHeatmap" hide-details
                            v-model="heatMapRadius"></v-text-field>
                    </v-flex>
                    <v-flex md3>
                        <v-checkbox label="Pie Charts" hide-details v-model="usePiecharts"> </v-checkbox>
                    </v-flex>
                    <v-flex md3>
                        <v-checkbox label="Size Map" hide-details v-model="useSizeMap"></v-checkbox>
                    </v-flex>
                    <v-flex md3></v-flex>
                    <v-flex md3>
                        <v-card>
                            <v-toolbar flat dark dense color="primary">HeatMap Fields</v-toolbar>
                            <v-card-text style="height: 500px; overflow: auto;">
                                <div>Store Turnover</div>
                                <v-checkbox class="mt-0 mb-3 ml-3" hide-details label="Store Turnover" value="Store Turnover" v-model="selectedHeatmapField"></v-checkbox>
                                <div>Baskets</div>
                                <v-checkbox class="mt-0" hide-details v-for="(item,idx) in heatmapItems" :key="idx"
                                    :label="item.text" :value="item.text" v-model="selectedHeatmapField"></v-checkbox>
                            </v-card-text>
                        </v-card>
                    </v-flex>
                    <v-flex md3>
                        <v-card>
                            <v-toolbar flat dark dense color="primary">Piechart Fields</v-toolbar>
                            <v-card-text style="height: 500px; overflow: auto;">
                                <div>Store Turnover</div>
                                <v-checkbox class="mt-0 mb-3 ml-3" hide-details label="Store Turnover" value="Store Turnover" v-model="selectedPiechartItems"></v-checkbox>
                                <div>Baskets</div>
                                <v-checkbox class="mt-0 ml-3" hide-details v-for="(item,idx) in piechartItems" :key="idx"
                                    :label="item.text" :value="item.text" v-model="selectedPiechartItems"></v-checkbox>
                            </v-card-text>
                        </v-card>
                    </v-flex>
                    <v-flex md3>
                        <v-card>
                            <v-toolbar flat dark dense color="primary">Size Map</v-toolbar>
                            <v-card-text style="height: 500px; overflow: auto;">
                                <div>Store Turnover</div>
                                <v-checkbox class="mt-0 mb-3 ml-3" hide-details label="Store Turnover" value="Store Turnover" v-model="selectedSizeMapField"></v-checkbox>
                                <div>Baskets</div>
                                <v-checkbox class="mt-0 ml-3" hide-details v-for="(item,idx) in piechartItems" :key="idx"
                                    :label="item.text" :value="item.text" v-model="selectedSizeMapField"></v-checkbox>
                            </v-card-text>
                        </v-card>
                    </v-flex>
                    <v-flex md3>
                        <v-card>
                            <v-toolbar flat dark dense color="primary">Store Locations</v-toolbar>
                            <v-card-text style="height: 500px; overflow: auto;">
                                <div>Retailers</div>
                                <v-checkbox class="mt-0 ml-3" hide-details v-for="(item,idx) in supplierData" :key="idx"
                                    :label="item.retailer" :value="item.retailer" v-model="selectedRetailers">
                                </v-checkbox>
                            </v-card-text>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-container>
            <v-card-actions>
                <v-spacer> </v-spacer>
                <v-btn color="primary" @click="close"> submit </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
    import ImageSelector from './ImageSelector'
    import jwt from 'jsonwebtoken'
    import Axios from 'axios'

    export default {
        components: {
            ImageSelector
        },
        data() {
            return {
                dialog: false,
                callback: null,
                heatMapRadius: 15,
                usePiecharts: false,
                useHeatmap: false,
                useSizeMap: false,
                selectedPiechartItems: [],
                selectedHeatmapField: [],
                selectedSizeMapField: [],
                selectedRetailers: [],
                piechartItems: [],
                heatmapItems: [],
                SystemUser_ID: -1,
                supplierData: [],
            }
        },
        methods: {
            open(setupData, callback) {
                let self = this
                self.dialog = true
                let tmp = []
                self.callback = callback;

                let encoded_details = jwt.decode(sessionStorage.accessToken);
                self.SystemUser_ID = encoded_details.USER_ID;

                self.getUserFile(callback => {
                    self.getFileData(callback.id, data => {
                        let arr = data.supplierImport["MARLTONS"].data;

                        let distinctRetailers = removeDuplicates(arr, 'retailer');
                        let distinctRetailerData = {};

                        // distinctRetailers.forEach(retailer => {
                        //     distinctRetailerData[retailer.retailer] = arr.filter(el => {
                        //         return el.retailer == retailer.retailer;
                        //     });
                        // });

                        // console.log("distinctRetailerData", distinctRetailerData);
                        self.supplierData = distinctRetailers
                    })
                })

                setupData.forEach(element => {
                    if (element.cluster == "basket") {
                        tmp.push(element)
                    }
                });
                self.heatmapItems = tmp
                self.piechartItems = tmp
                console.log("MapDatra", setupData);
            },
            close() {
                let self = this

                let imageDetails = {
                    imageType: "none",
                    imgURL: null,
                    imageLinkAddress: null
                }

                let item = {
                    heatMapRadius: self.heatMapRadius,
                    usePiecharts: self.usePiecharts,
                    useHeatmap: self.useHeatmap,
                    selectedPiechartItems: self.selectedPiechartItems,
                    selectedHeatmapField: self.selectedHeatmapField,
                    imageDetails: imageDetails,
                    selectedRetailers: self.selectedRetailers
                }

                self.dialog = false
                self.callback(item)

            },
            getUserFile(callback) {
                let self = this;

                Axios.get(process.env.VUE_APP_API +
                        `SystemFile/JSON?db=CR-Devinspire&folder=SUPPLIER MARKET SHARE IMPORT/${self.SystemUser_ID}&file=REPORT`
                    )
                    .then(r => {
                        callback(r.data);
                    })
            },
            getFileData(id, callback) {
                let self = this;
                Axios.get(process.env.VUE_APP_API + `SystemFile/JSON?db=CR-Devinspire&id=${id}`)
                    .then(r => {
                        callback(r.data);
                    })
            },
        }
    }

    function removeDuplicates(myArr, prop) {
        return myArr.filter((obj, pos, arr) => {
            return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
        });
    }
</script>