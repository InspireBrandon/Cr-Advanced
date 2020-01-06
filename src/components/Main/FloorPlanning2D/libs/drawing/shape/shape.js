const meterPixelRatio = 3779.5275590551;

class Shape {
    constructor(parent) {
        let self = this;
        self.shape = null;
        self.parent = parent;
        self.enabledAnchors = ["top-left", "top-center", "top-right", "middle-right", "middle-left", "bottom-left", "bottom-center", "bottom-right"];
    }

    setShapeDraggable(draggable) {
        let self = this;
        self.shape.draggable = draggable;
    }
}

export default Shape;