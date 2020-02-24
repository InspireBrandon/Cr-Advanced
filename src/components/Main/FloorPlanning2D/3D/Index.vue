<template>
    <v-dialog v-model="dialog" persistent fullscreen>
        <v-card>
            <v-card-title style="text-align: center; display: block;" class="headline"></v-card-title>
            <v-card-text style="text-align: center;"></v-card-text>
            <canvas id="renderCanvas" touch-action="none"></canvas>
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
            }
        },
        mounted() {
            let self = this;
        },
        methods: {
            show() {
                let self = this;
                self.dialog = true;

                setTimeout(() => {
                    self.getItemsToDraw(items => {
                        self.draw();
                    })
                }, 500)
            },
            draw(items) {
                let self = this;

                var canvas = document.getElementById("renderCanvas"); // Get the canvas element 
                var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

                /******* Add the create scene function ******/
                var createScene = function () {

                    // Create the scene space
                    var scene = new BABYLON.Scene(engine);

                    // Add a camera to the scene and attach it to the canvas
                    var camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, new BABYLON
                        .Vector3(
                            0, 0, 5), scene);
                    camera.attachControl(canvas, true);

                    // Add lights to the scene
                    var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
                    var light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 1, -1), scene);

                    var myMaterial = new BABYLON.StandardMaterial("myMaterial", scene);
                    myMaterial.diffuseTexture = new BABYLON.Texture(
                        "tile.jpg",
                        scene);

                    var myGround = BABYLON.MeshBuilder.CreateGround("ground", {
                        width: 50,
                        height: 30,
                        subdivisions: 60
                    }, scene, false);

                    myGround.receiveShadows = true;
                    myGround.checkCollisions = true;
                    myGround.material = myMaterial;

                    items.forEach(element => {
                        console.log(element);
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
            getItemsToDraw(callback) {
                let self = this;

                Axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                Axios.get(process.env.VUE_APP_API + `FloorplanItems/3D?headerID=${40}`)
                    .then(r => {
                        console.log(r.data);
                        callback(r.data);
                    })
            }
        }
    }
</script>