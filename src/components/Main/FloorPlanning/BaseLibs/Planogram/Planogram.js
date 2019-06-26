import * as BABYLON from '@babylonjs/core/Legacy/legacy';
import axios from 'axios';
class Planogram {
    constructor(world) {
        this.world = world;
        this.data = null;
        this.fullSegment = null;
        this.TotalSegments = 0;
    }

    addPlanogram(id) {
        let self = this;

        let url = localStorage.ServerAddress + `SystemFile/JSON/Planogram?db=CR-Devinspire&id=${id}&file=config_advanced`;
        axios.get(url)
            .then(result => {
                self.data = result.data.jsonObject;
                self.image = self.getImage(self.data.name);
                self.appendToWorld();
            })
    }

    getImage(name) {
        let self = this;
        let tmpname = "Space Planning\\" + name
        let image = localStorage.ServerAddress + `SystemFile/PlanogramImage?folder=${tmpname}&file=image.png&compress=false&rng=${Math.random()}`;
        return image;
    }

    appendToWorld() {
        let self = this;
        let dimension = self.getDimensions();

        console.log("dimensions", dimension)

        var myMaterial = new BABYLON.StandardMaterial("myMaterial", this.world.scene);

        console.log(self.image);

        myMaterial.diffuseTexture = new BABYLON.Texture(self.image, this.world.scene);
        // myMaterial.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
        myMaterial.diffuseTexture.hasAlpha = true;
        // myMaterial.backFaceCulling = true;
        myMaterial.diffuseTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;

        var columns = 1; // 6 columns
        var rows = 1; // 1 row

        //alien sprite
        var faceUV = new Array(1);
        faceUV[1] = new BABYLON.Vector4(1 / columns, 0, (1 + 1) / columns, 1 / rows);
        //set all faces to same
        // for (var i = 0; i < 6; i++) {
        // }
        //wrap set
        var options = {
            faceUV: faceUV,
            height: dimension.height,
            width: dimension.width,
            depth: dimension.depth,
            wrap: true
        };

        var myBox = BABYLON.MeshBuilder.CreateBox("myBox", options, self.world.scene);
        myBox.position.y = dimension.height / 2; // totalHeight == 0 ? 1 : totalHeight;
        myBox.material = myMaterial;
        myBox.checkCollisions = true;

        // var gizmoManager = new BABYLON.GizmoManager(self.world.scene);
        // gizmoManager.positionGizmoEnabled = true;
        // gizmoManager.rotationGizmoEnabled = true;
        // gizmoManager.scaleGizmoEnabled = true;
        // gizmoManager.boundingBoxGizmoEnabled = true;
        // gizmoManager.usePointerToAttachGizmos = true;
        // gizmoManager.attachToMesh(myBox);

    }

    getDimensions() {
        let self = this;
        let retVal = {
            width: 0,
            height: 0,
            depth: 0
        }

        console.log(self.data);

        let allGondolas = self.data.planogramData.filter((el) => el.Type == "GONDOLA");

        // width

        allGondolas.forEach(element => {
            retVal.width += parseFloat(element.Data.Data.width) / 100;
        });


        // height
        let lastHeight = 0.0;
        allGondolas.forEach(element => {
            if (element.Data.Data.height > lastHeight) {
                lastHeight = parseFloat(element.Data.Data.height);
            }

            retVal.height = lastHeight / 100;
        });


        // depth
        allGondolas.forEach(element => {
            let lastDepth = 0.0;
            if (element.Data.Data.depth > lastDepth) {
                lastDepth = parseFloat(element.Data.Data.depth);
            }

            retVal.depth = lastDepth / 100;
        });

        console.log("BEFORE", retVal)
        retVal.width = parseFloat(retVal.width);
        retVal.height = parseFloat(retVal.height);
        retVal.depth = parseFloat(retVal.depth);

        return retVal;
    }
}

export default Planogram;