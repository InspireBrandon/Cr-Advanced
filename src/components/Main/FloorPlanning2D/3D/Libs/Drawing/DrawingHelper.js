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
import Pegboard from './Pegboard.js'

// Renderings
import Rendering_LabelHolder from './Renderings/LabelHolder.js';
import Rendering_SideFace from './Renderings/SideFace.js';
import Rendering_ShelfEdge from './Renderings/ShelfEdge.js';

// Models
import FloorPlanItem from "../Models/FloorPlanItem.js";

class DrawingHelper {
    constructor(scene) {
        let self = this;
        self.scene = scene;
    }

    draw(drop, shadowGenerator, allItems) {
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
                fixture = new Pegboard(params);
            }break;
            case "LABELHOLDER": {
                if(params.data.parent.data.type == "PEGBOARD") {
                    fixture = new Shelf(params);
                } else {
                    fixture = new Rendering_LabelHolder(params);
                }
            }break;
            // case "SIDE": {
            //     fixture = new Rendering_SideFace(params);
            // }break;
            case "BASKET": {
                fixture = new Basket(params);
            }break;
            case "SHELFEDGE": {
                fixture = new Rendering_ShelfEdge(params);
            }break;
            case "BACK": {
                fixture = new Rendering_ShelfEdge(params);
            }break;
            // case "FRONT": {
            //     fixture = new Rendering_ShelfEdge(params);
            // }break;
        }

        if(fixture != undefined && fixture != null) {
            fixture.draw();
            shadowGenerator.addShadowCaster(fixture.element)

            let children = allItems.filter(e => {
                return e.parent_ID == params.data.id;
            })

            children.forEach(child => {
                let fpI = new FloorPlanItem(child, fixture);
                self.draw(fpI, shadowGenerator, allItems) 
            });
        } else {
            console.warn(`[DRAWING-HELPER] Failed to draw fixture. Type of ${drop.type} is not defined.`);
        }
    }
}

export default DrawingHelper;