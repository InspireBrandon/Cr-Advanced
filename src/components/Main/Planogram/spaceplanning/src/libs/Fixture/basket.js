import Konva from 'konva';
import EventBus from '@/components/Main/Planogram/spaceplanning/src/libs/EventBus/EventBus.js';
import CustomEmitter from '@/components/Main/Planogram/spaceplanning/src/libs/EventBus/CustomEmitter.js';
import IntersectDrop from "@/components/Main/Planogram/spaceplanning/src/libs/Intersection/drop-intersection-helper.js";
import SubFixtureBase from '@/components/Main/Planogram/spaceplanning/src/libs/BaseLibs/SubFixtureBase.js'
import PositioningBase from '@/components/Main/Planogram/spaceplanning/src/libs/BaseLibs/PositioningBase.js';

class Basket extends SubFixtureBase {
  constructor(VueStore, fixtureID, FixtureData, ratio) {
    super(VueStore, fixtureID, FixtureData, ratio)
  }

  Initialise(stage, dropPos) {
    let self = this;
    self.Stage = stage;
    let width = self.FixtureData.width * self.Ratio;
    let height = self.FixtureData.height * self.Ratio;

    self.Build(stage, width, height, dropPos);

    stage.draw();
  }

  Build(stage, w, h, dropPos) {
    let self = this;
    return new Promise(function (resolve) {
      self.Store_AddSubFixtureToFixture(self.FixtureID);

      self.AddLayer();
      self.AddGroup(w, h, dropPos);
      self.AddBar(w, h);
      self.AddClientRect();
      self.AddEvents(stage);

      resolve();
    });
  }

  AddLayer() {
    let self = this;
    let fixtureParent = self.Store_GetFixtureByID(self.FixtureID);
    let gondola = self.Store_GetGondola(fixtureParent.GondolaID);
    self.Layer = gondola.Layer;
  }

  AddGroup(w, h, position) {
    let self = this;
    let fixtureParent = self.Store_GetFixtureByID(self.FixtureID);
    let gondola = self.Store_GetGondola(fixtureParent.GondolaID);

    self.Group = new Konva.Group({
      id: 'basket_group_' + self.ID,
      name: 'basket_group',
      x: gondola.Group.getX(),
      y: position.y,
      width: w,
      height: h,
      draggable: true
    })

    self.Layer.add(self.Group);
  }

  AddBar(w, h) {
    let self = this;
    self.Bar = new Konva.Rect({
      x: 0,
      y: 0,
      width: w,
      height: h,
      fill: self.FixtureData.color
    })

    self.Group.add(self.Bar);
  }

  AddClientRect() {
    let self = this;

    self.ClientRectIntersection = {
      x: self.Group.getX(),
      y: self.Group.getY(),
      width: self.FixtureData.width * self.Ratio,
      height: self.FixtureData.height * self.Ratio
    }

    if (self.DrawClientRect) {
      self.ClientRect = new Konva.Image({
        id: "basket_client_rect_" + self.ID,
        name: 'basket_client_rect',
        x: self.ClientRectIntersection.x,
        y: self.ClientRectIntersection.y,
        width: self.ClientRectIntersection.width,
        height: self.ClientRectIntersection.height,
        fill: self.Type === "Base" ? 'black' : 'transparent',
        stroke: 'black',
        strokeWidth: 2,
        listening: false
      })
    } else {
      self.ClientRect = new Konva.Image({
        id: "basket_client_rect_" + self.ID,
        name: 'basket_client_rect',
        x: self.ClientRectIntersection.x,
        y: self.ClientRectIntersection.y,
        width: self.ClientRectIntersection.width,
        height: self.ClientRectIntersection.height,
        fill: 'transparent',
        listening: false
      })

      // self.ClientRect.opacity(0.2);
    }

    self.Layer.add(self.ClientRect);
  }

  AddEvents(stage) {
    let self = this;
    let clone = null;

    self.Group.on('dragstart', function () {
      //#region Visuals of product whilst moving
      self.ProductGroupArray.forEach(element => {
        element.Visual_Opacity(true);
      });
      self.Stage.draw();
      //#endregion
    })

    self.Group.on('dragend', function () {

      // test if an intersection with new gondola has been made

      if (clone == null) {
        let transform = self.Stage.getAbsoluteTransform().copy();
        // to detect relative position we need to invert transform
        transform.invert();
        // now we find relative point
        let pos = stage.getPointerPosition();
        let dropPos = transform.point(pos);

        let intersection_helper = new IntersectDrop();
        intersection_helper.DetermineSubFixtureIntersection(self.Stage, dropPos)
          .then(checkIntersection => {
            self.AddToFixture(checkIntersection);

            let fixtureItem = self.Store_GetFixture();
            fixtureItem.CalculateAllProductAndSubfixturePositions();
            self.DetermineFixturePosition();
          });
      }
      
     
      //#region Visuals of product whilst moving
      self.ProductGroupArray.forEach(element => {
        element.Visual_Opacity(false);
      });

      self.Stage.draw();
      //#endregion

      let LabelConfig = self.VueStore.getters.getLabelConfig;
      self.DetermineFixturePosition(LabelConfig.Order);
    })

    self.Group.on('dblclick', function () {
      self.Open_Modal();
    })
  }

  Open_Modal() {
    let self = this;
    let event = new CustomEmitter();
    let fullObject = {
      fixtureData: self.FixtureData,
      fixtureConfig: self.FixtureConfig
    }
    event.modal_load(EventBus, "SUBFIXTURE", "BASKET", fullObject, self.ID, self);
  }

  hasIntersection(r1, r2) {
    return !(
      r2.x > r1.x + (r1.width / 2) ||
      r2.x + (r2.width / 2) < r1.x ||
      r2.y > r1.y + r1.height ||
      r2.y + (r2.height / 2) < r1.y
    );
  }

  guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }
}

export default Basket;