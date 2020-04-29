<template>
    <v-dialog fullscreen v-model="dialog">
        <div>
            <v-toolbar color="primary" dark>
                <v-toolbar-title>
                    Planogram Designer
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="openThreeDee">3D</v-btn>
                <v-btn icon @click="dialog=false">
                    <v-icon>close</v-icon>
                </v-btn>

                <!-- <v-btn @click="log">
                log
            </v-btn> -->
            </v-toolbar>
            <v-container class="ma-0 pa-0" fluid>
                <v-layout row wrap>
                    <v-flex md2>
                        <v-toolbar color="grey darken-3" dark dense>
                            <div>Properties</div>
                            <v-spacer></v-spacer>
                            <v-toolbar-items>
                                <v-menu dark offset-y style="margin-bottom: 10px;">
                                    <v-btn slot="activator" flat>
                                        File
                                    </v-btn>
                                    <v-list dense class="px-2">
                                        <v-list-tile @click="save()">
                                            <v-list-tile-title>Save</v-list-tile-title>
                                        </v-list-tile>
                                        <v-divider></v-divider>
                                    </v-list>
                                </v-menu>
                            </v-toolbar-items>
                        </v-toolbar>
                        <v-card height="calc(100vh - 115px)" width="100%" style="overflow:auto">
                            <v-container grid-list-md>
                                <v-layout row wrap v-if="selectedItem!=null">
                                    <v-flex md10
                                        v-if="selectedItem.attrs.name == 'Circle' || selectedItem.attrs.name == 'Gondola-Rect'">
                                        <v-select :items="shapes" v-model="properties.shape" @change="reDraw">
                                        </v-select>
                                    </v-flex>
                                    <v-flex md2>
                                        <!-- <v-btn icon color="primary" @click="saveImages">
                                    <v-icon>
                                        save
                                    </v-icon>
                                </v-btn> -->
                                    </v-flex>
                                    <v-flex md12>
                                        <v-text-field @change="changeRotation" type="number" label="Rotation"
                                            v-model="properties.rotation" hide-details>
                                        </v-text-field>
                                    </v-flex>
                                </v-layout>
                                <v-layout row wrap v-else>
                                    <v-flex md12>
                                        Click an Item to display its properties
                                    </v-flex>
                                </v-layout>
                            </v-container>
                            <!-- <div v-for="(item,idx) in drops" :key="idx">
                                <expansionItem :selectedFixtures="selectedFixtures" :Drop="item"
                                    :changeRotation="changeRotation" :reDraw="reDraw">
                                </expansionItem>
                                <v-divider></v-divider>
                            </div> -->
                        </v-card>
                    </v-flex>
                    <v-flex md10>
                        <v-card tile flat id="stage_container" class="fill-height" :style="{ 'cursor': currentCursor }">
                            <div id="container"></div>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-container>
            <Spinner ref="spinner"></Spinner>
            <ThreeDee ref="threeDee"></ThreeDee>
        </div>
    </v-dialog>
