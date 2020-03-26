<template>
    <v-app>
        <!-- <SpaceplanSelector ref="SpaceplanSelector" />
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
                <v-list-tile @click="addBox">
                    <v-list-tile-action>
                        <v-icon>box</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Add Box</v-list-tile-title>
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
                <v-list-tile @click="addComplexPlanogram">
                    <v-list-tile-action>
                        <v-icon>tile</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Add Complex Planogram</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>
        <v-toolbar color="cyan" dense dark app>
            <v-btn icon @click="rotateSelected"><v-icon>rotate_90_degrees_ccw</v-icon></v-btn>
            <v-spacer></v-spacer>
            <v-toolbar-title>Floor Planning</v-toolbar-title>
            <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        </v-toolbar> -->
        <v-toolbar color="grey darken-3" dark flat dense>
            <v-toolbar-side-icon>
                <v-icon>home</v-icon>
            </v-toolbar-side-icon>
            <v-toolbar-title>Floor Planning</v-toolbar-title>
            <v-toolbar-items style="margin-left: 20px;" class="pt-2 pb-2">
                <v-icon>insert_drive_file</v-icon>
                <v-divider class="mx-1" vertical></v-divider>
                <v-icon>folder</v-icon>
                <v-divider class="mx-1" vertical></v-divider>
                <v-icon>save</v-icon>
            </v-toolbar-items>
        </v-toolbar>
        <v-toolbar color="grey darken-4" dark flat dense>
            <v-toolbar-items class="pa-0">
                <v-menu offset-y>
                    <template v-slot:activator="{ on }">
                        <v-btn flat small dark v-on="on">File</v-btn>
                    </template>
                    <v-list dense>
                        <v-list-tile tile @click="startNew()">
                            <v-list-tile-title>New File</v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu>
                <v-menu offset-y>
                    <template v-slot:activator="{ on }">
                        <v-btn flat small dark v-on="on">Options</v-btn>
                    </template>
                    <v-list dense>
                        <v-list-tile>
                            <v-list-tile-title>Options</v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu>
                <v-menu offset-y>
                    <template v-slot:activator="{ on }">
                        <v-btn flat small dark v-on="on">Add</v-btn>
                    </template>
                    <v-list dense>
                        <v-list-tile @click="addPane">
                            <v-list-tile-title>Pane</v-list-tile-title>
                        </v-list-tile>
                        <v-divider></v-divider>
                        <v-list-tile @click="addBox">
                            <v-list-tile-title>Box</v-list-tile-title>
                        </v-list-tile>
                        <v-divider></v-divider>
                        <v-list-tile @click="addPlanogram">
                            <v-list-tile-title>Planogram</v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu>
                <v-menu offset-y>
                    <template v-slot:activator="{ on }">
                        <v-btn flat small dark v-on="on">Camera</v-btn>
                    </template>
                    <v-list dense>
                        <v-list-tile @click="toggleCamera">
                            <v-list-tile-title>Toggle Camera</v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu>
            </v-toolbar-items>
        </v-toolbar>
        <v-toolbar color="grey darken-3" dark flat dense>
            <v-btn-toggle v-model="currentMode" mandatory>
                <v-btn flat value="MOVE">
                    <v-icon>open_with</v-icon>
                </v-btn>
                <v-btn flat value="SCALE">
                    <v-icon>launch</v-icon>
                </v-btn>
                <v-btn flat value="ROTATE">
                    <v-icon>rotate_right</v-icon>
                </v-btn>
            </v-btn-toggle>
        </v-toolbar>
        <v-content>
            <v-card flat tile color="grey darken-2" style="height: calc(100vh - 136px)">
                <v-container class="pa-0 ma-0" grid-list-lg style="max-width: 100%">
                    <v-layout row wrap>
                        <v-flex class="pa-0" md10>
                            <v-card flat color="grey darken-2" tile style="height: calc(100vh - 136px)">
                                <v-card-text class="pa-0">
                                    <canvas id="renderCanvas" touch-action="none"></canvas>
                                </v-card-text>
                            </v-card>
                        </v-flex>
                        <v-flex md2 class="pa-0">
                            <v-tabs dark v-model="active" color="grey darken-4" slider-color="yellow"
                                style="width: 100%; overflow-y: hidden;">
                                <v-tab ripple>
                                    <v-icon>edit</v-icon>
                                </v-tab>
                                <v-tab ripple>
                                    <v-icon>tab_unselected</v-icon>
                                </v-tab>
                                <v-tab ripple>
                                    <v-icon>toc</v-icon>
                                </v-tab>
                                <v-tab-item>
                                    <v-card flat tile>
                                        <v-list dark class="pa-0">
                                            <v-list-group prepend-icon="store">
                                                <template v-slot:activator>
                                                    <v-list-tile>
                                                        <v-list-tile-content>
                                                            <v-list-tile-title>Walls & Pillars</v-list-tile-title>
                                                        </v-list-tile-content>
                                                    </v-list-tile>
                                                </template>

                                                <v-divider></v-divider>

                                                <v-list-tile>
                                                    <v-list-tile-content>
                                                        <v-list-tile-title>Wall 1</v-list-tile-title>
                                                    </v-list-tile-content>
                                                </v-list-tile>

                                                <v-divider></v-divider>

                                                <v-list-tile>
                                                    <v-list-tile-content>
                                                        <v-list-tile-title>Pillar</v-list-tile-title>
                                                    </v-list-tile-content>
                                                </v-list-tile>
                                            </v-list-group>

                                            <v-divider></v-divider>

                                            <v-list-group prepend-icon="store">
                                                <template v-slot:activator>
                                                    <v-list-tile>
                                                        <v-list-tile-content>
                                                            <v-list-tile-title>Doors</v-list-tile-title>
                                                        </v-list-tile-content>
                                                    </v-list-tile>
                                                </template>

                                                <v-divider></v-divider>

                                                <v-list-tile>
                                                    <v-list-tile-content>
                                                        <v-list-tile-title>Door 1</v-list-tile-title>
                                                    </v-list-tile-content>
                                                </v-list-tile>

                                                <v-divider></v-divider>

                                                <v-list-tile>
                                                    <v-list-tile-content>
                                                        <v-list-tile-title>Door 2</v-list-tile-title>
                                                    </v-list-tile-content>
                                                </v-list-tile>
                                            </v-list-group>
                                        </v-list>
                                    </v-card>
                                </v-tab-item>
                                <v-tab-item>
                                    <v-card flat tile>
                                        <v-card-text>
                                            <v-layout row wrap align-center justify-center v-if="currentMesh != null">
                                                <v-flex md12>
                                                    <span>Details</span>
                                                </v-flex>
                                                <v-flex md12>
                                                    <v-text-field v-model="currentMesh.name" box label="Name"
                                                        hide-details>
                                                    </v-text-field>
                                                </v-flex>
                                                <v-flex md12 class="pa-0">
                                                    <v-divider></v-divider>
                                                </v-flex>
                                                <v-flex md12>
                                                    <span>Position</span>
                                                </v-flex>
                                                <v-flex md4 class="pt-0">
                                                    <v-text-field type="number" v-model="currentMesh.position.x" box
                                                        label="X" hide-details>
                                                    </v-text-field>
                                                </v-flex>
                                                <v-flex md4 class="pt-0">
                                                    <v-text-field type="number" v-model="currentMesh.position.y" box
                                                        label="y" hide-details>
                                                    </v-text-field>
                                                </v-flex>
                                                <v-flex md4 class="pt-0">
                                                    <v-text-field type="number" v-model="currentMesh.position.z" box
                                                        label="Z" hide-details>
                                                    </v-text-field>
                                                </v-flex>
                                                <v-flex md12 class="pa-0">
                                                    <v-divider></v-divider>
                                                </v-flex>
                                                <v-flex md12>
                                                    <span>Dimension</span>
                                                </v-flex>
                                                <v-flex md4 class="pt-0">
                                                    <v-text-field type="number" box label="X" hide-details
                                                        v-model="currentMesh.scaling.x">
                                                    </v-text-field>
                                                </v-flex>
                                                <v-flex md4 class="pt-0">
                                                    <v-text-field type="number" box label="y" hide-details
                                                        v-model="currentMesh.scaling.y">
                                                    </v-text-field>
                                                </v-flex>
                                                <v-flex md4 class="pt-0">
                                                    <v-text-field type="number" box label="Z" hide-details
                                                        v-model="currentMesh.scaling.z">
                                                    </v-text-field>
                                                </v-flex>
                                                <v-flex md12 class="pa-0">
                                                    <v-divider></v-divider>
                                                </v-flex>
                                                <v-flex md12>
                                                    <span>Rotation</span>
                                                </v-flex>
                                                <v-flex md4 class="pt-0">
                                                    <v-text-field type="number" box label="X" hide-details
                                                        v-model="currentMesh.rotation.x">
                                                    </v-text-field>
                                                </v-flex>
                                                <v-flex md4 class="pt-0">
                                                    <v-text-field type="number" box label="y" hide-details
                                                        v-model="currentMesh.rotation.y">
                                                    </v-text-field>
                                                </v-flex>
                                                <v-flex md4 class="pt-0">
                                                    <v-text-field type="number" box label="Z" hide-details
                                                        v-model="currentMesh.rotation.z">
                                                    </v-text-field>
                                                </v-flex>
                                                <v-flex md12 class="pa-0">
                                                    <v-divider></v-divider>
                                                </v-flex>
                                            </v-layout>
                                        </v-card-text>
                                    </v-card>
                                </v-tab-item>
                                <v-tab-item>
                                    <v-card flat tile>
                                        <v-card-text>Assets</v-card-text>
                                    </v-card>
                                </v-tab-item>
                            </v-tabs>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-card>
        </v-content>
        <SpaceplanSelector ref="SpaceplanSelector" />
        <DateRangeSelector ref="DateRangeSelector" />
    </v-app>
