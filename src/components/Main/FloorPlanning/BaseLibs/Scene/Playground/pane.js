import * as BABYLON from '@babylonjs/core/Legacy/legacy';

class Pane {
    constructor(world) {
        this.world = world;
    }

    addPane(width, height, subdivisions) {
        var myMaterial = new BABYLON.StandardMaterial("myMaterial", this.world.scene);
        myMaterial.diffuseTexture = new BABYLON.Texture("https://images.adsttc.com/media/images/5ade/46c7/f197/ccdb/4900/055c/newsletter/featureimage.jpg?1524516540", this.world.scene);
        //https://www.roomsketcher.com/wp-content/uploads/2015/11/RoomSketcher-Office-Layout-2417478.jpg
        // myMaterial.diffuseColor = new BABYLON.Color3(1, 0, 1);
        // let url = localStorage.ServerAddress + 'ProductImage?rng=' + Math.random() + '&folder=000000018&file=82223.1&compress=true'
        // let url = 'https://www.tileafrica.co.za/Images/Products/T0025604/01.jpg';
        // myMaterial.diffuseTexture = new BABYLON.Texture(url, this.world.scene);
        // myMaterial.wireframe = true;

        var myGround = BABYLON.MeshBuilder.CreateGround("ground", {
            width: width,
            height: height,
            subdivisions: subdivisions
        }, this.world.scene, false);

        myGround.receiveShadows = true;
        myGround.checkCollisions = true;
        myGround.material = myMaterial;

        console.log(myGround)
    }
}

export default Pane;