import Konva from 'konva';
import StoreHelper from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/StoreHelper/StoreHelper.js";
import IntersectionTester from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/intersection/IntersectionTester.js";
import PlanogramItemBase from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/PlanogramItemBase.js";
import GondolaNew from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/GondolaBase.js";
import PaletteNew from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/PaletteBase.js";
import ShelfNew from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/ShelfBase.js";
import BaseNew from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/BaseShelf.js";
import PegboardNew from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/PegboardBase.js";
import PegBarNew from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/PegBarBase.js";
import BasketNew from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/BasketBase.js";
import ShareboxNew from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/BasketBase.js";
import AreaNew from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/AreaBase.js";
import LabelHolderNew from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/LabelHolderBase.js";
import ProductGroupNew from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/ProductBase.js";

class CloneBase {
  constructor(cloneType) {
    this.cloneRootType = cloneType;
    this.FirstCall = false;
  }

  /**
   * Purpose: Clone a group and all its children recursively.
   * @param {*} VueStore - the vue store
   * @param {*} stage - the stage
   * @param {*} item - the item to clone
   * @param {*} prev_original_item - the previous original item (set to null from ROOT caller)
   * @param {*} prev_clone_item - the previous cloned item (set to null from ROOT caller)
   */
  Clone(VueStore, stage, item, prev_original_item, prev_clone_item, afterCloneCallBack) {
    let self = this;

    self.originalParentItem = item;

    let ctrl_store = new StoreHelper();
    let ctrl_intersectionTest = new IntersectionTester();

    // let dropPos = item.Group.getAbsolutePosition() //ctrl_intersectionTest.GetTransformedMousePoint(stage);
    let dropPos = item.Group.position() //ctrl_intersectionTest.GetTransformedMousePoint(stage);

    // stop the drag event of the previous item
    if (self.FirstCall == false) {
      item.Group.stopDrag();
      self.FirstCall = true;
    }

    // find all elements within the object
    let childrenItemArr = ctrl_store.getAllPlanogramItems(VueStore, item.ID);
    childrenItemArr.sort((a, b) => a.Group.getX() - b.Group.getX());

    switch (item.Type.toUpperCase()) {
      case "GONDOLA": {
        self.CloneGondola(stage, VueStore, item.Layer, item.Ratio, item.ParentID, item.Data, dropPos, item, prev_original_item, prev_clone_item, )
          .then(newItem => {
            childrenItemArr.forEach(childItem => {
              self.Clone(VueStore, stage, childItem, item, newItem, afterCloneCallBack);
            });

            if (childrenItemArr.length == 0) {
              afterCloneCallBack();
            }
          })
      }
      break;
    case "AREA": {
      self.CloneArea(stage, VueStore, item.Layer, item.Ratio, item.ParentID, item.Data, dropPos, item, prev_original_item, prev_clone_item, )
        .then(newItem => {
          childrenItemArr.forEach(childItem => {
            self.Clone(VueStore, stage, childItem, item, newItem, afterCloneCallBack);
          });

          if (childrenItemArr.length == 0) {
            afterCloneCallBack();
          }
        })
    }
    break;
    case "LABELHOLDER": {
      self.CloneLabelHolder(stage, VueStore, item.Layer, item.Ratio, item.ParentID, item.Data, dropPos, item, prev_original_item, prev_clone_item, )
        .then(newItem => {
          childrenItemArr.forEach(childItem => {
            self.Clone(VueStore, stage, childItem, item, newItem, afterCloneCallBack);
          });

          if (childrenItemArr.length == 0) {
            afterCloneCallBack();
          }
        })
    }
    break;
    case "PALETTE": {
      self.ClonePalette(stage, VueStore, item.Layer, item.Ratio, item.ParentID, item.Data, dropPos, item, prev_original_item, prev_clone_item)
        .then(newItem => {
          childrenItemArr.forEach(childItem => {
            self.Clone(VueStore, stage, childItem, item, newItem, afterCloneCallBack);
          });

          if (childrenItemArr.length == 0) {
            afterCloneCallBack();
          }
        })
    }
    break;
    case "SHELF": {
      // clone the shelf, then recursively call Clone with each child item
      self.CloneShelf(stage, VueStore, item.Layer, item.Ratio, item.ParentID, item.Data, dropPos, item, prev_original_item, prev_clone_item)
        .then(newItem => {
          console.log("START")
          childrenItemArr.forEach(childItem => {
            self.Clone(VueStore, stage, childItem, item, newItem, afterCloneCallBack);
          });

          // if (childrenItemArr.length == 0) {
          console.log("CALL CB")
          afterCloneCallBack();
          console.log("DONE")
          // }
        })
    }
    break;
    case "BASKET": {
      self.CloneBasket(stage, VueStore, item.Layer, item.Ratio, item.ParentID, item.Data, dropPos, item, prev_original_item, prev_clone_item)
        .then(newItem => {
          childrenItemArr.forEach(childItem => {
            self.Clone(VueStore, stage, childItem, item, newItem, afterCloneCallBack);
          });

          if (childrenItemArr.length == 0) {
            afterCloneCallBack();
          }
        })
    }
    break;
    case "SHAREBOX": {
      self.CloneSharebox(stage, VueStore, item.Layer, item.Ratio, item.ParentID, item.Data, dropPos, item, prev_original_item, prev_clone_item)
        .then(newItem => {
          childrenItemArr.forEach(childItem => {
            self.Clone(VueStore, stage, childItem, item, newItem, afterCloneCallBack);
          });

          if (childrenItemArr.length == 0) {
            afterCloneCallBack();
          }
        })
    }
    break;
    case "BASE": {
      self.CloneBase(stage, VueStore, item.Layer, item.Ratio, item.ParentID, item.Data, dropPos, item, prev_original_item, prev_clone_item)
        .then(newItem => {
          childrenItemArr.forEach(childItem => {
            self.Clone(VueStore, stage, childItem, item, newItem, afterCloneCallBack);
          });

          if (childrenItemArr.length == 0) {
            afterCloneCallBack();
          }
        })
    }
    break;
    case "PEGBAR": {
      self.ClonePegbar(stage, VueStore, item.Layer, item.Ratio, item.ParentID, item.Data, dropPos, item, prev_original_item, prev_clone_item)
        .then(newItem => {
          childrenItemArr.forEach(childItem => {
            self.Clone(VueStore, stage, childItem, item, newItem, afterCloneCallBack);
          });

          if (childrenItemArr.length == 0) {
            afterCloneCallBack();
          }
        })

    }
    break;
    case "PEGBOARD": {
      self.ClonePegboard(stage, VueStore, item.Layer, item.Ratio, item.ParentID, item.Data, dropPos, item, prev_original_item, prev_clone_item)
        .then(newItem => {
          childrenItemArr.forEach(childItem => {
            self.Clone(VueStore, stage, childItem, item, newItem, afterCloneCallBack);
          });

          if (childrenItemArr.length == 0) {
            afterCloneCallBack();
          }
        })
    }
    break;
    case "PRODUCT": {
      self.CloneProduct(stage, VueStore, item.Layer, item.Ratio, item.ParentID, item.Data, dropPos, item, prev_original_item, prev_clone_item)
        .then(newItem => {
          // childrenItemArr.forEach(childItem => {
          //   self.Clone(VueStore, stage, childItem, item, newItem);
          // });

          // if (childrenItemArr.length == 0) {
          //   afterCloneCallBack();
          // }
        })
    }
    break;

    }

    // do the cloning

  }

