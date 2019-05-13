import Konva from 'konva';
import StoreHelper from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/StoreHelper/StoreHelper.js";
import LabelHelper from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/Labeling/LabelingBase.js";
import IntersectionTester from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/intersection/IntersectionTester.js";
import EventBus from '@/components/Main/Planogram/spaceplanning/src/libs/EventBus/EventBus.js';
import CustomEmitter from '@/components/Main/Planogram/spaceplanning/src/libs/EventBus/CustomEmitter.js';
import ParentTreeRedraw from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/RedrawParentChildBase.js";

class PlanogramItemBase {
  constructor(vueStore, stage, layer, data, ratio, type, parentID) {
    this.ID = this.guid();
    this.VueStore = vueStore;
    this.Type = type;
    this.Data = data;
    this.Ratio = ratio;

    this.Stage = stage;
    this.Layer = layer;
    this.Group = null;

    this.ParentID = parentID;

    this.Position = 0;
    this.Width = 0;
    this.Height = 0;
    this.TotalWidth = 0;
    this.TotalHeight = 0;

    // children
    this.TotalChildren = []; // array that includes the child and its counter;
    this.SpacingEvenAmount = 0;

    // cosmetics
    this.LabelText = this.Type + " " + this.Position;
    this.RenderingsOn = false;
    this.ImagesOn = false;
    this.GroupsOn = false;
    this.labelsOn = false;

    // relationships
    // this.Fixtures = [];
    // this.Products = [];
    this.Renderings = [];

    // selection
    this.Selected = false;

    // position
    this.LastPositionRelative = null;
    this.LastPositionAbsolute = null;

    // config settings
    this.Config = {

    }

    // Cloning options - Could be taken out, will see now
    this.CloneSettings = {
      CtrlIsDown: false,
      CloneListening: true
    }

    // Determine if children exceed maximum width or height
    this.MilkCrate = {
      enabled: false,
      size: {
        width: 0,
        height: 0
      }
    }

    this.MilkCrateRect = null;
    this.MilkCrateText = null;

    // cache quality
    this.Quality = 1;
  }

  BuildBase(dropPos) {
    let self = this;
    self.AddMasterGroup(dropPos);
    self.BuildBaseConfigSettings();
    self.AddEvents();
  }

  BuildBaseConfigSettings() {
    let self = this;
    switch (self.Type.toUpperCase()) {
      case "GONDOLA": {
        self.Config.LabelOrder = "T2B";
      }
      break;
    case "SHELF": {
      self.Config.SpreadType = "L2R";
    }
    break;
    case "BASE": {
      self.Config.SpreadType = "L2R";
    }
    break;
    case "PEGBAR": {
      self.Config.SpreadType = "L2R";
    }
    break;
    case "PEGBOARD": {

    }
    break;
    case "BASKET": {
      self.Config.SpreadType = "L2R";
    }
    break;
    case "DIVIDER": {
      self.Config.SpreadType = "L2R";
    }
    break;
    }
  }

  AddMasterGroup(dropPos) {
    let self = this;
    // if (self.ParentID != null) {
    //   let ctrl_store = new StoreHelper();
    //   let parent = ctrl_store.getPlanogramItemById(self.VueStore, self.ParentID);
    //   let transform = parent.Group.getAbsoluteTransform().copy();
    //   transform.invert();

    //   let newPoint = transform.point(dropPos)
    //   dropPos = newPoint;
    // }
    // TODO: Based on type set drag bound function
    if (self.Type.toUpperCase() == "GONDOLA") {
      self.Group = new Konva.Group({
        id: self.Type + '_master_group_' + self.ID,
        name: self.Type + '_master_group',
        x: dropPos.x,
        y: dropPos.y,
        draggable: true
      })
    } else if (self.Type.toUpperCase() == "AREA") {
      self.Group = new Konva.Group({
        id: self.Type + '_master_group_' + self.ID,
        name: self.Type + '_master_group',
        x: dropPos.x,
        y: dropPos.y,
        draggable: true
      })
    } else if (self.Type.toUpperCase() == "TEXTHEADER") {
      self.Group = new Konva.Group({
        id: self.Type + '_master_group_' + self.ID,
        name: self.Type + '_master_group',
        x: dropPos.x,
        y: dropPos.y,
        draggable: true
      })
    } else if (self.Type.toUpperCase() == "BASKET" || self.Type.toUpperCase() == "DIVIDER" || self.Type.toUpperCase() == "PRODUCT" || self.Type.toUpperCase() == "LABELHOLDER") {
      self.Group = new Konva.Group({
        id: self.Type + '_master_group_' + self.ID,
        name: self.Type + '_master_group',
        x: dropPos.x,
        y: dropPos.y,
        draggable: true
      })
    } else {
      self.Group = new Konva.Group({
        id: self.Type + '_master_group_' + self.ID,
        name: self.Type + '_master_group',
        x: dropPos.x,
        y: dropPos.y,
        draggable: true,
        dragBoundFunc: function (pos) {
          let dragPos = pos;
          let stagePos = self.Stage.position();

          // if (stagePos.y < 0) {
          //   dragPos.y += (stagePos.y * -1)
          // } else {
          //   dragPos.y -= (stagePos.y)
          // }

          let ctrl_store = new StoreHelper();
          let gondola = ctrl_store.getPlanogramItemById(self.VueStore, self.ParentID);

          // console.log("DRAGBOUND:", "STAGE", self.Stage.position(), "GONDOLA", gondola.Group.getAbsolutePosition(), "DRAG POS", pos, "NEW POS", dragPos);

          let x = this.getAbsolutePosition().x;
          let y = gondola.Group.getY() + gondola.Group.getHeight() - (self.Data.height * self.Ratio);

          //#region Pop out of gondola
          if (dragPos.x > (gondola.Group.getAbsolutePosition().x + (self.TotalWidth / 2))) {
            x = dragPos.x;
          }

          if (dragPos.x < gondola.Group.getAbsolutePosition().x - (self.TotalWidth / 2)) {
            x = dragPos.x;
          }
          //#endregion Pop out of gondola

          // TEST UPPER BOUND
          if (pos.y < gondola.Group.getAbsolutePosition().y) { // outside the top of the gondola
            return {
              x: x,
              y: gondola.Group.getAbsolutePosition().y
            }
          }

          // TEST LOWER BOUND
          let yLowerBound = gondola.Group.getAbsolutePosition().y + ((gondola.Group.getHeight() * self.Stage.scaleY()) - ((self.Data.height * self.Ratio) * self.Stage.scaleY()));
          if (pos.y > yLowerBound) {
            return {
              x: x,
              y: yLowerBound
            }
          }

          return {
            x: x,
            y: pos.y
          }
        }
      })
    }

    if (self.ParentID == undefined || self.ParentID == null) {
      self.Layer.add(self.Group);
    } else {
      let ctrl_store = new StoreHelper();
      let parent = ctrl_store.getPlanogramItemById(self.VueStore, self.ParentID);
      parent.Group.add(self.Group);
    }

    self.LastPositionRelative = self.Group.position();
    self.LastPositionAbsolute = self.Group.getAbsolutePosition();
  }

