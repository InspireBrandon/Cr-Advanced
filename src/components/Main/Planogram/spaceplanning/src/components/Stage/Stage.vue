<template>
  <div>
    <PlanogramToolbar ref="PlanoToolbar"></PlanogramToolbar>
    <!-- <v-btn @click="ChangeOrientation('bottom')">
            <v-icon right dark>image</v-icon>
            bottom
    </v-btn>-->
    <h5>PLANOGRAM</h5>
    <v-divider></v-divider>
    <div @dragover="acceptDrag" @drop="dropDragItem" class="stage_container" ref="stage_container"
      :style="{height: windowHeight}">
      <v-stage v-if="stageShowing" ref="stage" :config="stageConfiguration"></v-stage>
    </div>
    <GondolaModal></GondolaModal>
    <PlanogramOptionsModal></PlanogramOptionsModal>
    <FixtureModal></FixtureModal>
    <ProductModal></ProductModal>
    <ProductMaintModal></ProductMaintModal>

    <v-dialog v-model="Loading" persistent width="300">
      <v-card color="primary" dark>
        <v-card-text>
          Please wait - {{ LoadingMsg }}
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
    <Prompt ref="prompt"></Prompt>
    <Dialog ref="dialog"></Dialog>
    <MergeProduct ref="MergeProduct" />
  </div>
</template>