</template>
<script>
    const meterPixelRatio = 3779.5275590551;

    var height = 0;
    var width = 0;
    var KonvaRatio = 10
    const scaleBy = 1.05;

    import Konva from 'konva'
    import axios from "axios"


    import Rect from '@/components/Main/FloorPlanning2D/libs/drawing/shape/rect'
    import Circle from '@/components/Main/FloorPlanning2D/libs/drawing/shape/circle'

    import SnappingHandler from '@/components/Main/FloorPlanning2D/libs/drawing/Functions/snapping-handler'
    import Spinner from '@/components/Common/Spinner';

    import ThreeDee from './ThreeDee';

    import expansionItem from "./expansionItem"
    import {
        callbackify
    } from 'util';
    export default {
        components: {
            expansionItem,
            Spinner,
            ThreeDee
        },
        data() {
            return {
                shapes: ["Circle", "Square"],
                properties: {
                    rotation: 0,
                    shape: "square"
                },
                dialog: false,
                selectedItem: null,
                selectedLayer: null,
                stage: null,
                selectedTool: ["open_with"],
                drops: [],
                planogram_ID: null,
                snapableItems: ['.wall', '.Gondola-Rect', '.circle'],
                selectedFixtures: null,
                saveArr: [],

            }
        },
        methods: {
            open(planogram_ID) {
                let self = this
                self.planogram_ID = planogram_ID
                console.log("planogram_ID", self.planogram_ID);

                self.dialog = true
                self.initialise()
            },
            log() {
                let self = this
                console.log(self.selectedLayer);

            },
            checkForHeader(callback) {
                let self = this
                console.log("params", self.$route.params.ID);


                axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                axios.post(process.env.VUE_APP_API + `FloorPlanheader/Exisitng?Planogram_ID=${self.planogram_ID}`)
                    .then(
                        r => {
                            console.log("CHECK HEADER", r);
                            
                            callback(r.data)
                        })
            },
            FormatItems(menuItems, parentArr, Floorplan_Fixture_ID, callback) {
                let self = this

                menuItems.forEach((item, idx) => {
                    let reqObj = {
                        ID: item.saveID,
                        Planogram_ID: self.planogram_ID,
                        Attributes: JSON.stringify(item.attrs),
                        Floorplan_Fixture_ID: item.attrs.DropID,
                        guid: item.guid,
                        children: []
                    }

                    if (reqObj.guid == undefined || reqObj.guid == null) {
                        console.log("FormatItems", reqObj);

                        reqObj.guid = self.guid()
                    }

                    parentArr.push(reqObj)
                    if (item.children.length > 0) {
                        self.FormatItems(item.children, reqObj.children, item.attrs.DropID, recCall => {})
                    }
                    if (idx + 1 == menuItems.length) {
                        callback()
                    }
                })
            },
            save() {
                let self = this
                axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                self.$refs.spinner.show()
                self.stage.batchDraw()
                axios.post(process.env.VUE_APP_API + `FloorplanFixtureHeader?&Planogram_ID=${self.planogram_ID}`).then(
                    r => {
                        console.log("[header]", r);

                        if (r.data != null) {
                            self.saveArr = []
                            console.log(self.stage.children[1].children);

                            self.FormatItems(self.stage.children[1].children, self.saveArr, 0, callback => {
                                console.log("self.saveArr", self.saveArr);

                                console.log(self.saveArr)
                                axios.post(process.env.VUE_APP_API +
                                        `FloorplanFixtureItem?Header_id=${r.data.id}`, self.saveArr)
                                    .then(resp => {
                                        self.$refs.spinner.hide()
                                    })
                            })
                        } else {
                            self.$refs.spinner.hide()
                        }
                    })
            },
            changeRotation() {
                let self = this
                let rotation = parseFloat(self.properties.rotation)
                self.selectedItem.rotation(rotation)
                self.selectedLayer.draw()
                self.$nextTick(() => {
                    self.stage.batchDraw()
                })

            },
            guid() {
                function s4() {
                    return Math.floor((1 + Math.random()) * 0x10000)
                        .toString(16)
                        .substring(1);
                }
                return (
                    s4() +
                    s4() +
                    "-" +
                    s4() +
                    "-" +
                    s4() +
                    "-" +
                    s4() +
                    "-" +
                    s4() +
                    s4() +
                    s4()
                );
            },
            reDraw() {
                let self = this
                let item
                self.stage.find('Transformer').destroy()
                self.drops.forEach(drop => {
                    if (self.selectedItem.attrs.DropID == drop.id) {
                        item = drop
                    }
                })
                console.log("redreaw", item);

                let tmp
                self.findKonvaItem(self.selectedLayer.children, item.id, callback => {
                    console.log("callback", callback);
                    console.log(item);
                    let asd = self.selectedLayer.children.splice(callback.count, 1)
                    tmp = asd[0]
                    console.log("[REDRAW]--item", tmp);


                    if (self.properties.shape == "Circle") {
                        let circle = new Circle(self.selectedLayer, {
                            x: tmp.attrs.x,
                            y: tmp.attrs.y,
                        }, null, {
                            radius: item.width,
                            color: "#1976d2"
                        });
                        circle.shape.setAttrs({
                            width: item.width,
                        })
                        circle.shape.attrs.DropID = item.id.toString()
                    } else {
                        console.log("square", tmp);
                        let rect = new Rect(self.selectedLayer, {
                            x: tmp.attrs.x,
                            y: tmp.attrs.y,
                        }, null, null, null, self.imageSrc(item.id, "Top"));
                        rect.shape.setAttrs({
                            width: item.width,
                            height: item.height
                        })
                        rect.shape.attrs.rotation = parseFloat(self.properties.rotation)
                        console.log("rect", rect);

                        rect.shape.attrs.DropID = item.id.toString()
                    }
                })
                self.stage.batchDraw()
                tmp = null
            },
            findKonvaItem(subMenuItems, id, callback) {
                let self = this
                let retval = null;
                let found = false
                if (subMenuItems) {
                    subMenuItems.forEach((item, idx) => {
                        if (item.attrs.DropID == id && found == false) {
                            retval = item
                            found = true
                            callback({
                                item: item,
                                count: idx
                            })
                            return
                        }
                    })
                }
            },
            getPlanogramData(callback) {
                let self = this
                axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;
                if (self.$route.params.ID != null && self.$route.params.ID != "ID") {
                    self.planogram_ID = self.$route.params.ID
                }

                axios.get(process.env.VUE_APP_API +
                    `FloorPlan_Fixtures/GetFixtures?planogramDetail_ID=${self.planogram_ID}`).then(
                    r => {
                        console.log("getPlanogramData", r.data);
                        self.drops = r.data
                        callback()
                    }).catch(e => {
                    self.$refs.spinner.hide()
                })
            },
            findDrop(target, callback) {
                let self = this
                self.drops.forEach(item => {
                    if (parseInt(target.attrs.DropID) == item.id) {
                        callback(item)
                    }
                })
            },
            setproperties(item) {
                let self = this
                if (item.attrs.rotation) {
                    self.properties.rotation = item.attrs.rotation.toFixed(0)
                }
                console.log("set props------", item.attrs.rotation);
                if (item.attrs.name == "Circle") {
                    self.properties.shape = "Circle"
                } else {
                    self.properties.shape = "Square"
                }
            },
            addStageEvents() {
                let self = this
                let tooltip
                self.stage.on('click tap', function (e) {
                    if (e.target.attrs.name == "Circle" || e.target.attrs.name == "Gondola-Rect") {

                        if (self.selectedItem == null) {
                            self.selectedItem = e.target.parent
                            console.log("self.selectedItem", self.selectedItem);
                            self.selectedItem.draggable(true)
                            self.selectedItem.children.forEach(child => {
                                child.draggable(false)
                            })
                        } else if (self.selectedItem.parent.attrs.name != "planoGroup") {
                            self.selectedItem = e.target
                            console.log("self.selectedItem", self.selectedItem);
                            self.selectedItem.draggable(true)
                            self.findDrop(e.target, callback => {
                                self.setproperties(e.target)
                                self.selectedFixtures = callback
                            })
                        } else {
                            self.selectedItem = e.target.parent
                            console.log("self.selectedItem", self.selectedItem);
                            self.selectedItem.draggable(true)
                            self.selectedItem.children.forEach(child => {
                                child.draggable(false)
                            })

                        }
                        self.setproperties(self.selectedItem)
                    }
                    if (e.target === self.stage) {
                        self.stage.find('Transformer').destroy()
                        self.selectedItem = null
                        self.selectedLayer.draw();
                        self.selectedFixtures = null
                        return;
                    }
                    self.stage.find('Transformer').destroy();
                    if (self.selectedItem.attrs.draggable) {
                        var tr = new Konva.Transformer({
                            enabledAnchors: [],
                            boundBoxFunc: function (oldBoundBox, newBoundBox) {
                                if (self.ctrlDown) {
                                    return oldBoundBox;
                                }
                                return newBoundBox;
                            },
                            ignoreStroke: true
                        });
                        self.selectedItem.parent.add(tr);

                        tr.attachTo(self.selectedItem);
                        tr.on('transform', function (z) {
                            console.log("transform");
                            self.findDrop(e.target, callback => {
                                console.log(callback);

                                callback.rotation = e.target.attrs.rotation
                            })
                        });
                        self.stage.batchDraw();
                    }
                });

                self.stage.on('dragmove', function (e) {

                    let snappingHandler = new SnappingHandler()
                    // clear all previous lines on the screen
                    self.stage.find('.guid-line').destroy();

                    // find possible snapping lines
                    var lineGuideStops = snappingHandler.getLineGuideStops(e.target, self.stage, self
                        .snapableItems);

                    // find snapping points of current object
                    var itemBounds = snappingHandler.getObjectSnappingEdges(e.target, self.stage);

                    // now find where can we snap current object
                    var guides = snappingHandler.getGuides(lineGuideStops, itemBounds, self.stage);

                    // do nothing of no snapping
                    if (!guides.length) {
                        return;
                    }

                    snappingHandler.drawGuides(guides, self.stage, self.selectedLayer);

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

                self.stage.on('dragend', (e) => {
                    self.stage.find('.guid-line').destroy();

                    // // clear all previous lines on the screen
                    // self.stage.find('.guid-line').destroy();
                    // let transform = self.stage.getAbsoluteTransform().copy();
                    // transform.invert();
                    // // let pos = self.stage.getPointerPosition();

                    // console.log("drag evvent", e);
                    // let abs = e.target.absolutePosition()


                    // let dropPos = transform.point({
                    //     x: e.target.attrs.x,
                    //     y: e.target.attrs.y
                    // });

                    // e.target.setAttrs({
                    //     x: dropPos.x,
                    //     y: dropPos.y
                    // })


                    self.stage.batchDraw();
                })
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
                        x: -(mousePointTo.x - self.stage.getPointerPosition().x / newScale) *
                            newScale,
                        y: -(mousePointTo.y - self.stage.getPointerPosition().y / newScale) *
                            newScale
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
                self.selectedLayer.on("mouseover", (e) => {
                    console.log("mouseover", e.target);
                    self.findDrop(e.target, drop => {
                        tooltip = new Konva.Label({
                            x: e.target.attrs.x,
                            y: e.target.attrs.y,
                            opacity: 0.75
                        });

                        tooltip.add(
                            new Konva.Tag({
                                fill: 'black',
                                pointerDirection: 'down',
                                pointerWidth: 10,
                                pointerHeight: 10,
                                lineJoin: 'round',
                                shadowColor: 'black',
                                shadowBlur: 10,
                                shadowOffsetX: 10,
                                shadowOffsetY: 10,
                                shadowOpacity: 0.5
                            })
                        );
                        tooltip.add(
                            new Konva.Text({
                                text: drop.name,
                                fontFamily: 'Calibri',
                                fontSize: 18,
                                padding: 5,
                                fill: 'white'
                            })
                        );
                        e.target.parent.add(tooltip)
                        self.stage.batchDraw()
                    })

                })
                self.selectedLayer.on("mouseout", (e) => {
                    console.log(e.target);
                    tooltip.destroy()
                    self.stage.batchDraw();
                })
            },
            imageSrc(imgID, type) {
                let self = this;
                if (imgID != null && imgID != undefined) {
                    return process.env.VUE_APP_API + `FloorplanFixture?mapImageID=${imgID}&type=${type}`
                } else {
                    return ""
                }

            },
            drawGrid() {
                let self = this
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
                var padding = 10 * KonvaRatio;

                for (var i = 0; i < width / padding; i++) {
                    gridLayer.add(new Konva.Line({
                        points: [Math.round(i * padding) + 0.5, 0, Math.round(i * padding) +
                            0.5,
                            height
                        ],
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
                        strokeWidth: 1,
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
                let group = new Konva.Group({
                    name: 'planoGroup',
                    visible: true,
                    selected: true,
                    showChildren: true,
                    drawType: "Group"
                });
                startLayer.add(group)
                self.selectedLayer = group
                self.stage.add(startLayer);
            },
            addEvents() {
                let self = this;
                let keyMoveAmount = 0.5
                document.addEventListener('keydown', function (event) {
                    const key = event.key;
                    switch (key) {
                        case "ArrowLeft": {
                            if (self.selectedItem != null) {
                                self.selectedItem.x(self.selectedItem.attrs.x - keyMoveAmount)
                                self.stage.batchDraw()
                            }
                        }
                        break;
                    case "ArrowRight": {
                        if (self.selectedItem != null) {
                            self.selectedItem.x(self.selectedItem.attrs.x + keyMoveAmount)
                            self.stage.batchDraw()

                        }
                    }
                    break;
                    case "ArrowDown": {
                        if (self.selectedItem != null) {
                            self.selectedItem.y(self.selectedItem.attrs.y + keyMoveAmount)
                            self.stage.batchDraw()
                        }
                    }
                    break;
                    case "ArrowUp": {
                        if (self.selectedItem != null) {
                            self.selectedItem.y(self.selectedItem.attrs.y - keyMoveAmount)
                            self.stage.batchDraw()
                        }
                    }
                    break;

                    default:
                        break;
                    }

                });
            },
            addShape(parent, item, callback) {
                let self = this
                let shape = JSON.parse(item.attributes)

                console.log("Shape", shape)

                switch (shape.name) {
                    case "Gondola-Rect": {
                        let rect = new Rect(parent, {
                            x: shape.x,
                            y: shape.y
                        }, null, null, null, self.imageSrc(item.floorplan_Fixture_ID,
                            "Top"), self.stage);
                        rect.shape.attrs = shape
                        rect.shape.saveID = item.id
                        rect.shape.guid = item.guid
                        rect.shape.setAttrs({
                            width: shape.width,
                            height: shape.height,
                            depth: shape.depth,
                            DropID: shape.DropID,
                            rotation: shape.rotation
                        })


                    }
                    break;
                case "circle": {
                    let circle = new Circle(self.selectedLayer, {
                        x: 0,
                        y: 0,
                    }, null, {
                        radius: shape.radius,
                        depth: shape.depth,
                        color: "#1976d2"
                    });
                    circle.shape.attrs = shape
                    circle.shape.setAttrs({
                        x: shape.x,
                        y: shape.y,
                        width: shape.width,
                        DropID: shape.DropID,
                    })
                    circle.shape.saveID = item.id
                    circle.shape.guid = item.guid
                    console.log("SHAPE", shape);

                    self.findDrop(circle.shape, drop => {
                        drop.shape = "Circle"
                    })
                }
                break;
                default:
                    break;
                }
                callback()

            },
            drawSaved(cb) {
                let self = this
                self.getSavedData(cb.id, data => {
                    console.log('[GETSAVEDDATA]', data);
                    let shape = JSON.parse(data[0].attributes)

                    self.selectedLayer.attrs = shape
                    data[0].children.forEach((item, idx) => {
                        self.addShape(self.selectedLayer, item, callback => {
                            if (idx == data[0].children.length - 1) {
                                self.$refs.spinner.hide()
                            }

                        })
                    })

                    console.log("[drawSaved]-----selectedLayer", self.selectedLayer);

                })
            },
            getSavedData(header, callback) {
                let self = this
                axios.defaults.headers.common["TenantID"] = sessionStorage.currentDatabase;

                axios.get(process.env.VUE_APP_API +
                    `FloorplanItems/Exisitng?headerID=${header}`).then(r => {
                    callback(r.data)
                })
            },
            initialise() {
                let self = this;
                self.$refs.spinner.show()
                self.addEvents()
                self.checkForHeader(cb => {
                    self.drawGrid()
                    self.addStageEvents()
                    self.stage.batchDraw()
                    console.log("stage", self.stage);
                    self.getPlanogramData(callback => {
                        if (cb == null) {
                            let widthInc = 0
                            let lastPos = 50
                            self.drops.forEach((element, idx) => {

                                if (element.shape == "Circle") {
                                    let circle = new Circle(self.selectedLayer, {
                                        x: 0,
                                        y: 0,
                                    }, null, {
                                        radius: element.width,
                                        color: "#1976d2"
                                    });
                                    circle.shape.setAttrs({
                                        width: element.width,
                                        depth: element.depth,
                                        DropID: element.id.toString()
                                    })
                                    circle.shape.parent.setAttrs({
                                        x: lastPos,
                                        y: 75
                                    })
                                    circle.shape.attrs.DropID = element.id.toString()
                                    lastPos = circle.shape.attrs.x + element.width
                                    circle.shape.draggable(true)

                                } else {
                                    element.shape = "Square"
                                    let rect = new Rect(self.selectedLayer, {
                                        x: 0,
                                        y: 0,
                                    }, null, null, null, self.imageSrc(element
                                        .id,
                                        "Top"));
                                    rect.shape.setAttrs({
                                        width: element.width,
                                        height: element.height,
                                        depth: element.depth,

                                        draggable: true
                                    })
                                    rect.shape.setAttrs({
                                        x: lastPos,
                                        y: 50
                                    })

                                    rect.shape.setAttrs({
                                        width: element.width,
                                        height: element.height,
                                    })
                                    console.log("rect", rect);
                                    rect.shape.attrs.DropID = element.id
                                        .toString()
                                    lastPos = rect.shape.attrs.x + element.width
                                    rect.shape.draggable(true)

                                }

                                widthInc = element.width
                                self.snapableItems.push("." + element.id.toString())
                                self.stage.batchDraw()
                                self.$refs.spinner.hide()
                            })
                        } else {
                            self.drawSaved(cb)
                        }
                    })
                })

            },
            openThreeDee() {
                let self = this;

                console.log(self.selectedLayer.children)

                self.$refs.threeDee.show(self.selectedLayer.children);
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
    }
</script>
<style>
    .highlighted {
        background-color: #1976d2;
    }
</style>