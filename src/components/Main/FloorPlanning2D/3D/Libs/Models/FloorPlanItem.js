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

        // Coordinates
        self.x = params.x;
        self.y = params.y;
        
        // Dimensions
        self.height = params.height;
        self.width = params.width;
        self.depth = params.depth;
    }
}

export default FloorPlanItem;