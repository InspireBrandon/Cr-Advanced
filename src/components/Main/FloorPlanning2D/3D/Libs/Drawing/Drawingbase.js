// ////////////////////////////////////////////////////////////////////////////////////////////////////
// Purpose: The root class for all drawing elements (commonality between all drawing classes)
// Author: Brandon Lange
// Date: 2020-03-23
// ////////////////////////////////////////////////////////////////////////////////////////////////////

import * as BABYLON from "@babylonjs/core/Legacy/legacy";

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

        self.element.position.x = (self.data.x + 0.5 * self.data.width) / self.pxlToMeterRatio;
        self.element.position.y = self.data.depth / self.pxlToMeterRatio / 2;
        self.element.position.z = -((self.data.y + 0.5 * self.data.height) / self.pxlToMeterRatio);

        if (self.data.rotation != undefined && self.data.rotation != null) {
            let xPivot = -(self.data.width / 2 / self.pxlToMeterRatio);
            let zPivot = self.data.height / 2 / self.pxlToMeterRatio;
            self.element.setPivotPoint(new BABYLON.Vector3(xPivot, 0, zPivot));
            self.element.rotation.y = degreesToRadians(self.data.rotation);
        }
    }

    setMaterial() {
        let self = this;

        var material = new BABYLON.StandardMaterial("material", self.scene);

        let image = "https://upload.wikimedia.org/wikipedia/commons/8/87/Alaskan_Malamute%2BBlank.png";
        material.diffuseTexture = new BABYLON.Texture(image, self.scene);
        material.diffuseTexture.hasAlpha = true;
        // material.diffuseColor = new BABYLON.Color3(1, 0, 1);
        // material.diffuseColor.hasAlpha = true;
        // material.alpha = 0.8;
        material.backFaceCulling = false;

        self.element.material = material;
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