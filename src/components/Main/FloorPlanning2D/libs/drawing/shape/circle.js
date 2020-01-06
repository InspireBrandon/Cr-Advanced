import Konva from 'konva'
import Shape from './shape'

class Circle extends Shape {
    constructor(parent) {
        super(parent);

        let self = this;

        self.shape = new Konva.Circle({
            radius: 25,
            fill: "#1976d2",
            draggable: true,
            visible: 'inherit',
            enabledAnchors: self.enabledAnchors
        });

        parent.add(self.shape);
        parent.draw();
    }
}

export default Circle;