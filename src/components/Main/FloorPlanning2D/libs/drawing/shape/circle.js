import Konva from 'konva'
import Shape from './shape'

class Circle extends Shape {
    constructor(parent, config, ratio, brush) {
        super(parent);
        if (config == null || config == undefined) {
            config.x = 0
            config.y = 0
        }
        if (ratio == null || ratio == undefined) {
            ratio = 1
        }
        if (brush == null || brush == undefined) {
            brush = {
                radius:10,
                color:"#1976d2"
            }
        }
        let self = this;
        console.log("Bursh", brush.radius);

        self.shape = new Konva.Circle({
            x: config.x,
            y: config.y,
            radius: parseFloat(brush.radius),
            fill: brush.color,
            draggable: true,
            visible: 'inherit',
            enabledAnchors: self.enabledAnchors,
            name: "circle"
        });

        parent.add(self.shape);
        parent.draw();
    }
}

export default Circle;