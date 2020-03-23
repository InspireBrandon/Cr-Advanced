// ////////////////////////////////////////////////////////////////////////////////////////////////////
// Purpose: A general helper to assist in the drawing of the 3D layers
// Author: Brandon Lange
// Date: 2020-03-23
// ////////////////////////////////////////////////////////////////////////////////////////////////////

import * as BABYLON from "@babylonjs/core/Legacy/legacy";
import Axios from 'axios';

class ShelfBuilder {
    constructor(scene, element) {
        this.scene = scene;
        this.element = element;
    }

    init() {
        let self = this;

        self.build(self.element);

        self.getChildrenByParentID(self.element.parentID, children => {
            children.forEach(child => {
                self.build(child);
            });
        })
    }

    getChildrenByParentID(parentID, callback) {
        let self = this;

        Axios.get(process.env.VUE_APP_API + `FloorplanFixture?parentID=${parentID}`)
            .then(r => {
                callback(r.data);
            })
            .catch(e => {
                alert("Failed to get floorplan fixtures");
            })
    }

    build(element) {
        let self = this;

        switch(element.type) {
            case 'GONDOLA': {
            }break;
            case 'BASE': {
            }break;
            case 'SHELF': {

            }break;
            case 'LABELHOLDER': {

            }break;
            case 'BASKET': {

            }break;
            case 'PEGBOARD': {

            }break;
        }
    }
}

export default ShelfBuilder;