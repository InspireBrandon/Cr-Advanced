// ////////////////////////////////////////////////////////////////////////////////////////////////////
// Purpose: Provides the user with the ablity to do extract system data with a product barcode
// ////////////////////////////////////////////////////////////////////////////////////////////////////
class BarcodeHandler {
  constructor() {

  }

  static getFolderFile(barcode) {
    return getImageFromBarcode(barcode)
  }

  static imageFromBarcode(barcode, orientation, type) {
    let folderFile = getImageFromBarcode(barcode);
    let randomNumber = Math.random(); // Do this for caching
    return `ProductImage?rng=${randomNumber}&folder=${folderFile.folder}&file=${folderFile.file}.${type}${orientation}&compress=false`;
  }
}

export default BarcodeHandler;

function getImageFromBarcode(barcode) {
  let retval = {
    folder: '',
    file: ''
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
    case 5:
      {
        retval.file = barcode;
      }
      break;
    case 6:
      {
        retval = returnFolderFile(barcode, 1)
      }
      break;
    case 7:
      {
        retval = returnFolderFile(barcode, 2)
      }
      break;
    case 8:
      {
        retval = returnFolderFile(barcode, 5)
      }
      break;
    case 9:
      {
        retval = returnFolderFile(barcode, 4)
      }
      break;
    case 10:
      {
        retval = returnFolderFile(barcode, 5)
      }
      break;
    case 11:
      {
        retval = returnFolderFile(barcode, 6)
      }
      break;
    case 12:
      {
        retval = returnFolderFile(barcode, 7)
      }
      break;
    case 13:
      {
        retval = returnFolderFile(barcode, 7)
      }
      break;
    case 14:
      {
        retval = returnFolderFile(barcode, 9)
      }
      break;
    case 15:
      {
        retval = returnFolderFile(barcode, 10)
      }
      break;
  }

  return retval;
}

function returnFolderFile(barcode, index) {
  let retval = {
    folder: String,
    file: String
  }

  retval.folder = barcode.substring(0, index);
  retval.file = barcode.substring(index, barcode.length);

  return retval;
}
