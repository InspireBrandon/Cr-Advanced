// ////////////////////////////////////////////////////////////////////////////////////////////////////
// Purpose: A general helper to assist in the drawing of 3D baskets
// Author: Brandon Lange
// Date: 2020-04-23
// ////////////////////////////////////////////////////////////////////////////////////////////////////

import * as BABYLON from "@babylonjs/core/Legacy/legacy";

import Boxbase from './Boxbase.js'

class Basket extends Boxbase {
    constructor(params) {
        super(params)
    }

    setPosition() {
        let self = this;

        let parentElement = self.data.parent.element;

        self.element.position.x = parentElement.position.x;

        // self.element.position.x = (self.data.x + 0.5 * self.data.width) / 100;

        console.log(self.data.parent);

        let pcDiff = self.data.parent.data.height - self.data.height - 0.1;
        self.element.position.z = parentElement.position.z;

        let parentY = self.data.parent.data.y + (self.data.parent.data.height);
        let childY = self.data.y + (self.data.depth);

        if (childY < 0) {
            childY = childY * -1
        }

        let diff = parentY - childY;


        self.element.position.y = 0.3;

        // self.element.position.y = (self.data.parent.data.y + diff) / 300;

        if (self.data.rotation != undefined && self.data.rotation != null) {
            let xPivot = -(self.data.width / 2 / self.pxlToMeterRatio);
            let zPivot = self.data.height / 2 / self.pxlToMeterRatio;
            self.element.setPivotPoint(new BABYLON.Vector3(xPivot, 0, zPivot));
            self.element.rotation.y = degreesToRadians(self.data.rotation);
        }
    }
}

export default Basket;