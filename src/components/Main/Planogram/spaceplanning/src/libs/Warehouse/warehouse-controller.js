import axios from 'axios'
import Konva from 'konva'
import BarcodeImageController from '@/components/Main/Planogram/spaceplanning/src/libs/BarcodeImage/barcode-image-controller';

class WarehouseController {
  constructor(pixelToCmRatio, config) {
    this.ProductList = [];
    this.PixelToCmRatio = pixelToCmRatio;
    this.BarcodeImageHelper = new BarcodeImageController();
    this.Config = config;
  }

  populateTempWarehouse(productList) {
    var self = this
    let x = 10;

    productList.forEach(product => {
      let rect = new Konva.Image({
        x: x,
        y: self.Config.height - (product.height * self.PixelToCmRatio) - 10,
        width: product.width * self.PixelToCmRatio,
        height: product.height * self.PixelToCmRatio,
        fill: 'red'
      })

      x += product.width * self.PixelToCmRatio + 10;

      let rng = self.BarcodeImageHelper.getRng();
      let productImageData = self.BarcodeImageHelper.getImageFromBarcode(product.barcode);
      let imageURL_front = localStorage.ServerAddress + 'ProductImage?rng=' + rng + '&folder=' + productImageData.folder + '&file=' + productImageData.file + '.1';
      let imageURL_front_exists = localStorage.ServerAddress + 'ProductImage/Exists?rng=' + rng + '&folder=' + productImageData.folder + '&file=' + productImageData.file + '.1';

      let image_front = new Image();

      axios.get(imageURL_front_exists)
        .then(response => {
          if (response.data == true) {
            image_front.onload = function () {
              rect.image(image_front);
              layer.draw();
            };

            image_front.src = imageURL_front;
            image_front.crossOrigin = 'Anonymous';
          }
        })

      layer.add(rect);
    });
  }

  getProductImageURL(barcode) {
    var self = this;
    let rng = self.BarcodeImageHelper.getRng();
    let productImageData = self.BarcodeImageHelper.getImageFromBarcode(barcode);
    let imageURL_front = localStorage.ServerAddress + 'ProductImage?rng=' + rng + '&folder=' + productImageData.folder + '&file=' + productImageData.file + '.1';

    return imageURL_front;
  }
}

export default WarehouseController;
