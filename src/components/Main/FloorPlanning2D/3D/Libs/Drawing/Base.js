// ////////////////////////////////////////////////////////////////////////////////////////////////////
// Purpose: A general helper to assist in the drawing of 3D base shelfs
// Author: Brandon Lange
// Date: 2020-03-23
// ////////////////////////////////////////////////////////////////////////////////////////////////////

import * as BABYLON from "@babylonjs/core/Legacy/legacy";

import Boxbase from './Boxbase.js'

class Base extends Boxbase {
    constructor(params) {
        super(params)
    }

    setPosition() {
        let self = this;

        self.element.position.x = self.data.parent.element.position.x;
        self.element.position.z = self.data.parent.element.position.z;
        // self.element.position.z = -((self.data.y + (self.data.height + 0.35)) / 100);

        self.element.position.y = (((0.5 * self.data.depth) / self.pxlToMeterRatio));

        if (self.data.rotation != undefined && self.data.rotation != null) {
            let xPivot = -(self.data.width / 2 / self.pxlToMeterRatio);
            let zPivot = self.data.height / 2 / self.pxlToMeterRatio;
            self.element.setPivotPoint(new BABYLON.Vector3(xPivot, 0, zPivot));
            self.element.rotation.y = degreesToRadians(self.data.rotation);
        }
    }
}

export default Base;