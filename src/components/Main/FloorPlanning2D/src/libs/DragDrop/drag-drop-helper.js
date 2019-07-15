import Wall from '@/components/Main/FloorPlanning2D/src/libs/wall/wall.js';
class DragDropHelper {
    constructor() {

    }

    AddWall(stage, layer, data, ev) {
        let self = this;
        let dropPos = self.GetTransformedMousePoint(stage, layer, ev);
        let wall = new Wall(stage, layer, data, dropPos);
        wall.Initialise();
    }

    GetTransformedMousePoint(stage, layer, ev) {
        stage.setPointersPositions(ev);
        let transform = stage.getAbsoluteTransform().copy();
        // to detect relative position we need to invert transform
        transform.invert();
        // now we find relative point
        let pos = stage.getPointerPosition();
        let dropPos = transform.point(pos);

        dropPos.x -= layer.x();
        dropPos.y -= layer.y();

        return dropPos;
    }
}

export default DragDropHelper;