// ////////////////////////////////////////////////////////////////////////////////////////////////////
// Purpose: A helper class to assist in the drawing of all 3D elements
// Author: Brandon Lange
// Date: 2020-04-01
// ////////////////////////////////////////////////////////////////////////////////////////////////////

import Gondola from './Gondola.js'

class DrawingHelper {
    constructor(scene) {
        let self = this;
        self.scene = scene;
    }

    draw(drop) {
        let self = this;

        let gondola = new Gondola({
            scene: self.scene,
            name: 'Gondola',
            data: drop
        })

        gondola.draw();
    }
}

export default DrawingHelper;