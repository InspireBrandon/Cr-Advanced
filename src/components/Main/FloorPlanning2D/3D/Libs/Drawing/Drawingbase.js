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

        let parentY = (self.data.parent.y + (self.data.parent.height * 0.5));

        self.element.position.x = (self.data.x + 0.5 * self.data.width) / self.pxlToMeterRatio;
        self.element.position.y = (((parentY - ((self.data.depth) + self.data.y)) / self.pxlToMeterRatio) / 3);
        self.element.position.z = -((self.data.parent.y + (0.5 * self.data.height)) / self.pxlToMeterRatio);

        if (self.data.rotation != undefined && self.data.rotation != null) {
            let xPivot = -(self.data.width / 2 / self.pxlToMeterRatio);
            let zPivot = self.data.height / 2 / self.pxlToMeterRatio;
            self.element.setPivotPoint(new BABYLON.Vector3(xPivot, 0, zPivot));
            self.element.rotation.y = degreesToRadians(self.data.rotation);
        }
    }

    setMaterialAlt() {
        let self = this;

        console.log(self.data)

        let multi = new BABYLON.MultiMaterial("material", self.scene);
        let url = "http://160.119.254.66:8807/api/FixtureImage?db=CR-DEVINSPIRE&fixtureImageID="

        sides.forEach(side => {
            let material = new BABYLON.StandardMaterial(`${side}-material`, self.scene);
            // material.diffuseColor = new BABYLON.Color4(255, 255, 255, 1);
            // material.diffuseColor.hasAlpha = true;

            if(self.data.imageID[side] != null) {
                material.diffuseTexture = new BABYLON.Texture(url + self.data.imageID[side], self.scene);    
                material.diffuseTexture.hasAlpha = true;
                multi.subMaterials.push(material);
            }
        })

        self.element.subMeshes = [];
        var verticesCount = self.element.getTotalVertices();

        self.element.subMeshes.push(new BABYLON.SubMesh(0, 0, verticesCount, 0, 6, self.element));
        self.element.subMeshes.push(new BABYLON.SubMesh(1, 1, verticesCount, 6, 6, self.element));
        self.element.subMeshes.push(new BABYLON.SubMesh(2, 2, verticesCount, 12, 6, self.element));
        self.element.subMeshes.push(new BABYLON.SubMesh(3, 3, verticesCount, 18, 6, self.element));
        self.element.subMeshes.push(new BABYLON.SubMesh(4, 4, verticesCount, 24, 6, self.element));
        self.element.subMeshes.push(new BABYLON.SubMesh(5, 5, verticesCount, 30, 6, self.element));
        self.element.material = multi;
        // self.element.hasVertexAlpha = true;
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