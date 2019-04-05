<template>
    <div style="text-align: center; width: 100%; padding: 10px;">
        <h2>Images</h2>
        <v-card class="elevation-5" style="margin-top: 10px" v-if="image1 != ''">
            <h3>Front</h3>
            <img :src="image1" class="side-image" />
        </v-card>
        <v-card class="elevation-5" style="margin-top: 10px" v-if="image2 != ''">
            <h3>Side</h3>
            <img :src="image2" class="side-image" />
        </v-card>
        <v-card class="elevation-5" style="margin-top: 10px" v-if="image3 != ''">
            <h3>Top</h3>
            <img :src="image3" class="side-image" />
        </v-card>
    </div>
</template>
<script>
    import BarcodeHandler from '@/libs/barcodeHandler.js';

    export default {
        created() {
            this.params.api.addEventListener('rowClicked', this.getImage);
        },
        data() {
            return {
                image1: '',
                image2: '',
                image3: ''
            }
        },
        methods: {
            getImage(num) {
                let self = this;

                this.$nextTick(() => {
                    let rangingComponent = self.$parent.$parent;
                    let barcode = rangingComponent.selectedItem.data.barcode;

                    self.image1 = process.env.VUE_APP_API + BarcodeHandler.imageFromBarcode(barcode, 1, "")
                    self.image2 = process.env.VUE_APP_API + BarcodeHandler.imageFromBarcode(barcode, 2, "")
                    self.image3 = process.env.VUE_APP_API + BarcodeHandler.imageFromBarcode(barcode, 3, "")
                })
            }
        }

    }
</script>