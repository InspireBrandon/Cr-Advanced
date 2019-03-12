import Konva from 'konva';
import axios from 'axios';
import GeneralPositionHelper from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/positioning/GeneralPosition.js";
import LabelHelper from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/Labeling/LabelingBase.js";
import StoreHelper from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/StoreHelper/StoreHelper.js";
import ProductItemBase from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/ProductItemBase.js";
import CloneBase from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/CloneBase.js";
import ParentTreeRedraw from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/RedrawParentChildBase.js";

class ProductBase extends ProductItemBase {
  constructor(vueStore, stage, layer, data, ratio, type, gondolaID) {
    super(vueStore, stage, layer, data, ratio, type, gondolaID);

    this.Indicator1 = null;
    this.Indicator2 = null;
    this.ParentTreeRedraw = new ParentTreeRedraw();
  }

  Initialise(dropPos, positionElementRequired = true) {
    let self = this;
    // add it to the store immediately
    self.AddToStore();

    self.BuildBase(dropPos);
    self.SetBaseDraggable(true);
    self.MoveThisToTop();

    // set width heights
    self.SetObjectDimensions();

    self.Build(dropPos, positionElementRequired);
  }

  SetObjectDimensions(milkCrateData = null) {
    let self = this;

    if (milkCrateData == null) {
      let parentSpreadSpacer = self.GetSpreadSpacing(self.ParentID);
      if (parentSpreadSpacer > 0) {
        self.TotalWidth = (self.Orientation_Width * self.Facings_X) + parentSpreadSpacer;
      } else {
        self.TotalWidth = (self.Orientation_Width * self.Facings_X);
      }
      self.Height = self.Data.height * self.Ratio;
      self.TotalHeight = self.Orientation_Height * self.Facings_Y + (self.Caps_Count * self.Cap_Orientation_Height);
      self.Group.setWidth(self.TotalWidth)
      self.Group.setHeight(self.TotalHeight)
    } else {
      self.Width = milkCrateData.size.width;
      self.Height = self.Data.height * self.Ratio;
      self.TotalWidth = milkCrateData.size.width;
      self.TotalHeight = self.Orientation_Height * self.Facings_Y + (self.Caps_Count * self.Cap_Orientation_Height);
      self.Group.setWidth(self.TotalWidth)
      self.Group.setHeight(self.TotalHeight)
    }
  }

  Build(dropPos, positionElementRequired = true) {
    let self = this;
    let ctrl_store = new StoreHelper();
    // TODO: add the extended method calls here
    self.AddRenderings();
    self.AddBaseCosmetic();

    self.AddTextCosmetic();
    self.ToggleGroups();
    // self.GetImages();
    self.AddProductDisplay();
    // self.Update();

    if (positionElementRequired == true) {
      self.UpdateMilkCrate(self.ParentID);
      self.Update();
      self.PositionElement();      
      let parentData = ctrl_store.getPlanogramItemById(self.VueStore, self.ParentID);
      if (parentData.Data.spreadProducts == "SE" || parentData.Data.spreadProducts == "SFE") {
        self.ParentTreeRedraw.RedrawParentDirectChildren(self.VueStore, self.ParentID);
      }
    } else {
      //
    }

    self.SetSelected(true);

    self.AddIndicator();

    self.Layer.draw();
  }

  PositionElement(intersects = null) {
    let self = this;

    let ctrl_position = new GeneralPositionHelper();
    let ctrl_store = new StoreHelper();

    if (ctrl_store.getCloneItem(self.VueStore) == self.ID) {
      let ctrl_clone = new CloneBase("PRODUCT");
      ctrl_clone.Clone(self.VueStore, self.Stage, self, null, null);
      ctrl_store.setCloneItem(self.VueStore, null);
      return;
    }

    // there are no intersects
    if (intersects == null || intersects == undefined) {
      self.Group.setY(self.LastPositionRelative.y)
      self.Group.setX(self.LastPositionRelative.x)
      self.LastPositionRelative = self.Group.position();
      self.LastPositionAbsolute = self.Group.getAbsolutePosition();
      self.PositionProduct();
      return;
    } else if (intersects.intersects == false) {
      self.Group.setY(self.LastPositionRelative.y)
      self.Group.setX(self.LastPositionRelative.x)
      self.LastPositionRelative = self.Group.position();
      self.LastPositionAbsolute = self.Group.getAbsolutePosition();
      self.PositionProduct();
      return;
    }

    if (intersects.ID != self.ParentID && intersects.ID != self.ID) {
      let parentItem = ctrl_store.getPlanogramItemById(self.VueStore, intersects.ID);
      self.MoveToParentGroup(parentItem);

      // force redraw before hand of previous parent
      self.ParentTreeRedraw.RedrawParentDirectChildren(self.VueStore, self.ParentID);

      self.ParentID = intersects.ID;
      // move this item to the new group

      self.Group.setY(intersects.ContainerPosition.y)
      self.Group.setX(intersects.ContainerPosition.x)

      // tmp test
      self.LastPositionRelative = intersects.ContainerPosition;
      self.LastPositionAbsolute = intersects.position;

      self.Update(); // update the display of products so that it can determine the new CAP

      let parentData = ctrl_store.getPlanogramItemById(self.VueStore, self.ParentID);
      if (parentData.Data.spreadProducts == "SE" || parentData.Data.spreadProducts == "SFE") {
        self.ParentTreeRedraw.RedrawParentDirectChildren(self.VueStore, self.ParentID);
      }
    } else {
      self.LastPositionRelative = self.Group.position();
      self.LastPositionAbsolute = self.Group.getAbsolutePosition();
    }

    self.PositionProduct();

    // console.log("[PEGBOARD PEG] PRODUCT POS ELEMENT", self.LastPositionRelative)
  }

