<template>
    <v-app>
        <v-toolbar color="grey darken-3" dark flat dense>
            <v-toolbar-side-icon>
                <v-icon>home</v-icon>
            </v-toolbar-side-icon>
            <v-toolbar-title>Floor Planning 2D</v-toolbar-title>
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
                        <v-list-tile tile>
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
                        <v-list-tile @click="1==1">
                            <v-list-tile-title>Pane</v-list-tile-title>
                        </v-list-tile>
                        <v-divider></v-divider>
                        <v-list-tile @click="1==1">
                            <v-list-tile-title>Box</v-list-tile-title>
                        </v-list-tile>
                        <v-divider></v-divider>
                        <v-list-tile @click="1==1">
                            <v-list-tile-title>Planogram</v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu>
                <v-menu offset-y>
                    <template v-slot:activator="{ on }">
                        <v-btn flat small dark v-on="on">Camera</v-btn>
                    </template>
                    <v-list dense>
                        <v-list-tile @click="1==1">
                            <v-list-tile-title>Toggle Camera</v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu>
            </v-toolbar-items>
        </v-toolbar>
        <v-toolbar color="grey darken-3" dark flat dense>
            <v-btn-toggle mandatory>
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
                                    <!-- <canvas id="renderCanvas" touch-action="none"></canvas> -->
                                    <div id="stage-parent" @dragover="acceptDrag" @drop="dropDragItem">
                                        <v-stage ref="stage" :config="stageData.stageConfiguration"></v-stage>
                                    </div>
                                </v-card-text>
                            </v-card>
                        </v-flex>
                        <v-flex md2 class="pa-0">
                            <v-tabs dark color="grey darken-4" slider-color="yellow"
                                style="width: 100%; overflow-y: hidden;">
                                <v-tab ripple>
                                    <v-icon>edit</v-icon>
                                </v-tab>
                                <v-tab ripple>
                                    <v-icon>tab_unselected</v-icon>
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
                                                        <v-list-tile-title draggable="true" @drag="dragFixture"
                                                            @dragstart="dragFixtureStart($event, 'wall')"
                                                            @dragend="clearDrag">Wall 1</v-list-tile-title>
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
                                        <v-card-text>Assets</v-card-text>
                                    </v-card>
                                </v-tab-item>
                            </v-tabs>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-card>
        </v-content>
    </v-app>
</template>

<script>
    // import axios from "axios";
    // import Konva from 'konva';
    import Floor from "@/components/Main/FloorPlanning2D/src/libs/floor/floor.js";
    import DragDropFixtureHelper from "@/components/Main/FloorPlanning2D/src/libs/DragDrop/drag-drop-helper.js";

    export default {
        data() {
            return {
                stageData: {
                    layer: null,
                    group: null,
                    stageWidth: 1000,
                    stageHeight: 1000,
                    stageConfiguration: {
                        width: this.stageWidth,
                        height: this.stageHeight
                    },
                }
            }
        },
        mounted() {
            let self = this;
            let stage = self.$refs.stage.getStage();
            self.InitialiseStageResponsive();
            self.InitialiseScroll();
            let floor = new Floor(stage, self.stageData.layer, self.stageData.group, 50, 50);
            floor.Initialise();
            window.addEventListener('resize', self.InitialiseStageResponsive);
        },
        methods: {
            InitialiseStageResponsive() {
                let self = this;
                let container = document.querySelector('#stage-parent');
                let stage = self.$refs.stage.getStage();

                self.stageData.layer = new Konva.Layer();
                stage.add(self.stageData.layer);
                self.stageData.group = new Konva.Group({
                    draggable: true
                });
                self.stageData.layer.add(self.stageData.group);

                // now we need to fit stage into parent
                let containerWidth = container.offsetWidth;
                // to do this we need to scale the stage
                let scale = containerWidth / self.stageData.stageWidth;

                stage.width(self.stageData.stageWidth * scale);
                stage.height(self.stageData.stageHeight * scale);
                stage.scale({
                    x: scale,
                    y: scale
                });
                stage.draw();
            },
            InitialiseScroll() {
                let self = this;
                let stage = self.$refs.stage.getStage();
                let scaleBy = 1.05;
                stage.on('wheel', e => {
                    e.evt.preventDefault();
                    var oldScale = stage.scaleX();

                    var mousePointTo = {
                        x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
                        y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale
                    };

                    var newScale =
                        (e.evt.deltaY * -1) > 0 ? oldScale * scaleBy : oldScale / scaleBy;
                    stage.scale({
                        x: newScale,
                        y: newScale
                    });

                    var newPos = {
                        x:
                            -(mousePointTo.x - stage.getPointerPosition().x / newScale) *
                            newScale,
                        y:
                            -(mousePointTo.y - stage.getPointerPosition().y / newScale) *
                            newScale
                    };
                    stage.position(newPos);
                    stage.batchDraw();
                });
            },
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
                if (window.dragData != null) {
                    data = window.dragData;
                } else {
                    return;
                }
                //#endregion

                switch (data.toUpperCase()) {
                    case "WALL": {
                        let helper = new DragDropFixtureHelper();
                        helper.AddWall(stage, self.stageData.layer, self.stageData.group, data)
                    }
                    break;
                case "LIBRARY": {
                    self.addLibraryItem(stage, data, ev);
                }
                break;
                }
            },
            dragFixtureStart(ev, data) {
                window.dragData = data;
            },
            dragFixture(ev) {
                ev.currentTarget.style.border = "dashed";
            },
            clearDrag(ev) {
                ev.currentTarget.style.border = "none";
                window.dragData = null;
            },
        }
    }
</script>

<style>
    #stage-parent {
        width: 100%;
    }
</style>