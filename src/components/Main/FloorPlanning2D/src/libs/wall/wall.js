import Konva from 'konva';
class Wall {
    constructor(stage, layer, data, dropPos) {
        this.Ratio = 10;
        this.stage = stage;
        this.layer = layer;
        this.dropPos = dropPos;
        this.data = data;
        this.Width = 10 * this.Ratio;
        this.Height = 2 * this.Ratio;
        this.Group = null;
        this.Wall = null;
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
            y: self.dropPos.y
        });
        self.Wall = new Konva.Rect({
            x: 0,
            y: 0,
            width: self.Width,
            height: self.Height,
            fill:'red',
            draggable: true,
            // dragBoundFunc: function(pos) {
            //     let x = 0;
            //     let y = 0;
            // }
        })
        self.Group.add(self.Wall);
        self.layer.add(self.Group);
        self.layer.draw();
        console.log("hi")
    }
}

export default Wall;