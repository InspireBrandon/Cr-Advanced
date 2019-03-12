import Konva from 'konva';
import ProductGroup from '@/components/Main/Planogram/spaceplanning/src/libs/Product/ProductGroup.js'
import EventBus from '@/components/Main/Planogram/spaceplanning/src/libs/EventBus/EventBus.js';
import CustomEmitter from '@/components/Main/Planogram/spaceplanning/src/libs/EventBus/CustomEmitter.js';
import FixtureBase from '@/components/Main/Planogram/spaceplanning/src/libs/BaseLibs/FixtureBase.js'

class Shelf extends FixtureBase {
  constructor(VueStore, gondolaID, FixtureData, ratio) {
    super(VueStore, gondolaID, FixtureData, ratio)

    this.EventBus = null;
    this.ShelfBar = null;
    this.ShelfLabel = null;
    this.Rendering = null;
  }

  // initialise a new shelf
  Initialise(stage, dropPos) {
    let self = this;
    self.Stage = stage;
    let width = self.FixtureData.width * self.Ratio;
    let height = self.FixtureData.height * self.Ratio;

    self.Build(stage, width, height, dropPos);
  }

  Clone(stage, position, productGroups) {
    let self = this;

    self.Group.position(position);

    self.ClientRect.destroy();
    self.ClientRect = null;
    self.AddClientRect();

    setTimeout(() => {
      self.AddEvents(stage);
      self.CloneSettings.CtrlIsDown = false;
      self.CloneSettings.CloneListening = true;
    }, 1000);

    self.CalculateHeight();

    productGroups.forEach(productGroup => {
      let clone = new ProductGroup(self.VueStore, productGroup.ProductData, productGroup.Ratio);
      clone.FixtureData = self.FixtureData;
      clone.FixtureID = self.ID;
      clone.Facings_X = productGroup.Facings_X;
      clone.Facings_Y = productGroup.Facings_Y;
      clone.Facings_Z = productGroup.Facings_Z;
      clone.Orientation_Width = productGroup.Orientation_Width;
      clone.Orientation_Height = productGroup.Orientation_Height;
      clone.Orientation_Depth = productGroup.Orientation_Depth;

      // caps
      clone.Cap_Orientation_Width = productGroup.Cap_Orientation_Width;
      clone.Cap_Orientation_Height = productGroup.Cap_Orientation_Height;
      clone.Cap_Orientation_Depth = productGroup.Cap_Orientation_Depth;
      clone.caps_image_orientation_width = productGroup.caps_image_orientation_width;
      clone.caps_image_orientation_height = productGroup.caps_image_orientation_height;
      clone.Caps_Count = productGroup.Caps_Count;
      clone.Cap_Rotation = productGroup.Cap_Rotation;
      clone.Caps_Face = productGroup.Caps_Face;
      clone.Caps_Enabled = productGroup.Caps_Enabled;

      clone.image_orientation_width = productGroup.image_orientation_width;
      clone.image_orientation_height = productGroup.image_orientation_height;
      clone.LastFace = productGroup.LastFace;
      clone.Rotation = productGroup.Rotation;

      clone.image_used = productGroup.image_used;
      clone.LastFace = productGroup.LastFace;
      clone.ProductGroupBox_ON = productGroup.ProductGroupBox_ON;
      clone.ImagesOff = productGroup.ImagesOff;
      clone.Initialise(stage);
      clone.Group.setX(self.ClientRect.getX())
      clone.Group.setY(self.ClientRect.getY())
      clone.RandomColor = productGroup.RandomColor;
      clone.AddToShelf(self.ClientRect);
      // clone.DoesIntersectShelf(stage);
    });
    stage.draw();
  }

