<template>
    <v-app>
        <v-toolbar color="primary" dark flat dense>
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
            <v-btn icon @click="toggleFixtureList(true)">
                <v-icon>close</v-icon>
            </v-btn>
        </v-toolbar>
        <v-content>
            <v-card dark flat tile color="grey darken-2" style="height: calc(100vh - 136px)">
                <v-layout row wrap>

                    <v-flex md3 v-show="showFixtures">
                        <v-toolbar dark flat dense>
                            <v-toolbar-title>
                                Fixtures
                            </v-toolbar-title>
                            <v-spacer></v-spacer>
                            <v-btn icon @click="toggleFixtureList(false)">
                                <v-icon>close</v-icon>
                            </v-btn>
                        </v-toolbar>
                        <v-card flat tile style="height: calc(100% - 30px); overflow: auto;">
                            <v-card-title>
                                <v-autocomplete label="Select Group" :items="stores" @change="getPlanograms"
                                    v-model="selectedStore">
                                </v-autocomplete>
                            </v-card-title>
                            <v-card-text style="display: block;">
                                <v-list class="pa-0">
                                    <!-- <v-list> -->
                                    <v-divider></v-divider>
                                    <v-list-tile avatar>
                                        <!-- <v-list-tile> -->
                                        <v-list-tile-avatar>
                                            image
                                        </v-list-tile-avatar>
                                        <v-list-tile-content>
                                            <v-list-tile-title> Fixture Name</v-list-tile-title>
                                        </v-list-tile-content>
                                        <v-list-tile-action>
                                            total amount
                                        </v-list-tile-action>
                                    </v-list-tile>
                                </v-list>
                                <hr>
                                <v-card flat tile color="grey lighten-1">
                                    <v-list class="pa-0">
                                        <!-- <v-list> -->
                                        <v-divider></v-divider>
                                        <v-list-tile avatar>
                                            <!-- <v-list-tile> -->
                                            <v-list-tile-avatar>
                                                image
                                            </v-list-tile-avatar>
                                            <v-list-tile-content>
                                                <v-list-tile-title> {Fixture Name}</v-list-tile-title>
                                            </v-list-tile-content>
                                            <v-list-tile-action>
                                                {total amount}
                                            </v-list-tile-action>
                                        </v-list-tile>
                                        <v-divider></v-divider>
                                    </v-list>
                                </v-card>

                            </v-card-text>
                            <!-- <v-list dense hover v-for="(item,index) in planograms" :key="index">
                                        <v-divider></v-divider>
                                        <v-list-tile>
                                            <v-list-tile-content>
                                                <v-list-tile-title>{{item.name}}</v-list-tile-title>
                                            </v-list-tile-content>
                                        </v-list-tile>
                                    </v-list> -->
                            <v-card-actions>

                            </v-card-actions>
                        </v-card>
                    </v-flex>
                    <v-flex id="asd" class="pa-0" :class="{ 'md7': showFixtures, 'md10': !showFixtures }">
                        <v-card flat color="grey darken-2" tile style="height: calc(100vh - 136px)">
                            <v-card-text class="pa-0">
                                <!-- <canvas id="renderCanvas" touch-action="none"></canvas> -->
                                <div id="stage-parent" @dragover="acceptDrag" @drop="dropDragItem">
                                    <v-stage ref="stage" :config="stageData.stageConfiguration"></v-stage>
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-flex>
                    <v-flex class="pa-0">
                        <v-tabs dark color="grey darken-4" slider-color="yellow"
                            style="width: 100%; overflow-y: hidden;">
                            <v-tab ripple>
                                <v-icon>edit</v-icon>
                            </v-tab>
                            <v-tab ripple>
                                <v-icon>tab_unselected</v-icon>
                            </v-tab>
                            <v-tab ripple>
                                <v-icon>settings</v-icon>
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
                            <v-tab-item>
                                <v-card flat tile>
                                    <v-card-text>
                                        <div style="text-decoration: underline">Configuration</div>
                                        <v-autocomplete label="Select Store" :items="stores" @change="getPlanograms"
                                            v-model="selectedStore">
                                        </v-autocomplete>
                                        <div>
                                            Current Planograms: {{selectedPlanograms.length}}
                                            <v-btn small @click="addPlanogramToSelection">set up</v-btn>
                                        </div>
                                    </v-card-text>
                                </v-card>
                            </v-tab-item>
                        </v-tabs>
                    </v-flex>
                </v-layout>
            </v-card>
        </v-content>
        <PlanogramDetailsSelector ref="PlanogramDetailsSelector"></PlanogramDetailsSelector>

    </v-app>
