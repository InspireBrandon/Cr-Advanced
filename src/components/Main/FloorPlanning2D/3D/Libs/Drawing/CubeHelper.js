// ////////////////////////////////////////////////////////////////////////////////////////////////////
// Purpose: A testing class to create cubes with a parent cube
// Author: Brandon Lange
// Date: 2020-03-25
// ////////////////////////////////////////////////////////////////////////////////////////////////////

import * as BABYLON from "@babylonjs/core/Legacy/legacy";

const sides = ['front', 'back', 'right', 'left', 'top', 'bottom'];

class CubeHelper {
    constructor() {
        let self = this;
    }

    createCube(data, config, scene) {
        let parent = drawParent(scene);

        let tmpSides = ['front', 'back', 'left', 'right'];

        sides.forEach(side => {
            drawSide(side, parent, scene, config, data)
        });

        return parent;
    }
}

function drawParent(scene) {
    let config = {
        height: 2,
        width: 4,
        depth: 8
    }

    let parentCube = BABYLON.MeshBuilder.CreateBox('parent-cube', config, scene);
    parentCube.wireframe = true;

    parentCube.isVisible = false;

    return parentCube;
}

function drawSide(side, parent, scene, config, data) {
    let imageID = data.imageID[side];

    if(imageID != null) {
        let url = "http://160.119.254.66:8807/api/FixtureImage?db=CR-DEVINSPIRE&fixtureImageID="

        var mat1trans = new BABYLON.StandardMaterial("mat1_trans", scene, true);
        mat1trans.diffuseTexture = new BABYLON.Texture(url + imageID, scene);
        mat1trans.emissiveColor = new BABYLON.Color3(1, 1, 1); // self-illuminate
        mat1trans.anisotropicFilteringLevel = 0;
        mat1trans.diffuseTexture.hasAlpha = true;
        mat1trans.backFaceCulling = false;
    
        let sidePositionDetails = getSidePosition(side, config)
    
        var plane1 = BABYLON.MeshBuilder.CreatePlane("plane1", { width: sidePositionDetails.width, height: sidePositionDetails.height }, scene, true, BABYLON.MeshBuilder.DOUBLESIDE);
        plane1.receiveShadows = true;
        plane1.position = new BABYLON.Vector3(0, 0, 0);
        plane1.material = mat1trans; 
        plane1.parent = parent;
        plane1.position.x = sidePositionDetails.position.x;
        plane1.position.y = sidePositionDetails.position.y;
        plane1.position.z = sidePositionDetails.position.z;
    
        applyRotation(side, plane1);
    }

    if(!data.transparency[side]) {
        var mat1trans = new BABYLON.StandardMaterial("mat1_trans", scene, true);
        mat1trans.diffuseColor = new BABYLON.Color3(255, 255, 0);
        mat1trans.emissiveColor = new BABYLON.Color3(1, 1, 1); // self-illuminate
        mat1trans.anisotropicFilteringLevel = 0;
        mat1trans.backFaceCulling = false;
    
        let sidePositionDetails = getSidePosition(side, config)
    
        var plane1 = BABYLON.MeshBuilder.CreatePlane("plane1", { width: sidePositionDetails.width, height: sidePositionDetails.height }, scene, true, BABYLON.MeshBuilder.DOUBLESIDE);
        plane1.receiveShadows = true;
        plane1.position = new BABYLON.Vector3(0, 0, 0);
        plane1.material = mat1trans; 
        plane1.parent = parent;
        plane1.position.x = sidePositionDetails.position.x;
        plane1.position.y = sidePositionDetails.position.y;
        plane1.position.z = sidePositionDetails.position.z;
    
        applyRotation(side, plane1);
    }
}

function getSidePosition(side, config) {
    let sideDetails = {
        dimensions: {
            height: 0,
            width: 0
        },
        position: {
            x: 0,
            y: 0,
            z: 0,
        }
    }

    switch(side) {
        case 'front': {
            sideDetails.height = config.height;
            sideDetails.width = config.width;

            sideDetails.position.z = -0.5 * config.depth;
        }break;
        case 'back': {
            sideDetails.height = config.height;
            sideDetails.width = config.width;

            sideDetails.position.z = 0.5 * config.depth;
        }break;
        case 'left': {
            sideDetails.height = config.height;
            sideDetails.width = config.depth;

            sideDetails.position.x = -0.5 * config.width;

        }break;
        case 'right': {
            sideDetails.height = config.height;
            sideDetails.width = config.depth;

            sideDetails.position.x = 0.5 * config.width;
        }break;
        case 'top': {
            sideDetails.height = config.depth;
            sideDetails.width = config.width;

            sideDetails.position.y = 0.5 * config.height;
        }break;
        case 'bottom': {
            sideDetails.height = config.depth;
            sideDetails.width = config.width;

            sideDetails.position.y = -0.5 * config.height;
        }break;
    }

    return sideDetails;
}

function applyRotation(side, plane1) {
    switch(side) {
        case 'left': {
            plane1.rotate(BABYLON.Axis.Y, Math.PI / 2, BABYLON.Space.WORLD)
        }break;
        case 'right': {
            plane1.rotate(BABYLON.Axis.Y, Math.PI / 2, BABYLON.Space.WORLD)
        }break;
        case 'top': {
            plane1.rotate(BABYLON.Axis.X, Math.PI / 2, BABYLON.Space.WORLD)
        }break;
        case 'bottom': {
            plane1.rotate(BABYLON.Axis.X, Math.PI / 2, BABYLON.Space.WORLD)
        }break;
    }
}

export default CubeHelper;