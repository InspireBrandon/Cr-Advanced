class BarcodeImageController {
    constructor() {

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

    getImageFromBarcode(barcode) {
        let self = this;

        let retval = {
            folder: String,
            file: String
        }

        switch (barcode.length) {
            case 2:
                {
                    retval.file = barcode;
                }
                break;
            case 3:
                {
                    retval.file = barcode;
                }
                break;
            case 4:
                {
                    retval.file = barcode;
                }
                break;
            case 5:
                {
                    retval.file = barcode;
                }
                break;
            case 6:
                {
                    retval = self.getFolderFile(barcode, 1)
                }
                break;
            case 7:
                {
                    retval = self.getFolderFile(barcode, 2)
                }
                break;
            case 8:
                {
                    retval = self.getFolderFile(barcode, 5)
                }
                break;
            case 9:
                {
                    retval = self.getFolderFile(barcode, 4)
                }
                break;
            case 10:
                {
                    retval = self.getFolderFile(barcode, 5)
                }
                break;
            case 11:
                {
                    retval = self.getFolderFile(barcode, 6)
                }
                break;
            case 12:
                {
                    retval = self.getFolderFile(barcode, 7)
                }
                break;
            case 13:
                {
                    retval = self.getFolderFile(barcode, 7)
                }
                break;
            case 14:
                {
                    retval = self.getFolderFile(barcode, 9)
                }
                break;
            case 15:
                {
                    retval = self.getFolderFile(barcode, 10)
                }
                break;
        }

        return retval;
    }

    getRng() {
        let rng = Math.random()
        return rng;
    }
}

export default BarcodeImageController;