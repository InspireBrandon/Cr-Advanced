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
                            <v-list-tile-title>Import</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile>
                            <v-list-tile-title>New</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile>
                            <v-list-tile-title>Open</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile @click="prompt">
                            <v-list-tile-title>Save</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile @click="close">
                            <v-list-tile-title>close</v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu>
                <v-menu dark offset-y style="margin-bottom: 10px;">
                    <v-btn slot="activator" flat>Baskets</v-btn>
                    <v-list>
                        <v-list-tile>
                            <v-list-tile-title>Add</v-list-tile-title>
                        </v-list-tile>
                        <!-- <v-list-tile @click="openLevels">
                            <v-list-tile-title>Basket Levels</v-list-tile-title>
                        </v-list-tile> -->
                        <v-list-tile>
                            <v-list-tile-title>Line items</v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu>
            </v-toolbar-items>
            <v-spacer></v-spacer>
            <div></div>
            <v-spacer></v-spacer>
            <v-toolbar-title>
                <span>Custom Analysis</span>
            </v-toolbar-title>
        </v-toolbar>
        <v-toolbar dark flat>
        </v-toolbar>
        <Grid :rowData="rowData" :headers="headers" ref="Grid" />

        <input @change="onFileChange" accept=".csv" ref="fileInput" style="display: none" type="file">
        <Prompt ref="Prompt" />
        <YesNoModal ref="YesNoModal" />
    </v-card>
</template>

<script>
    import Grid from './Grid'
    import Prompt from '@/components/Common/Prompt'
    import YesNoModal from '@/components/Common/YesNoModal'

    export default {
        components: {
            Grid,
            Prompt,
            YesNoModal
        },
        data() {
            return {
                rowData: [],
                headers: [],
                runData: [],
                fileData: []
            }
        },
        created() {
            let self = this;
            self.getFile(data => {
                if (data != null && data != false) {
                    self.getFileData(data.id, fileData => {
                        if (!Array.isArray(fileData.store)) {
                            self.runData = [];

                            let name = "ASDF";

                            self.fileData = fileData.supplierImport;

                            for (var prop in fileData.supplierImport) {
                                self.runData.push({
                                    prop: prop,
                                    name: self.generateNameParams(fileData.supplierImport[name]
                                        .config.selectedBasket, fileData.basket[name].config
                                        .selectedPeriod)
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
                        self.headers = convertToGridHeaders(data.headers);
                        self.rowData = data.data;
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
                        if (self.fileData.supplierImport != undefined && self.fileData.supplierImport != null) {
                            for (var prop in self.fileData.supplierImport) {
                                if (prop == name) {
                                    setTimeout(() => {
                                        self.$refs.YesNoModal.show("This name already exists. Would you like to overwrite it?", value => {
                                            if(value) {
                                                canPass = true;
                                            } else {
                                                self.prompt();
                                            }
                                        })
                                    }, 60);
                                }
                                else {
                                    canPass = true;
                                }
                            }
                        }
                    }

                    if (canPass) {
                        // saveFile
                    }
                })
            },
            saveFile() {
                let self = this;

                self.getFile(fileTransaction => {

                    let name = "ASDF";

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

                            tmp.basket[name] = {
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