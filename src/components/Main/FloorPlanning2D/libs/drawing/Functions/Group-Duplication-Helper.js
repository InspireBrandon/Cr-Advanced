import Konva from 'konva'
import Rect from '@/components/Main/FloorPlanning2D/libs/drawing/shape/rect'
import Circle from '@/components/Main/FloorPlanning2D/libs/drawing/shape/circle'
import Line from '@/components/Main/FloorPlanning2D/libs/drawing/shape/line'
import StageImage from '@/components/Main/FloorPlanning2D/libs/drawing/shape/image'
import treeItem from '@/components/Main/FloorPlanning2D/libs/tree/TreeItem'

class DuplicationHelper {
    constructor() {

    }
    duplicateGroupDirection(selectedItem, selectedLayerTree, direction, stage, callback) {
        console.log("selected Item :[group duplication]", selectedItem);

        let group = new Konva.Group({
            name: "group",
            visible: true,
            showEditName: false,
            selected: true,
            showChildren: false,
            draggable: true,
            locked: true,
            drawType: "group",
            type: "group",
        })

        let groupTreeItem = new treeItem({
            KonvaID: group._id,
            children: [],
            name: "Group",
            showEditName: false,
            visible: group.visible,
            selected: group.selected,
            showChildren: group.showChildren,
            drawType: "group",
            locked: true,
            parent: selectedLayerTree.parent
        })
        selectedLayerTree.parent.children.push(groupTreeItem)
        console.log("[DUPLICAATION  ATTRIBUTES] : GROUP ATTRS", selectedItem.attrs);
        console.log("[DUPLICATION] ATTRS", group.attrs);

        // group.attrs = selectedItem.attrs
        group.setAttrs({
            draggable: true,
            rotation: selectedItem.attrs.rotation
        })
        selectedItem.parent.add(group)
        selectedItem.children.forEach(element => {
            this.drawShape(element, group, groupTreeItem)
        });


        let pos = selectedItem.getAbsolutePosition()
        let dimension = selectedItem.getClientRect()
        console.log("dimension", dimension);

        switch (direction) {
            case "UP":
                group.setAttrs({
                    x: (selectedItem.attrs.x),
                    y: (selectedItem.attrs.y) - (dimension.height / stage.attrs.scaleX)
                })
                console.log("[GGROUP DUPLICATUION UP]", group);

                break;
            case "RIGHT":
                group.setAttrs({
                    x: (selectedItem.attrs.x) + (dimension.width / stage.attrs.scaleX),
                    y: (selectedItem.attrs.y)
                })

                break;
            case "LEFT":
                group.setAttrs({
                    x: (selectedItem.attrs.x) - (dimension.width / stage.attrs.scaleX),
                    y: (selectedItem.attrs.y)
                })
                break;
            case "DOWN":
                group.setAttrs({
                    x: (selectedItem.attrs.x),
                    y: (selectedItem.attrs.y) + (dimension.height / stage.attrs.scaleX)
                })
                break;

            default:
                break;
        }
        selectedItem.parent.draw()
        callback(group)

    }
    duplicateGroupDrag(selectedItem, selectedLayerTree) {
        let group = new Konva.Group({
            x: selectedItem.attrs.x,
            y: selectedItem.attrs.y,
            name: "group",
            visible: true,
            showEditName: false,
            selected: true,
            showChildren: false,
            draggable: true,
            locked: true,
            drawType: "group",
            type: "group",
        })

        let groupTreeItem = new treeItem({
            KonvaID: group._id,
            children: [],
            name: "group",
            showEditName: false,
            visible: group.visible,
            selected: group.selected,
            showChildren: group.showChildren,
            drawType: "group",
            locked: true,
            parent: selectedLayerTree
        })
        selectedLayerTree.children.push(groupTreeItem)
        console.log("[DUPLICAATION FDRAG ATTRIBUTES] : GROUP ATTRS", selectedItem.attrs);

        group.setAttrs({
            draggable: true,
            rotation: selectedItem.attrs.rotation
        })
        selectedItem.parent.add(group)
        selectedItem.children.forEach(element => {
            this.drawShape(element, group, groupTreeItem)
        });

    }
    drawShape(item, parent, parentTree) {
        switch (item.attrs.name) {
            case "Duplication Group": {
                let newGroup = new Konva.Group({
                    x: item.attrs.x,
                    y: item.attrs.y,
                    name: "group",
                    visible: true,
                    showEditName: false,
                    selected: true,
                    showChildren: false,
                    draggable: false,
                    locked: true,
                    drawType: "group",
                    type: "group",
                })

                let newgroupTreeItem = new treeItem({
                    KonvaID: newGroup._id,
                    children: [],
                    name: "group",
                    showEditName: false,
                    visible: newGroup.visible,
                    selected: newGroup.selected,
                    showChildren: newGroup.showChildren,
                    drawType: "group",
                    locked: true,
                    parent: parentTree
                })
                parentTree.children.push(newgroupTreeItem)
                newGroup.setAttrs({
                    draggable: false,
                    rotation: item.attrs.rotation
                })
                parent.add(newGroup)
                item.children.forEach(element => {
                    this.drawShape(element, newGroup, newgroupTreeItem)
                });
            }
            case "group": {
                let newGroup = new Konva.Group({
                    x: item.attrs.x,
                    y: item.attrs.y,
                    name: "group",
                    visible: true,
                    showEditName: false,
                    selected: true,
                    showChildren: false,
                    draggable: false,
                    locked: true,
                    drawType: "group",
                    type: "group",
                })

                let newgroupTreeItem = new treeItem({
                    KonvaID: newGroup._id,
                    children: [],
                    name: "group",
                    showEditName: false,
                    visible: newGroup.visible,
                    selected: newGroup.selected,
                    showChildren: newGroup.showChildren,
                    drawType: "group",
                    locked: true,
                    parent: parentTree
                })
                parentTree.children.push(newgroupTreeItem)
                newGroup.setAttrs({
                    draggable: false,
                    rotation: item.attrs.rotation
                })
                parent.add(newGroup)
                item.children.forEach(element => {
                    this.drawShape(element, newGroup, newgroupTreeItem)
                });
            }
            case "circle": {
                let brush = {
                    radius: item.attrs.radius,
                    color: item.attrs.fill,
                }
                let circle = new Circle(parent, {
                    x: item.attrs.x,
                    y: item.attrs.y,
                }, null, brush);

                parentTree.children.push(new treeItem({
                    KonvaID: circle.shape._id,
                    visible: true,
                    showEditName: true,
                    selected: true,
                    showChildren: false,
                    draggable: true,
                    name: "Circle",
                    children: [],
                    parent: parentTree
                }))
                circle.shape.setAttrs({
                    radius: item.attrs.radius * item
                        .scaleY().toFixed(2),
                    scaleX: 1,
                    scaleY: 1,
                    draggable: false,
                    fill: item.attrs.fill,
                    rotation: item.attrs.rotation,
                })
            }
            break;
        case "Gondola-Rect": {
            let brush = {
                height: item.attrs.height,
                width: item.attrs.width,
                color: item.attrs.fill,
            }
            let dataurl
            if (item.children.length == 3) {
                dataurl = item.children[2].attrs.image.src
            }
            let rect = new Rect(parent, {
                x: item.attrs.x,
                y: item.attrs.y,
            }, null, null, brush, dataurl);
            parentTree.children.push(new treeItem({
                KonvaID: rect.shape._id,
                visible: true,
                showEditName: true,
                selected: true,
                showChildren: false,
                draggable: false,
                name: "rect-group",
                children: [],
                parent: parentTree
            }))
            rect.shape.setAttrs({
                draggable: false,
                height: item.height() * item
                    .scaleY().toFixed(2),
                width: item.width() * item
                    .scaleX().toFixed(2),
                depth: item.attrs.depth,
                scaleX: 1,
                scaleY: 1,
                rotation: item.rotation(),

                fill: item.attrs.fill
            })
        }
        break;

        case "wall": {
            let brush = {
                height: item.attrs.height,
                color: item.attrs.fill,
            }
            let rect = new Line(parent, {
                x: item.attrs.x,
                y: item.attrs.y,
            }, brush);
            parentTree.children.push(new treeItem({
                KonvaID: rect.shape._id,
                visible: true,
                showEditName: true,
                selected: true,
                showChildren: false,
                draggable: false,
                name: "wall",
                children: [],
                parent: parentTree
            }))
            rect.shape.setAttrs({
                width: item.width() * item
                    .scaleY().toFixed(2),
                height: item.height() * item
                    .scaleY().toFixed(2),
                scaleX: 1,
                scaleY: 1,
                draggable: true,
                rotation: item.rotation()
            })
        }
        break;
        case "image": {
            let image = new StageImage(parent, {
                x: item.attrs.x,
                y: item.attrs.y
            });
            image.shape.setAttrs({
                height: item.attrs.height,
                width: item.attrs.width,
                rotation: item.rotation()
            })
            parentTree.children.push(new treeItem({
                KonvaID: image.shape._id,
                visible: true,
                showEditName: true,
                selected: true,
                showChildren: false,
                draggable: false,
                name: "Image",
                children: [],
                parent: parentTree
            }))

            var imageObj = new Image();

            imageObj.onload = function () {
                image.shape.image(imageObj);
                image.shape.draggable(false)
            }
            imageObj.src = item.attrs.image.src;
        }
        break

        default:
            break;
        }
    }

}
export default DuplicationHelper