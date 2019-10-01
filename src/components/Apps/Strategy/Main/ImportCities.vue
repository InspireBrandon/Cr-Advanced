<template>
    <v-dialog v-model="dialog" width="600px" persistent>
        <v-card>
            <v-toolbar dark flat color="primary">
                <v-toolbar-title> Map Image </v-toolbar-title>
                <v-spacer> </v-spacer>
                <v-btn icon @click="dialog=false">
                    <v-icon> close </v-icon>
                </v-btn>
            </v-toolbar>
            <v-toolbar dark flat>
                <!-- <v-select style="margin-left: 10px; margin-top: 8px; width: 200px" dense :items="maps"
                    v-model="selectedMap" hide-details @change="getImages">
                </v-select> -->
                <v-spacer> </v-spacer>
            </v-toolbar>
            <v-card-text>
                <v-container grid-list-md>
                    <v-layout row wrap>
                        <v-flex md4>
                            <v-btn color="primary" @click="openFileDialog">Select File</v-btn>
                        </v-flex>
                        <v-flex md4 class="pt-3">{{ rowData.length }} Rows</v-flex>
                    </v-layout>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="save">Import </v-btn>
            </v-card-actions>
        </v-card>
        <input @change="onFileChange" accept=".csv" ref="fileInput" style="display: none" type="file">
    </v-dialog>
</template>
<script>
    import Axios from 'axios'
    export default {
        data() {
            return {
                dialog: false,
                rowData: [],
                afterReturn: null
            }
        },
        methods: {
            show(afterReturn) {
                let self = this;
                self.afterReturn = afterReturn;
                self.rowData = [];
                self.dialog = true;
            },
            open(type, item, callback) {
                let self = this
                self.isAdd = type
                console.log(self.isAdd);

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + `MapImage`).then(r => {
                    console.log(r);
                    self.maps = []
                    r.data.forEach(e => {
                        self.maps.push({
                            text: e.name,
                            value: e.id
                        })
                    })
                })
                self.callback = callback
                if (!self.isAdd) {
                    self.selectedMap = item.id
                    self.getImages()
                    self.name = item.name
                } else {
                    self.selectedMap = null
                    self.name = null
                    self.MapImgURL = ''
                    self.legendImgURL = ''
                }
                self.dialog = true
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

                        let newArr = [];

                        data.data.forEach(el => {
                            newArr.push(new CityItem(el));
                        });

                        self.rowData = newArr;
                    }

                    reader.readAsText(file);
                })
            },
            save() {
                let self = this;
                self.dialog = false;
                self.appendAndSaveFile(self.rowData);
                self.afterReturn(self.rowData);
            },
            appendAndSaveFile(fileData) {
                Axios.post(process.env.VUE_APP_API + "SystemFile/JSON?db=CR-Devinspire", {
                        SystemFile: {
                            SystemUser_ID: -1,
                            Folder: "CITIES",
                            Name: "CITIES",
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

    function CityItem(data) {
        let self = this;
        self.city = data.City;
        self.major = data.Major == "Y" ? true : false;
        self.latitude = parseFloat(data.Latitude.replace(",", "."));
        self.longitude = parseFloat(data.Longitude.replace(",", "."));
        self.country = data.Country;
        self.province = data.Province;
        self.population = data.Population;
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