import Konva from 'konva';
import EntityHelper from '@/components/Main/Planogram/spaceplanning/src/libs/EntityHelper/entity-helper.js'
import EventBus from '@/components/Main/Planogram/spaceplanning/src/libs/EventBus/EventBus.js';
import CustomEmitter from '@/components/Main/Planogram/spaceplanning/src/libs/EventBus/CustomEmitter.js';
import FixtureBase from '@/components/Main/Planogram/spaceplanning/src/libs/BaseLibs/FixtureBase.js'

class PegBar extends FixtureBase {
  constructor(VueStore, gondolaID, FixtureData, ratio) {
    super(VueStore, gondolaID, FixtureData, ratio)

    this.EventBus = null;
    this.ShelfBar = null;
    this.ShelfLabel = null;
    this.Rendering = null;
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
      self.AddLayer();
      self.AddGroup(w, h, dropPos);
      self.AddBar(w, h);
      self.AddClientRect();
      self.AddEvents(stage);

      self.Store_AddToGondola();

      // once all built, call calculate on all shelves within this gondola
      self.CallFixture_CalculateShelfHeightsForGondola(self.GondolaID);
      resolve();
    });
  }

  AddLayer() {
    let self = this;
    let gondola = self.Store_GetGondola();
    self.Layer = gondola.Layer;
  }

  AddGroup(w, h, position) {
    let self = this;
    let gondola = self.Store_GetGondola();

    self.Group = new Konva.Group({
      id: 'pegbar_group_' + self.ID,
      name: 'pegbar_group',
      x: gondola.Group.getX(),
      y: position.y,
      width: w,
      height: h,
      draggable: true,
      dragBoundFunc: function (pos) {

        let gondola = self.Store_GetGondola();

        let x = this.getAbsolutePosition().x;
        let y = gondola.Group.getY() + gondola.Group.getHeight() - (self.FixtureData.height * self.Ratio);

        //#region Pop out of gondola
        if (pos.x > (gondola.Group.getAbsolutePosition().x + (self.ClientRect.getWidth() / 2))) {
          x = pos.x;
        }

        if (pos.x < gondola.Group.getAbsolutePosition().x - (self.ClientRect.getWidth() / 2)) {
          x = pos.x;
        }
        //#endregion Pop out of gondola

        if (pos.y < y) {
          y = pos.y;
        }

        if (pos.y < gondola.Group.getY()) {
          y = gondola.Group.getY()
        }

        return {
          x: x,
          y: y
        }
      }
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
        id: "pegbar_client_rect_" + self.ID,
        name: 'pegbar_client_rect',
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
        id: "pegbar_client_rect_" + self.ID,
        name: 'pegbar_client_rect',
        x: self.ClientRectIntersection.x,
        y: self.ClientRectIntersection.y,
        width: self.ClientRectIntersection.width,
        height: self.ClientRectIntersection.height,
        fill: 'transparent',
        listening: false
      })
    }

    self.Layer.add(self.ClientRect);
  }

  AddEvents(stage) {
    let self = this;

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

      let hasIntersection = false;
      let master_gondola = self.Store_GetGondola();
      let activeGondolaInstance = null;
      let gondolas = stage.find(".gondola_group");
      for (let i = 0; i < gondolas.length; i++) {
        let gondola = gondolas[i];
        let gondola_id = gondola.getId().replace("gondola_group_", "");
        let gondolaInstance = self.VueStore.getters.getGondolaById(gondola_id);
        if (self.hasIntersection(gondola.getClientRect(), self.Group.getClientRect())) {

          // test if same gondola
          hasIntersection = true;
          if (gondolaInstance.ID !== self.GondolaID) {

            //#region remove this fixture from previous the gondola
            self.Store_RemoveFixtureFromGondola(self);
            //#endregion remove this fixture from the gondola

            self.GondolaID = gondolaInstance.ID;
            self.Group.moveTo(gondolaInstance.Layer);
            self.Layer = gondolaInstance.Layer;

            // set the shelf to the new coordinate
            self.Group.setX(gondolaInstance.Group.getX())

            // add the shelf to the new gondola
            self.Store_AddToGondola();

          } else {
            self.Group.setX(master_gondola.Group.getX())
          }

          activeGondolaInstance = gondolaInstance;
        }
      }
      //#region Visuals of product whilst moving
      self.ProductGroupArray.forEach(element => {
        element.Visual_Opacity(false);
      });

      self.Stage.draw();
      //#endregion

      self.ClientRect.destroy();
      self.ClientRect = null;
      self.AddClientRect();

      // once all built, call calculate on all shelves within this gondola
      self.CallFixture_CalculateShelfHeightsForGondola(self.GondolaID);

      self.CalculateAllProductAndSubfixturePositions();
      
      let LabelConfig = self.VueStore.getters.getLabelConfig;
      self.DetermineFixturePosition(LabelConfig.Order);
    })

    self.Group.on('dblclick', function() {
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
    event.modal_load(EventBus, "FIXTURE", "PEGBAR", fullObject, self.ID, self);
  }

  //#region Entity Helper
  Store_GetGondola() {
    let self = this;
    let helper = new EntityHelper(self.VueStore);
    return helper.GetGondolaByID(self.GondolaID);
  }

  Store_AddToGondola() {
    let self = this;
    let helper = new EntityHelper(self.VueStore);
    helper.AddFixtureToGondola(self.GondolaID, self);
  }

  Store_RemoveFixtureFromGondola(fixture) {
    let self = this;
    let helper = new EntityHelper(self.VueStore);
    helper.RemoveFixtureFromGondola(self.GondolaID, fixture);
  }
  //#endregion

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

export default PegBar;
