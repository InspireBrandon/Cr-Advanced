import Konva from 'konva'
import treeItem from '@/components/Main/FloorPlanning2D/libs/tree/TreeItem'
class GroupingHandler {
    constructor() {}

    addItemToGroup(stage, selectedItem, selectedLayer, selectedLayerTree, selectedLayerTreeItem, multiselectGroup, findLayerItem, layerTree, callback) {

        if (selectedLayer.attrs.name == "group" || selectedLayer.attrs.name == "Duplication Group") {
            console.log("[addItemToGroup]-----------------selectedLayer", selectedLayer);
            this.findparentLayer(selectedLayer, cb => {
                selectedLayer = cb
                findLayerItem(layerTree, cb._id, treecb => {
                    selectedLayerTree = treecb
                })
            })
        }
        let group = new Konva.Group({
            name: "group",
            visible: true,
            showEditName: false,
            selected: false,
            showChildren: false,
            draggable: true,
            locked: false,
            drawType: "group",
            type: "group",
        })
        let groupTreeItem = new treeItem({
            KonvaID: group._id,
            children: [],
            name: group.name(),
            showEditName: false,
            visible: group.visible,
            selected: group.selected,
            showChildren: group.showChildren,
            drawType: "group",
            locked: true,
            parent: selectedLayerTree
        })

        selectedLayer.add(group)
        selectedLayerTree.children.push(groupTreeItem)
        for (let index = (multiselectGroup.children.length - 1); index > -1; index--) {
            const element = multiselectGroup.children[index];
            findLayerItem(layerTree, element._id, cb => {
                for (let idx = cb.parent.children.length - 1; idx > -1; idx--) {
                    const child = cb.parent.children[idx];
                    if (child == cb) {
                        let spliceItem = cb.parent.children.splice(idx, 1)
                        groupTreeItem.children.push(spliceItem[0])
                        spliceItem[0].parent = groupTreeItem
                        element.moveTo(group)
                        element.draggable(false)
                        if (index == 0) {
                            group.rotation(multiselectGroup.rotation())
                            stage.batchDraw()
                            callback()
                        }
                    }
                }
            })
        }
    }
    findparentLayer(item, callback) {
        if (item.parent.attrs.drawType == "Layer") {
            callback(item.parent)
        } else {
            this.findparentLayer(item.parent, cb => {
                callback(cb)
            })
        }
    }
    removeItemFromGroup(stage, selectedItem, selectedLayer, selectedLayerTree, selectedLayerTreeItem, multiselectGroup, findLayerItem, layerTree, parent, callback) {
        if ((selectedItem.attrs.drawType == "group" || selectedItem.attrs.name == "Duplication Group") && selectedItem.children.length > 0) {
            for (let index = selectedItem.children.length - 1; index > -1; index--) {
                const element = selectedItem.children[index];
                findLayerItem(layerTree, element._id, cb => {
                    cb.parent.children.forEach((child, idx) => {
                        if (child == cb) {
                            let spliceItem = cb.parent.children.splice(idx, 1)
                            selectedLayerTree.parent.children.push(spliceItem[0])
                            spliceItem[0].parent = selectedLayerTree.parent
                            element.moveTo(parent)
                            // element.setAttrs({
                            //     x: element.attrs.x + selectedItem.attrs.x,
                            //     y: element.attrs.y + selectedItem.attrs.y
                            // })
                            stage.batchDraw()
                        }
                    })
                    if (index == 0) {
                        callback(selectedItem)
                    }
                })
            }
        }
    }
}
export default GroupingHandler