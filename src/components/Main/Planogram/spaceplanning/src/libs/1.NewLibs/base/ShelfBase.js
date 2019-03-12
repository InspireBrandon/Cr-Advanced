import Konva from 'konva';
import GeneralPositionHelper from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/positioning/GeneralPosition.js";
import LabelHelper from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/Labeling/LabelingBase.js";
import StoreHelper from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/StoreHelper/StoreHelper.js";
import PlanogramItemBase from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/PlanogramItemBase.js";
import CloneBase from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/CloneBase.js";
import ParentTreeRedraw from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/RedrawParentChildBase.js";

class ShelfBase extends PlanogramItemBase {
  constructor(vueStore, stage, layer, data, ratio, type, gondolaID) {
    super(vueStore, stage, layer, data, ratio, type, gondolaID);

    this.Bar = null;
    this.ParentTreeRedraw = new ParentTreeRedraw();
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

    self.Group.setWidth(self.TotalWidth)
    self.Group.setHeight(self.TotalHeight)
  }

  Build(dropPos, positionElementRequired = true) {
    let self = this;
    // TODO: add the extended method calls here
    self.AddShelfCosmetic();

    self.AddBar();
    self.AddTextCosmetic();
    self.GetLabelValue();

    if (positionElementRequired == true) {
      self.PositionElement();
    }

    self.HideShowLabels();
    self.AddRenderings();
    self.ApplyZIndexing();

    self.Layer.draw();
  }

  GetLabelValue() {
    let self = this;
    let ctrl_label = new LabelHelper();
    ctrl_label.SetNewLabelAndPositionNumbers(self.VueStore);
  }

  PositionElement(intersects = null) {
    let self = this;

    let ctrl_position = new GeneralPositionHelper();
    let ctrl_store = new StoreHelper();

    if (ctrl_store.getCloneItem(self.VueStore) == self.ID) {
      let ctrl_clone = new CloneBase("SHELF");
      ctrl_clone.Clone(self.VueStore, self.Stage, self, null, null);
      ctrl_store.setCloneItem(self.VueStore, null);
      return;
    }

    if (intersects != null) {

      if (intersects != undefined && intersects.intersects == true) {
        if (intersects.ID != self.ParentID && intersects.ID != self.ID) {
          // adust the previous parent after a move
          let prevParent = ctrl_store.getPlanogramItemById(self.VueStore, self.ParentID);
          if (prevParent != null && prevParent != null) {
            prevParent.PositionElement();
          }

          ctrl_position.PositionToParent(self.VueStore, null, self.ParentID) // IMPORTANT!

          self.ParentID = intersects.ID;
          // move this item to the new group
          let gondolaItem = ctrl_store.getPlanogramItemById(self.VueStore, self.ParentID);
          self.MoveToParentGroup(gondolaItem);

          self.Group.setY(intersects.ContainerPosition.y)
          self.Group.setX(intersects.ContainerPosition.x)

        }
      }
    } else {
      self.Group.setY(self.LastPositionRelative.y)
      self.Group.setX(self.LastPositionRelative.x)
    }

    self.PositionShelf();
  }

  PositionShelf() {
    let self = this;

    self.Group.setX(0);

    // adjust label values + fixture positions
    let ctrl_label = new LabelHelper();
    ctrl_label.SetNewLabelAndPositionNumbers(self.VueStore);

    self.LastPositionRelative = self.Group.position();
    self.LastPositionAbsolute = self.Group.getAbsolutePosition();

    self.ApplyZIndexing();

    self.Layer.draw();
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
    self.Bar.fill(self.Data.color);
    self.Bar.setWidth(self.TotalWidth); // sample
    self.Bar.setHeight(self.TotalHeight); // sample
    self.Group.setWidth(self.TotalWidth);
    self.Group.setHeight(self.TotalHeight);
    self.HideShowLabels();
    self.LoadImage(self.Bar, self.Data.image);
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

    if (self.Data.RenderingsItems.ShelfEdge != undefined || self.Data.RenderingsItems.ShelfEdge != null) {
      console.log("[SHELF RENDERING] SHELF EDGE", self.Data.RenderingsItems.ShelfEdge);
      
      // add shelf edge rendering
      let w = self.Data.RenderingsItems.ShelfEdge.width * self.Ratio;
      let h = self.Data.RenderingsItems.ShelfEdge.height * self.Ratio;

      let shelfEdge = new Konva.Image({
        x: 0,
        y: (h * -1),
        width: w,
        height: h,
        color: 'transparent',
        listening: false
      })

      self.LoadImage(shelfEdge, self.Data.RenderingsItems.ShelfEdge.image);

      self.Renderings.push({
        type: 'SHELFEDGE',
        konva: shelfEdge
      });

      self.Group.add(shelfEdge);
    }

    if (self.Data.RenderingsItems.LabelHolder != undefined || self.Data.RenderingsItems.LabelHolder != null) {
      console.log("[SHELF RENDERING] LABEL HOLDER", self.Data.RenderingsItems.LabelHolder);
      // add shelf edge rendering
      let w = self.Data.RenderingsItems.LabelHolder.width * self.Ratio;
      let h = self.Data.RenderingsItems.LabelHolder.height * self.Ratio;

      let shelfLabelHolder = new Konva.Image({
        x: 0,
        y: 0,
        width: w,
        height: h,
        color: 'transparent',
        listening: false
      })

      self.LoadImage(shelfLabelHolder, self.Data.RenderingsItems.LabelHolder.image);

      self.Renderings.push({
        type: 'LABELHOLDER',
        konva: shelfLabelHolder
      });

      self.Group.add(shelfLabelHolder);
    }

    if (self.Data.RenderingsItems.Back != undefined || self.Data.RenderingsItems.Back != null) {
      // add shelf edge rendering
      console.log("[SHELF RENDERING] BACK RENDERING", self.Data.RenderingsItems.Back);
      let w = self.Data.RenderingsItems.Back.width * self.Ratio;
      let h = self.Data.RenderingsItems.Back.height * self.Ratio;

      var shelfBack = new Konva.Image({
        x: 0,
        y: (h * -1),
        width: w,
        height: h,
        color: 'transparent',
        listening: false
      })

      self.LoadImage(shelfBack, self.Data.RenderingsItems.Back.image);

      self.Renderings.push({
        type: 'BACKRENDERING',
        konva: shelfBack
      });

      self.Group.add(shelfBack);
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

  AddBar() {
    let self = this;

    self.Bar = new Konva.Image({
      x: 0,
      y: 0,
      width: self.Data.width * self.Ratio,
      height: self.Data.height * self.Ratio,
      fill: self.Data.color
    })

    self.LoadImage(self.Bar, self.Data.image);

    self.Group.add(self.Bar);
  }

  AddTextCosmetic() {
    let self = this;

    self.Text = new Konva.Text({
      x: 0,
      y: 0,
      text: "SHELF " + self.Position.toString(),
      fontFamily: 'Arial Black',
      fontSize: 12,
      padding: 1,
      fill: 'black'
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

export default ShelfBase;