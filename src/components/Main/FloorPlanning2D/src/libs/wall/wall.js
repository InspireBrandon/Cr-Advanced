import Konva from 'konva';

class Wall {
    constructor(stage, layer, group, data, dropPos) {
        console.log(stage);
        this.Ratio = 10;
        this.MasterGroup = group;
        this.stage = stage;
        this.layer = layer;
        this.dropPos = dropPos;
        this.data = data;
        this.Width = 0.5 * this.Ratio;
        this.Height = 3 * this.Ratio;
        this.Group = null;
        this.Wall = null;
        this.transformer = null;
        this.transformerAttached = false;
    }

    Initialise() {
        let self = this;
        self.Build();
    }

    Build() {
        let self = this;
        self.AddWall();
    }

    AddWall() {
        let self = this;

        self.Group = new Konva.Group({
            x: self.dropPos.x,
            y: self.dropPos.y,
            draggable: true
        });

        self.Wall = new Konva.Rect({
            x: 0,
            y: 0,
            name: "Wall",
            width: self.Width,
            height: self.Height,
            fill: 'red',
        })

        self.Group.add(self.Wall);
        self.MasterGroup.add(self.Group);
        self.layer.draw();



        self.transformer = new Konva.Transformer({
            rotationSnaps: [0, 45, 90, 135, 180, 225, 270, 315]
        });

        self.MasterGroup.add(self.transformer);

        self.Wall.on('mousedown touchstart', function() {
            self.AddTransformer();
        })

        self.stage.on("mousedown touchstart", function(e) {
            if(e.target.attrs.name == undefined || e.target.attrs.name != "Wall" && !e.target.attrs.name.includes("_anchor")) {
                self.RemoveTransFormer();
            }
        })
    }

    AddTransformer() {
        let self = this;
        self.transformer.attachTo(self.Group); 
        self.transformerAttached = true;
        self.layer.draw();
    }

    RemoveTransFormer() {
        let self = this;
        self.transformer.detach();
        self.transformerAttached = false;
        self.layer.draw();
    }
}

export default Wall;