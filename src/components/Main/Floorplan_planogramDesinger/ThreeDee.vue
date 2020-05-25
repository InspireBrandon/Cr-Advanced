<template>
  <v-dialog fullscreen v-model="dialog">
    <div>
      <v-toolbar color="primary" dark>
        <v-toolbar-title>Planogram Designer 3D</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="close">
          <v-icon>close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container class="ma-0 pa-0" fluid>
        <v-layout row wrap>
          <v-flex md12>
            <v-card tile class="fill-height">
              <canvas
                v-if="showCanvas"
                style="height: calc(100vh - 65px)!important;"
                id="renderCanvas"
                touch-action="none"
              ></canvas>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </div>
  </v-dialog>
</template>
<script>
import * as BABYLON from "@babylonjs/core/Legacy/legacy";
import Axios from "axios";

import FloorPlanItem from "../FloorPlanning2D/3D/Libs/Models/FloorPlanItem.js";
import DrawingHelper from "../FloorPlanning2D/3D/Libs/Drawing/DrawingHelper.js";

const pxlToMeterRatio = 25;
let scene, camera, sceneObj, canvas, shadowGenerator;

let docClickEvent;

export default {
  data() {
    return {
      dialog: false,
      sceneObj: null,
      drawingHelper: null,
      showCanvas: false
    };
  },
  methods: {
    show(fixtureHeaderID, designerDrops, groupData) {
      let self = this;
      self.dialog = true;
      self.showCanvas = true;

      self.getFixtures(fixtureHeaderID, drops => {
        self.draw(drops, designerDrops, groupData);
      });
    },
    getFloorDimensions(drops) {
      let self = this;

      let topLeft = 0;
      let topRight = 0;
      let bottomLeft = 0;
      let bottomRight = 0;

      drops.forEach(el => {
        if (el.x < topLeft) {
        }
      });
    },
    draw(drops, designerDrops, groupData) {
      let self = this;

      canvas = document.getElementById("renderCanvas");
      let engine = new BABYLON.Engine(canvas, true);
      scene = new BABYLON.Scene(engine);

      self.drawingHelper = new DrawingHelper(scene);

      sceneObj = self.createScene(
        scene,
        engine,
        canvas,
        drops,
        designerDrops,
        groupData
      );

      engine.runRenderLoop(function() {
        sceneObj.render();
      });

      window.addEventListener("resize", function() {
        engine.resize();
      });
    },
    createScene(scene, engine, canvas, drops, designerDrops, groupData) {
      let self = this;
      self.createCamera(scene, canvas, groupData);
      self.createLight(scene);
      self.createFloor(scene, designerDrops, groupData);
      self.createFixtures(scene, drops);
      // self.createSkybox(scene);
      // self.createCans(scene, 0.92);
      // self.createCans(scene, 1.06);
      return scene;
    },
    createCamera(scene, canvas, groupData) {
      let self = this;

      camera = new BABYLON.ArcRotateCamera(
        "Camera",
        degreesToRadians(270),
        degreesToRadians(70),
        4,
        new BABYLON.Vector3((groupData.width + 100) / 100 / 2, 1, -1),
        scene
      );

      camera.attachControl(canvas, true);
      camera.wheelPrecision = 50;
      camera.applyGravity = true;
      camera.checkCollisions = true;
      camera.speed = 0.1;

      // camera.rotation.y = degreesToRadians(190);

      console.log("camera", camera);

      camera.inputs.remove(camera.inputs.attached.keyboard);
      self.addDocumentListeners();

      //   camera.inputs.remove(camera.inputs.attached.keyboard);
      //   self.addDocumentListeners();

      // camera.position.x = 2 / 2;
      // camera.position.z = -4;
      // camera.position.y = 3;
    },
    createLight(scene) {
      let self = this;

      let light = new BABYLON.DirectionalLight(
        "*dir00",
        new BABYLON.Vector3(0, -20, 5),
        scene
      );

      let light2 = new BABYLON.HemisphericLight(
        "light",
        new BABYLON.Vector3(15 / pxlToMeterRatio, 25 / pxlToMeterRatio, 0),
        scene
      );

      light.position = new BABYLON.Vector3(0, 10, 10);
      light.intensity = 1;

      shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
      // shadowGenerator.usePoissonSampling = true;
    },
    createFloor(scene, designerDrops, groupData) {
      let self = this;

      // let firstElement = designerDrops[0];

      // let highestX = firstElement.x + firstElement.width;
      // let highestY = firstElement.y + firstElement.height;
      // let lowestX = firstElement.x;
      // let lowestY = firstElement.y;

      // designerDrops.forEach(dd => {
      //   if((dd.x + dd.width) > highestX)  {
      //     highestX = dd.x;
      //     console.log('highestX', highestX)
      //   }

      //   if(dd.x < lowestX)
      //     lowestX = dd.x;

      //   if(dd.y + dd.height > highestY) {
      //     highestY = dd.y;

      //     if(highestY == 0) {
      //       highestY = dd.y + dd.height;
      //     }
      //   }

      //   if(dd.y > lowestY)
      //     lowestY = dd.y;
      // });

      // highestX = highestX / 100;
      // highestY = highestY / 100;

      // if(highestX < 0)
      //   highestX = highestX * -1;

      // if(highestY < 0)
      //   highestY = highestX * -1;

      // if(lowestX < 0)
      //   lowestX = lowestX * -1;

      // if(lowestY < 0)
      //   lowestY = lowestY * -1;

      // let width = highestX - lowestX;
      // let height = highestY - lowestY;

      // console.log("dims", width, height)

      let height = (groupData.height + 100) / 100;
      let width = (groupData.width + 100) / 100;

      let myScale = 3;
      let myScale2 = 3;

      var myTexture = new BABYLON.Texture("tile.jpg", scene);
      myTexture.uScale = myScale;
      myTexture.vScale = myScale2;
      var myMaterial = new BABYLON.StandardMaterial("myMaterial", scene);
      myMaterial.diffuseTexture = new BABYLON.Texture("tile.jpg", scene);

      // Parameters
      var xmin = (width / 2) * -1;
      var zmin = (height / 2) * -1;
      var xmax = width / 2;
      var zmax = height / 2;

      var precision = {
        w: 2,
        h: 2
      };

      var subdivisions = {
        h: width / (width / 2),
        w: height / (height / 2)
      };

      var myGround = BABYLON.MeshBuilder.CreateTiledGround(
        "ground",
        {
          xmin: xmin,
          xmax: xmax,
          zmin: zmin,
          zmax: zmax,
          precision: precision,
          subdivisions: subdivisions
        },
        scene,
        false
      );

      myGround.material = myMaterial;
      myGround.material.shadowColor = BABYLON.Color3.Red();

      myGround.position.x = width / 2;
      myGround.position.z = (height * -1) / 2;

      myGround.receiveShadows = true;
      myGround.checkCollisions = true;
    },
    createSkybox(scene) {
      let self = this;

      let skybox = BABYLON.MeshBuilder.CreateBox(
        "skyBox",
        {
          size: 1000.0
        },
        scene
      );
      let skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
      skyboxMaterial.backFaceCulling = false;
      skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(
        "skybox",
        scene
      );
      skyboxMaterial.reflectionTexture.coordinatesMode =
        BABYLON.Texture.SKYBOX_MODE;
      skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
      skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
      skybox.material = skyboxMaterial;
    },
    createFixtures(scene, drops) {
      let self = this;

      let closestX = 0;
      let furthestX = 0;

      let closestY = 0;
      let furthestY = 0;

      let notProducts = drops.filter(child => {
        return child.type != "PRODUCT" && child.name != null;
      });

      let gondolas = notProducts.filter(child => {
        return (
          child.type == "GONDOLA" ||
          (child.type == "OBSTRUCTION" && child.name != null)
        );
      });

      gondolas.forEach(drop => {
        self.getPlanogramItem(drop.id, positionData => {
          let fpI = new FloorPlanItem(drop, null);

          if (positionData != null) {
            let attributes = JSON.parse(positionData.attributes);
            fpI.x = attributes.x;
            fpI.y = attributes.y;
            fpI.rotation = attributes.rotation;
          } else {
            // fpI.x = 0;
            fpI.y = -1;
          }

          self.drawingHelper.draw(fpI, shadowGenerator, notProducts);
        });
      });

      let pointX = (furthestX - closestX) / 100;
      let pointY = (furthestY - closestY) / 100;
      // camera.setTarget(new BABYLON.Vector3(pointX, 0, pointY));

      // drops.forEach(drop => {
      //     self.getFloorPlanItem(drop.attrs.DropID, children => {
      //         let notProducts = children.filter(child => {
      //             return child.type != "PRODUCT";
      //         })

      //         let parent = notProducts.find(child => {
      //             return child.id == drop.attrs.DropID;
      //         });

      //         notProducts.forEach(child => {
      //             let fpI = new FloorPlanItem(child, parent);

      //             if (fpI.x < closestX)
      //                 closestX = fpI.x;

      //             if ((fpI.x + fpI.width) > furthestX)
      //                 furthestX = +fpI.width;

      //             if (fpI.y < closestY)
      //                 closestY = fpI.y;

      //             if ((fpI.y + fpI.height) > furthestY)
      //                 furthestY = +fpI.height;

      //             // self.getFixture(child.spaceplan_Fixture_ID, () => {

      //             // })

      //             self.drawingHelper.draw(fpI);
      //         })

      //         let pointX = ((furthestX) - (closestX));
      //         let pointY = ((furthestY) - (closestY));

      //         console.log("pointyPoints", pointX, pointY)

      //         camera.setTarget(new BABYLON.Vector3(pointX, 0, pointY));
      //     })
      // });
    },
    getFloorPlanItem(dropID, callback) {
      let self = this;

      Axios.get(
        process.env.VUE_APP_API +
          `FloorPlan_Fixtures/GetChildren?parentID=${dropID}`
      )
        .then(r => {
          callback(r.data);
        })
        .catch(e => {
          console.log(e);
          alert("Failed to get floorplan fixture data");
        });
    },
    getFixture(fixtureID, callback) {
      let self = this;

      Axios.get(
        process.env.VUE_APP_API + `Fixture?db=CR-DEVINSPIRE&id=${fixtureID}`
      )
        .then(r => {})
        .catch(e => {
          console.log("Failed to get fixture");
        });
    },
    getFixtures(fixtureHeaderID, callback) {
      let self = this;

      Axios.get(
        process.env.VUE_APP_API +
          `FloorPlan_Fixtures/GetFixtureByHeaderID?fixtureHeaderID=${fixtureHeaderID}`
      )
        .then(r => {
          console.log("get fixtures", r.data);
          callback(r.data);
        })
        .catch(e => {
          console.log(e);
        });
    },
    addDocumentListeners() {
      let self = this;

      document.removeEventListener("keydown", e => {
        manageCamera(e.code);
      });

      document.addEventListener("keydown", e => {
        manageCamera(e.code);
      });
    },
    getPlanogramItem(fixtureID, callback) {
      let self = this;

      Axios.defaults.headers.common["TenantID"] =
        sessionStorage.currentDatabase;

      Axios.get(
        process.env.VUE_APP_API +
          `FloorplanPlanogramItem?floorplanFixtureId=${fixtureID}`
      ).then(r => {
        console.log(r.data);
        callback(r.data);
      });
    },
    close() {
      let self = this;
      document.removeEventListener("keydown", e => {
        manageCamera(e.code);
      });
      sceneObj.dispose();
      self.showCanvas = false;
      self.dialog = false;
    }
  }
};

