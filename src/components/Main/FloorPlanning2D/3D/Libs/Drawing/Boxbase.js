// ////////////////////////////////////////////////////////////////////////////////////////////////////
// Purpose: A helper class to assist in the drawing of 3D blocks
// Author: Brandon Lange
// Date: 2020-03-25
// ////////////////////////////////////////////////////////////////////////////////////////////////////

import * as BABYLON from "@babylonjs/core/Legacy/legacy";

import Drawingbase from './Drawingbase.js'

class Boxbase extends Drawingbase {
    constructor(params) {
        super(params);
    }

    draw() {
        let self = this;

        self.element = BABYLON.MeshBuilder.CreateBox(
            this.name, {
                height: self.data.depth / self.pxlToMeterRatio,
                width: self.data.width / self.pxlToMeterRatio,
                depth: self.data.height / self.pxlToMeterRatio,
            },
            this.scene);

        self.setPosition();

        console.log(self.element)
    }
}

export default Boxbase;