  AddEvents() {
    let self = this;
    self.Group.on('click tap', function (evt) {
      evt.cancelBubble = true;
      // TODO: Make this a selected element, send event
      self.Selected = !self.Selected;
      self.SetSelected(self.Selected);
    });

    self.Group.on('dblclick dbltap', function (evt) {
      evt.cancelBubble = true;
      self.Open_Modal();
      self.Group.moveToTop();
      self.ApplyZIndexing();
    })

    self.Group.on('dragstart touchstart', function (evt) {
      evt.cancelBubble = true;

      let ctrl_store = new StoreHelper();

      if (ctrl_store.getCtrlDown(self.VueStore) == true) {
        // start cloning
        ctrl_store.setCloneItem(self.VueStore, self.ID);
        ctrl_store.setCtrlDown(self.VueStore, false);

        this.stopDrag();
        return;
      } else {
        self.MoveAllExceptCurrentDown();
        self.LastPositionRelative = self.Group.position();
        self.LastPositionAbsolute = self.Group.getAbsolutePosition();
        self.Group.moveToTop();
      }
    });

    self.Group.on('dragmove touchmove', function (evt) {
      evt.cancelBubble = true;
      let ctrl_intrsct = new IntersectionTester();
      let ctrl_store = new StoreHelper();
      ctrl_intrsct.TestIntersectsForAllItems(self.Stage, self.Type).then(results => {
        let tmpItems = results.filter((el) => el.ID != self.ID && (el.Type.toUpperCase() == "GONDOLA"));
        tmpItems.forEach(element => {
          if (element.intersects == true) {
            let item = ctrl_store.getPlanogramItemById(self.VueStore, element.ID);
            item.Group.moveDown();
          }
        });
      })

      // self.ApplyZIndexing();

    });

    self.Group.on('dragend touchend', function (evt) {
      evt.cancelBubble = true;

      let ctrl_intrsct = new IntersectionTester();
      let ctrl_store = new StoreHelper();
      let typeArr = [];
      switch (self.Type.toUpperCase()) {
        case "GONDOLA": {

        }
        break;
      case "AREA": {
        typeArr = ["GONDOLA"];
      }
      break;
      case "PALETTE": {
        typeArr = ["GONDOLA"];
      }
      break;
      case "PRODUCT": {
        typeArr = ["SHELF", "BASE", "BASKET", "PEGBAR", "PEGBOARD", "PALETTE", "LABELHOLDER"];
      }
      break;
      case "SHELF": {
        typeArr = ["GONDOLA", "AREA"];
      }
      break;
      case "BASE": {
        typeArr = ["GONDOLA", "AREA"];
      }
      break;
      case "BASKET": {
        typeArr = ["SHELF", "BASE", "PEGBAR", "PEGBOARD", "DIVIDER", "PALETTE", "LABELHOLDER"];
      }
      break;
      case "PEGBAR": {
        typeArr = ["GONDOLA", "AREA"];
      }
      break;
      case "LABELHOLDER": {
        typeArr = ["PEGBOARD"];
      }
      break;
      case "PEGBOARD": {
        typeArr = ["GONDOLA", "AREA"];
      }
      break;
      case "DIVIDER": {
        typeArr = ["SHELF", "BASE", "PEGBAR", "PEGBOARD", "BASKET"];
      }
      break;

      }
      if (self.Type == "GONDOLA" || self.Type == "TEXTHEADER") {
        self.PositionElement();
      } else {
        ctrl_intrsct.TestIntersectsWithMany(self.Stage, self.Type, typeArr, self.VueStore, null).then(results => {
          self.PositionElement(results);
        })
      }

      // let allItems = ctrl_store.getAllPlanogramItems(self.VueStore);
      // allItems.forEach(item => {
      //   item.Group.moveUp();
      // });

      self.ApplyZIndexing();

      self.Selected = !self.Selected;
      self.SetSelected(self.Selected);
    });

    self.Group.on('mouseenter', function () {
      let event = new CustomEmitter();
      if (self.Type.toUpperCase() == "PRODUCT") {
        event.notify_product_group_statistics(EventBus, true, self);
      }
    })

    self.Group.on('mouseleave', function () {
      let event = new CustomEmitter();
      if (self.Type.toUpperCase() == "PRODUCT") {
        event.notify_product_group_statistics(EventBus, false, self);
      }
    })
  }

  LoadImage(konvaImage, imageData) {
    let self = this;
    if (imageData != null) {
      var backPanelImage = new Image();
      backPanelImage.src = "data:image/png;base64," + imageData;
      konvaImage.image(backPanelImage);

      backPanelImage.onload = function () {
        self.Stage.draw();
      }
    }
  }

