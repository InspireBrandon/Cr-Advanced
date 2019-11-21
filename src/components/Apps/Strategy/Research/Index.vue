<template>
    <v-card tile>
        <!-- <v-toolbar flat dense dark color="grey darken-3">
            
        </v-toolbar> -->
        <v-toolbar dark flat>
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
                <v-menu dark offset-y style="margin-bottom: 10px;">
                    <v-btn slot="activator" flat>
                        Setup
                    </v-btn>
                    <v-list>
                        <v-list-tile @click="openRetailerSupplierStorDialog">
                            <v-list-tile-title>Link Supplier Stores</v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu>
                <v-select style="margin-left: 10px; margin-top: 8px; width: 200px" label="Type"
                    v-model="selectedImportType" :items="ImportTypes">

                </v-select>
                <v-select style="margin-left: 10px; margin-top: 8px; width: 200px" label="Import level"
                    v-model="selectedImportLevel" @change="handleSpecificHeaders" return-object :items="ImportLevels">
                </v-select>
                <v-checkbox @change="handleSpecificHeaders" v-if="selectedImportLevel!=null"
                    style="margin-left: 10px; margin-top: 14px;" label="Specific" v-model="isSpecific">
                </v-checkbox>
                <v-text-field style="margin-left: 15px; margin-top: 8px; width: 200px" v-model="specificName"
                    v-if="isSpecific" label="Specific Name">

                </v-text-field>
                <!-- <v-btn @click="gengrid">
                    gen
                </v-btn>
                 <v-btn @click="linkGrid">
                    Link
                </v-btn> -->
            </v-toolbar-items>

            <v-spacer></v-spacer>
            <div></div>
            <v-spacer></v-spacer>
            <v-toolbar-title>
                <span>Supplier Import</span>
            </v-toolbar-title>
        </v-toolbar>
        <Grid :rowData="rowData" :headers="headers" ref="Grid" />

        <RetailerSupplierStoreDialog ref="RetailerSupplierStoreDialog" />
        <input @change="onFileChange" accept=".csv" ref="fileInput" style="display: none" type="file">
        <Prompt ref="Prompt" />
        <YesNoModal ref="YesNoModal" />
        <FileDataSelector ref="FileDataSelector" />
        <ImportSelector ref="ImportSelector" />
        <DateRangeSelector ref="DateRangeSelector" />
        <Spinner ref="Spinner" />
    </v-card>
</template>

