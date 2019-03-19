<template>
    <v-card>
        <!-- <v-toolbar>
        </v-toolbar> -->
        <v-container grid-list-md>
            <v-layout row wrap>
                <v-flex lg3 md4 sm12 xs12>
                    Store
                    <v-autocomplete placeholder="Please select a store..." @change="getPlanogramsByStore" v-model="selectedStore"
                        :items="storesDropdown" solo light></v-autocomplete>
                </v-flex>
                <!-- <v-flex lg3 md4 sm12 xs12>
                    Category Cluster
                    <v-autocomplete :items="categoryClusters" solo light></v-autocomplete>
                </v-flex> -->
                <v-flex lg9 md8 sm12 xs12></v-flex>
                <v-flex v-if="selectedStore != null && planogramsList.length == 0" lg9 md4 sm12 xs12>
                    No planograms found for selected store
                </v-flex>
                <v-flex v-if="selectedStore != null && planogramsList.length > 0" lg9 md4 sm12 xs12>
                    <v-card>
                        <v-toolbar dark flat dense>Planograms</v-toolbar>
                        <v-list light dense>
                            <template v-for="(planogram, index) in planogramsList">
                                <v-list-tile style="background: lightgrey;" v-if="selectedPlanogram == planogram" :key="index"
                                    @click="selectPlanogram(planogram)">
                                    <v-list-tile-title>{{ planogram.name }}</v-list-tile-title>
                                </v-list-tile>
                                <v-list-tile v-else :key="index" @click="selectPlanogram(planogram)">
                                    <v-list-tile-title>{{ planogram.name }}</v-list-tile-title>
                                </v-list-tile>
                                <v-divider :key="'d' + index"></v-divider>
                            </template>
                        </v-list>
                    </v-card>
                </v-flex>
                <v-flex lg3 md4 sm12 xs12></v-flex>
                <v-flex v-if="selectedPlanogram != null" lg3 md4 sm12 xs12 @click="openImage">
                    <v-card light>
                        <v-toolbar dark flat dense>
                            Planogram Image
                            <v-spacer></v-spacer>
                            <v-tooltip bottom>
                                <v-btn icon slot="activator" @click="downloadImage">
                                    <v-icon>save_alt</v-icon>
                                </v-btn>
                                <span>downoad planogram image</span>
                            </v-tooltip>
                        </v-toolbar>
                        <v-card-text>
                            <v-img style="max-width: 200px; max-height: 200px;" :src="image"></v-img>
                        </v-card-text>
                    </v-card>
                </v-flex>
                <v-flex v-if="selectedPlanogram != null" lg6 md4 sm12 xs12>
                    <v-card>
                        <v-toolbar dark flat dense>Reports</v-toolbar>
                        <v-list light dense>
                            <v-list-tile @click="goToReport('Product')">
                                <v-list-tile-title>Product Report</v-list-tile-title>
                            </v-list-tile>
                            <v-divider></v-divider>
                            <v-list-tile @click="goToReport('Fixture')">
                                <v-list-tile-title>Fixture Report</v-list-tile-title>
                            </v-list-tile>
                            <v-divider></v-divider>
                            <v-list-tile @click="goToReport('Product Fixture')">
                                <v-list-tile-title>Product Fixture Report</v-list-tile-title>
                            </v-list-tile>
                            <v-divider></v-divider>
                        </v-list>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
        <v-dialog fullscreen v-model="imageModal">
            <v-card>
                <v-toolbar prominent>
                    <v-spacer></v-spacer>
                    <v-btn @click="imageModal = false" icon>
                        <v-icon>close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card flat style="padding: 5px;">
                    <img style="max-height: calc(100vh - 80px); max-width: 1000px;" :src="image">
                </v-card>
            </v-card>
        </v-dialog>
    </v-card>
</template>

<script>
    import Axios from 'axios';

    export default {
        data: () => {
            return {
                imageModal: false,
                stores: [],
                storesDropdown: [],
                selectedStore: null,
                planograms: [],
                planogramsList: [],
                selectedPlanogram: null,
                image: 'https://picsum.photos/200/300/?random'
            }
        },
        created() {
            let self = this;
            self.getStores();
        },
        methods: {
            goToReport(reportName) {
                alert("Go to " + reportName + " report");
            },
            openImage() {
                this.imageModal = true;
            },
            getStores() {
                let self = this;

                Axios.get(process.env.VUE_APP_API + 'Store?db=CR-DEVINSPIRE')
                    .then(r => {
                        self.stores = r.data;

                        r.data.forEach(element => {

                            self.storesDropdown.push({
                                text: element.storeName,
                                value: element.storeID
                            })
                        });

                        self.getPlanograms();
                    })
            },
            getPlanograms() {
                let self = this;

                Axios.get(process.env.VUE_APP_API + 'SystemFile/JSON?db=CR-DEVINSPIRE&folder=SPACE PLANNING')
                    .then(r => {
                        self.planograms = r.data;
                    })
            },
            getPlanogramsByStore() {
                let self = this;

                self.selectedPlanogram = null;

                self.$nextTick(() => {
                    let cluster = "";

                    self.stores.forEach(store => {
                        if (store.storeID == self.selectedStore) {
                            cluster = store.storeClusterName;
                        }
                    })

                    let tmpPlanograms = [];

                    self.planograms.forEach(planogram => {
                        if (planogram.name.includes(cluster)) {
                            tmpPlanograms.push(planogram);
                        }
                    })

                    self.planogramsList = tmpPlanograms;
                })
            },
            selectPlanogram(planogram) {
                let self = this;

                self.selectedPlanogram = planogram;

                Axios.get(process.env.VUE_APP_API + 'SystemFile/JSON?db=CR-DEVINSPIRE&id=' + planogram.id)
                    .then(r => {
                        console.log(r.data)
                        self.image = r.data.image;
                    })
            },
            downloadImage() {
                let self = this;
            }
        }
    }
</script>

<style>
    .selected-planogram {
        background: 'black';
    }
</style>