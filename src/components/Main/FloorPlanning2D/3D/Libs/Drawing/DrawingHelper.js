// ////////////////////////////////////////////////////////////////////////////////////////////////////
// Purpose: A helper class to assist in the drawing of all 3D elements
// Author: Brandon Lange
// Date: 2020-04-01
// ////////////////////////////////////////////////////////////////////////////////////////////////////

// Fixtures
import Base from './Base.js'
import Basket from './Basket.js'
import Gondola from './Gondola.js'
import Obstruction from './Obstruction.js'
import Shelf from './Shelf.js'

// Renderings
import Rendering_LabelHolder from './Renderings/LabelHolder';

class DrawingHelper {
    constructor(scene) {
        let self = this;
        self.scene = scene;
    }

    draw(drop, shadowGenerator) {
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
            case "OBSTRUCTION": {
                fixture = new Obstruction(params);
            }break;
            case "BASE": {
                fixture = new Base(params);
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
            case "LABELHOLDER": {
                fixture = new Rendering_LabelHolder(params);
            }break;
            case "SIDE": {
                fixture = new Shelf(params);
            }break;
            case "BASKET": {
                fixture = new Basket(params);
            }break;
        }

        if(fixture != undefined && fixture != null) {
            fixture.draw();
            shadowGenerator.addShadowCaster(fixture.element)
        } else {
            console.warn(`[DRAWING-HELPER] Failed to draw fixture. Type of ${drop.type} is not defined.`);
        }
    }
}

export default DrawingHelper;