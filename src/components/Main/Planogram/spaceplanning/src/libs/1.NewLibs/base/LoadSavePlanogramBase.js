import Konva from 'konva';
import StoreHelper from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/StoreHelper/StoreHelper.js";
import GondolaNew from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/Base/GondolaBase.js";
import TextHeaderNew from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/Base/TextHeaderBase.js";
import PaletteNew from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/Base/PaletteBase.js";
import ShelfNew from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/Base/ShelfBase.js";
import BaseNew from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/Base/BaseShelf.js";
import PegboardNew from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/Base/PegboardBase.js";
import PegBarNew from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/Base/PegBarBase.js";
import ProductGroupNew from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/Base/ProductBase.js";
import BasketNew from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/Base/BasketBase.js";
import PlanogramNamer from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/Base/PlanogramNamer.js";
import axios from 'axios';
import StageWarehouseMiddleware from '@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/Base/stage-warehouse-middleware.js';
import ParentTreeRedraw from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/RedrawParentChildBase.js";

class LoadSavePlanogramBase {
  constructor(serverAddress, bCreate, planogramID) {
    this.ServerAddress = serverAddress;
    this.Create = bCreate;
    this.PlanogramID = planogramID;
    this.ParentTreeRedraw = new ParentTreeRedraw();
  }

  setCreate(create) {
    this.Create = create;
  }

  save(vuex, stage, clusterData, dimensionData, spacePlanID, spacePlanName, updateName) {
    let self = this;
    let ctrl_store = new StoreHelper();
    let allItems = ctrl_store.getAllPlanogramItems(vuex);

    let output = {
      name: "",
      stage: null,
      planogramData: [],
      clusterData: clusterData,
      dimensionData: dimensionData
    }

    allItems.forEach(item => {
      output.planogramData.push(item.ToObject());
    });

    let planogramName = "";

    if (updateName) {
      if (clusterData.planogramName != null)
        planogramName += clusterData.planogramName
      if (clusterData.periodic != null) {
        if (clusterData.periodic)
          planogramName += " - " + clusterData.monthsBetween + "MMA";
        else
          planogramName += " - " + clusterData.dateFromString + " to " + clusterData.dateToString;
      }
      if (clusterData.tag != null && clusterData.tag != "")
        planogramName += clusterData.tag;

      if (clusterData.storeCluster != null && clusterData.storeCluster != "")
        planogramName += " - " + clusterData.clusterName;

      if (planogramName != "")
        planogramName += " - XXX";

      planogramName += " - " + dimensionData.modules + " Module " + "(" + dimensionData.height + "M" + " x " + dimensionData.width + "M)";

      if (planogramName[1] == "-")
        planogramName = planogramName.replace(' -', "");

      if (planogramName != "") {
        planogramName += " - D" + dimensionData.displays;
        planogramName += " - P" + dimensionData.pallettes;
        planogramName += " - S" + dimensionData.supplierStands;
        planogramName += " - B" + dimensionData.bins;
      }
    }
    else {
      planogramName = spacePlanName;
    }

    output.name = planogramName;

    if (self.Create == true) {
      axios
        .post(
          self.ServerAddress + "SystemFile/Json?db=CR-Devinspire", {
            systemFile: {
              systemUserID: 10,
              folder: "Space Planning",
              name: planogramName
            },
            data: output
          }
        )
        .then(result => {
          if (result.data.success == true) {
            alert(planogramName + " Successfully saved new.");
          } else {
            alert("Server responded unsuccessfully!");
          }
        })
        .catch(error => {
          console.error("Failed to save planogram file");
        });
    } else {
      axios
        .put(
          process.env.ServerAddress +
          `SystemFile/Json?db=CR-Devinspire&id=${spacePlanID}&name=${planogramName}`,
          output
        )
        .then(result => {
          if (result.data.success == true) {
            alert(planogramName + " Successfully saved.");
          } else {
            alert("Server responded unsuccessfully!");
          }
        })
        .catch(error => {
          console.error("Failed to save planogram file");
        });
    }
  }

