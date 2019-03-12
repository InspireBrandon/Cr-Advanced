import Konva from 'konva';
import GeneralPositionHelper from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/positioning/GeneralPosition.js";
import LabelHelper from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/Labeling/LabelingBase.js";
import StoreHelper from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/StoreHelper/StoreHelper.js";
import PlanogramItemBase from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/PlanogramItemBase.js";
import CloneBase from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/CloneBase.js";
import ParentTreeRedraw from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/RedrawParentChildBase.js";

class BasketBase extends PlanogramItemBase {
  constructor(vueStore, stage, layer, data, ratio, type, gondolaID) {
    super(vueStore, stage, layer, data, ratio, type, gondolaID);

    this.ParentTreeRedraw = new ParentTreeRedraw();
    this.Area = null;
  }

  Initialise(dropPos, positionElementRequired = true) {
    let self = this;
    // add it to the store immediately
    self.AddToStore();

    self.BuildBase(dropPos);
    self.SetBaseDraggable(true);

    // set width heights
    self.SetObjectDimensions();

    self.Build(dropPos, positionElementRequired);
  }

  SetObjectDimensions() {
    let self = this;

    self.Width = self.Data.width * self.Ratio;
    self.Height = self.Data.height * self.Ratio;
    self.TotalWidth = self.Width;
    self.TotalHeight = self.Height;

    self.Group.setWidth(self.TotalWidth);
    self.Group.setHeight(self.TotalHeight);

  }

  Build(dropPos, positionElementRequired = true) {
    let self = this;
    // TODO: add the extended method calls here
    self.AddShelfCosmetic();

    self.AddArea();
    self.AddTextCosmetic();

    if (positionElementRequired == true) {
      self.PositionElement();
    }

    self.HideShowLabels();
    self.AddRenderings();
    self.ApplyZIndexing();

    self.Layer.draw();
  }

  PositionElement(intersects = null) {
    let self = this;
    let ctrl_position = new GeneralPositionHelper();
    let ctrl_store = new StoreHelper();

    if (ctrl_store.getCloneItem(self.VueStore) == self.ID) {
      let ctrl_clone = new CloneBase("BASKET");
      ctrl_clone.Clone(self.VueStore, self.Stage, self, null, null);
      ctrl_store.setCloneItem(self.VueStore, null);
      return;
    }

    // there are no intersects
    if (intersects == null || intersects == undefined) {
      self.Group.setY(self.LastPositionRelative.y)
      self.Group.setX(self.LastPositionRelative.x)
      self.PositionBasket();
      return;
    } else if (intersects.intersects == false) {
      self.Group.setY(self.LastPositionRelative.y)
      self.Group.setX(self.LastPositionRelative.x)
      self.PositionBasket();
      return;
    }

    if (intersects.ID != self.ParentID && intersects.ID != self.ID) {
      let parentItem = ctrl_store.getPlanogramItemById(self.VueStore, intersects.ID);
      self.MoveToParentGroup(parentItem);
      // adust the previous parent after a move

      // let prevParent = ctrl_store.getPlanogramItemById(self.VueStore, self.ParentID);
      // if (prevParent != undefined && prevParent != null) {
      //   console.log("[BASKET]", "PREV PARENT", prevParent, "NEW PARENT", parentItem);
      //   prevParent.PositionElement();
      // }

      self.LastPositionRelative = intersects.ContainerPosition;
      self.LastPositionAbsolute = intersects.position;

      // ctrl_position.PositionToParent(self.VueStore, null, self.ParentID) // IMPORTANT!
      self.ParentID = intersects.ID;
      // move this item to the new group

      self.Group.setY(intersects.ContainerPosition.y)
      self.Group.setX(intersects.ContainerPosition.x)
    } else {
      self.LastPositionRelative = self.Group.position();
      self.LastPositionAbsolute = self.Group.getAbsolutePosition();
    }

    self.PositionBasket();
  }

  PositionBasket() {
    let self = this;
    
    let ctrl_store = new StoreHelper();
    let ctrl_position = new GeneralPositionHelper();
    ctrl_position.PositionToParent(self.VueStore, self, self.ParentID);

    // adjust label values + fixture positions
    let ctrl_label = new LabelHelper();
    ctrl_label.SetNewLabelAndPositionNumbers(self.VueStore);

    if (self.Data.snapLeft != undefined && self.Data.snapLeft != null && self.Data.snapLeft == true) {
      self.Group.setX(0);
    } else if (self.Data.snapRight != undefined && self.Data.snapRight != null && self.Data.snapRight == true) {
      let parentItem = ctrl_store.getPlanogramItemById(self.VueStore, self.ParentID);
      let xPos = parentItem.TotalWidth - self.TotalWidth;
      self.Group.setX(xPos); 
    }
    else {
      self.PositionToPeg(); // Will only move product if it belongs to a peg
    }

    self.Layer.draw();
  }

