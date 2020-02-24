import Konva from 'konva'
import Shape from './shape'
import StageImage from "./image"

class Area extends Shape {
    constructor(parent, config , brush) {
        super(parent);

        if (config == null || config == undefined) {
            config = {
                x: 0,
                y: 0
            }
        }
       
        let self = this;

        self.create(config,  brush)
    }

    create(config, brush) {
        let self = this;
        console.log("Area brush", brush);
        
        self.shape = new Konva.Rect({
            x: config.x,
            y: config.y,
            height: parseFloat(brush.height),
            width: parseFloat(brush.width),
            fill: brush.color,
            // fill: "#1976d2",
            // fill: rgba(255, 0, 0, 0.5)
            draggable: true,
            visible: 'inherit',
            enabledAnchors: self.enabledAnchors,
            name: "Area",
            opacity: 0.4
        });
        self.parent.add(self.shape);
        self.parent.draw();
    }
}

export default Area;