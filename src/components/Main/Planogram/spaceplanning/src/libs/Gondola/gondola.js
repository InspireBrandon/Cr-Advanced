import Konva from 'konva';
import EventBus from '@/components/Main/Planogram/spaceplanning/src/libs/EventBus/EventBus.js';
import CustomEmitter from '@/components/Main/Planogram/spaceplanning/src/libs/EventBus/CustomEmitter.js';
import GondolaBase from '@/components/Main/Planogram/spaceplanning/src/libs/BaseLibs/GondolaBase.js';
import PositioningBase from '@/components/Main/Planogram/spaceplanning/src/libs/BaseLibs/PositioningBase.js';
// import IntersectDrop from '@/libs/Intersection/drop-intersection-helper.js';

class Gondola extends GondolaBase {
  constructor(VueStore, gondolaData, ratio, gondolaPosition) {
    super(VueStore, gondolaData, ratio, gondolaPosition)
  }

  // Creates all aspects of the gondola
  Initialise(stage) {
    let self = this;
    self.Stage = stage;
    
    let ctrl_positioning = new PositioningBase();

    ctrl_positioning.GetNextGondolaPosition(stage)
      .then(newPositionX => {

        let self = this;

        let width = self.GondolaData.width * self.Ratio;
        let height = self.GondolaData.height * self.Ratio;
        let total_heigth = height; //+ (self.GondolaPanelSpacer + self.GondolaPanelHeight);

        let position = {
          x: newPositionX,
          y: stage.getHeight() - total_heigth
        }

        self.Build(stage, width, height, position);
      })
  }

  Build(stage, w, h, position) {
    this.AddLayer();
    this.AddGroup(w, h, position)
    this.AddArea(w, h)

    this.AddEvents();

    stage.add(this.Layer);
    this.SetIndexes();

    this.VueStore.commit('addGondola', this);
  }
  
  // Add gondola layer
  AddLayer() {

    this.Layer = new Konva.Layer();
  }

  // internal
  // Add gondola group
  AddGroup(w, h, position) {
    let self = this;
    this.Group = new Konva.Group({
      id: "gondola_group_" + self.ID,
      name: "gondola_group",
      x: position.x,
      y: position.y,
      width: w,
      height: h
    });

    this.Layer.add(this.Group);
  }

  // add internal area of gondola
  AddArea(w, h) {
    let self = this;
    self.Area = new Konva.Image({
      id: "gondola_area_" + self.ID,
      name: "gondola_area",
      x: 0,
      y: 0,
      width: w,
      height: h,
      fill: self.GondolaData.color,
      stroke: 'grey',
      strokeWidth: 1
    });

    if (self.GondolaData.image != null) {
      var backPanelImage = new Image();
      backPanelImage.src = "data:image/png;base64," + self.GondolaData.image;
      self.Area.image(backPanelImage);

      backPanelImage.onload = function () {
        self.Stage.draw();
      }

    }

    this.Group.add(this.Area);
  }

  AddNotchings() {

  }

  AddEvents() {
    let self = this;

    //#region Gondola Double Click - Modal
    self.Group.on('dblclick dbltap', function () {
      self.Open_Modal();
    })
    //#endregion
  }

  Notify_SelectedDeselected(selected) {
    let event = new CustomEmitter();
    event.notify_gondola_selected_deselected(EventBus, selected, this);
  }

  Open_Modal() {
    let self = this;
    let event = new CustomEmitter();
    event.modal_load(EventBus, "GONDOLA", null, self.GondolaData, self.ID, self);
  }

  //#region DESTROY

  DestroyGondola() {
    let self = this;
    EventBus.$off('MODAL_GONDOLA_SAVED', self.Load_SavedChanges);
    self.Layer.destroy();

    // TODO: remove from store!
  }

  //#endregion DESTROY
}

export default Gondola;
