import Konva from 'konva'
import Rect from '@/components/Main/FloorPlanning2D/libs/drawing/shape/rect'
import Circle from '@/components/Main/FloorPlanning2D/libs/drawing/shape/circle'
import Line from '@/components/Main/FloorPlanning2D/libs/drawing/shape/line'
import StageImage from '@/components/Main/FloorPlanning2D/libs/drawing/shape/image'
import treeItem from '@/components/Main/FloorPlanning2D/libs/tree/TreeItem'


class DuplicationHelper {
    constructor() {}
    DuplicateWall(SelectedItem, Layer, LayerTree, direction, duplicationSequence) {
        let rect
        switch (direction) {
            case "UP":
                rect = new Line(Layer, {
                    x: SelectedItem.attrs.x,
                    y: SelectedItem.attrs.y - (SelectedItem.attrs
                        .height * duplicationSequence.up),
                });
                break;
            case "RIGHT":
                rect = new Line(Layer, {
                    x: SelectedItem.attrs.x + (SelectedItem.attrs
                        .width * duplicationSequence.right),
                    y: SelectedItem.attrs.y,
                });
                break;
            case "LEFT":
                rect = new Line(Layer, {
                    x: SelectedItem.attrs.x - (SelectedItem.attrs
                        .width * duplicationSequence.left),
                    y: SelectedItem.attrs.y,
                });
                break;
            case "DOWN":
                rect = new Line(Layer, {
                    x: SelectedItem.attrs.x,
                    y: SelectedItem.attrs.y + (SelectedItem.attrs
                        .height * duplicationSequence.down),
                });
                break;

            default:
                break;
        }


        LayerTree.children.push(new treeItem({
            KonvaID: rect.shape._id,
            visible: true,
            showEditName: true,
            selected: true,
            showChildren: true,
            draggable: true,
            name: "wall",
            children: [],
        }))
        rect.shape.setAttrs({
            width: SelectedItem.width() * SelectedItem
                .scaleY().toFixed(2),
            height: SelectedItem.height() * SelectedItem
                .scaleY().toFixed(2),
            scaleX: 1,
            scaleY: 1,
            rotation: SelectedItem.rotation()
        })
        Layer.draw()
    }
    DuplicateCircle(SelectedItem, Layer, LayerTree, direction, duplicationSequence) {
        let circle

        switch (direction) {
            case "UP":
                circle = new Circle(Layer, {
                    x: SelectedItem.attrs.x,
                    y: SelectedItem.attrs.y - ((SelectedItem.attrs
                        .radius * 2) * duplicationSequence.up),
                });
                break;
            case "RIGHT":
                circle = new Circle(Layer, {
                    x: SelectedItem.attrs.x + ((SelectedItem.attrs
                        .radius * 2) * duplicationSequence.right),
                    y: SelectedItem.attrs.y,
                });
                break;
            case "LEFT":
                circle = new Circle(Layer, {
                    x: SelectedItem.attrs.x - ((SelectedItem.attrs
                        .radius * 2) * duplicationSequence.left),
                    y: SelectedItem.attrs.y,
                });
                break;
            case "DOWN":
                circle = new Circle(Layer, {
                    x: SelectedItem.attrs.x,
                    y: SelectedItem.attrs.y + ((SelectedItem.attrs
                        .radius * 2) * duplicationSequence.down),
                });
                break;

            default:
                break;
        }



        LayerTree.children.push(new treeItem({
            KonvaID: circle.shape._id,
            visible: true,
            showEditName: true,
            selected: true,
            showChildren: true,
            draggable: true,
            name: "Circle",
            children: [],
        }))
        circle.shape.setAttrs({
            radius: SelectedItem.radius() * SelectedItem
                .scaleY().toFixed(2),
            scaleX: 1,
            scaleY: 1
        })
        Layer.draw()

    }
    DuplicateRectGroup(SelectedItem, Layer, LayerTree, direction, duplicationSequence) {
        let rect
        console.log("SelectedItem", SelectedItem);

        switch (direction) {
            case "UP":
                console.log("DuplicateRectGroup", SelectedItem.attrs.xref);

                rect = new Rect(Layer, {
                    x: (SelectedItem.attrs.xref +SelectedItem.attrs.x),
                    y: (SelectedItem.attrs.yref+SelectedItem.attrs.y) - (SelectedItem.attrs
                        .height * duplicationSequence.up),
                });
                break;
            case "RIGHT":
                rect = new Rect(Layer, {
                    x: (SelectedItem.attrs.xref +SelectedItem.attrs.x) + (SelectedItem.children[0].attrs
                        .width * duplicationSequence.right),
                    y: (SelectedItem.attrs.yref+SelectedItem.attrs.y),
                });

                break;
            case "LEFT":
                rect = new Rect(Layer, {
                    x: (SelectedItem.attrs.xref +SelectedItem.attrs.x) - (SelectedItem.children[0].attrs
                        .width * duplicationSequence.left),
                    y: (SelectedItem.attrs.yref+SelectedItem.attrs.y),
                });

                break;
            case "DOWN":
                rect = new Rect(Layer, {
                    x: (SelectedItem.attrs.xref +SelectedItem.attrs.x),
                    y: (SelectedItem.attrs.yref+SelectedItem.attrs.y) + (SelectedItem.children[0].attrs
                        .height * duplicationSequence.down),
                });
                break;

            default:
                break;
        }

        LayerTree.children.push(new treeItem({
            KonvaID: rect.shape.parent._id,
            visible: true,
            showEditName: true,
            selected: true,
            showChildren: true,
            draggable: true,
            name: "rect-group",
            children: [],
        }))

        rect.shape.setAttrs({
            height: SelectedItem.height() * SelectedItem
                .scaleY().toFixed(2),
            width: SelectedItem.width() * SelectedItem
                .scaleX().toFixed(2),
            scaleX: 1,
            scaleY: 1
        })
        rect.shape.parent.children.forEach(item => {
            SelectedItem.children.forEach(dupItem => {
                if (item.attrs.name == dupItem.attrs.name) {
                    item.setAttrs({
                        height: dupItem.height() * dupItem
                            .scaleY().toFixed(2),
                        width: dupItem.width() * dupItem
                            .scaleX().toFixed(2),
                        scaleX: 1,
                        scaleY: 1,
                        rotation: dupItem.rotation()
                    })
                }
            })

        })

        Layer.draw()
    }
    DuplicateRectGroupDrag(SelectedItem, Layer, LayerTree) {
        let rect = new Rect(Layer, {
            x: (SelectedItem.attrs.xref +SelectedItem.attrs.x),
            y: (SelectedItem.attrs.yref+SelectedItem.attrs.y),
        });
        LayerTree.children.push(new treeItem({
            KonvaID: rect.shape.parent._id,
            visible: true,
            showEditName: true,
            selected: true,
            showChildren: true,
            draggable: true,
            name: "rect-group",
            children: [],
        }))

        rect.shape.setAttrs({
            height: SelectedItem.height() * SelectedItem
                .scaleY().toFixed(2),
            width: SelectedItem.width() * SelectedItem
                .scaleX().toFixed(2),
            scaleX: 1,
            scaleY: 1
        })
        rect.shape.parent.children.forEach(item => {
            SelectedItem.children.forEach(dupItem => {
                if (item.attrs.name == dupItem.attrs.name) {
                    item.setAttrs({
                        height: dupItem.height() * dupItem
                            .scaleY().toFixed(2),
                        width: dupItem.width() * dupItem
                            .scaleX().toFixed(2),
                        scaleX: 1,
                        scaleY: 1,
                        rotation: dupItem.rotation()
                    })
                }
            })

        })

        Layer.draw()
    }
    DuplicateCircleDrag(SelectedItem, Layer, LayerTree) {
        let circle = new Circle(Layer, {
            x: SelectedItem.attrs.x,
            y: SelectedItem.attrs.y,
        });

        LayerTree.children.push(new treeItem({
            KonvaID: circle.shape._id,
            visible: true,
            showEditName: true,
            selected: true,
            showChildren: true,
            draggable: true,
            name: "Circle",
            children: [],
        }))
        circle.shape.setAttrs({
            radius: SelectedItem.radius() * SelectedItem
                .scaleY().toFixed(2),
            scaleX: 1,
            scaleY: 1
        })
        Layer.draw()
    }
    DuplicateWallDrag(SelectedItem, Layer, LayerTree) {

        let rect = new Line(Layer, {
            x: SelectedItem.attrs.x,
            y: SelectedItem.attrs.y,
        });
        LayerTree.children.push(new treeItem({
            KonvaID: rect.shape._id,
            visible: true,
            showEditName: true,
            selected: true,
            showChildren: true,
            draggable: true,
            name: "wall",
            children: [],
        }))
        rect.shape.setAttrs({
            width: SelectedItem.width() * SelectedItem
                .scaleY().toFixed(2),
            height: SelectedItem.height() * SelectedItem
                .scaleY().toFixed(2),
            scaleX: 1,
            scaleY: 1,
            rotation: SelectedItem.rotation()
        })
        Layer.draw()
    }

}

export default DuplicationHelper;