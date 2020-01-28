import Konva from 'konva'
import Shape from './shape'

class Label extends Shape {
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

        self.shape = new Konva.Text({
            text: 'Some text here',
            drawType: "label",
            x: config.x,
            y: config.y,
            fontSize: 20,
            draggable: true,
            width: 200
        });

        parent.add(self.shape);
        parent.draw();
    }
}

export default Label;