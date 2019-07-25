import Konva from 'konva';

class Wall {
    constructor(stage, layer, group, data, dropPos) {
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

        self.addAnchor(0, 0, 'topLeft');
        self.addAnchor(3 * this.Ratio, 0, 'topRight');
        self.addAnchor(3 * this.Ratio, 138, 'bottomRight');
        self.addAnchor(0, 138, 'bottomLeft');
    }

    update(activeAnchor) {
        var group = activeAnchor.getParent();

        var topLeft = group.get('.topLeft')[0];
        var topRight = group.get('.topRight')[0];
        var bottomRight = group.get('.bottomRight')[0];
        var bottomLeft = group.get('.bottomLeft')[0];

        var image = group.children[0];

        var anchorX = activeAnchor.getX();
        var anchorY = activeAnchor.getY();

        // update anchor positions
        switch (activeAnchor.getName()) {
          case 'topLeft':
            topRight.y(anchorY);
            bottomLeft.x(anchorX);
            break;
          case 'topRight':
            topLeft.y(anchorY);
            bottomRight.x(anchorX);
            break;
          case 'bottomRight':
            bottomLeft.y(anchorY);
            topRight.x(anchorX);
            break;
          case 'bottomLeft':
            bottomRight.y(anchorY);
            topLeft.x(anchorX);
            break;
        }

        image.position(topLeft.position());

        var width = topRight.getX() - topLeft.getX();
        var height = bottomLeft.getY() - topLeft.getY();
        if (width && height) {
          image.width(width);
          image.height(height);
        }
      }

    addAnchor(x, y, name) {
        let self = this;
        let group = self.Group;
        let layer = self.layer;

        let anchor = new Konva.Circle({
            x: x,
            y: y,
            stroke: '#666',
            fill: '#ddd',
            strokeWidth: 0,
            radius: 0,
            name: name,
            draggable: true,
            dragOnTop: false
        })

        group.on('mouseout', function () {
            anchor.strokeWidth(0);
            anchor.radius(0);
        });

        group.on('mouseover touchstart', function () {
            anchor.strokeWidth(1);
            anchor.radius(2);
        });

        anchor.on('dragmove', function () {
            self.update(this);
            layer.draw();
        });

        anchor.on('mousedown touchstart', function () {
            group.draggable(false);
            this.moveToTop();
        });

        anchor.on('dragend', function () {
            group.draggable(true);
            layer.draw();
        });
        
        anchor.on('mouseover', function () {
            var layer = this.getLayer();
            document.body.style.cursor = 'pointer';
            this.strokeWidth(1.5);
            layer.draw();
        });

        anchor.on('mouseout', function () {
            var layer = this.getLayer();
            document.body.style.cursor = 'default';
            this.strokeWidth(1);
            layer.draw();
        });

        console.log(group);

        group.add(anchor);
    }
}

export default Wall;