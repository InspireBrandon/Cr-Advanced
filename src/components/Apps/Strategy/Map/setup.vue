<template>
    <v-dialog v-model="dialog" persistent width="1000px">
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
                    <v-flex md4>
                        <v-checkbox label="heatmap" hide-details v-model="useHeatmap"> </v-checkbox>
                        <v-text-field label="radius" type="number" v-if="useHeatmap" hide-details
                            v-model="heatMapRadius"></v-text-field>
                    </v-flex>
                    <v-flex md4>
                        <v-checkbox label="Pie Charts" hide-details v-model="usePiecharts"> </v-checkbox>

                    </v-flex>
                    <v-flex md4> </v-flex>
                    <v-flex md4>
                        <v-card>
                            <v-toolbar flat dark dense color="primary">HeatMap Fields </v-toolbar>
                            <v-card-text style="height: 500px; overflow: auto;">
                                <v-checkbox hide-details v-for="(item,idx) in heatmapItems" :key="idx"
                                    :label="item.text+' - '+item.cluster" :value="item.text"
                                    v-model="selectedHeatmapField"></v-checkbox>
                            </v-card-text>
                        </v-card>
                    </v-flex>
                    <v-flex md4>
                        <v-card>
                            <v-toolbar flat dark dense color="primary">Piechart Fields </v-toolbar>
                            <v-card-text style="height: 500px; overflow: auto;">
                                <v-checkbox  hide-details v-for="(item,idx) in piechartItems"  :key="idx"
                                    :label="item.text+' - '+item.cluster" :value="item.text"
                                    v-model="selectedPiechartItems"></v-checkbox>
                            </v-card-text>
                        </v-card>
                    </v-flex>
                    <v-flex md4>
                        <ImageSelector ref="ImageSelector" />
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

    export default {
        components: {ImageSelector},
        data() {
            return {
                dialog: false,
                callback: null,
                heatMapRadius: 0,
                usePiecharts: false,
                useHeatmap: false,
                selectedPiechartItems: [],
                selectedHeatmapField: null,
                piechartItems: [],
                heatmapItems: []
            }
        },
        methods: {
            open(setupData, callback) {
                let self = this
                self.dialog = true
                self.callback = callback
                self.heatmapItems = setupData
                setupData.forEach(element => {
                    if (element.cluster == "basket") {
                        self.piechartItems.push(element)
                    }
                });
                console.log("MapDatra", setupData);

            },
            close() {
                let self = this

                let imageDetails = self.$refs.ImageSelector.returnData();

                let item = {
                    heatMapRadius: self.heatMapRadius,
                    usePiecharts: self.usePiecharts,
                    useHeatmap: self.useHeatmap,
                    selectedPiechartItems: self.selectedPiechartItems,
                    selectedHeatmapField: self.selectedHeatmapField,
                    imageDetails:imageDetails
                }
                self.dialog = false
                self.callback(item)

            }
        }
    }
</script>