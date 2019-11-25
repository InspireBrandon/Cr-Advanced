<template>
    <v-dialog width="800" height="800" v-model="dialog" persistent>
        <v-toolbar dark flat color="primary">
            <v-toolbar-title>Import Setup</v-toolbar-title>
        </v-toolbar>
        <v-card>
            <v-container grid-list-md>
                <v-layout row wrap>
                    <v-flex md3>
                        <v-select label="Import level" @change="getSubscriptionLevelFields()"
                            v-model="selectedImportLevel " return-object :items="ImportLevels">
                        </v-select>
                    </v-flex>
                    <v-flex md6></v-flex>
                    <v-flex md3>
                        <v-select v-if="hasDatabases" label="Sales In/Out" v-model="selectedImportType"
                            :items="ImportTypes">
                        </v-select>
                    </v-flex>
                    <v-flex md3>
                        <v-combobox v-if="selectedImportLevel!=null &&selectedImportLevel.value !=0"
                            :label="selectedImportLevel.text+ ' Name'" v-model="selectedSubscriptionField" return-object
                            :items="subscriptionFields">
                        </v-combobox>
                    </v-flex>
                    <v-flex md9></v-flex>
                    <v-flex md3>
                        <v-autocomplete @change="validateDate" :items="periodsFrom" return-object v-model="dateFrom"
                            label="Date From:"></v-autocomplete>
                    </v-flex>
                    <v-flex md3>
                        <v-autocomplete @change="validateDate" :items="periodsTo" return-object v-model="dateTo"
                            label="Date To:">
                        </v-autocomplete>
                    </v-flex>
                    <v-flex md6></v-flex>
                    <v-flex md2>
                        <v-btn @click="downloadTemplate">template</v-btn>
                    </v-flex>
                    <v-flex md2>
                        <v-btn @click="openFileDialog">File</v-btn>
                    </v-flex>
                    <v-flex md8>
                        <div style="margin-top: 13px;">
                            <span style="margin-left: 30px; margin-top: 30px; ">{{Filename}}
                            </span></div>
                    </v-flex>
                </v-layout>
                <v-divider></v-divider>
            </v-container>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="cancel"> cancel</v-btn>
                <v-btn color="primary" @click="submit()" :disabled="!valid"> submit </v-btn>
            </v-card-actions>
        </v-card>
        <input @change="onFileChange" accept=".csv" ref="fileInput" style="display: none" type="file">
        <a display="none" ref="downloadLink" :href="'template.csv'" download></a>
    </v-dialog>

</template>
<script>
    import Axios from 'axios';
    import jwt from 'jsonwebtoken';

    function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }

    export default {
        data() {
            return {
                fileData: null,
                Filename: "None selected",
                dialog: false,
                dateFrom: null,
                dateTo: null,
                valid: false,
                periodsFrom: [],
                periodsTo: [],
                subscriptionFields: [],
                selectedSubscriptionField: null,
                userSubscriptionLevel: null,
                hasDatabases: null,
                selectedImportType: true,
                callback: null,
                ImportTypes: [{
                    text: "sales In",
                    value: true
                }, {
                    text: "sales Out",
                    value: false
                }],
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
                selectedImportLevel: null,
            }
        },
        methods: {
            downloadTemplate() {
                let self = this;
                self.$refs.downloadLink.click();
            },
            validateDate() {
                let self = this
                self.$nextTick(() => {

                    if (self.dateFrom != null && self.dateTo != null) {
                        console.log(self.dateTo.value + "<" + self.dateFrom.value);

                        if (self.dateTo.value < self.dateFrom.value) {
                            alert("date from cannot be later than DateTo")
                            self.dateFrom = null
                            self.dateTo = null
                            self.valid = false
                        } else {
                            self.valid = true
                        }
                    }
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
            onFileChange(e) {
                let self = this;

                self.$nextTick(() => {
                    const files = e.target.files;
                    let file = files[0];
                    console.log("file", file);
                    self.Filename = file.name

                    let reader = new FileReader();

                    reader.onload = function (e) {
                        let data = csvToDataObject(e.currentTarget.result);
                        self.fileData = data
                        console.log(self.fileData);

                    }
                    reader.readAsText(file);
                })
            },
            openFileDialog() {
                let self = this;
                self.$refs.fileInput.value = null;
                self.$refs.fileInput.click();
            },
            open(hasDatabases, subscriptionlevel, callback) {
                let self = this
                self.fileData = null
                self.selectedImportLevel = null
                self.Filename = "None selected"
                self.selectedSubscriptionField = null
                self.dateFrom = null
                self.dateTo = null
                self.hasDatabases = hasDatabases
                if (hasDatabases) {
                    self.userSubscriptionLevel = 3
                } else {
                    self.userSubscriptionLevel = subscriptionlevel
                }
                self.createSubscriptionLevels()
                self.getDates(dates => {
                    self.dialog = true

                })
                self.callback = callback

            },
            validateForm(callback) {
                let self = this
                let valid = true
                if (self.fileData == null) {
                    valid = false
                    callback(valid)
                    return
                }
                if (self.selectedImportLevel == null) {
                    valid = false
                    callback(valid)
                    return
                }
                if (self.selectedImportType == null) {
                    valid = false
                    callback(valid)
                    return
                }
                if (self.selectedSubscriptionField == null) {
                    valid = false
                    callback(valid)
                    return
                }
                if (self.dateFrom == null) {
                    valid = false
                    callback(valid)
                    return
                }
                if (self.dateTo == null) {
                    valid = false
                    callback(valid)
                    return
                }
                callback(valid)
                return
            },
            submit() {
                let self = this
                console.log('submit');

                self.validateForm(isvalid => {
                    console.log("validateForm", isvalid);

                    if (isvalid) {
                        let retval = {
                            fileData: self.fileData,
                            importLevel: self.selectedImportLevel,
                            importType: self.selectedImportType,
                            selectedField: self.selectedSubscriptionField,
                            dateFrom: self.dateFrom,
                            dateTo: self.dateTo,
                        }
                        self.dialog = false
                        self.callback(retval)
                    } else {
                        alert("Please ensure all Fields are filled in correctly")
                    }
                })

            },
            cancel() {
                let self = this
                self.dialog = false
            },
            getSubscriptionLevelFields() {
                let self = this
                let encoded_details = jwt.decode(sessionStorage.accessToken);
                if (self.selectedImportLevel.value == 0) {
                    return
                }
                self.$nextTick(() => {
                    Axios.get(process.env.VUE_APP_API +
                            `SuplierLocationImportTX/Fields?user_ID=${encoded_details.USER_ID}&ImportLevel=${self.selectedImportLevel.value}`
                        )
                        .then(r => {
                            self.subscriptionFields = []
                            r.data.forEach(element => {
                                self.subscriptionFields.push(
                                    element.name
                                )
                            });
                        })


                })
            },
            getDates(callback) {
                let self = this;

                Axios.get(process.env.VUE_APP_API + "Periods")
                    .then(r => {
                        let periods = r.data;

                        for (let i = 0; i < periods.length; i++) {
                            let period = periods[i];

                            self.periodsFrom.push({
                                text: formatDate(period.period_From_Date),
                                value: period.id
                            })

                            self.periodsTo.push({
                                text: formatDate(period.period_To_Date),
                                value: period.id
                            })
                        }

                        callback();
                    })
            },


        }

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