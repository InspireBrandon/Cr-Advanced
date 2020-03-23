import Konva from 'konva'
import Rect from '@/components/Main/FloorPlanning2D/libs/drawing/shape/rect'
import Circle from '@/components/Main/FloorPlanning2D/libs/drawing/shape/circle'
import Line from '@/components/Main/FloorPlanning2D/libs/drawing/shape/line'
import StageImage from '@/components/Main/FloorPlanning2D/libs/drawing/shape/image'
import treeItem from '@/components/Main/FloorPlanning2D/libs/tree/TreeItem'


class DuplicationHelper {
    constructor() {

    }
    DuplicateWall(SelectedItem, Layer, LayerTree, direction, duplicationSequence, findLayerItem, callback) {
        let rect
        let layertreeitem
        let group
        let brush = {
            height: SelectedItem.attrs.height,
            color: SelectedItem.attrs.fill,
        }
        if (SelectedItem.parent.attrs.name != "Duplication Group") {
            group = new Konva.Group({
                x: 0,
                y: 0,

                name: "Duplication Group",
                visible: true,
                showEditName: false,
                selected: false,
                showChildren: true,
                draggable: true,
                locked: false,
                drawType: "group",
                type: "group",
            })
            layertreeitem = new treeItem({
                KonvaID: group._id,
                children: [],
                name: "Duplication Group",
                showEditName: false,
                visible: group.visible,
                selected: group.selected,
                showChildren: group.showChildren,
                drawType: "group",
                locked: true,
                parent: LayerTree

            })
            group.setAttrs({
                x: SelectedItem.attrs.x,
                y: SelectedItem.attrs.y
            })
            LayerTree.children.push(layertreeitem)
            Layer.add(group)
        } else {
            group = SelectedItem.parent
            layertreeitem = LayerTree
        }
        switch (direction) {
            case "UP":
                rect = new Line(group, {
                    x: SelectedItem.attrs.x,
                    y: SelectedItem.attrs.y - (SelectedItem.attrs
                        .height * duplicationSequence.up),
                }, brush);
                break;
            case "RIGHT":
                rect = new Line(group, {
                    x: SelectedItem.attrs.x + (SelectedItem.attrs
                        .width * duplicationSequence.right),
                    y: SelectedItem.attrs.y,
                }, brush);
                break;
            case "LEFT":
                rect = new Line(group, {
                    x: SelectedItem.attrs.x - (SelectedItem.attrs
                        .width * duplicationSequence.left),
                    y: SelectedItem.attrs.y,
                }, brush);
                break;
            case "DOWN":
                rect = new Line(group, {
                    x: SelectedItem.attrs.x,
                    y: SelectedItem.attrs.y + (SelectedItem.attrs
                        .height * duplicationSequence.down),
                }, brush);
                break;

            default:
                break;
        }


        layertreeitem.children.push(new treeItem({
            KonvaID: rect.shape._id,
            visible: true,
            showEditName: true,
            selected: true,
            showChildren: true,
            draggable: true,
            name: "wall",
            children: [],
            parent: layertreeitem
        }))
        rect.shape.setAttrs({
            width: SelectedItem.width() * SelectedItem
                .scaleY().toFixed(2),
            height: SelectedItem.height() * SelectedItem
                .scaleY().toFixed(2),
            scaleX: 1,
            scaleY: 1,
            rotation: SelectedItem.rotation(),
            draggable: false
        })
        SelectedItem.moveTo(group)
        findLayerItem(LayerTree.children, SelectedItem._id, cb => {
            if (cb.parent != layertreeitem) {
                cb.parent.children.forEach((element, idx) => {
                    if (element == cb) {
                        let SplicItem = cb.parent.children.splice(idx, 1)
                        SplicItem[0].parent = layertreeitem
                        layertreeitem.children.push(SplicItem[0])
                    }
                });
            }
        })

        Layer.draw()
        callback({
            layer: layertreeitem,
            item: rect.shape
        })
    }
    DuplicateCircle(SelectedItem, Layer, LayerTree, direction, duplicationSequence, findLayerItem, callback) {
        let circle
        let group
        let layertreeitem
        let brush = {
            height: SelectedItem.attrs.radius,
            color: SelectedItem.attrs.fill,
        }
        if (SelectedItem.parent.attrs.name != "Duplication Group") {
            group = new Konva.Group({
                x: 0,
                y: 0,
                name: "Duplication Group",
                visible: true,
                showEditName: false,
                selected: false,
                showChildren: true,
                draggable: true,
                locked: false,
                drawType: "group",
                type: "group",
            })
            console.log("duplicate circle create group;", group);

            layertreeitem = new treeItem({
                KonvaID: group._id,
                children: [],
                name: "Duplication Group",
                showEditName: false,
                visible: group.visible,
                selected: group.selected,
                showChildren: group.showChildren,
                drawType: "group",
                locked: true,
                parent: LayerTree
            })
            LayerTree.children.push(layertreeitem)
            // group.setAttrs({
            //     x: SelectedItem.attrs.x,
            //     y: SelectedItem.attrs.y
            // })
            Layer.add(group)
        } else {
            group = SelectedItem.parent
            layertreeitem = LayerTree
        }
        switch (direction) {
            case "UP":
                circle = new Circle(group, {
                    x: SelectedItem.attrs.x,
                    y: SelectedItem.attrs.y - ((SelectedItem.attrs
                        .radius * 2) * duplicationSequence.up),
                }, null, brush);
                break;
            case "RIGHT":
                circle = new Circle(group, {
                    x: SelectedItem.attrs.x + ((SelectedItem.attrs
                        .radius * 2) * duplicationSequence.right),
                    y: SelectedItem.attrs.y,
                }, null, brush);
                break;
            case "LEFT":
                circle = new Circle(group, {
                    x: SelectedItem.attrs.x - ((SelectedItem.attrs
                        .radius * 2) * duplicationSequence.left),
                    y: SelectedItem.attrs.y,
                }, null, brush);
                break;
            case "DOWN":
                circle = new Circle(group, {
                    x: SelectedItem.attrs.x,
                    y: SelectedItem.attrs.y + ((SelectedItem.attrs
                        .radius * 2) * duplicationSequence.down),
                }, null, brush);
                break;

            default:
                break;
        }



        layertreeitem.children.push(new treeItem({
            KonvaID: circle.shape._id,
            visible: true,
            showEditName: true,
            selected: true,
            showChildren: true,
            draggable: true,
            name: "Circle",
            children: [],
            parent: layertreeitem
        }))
        circle.shape.setAttrs({
            radius: SelectedItem.radius() * SelectedItem
                .scaleY().toFixed(2),
            scaleX: 1,
            scaleY: 1
        })
        SelectedItem.moveTo(group)
        findLayerItem(LayerTree.children, SelectedItem._id, cb => {
            if (cb.parent != layertreeitem) {
                cb.parent.children.forEach((element, idx) => {
                    if (element == cb) {
                        let SplicItem = cb.parent.children.splice(idx, 1)
                        SplicItem[0].parent = layertreeitem
                        layertreeitem.children.push(SplicItem[0])
                    }
                });
            }
        })
        Layer.draw()
        callback({
            layer: layertreeitem,
            item: circle.shape
        })
    }
    DuplicateRectGroup(SelectedItem, Layer, LayerTree, direction, duplicationSequence, findLayerItem, callback) {
        let rect
        let group
        let layertreeitem
        let brush = {
            height: SelectedItem.attrs.height,
            width: SelectedItem.attrs.width,
            color: SelectedItem.attrs.fill,
        }


        if (SelectedItem.parent.attrs.name != "Duplication Group") {
            group = new Konva.Group({
                x: 0,
                y: 0,
                name: "Duplication Group",
                visible: true,
                showEditName: false,
                selected: false,
                showChildren: true,
                draggable: true,
                locked: false,
                drawType: "group",
                type: "group",
            })
            layertreeitem = new treeItem({
                KonvaID: group._id,
                children: [],
                name: "Duplication Group",
                showEditName: false,
                visible: group.visible,
                selected: group.selected,
                showChildren: group.showChildren,
                drawType: "group",
                locked: true,
                parent: LayerTree
            })
            LayerTree.children.push(layertreeitem)
            Layer.add(group)
        } else {
            group = SelectedItem.parent
            layertreeitem = LayerTree
        }
        let dataurl
        let height = SelectedItem.attrs.height
        let width = SelectedItem.attrs.width
        let dottedHeight = 0
        let dottedWidth = 0
        let rotation = SelectedItem.rotation()
        // if(rotation>90&&rotation<180){
        //     rotation=rotation-90
        // }
        // if(rotation>180&&rotation<270){
        //     rotation=rotation-180
        // }
        // if(rotation>270&&rotation<360){
        //     rotation=rotation-270
        // }
        let angle = rotation * (180 / Math.PI);
        if (rotation == 90 || rotation == 180 || rotation == -180 || rotation == 0 || rotation == 270) {
            if (rotation == 90 || rotation == 270) {
                dottedHeight = width
                dottedWidth = height
            } else {
                dottedHeight = height
                dottedWidth = width
            }
        }
        console.log("ROTATION", rotation);
        let rotHeight = Math.abs((width) * Math.sin(angle))
        let rotWidth = Math.abs((width) * Math.cos(angle))

        console.log("height", Math.abs((width) * Math.sin(angle)));
        console.log("width", Math.abs((width) * Math.cos(angle)));
        switch (direction) {
            case "UP":
                rect = new Rect(group, {
                    x: (SelectedItem.attrs.x),
                    y: SelectedItem.attrs.y - (dottedHeight * duplicationSequence.down),
                }, null, null, brush, dataurl);
                break;
            case "RIGHT":
                rect = new Rect(group, {
                    x: (SelectedItem.attrs.x) + (dottedWidth * duplicationSequence.right),
                    y: (SelectedItem.attrs.y),
                }, null, null, brush, dataurl);

                break;
            case "LEFT":
                rect = new Rect(group, {
                    x: (SelectedItem.attrs.x) - (dottedWidth * duplicationSequence.left),
                    y: (SelectedItem.attrs.y),
                }, null, null, brush, dataurl);
                break;
            case "DOWN":
                rect = new Rect(group, {
                    x: (SelectedItem.attrs.x),
                    y: (SelectedItem.attrs.y) + (dottedHeight * duplicationSequence.down)
                }, null, null, brush, dataurl);
                break;

            default:
                break;
        }

        layertreeitem.children.push(new treeItem({
            KonvaID: rect.shape._id,
            visible: true,
            showEditName: true,
            selected: true,
            showChildren: true,
            draggable: true,
            name: "rect-group",
            children: [],
            parent: layertreeitem
        }))
        rect.shape.setAttrs({
            height: SelectedItem.height() * SelectedItem
                .scaleY().toFixed(2),
            width: SelectedItem.width() * SelectedItem
                .scaleX().toFixed(2),
            scaleX: 1,
            scaleY: 1,
            rotation: SelectedItem.attrs.rotation,
            depth: SelectedItem.attrs.depth
        })
        SelectedItem.moveTo(group)
        findLayerItem(LayerTree.children, SelectedItem._id, cb => {
            if (cb.parent != layertreeitem) {
                cb.parent.children.forEach((element, idx) => {
                    if (element == cb) {
                        let SplicItem = cb.parent.children.splice(idx, 1)
                        SplicItem[0].parent = layertreeitem
                        layertreeitem.children.push(SplicItem[0])
                    }
                });
            }
        })
        Layer.draw()
        callback({
            layer: layertreeitem,
            item: rect.shape
        })
    }
    DuplicateRectGroupDrag(SelectedItem, Layer, LayerTree) {
        let brush = {
            height: SelectedItem.attrs.height,
            width: SelectedItem.attrs.width,
            color: SelectedItem.attrs.fill,
        }
        let dataurl
        if (SelectedItem.children.length == 3) {
            dataurl = SelectedItem.children[2].attrs.image.src
        }
        let rect = new Rect(SelectedItem.parent, {
            x: SelectedItem.attrs.x,
            y: SelectedItem.attrs.y,
        }, null, null, brush, dataurl);
        LayerTree.children.push(new treeItem({
            KonvaID: rect.shape._id,
            visible: true,
            showEditName: true,
            selected: true,
            showChildren: true,
            draggable: true,
            name: "rect-group",
            children: [],
            parent: LayerTree
        }))
        rect.shape.setAttrs({
            height: SelectedItem.height() * SelectedItem
                .scaleY().toFixed(2),
            width: SelectedItem.width() * SelectedItem
                .scaleX().toFixed(2),
            depth: SelectedItem.attrs.depth,
            scaleX: 1,
            scaleY: 1,
            rotation: SelectedItem.rotation()
        })
        console.log(SelectedItem.attrs);
        console.log(rect.shape.parent.attrs);
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
            parent: LayerTree
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
            parent: LayerTree
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

    DuplicateImageDrag(SelectedItem, Layer, LayerTree) {
        console.log("SelectedItem", SelectedItem);

        let image = new StageImage(Layer, {
            x: SelectedItem.attrs.x,
            y: SelectedItem.attrs.y
        });
        image.shape.setAttrs({
            height: SelectedItem.attrs.height,
            width: SelectedItem.attrs.width,
            rotation: SelectedItem.rotation()
        })
        LayerTree.children.push(new treeItem({
            KonvaID: image.shape._id,
            visible: true,
            showEditName: true,
            selected: true,
            showChildren: true,
            draggable: true,
            name: "Image",
            children: [],
            parent: LayerTree
        }))

        var imageObj = new Image();

        imageObj.onload = function () {
            image.shape.image(imageObj);
            Layer.draw();
            // self.onToolChange("open_with")
            // self.selectedTool = ''
            image.shape.draggable(true)
        }
        imageObj.src = SelectedItem.attrs.image.src;

    }

}


export default DuplicationHelper;