  ApplyZIndexing(parentID = null) {
    let self = this;

    let ctrl_store = new StoreHelper();

    //#region Rendering
    let areas = ctrl_store.getAllPlanogramItemsByType(self.VueStore, "AREA", parentID);

    // AREA
    areas.forEach(area => {
      if (area.Renderings && area.Renderings.length > 0) {
        area.Renderings.forEach(rendering => {
          switch (rendering.type.toUpperCase()) {
            case "BACKRENDERING": {
              rendering.konva.moveToBottom();
            }
            break;
          case "FRONTRENDERING": {
            rendering.konva.moveToTop();
          }
          break;
          }
        });
      }

      area.Group.draw();
    });

    // SHELVES
    let shelves = ctrl_store.getAllPlanogramItemsByType(self.VueStore, "SHELF", parentID);

    shelves.forEach(shelf => {
      if (shelf.Renderings && shelf.Renderings.length > 0) {
        shelf.Renderings.forEach(rendering => {
          switch (rendering.type.toUpperCase()) {
            case "SHELFEDGE": {
              rendering.konva.moveToTop();
            }
            break;
          case "LABELHOLDER": {
            rendering.konva.moveToTop();
          }
          break;
          case "BACKRENDERING": {
            rendering.konva.moveToBottom();
          }
          break;
          case "FRONTRENDERING": {
            rendering.konva.moveToTop();
          }
          break;
          }
        });
      }

      shelf.Group.draw();
    });

    // BASES
    let bases = ctrl_store.getAllPlanogramItemsByType(self.VueStore, "BASE", parentID);
    bases.forEach(base => {
      if (base.Renderings && base.Renderings.length > 0) {
        base.Renderings.forEach(rendering => {
          switch (rendering.type.toUpperCase()) {
            case "SHELFEDGE": {
              rendering.konva.moveToTop();
            }
            break;
          case "LABELHOLDER": {
            rendering.konva.moveToTop();
          }
          break;
          case "BACKRENDERING": {
            rendering.konva.moveToBottom();
          }
          break;
          case "FRONTRENDERING": {
            rendering.konva.moveToTop();
          }
          break;
          }
        });
      }

      base.Group.draw();
    });

    // HANGING BARS
    let hangingBars = ctrl_store.getAllPlanogramItemsByType(self.VueStore, "PEGBAR", parentID);

    hangingBars.forEach(hangingBar => {
      if (hangingBar.Renderings && hangingBar.Renderings.length > 0) {
        hangingBar.Renderings.forEach(rendering => {
          switch (rendering.type.toUpperCase()) {
            case "LABELHOLDER": {
              rendering.konva.moveToTop();
            }
            break;
          }
        });
      }

      hangingBar.Group.draw();
    });

    // LABEL HOLDERS
    let labelHolders = ctrl_store.getAllPlanogramItemsByType(self.VueStore, "LABELHOLDER", parentID);

    labelHolders.forEach(labelHolder => {
      if (labelHolder.Renderings && labelHolder.Renderings.length > 0) {
        labelHolder.Renderings.forEach(rendering => {
          switch (rendering.type.toUpperCase()) {
            case "LABELHOLDER": {
              rendering.konva.moveToTop();
            }
            break;
          }
        });
      }

      labelHolder.Group.draw();
    });

    // BASKETS
    let baskets = ctrl_store.getAllPlanogramItemsByType(self.VueStore, "BASKET", parentID);

    baskets.forEach(basket => {
      if (basket.Renderings && basket.Renderings.length > 0) {
        basket.Renderings.forEach(rendering => {
          switch (rendering.type.toUpperCase()) {
            case "LABELHOLDER": {
              rendering.konva.moveToTop();
            }
            break;
          case "FRONTRENDERING": {
            rendering.konva.moveToTop();
          }
          break;
          }
        });
      }

      basket.Group.draw();
    });

    //GONDOLAS
    let gondolas = ctrl_store.getAllPlanogramItemsByType(self.VueStore, "GONDOLA", parentID);

    gondolas.forEach(gondola => {
      if (gondola.Renderings && gondola.Renderings.length > 0) {
        gondola.Renderings.forEach(rendering => {
          switch (rendering.type.toUpperCase()) {
            case "FRONTRENDERING": {
              rendering.konva.moveToTop();
            }
            break;
          }
        });
      }
      gondola.Group.draw();
    });

    //#endregion
    //#region Fixture Positions

    gondolas.forEach(element => {
      let allItems = ctrl_store.getAllPlanogramItems(self.VueStore, element.ID);

      if (allItems.length > 1) {
        let gPegboards = ctrl_store.getAllPlanogramItemsByType(self.VueStore, "PEGBOARD", element.ID);
        gPegboards.forEach(element => {
          element.Group.moveToTop();
          element.Group.moveDown();
        });

        let gShelves = ctrl_store.getAllPlanogramItemsByType(self.VueStore, "SHELF", element.ID);
        gShelves.forEach(element => {
          element.Group.moveToTop();
        });

        let gHangingBars = ctrl_store.getAllPlanogramItemsByType(self.VueStore, "PEGBAR", element.ID);
        gHangingBars.forEach(element => {
          element.Group.moveToTop();
        });

        let gBases = ctrl_store.getAllPlanogramItemsByType(self.VueStore, "BASE", element.ID);
        gBases.forEach(element => {
          element.Group.moveToTop();
        });
      } else {
        let gPegboards = ctrl_store.getAllPlanogramItemsByType(self.VueStore, "PEGBOARD", element.ID);
        gPegboards.forEach(element => {
          element.Group.moveToTop();
        });
      }
    });
    //#endregion

    //#region IF ANY FIXTURE HAS A FRONT FACE RENDERING DRAW TO FRONT -- JOHN's REQUEST

    gondolas.forEach(element => {
      let allItems = ctrl_store.getAllPlanogramItems(self.VueStore, element.ID);
      if (allItems.length > 1) {

        let gShelves = ctrl_store.getAllPlanogramItemsByType(self.VueStore, "SHELF", element.ID);
        gShelves.forEach(element => {
          if (element.Data.RenderingsItems != undefined || element.Data.RenderingsItems != null) {
            if (element.Data.RenderingsItems.ShelfEdge != undefined || element.Data.RenderingsItems.ShelfEdge != null) {
              //console.log("[SHELF] MOVING TO TOP")
              element.Group.moveToTop();
            }
          }
        });

        let gBases = ctrl_store.getAllPlanogramItemsByType(self.VueStore, "BASE", element.ID);
        gBases.forEach(element => {
          if (element.Data.RenderingsItems != undefined || element.Data.RenderingsItems != null) {
            if (element.Data.RenderingsItems.ShelfEdge != undefined || element.Data.RenderingsItems.ShelfEdge != null) {
              // console.log("[BASE] MOVING TO TOP")
              element.Group.moveToTop();
            }
          }
        });
      }
    });

    //#endregion

    //#region All labels to the top
    let allFixtures = ctrl_store.getAllPlanogramItems(self.VueStore);
    allFixtures = allFixtures.filter((el) =>
      el.Type == "SHELF" ||
      el.Type == "BASE" ||
      el.Type == "PEGBAR" ||
      el.Type == "PEGBORD" ||
      el.Type == "LABELHOLDER");

    allFixtures.forEach(element => {
      element.Text.moveToTop();
    });
    //#endregion
  }

  SetBasePosition(position) {
    let self = this;
    self.Group.position(position);
  }

  SetBaseDraggable(draggable) {
    let self = this;
    self.Group.draggable(draggable);
  }

  MoveThisToTop() {
    let self = this;
    self.Group.moveToTop();
  }

  GetSquishValue(parentID) {
    let self = this;
    let retVal = 0;
    let ctrl_store = new StoreHelper();
    let parentItem = ctrl_store.getPlanogramItemById(self.VueStore, parentID);

    if (parentItem == null || parentItem.Type == null || parentItem.Type == undefined) {
      return retVal;
    }

    if (parentItem.Type.toUpperCase() == "PRODUCT") {
      return retVal;
    }

    if (parentItem.Data.squish == undefined || parentItem.Data.squish == null || parentItem.Data.squish == false) {
      return retVal
    }

    let totalItemWidths = 0;
    let totalItems = 0;
    let merchOffset = (parentItem.Data.merchandisingOffset == undefined ? 0 : parentItem.Data.merchandisingOffset) * self.Ratio;
    let parentWidth = parentItem.TotalWidth - merchOffset; // subtract merchandising offset
    let squish = 0;

    if (parentItem.TotalChildren.length == 0) {
      // self.SpacingEvenAmount = 0;
      return retVal;
    }

    parentItem.TotalChildren.forEach(element => {
      totalItems += element.Count;
      totalItemWidths += (element.Width * element.Count);
    });

    switch (parentItem.Type.toUpperCase()) {
      case "BASE": {
        if (totalItemWidths > parentWidth) {
          squish = (totalItemWidths - parentWidth) / (totalItems);
        }

        retVal = squish;
      }
      break;
    case "SHELF": {
      if (totalItemWidths > parentWidth) {
        squish = (totalItemWidths - parentWidth) / (totalItems);
      }

      retVal = squish;
    }
    break;
    case "BASKET": {
      if (totalItemWidths > parentWidth) {
        squish = (totalItemWidths - parentWidth) / (totalItems);
      }

      retVal = squish;
    }
    break;
    case "PEGBAR": {
      if (totalItemWidths > parentWidth) {
        squish = (totalItemWidths - parentWidth) / (totalItems);
      }

      retVal = squish;
    }
    break;
    case "LABELHOLDER": {
      if (totalItemWidths > parentWidth) {
        squish = (totalItemWidths - parentWidth) / (totalItems);
      }

      retVal = squish;
    }
    break;
    default: {
      // self.SpacingEvenAmount = 0;
      retVal = 0;
    }
    break;
    }

    return retVal;
  }

