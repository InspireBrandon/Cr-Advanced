import Konva from 'konva'

class TransFormerHelper {
    constructor() {}

    handleTransform(e, z, handleSnapping, stage, lastPosition, ctrlDown, selectedItem, rotateAroundCenter) {
        handleSnapping(e)
        let transform = stage.getAbsoluteTransform().copy();
        // to detect relative position we need to invert transform
        transform.invert();
        // now we find relative point
        let pos = stage.getPointerPosition();
        let dropPos = transform.point(pos);

        lastPosition.x = dropPos.x
        lastPosition.y = dropPos.y;

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
    handleTransformEnd(selectedItem, properties) {
        if (selectedItem.attrs.name == "rect-group") {
            selectedItem.children.forEach(item => {
                if (item.attrs.name == "front-Line") {
                    item.setAttrs({
                        height: 5,
                        width: item.width() * item
                            .scaleX().toFixed(2),
                        scaleX: 1,
                        scaleY: 1,
                        rotation: item.rotation()
                    });
                } else {
                    item.setAttrs({
                        height: item.height() * item
                            .scaleY().toFixed(2),
                        width: item.width() * item
                            .scaleX().toFixed(2),
                        scaleX: 1,
                        scaleY: 1,

                    });
                    properties.height = item.height().toFixed(2);
                    properties.width = item.width().toFixed(2)
                }
            });
        } else {

            if (selectedItem.attrs.drawType == "label" || selectedItem.attrs.name == "rect-group") {

            } else {
                selectedItem.setAttrs({
                    height: selectedItem.height() * selectedItem
                        .scaleY().toFixed(2),
                    width: selectedItem.width() * selectedItem
                        .scaleX().toFixed(2),
                    scaleX: 1,
                    scaleY: 1
                });
            }
            properties.height = selectedItem.height().toFixed(2);
            properties.width = selectedItem.width().toFixed(2);
        }

    }
}
export default TransFormerHelper