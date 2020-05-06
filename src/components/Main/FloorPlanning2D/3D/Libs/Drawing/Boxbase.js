// ////////////////////////////////////////////////////////////////////////////////////////////////////
// Purpose: A helper class to assist in the drawing of 3D blocks
// Author: Brandon Lange
// Date: 2020-03-25
// ////////////////////////////////////////////////////////////////////////////////////////////////////

import * as BABYLON from "@babylonjs/core/Legacy/legacy";

import Drawingbase from './Drawingbase.js'
import CubeHelper from './CubeHelper.js'

class Boxbase extends Drawingbase {
    constructor(params) {
        super(params);
    }

    draw() {
        let self = this;

        let config;

        if(self.data.type == "GONDOLA" || self.data.type == "OBSTRUCTION") {
            config = {
                height: self.data.depth / self.pxlToMeterRatio,
                width: self.data.width / self.pxlToMeterRatio,
                depth: self.data.height / self.pxlToMeterRatio
            }
        }
        else {
            config = {
                height: self.data.depth / self.pxlToMeterRatio,
                width: self.data.width / self.pxlToMeterRatio,
                depth: self.data.height / self.pxlToMeterRatio
            }
        }

        var ch = new CubeHelper();
        self.element = ch.createCube(self.data, config, self.scene);
        self.setPosition();
        self.element.receiveShadows = true;
    }
}

export default Boxbase;