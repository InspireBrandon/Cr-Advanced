<template>
    <v-dialog v-model="dialog" persistent fullscreen>
        <v-card>
            <v-toolbar dark flat color="primary">
                <v-toolbar-title>
                    Retailers
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="dialog=false">
                    <v-icon>close</v-icon>
                </v-btn>
                <v-btn @click="update">
                    Import Retailer Data
                </v-btn>
            </v-toolbar>
            <v-list dense hover>
                <v-divider></v-divider>
                <!-- :class="{ 'highlighted': selected == sp  }" 
                    @click="selected = sp" -->
                <v-list-tile avatar>
                    <v-list-tile-avatar>
                        <!-- <img :src="'data:image/png;base64,' + item.image" alt=""> -->
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                        <v-list-tile-title> Name</v-list-tile-title>

                    </v-list-tile-content>
                    <v-spacer></v-spacer>
                    <v-list-tile-action>
                        <v-flex>
                            <v-btn color="primary">icon</v-btn>
                        </v-flex>
                    </v-list-tile-action>
                    <!-- <v-list-tile-action> - h:{{sp.count}} w:{{sp.width}} modules:{{sp.modules}}</v-list-tile-action> -->
                </v-list-tile>
            </v-list>
            <input @change="onFileChange" accept=".csv" ref="fileInput" style="display: none" type="file">

        </v-card>
    </v-dialog>

</template>
<script>
    import Axios from 'axios'
    export default {
        data() {
            return {
                dialog: false,
                callback: null,
                selected: null,
                retailers: [],
            }
        },
        methods: {
            update() {
                let self = this
                self.openFileDialog()
            },
            getRetailers() {
                let self = this

            },
            open(callback) {
                let self = this
                self.callback = callback
                self.dialog = true
            },
            close() {
                let self = this
                self.dialog = false
                self.callback()
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
                            newArr.push(new customImportItem({
                                retailer: el.Retailer,
                                storeName: el.Store,
                                salesRetail: el.Sales,
                                coordinates: el.Coordinates
                            }))
                        });
                        let ImportList = {
                            importList: newArr
                        }
                        // self.headers = convertToGridHeaders(data.headers);
                        // self.rowData = newArr;
                        Axios.post(process.env.VUE_APP_API +
                                `Retailer/ProcessImport`, ImportList
                            )
                            .then(r => {
                                callback(r.data);
                            })
                    }

                    reader.readAsText(file);
                })
            },
        }
    }

    function customImportItem(data) {
        let self = this;
        self.retailer = data.retailer;
        self.storeName = data.storeName;
        self.salesRetail = data.salesRetail;
        self.hasCoordinates = data.coordinates != undefined && data.coordinates != null && data.coordinates != "";

        if (self.hasCoordinates) {
            let coordsSplit = data.coordinates.split(", ");

            self.x = parseFloat(coordsSplit[0]);
            self.y = parseFloat(coordsSplit[1]);
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

        let brokenHeaders = lines[0].split(';');
        let headers = [];

        brokenHeaders.forEach(el => {
            headers.push(el.replace(/ /g, "").replace(/"/g, "").replace(/\r/g, ""));
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