  Build(stage, w, h, dropPos) {
    let self = this;
    return new Promise(function (resolve) {
      if (self.Type.toUpperCase() === "SHELF") {
        self.BuildShelf(stage, w, h, dropPos)
      } else {
        self.BuildBase(stage, w, h)
      }

      self.ClientRectIntersection = {
        x: self.Group.getX(),
        y: self.Group.getY(),
        width: self.FixtureData.width * self.Ratio,
        height: 0
      }
      self.AddClientRect();

      self.SetIndexes();

      stage.draw(); // call draw as you are adding to the gondola layer

      self.AddEvents(stage);

      self.Store_AddToGondola();

      self.CalculateHeight();
      stage.draw();

      resolve();
    });
  }

  BuildShelf(stage, w, h, dropPos) {
    let self = this;

    let gondola = self.Store_GetGondola();
    self.AddLayer();

    let y = dropPos.y;

    let position = {
      x: gondola.Group.getX(),
      y: y
    }

    self.AddGroup(w, h, position, true)
    self.AddShelfBar(w, h)
  }

  BuildBase(stage, w, h) {
    let self = this;

    let gondola = self.Store_GetGondola();
    self.AddLayer();

    let y = 0;
    y = gondola.Group.getY() + (gondola.Group.getHeight() - (self.FixtureData.height * self.Ratio));
    let position = {
      x: gondola.Group.getX(),
      y: y
    }

    self.AddGroup(w, h, position, false)
    self.AddShelfBase(w, h)
  }

  // Add shelf layer
  AddLayer() {
    let self = this;
    let gondola = self.Store_GetGondola();
    this.Layer = gondola.Layer;
  }

  // internal
  // Add shelf group
  AddGroup(h, w, position, draggable) {
    let self = this;

    if (draggable == true) {
      self.Group = new Konva.Group({
        id: 'shelf_group_' + self.ID,
        name: 'shelf_group',
        x: position.x,
        y: position.y,
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
      });
    } else {
      self.Group = new Konva.Group({
        id: 'shelf_group_' + self.ID,
        name: 'shelf_group',
        x: position.x,
        y: position.y
      });
    }

    self.Layer.add(this.Group);
  }

  // add internal area of shelf
  AddShelfBar(w, h) {
    let self = this;
    this.ShelfBar = new Konva.Rect({
      id: 'shelf_bar_' + self.ID,
      name: 'shelf_bar',
      x: 0,
      y: 0,
      width: w,
      height: h,
      fill: self.FixtureData.color
    });

    this.Group.add(this.ShelfBar);
  }

  // add internal area of shelf
  AddShelfBase(w, h) {
    let self = this;
    this.ShelfBar = new Konva.Rect({
      id: 'shelf_base_' + self.ID,
      name: 'shelf_base',
      x: 0,
      y: 0,
      width: w,
      height: h,
      fill: self.FixtureData.color
    });

    this.Group.add(this.ShelfBar);
  }

  AddClientRect() {
    let self = this;

    if (self.DrawClientRect) {
      self.ClientRect = new Konva.Image({
        id: "shelf_client_rect_" + self.ID,
        name: 'shelf_client_rect',
        x: self.ClientRectIntersection.x,
        y: self.ClientRectIntersection.y,
        width: self.ClientRectIntersection.width,
        height: self.ClientRectIntersection.height,
        fill: self.Type === "Base" ? 'green' : 'purple',
        // stroke: 'black',
        // strokeWidth: 2,
        listening: false
      })
    } else {
      self.ClientRect = new Konva.Image({
        id: "shelf_client_rect_" + self.ID,
        name: 'shelf_client_rect',
        x: self.ClientRectIntersection.x,
        y: self.ClientRectIntersection.y,
        width: self.ClientRectIntersection.width,
        height: self.ClientRectIntersection.height,
        fill: 'transparent', //self.FixtureData.color,
        listening: false
      })
    }

    if (self.FixtureData.image != null) {
      var backPanelImage = new Image();
      backPanelImage.crossOrigin = "anonymous";
      backPanelImage.src = "data:image/png;base64," + self.FixtureData.image;
      self.ClientRect.image(backPanelImage);

      backPanelImage.onload = function () {
        self.Stage.draw();
      }
    }

    self.Layer.add(self.ClientRect);
  }

