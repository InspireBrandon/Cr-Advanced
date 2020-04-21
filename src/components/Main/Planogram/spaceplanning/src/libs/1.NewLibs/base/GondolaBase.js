import Konva from 'konva';
import GondolaPosition from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/positioning/GondolaPosition.js";
import StoreHelper from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/StoreHelper/StoreHelper.js";
import PlanogramItemBase from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/PlanogramItemBase.js";
import CloneBase from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/CloneBase.js";

class GondolaBase extends PlanogramItemBase {
  constructor(vueStore, stage, layer, data, ratio, type) {
    super(vueStore, stage, layer, data, ratio, type)

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

    self.Group.setWidth(self.TotalWidth);
    self.Group.setHeight(self.TotalHeight);

    self.Build(dropPos, positionElementRequired);
  }

  SetObjectDimensions() {
    let self = this;

    self.Width = self.Data.width * self.Ratio;
    self.Height = self.Data.height * self.Ratio;
    self.TotalWidth = self.Width;
    self.TotalHeight = self.Height;
  }

  Build(dropPos, positionElementRequired = true) {
    let self = this;

    // TODO: add the extended method calls here
    self.AddAreaCosmetic();
    self.AddTextCosmetic();

    if (positionElementRequired == true) {
      self.PositionElement();
    }

    self.AddRenderings();
    self.ApplyZIndexing();

    self.Stage.draw();
  }

  PositionElement() {
    let self = this;
    let ctrl_store = new StoreHelper();

    if (ctrl_store.getCloneItem(self.VueStore) == self.ID) {
      let ctrl_clone = new CloneBase("GONDOLA");
      ctrl_clone.Clone(self.VueStore, self.Stage, self, null, null);
      ctrl_store.setCloneItem(self.VueStore, null);
      return;
    }

    self.PositionGondola();
  }

  PositionGondola() {
    let self = this;

    let ctrl_positionGondola = new GondolaPosition();
    let ctrl_store = new StoreHelper();

    let y = ctrl_positionGondola.PositionToBottom(self.Stage, self);

    // get all gondolas
    let existingItemsOverall = ctrl_store.getAllPlanogramItems(self.VueStore);
    let existingItems = existingItemsOverall.filter((el) => el.Type.toUpperCase() == "GONDOLA")

    existingItems.sort((a, b) => (a.Group.getX() + (a.TotalWidth / 2)) - (b.Group.getX() + (b.TotalWidth / 2)));

    let newX = 0;
    existingItems.forEach((item, idx) => {
      item.Position = idx + 1;
      // item.Text.text(item.Position.toString());
      item.Group.setX(newX);
      newX += item.TotalWidth + 1;
    });

    self.Group.setY(y);
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
    self.Area.fill(self.Data.backTransparent ? 'transparent' : self.Data.backColor);
    self.Area.setWidth(self.TotalWidth); // sample
    self.Area.setHeight(self.TotalHeight); // sample
    self.Group.setWidth(self.TotalWidth);
    self.Group.setHeight(self.TotalHeight);

    if (self.Data.frontImageID != undefined && self.Data.frontImageID == null) {
      self.LoadImage(self.Area, process.env.VUE_APP_API + `FixtureImage?db=CR-Devinspire&fixtureImageID=${self.Data.frontImageID}`);
    } else if (self.Data.backImageID != undefined || self.Data.backImageID != null) {
      self.LoadImage(self.Area, process.env.VUE_APP_API + `FixtureImage?db=CR-Devinspire&fixtureImageID=${self.Data.backImageID}`);
    } else {
      self.LoadImage(self.Area, "data:image/png;base64," + self.Data.image);
    }

    // call position element
    self.PositionElement();

    // call direct children to reposition
    let childrenItems = ctrl_store.getAllPlanogramItems(self.VueStore, self.ID);
    childrenItems.forEach(child => {
      child.AdjustElementPosition(deltaChangeObj.deltaX, deltaChangeObj.deltaY, true);
      child.PositionElement();
    });

    self.AddRenderings();
    self.ApplyZIndexing();
  }

  AddRenderings() {
    let self = this;

    self.RemoveRenderings();
    console.log("AddRenderings", self.Data);

    if (self.Data.RenderingsItems == undefined || self.Data.RenderingsItems == null) {
      return;
    }

    if (self.Data.RenderingsItems.Front != undefined || self.Data.RenderingsItems.Front != null) {
      console.log("[GONDOLA RENDERING] FRONT FACE", self.Data.RenderingsItems.Front);

      // add shelf edge rendering
      let w = self.Data.RenderingsItems.Front.width * self.Ratio;
      let h = self.Data.RenderingsItems.Front.height * self.Ratio;

      let frontFace = new Konva.Image({
        x: 0,
        y: 0,
        width: w,
        height: h,
        fill: self.Data.backTransparent ? 'transparent' : self.Data.backColor,
        // color: self.Data.backColor,
        listening: false
      })

      if (self.Data.RenderingsItems.Front.frontImageID == undefined || self.Data.RenderingsItems.Front.frontImageID == null) {
        self.LoadImage(self.Area, "data:image/png;base64," + self.Data.RenderingsItems.Front.image);
      } else {
        self.LoadImage(self.Area, process.env.VUE_APP_API + `FixtureImage?db=CR-Devinspire&fixtureImageID=${self.Data.RenderingsItems.Front.frontImageID}`);
      }

      self.Renderings.push({
        type: 'FRONTRENDERING',
        konva: frontFace
      });

      self.Group.add(frontFace);
    }
  }

  RemoveRenderings() {
    let self = this;

    self.Renderings.forEach(element => {
      element.konva.destroy();
    });

    self.Renderings = [];
  }

  AddAreaCosmetic() {
    let self = this;
    self.Area = new Konva.Image({
      x: 0,
      y: 0,
      width: self.Width,
      height: self.Height,
      fill: self.Data.backTransparent ? 'transparent' : self.Data.backColor,
      // color: self.Data.backColor,
      // stroke: 'black',
      // strokeWidth: 0.5,
      transformsEnabled: 'position'
    })

    console.log("FI ID", self.Data);

    if (self.Data.frontImageID != undefined && self.Data.frontImageID != null) {
      self.LoadImage(self.Area, process.env.VUE_APP_API + `FixtureImage?db=CR-Devinspire&fixtureImageID=${self.Data.frontImageID}`);
    } else if (self.Data.backImageID != undefined || self.Data.backImageID != null) {
      self.LoadImage(self.Area, process.env.VUE_APP_API + `FixtureImage?db=CR-Devinspire&fixtureImageID=${self.Data.backImageID}`);
    } else {
      self.LoadImage(self.Area, "data:image/png;base64," + self.Data.image);
    }

    self.Group.add(self.Area);
  }

  AddTextCosmetic() {
    // let self = this;

    // self.Text = new Konva.Text({
    //   x: 0,
    //   y: 0,
    //   text: self.Position.toString(),
    //   fontFamily: 'Calibri',
    //   fontSize: 18,
    //   padding: 5,
    //   fill: 'black',
    //   transformsEnabled: 'position'
    // })

    // self.Group.add(self.Text);
  }
}

export default GondolaBase;