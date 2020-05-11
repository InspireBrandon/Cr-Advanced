// ////////////////////////////////////////////////////////////////////////////////////////////////////
// Purpose: A general helper to assist in the drawing of 3D shelfs
// Author: Brandon Lange
// Date: 2020-03-23
// ////////////////////////////////////////////////////////////////////////////////////////////////////

import * as BABYLON from "@babylonjs/core/Legacy/legacy";

import Boxbase from './Boxbase.js'

class Shelf extends Boxbase {
    constructor(params) {
        super(params)

        console.log("SHELF", params);
    }
}

export default Shelf;