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
        self.locked=data.locked;
        if(data.collapsed==null||data.collapsed==undefined){
            self.collapsed=false;
        }else{
            self.collapsed=data.collapsed;

        }
    }
} 

export default TreeItem;