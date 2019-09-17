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
                        <v-checkbox label="heatmap" hide-details> </v-checkbox>
                        <v-text-field label="radius" number hide-details></v-text-field>
                    </v-flex>
                    <v-flex md4>
                        <v-checkbox label="Pie Charts" hide-details> </v-checkbox>

                    </v-flex>
                    <v-flex md4> </v-flex>
                    <v-flex md4>
                        <v-card height="500px">
                            <v-toolbar flat dark dense color="primary">HeatMap Fields </v-toolbar>
                            <v-card-text>
                                <v-checkbox hide-details v-for="(item,idx) in heatmapItems" :key="idx"
                                    :label="item.text+' - '+item.cluster" :value="item.text"
                                    v-model="selectedHeatmapField" ></v-checkbox>
                            </v-card-text>
                        </v-card>
                    </v-flex>
                    <v-flex md4>
                        <v-card height="500px">
                            <v-toolbar flat dark dense color="primary">Piechart Fields </v-toolbar>
                        </v-card>
                    </v-flex>
                    <v-flex md4> </v-flex>
                </v-layout>
            </v-container>
            <v-card-actions>
                <v-spacer> </v-spacer>
                <v-btn color="primary"> submit </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
    export default {
        data() {
            return {
                dialog: false,
                callback: null,
                heatmapItems: [],
                selectedHeatmapField: null
            }
        },
        methods: {
            open(setupData, callback) {
                let self = this
                self.dialog = true
                self.callback = callback
                self.heatmapItems = setupData

                console.log("MapDatra", setupData);

            },
            close() {
                let self = this
                self.callback()
            }
        }
    }
</script>