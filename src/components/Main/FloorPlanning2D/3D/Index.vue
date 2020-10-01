<template>
    <v-dialog v-model="dialog" persistent fullscreen style="overflow-y: hidden!important;">
        <v-card dark>
            <v-toolbar dark color="primary">
                <div>3D Floor Plan</div>
                <v-spacer></v-spacer>
                <v-btn @click="close">close</v-btn>
            </v-toolbar>
            <div style="position: fixed; right: 0px; padding-right: 20px; padding-top: 20px;">
                <v-btn small @click="toggleFullScreen">
                    <v-icon v-if="fullScreen">fullscreen_exit</v-icon>
                    <v-icon v-if="!fullScreen">fullscreen</v-icon>
                </v-btn>
            </div>
            <div
                style="position: fixed; bottom: 0px; right: 0px; text-align: center; padding-right: 20px; padding-bottom: 20px;">
                <div>
                    <v-btn small @click="manageCamera('PageUp')">
                        <v-icon>expand_less</v-icon>
                    </v-btn>
                </div>
                <div style="margin-bottom: 20px;">
                    <v-btn small @click="manageCamera('PageDown')">
                        <v-icon>expand_more</v-icon>
                    </v-btn>
                </div>
                <div>
                    <v-btn small @click="manageCamera('ArrowUp')">
                        <v-icon>arrow_upward</v-icon>
                    </v-btn>
                </div>
                <div>
                    <v-btn small @click="manageCamera('ArrowLeft')">
                        <v-icon>arrow_back</v-icon>
                    </v-btn>
                    <v-btn small @click="manageCamera('ArrowRight')">
                        <v-icon>arrow_forward</v-icon>
                    </v-btn>
                </div>
                <div>
                    <v-btn small @click="manageCamera('ArrowDown')">
                        <v-icon>arrow_downward</v-icon>
                    </v-btn>
                </div>
            </div>
            <canvas v-if="showCanvas" id="renderCanvas" touch-action="none"></canvas>
        </v-card>
    </v-dialog>
</template>

