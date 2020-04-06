import Konva from 'konva';
import GeneralPositionHelper from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/positioning/GeneralPosition.js";
import LabelHelper from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/Labeling/LabelingBase.js";
import StoreHelper from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/StoreHelper/StoreHelper.js";
import PlanogramItemBase from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/PlanogramItemBase.js";
import CloneBase from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/CloneBase.js";
import ParentTreeRedraw from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/RedrawParentChildBase.js";

class AreaBase extends PlanogramItemBase {
  constructor(vueStore, stage, layer, data, ratio, type, gondolaID) {
    super(vueStore, stage, layer, data, ratio, type, gondolaID);

    this.Area = null;
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

    self.AddArea();
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
      let ctrl_clone = new CloneBase("AREA");
      ctrl_clone.Clone(self.VueStore, self.Stage, self, null, null, function () {
        // self.ParentTreeRedraw.RedrawParentDirectChildren(self.VueStore, self.ID);
      });
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

    self.PositionArea();
  }

  PositionArea() {
    let self = this;

    let ctrl_position = new GeneralPositionHelper();
    ctrl_position.PositionToParent(self.VueStore, self, self.ParentID) // IMPORTANT!

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
    self.Area.fill(self.Data.frontTransparent ? 'transparent' : self.Data.frontColor);
    self.Area.setWidth(self.TotalWidth); // sample
    self.Area.setHeight(self.TotalHeight); // sample
    self.Group.setWidth(self.TotalWidth);
    self.Group.setHeight(self.TotalHeight);
    self.HideShowLabels();

    if(self.Data.frontImageID == undefined || self.Data.frontImageID == null) {
      self.LoadImage(self.Area, "data:image/png;base64," + self.Data.image);
    } else {
      self.LoadImage(self.Area, process.env.VUE_APP_API + `FixtureImage?db=CR-Devinspire&fixtureImageID=${self.Data.frontImageID}`);
    }

    // self.LoadImage(self.Area, self.Data.image);

    // call position element
    self.PositionElement();

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
      console.log("[AREA RENDERING] FRONT", self.Data.RenderingsItems.Front);

      // add shelf edge rendering
      let w = self.Data.RenderingsItems.Front.width * self.Ratio;
      let h = self.Data.RenderingsItems.Front.height * self.Ratio;
      let offset = 0;

      if (self.Data.RenderingsItems.Front.yOffset != undefined) {
        offset = parseFloat(self.Data.RenderingsItems.Front.yOffset) * self.Ratio
      }

      let front = new Konva.Image({
        x: 0,
        y: 0 + offset,
        width: w,
        height: h,
        fill: self.Data.frontTransparent ? 'transparent' : self.Data.frontColor,
        listening: false
      })

      if(self.Data.RenderingsItems.Front.frontImageID == undefined || self.Data.RenderingsItems.Front.frontImageID == null) {
        self.LoadImage(front, "data:image/png;base64," + self.Data.RenderingsItems.Front.image);
      } else {
        self.LoadImage(front, process.env.VUE_APP_API + `FixtureImage?db=CR-Devinspire&fixtureImageID=${self.Data.RenderingsItems.Front.frontImageID}`);
      }

      // self.LoadImage(front, self.Data.RenderingsItems.Front.image);

      self.Renderings.push({
        type: 'FRONTRENDERING',
        konva: front
      });

      self.Group.add(front);
    }

    if (self.Data.RenderingsItems.Back != undefined || self.Data.RenderingsItems.Back != null) {
      // add shelf edge rendering
      console.log("[AREA RENDERING] BACK RENDERING", self.Data.RenderingsItems.Back);
      let w = self.Data.RenderingsItems.Back.width * self.Ratio;
      let h = self.Data.RenderingsItems.Back.height * self.Ratio;
      let offset = 0;

      if (self.Data.RenderingsItems.Back.yOffset != undefined) {
        offset = parseFloat(self.Data.RenderingsItems.Back.yOffset) * self.Ratio
      }

      var areaBack = new Konva.Image({
        x: 0,
        y: (h * -1) - offset,
        width: w,
        height: h,
        fill: self.Data.frontTransparent ? 'transparent' : self.Data.frontColor,
        listening: false
      })

      if(self.Data.RenderingsItems.Back.frontImageID == undefined || self.Data.RenderingsItems.Back.frontImageID == null) {
        self.LoadImage(areaBack, "data:image/png;base64," + self.Data.RenderingsItems.Back.image);
      } else {
        self.LoadImage(areaBack, process.env.VUE_APP_API + `FixtureImage?db=CR-Devinspire&fixtureImageID=${self.Data.RenderingsItems.Back.frontImageID}`);
      }

      // self.LoadImage(areaBack, self.Data.RenderingsItems.Back.image);

      self.Renderings.push({
        type: 'BACKRENDERING',
        konva: areaBack
      });

      self.Group.add(areaBack);
    }

    self.Layer.draw();
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
      fill: self.Data.frontTransparent ? 'transparent' : self.Data.frontColor
    })

    if(self.Data.frontImageID == undefined || self.Data.frontImageID == null) {
      self.LoadImage(self.Area, "data:image/png;base64," + self.Data.image);
    } else {
      self.LoadImage(self.Area, process.env.VUE_APP_API + `FixtureImage?db=CR-Devinspire&fixtureImageID=${self.Data.frontImageID}`);
    }

    // self.LoadImage(self.Area, self.Data.image);

    self.Group.add(self.Area);
  }

  AddTextCosmetic() {
    let self = this;

    self.Text = new Konva.Text({
      x: 0,
      y: 0,
      text: "AREA " + self.Position.toString(),
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

export default AreaBase;