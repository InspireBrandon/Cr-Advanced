<template>
    <v-dialog fullscreen v-model="dialog">
        <div>
            <v-toolbar color="primary" dark>
                <v-toolbar-title>
                    Planogram Designer 3D
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="dialog=false">
                    <v-icon>close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-container class="ma-0 pa-0" fluid>
                <v-layout row wrap>
                    <v-flex md12>
                        <v-card tile class="fill-height">
                            <canvas style="height: calc(100vh - 65px)!important;" id="renderCanvas" touch-action="none"></canvas>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-container>
        </div>
    </v-dialog>
</template>
<script>
    import * as BABYLON from "@babylonjs/core/Legacy/legacy";
    import DrawingHelper from '../FloorPlanning2D/3D/Libs/Drawing/DrawingHelper.js'

    const pxlToMeterRatio = 25;
    let scene, camera, sceneObj, canvas;

    export default {
        data() {
            return {
                dialog: false,
                sceneObj: null,
                drawingHelper: null
            }
        },
        methods: {
            show(drops) {
                let self = this;
                self.dialog = true;
                setTimeout(() => {
                    self.draw(drops);
                }, 200);
            },
            getFloorDimensions(drops) {
                let self = this;

                let topLeft = 0;
                let topRight = 0;
                let bottomLeft = 0;
                let bottomRight = 0;

                drops.forEach(el => {
                    if(el.x < topLeft) {
                        
                    }
                })
            },
            draw(drops) {
                let self = this;

                canvas = document.getElementById("renderCanvas");
                let engine = new BABYLON.Engine(canvas, true);
                scene = new BABYLON.Scene(engine);

                self.drawingHelper = new DrawingHelper(scene);

                sceneObj = self.createScene(scene, engine, canvas, drops);

                engine.runRenderLoop(function () {
                    sceneObj.render();
                });

                window.addEventListener("resize", function () {
                    engine.resize();
                });
            },
            createScene(scene, engine, canvas, drops) {
                let self = this;
                self.createCamera(scene, canvas);
                self.createLight(scene);
                self.createFloor(scene);
                // self.createSkybox(scene);
                self.createFixtures(scene, drops)
                return scene;
            },
            createCamera(scene, canvas) {
                let self = this;

                camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, BABYLON.Vector3.Zero(),
                    scene);
                camera.attachControl(canvas, true);

                camera.wheelPrecision = 50;
                camera.applyGravity = true;
                camera.checkCollisions = true;
                camera.speed = 0.3;

                camera.position.x = 20 / 2;
                camera.position.z = -10;
            },
            createLight(scene) {
                let self = this;

                let light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(15 / pxlToMeterRatio, 25 /
                    pxlToMeterRatio, 0), scene);
            },
            createFloor(scene) {
                let self = this;

                let height = 20;
                let width = 20;

                let myScale = 2;
                let myScale2 = 2;

                var myTexture = new BABYLON.Texture("tile.jpg", scene);
                myTexture.uScale = myScale;
                myTexture.vScale = myScale2;
                var myMaterial = new BABYLON.StandardMaterial("myMaterial", scene);
                myMaterial.diffuseTexture = new BABYLON.Texture("tile.jpg", scene);

                // Parameters
                var xmin = (width / 2) * -1;
                var zmin = (height / 2) * -1;
                var xmax = (width / 2);
                var zmax = (height / 2);

                var precision = {
                    w: 2,
                    h: 2
                };

                var subdivisions = {
                    h: 20 / (width / 2),
                    w: 20 / (height / 2)
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

                myGround.position.x = width / 2;
                myGround.position.z = (height * -1) / 2;

                myGround.receiveShadows = true;
                myGround.checkCollisions = true;
            },
            createSkybox(scene) {
                let self = this;

                let skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {
                    size: 1000.0
                }, scene);
                let skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
                skyboxMaterial.backFaceCulling = false;
                skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("skybox", scene);
                skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
                skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
                skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
                skybox.material = skyboxMaterial;
            },
            createFixtures(scene, drops) {
                let self = this;

                drops.forEach(drop => {
                    console.log(drop);

                    self.drawingHelper.draw(drop);
                });
            }
        }
    }
</script>

<style>
    #renderCanvas {
        height: calc(100vh - 65px);
    }
</style>