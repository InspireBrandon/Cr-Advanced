<template>
    <div>
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
                    </v-list>
                </v-menu>
            </v-toolbar-items>
            <v-btn @click="addRect">add rect</v-btn>
            <v-btn @click="addCircle">add circle</v-btn>
            <v-btn @click="selectImage">add image</v-btn>
            <v-btn @click="addLabel">add label</v-btn>
            <v-btn @click="duplicate">duplicate</v-btn>
            {{selectedLayerTreeItem}}
            <v-spacer></v-spacer>
            <v-btn-toggle v-model="mode" mandatory @change="toggleMode">
                <v-btn :value="0" flat>
                    <v-icon>build</v-icon>
                </v-btn>
                <v-btn :value="1" flat>
                    <v-icon>brush</v-icon>
                </v-btn>
            </v-btn-toggle>
            <v-toolbar-title>Floor Planning</v-toolbar-title>
        </v-toolbar>
        <v-container grid-list-xs class="ma-0 pa-0" fluid>
            <div style="display: flex;">
                <div class="toolbar grey darken-4">
                    <v-layout row wrap class="pt-3">
                        <v-flex sm12 class="pa-1" v-for="(tool, idx) in tools" :key="idx">
                            <v-card :color="selectedTool == tool ? '#111111' : '#212121'"
                                class="selected-tool mb-1 pa-1" dark flat style="text-align: center; cursor: pointer;"
                                @click="selectedTool = tool">
                                <v-icon :size="25">{{ tool }}</v-icon>
                            </v-card>
                            <v-divider dark></v-divider>
                        </v-flex>
                    </v-layout>
                </div>
                <v-layout row wrap>
                    <!-- <v-flex sm12 class="pa-0">
                        <Settings class="fill-height" />
                    </v-flex> -->
                    <v-flex sm10 class="pa-0">
                        <v-card tile flat id="stage_container" class="fill-height" :style="{ 'cursor': currentCursor }">
                            <div id="container"></div>
                        </v-card>
                    </v-flex>
                    <v-flex sm2 class="pa-0">
                        <v-card tile flat id="panel_container" class="fill-height">
                            <v-toolbar v-if="mode == 0" dark dense flat color="grey darken-3">
                                <v-toolbar-title>
                                    <div>Properties</div>
                                </v-toolbar-title>
                            </v-toolbar>
                            <v-card-text v-if="mode == 0" class="pt-0" style="height: 30%; overflow-y: scroll;">
                                <v-text-field label="Name" v-model="properties.name" hide-details> </v-text-field>
                                <v-text-field type="number" label="Height" v-model="properties.height" hide-details>
                                </v-text-field>
                                <v-text-field type="number" label="Width" v-model="properties.width" hide-details>
                                </v-text-field>
                            </v-card-text>
                            <v-toolbar v-if="mode == 1" dark dense flat color="grey darken-3">
                                <v-toolbar-title>
                                    <div>Brush</div>
                                </v-toolbar-title>
                            </v-toolbar>
                            <v-card-text v-if="mode == 1" class="pt-3" style="height: 30%; overflow-y: scroll;">
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
                            <v-card-text class="pa-0 pt-2" style="height: 57%; overflow-y: scroll;">
                                <!-- <div v-for="(layer, idx) in layers" :key="idx">
                                    <div style="display: flex;" class="pa-2"
                                        @click="layer.attrs.showChildren = !layer.attrs.showChildren">
                                        <input @change="selectLayer(layer)" v-model="layer.attrs.selected"
                                            style="margin-top: 4px; margin-right: 10px;" type="checkbox">
                                        <div style="width: 80%">
                                            <div v-if="!layer.attrs.showEditName">{{ layer.attrs.name }}</div>
                                            <v-form @submit.prevent="layer.attrs.showEditName = false">
                                                <input :ref="'editLayer' + idx" v-model="layer.attrs.name"
                                                    v-if="layer.attrs.showEditName" class="mb-1"
                                                    style="border: 1px solid lightgrey" type="text">
                                            </v-form>
                                        </div>
                                        <v-icon :size="22" @click="setLayerVisible(layer)" color="grey darken-2">
                                            {{ layer.attrs.visible ? 'visibility' : 'visibility_off' }}</v-icon>
                                        <v-menu offset-y offset-x>
                                            <template v-slot:activator="{ on }">
                                                <v-icon v-on="on" :size="22" color="grey darken-2">more_vert</v-icon>
                                            </template>
                                            <v-list dense class="pa-0">
                                                <v-list-tile tile>
                                                    <v-list-tile-title>Rename</v-list-tile-title>
                                                </v-list-tile>
                                                <v-divider></v-divider>
                                                <v-list-tile tile @click="deleteLayer(layer)">
                                                    <v-list-tile-title>Remove</v-list-tile-title>
                                                </v-list-tile>
                                            </v-list>
                                        </v-menu>
                                    </div>
                                    <v-divider></v-divider>
                                    <div v-if="layer.attrs.showChildren">
                                        <div v-for="(child, idx) in layer.children" :key="idx" class="grey lighten-3">
                                            <div class="pa-1" style="display: flex;">
                                                <div>{{ child.attrs.name }}</div>
                                            </div>
                                            <v-divider></v-divider>
                                        </div>
                                    </div>
                                </div> -->
                                <RecursiveLayer :editLayerName="editLayerName" :showChild="true" :layers="layerTree"
                                    :selectLayer="selectLayer" :setLayerVisible="setLayerVisible"
                                    :deleteLayer="deleteLayer" :endDrag="endDrag" :startDrag="startDrag"
                                    :selectedLayerTree="selectedLayerTree" :selectedLayer="selectedLayer" />

                            </v-card-text>
                        </v-card>
                    </v-flex>
                </v-layout>
            </div>
            <input @change="onFileChange" type="file" style="display: none;" ref="fileInput">
        </v-container>
    </div>