  /**
   * Used primarily for pegboards
   * facingOffsetX + facingOffsetY
   */
  GetFacingOffset(parentID) {
    let self = this;

    let retVal = {
      enabled: false,
      x: 0,
      y: 0
    };
    let ctrl_store = new StoreHelper();
    let parentItem = ctrl_store.getPlanogramItemById(self.VueStore, parentID);

    if (parentItem == null || parentItem.Type == null || parentItem.Type == undefined) {
      return retVal;
    }

    if (parentItem.Type.toUpperCase() == "PRODUCT") {
      return retVal;
    }

    if ((parentItem.Data.facingOffsetX == undefined || parentItem.Data.facingOffsetX == null || parentItem.Data.facingOffsetX <= 0) && (parentItem.Data.facingOffsetY == undefined || parentItem.Data.facingOffsetY == null || parentItem.Data.facingOffsetY <= 0)) {
      return retVal
    }

    retVal = {
      enabled: true,
      x: parentItem.Data.facingOffsetX * self.Ratio,
      y: parentItem.Data.facingOffsetY * self.Ratio
    }

    return retVal;
  }

  /**
   * Used for all fixtures except pegboard
   */
  GetSpreadSpacing(parentID) {
    let self = this;
    let retVal = 0;
    let ctrl_store = new StoreHelper();
    let parentItem = ctrl_store.getPlanogramItemById(self.VueStore, parentID);

    if (parentItem == null || parentItem.Type == null || parentItem.Type == undefined) {
      return retVal;
    }

    // if (parentID == self.ID) {
    //   return retVal;
    // }

    if (parentItem.Type.toUpperCase() == "PRODUCT") {
      return retVal;
    }

    let totalItemWidths = 0;
    let totalItems = 0;
    let merchOffset = (parentItem.Data.merchandisingOffset == undefined ? 0 : parentItem.Data.merchandisingOffset) * self.Ratio;
    let parentWidth = parentItem.TotalWidth - merchOffset; // subtract merchandising offset
    let spacing = 0;

    if (parentItem.TotalChildren.length == 0) {
      self.SpacingEvenAmount = 0;
      return retVal;
    }

    parentItem.TotalChildren.forEach(element => {
      totalItems += element.Count;
      totalItemWidths += (element.Width * element.Count);
    });

    switch (parentItem.Type.toUpperCase()) {
      case "BASE": {
        let spreadType = parentItem.Data.spreadProducts;

        if (spreadType.toUpperCase() != "SFE") {
          return retVal;
        }

        if (totalItems == 1) {
          spacing = 0;
        } else {
          spacing = (parentWidth - totalItemWidths) / (totalItems - 1);
        }

        self.SpacingEvenAmount = spacing;
        retVal = spacing;
      }
      break;
    case "SHELF": {
      let spreadType = parentItem.Data.spreadProducts;

      if (spreadType.toUpperCase() != "SFE") {
        return retVal;
      }

      if (totalItems == 1) {
        spacing = 0;
      } else {
        spacing = (parentWidth - totalItemWidths) / (totalItems - 1);
      }

      self.SpacingEvenAmount = spacing;
      retVal = spacing;
    }
    break;
    case "BASKET": {
      let spreadType = parentItem.Data.spreadProducts;

      if (spreadType.toUpperCase() != "SFE") {
        return retVal;
      }

      if (totalItems == 1) {
        spacing = 0;
      } else {
        spacing = (parentWidth - totalItemWidths) / (totalItems - 1);
      }

      self.SpacingEvenAmount = spacing;
      retVal = spacing;
    }
    break;
    case "PEGBAR": {
      let spreadType = parentItem.Data.spreadProducts;

      if (spreadType.toUpperCase() != "SFE") {
        return retVal;
      }

      if (totalItems == 1) {
        spacing = 0;
      } else {
        spacing = (parentWidth - totalItemWidths) / (totalItems - 1);
      }

      self.SpacingEvenAmount = spacing;
      retVal = spacing;
    }
    break;
    case "LABELHOLDER": {
      let spreadType = parentItem.Data.spreadProducts;

      if (spreadType.toUpperCase() != "SFE") {
        return retVal;
      }

      if (totalItems == 1) {
        spacing = 0;
      } else {
        spacing = (parentWidth - totalItemWidths) / (totalItems - 1);
      }

      self.SpacingEvenAmount = spacing;
      retVal = spacing;
    }
    break;
    default: {
      self.SpacingEvenAmount = 0;
      retVal = 0;
    }
    break;
    }

    return retVal;
  }

  GetActualSize() {
    let self = this;

    let retVal = {
      width: self.TotalWidth,
      height: self.TotalHeight
    }

    switch (self.Type.toUpperCase()) {
      case "PRODUCT": {
        retVal = {
          width: self.Orientation_Width * self.Facings_X,
          height: self.Orientation_Height * self.Facings_Y + (self.Caps_Count * self.Cap_Orientation_Height)
        }
      }
      break;
    case "BASE": {
      retVal = {
        width: self.Data.width * self.Ratio,
        height: self.Data.height * self.Ratio
      }
    }
    break;
    case "SHELF": {
      retVal = {
        width: self.Data.width * self.Ratio,
        height: self.Data.height * self.Ratio
      }
    }
    break;
    case "BASKET": {
      retVal = {
        width: self.Data.width * self.Ratio,
        height: self.Data.height * self.Ratio
      }
    }
    break;
    case "PEGBAR": {
      retVal = {
        width: self.Data.width * self.Ratio,
        height: self.Data.height * self.Ratio
      }
    }
    break;
    case "PEGBOARD": {
      retVal = {
        width: self.Data.width * self.Ratio,
        height: self.Data.height * self.Ratio
      }
    }
    break;
    case "PALETTE": {
      retVal = {
        width: self.Data.width * self.Ratio,
        height: self.Data.height * self.Ratio
      }
    }
    break;
    }

    return retVal;
  }

