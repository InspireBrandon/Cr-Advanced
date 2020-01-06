import Konva from 'konva'
import Shape from './shape'

class Line extends Shape {
    constructor(parent, config) {
        super(parent);

        let self = this;
        self.enabledAnchors = ["middle-right", "middle-left"];

        self.shape = new Konva.Rect({
            x: config.x,
            y: config.y,
            height: 10,
            width: 0,
            fill: "#1976d2",
            draggable: false,
            visible: 'inherit',
            enabledAnchors: self.enabledAnchors
        });

        parent.add(self.shape);
        parent.draw();
    }
}

export default Line;