  CloneShelf(stage, VueStore, MasterLayer, pixelRatio, parentID, data, dropPos, current_item, prev_original_item, prev_clone_item) {
    let self = this;

    return new Promise((resolve) => {
      let ctrl_item = new ShelfNew(
        VueStore,
        stage,
        MasterLayer,
        data,
        pixelRatio,
        "SHELF",
        prev_clone_item == null ? parentID : prev_clone_item.ID
      );

      //#region Set the same configs
      ctrl_item.Config = current_item.Config;
      //#endregion

      ctrl_item.Initialise(dropPos, false);
      // start drag,
      // only start the drag on the root element being cloned
      if (self.cloneRootType == "SHELF") {
        ctrl_item.Group.startDrag();
      }

      if (current_item != null) {
        ctrl_item.Group.setX(current_item.Group.getX());
        ctrl_item.Group.setY(current_item.Group.getY());
        ctrl_item.LastPositionRelative = ctrl_item.Group.position();
        ctrl_item.LastPositionAbsolute = ctrl_item.Group.getAbsolutePosition();
        ctrl_item.PositionElement();
      }

      resolve(ctrl_item);
    });
  }

  CloneBase(stage, VueStore, MasterLayer, pixelRatio, parentID, data, dropPos, current_item, prev_original_item, prev_clone_item) {
    let self = this;

    return new Promise((resolve) => {
      let ctrl_item = new BaseNew(
        VueStore,
        stage,
        MasterLayer,
        data,
        pixelRatio,
        "BASE",
        prev_clone_item == null ? parentID : prev_clone_item.ID
      );

      //#region Set the same configs
      ctrl_item.Config = current_item.Config;
      //#endregion

      ctrl_item.Initialise(dropPos, false);
      // start drag,
      // only start the drag on the root element being cloned
      if (self.cloneRootType == "BASE") {
        ctrl_item.Group.startDrag();
      }

      if (current_item != null) {
        ctrl_item.Group.setX(current_item.Group.getX());
        ctrl_item.Group.setY(current_item.Group.getY());
        ctrl_item.LastPositionRelative = ctrl_item.Group.position();
        ctrl_item.LastPositionAbsolute = ctrl_item.Group.getAbsolutePosition();
        ctrl_item.PositionElement();
      }

      resolve(ctrl_item);
    });
  }

