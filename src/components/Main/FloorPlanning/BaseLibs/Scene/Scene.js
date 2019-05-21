import * as BABYLON from '@babylonjs/core/Legacy/legacy';

class Scene {
    constructor() {
        this.canvas = document.getElementById("renderCanvas"); // Get the canvas element 
        this.engine = new BABYLON.Engine(this.canvas, true); // Generate the BABYLON 3D engine
        this.scene = null;
        this.availableCameras = [];
        this.selectedCamera = 0;
    }

    createScene() {
        let self = this;
        // Create the scene space
        self.scene = new BABYLON.Scene(self.engine);
        self.scene.gravity = new BABYLON.Vector3(-9.81, -9.81, 0);
        self.scene.collisionsEnabled = true;

        // self.addCamera('default', 'universal');
        self.addCamera('arc', 'arc');
        // self.addCamera('free', 'free');
        self.scene.activeCamera = self.availableCameras[0];
        // Add lights to the scene
        var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), self.scene);
        var light2 = new BABYLON.HemisphericLight("light2", new BABYLON.Vector3(0, 1, -1), self.scene);
        //light1.intensity = 0.3;
        // light2.intensity = 0.3;

        // Add and manipulate meshes in the scene
        // var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {
        //     diameter: 2
        // }, self.scene);

        return self.scene;
    }

    addCamera(id, type) {
        let self = this;
        switch (type.toUpperCase()) {
            case "FREE": {
                let camera = new BABYLON.FreeCamera(id, new BABYLON.Vector3(0, 0, -30), self.scene);
                camera.attachControl(self.canvas, true);
                self.availableCameras.push(camera);
            }
            break;
        case "UNIVERSAL": {
            let camera = new BABYLON.UniversalCamera(id, new BABYLON.Vector3(0, 0, -30), self.scene);
            // self.camera = new BABYLON.FlyCamera("FlyCamera", new BABYLON.Vector3(0, 5, -10), self.scene);
            camera.attachControl(self.canvas, true);
            self.availableCameras.push(camera);
        }
        break;
        case "ARC": {
            let camera = new BABYLON.ArcRotateCamera(id, Math.PI / 2, Math.PI / 4, 4, BABYLON.Vector3.Zero(), self.scene);
            camera.attachControl(self.canvas, true);
            camera.wheelPrecision = 50;
            camera.applyGravity = true;
            camera.checkCollisions = true;
            camera.setPosition(new BABYLON.Vector3(0, 10, 100));
            camera.lowerBetaLimit = 0.1;
            camera.upperBetaLimit = (Math.PI / 2) * 0.99;
            self.camera = camera;
            // camera.lowerRadiusLimit = 150;
            self.availableCameras.push(camera);
        }
        break;
        }
    }

    toggleCamera() {
        let self = this;

        if (self.availableCameras.length > 0) {
            self.selectedCamera++;
            if (self.selectedCamera > self.availableCameras.length - 1) {
                self.selectedCamera = 0;
            }

            let selectedCamera = self.availableCameras[self.selectedCamera];
            self.scene.activeCamera = selectedCamera;
            self.camera = selectedCamera;
        }
    }

    applyDefaultCamera() {
        let self = this;
        self.scene.activeCamera = self.camera;
    }

    registerEvents() {
        let self = this;

        self.engine.runRenderLoop(function () {
            self.scene.render();
        });

        window.addEventListener("resize", function () {
            self.engine.resize();
        });
    }
}

export default Scene;