</template>

<script>
    import axios from "axios";
    // import Konva from 'konva';
    import Floor from "@/components/Main/FloorPlanning2D/src/libs/floor/floor.js";
    import DragDropFixtureHelper from "@/components/Main/FloorPlanning2D/src/libs/DragDrop/drag-drop-helper.js";
    import PlanogramDetailsSelector from '@/components/Common/PlanogramDetailsSelector';


    export default {
        components: {
            PlanogramDetailsSelector,
        },
        data() {
            return {
                showFixtures: true,
                selectedPlanograms: [],
                fixture_types: [],
                selectedStore: null,
                selectedSpacePlan: null,
                stores: [],
                planograms: [],
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
            let floor = new Floor(stage, self.stageData.layer, self.stageData.group, 200, 100);
            floor.Initialise();
            window.addEventListener('resize', self.InitialiseStageResponsive);
            this.getFixtureType()
            this.getStores()
        },
        methods: {
            toggleFixtureList(value) {
                let self = this
                self.showFixtures = value
                self.fitStageIntoParentContainer()
            },
            addPlanogramToSelection() {
                let self = this
                self.$refs.PlanogramDetailsSelector.show((spacePlanID, item) => {})
            },
            getStores() {
                let self = this
                self.showCategoryCluster = true
                axios.get(process.env.VUE_APP_API + `Store?db=CR-Devinspire`).then(r => {
                    r.data.forEach(store => {
                        self.stores.push({
                            text: store.storeName,
                            value: store.storeID,
                        })
                    })
                })
            },
            getPlanograms() {
                let self = this

                self.planograms = [];

                axios.get(process.env.VUE_APP_API + "SystemFile/JSON?db=CR-Devinspire&folder=Space Planning")
                    .then(r => {
                        self.planograms = r.data;
                        console.log(self.planograms);

                    })
                    .catch(e => {
                        alert("Failed to get data...");
                    })

            },
            getFixtureType() {
                let self = this;

                axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                axios.get(process.env.VUE_APP_API + "Fixture_Type/Get")
                    .then(r => {
                        self.fixture_types = [];

                        r.data.fixture_TypeList.forEach((el, idx) => {
                            el["modules"] = 0;
                            el["height"] = 0;
                            el["segmentWidth"] = 0;
                            el["depth"] = 0;
                            el["isDefault"] = idx == 0 ? true : false;
                            self.fixture_types.push(el);
                        })

                        delete axios.defaults.headers.common["TenantID"];
                    })
                    .catch(er => {
                        console.log("Error", er)
                    });
            },
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
            fitStageIntoParentContainer() {
                let self = this
                let stage = self.$refs.stage.getStage();
                var container = document.querySelector('#asd');

                // now we need to fit stage into parent
                var containerWidth = container.offsetWidth;
                // to do this we need to scale the stage
                var scale = containerWidth / self.stageData.stageWidth;
                this.stageWidth = container.clientWidth
                this.stageHeight = container.clientHeight
                stage.width(container.clientWidth);
                stage.height(container.clientHeight);
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
                        console.log(stage);
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

<style scoped>
    #stage-parent {
        width: 100%;
    }

    .details {
        font-size: 12px;
    }

    .details_open {
        max-height: calc(100vh - 570px)
    }

    .details_closed {
        max-height: calc(100vh - 235px)
    }

    table {
        border-collapse: collapse;
    }

    table,
    td,
    th {
        border: 1px solid gray;
    }

    td {
        background: white;
        color: black;
    }

    .highlighted {
        background-color: #1976d2;
    }

    th {
        text-align: left;
        background: black;
        color: white;
        padding: 2px;
        border: 1px solid gray;
    }
</style>