<template>
    <div>
        <div id="container"></div>
        <div :class="{ 'key-item-selected': keys.ctrlDown }" class="key-item">CTRL</div>
        <div :class="{ 'key-item-selected': keys.shiftDown }" class="key-item" style="left: 85px;">SHIFT</div>
        <div :class="{ 'key-item-selected': keys.altDown }" class="key-item" style="left: 130px;">ALT</div>
        <div :class="{ 'key-item-selected': modes.lineMode }" class="key-item" style="left: 175px;"
            @click="modes.lineMode = !modes.lineMode">Line</div>
        <div :style="{ 'background': selectedColor }" class="key-item" style="left: 220px;" @click="toggleColor">Color
        </div>
    </div>
</template>

<script>
    import Konva from "konva";
    import {
        color
    } from '@amcharts/amcharts4/core';

    const colors = [
        'red',
        'orange',
        'green',
    ]

    export default {
        data() {
            return {
                keys: {
                    ctrlDown: false,
                    altDown: false,
                    shiftDown: false
                },
                modes: {
                    lineMode: false,
                },
                selectedColor: colors[0],
                stage: null,
                layer: null,
                dragLayer: null,
                selected: []
            };
        },
        mounted() {
            let self = this;
            self.init();
        },
        methods: {
            init() {
                let self = this;

                self.initEvents();

                var width = window.innerWidth;
                var height = window.innerHeight;

                self.stage = new Konva.Stage({
                    container: "container",
                    width: width,
                    height: height
                });

                var rect = new Konva.Rect({
                    x: 20,
                    y: 20,
                    width: 100,
                    height: 50,
                    fill: "#ffffff",
                    stroke: "black",
                    strokeWidth: 2,
                    draggable: true
                });

                rect.on('click', function () {
                    var shapes = self.stage.find('Rect');

                    if (!self.keys.shiftDown) {
                        self.selected = [];
                    }

                    self.selected.push(this);

                    let filtered = shapes.filter(e => {
                        let canAdd = true;

                        let checkItem = self.selected.find(si => {
                            return si == e;
                        })

                        return checkItem == null;
                    })

                    filtered.forEach(shape => {
                        shape.fill('#ffffff');
                    });

                    this.fill('#00D2FF');

                    self.layer.draw();
                });

                self.layer = new Konva.Layer();
                self.layer.add(rect);
                self.stage.add(self.layer);

                self.stage.on('dragstart', function (evt) {
                    self.handleDragStart(evt);
                });

                self.stage.on('click', function (evt) {
                    if (evt.target == self.stage) {
                        if (self.modes.lineMode) {
                            var line = new Konva.Line({
                                x: 100,
                                y: 50,
                                points: [500, 20, 40],
                                stroke: 'red'
                            })

                            self.layer.add(line);
                            self.layer.draw();
                        } else {
                            var shapes = self.stage.find('Rect');

                            shapes.forEach(shape => {
                                shape.fill('#ffffff');
                            })

                            self.selected = [];
                            self.layer.draw();
                        }
                    }
                });

                self.stage.on('dragmove', function (evt) {
                    self.selected.forEach(shape => {
                        if (shape != evt.target) {
                            shape.x(shape.x() + evt.evt.movementX);
                            shape.y(shape.y() + evt.evt.movementY);
                        } else {
                            shape.x(shape.x());
                            shape.y(shape.y());
                        }
                    });

                    self.layer.draw();
                });
            },
            initEvents(e) {
                let self = this;

                window.addEventListener("keydown", e => {
                    e.preventDefault();
                    self.handleKeyDown(e.key);
                });

                window.addEventListener("keyup", e => {
                    e.preventDefault();
                    self.handleKeyUp(e.key);
                });
            },
            handleKeyDown(key) {
                let self = this;

                switch (key.toUpperCase()) {
                    case "CONTROL": {
                        self.keys.ctrlDown = true;
                    }
                    break;
                case "ALT": {
                    self.keys.altDown = true;
                }
                break;
                case "SHIFT": {
                    self.keys.shiftDown = true;
                }
                break;
                case "DELETE": {
                    self.selected.forEach(shape => {
                        shape.destroy();
                    })

                    self.layer.draw();
                }
                break;
                }
            },
            handleKeyUp(key) {
                let self = this;

                switch (key.toUpperCase()) {
                    case "CONTROL": {
                        self.keys.ctrlDown = false;
                    }
                    break;
                case "ALT": {
                    self.keys.altDown = false;
                }
                break;
                case "SHIFT": {
                    self.keys.shiftDown = false;
                }
                break;
                }
            },
            handleDragStart(evt) {
                let self = this;

                var shape = evt.target;

                if (self.keys.altDown) {
                    self.selected.forEach(shape => {
                        var newShape = shape.clone();
                        newShape.moveToTop();
                        newShape.fill('#ffffff');
                        self.layer.add(newShape)
                    })

                    self.layer.draw();
                }

                self.selected.forEach(shape => {
                    if (shape != evt.target) {
                        shape.x(shape.x() + evt.evt.movementX);
                        shape.y(shape.y() + evt.evt.movementY);
                    }
                });
            },
            toggleColor() {
                let self = this;

                let colorIdx = colors.indexOf(self.selectedColor);

                if ((colorIdx + 1) == colors.length) {
                    self.selectedColor = colors[0];
                } else {
                    self.selectedColor = colors[colorIdx + 1];
                }
            }
        }
    };
</script>

<style>
    .key-item {
        background: white;
        position: absolute;
        height: 20px;
        width: 40px;
        top: 10px;
        left: 40px;
        font-size: 13px;
        text-align: center;
    }

    .key-item-selected {
        background: blue;
        color: white;
    }
</style>