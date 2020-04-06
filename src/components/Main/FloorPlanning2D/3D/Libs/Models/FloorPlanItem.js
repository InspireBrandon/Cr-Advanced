// ////////////////////////////////////////////////////////////////////////////////////////////////////
// Purpose: A common class to use as a base for 3D floor planning
// Date: 2020-04-02
// Author: Brandon Lange
// ////////////////////////////////////////////////////////////////////////////////////////////////////

class FloorPlanItem {
    constructor(params) {
        let self = this;
        
        // Identifiers
        self.name = params.name;
        self.type = params.type;

        // Coordinates
        self.x = params.x;
        self.y = params.y;
        
        // Dimensions
        self.height = params.height == 0 ? 0.1 : params.height;
        self.width = params.width == 0 ? 0.1 : params.width;
        self.depth = params.depth == 0 ? 0.1 : params.depth;

        // Rotation
        self.rotation = params.rotation;

        // Parent Information
        self.parent = params.parent;
    }
}

export default FloorPlanItem;