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

        let config;

        if(self.data.type == "GONDOLA" || self.data.type == "OBSTRUCTION") {
            config = {
                height: self.data.depth / self.pxlToMeterRatio,
                width: self.data.width / self.pxlToMeterRatio,
                depth: self.data.height / self.pxlToMeterRatio,
                wrap: true,
            }
        }
        else {
            config = {
                height: self.data.depth / self.pxlToMeterRatio,
                width: self.data.width / self.pxlToMeterRatio,
                depth: self.data.height / self.pxlToMeterRatio,
                wrap: true,
            }
        }

        self.element = BABYLON.MeshBuilder.CreateBox(this.name, config, this.scene);
        self.setMaterialAlt();
        self.setPosition();
        self.element.receiveShadows = true;
    }
}

export default Boxbase;