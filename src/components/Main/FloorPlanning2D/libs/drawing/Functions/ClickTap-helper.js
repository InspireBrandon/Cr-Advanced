import Konva from 'konva'

class ClickTapHelper {
    constructor() {}

    destroyTransformer(stage, callback) {
        stage.find('Transformer').destroy()
        callback()
    }

    setSelectedItem(e, findLayerItem, selectedLayerTreeItem, selectedItem) {
        if (e.attrs.name == "front-Line" || e.attrs.name == "Gondola-Rect") {
            e = e.parent

            findLayerItem(self.layerTree, e.parent._id, callback => {
                selectedLayerTreeItem = callback
            })
            selectedItem = e
        }
    }
    handleSelection(e, stage, selectedLayer, selectedItem, selectedLayerTreeItem, ctrlDown, handleMultiSelect) {
        if (e === stage) {

            selectedLayer.draw();
            selectedItem = null
            selectedLayerTreeItem = null
            return;
        }
        if (e.attrs.name == "Gondola-Rect" || e.attrs.name == "front-Line") {
            e = e.parent
        }
        if (ctrlDown && e.attrs.draggable) {
            handleMultiSelect(e)
        }

    }

}
export default ClickTapHelper