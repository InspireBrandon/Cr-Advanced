import Konva from 'konva';
import axios from 'axios';
import GeneralPositionHelper from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/positioning/GeneralPosition.js";
import LabelHelper from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/Labeling/LabelingBase.js";
import StoreHelper from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/StoreHelper/StoreHelper.js";
import PlanogramItemBase from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/PlanogramItemBase.js";

class ProductItemBase extends PlanogramItemBase {
  constructor(vueStore, stage, layer, data, ratio, type, gondolaID) {
    super(vueStore, stage, layer, data, ratio, type, gondolaID);

    this.SetProductStateData();
    // caps & orientation
    this.Cap_Orientation_Width = this.Orientation_Width;
    this.Cap_Orientation_Height = this.Orientation_Depth;
    this.Cap_Orientation_Depth = this.Orientation_Height;
    this.caps_image_orientation_width = this.Cap_Orientation_Width;
    this.caps_image_orientation_height = this.Cap_Orientation_Height;
    this.Caps_Enabled = false;
    this.Caps_Count = 0;
    this.Cap_Rotation = 0;
    this.Caps_Face = 'top';

    this.Orientation = null;
    this.Rotation = 0;
    this.Area = null;
    this.ProductRects = [];
    this.ImageRects = [];
    this.TextRects = [];
    //#region Group Box 
    this.ProductGroupBox_ON = false;
    this.ProductGroupBox = null;
    this.ProductGroupBoxText = null;
    //#endregion Group Box
    this.LastPosition = null;

    this.TotalFacings = 0;

    this.Facings_X = 1;
    this.Facings_Y = 1;
    this.Facings_Z = 1;
    //#region Images
    this.ImageAvailable = {
      front: false,
      side: false,
      top: false
    }
    this.image_front = null;
    this.image_side = null;
    this.image_top = null;
    this.image_orientation_width = this.Orientation_Width;
    this.image_orientation_height = this.Orientation_Height;
    //#endregion Images

    this.image_used = null;
    this.LastFace = 'front';
    this.RandomColor = this.randomColor()

    //#region Pegboard hole position
    this.PegboardHoleAssigned = null;
    this.PegboardHoleAssignedID = null;
    //#endregion Pegboard hole position
  }

  SetProductStateData() {
    let productDataStatus = this.GetProductStateData();
    switch (productDataStatus.ProductType.toUpperCase()) {
      case "":
        { // normal product
          this.ProductWidth = this.Data.width * this.Ratio;
          this.ProductHeight = this.Data.height * this.Ratio;
          this.ProductDepth = this.Data.depth * this.Ratio;
          this.Orientation_Width = this.Data.width * this.Ratio;
          this.Orientation_Height = this.Data.height * this.Ratio;
          this.Orientation_Depth = this.Data.depth * this.Ratio;
        }
        break;
      case "T":
        { // tray packaging
          this.ProductWidth = this.Data.tray_Width * this.Ratio;
          this.ProductHeight = this.Data.tray_Height * this.Ratio;
          this.ProductDepth = this.Data.tray_Depth * this.Ratio;
          this.Orientation_Width = this.Data.tray_Width * this.Ratio;
          this.Orientation_Height = this.Data.tray_Height * this.Ratio;
          this.Orientation_Depth = this.Data.tray_Depth * this.Ratio;
        }
        break;
      case "C":
        { // case packaging
          this.ProductWidth = this.Data.case_Width * this.Ratio;
          this.ProductHeight = this.Data.case_Height * this.Ratio;
          this.ProductDepth = this.Data.case_Depth * this.Ratio;
          this.Orientation_Width = this.Data.case_Width * this.Ratio;
          this.Orientation_Height = this.Data.case_Height * this.Ratio;
          this.Orientation_Depth = this.Data.case_Depth * this.Ratio;
        }
        break;
      case "S":
        { // shrink packaging
          this.ProductWidth = this.Data.shrink_Width * this.Ratio;
          this.ProductHeight = this.Data.shrink_Height * this.Ratio;
          this.ProductDepth = this.Data.shrink_Depth * this.Ratio;
          this.Orientation_Width = this.Data.shrink_Width * this.Ratio;
          this.Orientation_Height = this.Data.shrink_Height * this.Ratio;
          this.Orientation_Depth = this.Data.shrink_Depth * this.Ratio;
        }
        break;
      case "P":
        { // palette packaging
          this.ProductWidth = this.Data.pallet_Width * this.Ratio;
          this.ProductHeight = this.Data.pallet_Height * this.Ratio;
          this.ProductDepth = this.Data.pallet_Depth * this.Ratio;
          this.Orientation_Width = this.Data.pallet_Width * this.Ratio;
          this.Orientation_Height = this.Data.pallet_Height * this.Ratio;
          this.Orientation_Depth = this.Data.pallet_Depth * this.Ratio;
        }
        break;
    }
  }

