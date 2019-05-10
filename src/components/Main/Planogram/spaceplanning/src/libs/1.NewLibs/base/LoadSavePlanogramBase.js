import Konva from 'konva';
import StoreHelper from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/StoreHelper/StoreHelper.js";
import GondolaNew from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/GondolaBase.js";
import TextHeaderNew from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/TextHeaderBase.js";
import PaletteNew from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/PaletteBase.js";
import ShelfNew from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/ShelfBase.js";
import BaseNew from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/BaseShelf.js";
import PegboardNew from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/PegboardBase.js";
import PegBarNew from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/PegBarBase.js";
import ProductGroupNew from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/ProductBase.js";
import BasketNew from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/BasketBase.js";
import PlanogramNamer from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/PlanogramNamer.js";
import axios from 'axios';
import StageWarehouseMiddleware from '@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/stage-warehouse-middleware.js';
import ParentTreeRedraw from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/RedrawParentChildBase.js";
import AreaNew from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/AreaBase.js";
import LabelHolderNew from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/LabelHolderBase.js";
import CalculationHandler from "@/components/Main/Planogram/spaceplanning/src/libs/CalculationLib/calculationHandler.js";
import LabelHelper from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/Labeling/LabelingBase.js";

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

  save(vuex, stage, clusterData, dimensionData, spacePlanID, spacePlanName, updateName, image) {
    let self = this;
    let ctrl_store = new StoreHelper();
    let allItems = ctrl_store.getAllPlanogramItems(vuex);
    let allProducts = ctrl_store.getAllPlanogramItemsByType(vuex, "PRODUCT");

    let output = {
      name: "",
      stage: null,
      planogramData: [],
      planogramSettings: vuex.getters.getPlanogramProperties,
      clusterData: clusterData,
      dimensionData: dimensionData,
      image: image
    }

    allItems.forEach(item => {
      // remove the line below to test that the positions are being saved and repopulated in the load
      // item.PositionElement();
      output.planogramData.push(item.ToObject());
    });

    allProducts.forEach(ap => {
      output.planogramData.forEach(pdi => {
        if (ap.ID == pdi.Data.ID) {
          let calcData = calculate(ap, vuex);
          pdi.Data["CalcData"] = calcData;
        }
      })
    })

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

      if (clusterData.storeCluster != null && clusterData.storeCluster != "") {
        planogramName += " - " + clusterData.storeCluster;
      }

      if (clusterData.storeName != null && clusterData.storeName != "") {
        planogramName += " - " + clusterData.storeName;
      }

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
    } else {
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
          process.env.VUE_APP_API +
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
          if (rangeProducts == null) {
            self.startLoadingPlanogram(r.data, Stage, pxlRatio, MasterLayer, VueStore, hideLoader);
          } else {
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

    // Set Plangram settings
    if (fileData.planogramSettings != undefined && fileData.planogramSettings != null) {
      VueStore.commit("setPlanogramProperties", fileData.planogramSettings);
      console.log('[LOAD PLANGRAM SETTINGS]', fileData.planogramSettings);
    }

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

    let ctrl_label = new LabelHelper();
    ctrl_label.SetNewLabelAndPositionNumbers(VueStore);

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

          if (CurrentItem.Position != undefined && CurrentItem.Position != null)
          {
            ctrl_item.Position = CurrentItem.Position;
          }

          // set json data values to the object
          ctrl_item.ID = CurrentItem.Data.ID;

          ctrl_item.Initialise(CurrentItem.RelativePosition, false);
        }
        break;
      case "AREA":
        {
          let ctrl_item = new AreaNew(
            VueStore,
            Stage,
            MasterLayer,
            CurrentItem.Data.Data,
            PxlRatio,
            "AREA",
            ParentID
          )
          
          if (CurrentItem.Position != undefined && CurrentItem.Position != null)
          {
            ctrl_item.Position = CurrentItem.Position;
          }

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
          
          if (CurrentItem.Position != undefined && CurrentItem.Position != null)
          {
            ctrl_item.Position = CurrentItem.Position;
          }

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
          
          if (CurrentItem.Position != undefined && CurrentItem.Position != null)
          {
            ctrl_item.Position = CurrentItem.Position;
          }

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

          if (CurrentItem.Position != undefined && CurrentItem.Position != null)
          {
            ctrl_item.Position = CurrentItem.Position;
          }


          // set json data values to the object
          ctrl_item.ID = CurrentItem.Data.ID;
          ctrl_item.Config = CurrentItem.Data.Config;
          if (CurrentItem.Data.TotalChildren != null && CurrentItem.Data.TotalChildren != undefined && CurrentItem.Data.TotalChildren.length > 0) {
            ctrl_item.TotalChildren = CurrentItem.Data.TotalChildren;
          }

          ctrl_item.Initialise(CurrentItem.RelativePosition, false);
          ctrl_item.ApplyZIndexing();
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

          if (CurrentItem.Position != undefined && CurrentItem.Position != null)
          {
            ctrl_item.Position = CurrentItem.Position;
          }

          // set json data values to the object
          ctrl_item.ID = CurrentItem.Data.ID;
          ctrl_item.Config = CurrentItem.Data.Config;
          if (CurrentItem.Data.TotalChildren != null && CurrentItem.Data.TotalChildren != undefined && CurrentItem.Data.TotalChildren.length > 0) {
            ctrl_item.TotalChildren = CurrentItem.Data.TotalChildren;
          }

          ctrl_item.Initialise(CurrentItem.RelativePosition, false);
          ctrl_item.ApplyZIndexing();
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

          if (CurrentItem.Position != undefined && CurrentItem.Position != null)
          {
            ctrl_item.Position = CurrentItem.Position;
          }

          // set json data values to the object
          ctrl_item.ID = CurrentItem.Data.ID;
          ctrl_item.Config = CurrentItem.Data.Config;
          if (CurrentItem.Data.TotalChildren != null && CurrentItem.Data.TotalChildren != undefined && CurrentItem.Data.TotalChildren.length > 0) {
            ctrl_item.TotalChildren = CurrentItem.Data.TotalChildren;
          }

          ctrl_item.Initialise(CurrentItem.RelativePosition, false);
          ctrl_item.ApplyZIndexing();
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

          if (CurrentItem.Position != undefined && CurrentItem.Position != null)
          {
            ctrl_item.Position = CurrentItem.Position;
          }

          // set json data values to the object
          ctrl_item.ID = CurrentItem.Data.ID;
          ctrl_item.Config = CurrentItem.Data.Config;
          if (CurrentItem.Data.TotalChildren != null && CurrentItem.Data.TotalChildren != undefined && CurrentItem.Data.TotalChildren.length > 0) {
            ctrl_item.TotalChildren = CurrentItem.Data.TotalChildren;
          }

          ctrl_item.Initialise(CurrentItem.RelativePosition, false);
          ctrl_item.ApplyZIndexing();
        }
        break;
      case "LABELHOLDER":
        {
          let ctrl_item = new LabelHolderNew(
            VueStore,
            Stage,
            MasterLayer,
            CurrentItem.Data.Data,
            PxlRatio,
            "LABELHOLDER",
            ParentID
          )

          if (CurrentItem.Position != undefined && CurrentItem.Position != null)
          {
            ctrl_item.Position = CurrentItem.Position;
          }

          // set json data values to the object
          ctrl_item.ID = CurrentItem.Data.ID;
          ctrl_item.Config = CurrentItem.Data.Config;
          if (CurrentItem.Data.TotalChildren != null && CurrentItem.Data.TotalChildren != undefined && CurrentItem.Data.TotalChildren.length > 0) {
            ctrl_item.TotalChildren = CurrentItem.Data.TotalChildren;
          }

          ctrl_item.Initialise(CurrentItem.RelativePosition, false);
          ctrl_item.ApplyZIndexing();
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

          if (CurrentItem.Position != undefined && CurrentItem.Position != null)
          {
            ctrl_item.Position = CurrentItem.Position;
          }

          // set json data values to the object
          ctrl_item.ID = CurrentItem.Data.ID;
          ctrl_item.Config = CurrentItem.Data.Config;

          ctrl_item.Initialise(CurrentItem.RelativePosition, false);
          ctrl_item.ApplyZIndexing();
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

          if (CurrentItem.Position != undefined && CurrentItem.Position != null)
          {
            ctrl_item.Position = CurrentItem.Position;
          }

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
      }
    }
  }
}