<script>
    import Spinner from '@/components/Common/Spinner';

    import Axios from 'axios';
    import Grid from './Grid'
    import DateRangeSelector from '@/components/Common/DateRangeSelector';
    import Prompt from '@/components/Common/Prompt'
    import YesNoModal from '@/components/Common/YesNoModal'
    import FileDataSelector from './FileDataSelector'
    import ImportSelector from './ImportSelector'
    import jwt from 'jsonwebtoken';
    import RetailerSupplierStoreDialog from './RetailerSupplierStore/RetailerSupplier';

    export default {
        components: {
            Grid,
            ImportSelector,
            Prompt,
            YesNoModal,
            Spinner,
            FileDataSelector,
            RetailerSupplierStoreDialog,
            DateRangeSelector
        },
        data() {
            return {
                specificName: null,
                isSpecific: false,
                selectedImportType: true,
                ImportTypes: [{
                    text: "Sales In",
                    value: true
                }, {
                    text: "Sales Out",
                    value: false
                }],
                selectedImport: null,
                ImportLevels: [{
                    text: "Store",
                    value: 0
                }, {
                    text: "Department",
                    value: 1
                }, {
                    text: "Category",
                    value: 2
                }, {
                    text: "Brand",
                    value: 3
                }],
                subscriptionLevel: null,
                selectedImportLevel: null,
                SystemUser_ID: -1,
                rowData: [],
                HeadersStatic: [{
                    "headerName": "Store",
                    "field": "storeName",
                }, {
                    "headerName": "sales",
                    "field": "sales",
                }, {
                    "headerName": "X Coordinate",
                    "field": "xCoordinate",
                    "editable": true
                }, {
                    "headerName": "Y Coordinate",
                    "field": "yCoordinate",
                    "editable": true
                }],
                headers: [],
                hasDatabases: false,
                runData: [],
                fileData: []
            }
        },
        mounted() {
            let self = this;
            let encoded_details = jwt.decode(sessionStorage.accessToken);
            self.SystemUser_ID = encoded_details.USER_ID;
            Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

            Axios.get(process.env.VUE_APP_API + `SystemUser/${self.SystemUser_ID}`).then(r => {
                console.log("SystemUser", r);
                Axios.get(process.env.VUE_APP_API + `TenantAccess?systemUserID=${self.SystemUser_ID}`)
                    .then(r => {
                        if (r.data.length > 0) {
                            self.subscriptionLevel = 3
                            self.hasDatabases = true;
                        }
                        self.subscriptionLevel = r.data.subscriptionLevel
                        self.createSubscriptionLevels()

                    })

            })

            self.getFile(data => {
                if (data != null && data != false) {
                    self.getFileData(data.id, fileData => {

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
            handleSpecificHeaders() {
                let self = this
                self.headers = []
                self.$nextTick(() => {
                    if (self.isSpecific) {
                        self.headers = self.HeadersStatic
                    } else {
                        let tmpHeaders = []
                        tmpHeaders = self.HeadersStatic
                        let newHead = JSON.parse(JSON.stringify(tmpHeaders))
                        switch (self.selectedImportLevel.value) {
                            case 0:

                                break;
                            case 1:

                                newHead.push({
                                    "headerName": "department",
                                    "field": "department",
                                    "editable": true
                                })
                                break;
                            case 2:

                                newHead.push({
                                    "headerName": "category",
                                    "field": "category",
                                    "editable": true
                                }, {
                                    "headerName": "department",
                                    "field": "department",
                                    "editable": true
                                })
                                break;
                            case 3:

                                newHead.push({
                                    "headerName": "brand",
                                    "field": "brand",
                                    "editable": true
                                }, {
                                    "headerName": "category",
                                    "field": "category",
                                    "editable": true
                                }, {
                                    "headerName": "department",
                                    "field": "department",
                                    "editable": true
                                })
                                break;

                            default:
                                break;
                        }
                        self.headers = newHead
                    }
                })
            },
            gengrid() {
                let self = this
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + `SuplierLocationImportTX/GenerateGrid`)
                    .then(r => {
                        console.log(r);
                    })
            },
            linkGrid() {
                let self = this
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + `SuplierLocationImportTX/LinkCurrentStoresToGrid`)
                    .then(r => {
                        console.log(r);
                    })
            },

            createSubscriptionLevels() {
                let self = this
                if (!self.hasDatabases) {
                    let tmp = self.ImportLevels
                    self.ImportLevels = []
                    tmp.forEach(e => {
                        if (e.value <= self.subscriptionLevel) {
                            self.ImportLevels.push(e)
                        }
                    })
                } else {
                    self.ImportLevels = [{
                        text: "Store",
                        value: 0
                    }, {
                        text: "Department",
                        value: 1
                    }, {
                        text: "Category",
                        value: 2
                    }, {
                        text: "Brand",
                        value: 3
                    }]

                }
            },
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
            openRetailerSupplierStorDialog() {
                let self = this;

                self.$refs.RetailerSupplierStoreDialog.show();
            },
            openFileDialog() {
                let self = this;
                if (self.selectedImportLevel == null) {
                    alert("Please Select an import Level")
                    return
                }

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

                        let newArr = [];
                        if (self.isSpecific) {
                            data.data.forEach(el => {
                                newArr.push(new customImportItem({
                                    storeName: el.storeName,
                                    sales: el.sales,
                                    coordinates: el.Coordinates
                                }))
                            });
                        } else {

                            switch (self.selectedImportLevel.value) {
                                case 0:
                                    data.data.forEach(el => {
                                        newArr.push(new customImportItem({
                                            storeName: el.storeName,
                                            sales: el.sales,
                                            coordinates: el.Coordinates
                                        }))
                                    });


                                    break;
                                case 1:
                                    data.data.forEach(el => {
                                        newArr.push(new customImportItem({
                                            storeName: el.storeName,
                                            department: el.department,
                                            sales: el.sales,
                                            coordinates: el.Coordinates
                                        }))
                                    });

                                case 2:
                                    data.data.forEach(el => {
                                        newArr.push(new customImportItem({
                                            storeName: el.storeName,
                                            category: el.category,
                                            department: el.department,
                                            sales: el.sales,
                                            coordinates: el.Coordinates
                                        }))
                                    });

                                case 3:
                                    data.data.forEach(el => {
                                        newArr.push(new customImportItem({
                                            storeName: el.storeName,
                                            brand: el.brand,
                                            category: el.category,
                                            department: el.department,
                                            sales: el.sales,
                                            coordinates: el.Coordinates
                                        }))
                                    });

                                default:
                                    break;
                            }
                        }
                        // self.headers = convertToGridHeaders(data.headers);
                        self.rowData = newArr;
                    }
                    reader.readAsText(file);
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
            saveImportToDB(name) {
                let self = this
                self.$refs.DateRangeSelector.show(dateRange => {
                    console.log("[DATERANGE]", dateRange);

                    let request = {
                        Name: name,
                        UserID: self.SystemUser_ID,
                        ID: self.ImportID,
                        salesIn: self.selectedImportType,
                        Type_ID: 1,
                        PeriodTo: dateRange.dateTo,
                        PeriodFrom: dateRange.dateFrom,
                        IsSpecific: self.isSpecific,
                        Import_Level:self.selectedImportLevel.value

                    }
                    console.log(request);
                    Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                    Axios.post(process.env.VUE_APP_API + `SuplierLocationImport`, request)
                        .then(r => {
                            console.log("[SuplierLocationImport]", r);

                            self.saveImportTXes(r.data.id)
                        })
                })
            },
            saveImportTXes(groupID) {
                let self = this
                let tmp = []
                let val = null
                self.$refs.Spinner.show()
                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                self.rowData.forEach(e => {
                    // let number = e.sales.split("R")
                    // // console.log(number);

                    // if (number[0] == "-") {
                    //     val = parseFloat("-"+number[1])
                    // } else {
                    //     val = parseFloat(number[0])
                    // }
                    if (self.isSpecific) {
                        let item = {
                            retailerName: e.retailerName,
                            StoreName: e.storeName,
                            Sales: e.sales,
                            brand: e.brand,
                            category: e.category,
                            department: e.department,
                            XCoordinate: e.xCoordinate,
                            YCoordinate: e.yCoordinate
                        }
                        item[self.selectedImportLevel.text.toLowerCase()]=self.specificName
                        tmp.push(item)
                    } else {
                        tmp.push({
                            retailerName: e.retailerName,
                            StoreName: e.storeName,
                            Sales: e.sales,
                            brand: e.brand,
                            category: e.category,
                            department: e.department,
                            XCoordinate: e.xCoordinate,
                            YCoordinate: e.yCoordinate
                        })
                    }
                })
                console.log(tmp);

                Axios.post(process.env.VUE_APP_API +
                        `SuplierLocationImportTX?groupID=${groupID}`, tmp
                    )
                    .then(r => {
                        console.log(r);
                        self.$refs.Spinner.hide()
                    })

            },

            saveFile(name) {
                let self = this;
                self.saveImportToDB(name)
            },
            getFile(callback) {
                let self = this;

                Axios.get(process.env.VUE_APP_API +
                        `SystemFile/JSON?db=CR-Devinspire&folder=SUPPLIER MARKET SHARE IMPORT/${self.SystemUser_ID}&file=REPORT`
                    )
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
                let self = this;

                Axios.post(process.env.VUE_APP_API + "SystemFile/JSON?db=CR-Devinspire", {
                        SystemFile: {
                            SystemUser_ID: -1,
                            Folder: `SUPPLIER MARKET SHARE IMPORT/${self.SystemUser_ID}`,
                            Name: `REPORT`,
                            Extension: '.json'
                        },
                        Data: fileData
                    })
                    .then(r => {
                        // self.fileData = fileData.basket;
                        alert("Successfully saved");
                    })
                    .catch(e => {
                        alert("Failed to save");
                    })
            },
            openFile() {
                let self = this;
                self.$refs.ImportSelector.show(callback => {
                    console.log("{ImportSelector}", callback);
                    self.selectedImport = callback

                    Axios.get(process.env.VUE_APP_API + `SuplierLocationImportTX/GetAll?groupID=${callback.id}`)
                        .then(r => {
                            console.log(r);
                            self.rowData = r.data
                        })
                })
                // self.$refs.FileDataSelector.show(self.runData, fileData => {
                //     console.log(fileData);

                //     self.ImportID = fileData.id
                //     self.showingSaved = true;
                //     let reader = self.fileData[fileData.prop];
                //     // self.selectedBasket = reader.config.selectedBasket;
                //     // self.selectedPeriod = reader.config.selectedPeriod;

                //     // if (reader.config.turnoverGroups != undefined && reader.config.turnoverGroups != null) {
                //     //     let tg = reader.config.turnoverGroups;
                //     //     let tgv = reader.config.turnoverGroupUserValues;
                //     //     let updateUser = reader.config.updateUser;

                //     //     self.selectedLevel = tg.length - 1;
                //     //     self.updateUser = (updateUser == undefined || updateUser == null) ? false : updateUser;

                //     //     for (var i = 0; i < tg.length; i++) {
                //     //         self["level" + (i + 1)] = tg[i];
                //     //     }

                //     //     for (var i = 0; i < tgv.length; i++) {
                //     //         self["level" + (i + 1) + "Value"] = tgv[i];
                //     //     }
                //     // }

                //     self.rowData = reader.data;
                //     console.log(reader);

                // });
            }
        }
    }

    function customImportItem(data) {
        let self = this;
        self.retailerName = data.retailerName;
        self.storeName = data.storeName;
        self.sales = data.sales;
        self.brand = data.brand
        self.category = data.category
        self.department = data.department
        self.hasCoordinates = data.coordinates != undefined && data.coordinates != null && data.coordinates != "";

        if (self.hasCoordinates) {
            let coordsSplit = data.coordinates.split(", ");

            self.xCoordinate = parseFloat(coordsSplit[1]);
            self.yCoordinate = parseFloat(coordsSplit[0]);
        } else {
            self.xCoordinate = null;
            self.yCoordinate = null;
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

        let brokenHeaders = lines[0].split(';');
        let headers = [];

        brokenHeaders.forEach(el => {
            headers.push(el.replace(/ /g, "_").replace(/"/g, "").replace(/\r/g, ""));
        })

        for (let i = 1; i < lines.length; i++) {
            let obj = {};
            let currentLine = lines[i].split(";");

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