  AddEvents(stage) {
    let self = this;

    self.AddControlCloneListener();

    let clone = null;

    self.Group.on('dragstart', function () {

      this.moveToTop();
      if (self.CloneSettings.CtrlIsDown == true) {
        this.stopDrag();
        clone = new Shelf(self.VueStore, self.GondolaID, self.FixtureData, self.Ratio);
        clone.CloneSettings.CtrlIsDown = false;
        clone.CloneSettings.CloneListening = false;
        clone.Initialise(stage, {
          x: self.Group.getX(),
          y: self.Group.getY()
        });
        clone.Group.off('dragstart');
        clone.Clone(stage, {
          x: self.Group.getX(),
          y: self.Group.getY()
        }, self.ProductGroupArray)
        clone.Group.startDrag();
      }

      //#region Visuals of product whilst moving
      self.ProductGroupArray.forEach(element => {
        element.Visual_Opacity(true);
      });

      self.Stage.draw();
      //#endregion
    })

    self.Group.on('dragmove', function() {
      document.body.style.cursor = 'move';
    });

    self.Group.on('dragend', function () {
      document.body.style.cursor = 'default';

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

          let gondolaArr = self.VueStore.getters.getAllGondolas;
          gondolaArr.forEach(gondolaItem => {
            console.log("[FIXTURES ALL] Calculate height for each gondola", gondolaItem.ID);
            self.CallFixture_CalculateShelfHeightsForGondola(gondolaItem.ID);
          });

          activeGondolaInstance = gondolaInstance;
        }
      }

      //#region Adjust positions and height
      self.CallFixture_CalculateShelfHeightsForGondola(self.GondolaID);

      if (hasIntersection == false) {
        self.Group.setX(master_gondola.Group.getX())
      }
      //#endregion Adjust positions and height

      //#region Visuals of product whilst moving
      self.ProductGroupArray.forEach(element => {
        element.Visual_Opacity(false);
      });
      //#endregion

      //#region Set Fixture label
      let LabelConfig = self.VueStore.getters.getLabelConfig;
      self.DetermineFixturePosition(LabelConfig.Order);
      //#endregion
      
      stage.draw();
      self.SetIndexes();
      stage.draw();
    })

    self.Group.on('dblclick dbltap', function () {
      self.Open_Modal();
    })
  }

  AddControlCloneListener() {
    let self = this;
    document.addEventListener('keydown', function (e) {

      var ctrlKey = 17,
        cmdKey = 91,
        vKey = 86,
        // cDeleteKey = 46,
        cKey = 67;

      if (e.keyCode === ctrlKey || e.keyCode === cmdKey || e.keyCode === vKey || e.keyCode === cKey) {
        if (self.CloneSettings.CloneListening == true) {
          self.CloneSettings.CtrlIsDown = true;
        }
      } else {
        if (self.CloneSettings.CloneListening == true) {
          self.CloneSettings.CtrlIsDown = false;
        }
      }
      // if (e.keyCode === cDeleteKey) {
      //     // fire event
      //     var trElements = stage.find('Transformer');
      //     if (trElements.length > 0) {
      //         if (trElements[0].parent.getId() === uid) {
      //             group.destroy();
      //             layer.draw();
      //         }
      //     }
      // }

      setTimeout(() => {
        self.CloneSettings.CtrlIsDown = false;
      }, 1000);
    });

    document.addEventListener('keyup', function () {
      self.CtrlIsDown = false;
    });
  }

  findClosestShelfPosition(curShelfY) {
    let self = this;

    let retVal = {
      pos: 0,
      toGondolaTop: false
    };

    let yArr = [];

    self.Layer.find('.shelf_group').forEach(shelf => {
      yArr.push(shelf.y())
    });

    self.Layer.find('.pegboard_group').forEach(pegboard => {
      yArr.push(pegboard.y() + pegboard.getHeight())
    });

    self.Layer.find('.pegbar_group').forEach(pegbar => {
      yArr.push(pegbar.y() + pegbar.getHeight())
    });

    yArr.sort((a, b) => a - b);

    var current_index = -1;
    yArr.forEach((element, index) => {
      if (element === curShelfY) {
        current_index = index;
      }
    });

    if (current_index >= 1) {
      retVal.pos = yArr[current_index - 1]
      retVal.toGondolaTop = false;
    } else {
      retVal.pos = 0;
      retVal.toGondolaTop = true;
    }
    return retVal;
  }

  findClosestShelfBarHeight(curCloseShelfPos) {
    let self = this;

    let retVal = 0; // min 0 -- top of gondola maybe no shelves

    self.Layer.find('.shelf_group').forEach(shelf => {
      if (shelf.getY() == curCloseShelfPos) {
        let fixture_bars = shelf.find('.shelf_bar');
        if (fixture_bars != undefined && fixture_bars.length > 0) {
          let bar = fixture_bars[0];
          retVal = bar.getHeight();
          return retVal;
        }
      }
    });
    self.Layer.find('.pegboard_group').forEach(pegboard => {
      if (pegboard.getY() == curCloseShelfPos) {
        let fixture_bars = shelf.find('.shelf_bar');
        if (fixture_bars != undefined && fixture_bars.length > 0) {
          let bar = fixture_bars[0];
          retVal = bar.getHeight();
          return retVal;
        }
      }
    });

    self.Layer.find('.pegbar_group').forEach(pegbar => {
      if (pegbar.getY() == curCloseShelfPos) {
        let fixture_bars = shelf.find('.shelf_bar');
        if (fixture_bars != undefined && fixture_bars.length > 0) {
          let bar = fixture_bars[0];
          retVal = bar.getHeight();
          return retVal;
        }
      }
    });

    return retVal;
  }

  CalculateHeight() {
    let self = this;
    let gondola = self.Store_GetGondola();

    let allShelves = gondola.Fixtures.filter(g => g.Type.toUpperCase() === "BASE" || g.Type.toUpperCase() === "SHELF");

    allShelves.forEach(item => {
      let calc_to_shelf_pos = self.findClosestShelfPosition(item.Group.getY());
      let calc_to_prev_shelf_height = self.findClosestShelfBarHeight(calc_to_shelf_pos.pos);

      if (calc_to_shelf_pos.toGondolaTop) {
        let height_gondolaDiff = item.Group.getY() - gondola.Group.getY();
        let y_pos = gondola.Group.getY()

        item.ClientRectIntersection = {
          x: item.Group.getX(),
          y: y_pos,
          width: item.FixtureData.width * item.Ratio,
          height: height_gondolaDiff
        }

        item.ClientRect.destroy();
        item.ClientRect = null;
        item.AddClientRect();
      } else {
        let height_shelfDiff = (item.Group.getY() - calc_to_shelf_pos.pos) - (calc_to_prev_shelf_height + 1);
        let y_pos = calc_to_shelf_pos.pos + calc_to_prev_shelf_height + 1;

        item.ClientRectIntersection = {
          x: item.Group.getX(),
          y: y_pos,
          width: item.FixtureData.width * item.Ratio,
          height: height_shelfDiff
        }

        item.ClientRect.destroy();
        item.ClientRect = null;
        item.AddClientRect();
      }
    });

    self.CalculateAllProductAndSubfixturePositions();
  }
  //#endregion

  //#region Z-Indexing
  SetIndexes() {
    // let self = this;
  }
  //#endregion
  guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }

  //#region Intersection Methods

  hasIntersection(r1, r2) {
    return !(
      r2.x > r1.x + (r1.width / 2) ||
      r2.x + (r2.width / 2) < r1.x ||
      r2.y > r1.y + r1.height ||
      r2.y + (r2.height / 2) < r1.y
    );
  }

  //#endregion

  Open_Modal() {
    let self = this;
    let event = new CustomEmitter();
    let fullObject = {
      fixtureData: self.FixtureData,
      fixtureConfig: self.FixtureConfig
    }
    event.modal_load(EventBus, "FIXTURE", "SHELF", fullObject, self.ID, self);
  }
}

export default Shelf;
