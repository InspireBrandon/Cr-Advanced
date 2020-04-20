// ////////////////////////////////////////////////////////////////////////////////////////////////////
// Purpose: A common class to use as a base for 3D floor planning
// Date: 2020-04-02
// Author: Brandon Lange
// ////////////////////////////////////////////////////////////////////////////////////////////////////

import SideItem from './SideItem.js'

class FloorPlanItem {
    constructor(params, parent) {
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
        self.parent = parent;

        // Colors
        self.color = new SideItem({
            front: params.frontColor,
            back: params.backColor,
            left: params.leftColor,
            right: params.rightColor,
            bottom: params.bottomColor,
            top: params.topColor
        });

        // Images
        self.imageID = new SideItem({
            front: params.frontImageID,
            back: params.backImageID,
            left: params.leftImageID,
            right: params.rightImageID,
            bottom: params.bottomImageID,
            top: params.topImageID
        });

        // Transparency
        self.transparency = new SideItem({
            front: params.frontTransparent,
            back: params.backTransparent,
            left: params.leftTransparent,
            right: params.rightTransparent,
            bottom: params.bottomTransparent,
            top: params.topTransparent
        });

        // Mirrored
        self.mirrored = new SideItem({
            front: params.frontMirrored,
            back: params.backMirrored,
            left: params.leftMirrored,
            right: params.rightMirrored,
            bottom: params.bottomMirrored,
            top: params.topMirrored
        });
        
        // Offsets
        self.offset = {
            x: params.xOffset,
            y: params.yOffset,
            z: params.zOffset
        }
    }
}

export default FloorPlanItem;