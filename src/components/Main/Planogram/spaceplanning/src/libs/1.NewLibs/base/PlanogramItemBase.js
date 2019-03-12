import Konva from 'konva';
import StoreHelper from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/StoreHelper/StoreHelper.js";
import LabelHelper from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/Labeling/LabelingBase.js";
import IntersectionTester from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/intersection/IntersectionTester.js";
import EventBus from '@/components/Main/Planogram/spaceplanning/src/libs/EventBus/EventBus.js';
import CustomEmitter from '@/components/Main/Planogram/spaceplanning/src/libs/EventBus/CustomEmitter.js';

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
      case "GONDOLA":
        {
          self.Config.LabelOrder = "T2B";
        }
        break;
      case "SHELF":
        {
          self.Config.SpreadType = "L2R";
        }
        break;
      case "BASE":
        {
          self.Config.SpreadType = "L2R";
        }
        break;
      case "PEGBAR":
        {
          self.Config.SpreadType = "L2R";
        }
        break;
      case "PEGBOARD":
        {

        }
        break;
      case "BASKET":
        {
          self.Config.SpreadType = "L2R";
        }
        break;
      case "DIVIDER":
        {
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
    } else if (self.Type.toUpperCase() == "TEXTHEADER") {
      self.Group = new Konva.Group({
        id: self.Type + '_master_group_' + self.ID,
        name: self.Type + '_master_group',
        x: dropPos.x,
        y: dropPos.y,
        draggable: true
      })
    } else if (self.Type.toUpperCase() == "BASKET" || self.Type.toUpperCase() == "DIVIDER" || self.Type.toUpperCase() == "PRODUCT") {
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
          let yLowerBound = gondola.Group.getAbsolutePosition().y + ((gondola.Group.getHeight() * self.Stage.scaleY()) - (self.Data.height * self.Ratio));
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

      self.ApplyZIndexing();

    });

    self.Group.on('dragend touchend', function (evt) {
      evt.cancelBubble = true;

      let ctrl_intrsct = new IntersectionTester();
      let ctrl_store = new StoreHelper();
      let typeArr = [];
      switch (self.Type.toUpperCase()) {
        case "GONDOLA":
          {

          }
          break;
        case "PALETTE":
          {
            typeArr = ["GONDOLA"];
          }
          break;
        case "PRODUCT":
          {
            typeArr = ["SHELF", "BASE", "BASKET", "PEGBAR", "PEGBOARD", "PALETTE"];
          }
          break;
        case "SHELF":
          {
            typeArr = ["GONDOLA"];
          }
          break;
        case "BASE":
          {
            typeArr = ["GONDOLA"];
          }
          break;
        case "BASKET":
          {
            typeArr = ["SHELF", "BASE", "PEGBAR", "PEGBOARD", "DIVIDER", "PALETTE"];
          }
          break;
        case "PEGBAR":
          {
            typeArr = ["GONDOLA"];
          }
          break;
        case "PEGBOARD":
          {
            typeArr = ["GONDOLA"];
          }
          break;
        case "DIVIDER":
          {
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
    let shelves = ctrl_store.getAllPlanogramItemsByType(self.VueStore, "SHELF", parentID);

    //#region Rendering
    // SHELVES
    shelves.forEach(shelf => {
      if (shelf.Renderings && shelf.Renderings.length > 0) {
        shelf.Renderings.forEach(rendering => {
          switch (rendering.type.toUpperCase()) {
            case "SHELFEDGE":
              {
                rendering.konva.moveToTop();
              }
              break;
            case "LABELHOLDER":
              {
                rendering.konva.moveToTop();
              }
              break;
            case "BACKRENDERING":
              {
                rendering.konva.moveToBottom();
              }
              break;
            case "FRONTRENDERING":
              {
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
            case "SHELFEDGE":
              {
                rendering.konva.moveToTop();
              }
              break;
            case "LABELHOLDER":
              {
                rendering.konva.moveToTop();
              }
              break;
            case "BACKRENDERING":
              {
                rendering.konva.moveToBottom();
              }
              break;
            case "FRONTRENDERING":
              {
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
            case "LABELHOLDER":
              {
                rendering.konva.moveToTop();
              }
              break;
          }
        });
      }

      hangingBar.Group.draw();
    });

    // BASKETS
    let baskets = ctrl_store.getAllPlanogramItemsByType(self.VueStore, "BASKET", parentID);

    baskets.forEach(basket => {
      if (basket.Renderings && basket.Renderings.length > 0) {
        basket.Renderings.forEach(rendering => {
          switch (rendering.type.toUpperCase()) {
            case "LABELHOLDER":
              {
                rendering.konva.moveToTop();
              }
              break;
            case "FRONTRENDERING":
              {
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
            case "FRONTRENDERING":
              {
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

        let gBases = ctrl_store.getAllPlanogramItemsByType(self.VueStore, "PEGBAR", element.ID);
        gBases.forEach(element => {
          element.Group.moveToTop();
        });

      }
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

  GetSpreadSpacing(parentID) {
    let self = this;
    let retVal = 0;
    let ctrl_store = new StoreHelper();
    let parentItem = ctrl_store.getPlanogramItemById(self.VueStore, parentID);

    // console.log("PRODUCT PARENT FOR GetSpreadSpacing HAS AN ISSUE", parentItem, parentItem.Type, self)

    if (parentItem == null || parentItem.Type == null || parentItem.Type == undefined) {
      // console.log("PRODUCT PARENT FOR GetSpreadSpacing HAS AN ISSUE", parentItem, parentItem.Type)
      return retVal;
    }

    if (parentID == self.ID) {
      return retVal;
    }

    if (parentItem.Type.toUpperCase() == "PRODUCT") {
      return retVal;
    }

    let totalItemWidths = 0;
    let totalItems = 0;
    let parentWidth = parentItem.TotalWidth;
    let spacing = 0;

    let allChildren = ctrl_store.getAllPlanogramItems(self.VueStore, parentID);
    // let sortedArr = allParentItems.filter((el) => el.Type.toUpperCase() == "BASKET" || el.Type.toUpperCase() == "PRODUCT")
    // sort them by x/y
    let sortedArr = allChildren.sort((a, b) => a.Group.getX() - b.Group.getX());

    if (sortedArr.length > 1) {
      totalItems = sortedArr.length;
    } else {
      totalItems = 1;
    }

    switch (parentItem.Type.toUpperCase()) {
      case "BASE":
        {
          let spreadType = parentItem.Data.spreadProducts;

          if (spreadType.toUpperCase() != "SFE") {
            return retVal;
          }

          sortedArr.forEach((item, idx) => {
            totalItemWidths += item.GetActualSize().width;
          });

          spacing = (parentWidth - totalItemWidths) / totalItems;
          retVal = spacing;
        }
        break;
      case "SHELF":
        {
          let spreadType = parentItem.Data.spreadProducts;

          if (spreadType.toUpperCase() != "SFE") {
            return retVal;
          }
          // console.log("[GETSPREADSPACER]", sortedArr)
          sortedArr.forEach((item, idx) => {
            totalItemWidths += item.GetActualSize().width;
          });

          spacing = (parentWidth - totalItemWidths) / totalItems;
          // console.log("[GETSPREADSPACER]", sortedArr, spacing, parentWidth, totalItemWidths, totalItems)
          retVal = spacing;
        }
        break;
      case "BASKET":
        {
          let spreadType = parentItem.Data.spreadProducts;

          if (spreadType.toUpperCase() != "SFE") {
            return retVal;
          }

          sortedArr.forEach((item, idx) => {
            totalItemWidths += item.GetActualSize().width;
          });

          spacing = (parentWidth - totalItemWidths) / totalItems;
          retVal = spacing;
        }
        break;
      case "PEGBAR":
        {
          let spreadType = parentItem.Data.spreadProducts;

          if (spreadType.toUpperCase() != "SFE") {
            return retVal;
          }

          sortedArr.forEach((item, idx) => {
            totalItemWidths += item.GetActualSize().width;
          });

          spacing = (parentWidth - totalItemWidths) / totalItems;
          retVal = spacing;
        }
        break;
      default:
        {
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
      case "PRODUCT":
        {
          retVal = {
            width: self.Orientation_Width * self.Facings_X,
            height: self.Orientation_Height * self.Facings_Y + (self.Caps_Count * self.Cap_Orientation_Height)
          }
        }
        break;
      case "BASE":
        {
          retVal = {
            width: self.Data.width * self.Ratio,
            height: self.Data.height * self.Ratio
          }
        }
        break;
      case "SHELF":
        {
          retVal = {
            width: self.Data.width * self.Ratio,
            height: self.Data.height * self.Ratio
          }
        }
        break;
      case "BASKET":
        {
          retVal = {
            width: self.Data.width * self.Ratio,
            height: self.Data.height * self.Ratio
          }
        }
        break;
      case "PEGBAR":
        {
          retVal = {
            width: self.Data.width * self.Ratio,
            height: self.Data.height * self.Ratio
          }
        }
        break;
      case "PEGBOARD":
        {
          retVal = {
            width: self.Data.width * self.Ratio,
            height: self.Data.height * self.Ratio
          }
        }
        break;
      case "PALETTE":
        {
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
      case "PRODUCT":
        {
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
      case "BASKET":
        {
          if (parent.MilkCrate.enabled == false) {
            self.DestroyMilkCrate();
          } else {
            self.AddMilkCrate(parent.MilkCrate);
          }
        }
        break;
      case "DIVIDER":
        {
          if (parent.MilkCrate.enabled == false) {
            self.DestroyMilkCrate();
          } else {
            self.AddMilkCrate(parent.MilkCrate);
          }
        }
        break;
    }

    // let allChildren = ctrl_store.getAllPlanogramItems(self.VueStore, parent.ID);

    // allChildren.forEach(child => {
    //   child.PositionElement();
    // });

    parent.ApplyZIndexing();

    // console.log("[UPDATE] END", self.Type, self.ID, parent);
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
      case "PRODUCT":
        {
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
      case "BASKET":
        {
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
      case "DIVIDER":
        {
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

    if (self.Type.toUpperCase() == "PRODUCT") {
      let event = new CustomEmitter();
      // TODO: Visuals must go here
      // event.notify_product_group_selected_deselected(EventBus, self.Selected, self);
      event.notify_product_group_selected_deselected(EventBus, true, self);
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

  HideShowLabels () {
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
      case "PRODUCT":
        {
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
      case "PRODUCT":
        {
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
      case "PRODUCT":
        {
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
      case "PRODUCT":
        {
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
      case "PRODUCT":
        {
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
      case "PRODUCT":
        {
          self.ToggleGroups();
        }
        break;;
    }
  }

  //#region Modals + Dimensions
  Open_Modal() {
    let self = this;
    let event = new CustomEmitter();

    switch (self.Type.toUpperCase()) {
      case "GONDOLA":
        {
          event.modal_load(EventBus, "GONDOLA", null, self.Data, self.ID, self);
        }
        break;
      case "PALETTE":
        {
          event.modal_load(EventBus, "FIXTURE", "PALETTE", self, self.ID, self);
        }
        break;
      case "SHELF":
        {
          event.modal_load(EventBus, "FIXTURE", "SHELF", self, self.ID, self);
        }
        break;
      case "BASE":
        {
          event.modal_load(EventBus, "FIXTURE", "BASE", self, self.ID, self);
        }
        break;
      case "PEGBAR":
        {
          event.modal_load(EventBus, "FIXTURE", "PEGBAR", self, self.ID, self);
        }
        break;
      case "PEGBOARD":
        {
          event.modal_load(EventBus, "FIXTURE", "PEGBOARD", self, self.ID, self);
        }
        break;
      case "BASKET":
        {
          event.modal_load(EventBus, "FIXTURE", "BASKET", self, self.ID, self);
        }
        break;
      case "PRODUCT":
        {
          event.modal_load(EventBus, "PRODUCT", "", self, self.ID, self);
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
    self.Group.destroy();

    // TODO: reposition elements
    self.PositionElement();
  }

  //#endregion

  //#region To Object
  ToObject() {
    let self = this;
    let retVal = null;
    switch (self.Type.toUpperCase()) {
      case "PRODUCT":
        {
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
            }
          }
        }
        break;
      case "BASKET":
        {
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
            }
          }
        }
        break;
      case "BASE":
        {
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
            }
          }
        }
        break;
      case "SHELF":
        {
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
            }
          }
        }
        break;
      case "PEGBOARD":
        {
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
            }
          }
        }
        break;
      case "PEGBAR":
        {
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
            }
          }
        }
        break;
      case "GONDOLA":
        {
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
            }
          }
        }
        break;
      case "PALETTE":
        {
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
            }
          }
        }
        break;
      case "TEXTHEADER":
        {
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
            }
          }
        }
        break;
    }

    return retVal;
  }
  //#endregion

  //#region Conditonal drag bound functions - nice to haves

  bindShelf() {

  }

  bindBase() {

  }

  bindProduct() {

  }

  bindBasket() {

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