  /**
   * Called to redraw item from external
   */
  Update() {
    let self = this;
    let ctrl_store = new StoreHelper();

    let parent = ctrl_store.getPlanogramItemById(self.VueStore, self.ParentID);

    if (parent == null) {
      return;
    }

    // console.log("[UPDATE] CALLED", self.Type, self.ID, parent);

    self.DestroyMilkCrate();

    switch (self.Type.toUpperCase()) {
      case "PRODUCT": {
        if (parent.MilkCrate.enabled == false) {
          self.SetObjectDimensions();
          self.DestroyMilkCrate();
          self.AddProductDisplay();
        } else {
          self.SetObjectDimensions(parent.MilkCrate);
          self.DestroyDisplayForRedraw();
          self.AddMilkCrate(parent.MilkCrate);
        }

        self.Cache();
      }
      break;
    case "BASKET": {
      if (parent.MilkCrate.enabled == false) {
        self.DestroyMilkCrate();
      } else {
        self.AddMilkCrate(parent.MilkCrate);
      }
    }
    break;
    case "DIVIDER": {
      if (parent.MilkCrate.enabled == false) {
        self.DestroyMilkCrate();
      } else {
        self.AddMilkCrate(parent.MilkCrate);
      }
    }
    break;
    }

    // let posRedrawTree = new ParentTreeRedraw();
    // posRedrawTree.PositionDirectChildren(self.VueStore, self.ParentID);

    parent.ApplyZIndexing();

    self.Group.draw();
  }
  /**
   * Called to update this current item when a change has been made to it by external items. 
   * Will be mainly used for milk crating for now.
   * @param {*} parentID 
   */
  UpdateMilkCrate(parentID) {
    // let self = this;
    // let ctrl_store = new StoreHelper();
    // let parentItem = ctrl_store.getPlanogramItemById(self.VueStore, parentID);

    // if (parentItem == null && parentID != self.ID) {
    //   return;
    // }

    // let allChildren = ctrl_store.getAllPlanogramItems(self.VueStore, parentID);

    // let fixtureWidth = parentItem.TotalWidth;
    // let overallWidth = 0;
    // let overallHeight = 0;

    // allChildren.forEach(child => {
    //   let size = child.GetActualSize();
    //   overallWidth += size.width;
    //   overallHeight += size.height;
    // });

    // if (overallWidth > fixtureWidth) {
    //   let width = fixtureWidth / allChildren.length;
    //   let height = 0; // TODO calculate if outside a shelf, basket, pallet etc
    //   parentItem.MilkCrate.enabled = true;
    //   parentItem.MilkCrate.size.width = width;
    //   parentItem.MilkCrate.size.height = height;
    //   console.log('[MILK CRATING APPLIES]', parentItem.MilkCrate, fixtureWidth, overallWidth, allChildren, parentItem);

    // } else {
    //   // reset milk crate
    //   parentItem.MilkCrate.enabled = false;
    //   parentItem.MilkCrate.size.width = 0;
    //   parentItem.MilkCrate.size.height = 0;

    //   console.log('[MILK CRATING NO APPLY]', parentItem.MilkCrate, fixtureWidth, overallWidth, allChildren, parentItem);
    // }

    // // if (parentItem.MilkCrate.enabled == true) {
    // allChildren.forEach(child => {
    //   child.Update();
    // });
    // // }
  }

  Cache() {
    let self = this;
    self.Group.clearCache();
    self.Group.cache({
      pixelRatio: self.Quality
    });
  }

  ClearCache() {
    let self = this;
    self.Group.clearCache();
  }

  AddMilkCrate(milkCrateDetails) {
    let self = this;

    self.DestroyMilkCrate();

    self.MilkCrateRect = new Konva.Image({
      x: 0,
      y: 0,
      width: milkCrateDetails.size.width,
      height: self.TotalHeight, //milkCrateDetails.size.height,
      fill: 'yellow'
    })

    switch (self.Type.toUpperCase()) {
      case "PRODUCT": {
        //TODO: Add text as facings amount
        self.MilkCrateText = new Konva.Text({
          x: 0,
          y: milkCrateDetails.size.height / 2,
          width: milkCrateDetails.size.width,
          height: milkCrateDetails.size.height,
          fontFamily: 'Arial Black',
          text: self.Facings_X,
          fontSize: 15,
          align: 'center'
        })
      }
      break;
    case "BASKET": {
      //TODO: Add facings amounta s default of 1
      self.MilkCrateText = new Konva.Text({
        x: 0,
        y: milkCrateDetails.size.height / 2,
        width: milkCrateDetails.size.width,
        height: milkCrateDetails.size.height,
        fontFamily: 'Arial Black',
        text: "1",
        fontSize: 15,
        align: 'center'
      })
    }
    break;
    case "DIVIDER": {
      //TODO: Add facings amounta s default of 1
      self.MilkCrateText = new Konva.Text({
        x: 0,
        y: 0,
        width: milkCrateDetails.size.width,
        height: milkCrateDetails.size.height,
        fontFamily: 'Arial Black',
        text: "1",
        fontSize: 15,
        align: 'center'
      })
    }
    break;
    }

    self.Group.add(self.MilkCrateRect);
    self.Group.add(self.MilkCrateText);
  }

  DestroyMilkCrate() {
    let self = this;

    if (self.MilkCrateRect != null) {
      self.MilkCrateRect.destroy();
      self.MilkCrateRect = null;
    }

    if (self.MilkCrateText != null) {
      self.MilkCrateText.destroy();
      self.MilkCrateText = null;
    }

    self.Layer.draw();
  }

  MoveAllExceptCurrentDown() {
    let self = this;

    let ctrl_store = new StoreHelper();
    let itemArr = ctrl_store.getAllPlanogramItems(self.VueStore);
    let actualArr = itemArr.filter((el) => el.Type.toUpperCase() == "GONDOLA");

    actualArr.forEach(planogramItem => {
      if (planogramItem.ID != self.ID) {
        planogramItem.Group.moveDown();
        planogramItem.Group.draw();
      }
    });

    self.Layer.draw();
  }

  SetSelected(selected) {
    let self = this;
    self.Selected = selected;
    // self.SetBaseDraggable(selected);

    let event = new CustomEmitter();

    if (self.Type.toUpperCase() == "PRODUCT") {
      // TODO: Visuals must go here
      // event.notify_product_group_selected_deselected(EventBus, self.Selected, self);
      event.notify_product_group_selected_deselected(EventBus, true, self);
    } else {
      event.notify_gondola_selected_deselected(EventBus, true, self);
    }

    // if (self.Selected) {
    //   self.Group.moveToTop();
    // } else {
    //   self.Group.moveToBottom();
    // }

    // TODO: Deselect all other selected items
  }

  AddToStore() {
    let self = this;

    let ctrl_store = new StoreHelper();
    ctrl_store.addPlanogramItem(self.VueStore, self);
  }

  GetChildFromTotalChildrenArray(childID, parentID) {
    let self = this;

    let ctrl_store = new StoreHelper();
    let parentItem = ctrl_store.getPlanogramItemById(self.VueStore, parentID);

    let exists = parentItem.TotalChildren.filter((el) => el.ID == childID);

    if (exists.length > 0) {
      return exists[0];
    } else {
      return null;
    }
  }

