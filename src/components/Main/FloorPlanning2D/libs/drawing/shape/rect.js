import Konva from 'konva'
import Shape from './shape'
import StageImage from "./image"

class Rect extends Shape {
    constructor(parent, config, ratio, name, brush, dataUrl, stage) {
        super(parent);

        if (config == null || config == undefined) {
            config = {
                x: 0,
                y: 0
            }
        }
        if (ratio == null || ratio == undefined) {
            ratio = 1
        }
        if (name == null || name == undefined) {
            name = "rect-group"
        }
        if (brush == undefined || brush == null) {
            brush = {

                height: 5,
                width: 5

            }
        }
        if (dataUrl == null || dataUrl == undefined) {
            dataUrl = ""
        }
        let self = this;

        self.create(config, ratio, name, brush, dataUrl, stage)
    }

    create(config, ratio, name, brush, dataUrl, stage) {
        let self = this;
        if (dataUrl != "") {
            self.shape = new Konva.Image({
                name: "Gondola-Rect",
                visible: 'inherit',
                x: config.x,
                y: config.y,
                strokeWidth: 1,
                stroke: 'black',
                height: parseFloat(brush.height),
                width: parseFloat(brush.width),
                draggable: true
            })
            var imageObj = new Image();

            imageObj.onload = function () {
                self.shape.image(imageObj);
                self.shape.attrs.image.width = self.shape.attrs.width
                self.shape.attrs.image.height = self.shape.attrs.height
                if (stage != null && stage != undefined) {
                    stage.batchDraw()
                } else {
                    self.parent.draw();
                }
                console.log("[RECT IMAGE DRAW]");

            }
            imageObj.onerror = function () {
                console.log("imageerror--this one");
                imageObj.src = "chevron-right.png";
                // self.shape.fill('#1976d2');
                console.log("shape after error", self.shape);
            }
            imageObj.src = dataUrl;
        } else {
            self.shape = new Konva.Image({
                name: "Gondola-Rect",
                visible: 'inherit',
                x: config.x,
                y: config.y,
                strokeWidth: 0.5,
                stroke: 'black',
                height: parseFloat(brush.height),
                width: parseFloat(brush.width),
                draggable: true
            })
            var imageObj = new Image();

            imageObj.onload = function () {
                self.shape.image(imageObj);
                self.shape.attrs.image.width = self.shape.attrs.width
                self.shape.attrs.image.height = self.shape.attrs.height
                if (stage != null && stage != undefined) {

                    stage.batchDraw()
                } else {

                    self.parent.draw();
                }

            }
            imageObj.onerror = function () {
                console.log("imageerror");
                self.shape.fill('#1976d2');
            }
            imageObj.src = "chevron-right.png";
        }
        self.parent.add(self.shape);
    }
}

export default Rect;