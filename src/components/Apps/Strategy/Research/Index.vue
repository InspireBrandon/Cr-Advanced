<template>
    <v-card tile>
        <v-toolbar flat dense dark color="grey darken-3">
            <v-toolbar-items>
                <v-menu dark offset-y style="margin-bottom: 10px;">
                    <v-btn slot="activator" flat>
                        File
                    </v-btn>
                    <v-list>
                        <v-list-tile @click="openFileDialog">
                            <v-list-tile-title>New</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile @click="openFile">
                            <v-list-tile-title>Open</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile :disabled="rowData.length == 0" @click="prompt">
                            <v-list-tile-title>Save</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile :disabled="rowData.length == 0" @click="close">
                            <v-list-tile-title>Close</v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu>
            </v-toolbar-items>
            <v-spacer></v-spacer>
            <div></div>
            <v-spacer></v-spacer>
            <v-toolbar-title>
                <span>Supplier Import</span>
            </v-toolbar-title>
        </v-toolbar>
        <v-toolbar dark flat>
        </v-toolbar>
        <Grid :rowData="rowData" :headers="headers" ref="Grid" />

        <input @change="onFileChange" accept=".csv" ref="fileInput" style="display: none" type="file">
        <Prompt ref="Prompt" />
        <YesNoModal ref="YesNoModal" />
        <FileDataSelector ref="FileDataSelector" />
    </v-card>
</template>

