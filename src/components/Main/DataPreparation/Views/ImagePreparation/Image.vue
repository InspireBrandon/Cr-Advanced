<template>
    <div @dblclick="openImage" style="text-align: center; cursor: pointer;">
        <img class="grid-image" :src="getImage()">
    </div>
</template>

<script>
  import BarcodeHandler from '@/libs/barcodeHandler.js';

    export default {
        
        methods: {
            getImage() {
                if (this.params.colDef.headerName == "Front") {
                    return process.env.VUE_APP_API + BarcodeHandler.imageFromBarcode(this.params.data.barcode, 1,
                        "")
                }
                if (this.params.colDef.headerName == "Side") {
                    return process.env.VUE_APP_API + BarcodeHandler.imageFromBarcode(this.params.data.barcode, 2,
                        "")
                }
                if (this.params.colDef.headerName == "Top") {
                    return process.env.VUE_APP_API + BarcodeHandler.imageFromBarcode(this.params.data.barcode, 3,
                        "")
                }
            },
            openImage() {
                this.params.context.componentParent.imgSrc = this.getImage();
                this.params.context.componentParent.dialog = true;
            }
        }
    }
</script>