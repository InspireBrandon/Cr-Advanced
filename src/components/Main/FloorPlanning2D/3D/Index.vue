<template>
    <v-dialog v-model="dialog" persistent fullscreen style="overflow-y: hidden!important;">
        <v-card dark>
            <v-toolbar dark color="primary">
                <div>3D Floor Plan</div>
                <v-spacer></v-spacer>
                <v-btn @click="close">close</v-btn>
            </v-toolbar>
            <canvas v-if="showCanvas" id="renderCanvas" touch-action="none"></canvas>
        </v-card>
    </v-dialog>
</template>

<script>
    import SceneLib from "@/components/Main/FloorPlanning/BaseLibs/Scene/Scene.js";
    import PaneLib from "@/components/Main/FloorPlanning/BaseLibs/Scene/Playground/pane.js";
    import BoxLib from "@/components/Main/FloorPlanning/BaseLibs/Scene/Playground/product.js";
    import PlanogramLib from "@/components/Main/FloorPlanning/BaseLibs/Planogram/Planogram.js";
    import * as BABYLON from '@babylonjs/core/Legacy/legacy';
    import {
        Vector3
    } from '@babylonjs/core/Legacy/legacy';

    import Axios from 'axios'
    const pxlToMeterRatio = 25;

    let scene, canvas;
    let gondolaIDX = 1;

    export default {
        data() {
            return {
                dialog: false,
                sceneObj: null,
                paneObj: null,
                boxObj: null,
                selectedCamera: null,
                startingPoint: null,
                currentMesh: null,
                cameraType: 'free',
                showCanvas: false
            }
        },
        mounted() {
            let self = this;
        },
        methods: {
            show(id) {
                let self = this;
                self.dialog = true;
                self.showCanvas = true;

                setTimeout(() => {
                    self.getItemsToDraw(id, items => {
                        self.draw(items);
                    })
                }, 500)
            },
            draw(items) {
                let self = this;

                canvas = document.getElementById("renderCanvas"); // Get the canvas element 
                var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

                /******* Add the create scene function ******/
                var createScene = function () {

                    // Create the scene space
                    scene = new BABYLON.Scene(engine);

                    let camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(0, 5, 50), scene);
                    camera.attachControl(canvas, true);
                    camera.wheelPrecision = 50;
                    camera.applyGravity = true;
                    camera.checkCollisions = true;
                    camera.speed = 0.3;

                    // Add a camera to the scene and attach it to the canvas
                    // var camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(0, 1, -15), scene);
                    // scene.activeCamera = camera;
                    // scene.activeCamera.attachControl(canvas);

                    //camera.position.x = ;
                    //camera.position.x = (50 / 2);
                    //camera.position.z = (30 / 2);
                    camera.position.x = 50 / 2;
                    camera.position.z = -10;
                    camera.position.y = 5;
                    camera.rotation.x = degreesToRadians(45)


                    // Add lights to the scene
                    // var light1 = new BABYLON.DirectionalLight('light', new BABYLON.Vector3(1, 1, 0), scene)
                    var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3((15 / pxlToMeterRatio),
                        (25 / pxlToMeterRatio), 0), scene);
                    //var light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 1, -1), scene);

                    // var shadowGenerator = new BABYLON.ShadowGenerator(1024, light2);

                    let myScale = 2;
                    let myScale2 = 2;


                    var myTexture = new BABYLON.Texture("tile.jpg", scene);
                    myTexture.uScale = myScale;
                    myTexture.vScale = myScale2;
                    var myMaterial = new BABYLON.StandardMaterial("myMaterial", scene);
                    myMaterial.diffuseTexture = new BABYLON.Texture("tile.jpg", scene);

                    // Parameters
                    var xmin = -25;
                    var zmin = -15;
                    var xmax = 25;
                    var zmax = 15;

                    var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {
                        size: 1000.0
                    }, scene);
                    var skyboxMaterial = new BABYLON.StandardMaterial("skybox.png", scene);
                    skyboxMaterial.backFaceCulling = false;
                    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("skybox.png", scene);
                    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
                    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
                    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
                    skybox.material = skyboxMaterial;

                    var precision = {
                        "w": 2,
                        "h": 2
                    };

                    var subdivisions = {
                        'h': (500 / 50),
                        'w': (500 / 30)
                    };

                    var myGround = BABYLON.MeshBuilder.CreateTiledGround("ground", {
                        xmin: xmin,
                        xmax: xmax,
                        zmin: zmin,
                        zmax: zmax,
                        precision: precision,
                        subdivisions: subdivisions
                    }, scene, false);

                    myGround.material = myMaterial;
                    myGround.material.shadowColor = BABYLON.Color3.Red();

                    myGround.position.x = (50 / 2);
                    myGround.position.z = (-30 / 2);

                    myGround.receiveShadows = true;
                    myGround.checkCollisions = true;

                    items.forEach((element, idx) => {
                        if (element.name == "Gondola-Rect" && element.color == null) {
                            self.buildShelf(scene, element, idx);
                        }

                        if (element.name == "Gondola-Rect" && element.color != null) {
                            self.buildWall(scene, element, false);
                        }

                        if (element.name == "wall") {
                            console.log(element.id)
                            self.buildWall(scene, element, element.id == 10630);
                        }
                    });

                    return scene;
                };
                /******* End of the create scene function ******/

                var scene = createScene(); //Call the createScene function

                // Register a render loop to repeatedly render the scene
                engine.runRenderLoop(function () {
                    scene.render();
                });

                // Watch for browser/canvas resize events
                window.addEventListener("resize", function () {
                    engine.resize();
                });
            },
            getItemsToDraw(id, callback) {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + `FloorplanItems/3D?headerID=${id}`)
                    .then(r => {
                        callback(r.data);
                    })
            },
            buildWall(scene, element, isWindow) {
                let self = this;

                var material = new BABYLON.StandardMaterial("material", scene);

                let image = "wall-white.jpg";

                if(isWindow) {
                    image = "wall-white-window.png";
                }

                material.diffuseTexture = new BABYLON.Texture(image, scene);
                material.diffuseTexture.hasAlpha = true;

                var box = BABYLON.MeshBuilder.CreateBox("box", {
                    height: element.depth / pxlToMeterRatio,
                    width: element.width / pxlToMeterRatio,
                    depth: element.height / pxlToMeterRatio
                }, scene);

                box.position.x = ((element.x + (0.5 * element.width)) / pxlToMeterRatio);
                box.position.z = -((element.y + (0.5 * (element.height / 10))) /
                    pxlToMeterRatio);
                box.position.y = (element.depth / pxlToMeterRatio) / 2;

                // add rotation
                let xPivot = -((element.width / 2) / pxlToMeterRatio);
                let zPivot = ((element.height / 2) / pxlToMeterRatio);

                box.setPivotPoint(new BABYLON.Vector3(xPivot, 0, zPivot));
                box.rotation.y = degreesToRadians(element.rotation)
                box.material = material;
            },
            buildShelf(scene, element) {
                let self = this;

                let img = "aas1.png"

                if (gondolaIDX % 2 == 0) {
                    img = "aas2.png"
                }

                var paneMat = new BABYLON.StandardMaterial("material", scene);
                paneMat.diffuseTexture = new BABYLON.Texture(img, scene);
                paneMat.diffuseTexture.hasAlpha = true;

                var material = new BABYLON.StandardMaterial("material", scene);
                material.diffuseTexture = new BABYLON.Texture("wood.jpg", scene);

                var pane = BABYLON.MeshBuilder.CreateBox("box", {
                    height: element.depth / pxlToMeterRatio,
                    width: element.width / pxlToMeterRatio,
                    depth: 0.001
                }, scene);

                var box = BABYLON.MeshBuilder.CreateBox("box", {
                    height: element.depth / pxlToMeterRatio,
                    width: element.width / pxlToMeterRatio,
                    depth: (element.height / 10) / pxlToMeterRatio
                }, scene);

                var base = BABYLON.MeshBuilder.CreateBox("box", {
                    height: (element.depth / 6) / pxlToMeterRatio,
                    width: element.width / pxlToMeterRatio,
                    depth: element.height / pxlToMeterRatio
                }, scene);

                var shelf1 = BABYLON.MeshBuilder.CreateBox("box", {
                    height: (element.depth / 50) / pxlToMeterRatio,
                    width: element.width / pxlToMeterRatio,
                    depth: (element.height) / pxlToMeterRatio
                }, scene);

                var shelf2 = BABYLON.MeshBuilder.CreateBox("box", {
                    height: (element.depth / 50) / pxlToMeterRatio,
                    width: element.width / pxlToMeterRatio,
                    depth: (element.height) / pxlToMeterRatio
                }, scene);

                var shelf3 = BABYLON.MeshBuilder.CreateBox("box", {
                    height: (element.depth / 50) / pxlToMeterRatio,
                    width: element.width / pxlToMeterRatio,
                    depth: (element.height) / pxlToMeterRatio
                }, scene);

                if (element.rotation == 90) {
                    box.position.x = ((element.x + (0.5 * element.height)) / pxlToMeterRatio);
                } else if (element.rotation == 270) {
                    box.position.x = ((element.x + (element.width - (0.5 * element.height))) /
                        pxlToMeterRatio);
                } else {
                    box.position.x = ((element.x + (0.5 * element.width)) / pxlToMeterRatio);
                }

                base.position.x = ((element.x + (0.5 * element.width)) / pxlToMeterRatio);
                pane.position.x = ((element.x + (0.5 * element.width)) / pxlToMeterRatio);

                shelf1.position.x = ((element.x + (0.5 * element.width)) / pxlToMeterRatio);
                shelf2.position.x = ((element.x + (0.5 * element.width)) / pxlToMeterRatio);
                shelf3.position.x = ((element.x + (0.5 * element.width)) / pxlToMeterRatio);

                if (element.rotation == 90 || element.rotation == 270) {
                    box.position.z = -((element.y + (0.5 * element.height)) / pxlToMeterRatio);
                } else if (element.rotation == 180) {
                    box.position.z = -((element.y + element.height) / pxlToMeterRatio);
                } else {
                    box.position.z = -((element.y + (0.5 * (element.height / 10))) /
                        pxlToMeterRatio);
                }

                base.position.z = -((element.y + (0.5 * element.height)) / pxlToMeterRatio);
                pane.position.z = -((element.y + (0.5 * element.height)) / pxlToMeterRatio);
                shelf1.position.z = -((element.y + (0.5 * element.height)) / pxlToMeterRatio);
                shelf2.position.z = -((element.y + (0.5 * element.height)) / pxlToMeterRatio);
                shelf3.position.z = -((element.y + (0.5 * element.height)) / pxlToMeterRatio);

                shelf1.position.z = -((element.y + (0.5 * element.height)) / pxlToMeterRatio);
                shelf2.position.z = -((element.y + (0.5 * element.height)) / pxlToMeterRatio);
                shelf3.position.z = -((element.y + (0.5 * element.height)) / pxlToMeterRatio);

                box.position.y = (element.depth / pxlToMeterRatio) / 2;
                pane.position.y = (element.depth / pxlToMeterRatio) / 2;

                let shelf1Height = 1.17;
                let shelf2Height = 0.80;
                let shelf3Height = 0.62;

                if (gondolaIDX % 2 == 0) {
                    shelf1Height = 1.46;
                    shelf2Height = 1.1;
                    shelf3Height = 0.75;
                }

                base.position.y = ((element.depth / 6) / pxlToMeterRatio) / 2;
                shelf1.position.y = ((element.depth / shelf1Height) / pxlToMeterRatio) / 2;
                shelf2.position.y = ((element.depth / shelf2Height) / pxlToMeterRatio) / 2;
                shelf3.position.y = ((element.depth / shelf3Height) / pxlToMeterRatio) / 2;

                // add rotation
                let xPivot = -((element.width / 2) / pxlToMeterRatio);
                let zPivot = ((element.height / 2) / pxlToMeterRatio);

                box.setPivotPoint(new BABYLON.Vector3(xPivot, 0, zPivot));
                pane.setPivotPoint(new BABYLON.Vector3(xPivot, 0, zPivot));
                base.setPivotPoint(new BABYLON.Vector3(xPivot, 0, zPivot));
                shelf1.setPivotPoint(new BABYLON.Vector3(xPivot, 0, zPivot));
                shelf2.setPivotPoint(new BABYLON.Vector3(xPivot, 0, zPivot));
                shelf3.setPivotPoint(new BABYLON.Vector3(xPivot, 0, zPivot));

                box.rotation.y = degreesToRadians(element.rotation)
                pane.rotation.y = degreesToRadians(element.rotation)
                base.rotation.y = degreesToRadians(element.rotation)
                shelf1.rotation.y = degreesToRadians(element.rotation)
                shelf2.rotation.y = degreesToRadians(element.rotation)
                shelf3.rotation.y = degreesToRadians(element.rotation)

                box.material = material;
                pane.material = paneMat;
                base.material = material;
                shelf1.material = material;
                shelf2.material = material;
                shelf3.material = material;

                gondolaIDX++;
            },
            switchCameraType() {
                let self = this;

                if (self.cameraType == "free") {

                } else {
                    var camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(0, 1, -15), scene);
                    scene.activeCamera = camera;
                    scene.activeCamera.attachControl(canvas);

                    //camera.position.x = ;
                    //camera.position.x = (50 / 2);
                    //camera.position.z = (30 / 2);
                    camera.position.x = 50 / 2;
                    camera.position.z = -30;
                    camera.position.y = 20;
                    camera.rotation.x = degreesToRadians(45)
                }
            },
            close() {
                let self = this;
                self.showCanvas = false;
                self.dialog = false;
            }
        }
    }

    function degreesToRadians(degrees) {
        if (degrees != 0)
            return degrees / 57.2958;
        else
            return 0;
    }

    function translate(params) {
        return {
            height: params.depth,
            width: params.width,
            depth: params.height,
            x: params.x,
            y: params.y
        }
    }
</script>

<style scoped>
    #renderCanvas {
        height: calc(100vh - 70px);
        overflow: hidden;
    }
</style>