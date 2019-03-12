import Konva from 'konva';
import GeneralPositionHelper from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/positioning/GeneralPosition.js";
import LabelHelper from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/Labeling/LabelingBase.js";
import PalettePosition from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/positioning/PalettePosition.js";
import StoreHelper from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/StoreHelper/StoreHelper.js";
import PlanogramItemBase from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/PlanogramItemBase.js";
import CloneBase from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/CloneBase.js";

class PaletteBase extends PlanogramItemBase {
  constructor(vueStore, stage, layer, data, ratio, type, parentID) {
    super(vueStore, stage, layer, data, ratio, type, parentID);

    // AREA
    this.Area = null;

    // TAG
    this.Text = null;
  }

  /**
   * Initialises a new instance of the gondola and will call the build aspect to stage
   */
  Initialise(dropPos, positionElementRequired = true) {
    let self = this;
    // add it to the store immediately
    self.AddToStore();

    self.BuildBase(dropPos);
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
    self.AddRenderings();
    self.AddPanel();
    self.AddTextCosmetic();
    self.GetLabelValue();

    if (positionElementRequired == true) {
      self.PositionElement();
    }

    self.HideShowLabels();

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
      let ctrl_clone = new CloneBase("PALETTE");
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

    self.PositionPalette();
  }

  PositionPalette() {
    let self = this;
    self.Group.setX(0);

    // adjust label values + fixture positions
    let ctrl_label = new LabelHelper();
    ctrl_label.SetNewLabelAndPositionNumbers(self.VueStore);

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
    self.Area.fill(self.Data.color);
    self.Area.setWidth(self.TotalWidth); // sample
    self.Area.setHeight(self.TotalHeight); // sample
    self.Group.setWidth(self.TotalWidth);
    self.Group.setHeight(self.TotalHeight);
    self.HideShowLabels();
    self.LoadImage(self.Area, self.Data.image);

    // call position element
    self.PositionElement();

    // call direct children to reposition
    let childrenItems = ctrl_store.getAllPlanogramItems(self.VueStore, self.ID);
    childrenItems.forEach(child => {
      child.AdjustElementPosition(deltaChangeObj.deltaX, deltaChangeObj.deltaY, true);
      child.PositionElement();
    });

  }

  AddRenderings() {
    let self = this;

    if (self.Renderings.length > 0) {
      // TODO: Add the specified renderings by type

    }
  }

  // AddAreaCosmetic() {
  //   let self = this;
  //   self.Area = new Konva.Rect({
  //     x: 0,
  //     y: 0,
  //     width: self.Width,
  //     height: self.Height,
  //     fill: self.Data.color,
  //     stroke: 'black',
  //     strokeWidth: 0.5,
  //     transformsEnabled: 'position'
  //   })

  //   self.Group.add(self.Area);
  // }

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

  AddPanel() {
    let self = this;

    self.Area = new Konva.Image({
      x: 0,
      y: 0,
      width: self.TotalWidth,
      height: self.TotalHeight,
      fill: self.Data.color,
      transformsEnabled: 'position'
    })

    self.LoadImage(self.Area, self.Data.image);

    self.Group.add(self.Area);
  }

  SetTextLabel(number) {
    let self = this;
    self.Position = number;
    self.Text.text(self.Data.label + " " + number);
    self.Group.draw();
  }
}

export default PaletteBase;