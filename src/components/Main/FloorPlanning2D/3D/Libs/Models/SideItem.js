// ////////////////////////////////////////////////////////////////////////////////////////////////////
// Purpose: A common class to use as whenever there are side details
// Date: 2020-04-17
// Author: Brandon Lange
// ////////////////////////////////////////////////////////////////////////////////////////////////////

class SideItem {
    constructor(params) {
        let self = this;
        self.front = params.front;
        self.back = params.back;
        self.left = params.left;
        self.right = params.right;
        self.bottom = params.bottom;
        self.top = params.top;
    }
}

export default SideItem;