</template>

<script>
    import Konva from 'konva'

    import treeItem from './libs/tree/TreeItem'
    import Rect from './libs/drawing/shape/rect'
    import Circle from './libs/drawing/shape/circle'
    import Line from './libs/drawing/shape/line'
    import StageImage from './libs/drawing/shape/image'

    import Settings from './Settings'
    import RecursiveLayer from "./RecursiveLayer.vue"

    const meterPixelRatio = 3779.5275590551;

    var height = 0;
    var width = 0;

    const scaleBy = 1.05;

    const modes = {
        move: 0,
        draw: 1
    }

    export default {
        components: {
            Settings,
            RecursiveLayer
        },
        data() {
            return {
                selectedLayerTreeItem: null,
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
                    height: null,
                    width: null,
                    fill: null
                },
                selectedItem: null,
                selectedLayer: null,
                selectedLayerTree: null,
                mode: modes.move,
                brush: {
                    size: 10,
                    color: "#000",
                    snapOption: 15,
                    snappingAngles: []
                },
                tools: ['open_with', 'view_carousel', 'fiber_manual_record', 'show_chart', 'image', 'local_offer',
                    'arrow_upward'
                ],
                selectedTool: 'open_with',
                // currentCursor: 'default'
            }
        },
        computed: {
            currentCursor() {
                let self = this;

                switch (self.mode) {
                    case modes.draw: {
                        return 'crosshair';
                    }
                    break;
                case modes.move: {
                    return 'default';
                }
                break;
                }
            }
        },
        methods: {
            endDrag(item, parent) {
                let self = this
                if (self.dragItem != null) {

                    item.children.push(self.dragItem)

                    self.selectLayer(item, parent)
                    self.dragParent.splice(self.dragidx, 1)
                    self.dragItem = null
                    self.dragParent = null
                    self.dragidx = null
                }

            },
            startDrag(item, idx, layers) {
                let self = this
                self.dragItem = item
                self.dragParent = layers
                self.dragidx = idx
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

                var imageObj = new Image();

                imageObj.onload = function () {
                    image.shape.image(imageObj);
                    self.selectedLayer.draw();
                }

                imageObj.src = dataUrl;

                // if (self.layers.length == 0) {
                //     alert("Please create a layer")
                // } else {
                //     var image = new Konva.Image({
                //         name: 'image',
                //         visible: 'inherit',
                //         x: 10,
                //         y: 10,
                //         width: 200,
                //         height: 137,
                //         draggable: true
                //     })

                //     image.on('transform', function () {
                //         // reset scale, so only with is changing by transformer
                //         image.setAttrs({
                //             width: (image.width() * image.scaleX()).toFixed(2),
                //             height: (image.height() * image.scaleX()).toFixed(2),
                //             scaleX: 1
                //         });
                //     });

                //     self.selectedLayer.add(image);
                // }
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
                    width: 200
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
                    name: "EnterName",
                    visible: true,
                    showEditName: true,
                    selected: true,
                    showChildren: false,
                    drawType: "Layer"
                })

                self.layers.forEach(el => {
                    el.attrs.selected = false;
                })

                self.layerTree.push(new treeItem({
                    KonvaID: layer._id,
                    children: [],
                    name: layer.name(),
                    showEditName: true,
                    visible: layer.visible,
                    selected: layer.selected,
                    showChildren: layer.showChildren,
                    drawType: "Layer"
                }))


                self.layers.unshift(layer);
                self.stage.add(layer);
                self.selectLayer(layer, self.layers)

                // setTimeout(() => {
                //     // self.$refs["editLayer"][0].focus();
                // }, 250);
            },
            addGroup() {
                let self = this;

                let group = new Konva.Group({
                    name: "Group 1",
                    visible: true,
                    showEditName: true,
                    selected: true,
                    showChildren: true

                })

                self.selectedLayer.add(group);
                self.selectedLayer.draw();
            },
            selectLayer(layer, parent) {
                let self = this;

                self.$nextTick(() => {
                    self.selectedLayerTree = layer
                    let tmpItems = self.stage.find("." + layer.name)
                    tmpItems.forEach(item => {
                        if (item._id == layer.KonvaID) {
                            self.selectedLayer = item;
                        }
                    })
                    if (parent != undefined) {
                        parent.forEach(el => {
                            el.selected = false;

                            // el.children.forEach(child => {
                            //     child.draggable(false);
                            // })
                        })
                    }
                    layer.selected = !layer.selected;

                    self.selectedLayer.children.forEach(child => {
                        child.draggable(true);
                    })
                })
            },
            addStageEvents() {
                let self = this;
                let firstPosition = null;
                let lastPosition = null;
                let isPaint = false;
                var wall;
                var rect

                self.stage.on('click tap', function (e) {
                    if (e.target.attrs.name == "front-Line" || e.target.attrs.name == "rect") {
                        e.target = e.target.parent
                        self.selectedItem = e.target

                    }
                    if (self.mode == modes.move) {
                        if (e.target === self.stage) {
                            self.stage.find('Transformer').destroy()
                            self.selectedLayer.draw();
                            return;
                        }

                        self.stage.find('Transformer').destroy();

                        if (e.target.attrs.draggable) {
                            self.selectedItem = e.target;
                            self.properties.name = self.selectedItem.attrs.name;
                            self.properties.height = self.selectedItem.attrs.height;
                            self.properties.width = self.selectedItem.attrs.width;
                            self.properties.color = self.selectedItem.attrs.fill;

                            var tr = new Konva.Transformer({
                                enabledAnchors: self.selectedItem.attrs.enabledAnchors,
                                boundBoxFunc: function (oldBoundBox, newBoundBox) {
                                    if (self.ctrlDown) {
                                        return oldBoundBox;
                                    }
                                    return newBoundBox;
                                }
                            });
                            self.selectedLayer.add(tr);

                            tr.attachTo(e.target);
                            self.selectedLayer.draw();
                            tr.on('transform', function (z) {
                                if (self.ctrlDown) {
                                    // tr.stopTransform();

                                    let transform = self.stage.getAbsoluteTransform().copy();
                                    // to detect relative position we need to invert transform
                                    transform.invert();
                                    // now we find relative point
                                    let pos = self.stage.getPointerPosition();
                                    let dropPos = transform.point(pos);


                                    lastPosition = dropPos;
                                    if (z.currentTarget.movingResizer == "middle-left") {
                                        // tr.stopTransform();
                                        const right = {
                                            x: self.selectedItem.width(),
                                            y: self.selectedItem.height() / 2
                                        };
                                        const current = rotatePoint(right, Konva.getAngle(self
                                            .selectedItem.rotation()));
                                        var deltaX = lastPosition.x - (self.selectedItem.attrs.x +
                                            current.x);
                                        var deltaY = lastPosition.y - (self.selectedItem.attrs.y +
                                            current.y);

                                        let hyp = Math.hypot(deltaY, deltaX)
                                        var rad = Math.atan2(deltaY, deltaX);

                                        var deg = rad * (180 / Math.PI);


                                        rotateAroundCenter(self.selectedItem, (180 + deg))
                                    }
                                    if (z.currentTarget.movingResizer == "middle-right") {
                                        var deltaX = lastPosition.x - e.target.attrs.x;
                                        var deltaY = lastPosition.y - e.target.attrs.y;

                                        let hyp = Math.hypot(deltaY, deltaX)
                                        var rad = Math.atan2(deltaY, deltaX);

                                        var deg = rad * (180 / Math.PI);
                                        self.selectedItem.rotation(deg);
                                    }

                                }

                            });

                            tr.on('transformend', function () {
                                console.log("in here", self.selectedItem);
                                if (self.selectedItem.attrs.name == "rect-group") {
                                    self.selectedItem.children.forEach(item => {
                                        if (item.attrs.name == "front-Line") {
                                            console.log("in child");
                                            item.setAttrs({
                                                height: 5,
                                                width: item.width() * item
                                                    .scaleX().toFixed(2),
                                                scaleX: 1,
                                                scaleY: 1
                                            });

                                            self.properties.height = item.height().toFixed(2);
                                            self.properties.width = item.width().toFixed(2)


                                        } else {
                                            item.setAttrs({
                                                height: item.height() * item
                                                    .scaleY().toFixed(2),
                                                width: item.width() * item
                                                    .scaleX().toFixed(2),
                                                scaleX: 1,
                                                scaleY: 1
                                            });

                                            self.properties.height = item.height().toFixed(2);
                                            self.properties.width = item.width().toFixed(2)
                                        }
                                    });
                                    console.log("after transform apply here", self.selectedItem);
                                } else {
                                    self.selectedItem.setAttrs({
                                        height: self.selectedItem.height() * self.selectedItem
                                            .scaleY().toFixed(2),
                                        width: self.selectedItem.width() * self.selectedItem
                                            .scaleX().toFixed(2),
                                        scaleX: 1,
                                        scaleY: 1
                                    });

                                    self.properties.height = self.selectedItem.height().toFixed(2);
                                    self.properties.width = self.selectedItem.width().toFixed(2);
                                }
                            });
                        }
                    }
                });

                self.stage.on('contentMousedown', function () {
                    if (self.mode == modes.draw) {
                        let transform = self.stage.getAbsoluteTransform().copy();
                        // to detect relative position we need to invert transform
                        transform.invert();
                        // now we find relative point
                        let pos = self.stage.getPointerPosition();
                        let dropPos = transform.point(pos);

                        if (firstPosition == null) {
                            firstPosition = dropPos;
                            lastPosition = dropPos;
                        } else {
                            lastPosition = dropPos;
                        }
                        isPaint = true;
                        switch (self.selectedTool) {
                            case "show_chart":
                                wall = new Line(self.selectedLayer, {
                                    x: firstPosition.x,
                                    y: firstPosition.y,
                                    name: 'wall',
                                    drawType: 'wall'
                                })

                                self.selectedLayerTree.children.push(new treeItem({
                                    KonvaID: wall.shape._id,
                                    name: 'wall',
                                    drawType: 'wall',
                                    children: [],
                                }))
                                break;

                            case "view_carousel":

                                rect = new Rect(self.selectedLayer, {
                                    x: firstPosition.x,
                                    y: firstPosition.y,
                                });

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
                                break;

                            default:
                                break;
                        }
                        console.log("[self.selectedTool]", self.selectedTool);
                        // wall = new Line.Rect({
                        //     x: firstPosition.x,
                        //     y: firstPosition.y,
                        //     name: 'rect',
                        //     visible: 'inherit',
                        //     height: parseInt(self.brush.size),
                        //     width: 10,
                        //     fill: self.brush.color
                        // });

                        // self.selectedLayer.add(wall);
                    } else {
                        let transform = self.stage.getAbsoluteTransform().copy();
                        // to detect relative position we need to invert transform
                        transform.invert();
                        // now we find relative point
                        let pos = self.stage.getPointerPosition();
                        let dropPos = transform.point(pos);

                        // if (firstPosition == null) {
                        //     firstPosition = dropPos;
                        //     lastPosition = dropPos;
                        // } else {
                        //     lastPosition = dropPos;
                        // }
                    }

                })

                self.stage.on('contentMouseup', function () {
                    if (self.mode == modes.draw) {
                        isPaint = false;

                        var pos = self.stage.getPointerPosition();

                        var deltaX = lastPosition.x - firstPosition.x;
                        var deltaY = lastPosition.y - firstPosition.y;

                        let hyp = Math.hypot(deltaY, deltaX)
                        var rad = Math.atan2(deltaY, deltaX);

                        var deg = rad * (180 / Math.PI);
                        switch (self.selectedTool) {
                            case "show_chart":
                                wall.shape.width(hyp);
                                break;
                            case "view_carousel":
                                rect.shape.width(hyp);
                                break;
                            default:
                                break;
                        }


                        firstPosition = null;
                        lastPosition = null;
                    }

                });

                self.stage.on('contentMousemove', function () {
                    if (self.mode == modes.draw) {
                        if (firstPosition == null) {
                            return
                        }
                        let transform = self.stage.getAbsoluteTransform().copy();
                        // to detect relative position we need to invert transform
                        transform.invert();
                        // now we find relative point
                        let pos = self.stage.getPointerPosition();
                        let dropPos = transform.point(pos);

                        lastPosition = dropPos;

                        var deltaX = lastPosition.x - firstPosition.x;
                        var deltaY = lastPosition.y - firstPosition.y;

                        let hyp = Math.hypot(deltaY, deltaX)
                        var rad = Math.atan2(deltaY, deltaX);

                        var deg = rad * (180 / Math.PI);
                        switch (self.selectedTool) {
                            case "show_chart":
                                wall.shape.width(hyp);
                                if (!self.ctrlDown) {
                                    wall.shape.rotation(deg);
                                } else {
                                    let updateDegrees = false;
                                    let snappedAngle = 0;
                                    let tolerance = self.brush.snapOption * 0.45;

                                    self.brush.snappingAngles.forEach(sa => {
                                        let lowerBounds = sa - tolerance
                                        let upperBounds = sa + tolerance

                                        if (deg >= lowerBounds && deg <= upperBounds) {
                                            updateDegrees = true;
                                            snappedAngle = sa;
                                        }
                                    })

                                    if (updateDegrees)
                                        wall.shape.rotation(snappedAngle);
                                }
                                break;

                            case "view_carousel":
                                rect.shape.width(hyp);
                                rect.line.width(hyp);
                                if (!self.ctrlDown) {
                                    rect.line.rotation(deg);
                                    rect.shape.rotation(deg);
                                } else {
                                    let updateDegrees = false;
                                    let snappedAngle = 0;
                                    let tolerance = self.brush.snapOption * 0.45;

                                    self.brush.snappingAngles.forEach(sa => {
                                        let lowerBounds = sa - tolerance
                                        let upperBounds = sa + tolerance

                                        if (deg >= lowerBounds && deg <= upperBounds) {
                                            updateDegrees = true;
                                            snappedAngle = sa;
                                        }
                                    })

                                    if (updateDegrees)
                                        rect.shape.rotation(snappedAngle);
                                    rect.line.rotation(snappedAngle);
                                }
                                break;

                            default:
                                break;
                        }
                        self.selectedLayer.draw();
                    }
                });
                self.stage.on('dragmove', function (e) {
                    // clear all previous lines on the screen
                    self.stage.find('.guid-line').destroy();

                    // find possible snapping lines
                    var lineGuideStops = getLineGuideStops(e.target, self.stage, self.snapableItems);

                    // find snapping points of current object
                    var itemBounds = getObjectSnappingEdges(e.target, self.stage);

                    // now find where can we snap current object
                    var guides = getGuides(lineGuideStops, itemBounds, self.stage);

                    // do nothing of no snapping
                    if (!guides.length) {
                        return;
                    }

                    drawGuides(guides, self.stage, self.selectedLayer);

                    // now force object position
                    guides.forEach(lg => {
                        switch (lg.snap) {
                            case 'start': {
                                switch (lg.orientation) {
                                    case 'V': {
                                        e.target.x(lg.lineGuide + lg.offset);
                                        break;
                                    }
                                    case 'H': {
                                        e.target.y(lg.lineGuide + lg.offset);
                                        break;
                                    }
                                }
                                break;
                            }
                            case 'center': {
                                switch (lg.orientation) {
                                    case 'V': {
                                        e.target.x(lg.lineGuide + lg.offset);
                                        break;
                                    }
                                    case 'H': {
                                        e.target.y(lg.lineGuide + lg.offset);
                                        break;
                                    }
                                }
                                break;
                            }
                            case 'end': {
                                switch (lg.orientation) {
                                    case 'V': {
                                        e.target.x(lg.lineGuide + lg.offset);
                                        break;
                                    }
                                    case 'H': {
                                        e.target.y(lg.lineGuide + lg.offset);
                                        break;
                                    }
                                }
                                break;
                            }
                        }
                    });
                });
                self.stage.on('dragstart', (e) => {
                    if (self.mode == modes.draw) {
                        self.stage.stopDrag()
                    } else {

                    }
                })
                self.stage.on('dragend', (e) => {
                    if (self.mode == modes.draw) {
                        self.stage.stopDrag()
                    } else {
                        // clear all previous lines on the screen
                        self.stage.find('.guid-line').destroy();
                        self.stage.batchDraw();

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
            handleClickTap() {
                let self = this;

                switch (self.mode) {
                    case modes.move: {

                    }
                    break;
                case modes.draw: {

                }
                break;
                }
            },
            addEvents() {
                let self = this;

                document.addEventListener('keydown', function (event) {
                    const key = event.key;

                    switch (key) {
                        case "Delete": {
                            if (self.selectedItem != null) {

                                deleteTreeItem(self.layerTree, self.selectedItem._id)
                                self.selectedItem.destroy()
                                self.stage.find('Transformer').destroy()

                                self.selectedLayer.draw();
                            }
                        }
                        break;
                    case "Control": {
                        self.ctrlDown = true;
                    }
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
                tmpItems.forEach(item => {
                    if (layer.KonvaID = item._id) {
                        if (item.attrs.visible)
                            item.hide();
                        else
                            item.show();
                        item.draw()
                    }
                })
            },
            toggleMode() {
                let self = this;

                self.$nextTick(() => {
                    switch (self.mode) {
                        case modes.move: {
                            self.selectedLayer.children.forEach(child => {
                                child.draggable(true);
                            })
                        }
                        break;
                    case modes.draw: {
                        self.selectedLayer.children.forEach(child => {
                            child.draggable(false);
                        })
                    }
                    break;
                    }
                })
            },
            deleteLayer(layer) {
                let self = this;
                self.layers.splice(self.layers.indexOf(layer), 1);
                self.layerTree
                layer.destroy();
                layer.draw();
            },
            propChange(propName) {
                let self = this;

                self.$nextTick(() => {
                    self.selectedItem.attrs[propName] = self.properties[propName];
                    self.selectedLayer.draw();
                })
            },
            getShapeMeters(shape) {
                let self = this;

                return {
                    height: (shape.attrs.height / meterPixelRatio).toFixed(2),
                    width: (shape.attrs.width / meterPixelRatio).toFixed(2),
                }
            },
            duplicate() {
                let self = this;

                // let newItem = JSON.parse(JSON.stringify(self.selectedItem))

                self.selectedLayer.add(self.selectedItem)
                // self.stage.batchDraw();
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
            var padding = 10;

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

    function getLineGuideStops(skipShape, stage, snapableItems) {
        let self = this

        // we can snap to stage borders and the center of the stage
        let scale = stage.scaleX();
        var vertical = [];
        var horizontal = [];

        // and we snap over edges and center of each object on the canvas
        snapableItems.forEach(element => {
            stage.find(element).forEach(guideItem => {

                if (guideItem === skipShape) {
                    return;
                }

                var box = guideItem.getClientRect();
                box.x = box.x / scale;
                box.y = box.y / scale;
                box.width = box.width / scale;
                box.height = box.height / scale;
                // and we can snap to all edges of shapes
                vertical.push([box.x, (box.x + box.width), (box.x +
                    box.width / 2)]);
                horizontal.push([box.y, (box.y + box.height), (box.y *
                    +box.height / 2)]);
            });
        });

        return {
            vertical: vertical.flat(),
            horizontal: horizontal.flat()
        };
    }

    function getObjectSnappingEdges(node, stage) {
        let self = this
        let scale = stage.scaleX();
        var box = node.getClientRect();
        box.x = box.x / scale;
        box.y = box.y / scale;
        box.width = box.width / scale;
        box.height = box.height / scale;
        return {
            vertical: [{
                    guide: Math.round(box.x),
                    offset: Math.round(node.x() - box.x),
                    snap: 'start'
                },
                {
                    guide: Math.round(box.x + box.width / 2),
                    offset: Math.round(node.x() - box.x - box.width / 2),
                    snap: 'center'
                },
                {
                    guide: Math.round(box.x + box.width),
                    offset: Math.round(node.x() - box.x - box.width),
                    snap: 'end'
                }
            ],
            horizontal: [{
                    guide: Math.round(box.y),
                    offset: Math.round(node.y() - box.y),
                    snap: 'start'
                },
                {
                    guide: Math.round(box.y + box.height / 2),
                    offset: Math.round(node.y() - box.y - box.height / 2),
                    snap: 'center'
                },
                {
                    guide: Math.round(box.y + box.height),
                    offset: Math.round(node.y() - box.y - box.height),
                    snap: 'end'
                }
            ]
        };
    }

    function getGuides(lineGuideStops, itemBounds, stage) {
        let self = this
        var GUIDELINE_OFFSET = 5;
        var resultV = [];
        var resultH = [];

        lineGuideStops.vertical.forEach(lineGuide => {
            itemBounds.vertical.forEach(itemBound => {
                var diff = Math.abs(lineGuide - itemBound.guide);
                // if the distance between guild line and object snap point is close we can consider this for snapping
                if (diff < GUIDELINE_OFFSET) {
                    resultV.push({
                        lineGuide: lineGuide,
                        diff: diff,
                        snap: itemBound.snap,
                        offset: itemBound.offset
                    });
                }
            });
        });

        lineGuideStops.horizontal.forEach(lineGuide => {
            itemBounds.horizontal.forEach(itemBound => {
                var diff = Math.abs(lineGuide - itemBound.guide);
                if (diff < GUIDELINE_OFFSET) {
                    resultH.push({
                        lineGuide: lineGuide,
                        diff: diff,
                        snap: itemBound.snap,
                        offset: itemBound.offset
                    });
                }
            });
        });

        var guides = [];

        // find closest snap
        var minV = resultV.sort((a, b) => a.diff - b.diff)[0];
        var minH = resultH.sort((a, b) => a.diff - b.diff)[0];
        if (minV) {
            guides.push({
                lineGuide: minV.lineGuide,
                offset: minV.offset,
                orientation: 'V',
                snap: minV.snap
            });
        }
        if (minH) {
            guides.push({
                lineGuide: minH.lineGuide,
                offset: minH.offset,
                orientation: 'H',
                snap: minH.snap
            });
        }
        return guides;
    }

    function drawGuides(guides, stage, selectedLayer) {
        let self = this
        let scaleX = stage.scaleX()
        let scaleY = stage.scaleY()
        let xOffset = stage.x() / scaleX;
        let yOffset = stage.y() / scaleY;

        let y_V1 = 0;
        let y_V2 = stage.height();
        let x_V = 0; // change according to rect

        let y_H = 0; // change according to rect
        let x_H1 = 0;
        let x_H2 = stage.width();


        guides.forEach(lg => {
            if (lg.orientation === 'H') {
                y_H = lg.lineGuide -
                    yOffset; //(lg.lineGuide * scaleY); //- ((lg.lineGuide * scaleY) - lg.lineGuide);

                var line = new Konva.Line({
                    points: [x_H1, y_H, x_H2, y_H],
                    stroke: 'rgb(0, 161, 255)',
                    strokeWidth: 1,
                    name: 'guid-line',
                    dash: [4, 6]
                });
                selectedLayer.add(line);
                stage.batchDraw();
            } else if (lg.orientation === 'V') {
                x_V = lg.lineGuide - xOffset; // * scaleX;// - ((lg.lineGuide * scaleX) - lg.lineGuide);
                var line = new Konva.Line({
                    points: [x_V, y_V1, x_V, y_V2],
                    stroke: 'rgb(0, 161, 255)',
                    strokeWidth: 1,
                    name: 'guid-line',
                    dash: [4, 6]
                });
                selectedLayer.add(line);
                stage.batchDraw();
            }
        });


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



    function deleteTreeItem(subMenuItems, id) {
        if (subMenuItems) {
            subMenuItems.forEach((item, idx) => {

                if (item.KonvaID == id) {
                    subMenuItems.splice(idx, 1)
                }
                if (item.children.length > 0) {
                    deleteTreeItem(item.children, id)
                }
            })
        }

    }



    // will work for shapes with top-left origin, like rectangle
    function rotateAroundCenter(node, rotation) {
        //current rotation origin (0, 0) relative to desired origin - center (node.width()/2, node.height()/2)
        const right = {
            x: -node.width(),
            y: -node.height() / 2
        };
        const current = rotatePoint(right, Konva.getAngle(node.rotation()));
        const rotated = rotatePoint(right, Konva.getAngle(rotation));
        const dx = rotated.x - current.x,
            dy = rotated.y - current.y;

        node.rotation(rotation);
        node.x(node.x() + dx);
        node.y(node.y() + dy);
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