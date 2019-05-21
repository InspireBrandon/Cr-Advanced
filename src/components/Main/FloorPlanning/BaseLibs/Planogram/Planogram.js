import * as BABYLON from '@babylonjs/core/Legacy/legacy';
import axios from 'axios';
class Planogram {
    constructor(world) {
        this.world = world;
        this.data = null;
        this.fullSegment = null;
    }

    addPlanogram(id) {
        let self = this;

        let url = localStorage.ServerAddress + "SystemFile/JSON?db=CR-Devinspire&id=313";
        axios.get(url)
        .then(result=> {
            self.data = result.data;
            self.appendToWorld();
        })
    }

    appendToWorld() {
        let self = this;
        let totalWidth = self.data.dimensionData.width;
        let totalHeight = self.data.dimensionData.height;
        
        var myMaterial = new BABYLON.StandardMaterial("myMaterial", this.world.scene);

        myMaterial.diffuseTexture = new BABYLON.Texture(self.data.image, this.world.scene);
        myMaterial.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
        myMaterial.diffuseTexture.hasAlpha = true;
        myMaterial.backFaceCulling = true;
        myMaterial.diffuseTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;

        var myBox = BABYLON.MeshBuilder.CreateBox("myBox", {height: totalHeight, width: totalWidth, depth: 0.48}, self.world.scene);
        myBox.position.y = 1;
        myBox.material = myMaterial;
        myBox.checkCollisions = true;

        console.log("[PLANOGRAM]", "LOADED")
    }
}

export default Planogram;