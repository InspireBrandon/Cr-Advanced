import * as BABYLON from '@babylonjs/core/Legacy/legacy';

class Product {
    constructor (world) {
        this.world = world;
    }

    addBox() {
        let self = this;
        var myMaterial = new BABYLON.StandardMaterial("myMaterial", this.world.scene);
        let url = localStorage.ServerAddress + 'ProductImage?rng=' + Math.random() + '&folder=000000018&file=82223.1&compress=true'
        myMaterial.diffuseTexture = new BABYLON.Texture(url, this.world.scene);

        var myBox = BABYLON.MeshBuilder.CreateBox("myBox", { height: 5, width: 5, depth: 2}, self.world.scene);
        myBox.position.x  =  0;
        myBox.position.y  =  0;
        myBox.position.z  =  0;
        myBox.material = myMaterial;
    }

    addLots() {
        let self = this;
        for (var i = 0 ; i < 10; i ++) {
            self.addBox();
        }
    }
}

export default Product;