  PositionToPeg() {
    let self = this;

    let ctrl_store = new StoreHelper();
    let parentItem = ctrl_store.getPlanogramItemById(self.VueStore, self.ParentID);

    if (parentItem.Type.toUpperCase() == "PEGBOARD") {
      let ySpace = parentItem.Data.yHoleSpacing * self.Ratio;
      let xSpace = parentItem.Data.xHoleSpacing * self.Ratio;
      let allPoints = parentItem.Holes;
      // TODO: Switch logic based on wire or hole
      let allocated = false;
      allPoints.forEach(pegboardPeg => {
        if (allocated == false) {
          // let holeNewPos_x = pegboardPeg.getX() - xSpace;
          // let holeNewPos_y = pegboardPeg.getY() - ySpace;
          let holeNewPos_x = pegboardPeg.x - xSpace;
          let holeNewPos_y = pegboardPeg.y - ySpace;
          let holeNewWidth = xSpace * 2;
          let holeNewHeight = ySpace * 2;

          // let item_x = newPos.x + (currentItem.Group.getWidth() / 2);
          // let item_y = newPos.y;
          let item_x = self.Group.getX() + (self.TotalWidth / 2);
          let item_y = self.Group.getY();
          let itemWidth = 1;
          let itemHeight = 1;

          let peg_rect = {
            x: holeNewPos_x,
            y: holeNewPos_y,
            width: holeNewWidth,
            height: holeNewHeight
          }

          let item_rect = {
            x: item_x,
            y: item_y,
            width: itemWidth,
            height: itemHeight
          }

          if (self.hasIntersection(peg_rect, item_rect)) {
            allocated = true;
            self.Group.setX(pegboardPeg.x - (self.TotalWidth / 2));
            self.Group.setY(pegboardPeg.y);
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
    let ctrl_store = new StoreHelper();

    let lastData = self.Data;
    let newData = eventData.data;

    let deltaChangeObj = self.AdjustMasterGroupPositionAfterDimensionChange(lastData, newData)
    self.AdjustElementPosition(deltaChangeObj.deltaX, deltaChangeObj.deltaY);

    self.Data = newData;
    self.SetObjectDimensions();
    self.Area.fill(self.Data.color);
    self.Area.setWidth(self.TotalWidth); // sample
    self.Area.setHeight(self.TotalHeight); // sample
    self.Group.setWidth(self.TotalWidth);
    self.Group.setHeight(self.TotalHeight);

    self.HideShowLabels();
    // call position element
    self.PositionElement();

    // call direct children to reposition
    let childrenItems = ctrl_store.getAllPlanogramItems(self.VueStore, self.ID);
    childrenItems.forEach(child => {
      child.AdjustElementPosition(deltaChangeObj.deltaX, deltaChangeObj.deltaY, true);
      child.PositionElement();
    });

    self.ParentTreeRedraw.RedrawParentDirectChildren(self.VueStore, self.ID);

    self.AddRenderings();
    self.ApplyZIndexing();
  }

  AddRenderings() {
    let self = this;

    self.RemoveRenderings();

    if (self.Data.RenderingsItems == undefined || self.Data.RenderingsItems == null) {
      return;
    }

    if (self.Data.RenderingsItems.Front != undefined || self.Data.RenderingsItems.Front != null) {
      // console.log("[BASKET RENDERING] FRONT FACE", self.Data.RenderingsItems.Front);

      // add shelf edge rendering
      let w = self.Data.RenderingsItems.Front.width * self.Ratio;
      let h = self.Data.RenderingsItems.Front.height * self.Ratio;
      let offset = 0;

      if (self.Data.RenderingsItems.Front.yOffset != undefined) {
        offset = parseInt(self.Data.RenderingsItems.Front.yOffset)
      }

      let front = new Konva.Image({
        x: 0,
        y: self.TotalHeight - h + (offset),
        width: w,
        height: h,
        color: 'transparent',
        listening: false
      })

      self.LoadImage(front, self.Data.RenderingsItems.Front.image);

      self.Renderings.push({
        type: 'FRONTRENDERING',
        konva: front
      });

      self.Group.add(front);
    }

    self.Layer.draw();
    // self.Group.draw();
  }

  RemoveRenderings() {
    let self = this;

    self.Renderings.forEach(element => {
      element.konva.destroy();
    });

    self.Renderings = [];
  }

  AddShelfCosmetic() {
    let self = this;
  }

  AddArea() {
    let self = this;

    self.Area = new Konva.Image({
      x: 0,
      y: 0,
      width: self.Data.width * self.Ratio,
      height: self.Data.height * self.Ratio,
      fill: self.Data.color,
      stroke: 'black',
      strokeWidth: 0.5,
      transformsEnabled: 'position'
    })

    self.LoadImage(self.Area, self.Data.image);

    self.Group.add(self.Area);
  }

  AddTextCosmetic() {
    let self = this;

    self.Text = new Konva.Text({
      x: 0,
      y: 0,
      text: "BASKET " + self.Position.toString(),
      fontFamily: 'Arial Black',
      fontSize: 10,
      padding: 1,
      fill: 'black',
      transformsEnabled: 'position'
    })

    self.Group.add(self.Text);
  }

  SetTextLabel(number) {
    let self = this;
    self.Position = number;
    self.Text.text(self.Data.label + " " + number);
    self.Group.draw();
  }

  AdjustBarPosition() {

  }
}

export default BasketBase;