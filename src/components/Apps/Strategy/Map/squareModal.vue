<template>
    <v-dialog v-model="dialog" persistent max-height="600" width="800">
        <v-toolbar color="primary" dark>
            <v-toolbar-title v-if="squareitem!=null">
                Square :{{checkAlphaNumber(squareitem.squareDetails.name)}}
            </v-toolbar-title>
            <v-spacer>
            </v-spacer>
            <v-btn icon @click="dialog=false">
                <v-icon>close</v-icon>
            </v-btn>
        </v-toolbar>
        <v-card height="400px" style="overflow: auto;">
            <v-container>
                <v-list v-if="storeReport!=null">
                    <div v-if="storeReport!=null" v-for="(item,idx) in storeReport" :key="idx">
                        <v-list-tile>
                            <div v-if="item.retailerName==null"> unassinged</div>
                            <div v-if="item.retailerName!=null">  {{item.retailerName}} </div>
                          
                            <v-spacer></v-spacer>
                            <v-list-tile-action>
                                Stores : {{item.stores}}
                            </v-list-tile-action>
                        </v-list-tile>
                        <v-divider></v-divider>
                    </div>
                </v-list>

            </v-container>
        </v-card>
    </v-dialog>
</template>
<script>
    import Axios from 'axios'
    export default {
        data() {
            return {
                dialog: false,
                squareitem: null,
                marketShareOBj: null,
                storeReport: null,
                alpharray: [{
                        text: "A",
                        rangeStart: 0,
                        rangeEnd: 10
                    },
                    {
                        text: "B",
                        rangeStart: 10,
                        rangeEnd: 20
                    },
                    {
                        text: "C",
                        rangeStart: 20,
                        rangeEnd: 30
                    },
                    {
                        text: "D",
                        rangeStart: 30,
                        rangeEnd: 40
                    },
                    {
                        text: "E",
                        rangeStart: 40,
                        rangeEnd: 50
                    },
                    {
                        text: "F",
                        rangeStart: 50,
                        rangeEnd: 60
                    },
                    {
                        text: "G",
                        rangeStart: 60,
                        rangeEnd: 70
                    },
                    {
                        text: "H",
                        rangeStart: 70,
                        rangeEnd: 80
                    },
                    {
                        text: "I",
                        rangeStart: 80,
                        rangeEnd: 90
                    },
                    {
                        text: "J",
                        rangeStart: 90,
                        rangeEnd: 100
                    },
                    {
                        text: "K",
                        rangeStart: 100,
                        rangeEnd: 110
                    }
                ],
            }
        },
        methods: {
            open(square, marketShareOBj) {
                let self = this
                self.squareitem = null;

                self.squareitem = square
                self.marketShareOBj = null
                self.marketShareOBj = marketShareOBj
                self.getSquareReport(callback => {
                    self.dialog = true;
                })
                console.log("marketShareOBj", marketShareOBj);

            },
            getSquareReport(callback) {
                let self = this
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API +
                        `SuplierLocationImportTX/getSquareReport?square_ID=${self.squareitem.squareDetails.id}&importHeader_ID=${self.marketShareOBj.id}&periodTo=${self.marketShareOBj.periodTo}&periodFrom=${self.marketShareOBj.periodFrom}`
                    )
                    .then(r => {
                        console.log(r.data);
                        self.storeReport = r.data.retailers
                        callback()
                    })
            },
            checkAlphaNumber(blockNumber) {
                console.log("blockNumber",blockNumber);
                
                let self = this;

                var found = self.alpharray.find(el => {
                    return el.rangeStart <= blockNumber && el.rangeEnd > blockNumber;
                });

                let number = blockNumber - found.rangeStart + 1;

                return found.text + number;
            }
        }
    }
</script>