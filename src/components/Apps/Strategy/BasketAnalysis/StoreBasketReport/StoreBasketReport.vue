<template>
    <v-dialog v-model="dialog" fullscreen="" persistent>
        <v-card>
            <v-toolbar color="primary" dark flat>
                <v-toolbar-title>Store Basket Report - {{ basketName }}</v-toolbar-title>
                <v-btn @click="saveFile()"> save report </v-btn>
                <v-spacer></v-spacer>
                <v-btn icon @click="dialog=false">
                    <v-icon>close</v-icon>
                </v-btn>
            </v-toolbar>
            <Grid ref="grid" :data="Data" />
            <DateRangeSelector ref="DateRangeSelector" />
            <Spinner ref="Spinner" />

        </v-card>
        <SystemFileSelector ref="SystemFileSelector" />
    </v-dialog>
</template>

<script>
    import SystemFileSelector from "@/components/Common/SystemFileSelector";
    import Spinner from "@/components/Common/Spinner";
    import DateRangeSelector from "@/components/Common/DateRangeSelector"

    import Grid from './Grid.vue'
    import Axios from 'axios'

    export default {
        components: {
            DateRangeSelector,
            SystemFileSelector,
            Spinner,
            Grid
        },
        data() {
            return {
                dialog: false,
                basketName: "",
                Data: [],
                basket_ID: null,
                PeriodFrom: null,
                PeriodTo: null,
            }
        },
        methods: {
            saveData() {
                let self = this
                Axios.post(process.env.VUE_APP_API + "SystemFile/JSON?db=CR-Devinspire", {
                        SystemFile: {
                            SystemUser_ID: -1,
                            Folder: "CLUSTERING-BASKETS-REPORT",
                            Name: self.basketName + " " + self.PeriodFrom + " - " + self.PeriodTo,
                            Extension: '.json',
                        },
                        Data: self.Data
                    })
                    .then(r => {
                        console.log(r);
                        alert("Successfully Saved")
                    })
                    .catch(e => {
                        alert("Failed to save")
                    })
            },
            getReport(basket_ID, callback) {
                let self = this
                self.$refs.DateRangeSelector.show(dateCall => {
                    self.$refs.Spinner.show()
                    self.PeriodFrom = dateCall.dateFromString
                    self.PeriodTo = dateCall.dateToString
                    Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                    Axios.get(process.env.VUE_APP_API +
                            `StoreBasketReport?basket_ID=${basket_ID}&PeriodFrom=${dateCall.dateFrom}&PeriodTo=${dateCall.dateTo}`
                        )
                        .then(r => {
                            self.Data = r.data
                            console.log(self.Data);
                            self.$refs.Spinner.hide()

                            callback(r.data)
                        }).catch(e => {
                            self.$refs.Spinner.hide()
                            alert("failed to load report data")
                        })

                })


            },
            getFile(id, comeback) {
                let self = this
                console.log("getFile");

                Axios.get(process.env.VUE_APP_API + `SystemFile/JSON?db=CR-Devinspire&id=${id}`).then(
                    resp => {
                        console.log(resp);
                        self.Data = resp.data
                        comeback()
                    })
            },
            show(basketName, basket_ID, isNew) {
                let self = this;
                self.basket_ID = basket_ID
                self.basketName = basketName;
                if (isNew) {
                    self.getReport(basket_ID, callback => {
                        self.dialog = true;
                        self.$refs.grid.resize();
                    })
                } else {
                    self.$refs.SystemFileSelector.show("CLUSTERING-BASKETS-REPORT", selectorCallback => {
                        console.log("CLUSTERING-BASKETS-REPORT");
                        self.getFile(selectorCallback, comeback => {
                            self.dialog = true;
                            self.$refs.grid.resize();
                        })
                    })
                }
            },
            // start region save to main file
            getFile(callback) {
                let self = this;

                Axios.get(process.env.VUE_APP_API +
                        `SystemFile/JSON?db=CR-Devinspire&folder=CLUSTER REPORT&file=REPORT`)
                    .then(r => {
                        callback(r.data);
                    })
            },
            saveFile() {
                let self = this;
                console.log("SAve fiel");

                self.getFile(fileTransaction => {
                    console.log(fileTransaction);

                    if (fileTransaction == null || fileTransaction == false) {
                        let tmp = {
                            basket: {}
                        }

                        tmp.basket[self.basketName] = self.Data;

                        self.appendAndSaveFile(tmp);
                    } else {
                        self.getFileData(fileTransaction.id, fileData => {
                            let tmp = fileData;
                            console.log("tmp");
                            console.log(tmp);
                            if (tmp == false) {
                                tmp = {
                                    basket: {}
                                }
                            }
                            if (tmp.basket == undefined)
                                tmp.basket = {};

                            tmp.basket[self.basketName] = self.Data;

                            self.appendAndSaveFile(tmp);
                        })
                    }
                })
            },
            getFileData(id, callback) {
                let self = this;
                Axios.get(process.env.VUE_APP_API + `SystemFile/JSON?db=CR-Devinspire&id=${id}`)
                    .then(r => {
                        callback(r.data);
                    })
            },
            appendAndSaveFile(fileData) {
                alert("in here")
                Axios.post(process.env.VUE_APP_API + "SystemFile/JSON?db=CR-Devinspire", {
                        SystemFile: {
                            SystemUser_ID: -1,
                            Folder: "CLUSTER REPORT",
                            Name: "REPORT",
                            Extension: '.json'
                        },
                        Data: fileData
                            
                        
                    })
                    .then(r => {
                        alert("Successfully saved");
                    })
                    .catch(e => {
                        alert("Failed to save");
                    })
            },
        }
    }
</script>