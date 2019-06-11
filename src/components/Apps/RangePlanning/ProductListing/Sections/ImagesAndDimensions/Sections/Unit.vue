<template>
    <div>
        <v-data-table hide-actions disable-initial-sort :headers="headers" :items="items">
            <template v-slot:items="props">
                <tr class="no-hover">
                    <td>{{ props.item.productSystemID }}</td>
                    <td>{{ props.item.barcode }}</td>
                    <td>{{ props.item.description }}</td>
                    <td class="px-2">
                        <v-text-field placeholder="Height" v-model="props.item.height" dense full-width flat solo
                            hide-details class="mt-0">
                        </v-text-field>
                    </td>
                    <td class="px-2">
                        <v-text-field placeholder="Width" v-model="props.item.width" dense full-width flat solo
                            hide-details class="mt-0">
                        </v-text-field>
                    </td>
                    <td class="px-2">
                        <v-text-field placeholder="Depth" v-model="props.item.depth" dense full-width flat solo
                            hide-details class="mt-0">
                        </v-text-field>
                    </td>
                    <td class="clickable" @click="changeImage(props.item, '3d', '', props.index)">
                        <img :ref="props.index + '3d'" :src="getImageFromBarcode(props.item.barcode, '3d')" alt=""
                            style="max-height: 50px; margin-top: 5px;">
                    </td>
                    <td class="clickable" @click="changeImage(props.item, '1', props.index)">
                        <img :ref="props.index + '1'" :src="getImageFromBarcode(props.item.barcode, '1')" alt=""
                            style="max-height: 50px; margin-top: 5px;">
                    </td>
                    <td class="clickable" @click="changeImage(props.item, '2', props.index)">
                        <img :ref="props.index + '2'" :src="getImageFromBarcode(props.item.barcode, '2')" alt=""
                            style="max-height: 50px; margin-top: 5px;">
                    </td>
                    <td class="clickable" @click="changeImage(props.item, '3', props.index)">
                        <img :ref="props.index + '3'" :src="getImageFromBarcode(props.item.barcode, '3')" alt=""
                            style="max-height: 50px; margin-top: 5px;">
                    </td>
                    <td style="width: 5px;">
                        <v-menu dark offset-y>
                            <v-btn slot="activator" icon>
                                <v-icon>more_vert</v-icon>
                            </v-btn>
                            <v-list light dense>
                                <v-list-tile @click="duplicateLine(props.item)">
                                    <v-list-tile-title>Duplicate Line</v-list-tile-title>
                                </v-list-tile>
                                <v-list-tile @click="copy(props.item)">
                                    <v-list-tile-title>Copy</v-list-tile-title>
                                </v-list-tile>
                                <v-list-tile :disabled="canPaste" @click="paste(props.item)">
                                    <v-list-tile-title>Paste</v-list-tile-title>
                                </v-list-tile>
                                <v-list-tile @click="removeLine(props.item)">
                                    <v-list-tile-title>Remove Line</v-list-tile-title>
                                </v-list-tile>
                            </v-list>
                        </v-menu>
                    </td>
                </tr>
            </template>
        </v-data-table>
        <input @change="onImageChange" ref="fileInput" style="display: none;" type="file">
    </div>
</template>

<script>
    import BarcodeHandler from '@/libs/barcodeHandler.js';

    const headers = [{
            text: 'Product System ID',
            sortable: false,
            width: '200'
        },
        {
            text: 'Barcode',
            sortable: false,
            width: '150'
        },
        {
            text: 'Description',
            sortable: false,
            width: '300'
        },
        {
            text: 'Height (cm)',
            sortable: false,
            width: '100'
        },
        {
            text: 'Width (cm)',
            sortable: false,
            width: '100'
        },
        {
            text: 'Depth (cm)',
            sortable: false,
            width: '100'
        },
        {
            text: '3D',
            sortable: false,
            width: '100'
        },
        {
            text: 'Front',
            sortable: false,
            width: '100'
        },
        {
            text: 'Side',
            sortable: false,
            width: '100'
        },
        {
            text: 'Top',
            sortable: false,
            width: '100'
        },
        {
            text: '',
            sortable: false
        }
    ]

    export default {
        name: 'hierachy',
        props: ['items', 'duplicate', 'remove', 'copy', 'canPaste', 'paste'],
        data() {
            return {
                currentView: 0,
                headers: headers,
                selectedItem: null,
                selectedFacing: null,
                currentIndex: null
            }
        },
        methods: {
            duplicateLine(item) {
                let self = this;
                self.duplicate(item);
            },
            removeLine(item) {
                let self = this;
                self.remove(item);
            },
            changeImage(item, facing, index) {
                let self = this;
                self.selectedItem = item;
                self.selectedFacing = facing;
                self.currentIndex = index;
                self.$refs.fileInput.value = null;
                self.$refs.fileInput.click();
            },
            onImageChange(e) {
                let self = this;

                const files = e.target.files;
                let file = files[0];
                self.blobToDataUrl(file, url => {
                    let folderFile = BarcodeHandler.getFolderFile(self.selectedItem.barcode);
                    self.saveImageProgress(folderFile, "", file, hasError => {
                        console.log(self.$refs)
                        self.$refs[self.currentIndex + self.selectedFacing].src = self.getImageFromBarcode(self.selectedItem.barcode, self.selectedFacing);
                    })
                })
            },
            blobToDataUrl(blob, callback) {
                var a = new FileReader();
                a.onload = function () {
                    callback(a.result);
                }
                a.readAsDataURL(blob);
            },
            getImageFromBarcode(barcode, type) {
                if (barcode == undefined) {
                    barcode = "";
                }
                return process.env.VUE_APP_API + BarcodeHandler.imageFromBarcode(barcode, "", type);
            },
            saveImageProgress(folderFile, caseType, blob, callback) {
                let self = this;

                let hasError = false;

                var item = self.file;

                // self.showLoader = true;
                // self.inditerminate = true;

                let xhrObj = new XMLHttpRequest();
                let url = process.env.VUE_APP_API + `ProductImage/Upload?folder=${folderFile.folder}&file=${folderFile.file}&caseType=${caseType}&type=${self.selectedFacing}`;

                xhrObj.open("Post", url);

                xhrObj.upload.onprogress = function (pe) {
                    if (pe.lengthComputable) {
                        // self.inditerminate = false;
                        // self.uploadValue = (pe.loaded / pe.total) * 100;
                    }
                }

                xhrObj.upload.onreadystatechange = function (oEvent) {

                    if (xhrObj.upload.readyState === 4) {
                        if (xhrObj.upload.status !== 200) {
                            alert("ERROR")
                        }
                    }
                };

                xhrObj.upload.onerror = function (e) {
                    alert("ERROR")
                    hasError = true;
                }

                xhrObj.upload.onloadend = function (e) {
                    setTimeout(() => {
                        callback(hasError);
                    }, 500);
                }

                xhrObj.setRequestHeader("X-File-Name", self.imageName);
                xhrObj.setRequestHeader("Content-type", self.imageType);

                xhrObj.send(blob);

            }
        }
    }
</script>

<style>
    .no-hover {
        background: white !important;
    }

    .clickable {
        cursor: pointer;
    }
</style>