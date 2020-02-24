import Konva from 'konva'

class TransFormerHelper {
    constructor() {}

    handleTransform(e, z, handleSnapping, stage, lastPosition, ctrlDown, selectedItem, rotateAroundCenter, transformProperties, propertiesLabel, propertiesLabelVertical) {
        //   handleSnapping(e)
        let transform = stage.getAbsoluteTransform().copy();
        // to detect relative position we need to invert transform
        transform.invert();
        // now we find relative point
        let pos = stage.getPointerPosition();
        let dropPos = transform.point(pos);

        lastPosition.x = dropPos.x
        lastPosition.y = dropPos.y;

        if (e.attrs.name != "rect-group") {
            transformProperties.height = e.height()
            transformProperties.width = e.width()
            // propertiesLabel.setAttrs({
            //     x: e.attrs.x + (transformProperties.width / 2),
            //     y: e.attrs.y
            // })
            // propertiesLabelVertical.setAttrs({
            //     x: e.attrs.x,
            //     y: e.attrs.y + (transformProperties.height / 2),
            //     rotation: 270
            // })
        } else {
            transformProperties.height = e.children[0].height()
            transformProperties.width = e.children[0].width()
            // propertiesLabel.setAttrs({
            //     x: e.children[0].attrs.x + (transformProperties.width / 2),
            //     y: e.children[0].attrs.y
            // })
            // propertiesLabelVertical.setAttrs({
            //     x: e.children[0].attrs.x,
            //     y: e.children[0].attrs.y + (transformProperties.height / 2),
            //     rotation: 270
            // })
        }


        // propertiesLabel.text((transformProperties.width * e.scaleX()).toFixed())
        // propertiesLabelVertical.text((transformProperties.height * e.scaleY()).toFixed())
        stage.batchDraw()



        // transformProperties.radius = e.target.radius
        if (ctrlDown) {
            if (z.currentTarget.movingResizer == "middle-left") {
                const right = {
                    x: selectedItem.width(),
                    y: selectedItem.height() / 2
                };

                const current = rotatePoint(right, Konva.getAngle(selectedItem.rotation()));
                var deltaX = lastPosition.x - (selectedItem.attrs.x +
                    current.x);
                var deltaY = lastPosition.y - (selectedItem.attrs.y +
                    current.y);

                let hyp = Math.hypot(deltaX, deltaY);

                // selectedItem.width(hyp);

                var rad = Math.atan2(deltaY, deltaX);
                var deg = rad * (180 / Math.PI);
                rotateAroundCenter(selectedItem, (180 + deg), hyp)
            }

            if (z.currentTarget.movingResizer == "middle-right") {
                var deltaX = lastPosition.x - e.attrs.x;
                var deltaY = lastPosition.y - e.attrs.y;

                let hyp = Math.hypot(deltaY, deltaX)
                var rad = Math.atan2(deltaY, deltaX);

                var deg = rad * (180 / Math.PI);
                selectedItem.rotation(deg);

                selectedItem.width(hyp);
            }
        }
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
                        .scaleY().toFixed(2),
                    width: selectedItem.width() * selectedItem
                        .scaleX().toFixed(2),
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