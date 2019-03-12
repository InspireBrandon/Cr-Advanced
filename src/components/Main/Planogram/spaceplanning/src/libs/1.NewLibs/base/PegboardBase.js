import Konva from 'konva';
import GeneralPositionHelper from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/positioning/GeneralPosition.js";
import LabelHelper from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/Labeling/LabelingBase.js";
import StoreHelper from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/StoreHelper/StoreHelper.js";
import PlanogramItemBase from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/PlanogramItemBase.js";
import CloneBase from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/CloneBase.js";
import ParentTreeRedraw from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/RedrawParentChildBase.js";

class PegboardBase extends PlanogramItemBase {
  constructor(vueStore, stage, layer, data, ratio, type, gondolaID) {
    super(vueStore, stage, layer, data, ratio, type, gondolaID);

    this.ParentTreeRedraw = new ParentTreeRedraw();
    this.Holes = [];
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

    self.Group.setWidth(self.TotalWidth)
    self.Group.setHeight(self.TotalHeight)
  }

  Build(dropPos, positionElementRequired = true) {
    let self = this;
    // TODO: add the extended method calls here
    self.AddRenderings();
    self.AddPegBarCosmetic();

    self.AddPanel();
    self.AddHoles();

    self.AddTextCosmetic();

    if (positionElementRequired == true) {
      self.PositionElement();
    }

    self.HideShowLabels();
    self.ApplyZIndexing();
    self.Layer.draw();
  }

  PositionElement(intersects = null) {
    let self = this;

    let ctrl_position = new GeneralPositionHelper();
    let ctrl_store = new StoreHelper();

    if (ctrl_store.getCloneItem(self.VueStore) == self.ID) {
      let ctrl_clone = new CloneBase("PEGBOARD");
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
        }
      }
    } else {
      self.Group.setY(self.LastPositionRelative.y)
      self.Group.setX(self.LastPositionRelative.x)
    }

    self.PositionPegboard();
  }

  PositionPegboard() {
    let self = this;
    self.Group.setX(0);
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
    self.AddHoles();
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

    self.ParentTreeRedraw.RedrawParentDirectChildren(self.VueStore, self.ID, true);
  }

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

  AddPegBarCosmetic() {
    let self = this;
  }

  AddTextCosmetic() {
    let self = this;

    self.Text = new Konva.Text({
      x: 0,
      y: 0,
      text: "PEGBOARD " + self.Position.toString(),
      fontFamily: 'Arial Black',
      fontSize: 12,
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

  AddHoles() {
    let self = this;
    return new Promise((resolve) => {
        let ySpace = self.Data.yHoleSpacing * self.Ratio;
        let xSpace = self.Data.xHoleSpacing * self.Ratio;
        let radius = self.Data.pegRadius * self.Ratio;
        let xHoles = parseInt(self.TotalWidth / ((xSpace) + (radius * 2)))
        let yHoles = parseInt(self.TotalHeight / ((ySpace) + (radius * 2)))

        // destroy first
        // if (self.Holes.length > 0) {
        //   self.Holes.forEach(hole => {
        //     hole.destroy();
        //   });
        // }

        self.Holes = [];

        let xPos = 0;
        let yPos = 0;

        for (var y = 0; y < yHoles; y++) {
          yPos = ((y) * ySpace) + ((y) * (radius * 2));
          for (var x = 0; x < xHoles; x++) {
            xPos = ((x + 1) * xSpace) + ((x + 1) * (radius * 2));
            // let holeKonva = new Konva.Circle({
            //   id: "pegboard_hole_id_x_y" + self.ID + "_" + x + "_" + y,
            //   name: "pegboard_peg",
            //   x: xPos,
            //   y: yPos,
            //   radius: radius,
            //   fill: 'black',
            //   listening: false
            // })
            // self.Group.add(holeKonva);
            
            let hole = {
              x: xPos,
              y: yPos
            }


            // hole.cache();
            self.Holes.push(hole);
            xPos += xSpace + (radius * 2);
          }
          xPos = xSpace + (radius);
        }

        self.Group.draw();
        resolve(true);
    });
  }

  AdjustBarPosition() {

  }
}

export default PegboardBase;