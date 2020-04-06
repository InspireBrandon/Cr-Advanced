// ////////////////////////////////////////////////////////////////////////////////////////////////////
// Purpose: A helper class to assist in the drawing of all 3D elements
// Author: Brandon Lange
// Date: 2020-04-01
// ////////////////////////////////////////////////////////////////////////////////////////////////////

import Gondola from './Gondola.js'
import Shelf from './Shelf.js'

class DrawingHelper {
    constructor(scene) {
        let self = this;
        self.scene = scene;
    }

    draw(drop) {
        let self = this;

        let fixture;

        let params = {
            scene: self.scene, 
            data: drop
        }

        switch(drop.type.toUpperCase()) {
            case "GONDOLA": {
                fixture = new Gondola(params);
            }break;
            case "BASE": {
                fixture = new Shelf(params);
            }break;
            case "SHELF": {
                fixture = new Shelf(params);
            }break;
            case "PEGBAR": {
                fixture = new Shelf(params);
            }break;
            case "PEGBOARD": {
                fixture = new Shelf(params);
            }break;
        }

        if(fixture != undefined && fixture != null) {
            fixture.draw();
        } else {
            console.warn(`[DRAWING-HELPER] Failed to draw fixture. Type of ${drop.type} is not defined.`);
        }
    }
}

export default DrawingHelper;