  CloneArea(stage, VueStore, MasterLayer, pixelRatio, parentID, data, dropPos, current_item, prev_original_item, prev_clone_item) {
    let self = this;

    return new Promise((resolve) => {
      let ctrl_item = new AreaNew(
        VueStore,
        stage,
        MasterLayer,
        data,
        pixelRatio,
        "AREA",
        prev_clone_item == null ? parentID : prev_clone_item.ID
      );

      //#region Set the same configs
      ctrl_item.Config = current_item.Config;
      //#endregion

      ctrl_item.Initialise(dropPos, false);
      // start drag,
      // only start the drag on the root element being cloned
      if (self.cloneRootType == "AREA") {
        ctrl_item.Group.startDrag();
      }

      if (current_item != null) {
        ctrl_item.Group.setX(current_item.Group.getX());
        ctrl_item.Group.setY(current_item.Group.getY());
        ctrl_item.LastPositionRelative = ctrl_item.Group.position();
        ctrl_item.LastPositionAbsolute = ctrl_item.Group.getAbsolutePosition();
        ctrl_item.PositionElement();
      }

      resolve(ctrl_item);
    });
  }

  CloneLabelHolder(stage, VueStore, MasterLayer, pixelRatio, parentID, data, dropPos, current_item, prev_original_item, prev_clone_item) {
    let self = this;

    return new Promise((resolve) => {
      let ctrl_item = new LabelHolderNew(
        VueStore,
        stage,
        MasterLayer,
        data,
        pixelRatio,
        "LABELHOLDER",
        prev_clone_item == null ? parentID : prev_clone_item.ID
      );

      //#region Set the same configs
      ctrl_item.Config = current_item.Config;
      //#endregion

      ctrl_item.Initialise(dropPos, false);
      // start drag,
      // only start the drag on the root element being cloned
      if (self.cloneRootType == "LABELHOLDER") {
        ctrl_item.Group.startDrag();
      }

      if (current_item != null) {
        ctrl_item.Group.setX(current_item.Group.getX());
        ctrl_item.Group.setY(current_item.Group.getY());
        ctrl_item.LastPositionRelative = ctrl_item.Group.position();
        ctrl_item.LastPositionAbsolute = ctrl_item.Group.getAbsolutePosition();
        ctrl_item.PositionElement();
      }

      resolve(ctrl_item);
    });
  }

  CloneBasket(stage, VueStore, MasterLayer, pixelRatio, parentID, data, dropPos, current_item, prev_original_item, prev_clone_item) {
    let self = this;

    return new Promise((resolve) => {
      let ctrl_item = new BasketNew(
        VueStore,
        stage,
        MasterLayer,
        data,
        pixelRatio,
        "BASKET",
        prev_clone_item == null ? parentID : prev_clone_item.ID
      );

      //#region Set the same configs
      ctrl_item.Config = current_item.Config;
      //#endregion

      ctrl_item.Initialise(dropPos, false);
      // start drag,
      // only start the drag on the root element being cloned
      if (self.cloneRootType == "BASKET") {
        ctrl_item.Group.startDrag();
      }

      if (current_item != null) {
        ctrl_item.Group.setX(current_item.Group.getX());
        ctrl_item.Group.setY(current_item.Group.getY());
        ctrl_item.LastPositionRelative = ctrl_item.Group.position();
        ctrl_item.LastPositionAbsolute = ctrl_item.Group.getAbsolutePosition();
        ctrl_item.PositionElement();
      }

      resolve(ctrl_item);
    });
  }

