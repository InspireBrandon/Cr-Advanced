// ////////////////////////////////////////////////////////////////////////////////////////////////////
// Purpose: A general helper to assist in the drawing of 3D shelfs
// Author: Brandon Lange
// Date: 2020-03-23
// ////////////////////////////////////////////////////////////////////////////////////////////////////

import * as BABYLON from "@babylonjs/core/Legacy/legacy";

import Boxbase from './Boxbase.js'

class Shelf extends Boxbase {
    constructor(params) {
        super(params);
    }

    setPosition() {
        let self = this;

        let parentElement = self.data.parent.element;
        let parentData = self.data.parent.data;

        self.element.position.x = parentElement.position.x;

        let pcDiff = self.data.parent.data.height - self.data.height - 0.1;
        self.element.position.z = parentElement.position.z + ((0.5 * pcDiff) / self.pxlToMeterRatio);

        // let bottom = parentData.height; 
        let diff =  parentData.depth - self.data.y; // + (0.5 + this.data.height);

        let extra = 0;

        if(parentData.type == 'PEGBOARD') {
            let yDIff = parentData.parent.data.y - parentData.y;
            let heightDIff = parentData.parent.data.depth - parentData.depth;
            let totalDiff = heightDIff + yDIff;
            extra = totalDiff;
        }

        self.element.position.y = ((diff + extra + (parentData.depth * 2) - (self.data.depth)) / 300);

        if (self.data.rotation != undefined && self.data.rotation != null) {
            let xPivot = -(self.data.width / 2 / self.pxlToMeterRatio);
            let zPivot = self.data.height / 2 / self.pxlToMeterRatio;
            self.element.setPivotPoint(new BABYLON.Vector3(xPivot, 0, zPivot));
            self.element.rotation.y = degreesToRadians(self.data.rotation);
        }
    }
}

export default Shelf;