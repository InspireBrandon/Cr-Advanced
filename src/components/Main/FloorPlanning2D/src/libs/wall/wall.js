import Konva from 'konva';
class Wall {
    constructor(stage, layer, group, data, dropPos) {
        this.Ratio = 10;
        this.MasterGroup = group;
        this.stage = stage;
        this.layer = layer;
        this.dropPos = dropPos;
        this.data = data;
        this.Width = 1 * this.Ratio;
        this.Height = 1 * this.Ratio;
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
        self.MasterGroup.add(self.Group);
        self.layer.draw();
    }
}

export default Wall;