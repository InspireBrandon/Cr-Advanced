// ////////////////////////////////////////////////////////////////////////////////////////////////////
// Purpose: A base class to handle the various side images of space plan items
// Author: Brandon Lange
// Date: 2020-04-21
// ////////////////////////////////////////////////////////////////////////////////////////////////////

const sides = ['front', 'back', 'top', 'bottom', 'left', 'right'];

class SideHelper {
    constructor(params) {
        let self = this;

        self.color = new SideItem(params, 'Color', params.color);
        self.transparent = new SideItem(params, 'Transparent', params.transparent);
        self.image = new SideItem(params, 'ImageID', params.image);
        self.mirrored = new SideItem(params, 'Mirrored', false);
    }
}

class SideItem {
    constructor(params, key, falloverValue) {
        let self = this;

        self.front = null;
        self.back = null;
        self.top = null;
        self.bottom = null;
        self.left = null;
        self.right = null;

        let containsValues = false;

        sides.forEach(side => {
            let value = params[side + key];

            if(value != undefined && value != null) {
                self[side] = value;
                containsValues = true;
            } 
        });

        if(!containsValues) {
            self["front" + key] = falloverValue;
        }
    }
}

export default SideHelper;