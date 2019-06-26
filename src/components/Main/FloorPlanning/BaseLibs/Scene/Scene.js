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
        self.scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
        self.scene.collisionsEnabled = true;

        // self.addCamera('default', 'universal');
        self.addCamera('arc', 'arc');
        self.addCamera('free', 'universal');
        // self.addCamera('free', 'free');
        self.scene.activeCamera = self.availableCameras[0];
        // Add lights to the scene
        var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 1), self.scene);
        var light2 = new BABYLON.HemisphericLight("light2", new BABYLON.Vector3(1, 1, 0), self.scene);
        var light3 = new BABYLON.HemisphericLight("light3", new BABYLON.Vector3(0, 1, -1), self.scene);
        var light4 = new BABYLON.HemisphericLight("light4", new BABYLON.Vector3(0, 1, 1), self.scene);

        return self.scene;
    }

    addCamera(id, type) {
        let self = this;
        switch (type.toUpperCase()) {
            case "FREE": {
                let camera = new BABYLON.FreeCamera(id, new BABYLON.Vector3(0, 10, 50), self.scene);
                camera.attachControl(self.canvas, true);
                camera.wheelPrecision = 50;
                camera.applyGravity = true;
                camera.checkCollisions = true;
                self.availableCameras.push(camera);
            }
            break;
        case "UNIVERSAL": {
            let camera = new BABYLON.UniversalCamera(id, new BABYLON.Vector3(0, 0.1, 0), self.scene);
            // self.camera = new BABYLON.FlyCamera("FlyCamera", new BABYLON.Vector3(0, 5, -10), self.scene);
            camera.attachControl(self.canvas, true);
            camera.speed = 0.3;
            // camera.wheelPrecision = 50;
            // camera.applyGravity = true;
            camera.checkCollisions = true;
            camera.setTarget(BABYLON.Vector3.Zero());
            // camera.checkCollisions = true;
            // camera.setPosition(new BABYLON.Vector3(0, 10, 50));
            self.availableCameras.push(camera);
        }
        break;
        case "ARC": {
            let camera = new BABYLON.ArcRotateCamera(id, Math.PI / 2, Math.PI / 4, 4, BABYLON.Vector3.Zero(), self.scene);
            camera.attachControl(self.canvas, true);
            camera.wheelPrecision = 50;
            camera.applyGravity = true;
            camera.checkCollisions = true;
            camera.setPosition(new BABYLON.Vector3(0, 10, 50));
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

    MoveCameraThrough(scene, camera, MyCurve) {
        const path3d = new BABYLON.Path3D(MyCurve.getPoints());
        const tangents = path3d.getTangents(); // array of tangents to the curve
        const normals = path3d.getNormals(); // array of normals to the curve
        const binormals = path3d.getBinormals(); // array of binormals to curve
        const speed = 30 * Math.floor(Math.random() * (7 - 3 + 1)) + 3; // const speed = 1
        const animationPosition = new BABYLON.Animation('animPos', 'position', speed, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        const animationRotation = new BABYLON.Animation('animRot', 'rotation', speed, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        const keysPosition = [];
        const keysRotation = [];

        for (let p = 0; p < MyCurve.getPoints().length; p++) {
            keysPosition.push({
                frame: p,
                value: MyCurve.getPoints()[p]
            });
            keysRotation.push({
                frame: p,
                value: BABYLON.Vector3.RotationFromAxis(normals[p], binormals[p], tangents[p])
            });
        }
        animationPosition.setKeys(keysPosition);
        animationRotation.setKeys(keysRotation);

        camera.animations = [
            animationPosition,
            animationRotation
        ];
        scene.beginAnimation(camera, 0, 200, false);
    }

    MyPath(CameraPosition, GoalPosition) {

        var path = [];
        for (var i = 0; i < 11; i++) {
            var directionalVector = new BABYLON.Vector3((GoalPosition.x - CameraPosition.x), (GoalPosition.y - CameraPosition.y), (GoalPosition.z - CameraPosition.z))
            var X = CameraPosition.x + directionalVector.x * 0.1 * i;
            var Y = CameraPosition.y + directionalVector.y * 0.1 * i;
            var Z = CameraPosition.z + directionalVector.z * 0.1 * i;
            path.push(new BABYLON.Vector3(X, Y, Z));
        }
        const catmullRom = BABYLON.Curve3.CreateCatmullRomSpline(path, 20);
        return catmullRom;
    }

    MoveCamera() {
        let self = this;
        var MyGoal = new BABYLON.Vector3(5, 1, 0);
        var MyCurve = MyPath(camera2.position, MyGoal);
        self.MoveCameraThrough(scene, camera2, MyCurve);
    }
}

export default Scene;