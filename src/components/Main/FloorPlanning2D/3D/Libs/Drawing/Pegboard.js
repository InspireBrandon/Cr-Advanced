// ////////////////////////////////////////////////////////////////////////////////////////////////////
// Purpose: A helper class to assist in the drawing of Pegboards
// Author: Brandon Lange
// Date: 2020-05-04
// ////////////////////////////////////////////////////////////////////////////////////////////////////

import Boxbase from './Boxbase.js'

class Pegboard extends Boxbase {
    constructor(params) {
        super(params);
    }

    setPosition() {
        let self = this;

        let parentElement = self.data.parent.element;
        let parentData = self.data.parent.data;

        self.element.position.x = parentElement.position.x;

        // self.element.position.x = (self.data.x + 0.5 * self.data.width) / 100;

        let pcDiff = self.data.parent.data.height - self.data.height - 0.1;
        self.element.position.z = parentElement.position.z + ((0.5 * pcDiff) / self.pxlToMeterRatio);

        // let parentY = self.data.parent.data.y + (self.data.parent.data.height);

        // let childY = self.data.absoluteY + (self.data.depth);

        // if (childY < 0) {
        //     childY = childY * -1
        // }

        let parentY = parentData.absoluteY;
        let childY = self.data.absoluteY;    

        let parentHeight = parentData.depth;
        let childHeight = self.data.depth;

        let diff = ((parentY - childY) + (parentHeight - childHeight)) / 100;

        console.log('diff', diff, parentHeight, childHeight);

        // self.element.position.y = (self.data.parent.data.y - (diff) + (self.data.depth)) / 100

        self.element.position.y = parentElement.position.y + (0.5 * diff); // + diffY; // self.data.parent.data.y + (self.data.depth / 100);

        if (self.data.rotation != undefined && self.data.rotation != null) {
            let xPivot = -(self.data.width / 2 / self.pxlToMeterRatio);
            let zPivot = self.data.height / 2 / self.pxlToMeterRatio;
            self.element.setPivotPoint(new BABYLON.Vector3(xPivot, 0, zPivot));
            self.element.rotation.y = degreesToRadians(self.data.rotation);
        }
    }
}

export default Pegboard;