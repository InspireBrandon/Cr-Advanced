class Scene {
    constructor() {
        this.canvas = document.getElementById("renderCanvas"); // Get the canvas element 
        this.engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
        this.scene = null;
        this.camera = null;
    }

    createScene() {
        let self = this;
        // Create the scene space
        self.scene = new BABYLON.Scene(engine);

        // Add a camera to the scene and attach it to the canvas
        self.camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, new BABYLON.Vector3(0, 0, 5), self.scene);
        self.camera.attachControl(self.canvas, true);

        // Add lights to the scene
        var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), self.scene);
        var light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 1, -1), self.scene);

        // Add and manipulate meshes in the scene
        var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {
            diameter: 2
        }, self.scene);

        return self.scene;
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