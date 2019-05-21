<template>
    <v-app id="inspire">
        <v-navigation-drawer v-model="drawer" dense fixed right app>
            <v-list dense>
                <v-list-tile @click="toggleCamera">
                    <v-list-tile-action>
                        <v-icon>camera</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Change Camera</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile @click="addPane">
                    <v-list-tile-action>
                        <v-icon>box</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Add Pane</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile @click="addBoxes">
                    <v-list-tile-action>
                        <v-icon>phone</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Add products</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile @click="addPlanogram">
                    <v-list-tile-action>
                        <v-icon>tile</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Add Planogram</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>
        <v-toolbar color="cyan" dense dark app>
            <v-spacer></v-spacer>
            <v-toolbar-title>Floor Planning</v-toolbar-title>
            <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        </v-toolbar>
        <v-content>
            <canvas id="renderCanvas" touch-action="none"></canvas>
        </v-content>
    </v-app>
</template>

<script>
    import SceneLib from "@/components/Main/FloorPlanning/BaseLibs/Scene/Scene.js";
    import PaneLib from "@/components/Main/FloorPlanning/BaseLibs/Scene/Playground/pane.js";
    import BoxLib from "@/components/Main/FloorPlanning/BaseLibs/Scene/Playground/product.js";
    import PlanogramLib from "@/components/Main/FloorPlanning/BaseLibs/Planogram/Planogram.js";
    export default {
        data() {
            return {
                drawer: true,
                sceneObj: null,
                paneObj: null,
                boxObj: null,
                selectedCamera: null,
                startingPoint: null,
                currentMesh: null
            }
        },
        mounted() {
            let self = this;
            self.sceneObj = new SceneLib();
            self.sceneObj.createScene();
            self.sceneObj.registerEvents();
            self.canvas = document.getElementById("renderCanvas");
            self.canvas.addEventListener("pointerdown", self.onPointerDown, false);
            self.canvas.addEventListener("pointerup", self.onPointerUp, false);
            self.canvas.addEventListener("pointermove", self.onPointerMove, false);

            self.sceneObj.scene.onDispose = function () {
                self.canvas.removeEventListener("pointerdown", self.onPointerDown);
                self.canvas.removeEventListener("pointerup", self.onPointerUp);
                self.canvas.removeEventListener("pointermove", self.onPointerMove);
            }
        },
        methods: {
            toggleCamera() {
                let self = this;
                self.sceneObj.toggleCamera();
            },
            addPane() {
                let self = this;
                self.paneObj = new PaneLib(self.sceneObj);
                self.paneObj.addPane(100, 100, 1);
            },
            addBoxes() {
                let self = this;
                self.boxObj = new BoxLib(self.sceneObj);
                self.boxObj.addLots();
            },
            addPlanogram() {
                let self = this;
                let planoObj = new PlanogramLib(self.sceneObj);
                planoObj.addPlanogram();
            },
            //#region Events
            onPointerDown(evt) {
                let self = this;
                if (evt.button !== 0) {
                    return;
                }

                // check if we are under a mesh
                var pickInfo = self.sceneObj.scene.pick(self.sceneObj.scene.pointerX, self.sceneObj.scene.pointerY, function (mesh) {
                    return mesh.id !== "ground";
                });
                if (pickInfo.hit) {
                    self.currentMesh = pickInfo.pickedMesh;
                    self.startingPoint = self.getGroundPosition(evt);

                    if (self.startingPoint) { // we need to disconnect camera from canvas
                        setTimeout(function () {
                            self.sceneObj.camera.detachControl(self.canvas);
                        }, 0);
                    }
                }
            },
            onPointerUp(evt) {
                let self = this;
                if (self.startingPoint) {
                    self.sceneObj.camera.attachControl(self.canvas, true);
                    self.startingPoint = null;
                    return;
                }
            },
            onPointerMove(evt) {
                let self = this;

                if (!self.startingPoint) {
                    return;
                }

                var current = self.getGroundPosition(evt);

                if (!current) {
                    return;
                }

                var diff = current.subtract(self.startingPoint);
                self.currentMesh.position.addInPlace(diff);

                self.startingPoint = current;
            },
            getGroundPosition () {
                let self = this;
                // Use a predicate to get position on the ground
                var pickinfo = self.sceneObj.scene.pick(self.sceneObj.scene.pointerX, self.sceneObj.scene.pointerY, function (mesh) {
                    return mesh.id == "ground";
                });
                if (pickinfo.hit) {
                    return pickinfo.pickedPoint;
                }

                return null;
            }
            //#endregion
        }
    }
</script>

<style>
    html,
    body {
        overflow: hidden;
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
    }

    #renderCanvas {
        width: 100%;
        height: 100%;
        touch-action: none;
    }

    .scene {
        width: 80vw;
        height: 100vh;
    }

    .toolbox {
        width: 20vw;
        height: 100vh;
    }
</style>