import Konva from 'konva'

class TransFormerHelper {
    constructor() {}

    handleTransform(e, z, handleSnapping, stage, lastPosition, ctrlDown, selectedItem, rotateAroundCenter, transformProperties, propertiesLabel, propertiesLabelVertical) {
      
    }
    handleTransformEnd(selectedItem, properties,blockratio) {
        if (selectedItem.attrs.name == "rect-group") {

            // selectedItem.setAttrs({
            //     height: selectedItem.height() * selectedItem
            //         .scaleY().toFixed(2),
            //     width: selectedItem.width() * selectedItem
            //         .scaleX().toFixed(2),
            // })
            selectedItem.children.forEach(item => {
                item.setAttrs({
                    height: item.height() * item
                        .scaleY().toFixed(2),
                    width: item.width() * item
                        .scaleX().toFixed(2),
                    scaleX: 1,
                    scaleY: 1,
                });
                if (item.attrs.image != undefined) {
                    item.setAttrs({
                        x: selectedItem.children[0].attrs.x,
                        y: selectedItem.children[0].attrs.y
                    })
                }
                properties.height = (item.height()/blockratio).toFixed(2);
                properties.width = (item.width()/blockratio).toFixed(2)
                properties.rotation = selectedItem.rotation().toFixed(2);

            });
        } else {

            if (selectedItem.attrs.drawType == "label" || selectedItem.attrs.name == "rect-group") {

            } else {
                if(selectedItem.rotation()>360){
                    selectedItem.attrs.rotation = selectedItem.rotation()-360
                }
                selectedItem.setAttrs({
                    height: selectedItem.height() * selectedItem
                        .scaleY(),
                    width: selectedItem.width() * selectedItem
                        .scaleX(),
                    scaleX: 1,
                    scaleY: 1
                });
            }
            properties.height = (selectedItem.height()/blockratio).toFixed(2);
            properties.width = (selectedItem.width()/blockratio).toFixed(2);
            properties.rotation = selectedItem.rotation().toFixed(2);
        }

    }
}
export default TransFormerHelper