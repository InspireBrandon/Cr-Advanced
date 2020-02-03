<template>
    <div>
        <v-menu v-model="showMenu" :position-x="x" :position-y="y" absolute offset-y>
            <v-list dense class="pa-0">
                <v-list-tile class="pa-0" @click.prevent="moveSelectedBack">
                    <v-list-tile-title class="pa-0">Send Back</v-list-tile-title>
                </v-list-tile>
                <v-divider></v-divider>
                <v-list-tile class="pa-0" @click.prevent="moveSelectedForward">
                    <v-list-tile-title class="pa-0">MoveForward</v-list-tile-title>
                </v-list-tile>
            </v-list>
        </v-menu>
        <v-toolbar dark color="primary">
            <v-btn icon @click="$router.push('/Home')">
                <v-icon>home</v-icon>
            </v-btn>
            <span class="title ml-3 mr-5">Chain&nbsp;<span class="font-weight-light">Research</span></span>
        </v-toolbar>
        <v-toolbar dense dark>
            <v-toolbar-items>
                <v-menu dark offset-y style="margin-bottom: 10px;">
                    <v-btn slot="activator" flat>
                        File
                    </v-btn>
                    <v-list dense class="px-2">
                        <v-list-tile>
                            <v-list-tile-title>New</v-list-tile-title>
                        </v-list-tile>
                        <v-divider></v-divider>
                        <v-list-tile>
                            <v-list-tile-title>Open</v-list-tile-title>
                        </v-list-tile>
                        <v-divider></v-divider>
                        <v-list-tile>
                            <v-list-tile-title>Save</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile>
                            <v-list-tile-title>Save As</v-list-tile-title>
                        </v-list-tile>
                        <v-divider></v-divider>
                        <v-list-tile>
                            <v-list-tile-title>Close</v-list-tile-title>
                        </v-list-tile>
                        <v-divider></v-divider>
                        <v-list-tile @click="openSpaceDesigner">
                            <v-list-tile-title>Open SpacePlan Designer</v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu>
                <v-text-field label="block to meter ratio" v-model="meterRatio" style="width:200px">
                </v-text-field>
            </v-toolbar-items>
            <v-btn icon flat small @click="duplicate('RIGHT')">
                <v-icon>arrow_right</v-icon>
            </v-btn>
            <v-btn icon flat small @click="duplicate('LEFT')">
                <v-icon>arrow_left</v-icon>
            </v-btn>
            <v-btn icon flat small @click="duplicate('UP')">
                <v-icon>arrow_drop_up</v-icon>
            </v-btn>
            <v-btn icon flat small @click="duplicate('DOWN')">
                <v-icon>arrow_drop_down</v-icon>
            </v-btn>
            <v-btn @click="resetStageScale">
                reset zoom
            </v-btn>
            <div v-if="selectedItem!=null">{{selectedItem.attrs.name}}</div>
            <v-spacer></v-spacer>
            <v-toolbar-title>Floor Planning</v-toolbar-title>
        </v-toolbar>
        <v-container grid-list-xs class="ma-0 pa-0" fluid>
            <div style="display: flex;">
                <div class="toolbar grey darken-4">
                    <v-layout row wrap class="pt-3">
                        <v-flex sm12 class="pa-1" v-for="(tool, idx) in tools" :key="idx">
                            <v-tooltip right>
                                <template v-slot:activator="{ on }">
                                    <v-card v-on="on" :color="selectedTool == tool ? ' #111111;' : '#212121'"
                                        class="selected-tool mb-1 pa-1" dark flat
                                        style="text-align: center; cursor: pointer;" @click="onToolChange(tool.name)">
                                        <v-icon :color="selectedTool == tool.name ? 'primary' : 'white'" :size="25">
                                            {{ tool.name }}
                                        </v-icon>
                                    </v-card>
                                </template>
                                <span>{{ tool.tooltip }}</span>
                            </v-tooltip>
                            <v-divider dark></v-divider>
                        </v-flex>
                    </v-layout>
                </div>
                <v-layout row wrap>
                    <v-flex sm10 class="pa-0">
                        <v-card tile flat id="stage_container" class="fill-height" :style="{ 'cursor': currentCursor }">
                            <div ref="container" id="container" oncontextmenu="return false;"></div>
                        </v-card>
                    </v-flex>
                    <v-flex sm2 class="pa-0">
                        <v-card tile flat id="panel_container" class="fill-height">
                            <v-toolbar v-if="selectedTool == 'open_with'" dark dense flat color="grey darken-3">
                                <v-toolbar-title>
                                    <div>Properties</div>
                                </v-toolbar-title>
                            </v-toolbar>
                            <v-card-text v-if="selectedTool == 'open_with'" class="pt-0"
                                style="height: 30%; overflow-y: scroll;">
                                <v-text-field @change="applyProperties" v-if="properties.name!=null" label="Name"
                                    v-model="properties.name" hide-details> </v-text-field>
                                <v-text-field v-if="properties.height!=null" @change="applyProperties" type="number"
                                    label="Height" v-model="properties.height" hide-details>
                                </v-text-field>
                                <v-text-field v-if="properties.width!=null" @change="applyProperties" type="number"
                                    label="Width" v-model="properties.width" hide-details>
                                </v-text-field>
                                <v-text-field v-if="properties.radius!=null" @change="applyProperties" type="number"
                                    label="Radius" v-model="properties.radius" hide-details>
                                </v-text-field>
                            </v-card-text>
                            <v-toolbar v-if="selectedTool != 'open_with'" dark dense flat color="grey darken-3">
                                <v-toolbar-title>
                                    <div>Brush</div>
                                </v-toolbar-title>
                            </v-toolbar>
                            <v-card-text v-if="selectedTool != 'open_with'" class="pt-3"
                                style="height: 30%; overflow-y: scroll;">
                                <v-text-field v-if="selectedTool=='view_carousel'||selectedTool=='show_chart'"
                                    label="Height" v-model="brush.height" hide-details>
                                </v-text-field>
                                <v-text-field v-if="selectedTool=='view_carousel'" label="Width" v-model="brush.width"
                                    hide-details>
                                </v-text-field>
                                <v-text-field v-if="selectedTool=='fiber_manual_record'" label="Radius"
                                    v-model="brush.radius" hide-details>
                                </v-text-field>
                                <v-text-field type="color" label="Color" v-model="brush.color" hide-details>
                                </v-text-field>
                            </v-card-text>
                            <v-toolbar dark dense flat color="grey darken-3">
                                <v-toolbar-title>
                                    <div>Layers</div>
                                    <div v-if="selectedLayer!=null">
                                    </div>
                                </v-toolbar-title>
                                <v-spacer></v-spacer>
                                <v-menu offset-y>
                                    <template v-slot:activator="{ on }">
                                        <v-btn v-on="on" small @click="log" color="primary">add</v-btn>
                                    </template>
                                    <v-list dense class="pa-0">
                                        <v-list-tile tile @click="addLayer">
                                            <v-list-tile-title>Layer</v-list-tile-title>
                                        </v-list-tile>
                                        <v-divider></v-divider>
                                        <v-list-tile tile @click="addGroup">
                                            <v-list-tile-title>Group</v-list-tile-title>
                                        </v-list-tile>
                                    </v-list>
                                </v-menu>
                            </v-toolbar>
                            <v-card-text class="pa-0 pt-0" style="height: 57%; overflow-y: scroll;">
                                <RecursiveLayer ref="RecursiveLayer" :selectItemFromSidePanel="selectItemFromSidePanel"
                                    :selectedLayerTreeItem="selectedLayerTreeItem" :editLayerName="editLayerName"
                                    :showChild="true" :layers="layerTree" :selectLayer="selectLayer"
                                    :setLayerVisible="setLayerVisible" :deleteLayer="deleteLayer" :endDrag="endDrag"
                                    :swapIndex="swapIndex" :startDrag="startDrag" :selectedLayerTree="selectedLayerTree"
                                    :selectedLayer="selectedLayer" :toggleLock="toggleLock" />

                            </v-card-text>
                        </v-card>
                    </v-flex>
                </v-layout>
            </div>
            <input @change="onFileChange" type="file" style="display: none;" ref="fileInput">
            <PlanogramDetailsSelector ref="PlanogramDetailsSelector" />
        </v-container>
        <v-snackbar v-model="snackbar" color="primary" :timeout="3000">
            {{ snackbarText }}
            <v-btn dark flat @click="snackbar = false">
                Close
            </v-btn>
        </v-snackbar>
    </div>