  CloneSharebox(stage, VueStore, MasterLayer, pixelRatio, parentID, data, dropPos, current_item, prev_original_item, prev_clone_item) {
    let self = this;

    return new Promise((resolve) => {
      let ctrl_item = new ShareboxNew(
        VueStore,
        stage,
        MasterLayer,
        data,
        pixelRatio,
        "SHAREBOX",
        prev_clone_item == null ? parentID : prev_clone_item.ID
      );

      //#region Set the same configs
      ctrl_item.Config = current_item.Config;
      //#endregion

      ctrl_item.Initialise(dropPos, false);
      // start drag,
      // only start the drag on the root element being cloned
      if (self.cloneRootType == "SHAREBOX") {
        ctrl_item.Group.startDrag();
      }

      if (current_item != null) {
        ctrl_item.Group.setX(current_item.Group.getX());
        ctrl_item.Group.setY(current_item.Group.getY());
        ctrl_item.LastPositionRelative = ctrl_item.Group.position();
        ctrl_item.LastPositionAbsolute = ctrl_item.Group.getAbsolutePosition();
        ctrl_item.PositionElement();
      }

      resolve(ctrl_item);
    });
  }

  ClonePegbar(stage, VueStore, MasterLayer, pixelRatio, parentID, data, dropPos, current_item, prev_original_item, prev_clone_item) {
    let self = this;

    return new Promise((resolve) => {
      let ctrl_item = new PegBarNew(
        VueStore,
        stage,
        MasterLayer,
        data,
        pixelRatio,
        "PEGBAR",
        prev_clone_item == null ? parentID : prev_clone_item.ID
      );

      //#region Set the same configs
      ctrl_item.Config = current_item.Config;
      //#endregion

      ctrl_item.Initialise(dropPos, false);
      // start drag,
      // only start the drag on the root element being cloned
      if (self.cloneRootType == "PEGBAR") {
        ctrl_item.Group.startDrag();
      }

      if (current_item != null) {
        ctrl_item.Group.setX(current_item.Group.getX());
        ctrl_item.Group.setY(current_item.Group.getY());
        ctrl_item.LastPositionRelative = ctrl_item.Group.position();
        ctrl_item.LastPositionAbsolute = ctrl_item.Group.getAbsolutePosition();
        ctrl_item.PositionElement();
      }

      resolve(ctrl_item);
    });
  }

  ClonePegboard(stage, VueStore, MasterLayer, pixelRatio, parentID, data, dropPos, current_item, prev_original_item, prev_clone_item) {
    let self = this;

    return new Promise((resolve) => {
      let ctrl_item = new PegboardNew(
        VueStore,
        stage,
        MasterLayer,
        data,
        pixelRatio,
        "PEGBOARD",
        prev_clone_item == null ? parentID : prev_clone_item.ID
      );

      //#region Set the same configs
      ctrl_item.Config = current_item.Config;
      //#endregion

      ctrl_item.Initialise(dropPos, false);
      // start drag,
      // only start the drag on the root element being cloned
      if (self.cloneRootType == "PEGBOARD") {
        ctrl_item.Group.startDrag();
      }

      if (current_item != null) {
        ctrl_item.Group.setX(current_item.Group.getX());
        ctrl_item.Group.setY(current_item.Group.getY());
        ctrl_item.LastPositionRelative = ctrl_item.Group.position();
        ctrl_item.LastPositionAbsolute = ctrl_item.Group.getAbsolutePosition();
        ctrl_item.PositionElement();
      }

      resolve(ctrl_item);
    });
  }

  CloneGondola(stage, VueStore, MasterLayer, pixelRatio, parentID, data, dropPos, current_item, prev_original_item, prev_clone_item) {
    let self = this;

    return new Promise((resolve) => {
      let ctrl_item = new GondolaNew(
        VueStore,
        stage,
        MasterLayer,
        data,
        pixelRatio,
        "GONDOLA",
        prev_clone_item == null ? parentID : prev_clone_item.ID
      );

      //#region Set the same configs
      ctrl_item.Config = current_item.Config;
      //#endregion

      ctrl_item.Initialise(dropPos, false);
      // start drag,
      // only start the drag on the root element being cloned
      if (self.cloneRootType == "GONDOLA") {
        ctrl_item.Group.startDrag();
      }

      if (current_item != null) {
        ctrl_item.Group.setX(current_item.Group.getX());
        ctrl_item.Group.setY(current_item.Group.getY());
        ctrl_item.LastPositionRelative = ctrl_item.Group.position();
        ctrl_item.LastPositionAbsolute = ctrl_item.Group.getAbsolutePosition();
        ctrl_item.PositionElement();
      }

      ctrl_item.CloneSettings.CloneListening = false;

      resolve(ctrl_item);
    });
  }