  PositionProduct() {
    let self = this;

    let ctrl_store = new StoreHelper();
    let parentItem = ctrl_store.getPlanogramItemById(self.VueStore, self.ParentID);

    parentItem.ApplyZIndexing();
    
    let ctrl_position = new GeneralPositionHelper();
    ctrl_position.PositionToParent(self.VueStore, self, self.ParentID);

    // adjust label values + fixture positions
    let ctrl_label = new LabelHelper();
    ctrl_label.SetNewLabelAndPositionNumbers(self.VueStore);

    self.PositionToPeg(); // Will only move product if it belongs to a peg

    self.Layer.draw();
  }

  PositionToPeg() {
    let self = this;

    let ctrl_store = new StoreHelper();
    let parentItem = ctrl_store.getPlanogramItemById(self.VueStore, self.ParentID);
    let useDefaultsForPeg = false;

    if (parentItem.Type.toUpperCase() == "PEGBOARD") {

      if (parentItem.Data.defaultPegDetails == undefined || parentItem.Data.defaultPegDetails == null) {
        console.warn("[PEGBOARD PRODUCT] Cannot position product. Pegboard does not have a default peg in its {parentItem.Data.defaultPegDetails} object. Defaults of 1 cm will be used", parentItem.Data.defaultPegDetails, parentItem);
        useDefaultsForPeg = true;
        return;
      }

      let ySpace = parentItem.Data.yHoleSpacing * self.Ratio;
      let xSpace = parentItem.Data.xHoleSpacing * self.Ratio;
      let allPoints = parentItem.Holes;
      // TODO: Switch logic based on wire or hole
      let allocated = false;

      let item_x = self.Group.getX() + (self.TotalWidth / 2);
      let item_y = self.Group.getY();
      let itemWidth = 1;
      let itemHeight = 1;

      let item_rect = {
        x: item_x,
        y: item_y,
        width: itemWidth,
        height: itemHeight
      }

      allPoints.forEach(pegboardPeg => {
        if (allocated == false) {
          // let holeNewPos_x = pegboardPeg.getX() - xSpace;
          // let holeNewPos_y = pegboardPeg.getY() - ySpace;
          let holeNewPos_x = pegboardPeg.x// - xSpace;
          let holeNewPos_y = pegboardPeg.y// - ySpace;
          let holeNewWidth = useDefaultsForPeg == true ? 1 : (parentItem.Data.defaultPegDetails.width * self.Ratio) - 0.1;
          let holeNewHeight = useDefaultsForPeg == true ? 1 : (parentItem.Data.defaultPegDetails.height * self.Ratio) - 0.1;

          let peg_rect = {
            x: holeNewPos_x,
            y: holeNewPos_y,
            width: holeNewWidth,
            height: holeNewHeight
          }

          if (self.hasIntersection(peg_rect, item_rect)) {
            allocated = true;
            self.Group.setX(pegboardPeg.x - (self.TotalWidth / 2));
            self.Group.setY(pegboardPeg.y);
            self.LastPositionRelative = self.Group.position();
            self.LastPositionAbsolute = self.Group.getAbsolutePosition();

            // console.log("[PEGBOARD PEG] PRODUCT POS", pegboardPeg.x, pegboardPeg.y, self.LastPositionRelative)
          }
        }
      });
    }
  }

  hasIntersection(r1, r2) {
    return !(
      r2.x > r1.x + r1.width ||
      r2.x + r2.width < r1.x ||
      r2.y > r1.y + r1.height ||
      r2.y + r2.height < r1.y
    );
  }

