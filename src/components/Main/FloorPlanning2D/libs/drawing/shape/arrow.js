import Konva from 'konva'
import Shape from './shape'

class Arrow extends Shape {
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

        self.shape = new Konva.Arrow({
            points:[config.x, config.y],
            pointerLength: 20,
            pointerWidth: 20,
            stroke:"black",
            strokeWidth:4,
            fill: "#1976d2",
            draggable: true,
            visible: 'inherit',
            enabledAnchors: self.enabledAnchors,
            name: "arrow"
        });

        parent.add(self.shape);
        parent.draw();
    }
}

export default Arrow;