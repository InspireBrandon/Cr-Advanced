import Konva from 'konva';
import axios from 'axios';
class ProductRenderingBase {

    constructor(layer, fixture, productItem, yMargin, ratio) {
        this.fixture = fixture;
        this.Layer = layer;
        this.productItem = productItem;
        this.ratio = ratio;
        this.margin = parseInt(yMargin);
        this.Image = null;
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
        this.image_front = null;
        this.image_top = null;
        this.image_side = null;
    }

    CalculatePosition() {
        let self = this;

        if (self.productItem == null) {
            return;
        }
        let currentGroupPos = self.productItem.Group.position();
        let individualProductWidth = self.productItem.Orientation_Width * self.productItem.Facings_X;
        let individualProductHeight = self.productItem.Orientation_Height * self.productItem.Facings_Y;

        self.x = (currentGroupPos.x + ((individualProductWidth - self.productItem.Orientation_Width) / 2));
        // self.x = currentGroupPos.x;

        switch (self.fixture.Type.toUpperCase()) {
            case "SHELF": {
                if (self.margin != null && self.margin != undefined && self.margin > 0) {
                    self.y = (((self.margin * self.ratio) + self.productItem.Orientation_Height) / 2) * -1;
                } else {
                    self.y = ((individualProductHeight + self.productItem.Orientation_Height) / 2) * -1;
                }
            }
            break;
        case "BASE": {
            if (self.margin != null && self.margin != undefined && self.margin > 0) {
                self.y = (((self.margin * self.ratio) + self.productItem.Orientation_Height) / 2) * -1;
            } else {
                self.y = ((individualProductHeight + self.productItem.Orientation_Height) / 2) * -1;
            }
        }
        break;
        case "BASKET": {
            if (self.margin != null && self.margin != undefined && self.margin > 0) {
                self.y = (((self.margin * self.ratio) + self.productItem.Orientation_Height) / 2) * -1;
            } else {
                self.y = ((individualProductHeight + self.productItem.Orientation_Height) / 2) * -1;
            }
        }
        break;
        }
    }

    AddRendering() {
        let self = this;
        self.CalculatePosition();
        self.GetImages(true)
            .then(() => {
                self.AddProductImage();
            })
            .catch(error => {
                console.log("[PRODUCT RENDERING]", "FAILED TO LOAD IMAGE", error);
            })
    }

    GetProductStateData() {
        let self = this;
        let retVal = {
            ProductType: "",
            Barcode: ""
        }
        if (self.productItem.Data.useAlternateBarcode == undefined) {
            retVal.Barcode = self.productItem.Data.barcode;
        } else {

            if (self.productItem.Data.useAlternateBarcode == false)
                retVal.Barcode = self.productItem.Data.barcode;
            else {
                retVal.Barcode = self.productItem.Data.alternateBarcode;
            }
        }

        if (self.productItem.Data.alternatePackingType != undefined) {
            switch (self.productItem.Data.alternatePackingType) {
                case 0: {
                    retVal.ProductType = "";
                    if (self.productItem.Data.useAlternateBarcode == false)
                        retVal.Barcode = self.productItem.Data.barcode;
                    else {
                        retVal.Barcode = self.productItem.Data.alternateBarcode;
                    }
                }
                break;
            case 1: {
                retVal.ProductType = "T";
                retVal.Barcode = self.productItem.Data.barcode;
            }
            break;
            case 2: {
                retVal.ProductType = "C";
                retVal.Barcode = self.productItem.Data.barcode;
            }
            break;
            case 3: {
                retVal.ProductType = "S";
                retVal.Barcode = self.productItem.Data.barcode;
            }
            break;
            case 4: {
                retVal.ProductType = "P";
                retVal.Barcode = self.productItem.Data.barcode;
            }
            break;
            }
        }

        return retVal;
    }

