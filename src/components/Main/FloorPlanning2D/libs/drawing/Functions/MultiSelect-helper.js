import Konva from 'konva'

class MultiSelectHelper {
    constructor() {}
    moveChild(item, stage, callback) {
        let transform = stage.getAbsoluteTransform().copy();
        // to detect relative position we need to invert transform
        transform.invert();
        let posasd = item.getAbsolutePosition(); // get abs position
        var pos = transform.point(posasd);
        item.draggable(true)
        item.moveTo(item.tmpParent)

        item.position({
            x: pos.x,
            y: pos.y
        });
        item.tmpParent = null
        callback()
    }

    clearMultiselect(e, multiSelectGroup, stage, callback) {
        for (let index = e.target.children.length - 1; index < e.target.children.length; index--) {
            const element = e.target.children[index];
            if (e.target.children.length == 0) {
                callback(e.target)
                return
            } else {
                this.moveChild(element, stage, cb => {})
            }
        }
    }
    handleMultiselect(multiSelectGroup, selectedLayer, item, callback) {
        if (multiSelectGroup == null || multiSelectGroup == undefined) {
            let multigroup = new Konva.Group({
                name: "MultiSelectGroup",
                visible: true,
                showEditName: false,
                selected: true,
                showChildren: true,
                draggable: true,
                locked: true,
                drawType: "MultiSelectGroup",
            })

            multiSelectGroup = multigroup
            selectedLayer.add(multigroup)
        }
        var pos = item.getAbsolutePosition(); // get abs position
        if (item.tmpParent != null && item.tmpParent != undefined) {
            item.draggable(true)

            item.moveTo(item.tmpParent)
            item.position({
                x: pos.x,
                y: pos.y
            });
            item.tmpParent = null
            if (multiSelectGroup.children.length == 0) {
                multiSelectGroup.destroy()
                multiSelectGroup = null
            }
            callback(multiSelectGroup)
        } else {
            item.draggable(false)
            item.tmpParent = item.parent
            item.moveTo(multiSelectGroup)
            item.position({
                x: pos.x,
                y: pos.y
            });
            callback(multiSelectGroup)
        }

    }
}
export default MultiSelectHelper