  ClonePalette(stage, VueStore, MasterLayer, pixelRatio, parentID, data, dropPos, current_item, prev_original_item, prev_clone_item) {
    let self = this;

    return new Promise((resolve) => {
      let ctrl_item = new PaletteNew(
        VueStore,
        stage,
        MasterLayer,
        data,
        pixelRatio,
        "PALETTE",
        prev_clone_item == null ? parentID : prev_clone_item.ID
      );

      //#region Set the same configs
      ctrl_item.Config = current_item.Config;
      //#endregion

      ctrl_item.Initialise(dropPos, false);
      // start drag,
      // only start the drag on the root element being cloned
      if (self.cloneRootType == "PALETTE") {
        ctrl_item.Group.startDrag();
      }

      if (current_item != null) {
        ctrl_item.Group.setX(current_item.Group.getX());
        ctrl_item.Group.setY(current_item.Group.getY());
        ctrl_item.LastPositionRelative = ctrl_item.Group.position();
        ctrl_item.LastPositionAbsolute = ctrl_item.Group.getAbsolutePosition();
        ctrl_item.PositionElement();
      }

      ctrl_item.CloneSettings.CloneListening = false;

      resolve(ctrl_item);
    });
  }

  CloneProduct(stage, VueStore, MasterLayer, pixelRatio, parentID, data, dropPos, current_item, prev_original_item, prev_clone_item) {
    let self = this;

    data = Object.assign({}, data)

    return new Promise((resolve) => {
      let ctrl_item = new ProductGroupNew(
        VueStore,
        stage,
        MasterLayer,
        data,
        pixelRatio,
        "PRODUCT",
        prev_clone_item == null ? parentID : prev_clone_item.ID
      );

      //#region Set the same configs
      ctrl_item.Config = current_item.Config;
      ctrl_item.ImagesOn = current_item.ImagesOn;
      ctrl_item.GroupsOn = current_item.GroupsOn;

      ctrl_item.Facings_X = current_item.Facings_X;
      ctrl_item.Facings_Y = current_item.Facings_Y;
      ctrl_item.Facings_Z = current_item.Facings_Z;
      ctrl_item.Orientation_Width = current_item.Orientation_Width;
      ctrl_item.Orientation_Height = current_item.Orientation_Height;
      ctrl_item.Orientation_Depth = current_item.Orientation_Depth;

      // caps
      ctrl_item.Cap_Orientation_Width = current_item.Cap_Orientation_Width;
      ctrl_item.Cap_Orientation_Height = current_item.Cap_Orientation_Height;
      ctrl_item.Cap_Orientation_Depth = current_item.Cap_Orientation_Depth;
      ctrl_item.caps_image_orientation_width = current_item.caps_image_orientation_width;
      ctrl_item.caps_image_orientation_height = current_item.caps_image_orientation_height;
      ctrl_item.Caps_Count = current_item.Caps_Count;
      ctrl_item.Cap_Rotation = current_item.Cap_Rotation;
      ctrl_item.Caps_Face = current_item.Caps_Face;
      ctrl_item.Caps_Enabled = current_item.Caps_Enabled;

      ctrl_item.image_orientation_width = current_item.image_orientation_width;
      ctrl_item.image_orientation_height = current_item.image_orientation_height;
      ctrl_item.LastFace = current_item.LastFace;
      ctrl_item.Rotation = current_item.Rotation;

      ctrl_item.image_used = current_item.image_used;
      ctrl_item.LastFace = current_item.LastFace;
      ctrl_item.current_itemBox_ON = current_item.current_itemBox_ON;
      ctrl_item.ImagesOff = current_item.ImagesOff;
      ctrl_item.ImagesOn = current_item.ImagesOn;
      ctrl_item.labelsOn = current_item.labelsOn;
      ctrl_item.GroupsOn = current_item.GroupsOn;
      //#endregion

      ctrl_item.Initialise(dropPos, false);
      // start drag,
      // only start the drag on the root element being cloned
      if (self.cloneRootType == "PRODUCT") {

        ctrl_item.Group.startDrag();
      }

      if (current_item != null) {
        ctrl_item.Group.setX(current_item.Group.getX());
        ctrl_item.Group.setY(current_item.Group.getY());
        ctrl_item.LastPositionRelative = ctrl_item.Group.position();
        ctrl_item.LastPositionAbsolute = ctrl_item.Group.getAbsolutePosition();
        // ctrl_item.PositionElement();
      }

      // console.log("[CLONE] PRODUCT POSITIONS", "NAME:", current_item.Data.description, "OLD", current_item.Group.position(),"NEW", ctrl_item.Group.position())
      ctrl_item.CloneSettings.CloneListening = false;
      ctrl_item.ToggleImages();

      resolve(ctrl_item);
    });
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

export default CloneBase;