  determinePlanogramName(allPlanogramItems, clusterData) {
    // TODO: Make sure that we change the name to the correct standard.
    // return clusterData.planogramName + " " + clusterData.clusterName;
    return PlanogramNamer.generatePlanogramName(allPlanogramItems, clusterData);
  }

  loadPlanogram(spacePlanID, VueStore, MasterLayer, Stage, pxlRatio, afterGetSpacePlanFile, hideLoader) {
    let self = this;

    self.resetStage(VueStore, MasterLayer, Stage);

    axios.get(self.ServerAddress + `SystemFile/JSON?db=CR-Devinspire&id=${spacePlanID}`)
      .then(r => {
        afterGetSpacePlanFile(r.data.clusterData, r.data.dimensionData, r.data.name, rangeProducts => {
          if(rangeProducts == null) {
            self.startLoadingPlanogram(r.data, Stage, pxlRatio, MasterLayer, VueStore, hideLoader);
          }
          else {
            r.data.planogramData = StageWarehouseMiddleware.verifyIntegrityOfWarehouseData(r.data.planogramData, rangeProducts);
            self.startLoadingPlanogram(r.data, Stage, pxlRatio, MasterLayer, VueStore, hideLoader);
          }
        });
      })
      .catch(e => {
        alert("Failed to get data. " + e);
      })
  }

  resetStage(VueStore, MasterLayer, Stage) {
    let self = this;
    VueStore.commit('resetStore');

    // add the layer back

    // then do the rest

    // let allNodes = MasterLayer.findAncestors('Group');

    // allNodes.forEach(node => {
    //   node.destroy();
    // });

    Stage.scaleX(1);
    Stage.scaleY(1);
    Stage.position({
      x: 0,
      y: 0
    });
    Stage.batchDraw();
  }

  startLoadingPlanogram(fileData, Stage, PxlRatio, MasterLayer, VueStore, hideLoader) {

    console.log("START LOADING", Stage, MasterLayer);

    let self = this;
    let MasterData = fileData.planogramData;

    // Init Gondolas
    let gondolaArr = MasterData.filter((el) => el.Type == "GONDOLA");
    gondolaArr.sort((a, b) => a.RelativePosition.x - b.RelativePosition.x);

    gondolaArr.forEach(CurrentItem => {
      // start with gondola
      // go into recursive function foreach gondola
      self.loadItemRecursive(MasterData, CurrentItem, null, Stage, MasterLayer, PxlRatio, VueStore);
      // console.warn('[LOAD SAVE] ROOT ITEM COMPLETE', CurrentItem.Type, new Date());
    })

    // Init Text Headers
    let textHeaderArr = MasterData.filter((el) => el.Type == "TEXTHEADER");
    textHeaderArr.forEach(CurrentItem => {
      // start with gondola
      // go into recursive function foreach gondola
      self.loadItemRecursive(MasterData, CurrentItem, null, Stage, MasterLayer, PxlRatio, VueStore);
    })

    Stage.draw();

    hideLoader();
  }