</template>

<script>
    import SceneLib from "@/components/Main/FloorPlanning/BaseLibs/Scene/Scene.js";
    import PaneLib from "@/components/Main/FloorPlanning/BaseLibs/Scene/Playground/pane.js";
    import BoxLib from "@/components/Main/FloorPlanning/BaseLibs/Scene/Playground/product.js";
    import PlanogramLib from "@/components/Main/FloorPlanning/BaseLibs/Planogram/Planogram.js";
    import SpaceplanSelector from "@/components/Common/SpacePlanSelector"
    import DateRangeSelector from "@/components/Common/DateRangeSelector";

    import * as BABYLON from '@babylonjs/core/Legacy/legacy';
    import {
        Vector3
    } from '@babylonjs/core/Legacy/legacy';

    export default {
        components: {
            SpaceplanSelector,
            DateRangeSelector
        },
        data() {
            return {
                currentMode: "MOVE",
                active: null,
                drawer: true,
                sceneObj: null,
                paneObj: null,
                boxObj: null,
                selectedCamera: null,
                startingPoint: null,
                currentMesh: null,
                items: [{
                        action: 'local_activity',
                        title: 'Attractions',
                        items: [{
                            title: 'List Item'
                        }]
                    },
                    {
                        action: 'restaurant',
                        title: 'Dining',
                        active: true,
                        items: [{
                                title: 'Breakfast & brunch'
                            },
                            {
                                title: 'New American'
                            },
                            {
                                title: 'Sushi'
                            }
                        ]
                    },
                    {
                        action: 'school',
                        title: 'Education',
                        items: [{
                            title: 'List Item'
                        }]
                    },
                    {
                        action: 'directions_run',
                        title: 'Family',
                        items: [{
                            title: 'List Item'
                        }]
                    },
                    {
                        action: 'healing',
                        title: 'Health',
                        items: [{
                            title: 'List Item'
                        }]
                    },
                    {
                        action: 'content_cut',
                        title: 'Office',
                        items: [{
                            title: 'List Item'
                        }]
                    },
                    {
                        action: 'local_offer',
                        title: 'Promotions',
                        items: [{
                            title: 'List Item'
                        }]
                    }
                ]
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
            startNew() {
                let self = this
                self.$refs.dateRangeSelector.show(dateRange => {
                    console.log("dateRange", dateRange)
                })

            },
            openDaterange() {
                let self = this
                self.$refs.dateRangeSelector.show(dateRange => {

                })
            },
            toggleCamera() {
                let self = this;
                self.sceneObj.toggleCamera();
            },
            addPane() {
                let self = this;
                self.paneObj = new PaneLib(self.sceneObj);
                self.paneObj.addPane(33, 33, 1);
            },
            addBox() {
                let self = this;

                self.boxObj = new BoxLib(self.sceneObj);
                self.boxObj.addBox();

                // var myMaterial = new BABYLON.StandardMaterial("myMaterial", self.sceneObj.scene);
                // myMaterial.diffuseColor = new BABYLON.Color3(1, 0, 1);
                // var myBox = BABYLON.MeshBuilder.CreateBox("myBox", {
                //     height: 5,
                //     width: 5,
                //     depth: 5
                // }, self.sceneObj.scene);
                // myBox.position.x = 0;
                // myBox.position.y = 5 / 2;
                // myBox.position.z = 0;
                // myBox.material = myMaterial;
            },
            addBoxes() {
                let self = this;
                self.boxObj = new BoxLib(self.sceneObj);
                self.boxObj.addLots();
            },
            addPlanogram() {
                let self = this;
                let planoObj = new PlanogramLib(self.sceneObj);

                self.$refs.SpaceplanSelector.show((id, selectedPlanogram) => {
                    planoObj.addPlanogram(id);
                })
            },
            addComplexPlanogram() {
                let self = this;
                let planoObj = new PlanogramLib(self.sceneObj);
                planoObj.addComplexPlanogram();
            },
            //#region Events
            onPointerDown(evt) {
                let self = this;
                if (evt.button !== 0) {
                    return;
                }

                // check if we are under a mesh
                var pickInfo = self.sceneObj.scene.pick(self.sceneObj.scene.pointerX, self.sceneObj.scene.pointerY,
                    function (mesh) {
                        return mesh.id !== "ground";
                    });

                if (pickInfo.hit) {
                    self.currentMesh = pickInfo.pickedMesh;

                    console.log(self.currentMesh)

                    self.startingPoint = self.getGroundPosition(evt);

                    if (self.startingPoint) { // we need to disconnect camera from canvas
                        setTimeout(function () {
                            self.sceneObj.camera.detachControl(self.canvas);
                        }, 0);
                    }
                }
            },
            rotateSelected() {

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

                switch (self.currentMode) {
                    case "MOVE": {
                        console.log(diff)
                        self.currentMesh.position.x = diff.x - diff.y;
                        self.currentMesh.position.z = diff.z - diff.y;
                        // self.currentMesh.rotation.y = Math.sqrt(diff.x, diff.z) == NaN ? 0 : Math.sqrt(diff.x, diff.z);
                        self.startingPoint = current;
                    }
                    break;
                case "SCALE": {
                    self.currentMesh.scaling.x = diff.x;
                }
                break;
                case "ROTATE": {
                    self.currentMesh.rotation.y = Math.sqrt(diff.x, diff.z) == NaN ? 0 : Math.sqrt(diff.x, diff.z);
                }
                break;
                }
            },
            getGroundPosition() {
                let self = this;
                // Use a predicate to get position on the ground
                var pickinfo = self.sceneObj.scene.pick(self.sceneObj.scene.pointerX, self.sceneObj.scene.pointerY,
                    function (mesh) {
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
        height: calc(100vh - 136px);
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