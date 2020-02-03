import Konva from 'konva'
import Shape from './shape'

class Rect extends Shape {
    constructor(parent, config, ratio, name, brush) {
        super(parent);

        if (config == null || config == undefined) {
            config = {
                x: 0,
                y: 0
            }
        }
        if (ratio == null || ratio == undefined) {
            ratio = 1
        }
        if (name == null || name == undefined) {
            name = "rect-group"
        }
        let self = this;

        self.create(config, ratio, name,brush)
    }

    create(config, ratio, name, brush) {
        let self = this;


        self.shape = new Konva.Rect({
            x: config.x,
            y: config.y,
            height: parseFloat(brush.height),
            width: parseFloat(brush.width),
            fill: brush.color,
            // fill: "#1976d2",
            // draggable: true,
            visible: 'inherit',
            enabledAnchors: self.enabledAnchors,
            name: "Gondola-Rect",
            strokeWidth: 1,
            stroke: 'black',
        });
        self.line = new Konva.Rect({
            x: config.x,
            y: config.y,
            name: "front-Line",
            height: 5 * ratio,
            width: parseFloat(brush.width),
            fill: "red",
            // draggable: true,
            visible: true,
            strokeWidth: 1,
            stroke: 'black',
        });

        let rectGroup = new Konva.Group({
            
            visible: true,
            showEditName: true,
            selected: true,
            showChildren: true,
            draggable: true,
            name: name.toString(),
        })

        rectGroup.add(self.shape)
        rectGroup.add(self.line)
        self.parent.add(rectGroup);

        self.parent.draw();
    }
}

export default Rect;