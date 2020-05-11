// ////////////////////////////////////////////////////////////////////////////////////////////////////
// Purpose: A helper class to assist in the drawing of Gondolas
// Author: Brandon Lange
// Date: 2020-04-01
// ////////////////////////////////////////////////////////////////////////////////////////////////////

import Boxbase from './Boxbase.js'

class Gondola extends Boxbase {
    constructor(params) {
        super(params);

        console.log("GONDOLA", params);
    }

    setPosition() {
        let self = this;

        self.element.position.x = (self.data.x + 0.5 * self.data.width) / 100;
        self.element.position.z = -((self.data.y + (self.data.height * 0.5)) / 100);

        self.element.position.y = (((0.5 * self.data.depth) / self.pxlToMeterRatio));

        if (self.data.rotation != undefined && self.data.rotation != null) {
            let xPivot = -(self.data.width / 2 / self.pxlToMeterRatio);
            let zPivot = self.data.height / 2 / self.pxlToMeterRatio;
            self.element.setPivotPoint(new BABYLON.Vector3(xPivot, 0, zPivot));
            self.element.rotation.y = degreesToRadians(self.data.rotation);
        }
    }
}

function degreesToRadians(degrees) {
    if (degrees != 0) return degrees / 57.2958;
    else return 0;
}

export default Gondola;