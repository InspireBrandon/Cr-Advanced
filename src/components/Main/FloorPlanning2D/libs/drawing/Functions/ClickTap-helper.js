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
        
        if (ctrlDown && e.attrs.draggable) {
            console.log("HANDLING - CLICK TAP");
            handleMultiSelect(e)
        }

    }

}
export default ClickTapHelper