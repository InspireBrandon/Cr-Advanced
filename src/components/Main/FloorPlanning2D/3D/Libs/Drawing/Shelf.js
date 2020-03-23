// ////////////////////////////////////////////////////////////////////////////////////////////////////
// Purpose: A general helper to assist in the drawing of 3D shelfs
// Author: Brandon Lange
// Date: 2020-03-23
// ////////////////////////////////////////////////////////////////////////////////////////////////////

import * as BABYLON from "@babylonjs/core/Legacy/legacy";

class Shelf {
    constructor(scene, element) {
        this.scene = scene;
        this.element = element;
    }

    build() {
        let self = this;

        var shelf = BABYLON.MeshBuilder.CreateBox('', {}, self.scene);
        shelf.position.x = (element.x + 0.5 * element.width) / pxlToMeterRatio; 
    }
}