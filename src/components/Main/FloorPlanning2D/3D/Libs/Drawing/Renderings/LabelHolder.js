// ////////////////////////////////////////////////////////////////////////////////////////////////////
// Purpose: A helper class to assist in the drawing of Label Holders
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
        let parentY = (self.data.parent.y + (self.data.parent.height * 0.5));

        self.element.position.x = (self.data.x + 0.5 * self.data.width) / self.pxlToMeterRatio;
        self.element.position.y = (((parentY - ((self.data.depth) + self.data.y)) / self.pxlToMeterRatio) / 2);
        self.element.position.z = -((self.data.parent.y + (0.5 * self.data.height)) / self.pxlToMeterRatio);

        if (self.data.rotation != undefined && self.data.rotation != null) {
            let xPivot = -(self.data.width / 2 / self.pxlToMeterRatio);
            let zPivot = self.data.height / 2 / self.pxlToMeterRatio;
            self.element.setPivotPoint(new BABYLON.Vector3(xPivot, 0, zPivot));
            self.element.rotation.y = degreesToRadians(self.data.rotation);
        }
    }
}

export default Rendering_LabelHolder;