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
        let rectGroup = new Konva.Group({
            visible: true,
            showEditName: true,
            selected: true,
            showChildren: true,
            draggable: true,
            name:"rect-group",
            width:50,
            height:50

        })

        self.shape = new Konva.Rect({
            height: 50,
            width: 50,
            fill: "#1976d2",
            // draggable: true,
            visible: 'inherit',
            enabledAnchors: self.enabledAnchors,
            name: "rect"
        });
        let line = new Konva.Rect({

            name: "front-Line",
            height: 5,
            width: 50,
            fill: "red",
            // draggable: true,
            visible: true,
        });

        rectGroup.add(self.shape)
        rectGroup.add(line)
        self.parent.add(rectGroup);
        self.parent.draw();
    }
}

export default Rect;