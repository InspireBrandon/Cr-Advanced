import Konva from 'konva'
import Rect from '@/components/Main/FloorPlanning2D/libs/drawing/shape/rect'
import Circle from '@/components/Main/FloorPlanning2D/libs/drawing/shape/circle'
import Line from '@/components/Main/FloorPlanning2D/libs/drawing/shape/line'
import StageImage from '@/components/Main/FloorPlanning2D/libs/drawing/shape/image'
import treeItem from '@/components/Main/FloorPlanning2D/libs/tree/TreeItem'


class DuplicationHelper {
    constructor() {

    }
    DuplicateWall(SelectedItem, Layer, LayerTree, direction, duplicationSequence) {
        let rect
        let brush = {
            height: SelectedItem.attrs.height,
            color: SelectedItem.attrs.fill,
        }
        switch (direction) {
            case "UP":
                rect = new Line(Layer, {
                    x: SelectedItem.attrs.x,
                    y: SelectedItem.attrs.y - (SelectedItem.attrs
                        .height * duplicationSequence.up),
                }, brush);
                break;
            case "RIGHT":
                rect = new Line(Layer, {
                    x: SelectedItem.attrs.x + (SelectedItem.attrs
                        .width * duplicationSequence.right),
                    y: SelectedItem.attrs.y,
                }, brush);
                break;
            case "LEFT":
                rect = new Line(Layer, {
                    x: SelectedItem.attrs.x - (SelectedItem.attrs
                        .width * duplicationSequence.left),
                    y: SelectedItem.attrs.y,
                }, brush);
                break;
            case "DOWN":
                rect = new Line(Layer, {
                    x: SelectedItem.attrs.x,
                    y: SelectedItem.attrs.y + (SelectedItem.attrs
                        .height * duplicationSequence.down),
                }, brush);
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
        let brush = {
            height: SelectedItem.attrs.radius,
            color: SelectedItem.attrs.fill,
        }
        switch (direction) {
            case "UP":
                circle = new Circle(Layer, {
                    x: SelectedItem.attrs.x,
                    y: SelectedItem.attrs.y - ((SelectedItem.attrs
                        .radius * 2) * duplicationSequence.up),
                }, null, brush);
                break;
            case "RIGHT":
                circle = new Circle(Layer, {
                    x: SelectedItem.attrs.x + ((SelectedItem.attrs
                        .radius * 2) * duplicationSequence.right),
                    y: SelectedItem.attrs.y,
                }, null, brush);
                break;
            case "LEFT":
                circle = new Circle(Layer, {
                    x: SelectedItem.attrs.x - ((SelectedItem.attrs
                        .radius * 2) * duplicationSequence.left),
                    y: SelectedItem.attrs.y,
                }, null, brush);
                break;
            case "DOWN":
                circle = new Circle(Layer, {
                    x: SelectedItem.attrs.x,
                    y: SelectedItem.attrs.y + ((SelectedItem.attrs
                        .radius * 2) * duplicationSequence.down),
                }, null, brush);
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
        let brush = {
            height: SelectedItem.children[0].attrs.height,
            width: SelectedItem.children[0].attrs.width,
            color: SelectedItem.children[0].attrs.fill,
        }
        console.log("SelectedItem", SelectedItem);

        switch (direction) {
            case "UP":
                rect = new Rect(Layer, {
                    x: SelectedItem.children[0].attrs.x,
                    y: SelectedItem.children[0].attrs.y - (SelectedItem.children[0].attrs
                        .height * duplicationSequence.up),
                }, null, null, brush);
                // console.log("[NEW RECT]", rect);

                break;
            case "RIGHT":
                rect = new Rect(Layer, {
                    x: (SelectedItem.children[0].attrs.x) + (SelectedItem.children[0].attrs
                        .width * duplicationSequence.right),
                    y: (SelectedItem.children[0].attrs.y),
                }, null, null, brush);

                break;
            case "LEFT":
                rect = new Rect(Layer, {
                    x: (SelectedItem.children[0].attrs.x) - (SelectedItem.children[0].attrs
                        .width * duplicationSequence.left),
                    y: (SelectedItem.children[0].attrs.y),
                }, null, null, brush);

                break;
            case "DOWN":
                rect = new Rect(Layer, {
                    x: (SelectedItem.children[0].attrs.x),
                    y: (SelectedItem.children[0].attrs.y) + (SelectedItem.children[0].attrs
                        .height * duplicationSequence.down),
                }, null, null, brush);
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
            scaleY: 1,
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
                        // rotation: dupItem.rotation()
                    })
                }
            })

        })
        rect.shape.parent.setAttrs({
            x: SelectedItem.attrs.x,
            y: SelectedItem.attrs.y,
        })
        rect.shape.parent.rotation(SelectedItem.rotation())
        Layer.draw()
    }
    DuplicateRectGroupDrag(SelectedItem, Layer, LayerTree) {
        let brush = {
            height: SelectedItem.children[0].attrs.height,
            width: SelectedItem.children[0].attrs.width,
            color: SelectedItem.children[0].attrs.fill,
        }
        let rect = new Rect(Layer, {
            x: (SelectedItem.children[0].attrs.x),
            y: (SelectedItem.children[0].attrs.y),
        }, null, null, brush);
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
            scaleY: 1,
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
                        // rotation: dupItem.rotation()
                    })
                }
            })

        })
        rect.shape.parent.setAttrs({
            x: SelectedItem.attrs.x,
            y: SelectedItem.attrs.y,
        })
        rect.shape.parent.rotation(SelectedItem.rotation())

        Layer.draw()
    }
    DuplicateCircleDrag(SelectedItem, Layer, LayerTree) {
        let brush = {
            radius: SelectedItem.attrs.radius,
            color: SelectedItem.attrs.fill,
        }
        let circle = new Circle(Layer, {
            x: SelectedItem.attrs.x,
            y: SelectedItem.attrs.y,
        }, null, brush);

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
            scaleY: 1,
            draggable: true,
        })
        Layer.draw()
    }
    DuplicateWallDrag(SelectedItem, Layer, LayerTree) {
        let brush = {
            height: SelectedItem.attrs.height,
            color: SelectedItem.attrs.fill,
        }
        let rect = new Line(Layer, {
            x: SelectedItem.attrs.x,
            y: SelectedItem.attrs.y,
        }, brush);
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
            draggable: true,
            rotation: SelectedItem.rotation()
        })
        Layer.draw()
    }

}

export default DuplicationHelper;