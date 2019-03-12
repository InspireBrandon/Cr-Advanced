<template>
  <div>
    <!-- <SoftwareToolbar :afterOpenFile="afterOpenFile" title="Space Planning"></SoftwareToolbar> -->
    <router-view />
  </div>
</template>

<script>
  import SoftwareToolbar from '@/components/Common/SoftwareToolbar';

  export default {
    name: 'Space_Planning',
    data() {
      return {
        products: []
      }
    },
    components: {
      SoftwareToolbar
    },
    methods: {
      imageFromBarcode(barcode) {
        return BarcodeHandler.imageFromBarcode(barcode, 1, "")
      },
      openFile() {

      },
      newFile() {

      },
      afterOpenFile(headers, data) {
        this.products = data;
      }
    }
  }

</script>

<style scoped>
  .boxthing {
    overflow: auto;
    height: calc(100vh - 164px);
  }

</style>
