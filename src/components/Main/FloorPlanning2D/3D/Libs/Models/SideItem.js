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

    switchSides() {
        let self = this;

        let tmpFront = self.front;
        self.front = self.back;
        self.back = tmpFront;
    }

    rotate() {
        let self = this;

        let tmpObj = {
            front: self.front,
            back: self.back,
            left: self.left,
            right: self.right,
            bottom: self.bottom,
            top: self.top
        }

        self.front = tmpObj.right;
        self.back = tmpObj.left;
        self.left = tmpObj.front;
        self.right = tmpObj.back;
    }
}

export default SideItem;