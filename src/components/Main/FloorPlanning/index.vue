<template>
    <div>
        <canvas id="renderCanvas" touch-action="none"></canvas>
    </div>
</template>

<script src="https://preview.babylonjs.com/babylon.js"></script>
<script src="https://preview.babylonjs.com/loaders/babylonjs.loaders.min.js"></script>
<script src="https://code.jquery.com/pep/0.4.3/pep.js"></script>

<script>
    import SceneLib from "@/components/Main/FloorPlanning/BaseLibs/Scene/Scene.js";
    export default {
        data() {
            return {
                sceneObj: null,
            }
        },
        mounted() {
            let self = this;
            self.sceneObj = new SceneLib();
            self.sceneObj.createScene();
            self.sceneObj.registerEvents();
        }
    }
</script>

<style>
    html,
    body {
        overflow: hidden;
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
    }

    #renderCanvas {
        width: 100%;
        height: 100%;
        touch-action: none;
    }
</style>