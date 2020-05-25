import Konva from 'konva'
import Shape from './shape'

class Line extends Shape {
    constructor(parent, config, brush) {
        super(parent);
        if (config.name == null || config.name == undefined) {
            config.name = "wall"
        }
        if (config.drawType == null || config.drawType == undefined) {
            config.drawType = "wall"
        }
        if (brush == null || brush == undefined) {

            brush = {
                height: 10,
                color: "#1976d2"
            }
        }
        let self = this;
        self.enabledAnchors = ["middle-right", "middle-left"];
        console.log("LIB WALLS", brush);

        self.shape = new Konva.Rect({
            x: config.x,
            y: config.y,

            name: config.name,
            drawType: config.drawType,
            height: parseFloat(brush.height),
            width: 0,
            fill: brush.color,
            // fill: "#1976d2",
            draggable: true,
            visible: 'inherit',
            enabledAnchors: self.enabledAnchors
        });

        var tooltip = new Konva.Text({
            text: 'YASSSSS',
            fontFamily: 'Calibri',
            fontSize: 12,
            padding: 5,
            visible: false,
            fill: 'black',
            opacity: 0.75,
            textFill: 'black',
        });

        self.shape.on('mousemove', function (e) {
            tooltip.position({
              x: e.clientX + 5,
              y: e.clientY + 5,
            });

            tooltip.text(
              'node: ' + e.target.name() + ', color: ' + e.target.fill()
            );

            tooltip.show();
            
            parent.draw();
          });

        self.shape.setAttrs({
            depth: 80,
        })

        parent.add(tooltip);
        parent.add(self.shape);

        parent.draw();
    }
}

export default Line;