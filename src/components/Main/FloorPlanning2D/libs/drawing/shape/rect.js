import Konva from 'konva'
import Shape from './shape'

class Rect extends Shape {
    constructor(parent,config,ratio,name) {
        super(parent);
        if(config==null||config==undefined){
           config={
               x:0,
               y:0
           }
        }
        if(ratio==null||ratio==undefined){
            ratio=1
        }
        if(name==null||name==undefined){
            name="rect-group"
        }
        let self = this;
        console.log("[rect] name",name);
        
        self.create(config,ratio,name)
    }

    create(config,ratio,name) {
        let self = this;
        let rectGroup = new Konva.Group({
            visible: true,
            showEditName: true,
            selected: true,
            showChildren: true,
            draggable: true,
            name:name.toString(),
            width:50*ratio,
            height:50*ratio,
          

        })

        self.shape = new Konva.Rect({
            x: config.x,
            y: config.y,
            height: 50*ratio,
            width: 50*ratio,
            fill: "#1976d2",
            // draggable: true,
            visible: 'inherit',
            enabledAnchors: self.enabledAnchors,
            name: "rect",
            strokeWidth:1,
            stroke: 'black',
        });
        self.line = new Konva.Rect({
            x: config.x,
            y: config.y,
            name: "front-Line",
            height: 5*ratio,
            width: 50*ratio,
            fill: "red",
            // draggable: true,
            visible: true,
            strokeWidth:1,
            stroke: 'black',
        });

        rectGroup.add(self.shape)
        rectGroup.add(self.line)
        self.parent.add(rectGroup);
        
        self.parent.draw();
    }
}

export default Rect;