  RemoveChildFromTotalChildrenArray(childID, parentID) {
    let self = this;
    let ctrl_store = new StoreHelper();
    let parentItem = ctrl_store.getPlanogramItemById(self.VueStore, parentID);

    if (parentItem != null) {
      for (var i = 0; i < parentItem.TotalChildren.length; i++) {
        if (parentItem.TotalChildren[i].ID === childID) {
          parentItem.TotalChildren.splice(i, 1);
        }
      }
      // console.log("[FIXTURE TOTAL CHILDREN]", parentItem.Type, "REMOVED:", self.Type, "CHILDREN COUNT:", parentItem.TotalChildren);
    }
  }

  IncreaseParentChildrenCounter(positionElementRequired, parentID = null) {
    // get the parent item, increase the total children count
    // ** BEWARE - you must also decrease the children count when moving it from fixture to fixture
    let self = this;
    let ctrl_store = new StoreHelper();

    let parentItem = ctrl_store.getPlanogramItemById(self.VueStore, parentID == null ? self.ParentID : parentID);
    let existing = self.GetChildFromTotalChildrenArray(self.ID, parentID == null ? self.ParentID : parentID);

    if (parentItem != null && parentItem != undefined) {
      // console.log("[CALLING UPDATE] CALLED");
      switch (self.Type.toUpperCase()) {
        case "PRODUCT": {
          if (existing == null) {
            parentItem.TotalChildren.push({
              ID: self.ID,
              Type: self.Type,
              Item: self,
              Count: self.Facings_X,
              Width: self.Orientation_Width
            });

          } else {
            self.RemoveChildFromTotalChildrenArray(existing.ID, parentItem.ID);
            parentItem.TotalChildren.push({
              ID: self.ID,
              Type: self.Type,
              Item: self,
              Count: self.Facings_X,
              Width: self.Orientation_Width
            });
          }
        }
        break;
      case "BASKET": {
        if (existing == null) {
          parentItem.TotalChildren.push({
            ID: self.ID,
            Type: self.Type,
            Item: self,
            Count: 1,
            Width: self.TotalWidth
          });

        } else {
          self.RemoveChildFromTotalChildrenArray(existing.ID, parentItem.ID);
          parentItem.TotalChildren.push({
            ID: self.ID,
            Type: self.Type,
            Item: self,
            Count: 1,
            Width: self.TotalWidth
          });
        }
      }
      break;
      case "DIVIDER": {
        if (existing == null) {
          parentItem.TotalChildren.push({
            ID: self.ID,
            Type: self.Type,
            Item: self,
            Count: 1,
            Width: self.TotalWidth
          });

        } else {
          self.RemoveChildFromTotalChildrenArray(existing.ID, parentItem.ID);
          parentItem.TotalChildren.push({
            ID: self.ID,
            Type: self.Type,
            Item: self,
            Count: 1,
            Width: self.TotalWidth
          });
        }
      }
      break;
      }

      // TODO: Figure out a way not to redraw a million times.....


      // if (ctrl_store.getCloneItem(self.VueStore) == null) {
      //   let spreadType = parentItem.Data.spreadProducts;
      //   if (spreadType == "SFE" || (parentItem.Data.squish != undefined && parentItem.Data.squish != null && parentItem.Data.squish == true)) {
      //     let children = ctrl_store.getAllPlanogramItems(self.VueStore, parentItem.ID);
      //     children.forEach(child => {

      //       child.Update();
      //       child.PositionElement();
      //     });
      //   }

      // console.log("[FIXTURE TOTAL CHILDREN]", parentItem.Type, "ADDED:", self.Type, "CHILDREN COUNT:", parentItem.TotalChildren);
    }
  }

  //#region Call Parent to redraw & or position its children
  UpdateParent(parentID, redraw = false) {
    let self = this;
    let ctrl_store = new StoreHelper();

    let parentItem = ctrl_store.getPlanogramItemById(self.VueStore, parentID);

    if (parentItem == null) {
      return;
    }

    let posRedrawTree = new ParentTreeRedraw();

    // test SFE
    let drawn = false;
    let spreadType = parentItem.Data.spreadProducts;
    if (spreadType == "SFE" || spreadType == "SE") {
      posRedrawTree.PositionAndRedrawDirectChildren(self.VueStore, parentID);
      drawn = true;
    }

    if (parentItem.Data.squish != undefined && parentItem.Data.squish != null && parentItem.Data.squish == true) {
      posRedrawTree.PositionAndRedrawDirectChildren(self.VueStore, parentID);
      drawn = true;
    }

    if (drawn == false) {
      if (redraw == true) {
        posRedrawTree.PositionAndRedrawDirectChildren(self.VueStore, parentID);
      } else {
        posRedrawTree.PositionDirectChildren(self.VueStore, self.ParentID);
      }
    }
  }
  //#endregion


  AddToParentGroup() {
    let self = this;

  }

  //#region Adjust root group position after dimension change
  AdjustMasterGroupPositionAfterDimensionChange(lastData, newData) {
    let self = this;
    let retVal = {
      deltaX: 0,
      deltaY: 0
    }
    // get delta change set y or x of master group
    let deltaChange_y = (lastData.height * self.Ratio) - (newData.height * self.Ratio);
    let deltaChange_x = (lastData.width * self.Ratio) - (newData.width * self.Ratio);

    retVal.deltaY = deltaChange_y;
    retVal.deltaX = deltaChange_x;
    return retVal;
  }

  AdjustElementPosition(deltaX, deltaY, child = false) {
    let self = this;
    let newX = self.Group.getX();
    let newY = self.Group.getY();

    if (child == false) {
      if (deltaY > 0) { // positive adjustment
        newY += deltaY;
      } else { // negative adjustment
        newY -= (deltaY * -1);
      }

      if (deltaX > 0) { // positive adjustment
        newX += deltaX;
      } else { // negative adjustment
        newX -= (deltaX * -1);
      }
    } else {
      if (deltaY > 0) { // positive adjustment
        newY -= deltaY;
      } else { // negative adjustment
        newY += (deltaY * -1);
      }

      if (deltaX > 0) { // positive adjustment
        newX -= deltaX;
      } else { // negative adjustment
        newX += (deltaX * -1);
      }
    }

    self.Group.setX(newX);
    self.Group.setY(newY);
    self.Group.draw();
  }
  //#endregion

  MoveToParentGroup(parent) {
    let self = this;
    self.Group.moveTo(parent.Group);

    self.RemoveChildFromTotalChildrenArray(self.ID, self.ParentID);
    self.IncreaseParentChildrenCounter(true, parent.ID)
  }

  AddCloneToGroup(cloneItem) { // will be caled from cloning tool
    let self = this;
    self.Group.add(cloneItem);
  }

  TurnRenderingsOn() {
    let self = this;
    self.RenderingsOn = true;
    // TODO: Make sure the calling of this method is for types that include renderings
    self.AddRenderings();
  }

  TurnRenderingsOff() {
    let self = this;
    self.RenderingsOn = false;

    // TODO: Make sure the calling of this method is for types that include renderings
    self.RemoveRenderings();
  }

