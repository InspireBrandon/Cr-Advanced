// ////////////////////////////////////////////////////////////////////////////////////////////////////
// Purpose: A helper class to assist in the drawing of label holder renderings
// Author: Brandon Lange
// Date: 2020-04-01
// ////////////////////////////////////////////////////////////////////////////////////////////////////

import Boxbase from '../Boxbase.js'

class Rendering_LabelHolder extends Boxbase {
    constructor(params) {
        super(params);
    }

    setPosition() {
        let self = this;
        let parentY = (self.data.parent.data.y + (self.data.parent.data.height * 0.5));

        // self.element.position.x = (self.data.x + 0.5 * self.data.width) / self.pxlToMeterRatio;
        self.element.position.x = self.data.parent.element.position.x;
        self.element.position.y = self.data.parent.element.position.y + ((0.5 * self.data.parent.data.depth) / self.pxlToMeterRatio) - (0.5 * self.data.depth / self.pxlToMeterRatio) - (self.data.offset.y / self.pxlToMeterRatio); // + (0.5 * self.data.parent.data.depth) / self.pxlToMeterRatio;
        self.element.position.z = self.data.parent.element.position.z - ((0.5 * self.data.parent.data.height + 0.2) / self.pxlToMeterRatio);

        if (self.data.rotation != undefined && self.data.rotation != null) {
            let xPivot = -(self.data.width / 2 / self.pxlToMeterRatio);
            let zPivot = self.data.height / 2 / self.pxlToMeterRatio;
            self.element.setPivotPoint(new BABYLON.Vector3(xPivot, 0, zPivot));
            self.element.rotation.y = degreesToRadians(self.data.rotation);
        }
    }
}

export default Rendering_LabelHolder;