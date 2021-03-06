import Konva from 'konva';
import StoreHelper from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/StoreHelper/StoreHelper.js";
import GondolaNew from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/GondolaBase.js";
import ObstructionNew from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/ObstructionBase.js";
import TextHeaderNew from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/TextHeaderBase.js";
import PaletteNew from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/PaletteBase.js";
import ShelfNew from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/ShelfBase.js";
import BaseNew from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/BaseShelf.js";
import PegboardNew from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/PegboardBase.js";
import PegBarNew from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/PegBarBase.js";
import ProductGroupNew from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/ProductBase.js";
import BasketNew from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/BasketBase.js";
import ShareboxNew from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/ShareboxBase.js";
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


  createPlanogramFixture(items, parent, detailsFixture, callback) {
    let self = this
    let newparent
    items.forEach(e => {
      console.log("[RECURSIVE TYPE]", e.type);

      if (e.type == "GONDOLA" || e.type == "OBSTRUCTION") {
        let newGondola = {
          height: e.height,
          width: e.width,
          depth: e.depth,
          sales: 0,
          units: 0,
          profit: 0,
          dos: 0,
          itemCount: 0,
          children: []
        }
        detailsFixture.push(newGondola)
        newparent = newGondola
      }
      if (e.type == "PRODUCT") {
        for (var prop in parent) {
          parent.children.push(e)
        }

      }
      if (e.children.length > 0) {
        self.createPlanogramFixture(e.children, newparent, detailsFixture, cb => {
          callback()
        })
      } else {
        callback()
      }
    })
  }

  save(vuex, stage, clusterData, dimensionData, spacePlanID, spacePlanName, updateName, image, updateLoader, close, fixtureData, storeCount, hybridRanges, promoItemRefs, callback) {
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
      image: image,
      hybridRanges: hybridRanges,
      promoItemRefs: promoItemRefs
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

    let planogramProducts = [];

    let onlyProducts = output.planogramData.filter(e => {
      return e.Type == "PRODUCT";
    })

    onlyProducts.forEach(ap => {
      let canAdd = true;

      planogramProducts.forEach(pp => {
        if (ap.Data.Data.productID == pp.product_ID)
          canAdd = false;
      })

      if (canAdd) {
        let calcData = calculateAdvanced(ap, vuex, storeCount);

        planogramProducts.push({
          planogram_Detail_ID: -1,
          product_ID: ap.Data.Data.productID,
          facings_X: calcData.XFacings,
          facings_Y: calcData.YFacings,
          facings_Z: calcData.ZFacings,
          weekly_Sales: calcData.Weekly_Sales,
          weekly_Sales_Potential: calcData.Weekly_Sales_Potential,
          weekly_Profit: calcData.Weekly_Profit,
          weekly_Profit_Potential: calcData.Weekly_Profit_Potential,
          weekly_Units: calcData.Weekly_Units,
          weekly_Units_Potential: calcData.Weekly_Units_Potential,
          weekly_Cost: calcData.Weekly_Cost,
          weekly_Cost_Potential: calcData.Weekly_Cost_Potential,
          dos: calcData.DaysOfSupply,
          dos_Potential: calcData.DaysOfSupplyPotential
        })
      }
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

        console.log("[PLANO SAVE]", output);

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

          let xhrObj = new XMLHttpRequest();
          let url = self.ServerAddress + `SystemFile/JSON/PlanogramImage?db=CR-Devinspire&fileName=${encodeURIComponent(output.name)}`

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
              self.createDetailTX(clusterData, dimensionData, resultSpace, fixtureData, planogramProducts, createDetailCallback => {
                self.createFloorplanFixtures(createDetailCallback, allItems, output, vuex, storeCount, stage, floorfixturecb => {
                  close()
                })
              })
            }, 500);
          }

          xhrObj.setRequestHeader("X-File-Name", "image.png");
          xhrObj.setRequestHeader("Content-type", image.Type);

          image.name = "image.png"
          xhrObj.send(image);
        })
      })

      callback(resultSpace)
    })
  }

  createFloorplanFixtures(createDetailCallback, allItems, output, vuex, storeCount, stage, callback) {
    let floorPlanArray = generateFloorPlanArr(output.planogramData, vuex, storeCount)

    let header = {
      planogram_Detail_ID: createDetailCallback.data.planogram_Details.id,
      systemFile_ID: createDetailCallback.data.planogram_Details.systemFileID
    }

    let request = {
      fixtureHeader: header,
      fixtureItems: floorPlanArray
    }

    axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

    axios.post(process.env.VUE_APP_API + `FloorPlan_Fixtures/Create`, request).then(r => {
      console.log("FloorPlan_Fixtures/Create", r);

      stage.getSplitImages(callback => {
        r.data.gondolas.forEach((Drop, Dropindex) => {
          callback.forEach((image, imageindex) => {
            if (Dropindex == imageindex) {
              axios.post(process.env.VUE_APP_API + `FloorPlan_Fixtures/UploadImages?imageID=${Drop.id}&type=Front`, image.blob).then(resp => {

              })
            }
          })

        })
      })
      r.data.allfixtures.forEach((saveFixture, idx) => {
        allItems.forEach((element, allidx) => {
          if (saveFixture.floorplan_Item_ID == element.ID) {
            if (element.Data.topImage != null && element.Data.topImage != undefined && element.Data.uploadTop == true) {
              element.Data.floorplanFixture_ID = saveFixture.id
              console.log("saveFixture.id", saveFixture.id);

              axios.post(process.env.VUE_APP_API + `FloorPlan_Fixtures/UploadImages?imageID=${saveFixture.id}&type=Top`, element.Data.topImage).then(resp => {
                console.log("topimg", resp);

              })
            }
            if (element.Data.sideImage != null && element.Data.sideImage != undefined && element.Data.uploadSide == true) {
              axios.post(process.env.VUE_APP_API + `FloorPlan_Fixtures/UploadImages?imageID=${saveFixture.id}&type=Side`, element.Data.sideImage).then(rep => {
                console.log("Sideimg", rep);
              })
            }
          }
          if (idx == r.data.allfixtures.length - 1 && allidx == allItems.length - 1) {
            callback()
          }
        });
      })
    })
  }

  saveNew(vuex, stage, clusterData, dimensionData, spacePlanID, spacePlanName, updateName, image, updateLoader, close, fixtureData, storeCount, hybridRanges, promoItemRefs, callback) {
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
      image: image,
      hybridRanges: hybridRanges,
      promoItemRefs: promoItemRefs
    }
    console.log("allitems");

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

    let planogramProducts = [];

    let onlyProducts = output.planogramData.filter(e => {
      return e.Type == "PRODUCT";
    })

    onlyProducts.forEach(ap => {
      let canAdd = true;

      planogramProducts.forEach(pp => {
        if (ap.Data.Data.productID == pp.product_ID)
          canAdd = false;
      })

      if (canAdd) {
        let calcData = calculateAdvanced(ap, vuex, storeCount);

        planogramProducts.push({
          planogram_Detail_ID: -1,
          product_ID: ap.Data.Data.productID,
          facings_X: calcData.XFacings,
          facings_Y: calcData.YFacings,
          facings_Z: calcData.ZFacings,
          weekly_Sales: calcData.Weekly_Sales,
          weekly_Sales_Potential: calcData.Weekly_Sales_Potential,
          weekly_Profit: calcData.Weekly_Profit,
          weekly_Profit_Potential: calcData.Weekly_Profit_Potential,
          weekly_Units: calcData.Weekly_Units,
          weekly_Units_Potential: calcData.Weekly_Units_Potential,
          weekly_Cost: calcData.Weekly_Cost,
          weekly_Cost_Potential: calcData.Weekly_Cost_Potential,
          dos: calcData.DaysOfSupply,
          dos_Potential: calcData.DaysOfSupplyPotential
        })
      }
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
              self.createDetailTX(clusterData, dimensionData, resultSpace, fixtureData, planogramProducts, createDetailCallback => {
                self.createFloorplanFixtures(createDetailCallback, allItems, output, vuex, storeCount, stage, floorfixturecb => {
                  close()
                })
              })

            }, 500);
          }

          xhrObj.setRequestHeader("X-File-Name", "image.png");
          xhrObj.setRequestHeader("Content-type", image.Type);

          image.name = "image.png"
          xhrObj.send(image);
        })

        createDetailTX(clusterData, dimensionData, fixtureData, resultSpace, planogramProducts, createDetailCallback => {
          let floorPlanArray = generateFloorPlanArr(output.planogramData, vuex, storeCount)

          let header = {
            planogram_Detail_ID: createDetailCallback.data.planogram_Details.id,
            systemFile_ID: createDetailCallback.data.planogram_Details.systemFile_ID
          }

          let request = {
            fixtureHeader: header,
            fixtureItems: floorPlanArray
          }

          axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
          axios.post(process.env.VUE_APP_API + `FloorPlan_Fixtures/Create`, request).then(r => {
            stage.getSplitImages(callback => {
              console.log("getSplitImages", callback);
              r.data.forEach((Drop, Dropindex) => {
                callback.forEach((image, imageindex) => {
                  if (Dropindex == imageindex) {
                    axios.post(process.env.VUE_APP_API + `FloorPlan_Fixtures/UploadImages?imageID=${Drop.id}&type=Front`, image.blob).then(resp => {
                      console.log(resp);
                    })
                  }
                })
              })
            })
          })
          callback(resultSpace);
        })

      }).catch(e => {})
    })
  }

  saveFixture(vuex, name, image, fixtureID, callback) {
    let self = this;
    let ctrl_store = new StoreHelper();
    let allItems = ctrl_store.getAllPlanogramItems(vuex);

    let output = {
      name: name,
      stage: null,
      planogramData: [],
      planogramSettings: vuex.getters.getPlanogramProperties,
      image: image
    }

    allItems.forEach(item => {
      // remove the line below to test that the positions are being saved and repopulated in the load
      // item.PositionElement();
      output.planogramData.push(item.ToObject());
    });

    output = JSON.parse(JSON.stringify(output));

    let tmp = {
      systemFile: {
        systemUserID: 10,
        folder: "FIXTURES",
        name: name,
        isFolder: true,
        extension: "",
        id: fixtureID
      }
    }

    if (fixtureID == null) {
      // Create Folder
      axios.post(self.ServerAddress + "SystemFolder?db=CR-Devinspire", tmp)
        .then(r => {
          fixtureID = r.data.systemFileID;

          // Upload data to folder
          axios.post(self.ServerAddress + "SystemFile/JSON/Planogram?db=CR-Devinspire", {
              file: "config",
              systemFile: {
                systemUserID: 10,
                folder: "FIXTURES",
                name: name,
              },
              data: output
            })
            .then(result => {
              console.log("result", result);

              self.uploadFixtureImage(image, name, fixtureID, callback);
              let floorPlanArray = generateFloorPlanArr(output.planogramData, vuex, null)
              let header = {
                fixture_ID: fixtureID,
                systemFile_ID: fixtureID

              }
              let request = {
                fixtureHeader: header,
                fixtureItems: floorPlanArray
              }
              axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
              axios.post(self.ServerAddress + `FloorPlan_Fixtures/Create`, request).then(r => {

              })
            })
        })
    } else {
      // Upload data to folder
      axios.post(self.ServerAddress + "SystemFile/JSON/Planogram?db=CR-Devinspire", {
          file: "config",
          systemFile: {
            systemUserID: 10,
            folder: "FIXTURES",
            name: name,
          },
          data: output
        })
        .then(result => {
          console.log("reslt", result);

          self.uploadFixtureImage(image, name, fixtureID, callback);
          let floorPlanArray = generateFloorPlanArr(output.planogramData, vuex, null)
          let header = {
            fixture_ID: fixtureID,
            systemFile_ID: fixtureID
          }
          let request = {
            fixtureHeader: header,
            fixtureItems: floorPlanArray
          }
          axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
          axios.post(self.ServerAddress + `FloorPlan_Fixtures/Create`, request).then(r => {

          })
        })
    }
  }

  uploadFixtureImage(image, name, fixtureID, callback) {
    let self = this;

    let xhrObj = new XMLHttpRequest();
    let url = self.ServerAddress + `SystemFile/JSON/FixtureImage?db=CR-Devinspire&fileName=${name}`;

    xhrObj.open("Post", url);

    xhrObj.upload.onerror = function (e) {
      alert("ERROR")
      // hasError = true;
    }

    xhrObj.upload.onloadend = function (e) {
      callback(fixtureID)
    }

    xhrObj.setRequestHeader("X-File-Name", "image.png");
    xhrObj.setRequestHeader("Content-type", image.Type);

    image.name = "image.png"
    xhrObj.send(image);

    // let startTime = new Date()

    // xhrObj.upload.onprogress = function (pe) {
    //   var currentFileSize = pe.loaded * 0.000001
    //   var FileTotalSize = pe.total * 0.000001
    //   var TIME_TAKEN = new Date().getTime() - startTime.getTime()
    //   var DownloadSpeed = currentFileSize / (TIME_TAKEN / 1000)

    //   updateLoader({
    //     text1: "uploading Planogram Image",
    //     text2: "File Progresss",

    //     currentFileSize: pe.loaded * 0.000001,
    //     FileTotalSize: pe.total * 0.000001,
    //     progress: ((currentFileSize / FileTotalSize) * 100) / 3,
    //     currentFile: 2,
    //     totalFiles: 3,
    //     DownloadSpeed: DownloadSpeed
    //   })
    // }

    // xhrObj.upload.onreadystatechange = function (oEvent) {

    //   if (xhrObj.upload.readyState === 4) {
    //     if (xhrObj.upload.status !== 200) {
    //       alert("ERROR")
    //     }
    //   }
    // };
  }

  createDetailTX(clusterData, dimensionData, systemFileID, fixtureData, products, callback) {
    let self = this;

    let defaultItem = null
    let totalModules = 0;
    console.log("[CREATE DETAIL TX]fixtureData", fixtureData);

    fixtureData.forEach(item => {
      if (item.isDefault == true) {
        defaultItem = item
      }

      totalModules += parseInt(item.modules);
    })

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
        console.log("details", r);

        let planogramDetailID = r.data.planogram_Details.id;

        self.createPlanogram_Detail_Product(planogramDetailID, products)

        callback(r)
        delete axios.defaults.headers.common["TenantID"];
      })
  }

  createPlanogram_Detail_Product(planogramDetailID, products) {
    axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

    axios.post(process.env.VUE_APP_API + `Planogram_Detail_Product?planogramDetailID=${planogramDetailID}`, products).then(
      r => {
        delete axios.defaults.headers.common["TenantID"];
      })
  }

  determinePlanogramName(allPlanogramItems, clusterData) {
    // TODO: Make sure that we change the name to the correct standard.
    // return clusterData.planogramName + " " + clusterData.clusterName;
    return PlanogramNamer.generatePlanogramName(allPlanogramItems, clusterData);
  }

  loadFixture(fixtureID, VueStore, MasterLayer, Stage, pxlRatio, callback) {
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
    axios.get(self.ServerAddress + `SystemFile/JSON/Planogram?db=CR-Devinspire&id=${fixtureID}&file=config`)
      .then(r => {

        let jsonData = r.data.jsonObject
        self.startLoadingPlanogram(jsonData, Stage, pxlRatio, MasterLayer, VueStore, null, () => {
          callback(r.data)
        });

        // afterGetSpacePlanFile(jsonData.clusterData, jsonData.dimensionData, jsonData.name, rangeProducts => {
        //   if (rangeProducts == null) {
        //   } else {
        //     jsonData.planogramData = StageWarehouseMiddleware.verifyIntegrityOfWarehouseData(jsonData.planogramData, rangeProducts);
        //     self.startLoadingPlanogram(jsonData, Stage, pxlRatio, MasterLayer, VueStore, hideLoader, () => {
        //       callRedraw();
        //     });
        //   }
        // });
      })
      .catch(e => {
        alert("Failed to get data. " + e);
      })
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
        console.log("loadPlanogram", jsonData);

        afterGetSpacePlanFile(jsonData.clusterData, jsonData.hybridRanges, jsonData.promoItemRefs, jsonData.dimensionData, jsonData.name, rangeProducts => {
          if (rangeProducts == null) {
            self.startLoadingPlanogram(jsonData, Stage, pxlRatio, MasterLayer, VueStore, hideLoader);
          } else {
            jsonData.planogramData = StageWarehouseMiddleware.verifyIntegrityOfWarehouseData(jsonData.planogramData, rangeProducts);
            self.startLoadingPlanogram(jsonData, Stage, pxlRatio, MasterLayer, VueStore, hideLoader, () => {
              let ctrl_store = new StoreHelper();
              let allItems = ctrl_store.getAllPlanogramItems(VueStore);
              allItems.forEach(element => {
                element.Data.uploadSide = false
                element.Data.uploadTop = false
              });
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

    let self = this;
    let MasterData = fileData.planogramData;

    // Set Plangram settings
    if (fileData.planogramSettings != undefined && fileData.planogramSettings != null) {
      VueStore.commit("setPlanogramProperties", fileData.planogramSettings);
    }

    // Init Gondolas
    let gondolaArr = MasterData.filter((el) => el.Type == "GONDOLA" || el.Type == "OBSTRUCTION");
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

    if (hideLoader != undefined && hideLoader != null)
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
      case "OBSTRUCTION": {
        let ctrl_item = new ObstructionNew(
          VueStore,
          Stage,
          MasterLayer,
          CurrentItem.Data.Data,
          PxlRatio,
          "OBSTRUCTION",
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
    case "SHAREBOX": {
      let ctrl_item = new ShareboxNew(
        VueStore,
        Stage,
        MasterLayer,
        CurrentItem.Data.Data,
        PxlRatio,
        "SHAREBOX",
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
      ctrl_item.StackIndex = CurrentItem.Data.StackIndex;
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
      ctrl_item.Facings_Z_Max = CurrentItem.Data.Facings.z_Max;

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

    if (CurrentItem.Type == "PEG") {
      let itemArr = MasterData.filter((el) => el.Data.ParentID == CurrentItem.Data.ID);
      itemArr.sort((a, b) => a.RelativePosition.y - b.RelativePosition.y);

      // check if there are children and call recursive
      if (itemArr != undefined && itemArr != null) {
        // get all children of the current item, call recursive function
        if (itemArr.length > 0) {
          itemArr.forEach(child => {
            self.loadItemRecursive(MasterData, child, child.Data.ParentID, Stage, MasterLayer, PxlRatio, VueStore);
          });
        }
      }
    } else {
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

function generateFloorPlanArr(planodata, vuex, storeCount) {
  let self = this
  console.log("planodata", planodata);

  let floorArr = []
  let baseItem = {
    id: null,
    parent_ID: null,
    height: null,
    width: null,
    depth: null,
    children: []
  }
  // create gondola baseitems

  planodata.forEach(item => {
    if (item.Type == "GONDOLA" || item.Type == "OBSTRUCTION") {
      floorArr.push({
        floorplan_Item_ID: item.Data.ID,
        parent_ID: null,
        type: item.Type,
        x: item.RelativePosition.x,
        y: item.RelativePosition.y,
        absoluteX: item.AbsolutePosition.x,
        absoluteY: item.AbsolutePosition.y,
        height: item.Data.Data.depth,
        width: item.Data.Data.width,
        depth: item.Data.Data.height,
        shape: item.Data.Data.floorplanShape,
        spaceplan_Fixture_ID: item.Data.Data.id,
        name: item.Data.Data.name,
        sales: item.Data.Data.sales_Retail,
        units: item.Data.Data.sales_Units,
        profit: item.Data.Data.sales_Profit,
        children: getChildren(planodata, item.Data.ID, vuex, storeCount),
        // New Details
        frontColor: item.Data.Data.frontColor,
        backColor: item.Data.Data.backColor,
        leftColor: item.Data.Data.leftColor,
        rightColor: item.Data.Data.rightColor,
        bottomColor: item.Data.Data.bottomColor,
        topColor: item.Data.Data.topColor,
        frontTransparent: item.Data.Data.frontTransparent,
        backTransparent: item.Data.Data.backTransparent,
        leftTransparent: item.Data.Data.leftTransparent,
        rightTransparent: item.Data.Data.rightTransparent,
        bottomTransparent: item.Data.Data.bottomTransparent,
        topTransparent: item.Data.Data.topTransparent,
        frontImageID: item.Data.Data.frontImageID,
        backImageID: item.Data.Data.backImageID,
        sideImageID: item.Data.Data.sideImageID,
        leftImageID: item.Data.Data.leftImageID,
        rightImageID: item.Data.Data.rightImageID,
        topImageID: item.Data.Data.topImageID,
        bottomImageID: item.Data.Data.bottomImageID,
        leftMirrored: item.Data.Data.leftMirrored,
        rightMirrored: item.Data.Data.rightMirrored,
        bottomMirrored: item.Data.Data.bottomMirrored,
        topMirrored: item.Data.Data.topMirrored,
        frontMirrored: item.Data.Data.frontMirrored,
        backMirrored: item.Data.Data.backMirrored,
        xOffset: item.Data.Data.xOffset,
        yOffset: item.Data.Data.yOffset,
        zOffset: item.Data.Data.zOffset,
        rendering: item.Data.Data.rendering
      })
    }
  })
  return floorArr
}

function getChildren(planodata, parentID, vuex, storeCount) {
  let childArr = []
  let obj = planodata.filter(data => parentID == data.Data.ParentID)
  obj.forEach(fixture => {

    if(typeof(fixture.Data.Data.frontColor) == 'object')
      fixture.Data.Data.frontColor = "#FFF";

    if(typeof(fixture.Data.Data.backColor) == 'object')
      fixture.Data.Data.backColor = "#FFF";

    if(typeof(fixture.Data.Data.leftColor) == 'object')
      fixture.Data.Data.leftColor = "#FFF";

    if(typeof(fixture.Data.Data.rightColor) == 'object')
      fixture.Data.Data.rightColor = "#FFF";

    if(typeof(fixture.Data.Data.bottomColor) == 'object')
      fixture.Data.Data.bottomColor = "#FFF";

    if(typeof(fixture.Data.Data.topColor) == 'object')
      fixture.Data.Data.topColor = "#FFF";

    let item = {
      floorplan_Item_ID: fixture.Data.ID,
      parent_ID: null,
      type: fixture.Type,
      height: fixture.Data.Data.depth,
      width: fixture.Data.Data.width,
      name: fixture.Data.Data.name,
      shape: fixture.Data.Data.floorplanShape,
      spaceplan_Fixture_ID: fixture.Data.Data.id,
      depth: fixture.Data.Data.height,
      sales: fixture.Data.Data.sales_Retail,
      x: parseFloat(fixture.RelativePosition.x.toFixed(2)),
      y: parseFloat((fixture.RelativePosition.y < 0 ? fixture.RelativePosition.y * -1 : fixture.RelativePosition.y).toFixed(2)),
      absoluteX: parseFloat(fixture.AbsolutePosition.x.toFixed(2)),
      absoluteY: parseFloat(fixture.AbsolutePosition.y.toFixed(2)),
      units: fixture.Data.Data.sales_Units,
      profit: fixture.Data.Data.sales_Profit,
      // children: [],
      children: getChildren(planodata, fixture.Data.ID, vuex, storeCount),
      // Details
      frontColor: fixture.Data.Data.frontColor,
      backColor: fixture.Data.Data.backColor,
      leftColor: fixture.Data.Data.leftColor,
      rightColor: fixture.Data.Data.rightColor,
      bottomColor: fixture.Data.Data.bottomColor,
      topColor: fixture.Data.Data.topColor,
      frontTransparent: fixture.Data.Data.frontTransparent,
      backTransparent: fixture.Data.Data.backTransparent,
      leftTransparent: fixture.Data.Data.leftTransparent,
      rightTransparent: fixture.Data.Data.rightTransparent,
      bottomTransparent: fixture.Data.Data.bottomTransparent,
      topTransparent: fixture.Data.Data.topTransparent,
      frontImageID: fixture.Data.Data.frontImageID,
      backImageID: fixture.Data.Data.backImageID,
      sideImageID: fixture.Data.Data.sideImageID,
      leftImageID: fixture.Data.Data.leftImageID,
      rightImageID: fixture.Data.Data.rightImageID,
      topImageID: fixture.Data.Data.topImageID,
      bottomImageID: fixture.Data.Data.bottomImageID,
      leftMirrored: fixture.Data.Data.leftMirrored,
      rightMirrored: fixture.Data.Data.rightMirrored,
      bottomMirrored: fixture.Data.Data.bottomMirrored,
      topMirrored: fixture.Data.Data.topMirrored,
      frontMirrored: fixture.Data.Data.frontMirrored,
      backMirrored: fixture.Data.Data.backMirrored,
      xOffset: fixture.Data.Data.xOffset,
      yOffset: fixture.Data.Data.yOffset,
      zOffset: fixture.Data.Data.zOffset,
      rendering: fixture.Data.Data.rendering
    }

    for(var prop in fixture.Data.Data.RenderingsItems) {
      if(fixture.Data.Data.RenderingsItems[prop] != null && fixture.Data.Data.RenderingsItems[prop] != {}) {
        let renderingData = fixture.Data.Data.RenderingsItems[prop];

        item.children.push({
          id: renderingData.ID,
          floorplan_Item_ID: renderingData.ID,
          parent_ID: renderingData.ParentID,
          type: prop.toUpperCase(),
          height: renderingData.depth,
          width: renderingData.width,
          name: renderingData.name,
          shape: renderingData.floorplanShape,
          renderingData: renderingData.id,
          depth: renderingData.height,
          sales: renderingData.sales_Retail,
          x: parseFloat(fixture.RelativePosition.x.toFixed(2)),
          y: parseFloat((fixture.RelativePosition.y < 0 ? fixture.RelativePosition.y * -1 : fixture.RelativePosition.y).toFixed(2)),
          absoluteX: parseFloat(fixture.AbsolutePosition.x.toFixed(2)),
          absoluteY: parseFloat(fixture.AbsolutePosition.y.toFixed(2)),
          // absoluteX: renderingData.AbsolutePosition.x,
          // absoluteY: renderingData.AbsolutePosition.y,
          units: renderingData.sales_Units,
          profit: renderingData.sales_Profit,
          children:[],
          // children: getChildren(planodata, renderingData.ID, vuex, storeCount),
          // Details
          frontColor: renderingData.frontColor,
          backColor: renderingData.backColor,
          leftColor: renderingData.leftColor,
          rightColor: renderingData.rightColor,
          bottomColor: renderingData.bottomColor,
          topColor: renderingData.topColor,
          frontTransparent: renderingData.frontTransparent,
          backTransparent: renderingData.backTransparent,
          leftTransparent: renderingData.leftTransparent,
          rightTransparent: renderingData.rightTransparent,
          bottomTransparent: renderingData.bottomTransparent,
          topTransparent: renderingData.topTransparent,
          frontImageID: renderingData.frontImageID,
          backImageID: renderingData.backImageID,
          sideImageID: renderingData.sideImageID,
          leftImageID: renderingData.leftImageID,
          rightImageID: renderingData.rightImageID,
          topImageID: renderingData.topImageID,
          bottomImageID: renderingData.bottomImageID,
          leftMirrored: renderingData.leftMirrored,
          rightMirrored: renderingData.rightMirrored,
          bottomMirrored: renderingData.bottomMirrored,
          topMirrored: renderingData.topMirrored,
          frontMirrored: renderingData.frontMirrored,
          backMirrored: renderingData.backMirrored,
          xOffset: renderingData.xOffset,
          yOffset: renderingData.yOffset,
          zOffset: renderingData.zOffset,
          rendering: renderingData.rendering
        })
      }
    }

    if (fixture.Type == "PRODUCT") {
      let calcData = calculateAdvanced(fixture, vuex, storeCount);
      console.log("[product] calcData", calcData);
      item.daysOfSupply = calcData.DaysOfSupply
      item.itemCount = parseFloat(calcData.ZFacings) * parseFloat(calcData.YFacings)
      item.name = fixture.Data.Data.description
    }


    if(fixture.Type != "PRODUCT") {
      childArr.push(item)
    }
  })
  return childArr;
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
    Facings_Z_Max: 0,
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

  calcData.Weekly_Sales_Retail = calculationHandler.Calculate_Weekly_Sales_Retail(vuex.state.usePotential ? sales_potential : sales_retail, );

  if (vuex.state.usePotential) {
    calcData.Weekly_Sales_Cost = calculationHandler.Calculate_Weekly_Sales_Cost(cost_potential);
  }

  if (!vuex.state.usePotential) {
    calcData.Weekly_Sales_Cost = calculationHandler.Calculate_Weekly_Sales_Cost(sales_cost);
  }

  calcData.Weekly_Sales_Units = calculationHandler.Calculate_Weekly_Sales_Units(vuex.state.usePotential ? volume_potential : sales_units);

  calcData.Weekly_Profit = calculationHandler.Calculate_Weekly_Profit(vuex.state.usePotential ? sales_potential : sales_retail,
    sales_cost);

  calcData.XFacings = productData.Facings_X;
  calcData.Capacity = productData.TotalFacings;
  calcData.ForwardCapacity = productData.XYFacings;

  return calcData;
}

function calculateAdvanced(productItem, vuex, storeCount) {
  let self = this;
  let calculationHandler = new CalculationHandler(0, storeCount);

  var calcData = {
    XFacings: 0,
    YFacings: 0,
    ZFacings: 0,
    Capacity: null,
    ForwardCapacity: null,
    DaysOfSupply: null,
    DaysOfSupplyPotential: null,
    Weekly_Sales: null,
    Weekly_Sales_Potential: null,
    Weekly_Cost: null,
    Weekly_Cost_Potential: null,
    Weekly_Units: null,
    Weekly_Units_Potential: null,
    Weekly_Profit: null,
    Weekly_Profit_Potential: null
  }

  let productEventData = productItem;

  let productID = productEventData.Data.Data.productID;

  let productData;

  let ctrl_store = new StoreHelper();
  let productStoreCopy = ctrl_store.getAllPlanogramItemsByType(vuex, "PRODUCT");

  productStoreCopy = productStoreCopy.slice(0, productStoreCopy.length);

  productData = {
    ProductData: productEventData.Data,
    Facings_X: 0,
    Facings_Y: 0,
    Facings_Z: 0,
    Facings_Z_Max: 0,
    TotalFacings: 0,
    XYFacings: 0
  };

  let productPlacementCount = 0

  productStoreCopy.forEach((element, index) => {
    if (element.Data.productID == productID) {
      productPlacementCount++;
    }
  })

  let totalLinearProduct = 0;
  let totalProduct = 0;

  productStoreCopy.forEach((element, index) => {
    if (element.Data.productID == productID) {
      console.log("checking for caps", element);

      productData.Facings_X += element.Facings_X;
      productData.Facings_Y += element.Facings_Y + (element.Caps_Enabled ? element.Caps_Count : 0) / productPlacementCount;
      productData.Facings_Z += element.Facings_Z / productPlacementCount;
      productData.TotalFacings += element.TotalFacings;
      productData.XYFacings += element.Facings_X + element.Facings_Y;

      totalLinearProduct += (element.Facings_X * (element.Facings_Y + +(element.Caps_Enabled ? element.Caps_Count : 0)));
      totalProduct += element.TotalFacings;
    }
  });

  productData.Facings_Y = (totalLinearProduct / productData.Facings_X);
  productData.Facings_Z = (totalProduct / totalLinearProduct);

  var sales_retail = productData.ProductData.Data.sales_Retail,
    sales_potential = productData.ProductData.Data.sales_potential,
    sales_cost = productData.ProductData.Data.sales_Cost,
    sales_units = productData.ProductData.Data.sales_Units,
    volume_potential = productData.ProductData.Data.volume_potential,
    cost_potential = productData.ProductData.Data.cost_potential,
    weighted_distribution = productData.ProductData.Data.weighted_Distribution,
    total_facings = productData.TotalFacings;

  calcData.XFacings = parseFloat(productData.Facings_X).toFixed(3).toString();
  calcData.YFacings = parseFloat(productData.Facings_Y).toFixed(3).toString();
  calcData.ZFacings = parseFloat(productData.Facings_Z).toFixed(3).toString();

  // Days Of Supply
  calcData.DaysOfSupply = calculationHandler.Calculate_Days_Of_Supply_Potential(total_facings, sales_units);
  calcData.DaysOfSupplyPotential = calculationHandler.Calculate_Days_Of_Supply_Potential(total_facings, storeCount == 1 ? sales_units : volume_potential);

  // SALES
  calcData.Weekly_Sales = calculationHandler.Calculate_Weekly_Sales_Retail(sales_retail);
  calcData.Weekly_Sales_Potential = calculationHandler.Calculate_Weekly_Sales_Retail(storeCount == 1 ? sales_retail : sales_potential);

  // COST
  calcData.Weekly_Cost = calculationHandler.Calculate_Weekly_Sales_Cost(sales_cost);
  calcData.Weekly_Cost_Potential = calculationHandler.Calculate_Weekly_Sales_Cost(storeCount == 1 ? sales_cost : cost_potential);

  // UNITS
  calcData.Weekly_Units = calculationHandler.Calculate_Weekly_Sales_Units(sales_units);
  calcData.Weekly_Units_Potential = calculationHandler.Calculate_Weekly_Sales_Units(storeCount == 1 ? sales_units : volume_potential);

  // PROFIT
  calcData.Weekly_Profit = calculationHandler.Calculate_Weekly_Profit(sales_retail, sales_cost);
  calcData.Weekly_Profit_Potential = calculationHandler.Calculate_Weekly_Profit(storeCount == 1 ? sales_retail : sales_potential, storeCount == 1 ? sales_cost : cost_potential);

  calcData.XFacings = productData.Facings_X;
  calcData.Capacity = productData.TotalFacings;
  calcData.ForwardCapacity = productData.XYFacings;

  return calcData;
}

export default LoadSavePlanogramBase;