function manageCamera(key) {
  let stepDistance = 0.25;
  let rotationDistance = 10;

  let currentX = camera.position.x;
  let currentY = camera.position.y;
  let currentZ = camera.position.z;

  switch (key) {
    case "ArrowLeft":
      {
        camera.alpha -= degreesToRadians(rotationDistance);
      }
      break;
    case "ArrowRight":
      {
        camera.alpha += degreesToRadians(rotationDistance);
      }
      break;
    case "ArrowUp":
      {
        let nextPos = camera.getFrontPosition(stepDistance);
        nextPos.y = currentY;
        camera.position = BABYLON.Vector3.Lerp(
          camera.position,
          nextPos,
          stepDistance
        );
      }
      break;
    case "ArrowDown":
      {
        let nextPos = camera.getFrontPosition(-stepDistance);
        nextPos.y = currentY;
        camera.position = BABYLON.Vector3.Lerp(
          camera.position,
          nextPos,
          stepDistance
        );
      }
      break;
    case "PageUp":
      {
        camera.position.y += stepDistance;
      }
      break;
    case "PageDown":
      {
        camera.position.y -= stepDistance;
      }
      break;
    case "KeyA":
      {
        camera.rotation.y -= degreesToRadians(rotationDistance);
      }
      break;
    case "KeyD":
      {
        camera.rotation.y += degreesToRadians(rotationDistance);
      }
      break;
    case "KeyW":
      {
        camera.rotation.x += degreesToRadians(rotationDistance);
      }
      break;
    case "KeyS":
      {
        camera.rotation.x -= degreesToRadians(rotationDistance);
      }
      break;
  }
}

function degreesToRadians(degrees) {
  if (degrees != 0) return degrees / 57.2958;
  else return 0;
}
</script>

<style>
#renderCanvas {
  height: calc(100vh - 65px);
}
</style>