    getImageFromBarcode(barcode) {
        let self = this;

        let retval = {
            folder: "",
            file: ""
        }

        switch (barcode.length) {
            case 2: {
                retval.file = barcode;
            }
            break;
        case 3: {
            retval.file = barcode;
        }
        break;
        case 4: {
            retval.file = barcode;
        }
        break;
        case 5: {
            retval.file = barcode;
        }
        break;
        case 6: {
            retval = self.getFolderFile(barcode, 1)
        }
        break;
        case 7: {
            retval = self.getFolderFile(barcode, 2)
        }
        break;
        case 8: {
            retval = self.getFolderFile(barcode, 5)
        }
        break;
        case 9: {
            retval = self.getFolderFile(barcode, 4)
        }
        break;
        case 10: {
            retval = self.getFolderFile(barcode, 5)
        }
        break;
        case 11: {
            retval = self.getFolderFile(barcode, 6)
        }
        break;
        case 12: {
            retval = self.getFolderFile(barcode, 7)
        }
        break;
        case 13: {
            retval = self.getFolderFile(barcode, 7)
        }
        break;
        case 14: {
            retval = self.getFolderFile(barcode, 9)
        }
        break;
        case 15: {
            retval = self.getFolderFile(barcode, 10)
        }
        break;
        }

        return retval;
    }

    getFolderFile(barcode, index) {
        let retval = {
            folder: String,
            file: String
        }

        retval.folder = barcode.substring(0, index);
        retval.file = barcode.substring(index, barcode.length);

        return retval;
    }

    getRng() {
        let rng = Math.random()
        return rng;
    }

    GetImages(force = false) {
        let self = this;

        // console.log('GETIMAGES', self)

        return new Promise(function (resolve) {
            let rng = self.getRng();

            let productDataStatus = self.GetProductStateData();

            let productImageData = self.getImageFromBarcode(productDataStatus.Barcode);

            // console.log(productImageData);

            let imageURL_front = localStorage.ServerAddress + 'ProductImage?rng=' + rng + '&folder=' + productImageData.folder + '&file=' + productImageData.file + '.' + productDataStatus.ProductType + '1&compress=true';
            let imageURL_front_exists = localStorage.ServerAddress + 'ProductImage/Exists?rng=' + rng + '&folder=' + productImageData.folder + '&file=' + productImageData.file + '.' + productDataStatus.ProductType + '1';
            let imageURL_side = localStorage.ServerAddress + 'ProductImage?rng=' + rng + '&folder=' + productImageData.folder + '&file=' + productImageData.file + '.' + productDataStatus.ProductType + '2&compress=true';
            let imageURL_side_exists = localStorage.ServerAddress + 'ProductImage/Exists?rng=' + rng + '&folder=' + productImageData.folder + '&file=' + productImageData.file + '.' + productDataStatus.ProductType + '2';
            let imageURL_top = localStorage.ServerAddress + 'ProductImage?rng=' + rng + '&folder=' + productImageData.folder + '&file=' + productImageData.file + '.' + productDataStatus.ProductType + '3&compress=true';
            let imageURL_top_exists = localStorage.ServerAddress + 'ProductImage/Exists?rng=' + rng + '&folder=' + productImageData.folder + '&file=' + productImageData.file + '.' + productDataStatus.ProductType + '3';

            let promiseArr = [];

            promiseArr.push(self.LoadSingleImage('FRONT', imageURL_front_exists, imageURL_front, force));
            promiseArr.push(self.LoadSingleImage('SIDE', imageURL_side_exists, imageURL_side, force));
            promiseArr.push(self.LoadSingleImage('TOP', imageURL_top_exists, imageURL_top, force));

            Promise.all(promiseArr)
                .then(results => {
                    // console.log("[PRODUCT IMAGES] PROMISE RESULTS", results)
                    resolve();
                })
                .catch(errors => {
                    console.log("[PRODUCT IMAGE] Error1?", errors, errors.toString())
                    resolve();
                })
        })
    }