<script>
    import SceneLib from "@/components/Main/FloorPlanning/BaseLibs/Scene/Scene.js";
    import PaneLib from "@/components/Main/FloorPlanning/BaseLibs/Scene/Playground/pane.js";
    import BoxLib from "@/components/Main/FloorPlanning/BaseLibs/Scene/Playground/product.js";
    import PlanogramLib from "@/components/Main/FloorPlanning/BaseLibs/Planogram/Planogram.js";
    import * as BABYLON from "@babylonjs/core/Legacy/legacy";

    import FloorPlanItem from "./Libs/Models/FloorPlanItem.js";
    import DrawingHelper from "./Libs/Drawing/DrawingHelper.js";

    import Shelf from './Libs/Drawing/Shelf.js'

    import {
        Vector3
    } from "@babylonjs/core/Legacy/legacy";

    import Axios from "axios";
    const pxlToMeterRatio = 25;

    let scene, camera, sceneObj, canvas, shadowGenerator;
    let gondolaIDX = 0;

    export default {
        data() {
            return {
                drawingHelper: null,
                dialog: false,
                sceneObj: null,
                paneObj: null,
                boxObj: null,
                selectedCamera: null,
                startingPoint: null,
                currentMesh: null,
                cameraType: "free",
                showCanvas: false,
                fullScreen: false,
                fancyMode: false,
                header: null
            };
        },
        mounted() {
            let self = this;

            document.removeEventListener("keydown", e => {
                self.manageCamera(e.code);
            });
        },
        methods: {
            show(id) {
                let self = this;
                self.dialog = true;
                self.showCanvas = true;

                document.removeEventListener("keydown", e => {
                    self.manageCamera(e.code);
                });

                setTimeout(() => {
                    self.getHeader(id, header => {
                        self.header = header;

                        self.getItemsToDraw(id, items => {
                            self.draw(items);
                        });
                    })
                }, 500);
            },
            draw(items) {
                let self = this;

                canvas = document.getElementById("renderCanvas"); // Get the canvas element
                var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

                /******* Add the create scene function ******/
                var createScene = function () {
                    // Create the scene space
                    scene = new BABYLON.Scene(engine);

                    self.drawingHelper = new DrawingHelper(scene);

                    camera = new BABYLON.FreeCamera(
                        "FreeCamera",
                        new BABYLON.Vector3(0, 2, 50),
                        scene
                    );

                    camera.attachControl(canvas, true);
                    camera.wheelPrecision = 50;
                    camera.applyGravity = true;
                    camera.checkCollisions = true;
                    camera.speed = 0.1;

                    if (self.fancyMode) {

                    } else {
                        camera.inputs.remove(camera.inputs.attached.keyboard);
                        self.addDocumentListeners();
                    }

                    camera.position.x = 30 / 2;
                    camera.position.z = -15;
                    camera.position.y = 1.5;

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

                    shadowGenerator = new BABYLON.ShadowGenerator(1024, light);

                    let myScale = 2;
                    let myScale2 = 2;

                    var myTexture = new BABYLON.Texture("tile.jpg", scene);
                    myTexture.uScale = myScale;
                    myTexture.vScale = myScale2;
                    var myMaterial = new BABYLON.StandardMaterial("myMaterial", scene);
                    myMaterial.diffuseTexture = new BABYLON.Texture("tile.jpg", scene);

                    // Parameters
                    var xmin = (self.header.width / 2) * -1;
                    var zmin = (self.header.height / 2) * -1;
                    var xmax = (self.header.width / 2);
                    var zmax = (self.header.height / 2);

                    var precision = {
                        w: 2,
                        h: 2
                    };

                    var subdivisions = {
                        h: 500 / (self.header.width / 2),
                        w: 500 / (self.header.height / 2)
                    };

                    var myGround = BABYLON.MeshBuilder.CreateTiledGround(
                        "ground", {
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

                    myGround.position.x = self.header.width / 2;
                    myGround.position.z = (self.header.height * -1) / 2;

                    myGround.receiveShadows = true;
                    myGround.checkCollisions = true;

                    items.forEach((element, idx) => {
                        if (element.name == "Gondola-Rect" && element.color == null) {
                            self.buildFixture(scene, element);
                            // self.buildShelf(scene, element);
                        }

                        if (element.name == "Gondola-Rect" && element.color != null) {
                            self.buildWall(scene, element, false);
                        }

                        if (element.name == "wall") {
                            self.buildWall(scene, element, element.id == 10630);
                        }

                        if (element.name == "circle") {
                            self.buildCircle(scene, element, element.id == 10630);
                        }
                    });

                    return scene;
                };

                sceneObj = createScene();

                engine.runRenderLoop(function () {
                    sceneObj.render();
                });

                // Watch for browser/canvas resize events
                window.addEventListener("resize", function () {
                    engine.resize();
                });
            },
            getItemsToDraw(id, callback) {
                let self = this;

                Axios.defaults.headers.common["TenantID"] =
                    sessionStorage.currentDatabase;

                Axios.get(
                    process.env.VUE_APP_API + `FloorplanItems/3D?headerID=${id}`
                ).then(r => {
                    callback(r.data);
                });
            },
            getHeader(id, callback) {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(
                    process.env.VUE_APP_API + `FloorplanFixtureHeader?floorPlanHeaderID=${id}`
                ).then(r => {
                    console.log("Header", r.data)
                    callback(r.data);
                });
            },
            buildWall(scene, element, isWindow) {
                let self = this;

                var material = new BABYLON.StandardMaterial("material", scene);

                let image = "wall-white.jpg";

                if (isWindow) {
                    image = "wall-white-window.png";
                }

                material.diffuseTexture = new BABYLON.Texture(image, scene);
                material.diffuseTexture.hasAlpha = true;

                var box = BABYLON.MeshBuilder.CreateBox(
                    "box", {
                        height: element.depth / pxlToMeterRatio,
                        width: element.width / pxlToMeterRatio,
                        depth: element.height / pxlToMeterRatio
                    },
                    scene
                );

                box.position.x = (element.x + 0.5 * element.width) / pxlToMeterRatio;
                box.position.z = -(
                    (element.y + 0.5 * (element.height / 10)) /
                    pxlToMeterRatio
                );
                box.position.y = element.depth / pxlToMeterRatio / 2;

                // add rotation
                let xPivot = -(element.width / 2 / pxlToMeterRatio);
                let zPivot = element.height / 2 / pxlToMeterRatio;

                box.setPivotPoint(new BABYLON.Vector3(xPivot, 0, zPivot));
                box.rotation.y = degreesToRadians(element.rotation);
                box.material = material;
            },
            buildShelf(scene, element) {
                let self = this;

                let img = "http://160.119.254.66:8807/api/FixtureImage?db=CR-DEVINSPIRE&fixtureImageID=507";

                if (gondolaIDX == 1) {
                    img = "http://160.119.254.66:8807/api/FixtureImage?db=CR-DEVINSPIRE&fixtureImageID=507";
                }

                if (gondolaIDX == 2) {
                    img = "http://160.119.254.66:8807/api/FixtureImage?db=CR-DEVINSPIRE&fixtureImageID=507";
                }

                if (gondolaIDX == 3) {
                    img = "http://160.119.254.66:8807/api/FixtureImage?db=CR-DEVINSPIRE&fixtureImageID=507";
                }

                if (gondolaIDX == 4) {
                    img = "http://160.119.254.66:8807/api/FixtureImage?db=CR-DEVINSPIRE&fixtureImageID=507";
                }

                if (gondolaIDX == 5) {
                    img = "http://160.119.254.66:8807/api/FixtureImage?db=CR-DEVINSPIRE&fixtureImageID=507";
                }

                if (gondolaIDX == 6) {
                    img = "http://160.119.254.66:8807/api/FixtureImage?db=CR-DEVINSPIRE&fixtureImageID=507";
                    gondolaIDX = 0;
                }

                var paneMat = new BABYLON.StandardMaterial("material", scene);
                // paneMat.diffuseTexture = new BABYLON.Texture(process.env.VUE_APP_API + `FloorplanFixture?mapImageID=${element.fixture_ID}&type=front`, scene);
                paneMat.diffuseTexture = new BABYLON.Texture(img, scene);
                paneMat.diffuseTexture.hasAlpha = true;

                var material = new BABYLON.StandardMaterial("material", scene);
                material.diffuseTexture = new BABYLON.Texture("wood.jpg", scene);

                var columns = 1; // 6 columns
                var rows = 1; // 4 rows

                var faceUV = new Array(6);

                for (var i = 0; i < 6; i++) {
                    faceUV[i] = new BABYLON.Vector4(0, 0, 0, 0);
                }

                faceUV[0] = new BABYLON.Vector4(3 / columns, 0, (3 + 1) / columns, 1 / rows);

                var pane = BABYLON.MeshBuilder.CreateBox(
                    "box", {
                        height: element.depth / pxlToMeterRatio,
                        width: element.width / pxlToMeterRatio,
                        // depth: 0.05
                        depth: element.height / pxlToMeterRatio,
                        faceUV: faceUV,
                        wrap: true
                    },
                    scene
                );

                var mat = new BABYLON.StandardMaterial("mat", scene);
                var texture = new BABYLON.Texture(img, scene);
                mat.diffuseTexture = texture;
                mat.diffuseTexture.hasAlpha = true;

                pane.position.x = (element.x + 0.5 * element.width) / pxlToMeterRatio;
                pane.position.z = -((element.y + 0.5 * element.height) / pxlToMeterRatio);
                pane.position.y = element.depth / pxlToMeterRatio / 2;

                let xPivot = -(element.width / 2 / pxlToMeterRatio);
                let zPivot = element.height / 2 / pxlToMeterRatio;

                pane.setPivotPoint(new BABYLON.Vector3(xPivot, 0, zPivot));
                pane.rotation.y = degreesToRadians(element.rotation);

                pane.material = mat;

                gondolaIDX++;
            },
            buildFixture(scene, element) {
                let self = this;

                if (element.fixture_ID != 0) {
                    self.getFixture(element.fixture_ID, fixtureData => {
                        let tmpDims = {
                            height: fixtureData.depth,
                            width: fixtureData.width,
                            depth: fixtureData.height,
                        }

                        fixtureData.height = tmpDims.height;
                        fixtureData.width = tmpDims.width;
                        fixtureData.depth = tmpDims.depth;

                        let fpI = new FloorPlanItem(fixtureData, null);
                        fpI.type = 'OBSTRUCTION';

                        let fixture = self.drawingHelper.draw(fpI, shadowGenerator, []);
                        fixture.element.position.x = (element.x + 0.5 * element.width) / pxlToMeterRatio;
                        fixture.element.position.z = -((element.y + 0.5 * element.height) / pxlToMeterRatio);
                        fixture.element.position.y = element.depth / pxlToMeterRatio / 2;

                        let xPivot = -(element.width / 2 / pxlToMeterRatio);
                        let zPivot = element.height / 2 / pxlToMeterRatio;

                        fixture.element.setPivotPoint(new BABYLON.Vector3(xPivot, 0, zPivot));
                        fixture.element.rotation.y = degreesToRadians(element.rotation);
                    })
                } else {
                    if (element.floorplan_Fixture_ID == "000") {
                        self.getFloorplanFixture(element.floorplan_Fixture_ID, fixtureData => {

                            self.getFloorplanFixtures(fixtureData.floorplan_Fixture_Header_ID, drops => {
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
                            })

                            // let fpI = new FloorPlanItem(fixtureData, null);

                            // let scaleFactor = 1.333;

                            // fpI.height = scaleFactor * fpI.height;
                            // fpI.width = scaleFactor * fpI.width;
                            // fpI.depth = scaleFactor * fpI.depth;

                            // let fixture = self.drawingHelper.draw(fpI, shadowGenerator, []);
                            // fixture.element.position.x = (element.x + 0.5 * (element.width / scaleFactor)) /
                            //     pxlToMeterRatio;
                            // fixture.element.position.z = -((element.y + 0.5 * (element.height / scaleFactor)) /
                            //     pxlToMeterRatio);
                            // // fixture.element.position.y = (element.depth / scaleFactor) / pxlToMeterRatio / 2;

                            // let xPivot = -(element.width / 2 / pxlToMeterRatio);
                            // let zPivot = element.height / 2 / pxlToMeterRatio;

                            // fixture.element.setPivotPoint(new BABYLON.Vector3(xPivot, 0, zPivot));
                            // fixture.element.rotation.y = degreesToRadians(element.rotation);
                        })
                    } else {
                        self.getFloorplanFixture(element.floorplan_Fixture_ID, fixtureData => {
                            let fpI = new FloorPlanItem(fixtureData, null);

                            let scaleFactor = 1.333;

                            fpI.height = scaleFactor * fpI.height;
                            fpI.width = scaleFactor * fpI.width;
                            fpI.depth = scaleFactor * fpI.depth;

                            let fixture = self.drawingHelper.draw(fpI, shadowGenerator, []);
                            fixture.element.position.x = (element.x + 0.5 * (element.width / scaleFactor)) /
                                pxlToMeterRatio;
                            fixture.element.position.z = -((element.y + 0.5 * (element.height / scaleFactor)) /
                                pxlToMeterRatio);
                            // fixture.element.position.y = (element.depth / scaleFactor) / pxlToMeterRatio / 2;

                            let xPivot = -(element.width / 2 / pxlToMeterRatio);
                            let zPivot = element.height / 2 / pxlToMeterRatio;

                            fixture.element.setPivotPoint(new BABYLON.Vector3(xPivot, 0, zPivot));
                            fixture.element.rotation.y = degreesToRadians(element.rotation);
                        })
                    }
                }
            },
            getPlanogramItem(fixtureID, callback) {
                let self = this;

                Axios.defaults.headers.common["TenantID"] =
                    sessionStorage.currentDatabase;

                Axios.get(
                    process.env.VUE_APP_API +
                    `FloorplanPlanogramItem?floorplanFixtureId=${fixtureID}`
                ).then(r => {
                    callback(r.data);
                });
            },
            getFixture(fixture_ID, callback) {
                let self = this;

                Axios.get(process.env.VUE_APP_API + `Fixture/${fixture_ID}?db=CR-DEVINSPIRE`).then(r => {
                    callback(r.data);
                });
            },
            getFloorplanFixture(fixtureID, callback) {
                let self = this;

                Axios.get(
                        process.env.VUE_APP_API + `FloorPlan_Fixtures?fixtureID=${fixtureID}`
                    )
                    .then(r => {
                        callback(r.data);
                    })
                    .catch(e => {
                        console.log(e);
                    });
            },
            getFloorplanFixtures(fixtureHeaderID, callback) {
                let self = this;

                Axios.get(
                        process.env.VUE_APP_API +
                        `FloorPlan_Fixtures/GetFixtureByHeaderID?fixtureHeaderID=${fixtureHeaderID}`
                    )
                    .then(r => {
                        callback(r.data);
                    })
                    .catch(e => {
                        console.log(e);
                    });
            },
            switchCameraType() {
                let self = this;

                if (self.cameraType == "free") {} else {
                    var camera = new BABYLON.FreeCamera(
                        "FreeCamera",
                        new BABYLON.Vector3(0, 1, -15),
                        scene
                    );
                    scene.activeCamera = camera;
                    scene.activeCamera.attachControl(canvas);

                    //camera.position.x = ;
                    //camera.position.x = (50 / 2);
                    //camera.position.z = (30 / 2);
                    camera.position.x = 50 / 2;
                    camera.position.z = -30;
                    camera.position.y = 20;
                    camera.rotation.x = degreesToRadians(45);
                }
            },
            close() {
                let self = this;
                document.removeEventListener("keydown", e => {
                    self.manageCamera(e.code);
                });
                sceneObj.dispose();
                self.showCanvas = false;
                self.dialog = false;
            },
            toggleFullScreen() {
                let self = this;

                if (self.fullScreen) {
                    closeFullscreen();
                    self.fullScreen = false;
                } else {
                    openFullscreen();
                    self.fullScreen = true;
                }
            },
            manageCamera(key) {
                let stepDistance = 0.5;
                let rotationDistance = 5;

                let currentX = camera.position.x;
                let currentY = camera.position.y;
                let currentZ = camera.position.z;

                switch (key) {
                    case "ArrowLeft": {
                        camera.rotation.y = camera.rotation.y + degreesToRadians(270);
                        let nextPos = camera.getFrontPosition(1);
                        nextPos.y = currentY;
                        camera.position = BABYLON.Vector3.Lerp(camera.position, nextPos, 1);
                        camera.rotation.y = camera.rotation.y - degreesToRadians(270);
                    }
                    break;
                case "ArrowRight": {
                    camera.rotation.y = camera.rotation.y + degreesToRadians(90);
                    let nextPos = camera.getFrontPosition(1);
                    nextPos.y = currentY;
                    camera.position = BABYLON.Vector3.Lerp(camera.position, nextPos, 1);
                    camera.rotation.y = camera.rotation.y - degreesToRadians(90);
                }
                break;
                case "ArrowUp": {
                    let nextPos = camera.getFrontPosition(1);
                    nextPos.y = currentY;
                    camera.position = BABYLON.Vector3.Lerp(camera.position, nextPos, 1);
                }
                break;
                case "ArrowDown": {
                    let nextPos = camera.getFrontPosition(-1);
                    nextPos.y = currentY;
                    camera.position = BABYLON.Vector3.Lerp(camera.position, nextPos, 1);
                }
                break;
                case "PageUp": {
                    camera.position.y += stepDistance;
                }
                break;
                case "PageDown": {
                    camera.position.y -= stepDistance;
                }
                break;
                case "KeyA": {
                    camera.rotation.y -= degreesToRadians(rotationDistance);
                }
                break;
                case "KeyD": {
                    camera.rotation.y += degreesToRadians(rotationDistance);
                }
                break;
                case "KeyW": {
                    camera.rotation.x += degreesToRadians(rotationDistance);
                }
                break;
                case "KeyS": {
                    camera.rotation.x -= degreesToRadians(rotationDistance);
                }
                break;
                }
            },
            addDocumentListeners() {
                let self = this;

                document.addEventListener("keydown", e => {
                    self.manageCamera(e.code);
                });
            },
            buildCircle(scene, element) {
                let self = this;

                console.log(element)

                var material = new BABYLON.StandardMaterial("material", scene);

                let image = "wire.png";

                material.diffuseTexture = new BABYLON.Texture(image, scene);
                material.diffuseTexture.hasAlpha = true;

                var box = BABYLON.MeshBuilder.CreateCylinder(
                    "box", {
                        diameterTop: element.radius / pxlToMeterRatio,
                        diameterBottom: element.radius / pxlToMeterRatio,
                        // radius: element.radius / pxlToMeterRatio,
                        height: element.height / pxlToMeterRatio,
                        tessellation: 0
                    },
                    scene
                );

                box.position.x = (element.x + 0.5 * element.width) / pxlToMeterRatio;
                box.position.z = -(
                    (element.y + 0.5 * (element.height / 10)) /
                    pxlToMeterRatio
                );
                box.position.y = element.depth / pxlToMeterRatio / 2;

                // add rotation
                let xPivot = -(element.width / 2 / pxlToMeterRatio);
                let zPivot = element.height / 2 / pxlToMeterRatio;

                box.setPivotPoint(new BABYLON.Vector3(xPivot, 0, zPivot));
                box.rotation.y = degreesToRadians(element.rotation);
                box.material = material;
            },
            buildAlt(scene, data) {
                let config = {
                    scene: scene,
                    data: data,
                    name: 'SHELF'
                }

                let shelf = new Shelf(config);
                shelf.draw();
            }
        }
    };

    function degreesToRadians(degrees) {
        if (degrees != 0) return degrees / 57.2958;
        else return 0;
    }

    function radiansToDegrees(radians) {
        if (radians != 0) return radians * 57.2958;
        else return 0;
    }

    var elem = document.documentElement;

    function openFullscreen() {
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) {
            /* Firefox */
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) {
            /* Chrome, Safari and Opera */
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
            /* IE/Edge */
            elem.msRequestFullscreen();
        }
    }

    function closeFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            /* Firefox */
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            /* Chrome, Safari and Opera */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            /* IE/Edge */
            document.msExitFullscreen();
        }
    }

    function translate(params) {
        return {
            height: params.depth,
            width: params.width,
            depth: params.height,
            x: params.x,
            y: params.y
        };
    }
</script>

<style scoped>
    #renderCanvas {
        height: calc(100vh - 70px);
        overflow: hidden;
    }
</style>