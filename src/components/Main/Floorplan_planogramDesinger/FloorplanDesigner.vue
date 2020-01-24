<template>
    <div>
        <v-toolbar color="primary" dark>
            <v-toolbar-title>
                Planogram Designer
            </v-toolbar-title>
        </v-toolbar>
        <v-container class="ma-0 pa-0" fluid>
            <v-layout row wrap>
                <v-flex md2>
                    <v-toolbar color="grey darken-3" dark dense>
                        Drops
                    </v-toolbar>
                    <v-card height="100vh" width="100%">
                        <div v-for="(item,idx) in drops" :key="idx">
                            <expansionItem :selectedFixtures="selectedFixtures" :Drop="item" :reDraw="reDraw">
                            </expansionItem>
                            <v-divider></v-divider>
                        </div>
                    </v-card>
                </v-flex>
                <v-flex md10>
                    <v-card tile flat id="stage_container" class="fill-height" :style="{ 'cursor': currentCursor }">
                        <div id="container"></div>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
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


    import expansionItem from "./expansionItem"
    import {
        callbackify
    } from 'util';
    export default {
        components: {
            expansionItem
        },
        data() {
            return {
                selectedItem: null,
                selectedLayer: null,
                stage: null,
                selectedTool: ["open_with"],
                drops: [],
                planogram_ID: null,
                snapableItems: ['.wall', '.rect-group', '.circle'],
                selectedFixtures: null,
            }
        },
        methods: {
            reDraw(item) {
                let self = this
                self.stage.find('Transformer').destroy()
                let tmp
                self.findKonvaItem(self.selectedLayer.children, item.id, callback => {
                    console.log(item);

                    tmp = self.selectedLayer.children.splice(callback.count, 1)
                    console.log("tmp", tmp);

                    if (item.shape == "Circle") {
                        let circle = new Circle(self.selectedLayer, {
                            x: tmp[0].children[0].attrs.x,
                            y: tmp[0].children[0].attrs.y,
                        });
                        circle.shape.setAttrs({
                            width: item.width,
                            name: item.id.toString()
                        })
                    } else {
                        let rect = new Rect(self.selectedLayer, {
                            x: tmp[0].attrs.x,
                            y: tmp[0].attrs.y,
                        }, null, item.id);
                        rect.shape.setAttrs({
                            width: item.width,
                            height: item.height
                        })
                        rect.line.setAttrs({
                            width: item.width,
                        })
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
                        if (item.attrs.name == id && found == false) {
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
                        console.log(r.data);
                        self.drops = r.data
                        callback()
                    })
            },
            findDrop(target, callback) {
                let self = this
                self.drops.forEach(item => {
                    if (parseInt(target.attrs.name) == item.id) {
                        callback(item)
                    }
                })
            },
            addStageEvents() {
                let self = this
                self.stage.on('click tap', function (e) {
                    if (e.target.attrs.name == "front-Line" || e.target.attrs.name == "rect") {
                        e.target = e.target.parent
                        self.selectedItem = e.target
                        self.findDrop(e.target, callback => {
                            self.selectedFixtures = callback
                        })
                    }
                    if (e.target === self.stage) {
                        self.stage.find('Transformer').destroy()
                        self.selectedLayer.draw();
                        self.selectedFixtures = null
                        return;
                    }
                    self.stage.find('Transformer').destroy();
                    if (e.target.attrs.draggable) {
                        self.selectedItem = e.target;
                        self.findDrop(e.target, callback => {
                            self.selectedFixtures = callback
                        })
                        var tr = new Konva.Transformer({
                            enabledAnchors: [],
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
                    // clear all previous lines on the screen
                    self.stage.find('.guid-line').destroy();
                    self.stage.batchDraw();
                })
            },
            imageSrc(imgID, type) {
                let self = this;
                return process.env.VUE_APP_API + `FloorplanFixture?mapImageID=${imgID}&type=${type}`
            },
        },

        mounted() {
            let self = this;
            self.getPlanogramData(callback => {
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
                var padding = 10 * KonvaRatio;

                for (var i = 0; i < width / padding; i++) {
                    gridLayer.add(new Konva.Line({
                        points: [Math.round(i * padding) + 0.5, 0, Math.round(i * padding) + 0.5,
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
                self.selectedLayer = startLayer
                self.stage.add(startLayer);
                let widthInc = 0
                let lastPos = 50
                self.drops.forEach((element, idx) => {

                    if (element.shape == "Circle") {
                        let circle = new Circle(self.selectedLayer, {
                            x: lastPos + widthInc,
                            y: 75,
                        });
                        circle.shape.setAttrs({
                            width: element.width,
                            name: element.id.toString()
                        })
                        lastPos = circle.shape.attrs.x + element.width

                    } else {
                        let rect = new Rect(self.selectedLayer, {
                            x: lastPos + widthInc,
                            y: 50,
                        }, null, element.id, self.imageSrc(element.id, "Top"));
                        rect.shape.setAttrs({
                            width: element.width,
                            height: element.height,
                        })
                        rect.line.setAttrs({
                            width: element.width,
                        })

                        lastPos = rect.shape.attrs.x + element.width

                    }
                    widthInc = element.width

                    self.snapableItems.push("." + element.id.toString())


                });
                self.addStageEvents()
                self.stage.batchDraw()
            })
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