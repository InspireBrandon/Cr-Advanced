<template>
    <div @click="changeImage" style="text-align: center; cursor: pointer;">
        <img style="max-height: 28px; margin-top: 3px;" :src="src" alt="">
        <input @change="onImageChange" ref="fileInput" style="display: none;" type="file">
    </div>
</template>
<script>
    import BarcodeHandler from '@/libs/barcodeHandler.js';

    export default {
        data() {
            return {
                src: "https://images-na.ssl-images-amazon.com/images/I/81mEIp4PMBL._SL1500_.jpg",
                barcode: null,
                selectedFacing: null,
                facingType: ""
            }
        },
        methods: {
            openEdit() {
                let product = this.params;
                this.params.context.componentParent.openEdit(product);
            },
            setSrc(src) {
                this.src = src;
            },
            getImage(imageType) {
                let self = this;
                let barcode = self.params.data.barcode;

                if(imageType.toUpperCase().includes("TRAY"))
                    self.facingType = "T";
                if(imageType.toUpperCase().includes("CASE"))
                    self.facingType = "C";
                if(imageType.toUpperCase().includes("SHRINK"))
                    self.facingType = "S";
                if(imageType.toUpperCase().includes("PALLET"))
                    self.facingType = "P";

                if (imageType == "3D") {
                    self.selectedFacing = "3D"
                    self.src = process.env.VUE_APP_API + BarcodeHandler.imageFromBarcode(barcode, "", "3D");
                } else if (imageType.toUpperCase().includes("FRONT")) {
                    self.selectedFacing = "1"
                    self.src = process.env.VUE_APP_API + BarcodeHandler.imageFromBarcode(barcode, "", self.facingType + "1");
                } else if (imageType.toUpperCase().includes("SIDE")) {
                    self.selectedFacing = "2"
                    self.src = process.env.VUE_APP_API + BarcodeHandler.imageFromBarcode(barcode, "", self.facingType + "2");
                } else if (imageType.toUpperCase().includes("TOP")) {
                    self.selectedFacing = "3"
                    self.src = process.env.VUE_APP_API + BarcodeHandler.imageFromBarcode(barcode, "", self.facingType + "3");
                }
            },
            changeImage(item, facing, index) {
                let self = this;
                self.$refs.fileInput.value = null;
                self.$refs.fileInput.click();
            },
            onImageChange(e) {
                let self = this;
                const files = e.target.files;
                let file = files[0];

                self.blobToDataUrl(file, url => {
                    let folderFile = BarcodeHandler.getFolderFile(self.barcode);
                    self.saveImageProgress(folderFile, self.facingType, file, hasError => {
                        self.src = self.getImageFromBarcode(self.barcode, self.selectedFacing);
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
                let self = this;

                if (barcode == undefined) {
                    barcode = "";
                }
                return process.env.VUE_APP_API + BarcodeHandler.imageFromBarcode(barcode, "", self.facingType + type);
            },
            saveImageProgress(folderFile, caseType, blob, callback) {
                let self = this;

                let hasError = false;

                var item = self.file;

                let xhrObj = new XMLHttpRequest();
                let url = process.env.VUE_APP_API +
                    `ProductImage/Upload?folder=${folderFile.folder}&file=${folderFile.file}&caseType=${caseType}&type=${self.selectedFacing}`;

                xhrObj.open("Post", url);

                xhrObj.upload.onprogress = function (pe) {
                    if (pe.lengthComputable) {
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
        },
        created() {
            let self = this;
            let imageType = self.params.colDef.headerName;
            self.barcode = self.params.data.barcode;
            self.getImage(imageType);
        }
    }
</script>