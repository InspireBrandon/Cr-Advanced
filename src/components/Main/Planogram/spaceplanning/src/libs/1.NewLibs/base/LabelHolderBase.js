import Konva from 'konva';
import GeneralPositionHelper from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/positioning/GeneralPosition.js";
import LabelHelper from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/Labeling/LabelingBase.js";
import StoreHelper from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/StoreHelper/StoreHelper.js";
import PlanogramItemBase from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/PlanogramItemBase.js";
import CloneBase from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/CloneBase.js";
import ParentTreeRedraw from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/RedrawParentChildBase.js";

class LabelHolderBase extends PlanogramItemBase {
  constructor(vueStore, stage, layer, data, ratio, type, parentID) {
    super(vueStore, stage, layer, data, ratio, type, parentID);

    this.ParentID = parentID;
    this.ParentTreeRedraw = new ParentTreeRedraw();
    this.Area = null;
    this.HangingBar = null;
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
    self.AddPegBarCosmetic();

    self.AddHangingBar();
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
      let ctrl_clone = new CloneBase("PEGBAR");
      ctrl_clone.Clone(self.VueStore, self.Stage, self, null, null);
      ctrl_store.setCloneItem(self.VueStore, null);
      return;
    }
    
    if (intersects != null && intersects != undefined && intersects.intersects == true) {
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
      }
    } else {
      self.Group.setY(self.LastPositionRelative.y)
      self.Group.setX(self.LastPositionRelative.x)
    }

    self.PositionPegbar();
  }

  PositionPegbar() {
    let self = this;

    if (self.Data.float != undefined && self.Data.float != null && self.Data.float == true) {
      // self.Group.setX(0);
    } else {
      self.Group.setX(0);
    }

    // adjust label values + fixture positions
    let ctrl_label = new LabelHelper();
    ctrl_label.SetNewLabelAndPositionNumbers(self.VueStore);

    self.LastPositionRelative = self.Group.position();
    self.LastPositionAbsolute = self.Group.getAbsolutePosition();

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
    self.HangingBar.fill(self.Data.color);
    self.HangingBar.setWidth(self.TotalWidth); // sample
    self.HangingBar.setHeight(self.TotalHeight); // sample
    self.Group.setWidth(self.TotalWidth);
    self.Group.setHeight(self.TotalHeight);
    self.HideShowLabels();
    self.LoadImage(self.HangingBar, self.Data.image);

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

    if (self.Data.RenderingsItems.LabelHolder != undefined || self.Data.RenderingsItems.LabelHolder != null) {
      console.log("[LABEL HOLDER RENDERING] LABEL HOLDER", self.Data.RenderingsItems.LabelHolder);
      // add shelf edge rendering
      let w = self.Data.RenderingsItems.LabelHolder.width * self.Ratio;
      let h = self.Data.RenderingsItems.LabelHolder.height * self.Ratio;
      let offset = 0;

      if (self.Data.RenderingsItems.LabelHolder.yOffset != undefined) {
        offset = parseFloat(self.Data.RenderingsItems.LabelHolder.yOffset) * self.Ratio
      }

      let shelfLabelHolder = new Konva.Image({
        x: 0,
        y: 0 + offset,
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

  AddPegBarCosmetic() {
    let self = this;
  }

  AddHangingBar() {
    let self = this;

    self.HangingBar = new Konva.Image({
      x: 0,
      y: 0,
      width: self.Data.width * self.Ratio,
      height: self.Data.height * self.Ratio,
      fill: self.Data.color,
      transformsEnabled: 'position'
    })

    self.LoadImage(self.HangingBar, self.Data.image);

    self.Group.add(self.HangingBar);
  }

  AdjustBarPosition() {

  }
}

export default LabelHolderBase;