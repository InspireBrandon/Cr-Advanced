class TreeItem {
    constructor(data) {
        let self = this;
        self.KonvaID=data.KonvaID
        self.name = data.name;
        self.selected=data.selected;
        self.children=data.children;
        self.showEditName=data.showEditName;
        self.showChildren=data.showChildren;
        self.visible=data.visible;
        self.drawType=data.drawType;
    }
} 

export default TreeItem;