  HideShowLabels() {
    let self = this;

    if (self.Data.labelsOn == false) {
      self.Text.hide();
    } else {
      self.Text.show();
    }
  }

  TurnImagesOn(quality) {
    let self = this;
    self.ImagesOn = true;
    self.GroupsOn = false;

    switch (self.Type.toUpperCase()) {
      case "PRODUCT": {
        self.Quality = quality;
        self.ToggleImages();
        self.Cache();
        self.Layer.batchDraw();
        // self.ShowGroupBox();
      }
      break;;
    }
  }

  TurnImagesOff() {
    let self = this;
    self.ImagesOn = false;

    switch (self.Type.toUpperCase()) {
      case "PRODUCT": {
        self.ToggleImages();
        self.Cache();
        self.Layer.batchDraw();
      }
      break;;
    }
  }

  TurnLabelsOn() {
    let self = this;
    self.labelsOn = true;

    switch (self.Type.toUpperCase()) {
      case "PRODUCT": {
        self.ToggleLabels();
        self.Cache();
        self.Layer.batchDraw();
      }
      break;;
    }
  }

  TurnLabelsOff() {
    let self = this;
    self.labelsOn = false;

    switch (self.Type.toUpperCase()) {
      case "PRODUCT": {
        self.ToggleLabels();
        self.Cache();
        self.Layer.batchDraw();
      }
      break;;
    }
  }

  TurnGroupsOn() {
    let self = this;
    self.GroupsOn = true;
    self.ImagesOn = false;

    switch (self.Type.toUpperCase()) {
      case "PRODUCT": {
        // self.ToggleImages();
        self.ToggleGroups();
      }
      break;;
    }
  }

  TurnGroupsOff() {
    let self = this;
    self.GroupsOn = false;

    switch (self.Type.toUpperCase()) {
      case "PRODUCT": {
        self.ToggleGroups();
      }
      break;;
    }
  }

  AddTextCosmetic() {
    let self = this;

    self.Text = new Konva.Text({
      x: 0,
      y: 0,
      text: self.Data.label == undefined ? self.Type : self.Data.label + self.Position.toString(),
      fontFamily: 'Arial',
      fontSize: 10,
      padding: 0.5,
      fill: 'black',
      transformsEnabled: 'position'
    })

    self.SetTextLabelPosition();

    self.Group.add(self.Text);
  }

  SetTextLabel(number) {
    let self = this;
    self.Position = number;
    self.Text.text(self.Data.label + " " + number);
    self.Group.draw();
  }

  SetTextLabelPosition() {
    let self = this;
    let ctrl_store = new StoreHelper();
    let planogramSettings = ctrl_store.getPlanogramSettings(self.VueStore);

    let x = 0;
    let y = 0;

    if (planogramSettings != null && planogramSettings != undefined) {
      if (planogramSettings.LabelConfig.Position == "left") {
        self.Text.setX(x);
        self.Text.setY(y);
      } else {
        let tw = self.Text.getTextWidth() + self.Text.padding();
        x = self.TotalWidth - tw;
        self.Text.setX(x);
      }
    }

    self.Group.draw();
  }

  //#region Modals + Dimensions
  Open_Modal() {
    let self = this;
    let event = new CustomEmitter();
    let ctrl_store = new StoreHelper();
    let allFixtures = ctrl_store.getFixtures(self.VueStore);

    allFixtures.forEach(fixture => {
      if (fixture.id == self.Data.id) {
        self.Data.renderings = fixture.renderings;
      }
    });

    switch (self.Type.toUpperCase()) {
      case "GONDOLA": {
        event.modal_load(EventBus, "GONDOLA", null, self.Data, self.ID, self);
      }
      break;
    case "PALETTE": {
      event.modal_load(EventBus, "FIXTURE", "PALETTE", self, self.ID, self);
    }
    break;
    case "SHELF": {
      event.modal_load(EventBus, "FIXTURE", "SHELF", self, self.ID, self);
    }
    break;
    case "BASE": {
      event.modal_load(EventBus, "FIXTURE", "BASE", self, self.ID, self);
    }
    break;
    case "PEGBAR": {
      event.modal_load(EventBus, "FIXTURE", "PEGBAR", self, self.ID, self);
    }
    break;
    case "PEGBOARD": {
      event.modal_load(EventBus, "FIXTURE", "PEGBOARD", self, self.ID, self);
    }
    break;
    case "BASKET": {
      event.modal_load(EventBus, "FIXTURE", "BASKET", self, self.ID, self);
    }
    break;
    case "AREA": {
      event.modal_load(EventBus, "FIXTURE", "AREA", self, self.ID, self);
    }
    break;
    case "PRODUCT": {
      event.modal_load(EventBus, "PRODUCT", "", self, self.ID, self);
    }
    break;
    case "LABELHOLDER": {
      event.modal_load(EventBus, "FIXTURE", "LABELHOLDER", self, self.ID, self);
    }
    break;
    }

  }
  //#endregion

  //#region Delete

  Delete() {
    let self = this;
    let ctrl_store = new StoreHelper();
    ctrl_store.removePlanogramItem(self.VueStore, self);
    self.Layer.find('Transformer').destroy();
    self.Group.destroy();

    switch (self.Type.toUpperCase()) {
      case "PRODUCT": {
        self.RemoveChildFromTotalChildrenArray(self.ID, self.ParentID);
      }
      break;
    case "BASKET": {
      self.RemoveChildFromTotalChildrenArray(self.ID, self.ParentID);
    }
    break;
    case "DIVIDER": {
      self.RemoveChildFromTotalChildrenArray(self.ID, self.ParentID);
    }
    break;
    }

    // TODO: reposition elements
    if (self.ParentID != undefined && self.parentID != null) {
      let parentItem = ctrl_store.getPlanogramItemById(self.VueStore, self.ParentID);
      if (parentItem != null) {
        self.UpdateParent(parentItem.ID);
      }
    }

    self.Stage.draw();
  }

  //#endregion

