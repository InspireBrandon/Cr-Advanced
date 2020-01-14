import Konva from 'konva'
import Shape from './shape'

class Rect extends Shape {
    constructor(parent,config) {
        super(parent);
        if(config==null||config==undefined){
           config={
               x:0,
               y:0
           }
        }
        let self = this;

        self.create(config)
    }

    create(config) {
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
            x: config.x,
            y: config.y,
            height: 50,
            width: 50,
            fill: "#1976d2",
            // draggable: true,
            visible: 'inherit',
            enabledAnchors: self.enabledAnchors,
            name: "rect"
        });
        self.line = new Konva.Rect({
            x: config.x,
            y: config.y,
            name: "front-Line",
            height: 5,
            width: 50,
            fill: "red",
            // draggable: true,
            visible: true,
        });

        rectGroup.add(self.shape)
        rectGroup.add(self.line)
        self.parent.add(rectGroup);
        console.log("[rectGroup]",rectGroup);
        
        self.parent.draw();
    }
}

export default Rect;