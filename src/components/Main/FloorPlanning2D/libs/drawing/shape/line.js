import Konva from 'konva'
import Shape from './shape'

class Line extends Shape {
    constructor(parent, config,brush) {
        super(parent);

        let self = this;
        self.enabledAnchors = ["middle-right", "middle-left"];
        console.log("LIB WALLS",brush);
        
        self.shape = new Konva.Rect({
            x: config.x,
            y: config.y,
            name: config.name,
            drawType: config.drawType,
            height: parseFloat(brush.height),
            width: 0,
            fill: brush.color,
            // fill: "#1976d2",
            draggable: true,
            visible: 'inherit',
            enabledAnchors: self.enabledAnchors
        });

        parent.add(self.shape);
        parent.draw();
    }
}

export default Line;