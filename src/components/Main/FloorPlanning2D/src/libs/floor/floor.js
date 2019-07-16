import Konva from 'konva';
class Floor {
    constructor(stage, layer, group, width, height) {
        this.ratio = 10;
        this.Floor = null;
        this.MasterGroup = group;
        this.stage = stage;
        this.layer = layer;
        this.blockSnapSize = 1 * this.ratio;
        this.width = width * this.ratio;
        this.height = height * this.ratio;
    }

    Initialise() {
        let self = this;
        self.Build();
    }

    Build() {
        this.AddFloorTexture();
        this.AddGrid();
    }
    AddGrid() {
        let self = this;

        let grid = new Konva.Group({
            listening: false,
        });
        let padding = self.blockSnapSize;
        for (var i = 0; i < self.width / padding; i++) {
            grid.add(new Konva.Line({
                points: [Math.round(i * padding) + 0.5, 0, Math.round(i * padding) + 0.5, self.height],
                stroke: '#ddd',
                listening: false,
                strokeWidth: 1,
            }));
        }

        grid.add(new Konva.Line({
            points: [0, 0, 10, 10]
        }));
        for (var j = 0; j < self.height / padding; j++) {
            grid.add(new Konva.Line({
                points: [0, Math.round(j * padding), self.width, Math.round(j * padding)],
                stroke: '#ddd',
                listening: false,
                strokeWidth: 0.5,
            }));
        }
        self.MasterGroup.add(grid);
        self.layer.draw();
    }

    AddFloorTexture() {
        let self = this;
        self.Floor = new Konva.Rect({
            x: 0,
            y: 0,
            width: self.width,
            height: self.height,
            fill: 'grey'
        })
        
        self.Floor.on('mouseenter', function() {
            self.stage.container().style.cursor = 'move';
        })

        self.Floor.on('mouseleave', function() {
            self.stage.container().style.cursor = 'default';
        })

        self.MasterGroup.add(self.Floor);
        self.layer.draw();
    }
}

export default Floor;