    LoadSingleImage(type, existsURL, imageURL, force = false) {
        let self = this;
        return new Promise(function (resolve) {
            axios.get(existsURL)
                .then(response => {

                    // switch (type) {
                    //     case "FRONT": {
                    //         self.ImageAvailable.front = response.data;
                    //     }
                    //     break;
                    // case "SIDE": {
                    //     self.ImageAvailable.side = response.data;
                    // }
                    // break;
                    // case "TOP": {
                    //     self.ImageAvailable.top = response.data;
                    // }
                    // break;
                    // }
                    if (response.data == true) {

                        switch (type) {
                            case "FRONT": {
                                if (self.image_front != null && self.image_front != undefined && force == false) {
                                    resolve(true);
                                } else {
                                    self.image_front = new Image();
                                    self.image_front.onload = function () {
                                        resolve(true);
                                    };
                                    self.image_front.src = imageURL;
                                    self.image_front.crossOrigin = 'Anonymous';
                                }
                            }
                            break;
                        case "SIDE": {
                            if (self.image_side != null && self.image_side != undefined && force == false) {
                                resolve(true);
                            } else {
                                self.image_side = new Image();
                                self.image_side.onload = function () {
                                    resolve(true);
                                };
                                self.image_side.src = imageURL;
                                self.image_side.crossOrigin = 'Anonymous';
                            }
                        }
                        break;
                        case "TOP": {
                            if (self.image_top != null && self.image_top != undefined && force == false) {
                                resolve(true);
                            } else {
                                self.image_top = new Image();
                                self.image_top.onload = function () {
                                    resolve(true);
                                };
                                self.image_top.src = imageURL;
                                self.image_top.crossOrigin = 'Anonymous';
                            }
                        }
                        break;
                        }
                    } else {
                        resolve(false);
                    }
                })
                .catch(error => {
                    console.log("[PRODUCT IMAGE] Error?", error, error.toString())
                    resolve(false);
                })
        });
    }

    AddProductImage() {
        let self = this;
        // let tmpRect = new Konva.Rect({
        //     name: 'front-image-rendering-facing',
        //     x: self.x,
        //     y: self.y,
        //     width: self.productItem.Orientation_Width,
        //     height: self.productItem.Orientation_Height,
        //     fill: 'red'
        // })

        // self.fixture.Group.add(tmpRect); //ADD WHEN YOU WANT TO TEST

        self.Image = new Konva.Image({
            x: self.x,
            y: self.y,
            name: 'front-image-rendering-facing',
            listening: false
        })

        if (self.productItem.LastFace.toUpperCase() === "FRONT") {
            self.Image.rotation(0);
            self.Image.image(self.image_front);
            self.Image.setX(self.x + self.productItem.Orientation_Width / 2);
            self.Image.setY(self.y + self.productItem.Orientation_Height / 2);

            self.Image.offset({
                x: self.productItem.image_orientation_width / 2,
                y: self.productItem.image_orientation_height / 2
            })

            self.Image.setWidth(self.productItem.image_orientation_width);
            self.Image.setHeight(self.productItem.image_orientation_height);

            self.Image.rotation(self.productItem.Rotation);

        } else if (self.productItem.LastFace.toUpperCase() === "LEFT") {
            self.Image.rotation(0);
            self.Image.image(self.image_side);
            self.Image.setX(self.x + self.productItem.Orientation_Width / 2);
            self.Image.setY(self.y + self.productItem.Orientation_Height / 2);

            self.Image.offset({
                x: self.productItem.image_orientation_width / 2,
                y: self.productItem.image_orientation_height / 2
            })

            self.Image.setWidth(self.productItem.image_orientation_width);
            self.Image.setHeight(self.productItem.image_orientation_height);

            self.Image.rotation(self.productItem.Rotation);

        } else if (self.productItem.LastFace.toUpperCase() === "TOP") {
            self.Image.rotation(0);
            self.Image.image(self.image_top);
            self.Image.setX(self.x + self.productItem.Orientation_Width / 2);
            self.Image.setY(self.y + self.productItem.Orientation_Height / 2);

            self.Image.offset({
                x: self.productItem.image_orientation_width / 2,
                y: self.productItem.image_orientation_height / 2
            })

            self.Image.setWidth(self.productItem.image_orientation_width);
            self.Image.setHeight(self.productItem.image_orientation_height);

            self.Image.rotation(self.productItem.Rotation);
        }

        self.Image.show();
        self.fixture.Group.add(self.Image);

        self.Layer.draw();

        console.log("ADDED PRODUCT RENDERING!!!")
    }

    DestroyRendering() {
        let self = this;
        self.Image.destroy();
    }
}

export default ProductRenderingBase;