  ChangeDimensions(eventData) {
    let self = this;
    let newObject = eventData;

    // adjust facings
    self.Facings_X = newObject.Facings_X;
    self.Facings_Y = newObject.Facings_Y;
    self.Facings_Z = newObject.Facings_Z;

    // adjust product dimensions
    self.Data = newObject.Data;
    
    self.SetProductStateData();
    self.GetImages(true); // force image reload

    self.SetObjectDimensions();
    self.ChangeOrientation(self.LastFace);

    return;
  }

  //#region INDICATORS
  AddIndicator() {
    // console.log("[PRODUCT] Show product indicators");
    let self = this;
    // TODO: Get this product inside ActiveProductItems store and test show indactor value for X/tick
    let storeResult = self.VueStore.getters.getPlanogramActiveProductById(self.Data.productID);

    if (storeResult == null) {
      return;
    }

    if (self.Indicator1 != null) {
      self.Indicator1.destroy();
    }

    if (self.Indicator2 != null) {
      self.Indicator2.destroy();
    }

    if (storeResult.Data.store_Range_Indicator == "NO") {

      self.Indicator1 = new Konva.Line({
        x: 0,
        y: 0,
        points: [0, 0, self.TotalWidth / 2, self.TotalHeight / 2, self.TotalWidth, self.TotalHeight],
        stroke: 'red',
        strokeWidth: 2,
        // lineCap: 'round',
        // lineJoin: 'round'
      })

      self.Indicator2 = new Konva.Line({
        x: 0,
        y: 0,
        points: [self.TotalWidth, 0, self.TotalWidth / 2, self.TotalHeight / 2, 0, self.TotalHeight],
        stroke: 'red',
        strokeWidth: 2,
        //lineCap: 'round',
        //lineJoin: 'round'
      })

      // console.log("[PRODUCT] Show product indicators - ", storeResult, "YES/NO/SELECTED: ", storeResult.Data.store_Range_Indicator, self.Indicator1);
      self.Group.add(self.Indicator1);
      self.Group.add(self.Indicator2);

      self.Indicator1.moveToTop()
      self.Indicator2.moveToTop()
    }

    self.Cache();
    self.Layer.draw();
  }
  //#endregion

  AddRenderings() {
    let self = this;

    if (self.Renderings.length > 0) {
      // TODO: Add the specified renderings

    }
  }

  RemoveRenderings() {
    let self = this;

    if (self.Renderings.length > 0) {
      // TODO: Remove the specified renderings

    }
  }

  AddBaseCosmetic() {
    let self = this;
  }

  AddTextCosmetic() {
    // let self = this;

    // self.Text = new Konva.Text({
    //   x: 0,
    //   y: 0,
    //   text: "BASE " + self.Position.toString(),
    //   fontFamily: 'Arial Black',
    //   fontSize: 12,
    //   padding: 1,
    //   fill: 'black'
    // })

    // self.Group.add(self.Text);
  }

  SetTextLabel(number) {
    let self = this;
    self.Position = number;
    self.Text.text(self.Type + " " + number);
    self.Group.draw();
  }

  AdjustBarPosition() {

  }

  //#region Product Stuff

  //#region Toggles

  ToggleImages() {
    let self = this;
    if (self.ImagesOn == true) {
      self.GetImages().then(result => {
        self.ImageRects.forEach(element => {
          element.show();
        });
  
        self.AddRemoveBordersAndBackground();
        
      })
    } else {
      self.ImageRects.forEach(element => {
        element.hide();
      });

      self.ProductRects.forEach(element => {
        element.fill(self.RandomColor);
        element.stroke('black');
        element.strokeWidth(0.5);
      });
    }

    // self.Group.draw();
    self.Stage.draw();
  }

