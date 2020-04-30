// ////////////////////////////////////////////////////////////////////////////////////////////////////
// Purpose: The root class for all drawing elements (commonality between all drawing classes)
// Author: Brandon Lange
// Date: 2020-03-23
// ////////////////////////////////////////////////////////////////////////////////////////////////////

import * as BABYLON from "@babylonjs/core/Legacy/legacy";

const sides = ['front', 'back', 'right', 'left', 'top', 'bottom']; // THE ORDER OF THIS ARRAY IS IMPORTANT FOR DRAWING THE RIGHT IMAGES

class DrawingBase {
    constructor(params) {
        this.pxlToMeterRatio = 100;
        this.scene = params.scene;
        this.name = params.name;
        this.data = params.data;
        this.element = null;
    }

    setPosition() {
        let self = this;

        console.log(self.data);

        let parentElement = self.data.parent.element;
        let parentY = (self.data.parent.data.height.y + (self.data.parent.data.height * 0.5));

        self.element.position.x = parentElement.position.x;
        self.element.position.y = parentElement.position.y; // (((parentY - ((self.data.depth) + self.data.y)) / self.pxlToMeterRatio) / 2);
        self.element.position.z = parentElement.position.z;

        // self.element.position.x = (self.data.x + 0.5 * self.data.width) / self.pxlToMeterRatio;
        // self.element.position.y = (((parentY - ((self.data.depth) + self.data.y)) / self.pxlToMeterRatio) / 2);
        // self.element.position.z = -((self.data.parent.data.y + (0.5 * self.data.height)) / self.pxlToMeterRatio);

        // if (self.data.rotation != undefined && self.data.rotation != null) {
        //     let xPivot = -(self.data.width / 2 / self.pxlToMeterRatio);
        //     let zPivot = self.data.height / 2 / self.pxlToMeterRatio;
        //     self.element.setPivotPoint(new BABYLON.Vector3(xPivot, 0, zPivot));
        //     self.element.rotation.y = degreesToRadians(self.data.rotation);
        // }
    }
}

function degreesToRadians(degrees) {
    if (degrees != 0) return degrees / 57.2958;
    else return 0;
}

function radiansToDegrees(radians) {
    if (radians != 0) return radians * 57.2958;
    else return 0;
}

export default DrawingBase;