// ////////////////////////////////////////////////////////////////////////////////////////////////////
// Purpose: A helper class to assist in the drawing of side face renderings
// Author: Brandon Lange
// Date: 2020-04-01
// ////////////////////////////////////////////////////////////////////////////////////////////////////

import Boxbase from '../Boxbase.js'

class Rendering_SideFace extends Boxbase {
    constructor(params) {
        params.data.height = params.data.width;
        params.data.width = params.data.parent.data.width;

        params.data.color.rotate();
        params.data.imageID.rotate();
        params.data.mirrored.rotate();
        params.data.transparency.rotate();

        params.data.transparency.front = true;
        params.data.transparency.back = true;
        params.data.transparency.top = true;
        params.data.transparency.bottom = true;

        super(params);
    }

    setPosition() {
        let self = this;
        let parentY = (self.data.parent.data.y + (self.data.parent.data.height * 0.5));

        self.element.position.x = self.data.parent.element.position.x;
        self.element.position.y = self.data.parent.element.position.y + ((0.5 * (self.data.parent.data.depth - self.data.depth)) / self.pxlToMeterRatio); // (((parentY - ((self.data.depth) + self.data.y)) / self.pxlToMeterRatio) / 2);
        self.element.position.z = self.data.parent.element.position.z;

        if (self.data.rotation != undefined && self.data.rotation != null) {
            let xPivot = -(self.data.width / 2 / self.pxlToMeterRatio);
            let zPivot = self.data.height / 2 / self.pxlToMeterRatio;
            self.element.setPivotPoint(new BABYLON.Vector3(xPivot, 0, zPivot));
            self.element.rotation.y = degreesToRadians(self.data.rotation);
        }
    }
}

export default Rendering_SideFace;