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
import PegNew from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/PegBase.js";
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

  save(vuex, stage, clusterData, dimensionData, spacePlanID, spacePlanName, updateName, image, updateLoader, close, fixtureData, storeCount, callback) {
    let self = this;
    let ctrl_store = new StoreHelper();
    let allItems = ctrl_store.getAllPlanogramItems(vuex);
    let allProducts = ctrl_store.getAllPlanogramItemsByType(vuex, "PRODUCT");

    console.log(allProducts, allItems);

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
        if (ap.Data.barcode == pdi.Data.Data.barcode) {
          let calcData = calculate(ap, vuex, storeCount);
          pdi.Data["CalcData"] = calcData;
        }
      })
    })

    let planogramName = "";

    planogramName = spacePlanName;

    output.name = spacePlanName;

    output = JSON.parse(JSON.stringify(output));

    let startTime = new Date()

    let config = {
      onUploadProgress: progressEvent => {
        var currentFileSize = progressEvent.loaded * 0.000001
        var FileTotalSize = progressEvent.total * 0.000001
        var TIME_TAKEN = new Date().getTime() - startTime.getTime()
        var DownloadSpeed = currentFileSize / (TIME_TAKEN / 1000)
        updateLoader({
          text1: "Creating Folder",
          text2: null,
          currentFileSize: currentFileSize,
          FileTotalSize: FileTotalSize,
          currentFile: null,
          totalFiles: null,
          DownloadSpeed: DownloadSpeed,
        })
      }
    }
    let tmp = {}

    if (this.Create == true) {
      tmp = {
        systemFile: {
          systemUserID: 10,
          folder: "Space Planning",
          name: spacePlanName,
          isFolder: true,
          extension: "",
          id: 0,
        },
      }
    } else {
      tmp = {
        systemFile: {
          systemUserID: 10,
          folder: "Space Planning",
          name: spacePlanName,
          isFolder: true,
          extension: "",
          id: spacePlanID,
        },
      }
    }

    axios.post(self.ServerAddress + "SystemFolder?db=CR-Devinspire", tmp, config).then(resp => {
      let resultSpace = resp.data.systemFileID

      if (resp.success == true) {
        alert("folder created")
      }

      self.createDetailTX(clusterData, dimensionData, resultSpace, fixtureData, () => {})

      output.image = null
      let startTime = new Date()
      let config = {
        onUploadProgress: progressEvent => {
          var currentFileSize = progressEvent.loaded * 0.000001
          var FileTotalSize = progressEvent.total * 0.000001
          var TIME_TAKEN = new Date().getTime() - startTime.getTime()
          var DownloadSpeed = currentFileSize / (TIME_TAKEN / 1000)

          updateLoader({
            title: "Saving Data.... ",
            text1: "uploading Advanced Planogram",
            text2: "File Progresss",
            currentFileSize: currentFileSize,
            FileTotalSize: FileTotalSize,
            currentFile: 1,
            totalFiles: 3,
            DownloadSpeed: DownloadSpeed,
            spaceplanID: resp.data.systemFileID
          })
        }
      }

      axios.post(self.ServerAddress + "SystemFile/JSON/Planogram?db=CR-Devinspire", {
        file: "config_advanced",
        systemFile: {
          systemUserID: 10,
          folder: "Space Planning",
          name: planogramName,
        },
        data: output
      }, config).then(result => {
        output.image = null

        output.planogramData.forEach(e => {
          if (e != null) {
            e.Data.image = null

            if (e.Type != "PRODUCT" && e.Data.Data.renderings != null) {
              e.Data.Data.renderings.forEach(render => {
                render.image = null
              })
            }
          }
        })
        let startTime = new Date()
        let config = {
          onUploadProgress: progressEvent => {
            var currentFileSize = progressEvent.loaded * 0.000001
            var FileTotalSize = progressEvent.total * 0.000001
            var TIME_TAKEN = new Date().getTime() - startTime.getTime()
            var DownloadSpeed = currentFileSize / (TIME_TAKEN / 1000)
            updateLoader({
              text1: "uploading Simple Planogram",
              text2: "File Progresss",
              currentFileSize: currentFileSize,
              FileTotalSize: FileTotalSize,
              currentFile: 2,
              totalFiles: 3,
              DownloadSpeed: DownloadSpeed,
            })
          }
        }
        axios.post(self.ServerAddress + "SystemFile/JSON/Planogram?db=CR-Devinspire", {
          file: "config_simple",
          systemFile: {
            systemUserID: 10,
            folder: "Space Planning",
            name: planogramName
          },
          data: output
        }, config).then(res => {
          let config = {
            onUploadProgress: progressEvent => {

            }
          }
          let xhrObj = new XMLHttpRequest();
          let url = self.ServerAddress +
            `SystemFile/JSON/PlanogramImage?db=CR-Devinspire&fileName=${output.name}`;

          xhrObj.open("Post", url);
          let startTime = new Date()
          xhrObj.upload.onprogress = function (pe) {
            var currentFileSize = pe.loaded * 0.000001
            var FileTotalSize = pe.total * 0.000001
            var TIME_TAKEN = new Date().getTime() - startTime.getTime()
            var DownloadSpeed = currentFileSize / (TIME_TAKEN / 1000)
            updateLoader({
              text1: "uploading Planogram Image",
              text2: "File Progresss",

              currentFileSize: pe.loaded * 0.000001,
              FileTotalSize: pe.total * 0.000001,
              progress: ((currentFileSize / FileTotalSize) * 100) / 3,
              currentFile: 2,
              totalFiles: 3,
              DownloadSpeed: DownloadSpeed
            })
          }

          xhrObj.upload.onreadystatechange = function (oEvent) {

            if (xhrObj.upload.readyState === 4) {
              if (xhrObj.upload.status !== 200) {
                alert("ERROR")
              }
            }
          };
          xhrObj.upload.onerror = function (e) {
            alert("ERROR")
            hasError = true;
          }
          xhrObj.upload.onloadend = function (e) {
            updateLoader({
              currentFile: 3,
              totalFiles: 3,
            })
            setTimeout(() => {
              close()
            }, 500);
          }

          xhrObj.setRequestHeader("X-File-Name", "image.png");
          xhrObj.setRequestHeader("Content-type", image.Type);
          console.log("image");
          console.log(image);

          image.name = "image.png"
          xhrObj.send(image);
        })
      })

      callback(resultSpace)
    })
  }

  saveNew(vuex, stage, clusterData, dimensionData, spacePlanID, spacePlanName, updateName, image, updateLoader, close, fixtureData, storeCount, callback) {
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
        if (ap.Data.barcode == pdi.Data.Data.barcode) {
          let calcData = calculate(ap, vuex, storeCount);
          pdi.Data["CalcData"] = calcData;
        }
      })
    })

    let planogramName = "";

    output.name = spacePlanName;
    output = JSON.parse(JSON.stringify(output));

    let startTime = new Date()

    let config = {
      onUploadProgress: progressEvent => {
        var currentFileSize = progressEvent.loaded * 0.000001
        var FileTotalSize = progressEvent.total * 0.000001
        var TIME_TAKEN = new Date().getTime() - startTime.getTime()
        var DownloadSpeed = currentFileSize / (TIME_TAKEN / 1000)

        // do whatever you like with the percentage complete
        // maybe dispatch an action that will update a progress bar or something
        updateLoader({
          text1: "Creating Folder",
          text2: null,
          currentFileSize: currentFileSize,
          FileTotalSize: FileTotalSize,
          currentFile: null,
          totalFiles: null,
          DownloadSpeed: DownloadSpeed,
        })
      }
    }

    let tmp = {}

    if (this.Create == true) {
      planogramName = planogramName
      tmp = {
        systemFile: {
          systemUserID: 10,
          folder: "Space Planning",
          name: planogramName,
          isFolder: true,
          extension: "",
          id: 0,
        },
      }
    } else {
      tmp = {
        systemFile: {
          systemUserID: 10,
          folder: "Space Planning",
          name: planogramName,
          isFolder: true,
          extension: "",
          id: spacePlanID,
        },
      }
    }

    axios.post(self.ServerAddress + "SystemFolder?db=CR-Devinspire", tmp, config).then(resp => {
      let resultSpace = resp.data.systemFileID

      self.createDetailTX(clusterData, dimensionData, resultSpace, fixtureData, () => {})

      output.image = null
      let startTime = new Date()
      let config = {
        onUploadProgress: progressEvent => {
          var currentFileSize = progressEvent.loaded * 0.000001
          var FileTotalSize = progressEvent.total * 0.000001
          var TIME_TAKEN = new Date().getTime() - startTime.getTime()
          var DownloadSpeed = currentFileSize / (TIME_TAKEN / 1000)

          // do whatever you like with the percentage complete
          // maybe dispatch an action that will update a progress bar or something
          updateLoader({
            title: "Saving Data.... ",
            text1: "uploading Advanced Planogram",
            text2: "File Progresss",
            currentFileSize: currentFileSize,
            FileTotalSize: FileTotalSize,
            currentFile: 1,
            totalFiles: 3,
            DownloadSpeed: DownloadSpeed,
            spaceplanID: resp.data.systemFileID
          })
        }
      }

      axios.post(self.ServerAddress + "SystemFile/JSON/Planogram?db=CR-Devinspire", {
        file: "config_advanced",
        systemFile: {
          systemUserID: 10,
          folder: "Space Planning",
          name: planogramName,
        },
        data: output
      }, config).then(result => {

        output.image = null

        output.planogramData.forEach(e => {
          e.Data.Data.image = null

          if (e.Type != "PRODUCT" && e.Data.Data.renderings != null) {
            e.Data.Data.renderings.forEach(render => {
              render.image = null
            })
          }
        })

        let startTime = new Date()

        let config = {
          onUploadProgress: progressEvent => {
            var currentFileSize = progressEvent.loaded * 0.000001
            var FileTotalSize = progressEvent.total * 0.000001
            var TIME_TAKEN = new Date().getTime() - startTime.getTime()
            var DownloadSpeed = currentFileSize / (TIME_TAKEN / 1000)

            // do whatever you like with the percentage complete
            // maybe dispatch an action that will update a progress bar or something
            updateLoader({
              text1: "uploading Simple Planogram",
              text2: "File Progresss",
              currentFileSize: currentFileSize,
              FileTotalSize: FileTotalSize,
              currentFile: 2,
              totalFiles: 3,
              DownloadSpeed: DownloadSpeed,
            })
          }
        }

        axios.post(self.ServerAddress + "SystemFile/JSON/Planogram?db=CR-Devinspire", {
          file: "config_simple",
          systemFile: {
            systemUserID: 10,
            folder: "Space Planning",
            name: planogramName
          },
          data: output
        }, config).then(res => {

          let config = {
            onUploadProgress: progressEvent => {

            }
          }

          let xhrObj = new XMLHttpRequest();
          let url = self.ServerAddress + `SystemFile/JSON/PlanogramImage?db=CR-Devinspire&fileName=${output.name}`;

          xhrObj.open("Post", url);

          let startTime = new Date()

          xhrObj.upload.onprogress = function (pe) {
            var currentFileSize = pe.loaded * 0.000001
            var FileTotalSize = pe.total * 0.000001
            var TIME_TAKEN = new Date().getTime() - startTime.getTime()
            var DownloadSpeed = currentFileSize / (TIME_TAKEN / 1000)

            // do whatever you like with the percentage complete
            // maybe dispatch an action that will update a progress bar or something
            updateLoader({
              text1: "uploading Planogram Image",
              text2: "File Progresss",

              currentFileSize: pe.loaded * 0.000001,
              FileTotalSize: pe.total * 0.000001,
              progress: ((currentFileSize / FileTotalSize) * 100) / 3,
              currentFile: 2,
              totalFiles: 3,
              DownloadSpeed: DownloadSpeed
            })
          }

          xhrObj.upload.onreadystatechange = function (oEvent) {

            if (xhrObj.upload.readyState === 4) {
              if (xhrObj.upload.status !== 200) {
                alert("ERROR")
              }
            }
          };

          xhrObj.upload.onerror = function (e) {
            alert("ERROR")
            hasError = true;
          }

          xhrObj.upload.onloadend = function (e) {
            updateLoader({
              currentFile: 3,
              totalFiles: 3,
            })
            setTimeout(() => {
              close()
            }, 500);
          }

          xhrObj.setRequestHeader("X-File-Name", "image.png");
          xhrObj.setRequestHeader("Content-type", image.Type);
          console.log("image");
          console.log(image);

          image.name = "image.png"
          xhrObj.send(image);
        })

        createDetailTX(clusterData, dimensionData, fixtureData, resultSpace, () => {
          callback(resultSpace);
        })

      }).catch(e => {
        console.log(e)
        console.error("Failed to save planogram file");
      })
    })
  }

  createDetailTX(clusterData, dimensionData, systemFileID, fixtureData, callback) {

    console.log("making detailTX");
    let defaultItem = null
    let totalModules = 0;

    console.log(fixtureData)

    fixtureData.forEach(item => {
      if (item.isDefault == true) {
        defaultItem = item
      }

      console.log(item)

      totalModules += parseInt(item.modules);
    })

    console.log('[TOTAL MODULES]', totalModules)

    let sendRequst = {
      "systemFileID": systemFileID,
      "dateFromString": clusterData.dateFromString,
      "dateToString": clusterData.dateToString,
      "monthsBetween": parseInt(clusterData.monthsBetween),
      "periodic": clusterData.periodic,
      "planogramID": parseInt(clusterData.planogramID),
      "planogramName": clusterData.planogramName,
      "tag": clusterData.tag,
      "storeCluster": clusterData.storeCluster,
      "clusterID": parseInt(clusterData.clusterID),
      "clusterType": clusterData.clusterType,
      "clusterName": clusterData.clusterName,
      "rangeID": parseInt(clusterData.rangeID),
      "storeID": clusterData.storeID,
      "storeName": clusterData.storeName,
      "categoryCluster": clusterData.categoryCluster,
      "modules": totalModules,
      "height": parseFloat(defaultItem.height),
      "width": parseFloat(dimensionData.width),
      "displays": parseInt(dimensionData.displays),
      "pallettes": parseInt(dimensionData.pallettes),
      "supplierStands": parseInt(dimensionData.supplierStands),
      "fixtureType": clusterData.fixtureType,
      "bins": parseInt(dimensionData.bins)
    }

    let request = {
      planogram_Details: sendRequst,
      PlanogramDetails_fixtures: fixtureData
    }

    axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

    axios.post(process.env.VUE_APP_API + 'Planogram_Details/Save', request).then(
      r => {
        console.log(r.data);
        console.log(systemFileID);

        callback(r)
        delete axios.defaults.headers.common["TenantID"];
      })
  }

  determinePlanogramName(allPlanogramItems, clusterData) {
    // TODO: Make sure that we change the name to the correct standard.
    // return clusterData.planogramName + " " + clusterData.clusterName;
    return PlanogramNamer.generatePlanogramName(allPlanogramItems, clusterData);
  }

  loadPlanogram(spacePlanID, VueStore, MasterLayer, Stage, pxlRatio, afterGetSpacePlanFile, hideLoader, updateLoader, callRedraw) {
    let self = this;
    let startTime = new Date()
    self.resetStage(VueStore, MasterLayer, Stage);
    let config = {
      onDownloadProgress: progressEvent => {
        var currentFileSize = progressEvent.loaded * 0.000001
        var FileTotalSize = progressEvent.total * 0.000001
        var TIME_TAKEN = new Date().getTime() - startTime.getTime()
        var DownloadSpeed = currentFileSize / (TIME_TAKEN / 1000)

        // do whatever you like with the percentage complete
        // maybe dispatch an action that will update a progress bar or something
        updateLoader({
          text1: "Downloading Planogram",
          text2: null,
          currentFileSize: currentFileSize,
          FileTotalSize: FileTotalSize,
          currentFile: null,
          totalFiles: null,
          DownloadSpeed: DownloadSpeed,
        })
      }
    }
    axios.get(self.ServerAddress + `SystemFile/JSON/Planogram?db=CR-Devinspire&id=${spacePlanID}&file=config_advanced`, config)
      .then(r => {

        let jsonData = r.data.jsonObject

        afterGetSpacePlanFile(jsonData.clusterData, jsonData.dimensionData, jsonData.name, rangeProducts => {
          if (rangeProducts == null) {
            self.startLoadingPlanogram(jsonData, Stage, pxlRatio, MasterLayer, VueStore, hideLoader);
          } else {
            jsonData.planogramData = StageWarehouseMiddleware.verifyIntegrityOfWarehouseData(jsonData.planogramData, rangeProducts);
            self.startLoadingPlanogram(jsonData, Stage, pxlRatio, MasterLayer, VueStore, hideLoader, () => {
              callRedraw();
            });
          }
        });


      })
      .catch(e => {
        hideLoader()
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

  startLoadingPlanogram(fileData, Stage, PxlRatio, MasterLayer, VueStore, hideLoader, callback) {

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

    // call product renderings
    self.loadRenderingsPostLoad(VueStore);
    // end
    Stage.draw();

    hideLoader();

    if (callback != undefined && callback != null)
      callback();
  }

  loadItemRecursive(MasterData, CurrentItem, ParentID, Stage, MasterLayer, PxlRatio, VueStore) {
    // recursive function will create all children of gondola
    // console.log('[LOAD SAVE] Load item recursive', CurrentItem.Type, new Date());
    let self = this;

    // create the current item
    let ctrl_item = null;
    switch (CurrentItem.Type.toUpperCase()) {
      case "GONDOLA": {
        let ctrl_item = new GondolaNew(
          VueStore,
          Stage,
          MasterLayer,
          CurrentItem.Data.Data,
          PxlRatio,
          "GONDOLA",
          ParentID
        )

        if (CurrentItem.Position != undefined && CurrentItem.Position != null) {
          ctrl_item.Position = CurrentItem.Position;
        }

        // set json data values to the object
        ctrl_item.ID = CurrentItem.Data.ID;

        ctrl_item.Initialise(CurrentItem.RelativePosition, false);
      }
      break;
    case "AREA": {
      let ctrl_item = new AreaNew(
        VueStore,
        Stage,
        MasterLayer,
        CurrentItem.Data.Data,
        PxlRatio,
        "AREA",
        ParentID
      )

      if (CurrentItem.Position != undefined && CurrentItem.Position != null) {
        ctrl_item.Position = CurrentItem.Position;
      }

      // set json data values to the object
      ctrl_item.ID = CurrentItem.Data.ID;

      ctrl_item.Initialise(CurrentItem.RelativePosition, false);
    }
    break;
    case "TEXTHEADER": {
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

      if (CurrentItem.Position != undefined && CurrentItem.Position != null) {
        ctrl_item.Position = CurrentItem.Position;
      }

      // set json data values to the object
      ctrl_item.ID = CurrentItem.Data.ID;

      ctrl_item.Initialise(CurrentItem.RelativePosition, false);
    }
    break;
    case "PALETTE": {
      let ctrl_item = new PaletteNew(
        VueStore,
        Stage,
        MasterLayer,
        CurrentItem.Data.Data,
        PxlRatio,
        "PALETTE",
        ParentID
      )

      if (CurrentItem.Position != undefined && CurrentItem.Position != null) {
        ctrl_item.Position = CurrentItem.Position;
      }

      // set json data values to the object
      ctrl_item.ID = CurrentItem.Data.ID;

      ctrl_item.Initialise(CurrentItem.RelativePosition, false);
    }
    break;
    case "SHELF": {
      let ctrl_item = new ShelfNew(
        VueStore,
        Stage,
        MasterLayer,
        CurrentItem.Data.Data,
        PxlRatio,
        "SHELF",
        ParentID
      )

      if (CurrentItem.Position != undefined && CurrentItem.Position != null) {
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
    case "BASE": {
      let ctrl_item = new BaseNew(
        VueStore,
        Stage,
        MasterLayer,
        CurrentItem.Data.Data,
        PxlRatio,
        "BASE",
        ParentID
      )

      if (CurrentItem.Position != undefined && CurrentItem.Position != null) {
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
    case "BASKET": {
      let ctrl_item = new BasketNew(
        VueStore,
        Stage,
        MasterLayer,
        CurrentItem.Data.Data,
        PxlRatio,
        "BASKET",
        ParentID
      )

      if (CurrentItem.Position != undefined && CurrentItem.Position != null) {
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
    case "PEG": {
      let ctrl_item = new PegNew(
        VueStore,
        Stage,
        MasterLayer,
        CurrentItem.Data.Data,
        PxlRatio,
        "PEG",
        ParentID
      )

      if (CurrentItem.Position != undefined && CurrentItem.Position != null) {
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
    case "PEGBAR": {
      let ctrl_item = new PegBarNew(
        VueStore,
        Stage,
        MasterLayer,
        CurrentItem.Data.Data,
        PxlRatio,
        "PEGBAR",
        ParentID
      )

      if (CurrentItem.Position != undefined && CurrentItem.Position != null) {
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
    case "LABELHOLDER": {
      let ctrl_item = new LabelHolderNew(
        VueStore,
        Stage,
        MasterLayer,
        CurrentItem.Data.Data,
        PxlRatio,
        "LABELHOLDER",
        ParentID
      )

      if (CurrentItem.Position != undefined && CurrentItem.Position != null) {
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
    case "PEGBOARD": {
      let ctrl_item = new PegboardNew(
        VueStore,
        Stage,
        MasterLayer,
        CurrentItem.Data.Data,
        PxlRatio,
        "PEGBOARD",
        ParentID
      )

      if (CurrentItem.Position != undefined && CurrentItem.Position != null) {
        ctrl_item.Position = CurrentItem.Position;
      }

      // set json data values to the object
      ctrl_item.ID = CurrentItem.Data.ID;
      ctrl_item.Config = CurrentItem.Data.Config;

      ctrl_item.Initialise(CurrentItem.RelativePosition, false);
      ctrl_item.ApplyZIndexing();
    }
    break;
    case "PRODUCT": {
      let ctrl_item = new ProductGroupNew(
        VueStore,
        Stage,
        MasterLayer,
        CurrentItem.Data.Data,
        PxlRatio,
        "PRODUCT",
        ParentID
      )

      if (CurrentItem.Position != undefined && CurrentItem.Position != null) {
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

  loadRenderingsPostLoad(VueStore) {
    let self = this;
    let ctrl_store = new StoreHelper();
    let allItems = ctrl_store.getAllPlanogramItems(VueStore);
    let allItemsFiltered = allItems.filter((el) => el.Type == "SHELF" || el.Type == "BASE" || el.Type == "BASKET");

    let lastItem = null;
    allItemsFiltered.forEach(fixture => {
      lastItem = fixture;
      fixture.AddProductRenderings();
    });

    if (lastItem != null) {
      lastItem.ApplyZIndexing();
      lastItem.Layer.draw();
    }
  }
}

function calculate(productItem, vuex, storeCount) {
  let self = this;
  let calculationHandler = new CalculationHandler(0, storeCount);

  var calcData = {
    XFacings: null,
    Capacity: null,
    ForwardCapacity: null,
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
    TotalFacings: 0,
    XYFacings: 0
  };

  productStoreCopy.forEach((element, index) => {
    if (element.Data.productID == productID) {
      productData.Facings_X += element.Facings_X;
      productData.Facings_Y += element.Facings_Y;
      productData.Facings_Z += element.Facings_Z;
      productData.TotalFacings += element.TotalFacings;
      productData.XYFacings += element.Facings_X + element.Facings_Y;
    }
  });

  console.log(productData);

  var sales_retail = productData.ProductData.sales_Retail,
    sales_potential = productData.ProductData.sales_potential,
    sales_cost = productData.ProductData.sales_Cost,
    sales_units = productData.ProductData.sales_Units,
    volume_potential = productData.ProductData.volume_potential,
    cost_potential = productData.ProductData.cost_potential,
    weighted_distribution = productData.ProductData.Weighted_Distribution,
    total_facings = productData.TotalFacings;

  calcData.DaysOfSupply = calculationHandler.Calculate_Days_Of_Supply_Potential(
    total_facings,
    vuex.state.usePotential ? volume_potential : sales_units
  );

  calcData.Weekly_Sales_Retail = calculationHandler.Calculate_Weekly_Sales_Retail(vuex.state.usePotential ? sales_potential : sales_retail,);
  calcData.Weekly_Sales_Cost = calculationHandler.Calculate_Weekly_Sales_Cost(vuex.state.usePotential ? cost_potential : sales_cost);
  calcData.Weekly_Sales_Units = calculationHandler.Calculate_Weekly_Sales_Units(vuex.state.usePotential ? volume_potential : sales_units);

  calcData.Weekly_Profit = calculationHandler.Calculate_Weekly_Profit(vuex.state.usePotential ? sales_potential : sales_retail,
    sales_cost);

  calcData.XFacings = productData.Facings_X;
  calcData.Capacity = productData.TotalFacings;
  calcData.ForwardCapacity = productData.XYFacings;

  return calcData;
}

export default LoadSavePlanogramBase;