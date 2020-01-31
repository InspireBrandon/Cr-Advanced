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
            {{firstPosition}}
            <!-- <div v-if="selectedItem!=null">{{selectedItem.attrs.x}}||{{selectedItem.attrs.y}}</div> -->
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
                            <div id="container" oncontextmenu="return false;"></div>
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
                                <v-text-field v-if="properties.name!=null" label="Name" v-model="properties.name"
                                    hide-details> </v-text-field>
                                <v-text-field v-if="properties.height!=null" type="number" label="Height"
                                    v-model="properties.height" hide-details>
                                </v-text-field>
                                <v-text-field v-if="properties.width!=null" type="number" label="Width"
                                    v-model="properties.width" hide-details>
                                </v-text-field>
                                <v-text-field v-if="properties.radius!=null" type="number" label="Radius"
                                    v-model="properties.radius" hide-details>
                                </v-text-field>
                            </v-card-text>
                            <v-toolbar v-if="selectedTool != 'open_with'" dark dense flat color="grey darken-3">
                                <v-toolbar-title>
                                    <div>Brush</div>
                                </v-toolbar-title>
                            </v-toolbar>
                            <v-card-text v-if="selectedTool != 'open_with'" class="pt-3"
                                style="height: 30%; overflow-y: scroll;">
                                <v-text-field label="Size" v-model="brush.size" hide-details></v-text-field>
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
                                <RecursiveLayer ref="RecursiveLayer" :selectedLayerTreeItem="selectedLayerTreeItem"
                                    :editLayerName="editLayerName" :showChild="true" :layers="layerTree"
                                    :selectLayer="selectLayer" :setLayerVisible="setLayerVisible"
                                    :deleteLayer="deleteLayer" :endDrag="endDrag" :swapIndex="swapIndex"
                                    :startDrag="startDrag" :selectedLayerTree="selectedLayerTree"
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

    import SnappingHandler from './libs/drawing/Functions/snapping-handler'


    import PlanogramDetailsSelector from '@/components/Common/PlanogramDetailsSelector';

    import Settings from './Settings'
    import RecursiveLayer from "./RecursiveLayer.vue"
    // import config from 'config';

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
                    size: 10,
                    color: "#000",
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

                        // self.KonvaDragItem=
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
            addRect() {
                let self = this;
                let rect = new Rect(self.selectedLayer);

                self.selectedLayerTree.children.push(new treeItem({
                    KonvaID: rect.shape.parent._id,
                    visible: true,
                    showEditName: true,
                    selected: true,
                    showChildren: true,
                    draggable: true,
                    name: "rect-group",
                    children: [],
                }))
            },
            addCircle() {
                let self = this;
                let circle = new Circle(self.selectedLayer);
            },
            addImage(dataUrl) {
                let self = this;
                let image = new StageImage(self.selectedLayer);

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
                    self.findKonvaItem(self.stage.children, image.shape._id, callback => {
                        var tr = new Konva.Transformer({
                            boundBoxFunc: function (oldBoundBox, newBoundBox) {
                                if (self.ctrlDown) {
                                    return oldBoundBox;
                                }
                                return newBoundBox;
                            }
                        });


                        tr.rotateEnabled(true);

                        self.selectedLayer.add(tr);

                        tr.attachTo(callback);
                    })
                }
                imageObj.src = dataUrl;
                self.selectedTool = 'open_with'
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
            addLabel() {
                let self = this;

                var textNode = new Konva.Text({
                    text: 'Some text here',
                    x: 50,
                    y: 80,
                    fontSize: 20,
                    draggable: true,
                    width: 200,
                    resizeToFitX: true,
                    resizeToFitY: true
                });

                self.selectedLayer.add(textNode);
                self.selectedLayer.draw();
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
                console.log(self.multiSelectGroup);

                console.log("handleMultiSelect", item);

                if (self.multiSelectGroup == null || self.multiSelectGroup == undefined) {
                    let multigroup = new Konva.Group({
                        name: "MultiSelectGroup",
                        visible: true,
                        showEditName: false,
                        selected: true,
                        showChildren: true,
                        draggable: true,
                        locked: true,
                        drawType: "MultiSelectGroup",
                    })

                    self.multiSelectGroup = multigroup
                    self.selectedLayer.add(multigroup)
                }
                var pos = item.getAbsolutePosition(); // get abs position
                if (item.tmpParent != null && item.tmpParent != undefined) {
                    item.draggable(true)
                    console.log("beforeMove", item);

                    item.moveTo(item.tmpParent)
                    item.position({
                        x: pos.x,
                        y: pos.y
                    });
                    item.tmpParent = null
                    console.log("AfterMove", item);
                    if (self.multiSelectGroup.children.length == 0) {
                        self.multiSelectGroup.destroy()
                        self.multiSelectGroup = null
                    }
                } else {
                    item.draggable(false)
                    item.tmpParent = item.parent
                    item.moveTo(self.multiSelectGroup)
                    item.position({
                        x: pos.x,
                        y: pos.y
                    });
                    console.log(item);
                }

                self.selectedLayer.draw()

            },
            addStageEvents() {
                let self = this;
                let isPaint = false;

                let dragHandler = new DragHandler(this)
                self.stage.on('click tap', function (e) {
                    self.stage.find('Transformer').destroy()
                    self.resetDuplication()
                    if (e.target.attrs.name == "front-Line" || e.target.attrs.name == "Gondola-Rect") {
                        e.target = e.target.parent

                        self.findLayerItem(self.layerTree, e.target.parent._id, callback => {
                            self.selectedLayerTreeItem = callback
                        })
                        self.selectedItem = e.target
                    }
                    if (self.selectedTool == "open_with") {
                        if (e.target === self.stage) {
                            self.stage.find('Transformer').destroy()
                            self.selectedLayer.draw();
                            self.selectedItem = null
                            return;
                        }
                        if (self.ctrlDown) {
                            self.handleMultiSelect(e.target)
                        }
                        self.stage.find('Transformer').destroy();
                        if (e.target.attrs.draggable) {
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

                                // boundBoxFunc: function (oldBoundBox, newBoundBox) {
                                //     if (self.ctrlDown) {
                                //         return oldBoundBox;
                                //     }
                                //     return newBoundBox;
                                // }
                            });
                            console.log(self.selectedItem.attrs.name);

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
                                console.log("rotation", "transform");
                                self.handleSnapping(e.target)
                                let transform = self.stage.getAbsoluteTransform().copy();
                                // to detect relative position we need to invert transform
                                transform.invert();
                                // now we find relative point
                                let pos = self.stage.getPointerPosition();
                                let dropPos = transform.point(pos);

                                self.lastPosition = dropPos;
                                if (self.ctrlDown) {
                                    if (z.currentTarget.movingResizer == "middle-left") {
                                        const right = {
                                            x: self.selectedItem.width(),
                                            y: self.selectedItem.height() / 2
                                        };

                                        const current = rotatePoint(right, Konva.getAngle(self
                                            .selectedItem.rotation()));
                                        var deltaX = self.lastPosition.x - (self.selectedItem.attrs.x +
                                            current.x);
                                        var deltaY = self.lastPosition.y - (self.selectedItem.attrs.y +
                                            current.y);

                                        let hyp = Math.hypot(deltaX, deltaY);

                                        // self.selectedItem.width(hyp);

                                        var rad = Math.atan2(deltaY, deltaX);
                                        var deg = rad * (180 / Math.PI);
                                        rotateAroundCenter(self.selectedItem, (180 + deg), hyp)
                                    }

                                    if (z.currentTarget.movingResizer == "middle-right") {
                                        var deltaX = self.lastPosition.x - e.target.attrs.x;
                                        var deltaY = self.lastPosition.y - e.target.attrs.y;

                                        let hyp = Math.hypot(deltaY, deltaX)
                                        var rad = Math.atan2(deltaY, deltaX);

                                        var deg = rad * (180 / Math.PI);
                                        self.selectedItem.rotation(deg);
                                        self.selectedItem.width(hyp);
                                    }
                                }

                            });

                            tr.on('transformend', function () {
                                self.stage.find('.guid-line').destroy();
                                if (self.selectedItem.attrs.name == "rect-group") {

                                    self.selectedItem.children.forEach(item => {
                                        if (item.attrs.name == "front-Line") {
                                            item.setAttrs({
                                                height: 5,
                                                width: item.width() * item
                                                    .scaleX().toFixed(2),
                                                scaleX: 1,
                                                scaleY: 1,
                                                rotation: item.rotation()
                                            });
                                        } else {
                                            item.setAttrs({
                                                height: item.height() * item
                                                    .scaleY().toFixed(2),
                                                width: item.width() * item
                                                    .scaleX().toFixed(2),
                                                scaleX: 1,
                                                scaleY: 1,

                                            });
                                            self.properties.height = item.height().toFixed(2);
                                            self.properties.width = item.width().toFixed(2)
                                        }
                                    });
                                } else {

                                    if (self.selectedItem.attrs.drawType == "label") {

                                    } else {
                                        self.selectedItem.setAttrs({
                                            height: self.selectedItem.height() * self
                                                .selectedItem
                                                .scaleY().toFixed(2),
                                            width: self.selectedItem.width() * self.selectedItem
                                                .scaleX().toFixed(2),
                                            scaleX: 1,
                                            scaleY: 1
                                        });
                                    }


                                    self.properties.height = self.selectedItem.height().toFixed(2);
                                    self.properties.width = self.selectedItem.width().toFixed(2);
                                }
                                self.stage.batchDraw();
                            });
                        }
                    }
                });

                self.stage.on('contextmenu', function (ev) {
                    // self.stage.find('Transformer').destroy()
                    self.onContextMenu(ev)

                })

                self.stage.on('contentMousedown', function () {
                    console.log("firstPosition2" + self.firstPosition)

                    dragHandler.handleContentMousedown(self.selectedLayer, self.stage, self.firstPosition,
                        self.lastPosition, self.selectedTool, self.selectedLayerTree, self.selectImage,
                        isPaint,
                        self.wall, self.rect, self.circle, self.image, self.arrow, self.arrowStartY, self
                        .arrowStartX, self.textNode,  callback => {
                            console.log("contentMousedown", callback);
                            self.wall=callback.wall
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
                        .arrowStartX, self.textNode, self.resetDuplication)
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
                            e.target.children.forEach(item => {
                                var pos = item.getAbsolutePosition(); // get abs position
                                item.draggable(true)
                                item.moveTo(item.tmpParent)
                                item.position({
                                    x: pos.x,
                                    y: pos.y
                                });
                                item.tmpParent = null
                                if (self.multiSelectGroup.children.length == 0) {
                                    self.multiSelectGroup.destroy()
                                    self.multiSelectGroup = null
                                }
                            })
                        }
                        // var posabs = e.target.getAbsolutePosition();
                        // e.target.position({
                        //     x: posabs.x,
                        //     y: posabs.y
                        // });
                        // e.target.setAttrs({
                        //     x: posabs.x,
                        //     y: posabs.y
                        // })

                        self.stage.batchDraw()
                        console.log("dragend", e);
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

                    self.stage.position(newPos);
                    self.stage.batchDraw();
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
                            // case 'center': {
                            //     switch (lg.orientation) {
                            //         case 'V': {
                            //             e.x(lg.lineGuide + lg.offset);
                            //             break;
                            //         }
                            //         case 'H': {
                            //             e.y(lg.lineGuide + lg.offset);
                            //             break;
                            //         }
                            //     }
                            //     break;
                            // }
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
                // tmpItems.forEach(item => {
                //     if (layer.KonvaID = item._id) {
                //         if (item.attrs.visible)
                //             item.hide();
                //         else
                //             item.show();
                //         item.draw()
                //     }
                // })
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
            getShapeMeters(shape) {
                let self = this;

                return {
                    height: (shape.attrs.height / meterPixelRatio).toFixed(2),
                    width: (shape.attrs.width / meterPixelRatio).toFixed(2),
                }
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
                // self.selectedLayer.add(newItem)
                // self.stage.batchDraw();
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
                draggable: true
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
            // let bg_rect = new Konva.Rect({
            //     x: 0,
            //     y: 0,
            //     width: self.stage.width(),
            //     height: self.stage.height(),
            //     fill: 'white'
            // })
            // startLayer.add(bg_rect);
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
            console.log("inside");
            console.log("fromIndex:", fromIndex);
            console.log("toIndex:", toIndex);

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