  //#region To Object
  ToObject() {
    let self = this;
    let retVal = null;
    let newTotalChildren = [];

    self.TotalChildren.forEach(element => {
      newTotalChildren.push({
        Count: element.Count,
        ID: element.ID,
        Item: null,
        Type: element.Type,
        Width: element.Width
      });
    });

    switch (self.Type.toUpperCase()) {
      case "PRODUCT": {
        retVal = {
          Type: self.Type.toUpperCase(),
          RelativePosition: {
            x: self.Group.getX(),
            y: self.Group.getY(),
          },
          AbsolutePosition: {
            x: self.Group.getAbsolutePosition().x,
            y: self.Group.getAbsolutePosition().y
          },
          Data: {
            Data: self.Data,
            ID: self.ID,
            ParentID: self.ParentID,
            Config: self.ProductConfig,
            Facings: {
              x: self.Facings_X,
              y: self.Facings_Y,
              z: self.Facings_Z
            },
            Orientation: {
              Rotation: self.Rotation,
              LastFace: self.LastFace,
              Width: self.Orientation_Width,
              Height: self.Orientation_Height,
              Depth: self.Orientation_Depth
            },
            ImageOrientation: {
              Width: self.image_orientation_width,
              Height: self.image_orientation_height
            },
            Caps: {
              Orientation: {
                Width: self.Cap_Orientation_Width,
                Height: self.Cap_Orientation_Height,
                Depth: self.Cap_Orientation_Depth
              },
              ImageOrientation: {
                Width: self.caps_image_orientation_width,
                Height: self.caps_image_orientation_height
              },
              Rotation: self.Cap_Rotation,
              Caps_Face: self.Caps_Face,
              Caps_Count: self.Caps_Count,
              Caps_Enabled: self.Caps_Enabled
            },
            TotalWidth: self.TotalWidth,
            TotalHeight: self.TotalHeight,
            RandomColor: self.RandomColor
          },
          Position: self.Position
        }
      }
      break;
    case "AREA": {
      retVal = {
        Type: self.Type.toUpperCase(),
        RelativePosition: {
          x: self.Group.getX(),
          y: self.Group.getY(),
        },
        AbsolutePosition: {
          x: self.Group.getAbsolutePosition().x,
          y: self.Group.getAbsolutePosition().y
        },
        Data: {
          Data: self.Data,
          ID: self.ID,
          ParentID: self.ParentID,
          Config: self.Config
        },
        Position: self.Position,
        Label: self.LabelText
      }
    }
    break;
    case "BASKET": {
      retVal = {
        Type: self.Type.toUpperCase(),
        RelativePosition: {
          x: self.Group.getX(),
          y: self.Group.getY(),
        },
        AbsolutePosition: {
          x: self.Group.getAbsolutePosition().x,
          y: self.Group.getAbsolutePosition().y
        },
        Data: {
          Data: self.Data,
          ID: self.ID,
          ParentID: self.ParentID,
          Config: self.Config,
          TotalChildren: newTotalChildren
        },
        Position: self.Position,
        Label: self.LabelText
      }
    }
    break;
    case "BASE": {
      retVal = {
        Type: self.Type.toUpperCase(),
        RelativePosition: {
          x: self.Group.getX(),
          y: self.Group.getY(),
        },
        AbsolutePosition: {
          x: self.Group.getAbsolutePosition().x,
          y: self.Group.getAbsolutePosition().y
        },
        Data: {
          Data: self.Data,
          ID: self.ID,
          ParentID: self.ParentID,
          Config: self.Config,
          TotalChildren: newTotalChildren
        },
        Position: self.Position,
        Label: self.LabelText
      }
    }
    break;
    case "SHELF": {
      retVal = {
        Type: self.Type.toUpperCase(),
        RelativePosition: {
          x: self.Group.getX(),
          y: self.Group.getY(),
        },
        AbsolutePosition: {
          x: self.Group.getAbsolutePosition().x,
          y: self.Group.getAbsolutePosition().y
        },
        Data: {
          Data: self.Data,
          ID: self.ID,
          ParentID: self.ParentID,
          Config: self.Config,
          TotalChildren: newTotalChildren
        },
        Position: self.Position,
        Label: self.LabelText
      }
    }
    break;
    case "PEGBOARD": {
      retVal = {
        Type: self.Type.toUpperCase(),
        RelativePosition: {
          x: self.Group.getX(),
          y: self.Group.getY(),
        },
        AbsolutePosition: {
          x: self.Group.getAbsolutePosition().x,
          y: self.Group.getAbsolutePosition().y
        },
        Data: {
          Data: self.Data,
          ID: self.ID,
          ParentID: self.ParentID,
          Config: self.Config
        },
        Position: self.Position,
        Label: self.LabelText
      }
    }
    break;
    case "PEGBAR": {
      retVal = {
        Type: self.Type.toUpperCase(),
        RelativePosition: {
          x: self.Group.getX(),
          y: self.Group.getY(),
        },
        AbsolutePosition: {
          x: self.Group.getAbsolutePosition().x,
          y: self.Group.getAbsolutePosition().y
        },
        Data: {
          Data: self.Data,
          ID: self.ID,
          ParentID: self.ParentID,
          Config: self.Config,
          TotalChildren: newTotalChildren
        },
        Position: self.Position,
        Label: self.LabelText
      }
    }
    break;
    case "GONDOLA": {
      retVal = {
        Type: self.Type.toUpperCase(),
        RelativePosition: {
          x: self.Group.getX(),
          y: self.Group.getY(),
        },
        AbsolutePosition: {
          x: self.Group.getAbsolutePosition().x,
          y: self.Group.getAbsolutePosition().y
        },
        Data: {
          Data: self.Data,
          ID: self.ID,
          ParentID: self.ParentID,
          Config: self.Config
        },
        Position: self.Position,
        Label: self.LabelText
      }
    }
    break;
    case "PALETTE": {
      retVal = {
        Type: self.Type.toUpperCase(),
        RelativePosition: {
          x: self.Group.getX(),
          y: self.Group.getY(),
        },
        AbsolutePosition: {
          x: self.Group.getAbsolutePosition().x,
          y: self.Group.getAbsolutePosition().y
        },
        Data: {
          Data: self.Data,
          ID: self.ID,
          ParentID: self.ParentID,
          Config: self.Config
        },
        Position: self.Position,
        Label: self.LabelText
      }
    }
    break;
    case "TEXTHEADER": {
      retVal = {
        Type: self.Type.toUpperCase(),
        RelativePosition: {
          x: self.Group.getX(),
          y: self.Group.getY(),
        },
        AbsolutePosition: {
          x: self.Group.getAbsolutePosition().x,
          y: self.Group.getAbsolutePosition().y
        },
        Data: {
          Data: self.Data,
          ID: self.ID,
          ParentID: self.ParentID,
          Config: self.Config,
          Text: self.StringText
        },
        Scale: {
          ScaleX: self.Group.scaleX(),
          ScaleY: self.Group.scaleY()
        },
        Position: self.Position,
        Label: self.LabelText
      }
    }
    break;
    case "LABELHOLDER": {
      retVal = {
        Type: self.Type.toUpperCase(),
        RelativePosition: {
          x: self.Group.getX(),
          y: self.Group.getY(),
        },
        AbsolutePosition: {
          x: self.Group.getAbsolutePosition().x,
          y: self.Group.getAbsolutePosition().y
        },
        Data: {
          Data: self.Data,
          ID: self.ID,
          ParentID: self.ParentID,
          Config: self.Config,
          TotalChildren: newTotalChildren
        },
        Position: self.Position,
        Label: self.LabelText
      }
    }
    break;
    }

    return retVal;
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

  randomColor() {
    // return "#" + Math.random().toString(16).slice(2, 8);
    return 'rgb(' +
      (Math.floor(Math.random() * 56) + 200) + ', ' +
      (Math.floor(Math.random() * 56) + 200) + ', ' +
      (Math.floor(Math.random() * 56) + 200) +
      ')';
  }
}

export default PlanogramItemBase;