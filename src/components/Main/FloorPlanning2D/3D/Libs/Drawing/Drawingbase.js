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

        let parentElement = self.data.parent.element;
        let parentY = (self.data.parent.data.y + (self.data.parent.data.height * 0.5));

        self.element.position.x = parentElement.position.x;

        let parentBottom = self.data.parent.data.y - (0.5 * self.data.parent.data.depth);

        let childY = parentBottom - (self.data.absoluteY - self.data.parent.data.absoluteY);

        if(childY < 0) {
            childY = childY * -1
        }

        let diff = childY - parentBottom;

        // console.log(parentBottom, childY);
        self.element.position.y = (self.data.parent.data.y + diff + (self.data.depth * 0.5)) / 300 // self.pxlToMeterRatio;

        // self.element.position.y = (((0.5 * self.data.depth) / self.pxlToMeterRatio)); <-- POSITION TO BOTTOM

        // Get difference between parent depth and child depth
        let pcDiff = self.data.parent.data.height - self.data.height - 0.1;
        self.element.position.z = parentElement.position.z + ((0.5 * pcDiff) / self.pxlToMeterRatio);
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