<script>
  //import Konva from 'konva'
  // import CustomEmitter from '@/libs/EventBus/CustomEmitter.js';
  //#region Templates
  import axios from "axios";
  import Konva from 'konva';
  import PlanogramToolbar from "@/components/Main/Planogram/spaceplanning/src/components/PlanogramToolbar/PlanogramToolbar";
  import IntersectDrop from "@/components/Main/Planogram/spaceplanning/src/libs/Intersection/drop-intersection-helper.js";
  import IntersectionTester from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/intersection/IntersectionTester.js";
  import StoreHelper from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/StoreHelper/StoreHelper.js";
  import LoadSavePlanogramBase from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/LoadSavePlanogramBase.js";
  import CustomFixtureLoader from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/LoadCustomFixture.js";
  //#endregion Templates

  //#region Modals
  import GondolaModal from "@/components/Main/Planogram/spaceplanning/src/components/Modals/PlanogramModals/GondolaModal";
  import PlanogramOptionsModal from "@/components/Main/Planogram/spaceplanning/src/components/Modals/PlanogramModals/PlanogramOptionsModal";
  import FixtureModal from "@/components/Main/Planogram/spaceplanning/src/components/Modals/PlanogramModals/FixtureModal";
  import ProductModal from "@/components/Main/Planogram/spaceplanning/src/components/Modals/PlanogramModals/ProductModal";
  import ProductMaintModal from "@/components/Main/DataPreparation/Views/ImagePreparation/ProductMaintModal";
  import Prompt from "@/components/Common/Prompt";
  import Dialog from "@/components/Common/Dialog";
  import MergeProduct from "@/components/Main/Planogram/spaceplanning/src/components/Modals/MergeProduct/Index.vue";
  //#endregion Modals

  import EventBus from "@/components/Main/Planogram/spaceplanning/src/libs/EventBus/EventBus.js";
  import GondolaNew from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/GondolaBase.js";
  import PaletteNew from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/PaletteBase.js";
  import ShelfNew from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/ShelfBase.js";
  import BaseNew from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/BaseShelf.js";
  import PegboardNew from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/PegboardBase.js";
  import PegBarNew from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/PegBarBase.js";
  import ProductGroup from "@/components/Main/Planogram/spaceplanning/src/libs/Product/ProductGroup.js";
  import ProductGroupNew from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/ProductBase.js";
  import BasketNew from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/BasketBase.js";
  import TextHeaderNew from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/TextHeaderBase.js";
  import AreaNew from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/AreaBase.js";
  import LabelHolderNew from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/LabelHolderBase.js";
  import PegNew from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/PegBase.js";
  import ShareboxNew from "@/components/Main/Planogram/spaceplanning/src/libs/1.NewLibs/base/ShareboxBase.js";

  //calculations
  import CalculationHandler from "@/components/Main/Planogram/spaceplanning/src/libs/CalculationLib/calculationHandler.js";

  // postioning controller
  import PositioningBase from '@/components/Main/Planogram/spaceplanning/src/libs/BaseLibs/PositioningBase.js';

  export default {
    components: {
      PlanogramToolbar,
      GondolaModal,
      PlanogramOptionsModal,
      FixtureModal,
      ProductModal,
      Prompt,
      Dialog,
      ProductMaintModal,
      MergeProduct
    },
    name: "app",
    data() {
      let width = 0;
      // let height = window.innerHeight - 100;
      let height = 850;
      width = window.innerWidth * 0.74;

      //this.$PixelToCmRatio = (width / height);
      this.$PixelToCmRatio = 3;
      // this.$PixelToCmRatio = 1;
      console.log("FACTOR : ", this.$PixelToCmRatio, width, height);
      return {
        stageShowing: true,
        GondolaLoading: true,
        FixtureLoading: true,
        ProductLoading: true,
        ImagesLoading: false,
        GroupBoxesLoading: false,
        CalculationHandler: new CalculationHandler(),
        RangeID: null,
        LoadingMsg: "",
        stageConfiguration: {
          width: width,
          height: height,
          draggable: true,
          dragBoundFunc: function (pos) {
            return {
              x: pos.x < 0 ? pos.x : 0,
              y: pos.y
            };
          }
        },
        stageData: {
          gondolas: []
        },
        selectionData: {
          selectedGondola: null,
          selectedProductGroup: null
        },
        ImagesOff: true,
        GroupsOff: true,
        labelsOn: false,
        ProductSelected: false,
        MasterLayer: null
      };
    },
    computed: {
      Loading() {
        return false;
        // return (
        //   this.GondolaLoading ||
        //   this.FixtureLoading ||
        //   this.ProductLoading ||
        //   this.ImagesLoading ||
        //   this.GroupBoxesLoading
        // );
      },
      windowHeight() {
        let self = this;
        var winHeight = window.innerHeight;

        var height = winHeight - (48 + 17 + 32 + 15);
        height = height.toString() + "px";

        this.$nextTick(() => {
          var element = self.$refs.stage_container;
          element.scrollTop = element.scrollHeight;
        });

        return height;
      }
    },
    mounted() {
      let self = this;
      //#region Zoom
      var stage = this.$refs.stage.getStage();

      self.createNewLayer("originalInit");

      //#region Register Control button listeners
      self.registerControlKeyListeners();
      //#endregion

      var scaleBy = 1.05;
      stage.addEventListener('wheel', (e) => {
        //e.preventDefault();
        // var stage = self.$refs.stage.getStage();

        var oldScale = stage.scaleX();

        var mousePointTo = {
          x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
          y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
        };

        var newScale = (e.deltaY * -1) > 0 ? oldScale * scaleBy : oldScale / scaleBy;
        stage.scale({
          x: newScale,
          y: newScale
        });

        var newPos = {
          x: -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
          y: -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale
        };

        stage.position(newPos);
        stage.batchDraw();
        self.HideGondolaOutOfViewPort();
      });

      //#region Disable default context menu
      stage.addEventListener("contextmenu", function (e) {
        if (e.button == 2) {
          // Block right-click menu thru preventing default action.
          // open your own modal here
          e.preventDefault();
        }
      });
      //#endregion

      stage.on("dragmove", function () {
        self.HideGondolaOutOfViewPort();
      });

      this.loadPlanogram();
    },
    created() {
      this.planogramHelper = new LoadSavePlanogramBase(process.env.VUE_APP_API, true, null);

      this.$store.commit("resetStore");
      EventBus.$on(
        "NOTIFY_GONDOLA_SELECTED_DESELECTED",
        this.event_gondola_selected_deselected
      );
      EventBus.$on(
        "NOTIFY_PRODUCT_GROUP_SELECTED_DESELECTED",
        this.event_product_group_selected_deselected
      );

      EventBus.$on("MODAL_SAVED", this.event_reload_data_modal_saved);
      EventBus.$on("DELETE_GONDOLA", this.event_delete_gondola);
      EventBus.$on("DELETE_FIXTURE", this.event_delete_fixture);
      EventBus.$on("DELETE_PRODUCT", this.event_delete_product);

      EventBus.$on("NOTIFY_CLUSTER_CHANGE", this.event_notify_cluster_change);
    },
    beforeDestroy() {
      EventBus.$off(
        "NOTIFY_GONDOLA_SELECTED_DESELECTED",
        this.event_gondola_selected_deselected
      );
      EventBus.$off(
        "NOTIFY_PRODUCT_GROUP_SELECTED_DESELECTED",
        this.event_product_group_selected_deselected
      );
      EventBus.$off("MODAL_SAVED", this.event_reload_data_modal_saved);
      EventBus.$off("DELETE_GONDOLA", this.event_delete_gondola);
      EventBus.$off("DELETE_FIXTURE", this.event_delete_fixture);
      EventBus.$off("DELETE_PRODUCT", this.event_delete_product);
    },
    methods: {
      createNewLayer(name) {
        let self = this;
        var stage = self.$refs.stage.getStage();

        if (self.MasterLayer != null) {
          self.MasterLayer.destroy();
        }

        self.MasterLayer = new Konva.Layer({
          id: "master_layer",
          name: name
        });

        stage.add(self.MasterLayer);
      },
      forceUpdate() {
        let self = this;

        self.stageShowing = false;

        setTimeout(() => {
          self.stageShowing = true;
        }, 1000);
      },
      registerControlKeyListeners() {
        let self = this;
        let ctrl_store = new StoreHelper();
        let fired = false;

        document.addEventListener('keydown', function (e) {

          if (!fired) {
            fired = true;

            let cloneID = ctrl_store.getCloneItem(self.$store);

            if (cloneID == null) {
              var ctrlKey = 17,
                cmdKey = 91,
                vKey = 86,
                // cDeleteKey = 46,
                cKey = 67;

              if (e.keyCode === ctrlKey || e.keyCode === cmdKey || e.keyCode === vKey || e.keyCode === cKey) {
                ctrl_store.setCtrlDown(self.$store, true);
              }

              if (e.keyCode == 46) {
                alert("DELETE");
                // ctrl_store.dele
              }
            }
          }
        });

        document.addEventListener('keyup', function () {
          fired = false;
          ctrl_store.setCloneItem(self.$store, null);
          ctrl_store.setCtrlDown(self.$store, false);
        });
      },
      savePlanogram() {
        let self = this;
        let stage = self.$refs.stage.getStage();
        let state = self.$route.params.planogramState;
        let planogramID = self.$route.params.planogramID;
        // start saving again

        // construct range data for file
        let rangeFileData_ToPlanaogram = {
          RangeID: self.RangeID,
          ClusterType: "",
          ClusterID: -1,
          FileName: ""
        }

        let ctrl_loadSavePlanogram = new LoadSavePlanogramBase(process.env.VUE_APP_API, state.toUpperCase() == "NEW" ?
          true : false, planogramID);
        ctrl_loadSavePlanogram.savePlanogram(self.$store, stage, rangeFileData_ToPlanaogram);

        return;

        // let state = self.$route.params.planogramState;
        // let planogramID = self.$route.params.planogramID;

        // if (state.toUpperCase != "NEW") {
        //   self.getPlanogramName(planogramID)
        //     .then(name => {
        //       self.savePlanogramCallback(name);
        //     })
        // } else {
        //   self.savePlanogramCallback("");
        // }
      },
      savePlanogramCallback(name) {
        let self = this

        let state = self.$route.params.planogramState;
        let planogramID = self.$route.params.planogramID;

        self.$refs.prompt.show(name, 'Save Planogram', 'Planogram Name:', planogramName => {
          let stage = self.$refs.stage.getStage();

          var output = {
            stage: stage.toJSON(),
            planogramData: [],
            RangeFileID: self.RangeID
          };

          var gondolaArr = self.$store.state.gondolas;

          gondolaArr.forEach(gondola => {
            let gondolaObj = {
              Type: "GONDOLA",
              SubType: gondola.Type,
              Object: gondola.toObject()
            };
            output.planogramData.push(gondolaObj);

            if (gondola.Fixtures != null && gondola.Fixtures.length > 0) {
              gondola.Fixtures.forEach(fixture => {
                let fixtureObj = {
                  Type: "FIXTURE",
                  SubType: fixture.Type,
                  Object: fixture.toObject()
                };

                output.planogramData.push(fixtureObj);

                if (
                  fixture.ProductGroupArray != null &&
                  fixture.ProductGroupArray.length > 0
                ) {
                  fixture.ProductGroupArray.forEach(productGroup => {
                    let productGroupObj = {
                      Type: "PRODUCTGROUP",
                      Object: productGroup.toObject()
                    };

                    output.planogramData.push(productGroupObj);
                  });
                }
              });
            }
          });

          switch (state.toUpperCase()) {
            case "NEW": {
              let d = new Date();
              axios
                .post(
                  process.env.VUE_APP_API + "SystemFile/Json?db=CR-Devinspire", {
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
                    // alert("saved!");
                  } else {
                    alert("Server responded unsuccessfully!");
                  }
                })
                .catch(error => {
                  console.error("Failed to save planogram file");
                });
            }
            break;
          case "MODIFY": {
            axios
              .put(
                process.env.VUE_APP_API +
                `SystemFile/Json?db=CR-Devinspire&id=${planogramID}&name=${planogramName}`,
                output
              )
              .then(result => {
                if (result.data.success == true) {
                  // alert("saved!");
                } else {
                  alert("Server responded unsuccessfully!");
                }
              })
              .catch(error => {
                console.error("Failed to save planogram file");
              });
          }
          break;
          }
        })
      },
      getPlanogramName(fileID) {
        let self = this;

        return new Promise((resolve, reject) => {
          axios.get(process.env.VUE_APP_API + "SystemFile?db=CR-Devinspire&id=" + fileID)
            .then(r => {
              resolve(r.data.name);
            })
            .catch(e => {
              reject("");
            })
        })
      },
      getRangingFile() {
        let self = this;

        let state = self.$route.params.planogramState;

        if (state.toUpperCase() == "NEW") {}
      },
      loadPlanogram() {

        let self = this;
        let stage = self.$refs.stage.getStage();
        let planogramID = self.$route.params.planogramID;
        let state = self.$route.params.planogramState;
        // start saving again

        // construct range data for file
        let rangeFileData_ToPlanaogram = {
          RangeID: self.RangeID,
          ClusterType: "",
          ClusterID: -1,
          FileName: ""
        }

        // let ctrl_loadSavePlanogram = new LoadSavePlanogramBase(process.env.VUE_APP_API, state.toUpperCase() == "NEW" ?
        //   true : false, planogramID);
        // ctrl_loadSavePlanogram.loadPlanogram(self.$store, stage, this);

        return;

        // let self = this;
        // var stage = self.$refs.stage.getStage();
        // var container = stage.container();
        // var planogamID = self.$route.params.planogramID;
        // var state = self.$route.params.planogramState;

        // let preview = false;

        // self.LoadingMsg = "Loading Planogram";
      },
      redrawPlanogram() {
        let self = this;
        var stage = self.$refs.stage.getStage();
        stage.draw();
      },
      refreshLibrary() {
        let self = this;
        self.$refs.PlanoToolbar.$refs.library.getLibraryData();
      },
      loadGondolasFromFile(result) {
        let self = this;
        var stage = self.$refs.stage.getStage();

        if (!result.data) {
          this.GondolaLoading = false;
          return;
        }

        let gondolas = result.data.planogramData.filter(
          g => g.Type === "GONDOLA"
        );

        if (gondolas.length == 0) {
          this.GondolaLoading = false;
        }

        self.LoadingMsg = "Loading Gondolas";

        gondolas.sort((a, b) => a.Position - b.Position);

        gondolas.forEach((gondola, gondola_index) => {
          let data = JSON.parse(gondola.Object);

          let ctrl_gondola = new Gondola(
            self.$store,
            data.Data,
            self.$PixelToCmRatio,
            data.Data.Position
          );
          ctrl_gondola.LoadFromFile(stage, data);

          if (gondola_index == gondolas.length - 1) {
            this.GondolaLoading = false;
          }

          self.HideGondolaOutOfViewPort();
        });
      },
      loadFixturesFromFile(result) {
        let self = this;
        var stage = self.$refs.stage.getStage();

        if (!result.data) {
          this.FixtureLoading = false;
          this.ProductLoading = false;
          return;
        }

        let fixtures = result.data.planogramData.filter(
          g => g.Type === "FIXTURE"
        );

        if (fixtures.length == 0) {
          this.FixtureLoading = false;
          this.ProductLoading = false;
        }

        let fixturePromiseArr = [];

        fixtures.forEach(fixture => {

          let data = JSON.parse(fixture.Object);

          self.LoadingMsg = "Loading Fixture - " + fixture.SubType.toUpperCase();

          switch (fixture.SubType.toUpperCase()) {
            case "SHELF": {
              let ctrl_shelf = new Shelf(
                self.$store,
                data.Data.GondolaID,
                data.Data.FixtureData,
                self.$PixelToCmRatio
              );
              fixturePromiseArr.push(ctrl_shelf.LoadFromFile(stage, data));
              // ctrl_shelf.LoadFromFile(stage, data).then(loaded => {
              //   // load products onto this fixture
              //   self.loadProductGroupsFromFile(data.Data.ID, result);
              //   self.FixtureLoading = false;
              // });
            }
            break;
          case "BASE": {
            let ctrl_shelf = new Shelf(
              self.$store,
              data.Data.GondolaID,
              data.Data.FixtureData,
              self.$PixelToCmRatio
            );
            // ctrl_shelf.LoadFromFile(stage, data).then(loaded => {
            //   // load products onto this fixture
            //   self.loadProductGroupsFromFile(data.Data.ID, result);
            //   self.FixtureLoading = false;
            // });

            fixturePromiseArr.push(ctrl_shelf.LoadFromFile(stage, data));
          }
          break;
          case "PEGBOARD": {
            let self = this;
            let ctrl_pegboard = new Pegboard(
              self.$store,
              data.Data.GondolaID,
              data.Data.FixtureData,
              self.$PixelToCmRatio
            );
            // ctrl_pegboard.LoadFromFile(stage, data).then(() => {
            //   self.loadProductGroupsFromFile(data.Data.ID, result);
            //   self.FixtureLoading = false;
            // });
            // load pegs next

            fixturePromiseArr.push(ctrl_pegboard.LoadFromFile(stage, data));
          }
          break;
          case "PEGBAR": {
            let self = this;
            let ctrl_PegBar = new PegBar(
              self.$store,
              data.Data.GondolaID,
              data.Data.FixtureData,
              self.$PixelToCmRatio
            );
            // ctrl_PegBar.LoadFromFile(stage, data).then(() => {
            //   self.loadProductGroupsFromFile(data.Data.ID, result);
            //   self.FixtureLoading = false;
            // });

            fixturePromiseArr.push(ctrl_PegBar.LoadFromFile(stage, data));
          }
          break;
          }
        });

        Promise.all(fixturePromiseArr)
          .then(fixturesComplete => {
            self.FixtureLoading = false;

            let productPromiseArray = [];
            fixtures.forEach(fixture => {
              let data = JSON.parse(fixture.Object);
              productPromiseArray.push(self.loadProductGroupsFromFile(data.Data.ID, result));
            });

            Promise.all(productPromiseArray)
              .then(productsAdded => {
                console.log("[WAREHOUSE] Sending products loaded from file event to warehouse for list to adjust")
                var activePlanoProduct = self.$store.state.activePlanogramProducts;

                EventBus.$emit('PLANOGRAM_LOADED', {
                  data: activePlanoProduct
                });
              })

          })
          .catch(fixtureLoadError => {
            console.error(fixtureLoadError.toString())
          });
      },
      loadProductGroupsFromFile(fixtureID, result) {
        let self = this;
        var stage = self.$refs.stage.getStage();
        let productGroups = result.data.planogramData.filter(
          g => g.Type === "PRODUCTGROUP"
        );

        this.LoadingMsg = "Loading Products";
        if (productGroups.length == 0) {
          this.ProductLoading = false;
        }

        let productPromiseArr = [];
        productGroups.forEach((productGroupItem, productIdx) => {
          //   console.log("LOAD UP PRODUCT GROUPS", productGroupItem, JSON.parse(productGroupItem.Object));
          let data = JSON.parse(productGroupItem.Object);
          if (data.Data.FixtureID == fixtureID) {
            let ctrl_product = new ProductGroup(
              self.$store,
              data.Data.ProductData,
              self.$PixelToCmRatio
            );

            this.LoadingMsg = "Loading Product - " + data.Data.ProductData.barcode;
            productPromiseArr.push(ctrl_product.LoadFromFile(stage, data));
          }
        });

        Promise.all(productPromiseArr)
          .then(productsLoaded => {
            self.ProductLoading = false;

            //#region Load missing associations (all fixtures and products loaded)
            let gondolas = self.$store.getters.getAllGondolas;
            let allFixtures = self.$store.getters.getAllFixtures;

            // // add fixtures to gondola data object Fixtures []
            // gondolas.forEach(gondolaItem => {

            //   fixtures.forEach(fixtureItem => {
            //     if (gondolaItem.ID == fixtureItem.GondolaID) {
            //       gondolaItem.Fixtures.push(fixtureItem);
            //     }
            //   });

            // });

            let order = self.$store.getters.getLabelConfig;

            if (allFixtures.length > 0) {
              allFixtures[0].DetermineFixturePosition(order.Order);
            }

            //#endregion

          })
          .catch(productLoadError => {
            console.error("Faile to load products", productLoadError.toString());
          })
      },
      HideGondolaOutOfViewPort() {
        // let self = this;
        // var stage = self.$refs.stage.getStage();

        // let stageRect = {
        //   x: stage.getX(),
        //   y: stage.getY(),
        //   width: stage.getWidth(),
        //   height: stage.getHeight()
        // };

        // let allItems = self.$store.getters.getAllPlanogramItems;

        // allItems = allItems.filter((el) => el.Type.toUpperCase() == "GONDOLA" || el.Type.toUpperCase() == "PALETTE");

        // if (allItems.length > 0) {
        //   allItems.forEach(element => {
        //     let gondolaRect = element.Group.getClientRect();

        //     if (
        //       gondolaRect.x + gondolaRect.width < 0 ||
        //       gondolaRect.x > stageRect.width
        //     ) {
        //       element.Group.hide();
        //     } else {
        //       element.Group.show();
        //     }
        //   });
        // }
      },
      ShowAllGondolas() {
        let self = this;
        let ctrl_store = new StoreHelper();

        let gondolarr = ctrl_store.getAllPlanogramItemsByType(self.$store, "GONDOLA");

        if (gondolarr.length > 0) {
          gondolarr.forEach(element => {
            element.Group.show();
          });
        }
      },
      resetStagePosition() {
        var self = this;
        var stage = self.$refs.stage.getStage();
        stage.scaleX(1);
        stage.scaleY(1);
        stage.position({
          x: 0,
          y: 0
        });
        stage.batchDraw();

        self.HideGondolaOutOfViewPort();
      },
      resetStageScale() {
        var self = this;
        var stage = self.$refs.stage.getStage();
        stage.scaleX(1);
        stage.scaleY(1);
        stage.batchDraw();
      },
      b64toBlob(b64Data, contentType, sliceSize) {
        contentType = contentType || "";
        sliceSize = sliceSize || 512;

        var byteCharacters = window.atob(
          b64Data.replace(/^data:image\/(png|jpeg|jpg);base64,/, "")
        );
        var byteArrays = [];

        for (
          var offset = 0; offset < byteCharacters.length; offset += sliceSize
        ) {
          var slice = byteCharacters.slice(offset, offset + sliceSize);

          var byteNumbers = new Array(slice.length);
          for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }

          var byteArray = new Uint8Array(byteNumbers);

          byteArrays.push(byteArray);
        }

        var blob = new Blob(byteArrays, {
          type: contentType
        });
        return blob;
      },
      getImageBytes(ratio) {
        var self = this;
        let ctrl_store = new StoreHelper();

        self.ShowAllGondolas();
        var stage = self.$refs.stage.getStage();

        stage.scaleX(1);
        stage.scaleY(1);
        stage.position({
          x: 0,
          y: 0
        });
        stage.batchDraw();

        let width = 0;

        let allProducts = ctrl_store.getAllPlanogramItemsByType(self.$store, "PRODUCT");
        allProducts.forEach(element => {
          element.ClearCache();
        });

        let allGondolas = ctrl_store.getAllPlanogramItemsByType(self.$store, "GONDOLA");
        allGondolas.forEach(element => {
          width += element.Group.getWidth() + 1;
        });

        let height = stage.getHeight();

        var dataURL = this.$refs.stage.getStage().toDataURL({
          x: 0,
          y: 0,
          width: width,
          height: height,
          mimeType: "image/png",
          quality: 1.0,
          pixelRatio: ratio
        });

        return dataURL;
      },
      downloadImage(ratio) {
        var self = this;
        let ctrl_store = new StoreHelper();

        self.ShowAllGondolas();
        var stage = self.$refs.stage.getStage();
        // stage.find('Shape').strokeWidth(1 / stage.scale());
        stage.scaleX(1);
        stage.scaleY(1);
        stage.position({
          x: 0,
          y: 0
        });
        stage.batchDraw();

        let width = 0;

        let allProducts = ctrl_store.getAllPlanogramItemsByType(self.$store, "PRODUCT");
        allProducts.forEach(element => {
          element.Quality = ratio;
          element.Cache();
        });

        let allGondolas = ctrl_store.getAllPlanogramItemsByType(self.$store, "GONDOLA");
        allGondolas.forEach(element => {
          width += (element.Group.getWidth() + 1);
        });

        let allItems = ctrl_store.getAllPlanogramItems(self.$store);
        let lastY = 0;
        allItems.forEach(element => {
          if (element.Group.getAbsolutePosition().y < lastY) {
            lastY = element.Group.getAbsolutePosition().y();
          }
        });

        let height = stage.getHeight() - lastY;

        // console.log("[download parameters]", "R", ratio, "Last Y", lastY, "TTL H DWN", height, "stage H", stage
        //   .getHeight())

        var dataURL = this.$refs.stage.getStage().toDataURL({
          x: 0,
          y: lastY,
          width: width,
          height: height,
          mimeType: "image/png",
          quality: 1.0,
          pixelRatio: ratio
        });
        // Chrome 1+

        var blob = self.b64toBlob(dataURL, "image/jpeg");
        var blobUrl = URL.createObjectURL(blob);

        //#region CHROME

        var link = document.createElement("a");
        // self.getPlanogramName(planogramID)
        //   .then(planogramName => {
        //     link.download = planogramName + ".png";
        //     // Construct the uri
        //     link.href = blobUrl;
        //     document.body.appendChild(link);
        //     link.click();
        //     // Cleanup the DOM
        //     document.body.removeChild(link);

        //     //#endregion
        //     self.HideGondolaOutOfViewPort();
        //   })
        let planogramDetails = self.$store.getters.getClusterData;
        link.download = planogramDetails.planogramName + ".png";
        // Construct the uri
        link.href = blobUrl;
        document.body.appendChild(link);
        link.click();
        // Cleanup the DOM
        document.body.removeChild(link);

        //#endregion
        self.HideGondolaOutOfViewPort();
      },
      downloadSelectedGondola() {
        var self = this;
        var stage = self.$refs.stage.getStage();
        let selectedValue = self.selectionData.selectedGondola;

        stage.scaleX(1);
        stage.scaleY(1);
        stage.position({
          x: 0,
          y: 0
        });
        stage.batchDraw();

        // stage.find('Shape').strokeWidth(1 / stage.scale());

        // console.log(selectedValue);
        var dataURL = this.$refs.stage.getStage().toDataURL({
          x: selectedValue.Group.getX(),
          y: selectedValue.Group.getY(),
          width: selectedValue.Group.width(),
          height: stage.getHeight(),
          mimeType: "image/jpg",
          quality: 1.0
        });

        // Chrome 1+
        var isChrome = !!window.chrome && !!window.chrome.webstore;

        // Internet Explorer 6-11
        // var isIE = /*@cc_on!@*/ false || !!document.documentMode;
        // Edge
        // var isEdge = !isIE && !!window.StyleMedia;
        if (isChrome) {
          // Construct the <a> element
          var link = document.createElement("a");
          link.download = "Section.jpg";
          // Construct the uri
          var uri = dataURL;
          link.href = uri;
          document.body.appendChild(link);
          link.click();
          // Cleanup the DOM
          document.body.removeChild(link);
        }

        self.HideGondolaOutOfViewPort();
      },

      addNewGondola(data) {
        let self = this;
        let stage = self.$refs.stage.getStage();

        let ctrl_positioning = new PositioningBase();
        let dropPos = ctrl_positioning.GetTransformedMousePoint(stage)
        console.log("GONDOLA ADD - STAGE", dropPos, self.MasterLayer, data);

        let ctrl_gondola = new GondolaNew(self.$store, stage, self.MasterLayer, JSON.parse(JSON.stringify(data)), self
          .$PixelToCmRatio,
          "GONDOLA");

        ctrl_gondola.Initialise(dropPos);

        self.HideGondolaOutOfViewPort();
      },
      addNewPalette(parentID, data, dropPos) {
        let self = this;
        let stage = self.$refs.stage.getStage();

        let ctrl_shelf = new PaletteNew(
          self.$store,
          stage,
          self.MasterLayer,
          JSON.parse(JSON.stringify(data)),
          self.$PixelToCmRatio,
          "PALETTE",
          parentID
        );
        ctrl_shelf.Initialise(dropPos);
      },
      addNewTextHeader(data, scale) {
        let self = this;
        let stage = self.$refs.stage.getStage();

        let ctrl_positioning = new PositioningBase();
        let dropPos = ctrl_positioning.GetTransformedMousePoint(stage)
        // console.log("TEXT HEADER ADD - STAGE", dropPos, self.MasterLayer);

        let ctrl_textHeader = new TextHeaderNew(self.$store, stage, self.MasterLayer, JSON.parse(JSON.stringify(data)),
          self.$PixelToCmRatio,
          "TEXTHEADER", scale, 'HEADER TEXT');

        ctrl_textHeader.Initialise(dropPos);
      },
      ToggleProductLabels() {
        let self = this;
        let ctrl_store = new StoreHelper();
        let stage = self.$refs.stage.getStage();
        self.labelsOn = !self.labelsOn;

        // TODO: PRODUCT GROUP

        let allItems = ctrl_store.getAllPlanogramItems(self.$store);
        let productGroupArr = allItems.filter((el) => el.Type.toUpperCase() == "PRODUCT");

        productGroupArr.forEach((element, index) => {

          if (self.labelsOn == true)
            element.TurnLabelsOn();
          else
            element.TurnLabelsOff();

          element.Group.draw();

        });
      },
      ToggleImages(val) {
        let self = this;
        let ctrl_store = new StoreHelper();
        let stage = self.$refs.stage.getStage();
        self.ImagesOff = !self.ImagesOff;

        if (!self.ImagesOff) {
          self.ImagesLoading = true;
          self.LoadingMsg = "Loading Images";

          if (!self.GroupsOff) {
            self.ToggleGroups();
          }
        }

        // TODO: PRODUCT GROUP

        let allItems = ctrl_store.getAllPlanogramItems(self.$store);
        let productGroupArr = allItems.filter((el) => el.Type.toUpperCase() == "PRODUCT");

        productGroupArr.forEach((element, index) => {
          let imagesOn = (val != 0);

          if (imagesOn)
            element.TurnImagesOn(val);
          else
            element.TurnImagesOff();

          if (index == productGroupArr.length - 1) {
            element.Group.draw();
            self.ImagesLoading = false;
          }
        });
      },
      ToggleGroups() {

        let self = this;
        let ctrl_store = new StoreHelper();
        let stage = self.$refs.stage.getStage();
        self.GroupsOff = !self.GroupsOff;

        // if (!self.ImagesOff) {
        //   self.ImagesLoading = true;
        //   self.LoadingMsg = "Loading Images";

        //   if (!self.GroupsOff) {
        //     self.ToggleGroups();
        //   }
        // }

        // TODO: PRODUCT GROUP

        let allItems = ctrl_store.getAllPlanogramItems(self.$store);
        let productGroupArr = allItems.filter((el) => el.Type.toUpperCase() == "PRODUCT");

        productGroupArr.forEach((element, index) => {
          let groupsOn = !self.GroupsOff;

          if (groupsOn)
            element.TurnGroupsOn();
          else
            element.TurnGroupsOff();

        });
      },
      addNewCustom(parentId, data, dropPos) {
        let self = this;
        let stage = self.$refs.stage.getStage();
      },
      addNewPoduct(parentId, data, dropPos) {
        // console.log("[ADD PRODUCT]", data);
        let self = this;
        let stage = self.$refs.stage.getStage();

        // fix data coming in
        let newData = JSON.parse(JSON.stringify(data));
        newData.height = parseFloat(newData.height).toFixed(2);
        newData.width = parseFloat(newData.width).toFixed(2);
        newData.depth = parseFloat(newData.depth).toFixed(2);

        let ctrl_product = new ProductGroupNew(
          self.$store,
          stage,
          self.MasterLayer,
          newData,
          self.$PixelToCmRatio,
          "PRODUCT",
          parentId
        );
        ctrl_product.Initialise(dropPos);
        if (self.ImagesOff)
          ctrl_product.TurnImagesOff();
        else
          ctrl_product.TurnImagesOn();

        if (self.labelsOn)
          ctrl_product.TurnLabelsOn();
        else
          ctrl_product.TurnLabelsOff();

        ctrl_product.UpdateParent(ctrl_product.ParentID);
      },
      addNewArea(gondolaID, data, dropPos) {
        let self = this;
        let stage = self.$refs.stage.getStage();

        let ctrl_area = new AreaNew(
          self.$store,
          stage,
          self.MasterLayer,
          JSON.parse(JSON.stringify(data)),
          self.$PixelToCmRatio,
          "AREA",
          gondolaID
        );
        ctrl_area.Initialise(dropPos);
      },
      addNewShelf(gondolaID, data, dropPos) {
        let self = this;
        let stage = self.$refs.stage.getStage();

        let ctrl_shelf = new ShelfNew(
          self.$store,
          stage,
          self.MasterLayer,
          JSON.parse(JSON.stringify(data)),
          self.$PixelToCmRatio,
          "SHELF",
          gondolaID
        );
        ctrl_shelf.Initialise(dropPos);
      },
      addNewBasket(fixtureID, data, dropPos) {
        let self = this;
        let stage = self.$refs.stage.getStage();

        let ctrl_basket = new BasketNew(
          self.$store,
          stage,
          self.MasterLayer,
          JSON.parse(JSON.stringify(data)),
          self.$PixelToCmRatio,
          "BASKET",
          fixtureID
        );

        // Set all json values

        ctrl_basket.Initialise(dropPos);
      },
      addNewSharebox(fixtureID, data, dropPos) {
        // console.log("sharbox data", data);

        let self = this;
        let stage = self.$refs.stage.getStage();

        let ctrl_sharebox = new ShareboxNew(
          self.$store,
          stage,
          self.MasterLayer,
          JSON.parse(JSON.stringify(data)),
          self.$PixelToCmRatio,
          "SHAREBOX",
          fixtureID
        );

        // Set all json values

        ctrl_sharebox.Initialise(dropPos);
      },
      addNewPeg(fixtureID, data, dropPos) {
        let self = this;
        let stage = self.$refs.stage.getStage();

        let ctrl_peg = new PegNew(
          self.$store,
          stage,
          self.MasterLayer,
          JSON.parse(JSON.stringify(data)),
          self.$PixelToCmRatio,
          "PEG",
          fixtureID
        );

        // Set all json values

        ctrl_peg.Initialise(dropPos);
      },
      addNewBase(gondolaID, data, dropPos) {
        let self = this;
        let stage = self.$refs.stage.getStage();

        let ctrl_base = new BaseNew(
          self.$store,
          stage,
          self.MasterLayer,
          JSON.parse(JSON.stringify(data)),
          self.$PixelToCmRatio,
          "BASE",
          gondolaID
        );
        ctrl_base.Initialise(dropPos);
      },
      addNewPegboard(gondolaID, data, dropPos) {
        let self = this;
        let stage = self.$refs.stage.getStage();

        let ctrl_pegboard = new PegboardNew(
          self.$store,
          stage,
          self.MasterLayer,
          JSON.parse(JSON.stringify(data)),
          self.$PixelToCmRatio,
          "PEGBOARD",
          gondolaID
        );
        ctrl_pegboard.Initialise(dropPos);
      },
      addNewPegBar(gondolaID, data, dropPos) {

        let self = this;
        let stage = self.$refs.stage.getStage();

        let ctrl_pegBar = new PegBarNew(
          self.$store,
          stage,
          self.MasterLayer,
          JSON.parse(JSON.stringify(data)),
          self.$PixelToCmRatio,
          "PEGBAR",
          gondolaID
        );
        ctrl_pegBar.Initialise(dropPos);
      },
      addNewLabelHolder(fixtureID, data, dropPos) {

        let self = this;
        let stage = self.$refs.stage.getStage();

        let ctrl_labelHolder = new LabelHolderNew(
          self.$store,
          stage,
          self.MasterLayer,
          JSON.parse(JSON.stringify(data)),
          self.$PixelToCmRatio,
          "LABELHOLDER",
          fixtureID
        );
        ctrl_labelHolder.Initialise(dropPos);
      },
      //#region CAPS
      ToggleCapsOnOff(value) {
        let self = this;
        if (self.selectionData.selectedProductGroup != null) {
          self.selectionData.selectedProductGroup.ToggleCapsOnOff(value);
        }
      },
      IncreaseCaps() {
        let self = this;
        if (self.selectionData.selectedProductGroup != null) {
          self.selectionData.selectedProductGroup.IncreaseCaps();
        }
      },
      DecreaseCaps() {
        let self = this;
        if (self.selectionData.selectedProductGroup != null) {
          self.selectionData.selectedProductGroup.DecreaseCaps();
        }
      },
      //#endregion CAPS
      IncreaseFacingsX() {
        let self = this;
        if (self.selectionData.selectedProductGroup != null) {
          self.selectionData.selectedProductGroup.IncreaseFacingsX();
        }
      },
      IncreaseFacingsY() {
        let self = this;
        if (self.selectionData.selectedProductGroup != null) {
          self.selectionData.selectedProductGroup.IncreaseFacingsY();
        }
      },
      DecreaseFacingsX() {
        let self = this;
        if (self.selectionData.selectedProductGroup != null) {
          self.selectionData.selectedProductGroup.DecreaseFacingsX();
        }
      },
      DecreaseFacingsY() {
        let self = this;
        if (self.selectionData.selectedProductGroup != null) {
          self.selectionData.selectedProductGroup.DecreaseFacingsY();
        }
      },
      ChangePosition() {},
      ChangeOrientation(face) {
        let self = this;
        if (self.selectionData.selectedProductGroup != null) {
          self.selectionData.selectedProductGroup.ChangeOrientation(face);
        }
      },
      RotateProductFacings() {
        let self = this;
        if (self.selectionData.selectedProductGroup != null) {
          self.selectionData.selectedProductGroup.Rotate();
        }
      },

      //#region Events
      event_gondola_selected_deselected(eventData) {
        let self = this;
        self.selectionData.selectedGondola = eventData.data;
        self.selectionData.selectedProductGroup = null
      },
      event_product_group_selected_deselected(eventData) {
        let self = this;
        //#region Toolbar controls PRODUCT
        self.ProductSelected = eventData.selected;

        var controls = this.$refs.PlanoToolbar.$refs.ProductControls;

        if (eventData.data.Caps_Enabled) {
          controls.CapButtonToggle = 0;
        } else {
          controls.CapButtonToggle = null;
        }
        controls.bCapsOn = eventData.data.Caps_Enabled;
        controls.selectedOrientation = eventData.data.LastFace.toUpperCase() == "LEFT" ? "side" : eventData.data
          .LastFace;
        //#endregion Toolbar controls PRODUCT
        let lastSelected = self.selectionData.selectedProductGroup;
        self.selectionData.selectedProductGroup = eventData.data;
        self.selectionData.selectedGondola = null

        if (lastSelected != null) {
          lastSelected.Selected = false;
        }

        // self.selectionData.selectedProductGroup.Visual_Selected();
      },
      event_reload_data_modal_saved(data) {
        // console.log("GONDOLA SAVED EVENT STAGE", data);
        let self = this;
        switch (data.type.toUpperCase()) {
          case "GONDOLA": {
            let ctrl_store = new StoreHelper();
            let changed_gondola = ctrl_store.getPlanogramItemById(this.$store, data.id);
            changed_gondola.ChangeDimensions(data);
          }
          break;
        case "FIXTURE": {
          let ctrl_store = new StoreHelper();
          let changed_fixture = ctrl_store.getPlanogramItemById(this.$store, data.id);
          changed_fixture.ChangeDimensions(data);
        }
        break;
        case "PRODUCT": {
          let ctrl_store = new StoreHelper();
          let changed_product = ctrl_store.getPlanogramItemById(this.$store, data.id);
          // console.log('Product Changed', changed_product)
          changed_product.ChangeDimensions(data.object);
          let allProducts = self.$parent.$refs.warehouse.products;

          allProducts.forEach(el => {
            if (el.barcode == changed_product.Data.barcode) {
              for (var prop in el) {
                if (changed_product.Data[prop] != undefined && changed_product.Data[prop] != null) {
                  el[prop] = changed_product.Data[prop]
                }
              }

              // console.log("[Changed Range Product]", el)
            }
          })
        }
        }
      },
      event_delete_gondola(data) {
        console.log("DELETE EVENT GONDOLA STAGE", data);
        let self = this;

        let ctrl_store = new StoreHelper();
        let changed_gondola = ctrl_store.getPlanogramItemById(this.$store, data.gondola.ID);

        if (changed_gondola == null) {
          console.error(
            "[DELETE] Gondola : could not find Gondola from store :",
            data.gondola.ID
          );
          return;
        }

        changed_gondola.Delete();

        self.HideGondolaOutOfViewPort();
      },
      event_delete_fixture(data) {

        let self = this;

        let ctrl_store = new StoreHelper();
        let fixtureItem = ctrl_store.getPlanogramItemById(this.$store, data.fixture.ID);

        if (fixtureItem == null) {
          console.error(
            "[DELETE] Fixture : could not find Fixture from store :",
            data.fixture.ID
          );
          return;
        }

        fixtureItem.Delete();
      },
      event_delete_product(data) {
        let self = this;

        let canMerge = false;

        let product1 = data.data;
        let product2 = null;

        self.$parent.$refs.warehouse.products.forEach(el => {
          if (el.productID == product1.productID) {

            if (el.barcode != product1.barcode) {
              canMerge = true;
              product2 = el;
            }
          }
        })

        self.$refs.MergeProduct.show(canMerge, product1, product2, () => {
          let ctrl_store = new StoreHelper();
          let productGroup = ctrl_store.getPlanogramItemById(self.$store, data.product_object.ID);

          if (productGroup == null) {
            console.error(
              "[DELETE] Product : could not find Product Group :",
              data.product_object.ID
            );
            return;
          }

          productGroup.Delete();
        })
      },
      event_notify_cluster_change() {
        let self = this;
        let ctrl_store = new StoreHelper();
        let allProductItems = ctrl_store.getAllPlanogramItemsByType(self.$store, "PRODUCT");

        allProductItems.forEach(product => {
          product.DisplayProductIndicator();
        });
      },
      //#endregion

      //#region Warehouse
      acceptDrag(ev) {
        ev.preventDefault();
      },
      dropDragItem(ev) {
        ev.preventDefault();

        // check all collisions with shelf, pegboard, pegbar etc
        let self = this;
        let stage = self.$refs.stage.getStage();
        let data = null;
        let dragType = null;

        //#region Test drag item
        if (window.warehouseDragData != null) {
          dragType = "WAREHOUSE";
          data = window.warehouseDragData;
        } else if (window.library != null) {
          dragType = "LIBRARY";
          data = window.library;
        }
        //#endregion

        switch (dragType.toUpperCase()) {
          case "WAREHOUSE": {
            self.addWarehouseProduct(stage, data, ev);
          }
          break;
        case "LIBRARY": {
          if (data.type == "CUSTOM") {
            self.addCustomLibraryItem(stage, data, ev)
          } else {
            self.addLibraryItem(stage, data, ev);
          }
        }
        break;
        }
      },
      addWarehouseProduct(stage, data, ev) {
        let self = this;
        if (data == null) {
          alert("There is no warehouse data selected, please try again.");
          return;
        }
        console.log("ADDING WAREHOUSE PRODUCT", data, ev);
        let container = stage.container().getBoundingClientRect();
        stage._setPointerPosition(ev);

        let ctrl_intersectionTester = new IntersectionTester();

        let dropPos = ctrl_intersectionTester.GetTransformedMousePoint(stage);

        console.log("SHELF ADD - STAGE", dropPos);
        ctrl_intersectionTester.TestIntersectsWithMany(stage, "PRODUCT", ["SHELF", "BASE", "PEGBAR", "PEGBOARD",
              "BASKET",
              "PEG",
              "PALETTE",
              "LABELHOLDER",
              "SHAREBOX"
            ], self.$store,
            dropPos)
          .then(result => {
            console.log("[WAREHOUSE ADD] PRODUCT", result)
            if (result.intersects == true) {
              self.addNewPoduct(result.ID, data, result.ContainerPosition);
            }
          })

      },
      addLibraryItem(stage, data, ev) {
        let self = this;

        let container = stage.container().getBoundingClientRect();

        stage._setPointerPosition(ev);

        console.log("ADDING LIBRARY", data, ev);

        if (data == null) {
          alert("There is no library data selected, please try again.");
          return;
        }

        switch (data.type.toUpperCase()) {
          case "GONDOLA": {
            self.addNewGondola(data.data);
          }
          break;
        case "LABELHOLDER": {
          data.data["Type"] = "LABELHOLDER";

          let ctrl_intersectionTester = new IntersectionTester();

          let dropPos = ctrl_intersectionTester.GetTransformedMousePoint(stage);

          console.log("LABELHOLDER ADD - STAGE", dropPos);
          ctrl_intersectionTester.TestIntersectsWithMany(stage, "LABELHOLDER", ["PEGBOARD"], self.$store, dropPos)
            .then(result => {
              console.log("[LIBARY ADD] LABELHOLDER", result)
              if (result.intersects == true) {
                self.addNewLabelHolder(result.ID, data.data, result.ContainerPosition);
              }
            })
        }
        break;
        case "AREA": {
          data.data["Type"] = "AREA";

          let ctrl_intersectionTester = new IntersectionTester();

          let dropPos = ctrl_intersectionTester.GetTransformedMousePoint(stage);

          console.log("AREA ADD - STAGE", dropPos);
          ctrl_intersectionTester.TestIntersectsWithMany(stage, "AREA", ["GONDOLA"], self.$store, dropPos)
            .then(result => {
              console.log("[LIBARY ADD] AREA", result)
              if (result.intersects == true) {
                self.addNewArea(result.ID, data.data, result.ContainerPosition);
              }
            })
        }
        break;
        case "TEXTHEADER": {
          self.addNewTextHeader(data.data, {
            ScaleX: 1,
            ScaleY: 1
          })
        }
        break;
        case "PALETTE": {

          data.data["Type"] = "PALETTE";

          let ctrl_intersectionTester = new IntersectionTester();

          let dropPos = ctrl_intersectionTester.GetTransformedMousePoint(stage);

          console.log("SHELF ADD - STAGE", dropPos);
          // ctrl_intersectionTester.TestIntersectsWithMany(stage, ["SHELF", "BASE", "PEGBAR", "BASKET"], dropPos)
          ctrl_intersectionTester.TestIntersectsWithMany(stage, "PALETTE", ["GONDOLA"], self.$store,
              dropPos)
            .then(result => {
              console.log("[LIBARY ADD] PALETTE", result)
              if (result.intersects == true) {
                self.addNewPalette(result.ID, data.data, result.ContainerPosition);
              }
            })
        }
        break;
        case "BASKET": {
          data.data["Type"] = "BASKET";

          let ctrl_intersectionTester = new IntersectionTester();

          let dropPos = ctrl_intersectionTester.GetTransformedMousePoint(stage);

          console.log("SHELF ADD - STAGE", dropPos);
          // ctrl_intersectionTester.TestIntersectsWithMany(stage, ["SHELF", "BASE", "PEGBAR", "BASKET"], dropPos)
          ctrl_intersectionTester.TestIntersectsWithMany(stage, "BASKET", ["SHELF", "BASE", "PEGBAR", "PEGBOARD",
                "PALETTE"
              ],
              self.$store,
              dropPos)
            .then(result => {
              console.log("[LIBARY ADD] BASKET", result)
              if (result.intersects == true) {
                self.addNewBasket(result.ID, data.data, result.ContainerPosition);
              }
            })

        }
        break;
        case "SHAREBOX": {
          data.data["Type"] = "SHAREBOX";

          let ctrl_intersectionTester = new IntersectionTester();

          let dropPos = ctrl_intersectionTester.GetTransformedMousePoint(stage);

          console.log("SHAREBOX ADD - STAGE", dropPos);
          // ctrl_intersectionTester.TestIntersectsWithMany(stage, ["SHELF", "BASE", "PEGBAR", "BASKET"], dropPos)
          ctrl_intersectionTester.TestIntersectsWithMany(stage, "SHAREBOX", ["SHELF", "BASE"],
              self.$store,
              dropPos)
            .then(result => {
              console.log("[LIBARY ADD] SHAREBOX", result)
              if (result.intersects == true) {
                self.addNewSharebox(result.ID, data.data, result.ContainerPosition);
              }
            })

        }
        break;
        case "PEG": {
          data.data["Type"] = "PEG";

          let ctrl_intersectionTester = new IntersectionTester();

          let dropPos = ctrl_intersectionTester.GetTransformedMousePoint(stage);

          console.log("PEG ADD - STAGE", dropPos);
          ctrl_intersectionTester.TestIntersectsWithMany(stage, "PEG", ["PEGBAR"],
              self.$store,
              dropPos)
            .then(result => {
              console.log("[LIBARY ADD] PEG", result)
              if (result.intersects == true) {
                self.addNewPeg(result.ID, data.data, result.ContainerPosition);
              }
            })

        }
        break;
        case "OBSTRUCTION": {
          //
        }
        break;
        case "SHELF": {
          data.data["Type"] = "SHELF";

          let ctrl_intersectionTester = new IntersectionTester();

          let dropPos = ctrl_intersectionTester.GetTransformedMousePoint(stage);

          console.log("SHELF ADD - STAGE", dropPos);
          ctrl_intersectionTester.TestIntersectsWithMany(stage, "SHELF", ["GONDOLA", "AREA"], dropPos)
            .then(result => {
              console.log("[LIBARY ADD] SHELF", result)
              if (result.intersects == true) {

                self.addNewShelf(result.ID, data.data, result.ContainerPosition);

              }
            })

        }
        break;
        case "BASE": {
          data.data["Type"] = "BASE";

          let ctrl_intersectionTester = new IntersectionTester();

          let dropPos = ctrl_intersectionTester.GetTransformedMousePoint(stage);

          console.log("SHELF ADD - STAGE", dropPos);
          ctrl_intersectionTester.TestIntersectsWithMany(stage, "BASE", ["GONDOLA", "AREA"], dropPos)
            // ctrl_intersectionTester.TestIntersectsWithItem(stage, "BASE", "GONDOLA", dropPos)
            .then(result => {
              console.log("[LIBARY ADD] SHELF", result)
              if (result.intersects == true) {

                let ctrl_store = new StoreHelper();
                let existingBaseItems = ctrl_store.getAllPlanogramItemsByType(this.$store, "BASE", result.ID);

                if (existingBaseItems != undefined && existingBaseItems.length > 0) {
                  alert('This gondola already contains a base, delete the base first and try again.');
                  return;
                }

                // test if a gondola already has a base
                self.addNewBase(result.ID, data.data, result.ContainerPosition);
              }
            })
        }
        break;
        case "PEGBOARD": {
          if (data.data.defaultPegDetails == null) {
            console.error("[PEGBOARD] Pegboar has no default peg assigned");
            // TODO: Call generic error modal
            self.$refs.dialog.openDialog({
              headline: "Pegboard Error!",
              text: "Pegboard has no default peg assigned"
            })
            return;
          }

          data.data["Type"] = "PEGBOARD";

          // add to gondola if intersects
          let ctrl_intersectionTester = new IntersectionTester();

          let dropPos = ctrl_intersectionTester.GetTransformedMousePoint(stage);

          console.log("PEGBOARD ADD - STAGE", dropPos);
          // ctrl_intersectionTester.TestIntersectsWithItem(stage, "PEGBOARD", "GONDOLA", dropPos)
          ctrl_intersectionTester.TestIntersectsWithMany(stage, "PEGBOARD", ["GONDOLA", "AREA"], dropPos)
            .then(result => {
              console.log("[LIBARY ADD] PEGBOARD", result)
              if (result.intersects == true) {
                self.addNewPegboard(result.ID, data.data, result.ContainerPosition);
              }
            })
        }
        break;
        case "PEGBAR": {
          data.data["Type"] = "PEGBAR";

          let ctrl_intersectionTester = new IntersectionTester();

          let dropPos = ctrl_intersectionTester.GetTransformedMousePoint(stage);

          console.log("PEGBAR ADD - STAGE", dropPos);
          ctrl_intersectionTester.TestIntersectsWithMany(stage, "PEGBAR", ["GONDOLA", "AREA"], dropPos)
            // ctrl_intersectionTester.TestIntersectsWithItem(stage, "PEGBAR", "GONDOLA", dropPos)
            .then(result => {
              console.log("[LIBARY ADD] PEGBAR", result)
              if (result.intersects == true) {
                self.addNewPegBar(result.ID, data.data, result.ContainerPosition);
              }
            })
        }
        break;
        }

        stage.draw();
      },
      addCustomLibraryItem(stage, data, ev) {
        let self = this;

        let fileID = data.data.id;

        axios.get(process.env.VUE_APP_API + `SystemFile/JSON/Planogram?db=CR-Devinspire&id=${fileID}&file=config`)
          .then(r => {
            let jsonData = r.data.jsonObject;
            let planodata = jsonData.planogramData;
            let stage = self.$refs.stage.getStage();
            let cFixtureLoader = new CustomFixtureLoader(self.$store, stage, self.MasterLayer, self.$PixelToCmRatio);
            cFixtureLoader.addCustomFixture(planodata);
          })
          .catch(e => {
            alert("Failed to get data. " + e);
          })
      },
      //#endregion

      guid() {
        function s4() {
          return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        return (
          s4() +
          s4() +
          "-" +
          s4() +
          "-" +
          s4() +
          "-" +
          s4() +
          "-" +
          s4() +
          s4() +
          s4()
        );
      }
    }
  };
</script>
<style scoped>
  .canvasOperations {
    width: calc(100% - 10px);
    border: 1px solid black;
  }

  .stage_container {
    padding: 5px;
    overflow-y: hidden;
    overflow-x: hidden;
  }
</style>