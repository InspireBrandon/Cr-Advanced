<template>
    <v-card tile flat>
        <v-container grid-list-md>
            <v-layout row wrap>
                <v-flex md12>
                    <v-layout row wrap>
                        <v-flex md3 class="pa-0">
                            <v-card tile flat>
                                <v-layout row wrap>
                                    <v-flex md12 class="pa-0">
                                    </v-flex>
                                </v-layout>
                            </v-card>
                        </v-flex>
                        <v-flex md3 class="pa-0">
                            <v-card tile flat>
                                <v-layout row wrap style="margin-bottom: 0px;">
                                    <v-flex md12 class="pa-0">
                                        <v-card tile flat>
                                            <v-toolbar dark dense flat color="primary darken-3">
                                                <v-toolbar-title style="width: 100%">
                                                    <div style="width: 100%; text-align: center;">TM1 (Premium)</div>
                                                </v-toolbar-title>
                                            </v-toolbar>
                                        </v-card>
                                    </v-flex>
                                </v-layout>
                            </v-card>
                        </v-flex>
                        <v-flex md3 class="pa-0">
                            <v-card tile flat>
                                <v-layout row wrap style="margin-bottom: 0px;">
                                    <v-flex md12 class="pa-0">
                                        <v-card tile flat>
                                            <v-toolbar dark dense flat color="primary darken-2">
                                                <v-toolbar-title style="width: 100%;">
                                                    <div style="width: 100%; text-align: center;">TM2</div>
                                                </v-toolbar-title>
                                            </v-toolbar>
                                        </v-card>
                                    </v-flex>
                                </v-layout>
                            </v-card>
                        </v-flex>
                        <v-flex md3 class="pa-0">
                            <v-card tile flat>
                                <v-layout row wrap style="margin-bottom: 0px;">
                                    <v-flex md12 class="pa-0">
                                        <v-card tile flat>
                                            <v-toolbar dark dense flat color="primary">
                                                <v-toolbar-title style="width: 100%;">
                                                    <div style="width: 100%; text-align: center;">TM3 (Economy)</div>
                                                </v-toolbar-title>
                                            </v-toolbar>
                                        </v-card>
                                    </v-flex>
                                </v-layout>
                            </v-card>
                        </v-flex>
                        <v-flex md3 class="pa-0 pr-1">
                            <v-card tile flat>
                                <v-toolbar dense dark flat color="primary darken-3">
                                    <v-toolbar-title style="width: 100%;">
                                        <div style="width: 100%; text-align: center;">Model L</div>
                                    </v-toolbar-title>
                                </v-toolbar>
                                <v-card-text style="text-align: center">
                                    <div class="headline pt-4">{{ largePercent + '%' }}</div>
                                </v-card-text>
                            </v-card>
                        </v-flex>
                        <v-flex md3 class="pa-0 pr-1" v-for="i in 3" :key="i">
                            <v-card tile flat>
                                <div style="display: flex; text-align: center;">
                                    <div class="headline" style="height: 48px; width: 25%; padding-top: 10px;">
                                        {{ clusterValues[`ltm${i}v`] }}</div>
                                    <div style="height: 48px; width: 25%; padding-top: 25px; text-align: right;">
                                        {{ clusterValues[`ltm${i}p`] + '%' }}</div>
                                </div>
                                <v-layout row wrap style="margin-bottom: 0px;">
                                    <v-flex md6 class="pa-0">
                                        <v-card style="text-align: right;" flat color="grey lighten-2" tile>
                                            <div style="display: flex;">
                                                <div style="width: 70%;">DIY</div>
                                                <div style="width: 30%; padding-right: 5px;">0</div>
                                            </div>
                                        </v-card>
                                    </v-flex>
                                    <v-flex md6 class="pa-0">
                                        <v-card style="text-align: right;" flat color="blue lighten-4" tile>
                                            <div style="display: flex;">
                                                <div style="width: 70%;">Gauteng</div>
                                                <div style="width: 30%; padding-right: 5px;">0</div>
                                            </div>
                                        </v-card>
                                    </v-flex>
                                    <v-flex md6 class="pa-0">
                                        <v-card style="text-align: right;" flat color="grey lighten-2" tile>
                                            <div style="display: flex;">
                                                <div style="width: 70%;">Agri</div>
                                                <div style="width: 30%; padding-right: 5px;">0</div>
                                            </div>
                                        </v-card>
                                    </v-flex>
                                    <v-flex md6 class="pa-0">
                                        <v-card style="text-align: right;" flat color="blue lighten-4" tile>
                                            <div style="display: flex;">
                                                <div style="width: 70%;">North West</div>
                                                <div style="width: 30%; padding-right: 5px;">0</div>
                                            </div>
                                        </v-card>
                                    </v-flex>
                                    <v-flex md6 class="pa-0">
                                        <v-card style="text-align: right;" flat color="grey lighten-2" tile>
                                            <div style="display: flex;">
                                                <div style="width: 70%;">Livestock</div>
                                                <div style="width: 30%; padding-right: 5px;">0</div>
                                            </div>
                                        </v-card>
                                    </v-flex>
                                    <v-flex md6 class="pa-0">
                                        <v-card style="text-align: right;" flat color="blue lighten-4" tile>
                                            <div style="display: flex;">
                                                <div style="width: 70%;">Free State</div>
                                                <div style="width: 30%; padding-right: 5px;">0</div>
                                            </div>
                                        </v-card>
                                    </v-flex>
                                    <v-flex md6 class="pa-0">
                                        <v-card style="text-align: right;" flat color="orange lighten-4" tile>
                                            <div style="display: flex;">
                                                <div style="width: 70%;">LRG</div>
                                                <div style="width: 30%; padding-right: 5px;">0</div>
                                            </div>
                                        </v-card>
                                    </v-flex>
                                    <v-flex md6 class="pa-0">
                                        <v-card style="text-align: right;" flat color="blue lighten-4" tile>
                                            <div style="display: flex;">
                                                <div style="width: 70%;">Mpumalanga</div>
                                                <div style="width: 30%; padding-right: 5px;">0</div>
                                            </div>
                                        </v-card>
                                    </v-flex>
                                    <v-flex md6 class="pa-0">
                                        <v-card style="text-align: right;" flat color="orange lighten-4" tile>
                                            <div style="display: flex;">
                                                <div style="width: 70%;">MED</div>
                                                <div style="width: 30%; padding-right: 5px;">0</div>
                                            </div>
                                        </v-card>
                                    </v-flex>
                                    <v-flex md6 class="pa-0">
                                        <v-card style="text-align: right;" flat color="blue lighten-4" tile>
                                            <div style="display: flex;">
                                                <div style="width: 70%;">Northern Cape</div>
                                                <div style="width: 30%; padding-right: 5px;">0</div>
                                            </div>
                                        </v-card>
                                    </v-flex>
                                    <v-flex md6 class="pa-0">
                                        <v-card style="text-align: right;" flat color="orange lighten-4" tile>
                                            <div style="display: flex;">
                                                <div style="width: 70%;">SML</div>
                                                <div style="width: 30%; padding-right: 5px;">0</div>
                                            </div>
                                        </v-card>
                                    </v-flex>
                                    <v-flex md6 class="pa-0">
                                        <v-card style="text-align: right;" flat color="blue lighten-4" tile>
                                            <div style="display: flex;">
                                                <div style="width: 70%;">KZN</div>
                                                <div style="width: 30%; padding-right: 5px;">0</div>
                                            </div>
                                        </v-card>
                                    </v-flex>
                                </v-layout>
                            </v-card>
                        </v-flex>
                        <v-flex md3 class="pa-0 pr-1">
                            <v-card tile flat>
                                <v-toolbar dense dark flat color="primary darken-2">
                                    <v-toolbar-title style="width: 100%;">
                                        <div style="width: 100%; text-align: center;">Model M</div>
                                    </v-toolbar-title>
                                </v-toolbar>
                                <v-card-text style="text-align: center">
                                    <div class="headline pt-4">{{ mediumPercent + '%' }}</div>
                                </v-card-text>
                            </v-card>
                        </v-flex>
                        <v-flex md3 class="pa-0 pr-1" v-for="i in 3" :key="i">
                            <v-card tile flat>
                                <div style="display: flex; text-align: center;">
                                    <div class="headline" style="height: 48px; width: 25%; padding-top: 10px;">
                                        {{ clusterValues[`mtm${i}v`] }}</div>
                                    <div style="height: 48px; width: 25%; padding-top: 25px; text-align: right;">
                                        {{ clusterValues[`mtm${i}p`] + '%' }}</div>
                                </div>
                                <v-layout row wrap style="margin-bottom: 0px;">
                                    <v-flex md6 class="pa-0">
                                        <v-card style="text-align: right;" flat color="grey lighten-2" tile>
                                            <div style="display: flex;">
                                                <div style="width: 70%;">DIY</div>
                                                <div style="width: 30%; padding-right: 5px;">0</div>
                                            </div>
                                        </v-card>
                                    </v-flex>
                                    <v-flex md6 class="pa-0">
                                        <v-card style="text-align: right;" flat color="blue lighten-4" tile>
                                            <div style="display: flex;">
                                                <div style="width: 70%;">Gauteng</div>
                                                <div style="width: 30%; padding-right: 5px;">0</div>
                                            </div>
                                        </v-card>
                                    </v-flex>
                                    <v-flex md6 class="pa-0">
                                        <v-card style="text-align: right;" flat color="grey lighten-2" tile>
                                            <div style="display: flex;">
                                                <div style="width: 70%;">Agri</div>
                                                <div style="width: 30%; padding-right: 5px;">0</div>
                                            </div>
                                        </v-card>
                                    </v-flex>
                                    <v-flex md6 class="pa-0">
                                        <v-card style="text-align: right;" flat color="blue lighten-4" tile>
                                            <div style="display: flex;">
                                                <div style="width: 70%;">North West</div>
                                                <div style="width: 30%; padding-right: 5px;">0</div>
                                            </div>
                                        </v-card>
                                    </v-flex>
                                    <v-flex md6 class="pa-0">
                                        <v-card style="text-align: right;" flat color="grey lighten-2" tile>
                                            <div style="display: flex;">
                                                <div style="width: 70%;">Livestock</div>
                                                <div style="width: 30%; padding-right: 5px;">0</div>
                                            </div>
                                        </v-card>
                                    </v-flex>
                                    <v-flex md6 class="pa-0">
                                        <v-card style="text-align: right;" flat color="blue lighten-4" tile>
                                            <div style="display: flex;">
                                                <div style="width: 70%;">Free State</div>
                                                <div style="width: 30%; padding-right: 5px;">0</div>
                                            </div>
                                        </v-card>
                                    </v-flex>
                                    <v-flex md6 class="pa-0">
                                        <v-card style="text-align: right;" flat color="orange lighten-4" tile>
                                            <div style="display: flex;">
                                                <div style="width: 70%;">LRG</div>
                                                <div style="width: 30%; padding-right: 5px;">0</div>
                                            </div>
                                        </v-card>
                                    </v-flex>
                                    <v-flex md6 class="pa-0">
                                        <v-card style="text-align: right;" flat color="blue lighten-4" tile>
                                            <div style="display: flex;">
                                                <div style="width: 70%;">Mpumalanga</div>
                                                <div style="width: 30%; padding-right: 5px;">0</div>
                                            </div>
                                        </v-card>
                                    </v-flex>
                                    <v-flex md6 class="pa-0">
                                        <v-card style="text-align: right;" flat color="orange lighten-4" tile>
                                            <div style="display: flex;">
                                                <div style="width: 70%;">MED</div>
                                                <div style="width: 30%; padding-right: 5px;">0</div>
                                            </div>
                                        </v-card>
                                    </v-flex>
                                    <v-flex md6 class="pa-0">
                                        <v-card style="text-align: right;" flat color="blue lighten-4" tile>
                                            <div style="display: flex;">
                                                <div style="width: 70%;">Northern Cape</div>
                                                <div style="width: 30%; padding-right: 5px;">0</div>
                                            </div>
                                        </v-card>
                                    </v-flex>
                                    <v-flex md6 class="pa-0">
                                        <v-card style="text-align: right;" flat color="orange lighten-4" tile>
                                            <div style="display: flex;">
                                                <div style="width: 70%;">SML</div>
                                                <div style="width: 30%; padding-right: 5px;">0</div>
                                            </div>
                                        </v-card>
                                    </v-flex>
                                    <v-flex md6 class="pa-0">
                                        <v-card style="text-align: right;" flat color="blue lighten-4" tile>
                                            <div style="display: flex;">
                                                <div style="width: 70%;">KZN</div>
                                                <div style="width: 30%; padding-right: 5px;">0</div>
                                            </div>
                                        </v-card>
                                    </v-flex>
                                </v-layout>
                            </v-card>
                        </v-flex>
                        <v-flex md3 class="pa-0 pr-1">
                            <v-card tile flat>
                                <v-toolbar dense dark flat color="primary">
                                    <v-toolbar-title style="width: 100%;">
                                        <div style="width: 100%; text-align: center;">Model S</div>
                                    </v-toolbar-title>
                                </v-toolbar>
                                <v-card-text style="text-align: center">
                                    <div class="headline pt-4">{{ smallPercent + '%' }}</div>
                                </v-card-text>
                            </v-card>
                        </v-flex>
                        <v-flex md3 class="pa-0 pr-1" v-for="i in 3" :key="i">
                            <v-card tile flat>
                                <div style="display: flex; text-align: center;">
                                    <div class="headline" style="height: 48px; width: 25%; padding-top: 10px;">
                                        {{ clusterValues[`stm${i}v`] }}</div>
                                    <div style="height: 48px; width: 25%; padding-top: 25px; text-align: right;">
                                        {{ clusterValues[`stm${i}p`] + '%' }}</div>
                                </div>
                                <v-layout row wrap style="margin-bottom: 0px;">
                                    <v-flex md6 class="pa-0">
                                        <v-card style="text-align: right;" flat color="grey lighten-2" tile>
                                            <div style="display: flex;">
                                                <div style="width: 70%;">DIY</div>
                                                <div style="width: 30%; padding-right: 5px;">0</div>
                                            </div>
                                        </v-card>
                                    </v-flex>
                                    <v-flex md6 class="pa-0">
                                        <v-card style="text-align: right;" flat color="blue lighten-4" tile>
                                            <div style="display: flex;">
                                                <div style="width: 70%;">Gauteng</div>
                                                <div style="width: 30%; padding-right: 5px;">0</div>
                                            </div>
                                        </v-card>
                                    </v-flex>
                                    <v-flex md6 class="pa-0">
                                        <v-card style="text-align: right;" flat color="grey lighten-2" tile>
                                            <div style="display: flex;">
                                                <div style="width: 70%;">Agri</div>
                                                <div style="width: 30%; padding-right: 5px;">0</div>
                                            </div>
                                        </v-card>
                                    </v-flex>
                                    <v-flex md6 class="pa-0">
                                        <v-card style="text-align: right;" flat color="blue lighten-4" tile>
                                            <div style="display: flex;">
                                                <div style="width: 70%;">North West</div>
                                                <div style="width: 30%; padding-right: 5px;">0</div>
                                            </div>
                                        </v-card>
                                    </v-flex>
                                    <v-flex md6 class="pa-0">
                                        <v-card style="text-align: right;" flat color="grey lighten-2" tile>
                                            <div style="display: flex;">
                                                <div style="width: 70%;">Livestock</div>
                                                <div style="width: 30%; padding-right: 5px;">0</div>
                                            </div>
                                        </v-card>
                                    </v-flex>
                                    <v-flex md6 class="pa-0">
                                        <v-card style="text-align: right;" flat color="blue lighten-4" tile>
                                            <div style="display: flex;">
                                                <div style="width: 70%;">Free State</div>
                                                <div style="width: 30%; padding-right: 5px;">0</div>
                                            </div>
                                        </v-card>
                                    </v-flex>
                                    <v-flex md6 class="pa-0">
                                        <v-card style="text-align: right;" flat color="orange lighten-4" tile>
                                            <div style="display: flex;">
                                                <div style="width: 70%;">LRG</div>
                                                <div style="width: 30%; padding-right: 5px;">0</div>
                                            </div>
                                        </v-card>
                                    </v-flex>
                                    <v-flex md6 class="pa-0">
                                        <v-card style="text-align: right;" flat color="blue lighten-4" tile>
                                            <div style="display: flex;">
                                                <div style="width: 70%;">Mpumalanga</div>
                                                <div style="width: 30%; padding-right: 5px;">0</div>
                                            </div>
                                        </v-card>
                                    </v-flex>
                                    <v-flex md6 class="pa-0">
                                        <v-card style="text-align: right;" flat color="orange lighten-4" tile>
                                            <div style="display: flex;">
                                                <div style="width: 70%;">MED</div>
                                                <div style="width: 30%; padding-right: 5px;">0</div>
                                            </div>
                                        </v-card>
                                    </v-flex>
                                    <v-flex md6 class="pa-0">
                                        <v-card style="text-align: right;" flat color="blue lighten-4" tile>
                                            <div style="display: flex;">
                                                <div style="width: 70%;">Northern Cape</div>
                                                <div style="width: 30%; padding-right: 5px;">0</div>
                                            </div>
                                        </v-card>
                                    </v-flex>
                                    <v-flex md6 class="pa-0">
                                        <v-card style="text-align: right;" flat color="orange lighten-4" tile>
                                            <div style="display: flex;">
                                                <div style="width: 70%;">SML</div>
                                                <div style="width: 30%; padding-right: 5px;">0</div>
                                            </div>
                                        </v-card>
                                    </v-flex>
                                    <v-flex md6 class="pa-0">
                                        <v-card style="text-align: right;" flat color="blue lighten-4" tile>
                                            <div style="display: flex;">
                                                <div style="width: 70%;">KZN</div>
                                                <div style="width: 30%; padding-right: 5px;">0</div>
                                            </div>
                                        </v-card>
                                    </v-flex>
                                </v-layout>
                            </v-card>
                        </v-flex>
                        <v-flex md3 class="pa-0 pr-1">
                            <div class="headline">Number of stores: 59</div>
                        </v-flex>
                        <v-flex md3 class="pa-0 pr-1">
                            <div style="display: flex; text-align: center;">
                                <div class="headline" style="height: 48px; width: 25%; padding-top: 10px;">0</div>
                                <div style="height: 48px; width: 25%; padding-top: 25px; text-align: right;">0%</div>
                            </div>
                        </v-flex>
                        <v-flex md3 class="pa-0 pr-1">
                            <div style="display: flex; text-align: center;">
                                <div class="headline" style="height: 48px; width: 25%; padding-top: 10px;">0</div>
                                <div style="height: 48px; width: 25%; padding-top: 25px; text-align: right;">0%</div>
                            </div>
                        </v-flex>
                        <v-flex md3 class="pa-0 pr-1">
                            <div style="display: flex; text-align: center;">
                                <div class="headline" style="height: 48px; width: 25%; padding-top: 10px;">0</div>
                                <div style="height: 48px; width: 25%; padding-top: 25px; text-align: right;">0%</div>
                            </div>
                        </v-flex>
                    </v-layout>
                </v-flex>
            </v-layout>
        </v-container>
    </v-card>
