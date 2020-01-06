import Konva from 'konva'
import Shape from './shape'

class Rect extends Shape {
    constructor(parent) {
        super(parent);

        let self = this;

        self.create()
    }

    create() {
        let self = this;

        self.shape = new Konva.Rect({
            height: 50,
            width: 50,
            fill: "#1976d2",
            draggable: true,
            visible: 'inherit',
            enabledAnchors: self.enabledAnchors
        });

        self.parent.add(self.shape);
        self.parent.draw();
    }
}

export default Rect;