<script>
    import Axios from 'axios';
    import Grid from './Grid'
    import Prompt from '@/components/Common/Prompt'
    import YesNoModal from '@/components/Common/YesNoModal'
    import FileDataSelector from './FileDataSelector'

    export default {
        components: {
            Grid,
            Prompt,
            YesNoModal,
            FileDataSelector
        },
        data() {
            return {
                rowData: [],
                headers: [{
                    "headerName": "Retailer",
                    "field": "retailer",
                }, {
                    "headerName": "Store",
                    "field": "storeName",
                }, {
                    "headerName": "Sales",
                    "field": "salesRetail",
                }, {
                    "headerName": "X Coordinate",
                    "field": "x",
                    "editable": true
                }, {
                    "headerName": "Y Coordinate",
                    "field": "y",
                    "editable": true
                }],
                runData: [],
                fileData: []
            }
        },
        created() {
            let self = this;
            self.getFile(data => {
                if (data != null && data != false) {
                    self.getFileData(data.id, fileData => {
                        console.log("FILEDATA", fileData);

                        if (!Array.isArray(fileData.supplierImport)) {
                            self.runData = [];

                            self.fileData = fileData.supplierImport;

                            for (var prop in fileData.supplierImport) {
                                self.runData.push({
                                    prop: prop
                                })
                            }
                        }
                    })
                }
            })
        },
        methods: {
            generateNameParams(selectedBasket, selectedPeriod) {
                let self = this;

                if (selectedPeriod.periodic) {
                    return `${selectedBasket.description} - ${selectedPeriod.monthsBetween} MMA (${selectedPeriod.dateFromString} TO ${selectedPeriod.dateToString})`;
                } else {
                    return `${selectedBasket.description} Average Monthly ${selectedPeriod.dateFromString} TO ${selectedPeriod.dateToString}`;
                }
            },
            close() {
                let self = this
                self.rowData = []
            },
            openFileDialog() {
                let self = this;
                self.$refs.fileInput.value = null;
                self.$refs.fileInput.click();
            },
            onFileChange(e) {
                let self = this;

                self.$nextTick(() => {
                    const files = e.target.files;
                    let file = files[0];
                    let reader = new FileReader();

                    reader.onload = function (e) {
                        let data = csvToDataObject(e.currentTarget.result);
                        console.log(data);

                        let newArr = [];

                        data.data.forEach(el => {
                            newArr.push(new customImportItem({
                                retailer: el.Retailer,
                                storeName: el.Store,
                                salesRetail: el.Sales,
                                x: el.X,
                                y: el.Y
                            }))
                        });

                        // self.headers = convertToGridHeaders(data.headers);
                        self.rowData = newArr;
                    }

                    reader.readAsText(file);
                })
            },
            getFile(callback) {
                let self = this;

                Axios.get(process.env.VUE_APP_API +
                        `SystemFile/JSON?db=CR-Devinspire&folder=CLUSTER REPORT&file=REPORT`)
                    .then(r => {
                        callback(r.data);
                    })
            },
            prompt() {
                let self = this;
                let canPass = false;

                self.$refs.Prompt.show("", "Name this import", "Name", name => {
                    if (name == "") {
                        setTimeout(() => {
                            alert("Please enter a name")
                            self.prompt();
                        }, 60);
                    } else {
                        if (self.fileData != undefined) {
                            if (self.fileData.supplierImport != undefined && self.fileData.supplierImport !=
                                null) {
                                for (var prop in self.fileData.supplierImport) {
                                    if (prop == name) {
                                        setTimeout(() => {
                                            self.$refs.YesNoModal.show(
                                                "This name already exists. Would you like to overwrite it?",
                                                value => {
                                                    if (value) {
                                                        canPass = true;
                                                    } else {
                                                        self.prompt();
                                                    }
                                                })
                                        }, 60);
                                    } else {
                                        canPass = true;
                                    }
                                }
                            } else {
                                canPass = true;
                            }
                        } else {
                            canPass = true;
                        }
                    }

                    if (canPass) {
                        // saveFile
                        self.saveFile(name)
                    }
                })
            },
            saveFile(name) {
                let self = this;

                self.getFile(fileTransaction => {

                    let levelValues = [];

                    if (fileTransaction == null || fileTransaction == false) {
                        let tmp = {
                            supplierImport: {}
                        }

                        tmp.supplierImport[name] = {
                            data: self.rowData
                        };

                        self.appendAndSaveFile(tmp);
                    } else {
                        self.getFileData(fileTransaction.id, fileData => {
                            let tmp = fileData;

                            if (tmp == false) {
                                tmp = {
                                    supplierImport: {}
                                }
                            }

                            if (tmp.supplierImport == undefined)
                                tmp.supplierImport = {};

                            if (Array.isArray(tmp.supplierImport))
                                tmp.supplierImport = {};



                            tmp.supplierImport[name] = {
                                data: self.rowData
                            };

                            self.appendAndSaveFile(tmp);
                        })
                    }
                })
            },
            getFile(callback) {
                let self = this;

                Axios.get(process.env.VUE_APP_API +
                        `SystemFile/JSON?db=CR-Devinspire&folder=CLUSTER REPORT&file=REPORT`)
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
            appendAndSaveFile(fileData) {
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
                        self.fileData = fileData.basket;
                        alert("Successfully saved");
                    })
                    .catch(e => {
                        alert("Failed to save");
                    })
            },
            openFile() {
                let self = this;

                self.$refs.FileDataSelector.show(self.runData, fileData => {
                    self.showingSaved = true;
                    let reader = self.fileData[fileData.prop];
                    // self.selectedBasket = reader.config.selectedBasket;
                    // self.selectedPeriod = reader.config.selectedPeriod;

                    // if (reader.config.turnoverGroups != undefined && reader.config.turnoverGroups != null) {
                    //     let tg = reader.config.turnoverGroups;
                    //     let tgv = reader.config.turnoverGroupUserValues;
                    //     let updateUser = reader.config.updateUser;

                    //     self.selectedLevel = tg.length - 1;
                    //     self.updateUser = (updateUser == undefined || updateUser == null) ? false : updateUser;

                    //     for (var i = 0; i < tg.length; i++) {
                    //         self["level" + (i + 1)] = tg[i];
                    //     }

                    //     for (var i = 0; i < tgv.length; i++) {
                    //         self["level" + (i + 1) + "Value"] = tgv[i];
                    //     }
                    // }

                    self.rowData = reader.data;
                });
            }
        }
    }

    function customImportItem(data) {
        let self = this;
        self.retailer = data.retailer;
        self.storeName = data.storeName;
        self.salesRetail = data.salesRetail;
        self.hasCoordinates = (data.x != undefined && data.x != null) || (data.y != undefined && data.y != null)

        if (self.hasCoordinates) {
            self.x = data.x;
            self.y = data.y;
        } else {
            self.x = null;
            self.y = null;
        }
    }

    function convertToGridHeaders(headers) {
        let tmp = [];

        headers.forEach(el => {
            tmp.push({
                "headerName": el,
                "field": el,
            })
        })

        return tmp;
    }

    function csvToDataObject(data) {
        let lines = data.split('\n');
        let result = [];

        let brokenHeaders = lines[0].split(',');
        let headers = [];

        brokenHeaders.forEach(el => {
            headers.push(el.replace(/ /g, "_").replace(/"/g, "").replace(/\r/g, ""));
        })

        for (let i = 1; i < lines.length; i++) {
            let obj = {};
            let currentLine = lines[i].split(",");

            if (currentLine[0] != "") {
                for (let j = 0; j < headers.length; j++) {
                    obj[headers[j]] = currentLine[j].replace(/"/g, "").replace(/\r/g, "");
                }

                result.push(obj);
            }

        }
        return {
            data: result,
            headers: headers
        };
    }
</script>