</template>

<script>
    import Konva from 'konva'

    import treeItem from './libs/tree/TreeItem'
    import Rect from './libs/drawing/shape/rect'
    import Circle from './libs/drawing/shape/circle'
    import Label from './libs/drawing/shape/label'
    import Line from './libs/drawing/shape/line'
    import Arrow from './libs/drawing/shape/arrow'
    import StageImage from './libs/drawing/shape/image'


    import DuplicationHelper from './libs/drawing/Functions/duplication-Helper'
    import DragHandler from './libs/drawing/Functions/Drag-Handler'
    import ClickTapHelper from './libs/drawing/Functions/ClickTap-helper'
    import TransFormerHelper from './libs/drawing/Functions/TransFormer-Helper'
    import MultiSelectHelper from './libs/drawing/Functions/MultiSelect-helper'

    import SnappingHandler from './libs/drawing/Functions/snapping-handler'

    import PlanogramDetailsSelector from '@/components/Common/PlanogramDetailsSelector';

    import Settings from './Settings'
    import RecursiveLayer from "./RecursiveLayer.vue"
    // import config from 'config';
    let dragHandler = new DragHandler(this)
    let clickTapHelper = new ClickTapHelper()
    let transFormerHelper = new TransFormerHelper()
    let multiSelectHelper = new MultiSelectHelper()
    const meterPixelRatio = 3779.5275590551;

    var height = 0;
    var width = 0;

    const scaleBy = 1.05;

    export default {
        components: {
            Settings,
            RecursiveLayer,
            PlanogramDetailsSelector
        },
        data() {
            return {
                wall: null,
                rect: null,
                circle: null,
                image: null,
                arrow: null,
                arrowStartY: null,
                arrowStartX: null,
                textNode: null,
                firstPosition: {
                    x: 0,
                    y: 0
                },
                imagePos: {
                    x: 0,
                    y: 0
                },
                lastPosition: {
                    x: 0,
                    y: 0
                },
                multiSelectGroup: null,
                snackbar: false,
                snackbarText: "",
                x: 0,
                y: 0,
                showMenu: false,
                lastdeletedItem: [],
                lastDeletedTree: [],
                meterRatio: 25,
                duplicationSequence: {
                    up: 1,
                    down: 1,
                    left: 1,
                    right: 1
                },
                dragStartIndex: null,
                KonvaLayerDragStart: null,
                selectedLayerTreeItem: null,
                groupLayer: null,
                snapableItems: ['.wall', '.rect-group', '.circle'],
                dragItem: null,
                dragParent: null,
                dragidx: null,
                panX: 0,
                panY: 0,
                ctrlDown: false,
                stage: null,
                layer: null,
                layerTree: [],
                layers: [],
                properties: {
                    name: "",
                    radius: null,
                    height: null,
                    width: null,
                    fill: null
                },
                selectedItem: null,
                selectedLayer: null,
                selectedLayerTree: null,
                brush: {
                    height: 10,
                    width: 10,
                    radius: 10,
                    color: "#1976d2",
                    snapOption: 15,
                    snappingAngles: []
                },
                tools: [{
                        name: 'open_with',
                        tooltip: "move & selection"
                    }, {
                        name: 'view_carousel',
                        tooltip: "Draw Gondola"
                    }, {
                        name: 'fiber_manual_record',
                        tooltip: "Draw circle"
                    }, {
                        name: 'show_chart',
                        tooltip: "Draw wall"
                    },
                    {
                        name: 'image',
                        tooltip: "Draw Image"
                    }, {
                        name: 'local_offer',
                        tooltip: "Add label"
                    },
                    {
                        name: 'arrow_upward',
                        tooltip: "Draw Arrow"
                    }
                ],
                selectedTool: 'open_with',
            }
        },
        computed: {
            currentCursor() {
                let self = this;
                if (self.selectedTool != "open_with") {
                    return 'crosshair';
                } else {
                    return 'default';
                }
            }
        },
        methods: {
            applyProperties() {
                let self = this

                if (self.selectedItem.attrs.name != "rect-group") {
                    for (var prop in self.properties) {
                        if (self.properties[prop] != null && prop != "name") {
                            self.selectedItem.attrs[prop] = parseFloat(self.properties[prop])
                        }
                    }
                } else {
                    self.selectedItem.children.forEach(item => {
                        for (var prop in self.properties) {
                            if (self.properties[prop] != null && prop != "name" && prop != "height") {
                                item.attrs[prop] = parseFloat(self.properties[prop])
                            }
                            if (item.attrs.name == "front-Line") {
                                item.attrs.height = 5

                            } else {
                                item.attrs.height = parseFloat(self.properties["height"])

                            }
                        }

                    })
                }
                self.stage.batchDraw()
            },
            applyBrushProperties(tool) {
                let self = this
                switch (tool) {
                    case "view_carousel": {
                        self.brush.height = 50
                        self.brush.width = 50
                    }

                    break;
                case "fiber_manual_record": {
                    self.brush.radius = 50

                }

                break;
                case "show_chart": {
                    self.brush.height = 10
                }
                break;

                default:
                    break;
                }
            },
            resetStageScale() {
                let self = this
                self.stage.scale({
                    x: 1,
                    y: 1
                });
                var newPos = {
                    x: 0,
                    y: 0
                };
                self.stage.position(newPos);
                self.stage.batchDraw()
            },
            selectItemFromSidePanel(item) {
                let self = this
                self.findKonvaItem(self.stage.children, item.KonvaID, e => {
                    clickTapHelper.destroyTransformer(self.stage, cb => {
                        clickTapHelper.setSelectedItem(e, self.findLayerItem, self
                            .selectedLayerTreeItem, self.selectedItem)
                    })
                    self.resetDuplication()

                    if (self.selectedTool == "open_with") {
                        clickTapHelper.handleSelection(e, self.stage, self.selectedLayer, self.selectedItem,
                            self.selectedLayerTreeItem, self.ctrlDown, self.handleMultiSelect, self
                            .selectedTool)

                        if (e.attrs.draggable && e != self.stage) {
                            self.selectedItem = e;
                            self.findLayerItem(self.layerTree, e._id, callback => {
                                self.selectedLayerTreeItem = callback
                            })
                            if (self.selectedItem.attrs.name == "rect-group") {
                                self.properties.name = self.selectedItem.children[0].attrs.name;
                                self.properties.height = self.selectedItem.children[0].attrs.height;
                                self.properties.width = self.selectedItem.children[0].attrs.width;
                                self.properties.color = self.selectedItem.children[0].attrs.fill;
                                self.properties.radius = self.selectedItem.children[0].attrs.radius;
                            } else {
                                self.properties.name = self.selectedItem.attrs.name;
                                self.properties.height = self.selectedItem.attrs.height;
                                self.properties.width = self.selectedItem.attrs.width;
                                self.properties.color = self.selectedItem.attrs.fill;
                                self.properties.radius = self.selectedItem.attrs.radius;
                            }

                            var tr = new Konva.Transformer({
                                enabledAnchors: self.selectedItem.attrs.enabledAnchors,
                            });

                            if (self.selectedItem.attrs.name == "rect-group" || self.selectedItem.attrs.name ==
                                "image") {
                                tr.rotateEnabled(true);
                            } else {
                                tr.rotateEnabled(false);
                            }

                            self.selectedLayer.add(tr);

                            tr.attachTo(e);

                            self.selectedLayer.draw();

                            tr.on('transform', function (z) {
                                transFormerHelper.handleTransform(e, z, self.handleSnapping, self.stage,
                                    self.lastPosition, self.ctrlDown, self.selectedItem,
                                    rotateAroundCenter)


                            });

                            tr.on('transformend', function () {
                                transFormerHelper.handleTransformEnd(self.selectedItem, self.properties)

                                self.stage.batchDraw();
                            });
                        }
                    }

                })
            },
            getItemFromArr(arr, id, prop, callback) {
                let self = this
                arr.forEach((item, idx) => {
                    if (item[prop] == id) {
                        callback({
                            item: item,
                            idx: idx
                        })
                    }
                })
            },
            moveSelectedBack() {
                let self = this
                if (self.selectedLayer.children.length > 1) {
                    self.getItemFromArr(self.selectedLayer.children, self.selectedItem._id, "_id", konvaCallback => {
                        self.getItemFromArr(self.selectedLayerTree.children, self.selectedItem._id, "KonvaID",
                            treeCallback => {
                                arraymove(self.selectedLayer.children, konvaCallback.idx, konvaCallback
                                    .idx - 1)
                                arraymove(self.selectedLayerTree.children, treeCallback.idx, treeCallback
                                    .idx - 1)
                                self.selectedLayer.draw()
                            })
                    })
                }
            },
            moveSelectedForward() {
                let self = this
                if (self.selectedLayer.children.length > 1) {
                    self.getItemFromArr(self.selectedLayer.children, self.selectedItem._id, "_id", konvaCallback => {
                        self.getItemFromArr(self.selectedLayerTree.children, self.selectedItem._id, "KonvaID",
                            treeCallback => {
                                arraymove(self.selectedLayer.children, konvaCallback.idx, konvaCallback
                                    .idx + 1, self.selectedLayer.children.length + 1)
                                arraymove(self.selectedLayerTree.children, treeCallback.idx, treeCallback
                                    .idx + 1, self.selectedLayerTree.children.length)
                                self.selectedLayer.draw()
                            })
                    })
                }
            },
            resetDuplication() {
                let self = this
                self.duplicationSequence.up = 1
                self.duplicationSequence.down = 1
                self.duplicationSequence.right = 1
                self.duplicationSequence.left = 1
            },
            toggleLock(layer) {
                let self = this
                self.stage.batchDraw()
                self.findKonvaItem([self.stage], layer.KonvaID, KonvaEndcallback => {
                    KonvaEndcallback.draggable(true)
                    KonvaEndcallback.children.forEach(child => {
                        child.draggable(layer.locked)
                    })
                })
            },
            openSpaceDesigner() {
                let self = this
                self.$refs.PlanogramDetailsSelector.show(null, false, null, spacePlanID => {
                    self.$router.push("/FloorplanDesigner/" + spacePlanID.id)
                })
            },
            onToolChange(tool) {
                let self = this
                self.$nextTick(() => {

                    self.selectedTool = tool
                    self.applyBrushProperties(tool)
                    if (self.selectedTool == "open_with") {
                        self.selectedLayer.children.forEach(child => {
                            child.draggable(true);
                        })
                    } else {

                        self.selectedLayer.children.forEach(child => {
                            child.draggable(false);
                        })
                    }
                    switch (self.selectedTool) {
                        case "open_with":
                            self.snackbarText = "Click and drag items to move them"
                            self.snackbar = true
                            break;
                        case "view_carousel":
                            self.snackbarText = "Click on stage to add a Gondola"
                            self.snackbar = true
                            break;
                        case "fiber_manual_record":
                            self.snackbarText = "Click and drag on the stage to add Circle"
                            self.snackbar = true
                            break;
                        case "show_chart":
                            self.snackbarText = "Click and drag on the stage to add a wall"
                            self.snackbar = true
                            break;
                        case "image":
                            self.snackbarText = "Click on the stage to add an image"
                            self.snackbar = true
                            break;
                        case "local_offer":
                            self.snackbarText = "Click and drag on the stage to add a label"
                            self.snackbar = true
                            break;
                        case "arrow_upward":
                            self.snackbarText = "Click and drag on the stage to add an arrow"
                            self.snackbar = true
                            break;
                        default:
                            break;
                    }
                })
            },
            swapIndex(item, layers, idx) {
                let self = this
                var KonvaEnditem
                var konvaItem
                let tmp = self.dragItem
                self.findKonvaItem([self.stage], item.KonvaID, KonvaEndcallback => {
                    KonvaEnditem = KonvaEndcallback
                    self.findKonvaItem([self.stage], tmp.KonvaID, konvaItemcallback => {
                        konvaItem = konvaItemcallback
                        if (self.dragParent != null) {
                            self.dragParent.splice(self.dragidx, 1)
                            layers.splice(idx, 0, self.dragItem);
                            let sad = konvaItem.parent.children.splice(self.dragidx, 1)
                            let asd = KonvaEnditem.parent.children.splice(idx, 0, konvaItem)
                            self.dragItem = null
                            self.dragParent = null
                            self.dragidx = null
                        }

                    })
                })
            },
            endDrag(item, parent) {
                let self = this
                if (self.dragItem != null && item != null && self.dragItem != item) {
                    item.children.push(self.dragItem)
                    self.selectLayer(item, parent)
                    self.dragParent.splice(self.dragidx, 1)
                    var KonvaEndLayer
                    var konvaItem
                    self.findKonvaItem([self.stage], item.KonvaID, KonvaEndcallback => {
                        KonvaEndLayer = KonvaEndcallback
                        self.findKonvaItem([self.stage], self.dragItem.KonvaID, konvaItemcallback => {
                            konvaItem = konvaItemcallback
                            KonvaEndLayer.children.push(konvaItem)
                            konvaItem.parent = KonvaEndLayer
                            self.KonvaLayerDragStart.children.forEach((item, idx) => {
                                if (item._id == konvaItem._id) {
                                    self.KonvaLayerDragStart.children.splice(idx, 1)
                                }
                            })
                            self.dragItem = null
                            self.dragParent = null
                            self.dragidx = null
                        })
                    })
                }
            },
            startDrag(item, idx, layers) {
                let self = this
                self.dragItem = item
                self.dragStartIndex = idx
                var Konvaitem
                self.findKonvaItem([self.stage], item.KonvaID, Konvaitemcallback => {
                    Konvaitem = Konvaitemcallback
                    self.findKonvaItem([self.stage], Konvaitem.parent._id, KonvaLayerDragStart => {
                        self.KonvaLayerDragStart = KonvaLayerDragStart
                        self.dragParent = layers
                        self.dragidx = idx
                    })
                })
            },
            log() {
                let self = this
                console.log("log", self.stage);
            },
            updateSnappingAngles() {
                let self = this;

                self.$nextTick(() => {
                    let finalValue = 180;
                    let incrementAmount = self.brush.snapOption;
                    let incrementValue = -180;

                    self.brush.snappingAngles = [];

                    while (incrementValue <= finalValue) {
                        self.brush.snappingAngles.push(incrementValue);
                        incrementValue += incrementAmount;
                    }
                })
            },
            addImage(dataUrl) {
                let self = this;
                let image = new StageImage(self.selectedLayer, self.imagePos);

                self.selectedLayerTree.children.push(new treeItem({
                    KonvaID: image.shape._id,
                    visible: true,
                    showEditName: true,
                    selected: true,
                    showChildren: true,
                    draggable: true,
                    name: "Image",
                    children: [],
                }))

                var imageObj = new Image();

                imageObj.onload = function () {
                    image.shape.image(imageObj);
                    self.selectedLayer.draw();
                    self.onToolChange("open_with")
                    self.imagePos.x = 0
                    self.imagePos.y = 0

                    // self.selectedTool = ''
                    image.shape.draggable(true)
                }
                imageObj.src = dataUrl;
            },
            selectImage() {
                let self = this;
                self.$refs.fileInput.value = null
                self.$refs.fileInput.click();
            },
            onFileChange(e) {
                let self = this;

                const files = e.target.files;
                let file = files[0];

                blobToDataUrl(file, dataUrl => {
                    self.addImage(dataUrl)
                })
            },
            editLayerName(layer, name) {
                let self = this

                let tmpItems = self.stage.find(".EnterName")


                tmpItems.forEach(item => {
                    if (layer.KonvaID = item._id) {
                        item.setAttrs({
                            name: name
                        })
                        item.attrs.name = name
                    }
                })
            },
            addLayer() {
                let self = this;

                let layer = new Konva.Layer({
                    name: "",
                    visible: true,
                    showEditName: true,
                    selected: true,
                    showChildren: false,
                    drawType: "Layer"
                })

                layer.attrs.name = "Enter Name" + layer._id

                self.layers.forEach(el => {
                    el.attrs.selected = false;
                })

                let layertreeitem = new treeItem({
                    KonvaID: layer._id,
                    children: [],
                    name: "Layer",
                    showEditName: true,
                    visible: layer.visible,
                    selected: layer.selected,
                    showChildren: layer.showChildren,
                    drawType: "Layer"
                })

                self.layerTree.push(layertreeitem)



                self.layers.unshift(layer);
                self.stage.add(layer);
                self.selectLayer(layertreeitem, self.layerTree)
                self.$refs.RecursiveLayer.focusRename(layer._id)
            },
            addGroup() {
                let self = this;
                let group = new Konva.Group({
                    name: "Group 1",
                    visible: true,
                    showEditName: false,
                    selected: true,
                    showChildren: true,
                    draggable: true,
                    locked: true,
                    drawType: "group",
                })

                let layertreeitem = new treeItem({
                    KonvaID: group._id,
                    children: [],
                    name: "Group",
                    showEditName: false,
                    visible: group.visible,
                    selected: group.selected,
                    showChildren: group.showChildren,
                    drawType: "group",
                    locked: true,
                })

                self.selectedLayerTree.children.push(layertreeitem)
                // self.selectedLayer.add(group);
                self.selectedLayer.draw();
            },
            selectLayer(layer, parent) {
                let self = this;

                self.$nextTick(() => {

                    self.selectedLayer.children.forEach(child => {
                        child.draggable(false);
                    })
                    self.findKonvaItem([self.stage], layer.KonvaID, callback => {
                        self.selectedLayerTree = layer
                        self.selectedLayer = callback;
                        if (self.selectedLayer.attrs.drawType == "group") {
                            self.findparentLayer(callback)
                        }
                        if (parent != undefined) {
                            parent.forEach(el => {
                                el.selected = false;
                                // el.children.forEach(child => {
                                //     child.draggable(false);
                                // })
                            })
                        }
                        layer.selected = true;

                        self.selectedLayer.children.forEach(child => {
                            child.draggable(true);
                        })
                    })
                })
            },
            duplicateDrag(e) {
                let self = this
                let duplicationHelper = new DuplicationHelper();

                switch (e.target.attrs.name) {
                    case "rect-group":
                        duplicationHelper.DuplicateRectGroupDrag(e.target, self.selectedLayer, self
                            .selectedLayerTree)

                        break;

                    case "circle":
                        duplicationHelper.DuplicateCircleDrag(e.target, self.selectedLayer, self
                            .selectedLayerTree)

                        break;
                    case "wall":
                        duplicationHelper.DuplicateWallDrag(e.target, self.selectedLayer, self
                            .selectedLayerTree)

                        break;

                    default:
                        break;
                }

            },
            onContextMenu(e, item) {
                let self = this;

                // self.selectedItem = item;
                self.showMenu = false
                self.x = e.evt.clientX
                self.y = e.evt.clientY
                self.$nextTick(() => {
                    self.stage.find('Transformer').destroy()
                    self.showMenu = true
                })
            },
            handleMultiSelect(item) {
                let self = this
                let multiSelectHelper = new MultiSelectHelper()
                multiSelectHelper.handleMultiselect(self.multiSelectGroup, self.selectedLayer, item, callback => {
                    self.multiSelectGroup = callback
                    self.selectedLayer.draw()
                })
            },
            addStageEvents() {
                let self = this;
                let isPaint = false;
                self.stage.on('click tap', function (e) {
                    if (e.target != self.stage) {
                        if (e.target.parent.attrs.name == "rect-group") {
                            e.target = e.target.parent
                        }
                    }
                    clickTapHelper.destroyTransformer(self.stage, cb => {
                        clickTapHelper.setSelectedItem(e.target, self.findLayerItem, self
                            .selectedLayerTreeItem, self.selectedItem)
                        if (e.target == self.stage) {
                            self.selectedItem = null
                            self.selectedLayerTreeItem = null
                            for (var prop in self.properties) {
                                self.properties[prop] = null
                            }
                        }
                    })
                    self.resetDuplication()

                    if (self.selectedTool == "open_with") {
                        clickTapHelper.handleSelection(e.target, self.stage, self.selectedLayer, self
                            .selectedItem,
                            self.selectedLayerTreeItem, self.ctrlDown, self.handleMultiSelect, self
                            .selectedTool)


                        if (e.target.attrs.draggable && e.target != self.stage) {
                            self.selectedItem = e.target;
                            self.findLayerItem(self.layerTree, e.target._id, callback => {
                                self.selectedLayerTreeItem = callback
                            })

                            if (self.selectedItem.attrs.name == "rect-group") {
                                self.properties.name = self.selectedItem.children[0].attrs.name;
                                self.properties.height = self.selectedItem.children[0].attrs.height;
                                self.properties.width = self.selectedItem.children[0].attrs.width;
                                self.properties.color = self.selectedItem.children[0].attrs.fill;
                                self.properties.radius = self.selectedItem.children[0].attrs.radius;
                            } else {
                                self.properties.name = self.selectedItem.attrs.name;
                                self.properties.height = self.selectedItem.attrs.height;
                                self.properties.width = self.selectedItem.attrs.width;
                                self.properties.color = self.selectedItem.attrs.fill;
                                self.properties.radius = self.selectedItem.attrs.radius;
                            }

                            var tr = new Konva.Transformer({
                                enabledAnchors: self.selectedItem.attrs.enabledAnchors,
                            });

                            if (self.selectedItem.attrs.name == "rect-group" || self.selectedItem.attrs.name ==
                                "image") {
                                tr.rotateEnabled(true);
                            } else {
                                tr.rotateEnabled(false);
                            }

                            self.selectedLayer.add(tr);

                            tr.attachTo(e.target);

                            self.selectedLayer.draw();

                            tr.on('transform', function (z) {
                                transFormerHelper.handleTransform(e.target, z, self.handleSnapping, self
                                    .stage,
                                    self.lastPosition, self.ctrlDown, self.selectedItem,
                                    rotateAroundCenter)

                             
                            });

                            tr.on('transformend', function () {
                                transFormerHelper.handleTransformEnd(self.selectedItem, self.properties)
                                self.stage.batchDraw();

                               
                            });
                        }
                    }
                    if (self.selectedTool == "image") {
                        let transform = self.stage.getAbsoluteTransform().copy();
                        // to detect relative position we need to invert transform
                        transform.invert();
                        // now we find relative point
                        let pos = self.stage.getPointerPosition();
                        let dropPos = transform.point(pos);
                        self.imagePos.x = dropPos.x
                        self.imagePos.y = dropPos.y
                        setTimeout(() => {
                            self.selectImage()

                        }, 200);
                    }
                });

                self.stage.on('contextmenu', function (ev) {
                    // self.stage.find('Transformer').destroy()
                    self.onContextMenu(ev)

                })

                self.stage.on('contentMousedown', function () {

                    dragHandler.handleContentMousedown(self.selectedLayer, self.stage, self.firstPosition,
                        self.lastPosition, self.selectedTool, self.selectedLayerTree, self.selectImage,
                        isPaint,
                        self.wall, self.rect, self.circle, self.image, self.arrow, self.arrowStartY, self
                        .arrowStartX, self.textNode, self.brush, self, callback => {
                            self.wall = callback.wall
                            self.rect = callback.rect
                            self.circle = callback.circle
                            self.textNode = callback.textNode
                            self.arrow = callback.arrow
                            self.arrowStartY = self.firstPosition.y
                            self.arrowStartX = self.firstPosition.x
                        })
                })

                self.stage.on('contentMouseup', function (e) {
                    if (self.firstPosition.x == 0) {
                        return
                    }
                    dragHandler.handleContentMouseUp(self.selectedLayer, self.stage, self.firstPosition,
                        self.lastPosition, self.selectedTool, self.selectedLayerTree, self.selectImage,
                        isPaint,
                        self.wall, self.rect, self.circle, self.image, self.arrow, self.arrowStartY, self
                        .arrowStartX, self.textNode, self.resetDuplication, callback => {
                            self.lastPosition = {
                                x: 0,
                                y: 0
                            }
                            self.firstPosition = {
                                x: 0,
                                y: 0
                            }
                            self.arrowStartY = 0
                            self.arrowStartX = 0
                            if (self.selectedTool != "open_with") {
                                self.onToolChange("open_with")
                            }
                        })
                });

                self.stage.on('contentMousemove', function (e) {

                    if (self.firstPosition.x == 0) {
                        return
                    }
                    dragHandler.handleContentMousemove(self.selectedLayer, self.stage, self.firstPosition,
                        self.lastPosition, self.selectedTool, self.selectedLayerTree, self.selectImage,
                        isPaint,
                        self.wall, self.rect, self.circle, self.image, self.arrow, self.arrowStartY, self
                        .arrowStartX, self.textNode, self.ctrlDown, self.handleSnapping, self.brush)
                });

                self.stage.on('dragmove', function (e) {
                    self.handleSnapping(e.target)
                });
                self.stage.on('dragstart', (e) => {
                    if (self.ctrlDown && self.selectedTool == "open_with") {
                        self.duplicateDrag(e)
                    }
                    if (self.selectedTool != "open_with") {
                        self.stage.stopDrag()
                    } else {

                    }
                })

                self.stage.on('dragend', (e) => {
                    if (self.selectedTool != "open_with") {
                        self.stage.stopDrag()
                    } else {
                        // clear all previous lines on the screen
                        self.stage.find('.guid-line').destroy();
                        self.stage.batchDraw();
                        if (e.target.attrs.name == "MultiSelectGroup") {
                            multiSelectHelper.clearMultiselect(e, self.multiSelectGroup, self.stage,
                                callback => {
                                    self.multiSelectGroup.destroy()
                                    self.multiSelectGroup = null
                                    self.stage.batchDraw()
                                })
                        }
                    }
                })
                var scaleBy = 1.05;
                self.stage.addEventListener('wheel', (e) => {
                    var oldScale = self.stage.scaleX();
                    var mousePointTo = {
                        x: self.stage.getPointerPosition().x / oldScale - self.stage.x() / oldScale,
                        y: self.stage.getPointerPosition().y / oldScale - self.stage.y() / oldScale,
                    };
                    var newScale = (e.deltaY * -1) > 0 ? oldScale * scaleBy : oldScale / scaleBy;
                    self.stage.scale({
                        x: newScale,
                        y: newScale
                    });

                    var newPos = {
                        x: -(mousePointTo.x - self.stage.getPointerPosition().x / newScale) * newScale,
                        y: -(mousePointTo.y - self.stage.getPointerPosition().y / newScale) * newScale
                    };
                    if (self.stage.scaleX() < 1 || self.stage.scaleY() < 1) {
                        self.stage.position({
                            x: 0,
                            y: 0
                        })
                        self.stage.batchDraw();
                    } else {
                        self.stage.position(newPos);
                        self.stage.batchDraw();
                    }
                });
            },
            findparentLayer(item) {
                let self = this
                if (item.parent.attrs.drawType == "Layer") {
                    self.groupLayer = item.parent
                } else {
                    self.findparentLayer(item.parent)
                }
            },
            handleSnapping(e) {
                let self = this
                let snappingHandler = new SnappingHandler()
                // clear all previous lines on the screen
                self.stage.find('.guid-line').destroy();
                // find possible snapping lines
                var lineGuideStops = snappingHandler.getLineGuideStops(e, self.stage, self
                    .snapableItems);
                // find snapping points of current object
                var itemBounds = snappingHandler.getObjectSnappingEdges(e, self.stage);
                // now find where can we snap current object
                var guides = snappingHandler.getGuides(lineGuideStops, itemBounds, self.stage);
                // do nothing of no snapping
                if (!guides.length) {
                    return;
                }
                snappingHandler.drawGuides(guides, self.stage, self.selectedLayer);
                // now force object position
                guides.forEach(lg => {
                    if (e.attrs.name != "front-Line" && e.attrs.name != "Gondola-Rect") {
                        switch (lg.snap) {
                            case 'start': {
                                switch (lg.orientation) {
                                    case 'V': {
                                        e.x(lg.lineGuide + lg.offset);
                                        break;
                                    }
                                    case 'H': {
                                        e.y(lg.lineGuide + lg.offset);
                                        break;
                                    }
                                }
                                break;
                            }
                            case 'end': {
                                switch (lg.orientation) {
                                    case 'V': {
                                        e.x(lg.lineGuide + lg.offset);
                                        break;
                                    }
                                    case 'H': {
                                        e.y(lg.lineGuide + lg.offset);
                                        break;
                                    }
                                }
                                break;
                            }
                        }
                    }
                });
            },
            addEvents() {
                let self = this;
                document.addEventListener('keydown', function (event) {
                    const key = event.key;
                    switch (key) {
                        case "Delete":
                            if (self.selectedItem != null) {
                                let tmpItem = null
                                self.lastdeletedItem.unshift(self.selectedItem)
                                deleteTreeItem(self.layerTree, self.selectedItem._id, self)
                                self.selectedItem.parent.children.forEach((element, idx) => {
                                    if (element._id == self.selectedItem._id) {
                                        tmpItem = self.selectedItem.parent.children.splice(idx, 1)
                                    }
                                })
                                self.stage.find('Transformer').destroy()
                                if (self.lastdeletedItem.length > 50) {
                                    self.lastdeletedItem.splice(50, 1)
                                }
                                if (self.lastDeletedTree.length > 50) {
                                    self.lastDeletedTree.splice(50, 1)
                                }
                                self.selectedLayer.draw();
                                self.selectedItem = null;
                                for (var prop in self.properties) {
                                    self.properties[prop] = null
                                }
                            }
                            break;
                        case "Control":
                            self.ctrlDown = true;
                            break;
                        case "z":
                            if (self.ctrlDown && self.lastdeletedItem.length > 0) {
                                self.$nextTick(() => {
                                    let item = self.lastdeletedItem.splice(0, 1)[0]
                                    self.selectedLayer.children.push(item)
                                    self.selectedLayerTree.children.push(self.lastDeletedTree.splice(0,
                                        1)[0])

                                    self.selectedLayer.draw()
                                })
                            }
                            break;
                    }
                });
                document.addEventListener('keyup', function (event) {
                    const key = event.key;
                    switch (key) {
                        case "Control": {
                            self.ctrlDown = false;
                        }
                    }
                });
            },
            setLayerVisible(layer) {
                let self = this;
                let tmpItems = self.stage.find("." + layer.name)
                self.findKonvaItem([self.stage], layer.KonvaID, callback => {

                    if (callback.attrs.visible) {
                        callback.hide();
                        self.setRecursiveVisibility(callback.children, false)
                    } else {
                        callback.show();
                        self.setRecursiveVisibility(callback.children, true)
                    }
                    self.stage.batchDraw()
                })
            },
            deleteLayer(layer, parent, idx) {
                let self = this;
                self.findKonvaItem(self.stage.children, layer.KonvaID, callback => {
                    parent.splice(idx, 1)
                    callback.destroy();
                    self.stage.batchDraw();
                    if (self.stage.children.length == 1) {
                        self.addLayer()
                    }
                })
            },
            duplicate(direction) {
                let self = this;

                let duplicationHelper = new DuplicationHelper()

                if (self.selectedItem == null) {
                    return;
                }
                switch (self.selectedItem.attrs.name) {
                    case "rect-group":
                        duplicationHelper.DuplicateRectGroup(self.selectedItem, self.selectedLayer, self
                            .selectedLayerTree, direction, self.duplicationSequence)

                        break;

                    case "circle":
                        duplicationHelper.DuplicateCircle(self.selectedItem, self.selectedLayer, self
                            .selectedLayerTree, direction, self.duplicationSequence)

                        break;
                    case "wall":
                        duplicationHelper.DuplicateWall(self.selectedItem, self.selectedLayer, self
                            .selectedLayerTree, direction, self.duplicationSequence)
                        break;

                    default:
                        break;
                }
                switch (direction) {
                    case "UP":
                        ++self.duplicationSequence.up
                        break;
                    case "DOWN":
                        ++self.duplicationSequence.down
                        break;
                    case "LEFT":
                        ++self.duplicationSequence.left
                        break;
                    case "RIGHT":
                        ++self.duplicationSequence.right
                        break;
                    default:
                        break;
                }
            },
            findLayerItem(subMenuItems, id, callback) {
                let self = this
                let retval = null;
                if (subMenuItems) {
                    subMenuItems.forEach((item, idx) => {
                        if (item.KonvaID == id) {
                            retval = item
                            callback(item)
                        }
                        if (item.children.length > 0) {
                            self.findLayerItem(item.children, id, recursiveCallback => {
                                callback(recursiveCallback)
                            })
                        }
                    })
                }
            },
            setRecursiveVisibility(subMenuItems, visible) {
                let self = this
                if (subMenuItems) {
                    subMenuItems.forEach((item, idx) => {
                        if (!visible)
                            item.hide();
                        else
                            item.show();
                        if (item.children.length > 0) {
                            self.findKonvaItem(item.children, visible)
                        }
                    })
                }
            },
            findKonvaItem(subMenuItems, id, callback) {
                let self = this
                let retval = null;

                if (subMenuItems) {
                    subMenuItems.forEach((item, idx) => {
                        if (item._id == id) {
                            retval = item
                            callback(item)
                        }
                        if (item.children.length > 0) {
                            self.findKonvaItem(item.children, id, recursiveCallback => {
                                callback(recursiveCallback)
                            })
                        }
                    })
                }
            }
        },
        mounted() {
            let self = this;

            let container = document.getElementById('stage_container');

            height = container.offsetHeight
            width = container.offsetWidth

            self.stage = new Konva.Stage({
                container: "container",
                width: width,
                height: height,
                draggable: true,
                dragBoundFunc: function (pos) {
                    var newY = pos.y > 0 ? 0 : pos.y;
                    var newX = pos.x > 0 ? 0 : pos.x;
                    return {
                        x: newX,
                        y: newY
                    };
                }
            })
            var gridLayer = new Konva.Layer();
            var padding = self.meterRatio;

            for (var i = 0; i < width / padding; i++) {
                gridLayer.add(new Konva.Line({
                    points: [Math.round(i * padding) + 0.5, 0, Math.round(i * padding) + 0.5, height],
                    stroke: '#ddd',
                    strokeWidth: 1,
                }));
            }
            gridLayer.add(new Konva.Line({
                points: [0, 0, 10, 10]
            }));
            for (var j = 0; j < height / padding; j++) {
                gridLayer.add(new Konva.Line({
                    points: [0, Math.round(j * padding), width, Math.round(j * padding)],
                    stroke: '#ddd',
                    strokeWidth: 0.5,
                }));
            }
            self.stage.add(gridLayer);

            let startLayer = new Konva.Layer({
                name: 'Background',
                visible: true,
                selected: true,
                showChildren: true,
                drawType: "Layer"
            });
            let tmplayertree = new treeItem({
                KonvaID: startLayer._id,
                children: [],
                name: 'Background',
                visible: true,
                selected: true,
                showChildren: true,
                drawType: "Layer"
            })
            self.layerTree.push(tmplayertree)
            self.selectedLayerTree = tmplayertree
            self.selectedLayer = startLayer
            self.layers.unshift(startLayer);
            self.stage.add(startLayer);
            self.addStageEvents();
            self.addEvents();
            self.updateSnappingAngles();
        }
    }

    const rotatePoint = ({
        x,
        y
    }, rad) => {
        const rcos = Math.cos(rad);
        const rsin = Math.sin(rad);
        return {
            x: x * rcos - y * rsin,
            y: y * rcos + x * rsin
        };
    };

    function deleteTreeItem(subMenuItems, id, self) {
        if (subMenuItems) {
            subMenuItems.forEach((item, idx) => {

                if (item.KonvaID == id) {
                    let tmp = subMenuItems.splice(idx, 1)
                    self.lastDeletedTree.unshift(tmp[0])
                }
                if (item.children.length > 0) {
                    deleteTreeItem(item.children, id, self)
                }
            })
        }
    }
    // will work for shapes with top-left origin, like rectangle
    function rotateAroundCenter(node, rotation, hyp) {
        //current rotation origin (0, 0) relative to desired origin - center (node.width()/2, node.height()/2)
        const right = {
            x: -node.width(),
            y: -node.height() / 2
        };
        const current = rotatePoint(right, Konva.getAngle(node.rotation()));
        const rotated = rotatePoint(right, Konva.getAngle(rotation));
        const dx = rotated.x - current.x,
            dy = rotated.y - current.y;
        //  node.width(hyp);
        node.rotation(rotation);

        node.x(node.x() + dx);
        node.y(node.y() + dy);
        // 
    }

    function arraymove(arr, fromIndex, toIndex, comparitor) {

        if (fromIndex != toIndex && fromIndex > -1 && toIndex > -1 && toIndex < arr.length + 1) {


            var element = arr[fromIndex];
            arr.splice(fromIndex, 1);
            arr.splice(toIndex, 0, element);
        }

    }

    function blobToDataUrl(blob, callback) {
        var a = new FileReader();

        a.onload = function () {
            callback(a.result);
        }

        a.readAsDataURL(blob);
    }
</script>

<style>
    #panel_container {
        border-left: 1px solid lightgray;
    }

    .fill-height {
        height: calc(100vh - 95px);
    }

    .toolbar {
        width: 40px;
    }

    .selected-tool {
        background: #111111;
    }
</style>