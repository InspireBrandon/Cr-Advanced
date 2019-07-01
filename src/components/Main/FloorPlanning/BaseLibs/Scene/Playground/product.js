import * as BABYLON from '@babylonjs/core/Legacy/legacy';

class Product {
    constructor(world) {
        this.world = world;
        this.mode = "MOVE"
    }

    addBox() {
        let self = this;
        var myMaterial = new BABYLON.StandardMaterial("myMaterial", this.world.scene);
        let url = localStorage.ServerAddress + 'ProductImage?rng=' + Math.random() + '&folder=000000018&file=82223.1&compress=true'
        myMaterial.diffuseTexture = new BABYLON.Texture(url, this.world.scene);

        var box = BABYLON.MeshBuilder.CreateBox("box", {
            height: 5,
            width: 5,
            depth: 2,
            updatable: true
        }, self.world.scene, true);

        box.position.x = 0;
        box.position.y = 1;
        box.position.z = 0;
        box.material = myMaterial;

        var localOrigin = self.localAxes(6);	
		  
        localOrigin.parent = box;
        box.position = new BABYLON.Vector3(20, 30, 40);
        box.rotation.y = Math.PI/4;
        box.setPositionWithLocalVector(new BABYLON.Vector3(0, 0, 2));
    }

    addLots() {
        let self = this;

        for (var i = 0; i < 10; i++) {
            self.addBox();
        }
    }

    localAxes = function(size) {
        let self = this;

        var pilot_local_axisX = BABYLON.Mesh.CreateLines("pilot_local_axisX", [
            new BABYLON.Vector3.Zero(), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, 0.05 * size, 0),
            new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)
        ], self.world.scene);

        pilot_local_axisX.color = new BABYLON.Color3(1, 0, 0);

        var pilot_local_axisY = BABYLON.Mesh.CreateLines("pilot_local_axisY", [
            new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(-0.05 * size, size * 0.95, 0),
            new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(0.05 * size, size * 0.95, 0)
        ], self.world.scene);

        pilot_local_axisY.color = new BABYLON.Color3(0, 1, 0);

        var pilot_local_axisZ = BABYLON.Mesh.CreateLines("pilot_local_axisZ", [
            new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3(0, -0.05 * size, size * 0.95),
            new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3(0, 0.05 * size, size * 0.95)
        ], self.world.scene);

        pilot_local_axisZ.color = new BABYLON.Color3(0, 0, 1);

        var local_origin = BABYLON.MeshBuilder.CreateBox("local_origin", {
            size: 1
        }, self.world.scene);
        local_origin.isVisible = false;

        pilot_local_axisX.parent = local_origin;
        pilot_local_axisY.parent = local_origin;
        pilot_local_axisZ.parent = local_origin;

        return local_origin;

    }
}

export default Product;