import Konva from 'konva'
import Shape from './shape'

class Circle extends Shape {
    constructor(parent, config, ratio) {
        super(parent);
        if (config == null || config == undefined) {
            config.x = 0
            config.y = 0
        }
        if (ratio == null || ratio == undefined) {
            ratio = 1
        }

        let self = this;

        self.shape = new Konva.Circle({
            x: config.x,
            y: config.y,
            radius: 25 * ratio,
            fill: "#1976d2",
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