function calculate(productItem, vuex) {
  let self = this;
  let calculationHandler = new CalculationHandler();

  var calcData = {
    XFacings: null,
    Capacity: null,
    DaysOfSupply: null,
    Weekly_Sales_Retail: null,
    Weekly_Sales_Cost: null,
    Weekly_Sales_Units: null,
    Weekly_Profit: null
  }

  let productEventData = productItem;
  let productID = productEventData.Data.productID;

  let productData;

  let ctrl_store = new StoreHelper();
  let productStoreCopy = ctrl_store.getAllPlanogramItemsByType(vuex, "PRODUCT");

  productStoreCopy = productStoreCopy.slice(0, productStoreCopy.length);

  productData = {
    ProductData: productEventData.Data,
    Facings_X: 0,
    Facings_Y: 0,
    Facings_Z: 0,
    TotalFacings: 0
  };

  productStoreCopy.forEach((element, index) => {
    if (element.Data.productID == productID) {
      productData.Facings_X += element.Facings_X;
      productData.Facings_Y += element.Facings_Y;
      productData.Facings_Z += element.Facings_Z;
      productData.TotalFacings += element.TotalFacings;
    }
  });

  calcData.DaysOfSupply = calculationHandler.Calculate_Days_Of_Supply_Potential(
    productData.TotalFacings,
    productData.ProductData.sales_Units
  );

  calcData.Weekly_Sales_Retail = calculationHandler.Calculate_Weekly_Sales_Retail(productData.ProductData.sales_Retail);
  calcData.Weekly_Sales_Cost = calculationHandler.Calculate_Weekly_Sales_Cost(productData.ProductData.sales_Cost);
  calcData.Weekly_Sales_Units = calculationHandler.Calculate_Weekly_Sales_Units(productData.ProductData.sales_Units);
  calcData.Weekly_Profit = calculationHandler.Calculate_Weekly_Profit(productData.ProductData.sales_Profit);
  calcData.XFacings = productData.Facings_X;
  calcData.Capacity = productData.TotalFacings;

  return calcData;
}

export default LoadSavePlanogramBase;