  GetProductStateQuantity() {
    let self = this;
    let qty = 1;

    if (self.Data.alternatePackingType != undefined) {
      switch (self.Data.alternatePackingType) {
        case 0: // product
          {
            qty = 1;
          }
          break;
        case 1: // tray
          {
            qty = self.Data.tray_Qty;
          }
          break;
        case 2: // case
          {
            qty = self.Data.case_Qty;
          }
          break;
        case 3: // shrink
          {
            qty = self.Data.shrink_Qty;
          }
          break;
        case 4: // palette
          {
            qty = self.Data.pallet_Qty;
          }
          break;
      }
    }

    return qty;
  }

  GetProductStateData() {
    let self = this;
    let retVal = {
      ProductType: "",
      Barcode: ""
    }
    if (self.Data.useAlternateBarcode == undefined) {
      retVal.Barcode = self.Data.barcode;
    } else {

      if (self.Data.useAlternateBarcode == false)
        retVal.Barcode = self.Data.barcode;
      else {
        retVal.Barcode = self.Data.alternateBarcode;
      }
    }

    if (self.Data.alternatePackingType != undefined) {
      switch (self.Data.alternatePackingType) {
        case 0:
          {
            retVal.ProductType = "";
            if (self.Data.useAlternateBarcode == false)
              retVal.Barcode = self.Data.barcode;
            else {
              retVal.Barcode = self.Data.alternateBarcode;
            }
          }
          break;
        case 1:
          {
            retVal.ProductType = "T";
            retVal.Barcode = self.Data.barcode;
          }
          break;
        case 2:
          {
            retVal.ProductType = "C";
            retVal.Barcode = self.Data.barcode;
          }
          break;
        case 3:
          {
            retVal.ProductType = "S";
            retVal.Barcode = self.Data.barcode;
          }
          break;
        case 4:
          {
            retVal.ProductType = "P";
            retVal.Barcode = self.Data.barcode;
          }
          break;
      }
    }

    return retVal;
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
          self.Update();
          self.Cache();
          self.Group.draw();
          resolve();
        })
        .catch(errors => {
          resolve();
        })
    })
  }

  LoadSingleImage(type, existsURL, imageURL, force = false) {
    let self = this;
    return new Promise(function (resolve) {
      axios.get(existsURL)
        .then(response => {

          switch (type) {
            case "FRONT":
              {
                self.ImageAvailable.front = response.data;
              }
              break;
            case "SIDE":
              {
                self.ImageAvailable.side = response.data;
              }
              break;
            case "TOP":
              {
                self.ImageAvailable.top = response.data;
              }
              break;
          }
          if (response.data == true) {

            switch (type) {
              case "FRONT":
                {
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
              case "SIDE":
                {
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
              case "TOP":
                {
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

  //#region Physical Products

  DestroyDisplayForRedraw() {
    let self = this;

    // RESET - Then re-calc for each facing
    self.ProductRects.forEach(element => {
      element.destroy()
    });

    // destroy text labels
    self.TextRects.forEach(element => {
      element.destroy()
    });

    // destroy group box if assigned
    if (self.ProductGroupBox != null) {
      self.ProductGroupBox.destroy();
      self.ProductGroupBox = null;
    }
    if (self.ProductGroupBoxText != null) {
      self.ProductGroupBoxText.destroy();
      self.ProductGroupBoxText = null;
    }

    // destroy image boxes
    self.ImageRects.forEach(element => {
      element.destroy()
    });

    self.ProductRects = [];
    self.ImageRects = [];
  }

  AddProductDisplay() {
    let self = this;
    let w = self.Orientation_Width;
    let h = self.Orientation_Height;

    let ctrl_store = new StoreHelper();
    let ctrl_position = new GeneralPositionHelper();

    let parentItem = ctrl_store.getPlanogramItemById(self.VueStore, self.ParentID);
    let parentSpreadSpacer = self.GetSpreadSpacing(self.ParentID);
    let parentSquishValue = self.GetSquishValue(self.ParentID);
    let parentFacingOffset = self.GetFacingOffset(self.ParentID);

    self.SetObjectDimensions();

    self.DestroyDisplayForRedraw();

    for (var y = 0; y < self.Facings_Y; y++) {
      for (var x = 0; x < self.Facings_X; x++) {

        let placeY = ctrl_position.PositionProductItems(y, x, self).y;
        let placeX = ctrl_position.PositionProductItems(y, x, self).x;

        if (parentSpreadSpacer > 0) {
          placeX += (x * (parentSpreadSpacer - parentSquishValue));
        } else if (parentSquishValue > 0) {
          placeX -= (x * parentSquishValue);
        }

        if (parentFacingOffset.enabled == true) {
          placeX += (x * (parentFacingOffset.x - parentSquishValue));
          placeY -= ((y - 1) * (parentFacingOffset.y));
        }

        let rect = new Konva.Image({
          name: 'nromal-facing',
          x: placeX,
          y: placeY,
          width: w - parentSquishValue,
          height: h,
          fill: self.RandomColor,
          stroke: 'black',
          strokeWidth: 0.5,
          pixelRatio: 2,
          transformsEnabled: 'position'
        })

        let image_rect = new Konva.Image({
          name: 'nromal-facing',
          listening: false
        })

        self.ProductRects.push(rect)
        self.Group.add(rect);

        if (self.LastFace.toUpperCase() === "FRONT") {
          image_rect.rotation(0);
          image_rect.image(self.image_front);
          image_rect.setX(rect.getX() + rect.width() / 2);
          image_rect.setY(rect.getY() + rect.height() / 2);

          image_rect.offset({
            x: self.image_orientation_width / 2,
            y: self.image_orientation_height / 2
          })

          image_rect.setWidth(self.image_orientation_width);
          image_rect.setHeight(self.image_orientation_height);

          image_rect.rotation(self.Rotation);

          self.ImageRects.push(image_rect);
          self.Group.add(image_rect);

        } else if (self.LastFace.toUpperCase() === "LEFT") {
          image_rect.rotation(0);
          image_rect.image(self.image_side);
          image_rect.setX(rect.getX() + rect.width() / 2);
          image_rect.setY(rect.getY() + rect.height() / 2);

          image_rect.offset({
            x: self.image_orientation_width / 2,
            y: self.image_orientation_height / 2
          })

          image_rect.setWidth(self.image_orientation_width);
          image_rect.setHeight(self.image_orientation_height);

          image_rect.rotation(self.Rotation);

          self.ImageRects.push(image_rect);
          self.Group.add(image_rect);

        } else if (self.LastFace.toUpperCase() === "TOP") {
          image_rect.rotation(0);
          image_rect.image(self.image_top);
          image_rect.setX(rect.getX() + rect.width() / 2);
          image_rect.setY(rect.getY() + rect.height() / 2);

          image_rect.offset({
            x: self.image_orientation_width / 2,
            y: self.image_orientation_height / 2
          })

          image_rect.setWidth(self.image_orientation_width);
          image_rect.setHeight(self.image_orientation_height);

          image_rect.rotation(self.Rotation);

          self.ImageRects.push(image_rect);
          self.Group.add(image_rect);
        }

        // image_rect.cache();

        if (self.ImagesOn == true) {
          image_rect.show();
        } else {
          image_rect.hide();
        }

        let text = new Konva.Text({
          name: 'product_rect_label',
          x: placeX,
          y: placeY,
          width: w,
          height: h,
          text: self.Data.description,
          fontSize: 10,
          fontFamily: 'Arial',
          fill: 'black',
          wrap: 'word',
          padding: 2,
          pixelRatio: 2,
          listening: false,
          transformsEnabled: 'position'
        })
        text.align('center');
        self.TextRects.push(text);
        self.Group.add(text);

        if (self.labelsOn == true) {
          text.show();
        } else {
          text.hide();
        }
      }
    }

    //#region Caps
    if (self.Caps_Enabled == true) {
      for (var y = 0; y < self.Caps_Count; y++) {
        for (var x = 0; x < self.Facings_X; x++) {

          let placeY = ctrl_position.PositionProductItems(self.Facings_Y - 1, x, self).y;
          let placeX = ctrl_position.PositionProductItems(self.Facings_Y - 1, x, self).x;
          placeY -= (y + 1) * self.Cap_Orientation_Height

          if (parentSpreadSpacer > 0) {
            placeX += (x * (parentSpreadSpacer - parentSquishValue));
          } else if (parentSquishValue > 0) {
            placeX -= (x * parentSquishValue);
          }

          let rect = new Konva.Image({
            name: 'cap-facing',
            x: placeX,
            y: placeY,
            width: self.Cap_Orientation_Width - parentSquishValue,
            height: self.Cap_Orientation_Height,
            fill: self.RandomColor,
            stroke: 'black',
            strokeWidth: 1,
            transformsEnabled: 'position'
          })

          let image_rect = new Konva.Image({
            name: 'cap-facing',
            listening: false
          })

          self.ProductRects.push(rect)
          self.Group.add(rect);

          if (self.Caps_Face.toUpperCase() === "FRONT") {
            image_rect.rotation(0);
            image_rect.image(self.image_front);

            image_rect.setX(rect.getX());
            image_rect.setY(rect.getY());

            image_rect.setX(rect.getX() + rect.width() / 2);
            image_rect.setY(rect.getY() + rect.height() / 2);

            image_rect.offset({
              x: self.caps_image_orientation_width / 2,
              y: self.caps_image_orientation_height / 2
            })

            image_rect.setWidth(self.caps_image_orientation_width);
            image_rect.setHeight(self.caps_image_orientation_height);

            image_rect.rotation(self.Cap_Rotation);

            self.ImageRects.push(image_rect);
            self.Group.add(image_rect);

          } else if (self.Caps_Face.toUpperCase() === "LEFT") {
            image_rect.rotation(0);
            image_rect.image(self.image_side);
            image_rect.setX(rect.getX() + rect.width() / 2);
            image_rect.setY(rect.getY() + rect.height() / 2);

            image_rect.offset({
              x: self.caps_image_orientation_width / 2,
              y: self.caps_image_orientation_height / 2
            })

            image_rect.setWidth(self.caps_image_orientation_width);
            image_rect.setHeight(self.caps_image_orientation_height);

            image_rect.rotation(self.Cap_Rotation);

            self.ImageRects.push(image_rect);
            self.Group.add(image_rect);

          } else if (self.Caps_Face.toUpperCase() === "TOP") {
            image_rect.rotation(0);
            image_rect.image(self.image_top);
            image_rect.setX(rect.getX() + rect.width() / 2);
            image_rect.setY(rect.getY() + rect.height() / 2);

            image_rect.offset({
              x: self.caps_image_orientation_width / 2,
              y: self.caps_image_orientation_height / 2
            })

            image_rect.setWidth(self.caps_image_orientation_width);
            image_rect.setHeight(self.caps_image_orientation_height);

            image_rect.rotation(self.Cap_Rotation);

            self.ImageRects.push(image_rect);
            self.Group.add(image_rect);
          }

          // image_rect.cache();
        }
      }
    }
    //#endregion Caps

    self.Cache();

    parentItem.Layer.batchDraw();

    // self.PositionElement();
    self.ToggleGroups();
    self.AddRemoveBordersAndBackground();

    //#region Calculate Facings
    self.Calculate_Facings();
    //#endregion

    //#region INDICATORS
    self.AddIndicator();
    //#endregion
  }

  //#endregion

  //#region Facings & Orientations

  IncreaseFacingsX() {
    let self = this;

    self.Facings_X++;

    self.IncreaseParentChildrenCounter(true, self.ParentID); // SFE
    self.UpdateMilkCrate(self.ParentID);
    self.Update();

    self.UpdateParent(self.ParentID);

    // self.ApplyZIndexing(self.ParentID);

    self.Group.draw();
  }

  IncreaseFacingsY() {
    let self = this;

    self.Facings_Y++;
    //TODO: Recreate products or draw them again
    self.UpdateMilkCrate(self.ParentID);
    self.Update();
    // self.ApplyZIndexing(self.ParentID);

    self.UpdateParent(self.ParentID);

    self.Group.draw();
  }

  DecreaseFacingsX() {
    let self = this;

    if (self.Facings_X > 1) {
      self.Facings_X--;
      //TODO: Recreate products or draw them again

      self.IncreaseParentChildrenCounter(true, self.ParentID); // SFE
      self.UpdateMilkCrate(self.ParentID);
      self.Update();

      self.UpdateParent(self.ParentID);

      // self.ApplyZIndexing(self.ParentID);
      self.Group.draw();
    }
  }

  DecreaseFacingsY() {
    let self = this;

    if (self.Facings_Y > 1) {
      self.Facings_Y--;
      //TODO: Recreate products or draw them again
      self.UpdateMilkCrate(self.ParentID);
      self.Update();
      // self.ParentTreeRedraw.RedrawParentDirectChildren(self.VueStore, self.ParentID);
      // self.AddProductDisplay();
      // self.ApplyZIndexing(self.ParentID);

      self.UpdateParent(self.ParentID);

      self.Group.draw();
    }
  }

  IncreaseCaps() {
    let self = this;

    this.Caps_Count++;
    //TODO: Recreate products or draw them again
    self.UpdateMilkCrate(self.ParentID);
    self.Update();
    // self.ParentTreeRedraw.RedrawParentDirectChildren(self.VueStore, self.ParentID);
    // self.AddProductDisplay();
    // self.ApplyZIndexing(self.ParentID);

    self.UpdateParent(self.ParentID);

    self.Group.draw();
  }

  DecreaseCaps() {
    let self = this;

    if (self.Caps_Count > 1) {
      this.Caps_Count--;
      //TODO: Recreate products or draw them again
      self.UpdateMilkCrate(self.ParentID);
      self.Update();

      self.UpdateParent(self.ParentID);
      // self.ParentTreeRedraw.RedrawParentDirectChildren(self.VueStore, self.ParentID);
      // self.AddProductDisplay();
      // self.ApplyZIndexing(self.ParentID);
      self.Group.draw();
    }
  }

  ChangeOrientation(face) {
    let self = this;
    self.LastFace = face;

    switch (face.toUpperCase()) {
      case "FRONT":
        {
          switch (self.Rotation) {
            case 0:
              {
                // no rotation
                self.Orientation_Width = self.ProductWidth;
                self.Orientation_Height = self.ProductHeight;
                self.Orientation_Depth = self.ProductDepth;

                self.image_used = self.image_front;

                self.image_orientation_width = self.Orientation_Width;
                self.image_orientation_height = self.Orientation_Height;

                // set cap details
                self.Caps_Face = "TOP";
                self.Cap_Orientation_Width = self.Orientation_Width;
                self.Cap_Orientation_Height = self.Orientation_Depth;
                self.Cap_Orientation_Depth = self.ProductHeight;
                self.caps_image_orientation_width = self.Cap_Orientation_Width;
                self.caps_image_orientation_height = self.Cap_Orientation_Height;
                self.Cap_Rotation = 0;
              }
              break;
            case 90:
              {
                // 90 degree rotation
                self.Orientation_Width = self.ProductHeight;
                self.Orientation_Height = self.ProductWidth;
                self.Orientation_Depth = self.ProductDepth;

                self.image_used = self.image_front;

                self.image_orientation_width = self.Orientation_Height;
                self.image_orientation_height = self.Orientation_Width;

                // set cap details
                self.Caps_Face = "LEFT";
                self.Cap_Orientation_Width = self.Orientation_Width;
                self.Cap_Orientation_Height = self.Orientation_Depth;
                self.Cap_Orientation_Depth = self.ProductWidth;
                self.caps_image_orientation_width = self.Cap_Orientation_Width;
                self.caps_image_orientation_height = self.Cap_Orientation_Height;
                self.Cap_Rotation = 0;
              }
              break;
            case 180:
              {
                // 180 degree rotation
                self.Orientation_Width = self.ProductWidth;
                self.Orientation_Height = self.ProductHeight;
                self.Orientation_Depth = self.ProductDepth;

                self.image_used = self.image_front;

                self.image_orientation_width = self.ProductWidth;
                self.image_orientation_height = self.ProductHeight;

                // set cap details
                self.Caps_Face = "TOP";
                self.Cap_Orientation_Width = self.Orientation_Width;
                self.Cap_Orientation_Height = self.Orientation_Depth;
                self.Cap_Orientation_Depth = self.ProductHeight;
                self.caps_image_orientation_width = self.Cap_Orientation_Width;
                self.caps_image_orientation_height = self.Cap_Orientation_Height;
                self.Cap_Rotation = 0;
              }
              break;
            case 270:
              {
                // 270 degree rotation
                self.Orientation_Width = self.ProductHeight;
                self.Orientation_Height = self.ProductWidth;
                self.Orientation_Depth = self.ProductDepth;

                self.image_used = self.image_front;

                self.image_orientation_width = self.Orientation_Height;
                self.image_orientation_height = self.Orientation_Width;

                // set cap details
                self.Caps_Face = "LEFT";
                self.Cap_Orientation_Width = self.Orientation_Width;
                self.Cap_Orientation_Height = self.Orientation_Depth;
                self.Cap_Orientation_Depth = self.ProductWidth;
                self.caps_image_orientation_width = self.Cap_Orientation_Width;
                self.caps_image_orientation_height = self.Cap_Orientation_Height;
                self.Cap_Rotation = 0;
              }
              break;
          }
        }
        break;
      case "LEFT":
        {
          switch (self.Rotation) {
            case 0:
              {
                // no rotation
                self.Orientation_Width = self.ProductDepth;
                self.Orientation_Height = self.ProductHeight;
                self.Orientation_Depth = self.ProductWidth;

                self.image_used = self.image_side;

                self.image_orientation_width = self.Orientation_Width;
                self.image_orientation_height = self.Orientation_Height;

                // set cap details
                self.Caps_Face = "TOP";
                self.Cap_Orientation_Width = self.ProductDepth;
                self.Cap_Orientation_Height = self.ProductWidth;
                self.Cap_Orientation_Depth = self.ProductHeight;
                self.caps_image_orientation_width = self.Cap_Orientation_Height;
                self.caps_image_orientation_height = self.Cap_Orientation_Width;
                self.Cap_Rotation = 90;
              }
              break;
            case 90:
              {
                // 90 degree rotation
                self.Orientation_Width = self.ProductHeight;
                self.Orientation_Height = self.ProductDepth;
                self.Orientation_Depth = self.ProductWidth;

                self.image_used = self.image_side;

                self.image_orientation_width = self.Orientation_Height;
                self.image_orientation_height = self.Orientation_Width;

                // set cap details
                self.Caps_Face = "FRONT";
                self.Cap_Orientation_Width = self.ProductHeight;
                self.Cap_Orientation_Height = self.ProductWidth;
                self.Cap_Orientation_Depth = self.ProductDepth;
                self.caps_image_orientation_width = self.Cap_Orientation_Height;
                self.caps_image_orientation_height = self.Cap_Orientation_Width;
                self.Cap_Rotation = 90;
              }
              break;
            case 180:
              {
                // 180 degree rotation
                self.Orientation_Width = self.ProductDepth;
                self.Orientation_Height = self.ProductHeight;
                self.Orientation_Depth = self.ProductWidth;

                self.image_used = self.image_side;

                self.image_orientation_width = self.Orientation_Width;
                self.image_orientation_height = self.Orientation_Height;

                // set cap details
                self.Caps_Face = "TOP";
                self.Cap_Orientation_Width = self.ProductDepth;
                self.Cap_Orientation_Height = self.ProductWidth;
                self.Cap_Orientation_Depth = self.ProductHeight;
                self.caps_image_orientation_width = self.Cap_Orientation_Height;
                self.caps_image_orientation_height = self.Cap_Orientation_Width;
                self.Cap_Rotation = 90;
              }
              break;
            case 270:
              {
                // 270 degree rotation
                self.Orientation_Width = self.ProductHeight;
                self.Orientation_Height = self.ProductDepth;
                self.Orientation_Depth = self.ProductWidth;

                self.image_used = self.image_side;

                self.image_orientation_width = self.Orientation_Height;
                self.image_orientation_height = self.Orientation_Width;

                // set cap details
                self.Caps_Face = "FRONT";
                self.Cap_Orientation_Width = self.ProductHeight;
                self.Cap_Orientation_Height = self.ProductWidth;
                self.Cap_Orientation_Depth = self.ProductDepth;
                self.caps_image_orientation_width = self.Cap_Orientation_Height;
                self.caps_image_orientation_height = self.Cap_Orientation_Width;
                self.Cap_Rotation = 90;
              }
              break;
          }
        }
        break;
      case "TOP":
        {
          switch (self.Rotation) {
            case 0:
              {
                // no rotation
                self.Orientation_Width = self.ProductWidth;
                self.Orientation_Height = self.ProductDepth;
                self.Orientation_Depth = self.ProductHeight;

                self.image_used = self.image_top;

                self.image_orientation_width = self.Orientation_Width;
                self.image_orientation_height = self.Orientation_Height;

                // set cap details
                self.Caps_Face = "FRONT";
                self.Cap_Orientation_Width = self.ProductWidth;
                self.Cap_Orientation_Height = self.ProductHeight;
                self.Cap_Orientation_Depth = self.ProductDepth;
                self.caps_image_orientation_width = self.Cap_Orientation_Width;
                self.caps_image_orientation_height = self.Cap_Orientation_Height;
                self.Cap_Rotation = 0;
              }
              break;
            case 90:
              {
                // 90 degree rotation
                self.Orientation_Width = self.ProductDepth;
                self.Orientation_Height = self.ProductWidth;
                self.Orientation_Depth = self.ProductHeight;

                self.image_used = self.image_top;

                self.image_orientation_width = self.Orientation_Height;
                self.image_orientation_height = self.Orientation_Width;

                // set cap details
                self.Caps_Face = "LEFT";
                self.Cap_Orientation_Width = self.ProductDepth;
                self.Cap_Orientation_Height = self.ProductHeight;
                self.Cap_Orientation_Depth = self.ProductWidth;
                self.caps_image_orientation_width = self.Cap_Orientation_Height;
                self.caps_image_orientation_height = self.Cap_Orientation_Width;
                self.Cap_Rotation = 90;
              }
              break;
            case 180:
              {
                // 180 degree rotation
                self.Orientation_Width = self.ProductWidth;
                self.Orientation_Height = self.ProductDepth;
                self.Orientation_Depth = self.ProductHeight;

                self.image_used = self.image_top;

                self.image_orientation_width = self.Orientation_Width;
                self.image_orientation_height = self.Orientation_Height;

                // set cap details
                self.Caps_Face = "FRONT";
                self.Cap_Orientation_Width = self.ProductWidth;
                self.Cap_Orientation_Height = self.ProductHeight;
                self.Cap_Orientation_Depth = self.ProductDepth;
                self.caps_image_orientation_width = self.Cap_Orientation_Width;
                self.caps_image_orientation_height = self.Cap_Orientation_Height;
                self.Cap_Rotation = 0;
              }
              break;
            case 270:
              {
                // 270 degree rotation
                self.Orientation_Width = self.ProductDepth;
                self.Orientation_Height = self.ProductWidth;
                self.Orientation_Depth = self.ProductHeight;

                self.image_used = self.image_top;

                self.image_orientation_width = self.Orientation_Height;
                self.image_orientation_height = self.Orientation_Width;

                // set cap details
                self.Caps_Face = "LEFT";
                self.Cap_Orientation_Width = self.ProductDepth;
                self.Cap_Orientation_Height = self.ProductHeight;
                self.Cap_Orientation_Depth = self.ProductWidth;
                self.caps_image_orientation_width = self.Cap_Orientation_Height;
                self.caps_image_orientation_height = self.Cap_Orientation_Width;
                self.Cap_Rotation = 90;
              }
              break;
          }
        }
        break;
    }

    console.log(self)

    self.IncreaseParentChildrenCounter(true, self.ParentID);
    self.UpdateMilkCrate(self.ParentID);
    self.Update();

    self.UpdateParent(self.ParentID);

    // self.AddProductDisplay();
    // self.ApplyZIndexing(self.ParentID);
    self.ToggleGroups();
    self.Group.draw();
  }

  Rotate() {
    let self = this;

    self.Rotation = (self.Rotation + 90) % 360;

    self.ChangeOrientation(self.LastFace);
    // TODO: recreate products in new orientation
    self.UpdateMilkCrate(self.ParentID);
    self.Update();

    self.UpdateParent(self.ParentID);
    self.ApplyZIndexing(self.ParentID);
    // self.AddProductDisplay();
  }

  //#endregion

  //#region Calculate Facings

  Calculate_Facings() {
    let self = this;

    let ctrl_store = new StoreHelper();
    let parentItem = ctrl_store.getPlanogramItemById(self.VueStore, self.ParentID);
    let qty = self.GetProductStateQuantity();

    if (parentItem == null || parentItem.Type == null) {
      console.error("CANNOT CALCULATE TOTAL FACINGS PRODUCT PARENT IS NULL");
      return;
    }

    if (parentItem.Type.toUpperCase() === "PEGBOARD") {
      // find the peg default depth
      let peg = parentItem.Data.defaultPegDetails;

      if (peg == null) {
        console.error("[PEGBOARD] Pegboar has no default peg assigned");
        self.TotalFacings = 1 * qty;
        return;
      }

      self.Facings_Z = Math.floor((peg.depth * self.Ratio) / (self.Orientation_Depth));
      self.TotalFacings = self.Facings_X * self.Facings_Y * self.Facings_Z * qty;

      // caps
      if (self.Caps_Enabled) {
        let cap_facings_y = self.Caps_Count;
        let cap_facings_x = self.Facings_X;
        let cap_facings_z = Math.floor((peg.depth * self.Ratio) / (self.Cap_Orientation_Depth));
        let totalCapsFacings = self.Facings_X * cap_facings_y * cap_facings_z * qty;

        self.TotalFacings += totalCapsFacings;
      }

    } else if (parentItem.Type.toUpperCase() === "PEGBAR") {
      // find the peg default depth
      let peg = parentItem.Data.defaultPegDetails;

      if (peg == null) {
        console.error("[PEGBAR] Pegbar has no default peg assigned");
        self.TotalFacings = 1 * qty;
        return;
      }

      self.Facings_Z = Math.floor((peg.depth * self.Ratio) / (self.Orientation_Depth));
      self.TotalFacings = self.Facings_X * self.Facings_Y * self.Facings_Z * qty;

      // caps
      if (self.Caps_Enabled) {
        let cap_facings_y = self.Caps_Count;
        let cap_facings_x = self.Facings_X;
        let cap_facings_z = Math.floor((peg.depth * self.Ratio) / (self.Cap_Orientation_Depth));
        let totalCapsFacings = self.Facings_X * cap_facings_y * cap_facings_z * qty;

        self.TotalFacings += totalCapsFacings;
      }


    } else if (parentItem.Type.toUpperCase() === "SHELF") {

      let actualDepth = (parentItem.Data.depth + parentItem.Data.overhang) * self.Ratio;

      self.Facings_Z = Math.floor((actualDepth) / (self.Orientation_Depth));
      self.TotalFacings = self.Facings_X * self.Facings_Y * self.Facings_Z * qty;

      // caps
      if (self.Caps_Enabled) {
        let cap_facings_y = self.Caps_Count;
        let cap_facings_x = self.Facings_X;
        let cap_facings_z = Math.floor((actualDepth) / (self.Cap_Orientation_Depth));
        let totalCapsFacings = self.Facings_X * cap_facings_y * cap_facings_z * qty;

        self.TotalFacings += totalCapsFacings;
      }
    }
    else if (parentItem.Type.toUpperCase() === "LABELHOLDER") {

      let actualDepth = (parentItem.Data.depth + parentItem.Data.overhang) * self.Ratio;

      self.Facings_Z = Math.floor((actualDepth) / (self.Orientation_Depth));
      self.TotalFacings = self.Facings_X * self.Facings_Y * self.Facings_Z * qty;

      // caps
      if (self.Caps_Enabled) {
        let cap_facings_y = self.Caps_Count;
        let cap_facings_x = self.Facings_X;
        let cap_facings_z = Math.floor((actualDepth) / (self.Cap_Orientation_Depth));
        let totalCapsFacings = self.Facings_X * cap_facings_y * cap_facings_z * qty;

        self.TotalFacings += totalCapsFacings;
      }
    } else if (parentItem.Type.toUpperCase() === "PALETTE") {

      let actualDepth = (parentItem.Data.depth + parentItem.Data.overhang) * self.Ratio;

      self.Facings_Z = Math.floor((actualDepth) / (self.Orientation_Depth));
      self.TotalFacings = self.Facings_X * self.Facings_Y * self.Facings_Z * qty;

      // caps
      if (self.Caps_Enabled) {
        let cap_facings_y = self.Caps_Count;
        let cap_facings_x = self.Facings_X;
        let cap_facings_z = Math.floor((actualDepth) / (self.Cap_Orientation_Depth));
        let totalCapsFacings = self.Facings_X * cap_facings_y * cap_facings_z * qty;

        self.TotalFacings += totalCapsFacings;
      }
    } else if (parentItem.Type.toUpperCase() === "BASE") {

      let actualDepth = (parentItem.Data.depth + parentItem.Data.overhang) * self.Ratio;

      self.Facings_Z = Math.floor((actualDepth) / (self.Orientation_Depth));
      self.TotalFacings = self.Facings_X * self.Facings_Y * self.Facings_Z * qty;

      // caps
      if (self.Caps_Enabled) {
        let cap_facings_y = self.Caps_Count;
        let cap_facings_x = self.Facings_X;
        let cap_facings_z = Math.floor((actualDepth) / (self.Cap_Orientation_Depth));
        let totalCapsFacings = self.Facings_X * cap_facings_y * cap_facings_z * qty;

        self.TotalFacings += totalCapsFacings;
      }
    } else if (parentItem.Type.toUpperCase() === "BASKET") {

      let actualDepth = (parentItem.Data.depth + parentItem.Data.overhang) * self.Ratio;

      self.Facings_Z = Math.floor((actualDepth) / (self.Orientation_Depth));
      self.TotalFacings = self.Facings_X * self.Facings_Y * self.Facings_Z * qty;

      // caps
      if (self.Caps_Enabled) {
        let cap_facings_y = self.Caps_Count;
        let cap_facings_x = self.Facings_X;
        let cap_facings_z = Math.floor((actualDepth) / (self.Cap_Orientation_Depth));
        let totalCapsFacings = self.Facings_X * cap_facings_y * cap_facings_z * qty;

        self.TotalFacings += totalCapsFacings;
      }
    }

    if (self.TotalFacings == 0) {
      self.TotalFacings = 1 * qty;
    }
  }


  //#endregion

  //#region Image from Barcode
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
      folder: "",
      file: ""
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
  //#endregion
}

export default ProductItemBase;