  loadItemRecursive(MasterData, CurrentItem, ParentID, Stage, MasterLayer, PxlRatio, VueStore) {
    // recursive function will create all children of gondola
    // console.log('[LOAD SAVE] Load item recursive', CurrentItem.Type, new Date());
    let self = this;

    // create the current item
    let ctrl_item = null;
    switch (CurrentItem.Type.toUpperCase()) {
      case "GONDOLA":
        {
          let ctrl_item = new GondolaNew(
            VueStore,
            Stage,
            MasterLayer,
            CurrentItem.Data.Data,
            PxlRatio,
            "GONDOLA",
            ParentID
          )

          // set json data values to the object
          ctrl_item.ID = CurrentItem.Data.ID;

          ctrl_item.Initialise(CurrentItem.RelativePosition, false);
        }
        break;
        case "TEXTHEADER":
        {
          let ctrl_item = new TextHeaderNew(
            VueStore,
            Stage,
            MasterLayer,
            CurrentItem.Data.Data,
            PxlRatio,
            "TEXTHEADER",
            CurrentItem.Scale,
            CurrentItem.Data.Text
          )

          // set json data values to the object
          ctrl_item.ID = CurrentItem.Data.ID;

          ctrl_item.Initialise(CurrentItem.RelativePosition, false);
        }
        break;
      case "PALETTE":
        {
          let ctrl_item = new PaletteNew(
            VueStore,
            Stage,
            MasterLayer,
            CurrentItem.Data.Data,
            PxlRatio,
            "PALETTE",
            ParentID
          )

          // set json data values to the object
          ctrl_item.ID = CurrentItem.Data.ID;

          ctrl_item.Initialise(CurrentItem.RelativePosition, false);
        }
        break;
      case "SHELF":
        {
          let ctrl_item = new ShelfNew(
            VueStore,
            Stage,
            MasterLayer,
            CurrentItem.Data.Data,
            PxlRatio,
            "SHELF",
            ParentID
          )

          // set json data values to the object
          ctrl_item.ID = CurrentItem.Data.ID;
          ctrl_item.Config = CurrentItem.Data.Config;

          ctrl_item.Initialise(CurrentItem.RelativePosition, false);

        }
        break;
      case "BASE":
        {
          let ctrl_item = new BaseNew(
            VueStore,
            Stage,
            MasterLayer,
            CurrentItem.Data.Data,
            PxlRatio,
            "BASE",
            ParentID
          )

          // set json data values to the object
          ctrl_item.ID = CurrentItem.Data.ID;
          ctrl_item.Config = CurrentItem.Data.Config;

          ctrl_item.Initialise(CurrentItem.RelativePosition, false);

        }
        break;
      case "BASKET":
        {
          let ctrl_item = new BasketNew(
            VueStore,
            Stage,
            MasterLayer,
            CurrentItem.Data.Data,
            PxlRatio,
            "BASKET",
            ParentID
          )

          // set json data values to the object
          ctrl_item.ID = CurrentItem.Data.ID;
          ctrl_item.Config = CurrentItem.Data.Config;

          ctrl_item.Initialise(CurrentItem.RelativePosition, false);

        }
        break;
      case "PEGBAR":
        {
          let ctrl_item = new PegBarNew(
            VueStore,
            Stage,
            MasterLayer,
            CurrentItem.Data.Data,
            PxlRatio,
            "PEGBAR",
            ParentID
          )

          // set json data values to the object
          ctrl_item.ID = CurrentItem.Data.ID;
          ctrl_item.Config = CurrentItem.Data.Config;

          ctrl_item.Initialise(CurrentItem.RelativePosition, false);

        }
        break;
      case "PEGBOARD":
        {
          let ctrl_item = new PegboardNew(
            VueStore,
            Stage,
            MasterLayer,
            CurrentItem.Data.Data,
            PxlRatio,
            "PEGBOARD",
            ParentID
          )

          // set json data values to the object
          ctrl_item.ID = CurrentItem.Data.ID;
          ctrl_item.Config = CurrentItem.Data.Config;

          ctrl_item.Initialise(CurrentItem.RelativePosition, false);

        }
        break;
      case "PRODUCT":
        {
          let ctrl_item = new ProductGroupNew(
            VueStore,
            Stage,
            MasterLayer,
            CurrentItem.Data.Data,
            PxlRatio,
            "PRODUCT",
            ParentID
          )

          //#region Set the same configs
          ctrl_item.ID = CurrentItem.Data.ID;
          ctrl_item.Orientation_Width = CurrentItem.Data.Orientation.Width;
          ctrl_item.Orientation_Height = CurrentItem.Data.Orientation.Height;
          ctrl_item.Orientation_Depth = CurrentItem.Data.Orientation.Depth;

          ctrl_item.image_orientation_width = CurrentItem.Data.ImageOrientation.Width;
          ctrl_item.image_orientation_height = CurrentItem.Data.ImageOrientation.Height;

          // caps
          ctrl_item.Cap_Orientation_Width = CurrentItem.Data.Caps.Orientation.Width;
          ctrl_item.Cap_Orientation_Height = CurrentItem.Data.Caps.Orientation.Height;
          ctrl_item.Cap_Orientation_Depth = CurrentItem.Data.Caps.Orientation.Depth;
          ctrl_item.Caps_Count = CurrentItem.Data.Caps.Caps_Count;
          ctrl_item.Caps_Face = CurrentItem.Data.Caps.Caps_Face;
          ctrl_item.caps_image_orientation_width = CurrentItem.Data.Caps.ImageOrientation.Width;
          ctrl_item.caps_image_orientation_height = CurrentItem.Data.Caps.ImageOrientation.Height;
          ctrl_item.Caps_Enabled = CurrentItem.Data.Caps.Caps_Enabled;
          ctrl_item.Cap_Rotation = CurrentItem.Data.Caps.Rotation;
          // orientation and facings
          ctrl_item.Rotation = CurrentItem.Data.Orientation.Rotation;
          ctrl_item.LastFace = CurrentItem.Data.Orientation.LastFace;

          ctrl_item.TotalWidth = CurrentItem.Data.TotalWidth;
          ctrl_item.TotalHeight = CurrentItem.Data.TotalHeight;

          ctrl_item.Facings_X = CurrentItem.Data.Facings.x;
          ctrl_item.Facings_Y = CurrentItem.Data.Facings.y;
          ctrl_item.Facings_Z = CurrentItem.Data.Facings.z;

          ctrl_item.RandomColor = CurrentItem.Data.RandomColor;
          ctrl_item.PegboardHoleAssigned = CurrentItem.Data.PegboardHoleAssigned;
          ctrl_item.PegboardHoleAssignedID = CurrentItem.Data.PegboardHoleAssignedID;
          //#endregion

          ctrl_item.Initialise(CurrentItem.RelativePosition, false);

        }
        break;
    }

    if (ctrl_item != null) {
      ctrl_item.Group.setX(CurrentItem.RelativePosition.x);
      ctrl_item.Group.setY(CurrentItem.RelativePosition.y);
    }


    let itemArr = MasterData.filter((el) => el.Data.ParentID == CurrentItem.Data.ID);
    itemArr.sort((a, b) => a.RelativePosition.x - b.RelativePosition.x);

    // check if there are children and call recursive
    if (itemArr != undefined && itemArr != null) {
      // get all children of the current item, call recursive function
      if (itemArr.length > 0) {
        itemArr.forEach(child => {
          self.loadItemRecursive(MasterData, child, child.Data.ParentID, Stage, MasterLayer, PxlRatio, VueStore);
        });
      } else {
        // update the chilrend to sit correctly in terms of display for (product facings/spread even etc)
        let parentData = MasterData.filter((el) => el.Data.ID == ParentID);
        // console.log("[LOAD SAVE] REDRAW AFTER LAST CHILD IN PARENT ROOT", parentData, ParentID, parentData[0].Data.Data.spreadProducts);
        if (parentData.length > 0) {
          if (parentData[0].Data.Data.spreadProducts == "SE" || parentData[0].Data.Data.spreadProducts == "SFE") {
            console.log("[LOAD SAVE] REDRAW AFTER LAST CHILD IN PARENT ROOT");
            self.ParentTreeRedraw.RedrawParentDirectChildren(VueStore, ParentID);
          }
        }
      }
    }
  }
}

export default LoadSavePlanogramBase;
