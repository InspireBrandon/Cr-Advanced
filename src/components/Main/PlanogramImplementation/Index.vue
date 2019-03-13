<template>
    <v-card>
        <!-- <v-toolbar>
        </v-toolbar> -->
        <v-container grid-list-md>
            <v-layout row wrap>
                <v-flex lg3 md4 sm12 xs12>
                    Categories
                    <v-autocomplete :items="planograms" solo light></v-autocomplete>
                </v-flex>
                <!-- <v-flex lg3 md4 sm12 xs12>
                    Category Cluster
                    <v-autocomplete :items="categoryClusters" solo light></v-autocomplete>
                </v-flex> -->
                <v-flex lg9 md8 sm12 xs12></v-flex>
                <v-flex lg6 md4 sm12 xs12 class="mt-4">
                    <v-card>
                        <v-toolbar dense>Planograms</v-toolbar>
                        <v-list light>
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
                <v-flex lg6 md8 sm12 xs12></v-flex>
                <v-flex lg3 md4 sm12 xs12 @click="openImage" class="mt-4">
                    <v-card light>
                        <v-toolbar dark dense>Planogram Image</v-toolbar>
                        <v-card-text>
                            <v-img :aspect-ratio="16/9" aspect src="https://www.repsly.com/hs-fs/hubfs/planogram.png?width=500&name=planogram.png"></v-img>
                        </v-card-text>
                    </v-card>
                </v-flex>
                <v-flex lg6 md4 sm12 xs12 class="mt-4">
                    <v-card>
                        <v-toolbar dense>Reports</v-toolbar>
                        <v-list light>
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
            <v-toolbar prominent>
                <v-spacer></v-spacer>
                <v-btn @click="imageModal = false" icon>
                    <v-icon>close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-card>
                <v-img src="https://www.repsly.com/hs-fs/hubfs/planogram.png?width=500&name=planogram.png"></v-img>
            </v-card>
        </v-dialog>
    </v-card>
</template>

<script>
    export default {
        data: () => {
            return {
                imageModal: false,
                planograms: [
                    'Hot Beverages',
                    'Hand Tools',
                    'Garden'
                ],
                categoryClusters: [
                    'AAA',
                    'BBB',
                    'CCC'
                ]
            }
        },
        methods: {
            goToReport(reportName) {
                alert("Go to " + reportName + " report");
            },
            openImage() {
                this.imageModal = true;
            }
        }
    }
</script>