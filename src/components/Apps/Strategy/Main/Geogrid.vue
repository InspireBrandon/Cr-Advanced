<template>
    <v-card>
        <v-card-text>
            <h1>MARLTON Market Share</h1>
            <v-btn @click="getGeoGrid">get grid data</v-btn>
            <v-container fluid grid-list-md class="pa-0">
                <v-layout row wrap>
                    <v-flex md11>
                        <table style="width: calc(100% - 17px)">
                            <thead>
                                <tr>
                                    <th style="width: 100px;">Location</th>
                                    <th style="width: 100px;">Retailer Share</th>
                                    <th style="width: 100px;">Retailer Value</th>
                                    <th style="width: 100px;">Supplier Share</th>
                                    <th style="width: 100px;">Supplier Value</th>
                                    <th style="width: 100px;">Heat</th>
                                </tr>
                            </thead>
                        </table>
                        <div style="width: 100%; height: calc(100vh - 330px); overflow: auto;">
                            <table style="width: 100%">
                                <tbody>
                                    <tr v-for="(item, idx) in items" :key="idx">
                                        <td style="width: 100px;">{{ item.location }}</td>
                                        <td style="width: 100px;">{{ item.retailerShare }}</td>
                                        <td style="width: 100px;">{{ item.retailerValue }}</td>
                                        <td style="width: 100px;">{{ item.supplierShare }}</td>
                                        <td style="width: 100px;">{{ item.supplierValue }}</td>
                                        <td style="width: 100px;"
                                            :style="{ 'background': heatLegend[item.heat].color }">
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </v-flex>
                    <v-flex md1>
                        <div style="padding: 2px; border: 1px solid;">
                            <v-card style="font-size: 18px;" class="px-2" flat tile>Legend</v-card>
                            <div>
                                <v-card class="px-2 py-2" style="font-size: 18px;" tile flat :color="item.color"
                                    v-for="(item, idx) in heatLegend" :key="idx">{{ item.text }}</v-card>
                            </div>
                        </div>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-card-text>
    </v-card>
</template>

<script>
    import Axios from 'axios'
    export default {
        props: ["geoGridData"],
        data() {
            return {
                items: [{
                    location: "A1",
                    retailerShare: "5%",
                    supplierShare: "95%",
                    supplierValue: "R200 000",
                    heat: 0,
                }, {
                    location: "A1",
                    retailerShare: "5%",
                    supplierShare: "95%",
                    supplierValue: "R200 000",
                    heat: 0,
                }, {
                    location: "A1",
                    retailerShare: "5%",
                    supplierShare: "95%",
                    supplierValue: "R200 000",
                    heat: 1,
                }, {
                    location: "A1",
                    retailerShare: "5%",
                    supplierShare: "95%",
                    supplierValue: "R200 000",
                    heat: 1,
                }, {
                    location: "A1",
                    retailerShare: "5%",
                    supplierShare: "95%",
                    supplierValue: "R200 000",
                    heat: 2,
                }, {
                    location: "A1",
                    retailerShare: "5%",
                    supplierShare: "95%",
                    supplierValue: "R200 000",
                    heat: 2,
                }],
                heatLegend: [{
                    text: "High",
                    color: "#4caf50"
                }, {
                    text: "Medium",
                    color: "#ff9800"
                }, {
                    text: "Low",
                    color: "#f44336"
                }]
            }
        },
        methods: {
            getGeoGrid() {
                let self = this
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + `SuplierLocationImportTX/GeoReport`).then(r => {
                    console.log(r);
                })
            },
        },
        mounted() {
            let self = this;

            for (var prop in self.geoGridData) {
                let gridPoint = prop;

                let arr = self.geoGridData[prop];
                console.log(arr)
                let salesValue = 0;

                arr.forEach(element => {
                    salesValue += element.totalSales;
                });

                self.items.push({
                    location: gridPoint,
                    retailerShare: "5%",
                    retailerValue: "R" + salesValue,
                    supplierShare: "95%",
                    supplierValue: "R200 000",
                    heat: 0,
                })
            }
        },
    }
</script>

<style scoped>
    table {
        border-collapse: collapse;
    }

    table,
    td,
    th {
        border: 1px solid gray;
    }

    td {
        background: white;
        color: black;
    }

    th {
        text-align: left;
        background: black;
        color: white;
        padding: 2px;
        border: 1px solid gray;
    }
</style>