</template>

<script>
    export default {
        props: ['fileData'],
        data() {
            return {
                largePercent: 0,
                mediumPercent: 0,
                smallPercent: 0,
                clusterValues: {
                    ltm1v: 0,
                    ltm1p: 0,
                    ltm2v: 0,
                    ltm2p: 0,
                    ltm3v: 0,
                    ltm3p: 0,
                    mtm1v: 0,
                    mtm1p: 0,
                    mtm2v: 0,
                    mtm2p: 0,
                    mtm3v: 0,
                    mtm3p: 0,
                    stm1v: 0,
                    stm1p: 0,
                    stm2v: 0,
                    stm2p: 0,
                    stm3v: 0,
                    stm3p: 0,
                }
            }
        },
        mounted() {
            let self = this;
            self.setGrid();
        },
        methods: {
            setGrid() {
                let self = this;

                console.log(self.fileData)

                let storeClusterData = self.fileData;
                let totalStores = storeClusterData.length;

                let larges = storeClusterData.filter(e => {
                    return e.userDefinedCluster == "L";
                })

                let mediums = storeClusterData.filter(e => {
                    return e.userDefinedCluster == "M";
                })

                let smalls = storeClusterData.filter(e => {
                    return e.userDefinedCluster == "S";
                })

                self.largePercent = ((larges.length / totalStores) * 100).toFixed(0);
                self.mediumPercent = ((mediums.length / totalStores) * 100).toFixed(0);
                self.smallPercent = ((smalls.length / totalStores) * 100).toFixed(0);

                // LARGE

                let ltm1 = storeClusterData.filter(e => {
                    return e.userDefinedCluster == "L" && e.basket_Chad == "TM1";
                })

                self.clusterValues.ltm1v = ltm1.length;
                self.clusterValues.ltm1p = ((ltm1.length / totalStores) * 100).toFixed(0);

                let ltm2 = storeClusterData.filter(e => {
                    return e.userDefinedCluster == "L" && e.basket_Chad == "TM2";
                })

                self.clusterValues.ltm2v = ltm2.length;
                self.clusterValues.ltm2p = ((ltm2.length / totalStores) * 100).toFixed(0);

                let ltm3 = storeClusterData.filter(e => {
                    return e.userDefinedCluster == "L" && e.basket_Chad == "TM3";
                })

                self.clusterValues.ltm3v = ltm3.length;
                self.clusterValues.ltm3p = ((ltm3.length / totalStores) * 100).toFixed(0);

                // MEDIUM

                let mtm1 = storeClusterData.filter(e => {
                    return e.userDefinedCluster == "M" && e.basket_Chad == "TM1";
                })

                self.clusterValues.mtm1v = mtm1.length;
                self.clusterValues.mtm1p = ((mtm1.length / totalStores) * 100).toFixed(0);

                let mtm2 = storeClusterData.filter(e => {
                    return e.userDefinedCluster == "M" && e.basket_Chad == "TM2";
                })

                self.clusterValues.mtm2v = mtm2.length;
                self.clusterValues.mtm2p = ((mtm2.length / totalStores) * 100).toFixed(0);

                let mtm3 = storeClusterData.filter(e => {
                    return e.userDefinedCluster == "M" && e.basket_Chad == "TM3";
                })

                self.clusterValues.mtm3v = mtm3.length;
                self.clusterValues.mtm3p = ((mtm3.length / totalStores) * 100).toFixed(0);

                // SMALL

                let stm1 = storeClusterData.filter(e => {
                    return e.userDefinedCluster == "S" && e.basket_Chad == "TM1";
                })

                self.clusterValues.stm1v = stm1.length;
                self.clusterValues.stm1p = ((stm1.length / totalStores) * 100).toFixed(0);

                let stm2 = storeClusterData.filter(e => {
                    return e.userDefinedCluster == "S" && e.basket_Chad == "TM2";
                })

                self.clusterValues.stm2v = stm2.length;
                self.clusterValues.stm2p = ((stm2.length / totalStores) * 100).toFixed(0);

                let stm3 = storeClusterData.filter(e => {
                    return e.userDefinedCluster == "S" && e.basket_Chad == "TM3";
                })

                self.clusterValues.stm3v = stm3.length;
                self.clusterValues.stm3p = ((stm3.length / totalStores) * 100).toFixed(0);
            }
        }
    }
</script>