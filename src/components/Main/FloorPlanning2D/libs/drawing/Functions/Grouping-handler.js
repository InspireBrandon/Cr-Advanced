import Konva from 'konva'
import TransFormerHelper from './TransFormer-Helper'
import treeItem from '@/components/Main/FloorPlanning2D/libs/tree/TreeItem'
let transFormerHelper = new TransFormerHelper()

class GroupingHandler {
    constructor() {

    }

    addItemToGroup(stage, selectedItem, selectedLayer, selectedLayerTree, selectedLayerTreeItem, multiselectGroup, findLayerItem, layerTree, callback) {
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
        console.log("[NEW GROUP ADDED ]",group);
        selectedLayer.add(group)
        console.log("[NEW GROUP ]", group);
        
        selectedLayerTree.children.push(groupTreeItem)
        for (let index = multiselectGroup.children.length - 1; index > -1; index--) {
            const element = multiselectGroup.children[index];
            console.log("[INDEX]==", index);
            console.log("[ADD ITEMS TO GROUUP]element", element);
            findLayerItem(layerTree, element._id, cb => {
                console.log("[HANDLE MULTI]child find layer", cb);
                for (let idx = cb.parent.children.length - 1; idx > -1; idx--) {
                    const child = cb.parent.children[idx];
                    if (child == cb) {
                        let spliceItem = cb.parent.children.splice(idx, 1)
                        groupTreeItem.children.push(spliceItem[0])
                        spliceItem[0].parent = groupTreeItem
                        console.log("[SPLICE ITEM]", spliceItem[0]);
                        element.moveTo(group)
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

    removeItemFromGroup(stage, selectedItem, selectedLayer, selectedLayerTree, selectedLayerTreeItem, multiselectGroup, findLayerItem, layerTree, parent, callback) {
        console.log("[REMOVE ITEM FROM GROUP]selectedIOterm", selectedItem);
        console.log("SELECTED LAYER", selectedLayer);

        if ((selectedItem.attrs.drawType == "group" || selectedItem.attrs.name == "Duplication Group") && selectedItem.children.length > 0) {
            for (let index = selectedItem.children.length - 1; index > -1; index--) {
                const element = selectedItem.children[index];
                findLayerItem(layerTree, element._id, cb => {

                    console.log("[FIND LAYER ITEM]", cb);

                    cb.parent.children.forEach((child, idx) => {
                        if (child == cb) {
                            console.log("CHILD S", child);

                            let spliceItem = cb.parent.children.splice(idx, 1)
                            selectedLayerTree.parent.children.push(spliceItem[0])
                            spliceItem[0].parent = selectedLayerTree.parent
                            console.log("PARENT", parent)

                            element.moveTo(parent)
                            // element.setAttrs({
                            //     x: element.attrs.x + selectedItem.attrs.x,
                            //     y: element.attrs.y + selectedItem.attrs.y
                            // })
                            stage.batchDraw()
                        }
                    })
                    console.log("Index== ", index);
                    if (index == 0) {
                        console.log("[CALLBACK]-------------------");

                        callback(selectedItem)
                    }
                })

            }
        }
    }

}
export default GroupingHandler