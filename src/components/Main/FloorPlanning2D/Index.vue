<template>
    <div>
        <v-toolbar dense dark color="primary"></v-toolbar>
        <v-toolbar dense dark>
            <!-- <v-btn @click="addRect">add rect</v-btn>
            <v-btn @click="addCircle">add circle</v-btn>
            <v-btn @click="selectImage">add image</v-btn>
            <v-btn @click="addLabel">add label</v-btn>
            <v-btn @click="duplicate">duplicate</v-btn> -->
            <v-spacer></v-spacer>
            <v-btn-toggle v-model="mode" mandatory @change="toggleMode">
                <v-btn :value="0" flat>
                    <v-icon>build</v-icon>
                </v-btn>
                <v-btn :value="1" flat>
                    <v-icon>brush</v-icon>
                </v-btn>
            </v-btn-toggle>
        </v-toolbar>
        <v-container grid-list-xs class="ma-0 pa-0" fluid>
            <div style="display: flex;">
                <div class="toolbar grey darken-4">
                    <v-layout row wrap class="pt-3">
                        <v-flex sm12 class="pa-1" v-for="(tool, idx) in tools" :key="idx">
                            <v-card :color="selectedTool == tool ? '#111111' : '#212121'" class="selected-tool mb-1 pa-1" dark flat style="text-align: center; cursor: pointer;" @click="selectedTool = tool">
                                <v-icon :size="25">{{ tool }}</v-icon>
                            </v-card>
                            <v-divider dark></v-divider>
                        </v-flex>
                    </v-layout>
                </div>
                <v-layout row wrap>
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
                                <!-- <v-text-field @change="propChange('fill')" type="color" label="Color"
                                v-model="properties.fill" hide-details>
                            </v-text-field> -->
                                <!-- <v-slider discrete thumb-label v-model="value" step="10" ticks="always"></v-slider> -->
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
                                </v-toolbar-title>
                                <v-spacer></v-spacer>
                                <v-menu offset-y>
                                    <template v-slot:activator="{ on }">
                                        <v-btn v-on="on" small color="primary">add</v-btn>
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
                            <v-card-text class="pa-0 pt-2" style="height: 59%; overflow-y: scroll;">
                                <div v-for="(layer, idx) in layers" :key="idx">
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
                                </div>
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

    import Rect from './libs/drawing/shape/rect'
    import Circle from './libs/drawing/shape/circle'
    import Line from './libs/drawing/shape/line'
    import StageImage from './libs/drawing/shape/image'

    const meterPixelRatio = 3779.5275590551;

    var height = 0;
    var width = 0;

    const scaleBy = 1.05;

    const modes = {
        move: 0,
        draw: 1
    }

    export default {
        data() {
            return {
                selectedTool: null,
                ctrlDown: false,
                stage: null,
                layer: null,
                layers: [],
                properties: {
                    name: "",
                    height: null,
                    width: null,
                    fill: null
                },
                selectedItem: null,
                selectedLayer: null,
                mode: modes.move,
                brush: {
                    size: 10,
                    color: "#000",
                    snapOption: 15,
                    snappingAngles: []
                },
                tools: ['view_carousel', 'fiber_manual_record', 'show_chart', 'image', 'local_offer', 'arrow_upward'],
                currentCursor: 'crosshair'
            }
        },
        methods: {
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
            addLayer() {
                let self = this;

                let layer = new Konva.Layer({
                    name: "",
                    visible: true,
                    showEditName: true,
                    selected: true,
                    showChildren: false
                })

                self.layers.forEach(el => {
                    el.attrs.selected = false;
                })

                self.selectLayer(layer)

                self.layers.unshift(layer);
                self.stage.add(layer);

                setTimeout(() => {
                    self.$refs["editLayer0"][0].focus();
                }, 250);
            },
            addGroup() {
                let self = this;

                let group = new Konva.Group({
                    name: "Group 1",
                    visible: true,
                    showEditName: true,
                    selected: true
                })

                self.selectedLayer.add(group);
                self.selectLayer.draw();
            },
            selectLayer(layer) {
                let self = this;

                self.$nextTick(() => {
                    self.layers.forEach(el => {
                        el.attrs.selected = false;

                        el.children.forEach(child => {
                            child.draggable(false);
                        })
                    })

                    layer.attrs.selected = true;

                    self.selectedLayer = layer;

                    layer.children.forEach(child => {
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

                self.stage.on('click tap', function (e) {
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
                                enabledAnchors: self.selectedItem.attrs.enabledAnchors
                            });

                            self.selectedLayer.add(tr);

                            tr.attachTo(e.target);
                            self.selectedLayer.draw();

                            tr.on('transformend', function () {
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
                            });
                        }
                    }
                });

                self.stage.on('contentMousedown', function () {
                    if (self.mode == modes.draw) {
                        isPaint = true;

                        var pos = self.stage.getPointerPosition();

                        if (firstPosition == null) {
                            firstPosition = pos;
                            lastPosition = pos;
                        } else {
                            lastPosition = pos;
                        }

                        wall = new Line(self.selectedLayer, {
                            x: firstPosition.x,
                            y: firstPosition.y
                        })

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

                        wall.shape.width(hyp);

                        firstPosition = null;
                        lastPosition = null;
                    }
                });

                self.stage.on('contentMousemove', function () {
                    if (self.mode == modes.draw) {
                        if (firstPosition == null) {
                            return;
                        }

                        var pos = self.stage.getPointerPosition();

                        lastPosition = pos;

                        var deltaX = lastPosition.x - firstPosition.x;
                        var deltaY = lastPosition.y - firstPosition.y;

                        let hyp = Math.hypot(deltaY, deltaX)
                        var rad = Math.atan2(deltaY, deltaX);

                        var deg = rad * (180 / Math.PI);

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

                        self.selectedLayer.draw();
                    }
                });

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

                if (layer.attrs.visible)
                    layer.hide();
                else
                    layer.show();

                layer.draw()
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
                layer.destroy();
                layer.draw();
            },
            propChange(propName) {
                let self = this;

                self.$nextTick(() => {
                    console.log(propName)
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
                self.selectedItem
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
                height: height
            })

            let startLayer = new Konva.Layer({
                name: 'Background',
                visible: true,
                selected: true
            });

            self.selectedLayer = startLayer
            self.layers.unshift(startLayer);

            self.stage.add(startLayer);

            self.addStageEvents();
            self.addEvents();
            self.updateSnappingAngles();
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