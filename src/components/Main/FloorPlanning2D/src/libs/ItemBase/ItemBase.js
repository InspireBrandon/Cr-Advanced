import Konva from 'konva';
class ItemBase {
    constructor(data) {
        this.ratio = 10;
        this.MasterGroup = data.group;
        this.stage = data.stage;
        this.layer = data.layer;
        this.width = data.width * this.ratio;
        this.height = data.height * this.ratio;
    }
}

export default ItemBase;