  AddRemoveBordersAndBackground() {
    let self = this;

    self.ProductRects.forEach(element => {
      switch (self.LastFace.toUpperCase()) {
        case "FRONT":
          {
            if (self.ImageAvailable.front == true && self.ImagesOn == true) {
              element.fill('transparent');
              element.stroke('transparent');
              element.strokeWidth(0);
            } else {
              element.fill(self.RandomColor);
              element.fill(self.RandomColor);
              element.stroke('black');
              element.strokeWidth(0.5);
            }
          }
          break;
        case "LEFT":
          {
            if (self.ImageAvailable.side == true && self.ImagesOn == true) {
              element.fill('transparent');
              element.stroke('transparent');
              element.strokeWidth(0);
            } else {
              element.fill(self.RandomColor);
              element.fill(self.RandomColor);
              element.stroke('black');
              element.strokeWidth(0.5);
            }
          }
          break;
        case "TOP":
          {
            if (self.ImageAvailable.top == true && self.ImagesOn == true) {
              element.fill('transparent');
              element.stroke('transparent');
              element.strokeWidth(0);
            } else {
              element.fill(self.RandomColor);
              element.fill(self.RandomColor);
              element.stroke('black');
              element.strokeWidth(0.5);
            }
          }
          break;
      }

      if (element.name() == 'cap-facing') {
        switch (self.Caps_Face.toUpperCase()) {
          case "FRONT":
            {
              if (self.ImageAvailable.front == true && self.ImagesOn == true) {
                element.fill('transparent');
                element.stroke('transparent');
                element.strokeWidth(0);
              } else {
                element.fill(self.RandomColor);
                element.fill(self.RandomColor);
                element.stroke('black');
                element.strokeWidth(0.5);
              }
            }
            break;
          case "LEFT":
            {
              if (self.ImageAvailable.side == true && self.ImagesOn == true) {
                element.fill('transparent');
                element.stroke('transparent');
                element.strokeWidth(0);
              } else {
                element.fill(self.RandomColor);
                element.fill(self.RandomColor);
                element.stroke('black');
                element.strokeWidth(0.5);
              }
            }
            break;
          case "TOP":
            {
              if (self.ImageAvailable.top == true && self.ImagesOn == true) {
                element.fill('transparent');
                element.stroke('transparent');
                element.strokeWidth(0);
              } else {
                element.fill(self.RandomColor);
                element.fill(self.RandomColor);
                element.stroke('black');
                element.strokeWidth(0.5);
              }
            }
            break;
        }
      }
    });
  }

  ToggleLabels() {
    let self = this;

    if (self.labelsOn == true) {
      self.TextRects.forEach(element => {
        element.show()
      });
    } else {
      self.TextRects.forEach(element => {
        element.hide()
      });
    }

    self.Stage.draw();
  }

  ToggleGroupBoxOnOff() {
    let self = this;

    self.ToggleGroups();

    self.Group.draw();
  }

  ToggleCapsOnOff(value) {
    let self = this;

    self.Caps_Enabled = value;

    if (value == false)
      self.Caps_Count = 0;
    else
      self.Caps_Count = 1;

    self.UpdateMilkCrate(self.ParentID);
    self.Update();

    self.ParentTreeRedraw.RedrawParentDirectChildren(self.VueStore, self.ParentID);
    // self.AddProductDisplay();
    self.Group.draw();
  }

  //#endregion

  //#region Product Group box

  ToggleGroups() {
    let self = this;
    let placeY = 0;

    let ctrl_position = new GeneralPositionHelper();

    if (self.ProductGroupBox == null) {
      placeY = ctrl_position.PositionProductItems(self.Facings_Y - 1, self.Facings_X, self).y; //parentItem.ClientRect.getHeight() - ((self.Facings_Y) * self.Orientation_Height);
      placeY -= (self.Caps_Count) * self.Cap_Orientation_Height

      self.ProductGroupBox = new Konva.Rect({
        x: 0,
        y: placeY,
        width: self.TotalWidth,
        height: self.TotalHeight,
        stroke: 'black',
        strokeWidth: 1
      })

      self.Group.add(self.ProductGroupBox);
    }

    if (self.GroupsOn == false) {
      self.ProductGroupBox.hide();
    } else {
      self.ProductGroupBox.show();
    }

    self.ProductGroupBox.opacity(self.Selected == true ? 0.5 : 1);
    self.ProductGroupBox.fill(self.Selected == true ? '#1976d2' : self.RandomColor);

    self.AddText();
  }

  //#endregion

  //#region Text

  AddText() {
    let self = this;
    let ctrl_position = new GeneralPositionHelper();

    var strText = self.Data.description;

    if (self.ProductGroupBoxText == null) {

      let placeY = ctrl_position.PositionProductItems((self.Facings_Y + self.Caps_Count) - 1, self.Facings_X, self).y;
      self.ProductGroupBoxText = new Konva.Text({
        x: 0,
        y: placeY,
        width: self.TotalWidth,
        height: self.TotalHeight,
        wrap: 'word',
        text: strText,
        fontSize: 10,
        fontFamily: 'Arial',
        fill: 'black',
        padding: 2
      });
      self.ProductGroupBoxText.align('center');

      self.Group.add(self.ProductGroupBoxText);
    }

    if (self.GroupsOn == false) {
      self.ProductGroupBoxText.hide();
    } else {
      self.ProductGroupBoxText.show();
    }

    self.Group.draw();
  }

  //#endregion

  //#endregion

  //#region Indicators

  DisplayProductIndicator() {
    let self = this;
    self.AddIndicator();
  }

  //#endregion
}

export default ProductBase;