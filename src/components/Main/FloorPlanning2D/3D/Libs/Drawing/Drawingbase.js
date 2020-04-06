// ////////////////////////////////////////////////////////////////////////////////////////////////////
// Purpose: The root class for all drawing elements (commonality between all drawing classes)
// Author: Brandon Lange
// Date: 2020-03-23
// ////////////////////////////////////////////////////////////////////////////////////////////////////

import * as BABYLON from "@babylonjs/core/Legacy/legacy";

class DrawingBase {
    constructor(params) {
        // this.pxlToMeterRatio = params.data.type == "GONDOLA" ? 100 : 300;
        this.pxlToMeterRatio = 100;
        this.scene = params.scene;
        this.name = params.name;
        this.data = params.data;
        this.element = null;
    }

    setPosition() {
        let self = this;

        // self.element.position.x = self.data.x;
        // self.element.position.y = self.data.y;
        // self.element.position.z = self.data.z;

        if(self.data.type == "GONDOLA") {
            self.element.position.x = (self.data.x + 0.5 * self.data.width) / self.pxlToMeterRatio;
            self.element.position.y = ((self.data.depth / self.pxlToMeterRatio) / 2);
            self.element.position.z = -((self.data.y + 0.5 * self.data.height) / self.pxlToMeterRatio);            
        }
        else {
            self.element.position.x = (self.data.x + 0.5 * self.data.width) / self.pxlToMeterRatio;

            let parentY = (self.data.parent.y + self.data.parent.height);

            self.element.position.y = (((parentY - ((self.data.height / 2) + self.data.y)) / self.pxlToMeterRatio) / 2);
            self.element.position.z = -((self.data.parent.y + (0.5 * self.data.height)) / self.pxlToMeterRatio);
        }

        if (self.data.rotation != undefined && self.data.rotation != null) {
            let xPivot = -(self.data.width / 2 / self.pxlToMeterRatio);
            let zPivot = self.data.height / 2 / self.pxlToMeterRatio;
            self.element.setPivotPoint(new BABYLON.Vector3(xPivot, 0, zPivot));
            self.element.rotation.y = degreesToRadians(self.data.rotation);
        }
    }

    setMaterial() {
        let self = this;

        var retval = {
            material: null,
            faceColors: null,
            faceUV: null,
            wrap: true
        }

        var material = new BABYLON.StandardMaterial("material", self.scene);

        if(self.data.type == "BASE") {
            let image = "https://software.chainresearch.co.za/Server/api/FixtureImage?db=CR-DEVINSPIRE&fixtureImageID=153";
            material.diffuseTexture = new BABYLON.Texture(image, self.scene);
            material.diffuseTexture.hasAlpha = true;

            let faceColors = new Array(6);

            // faceColors[0] = new BABYLON.Color3(1, 0, 0); // Back
            // faceColors[1] = new BABYLON.Color3(1, 0, 0); // Front
            // faceColors[2] = new BABYLON.Color3(1, 1, 0); // Right
            // faceColors[3] = new BABYLON.Color3(1, 1, 0); // Left
            faceColors[4] = new BABYLON.Color4(255, 255, 255, 1); // Top
            faceColors[5] = new BABYLON.Color4(255, 255, 255, 0); // Bottom

            var faceUV = new Array(6);

            for (var i = 0; i < 6; i++) {
                faceUV[i] = new BABYLON.Vector4(0, 0, 0, 0);
            }

            var columns = 1;
            var rows = 1;

            var Ubottom_left = 3 / columns;
            var Vbottom_left = 0;
            var Utop_right = (3 + 1) / columns;
            var Vtop_right = 1 / rows;

            let faceUp = new BABYLON.Vector4(Ubottom_left, Vbottom_left, Utop_right, Vtop_right)

            faceUV[1] = faceUp;
            faceUV[2] = faceUp; // Right
            faceUV[3] = faceUp; // Left
            // faceUV[1] = new BABYLON.Vector4(Ubottom_left, Vbottom_left, Utop_right, Vtop_right);

            retval.faceColors = faceColors;
            retval.faceUV = faceUV;
        }
        else {
            material.diffuseColor = new BABYLON.Color3(0, 0, 1);
            material.diffuseColor.hasAlpha = true;
            material.alpha = 0.5;
        }

        // material.backFaceCulling = false;
        retval.material = material

        return retval;
        // self.element.material = material;
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
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